import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  buildHotelAffiliateSearchNames,
  isUsableHotelAffiliateName,
} from '@/lib/hotelAffiliateIdentity'

const DEFAULT_AGODA_SITE_ID = '1945734'
const DEFAULT_AGODA_INDEX_PATH = path.join('data', 'agoda-planner-hotels-index.jsonl')
const DEFAULT_CURRENCY = 'TWD'
const DEFAULT_LANGUAGE = 'zh-tw'
const DEFAULT_MAX_RESULT = 30
const REQUEST_TIMEOUT_MS = 10000
const SEARCH_CACHE_TTL_MS = 1000 * 60 * 60 * 6
const EMPTY_SEARCH_CACHE_TTL_MS = 1000 * 60 * 10
const AGODA_SEARCH_CACHE_MAX_ENTRIES = 128
const MAX_HOTEL_NAME_LENGTH = 160
const MAX_ALTERNATE_HOTEL_NAMES = 8
const MAX_NUMERIC_IDENTITY_CONFLICT_SCORE = 0.77

export type AgodaAffiliateMatchStatus =
  | 'matched'
  | 'needs_review'
  | 'no_match'
  | 'needs_city_id'
  | 'api_error'
  | 'not_configured'

export type AgodaAffiliateSearchInput = {
  hotelName: string
  alternateHotelNames?: string[]
  googlePlaceId?: string
  cityId?: number
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  lodgingHint?: boolean
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  rooms?: number
  currency?: string
  language?: string
  maxResult?: number
  /** Bypass the short-lived web-search cache after an explicit user retry. */
  forceRefresh?: boolean
}

export type AgodaHotelIndexIdentityInput = Pick<
  AgodaAffiliateSearchInput,
  'hotelName' | 'alternateHotelNames' | 'countryCode' | 'latitude' | 'longitude' | 'lodgingHint'
>

export type AgodaHotelIndexIdentity = {
  hotelId: string
  canonicalNames: string[]
  city?: string
  countryCode?: string
  cityId?: number
  latitude?: number
  longitude?: number
}

export type AgodaAffiliateHotelCandidate = {
  hotelId: string
  hotelName: string
  score: number
  bookingUrl: string
  source?: 'verified' | 'index' | 'api' | 'serpapi' | 'google_cse'
  city?: string
  countryCode?: string
  cityId?: number
  latitude?: number
  longitude?: number
  distanceKm?: number
  imageUrl?: string
  currency?: string
  dailyRate?: number
  reviewScore?: number
  starRating?: number
}

type AgodaAffiliateConfig = {
  siteId: string
  apiKey: string
  cid: string
  endpoint: string
  configured: boolean
  searchProvider: 'serpapi' | 'google_cse' | ''
  serpApiKey: string
  googleSearchApiKey: string
  googleSearchCx: string
}

type AgodaDateRange = {
  checkInDate: string
  checkOutDate: string
  datesExplicit: boolean
}

export type AgodaAffiliateSearchResponse = {
  configured: boolean
  siteId: string
  cid: string
  endpoint: string
  searchProvider: AgodaAffiliateConfig['searchProvider']
  query: {
    hotelName: string
    alternateHotelNames: string[]
    googlePlaceId?: string
    cityId?: number
    city?: string
    countryCode?: string
    latitude?: number
    longitude?: number
    lodgingHint: boolean
    datesExplicit: boolean
    currencyExplicit: boolean
    languageExplicit: boolean
    checkInDate: string
    checkOutDate: string
    adults: number
    children: number
    rooms: number
    currency: string
    language: string
    maxResult: number
  }
  matchStatus: AgodaAffiliateMatchStatus
  confidence?: 'verified' | 'high' | 'review' | 'none'
  bestMatch?: AgodaAffiliateHotelCandidate
  candidates: AgodaAffiliateHotelCandidate[]
  rawCount?: number
  apiStatus?: number
  error?: string
}

type AgodaHotelIndexRecord = {
  hotelId: string
  hotelName: string
  formerName?: string
  translatedName?: string
  city?: string
  countryCode?: string
  cityId?: number
  latitude?: number
  longitude?: number
  url?: string
  starRating?: number
  reviewCount?: number
  reviewScore?: number
  accommodationType?: string
}

type RankedAgodaHotelCandidate = AgodaAffiliateHotelCandidate & {
  nameScore: number
  accommodationType?: string
}

type AgodaAffiliateApiHotelCandidate = AgodaAffiliateHotelCandidate & {
  matchingHotelNames: string[]
}

type AgodaWebSearchResult = {
  url: string
  title: string
  snippet: string
  position?: number
  source: 'serpapi' | 'google_cse'
}

let hotelIndexCache: { path: string; records: AgodaHotelIndexRecord[] } | null = null
let hotelIndexPromise: Promise<{ path: string; records: AgodaHotelIndexRecord[] }> | null = null
const agodaSearchCache = new Map<string, { expiresAt: number; results: AgodaWebSearchResult[] }>()

export function getAgodaAffiliatePublicConfig() {
  const config = readAgodaAffiliateConfig()
  return {
    configured: config.configured,
    siteId: config.siteId,
    cid: config.cid,
    endpoint: config.endpoint,
    searchProvider: config.searchProvider,
  }
}

export async function findAgodaHotelIndexIdentity(
  input: AgodaHotelIndexIdentityInput,
): Promise<AgodaHotelIndexIdentity | null> {
  const config = readAgodaAffiliateConfig()
  const hotelName = cleanHotelSearchName(input.hotelName)
  const alternateHotelNames = cleanAgodaAlternateHotelNames(input.alternateHotelNames, hotelName)
  const query: AgodaAffiliateSearchResponse['query'] = {
    hotelName,
    alternateHotelNames,
    googlePlaceId: '',
    city: '',
    countryCode: cleanCode(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
    lodgingHint: input.lodgingHint === true,
    datesExplicit: false,
    currencyExplicit: false,
    languageExplicit: false,
    checkInDate: '',
    checkOutDate: '',
    adults: 2,
    children: 0,
    rooms: 1,
    currency: DEFAULT_CURRENCY,
    language: DEFAULT_LANGUAGE,
    maxResult: DEFAULT_MAX_RESULT,
  }

  const result = await searchAgodaHotelIndex(config, query)
  if (result.matchStatus !== 'matched' || !result.bestIndexRecord) return null

  const record = result.bestIndexRecord
  const canonicalNames = [
    record.hotelName,
    ...cleanAgodaAlternateHotelNames(
      [record.translatedName, record.formerName],
      record.hotelName,
    ),
  ]

  return {
    hotelId: record.hotelId,
    canonicalNames,
    ...(record.city ? { city: record.city } : {}),
    ...(record.countryCode ? { countryCode: record.countryCode } : {}),
    ...(typeof record.cityId === 'number' ? { cityId: record.cityId } : {}),
    ...(typeof record.latitude === 'number' ? { latitude: record.latitude } : {}),
    ...(typeof record.longitude === 'number' ? { longitude: record.longitude } : {}),
  }
}

export function buildAgodaPartnerUrl(
  hotelId: string | number,
  options: {
    cid?: string
    checkInDate?: string
    checkOutDate?: string
    adults?: number
    children?: number
    rooms?: number
    currency?: string
    language?: string
  } = {},
) {
  const cleanHotelId = String(hotelId).trim()
  const url = new URL('https://www.agoda.com/partners/partnersearch.aspx')
  url.searchParams.set('pcs', '1')
  url.searchParams.set('cid', cleanCode(options.cid, DEFAULT_AGODA_SITE_ID, 32))
  url.searchParams.set('hid', cleanHotelId)
  if (options.currency) url.searchParams.set('currency', cleanCode(options.currency, DEFAULT_CURRENCY, 10))
  if (options.language) url.searchParams.set('hl', cleanCode(options.language, DEFAULT_LANGUAGE, 12).toLowerCase())
  if (options.checkInDate) url.searchParams.set('checkin', options.checkInDate)
  if (options.checkOutDate) url.searchParams.set('checkout', options.checkOutDate)
  if (options.adults) url.searchParams.set('NumberofAdults', String(options.adults))
  if (typeof options.children === 'number') url.searchParams.set('NumberofChildren', String(options.children))
  if (options.rooms) url.searchParams.set('Rooms', String(options.rooms))
  return url.toString()
}

export async function searchAgodaAffiliateHotels(input: AgodaAffiliateSearchInput): Promise<AgodaAffiliateSearchResponse> {
  const config = readAgodaAffiliateConfig()
  const hotelName = cleanHotelSearchName(input.hotelName)
  const alternateHotelNames = cleanAgodaAlternateHotelNames(input.alternateHotelNames, hotelName)
  const dates = resolveDateRange(input.checkInDate, input.checkOutDate)
  const query = {
    hotelName,
    alternateHotelNames,
    googlePlaceId: cleanHotelSearchName(input.googlePlaceId),
    cityId: input.cityId,
    city: cleanCode(input.city, '', 80),
    countryCode: cleanCode(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
    lodgingHint: input.lodgingHint === true,
    datesExplicit: dates.datesExplicit,
    currencyExplicit: Boolean(input.currency?.trim()),
    languageExplicit: Boolean(input.language?.trim()),
    checkInDate: dates.checkInDate,
    checkOutDate: dates.checkOutDate,
    adults: clampInteger(input.adults, 2, 1, 16),
    children: clampInteger(input.children, 0, 0, 8),
    rooms: clampInteger(input.rooms, 1, 1, 8),
    currency: cleanCode(input.currency, DEFAULT_CURRENCY, 10),
    language: cleanCode(input.language, DEFAULT_LANGUAGE, 12).toLowerCase(),
    maxResult: clampInteger(input.maxResult, DEFAULT_MAX_RESULT, 1, 50),
  }

  // Agoda links are accepted only after a provider-specific web search and
  // property-page validation.  Do not fall back to the old Agoda API, local
  // hotel index, or a pre-saved hotel ID: those inventories can be stale and
  // have previously produced links to a different property.
  if (config.searchProvider) {
    try {
      const webCandidates = await searchAgodaWebCandidates(config, query, input.forceRefresh === true)
      const bestMatch = webCandidates[0]
      const matchStatus = getAgodaWebMatchStatus(bestMatch, webCandidates[1])
      return {
        configured: true,
        siteId: config.siteId,
        cid: config.cid,
        endpoint: '',
        searchProvider: config.searchProvider,
        query,
        matchStatus,
        confidence: matchStatus === 'matched' ? 'high' : 'none',
        ...(matchStatus === 'matched' && bestMatch ? { bestMatch } : {}),
        candidates: webCandidates,
        rawCount: webCandidates.length,
      }
    } catch {
      return {
        configured: true,
        siteId: config.siteId,
        cid: config.cid,
        endpoint: '',
        searchProvider: config.searchProvider,
        query,
        // A search-provider outage is not evidence that the hotel does not
        // exist.  Returning api_error makes the planner retry shortly instead
        // of caching this as a 24-hour no-match.
        matchStatus: 'api_error',
        confidence: 'none',
        candidates: [],
        error: 'agoda_web_search_unavailable',
      }
    }
  }

  return {
    configured: false,
    siteId: config.siteId,
    cid: config.cid,
    endpoint: '',
    searchProvider: '',
    query,
    matchStatus: 'not_configured',
    confidence: 'none',
    candidates: [],
    error: 'agoda_web_search_not_configured',
  }
}

function readAgodaAffiliateConfig(): AgodaAffiliateConfig {
  const siteId = cleanCode(process.env.AGODA_AFFILIATE_SITE_ID, DEFAULT_AGODA_SITE_ID, 32)
  const cid = cleanCode(process.env.AGODA_AFFILIATE_CID, siteId, 32)
  const serpApiKey = process.env.SERPAPI_API_KEY?.trim() ?? ''
  const googleSearchApiKey = (
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ?? process.env.GOOGLE_SEARCH_API_KEY ?? ''
  ).trim()
  const googleSearchCx = (
    process.env.GOOGLE_CUSTOM_SEARCH_CX ?? process.env.GOOGLE_SEARCH_CX ?? ''
  ).trim()
  const configuredSearchProvider = process.env.AGODA_SEARCH_PROVIDER?.trim().toLowerCase()
  const searchProvider =
    configuredSearchProvider === 'serpapi' && serpApiKey
      ? 'serpapi'
      : configuredSearchProvider === 'google_cse' && googleSearchApiKey && googleSearchCx
        ? 'google_cse'
        : !configuredSearchProvider && serpApiKey
          ? 'serpapi'
          : !configuredSearchProvider && googleSearchApiKey && googleSearchCx
            ? 'google_cse'
            : ''

  return {
    siteId,
    // The legacy Agoda API is deliberately not used for planner matching.
    apiKey: '',
    cid,
    endpoint: '',
    configured: Boolean(searchProvider),
    searchProvider,
    serpApiKey,
    googleSearchApiKey,
    googleSearchCx,
  }
}

function buildAgodaSearchNames(
  canonicalNames: readonly string[],
  hotelName: string,
  alternateNames: readonly string[],
) {
  return buildHotelAffiliateSearchNames({
    verifiedNames: canonicalNames,
    googlePlaceName: hotelName,
    alternateNames,
    maxNames: 3,
  })
}

async function searchAgodaWebCandidates(
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
  forceRefresh: boolean,
) {
  const candidatesByProperty = new Map<string, AgodaAffiliateHotelCandidate>()
  const searchNames = buildAgodaSearchNames([], query.hotelName, query.alternateHotelNames)

  for (const searchName of searchNames) {
    const results = await searchAgodaWebResults(config, searchName, forceRefresh)
    for (const result of results) {
      const parsed = parseAgodaPropertyUrl(result.url)
      if (!parsed) continue
      const hotelName = cleanAgodaWebTitle(result.title) || searchName
      const score = scoreAgodaHotelNameAliases(
        [searchName],
        [hotelName, result.title, result.snippet],
      )
      if (score < 0.78) continue
      const hotelId = agodaHotelIdFromUrl(parsed) || `web:${parsed.pathname.toLowerCase()}`
      const candidate: AgodaAffiliateHotelCandidate = {
        hotelId,
        hotelName,
        score,
        bookingUrl: buildAgodaWebAffiliateUrl(parsed, config, query),
        source: result.source,
      }
      const existing = candidatesByProperty.get(hotelId)
      if (!existing || candidate.score > existing.score) candidatesByProperty.set(hotelId, candidate)
    }

    const current = [...candidatesByProperty.values()].sort(compareAgodaWebCandidates)
    if (getAgodaWebMatchStatus(current[0], current[1]) === 'matched') break
  }

  return [...candidatesByProperty.values()].sort(compareAgodaWebCandidates).slice(0, query.maxResult)
}

function compareAgodaWebCandidates(a: AgodaAffiliateHotelCandidate, b: AgodaAffiliateHotelCandidate) {
  return b.score - a.score || a.hotelName.localeCompare(b.hotelName)
}

function getAgodaWebMatchStatus(
  bestMatch: AgodaAffiliateHotelCandidate | undefined,
  runnerUp: AgodaAffiliateHotelCandidate | undefined,
): AgodaAffiliateMatchStatus {
  if (!bestMatch || bestMatch.score < 0.92) return bestMatch?.score && bestMatch.score >= 0.78 ? 'needs_review' : 'no_match'
  // Same-name branch hotels do exist.  Do not silently choose one if another
  // distinct Agoda property has effectively the same evidence.
  if (runnerUp && runnerUp.hotelId !== bestMatch.hotelId && runnerUp.score >= bestMatch.score - 0.025) {
    return 'needs_review'
  }
  return 'matched'
}

async function searchAgodaWebResults(
  config: AgodaAffiliateConfig,
  hotelName: string,
  forceRefresh: boolean,
) {
  const cacheKey = `web-v2|${config.searchProvider}|${normalizeHotelName(hotelName)}`
  if (!forceRefresh) {
    const cached = readAgodaSearchCache(cacheKey)
    if (cached) return cached
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    // Keep the provider query as natural words rather than an exact phrase.
    // Maps and Agoda often differ slightly in punctuation, word order, or a
    // city suffix; candidate scoring below still prevents a loose result from
    // becoming an affiliate link.
    const searchName = hotelName.replace(/["“”]+/g, ' ').replace(/\s+/g, ' ').trim()
    const searchText = ['site:agoda.com', searchName, 'Agoda'].filter(Boolean).join(' ')
    const results =
      config.searchProvider === 'serpapi'
        ? await searchAgodaWithSerpApi(config, searchText, controller.signal)
        : await searchAgodaWithGoogleCse(config, searchText, controller.signal)
    writeAgodaSearchCache(cacheKey, results)
    return results
  } finally {
    clearTimeout(timeout)
  }
}

function readAgodaSearchCache(cacheKey: string) {
  const cached = agodaSearchCache.get(cacheKey)
  if (!cached) return undefined
  if (cached.expiresAt <= Date.now()) {
    agodaSearchCache.delete(cacheKey)
    return undefined
  }
  agodaSearchCache.delete(cacheKey)
  agodaSearchCache.set(cacheKey, cached)
  return cached.results
}

function writeAgodaSearchCache(cacheKey: string, results: AgodaWebSearchResult[]) {
  const now = Date.now()
  for (const [key, value] of agodaSearchCache) {
    if (value.expiresAt <= now) agodaSearchCache.delete(key)
  }
  agodaSearchCache.delete(cacheKey)
  agodaSearchCache.set(cacheKey, {
    expiresAt: now + (results.length > 0 ? SEARCH_CACHE_TTL_MS : EMPTY_SEARCH_CACHE_TTL_MS),
    results,
  })
  while (agodaSearchCache.size > AGODA_SEARCH_CACHE_MAX_ENTRIES) {
    const oldestKey = agodaSearchCache.keys().next().value
    if (typeof oldestKey !== 'string') break
    agodaSearchCache.delete(oldestKey)
  }
}

async function searchAgodaWithSerpApi(config: AgodaAffiliateConfig, searchText: string, signal: AbortSignal) {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google')
  url.searchParams.set('q', searchText)
  url.searchParams.set('hl', 'zh-tw')
  url.searchParams.set('gl', 'tw')
  url.searchParams.set('num', '10')
  url.searchParams.set('api_key', config.serpApiKey)
  const response = await fetch(url, { cache: 'no-store', signal })
  if (!response.ok) throw new Error(`serpapi_${response.status}`)
  const payload = await response.json() as {
    error?: unknown
    search_metadata?: { status?: unknown }
    organic_results?: Array<{ link?: unknown; title?: unknown; snippet?: unknown; position?: unknown }>
  }
  if (typeof payload.error === 'string' && payload.error.trim()) throw new Error(`serpapi_${payload.error.trim().slice(0, 80)}`)
  if (typeof payload.search_metadata?.status === 'string' && payload.search_metadata.status.toLowerCase() !== 'success') {
    throw new Error(`serpapi_${payload.search_metadata.status.slice(0, 40)}`)
  }
  return (payload.organic_results ?? []).map((item) => ({
    url: typeof item.link === 'string' ? item.link : '',
    title: typeof item.title === 'string' ? item.title : '',
    snippet: typeof item.snippet === 'string' ? item.snippet : '',
    ...(typeof item.position === 'number' ? { position: item.position } : {}),
    source: 'serpapi' as const,
  })).filter((item) => item.url)
}

async function searchAgodaWithGoogleCse(config: AgodaAffiliateConfig, searchText: string, signal: AbortSignal) {
  const url = new URL('https://www.googleapis.com/customsearch/v1')
  url.searchParams.set('key', config.googleSearchApiKey)
  url.searchParams.set('cx', config.googleSearchCx)
  url.searchParams.set('q', searchText)
  url.searchParams.set('lr', 'lang_zh-TW')
  url.searchParams.set('num', '10')
  const response = await fetch(url, { cache: 'no-store', signal })
  if (!response.ok) throw new Error(`google_cse_${response.status}`)
  const payload = await response.json() as { items?: Array<{ link?: unknown; title?: unknown; snippet?: unknown }> }
  return (payload.items ?? []).map((item, index) => ({
    url: typeof item.link === 'string' ? item.link : '',
    title: typeof item.title === 'string' ? item.title : '',
    snippet: typeof item.snippet === 'string' ? item.snippet : '',
    position: index + 1,
    source: 'google_cse' as const,
  })).filter((item) => item.url)
}

function parseAgodaPropertyUrl(value: string) {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/\.$/, '')
    const path = url.pathname.toLowerCase()
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    if (host !== 'agoda.com' && !host.endsWith('.agoda.com')) return null
    if (!path || path === '/' || path.includes('/partners/') || path.includes('/partnersearch')) return null
    // Google occasionally returns a city/listing page.  A property result
    // always has a real path and the name verifier below must still pass.
    if (/(?:\/hotels\/|\/city\/|\/destination\/)/.test(path) && !/\.html$/.test(path)) return null
    return url
  } catch {
    return null
  }
}

function agodaHotelIdFromUrl(url: URL) {
  const hid = url.searchParams.get('hid')?.trim()
  if (hid && /^\d{1,12}$/.test(hid)) return hid
  const pathId = url.pathname.match(/(?:hotel|hid)[-_](\d{1,12})(?:\D|$)/i)?.[1]
  return pathId ?? ''
}

function cleanAgodaWebTitle(value: string) {
  return value
    .replace(/\s*[|\-–—]\s*agoda(?:\.com)?(?:\s*[-|].*)?$/i, '')
    .replace(/\s*[-|]\s*book.*$/i, '')
    .trim()
    .slice(0, MAX_HOTEL_NAME_LENGTH)
}

function buildAgodaWebAffiliateUrl(
  sourceUrl: URL,
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
) {
  const url = new URL(sourceUrl.origin + sourceUrl.pathname)
  url.protocol = 'https:'
  url.searchParams.set('pcs', '1')
  url.searchParams.set('cid', config.cid)
  if (query.currencyExplicit) url.searchParams.set('currency', query.currency)
  if (query.languageExplicit) url.searchParams.set('hl', query.language)
  if (query.datesExplicit) {
    url.searchParams.set('checkin', query.checkInDate)
    url.searchParams.set('checkout', query.checkOutDate)
    url.searchParams.set('NumberofAdults', String(query.adults))
    url.searchParams.set('NumberofChildren', String(query.children))
    url.searchParams.set('Rooms', String(query.rooms))
  }
  return url.toString()
}

function readAgodaApiCredentials(siteId: string, rawApiKey?: string) {
  const value = (rawApiKey || '').trim().replace(/^["']|["']$/g, '')
  const separator = value.indexOf(':')
  if (separator > 0) {
    const credentialSiteId = value.slice(0, separator).trim()
    const credentialApiKey = value.slice(separator + 1).trim()
    return {
      siteId: credentialSiteId || siteId,
      apiKey: credentialApiKey,
    }
  }
  return {
    siteId,
    apiKey: value,
  }
}

function buildCitySearchRequest(
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
) {
  const siteid = /^\d+$/.test(config.siteId) ? Number(config.siteId) : config.siteId
  return {
    siteid,
    apikey: config.apiKey,
    criteria: {
      additional: {
        currency: query.currency,
        dailyRate: {
          maximum: 100000,
          minimum: 1,
        },
        discountOnly: false,
        language: query.language,
        maxResult: query.maxResult,
        minimumReviewScore: 0,
        minimumStarRating: 0,
        occupancy: {
          numberOfAdult: query.adults,
          numberOfChildren: query.children,
        },
        sortBy: 'PriceAsc',
      },
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate,
      cityId: query.cityId,
    },
  }
}

function extractAgodaHotels(
  payload: unknown,
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
): AgodaAffiliateApiHotelCandidate[] {
  const hotels: AgodaAffiliateApiHotelCandidate[] = []

  for (const record of getAgodaResultRecords(payload)) {
    const hotelId = readHotelId(record)
    const hotelName = readString(record.hotelName ?? record.name ?? record.hotel_name)
    if (!hotelId || !hotelName) continue
    const translatedName = readString(
      record.translatedName ??
      record.translatedHotelName ??
      record.translated_name ??
      record.translated_hotel_name,
    )
    const formerName = readString(
      record.formerName ??
      record.formerHotelName ??
      record.former_name ??
      record.former_hotel_name,
    )

    const bookingUrl = normalizeAgodaLandingUrl(readString(record.landingURL ?? record.landingUrl), hotelId, config, query)
    const imageUrl = readString(record.imageURL ?? record.imageUrl)
    const currency = readString(record.currency)
    const dailyRate = readNumber(record.dailyRate)
    const reviewScore = readNumber(record.reviewScore)
    const starRating = readNumber(record.starRating)

    hotels.push({
      hotelId,
      hotelName,
      score: 0,
      bookingUrl,
      source: 'api',
      matchingHotelNames: [
        hotelName,
        ...cleanAgodaAlternateHotelNames([translatedName, formerName], hotelName),
      ],
      ...(imageUrl ? { imageUrl } : {}),
      ...(currency ? { currency } : {}),
      ...(dailyRate ? { dailyRate } : {}),
      ...(reviewScore ? { reviewScore } : {}),
      ...(starRating ? { starRating } : {}),
    })
  }

  return hotels
}

function getAgodaResultRecords(payload: unknown): Record<string, unknown>[] {
  if (!payload || typeof payload !== 'object') return []
  const root = payload as Record<string, unknown>
  const containers = [root.results, root.result, root.hotels, root.data]
  for (const value of containers) {
    if (Array.isArray(value)) return value.filter(isRecord)
    if (isRecord(value) && Array.isArray(value.results)) return value.results.filter(isRecord)
    if (isRecord(value) && Array.isArray(value.hotels)) return value.hotels.filter(isRecord)
  }
  return []
}

function normalizeAgodaLandingUrl(
  landingUrl: string,
  hotelId: string,
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
) {
  const fallback = buildAgodaPartnerUrl(hotelId, {
    cid: config.cid,
    checkInDate: query.datesExplicit ? query.checkInDate : undefined,
    checkOutDate: query.datesExplicit ? query.checkOutDate : undefined,
    adults: query.datesExplicit ? query.adults : undefined,
    children: query.datesExplicit ? query.children : undefined,
    rooms: query.datesExplicit ? query.rooms : undefined,
    currency: query.currencyExplicit ? query.currency : undefined,
    language: query.languageExplicit ? query.language : undefined,
  })

  if (!landingUrl) return fallback

  try {
    const url = new URL(landingUrl)
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      (hostname !== 'agoda.com' && !hostname.endsWith('.agoda.com'))
    ) {
      return fallback
    }
    url.searchParams.set('pcs', '1')
    url.searchParams.set('cid', config.cid)
    if (!url.searchParams.get('hid')) url.searchParams.set('hid', hotelId)
    if (query.currencyExplicit) url.searchParams.set('currency', query.currency)
    else url.searchParams.delete('currency')
    if (query.languageExplicit) url.searchParams.set('hl', query.language)
    else url.searchParams.delete('hl')
    if (query.datesExplicit) {
      url.searchParams.set('checkin', query.checkInDate)
      url.searchParams.set('checkout', query.checkOutDate)
      url.searchParams.set('NumberofAdults', String(query.adults))
      url.searchParams.set('NumberofChildren', String(query.children))
      url.searchParams.set('Rooms', String(query.rooms))
    }
    return url.toString()
  } catch {
    return fallback
  }
}

async function searchAgodaHotelIndex(
  config: AgodaAffiliateConfig,
  query: AgodaAffiliateSearchResponse['query'],
) {
  const index = await loadAgodaHotelIndex()
  if (index.records.length === 0) {
    return {
      loaded: false,
      matchStatus: 'no_match' as AgodaAffiliateMatchStatus,
      candidates: [],
      totalRecords: 0,
    }
  }

  const hasCoordinates = typeof query.latitude === 'number' && typeof query.longitude === 'number'
  const candidates: RankedAgodaHotelCandidate[] = []
  const queryHotelNames = [query.hotelName, ...query.alternateHotelNames]

  index.records.forEach((hotel) => {
    if (query.countryCode && hotel.countryCode && hotel.countryCode.toUpperCase() !== query.countryCode) return
    if (query.cityId && hotel.cityId && hotel.cityId !== query.cityId) return

    const nameScore = scoreAgodaHotelNameAliases(
      queryHotelNames,
      [hotel.hotelName, hotel.translatedName, hotel.formerName],
    )

    const distanceKm =
      hasCoordinates && typeof hotel.latitude === 'number' && typeof hotel.longitude === 'number'
        ? haversineKm(query.latitude as number, query.longitude as number, hotel.latitude, hotel.longitude)
        : undefined
    const coordinateOnlyScore = typeof distanceKm === 'number' ? scoreCoordinateOnlyMatch(distanceKm) : 0
    if (nameScore < 0.42 && coordinateOnlyScore <= 0) return
    if (typeof distanceKm === 'number' && distanceKm > 25 && nameScore < 0.96) return

    const distanceScore = typeof distanceKm === 'number' ? scoreDistance(distanceKm) : 0
    const cityBonus =
      query.city && hotel.city && normalizeHotelName(query.city) === normalizeHotelName(hotel.city) ? 0.03 : 0
    const accommodationBonus = isLikelyAccommodationRecord(hotel) ? 0.02 : 0
    const score = Math.min(
      1,
      Math.max(
        hasCoordinates ? nameScore * 0.78 + distanceScore * 0.22 + cityBonus + accommodationBonus : nameScore + cityBonus,
        coordinateOnlyScore,
      ),
    )
    if (score < 0.45) return

    candidates.push({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      score: Number(score.toFixed(4)),
      nameScore: Number(nameScore.toFixed(4)),
      bookingUrl: normalizeAgodaLandingUrl(hotel.url || '', hotel.hotelId, config, query),
      source: 'index',
      ...(hotel.accommodationType ? { accommodationType: hotel.accommodationType } : {}),
      ...(hotel.city ? { city: hotel.city } : {}),
      ...(hotel.countryCode ? { countryCode: hotel.countryCode } : {}),
      ...(hotel.cityId ? { cityId: hotel.cityId } : {}),
      ...(typeof hotel.latitude === 'number' ? { latitude: hotel.latitude } : {}),
      ...(typeof hotel.longitude === 'number' ? { longitude: hotel.longitude } : {}),
      ...(typeof distanceKm === 'number' ? { distanceKm: Number(distanceKm.toFixed(3)) } : {}),
      ...(typeof hotel.starRating === 'number' ? { starRating: hotel.starRating } : {}),
      ...(typeof hotel.reviewScore === 'number' ? { reviewScore: hotel.reviewScore } : {}),
    })
  })

  candidates.sort((a, b) =>
    b.score - a.score ||
    b.nameScore - a.nameScore ||
    (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY) ||
    (b.reviewScore ?? 0) - (a.reviewScore ?? 0),
  )
  const topCandidates = candidates.slice(0, 8).map(({ nameScore: _nameScore, ...candidate }) => candidate)
  const bestMatch = topCandidates[0]
  const bestRankedMatch = candidates[0]
  const safeCoordinateMatch = isSafeCoordinateOnlyMatch(bestRankedMatch, candidates[1], query.lodgingHint)
  const safeBestScore =
    bestRankedMatch && (bestRankedMatch.nameScore >= 0.42 || safeCoordinateMatch)
      ? Math.max(bestRankedMatch.score, safeCoordinateMatch ? 0.92 : 0)
      : Math.min(bestRankedMatch?.score ?? 0, 0.77)
  const matchStatus = getMatchStatus(safeBestScore)
  const bestIndexRecord =
    matchStatus === 'matched' && bestRankedMatch
      ? index.records.find((record) => record.hotelId === bestRankedMatch.hotelId)
      : undefined

  return {
    loaded: true,
    matchStatus,
    ...(bestMatch && matchStatus === 'matched' ? { bestMatch } : {}),
    ...(bestIndexRecord ? { bestIndexRecord } : {}),
    candidates: topCandidates,
    totalRecords: index.records.length,
  }
}

async function loadAgodaHotelIndex() {
  const indexPath = path.resolve(process.cwd(), process.env.AGODA_HOTEL_INDEX_PATH || DEFAULT_AGODA_INDEX_PATH)
  if (hotelIndexCache?.path === indexPath) return hotelIndexCache
  if (hotelIndexPromise) return hotelIndexPromise

  hotelIndexPromise = readFile(indexPath, 'utf8')
    .then((content) => ({
      path: indexPath,
      records: content
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AgodaHotelIndexRecord)
        .filter((record) => record.hotelId && record.hotelName),
    }))
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') console.error('[agoda index]', error)
      return { path: indexPath, records: [] }
    })
    .then((result) => {
      hotelIndexCache = result
      hotelIndexPromise = null
      return result
    })

  return hotelIndexPromise
}

function getMatchStatus(score: number): AgodaAffiliateMatchStatus {
  if (score >= 0.92) return 'matched'
  if (score >= 0.78) return 'needs_review'
  return 'no_match'
}

function agodaMatchConfidence(status: AgodaAffiliateMatchStatus): 'high' | 'review' | 'none' {
  if (status === 'matched') return 'high'
  if (status === 'needs_review') return 'review'
  return 'none'
}

export function cleanAgodaAlternateHotelNames(value: unknown, primaryHotelName = '') {
  if (!Array.isArray(value)) return []
  const primaryKey = hotelNameDedupeKey(primaryHotelName)
  const seen = new Set(primaryKey ? [primaryKey] : [])
  const names: string[] = []

  for (const item of value) {
    const name = cleanHotelSearchName(item)
    const key = hotelNameDedupeKey(name)
    if (!name || !key || seen.has(key)) continue
    seen.add(key)
    names.push(name)
    if (names.length >= MAX_ALTERNATE_HOTEL_NAMES) break
  }

  return names
}

export function scoreAgodaHotelNameAliases(
  queryAliases: readonly unknown[],
  candidateAliases: readonly unknown[],
) {
  const queryVariants = normalizeHotelNameAliasVariants(queryAliases)
  const candidateVariants = normalizeHotelNameAliasVariants(candidateAliases)
  const queryNumberTokens = standaloneHotelNameNumberTokens(queryAliases)
  const candidateNumberTokens = standaloneHotelNameNumberTokens(candidateAliases)
  const numericIdentityMatches = sameHotelNameTokenSet(queryNumberTokens, candidateNumberTokens)
  let bestScore = 0
  queryVariants.forEach((normalizedQuery) => {
    candidateVariants.forEach((normalizedCandidate) => {
      bestScore = Math.max(bestScore, scoreNormalizedHotelName(normalizedQuery, normalizedCandidate))
    })
  })
  if (!numericIdentityMatches) {
    bestScore = Math.min(bestScore, MAX_NUMERIC_IDENTITY_CONFLICT_SCORE)
  }
  return Number(bestScore.toFixed(4))
}

function standaloneHotelNameNumberTokens(values: readonly unknown[]) {
  for (const value of values) {
    const clean = cleanHotelSearchName(value)
    if (!isUsableHotelAffiliateName(clean)) continue
    const numbers = new Set<string>()
    normalizeHotelNameVariants(clean).forEach((variant) => {
      for (const match of variant.matchAll(/\d{1,6}/g)) {
        if (match[0]) numbers.add(match[0])
      }
    })
    if (numbers.size > 0) return [...numbers]
  }
  return []
}

function sameHotelNameTokenSet(left: string[], right: string[]) {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((token) => rightSet.has(token))
}

function normalizeHotelNameAliasVariants(values: readonly unknown[]) {
  const variants = new Set<string>()
  values.forEach((value) => {
    const clean = cleanHotelSearchName(value)
    if (!clean) return
    normalizeHotelNameVariants(clean).forEach((variant) => variants.add(variant))
  })
  return Array.from(variants)
}

function cleanHotelSearchName(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_HOTEL_NAME_LENGTH) : ''
}

function hotelNameDedupeKey(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
}

function scoreNormalizedHotelName(normalizedQuery: string, normalizedCandidate: string) {
  if (!normalizedQuery || !normalizedCandidate) return 0
  if (normalizedQuery === normalizedCandidate) return 1

  const shorter = normalizedQuery.length < normalizedCandidate.length ? normalizedQuery : normalizedCandidate
  const longer = normalizedQuery.length < normalizedCandidate.length ? normalizedCandidate : normalizedQuery
  if (longer.includes(shorter) && shorter.length >= 6) {
    // Search-result titles commonly append a city, year, price or review
    // wording after the full Agoda property name.  A long, complete hotel
    // name contained in that title is strong evidence; keeping it below the
    // auto-match threshold made exact properties impossible to save.
    if (shorter.length >= 16) {
      return Math.min(0.99, 0.88 + shorter.length / longer.length * 0.14)
    }
    return Math.min(0.91, 0.72 + shorter.length / longer.length * 0.2)
  }

  const queryTokens = tokenizeHotelName(normalizedQuery)
  const candidateTokens = tokenizeHotelName(normalizedCandidate)
  const tokenScore = diceScore(queryTokens, candidateTokens)
  const bigramScore = diceScore(toBigrams(normalizedQuery), toBigrams(normalizedCandidate))
  return Number((tokenScore * 0.55 + bigramScore * 0.45).toFixed(4))
}

function normalizeHotelNameVariants(value: string) {
  const normalized = normalizeHotelName(value)
  const expanded = normalizeHotelName(expandHotelNameAliases(value))
  return Array.from(new Set([
    normalized,
    splitHotelNameNumericBoundaries(normalized),
    expanded,
    splitHotelNameNumericBoundaries(expanded),
  ].filter(Boolean)))
}

function splitHotelNameNumericBoundaries(value: string) {
  return value
    .replace(/(\p{L})(\d)/gu, '$1 $2')
    .replace(/(\d)(\p{L})/gu, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

function expandHotelNameAliases(value: string) {
  return HOTEL_NAME_ALIAS_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, ` ${replacement} `),
    value,
  )
}

const HOTEL_NAME_ALIAS_REPLACEMENTS: Array<[RegExp, string]> = [
  [/福岡|福冈/g, 'fukuoka'],
  [/沖繩|冲绳|沖縄/g, 'okinawa'],
  [/那霸|那覇/g, 'naha'],
  [/大阪/g, 'osaka'],
  [/難波|难波/g, 'namba'],
  [/大國町|大国町/g, 'daikokucho'],
  [/東急|东急/g, 'tokyu'],
  [/蒙特利|蒙特雷/g, 'monterey'],
  [/里士滿|里士满/g, 'richmond'],
  [/飯店|酒店|旅館|旅店|ホテル/g, 'hotel'],
]

function normalizeHotelName(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenizeHotelName(value: string) {
  const stopWords = new Set(['a', 'an', 'and', 'by', 'hotel', 'hotels', 'hostel', 'motel', 'resort', 'the'])
  return value
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopWords.has(token))
}

function toBigrams(value: string) {
  const compact = value.replace(/\s+/g, '')
  if (compact.length <= 2) return compact ? [compact] : []
  const bigrams: string[] = []
  for (let i = 0; i < compact.length - 1; i += 1) {
    bigrams.push(compact.slice(i, i + 2))
  }
  return bigrams
}

function diceScore(left: string[], right: string[]) {
  if (left.length === 0 || right.length === 0) return 0
  const rightCounts = new Map<string, number>()
  right.forEach((item) => rightCounts.set(item, (rightCounts.get(item) ?? 0) + 1))
  let overlap = 0
  left.forEach((item) => {
    const count = rightCounts.get(item) ?? 0
    if (count <= 0) return
    overlap += 1
    rightCounts.set(item, count - 1)
  })
  return (2 * overlap) / (left.length + right.length)
}

function scoreDistance(distanceKm: number) {
  if (distanceKm <= 0.2) return 1
  if (distanceKm <= 0.5) return 0.94
  if (distanceKm <= 1) return 0.82
  if (distanceKm <= 3) return 0.55
  if (distanceKm <= 10) return 0.25
  return 0
}

function scoreCoordinateOnlyMatch(distanceKm: number) {
  if (distanceKm <= 0.03) return 0.93
  if (distanceKm <= 0.08) return 0.88
  if (distanceKm <= 0.15) return 0.82
  if (distanceKm <= 0.25) return 0.78
  return 0
}

function isSafeCoordinateOnlyMatch(candidate?: RankedAgodaHotelCandidate, nextCandidate?: RankedAgodaHotelCandidate, lodgingHint = false) {
  if (!candidate || candidate.nameScore >= 0.42) return false
  if (!lodgingHint && !isLikelyAccommodationCandidate(candidate)) return false
  const distanceKm = candidate.distanceKm
  if (typeof distanceKm !== 'number') return false

  const nextDistanceKm = nextCandidate?.distanceKm
  const nearestIsClearlySeparated =
    typeof nextDistanceKm !== 'number' ||
    nextDistanceKm - distanceKm >= 0.08

  if (distanceKm <= 0.03 && nearestIsClearlySeparated) return true
  if (distanceKm <= 0.08 && candidate.nameScore >= 0.18 && nearestIsClearlySeparated) return true
  if (lodgingHint && distanceKm <= 0.15 && nearestIsClearlySeparated) return true
  return false
}

function isLikelyAccommodationCandidate(candidate: RankedAgodaHotelCandidate) {
  return isLikelyAccommodationText([candidate.accommodationType, candidate.hotelName].filter(Boolean).join(' '))
}

function isLikelyAccommodationRecord(record: AgodaHotelIndexRecord) {
  return isLikelyAccommodationText([record.accommodationType, record.hotelName].filter(Boolean).join(' '))
}

function isLikelyAccommodationText(value: string) {
  return /\b(?:hotel|resort|ryokan|inn|hostel|guest\s*house|guesthouse|serviced\s*apartment|apartment|villa|lodge|stay)\b/i.test(value)
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const startLat = toRadians(lat1)
  const endLat = toRadians(lat2)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function resolveDateRange(checkInDate?: string, checkOutDate?: string): AgodaDateRange {
  const cleanCheckIn = readDate(checkInDate)
  const cleanCheckOut = readDate(checkOutDate)
  if (cleanCheckIn && cleanCheckOut && dateToTime(cleanCheckOut) > dateToTime(cleanCheckIn)) {
    return { checkInDate: cleanCheckIn, checkOutDate: cleanCheckOut, datesExplicit: true }
  }

  if (cleanCheckIn) {
    return { checkInDate: cleanCheckIn, checkOutDate: formatDate(addDays(parseDate(cleanCheckIn), 1)), datesExplicit: true }
  }

  const tomorrow = addDays(new Date(), 1)
  return {
    checkInDate: formatDate(tomorrow),
    checkOutDate: formatDate(addDays(tomorrow, 1)),
    datesExplicit: false,
  }
}

function readDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const date = parseDate(value)
  return formatDate(date) === value ? value : ''
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function dateToTime(value: string) {
  return parseDate(value).getTime()
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function cleanEndpoint(value?: string) {
  if (!value) return ''
  const trimmed = value.trim()
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    return url.toString()
  } catch {
    return ''
  }
}

function cleanCode(value: string | undefined, fallback: string, maxLength: number) {
  const clean = (value || '').trim().slice(0, maxLength)
  return clean || fallback
}

function clampInteger(value: number | undefined, fallback: number, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number.NaN
  if (!Number.isInteger(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

function readCoordinate(value: number | undefined, min: number, max: number) {
  const number = typeof value === 'number' ? value : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) return undefined
  return number
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(value: unknown) {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : undefined
}

function readHotelId(record: Record<string, unknown>) {
  const value = record.hotelId ?? record.hotelID ?? record.hid ?? record.id
  const text = typeof value === 'number' ? String(value) : readString(value)
  return /^\d+$/.test(text) ? text : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
