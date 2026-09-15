import { buildHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import {
  buildTripAffiliateUrlForHotelId,
  evaluateTripAffiliateCandidateMatch,
  getTripAffiliatePublicConfig,
  type TripAffiliateHotelCandidate,
  type TripAffiliateSearchInput,
  type TripAffiliateSearchResponse,
} from '@/lib/tripAffiliate'
import { fetchPlannerSerpApi, plannerSerpApiIsEnabled } from '@/lib/serpApiGuard'

const REQUEST_TIMEOUT_MS = 12_000
const MAX_GOOGLE_HOTELS_REQUESTS = 2
const HIT_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MISS_CACHE_TTL_MS = 60 * 60 * 1000
const REVIEW_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const CACHE_MAX_ENTRIES = 256

type GoogleHotelsCoordinates = {
  latitude?: unknown
  longitude?: unknown
}

type GoogleHotelsProperty = {
  name?: unknown
  property_token?: unknown
  gps_coordinates?: GoogleHotelsCoordinates
  prices?: unknown
  featured_prices?: unknown
}

type GoogleHotelsPayload = GoogleHotelsProperty & {
  error?: unknown
  search_metadata?: { status?: unknown }
  properties?: unknown
  property_results?: unknown
  hotel?: unknown
}

type CleanGoogleHotelsProperty = {
  name: string
  propertyToken: string
  latitude?: number
  longitude?: number
  prices: unknown[]
}

type DateRange = {
  checkInDate: string
  checkOutDate: string
}

type DiscoveryOutcome = {
  matchStatus: 'matched' | 'needs_review' | 'no_match'
  bestMatch?: TripAffiliateHotelCandidate
  candidates: TripAffiliateHotelCandidate[]
  requestCount: number
  searchUrl: string
}

const resultCache = new Map<string, { expiresAt: number; response: TripAffiliateSearchResponse }>()
const resultRequests = new Map<string, Promise<TripAffiliateSearchResponse>>()

/**
 * Finds Trip's own hotel ID from the booking sources attached to an exact
 * Google Hotels property.  The general web search remains available as a
 * separate outage fallback, but it is deliberately not mixed into a normal
 * no-match: Google Hotels is both more precise and bounded to two requests.
 */
export async function searchTripAffiliateHotelsWithGoogleHotels(
  input: TripAffiliateSearchInput,
): Promise<TripAffiliateSearchResponse | null> {
  const publicConfig = getTripAffiliatePublicConfig()
  const apiKey = process.env.SERPAPI_API_KEY?.trim() ?? ''
  if (publicConfig.searchProvider !== 'serpapi' || !apiKey || !plannerSerpApiIsEnabled()) return null

  const hotelNames = buildHotelAffiliateSearchNames({
    googlePlaceName: input.hotelName,
    alternateNames: input.alternateHotelNames,
    maxNames: 3,
  })
  const hotelName = hotelNames[0] ?? input.hotelName.trim().slice(0, 160)
  const alternateHotelNames = hotelNames.slice(1)
  const latitude = cleanCoordinate(input.latitude, -90, 90)
  const longitude = cleanCoordinate(input.longitude, -180, 180)
  const city = cleanText(input.city, 80)
  const countryCode = cleanText(input.countryCode, 2).toUpperCase()
  const googlePlaceId = cleanText(input.googlePlaceId, 180)
  const maxResult = cleanInteger(input.maxResult, 5, 1, 10)
  const query: TripAffiliateSearchResponse['query'] = {
    hotelName,
    alternateHotelNames,
    ...(googlePlaceId ? { googlePlaceId } : {}),
    ...(city ? { city } : {}),
    ...(countryCode ? { countryCode } : {}),
    ...(latitude != null ? { latitude } : {}),
    ...(longitude != null ? { longitude } : {}),
    maxResult,
  }
  const configuredResponse = () => ({
    configured: true,
    allianceId: publicConfig.allianceId,
    sid: publicConfig.sid,
    sub3: publicConfig.sub3,
    searchProvider: 'serpapi' as const,
    query,
    discoveryMethod: 'google_hotels' as const,
  })
  const dateRanges = buildDateRanges(input.checkInDate, input.checkOutDate)
  const cacheKey = googleHotelsCacheKey(query, dateRanges[0])
  // Force refresh only bypasses the browser cooldown. Reusing the server result
  // is mandatory for a metered provider.
  const cached = readCachedResult(cacheKey)
  if (cached) return { ...cached, providerRequestCount: 0 }
  const activeRequest = resultRequests.get(cacheKey)
  if (activeRequest) return activeRequest

  const request = (async (): Promise<TripAffiliateSearchResponse> => {
    try {
      const outcome = await discoverTripHotelFromGoogleHotels({
        apiKey,
        input,
        query,
        dateRanges,
        allianceId: publicConfig.allianceId,
        sid: publicConfig.sid,
        sub1: publicConfig.sub1,
        sub3: publicConfig.sub3,
      })
      const response: TripAffiliateSearchResponse = {
        ...configuredResponse(),
        matchStatus: outcome.matchStatus,
        confidence: outcome.matchStatus === 'matched' ? 'high' : outcome.matchStatus === 'needs_review' ? 'review' : 'none',
        ...(outcome.bestMatch ? { bestMatch: outcome.bestMatch } : {}),
        candidates: outcome.candidates.slice(0, maxResult),
        rawCount: outcome.candidates.length,
        searchUrl: outcome.searchUrl,
        providerRequestCount: outcome.requestCount,
      }
      writeCachedResult(cacheKey, response)
      return response
    } catch (error) {
      return {
        ...configuredResponse(),
        matchStatus: 'search_error',
        confidence: 'none',
        candidates: [],
        rawCount: 0,
        error: error instanceof Error ? error.message.slice(0, 120) : 'google_hotels_search_failed',
        searchUrl: buildGoogleHotelsBrowserUrl(hotelName, city),
        providerRequestCount: 0,
      }
    }
  })()
  resultRequests.set(cacheKey, request)
  try {
    return await request
  } finally {
    if (resultRequests.get(cacheKey) === request) resultRequests.delete(cacheKey)
  }
}

async function discoverTripHotelFromGoogleHotels(options: {
  apiKey: string
  input: TripAffiliateSearchInput
  query: TripAffiliateSearchResponse['query']
  dateRanges: DateRange[]
  allianceId: string
  sid: string
  sub1: string
  sub3: string
}): Promise<DiscoveryOutcome> {
  const { apiKey, input, query, dateRanges } = options
  const searchUrl = buildGoogleHotelsBrowserUrl(query.hotelName, query.city)
  let requestCount = 0
  let selectedProperty: CleanGoogleHotelsProperty | null = null
  let selectedEvaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch> | null = null

  for (const hotelName of [query.hotelName, ...query.alternateHotelNames]) {
    if (requestCount >= MAX_GOOGLE_HOTELS_REQUESTS) break
    const payload = await fetchGoogleHotels(apiKey, {
      hotelName,
      city: query.city,
      countryCode: query.countryCode,
      dateRange: dateRanges[0],
    })
    requestCount += 1
    const match = selectGoogleHotelsProperty(payload, query)
    if (!match) continue
    selectedProperty = match.property
    selectedEvaluation = match.evaluation
    break
  }

  if (!selectedProperty || !selectedEvaluation) {
    return { matchStatus: 'no_match', candidates: [], requestCount, searchUrl }
  }

  const directCandidate = tripCandidateFromGoogleHotelsProperty(selectedProperty, selectedEvaluation, options, query)
  if (directCandidate) {
    return candidateOutcome(directCandidate, selectedEvaluation, requestCount, searchUrl)
  }

  if (!selectedProperty.propertyToken) {
    return { matchStatus: 'no_match', candidates: [], requestCount, searchUrl }
  }

  for (const dateRange of dateRanges) {
    if (requestCount >= MAX_GOOGLE_HOTELS_REQUESTS) break
    const payload = await fetchGoogleHotels(apiKey, {
      hotelName: query.hotelName,
      city: query.city,
      countryCode: query.countryCode,
      dateRange,
      propertyToken: selectedProperty.propertyToken,
    })
    requestCount += 1
    const detailedProperty = readTopLevelProperty(payload) ?? selectedProperty
    const mergedProperty: CleanGoogleHotelsProperty = {
      ...selectedProperty,
      ...detailedProperty,
      name: detailedProperty.name || selectedProperty.name,
      propertyToken: detailedProperty.propertyToken || selectedProperty.propertyToken,
      latitude: detailedProperty.latitude ?? selectedProperty.latitude,
      longitude: detailedProperty.longitude ?? selectedProperty.longitude,
      prices: detailedProperty.prices.length > 0 ? detailedProperty.prices : selectedProperty.prices,
    }
    const evaluation = evaluateGoogleHotelsProperty(mergedProperty, query)
    if (!isReviewableGoogleHotelsMatch(evaluation, mergedProperty, query)) continue
    const candidate = tripCandidateFromGoogleHotelsProperty(mergedProperty, evaluation, options, query)
    if (candidate) return candidateOutcome(candidate, evaluation, requestCount, searchUrl)
  }

  return { matchStatus: 'no_match', candidates: [], requestCount, searchUrl }
}

function candidateOutcome(
  candidate: TripAffiliateHotelCandidate,
  evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>,
  requestCount: number,
  searchUrl: string,
): DiscoveryOutcome {
  const matchStatus = evaluation.matchStatus === 'matched' ? 'matched' : 'needs_review'
  return { matchStatus, bestMatch: candidate, candidates: [candidate], requestCount, searchUrl }
}

async function fetchGoogleHotels(
  apiKey: string,
  input: {
    hotelName: string
    city?: string
    countryCode?: string
    dateRange: DateRange
    propertyToken?: string
  },
) {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_hotels')
  url.searchParams.set('q', [input.hotelName, input.city].filter(Boolean).join(' '))
  url.searchParams.set('check_in_date', input.dateRange.checkInDate)
  url.searchParams.set('check_out_date', input.dateRange.checkOutDate)
  url.searchParams.set('adults', '2')
  url.searchParams.set('children', '0')
  url.searchParams.set('currency', 'TWD')
  url.searchParams.set('hl', 'en')
  url.searchParams.set('gl', googleCountryCode(input.countryCode))
  if (input.propertyToken) url.searchParams.set('property_token', input.propertyToken)
  url.searchParams.set('api_key', apiKey)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetchPlannerSerpApi(url, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error(`serpapi_google_hotels_${response.status}`)
    const payload = (await response.json()) as GoogleHotelsPayload
    if (typeof payload.error === 'string' && payload.error.trim()) {
      throw new Error(`serpapi_google_hotels_${payload.error.trim().slice(0, 80)}`)
    }
    const status = typeof payload.search_metadata?.status === 'string'
      ? payload.search_metadata.status.trim().toLowerCase()
      : ''
    if (status && status !== 'success') throw new Error(`serpapi_google_hotels_${status.slice(0, 40)}`)
    return payload
  } finally {
    clearTimeout(timeout)
  }
}

function selectGoogleHotelsProperty(
  payload: GoogleHotelsPayload,
  query: TripAffiliateSearchResponse['query'],
) {
  const properties = [
    readTopLevelProperty(payload),
    ...readPropertyList(payload.properties),
    ...readPropertyList(payload.property_results),
    ...readPropertyList(payload.hotel),
  ].filter((property): property is CleanGoogleHotelsProperty => Boolean(property))

  return properties
    .map((property) => ({ property, evaluation: evaluateGoogleHotelsProperty(property, query) }))
    .filter(({ property, evaluation }) => isReviewableGoogleHotelsMatch(evaluation, property, query))
    .sort((left, right) => {
      const leftMatched = left.evaluation.matchStatus === 'matched' ? 1 : 0
      const rightMatched = right.evaluation.matchStatus === 'matched' ? 1 : 0
      if (leftMatched !== rightMatched) return rightMatched - leftMatched
      if (left.evaluation.score !== right.evaluation.score) return right.evaluation.score - left.evaluation.score
      return propertyDistanceKm(left.property, query) - propertyDistanceKm(right.property, query)
    })[0] ?? null
}

function evaluateGoogleHotelsProperty(
  property: CleanGoogleHotelsProperty,
  query: TripAffiliateSearchResponse['query'],
) {
  return evaluateTripAffiliateCandidateMatch({
    hotelName: query.hotelName,
    alternateHotelNames: query.alternateHotelNames,
    city: query.city,
    countryCode: query.countryCode,
    latitude: query.latitude,
    longitude: query.longitude,
    candidateTitle: property.name,
    candidateName: property.name,
    candidateLatitude: property.latitude,
    candidateLongitude: property.longitude,
    rankIndex: 0,
  })
}

function isReviewableGoogleHotelsMatch(
  evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>,
  _property: CleanGoogleHotelsProperty,
  _query: TripAffiliateSearchResponse['query'],
) {
  // Coordinates can identify a building, but not two hotel branches or
  // separately sold apartments in that building. Require the existing strict
  // name/branch verifier before accepting an external Trip ID.
  return evaluation.matchStatus === 'matched'
}

function tripCandidateFromGoogleHotelsProperty(
  property: CleanGoogleHotelsProperty,
  evaluation: ReturnType<typeof evaluateTripAffiliateCandidateMatch>,
  options: {
    input: TripAffiliateSearchInput
    allianceId: string
    sid: string
    sub1: string
    sub3: string
  },
  query: TripAffiliateSearchResponse['query'],
) {
  const destination = findTripDestination(property.prices)
  if (!destination) return null
  const bookingUrl = buildTripAffiliateUrlForHotelId(destination.hotelId, {
    allianceId: options.allianceId,
    sid: options.sid,
    tripSub1: options.input.tripSub1 ?? options.sub1,
    tripSub3: options.input.tripSub3 ?? options.sub3,
  })
  if (!bookingUrl) return null
  const distance = propertyDistanceKm(property, query)
  return {
    hotelId: destination.hotelId,
    hotelName: property.name,
    score: evaluation.score,
    bookingUrl,
    source: 'serpapi' as const,
    originalUrl: destination.url,
    title: property.name,
    ...(property.latitude != null ? { latitude: property.latitude } : {}),
    ...(property.longitude != null ? { longitude: property.longitude } : {}),
    ...(Number.isFinite(distance) ? { distanceKm: Number(distance.toFixed(3)) } : {}),
  }
}

function findTripDestination(prices: unknown[]) {
  const entries = collectPriceEntries(prices)
  for (const entry of entries) {
    const source = cleanText(entry.source, 80).toLowerCase()
    if (source !== 'trip.com') continue
    for (const rawLink of [entry.link, entry.booking_link, entry.url]) {
      const destination = decodeTripDestination(rawLink)
      if (destination) return destination
    }
  }
  return null
}

function collectPriceEntries(value: unknown, depth = 0): Record<string, unknown>[] {
  if (depth > 3) return []
  if (Array.isArray(value)) return value.flatMap((entry) => collectPriceEntries(entry, depth + 1))
  if (!value || typeof value !== 'object') return []
  const record = value as Record<string, unknown>
  const entries = 'source' in record ? [record] : []
  for (const key of ['prices', 'featured_prices', 'offers', 'rates']) {
    if (key in record) entries.push(...collectPriceEntries(record[key], depth + 1))
  }
  return entries
}

function decodeTripDestination(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null
  const queue = [value.trim().replace(/&amp;/g, '&')]
  const seen = new Set<string>()
  while (queue.length > 0 && seen.size < 12) {
    const candidate = queue.shift() as string
    if (!candidate || seen.has(candidate)) continue
    seen.add(candidate)
    try {
      const url = new URL(candidate)
      if (isTripHost(url.hostname) && url.pathname.toLowerCase().includes('/hotels/')) {
        const hotelId = tripHotelIdFromAnyUrl(url)
        if (hotelId) return { hotelId, url: url.toString() }
      }
      for (const [key, nested] of url.searchParams) {
        if (['pcurl', 'url', 'q', 'adurl', 'redirect', 'redirect_url'].includes(key.toLowerCase()) && nested) {
          queue.push(nested)
        }
      }
    } catch {
      // Some Google redirect parameters are still encoded one extra time.
    }
    try {
      const decoded = decodeURIComponent(candidate)
      if (decoded !== candidate) queue.push(decoded)
    } catch {
      // Ignore malformed percent escapes from an external provider.
    }
  }
  return null
}

function tripHotelIdFromAnyUrl(url: URL) {
  for (const [key, value] of url.searchParams) {
    if (['hotelid', 'hotel_id'].includes(key.toLowerCase()) && /^\d{3,}$/.test(value.trim())) return value.trim()
  }
  return url.pathname.match(/hotel-detail-(\d{3,})/i)?.[1] ?? ''
}

function isTripHost(hostname: string) {
  const clean = hostname.toLowerCase().replace(/\.$/, '')
  return clean === 'trip.com' || clean.endsWith('.trip.com')
}

function readTopLevelProperty(payload: GoogleHotelsPayload) {
  return readProperty(payload)
}

function readPropertyList(value: unknown) {
  if (Array.isArray(value)) return value.map(readProperty).filter((item): item is CleanGoogleHotelsProperty => Boolean(item))
  const property = readProperty(value)
  return property ? [property] : []
}

function readProperty(value: unknown): CleanGoogleHotelsProperty | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const property = value as GoogleHotelsProperty
  const name = cleanText(property.name, 160)
  if (!name) return null
  const latitude = cleanCoordinate(property.gps_coordinates?.latitude, -90, 90)
  const longitude = cleanCoordinate(property.gps_coordinates?.longitude, -180, 180)
  return {
    name,
    propertyToken: cleanText(property.property_token, 500),
    ...(latitude != null ? { latitude } : {}),
    ...(longitude != null ? { longitude } : {}),
    prices: [property.prices, property.featured_prices].filter((entry) => entry != null),
  }
}

function propertyDistanceKm(
  property: Pick<CleanGoogleHotelsProperty, 'latitude' | 'longitude'>,
  query: Pick<TripAffiliateSearchResponse['query'], 'latitude' | 'longitude'>,
) {
  if (
    property.latitude == null ||
    property.longitude == null ||
    query.latitude == null ||
    query.longitude == null
  ) return Number.POSITIVE_INFINITY
  const radiusKm = 6371
  const toRadians = (value: number) => value * Math.PI / 180
  const dLat = toRadians(property.latitude - query.latitude)
  const dLng = toRadians(property.longitude - query.longitude)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(query.latitude)) * Math.cos(toRadians(property.latitude)) * Math.sin(dLng / 2) ** 2
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function buildDateRanges(checkInValue?: string, checkOutValue?: string) {
  const ranges: DateRange[] = []
  const explicitCheckIn = parseDate(checkInValue)
  const explicitCheckOut = parseDate(checkOutValue)
  const today = startUtcDay(new Date())
  if (explicitCheckIn && explicitCheckOut && explicitCheckIn >= today && explicitCheckOut > explicitCheckIn) {
    ranges.push({ checkInDate: formatDate(explicitCheckIn), checkOutDate: formatDate(explicitCheckOut) })
  }
  for (const offset of [30, 75, 150]) {
    const checkIn = addUtcDays(today, offset)
    const checkOut = addUtcDays(checkIn, 1)
    const range = { checkInDate: formatDate(checkIn), checkOutDate: formatDate(checkOut) }
    if (!ranges.some((item) => item.checkInDate === range.checkInDate && item.checkOutDate === range.checkOutDate)) {
      ranges.push(range)
    }
    if (ranges.length >= 3) break
  }
  return ranges
}

function parseDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) || formatDate(date) !== value ? null : date
}

function startUtcDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()))
}

function addUtcDays(value: Date, days: number) {
  return new Date(value.getTime() + days * 24 * 60 * 60 * 1000)
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

function googleHotelsCacheKey(query: TripAffiliateSearchResponse['query'], dateRange: DateRange) {
  return [
    'google-hotels-v1',
    query.googlePlaceId || '',
    normalizeText(query.hotelName),
    query.latitude?.toFixed(5) ?? '',
    query.longitude?.toFixed(5) ?? '',
    dateRange.checkInDate,
    dateRange.checkOutDate,
  ].join('|')
}

function readCachedResult(key: string) {
  const cached = resultCache.get(key)
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) {
    resultCache.delete(key)
    return null
  }
  resultCache.delete(key)
  resultCache.set(key, cached)
  return cached.response
}

function writeCachedResult(key: string, response: TripAffiliateSearchResponse) {
  const ttl = response.matchStatus === 'matched'
    ? HIT_CACHE_TTL_MS
    : response.matchStatus === 'needs_review'
      ? REVIEW_CACHE_TTL_MS
      : MISS_CACHE_TTL_MS
  resultCache.delete(key)
  resultCache.set(key, { expiresAt: Date.now() + ttl, response })
  while (resultCache.size > CACHE_MAX_ENTRIES) {
    const oldest = resultCache.keys().next().value
    if (typeof oldest !== 'string') break
    resultCache.delete(oldest)
  }
}

function buildGoogleHotelsBrowserUrl(hotelName: string, city?: string) {
  const url = new URL('https://www.google.com/travel/hotels')
  url.searchParams.set('q', [hotelName, city].filter(Boolean).join(' '))
  return url.toString()
}

function googleCountryCode(value?: string) {
  const countryCode = value?.trim().toLowerCase() ?? ''
  return /^[a-z]{2}$/.test(countryCode) ? countryCode : 'tw'
}

function cleanCoordinate(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isFinite(number) && number >= min && number <= max ? number : undefined
}

function cleanInteger(value: unknown, fallback: number, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isInteger(number) ? Math.max(min, Math.min(max, number)) : fallback
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizeText(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
}
