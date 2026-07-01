import { busanHotelCards } from '@/data/busan/hotels'
import { fujiHotelCards } from '@/data/fuji/hotels'
import { northVietnamHotelCards } from '@/data/northvietnam/hotels'
import { tokyoHotelCards } from '@/data/tokyo/hotels'
import type { CityCard } from '@/components/CityTabbedList'

const DEFAULT_TRIP_ALLIANCE_ID = '6833709'
const DEFAULT_TRIP_SID = '242535686'
const DEFAULT_TRIP_SUB3 = 'D16730765'
const REQUEST_TIMEOUT_MS = 10000

export type TripAffiliateMatchStatus =
  | 'matched'
  | 'needs_review'
  | 'no_match'
  | 'not_configured'
  | 'search_error'

export type TripAffiliateSearchInput = {
  hotelName: string
  alternateHotelNames?: string[]
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  maxResult?: number
  tripSub1?: string
  tripSub3?: string
}

export type TripAffiliateHotelCandidate = {
  hotelId: string
  hotelName: string
  score: number
  bookingUrl: string
  source: 'site_index' | 'serpapi' | 'google_cse'
  originalUrl: string
  title?: string
  snippet?: string
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  distanceKm?: number
}

type TripAffiliateConfig = {
  allianceId: string
  sid: string
  sub1: string
  sub3: string
  searchProvider: 'serpapi' | 'google_cse' | ''
  serpApiKey: string
  googleSearchApiKey: string
  googleSearchCx: string
  configured: boolean
}

type TripAffiliateSearchResponse = {
  configured: boolean
  allianceId: string
  sid: string
  sub3: string
  searchProvider: TripAffiliateConfig['searchProvider']
  query: {
    hotelName: string
    alternateHotelNames: string[]
    city?: string
    countryCode?: string
    latitude?: number
    longitude?: number
    maxResult: number
  }
  matchStatus: TripAffiliateMatchStatus
  bestMatch?: TripAffiliateHotelCandidate
  candidates: TripAffiliateHotelCandidate[]
  rawCount?: number
  error?: string
  searchUrl?: string
}

type SiteHotelRecord = {
  hotelName: string
  url: string
  hotelId: string
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
}

type SearchResult = {
  url: string
  title: string
  snippet: string
  source: 'serpapi' | 'google_cse'
}

let siteHotelRecordsCache: SiteHotelRecord[] | null = null
const searchCache = new Map<string, { expiresAt: number; results: SearchResult[] }>()

export function getTripAffiliatePublicConfig() {
  const config = readTripAffiliateConfig()
  return {
    configured: config.configured,
    allianceId: config.allianceId,
    sid: config.sid,
    sub3: config.sub3,
    searchProvider: config.searchProvider,
    hasSiteIndex: getSiteHotelRecords().length > 0,
  }
}

export function buildTripAffiliateUrl(
  sourceUrl: string,
  options: {
    allianceId?: string
    sid?: string
    tripSub1?: string
    tripSub3?: string
  } = {},
) {
  const parsed = parseTripUrl(sourceUrl)
  if (!parsed) return ''

  parsed.hostname = 'tw.trip.com'
  parsed.protocol = 'https:'
  parsed.searchParams.set('Allianceid', cleanParam(options.allianceId, DEFAULT_TRIP_ALLIANCE_ID, 32))
  parsed.searchParams.set('SID', cleanParam(options.sid, DEFAULT_TRIP_SID, 32))
  parsed.searchParams.set('trip_sub1', cleanParam(options.tripSub1, '', 120))
  parsed.searchParams.set('trip_sub3', cleanParam(options.tripSub3, DEFAULT_TRIP_SUB3, 80))
  return parsed.toString()
}

export async function searchTripAffiliateHotels(input: TripAffiliateSearchInput): Promise<TripAffiliateSearchResponse> {
  const config = readTripAffiliateConfig()
  const query = {
    hotelName: input.hotelName.trim().slice(0, 160),
    alternateHotelNames: cleanNameList(input.alternateHotelNames, input.hotelName, 4, 160),
    city: cleanParam(input.city, '', 80),
    countryCode: cleanParam(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
    maxResult: clampInteger(input.maxResult, 5, 1, 10),
  }

  const configuredResponse = {
    configured: config.configured,
    allianceId: config.allianceId,
    sid: config.sid,
    sub3: config.sub3,
    searchProvider: config.searchProvider,
    query,
  }

  const siteIndexResult = searchSiteHotelIndex(config, query, input)
  if (siteIndexResult.bestMatch?.score && siteIndexResult.bestMatch.score >= 0.9) {
    return {
      ...configuredResponse,
      matchStatus: 'matched',
      bestMatch: siteIndexResult.bestMatch,
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
    }
  }

  if (!config.configured) {
    return {
      ...configuredResponse,
      matchStatus: siteIndexResult.candidates.length > 0 ? 'needs_review' : 'not_configured',
      ...(siteIndexResult.bestMatch ? { bestMatch: siteIndexResult.bestMatch } : {}),
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
      error: 'trip_search_provider_missing',
      searchUrl: buildTripSearchUrl(query.hotelName, query.city),
    }
  }

  try {
    const searchCandidates: TripAffiliateHotelCandidate[] = []
    let searchRawCount = 0
    for (const searchName of tripSearchNames(query)) {
      const searchQuery = { ...query, hotelName: searchName, alternateHotelNames: [] }
      const searchResults = await searchTripResults(config, searchQuery)
      searchRawCount += searchResults.length
      searchCandidates.push(
        ...searchResults
          .map((result, index) => searchResultToCandidate(config, searchQuery, input, result, index))
          .filter((candidate): candidate is TripAffiliateHotelCandidate => Boolean(candidate)),
      )
      const currentBest = mergeTripCandidates([...siteIndexResult.candidates, ...searchCandidates])[0]
      if (currentBest?.score && currentBest.score >= 0.82) break
    }
    const sortedSearchCandidates = searchCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, query.maxResult)

    const candidates = mergeTripCandidates([...siteIndexResult.candidates, ...sortedSearchCandidates]).slice(0, query.maxResult)
    const bestMatch = candidates[0]
    const matchStatus = bestMatch ? getTripMatchStatus(bestMatch.score) : 'no_match'
    return {
      ...configuredResponse,
      matchStatus,
      ...(bestMatch ? { bestMatch } : {}),
      candidates,
      rawCount: searchRawCount + siteIndexResult.rawCount,
      searchUrl: buildTripSearchUrl(query.hotelName, query.city),
    }
  } catch (error) {
    return {
      ...configuredResponse,
      matchStatus: siteIndexResult.bestMatch ? 'needs_review' : 'search_error',
      ...(siteIndexResult.bestMatch ? { bestMatch: siteIndexResult.bestMatch } : {}),
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
      error: error instanceof Error ? error.message.slice(0, 120) : 'trip_search_failed',
      searchUrl: buildTripSearchUrl(query.hotelName, query.city),
    }
  }
}

function readTripAffiliateConfig(): TripAffiliateConfig {
  const serpApiKey = process.env.SERPAPI_API_KEY?.trim() ?? ''
  const googleSearchApiKey = (
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ??
    process.env.GOOGLE_SEARCH_API_KEY ??
    ''
  ).trim()
  const googleSearchCx = (
    process.env.GOOGLE_CUSTOM_SEARCH_CX ??
    process.env.GOOGLE_SEARCH_CX ??
    ''
  ).trim()
  const searchProvider =
    (process.env.TRIP_SEARCH_PROVIDER?.trim().toLowerCase() as TripAffiliateConfig['searchProvider']) ||
    (serpApiKey ? 'serpapi' : googleSearchApiKey && googleSearchCx ? 'google_cse' : '')

  return {
    allianceId: cleanParam(
      process.env.TRIP_AFFILIATE_ALLIANCE_ID ??
        process.env.NEXT_PUBLIC_TRIP_AFF_ALLIANCE_ID ??
        process.env.NEXT_PUBLIC_TRIP_AFFILIATE_ALLIANCE_ID,
      DEFAULT_TRIP_ALLIANCE_ID,
      32,
    ),
    sid: cleanParam(
      process.env.TRIP_AFFILIATE_SID ?? process.env.NEXT_PUBLIC_TRIP_AFF_SID ?? process.env.NEXT_PUBLIC_TRIP_AFFILIATE_SID,
      DEFAULT_TRIP_SID,
      32,
    ),
    sub1: cleanParam(process.env.TRIP_AFFILIATE_SUB1, '', 120),
    sub3: cleanParam(
      process.env.TRIP_AFFILIATE_SUB3_HOTEL ??
        process.env.NEXT_PUBLIC_TRIP_AFF_SUB3_HOTEL ??
        process.env.TRIP_AFFILIATE_SUB3 ??
        process.env.NEXT_PUBLIC_TRIP_AFF_SUB3,
      DEFAULT_TRIP_SUB3,
      80,
    ),
    searchProvider,
    serpApiKey,
    googleSearchApiKey,
    googleSearchCx,
    configured: Boolean(
      (searchProvider === 'serpapi' && serpApiKey) ||
      (searchProvider === 'google_cse' && googleSearchApiKey && googleSearchCx),
    ),
  }
}

function searchSiteHotelIndex(
  config: TripAffiliateConfig,
  query: TripAffiliateSearchResponse['query'],
  input: TripAffiliateSearchInput,
) {
  const records = getSiteHotelRecords()
  const searchNames = tripSearchNames(query)
  const candidates = records
    .map((record) => {
      const score = Math.max(
        ...searchNames.map((searchName) =>
          scoreTripCandidate({
            query: { ...query, hotelName: searchName },
            title: record.hotelName,
            snippet: record.city ?? '',
            url: record.url,
            candidateName: record.hotelName,
            candidateCity: record.city,
            candidateCountryCode: record.countryCode,
            candidateLatitude: record.latitude,
            candidateLongitude: record.longitude,
            rankIndex: 0,
          }),
        ),
      )
      if (score < 0.55) return null
      return {
        hotelId: record.hotelId,
        hotelName: record.hotelName,
        score,
        bookingUrl: buildTripAffiliateUrl(record.url, {
          allianceId: config.allianceId,
          sid: config.sid,
          tripSub1: input.tripSub1 ?? config.sub1,
          tripSub3: input.tripSub3 ?? config.sub3,
        }),
        source: 'site_index' as const,
        originalUrl: record.url,
        title: record.hotelName,
        city: record.city,
        countryCode: record.countryCode,
        latitude: record.latitude,
        longitude: record.longitude,
        distanceKm: distanceKm(query.latitude, query.longitude, record.latitude, record.longitude),
      }
    })
    .filter((candidate): candidate is TripAffiliateHotelCandidate => Boolean(candidate))
    .sort((a, b) => b.score - a.score)
    .slice(0, query.maxResult)

  return {
    bestMatch: candidates[0],
    candidates,
    rawCount: records.length,
  }
}

async function searchTripResults(config: TripAffiliateConfig, query: TripAffiliateSearchResponse['query']) {
  const cacheKey = [
    config.searchProvider,
    normalizeTripText(query.hotelName),
    normalizeTripText(query.city ?? ''),
    query.countryCode,
  ].join('|')
  const cached = searchCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.results

  const searchText = buildTripSearchQuery(query.hotelName, query.city)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const results =
      config.searchProvider === 'serpapi'
        ? await searchWithSerpApi(config, searchText, controller.signal)
        : await searchWithGoogleCse(config, searchText, controller.signal)
    searchCache.set(cacheKey, { expiresAt: Date.now() + 1000 * 60 * 60 * 6, results })
    return results
  } finally {
    clearTimeout(timeout)
  }
}

async function searchWithSerpApi(config: TripAffiliateConfig, searchText: string, signal: AbortSignal): Promise<SearchResult[]> {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google')
  url.searchParams.set('q', searchText)
  url.searchParams.set('hl', 'zh-tw')
  url.searchParams.set('gl', 'tw')
  url.searchParams.set('num', '10')
  url.searchParams.set('api_key', config.serpApiKey)

  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) throw new Error(`serpapi_${res.status}`)
  const payload = await res.json() as {
    organic_results?: Array<{ link?: unknown; title?: unknown; snippet?: unknown }>
  }
  return (payload.organic_results ?? [])
    .map((item) => ({
      url: typeof item.link === 'string' ? item.link : '',
      title: typeof item.title === 'string' ? item.title : '',
      snippet: typeof item.snippet === 'string' ? item.snippet : '',
      source: 'serpapi' as const,
    }))
    .filter((item) => item.url)
}

async function searchWithGoogleCse(config: TripAffiliateConfig, searchText: string, signal: AbortSignal): Promise<SearchResult[]> {
  const url = new URL('https://www.googleapis.com/customsearch/v1')
  url.searchParams.set('key', config.googleSearchApiKey)
  url.searchParams.set('cx', config.googleSearchCx)
  url.searchParams.set('q', searchText)
  url.searchParams.set('lr', 'lang_zh-TW')
  url.searchParams.set('num', '10')

  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) throw new Error(`google_cse_${res.status}`)
  const payload = await res.json() as {
    items?: Array<{ link?: unknown; title?: unknown; snippet?: unknown }>
  }
  return (payload.items ?? [])
    .map((item) => ({
      url: typeof item.link === 'string' ? item.link : '',
      title: typeof item.title === 'string' ? item.title : '',
      snippet: typeof item.snippet === 'string' ? item.snippet : '',
      source: 'google_cse' as const,
    }))
    .filter((item) => item.url)
}

function searchResultToCandidate(
  config: TripAffiliateConfig,
  query: TripAffiliateSearchResponse['query'],
  input: TripAffiliateSearchInput,
  result: SearchResult,
  rankIndex: number,
) {
  const parsed = parseTripUrl(result.url)
  if (!parsed || !isTripHotelDetailUrl(parsed)) return null
  const hotelId = tripHotelIdFromUrl(parsed)
  if (!hotelId) return null

  const score = scoreTripCandidate({
    query,
    title: result.title,
    snippet: result.snippet,
    url: parsed.toString(),
    candidateName: result.title,
    rankIndex,
  })
  if (score < 0.55) return null

  return {
    hotelId,
    hotelName: cleanTripTitle(result.title) || query.hotelName,
    score,
    bookingUrl: buildTripAffiliateUrl(parsed.toString(), {
      allianceId: config.allianceId,
      sid: config.sid,
      tripSub1: input.tripSub1 ?? config.sub1,
      tripSub3: input.tripSub3 ?? config.sub3,
    }),
    source: result.source,
    originalUrl: parsed.toString(),
    title: result.title,
    snippet: result.snippet,
  } satisfies TripAffiliateHotelCandidate
}

function getSiteHotelRecords() {
  if (siteHotelRecordsCache) return siteHotelRecordsCache
  const groups: Array<{ cards: CityCard[]; countryCode: string }> = [
    { cards: busanHotelCards, countryCode: 'KR' },
    { cards: tokyoHotelCards, countryCode: 'JP' },
    { cards: fujiHotelCards, countryCode: 'JP' },
    { cards: northVietnamHotelCards, countryCode: 'VN' },
  ]
  const seen = new Set<string>()
  const records: SiteHotelRecord[] = []

  groups.forEach(({ cards, countryCode }) => {
    cards.forEach((card) => {
      const tripAction = card.actions?.find((action) => action.label.toLowerCase() === 'trip' && action.href.includes('trip.com'))
      if (!tripAction) return
      const parsed = parseTripUrl(tripAction.href)
      const hotelId = parsed ? tripHotelIdFromUrl(parsed) : ''
      if (!parsed || !hotelId) return
      const key = `${hotelId}:${normalizeTripText(card.title)}`
      if (seen.has(key)) return
      seen.add(key)
      records.push({
        hotelName: card.title,
        url: parsed.toString(),
        hotelId,
        city: card.area || card.meta,
        countryCode,
        latitude: typeof card.lat === 'number' ? card.lat : undefined,
        longitude: typeof card.lng === 'number' ? card.lng : undefined,
      })
    })
  })

  siteHotelRecordsCache = records
  return records
}

function scoreTripCandidate({
  query,
  title,
  snippet,
  url,
  candidateName,
  candidateCity,
  candidateCountryCode,
  candidateLatitude,
  candidateLongitude,
  rankIndex,
}: {
  query: TripAffiliateSearchResponse['query']
  title: string
  snippet: string
  url: string
  candidateName: string
  candidateCity?: string
  candidateCountryCode?: string
  candidateLatitude?: number
  candidateLongitude?: number
  rankIndex: number
}) {
  const haystack = normalizeTripText([title, snippet, url, candidateName].filter(Boolean).join(' '))
  const queryName = normalizeTripText(query.hotelName)
  const queryCity = normalizeTripText(query.city ?? '')
  const candidateCityText = normalizeTripText(candidateCity ?? '')
  const urlText = normalizeTripText(decodeURIComponent(url))
  const nameSimilarity = textSimilarity(queryName, haystack)
  const citySimilarity = queryCity ? Math.max(textSimilarity(queryCity, haystack), textSimilarity(queryCity, candidateCityText)) : 0
  const distance = distanceKm(query.latitude, query.longitude, candidateLatitude, candidateLongitude)

  let score = 0
  score += nameSimilarity * 0.72
  if (queryCity) score += citySimilarity * 0.12
  if (query.countryCode && candidateCountryCode === query.countryCode) score += 0.06
  if (urlText.includes('hotel detail') || urlText.includes('hotels detail') || url.includes('hotel-detail-')) score += 0.04
  if (typeof distance === 'number') {
    if (distance <= 0.15) score += 0.22
    else if (distance <= 0.5) score += 0.14
    else if (distance <= 1.2) score += 0.06
    else score -= 0.12
    if (distance <= 0.05 && nameSimilarity >= 0.4) score += 0.12
  }
  score += Math.max(0, 0.04 - rankIndex * 0.008)

  return Math.max(0, Math.min(0.99, Number(score.toFixed(4))))
}

function textSimilarity(needle: string, haystack: string) {
  if (!needle || !haystack) return 0
  if (haystack.includes(needle)) return 1

  const compactNeedle = needle.replace(/\s+/g, '')
  const compactHaystack = haystack.replace(/\s+/g, '')
  if (compactNeedle && compactHaystack.includes(compactNeedle)) return 0.96

  const tokens = tokenizeTripText(needle)
  if (tokens.length === 0) return 0
  let matchedWeight = 0
  let totalWeight = 0
  tokens.forEach((token) => {
    const weight = token.length >= 4 ? 1.5 : 1
    totalWeight += weight
    if (haystack.includes(token)) matchedWeight += weight
  })
  return totalWeight ? matchedWeight / totalWeight : 0
}

function tokenizeTripText(text: string) {
  return normalizeTripText(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !COMMON_TRIP_STOPWORDS.has(token))
}

const COMMON_TRIP_STOPWORDS = new Set([
  'hotel',
  'hotels',
  'trip',
  'com',
  '住宿',
  '飯店',
  '酒店',
  '旅館',
  '旅店',
  '訂房',
])

function normalizeTripText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/https?:\/\/|www\.|tw\.trip\.com|trip\.com/g, ' ')
    .replace(/[^\p{Letter}\p{Number}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTripTitle(value: string) {
  return value
    .replace(/\s*[-|｜]\s*Trip\.com.*$/i, '')
    .replace(/\s*[-|｜]\s*trip\.com.*$/i, '')
    .replace(/\s*訂房.*$/i, '')
    .trim()
    .slice(0, 120)
}

function getTripMatchStatus(score: number): TripAffiliateMatchStatus {
  if (score >= 0.82) return 'matched'
  if (score >= 0.68) return 'needs_review'
  return 'no_match'
}

function mergeTripCandidates(candidates: TripAffiliateHotelCandidate[]) {
  const seen = new Set<string>()
  return candidates.filter((candidate) => {
    const key = candidate.hotelId || candidate.originalUrl.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
    .sort((a, b) => b.score - a.score)
}

function buildTripSearchQuery(hotelName: string, city?: string) {
  return [
    'site:trip.com/hotels',
    hotelName,
    city,
    'Trip.com',
  ]
    .filter(Boolean)
    .join(' ')
}

function buildTripSearchUrl(hotelName: string, city?: string) {
  const url = new URL('https://www.google.com/search')
  url.searchParams.set('q', buildTripSearchQuery(hotelName, city))
  return url.toString()
}

function tripSearchNames(query: TripAffiliateSearchResponse['query']) {
  return cleanNameList([query.hotelName, ...query.alternateHotelNames], '', 4, 160)
}

function parseTripUrl(value: string | URL) {
  try {
    const url = value instanceof URL ? new URL(value.toString()) : new URL(value)
    const hostname = url.hostname.toLowerCase()
    if (!hostname.endsWith('trip.com')) return null
    return url
  } catch {
    return null
  }
}

function isTripHotelDetailUrl(url: URL) {
  const pathname = url.pathname.toLowerCase()
  return pathname.includes('/hotels/') && (pathname.includes('/detail') || pathname.includes('hotel-detail-'))
}

function tripHotelIdFromUrl(url: URL) {
  const queryId = url.searchParams.get('hotelId')?.trim()
  if (queryId && /^\d{3,}$/.test(queryId)) return queryId

  const pathId = url.pathname.match(/hotel-detail-(\d{3,})/i)?.[1]
  if (pathId) return pathId

  return ''
}

function distanceKm(latA?: number, lngA?: number, latB?: number, lngB?: number) {
  if (
    typeof latA !== 'number' ||
    typeof lngA !== 'number' ||
    typeof latB !== 'number' ||
    typeof lngB !== 'number' ||
    !Number.isFinite(latA) ||
    !Number.isFinite(lngA) ||
    !Number.isFinite(latB) ||
    !Number.isFinite(lngB)
  ) {
    return undefined
  }

  const radiusKm = 6371
  const dLat = toRadians(latB - latA)
  const dLng = toRadians(lngB - lngA)
  const fromLat = toRadians(latA)
  const toLat = toRadians(latB)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function cleanParam(value: unknown, fallback: string, maxLength: number) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : fallback
}

function cleanNameList(value: unknown, fallback: string, maxItems: number, maxLength: number) {
  const rawItems = Array.isArray(value) ? value : typeof value === 'string' ? [value] : fallback ? [fallback] : []
  const seen = new Set<string>()
  return rawItems
    .map((item) => (typeof item === 'string' ? item.trim().slice(0, maxLength) : ''))
    .filter((item) => {
      if (!item) return false
      const key = normalizeTripText(item)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, maxItems)
}

function readCoordinate(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) return undefined
  return number
}

function clampInteger(value: unknown, fallback: number, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isInteger(number) || number < min || number > max) return fallback
  return number
}
