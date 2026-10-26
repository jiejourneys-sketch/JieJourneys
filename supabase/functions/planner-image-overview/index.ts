import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'planner-images'
const MAX_INDEX = 1_000_000
const MIN_SECRET_LENGTH = 24
const IMAGE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const BOOK_ID_PATTERN = /^[A-Za-z0-9]{4,32}$/

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

function requestedImageId(request: Request) {
  const raw = new URL(request.url).searchParams.get('image')
  if (raw === null) return ''
  const value = raw.trim()
  return IMAGE_ID_PATTERN.test(value) ? value : null
}

function requestedBookId(request: Request) {
  const raw = new URL(request.url).searchParams.get('book')
  if (raw === null) return ''
  const value = raw.trim()
  return BOOK_ID_PATTERN.test(value) ? value : null
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405)

  const expectedSecret = Deno.env.get('PLANNER_IMAGE_OVERVIEW_SECRET')?.trim() ?? ''
  if (expectedSecret.length < MIN_SECRET_LENGTH) return json({ error: 'server_not_configured' }, 503)
  if (!hasAdminAccess(request, expectedSecret)) return json({ error: 'unauthorized' }, 401)

  const index = requestedIndex(request)
  if (index === null) return json({ error: 'invalid_index' }, 400)
  const imageId = requestedImageId(request)
  if (imageId === null) return json({ error: 'invalid_image_id' }, 400)
  const bookId = requestedBookId(request)
  if (bookId === null) return json({ error: 'invalid_book_id' }, 400)

  const supabase = adminClient()
  if (!supabase) return json({ error: 'server_not_configured' }, 503)

  let row: StoredImage | null = null
  let resolvedIndex = index
  let total = 0

  if (imageId) {
    let imageQuery = supabase
      .from('pass_planner_images')
      .select('id, book_id, place_id, storage_path, width, height, bytes, created_at, deleted_at')
      .eq('id', imageId)
    if (bookId) imageQuery = imageQuery.eq('book_id', bookId)
    const { data, error } = await imageQuery.maybeSingle()
    if (error) return json({ error: 'load_failed' }, 503)
    if (!data) return json({ error: 'image_not_found' }, 404)
    row = data as StoredImage

    let totalQuery = supabase.from('pass_planner_images').select('id', { count: 'exact', head: true })
    let newerQuery = supabase
      .from('pass_planner_images')
      .select('id', { count: 'exact', head: true })
      .gt('created_at', row.created_at)
    let sameTimeQuery = supabase
      .from('pass_planner_images')
      .select('id', { count: 'exact', head: true })
      .eq('created_at', row.created_at)
      .gt('id', row.id)
    if (bookId) {
      totalQuery = totalQuery.eq('book_id', bookId)
      newerQuery = newerQuery.eq('book_id', bookId)
      sameTimeQuery = sameTimeQuery.eq('book_id', bookId)
    }
    const [totalResult, newerResult, sameTimeResult] = await Promise.all([
      totalQuery,
      newerQuery,
      sameTimeQuery,
    ])
    if (totalResult.error || newerResult.error || sameTimeResult.error) return json({ error: 'load_failed' }, 503)
    total = totalResult.count ?? 0
    resolvedIndex = (newerResult.count ?? 0) + (sameTimeResult.count ?? 0)
  } else {
    let imageQuery = supabase
      .from('pass_planner_images')
      .select('id, book_id, place_id, storage_path, width, height, bytes, created_at, deleted_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
    if (bookId) imageQuery = imageQuery.eq('book_id', bookId)
    const { data, error, count } = await imageQuery.range(index, index)

    if (error) return json({ error: 'load_failed' }, 503)
    total = count ?? 0
    if (total === 0) return json({ image: null, index: 0, total: 0 })
    if (!data?.[0]) return json({ error: 'out_of_range', total }, 416)
    row = data[0] as StoredImage
  }

  const { data: book } = await supabase
    .from('pass_planner_books')
    .select('admin_view_url')
    .eq('id', row.book_id)
    .maybeSingle()
  const { data: signed, error: signedError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(row.storage_path, 60 * 60)

  if (signedError || !signed?.signedUrl) return json({ error: 'sign_failed' }, 503)

  return json({
    index: resolvedIndex,
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
      plannerUrl: typeof book?.admin_view_url === 'string' ? book.admin_view_url : null,
      url: signed.signedUrl,
    },
  })
})
