import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_QUERY_LENGTH = 180
const MATCH_DISTANCE_METERS = 250
const REQUEST_TIMEOUT_MS = 12_000
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MISS_CACHE_TTL_MS = 60 * 60 * 1000
const MAX_CACHE_ENTRIES = 500

type MapsIdentity = {
  placeId: string
  name: string
  lat: number
  lng: number
  types: string[]
}

type CachedMapsIdentity = {
  expiresAt: number
  identity: MapsIdentity | null
  identitySource?: 'data_id' | 'text'
}

type SerpApiMapsPayload = {
  error?: unknown
  place_results?: unknown
  local_results?: unknown
}

type SerpApiMapsResult = {
  title?: unknown
  place_id?: unknown
  type?: unknown
  types?: unknown
  gps_coordinates?: {
    latitude?: unknown
    longitude?: unknown
  }
}

const identityCache = new Map<string, CachedMapsIdentity>()

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const query = cleanQuery(body?.query)
  const lat = readCoordinate(body?.lat, -90, 90)
  const lng = readCoordinate(body?.lng, -180, 180)
  const dataId = cleanGoogleMapsDataId(body?.dataId)
  // A shared Maps URL can contain an exact feature data ID even when its
  // visible label cannot be extracted. That ID alone is sufficient for the
  // precise lookup; text is only required for the coordinate-checked fallback.
  if ((!query && !dataId) || lat == null || lng == null) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })

  const apiKey = process.env.SERPAPI_API_KEY?.trim() ?? ''
  if (!apiKey) return NextResponse.json({ configured: false, error: 'serpapi_key_missing' }, { status: 503 })

  const cacheKey = `${dataId || query.toLocaleLowerCase('en-US')}|${lat.toFixed(5)}|${lng.toFixed(5)}`
  const cached = readCachedIdentity(cacheKey)
  if (cached !== undefined) {
    return NextResponse.json({
      configured: true,
      ...(cached.identity ? { identity: cached.identity, ...(cached.identitySource ? { identitySource: cached.identitySource } : {}) } : {}),
    })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const exactPayload = dataId
      ? await searchSerpApiMaps(apiKey, { dataId, lat, lng }, controller.signal)
      : null
    if (dataId && !exactPayload) return NextResponse.json({ configured: true, error: 'maps_identity_request_failed' }, { status: 502 })

    let identity = exactPayload
      ? findNearestIdentity([exactPayload.place_results, exactPayload.local_results], { lat, lng }, { exactDataId: true })
      : null
    let identitySource: 'data_id' | 'text' | undefined = identity ? 'data_id' : undefined

    // Data IDs are normally exact. If Google has retired one, use the Maps
    // label only as a second, coordinate-bounded search rather than falling
    // back to the browser API (which is not enabled for the public key).
    if (!identity && query) {
      const searchPayload = await searchSerpApiMaps(apiKey, { query, lat, lng }, controller.signal)
      if (!searchPayload) return NextResponse.json({ configured: true, error: 'maps_identity_request_failed' }, { status: 502 })
      identity = findNearestIdentity([searchPayload.place_results, searchPayload.local_results], { lat, lng })
      if (identity) identitySource = 'text'
    }

    rememberIdentity(cacheKey, identity, identitySource)
    return NextResponse.json({ configured: true, ...(identity ? { identity, identitySource } : {}) })
  } finally {
    clearTimeout(timeout)
  }
}

async function searchSerpApiMaps(
  apiKey: string,
  input: { dataId: string; lat: number; lng: number } | { query: string; lat: number; lng: number },
  signal: AbortSignal,
) {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_maps')
  // Use English only for the canonical Maps name. The Maps URL title is kept
  // separately by the client as the localized (usually zh-TW) second query.
  url.searchParams.set('hl', 'en')
  if ('dataId' in input) {
    // A Maps URL's `0x...:0x...` data ID identifies one concrete feature.
    // SerpAPI documents this `type=place` form as the precise alternative to
    // a keyword search, eliminating same-name hotel ambiguity.
    url.searchParams.set('type', 'place')
    url.searchParams.set('data', `!4m5!3m4!1s${input.dataId}!8m2!3d${input.lat}!4d${input.lng}`)
  } else {
    url.searchParams.set('type', 'search')
    url.searchParams.set('q', input.query)
    url.searchParams.set('ll', `@${input.lat},${input.lng},18z`)
  }
  url.searchParams.set('api_key', apiKey)

  const response = await fetch(url, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
    signal,
  }).catch(() => null)
  if (!response?.ok) return null
  const payload = (await response.json().catch(() => null)) as SerpApiMapsPayload | null
  return payload && !payload.error ? payload : null
}

function findNearestIdentity(
  value: unknown[],
  source: { lat: number; lng: number },
  options: { exactDataId?: boolean } = {},
): MapsIdentity | null {
  const candidates = value.flatMap((item) => Array.isArray(item) ? item : [item])
  const matches = candidates
    .map((value) => readIdentity(value, source, options))
    .filter((identity): identity is MapsIdentity & { distance: number } => identity !== null)
    .sort((left, right) => left.distance - right.distance)
  const match = matches[0]
  if (!match) return null
  const { distance: _distance, ...identity } = match
  return identity
}

function readIdentity(
  value: unknown,
  source: { lat: number; lng: number },
  options: { exactDataId?: boolean },
): (MapsIdentity & { distance: number }) | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const result = value as SerpApiMapsResult
  const placeId = cleanGooglePlaceId(result.place_id)
  const name = cleanName(result.title)
  const lat = readCoordinate(result.gps_coordinates?.latitude, -90, 90)
  const lng = readCoordinate(result.gps_coordinates?.longitude, -180, 180)
  if (!placeId || !name || lat == null || lng == null) return null

  const distance = distanceMeters(source, { lat, lng })
  if (!options.exactDataId && distance > MATCH_DISTANCE_METERS) return null
  return {
    placeId,
    name,
    lat,
    lng,
    types: mapsResultTypes(result),
    distance,
  }
}

function mapsResultTypes(result: SerpApiMapsResult) {
  const text = [
    typeof result.type === 'string' ? result.type : '',
    ...(Array.isArray(result.type) ? result.type.filter((type): type is string => typeof type === 'string') : []),
    ...(Array.isArray(result.types) ? result.types.filter((type): type is string => typeof type === 'string') : []),
  ]
    .join(' ')
    .normalize('NFKC')
    .toLowerCase()

  if (/\b(?:hotel|hostel|motel|inn|resort|ryokan|guest\s*house|lodging|accommodation)\b/.test(text)) return ['lodging']
  if (/\b(?:restaurant|cafe|coffee|bar|bakery|meal)\b/.test(text)) return ['restaurant']
  if (/\b(?:airport|station|subway|transit|bus)\b/.test(text)) return ['transit_station']
  if (/\b(?:museum|park|temple|shrine|castle|tower|zoo|aquarium|attraction)\b/.test(text)) return ['tourist_attraction']
  if (/\b(?:store|shop|mall|market|department)\b/.test(text)) return ['store']
  return []
}

function readCachedIdentity(key: string) {
  const cached = identityCache.get(key)
  if (!cached) return undefined
  if (cached.expiresAt <= Date.now()) {
    identityCache.delete(key)
    return undefined
  }
  return cached
}

function rememberIdentity(key: string, identity: MapsIdentity | null, identitySource?: 'data_id' | 'text') {
  identityCache.set(key, {
    identity,
    ...(identitySource ? { identitySource } : {}),
    expiresAt: Date.now() + (identity ? CACHE_TTL_MS : MISS_CACHE_TTL_MS),
  })
  while (identityCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = identityCache.keys().next().value
    if (typeof oldestKey !== 'string') break
    identityCache.delete(oldestKey)
  }
}

function cleanQuery(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > 0 && clean.length <= MAX_QUERY_LENGTH ? clean : ''
}

function cleanName(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.replace(/\s+/g, ' ').trim()
  return clean.length > 0 ? clean.slice(0, 160) : ''
}

function cleanGooglePlaceId(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim()
  return /^ChI[A-Za-z0-9_-]{12,}$/.test(clean) ? clean : ''
}

function cleanGoogleMapsDataId(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim().toLowerCase()
  return /^0x[0-9a-f]{6,}:0x[0-9a-f]{6,}$/.test(clean) ? clean : ''
}

function readCoordinate(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number.NaN
  return Number.isFinite(number) && number >= min && number <= max ? number : null
}

function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radius = 6_371_000
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const latDelta = toRadians(b.lat - a.lat)
  const lngDelta = toRadians(b.lng - a.lng)
  const left = Math.sin(latDelta / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(lngDelta / 2) ** 2
  return 2 * radius * Math.atan2(Math.sqrt(left), Math.sqrt(1 - left))
}
