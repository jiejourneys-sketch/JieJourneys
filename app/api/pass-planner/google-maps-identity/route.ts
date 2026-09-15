import { NextRequest, NextResponse } from 'next/server'
import { fetchPlannerSerpApi, plannerSerpApiIsEnabled } from '@/lib/serpApiGuard'

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

type MapsIdentityResolution = {
  identity: MapsIdentity | null
  identitySource?: 'data_id' | 'text'
  requestFailed?: boolean
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
const identityRequests = new Map<string, Promise<MapsIdentityResolution>>()

export async function POST(incomingRequest: NextRequest) {
  const body = (await incomingRequest.json().catch(() => null)) as Record<string, unknown> | null
  const query = cleanQuery(body?.query)
  const lat = readCoordinate(body?.lat, -90, 90)
  const lng = readCoordinate(body?.lng, -180, 180)
  const dataId = cleanGoogleMapsDataId(body?.dataId)
  // A shared Maps URL can contain an exact feature data ID even when its
  // visible label cannot be extracted. That ID alone is sufficient for the
  // precise lookup; text is only required for the coordinate-checked fallback.
  if ((!query && !dataId) || lat == null || lng == null) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })

  if (!plannerSerpApiIsEnabled()) {
    return NextResponse.json({ configured: false, error: 'serpapi_disabled' }, { status: 503 })
  }

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

  const activeRequest = identityRequests.get(cacheKey)
  const lookupRequest = activeRequest ?? resolveMapsIdentity(apiKey, { query, dataId, lat, lng })
  if (!activeRequest) identityRequests.set(cacheKey, lookupRequest)
  try {
    const resolved = await lookupRequest
    if (resolved.requestFailed) {
      return NextResponse.json({ configured: true, error: 'maps_identity_request_failed' }, { status: 502 })
    }
    rememberIdentity(cacheKey, resolved.identity, resolved.identitySource)
    return NextResponse.json({
      configured: true,
      ...(resolved.identity
        ? { identity: resolved.identity, ...(resolved.identitySource ? { identitySource: resolved.identitySource } : {}) }
        : {}),
    })
  } finally {
    if (!activeRequest && identityRequests.get(cacheKey) === lookupRequest) identityRequests.delete(cacheKey)
  }
}

async function resolveMapsIdentity(
  apiKey: string,
  input: { query: string; dataId: string; lat: number; lng: number },
): Promise<MapsIdentityResolution> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    // One identity operation is allowed one metered request. If an exact data
    // ID is stale, the browser-side Places/Geocoder fallback handles the label
    // instead of silently spending a second SerpAPI credit.
    const payload = await searchSerpApiMaps(
      apiKey,
      input.dataId
        ? { dataId: input.dataId, lat: input.lat, lng: input.lng }
        : { query: input.query, lat: input.lat, lng: input.lng },
      controller.signal,
    )
    if (!payload) return { identity: null, requestFailed: true }
    const identity = findNearestIdentity(
      [payload.place_results, payload.local_results],
      { lat: input.lat, lng: input.lng },
      { exactDataId: Boolean(input.dataId) },
    )
    return {
      identity,
      ...(identity ? { identitySource: input.dataId ? 'data_id' as const : 'text' as const } : {}),
    }
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
    // The second hexadecimal half of a Maps feature ID is Google's stable
    // decimal CID. SerpAPI deprecated its old `data` parameter in favour of
    // this exact `data_cid` lookup.
    url.searchParams.set('type', 'place')
    url.searchParams.set('data_cid', googleMapsCidFromDataId(input.dataId))
  } else {
    url.searchParams.set('type', 'search')
    url.searchParams.set('q', input.query)
    url.searchParams.set('ll', `@${input.lat},${input.lng},18z`)
  }
  url.searchParams.set('api_key', apiKey)

  const response = await fetchPlannerSerpApi(url, {
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

function googleMapsCidFromDataId(dataId: string) {
  const hexadecimalCid = dataId.split(':')[1]
  return BigInt(hexadecimalCid).toString(10)
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
