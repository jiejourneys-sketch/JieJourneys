import { buildHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import {
  fetchPlannerSerpApi,
  getPlannerSerpApiRequestMetadata,
  plannerSerpApiIsEnabled,
} from '@/lib/serpApiGuard'

const REQUEST_TIMEOUT_MS = 12_000
// SerpAPI keeps identical autocomplete searches in its free provider cache for
// one hour. Keep the same minimum locally, including explicit planner rechecks,
// so force refresh cannot accidentally turn into another paid discovery call.
const CACHE_TTL_MS = 60 * 60 * 1000
const CACHE_MAX_ENTRIES = 256
const MAX_UINT64 = BigInt('18446744073709551615')
const ZERO_BIGINT = BigInt(0)

export type GoogleHotelsAutocompleteInput = {
  hotelName: string
  alternateHotelNames?: string[]
  city?: string
  countryCode?: string
  googleMapsDataId?: string
  expectedDataCid?: string
  forceRefresh?: boolean
}

export type GoogleHotelsAutocompleteMatch = {
  propertyToken: string
  canonicalName: string
  location: string
  dataCid: string
}

export type GoogleHotelsAutocompleteDiscovery = {
  matchStatus: 'matched' | 'no_match' | 'search_error'
  bestMatch?: GoogleHotelsAutocompleteMatch
  requestCount: number
  query: string
  error?: string
}

type AutocompleteSuggestion = {
  type?: unknown
  value?: unknown
  location?: unknown
  data_cid?: unknown
  property_token?: unknown
}

type AutocompletePayload = {
  error?: unknown
  search_metadata?: { status?: unknown }
  suggestions?: unknown
}

type CachedDiscovery = {
  expiresAt: number
  discovery: GoogleHotelsAutocompleteDiscovery
}

const discoveryCache = new Map<string, CachedDiscovery>()
const activeRequests = new Map<string, Promise<GoogleHotelsAutocompleteDiscovery>>()

/**
 * Resolves one exact Google Hotels property token from autocomplete.
 *
 * A suggestion is trusted only when it is an accommodation and its decimal
 * data CID is byte-for-byte equal to the CID obtained from Google Maps. Names
 * and locations are output metadata, never identity evidence.
 */
export async function searchGoogleHotelsAutocompleteProperty(
  input: GoogleHotelsAutocompleteInput,
): Promise<GoogleHotelsAutocompleteDiscovery | null> {
  const apiKey = process.env.SERPAPI_API_KEY?.trim() ?? ''
  if (!apiKey || !plannerSerpApiIsEnabled()) return null

  const searchNames = buildAutocompleteSearchNames(input.hotelName, input.alternateHotelNames)
  const city = cleanDisplayText(input.city, 80)
  const countryCode = cleanCountryCode(input.countryCode)
  const query = buildAutocompleteQuery(searchNames[0] ?? '', city)
  const expectedDataCid = resolveExpectedDataCid(input.expectedDataCid, input.googleMapsDataId)
  if (!query || !expectedDataCid) {
    return { matchStatus: 'no_match', requestCount: 0, query }
  }

  const cacheKey = ['google-hotels-autocomplete-v1', expectedDataCid, countryCode, query.toLocaleLowerCase('en-US')].join('|')
  // forceRefresh intentionally does not bypass this cache. The user's recheck
  // requests a new resolution decision, not a paid duplicate of provider data
  // that SerpAPI itself guarantees to cache for an hour.
  const cached = readCachedDiscovery(cacheKey)
  if (cached) return withRequestCount(cached, 0)

  const activeRequest = activeRequests.get(cacheKey)
  if (activeRequest) return withRequestCount(await activeRequest, 0)

  const request = fetchAutocompleteDiscovery({ apiKey, query, countryCode, expectedDataCid })
  activeRequests.set(cacheKey, request)
  try {
    const discovery = await request
    if (discovery.matchStatus !== 'search_error') rememberDiscovery(cacheKey, discovery)
    return discovery
  } finally {
    if (activeRequests.get(cacheKey) === request) activeRequests.delete(cacheKey)
  }
}

async function fetchAutocompleteDiscovery(options: {
  apiKey: string
  query: string
  countryCode: string
  expectedDataCid: string
}): Promise<GoogleHotelsAutocompleteDiscovery> {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_hotels_autocomplete')
  url.searchParams.set('q', options.query)
  url.searchParams.set('hl', 'en')
  if (options.countryCode) url.searchParams.set('gl', options.countryCode.toLowerCase())
  url.searchParams.set('api_key', options.apiKey)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let requestCount = 0
  try {
    const response = await fetchPlannerSerpApi(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })
    requestCount = getPlannerSerpApiRequestMetadata(response)?.searchFetchAttempted ? 1 : 0
    if (!response.ok) throw new Error(`serpapi_${response.status}`)

    const payload = (await response.json().catch(() => null)) as AutocompletePayload | null
    if (!payload) throw new Error('serpapi_invalid_response')
    const providerError = cleanError(payload.error)
    if (providerError) throw new Error(`serpapi_${providerError}`)
    const status = cleanStatus(payload.search_metadata?.status)
    if (status && status !== 'success') throw new Error(`serpapi_${status}`)

    const bestMatch = findExactAutocompleteMatch(payload.suggestions, options.expectedDataCid)
    return {
      matchStatus: bestMatch ? 'matched' : 'no_match',
      ...(bestMatch ? { bestMatch } : {}),
      requestCount,
      query: options.query,
    }
  } catch (error) {
    if (getPlannerSerpApiRequestMetadata(error)?.searchFetchAttempted) requestCount = 1
    return {
      matchStatus: 'search_error',
      requestCount,
      query: options.query,
      error: error instanceof Error ? error.message.slice(0, 120) : 'autocomplete_search_failed',
    }
  } finally {
    clearTimeout(timeout)
  }
}

function findExactAutocompleteMatch(value: unknown, expectedDataCid: string) {
  if (!Array.isArray(value)) return undefined
  for (const item of value) {
    const suggestion = readAutocompleteSuggestion(item, expectedDataCid)
    if (suggestion) return suggestion
  }
  return undefined
}

function readAutocompleteSuggestion(
  value: unknown,
  expectedDataCid: string,
): GoogleHotelsAutocompleteMatch | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const suggestion = value as AutocompleteSuggestion
  if (cleanType(suggestion.type) !== 'accommodation') return undefined

  // Do not normalize the provider CID before comparison. Leading zeroes,
  // numeric JSON values (which may lose 64-bit precision), and malformed text
  // are rejected instead of being treated as the expected Google identity.
  const dataCid = cleanProviderDataCid(suggestion.data_cid)
  if (!dataCid || dataCid !== expectedDataCid) return undefined

  const propertyToken = cleanPropertyToken(suggestion.property_token)
  const canonicalName = cleanDisplayText(suggestion.value, 160)
  if (!propertyToken || !canonicalName) return undefined
  return {
    propertyToken,
    canonicalName,
    location: cleanDisplayText(suggestion.location, 240),
    dataCid,
  }
}

function buildAutocompleteSearchNames(hotelName: unknown, alternateHotelNames: unknown) {
  const primary = cleanDisplayText(hotelName, 160)
  const aliases = Array.isArray(alternateHotelNames)
    ? alternateHotelNames.slice(0, 6).map((value) => cleanDisplayText(value, 160)).filter(Boolean)
    : []
  return buildHotelAffiliateSearchNames({
    googlePlaceName: primary,
    alternateNames: aliases,
    maxNames: 3,
  })
}

function buildAutocompleteQuery(hotelName: string, city: string) {
  if (!hotelName) return ''
  const normalizedHotelName = normalizeComparableText(hotelName)
  const normalizedCity = normalizeComparableText(city)
  const suffix = city && normalizedCity && !normalizedHotelName.includes(normalizedCity) ? ` ${city}` : ''
  return `${hotelName}${suffix}`.slice(0, 180).trim()
}

function resolveExpectedDataCid(expectedDataCid: unknown, googleMapsDataId: unknown) {
  const directCid = cleanExpectedDataCid(expectedDataCid)
  const dataIdCid = googleMapsCidFromDataId(googleMapsDataId)
  if (directCid && dataIdCid && directCid !== dataIdCid) return ''
  return directCid || dataIdCid
}

function cleanExpectedDataCid(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim()
  if (!/^[1-9]\d{0,19}$/.test(clean)) return ''
  try {
    return BigInt(clean) <= MAX_UINT64 ? clean : ''
  } catch {
    return ''
  }
}

function googleMapsCidFromDataId(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim().toLowerCase()
  const match = /^0x[0-9a-f]{6,32}:0x([0-9a-f]{1,16})$/.exec(clean)
  if (!match) return ''
  try {
    const cid = BigInt(`0x${match[1]}`)
    return cid > ZERO_BIGINT && cid <= MAX_UINT64 ? cid.toString(10) : ''
  } catch {
    return ''
  }
}

function cleanProviderDataCid(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim()
  return clean === value && /^[1-9]\d{0,19}$/.test(clean) ? clean : ''
}

function cleanPropertyToken(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim()
  return /^[A-Za-z0-9_-]{8,512}$/.test(clean) ? clean : ''
}

function cleanDisplayText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  const clean = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return clean && /[\p{L}\p{N}]/u.test(clean) ? clean.slice(0, maxLength) : ''
}

function cleanCountryCode(value: unknown) {
  if (typeof value !== 'string') return ''
  const clean = value.trim().toUpperCase()
  return /^[A-Z]{2}$/.test(clean) ? clean : ''
}

function cleanType(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function cleanStatus(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 40) : ''
}

function cleanError(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 80) : ''
}

function normalizeComparableText(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
}

function readCachedDiscovery(cacheKey: string) {
  const cached = discoveryCache.get(cacheKey)
  if (!cached) return undefined
  if (cached.expiresAt <= Date.now()) {
    discoveryCache.delete(cacheKey)
    return undefined
  }
  return cached.discovery
}

function rememberDiscovery(cacheKey: string, discovery: GoogleHotelsAutocompleteDiscovery) {
  discoveryCache.delete(cacheKey)
  discoveryCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, discovery })
  while (discoveryCache.size > CACHE_MAX_ENTRIES) {
    const oldestKey = discoveryCache.keys().next().value
    if (typeof oldestKey !== 'string') break
    discoveryCache.delete(oldestKey)
  }
}

function withRequestCount(discovery: GoogleHotelsAutocompleteDiscovery, requestCount: number) {
  return {
    ...discovery,
    ...(discovery.bestMatch ? { bestMatch: { ...discovery.bestMatch } } : {}),
    requestCount,
  }
}
