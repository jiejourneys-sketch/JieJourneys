import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'planner-images'
const MAX_INDEX = 1_000_000
const MIN_SECRET_LENGTH = 24

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-planner-admin-token',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

type StoredImage = {
  id: string
  book_id: string
  place_id: string
  storage_path: string
  width: number
  height: number
  bytes: number
  created_at: string
  deleted_at: string | null
}

type PlannerBook = {
  id: string
  read_token: string | null
  city: string
  created_at: string
  updated_at: string
  expires_at: string | null
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'private, no-store',
      'Content-Type': 'application/json',
    },
  })
}

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder()
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)
  if (leftBytes.length !== rightBytes.length) return false

  let mismatch = 0
  for (let index = 0; index < leftBytes.length; index += 1) {
    mismatch |= leftBytes[index] ^ rightBytes[index]
  }
  return mismatch === 0
}

function hasAdminAccess(request: Request, expectedSecret: string) {
  const receivedSecret = request.headers.get('x-planner-admin-token')?.trim() ?? ''
  return receivedSecret.length >= MIN_SECRET_LENGTH && constantTimeEqual(receivedSecret, expectedSecret)
}

function requestedIndex(request: Request) {
  const raw = new URL(request.url).searchParams.get('index') ?? '0'
  const value = Number(raw)
  return Number.isInteger(value) && value >= 0 && value <= MAX_INDEX ? value : null
}

async function listPlannerLinks(supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const [{ data: owned, error: ownedError }, { data: referenced, error: referencedError }] = await Promise.all([
    supabase.from('pass_planner_images').select('book_id').is('deleted_at', null).limit(5000),
    supabase.from('pass_planner_image_references').select('book_id').limit(5000),
  ])
  if (ownedError || referencedError) return null

  const imageCounts = new Map<string, number>()
  for (const row of [...(owned ?? []), ...(referenced ?? [])]) {
    if (typeof row.book_id !== 'string') continue
    imageCounts.set(row.book_id, (imageCounts.get(row.book_id) ?? 0) + 1)
  }
  const bookIds = [...imageCounts.keys()]
  if (bookIds.length === 0) return []

  const { data: books, error: booksError } = await supabase
    .from('pass_planner_books')
    .select('id, read_token, city, created_at, updated_at, expires_at')
    .in('id', bookIds)
    .gt('expires_at', new Date().toISOString())
    .order('updated_at', { ascending: false })
    .limit(1000)
  if (booksError) return null

  return ((books ?? []) as PlannerBook[]).flatMap((book) => {
    if (!book.read_token) return []
    return [{
      bookId: book.id,
      readToken: book.read_token,
      city: book.city,
      imageCount: imageCounts.get(book.id) ?? 0,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
      expiresAt: book.expires_at,
    }]
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405)

  const expectedSecret = Deno.env.get('PLANNER_IMAGE_OVERVIEW_SECRET')?.trim() ?? ''
  if (expectedSecret.length < MIN_SECRET_LENGTH) return json({ error: 'server_not_configured' }, 503)
  if (!hasAdminAccess(request, expectedSecret)) return json({ error: 'unauthorized' }, 401)

  const index = requestedIndex(request)
  if (index === null) return json({ error: 'invalid_index' }, 400)

  const supabase = adminClient()
  if (!supabase) return json({ error: 'server_not_configured' }, 503)

  if (new URL(request.url).searchParams.get('mode') === 'planners') {
    const planners = await listPlannerLinks(supabase)
    return planners ? json({ planners }) : json({ error: 'load_failed' }, 503)
  }

  const { data, error, count } = await supabase
    .from('pass_planner_images')
    .select('id, book_id, place_id, storage_path, width, height, bytes, created_at, deleted_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(index, index)

  if (error) return json({ error: 'load_failed' }, 503)

  const total = count ?? 0
  if (total === 0) return json({ image: null, index: 0, total: 0 })
  if (!data?.[0]) return json({ error: 'out_of_range', total }, 416)

  const row = data[0] as StoredImage
  const { data: book } = await supabase
    .from('pass_planner_books')
    .select('read_token, expires_at')
    .eq('id', row.book_id)
    .maybeSingle()
  const { data: signed, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(row.storage_path, 60 * 60)

  if (signedError || !signed?.signedUrl) return json({ error: 'sign_failed' }, 503)

  return json({
    index,
    total,
    image: {
      id: row.id,
      bookId: row.book_id,
      placeId: row.place_id,
      storagePath: row.storage_path,
      width: row.width,
      height: row.height,
      bytes: row.bytes,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
      readToken: typeof book?.read_token === 'string' ? book.read_token : null,
      bookExpiresAt: typeof book?.expires_at === 'string' ? book.expires_at : null,
      url: signed.signedUrl,
    },
  })
})
