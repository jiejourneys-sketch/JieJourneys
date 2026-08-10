import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'planner-images'
const MAX_IMAGES_PER_BOOK = 24
const MAX_IMAGES_PER_PLACE = 3
const MAX_BYTES = 1_048_576
const MAX_UPLOAD_BYTES = 1_200_000
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{24,96}$/
const BOOK_ID_PATTERN = /^[A-Za-z0-9]{4,32}$/
const PLACE_ID_PATTERN = /^[A-Za-z0-9:_-]{1,120}$/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-planner-image-token',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

type StoredImage = {
  id: string
  place_id: string
  storage_path: string
  width: number
  height: number
  bytes: number
  created_at: string
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function cleanBookId(value: unknown) {
  const id = typeof value === 'string' ? value.trim() : ''
  return BOOK_ID_PATTERN.test(id) ? id : ''
}

function cleanPlaceId(value: unknown) {
  const id = typeof value === 'string' ? value.trim() : ''
  return PLACE_ID_PATTERN.test(id) ? id : ''
}

function ownerToken(request: Request) {
  const token = request.headers.get('x-planner-image-token')?.trim() ?? ''
  return TOKEN_PATTERN.test(token) ? token : ''
}

function newOwnerToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')
}

function isJpeg(bytes: Uint8Array) {
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
}

function maxDimension(value: unknown) {
  const numeric = typeof value === 'string' ? Number(value) : value
  return typeof numeric === 'number' && Number.isInteger(numeric) && numeric > 0 && numeric <= 1600 ? numeric : 0
}

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function validBook(supabase: NonNullable<ReturnType<typeof adminClient>>, bookId: string) {
  const { data, error } = await supabase
    .from('pass_planner_books')
    .select('id, expires_at, read_token')
    .eq('id', bookId)
    .maybeSingle()
  if (error || !data?.id) return null
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return null
  return data
}

async function hasOwnerAccess(
  supabase: NonNullable<ReturnType<typeof adminClient>>,
  bookId: string,
  token: string,
) {
  if (!token) return false
  const { data } = await supabase
    .from('pass_planner_image_owners')
    .select('book_id')
    .eq('book_id', bookId)
    .eq('owner_token', token)
    .maybeSingle()
  return Boolean(data?.book_id)
}

async function signedImages(supabase: NonNullable<ReturnType<typeof adminClient>>, bookId: string) {
  const { data, error } = await supabase
    .from('pass_planner_images')
    .select('id, place_id, storage_path, width, height, bytes, created_at')
    .eq('book_id', bookId)
    .order('created_at', { ascending: true })
  if (error) return null
  const rows = (data ?? []) as StoredImage[]
  if (rows.length === 0) return []
  const { data: signed, error: signedError } = await supabase.storage.from(BUCKET).createSignedUrls(
    rows.map((row) => row.storage_path),
    60 * 60,
  )
  if (signedError || !signed) return null
  const urls = new Map(signed.map((item) => [item.path, item.signedUrl]))
  return rows.flatMap((row) => {
    const url = urls.get(row.storage_path)
    return url
      ? [{ id: row.id, placeId: row.place_id, url, width: row.width, height: row.height, createdAt: row.created_at }]
      : []
  })
}

async function readImages(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const url = new URL(request.url)
  const bookId = cleanBookId(url.searchParams.get('bookId'))
  const readToken = url.searchParams.get('v')?.trim() ?? ''
  if (!bookId || !readToken) return json({ error: 'missing_view_access' }, 400)
  const book = await validBook(supabase, bookId)
  if (!book || book.read_token !== readToken) return json({ error: 'not_found' }, 404)
  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

async function claimOwner(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const bookId = cleanBookId(body?.bookId)
  if (!bookId) return json({ error: 'invalid_book' }, 400)
  const book = await validBook(supabase, bookId)
  if (!book) return json({ error: 'not_found' }, 404)

  const token = newOwnerToken()
  const { error } = await supabase.from('pass_planner_image_owners').insert({ book_id: bookId, owner_token: token })
  if (!error) return json({ owner_token: token })
  if (error.code === '23505') return json({ error: 'owner_already_claimed' }, 409)
  return json({ error: 'claim_failed' }, 503)
}

async function uploadImage(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_BYTES) return json({ error: 'image_too_large' }, 413)
  const form = await request.formData().catch(() => null)
  if (!form) return json({ error: 'invalid_form' }, 400)
  const bookId = cleanBookId(form.get('bookId'))
  const placeId = cleanPlaceId(form.get('placeId'))
  const width = maxDimension(form.get('width'))
  const height = maxDimension(form.get('height'))
  const file = form.get('image')
  if (!bookId || !placeId || !width || !height || !(file instanceof File)) return json({ error: 'invalid_upload' }, 400)
  if (file.type !== 'image/jpeg' || file.size <= 0 || file.size > MAX_BYTES) return json({ error: 'invalid_image' }, 400)
  const token = ownerToken(request)
  if (!(await hasOwnerAccess(supabase, bookId, token))) return json({ error: 'owner_required' }, 403)
  if (!(await validBook(supabase, bookId))) return json({ error: 'not_found' }, 404)

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!isJpeg(bytes)) return json({ error: 'invalid_image' }, 400)
  const { count: totalCount } = await supabase
    .from('pass_planner_images')
    .select('id', { count: 'exact', head: true })
    .eq('book_id', bookId)
  const { count: placeCount } = await supabase
    .from('pass_planner_images')
    .select('id', { count: 'exact', head: true })
    .eq('book_id', bookId)
    .eq('place_id', placeId)
  if ((totalCount ?? 0) >= MAX_IMAGES_PER_BOOK || (placeCount ?? 0) >= MAX_IMAGES_PER_PLACE) {
    return json({ error: 'image_limit_reached' }, 409)
  }

  const id = crypto.randomUUID()
  const storagePath = `${bookId}/${id}.jpg`
  const { error: storageError } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  })
  if (storageError) return json({ error: 'upload_failed' }, 503)
  const { error: recordError } = await supabase.from('pass_planner_images').insert({
    id,
    book_id: bookId,
    place_id: placeId,
    storage_path: storagePath,
    width,
    height,
    bytes: file.size,
  })
  if (recordError) {
    await supabase.storage.from(BUCKET).remove([storagePath])
    return json({ error: 'store_failed' }, 503)
  }
  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'sign_failed' }, 503)
}

async function deleteImage(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const bookId = cleanBookId(body?.bookId)
  const imageId = typeof body?.imageId === 'string' ? body.imageId.trim() : ''
  if (!bookId || !/^[0-9a-f-]{36}$/i.test(imageId)) return json({ error: 'invalid_image' }, 400)
  if (!(await hasOwnerAccess(supabase, bookId, ownerToken(request)))) return json({ error: 'owner_required' }, 403)
  const { data: image } = await supabase
    .from('pass_planner_images')
    .select('id, storage_path')
    .eq('id', imageId)
    .eq('book_id', bookId)
    .maybeSingle()
  if (!image) return json({ error: 'not_found' }, 404)
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([image.storage_path])
  if (storageError) return json({ error: 'delete_failed' }, 503)
  const { error: recordError } = await supabase.from('pass_planner_images').delete().eq('id', imageId).eq('book_id', bookId)
  if (recordError) return json({ error: 'delete_failed' }, 503)
  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

async function moveImage(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const bookId = cleanBookId(body?.bookId)
  const imageId = typeof body?.imageId === 'string' ? body.imageId.trim() : ''
  const placeId = cleanPlaceId(body?.placeId)
  if (!bookId || !/^[0-9a-f-]{36}$/i.test(imageId) || !placeId) return json({ error: 'invalid_move' }, 400)
  if (!(await hasOwnerAccess(supabase, bookId, ownerToken(request)))) return json({ error: 'owner_required' }, 403)
  if (!(await validBook(supabase, bookId))) return json({ error: 'not_found' }, 404)

  const { data: image } = await supabase
    .from('pass_planner_images')
    .select('id, place_id')
    .eq('id', imageId)
    .eq('book_id', bookId)
    .maybeSingle()
  if (!image) return json({ error: 'not_found' }, 404)

  if (image.place_id !== placeId) {
    const { count: placeCount } = await supabase
      .from('pass_planner_images')
      .select('id', { count: 'exact', head: true })
      .eq('book_id', bookId)
      .eq('place_id', placeId)
    if ((placeCount ?? 0) >= MAX_IMAGES_PER_PLACE) return json({ error: 'image_limit_reached' }, 409)
    const { error } = await supabase
      .from('pass_planner_images')
      .update({ place_id: placeId })
      .eq('id', imageId)
      .eq('book_id', bookId)
    if (error) return json({ error: 'move_failed' }, 503)
  }

  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

async function copyImages(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const targetBookId = cleanBookId(body?.targetBookId)
  const sourceBookId = cleanBookId(body?.sourceBookId)
  const sourceReadToken = typeof body?.sourceReadToken === 'string' ? body.sourceReadToken.trim() : ''
  if (!targetBookId || !sourceBookId || !sourceReadToken) return json({ error: 'invalid_copy' }, 400)
  if (!(await hasOwnerAccess(supabase, targetBookId, ownerToken(request)))) return json({ error: 'owner_required' }, 403)
  const sourceBook = await validBook(supabase, sourceBookId)
  if (!sourceBook || sourceBook.read_token !== sourceReadToken) return json({ error: 'source_not_found' }, 404)
  const { count: targetCount } = await supabase
    .from('pass_planner_images')
    .select('id', { count: 'exact', head: true })
    .eq('book_id', targetBookId)
  if ((targetCount ?? 0) > 0) {
    const images = await signedImages(supabase, targetBookId)
    return images ? json({ images }) : json({ error: 'copy_failed' }, 503)
  }
  const { data: sourceImages } = await supabase
    .from('pass_planner_images')
    .select('place_id, storage_path, width, height, bytes')
    .eq('book_id', sourceBookId)
    .order('created_at', { ascending: true })
    .limit(MAX_IMAGES_PER_BOOK)
  if (!sourceImages?.length) return json({ images: [] })

  for (const source of sourceImages) {
    const { data: file, error: downloadError } = await supabase.storage.from(BUCKET).download(source.storage_path)
    if (downloadError || !file) continue
    const id = crypto.randomUUID()
    const storagePath = `${targetBookId}/${id}.jpg`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    })
    if (uploadError) continue
    const { error: insertError } = await supabase.from('pass_planner_images').insert({
      id,
      book_id: targetBookId,
      place_id: source.place_id,
      storage_path: storagePath,
      width: source.width,
      height: source.height,
      bytes: source.bytes,
    })
    if (insertError) await supabase.storage.from(BUCKET).remove([storagePath])
  }
  const images = await signedImages(supabase, targetBookId)
  return images ? json({ images }) : json({ error: 'copy_failed' }, 503)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const supabase = adminClient()
  if (!supabase) return json({ error: 'server_not_configured' }, 503)
  if (request.method === 'GET') return readImages(request, supabase)

  const action = new URL(request.url).searchParams.get('action')
  if (request.method === 'POST' && action === 'claim') return claimOwner(request, supabase)
  if (request.method === 'POST' && action === 'upload') return uploadImage(request, supabase)
  if (request.method === 'POST' && action === 'copy') return copyImages(request, supabase)
  if (request.method === 'POST' && action === 'move') return moveImage(request, supabase)
  if (request.method === 'DELETE') return deleteImage(request, supabase)
  return json({ error: 'method_not_allowed' }, 405)
})
