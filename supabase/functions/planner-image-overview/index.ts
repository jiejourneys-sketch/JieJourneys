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
      url: signed.signedUrl,
    },
  })
})
