import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TABLE = 'pass_planner_books'
const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MAX_ITEMS = 240
const MAX_NOTES = 80
const MAX_NOTE_LENGTH = 500
const MAX_CUSTOM_PLACES = 80
const MAX_LINKS_PER_CUSTOM_PLACE = 8
const MAX_USER_LINK_PLACES = 120
const MAX_USER_LINKS_PER_PLACE = 8
const PLANNER_RETENTION_DAYS = 365
const CUSTOM_PLACE_CATEGORIES = new Set(['spot', 'free', 'food', 'restaurant', 'shop', 'hotel'])

function cleanGooglePlaceTypes(value: unknown) {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => {
      if (!item || item.length > 64 || !/^[a-z0-9_]+$/.test(item) || seen.has(item)) return false
      seen.add(item)
      return true
    })
    .slice(0, 20)
}

type PlannerBookPayload = {
  id?: string
  city: string
  items: string[]
  notes?: Record<string, string>
  custom_places?: Record<string, unknown>
  user_links?: Record<string, unknown>
}

function getTripSupabase() {
  const url = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function shortId(length = 7) {
  const values = new Uint8Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => ID_ALPHABET[value % ID_ALPHABET.length]).join('')
}

function readToken() {
  return shortId(12)
}

function cleanPayload(value: unknown): PlannerBookPayload | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const id = typeof input.id === 'string' ? input.id.trim().slice(0, 32) : undefined
  const city = typeof input.city === 'string' ? input.city.trim().slice(0, 32) : ''
  const rawItems = Array.isArray(input.items) ? input.items : []
  const items = rawItems
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_ITEMS)

  const notes: Record<string, string> = {}
  const rawNotes = input.notes && typeof input.notes === 'object' ? (input.notes as Record<string, unknown>) : {}
  Object.entries(rawNotes)
    .slice(0, MAX_NOTES)
    .forEach(([key, note]) => {
      if (typeof note !== 'string') return
      const cleanKey = key.trim()
      const cleanNote = note.trim().slice(0, MAX_NOTE_LENGTH)
      if (cleanKey && cleanNote) notes[cleanKey] = cleanNote
    })

  const customPlaces: Record<string, unknown> = {}
  const rawCustomPlaces =
    input.custom_places && typeof input.custom_places === 'object' && !Array.isArray(input.custom_places)
      ? (input.custom_places as Record<string, unknown>)
      : {}
  Object.entries(rawCustomPlaces)
    .slice(0, MAX_CUSTOM_PLACES)
    .forEach(([idKey, rawPlace]) => {
      if (!rawPlace || typeof rawPlace !== 'object' || Array.isArray(rawPlace)) return
      const source = rawPlace as Record<string, unknown>
      const id = idKey.trim().slice(0, 48)
      const name = typeof source.name === 'string' ? source.name.trim().slice(0, 80) : ''
      const lat = typeof source.lat === 'number' ? source.lat : Number(source.lat)
      const lng = typeof source.lng === 'number' ? source.lng : Number(source.lng)
      if (!id || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) return
      const googleUrl = typeof source.googleUrl === 'string' ? source.googleUrl.trim().slice(0, 500) : ''
      const googlePlaceId = typeof source.googlePlaceId === 'string' ? source.googlePlaceId.trim().slice(0, 120) : ''
      const googlePlaceName = typeof source.googlePlaceName === 'string' ? source.googlePlaceName.trim().slice(0, 120) : ''
      const googlePlaceLat = typeof source.googlePlaceLat === 'number' ? source.googlePlaceLat : Number(source.googlePlaceLat)
      const googlePlaceLng = typeof source.googlePlaceLng === 'number' ? source.googlePlaceLng : Number(source.googlePlaceLng)
      const googlePlaceTypes = cleanGooglePlaceTypes(source.googlePlaceTypes)
      const googlePlaceTypesResolved = source.googlePlaceTypesResolved === true || googlePlaceTypes.length > 0
      const naverUrl = typeof source.naverUrl === 'string' ? source.naverUrl.trim().slice(0, 500) : ''
      const naverPlaceId = typeof source.naverPlaceId === 'string' ? source.naverPlaceId.trim().slice(0, 80) : ''
      const naverPlaceName = typeof source.naverPlaceName === 'string' ? source.naverPlaceName.trim().slice(0, 120) : ''
      const category = typeof source.category === 'string' && CUSTOM_PLACE_CATEGORIES.has(source.category) ? source.category : 'free'
      const hotelAffiliateManual = source.hotelAffiliateManual === true
      const links = Array.isArray(source.links)
        ? source.links
            .filter((link): link is Record<string, unknown> => Boolean(link) && typeof link === 'object' && !Array.isArray(link))
            .slice(0, MAX_LINKS_PER_CUSTOM_PLACE)
            .map((link) => ({
              label: typeof link.label === 'string' ? link.label.trim().slice(0, 40) : '',
              href: typeof link.href === 'string' ? link.href.trim().slice(0, 500) : '',
            }))
            .filter((link) => link.label && link.href)
        : []
      customPlaces[id] = {
        name,
        category,
        lat,
        lng,
        ...(googleUrl ? { googleUrl } : {}),
        ...(googlePlaceId ? { googlePlaceId } : {}),
        ...(googlePlaceName ? { googlePlaceName } : {}),
        ...(googlePlaceId && Number.isFinite(googlePlaceLat) && Number.isFinite(googlePlaceLng)
          ? { googlePlaceLat, googlePlaceLng }
          : {}),
        ...(googlePlaceTypes.length > 0 ? { googlePlaceTypes } : {}),
        ...(googlePlaceTypesResolved ? { googlePlaceTypesResolved: true } : {}),
        ...(naverUrl ? { naverUrl } : {}),
        ...(naverPlaceId ? { naverPlaceId } : {}),
        ...(naverPlaceName ? { naverPlaceName } : {}),
        ...(hotelAffiliateManual ? { hotelAffiliateManual: true } : {}),
        ...(links.length > 0 ? { links } : {}),
      }
    })

  if (!city || (items.length === 0 && Object.keys(customPlaces).length === 0)) return null

  const userLinks: Record<string, unknown> = {}
  const rawUserLinks =
    input.user_links && typeof input.user_links === 'object' && !Array.isArray(input.user_links)
      ? (input.user_links as Record<string, unknown>)
      : {}
  Object.entries(rawUserLinks)
    .slice(0, MAX_USER_LINK_PLACES)
    .forEach(([placeId, rawLinks]) => {
      const cleanPlaceId = placeId.trim().slice(0, 80)
      if (!cleanPlaceId || !Array.isArray(rawLinks)) return
      const links = rawLinks
        .filter((link): link is Record<string, unknown> => Boolean(link) && typeof link === 'object' && !Array.isArray(link))
        .slice(0, MAX_USER_LINKS_PER_PLACE)
        .map((link) => ({
          label: typeof link.label === 'string' ? link.label.trim().slice(0, 40) : '',
          href: typeof link.href === 'string' ? link.href.trim().slice(0, 500) : '',
        }))
        .filter((link) => link.label && link.href)
      if (links.length > 0) userLinks[cleanPlaceId] = links
    })

  return {
    id,
    city,
    items,
    notes: Object.keys(notes).length > 0 ? notes : undefined,
    custom_places: Object.keys(customPlaces).length > 0 ? customPlaces : undefined,
    user_links: Object.keys(userLinks).length > 0 ? userLinks : undefined,
  }
}

export async function POST(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const payload = cleanPayload(await req.json().catch(() => null))
  if (!payload) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const expiresAt = new Date(Date.now() + PLANNER_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const row = {
    city: payload.city,
    items: payload.items,
    notes: payload.notes ?? {},
    custom_places: payload.custom_places ?? {},
    user_links: payload.user_links ?? {},
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }

  if (payload.id) {
    const { data: existing } = await supabase
      .from(TABLE)
      .select('read_token')
      .eq('id', payload.id)
      .maybeSingle()
    const nextReadToken =
      typeof existing?.read_token === 'string' && existing.read_token ? existing.read_token : readToken()
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...row, read_token: nextReadToken })
      .eq('id', payload.id)
      .select('id, read_token')
      .maybeSingle()

    if (!error && data?.id) return NextResponse.json({ id: data.id, read_token: data.read_token, updated: true })
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const id = shortId()
    const token = readToken()
    const { error } = await supabase.from(TABLE).insert({
      id,
      read_token: token,
      ...row,
    })

    if (!error) return NextResponse.json({ id, read_token: token, created: true })
    if (error.code !== '23505') {
      return NextResponse.json({ error: 'store_failed', code: error.code }, { status: 503 })
    }
  }

  return NextResponse.json({ error: 'id_collision' }, { status: 503 })
}

export async function GET(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const id = req.nextUrl.searchParams.get('id')?.trim()
  const viewToken = req.nextUrl.searchParams.get('v')?.trim()
  if (!id && !viewToken) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  const query = supabase
    .from(TABLE)
    .select('id, read_token, city, items, notes, custom_places, user_links, expires_at, updated_at')
  const { data, error } = await (viewToken ? query.eq('read_token', viewToken) : query.eq('id', id))
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'load_failed' }, { status: 503 })
  if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'expired' }, { status: 410 })
  }

  return NextResponse.json({
    id: data.id,
    read_token: data.read_token,
    readonly: Boolean(viewToken),
    city: data.city,
    items: Array.isArray(data.items) ? data.items : [],
    notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
    custom_places: data.custom_places && typeof data.custom_places === 'object' ? data.custom_places : {},
    user_links: data.user_links && typeof data.user_links === 'object' ? data.user_links : {},
    updated_at: data.updated_at,
  })
}

export async function PATCH(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const id = typeof input?.id === 'string' ? input.id.trim().slice(0, 32) : ''
  const readToken = typeof input?.read_token === 'string' ? input.read_token.trim().slice(0, 32) : ''
  const city = typeof input?.city === 'string' ? input.city.trim().slice(0, 32) : ''
  if (!id || !city) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  let updateQuery = supabase
    .from(TABLE)
    .update({ city, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (readToken) updateQuery = updateQuery.eq('read_token', readToken)
  const { data, error } = await updateQuery.select('id, city, updated_at').maybeSingle()

  if (error) return NextResponse.json({ error: 'update_failed', code: error.code }, { status: 503 })
  if (!data?.id) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ id: data.id, city: data.city, updated_at: data.updated_at })
}
export async function DELETE(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const id = req.nextUrl.searchParams.get('id')?.trim().slice(0, 32)
  const readToken = req.nextUrl.searchParams.get('read_token')?.trim().slice(0, 32)
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  let findQuery = supabase.from(TABLE).select('id').eq('id', id)
  if (readToken) findQuery = findQuery.eq('read_token', readToken)
  const { data: existing, error: findError } = await findQuery.maybeSingle()
  if (findError) return NextResponse.json({ error: 'load_failed', code: findError.code }, { status: 503 })
  if (!existing?.id) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let deleteQuery = supabase.from(TABLE).delete().eq('id', id)
  if (readToken) deleteQuery = deleteQuery.eq('read_token', readToken)
  const { error } = await deleteQuery
  if (error) return NextResponse.json({ error: 'delete_failed', code: error.code }, { status: 503 })

  const { data: remaining, error: verifyError } = await supabase
    .from(TABLE)
    .select('id')
    .eq('id', id)
    .maybeSingle()
  if (verifyError) return NextResponse.json({ error: 'verify_failed', code: verifyError.code }, { status: 503 })
  if (remaining?.id) return NextResponse.json({ error: 'delete_not_applied' }, { status: 503 })

  return NextResponse.json({ deleted: true })
}
