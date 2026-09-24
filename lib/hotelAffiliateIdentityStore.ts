import { createClient } from '@supabase/supabase-js'
import {
  isUsableHotelAffiliateName,
  type VerifiedHotelAffiliateIdentity,
  type VerifiedHotelAffiliateProvider,
} from '@/lib/hotelAffiliateIdentity'

type VerifiedHotelAffiliateIdentityContext = {
  latitude?: unknown
  longitude?: unknown
  countryCode?: unknown
  maxDistanceMeters?: number
}

type StoredHotelAffiliateIdentity = {
  google_place_id?: unknown
  canonical_names?: unknown
  latitude?: unknown
  longitude?: unknown
  country_code?: unknown
  agoda_hotel_id?: unknown
  agoda_hotel_name?: unknown
  agoda_source_url?: unknown
  trip_hotel_id?: unknown
  trip_hotel_name?: unknown
  trip_source_url?: unknown
  verified_at?: unknown
}

const CACHE_TTL_MS = 5 * 60 * 1000
const MISS_CACHE_TTL_MS = 15 * 1000
const MAX_IDENTITY_CACHE_ENTRIES = 1_000
const GOOGLE_PLACE_ID_PATTERN = /^[A-Za-z0-9_-]{8,180}$/
const HOTEL_ID_PATTERN = /^\d{3,}$/

const identityCache = new Map<string, { expiresAt: number; identity?: VerifiedHotelAffiliateIdentity }>()
const identityRequests = new Map<string, Promise<VerifiedHotelAffiliateIdentity | undefined>>()

export async function getStoredVerifiedHotelAffiliateIdentity(
  googlePlaceId: unknown,
  context: VerifiedHotelAffiliateIdentityContext = {},
) {
  if (process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED?.trim().toLowerCase() === 'false') return undefined

  const placeId = typeof googlePlaceId === 'string' ? googlePlaceId.trim() : ''
  if (!GOOGLE_PLACE_ID_PATTERN.test(placeId)) return undefined

  const latitude = cleanCoordinate(context.latitude, -90, 90)
  const longitude = cleanCoordinate(context.longitude, -180, 180)
  const countryCode = cleanCountryCode(context.countryCode)
  const cacheKey = [
    placeId,
    latitude?.toFixed(5) ?? '',
    longitude?.toFixed(5) ?? '',
    countryCode,
  ].join('|')
  const cached = identityCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    // Refresh insertion order so the bounded Map behaves like a small LRU.
    identityCache.delete(cacheKey)
    identityCache.set(cacheKey, cached)
    return cached.identity
  }
  if (cached) identityCache.delete(cacheKey)

  const pending = identityRequests.get(cacheKey)
  if (pending) return pending

  const request = loadStoredIdentity(placeId, {
    latitude,
    longitude,
    countryCode,
    maxDistanceMeters: context.maxDistanceMeters,
  }).then((identity) => {
    rememberIdentityCacheEntry(cacheKey, {
      expiresAt: Date.now() + (identity ? CACHE_TTL_MS : MISS_CACHE_TTL_MS),
      ...(identity ? { identity } : {}),
    })
    return identity
  }).finally(() => {
    identityRequests.delete(cacheKey)
  })
  identityRequests.set(cacheKey, request)
  return request
}

function rememberIdentityCacheEntry(
  cacheKey: string,
  entry: { expiresAt: number; identity?: VerifiedHotelAffiliateIdentity },
) {
  const now = Date.now()
  identityCache.forEach((cached, key) => {
    if (cached.expiresAt <= now) identityCache.delete(key)
  })
  identityCache.delete(cacheKey)
  while (identityCache.size >= MAX_IDENTITY_CACHE_ENTRIES) {
    const oldestKey = identityCache.keys().next().value
    if (typeof oldestKey !== 'string') break
    identityCache.delete(oldestKey)
  }
  identityCache.set(cacheKey, entry)
}

async function loadStoredIdentity(
  googlePlaceId: string,
  context: {
    latitude?: number
    longitude?: number
    countryCode: string
    maxDistanceMeters?: number
  },
) {
  const url = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) return undefined

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  const { data, error } = await supabase.rpc('planner_hotel_affiliate_identity_lookup', {
    p_google_place_id: googlePlaceId,
    p_latitude: context.latitude ?? null,
    p_longitude: context.longitude ?? null,
    p_country_code: context.countryCode || null,
  }).maybeSingle()
  if (error || !data) return undefined

  return parseStoredIdentity(data as StoredHotelAffiliateIdentity, googlePlaceId, context)
}

function parseStoredIdentity(
  row: StoredHotelAffiliateIdentity,
  googlePlaceId: string,
  context: {
    latitude?: number
    longitude?: number
    countryCode: string
    maxDistanceMeters?: number
  },
): VerifiedHotelAffiliateIdentity | undefined {
  if (row.google_place_id !== googlePlaceId) return undefined

  const storedLatitude = cleanCoordinate(row.latitude, -90, 90)
  const storedLongitude = cleanCoordinate(row.longitude, -180, 180)
  const latitude = storedLatitude ?? context.latitude
  const longitude = storedLongitude ?? context.longitude
  if (latitude == null || longitude == null) return undefined

  const storedCountryCode = cleanCountryCode(row.country_code)
  if (storedCountryCode && context.countryCode && storedCountryCode !== context.countryCode) return undefined
  if (
    storedLatitude != null &&
    storedLongitude != null &&
    context.latitude != null &&
    context.longitude != null &&
    hotelIdentityDistanceMeters(
      context.latitude,
      context.longitude,
      storedLatitude,
      storedLongitude,
    ) > Math.max(50, Math.min(context.maxDistanceMeters ?? 500, 5_000))
  ) {
    return undefined
  }

  const agoda = cleanProvider(
    row.agoda_hotel_id,
    row.agoda_hotel_name,
    row.agoda_source_url,
    'agoda.com',
  )
  const trip = cleanProvider(
    row.trip_hotel_id,
    row.trip_hotel_name,
    row.trip_source_url,
    'trip.com',
  )
  if (!agoda && !trip) return undefined

  const providerNames = [agoda?.hotelName, trip?.hotelName]
  const canonicalNames = cleanCanonicalNames(row.canonical_names, providerNames)
  if (canonicalNames.length === 0) return undefined

  return {
    googlePlaceId,
    canonicalNames,
    latitude,
    longitude,
    countryCode: storedCountryCode || context.countryCode,
    ...(agoda ? { agoda } : {}),
    ...(trip ? { trip } : {}),
    verifiedAt: cleanVerifiedAt(row.verified_at),
  }
}

function cleanCanonicalNames(value: unknown, fallback: unknown[]) {
  const names = Array.isArray(value) ? [...value, ...fallback] : fallback
  const seen = new Set<string>()
  return names
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, 160))
    .filter((item) => {
      const key = item.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
      if (!key || seen.has(key) || !isUsableHotelAffiliateName(item)) return false
      seen.add(key)
      return true
    })
    .slice(0, 8)
}

function cleanProvider(
  hotelIdValue: unknown,
  hotelNameValue: unknown,
  sourceUrlValue: unknown,
  expectedDomain: 'agoda.com' | 'trip.com',
): VerifiedHotelAffiliateProvider | undefined {
  const hotelId = typeof hotelIdValue === 'string' ? hotelIdValue.trim() : ''
  const hotelName = typeof hotelNameValue === 'string' ? hotelNameValue.trim().slice(0, 160) : ''
  if (!HOTEL_ID_PATTERN.test(hotelId) || !hotelName || !isUsableHotelAffiliateName(hotelName)) return undefined

  const sourceUrl = cleanProviderUrl(sourceUrlValue, expectedDomain)
  return {
    hotelId,
    hotelName,
    ...(sourceUrl ? { sourceUrl } : {}),
  }
}

function cleanProviderUrl(value: unknown, expectedDomain: 'agoda.com' | 'trip.com') {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const url = new URL(value.trim())
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (
      url.protocol !== 'https:' ||
      (hostname !== expectedDomain && !hostname.endsWith(`.${expectedDomain}`))
    ) {
      return ''
    }
    return url.toString()
  } catch {
    return ''
  }
}

function cleanCoordinate(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number.NaN
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined
}

function cleanCountryCode(value: unknown) {
  const code = typeof value === 'string' ? value.trim().toUpperCase() : ''
  return /^[A-Z]{2}$/.test(code) ? code : ''
}

function cleanVerifiedAt(value: unknown) {
  const verifiedAt = typeof value === 'string' ? value.trim() : ''
  return verifiedAt && Number.isFinite(Date.parse(verifiedAt)) ? verifiedAt : new Date(0).toISOString()
}

function hotelIdentityDistanceMeters(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const latitudeDelta = toRadians(toLatitude - fromLatitude)
  const longitudeDelta = toRadians(toLongitude - fromLongitude)
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
