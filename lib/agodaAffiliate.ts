import { readFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_AGODA_SITE_ID = '1945734'
const DEFAULT_AGODA_ENDPOINT = 'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1'
const DEFAULT_AGODA_INDEX_PATH = path.join('data', 'agoda-planner-hotels-index.jsonl')
const DEFAULT_CURRENCY = 'TWD'
const DEFAULT_LANGUAGE = 'zh-tw'
const DEFAULT_MAX_RESULT = 30
const REQUEST_TIMEOUT_MS = 10000

export type AgodaAffiliateMatchStatus =
  | 'matched'
  | 'needs_review'
  | 'no_match'
  | 'needs_city_id'
  | 'api_error'
  | 'not_configured'

export type AgodaAffiliateSearchInput = {
  hotelName: string
  cityId?: number
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  rooms?: number
  currency?: string
  language?: string
  maxResult?: number
}

export type AgodaAffiliateHotelCandidate = {
  hotelId: string
  hotelName: string
  score: number
  bookingUrl: string
  source?: 'index' | 'api'
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
  query: {
    hotelName: string
    cityId?: number
    city?: string
    countryCode?: string
    latitude?: number
    longitude?: number
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
  reviewScore?: number
}

let hotelIndexCache: { path: string; records: AgodaHotelIndexRecord[] } | null = null
let hotelIndexPromise: Promise<{ path: string; records: AgodaHotelIndexRecord[] }> | null = null

export function getAgodaAffiliatePublicConfig() {
  const config = readAgodaAffiliateConfig()
  return {
    configured: config.configured,
    siteId: config.siteId,
    cid: config.cid,
    endpoint: config.endpoint,
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
  const hotelName = input.hotelName.trim().slice(0, 160)
  const dates = resolveDateRange(input.checkInDate, input.checkOutDate)
  const query = {
    hotelName,
    cityId: input.cityId,
    city: cleanCode(input.city, '', 80),
    countryCode: cleanCode(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
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

  const indexResult = await searchAgodaHotelIndex(config, query)
  if (indexResult.candidates.length > 0 && (indexResult.matchStatus !== 'no_match' || !query.cityId || !config.configured)) {
    return {
      configured: config.configured,
      siteId: config.siteId,
      cid: config.cid,
      endpoint: config.endpoint,
      query,
      matchStatus: indexResult.matchStatus,
      ...(indexResult.bestMatch ? { bestMatch: indexResult.bestMatch } : {}),
      candidates: indexResult.candidates,
      rawCount: indexResult.totalRecords,
    }
  }

  if (!config.configured) {
    return {
      configured: false,
      siteId: config.siteId,
      cid: config.cid,
      endpoint: config.endpoint,
      query,
      matchStatus: 'not_configured',
      candidates: [],
      error: 'agoda_env_missing',
    }
  }

  if (!query.cityId) {
    return {
      configured: true,
      siteId: config.siteId,
      cid: config.cid,
      endpoint: config.endpoint,
      query,
      matchStatus: indexResult.loaded ? 'no_match' : 'needs_city_id',
      candidates: indexResult.candidates,
      ...(indexResult.loaded ? {} : { error: 'agoda_city_id_required' }),
    }
  }

  const requestBody = buildCitySearchRequest(config, query)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'accept-encoding': 'gzip,deflate',
        authorization: `${config.siteId}:${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return {
        configured: true,
        siteId: config.siteId,
        cid: config.cid,
        endpoint: config.endpoint,
        query,
        matchStatus: 'api_error',
        candidates: [],
        apiStatus: response.status,
        error: 'agoda_api_error',
      }
    }

    const payload = (await response.json().catch(() => null)) as unknown
    const hotels = extractAgodaHotels(payload, config, query)
    const candidates = hotels
      .map((hotel) => ({
        ...hotel,
        score: scoreHotelName(query.hotelName, hotel.hotelName),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)

    const bestMatch = candidates[0]
    const matchStatus = getMatchStatus(bestMatch?.score ?? 0)
    return {
      configured: true,
      siteId: config.siteId,
      cid: config.cid,
      endpoint: config.endpoint,
      query,
      matchStatus,
      ...(bestMatch && bestMatch.score >= 0.78 ? { bestMatch } : {}),
      candidates,
      rawCount: hotels.length,
    }
  } catch (error) {
    return {
      configured: true,
      siteId: config.siteId,
      cid: config.cid,
      endpoint: config.endpoint,
      query,
      matchStatus: 'api_error',
      candidates: [],
      error: error instanceof Error && error.name === 'AbortError' ? 'agoda_api_timeout' : 'agoda_api_network_error',
    }
  } finally {
    clearTimeout(timeout)
  }
}

function readAgodaAffiliateConfig(): AgodaAffiliateConfig {
  const configuredSiteId = cleanCode(process.env.AGODA_AFFILIATE_SITE_ID, DEFAULT_AGODA_SITE_ID, 32)
  const credentials = readAgodaApiCredentials(configuredSiteId, process.env.AGODA_AFFILIATE_API_KEY)
  const siteId = credentials.siteId
  const apiKey = credentials.apiKey
  const cid = cleanCode(process.env.AGODA_AFFILIATE_CID, siteId, 32)
  const endpoint = cleanEndpoint(process.env.AGODA_AFFILIATE_API_URL) || DEFAULT_AGODA_ENDPOINT

  return {
    siteId,
    apiKey,
    cid,
    endpoint,
    configured: Boolean(siteId && apiKey && endpoint),
  }
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
): AgodaAffiliateHotelCandidate[] {
  const hotels: AgodaAffiliateHotelCandidate[] = []

  for (const record of getAgodaResultRecords(payload)) {
    const hotelId = readHotelId(record)
    const hotelName = readString(record.hotelName ?? record.name ?? record.hotel_name)
    if (!hotelId || !hotelName) continue

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
    if (!url.hostname.toLowerCase().includes('agoda.com')) return fallback
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
  const candidates: AgodaAffiliateHotelCandidate[] = []

  index.records.forEach((hotel) => {
    if (query.countryCode && hotel.countryCode && hotel.countryCode.toUpperCase() !== query.countryCode) return
    if (query.cityId && hotel.cityId && hotel.cityId !== query.cityId) return

    const nameScore = Math.max(
      scoreHotelName(query.hotelName, hotel.hotelName),
      hotel.translatedName ? scoreHotelName(query.hotelName, hotel.translatedName) : 0,
      hotel.formerName ? scoreHotelName(query.hotelName, hotel.formerName) : 0,
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
    const score = Math.min(
      1,
      Math.max(
        hasCoordinates ? nameScore * 0.78 + distanceScore * 0.22 + cityBonus : nameScore + cityBonus,
        coordinateOnlyScore,
      ),
    )
    if (score < 0.45) return

    candidates.push({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      score: Number(score.toFixed(4)),
      bookingUrl: normalizeAgodaLandingUrl(hotel.url || '', hotel.hotelId, config, query),
      source: 'index',
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

  candidates.sort((a, b) => b.score - a.score)
  const topCandidates = candidates.slice(0, 8)
  const bestMatch = topCandidates[0]
  const matchStatus = getMatchStatus(bestMatch?.score ?? 0)

  return {
    loaded: true,
    matchStatus,
    ...(bestMatch && bestMatch.score >= 0.78 ? { bestMatch } : {}),
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

function scoreHotelName(query: string, candidate: string) {
  const normalizedQuery = normalizeHotelName(query)
  const normalizedCandidate = normalizeHotelName(candidate)
  if (!normalizedQuery || !normalizedCandidate) return 0
  if (normalizedQuery === normalizedCandidate) return 1

  const shorter = normalizedQuery.length < normalizedCandidate.length ? normalizedQuery : normalizedCandidate
  const longer = normalizedQuery.length < normalizedCandidate.length ? normalizedCandidate : normalizedQuery
  if (longer.includes(shorter) && shorter.length >= 6) {
    return Math.min(0.91, 0.72 + shorter.length / longer.length * 0.2)
  }

  const queryTokens = tokenizeHotelName(normalizedQuery)
  const candidateTokens = tokenizeHotelName(normalizedCandidate)
  const tokenScore = diceScore(queryTokens, candidateTokens)
  const bigramScore = diceScore(toBigrams(normalizedQuery), toBigrams(normalizedCandidate))
  return Number((tokenScore * 0.55 + bigramScore * 0.45).toFixed(4))
}

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
