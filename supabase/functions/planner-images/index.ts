import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'planner-images'
const MAX_OWN_IMAGES_PER_BOOK = 12
const MAX_VISIBLE_IMAGES_PER_BOOK = 30
const MAX_IMAGES_PER_PLACE = 3
const MAX_BYTES = 600 * 1024
const MAX_UPLOAD_BYTES = 700 * 1024
const EDIT_TOKEN_PATTERN = /^[a-f0-9]{64}$/
const LEGACY_OWNER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{24,96}$/
const BOOK_ID_PATTERN = /^[A-Za-z0-9]{4,32}$/
const PLACE_ID_PATTERN = /^[A-Za-z0-9:_-]{1,120}$/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-planner-edit-token, x-planner-image-token',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
  deleted_at?: string | null
}

type ImageReference = {
  image_id: string
  place_id: string
}

type VisibleImage = StoredImage & { place_id: string }

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

function editToken(request: Request) {
  const token = request.headers.get('x-planner-edit-token')?.trim() ?? ''
  return EDIT_TOKEN_PATTERN.test(token) ? token : ''
}

function legacyOwnerToken(request: Request) {
  const token = request.headers.get('x-planner-image-token')?.trim() ?? ''
  return LEGACY_OWNER_TOKEN_PATTERN.test(token) ? token : ''
}

function newLegacyOwnerToken() {
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
    .select('id, expires_at, read_token, edit_token, is_template, allow_legacy_image_owner')
    .eq('id', bookId)
    .maybeSingle()
  if (error || !data?.id) return null
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return null
  return data
}

async function hasEditAccess(
  supabase: NonNullable<ReturnType<typeof adminClient>>,
  bookId: string,
  token: string,
) {
  if (!token) return false
  const { data } = await supabase
    .from('pass_planner_books')
    .select('id')
    .eq('id', bookId)
    .eq('edit_token', token)
    .maybeSingle()
  return Boolean(data?.id)
}

async function hasLegacyOwnerAccess(
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

async function hasWriteAccess(
  supabase: NonNullable<ReturnType<typeof adminClient>>,
  bookId: string,
  request: Request,
) {
  if (await hasEditAccess(supabase, bookId, editToken(request))) return true
  const { data: legacyAllowedBook } = await supabase
    .from('pass_planner_books')
    .select('id')
    .eq('id', bookId)
    .eq('allow_legacy_image_owner', true)
    .maybeSingle()
  if (!legacyAllowedBook?.id) return false
  return hasLegacyOwnerAccess(supabase, bookId, legacyOwnerToken(request))
}

async function visibleImages(supabase: NonNullable<ReturnType<typeof adminClient>>, bookId: string) {
  const { data: owned, error: ownedError } = await supabase
    .from('pass_planner_images')
    .select('id, book_id, place_id, storage_path, width, height, bytes, created_at, deleted_at')
    .eq('book_id', bookId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (ownedError) return null

  const { data: references, error: referenceError } = await supabase
    .from('pass_planner_image_references')
    .select('image_id, place_id')
    .eq('book_id', bookId)
  if (referenceError) return null

  const refRows = (references ?? []) as ImageReference[]
  const referenceIds = [...new Set(refRows.map((reference) => reference.image_id))]
  let referencedAssets: StoredImage[] = []
  if (referenceIds.length > 0) {
    const { data, error } = await supabase
      .from('pass_planner_images')
      .select('id, book_id, place_id, storage_path, width, height, bytes, created_at, deleted_at')
      .in('id', referenceIds)
    if (error) return null
    referencedAssets = (data ?? []) as StoredImage[]
  }

  const assetsById = new Map(referencedAssets.map((image) => [image.id, image]))
  const ownRows = ((owned ?? []) as StoredImage[]).map((image) => ({ ...image }))
  const referencedRows = refRows.flatMap((reference) => {
    const asset = assetsById.get(reference.image_id)
    return asset ? [{ ...asset, place_id: reference.place_id }] : []
  })
  return [...ownRows, ...referencedRows].sort((a, b) => a.created_at.localeCompare(b.created_at)) as VisibleImage[]
}

async function signedImages(supabase: NonNullable<ReturnType<typeof adminClient>>, bookId: string) {
  const rows = await visibleImages(supabase, bookId)
  if (!rows) return null
  if (rows.length === 0) return []
  const uniquePaths = [...new Set(rows.map((row) => row.storage_path))]
  const { data: signed, error: signedError } = await supabase.storage.from(BUCKET).createSignedUrls(uniquePaths, 60 * 60)
  if (signedError || !signed) return null
  const urls = new Map(signed.map((item) => [item.path, item.signedUrl]))
  return rows.flatMap((row) => {
    const url = urls.get(row.storage_path)
    return url
      ? [{ id: row.id, placeId: row.place_id, url, width: row.width, height: row.height, createdAt: row.created_at }]
      : []
  })
}

async function cleanupDeletedAsset(supabase: NonNullable<ReturnType<typeof adminClient>>, imageId: string) {
  const { data: image } = await supabase
    .from('pass_planner_images')
    .select('id, storage_path, deleted_at')
    .eq('id', imageId)
    .maybeSingle()
  if (!image?.id || !image.deleted_at) return
  const { count } = await supabase
    .from('pass_planner_image_references')
    .select('image_id', { count: 'exact', head: true })
    .eq('image_id', imageId)
  if ((count ?? 0) > 0) return
  await supabase.storage.from(BUCKET).remove([image.storage_path])
  await supabase.from('pass_planner_images').delete().eq('id', imageId)
}

// A referenced source image is soft-deleted so old copied planners keep their
// snapshot. The next image mutation also clears any soft-deleted assets whose
// final reference has disappeared (including references removed by a deleted
// planner), so retained snapshots do not become permanent storage leaks.
async function cleanupOrphanedDeletedAssets(supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const { data } = await supabase
    .from('pass_planner_images')
    .select('id, storage_path')
    .not('deleted_at', 'is', null)
    .limit(50)
  for (const image of data ?? []) {
    const { count } = await supabase
      .from('pass_planner_image_references')
      .select('image_id', { count: 'exact', head: true })
      .eq('image_id', image.id)
    if ((count ?? 0) > 0) continue
    await supabase.storage.from(BUCKET).remove([image.storage_path])
    await supabase.from('pass_planner_images').delete().eq('id', image.id)
  }
}

async function readImages(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const readToken = new URL(request.url).searchParams.get('v')?.trim() ?? ''
  if (!readToken) return json({ error: 'missing_view_access' }, 400)
  const { data: book } = await supabase
    .from('pass_planner_books')
    .select('id, expires_at')
    .eq('read_token', readToken)
    .maybeSingle()
  if (!book?.id || (book.expires_at && new Date(book.expires_at).getTime() < Date.now())) {
    return json({ error: 'not_found' }, 404)
  }
  const images = await signedImages(supabase, book.id)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

// Existing browser sessions call this once when a pre-security planner first
// receives an image. Keep it during rollout so older published JS keeps
// working; the new app uses the stronger book edit token instead.
async function claimLegacyOwner(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const bookId = cleanBookId(body?.bookId)
  if (!bookId) return json({ error: 'invalid_book' }, 400)
  const book = await validBook(supabase, bookId)
  if (!book) return json({ error: 'not_found' }, 404)
  if (!book.allow_legacy_image_owner) return json({ error: 'edit_required' }, 403)
  const token = newLegacyOwnerToken()
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
  if (!(await hasWriteAccess(supabase, bookId, request))) return json({ error: 'edit_required' }, 403)

  const book = await validBook(supabase, bookId)
  if (!book) return json({ error: 'not_found' }, 404)
  const existing = await visibleImages(supabase, bookId)
  if (!existing) return json({ error: 'load_failed' }, 503)
  const ownCount = existing.filter((image) => image.book_id === bookId).length
  const placeCount = existing.filter((image) => image.place_id === placeId).length
  if (
    ownCount >= (book.is_template ? MAX_VISIBLE_IMAGES_PER_BOOK : MAX_OWN_IMAGES_PER_BOOK) ||
    existing.length >= MAX_VISIBLE_IMAGES_PER_BOOK ||
    placeCount >= MAX_IMAGES_PER_PLACE
  ) {
    return json({
      error: 'image_limit_reached',
      limits: { own: MAX_OWN_IMAGES_PER_BOOK, visible: MAX_VISIBLE_IMAGES_PER_BOOK, per_place: MAX_IMAGES_PER_PLACE },
    }, 409)
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!isJpeg(bytes)) return json({ error: 'invalid_image' }, 400)
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
  if (!(await hasWriteAccess(supabase, bookId, request))) return json({ error: 'edit_required' }, 403)

  const { data: reference } = await supabase
    .from('pass_planner_image_references')
    .select('image_id')
    .eq('book_id', bookId)
    .eq('image_id', imageId)
    .maybeSingle()
  if (reference?.image_id) {
    const { error } = await supabase
      .from('pass_planner_image_references')
      .delete()
      .eq('book_id', bookId)
      .eq('image_id', imageId)
    if (error) return json({ error: 'delete_failed' }, 503)
    await cleanupDeletedAsset(supabase, imageId)
    await cleanupOrphanedDeletedAssets(supabase)
    const images = await signedImages(supabase, bookId)
    return images ? json({ images }) : json({ error: 'load_failed' }, 503)
  }

  const { data: image } = await supabase
    .from('pass_planner_images')
    .select('id, storage_path')
    .eq('id', imageId)
    .eq('book_id', bookId)
    .is('deleted_at', null)
    .maybeSingle()
  if (!image?.id) return json({ error: 'not_found' }, 404)

  const { count: references } = await supabase
    .from('pass_planner_image_references')
    .select('image_id', { count: 'exact', head: true })
    .eq('image_id', imageId)
  if ((references ?? 0) > 0) {
    const { error } = await supabase.from('pass_planner_images').update({ deleted_at: new Date().toISOString() }).eq('id', imageId)
    if (error) return json({ error: 'delete_failed' }, 503)
  } else {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([image.storage_path])
    if (storageError) return json({ error: 'delete_failed' }, 503)
    const { error } = await supabase.from('pass_planner_images').delete().eq('id', imageId)
    if (error) return json({ error: 'delete_failed' }, 503)
  }
  await cleanupOrphanedDeletedAssets(supabase)
  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

async function moveImage(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const bookId = cleanBookId(body?.bookId)
  const imageId = typeof body?.imageId === 'string' ? body.imageId.trim() : ''
  const placeId = cleanPlaceId(body?.placeId)
  if (!bookId || !/^[0-9a-f-]{36}$/i.test(imageId) || !placeId) return json({ error: 'invalid_move' }, 400)
  if (!(await hasWriteAccess(supabase, bookId, request))) return json({ error: 'edit_required' }, 403)

  const existing = await visibleImages(supabase, bookId)
  if (!existing) return json({ error: 'load_failed' }, 503)
  const image = existing.find((item) => item.id === imageId)
  if (!image) return json({ error: 'not_found' }, 404)
  if (image.place_id !== placeId && existing.filter((item) => item.place_id === placeId).length >= MAX_IMAGES_PER_PLACE) {
    return json({ error: 'image_limit_reached' }, 409)
  }
  if (image.place_id !== placeId) {
    const isReference = image.book_id !== bookId
    const update = isReference
      ? supabase.from('pass_planner_image_references').update({ place_id: placeId }).eq('book_id', bookId).eq('image_id', imageId)
      : supabase.from('pass_planner_images').update({ place_id: placeId }).eq('id', imageId).eq('book_id', bookId)
    const { error } = await update
    if (error) return json({ error: 'move_failed' }, 503)
  }
  const images = await signedImages(supabase, bookId)
  return images ? json({ images }) : json({ error: 'load_failed' }, 503)
}

async function copyImages(request: Request, supabase: NonNullable<ReturnType<typeof adminClient>>) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const targetBookId = cleanBookId(body?.targetBookId)
  const sourceReadToken = typeof body?.sourceReadToken === 'string' ? body.sourceReadToken.trim() : ''
  if (!targetBookId || !sourceReadToken) return json({ error: 'invalid_copy' }, 400)
  if (!(await hasWriteAccess(supabase, targetBookId, request))) return json({ error: 'edit_required' }, 403)

  const { data: sourceBook } = await supabase
    .from('pass_planner_books')
    .select('id, expires_at')
    .eq('read_token', sourceReadToken)
    .maybeSingle()
  if (!sourceBook?.id || (sourceBook.expires_at && new Date(sourceBook.expires_at).getTime() < Date.now())) {
    return json({ error: 'source_not_found' }, 404)
  }

  const targetImages = await visibleImages(supabase, targetBookId)
  if (!targetImages) return json({ error: 'copy_failed' }, 503)
  if (targetImages.length > 0) {
    const images = await signedImages(supabase, targetBookId)
    return images ? json({ images }) : json({ error: 'copy_failed' }, 503)
  }
  const sourceImages = await visibleImages(supabase, sourceBook.id)
  if (!sourceImages) return json({ error: 'copy_failed' }, 503)
  if (sourceImages.length === 0) return json({ images: [] })

  const { error } = await supabase.from('pass_planner_image_references').insert(
    sourceImages.map((image) => ({ book_id: targetBookId, image_id: image.id, place_id: image.place_id })),
  )
  if (error) return json({ error: 'copy_failed' }, 503)
  const images = await signedImages(supabase, targetBookId)
  return images ? json({ images }) : json({ error: 'copy_failed' }, 503)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const supabase = adminClient()
  if (!supabase) return json({ error: 'server_not_configured' }, 503)
  if (request.method === 'GET') return readImages(request, supabase)

  const action = new URL(request.url).searchParams.get('action')
  if (request.method === 'POST' && action === 'claim') return claimLegacyOwner(request, supabase)
  if (request.method === 'POST' && action === 'upload') return uploadImage(request, supabase)
  if (request.method === 'POST' && action === 'copy') return copyImages(request, supabase)
  if (request.method === 'POST' && action === 'move') return moveImage(request, supabase)
  if (request.method === 'DELETE') return deleteImage(request, supabase)
  return json({ error: 'method_not_allowed' }, 405)
})
