import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MAX_ITEMS = 240
const MAX_NOTES = 160
const MAX_NOTE_LENGTH = 500
const MAX_CUSTOM_PLACES = 80
const MAX_LINKS_PER_CUSTOM_PLACE = 8
const MAX_USER_LINK_PLACES = 120
const MAX_USER_LINKS_PER_PLACE = 8
const MAX_PRE_DEPARTURE_TRAVELERS = 12
const MAX_PRE_DEPARTURE_CUSTOM_ITEMS = 80
const MAX_PRE_DEPARTURE_CHECKED_ITEMS = 300
const PRE_DEPARTURE_NOTE_KEY = '__pre_departure_v2'
const PRE_DEPARTURE_OWNER = { id: 'traveler-owner', name: '我' }
const CUSTOM_PLACE_CATEGORIES = new Set(['spot', 'free', 'food', 'restaurant', 'shop', 'hotel'])
const INVALID_TEXT_ENCODING_PATTERN = /[\u0080-\u009F\uFFFD]/

function hasInvalidTextEncoding(value: unknown): boolean {
  if (typeof value === 'string') return INVALID_TEXT_ENCODING_PATTERN.test(value)
  if (Array.isArray(value)) return value.some(hasInvalidTextEncoding)
  if (!value || typeof value !== 'object') return false
  return Object.values(value as Record<string, unknown>).some(hasInvalidTextEncoding)
}

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
  edit_token?: string
  city: string
  items: string[]
  notes?: Record<string, string>
  custom_places?: Record<string, unknown>
  user_links?: Record<string, unknown>
  pre_departure?: Record<string, unknown>
}

type StoredPlannerBook = {
  id?: string
  read_token?: string
  edit_token?: string
  city: string
  items: unknown
  notes: unknown
  custom_places: unknown
  user_links: unknown
  updated_at?: string
}

type PlannerBookMutation = {
  id?: string
  read_token?: string
  city?: string
  updated_at?: string
}

function cleanPreDeparture(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const input = value as Record<string, unknown>
  const travelers: { id: string; name: string }[] = []
  const travelerIds = new Set<string>()
  if (Array.isArray(input.travelers)) {
    input.travelers.slice(0, MAX_PRE_DEPARTURE_TRAVELERS).forEach((traveler) => {
      if (!traveler || typeof traveler !== 'object' || Array.isArray(traveler)) return
      const source = traveler as Record<string, unknown>
      const id = typeof source.id === 'string' ? source.id.trim().slice(0, 80) : ''
      const name = typeof source.name === 'string' ? source.name.trim().slice(0, 16) : ''
      if (!id.startsWith('traveler-') || !name || travelerIds.has(id)) return
      travelerIds.add(id)
      travelers.push({ id, name })
    })
  }
  if (travelers.length === 0) {
    travelerIds.add(PRE_DEPARTURE_OWNER.id)
    travelers.push({ ...PRE_DEPARTURE_OWNER })
  }

  const customItems: Record<string, unknown>[] = []
  const customItemIds = new Set<string>()
  if (Array.isArray(input.customItems)) {
    input.customItems.slice(0, MAX_PRE_DEPARTURE_CUSTOM_ITEMS).forEach((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return
      const source = item as Record<string, unknown>
      const id = typeof source.id === 'string' ? source.id.trim().slice(0, 80) : ''
      const label = typeof source.label === 'string' ? source.label.trim().slice(0, 30) : ''
      const categoryId = typeof source.categoryId === 'string' ? source.categoryId.trim().slice(0, 40) : 'essentials'
      if (!id.startsWith('custom-') || !label || customItemIds.has(id)) return
      customItemIds.add(id)
      const scope = 'personal'
      const assignedTravelerIds = Array.isArray(source.travelerIds)
        ? [...new Set(source.travelerIds.filter((travelerId): travelerId is string => typeof travelerId === 'string' && travelerIds.has(travelerId)))].slice(0, MAX_PRE_DEPARTURE_TRAVELERS)
        : []
      customItems.push({
        id,
        label,
        custom: true,
        categoryId,
        scope,
        ...(scope === 'personal' && assignedTravelerIds.length > 0 ? { travelerIds: assignedTravelerIds } : {}),
      })
    })
  }

  const checked: Record<string, Record<string, true>> = {}
  const validTargetIds = new Set(['shared', ...travelerIds])
  if (input.checked && typeof input.checked === 'object' && !Array.isArray(input.checked)) {
    Object.entries(input.checked as Record<string, unknown>).forEach(([targetId, rawItems]) => {
      if (!validTargetIds.has(targetId) || !rawItems || typeof rawItems !== 'object' || Array.isArray(rawItems)) return
      const targetItems = Object.fromEntries(
        Object.entries(rawItems as Record<string, unknown>)
          .filter(([itemId, isChecked]) => itemId.length <= 80 && isChecked === true)
          .slice(0, MAX_PRE_DEPARTURE_CHECKED_ITEMS)
          .map(([itemId]) => [itemId, true] as const),
      )
      if (Object.keys(targetItems).length > 0) checked[targetId] = targetItems
    })
  }
  const formerlySharedItems = checked.shared
  if (formerlySharedItems) {
    travelers.forEach((traveler) => {
      checked[traveler.id] = { ...formerlySharedItems, ...(checked[traveler.id] ?? {}) }
    })
    delete checked.shared
  }

  const rawNotes = input.notes && typeof input.notes === 'object' && !Array.isArray(input.notes)
    ? (input.notes as Record<string, unknown>)
    : {}
  const generalNote = typeof rawNotes.general === 'string' ? rawNotes.general.trim().slice(0, 500) : ''
  const cleanIdList = (rawValue: unknown, max: number) =>
    Array.isArray(rawValue)
      ? [...new Set(rawValue.filter((id): id is string => typeof id === 'string').map((id) => id.trim().slice(0, 80)).filter(Boolean))].slice(0, max)
      : []

  return {
    version: 2,
    travelers,
    checked,
    notes: generalNote ? { general: generalNote } : {},
    customItems,
    removedItemIds: cleanIdList(input.removedItemIds, 200),
    hiddenCategoryIds: cleanIdList(input.hiddenCategoryIds, 20),
  }
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

function editToken() {
  const values = new Uint8Array(32)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('')
}

function cleanEditToken(value: unknown) {
  const token = typeof value === 'string' ? value.trim() : ''
  return /^[a-f0-9]{64}$/.test(token) ? token : ''
}

function cleanLegacyImageOwnerToken(value: unknown) {
  const token = typeof value === 'string' ? value.trim() : ''
  return /^[A-Za-z0-9_-]{24,96}$/.test(token) ? token : ''
}

function cleanPayload(value: unknown): PlannerBookPayload | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const id = typeof input.id === 'string' ? input.id.trim().slice(0, 32) : undefined
  const editorToken = cleanEditToken(input.edit_token)
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
    ...(editorToken ? { edit_token: editorToken } : {}),
    city,
    items,
    notes: Object.keys(notes).length > 0 ? notes : undefined,
    custom_places: Object.keys(customPlaces).length > 0 ? customPlaces : undefined,
    user_links: Object.keys(userLinks).length > 0 ? userLinks : undefined,
    pre_departure: cleanPreDeparture(input.pre_departure),
  }
}

export async function POST(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const input = await req.json().catch(() => null)
  const recoveryInput = input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : null
  if (recoveryInput?.action === 'recover_edit_token') {
    const id = typeof recoveryInput.id === 'string' ? recoveryInput.id.trim().slice(0, 32) : ''
    const imageOwnerToken = cleanLegacyImageOwnerToken(recoveryInput.image_owner_token)
    if (!id || !imageOwnerToken) return NextResponse.json({ error: 'recovery_forbidden' }, { status: 403 })
    const { data, error } = await supabase.rpc('planner_book_recover_edit_token', {
      p_id: id,
      p_image_owner_token: imageOwnerToken,
    })
    const recoveredToken = cleanEditToken(data)
    if (error) return NextResponse.json({ error: 'recovery_failed' }, { status: 503 })
    if (!recoveredToken) return NextResponse.json({ error: 'recovery_forbidden' }, { status: 403 })
    return NextResponse.json({ edit_token: recoveredToken })
  }
  // Reject replacement/control characters instead of overwriting an entire
  // shared plan with mojibake from a misconfigured external client.
  if (hasInvalidTextEncoding(input)) {
    return NextResponse.json({ error: 'invalid_text_encoding' }, { status: 422 })
  }
  const payload = cleanPayload(input)
  if (!payload) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  if (payload.id) {
    if (!payload.edit_token) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })
    const { data: rawExisting, error: loadError } = await supabase.rpc('planner_book_read_edit', {
      p_id: payload.id,
      p_edit_token: payload.edit_token,
    }).maybeSingle()
    const existing = rawExisting as StoredPlannerBook | null
    if (loadError) return NextResponse.json({ error: 'load_failed' }, { status: 503 })
    if (!existing) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })
    const existingNotes = existing?.notes && typeof existing.notes === 'object' && !Array.isArray(existing.notes)
      ? (existing.notes as Record<string, unknown>)
      : {}
    const nextPreDeparture = payload.pre_departure ?? cleanPreDeparture(existingNotes[PRE_DEPARTURE_NOTE_KEY])
    const nextNotes = {
      ...(payload.notes ?? {}),
      ...(nextPreDeparture ? { [PRE_DEPARTURE_NOTE_KEY]: nextPreDeparture } : {}),
    }
    const { data, error } = await supabase
      .rpc('planner_book_update', {
        p_id: payload.id,
        p_edit_token: payload.edit_token,
        p_city: payload.city,
        p_items: payload.items,
        p_notes: nextNotes,
        p_custom_places: payload.custom_places ?? {},
        p_user_links: payload.user_links ?? {},
      })
      .maybeSingle()

    const saved = data as PlannerBookMutation | null
    if (!error && saved?.id) return NextResponse.json({ id: saved.id, read_token: saved.read_token, updated: true })
    if (error) return NextResponse.json({ error: 'store_failed', code: error.code }, { status: 503 })
    return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const id = shortId()
    const token = readToken()
    const editorToken = editToken()
    const { data, error } = await supabase.rpc('planner_book_create', {
      p_id: id,
      p_read_token: token,
      p_edit_token: editorToken,
      p_city: payload.city,
      p_items: payload.items,
      p_notes: {
        ...(payload.notes ?? {}),
        ...(payload.pre_departure ? { [PRE_DEPARTURE_NOTE_KEY]: payload.pre_departure } : {}),
      },
      p_custom_places: payload.custom_places ?? {},
      p_user_links: payload.user_links ?? {},
    })

    const created = data as PlannerBookMutation[] | null
    if (!error && created?.[0]?.id) {
      return NextResponse.json({ id, read_token: token, edit_token: editorToken, created: true })
    }
    if (error?.code === '23505') continue
    return NextResponse.json({ error: 'store_failed', ...(error?.code ? { code: error.code } : {}) }, { status: 503 })
  }

  return NextResponse.json({ error: 'id_collision' }, { status: 503 })
}

export async function GET(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const id = req.nextUrl.searchParams.get('id')?.trim()
  const viewToken = req.nextUrl.searchParams.get('v')?.trim()
  const editorToken = cleanEditToken(req.nextUrl.searchParams.get('e'))
  if (!id && !viewToken) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  // Before edit tokens were introduced, saved personal planner links used
  // `?p=<id>`. Treat that existing bearer link as the legacy editor credential
  // for the same non-template book, so owners do not need to create a copy.
  // Protected source templates are excluded by the RPC.
  const legacyIdLink = Boolean(id && !editorToken && !viewToken)
  const { data, error } = await (viewToken
    ? supabase.rpc('planner_book_read_public', { p_read_token: viewToken })
    : legacyIdLink
      ? supabase.rpc('planner_book_read_legacy', { p_id: id })
      : supabase.rpc('planner_book_read_edit', { p_id: id, p_edit_token: editorToken }))
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'load_failed' }, { status: 503 })
  const book = data as StoredPlannerBook | null
  if (!book) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const storedNotes = book.notes && typeof book.notes === 'object' && !Array.isArray(book.notes)
    ? (book.notes as Record<string, unknown>)
    : {}
  const { [PRE_DEPARTURE_NOTE_KEY]: storedPreDeparture, ...placeNotes } = storedNotes

  return NextResponse.json({
    ...(viewToken ? {} : { id: book.id }),
    read_token: book.read_token,
    ...(legacyIdLink && cleanEditToken(book.edit_token) ? { edit_token: cleanEditToken(book.edit_token) } : {}),
    readonly: Boolean(viewToken),
    city: book.city,
    items: Array.isArray(book.items) ? book.items : [],
    notes: placeNotes,
    pre_departure: cleanPreDeparture(storedPreDeparture),
    custom_places: book.custom_places && typeof book.custom_places === 'object' ? book.custom_places : {},
    user_links: book.user_links && typeof book.user_links === 'object' ? book.user_links : {},
    updated_at: book.updated_at,
  })
}

export async function PATCH(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const id = typeof input?.id === 'string' ? input.id.trim().slice(0, 32) : ''
  const editorToken = cleanEditToken(input?.edit_token)
  const city = typeof input?.city === 'string' ? input.city.trim().slice(0, 32) : ''
  if (!id || !editorToken) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })
  if (id && Object.prototype.hasOwnProperty.call(input ?? {}, 'pre_departure')) {
    const preDeparture = cleanPreDeparture(input?.pre_departure)
    if (!preDeparture) return NextResponse.json({ error: 'invalid_pre_departure' }, { status: 400 })
    const { data: rawExisting, error: loadError } = await supabase.rpc('planner_book_read_edit', {
      p_id: id,
      p_edit_token: editorToken,
    }).maybeSingle()
    const existing = rawExisting as StoredPlannerBook | null
    if (loadError) return NextResponse.json({ error: 'load_failed' }, { status: 503 })
    if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    const existingNotes = existing.notes && typeof existing.notes === 'object' && !Array.isArray(existing.notes)
      ? (existing.notes as Record<string, unknown>)
      : {}
    const { data, error } = await supabase.rpc('planner_book_update', {
      p_id: id,
      p_edit_token: editorToken,
      p_city: existing.city,
      p_items: existing.items,
      p_notes: { ...existingNotes, [PRE_DEPARTURE_NOTE_KEY]: preDeparture },
      p_custom_places: existing.custom_places ?? {},
      p_user_links: existing.user_links ?? {},
    }).maybeSingle()
    if (error) return NextResponse.json({ error: 'update_failed', code: error.code }, { status: 503 })
    const saved = data as PlannerBookMutation | null
    if (!saved?.id) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })
    return NextResponse.json({ id, pre_departure: preDeparture, updated_at: saved.updated_at })
  }
  if (!city) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const { data, error } = await supabase.rpc('planner_book_rename', {
    p_id: id,
    p_edit_token: editorToken,
    p_city: city,
  }).maybeSingle()

  if (error) return NextResponse.json({ error: 'update_failed', code: error.code }, { status: 503 })
  const renamed = data as PlannerBookMutation | null
  if (!renamed?.id) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ id: renamed.id, city: renamed.city, updated_at: renamed.updated_at })
}
export async function DELETE(req: NextRequest) {
  const supabase = getTripSupabase()
  if (!supabase) return NextResponse.json({ error: 'supabase_env_missing' }, { status: 503 })

  const id = req.nextUrl.searchParams.get('id')?.trim().slice(0, 32)
  const editorToken = cleanEditToken(req.nextUrl.searchParams.get('e'))
  if (!id || !editorToken) return NextResponse.json({ error: 'edit_forbidden' }, { status: 403 })

  const { data: deleted, error } = await supabase.rpc('planner_book_delete', {
    p_id: id,
    p_edit_token: editorToken,
  })
  if (error) return NextResponse.json({ error: 'delete_failed', code: error.code }, { status: 503 })
  if (deleted !== true) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ deleted: true })
}
