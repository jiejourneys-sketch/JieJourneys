import { buildHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import {
  bookingPropertyIdFromUrl,
  getBookingDestination,
  normalizePlannerAffiliateUrl,
} from '@/lib/plannerAffiliate'
import {
  fetchPlannerSerpApi,
  getPlannerSerpApiRequestMetadata,
  plannerSerpApiIsEnabled,
} from '@/lib/serpApiGuard'
import {
  evaluateTripAffiliateCandidateMatch,
  type TripAffiliateMatchStatus,
} from '@/lib/tripAffiliate'

const REQUEST_TIMEOUT_MS = 10_000
const HIT_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const MISS_CACHE_TTL_MS = 10 * 60 * 1000
const CACHE_MAX_ENTRIES = 128

export type BookingAffiliateSearchInput = {
  hotelName: string
  alternateHotelNames?: string[]
  googlePlaceId?: string
  googleMapsDataId?: string
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  forceRefresh?: boolean
  maxResult?: number
  checkInDate?: string
  checkOutDate?: string
}

export type BookingAffiliateHotelCandidate = {
  hotelId: string
  hotelName: string
  score: number
  bookingUrl: string
  source: 'verified' | 'serpapi'
  originalUrl: string
  title?: string
  snippet?: string
  latitude?: number
  longitude?: number
  distanceKm?: number
}

export type BookingAffiliateSearchResponse = {
  configured: boolean
  searchProvider: 'serpapi' | ''
  query: {
    hotelName: string
    alternateHotelNames: string[]
    googlePlaceId?: string
    city?: string
    countryCode?: string
    latitude?: number
    longitude?: number
    maxResult: number
  }
  matchStatus: TripAffiliateMatchStatus
  confidence?: 'verified' | 'high' | 'review' | 'none'
  bestMatch?: BookingAffiliateHotelCandidate
  candidates: BookingAffiliateHotelCandidate[]
  rawCount?: number
  error?: string
  searchUrl?: string
  discoveryMethod?: 'verified' | 'google_hotels' | 'web_search'
  providerRequestCount?: number
}

type BookingSearchResult = {
  url: string
  title: string
  snippet: string
  position: number
}

type BookingSearchOutcome = {
  results: BookingSearchResult[]
  providerRequestCount: number
}

class BookingSearchError extends Error {
  readonly providerRequestCount: number

  constructor(error: unknown, providerRequestCount: number) {
    super(error instanceof Error ? error.message : 'booking_search_failed')
    this.name = 'BookingSearchError'
    this.providerRequestCount = providerRequestCount
  }
}

const resultCache = new Map<string, { expiresAt: number; results: BookingSearchResult[] }>()
const activeRequests = new Map<string, Promise<BookingSearchResult[]>>()

export function getBookingAffiliatePublicConfig() {
  const configured = Boolean(process.env.SERPAPI_API_KEY?.trim()) && plannerSerpApiIsEnabled()
  return { configured, searchProvider: configured ? 'serpapi' as const : '' as const }
}

export function buildBookingAffiliateUrl(sourceUrl: string | URL) {
  try {
    const source = typeof sourceUrl === 'string' ? new URL(sourceUrl) : sourceUrl
    const destination = getBookingDestination(source)
    if (!destination || !bookingPropertyIdFromUrl(destination)) return ''
    return normalizePlannerAffiliateUrl(destination) ?? ''
  } catch {
    return ''
  }
}

export async function searchBookingAffiliateHotels(
  input: BookingAffiliateSearchInput,
): Promise<BookingAffiliateSearchResponse> {
  const config = getBookingAffiliatePublicConfig()
  const names = buildHotelAffiliateSearchNames({
    googlePlaceName: input.hotelName,
    alternateNames: input.alternateHotelNames,
    maxNames: 3,
  })
  const hotelName = names[0] ?? input.hotelName.trim().slice(0, 160)
  const alternateHotelNames = names.slice(1)
  const query: BookingAffiliateSearchResponse['query'] = {
    hotelName,
    alternateHotelNames,
    ...(cleanText(input.googlePlaceId, 180) ? { googlePlaceId: cleanText(input.googlePlaceId, 180) } : {}),
    ...(cleanText(input.city, 80) ? { city: cleanText(input.city, 80) } : {}),
    ...(cleanCountryCode(input.countryCode) ? { countryCode: cleanCountryCode(input.countryCode) } : {}),
    ...(cleanCoordinate(input.latitude, -90, 90) != null ? { latitude: cleanCoordinate(input.latitude, -90, 90) } : {}),
    ...(cleanCoordinate(input.longitude, -180, 180) != null ? { longitude: cleanCoordinate(input.longitude, -180, 180) } : {}),
    maxResult: cleanInteger(input.maxResult, 5, 1, 10),
  }
  const base = {
    configured: config.configured,
    searchProvider: config.searchProvider,
    query,
    discoveryMethod: 'web_search' as const,
  }
  if (!config.configured) {
    return {
      ...base,
      matchStatus: 'not_configured',
      confidence: 'none',
      candidates: [],
      rawCount: 0,
      providerRequestCount: 0,
      error: 'booking_search_provider_missing',
      searchUrl: bookingSearchUrl(hotelName),
    }
  }

  let providerRequestCount = 0
  try {
    const searchOutcome = await searchBookingResults(query)
    const results = searchOutcome.results
    providerRequestCount = searchOutcome.providerRequestCount
    const candidates = results.flatMap((result) => {
      const parsed = parseBookingPropertyUrl(result.url)
      if (!parsed) return []
      const hotelId = bookingPropertyIdFromUrl(parsed)
      const candidateName = cleanBookingTitle(result.title) || hotelName
      const evaluation = evaluateTripAffiliateCandidateMatch({
        hotelName,
        alternateHotelNames,
        city: query.city,
        countryCode: query.countryCode,
        latitude: query.latitude,
        longitude: query.longitude,
        candidateTitle: candidateName,
        candidateName,
        candidateSnippet: result.snippet,
        candidateUrl: parsed.toString(),
        rankIndex: Math.max(0, result.position - 1),
      })
      const bookingUrl = buildBookingAffiliateUrl(parsed)
      if (!hotelId || !bookingUrl || evaluation.score < 0.55) return []
      return [{
        hotelId,
        hotelName: candidateName,
        score: evaluation.score,
        bookingUrl,
        source: 'serpapi' as const,
        originalUrl: parsed.toString(),
        title: result.title,
        snippet: result.snippet,
        matchStatus: evaluation.matchStatus,
      }]
    })
      .sort((left, right) => {
        const leftMatched = left.matchStatus === 'matched' ? 1 : 0
        const rightMatched = right.matchStatus === 'matched' ? 1 : 0
        return rightMatched - leftMatched || right.score - left.score
      })
      .filter((candidate, index, all) => all.findIndex((item) => item.hotelId === candidate.hotelId) === index)
      .slice(0, query.maxResult)
    const best = candidates[0]
    const matchStatus: TripAffiliateMatchStatus = best?.matchStatus === 'matched'
      ? 'matched'
      : best?.score != null && best.score >= 0.68
        ? 'needs_review'
        : 'no_match'
    const cleanCandidates = candidates.map(({ matchStatus: _matchStatus, ...candidate }) => candidate)
    return {
      ...base,
      matchStatus,
      confidence: matchStatus === 'matched' ? 'high' : matchStatus === 'needs_review' ? 'review' : 'none',
      ...(cleanCandidates[0] ? { bestMatch: cleanCandidates[0] } : {}),
      candidates: cleanCandidates,
      rawCount: results.length,
      providerRequestCount,
      searchUrl: bookingSearchUrl(hotelName),
    }
  } catch (error) {
    if (error instanceof BookingSearchError) providerRequestCount = error.providerRequestCount
    return {
      ...base,
      matchStatus: 'search_error',
      confidence: 'none',
      candidates: [],
      rawCount: 0,
      providerRequestCount,
      error: error instanceof Error ? error.message.slice(0, 120) : 'booking_search_failed',
      searchUrl: bookingSearchUrl(hotelName),
    }
  }
}

async function searchBookingResults(
  query: BookingAffiliateSearchResponse['query'],
): Promise<BookingSearchOutcome> {
  const cacheKey = [
    'booking-v2',
    query.countryCode ?? '',
    normalizeText(query.city ?? ''),
    ...bookingOrganicSearchNames(query).map(normalizeText),
  ].join('|')
  const cached = resultCache.get(cacheKey)
  // A user recheck may bypass the browser cooldown, but it must not turn the
  // same provider query into another paid request while this server result is
  // still fresh.
  if (cached && cached.expiresAt > Date.now()) {
    return { results: cached.results, providerRequestCount: 0 }
  }
  if (cached) resultCache.delete(cacheKey)
  const active = activeRequests.get(cacheKey)
  if (active) {
    try {
      return { results: await active, providerRequestCount: 0 }
    } catch (error) {
      // This caller shared work started by another request, so the provider
      // attempt belongs only to the owner even when that shared work fails.
      throw new BookingSearchError(error, 0)
    }
  }

  let providerRequestCount = 0
  const request = (async () => {
    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'google')
    url.searchParams.set('q', bookingOrganicSearchQuery(query))
    url.searchParams.set('hl', 'en')
    url.searchParams.set('gl', query.countryCode?.toLowerCase() || 'tw')
    // SerpAPI charges per successful search rather than per returned result.
    // Inspect a wider first page before spending another search credit.
    url.searchParams.set('num', '30')
    url.searchParams.set('api_key', process.env.SERPAPI_API_KEY?.trim() ?? '')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetchPlannerSerpApi(url, { cache: 'no-store', signal: controller.signal })
      providerRequestCount = plannerSerpApiSearchAttemptCount(response)
      if (!response.ok) throw new Error(`serpapi_${response.status}`)
      const payload = await response.json() as {
        error?: unknown
        search_metadata?: { status?: unknown }
        organic_results?: Array<{ link?: unknown; title?: unknown; snippet?: unknown; position?: unknown }>
      }
      if (typeof payload.error === 'string' && payload.error.trim()) throw new Error(`serpapi_${payload.error.trim().slice(0, 80)}`)
      const status = typeof payload.search_metadata?.status === 'string' ? payload.search_metadata.status.toLowerCase() : ''
      if (status && status !== 'success') throw new Error(`serpapi_${status.slice(0, 40)}`)
      const results = (payload.organic_results ?? []).map((item, index) => ({
        url: typeof item.link === 'string' ? item.link : '',
        title: typeof item.title === 'string' ? item.title : '',
        snippet: typeof item.snippet === 'string' ? item.snippet : '',
        position: typeof item.position === 'number' ? Math.max(1, Math.round(item.position)) : index + 1,
      })).filter((item) => item.url)
      remember(cacheKey, results)
      return results
    } catch (error) {
      // Network failures carry the same central metadata on the thrown Error.
      // Guard rejections before `/search` fetch therefore remain zero.
      providerRequestCount = Math.max(providerRequestCount, plannerSerpApiSearchAttemptCount(error))
      throw error
    } finally {
      clearTimeout(timeout)
    }
  })()
  activeRequests.set(cacheKey, request)
  try {
    return { results: await request, providerRequestCount }
  } catch (error) {
    throw new BookingSearchError(error, providerRequestCount)
  } finally {
    if (activeRequests.get(cacheKey) === request) activeRequests.delete(cacheKey)
  }
}

function plannerSerpApiSearchAttemptCount(resultOrError: unknown) {
  return getPlannerSerpApiRequestMetadata(resultOrError)?.searchFetchAttempted ? 1 : 0
}

function bookingOrganicSearchQuery(query: BookingAffiliateSearchResponse['query']) {
  const countryPath = query.countryCode?.toLowerCase().match(/^[a-z]{2}$/)?.[0]
  const site = `site:booking.com/hotel/${countryPath ? `${countryPath}/` : ''}`
  const hotelNames = bookingOrganicSearchNames(query)
  const exactNames = hotelNames.map((hotelName) => `"${hotelName}"`)
  const exactNameQuery = exactNames.length > 1 ? `(${exactNames.join(' OR ')})` : exactNames[0]
  const city = query.city?.replace(/["\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
  const normalizedCity = normalizeText(city)
  const includeCity = city && !hotelNames.some((hotelName) => normalizeText(hotelName).includes(normalizedCity))
  return `${site} ${exactNameQuery}${includeCity ? ` ${city}` : ''}`
}

function bookingOrganicSearchNames(query: BookingAffiliateSearchResponse['query']) {
  const seen = new Set<string>()
  return [query.hotelName, ...query.alternateHotelNames]
    .map((hotelName) => hotelName.replace(/["\r\n]+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((hotelName) => {
      const key = normalizeText(hotelName)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 3)
}

function remember(cacheKey: string, results: BookingSearchResult[]) {
  const now = Date.now()
  resultCache.delete(cacheKey)
  resultCache.set(cacheKey, {
    expiresAt: now + (results.length > 0 ? HIT_CACHE_TTL_MS : MISS_CACHE_TTL_MS),
    results,
  })
  while (resultCache.size > CACHE_MAX_ENTRIES) {
    const oldest = resultCache.keys().next().value
    if (typeof oldest !== 'string') break
    resultCache.delete(oldest)
  }
}

function parseBookingPropertyUrl(value: string) {
  try {
    const url = new URL(value)
    const destination = getBookingDestination(url)
    return destination && bookingPropertyIdFromUrl(destination) ? destination : null
  } catch {
    return null
  }
}

function cleanBookingTitle(value: string) {
  return value
    .replace(/\s*[-|｜]\s*Booking\.com.*$/i, '')
    .replace(/\s*[-|｜]\s*(?:updated prices|reviews?|deals?|photos?).*$/i, '')
    // Some localized Google titles use "Property, City (localized 2026
    // prices)" without mentioning Booking.com. Remove only that tightly
    // bounded annual wrapper; normal commas inside hotel names remain intact.
    .replace(/,\s*[^,()]{2,80}\s*\([^()]*\b20\d{2}\b[^()]*\)\s*$/u, '')
    .replace(/^Book\s+/i, '')
    .trim()
    .slice(0, 160)
}

function bookingSearchUrl(hotelName: string) {
  const url = new URL('https://www.booking.com/searchresults.zh-tw.html')
  url.searchParams.set('ss', hotelName)
  return url.toString()
}

function normalizeText(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanCountryCode(value: unknown) {
  const code = cleanText(value, 2).toUpperCase()
  return /^[A-Z]{2}$/.test(code) ? code : ''
}

function cleanCoordinate(value: unknown, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : undefined
}

function cleanInteger(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isInteger(value) ? Math.max(min, Math.min(max, value)) : fallback
}
