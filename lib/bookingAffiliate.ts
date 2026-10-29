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
  alternateHotelNames?: string[]
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
  candidateCity?: string
  candidateCountryCode?: string
  latitude?: number
  longitude?: number
}

type BookingSearchOutcome = {
  results: BookingSearchResult[]
  providerRequestCount: number
}

type GroupedBookingSearchResult = {
  result: BookingSearchResult
  parsed: URL
  rankIndex: number
  candidateNames: string[]
}

type ScoredBookingCandidate = {
  candidate: BookingAffiliateHotelCandidate
  evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>
  rankIndex: number
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
    // Automatic discovery only needs the stable property page. Search and
    // Google Hotels URLs can contain stale stay dates or occupancy details;
    // sending those through would incorrectly make a valid property link look
    // dependent on a quote. Booking will ask the visitor for their own stay.
    const propertyPage = new URL(`https://www.booking.com${destination.pathname}`)
    return normalizePlannerAffiliateUrl(propertyPage) ?? ''
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
    let results: BookingSearchResult[] = []
    let scoredCandidates: ScoredBookingCandidate[] = []
    let classification = classifyBookingCandidates(scoredCandidates)
    const organicOutcome = await searchBookingResults(query, bookingOrganicSearchQuery(query))
    providerRequestCount += organicOutcome.providerRequestCount
    results = mergeBookingSearchResults(results, organicOutcome.results)
    scoredCandidates = bookingSearchResultsToCandidates(results, query)
    classification = classifyBookingCandidates(scoredCandidates)

    if (classification.matchStatus !== 'matched' && !classification.ambiguousRunnerUp) {
      // Google occasionally exposes a real Booking result only through an
      // opaque `/goto?url=...` token. Waiting longer cannot recover the stable
      // property path. Use SerpAPI's Booking directory once as the bounded
      // second request instead. Dates are intentionally omitted: this lookup
      // needs only the property URL and must not depend on price/availability.
      const directoryOutcome = await searchBookingDirectoryResults(query)
      providerRequestCount += directoryOutcome.providerRequestCount
      results = mergeBookingSearchResults(results, directoryOutcome.results)
      scoredCandidates = bookingSearchResultsToCandidates(results, query)
      classification = classifyBookingCandidates(scoredCandidates)
    }
    const matchStatus = classification.matchStatus
    const candidates = scoredCandidates.map(({ candidate }) => candidate)
    return {
      ...base,
      matchStatus,
      confidence: matchStatus === 'matched' ? 'high' : matchStatus === 'needs_review' ? 'review' : 'none',
      ...(candidates[0] ? { bestMatch: candidates[0] } : {}),
      candidates,
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

function classifyBookingCandidates(scoredCandidates: ScoredBookingCandidate[]) {
  const best = scoredCandidates[0]
  const runnerUp = scoredCandidates[1]
  const ambiguousRunnerUp = Boolean(
    best?.evaluation.matchStatus === 'matched' &&
    runnerUp?.evaluation.matchStatus === 'matched' &&
    best.candidate.score - runnerUp.candidate.score <= 0.08,
  )
  const matchStatus: TripAffiliateMatchStatus = best?.evaluation.matchStatus === 'matched' && !ambiguousRunnerUp
    ? 'matched'
    : best?.candidate.score != null && best.candidate.score >= 0.68
      ? 'needs_review'
      : 'no_match'
  return { matchStatus, ambiguousRunnerUp }
}

function mergeBookingSearchResults(
  current: BookingSearchResult[],
  incoming: BookingSearchResult[],
) {
  const seen = new Set<string>()
  return [...current, ...incoming].filter((result) => {
    const key = `${result.url.trim().toLowerCase()}|${normalizeText(result.title)}`
    if (!result.url || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function bookingSearchResultsToCandidates(
  results: BookingSearchResult[],
  query: BookingAffiliateSearchResponse['query'],
) {
  const groupedResults = new Map<string, GroupedBookingSearchResult[]>()

  results.forEach((result, index) => {
    const parsed = parseBookingPropertyUrl(result.url)
    if (!parsed) return
    const hotelId = bookingPropertyIdFromUrl(parsed)
    if (!hotelId) return
    const candidateNames = cleanBookingSearchResultIdentities(result.title, parsed)
    if (candidateNames.length === 0) return
    const existing = groupedResults.get(hotelId) ?? []
    existing.push({
      result,
      parsed,
      rankIndex: typeof result.position === 'number' ? Math.max(0, result.position - 1) : index,
      candidateNames,
    })
    groupedResults.set(hotelId, existing)
  })

  const candidates: ScoredBookingCandidate[] = []
  groupedResults.forEach((group, hotelId) => {
    const scoredIdentities = group.flatMap((entry) =>
      entry.candidateNames.map((candidateName) => ({
        ...entry,
        candidateName,
        evaluation: evaluateTripAffiliateCandidateMatch({
          hotelName: query.hotelName,
          alternateHotelNames: query.alternateHotelNames,
          city: query.city,
          countryCode: query.countryCode,
          latitude: query.latitude,
          longitude: query.longitude,
          candidateTitle: cleanBookingTitle(entry.result.title) || candidateName,
          candidateName,
          candidateSnippet: entry.result.snippet,
          candidateUrl: entry.parsed.toString(),
          candidateCity: entry.result.candidateCity,
          candidateCountryCode: entry.result.candidateCountryCode,
          candidateLatitude: entry.result.latitude,
          candidateLongitude: entry.result.longitude,
          rankIndex: entry.rankIndex,
        }),
      })),
    )
      .sort(compareBookingScoredIdentities)
    const best = scoredIdentities[0]
    if (!best || best.evaluation.score < 0.55) return

    const bookingUrl = buildBookingAffiliateUrl(best.parsed)
    if (!bookingUrl) return
    const allCandidateNames = cleanBookingIdentityList(group.flatMap((entry) => entry.candidateNames), 16)
    const displayName = cleanBookingTitle(best.result.title) || best.candidateName
    const alternateNames = allCandidateNames.filter(
      (candidateName) => normalizeText(candidateName) !== normalizeText(displayName),
    )
    candidates.push({
      candidate: {
        hotelId,
        hotelName: displayName,
        score: best.evaluation.score,
        bookingUrl,
        source: 'serpapi',
        originalUrl: best.parsed.toString(),
        title: best.result.title,
        snippet: best.result.snippet,
        ...(alternateNames.length > 0 ? { alternateHotelNames: alternateNames } : {}),
        ...(best.result.latitude != null ? { latitude: best.result.latitude } : {}),
        ...(best.result.longitude != null ? { longitude: best.result.longitude } : {}),
      },
      evaluation: best.evaluation,
      rankIndex: best.rankIndex,
    })
  })

  return candidates
    .sort(compareBookingCandidates)
    .slice(0, query.maxResult)
}

function compareBookingScoredIdentities(
  left: GroupedBookingSearchResult & {
    candidateName: string
    evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>
  },
  right: GroupedBookingSearchResult & {
    candidateName: string
    evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>
  },
) {
  const statusDifference = bookingMatchStatusRank(right.evaluation.matchStatus) - bookingMatchStatusRank(left.evaluation.matchStatus)
  if (statusDifference !== 0) return statusDifference
  if (left.evaluation.highConfidenceNameEvidence !== right.evaluation.highConfidenceNameEvidence) {
    return left.evaluation.highConfidenceNameEvidence ? -1 : 1
  }
  if (left.evaluation.nameSimilarity !== right.evaluation.nameSimilarity) {
    return right.evaluation.nameSimilarity - left.evaluation.nameSimilarity
  }
  if (left.evaluation.distinctiveNameCoverage !== right.evaluation.distinctiveNameCoverage) {
    return right.evaluation.distinctiveNameCoverage - left.evaluation.distinctiveNameCoverage
  }
  if (left.evaluation.score !== right.evaluation.score) return right.evaluation.score - left.evaluation.score
  return left.rankIndex - right.rankIndex
}

function compareBookingCandidates(left: ScoredBookingCandidate, right: ScoredBookingCandidate) {
  const statusDifference = bookingMatchStatusRank(right.evaluation.matchStatus) - bookingMatchStatusRank(left.evaluation.matchStatus)
  if (statusDifference !== 0) return statusDifference
  if (left.evaluation.highConfidenceNameEvidence !== right.evaluation.highConfidenceNameEvidence) {
    return left.evaluation.highConfidenceNameEvidence ? -1 : 1
  }
  if (left.candidate.score !== right.candidate.score) return right.candidate.score - left.candidate.score
  if (left.rankIndex !== right.rankIndex) return left.rankIndex - right.rankIndex
  return left.candidate.hotelId.localeCompare(right.candidate.hotelId)
}

function bookingMatchStatusRank(status: TripAffiliateMatchStatus) {
  if (status === 'matched') return 2
  if (status === 'needs_review') return 1
  return 0
}

async function searchBookingResults(
  query: BookingAffiliateSearchResponse['query'],
  searchQuery: string,
): Promise<BookingSearchOutcome> {
  const cacheKey = [
    'booking-v3',
    query.countryCode ?? '',
    searchQuery.toLowerCase(),
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
    url.searchParams.set('q', searchQuery)
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

async function searchBookingDirectoryResults(
  query: BookingAffiliateSearchResponse['query'],
): Promise<BookingSearchOutcome> {
  const searchQuery = query.hotelName.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
  const cacheKey = [
    'booking-directory-v1',
    query.countryCode ?? '',
    searchQuery.toLowerCase(),
  ].join('|')
  const cached = resultCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return { results: cached.results, providerRequestCount: 0 }
  }
  if (cached) resultCache.delete(cacheKey)
  const active = activeRequests.get(cacheKey)
  if (active) {
    try {
      return { results: await active, providerRequestCount: 0 }
    } catch (error) {
      throw new BookingSearchError(error, 0)
    }
  }

  let providerRequestCount = 0
  const request = (async () => {
    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'booking')
    url.searchParams.set('q', searchQuery)
    url.searchParams.set('hl', 'en-us')
    url.searchParams.set('limit', '25')
    url.searchParams.set('api_key', process.env.SERPAPI_API_KEY?.trim() ?? '')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetchPlannerSerpApi(url, { cache: 'no-store', signal: controller.signal })
      providerRequestCount = plannerSerpApiSearchAttemptCount(response)
      if (!response.ok) throw new Error(`serpapi_booking_${response.status}`)
      const payload = await response.json() as {
        error?: unknown
        search_metadata?: { status?: unknown }
        properties?: Array<{
          position?: unknown
          name?: unknown
          link?: unknown
          location?: unknown
          address?: unknown
          gps_coordinates?: { latitude?: unknown; longitude?: unknown }
        }>
      }
      if (typeof payload.error === 'string' && payload.error.trim()) {
        throw new Error(`serpapi_booking_${payload.error.trim().slice(0, 80)}`)
      }
      const status = typeof payload.search_metadata?.status === 'string'
        ? payload.search_metadata.status.toLowerCase()
        : ''
      if (status && status !== 'success') throw new Error(`serpapi_booking_${status.slice(0, 40)}`)

      const results = (payload.properties ?? []).map((property, index) => {
        const location = cleanText(property.location, 160)
        const address = cleanText(property.address, 240)
        const latitude = cleanCoordinate(property.gps_coordinates?.latitude, -90, 90)
        const longitude = cleanCoordinate(property.gps_coordinates?.longitude, -180, 180)
        return {
          url: cleanText(property.link, 2_000),
          title: cleanText(property.name, 160),
          snippet: [location, address].filter(Boolean).join(' · '),
          position: typeof property.position === 'number'
            ? Math.max(1, Math.round(property.position))
            : index + 1,
          ...(location ? { candidateCity: location } : {}),
          ...(query.countryCode ? { candidateCountryCode: query.countryCode } : {}),
          ...(latitude != null ? { latitude } : {}),
          ...(longitude != null ? { longitude } : {}),
        }
      }).filter((item) => item.url && item.title)
      remember(cacheKey, results)
      return results
    } catch (error) {
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
  return `${site} ${exactNameQuery}${bookingOrganicCitySuffix(query, hotelNames)}`
}

function bookingOrganicCitySuffix(
  query: BookingAffiliateSearchResponse['query'],
  hotelNames: string[],
) {
  const city = query.city?.replace(/["\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() ?? ''
  const normalizedCity = normalizeText(city)
  const includeCity = city && !hotelNames.some((hotelName) => normalizeText(hotelName).includes(normalizedCity))
  return includeCity ? ` ${city}` : ''
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

function cleanBookingSearchResultIdentities(title: string, url: URL) {
  const cleanedTitle = cleanBookingTitle(title)
  const titleAliases = cleanedTitle
    ? [
        cleanedTitle,
        ...Array.from(cleanedTitle.matchAll(/[（(]([^()（）]{2,120})[)）]/g))
          .map((match) => match[1]?.trim() ?? ''),
        ...cleanedTitle.split(/\s+(?:\/|[|｜])\s+/g),
      ]
    : []
  const propertySlug = bookingPropertySlugFromUrl(url)
  return cleanBookingIdentityList([...titleAliases, propertySlug], 12)
}

function bookingPropertySlugFromUrl(url: URL) {
  const hotelId = bookingPropertyIdFromUrl(url)
  const rawSlug = hotelId?.split('/').slice(1).join('/') ?? ''
  if (!rawSlug) return ''
  try {
    return decodeURIComponent(rawSlug).replace(/[-_]+/g, ' ').trim()
  } catch {
    return rawSlug.replace(/[-_]+/g, ' ').trim()
  }
}

function cleanBookingIdentityList(values: string[], maxNames: number) {
  const seen = new Set<string>()
  const names: string[] = []
  for (const value of values) {
    const name = value.replace(/\s+/g, ' ').trim().slice(0, 160)
    const key = normalizeText(name)
    if (!key || seen.has(key) || !/[\p{L}\p{N}]/u.test(name)) continue
    seen.add(key)
    names.push(name)
    if (names.length >= maxNames) break
  }
  return names
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
