import { busanHotelCards } from '@/data/busan/hotels'
import { fujiHotelCards } from '@/data/fuji/hotels'
import { northVietnamHotelCards } from '@/data/northvietnam/hotels'
import { tokyoHotelCards } from '@/data/tokyo/hotels'
import type { CityCard } from '@/components/CityTabbedList'
import {
  buildHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
  isUsableHotelAffiliateName,
} from '@/lib/hotelAffiliateIdentity'
import { findAgodaHotelIndexIdentity } from '@/lib/agodaAffiliate'

const DEFAULT_TRIP_ALLIANCE_ID = '6833709'
const DEFAULT_TRIP_SID = '242535686'
const DEFAULT_TRIP_SUB3 = 'D16730765'
const REQUEST_TIMEOUT_MS = 10000
const SEARCH_CACHE_TTL_MS = 1000 * 60 * 60 * 6
const EMPTY_SEARCH_CACHE_TTL_MS = 1000 * 60 * 10
export const TRIP_SEARCH_CACHE_MAX_ENTRIES = 128

export type TripAffiliateMatchStatus =
  | 'matched'
  | 'needs_review'
  | 'no_match'
  | 'not_configured'
  | 'search_error'

export type TripAffiliateSearchInput = {
  hotelName: string
  alternateHotelNames?: string[]
  googlePlaceId?: string
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  lodgingHint?: boolean
  forceRefresh?: boolean
  maxResult?: number
  tripSub1?: string
  tripSub3?: string
}

export type TripAffiliateCandidateMatchEvaluationInput = {
  hotelName: string
  alternateHotelNames?: string[]
  city?: string
  countryCode?: string
  latitude?: number
  longitude?: number
  candidateTitle: string
  candidateName?: string
  candidateSnippet?: string
  candidateUrl?: string
  candidateCity?: string
  candidateCountryCode?: string
  candidateLatitude?: number
  candidateLongitude?: number
  rankIndex?: number
}

export type TripAffiliateCandidateMatchEvaluation = {
  score: number
  matchStatus: TripAffiliateMatchStatus
  nameSimilarity: number
  distinctiveNameCoverage: number
  hasDistinctiveNameEvidence: boolean
  highConfidenceNameEvidence: boolean
}

export type TripAffiliateHotelCandidate = {
  hotelId: string
  hotelName: string
  score: number
  bookingUrl: string
  source: 'verified' | 'site_index' | 'serpapi' | 'google_cse'
  originalUrl: string
  title?: string
  snippet?: string
  alternateHotelNames?: string[]
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
    googlePlaceId?: string
    city?: string
    countryCode?: string
    latitude?: number
    longitude?: number
    maxResult: number
  }
  matchStatus: TripAffiliateMatchStatus
  confidence?: 'verified' | 'high' | 'review' | 'none'
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
  position?: number
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

  const hotelId = tripHotelIdFromUrl(parsed)
  // Trip city slugs, locale hosts, and review/photo paths change frequently.
  // The numeric hotel ID is the stable property identity and avoids retaining
  // another publisher's tracking parameters from a search result.
  const affiliateUrl =
    hotelId && isTripHotelDetailUrl(parsed)
      ? new URL(`https://tw.trip.com/hotels/detail/?hotelId=${encodeURIComponent(hotelId)}`)
      : parsed

  affiliateUrl.hostname = 'tw.trip.com'
  affiliateUrl.protocol = 'https:'
  affiliateUrl.searchParams.set('Allianceid', cleanParam(options.allianceId, DEFAULT_TRIP_ALLIANCE_ID, 32))
  affiliateUrl.searchParams.set('SID', cleanParam(options.sid, DEFAULT_TRIP_SID, 32))
  affiliateUrl.searchParams.set('trip_sub1', cleanParam(options.tripSub1, '', 120))
  affiliateUrl.searchParams.set('trip_sub3', cleanParam(options.tripSub3, DEFAULT_TRIP_SUB3, 80))
  return affiliateUrl.toString()
}

export async function searchTripAffiliateHotels(input: TripAffiliateSearchInput): Promise<TripAffiliateSearchResponse> {
  const config = readTripAffiliateConfig()
  const hotelNames = buildHotelAffiliateSearchNames({
    googlePlaceName: input.hotelName,
    alternateNames: input.alternateHotelNames,
    maxNames: 3,
  })
  let query: TripAffiliateSearchResponse['query'] = {
    hotelName: hotelNames[0] ?? input.hotelName.trim().slice(0, 160),
    alternateHotelNames: hotelNames.slice(1),
    googlePlaceId: cleanParam(input.googlePlaceId, '', 180),
    city: cleanParam(input.city, '', 80),
    countryCode: cleanParam(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
    maxResult: clampInteger(input.maxResult, 5, 1, 10),
  }

  const configuredResponse = () => ({
    configured: config.configured,
    allianceId: config.allianceId,
    sid: config.sid,
    sub3: config.sub3,
    searchProvider: config.searchProvider,
    query,
  })

  const verifiedIdentity = getApplicableVerifiedHotelAffiliateIdentity(query.googlePlaceId, {
    latitude: query.latitude,
    longitude: query.longitude,
    countryCode: query.countryCode,
  })
  if (verifiedIdentity?.trip?.sourceUrl) {
    const bestMatch: TripAffiliateHotelCandidate = {
      hotelId: verifiedIdentity.trip.hotelId,
      hotelName: verifiedIdentity.trip.hotelName,
      score: 1,
      bookingUrl: buildTripAffiliateUrl(verifiedIdentity.trip.sourceUrl, {
        allianceId: config.allianceId,
        sid: config.sid,
        tripSub1: input.tripSub1 ?? config.sub1,
        tripSub3: input.tripSub3 ?? config.sub3,
      }),
      source: 'verified',
      originalUrl: verifiedIdentity.trip.sourceUrl,
      title: verifiedIdentity.trip.hotelName,
      countryCode: verifiedIdentity.countryCode,
      latitude: verifiedIdentity.latitude,
      longitude: verifiedIdentity.longitude,
      distanceKm: 0,
    }
    return {
      ...configuredResponse(),
      matchStatus: 'matched',
      confidence: 'verified',
      bestMatch,
      candidates: [bestMatch],
      rawCount: 1,
    }
  }

  const siteIndexResult = searchSiteHotelIndex(config, query, input)
  if (
    siteIndexResult.bestMatch &&
    isHighConfidenceTripCandidate(siteIndexResult.bestMatch, query) &&
    !hasAmbiguousTripRunnerUp(siteIndexResult.bestMatch, siteIndexResult.candidates[1], query)
  ) {
    return {
      ...configuredResponse(),
      matchStatus: 'matched',
      confidence: 'high',
      bestMatch: siteIndexResult.bestMatch,
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
    }
  }

  if (!config.configured) {
    const matchStatus = siteIndexResult.candidates.length > 0 ? 'needs_review' : 'not_configured'
    return {
      ...configuredResponse(),
      matchStatus,
      confidence: tripMatchConfidence(matchStatus),
      ...(siteIndexResult.bestMatch ? { bestMatch: siteIndexResult.bestMatch } : {}),
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
      error: 'trip_search_provider_missing',
      searchUrl: buildTripSearchUrl(query.hotelName),
    }
  }

  try {
    let currentSiteIndexResult = siteIndexResult
    const searchResults: SearchResult[] = []
    const searchedNames = new Set<string>()
    let searchRawCount = 0
    let successfulSearchCount = 0
    let attemptedSearchCount = 0
    let firstSearchError: unknown

    const runSearch = async (searchName: string) => {
      const searchKey = normalizeTripText(searchName)
      if (!searchKey || searchedNames.has(searchKey)) return
      searchedNames.add(searchKey)
      attemptedSearchCount += 1
      try {
        const searchQuery: TripAffiliateSearchResponse['query'] = {
          ...query,
          hotelName: searchName,
          alternateHotelNames: [],
        }
        const results = await searchTripResults(config, searchQuery, input.forceRefresh === true)
        successfulSearchCount += 1
        searchRawCount += results.length
        searchResults.push(...results)
      } catch (error) {
        firstSearchError ??= error
      }
    }

    const evaluateCurrentResults = () => {
      const searchCandidates = searchResultsToCandidates(config, query, input, searchResults)
      const candidates = mergeTripCandidates(
        [...currentSiteIndexResult.candidates, ...searchCandidates],
        query,
      ).slice(0, query.maxResult)
      const bestMatch = candidates[0]
      const matchStatus = bestMatch ? getTripMatchStatus(bestMatch, query, candidates[1]) : 'no_match'
      return { candidates, bestMatch, matchStatus }
    }

    const primarySearchName = tripSearchNames(query)[0]
    if (primarySearchName) await runSearch(primarySearchName)
    let outcome = evaluateCurrentResults()

    if (
      outcome.matchStatus !== 'matched' &&
      typeof query.latitude === 'number' &&
      typeof query.longitude === 'number'
    ) {
      // Agoda's feed gives us a free, coordinate-verified canonical name.
      // Re-score the same SERP first; a Chinese Maps name often returns an
      // English Trip title, so this usually avoids a second paid search.
      const agodaIdentity = await findAgodaHotelIndexIdentity({
        hotelName: query.hotelName,
        alternateHotelNames: query.alternateHotelNames,
        countryCode: query.countryCode,
        latitude: query.latitude,
        longitude: query.longitude,
        lodgingHint: input.lodgingHint === true,
      })
      if (agodaIdentity) {
        const augmentedNames = buildHotelAffiliateSearchNames({
          googlePlaceName: query.hotelName,
          alternateNames: [
            ...agodaIdentity.canonicalNames,
            ...query.alternateHotelNames,
          ],
          maxNames: 6,
        })
        query = {
          ...query,
          hotelName: augmentedNames[0] ?? query.hotelName,
          alternateHotelNames: augmentedNames.slice(1),
        }
        currentSiteIndexResult = searchSiteHotelIndex(config, query, input)
        outcome = evaluateCurrentResults()
      }
    }

    if (outcome.matchStatus !== 'matched') {
      for (const searchName of tripSearchNames(query)) {
        await runSearch(searchName)
        outcome = evaluateCurrentResults()
        if (outcome.matchStatus === 'matched') break
      }
    }

    if (successfulSearchCount === 0 && attemptedSearchCount > 0) {
      throw firstSearchError ?? new Error('trip_search_failed')
    }

    return {
      ...configuredResponse(),
      matchStatus: outcome.matchStatus,
      confidence: tripMatchConfidence(outcome.matchStatus),
      ...(outcome.bestMatch ? { bestMatch: outcome.bestMatch } : {}),
      candidates: outcome.candidates,
      rawCount: searchRawCount + currentSiteIndexResult.rawCount,
      searchUrl: buildTripSearchUrl(query.hotelName),
    }
  } catch (error) {
    const matchStatus = siteIndexResult.bestMatch ? 'needs_review' : 'search_error'
    return {
      ...configuredResponse(),
      matchStatus,
      confidence: tripMatchConfidence(matchStatus),
      ...(siteIndexResult.bestMatch ? { bestMatch: siteIndexResult.bestMatch } : {}),
      candidates: siteIndexResult.candidates,
      rawCount: siteIndexResult.rawCount,
      error: error instanceof Error ? error.message.slice(0, 120) : 'trip_search_failed',
      searchUrl: buildTripSearchUrl(query.hotelName),
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
  const candidates: TripAffiliateHotelCandidate[] = []

  for (const record of records) {
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
    if (score < 0.55) continue

    const distance = distanceKm(query.latitude, query.longitude, record.latitude, record.longitude)
    candidates.push({
      hotelId: record.hotelId,
      hotelName: record.hotelName,
      score,
      bookingUrl: buildTripAffiliateUrl(record.url, {
        allianceId: config.allianceId,
        sid: config.sid,
        tripSub1: input.tripSub1 ?? config.sub1,
        tripSub3: input.tripSub3 ?? config.sub3,
      }),
      source: 'site_index',
      originalUrl: record.url,
      title: record.hotelName,
      ...(record.city ? { city: record.city } : {}),
      ...(record.countryCode ? { countryCode: record.countryCode } : {}),
      ...(typeof record.latitude === 'number' ? { latitude: record.latitude } : {}),
      ...(typeof record.longitude === 'number' ? { longitude: record.longitude } : {}),
      ...(typeof distance === 'number' ? { distanceKm: distance } : {}),
    })
  }

  const sortedCandidates = mergeTripCandidates(candidates, query).slice(0, query.maxResult)

  return {
    bestMatch: sortedCandidates[0],
    candidates: sortedCandidates,
    rawCount: records.length,
  }
}

async function searchTripResults(
  config: TripAffiliateConfig,
  query: TripAffiliateSearchResponse['query'],
  forceRefresh = false,
) {
  const cacheKey = [
    config.searchProvider,
    normalizeTripText(query.hotelName),
  ].join('|')
  if (!forceRefresh) {
    const cached = readTripSearchCache(cacheKey)
    if (cached) return cached
  }

  const searchText = buildTripSearchQuery(query.hotelName)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const results =
      config.searchProvider === 'serpapi'
        ? await searchWithSerpApi(config, searchText, controller.signal)
        : await searchWithGoogleCse(config, searchText, controller.signal)
    writeTripSearchCache(cacheKey, results)
    return results
  } finally {
    clearTimeout(timeout)
  }
}

function readTripSearchCache(cacheKey: string) {
  const cached = searchCache.get(cacheKey)
  if (!cached) return undefined
  if (cached.expiresAt <= Date.now()) {
    searchCache.delete(cacheKey)
    return undefined
  }

  // Refresh insertion order so the bounded map behaves as a small LRU cache.
  searchCache.delete(cacheKey)
  searchCache.set(cacheKey, cached)
  return cached.results
}

function writeTripSearchCache(cacheKey: string, results: SearchResult[]) {
  const now = Date.now()
  for (const [key, cached] of searchCache) {
    if (cached.expiresAt <= now) searchCache.delete(key)
  }

  searchCache.delete(cacheKey)
  searchCache.set(cacheKey, {
    expiresAt: now + (results.length > 0 ? SEARCH_CACHE_TTL_MS : EMPTY_SEARCH_CACHE_TTL_MS),
    results,
  })
  while (searchCache.size > TRIP_SEARCH_CACHE_MAX_ENTRIES) {
    const oldestKey = searchCache.keys().next().value
    if (typeof oldestKey !== 'string') break
    searchCache.delete(oldestKey)
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
    error?: unknown
    search_metadata?: { status?: unknown }
    organic_results?: Array<{ link?: unknown; title?: unknown; snippet?: unknown; position?: unknown }>
  }
  if (typeof payload.error === 'string' && payload.error.trim()) {
    throw new Error(`serpapi_${payload.error.trim().slice(0, 80)}`)
  }
  const searchStatus =
    typeof payload.search_metadata?.status === 'string'
      ? payload.search_metadata.status.trim().toLowerCase()
      : ''
  if (searchStatus && searchStatus !== 'success') throw new Error(`serpapi_${searchStatus.slice(0, 40)}`)
  return (payload.organic_results ?? [])
    .map((item) => ({
      url: typeof item.link === 'string' ? item.link : '',
      title: typeof item.title === 'string' ? item.title : '',
      snippet: typeof item.snippet === 'string' ? item.snippet : '',
      ...(typeof item.position === 'number' && Number.isFinite(item.position)
        ? { position: Math.max(1, Math.round(item.position)) }
        : {}),
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
    .map((item, index) => ({
      url: typeof item.link === 'string' ? item.link : '',
      title: typeof item.title === 'string' ? item.title : '',
      snippet: typeof item.snippet === 'string' ? item.snippet : '',
      position: index + 1,
      source: 'google_cse' as const,
    }))
    .filter((item) => item.url)
}

function searchResultsToCandidates(
  config: TripAffiliateConfig,
  query: TripAffiliateSearchResponse['query'],
  input: TripAffiliateSearchInput,
  results: SearchResult[],
) {
  const groupedResults = new Map<
    string,
    Array<{ result: SearchResult; parsed: URL; rankIndex: number }>
  >()

  results.forEach((result, index) => {
    const parsed = parseTripUrl(result.url)
    if (!parsed || !isTripHotelDetailUrl(parsed)) return
    const hotelId = tripHotelIdFromUrl(parsed)
    if (!hotelId) return
    const rankIndex =
      typeof result.position === 'number'
        ? Math.max(0, result.position - 1)
        : index
    const existing = groupedResults.get(hotelId) ?? []
    existing.push({ result, parsed, rankIndex })
    groupedResults.set(hotelId, existing)
  })

  const queryNames = tripSearchNames(query)
  const candidates: TripAffiliateHotelCandidate[] = []

  groupedResults.forEach((group, hotelId) => {
    const scoredResults = group
      .map((entry) => {
        const details = queryNames
          .map((hotelName) =>
            scoreTripCandidateDetails({
              query: { ...query, hotelName, alternateHotelNames: [] },
              title: entry.result.title,
              snippet: entry.result.snippet,
              url: entry.parsed.toString(),
              candidateName: entry.result.title,
              rankIndex: entry.rankIndex,
            }),
          )
          .sort(compareTripCandidateScoreDetails)[0]
        return { ...entry, details }
      })
      .filter((entry) => Boolean(entry.details))
      .sort((a, b) => {
        const detailOrder = compareTripCandidateScoreDetails(
          a.details as TripCandidateScoreDetails,
          b.details as TripCandidateScoreDetails,
        )
        if (detailOrder !== 0) return detailOrder
        return a.rankIndex - b.rankIndex
      })

    const best = scoredResults[0]
    if (!best?.details || best.details.score < 0.55) return

    const candidateNames = cleanNameList(
      group.flatMap(({ result, parsed }) =>
        cleanTripSearchResultIdentities(result.title, parsed),
      ),
      '',
      12,
      160,
    )
    const hotelName = cleanTripTitle(best.result.title) || candidateNames[0] || query.hotelName
    const alternateHotelNames = candidateNames.filter(
      (name) => normalizeTripText(name) !== normalizeTripText(hotelName),
    )
    const bookingUrl = buildTripAffiliateUrl(best.parsed.toString(), {
      allianceId: config.allianceId,
      sid: config.sid,
      tripSub1: input.tripSub1 ?? config.sub1,
      tripSub3: input.tripSub3 ?? config.sub3,
    })
    if (!bookingUrl) return

    candidates.push({
      hotelId,
      hotelName,
      score: best.details.score,
      bookingUrl,
      source: best.result.source,
      originalUrl: best.parsed.toString(),
      title: best.result.title,
      snippet: best.result.snippet,
      ...(alternateHotelNames.length > 0 ? { alternateHotelNames } : {}),
    })
  })

  return mergeTripCandidates(candidates, query).slice(0, query.maxResult)
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
      const tripAction = card.actions?.find(
        (action) => action.label.toLowerCase() === 'trip' && Boolean(parseTripUrl(action.href)),
      )
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

type TripCandidateScoreInput = {
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
}

type TripNameEvidence = {
  similarity: number
  distinctiveCoverage: number
  candidateDistinctiveCoverage: number
  matchedDistinctiveTokenCount: number
  exactNameMatch: boolean
  hasDistinctiveNameEvidence: boolean
  highConfidence: boolean
}

type TripCandidateScoreDetails = {
  score: number
  nameEvidence: TripNameEvidence
}

const EMPTY_TRIP_NAME_EVIDENCE: TripNameEvidence = {
  similarity: 0,
  distinctiveCoverage: 0,
  candidateDistinctiveCoverage: 0,
  matchedDistinctiveTokenCount: 0,
  exactNameMatch: false,
  hasDistinctiveNameEvidence: false,
  highConfidence: false,
}

export function evaluateTripAffiliateCandidateMatch(
  input: TripAffiliateCandidateMatchEvaluationInput,
): TripAffiliateCandidateMatchEvaluation {
  const hotelNames = buildHotelAffiliateSearchNames({
    googlePlaceName: input.hotelName,
    alternateNames: input.alternateHotelNames,
    maxNames: 3,
  })
  const query: TripAffiliateSearchResponse['query'] = {
    hotelName: hotelNames[0] ?? input.hotelName.trim().slice(0, 160),
    alternateHotelNames: hotelNames.slice(1),
    city: cleanParam(input.city, '', 80),
    countryCode: cleanParam(input.countryCode, '', 2).toUpperCase(),
    latitude: readCoordinate(input.latitude, -90, 90),
    longitude: readCoordinate(input.longitude, -180, 180),
    maxResult: 5,
  }

  const evaluations = tripSearchNames(query).map((hotelName) =>
    scoreTripCandidateDetails({
      query: { ...query, hotelName, alternateHotelNames: [] },
      title: input.candidateTitle,
      snippet: input.candidateSnippet ?? '',
      url: input.candidateUrl ?? '',
      candidateName: input.candidateName ?? input.candidateTitle,
      candidateCity: input.candidateCity,
      candidateCountryCode: input.candidateCountryCode,
      candidateLatitude: input.candidateLatitude,
      candidateLongitude: input.candidateLongitude,
      rankIndex: clampInteger(input.rankIndex, 0, 0, 100),
    }),
  )
  const candidateIdentities = cleanTripCandidateIdentities(
    input.candidateName ?? input.candidateTitle,
    input.candidateTitle,
  )
  const primaryNumbersMatch = tripPrimaryNumericIdentityMatchesNames(
    query.hotelName,
    candidateIdentities,
    query.city,
  )
  const best = evaluations.sort(compareTripCandidateScoreDetails)[0]
  if (!best) {
    return {
      score: 0,
      matchStatus: 'no_match',
      nameSimilarity: 0,
      distinctiveNameCoverage: 0,
      hasDistinctiveNameEvidence: false,
      highConfidenceNameEvidence: false,
    }
  }

  const highConfidenceNameEvidence = best.nameEvidence.highConfidence && primaryNumbersMatch
  return {
    score: best.score,
    matchStatus: highConfidenceNameEvidence
      ? 'matched'
      : best.score >= 0.68
        ? 'needs_review'
        : 'no_match',
    nameSimilarity: best.nameEvidence.similarity,
    distinctiveNameCoverage: best.nameEvidence.distinctiveCoverage,
    hasDistinctiveNameEvidence: best.nameEvidence.hasDistinctiveNameEvidence,
    highConfidenceNameEvidence,
  }
}

function scoreTripCandidate(input: TripCandidateScoreInput) {
  return scoreTripCandidateDetails(input).score
}

function scoreTripCandidateDetails({
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
}: TripCandidateScoreInput): TripCandidateScoreDetails {
  const candidateIdentities = cleanTripCandidateIdentities(candidateName, title)
  const nameEvidence = bestTripNameEvidence([query.hotelName], candidateIdentities, query.city)
  const queryCity = normalizeTripText(query.city ?? '')
  const candidateCityText = normalizeTripText(candidateCity ?? '')
  const contextText = normalizeTripText([title, snippet, candidateCity].filter(Boolean).join(' '))
  const urlText = normalizeTripText(decodeURIComponent(url))
  const citySimilarity = queryCity
    ? Math.max(textSimilarity(queryCity, contextText), textSimilarity(queryCity, candidateCityText))
    : 0
  const distance = distanceKm(query.latitude, query.longitude, candidateLatitude, candidateLongitude)

  let score = 0
  score += nameEvidence.similarity * 0.72
  if (queryCity) score += citySimilarity * 0.12
  if (query.countryCode && candidateCountryCode === query.countryCode) score += 0.06
  if (urlText.includes('hotel detail') || urlText.includes('hotels detail') || url.includes('hotel-detail-')) score += 0.04
  if (typeof distance === 'number') {
    if (distance <= 0.15) score += 0.22
    else if (distance <= 0.5) score += 0.14
    else if (distance <= 1.2) score += 0.06
    else score -= 0.12
    if (distance <= 0.05 && nameEvidence.similarity >= 0.4) score += 0.12
  }
  score += Math.max(0, 0.04 - rankIndex * 0.008)

  return {
    score: Math.max(0, Math.min(0.99, Number(score.toFixed(4)))),
    nameEvidence,
  }
}

function cleanTripCandidateIdentities(candidateName: string, title: string) {
  const names = cleanNameList(
    [cleanTripTitle(candidateName), cleanTripTitle(title)],
    '',
    2,
    160,
  )
  const identities: string[] = []
  names.forEach((name) => {
    identities.push(name)
    const parentheticalNames = Array.from(name.matchAll(/[（(]([^()（）]{2,120})[)）]/g))
      .map((match) => match[1]?.trim() ?? '')
      .filter(Boolean)
    identities.push(...parentheticalNames)
  })
  return cleanNameList(identities, '', 8, 160)
}

function cleanTripSearchResultIdentities(title: string, url: URL) {
  const identities = cleanTripCandidateIdentities(title, title)
  const propertySlug = tripPropertySlugFromUrl(url)
  if (propertySlug) identities.push(propertySlug)
  const cleanedTitle = cleanTripTitle(title)
  const citySlug = url.pathname.match(/\/hotels\/([a-z0-9-]+)-hotel-detail-\d+/i)?.[1] ?? ''
  if (cleanedTitle && citySlug) {
    const suffixMatch = cleanedTitle.match(/^(.{2,140}?)\s*[（(]([^()（）]{2,50})[)）]\s*$/)
    if (suffixMatch?.[1] && suffixMatch[2]) {
      const suffixTokens = tokenizeTripText(suffixMatch[2])
      const cityTokens = new Set(tokenizeTripText(citySlug.replace(/-/g, ' ')))
      if (suffixTokens.length > 0 && suffixTokens.every((token) => cityTokens.has(token))) {
        identities.push(suffixMatch[1].trim())
      }
    }
  }
  return cleanNameList(identities, '', 10, 160)
}

function tripPropertySlugFromUrl(url: URL) {
  const segment = url.pathname.match(/\/hotels\/[^/]+-hotel-detail-\d+\/([^/]+)/i)?.[1] ?? ''
  const clean = segment
    .replace(/\.(?:html?|aspx)$/i, '')
    .trim()
  // A Trip hotel-detail URL has the canonical property slug immediately
  // after its numeric hotel ID.  It is reliable identity evidence even when
  // Google chooses a localized "photos" title for the search result.
  return clean && !/^(?:photo|review|rooms?|amenities)$/i.test(clean)
    ? clean.replace(/[-_]+/g, ' ')
    : ''
}

function bestTripNameEvidence(queryNames: string[], candidateNames: string[], city?: string) {
  const evidence = queryNames.flatMap((queryName) =>
    candidateNames.map((candidateName) => evaluateTripNameEvidence(queryName, candidateName, city)),
  )
  return evidence.sort(compareTripNameEvidence)[0] ?? EMPTY_TRIP_NAME_EVIDENCE
}

function evaluateTripNameEvidence(
  queryName: string,
  candidateIdentity: string,
  city?: string,
): TripNameEvidence {
  const normalizedQuery = normalizeTripText(queryName)
  const normalizedCandidate = normalizeTripText(candidateIdentity)
  if (!normalizedQuery || !normalizedCandidate) return EMPTY_TRIP_NAME_EVIDENCE

  const compactQuery = normalizedQuery.replace(/\s+/g, '')
  const compactCandidate = normalizedCandidate.replace(/\s+/g, '')
  const normalizedExactMatch = compactQuery === compactCandidate
  const candidateContainsQuery = compactCandidate.includes(compactQuery)

  const queryTokens = distinctiveTripNameTokens(normalizedQuery, city)
  const candidateTokens = distinctiveTripNameTokens(normalizedCandidate, city)
  const normalizedCity = normalizeTripText(city ?? '')
  const queryHasCityQualifier = Boolean(normalizedCity && normalizedQuery.includes(normalizedCity))
  const nonNumericQueryTokenCount = queryTokens.filter((token) => !/^\d+$/.test(token)).length
  const exactLongCjkOrHangulName =
    normalizedExactMatch &&
    queryTokens.length === 1 &&
    isSpecificLongCjkOrHangulToken(queryTokens[0])
  const queryIsSpecificEnough =
    nonNumericQueryTokenCount >= 2 ||
    (queryHasCityQualifier && nonNumericQueryTokenCount >= 1) ||
    (queryHasCityQualifier && hasNumericTripHotelBrandShape(normalizedQuery)) ||
    exactLongCjkOrHangulName
  const queryTokenSet = new Set(queryTokens)
  const candidateTokenSet = new Set(candidateTokens)
  const matchedQueryTokens = queryTokens.filter((token) => candidateTokenSet.has(token))
  const matchedCandidateTokens = candidateTokens.filter((token) => queryTokenSet.has(token))
  const distinctiveCoverage = weightedTripTokenCoverage(queryTokens, matchedQueryTokens)
  const candidateDistinctiveCoverage = weightedTripTokenCoverage(candidateTokens, matchedCandidateTokens)
  const exactNameMatch =
    normalizedExactMatch &&
    queryTokens.length > 0
  const matchedDistinctiveTokenCount = matchedQueryTokens.length
  const hasDistinctiveNameEvidence =
    exactNameMatch ||
    (
      matchedDistinctiveTokenCount > 0 &&
      distinctiveCoverage >= 0.5 &&
      candidateDistinctiveCoverage >= 0.5
    )

  let similarity = textSimilarity(normalizedQuery, normalizedCandidate)
  if (normalizedExactMatch) {
    similarity = 1
  } else if (candidateContainsQuery && hasDistinctiveNameEvidence) {
    similarity = Math.max(similarity, 0.98)
  }

  const queryNumberTokens = tripNumericIdentityTokens(queryTokens)
  const candidateNumberTokens = tripNumericIdentityTokens(candidateTokens)
  const numbersMatch = sameTripTokenSet(queryNumberTokens, candidateNumberTokens)
  const tokenSetsMatch = sameTripTokenSet(queryTokens, candidateTokens)
  const candidateExtraTokens = candidateTokens.filter((token) => !queryTokenSet.has(token))
  const safeCandidateContainment =
    candidateContainsQuery &&
    distinctiveCoverage >= 0.999 &&
    numbersMatch &&
    candidateExtraTokens.length === 0 &&
    queryIsSpecificEnough
  const safeTokenEquivalence =
    tokenSetsMatch &&
    numbersMatch &&
    queryIsSpecificEnough
  const highConfidence =
    queryIsSpecificEnough &&
    (
      exactNameMatch ||
      (hasDistinctiveNameEvidence && (safeCandidateContainment || (safeTokenEquivalence && similarity >= 0.72)))
    )

  return {
    similarity,
    distinctiveCoverage,
    candidateDistinctiveCoverage,
    matchedDistinctiveTokenCount,
    exactNameMatch,
    hasDistinctiveNameEvidence,
    highConfidence,
  }
}

function sameTripTokenSet(left: string[], right: string[]) {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((token) => rightSet.has(token))
}

function tripNumericIdentityTokens(tokens: string[]) {
  return tokens.flatMap((token) => token.match(/\d{1,6}/g) ?? [])
}

function isSpecificLongCjkOrHangulToken(token: string) {
  const codePointLength = Array.from(token).length
  return (
    codePointLength >= 4 &&
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(token)
  )
}

function weightedTripTokenCoverage(tokens: string[], matchedTokens: string[]) {
  const matched = new Set(matchedTokens)
  let totalWeight = 0
  let matchedWeight = 0
  tokens.forEach((token) => {
    const weight = tripTokenWeight(token)
    totalWeight += weight
    if (matched.has(token)) matchedWeight += weight
  })
  return totalWeight ? matchedWeight / totalWeight : 0
}

function tripTokenWeight(token: string) {
  return token.length >= 4 ? 1.5 : 1
}

function distinctiveTripNameTokens(value: string, city?: string) {
  const cityTokens = new Set(tokenizeTripText(city ?? ''))
  return tokenizeTripText(value).filter((token) => {
    if (COMMON_TRIP_IDENTITY_STOPWORDS.has(token)) return false
    if (cityTokens.has(token)) return false
    if (/^(?:zip|postal|postcode)\d*$/i.test(token)) return false
    return true
  })
}

function hasNumericTripHotelBrandShape(value: string) {
  const tokens = normalizeTripText(value).split(/\s+/).filter(Boolean)
  return (
    tokens.some((token) => /^\d{1,6}$/.test(token)) &&
    tokens.some((token) => COMMON_TRIP_STOPWORDS.has(token))
  )
}

function compareTripCandidateScoreDetails(a: TripCandidateScoreDetails, b: TripCandidateScoreDetails) {
  const statusPriority: Record<TripAffiliateMatchStatus, number> = {
    matched: 2,
    needs_review: 1,
    no_match: 0,
    not_configured: 0,
    search_error: 0,
  }
  const statusDifference =
    statusPriority[getTripEvaluationMatchStatus(b)] -
    statusPriority[getTripEvaluationMatchStatus(a)]
  if (statusDifference !== 0) return statusDifference
  if (a.nameEvidence.highConfidence !== b.nameEvidence.highConfidence) {
    return a.nameEvidence.highConfidence ? -1 : 1
  }
  if (a.nameEvidence.exactNameMatch !== b.nameEvidence.exactNameMatch) {
    return a.nameEvidence.exactNameMatch ? -1 : 1
  }
  if (a.nameEvidence.distinctiveCoverage !== b.nameEvidence.distinctiveCoverage) {
    return b.nameEvidence.distinctiveCoverage - a.nameEvidence.distinctiveCoverage
  }
  if (a.nameEvidence.candidateDistinctiveCoverage !== b.nameEvidence.candidateDistinctiveCoverage) {
    return b.nameEvidence.candidateDistinctiveCoverage - a.nameEvidence.candidateDistinctiveCoverage
  }
  return b.score - a.score
}

function getTripEvaluationMatchStatus(evaluation: TripCandidateScoreDetails): TripAffiliateMatchStatus {
  if (evaluation.nameEvidence.highConfidence) return 'matched'
  if (evaluation.score >= 0.68) return 'needs_review'
  return 'no_match'
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
    const weight = tripTokenWeight(token)
    totalWeight += weight
    if (haystack.includes(token)) matchedWeight += weight
  })
  return totalWeight ? matchedWeight / totalWeight : 0
}

function tokenizeTripText(text: string) {
  return normalizeTripText(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) =>
      (
        token.length >= 2 ||
        /^\p{Script=Han}$/u.test(token) ||
        /^[a-z]$/i.test(token) ||
        /^\d$/u.test(token)
      ) &&
      !COMMON_TRIP_STOPWORDS.has(token),
    )
}

const COMMON_TRIP_STOPWORDS = new Set([
  'hotel',
  'hotels',
  'hostel',
  'motel',
  'inn',
  'resort',
  'ryokan',
  'lodge',
  'guesthouse',
  'accommodation',
  'by',
  'the',
  'and',
  'at',
  'of',
  'trip',
  'com',
  '住宿',
  '飯店',
  '酒店',
  '旅館',
  '旅店',
  '訂房',
])

const COMMON_TRIP_IDENTITY_STOPWORDS = new Set([
  ...COMMON_TRIP_STOPWORDS,
  'booking',
  'book',
  'deal',
  'deals',
  'offer',
  'offers',
  'photo',
  'photos',
  'price',
  'prices',
  'review',
  'reviews',
  'room',
  'rooms',
  'japan',
  'jp',
  '日本',
  'korea',
  'kr',
  '韓國',
  '韩国',
  '한국',
  '대한민국',
  'taiwan',
  'tw',
  '台灣',
  '台湾',
  'vietnam',
  'vn',
  '越南',
  'china',
  'cn',
  '中國',
  '中国',
])

const TRIP_CANDIDATE_SOURCE_PRIORITY: Record<TripAffiliateHotelCandidate['source'], number> = {
  verified: 0,
  site_index: 1,
  serpapi: 2,
  google_cse: 3,
}

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
    .replace(/\s*[|｜]\s*20\d{2}(?:年)?\s*(?:最新)?訂房優惠.*$/i, '')
    .replace(/\s*[-|｜]\s*20\d{2}(?:年)?\s+(?=[^|｜]{0,120}\b(?:prices?|reviews?|deals?|photos?)\b)[^|｜]*$/i, '')
    .replace(/^\s*20\d{2}(?:年)?\s*(?:最新|latest)[^|｜]{0,80}[|｜]\s*/i, '')
    .replace(/\s*[-|｜]\s*20\d{2}(?:年)?\s*(?:最新|latest).*$/i, '')
    .replace(/\s*[|｜]\s*[^|｜]*(?:住宿推薦|住宿推介|hotel\s+recommendations?|booking\s+deals?).*$/i, '')
    .replace(/\s*訂房.*$/i, '')
    .trim()
    .slice(0, 120)
}

function getTripMatchStatus(
  candidate: TripAffiliateHotelCandidate,
  query: TripAffiliateSearchResponse['query'],
  runnerUp?: TripAffiliateHotelCandidate,
): TripAffiliateMatchStatus {
  if (
    isHighConfidenceTripCandidate(candidate, query) &&
    !hasAmbiguousTripRunnerUp(candidate, runnerUp, query)
  ) {
    return 'matched'
  }
  if (candidate.score >= 0.68) return 'needs_review'
  return 'no_match'
}

function tripMatchConfidence(status: TripAffiliateMatchStatus): 'high' | 'review' | 'none' {
  if (status === 'matched') return 'high'
  if (status === 'needs_review') return 'review'
  return 'none'
}

function isHighConfidenceTripCandidate(
  candidate: TripAffiliateHotelCandidate,
  query: TripAffiliateSearchResponse['query'],
) {
  if (
    query.countryCode &&
    candidate.countryCode &&
    query.countryCode !== candidate.countryCode.toUpperCase()
  ) {
    return false
  }
  if (!tripPrimaryNumericIdentityMatchesCandidate(candidate, query)) return false
  const nameEvidence = bestTripCandidateNameEvidence(candidate, query)
  if (nameEvidence.highConfidence) return true
  return candidate.source === 'site_index' && candidate.score >= 0.9 && nameEvidence.exactNameMatch
}

function tripPrimaryNumericIdentityMatchesCandidate(
  candidate: TripAffiliateHotelCandidate,
  query: TripAffiliateSearchResponse['query'],
) {
  return tripPrimaryNumericIdentityMatchesNames(
    query.hotelName,
    cleanNameList(
      [
        ...cleanTripCandidateIdentities(candidate.hotelName, candidate.title ?? ''),
        ...(candidate.alternateHotelNames ?? []),
      ],
      '',
      16,
      160,
    ),
    query.city,
  )
}

function tripPrimaryNumericIdentityMatchesNames(
  primaryQueryName: string,
  candidateNames: string[],
  city?: string,
) {
  const primaryNumbers = tripNumericIdentityTokens(
    distinctiveTripNameTokens(normalizeTripText(primaryQueryName), city),
  )
  if (primaryNumbers.length === 0) return true
  return candidateNames.some((candidateName) => {
    const candidateNumbers = tripNumericIdentityTokens(
      distinctiveTripNameTokens(normalizeTripText(candidateName), city),
    )
    return sameTripTokenSet(primaryNumbers, candidateNumbers)
  })
}

function hasAmbiguousTripRunnerUp(
  candidate: TripAffiliateHotelCandidate,
  runnerUp: TripAffiliateHotelCandidate | undefined,
  query: TripAffiliateSearchResponse['query'],
) {
  if (!runnerUp || !isHighConfidenceTripCandidate(runnerUp, query)) return false
  return candidate.score - runnerUp.score <= 0.08
}

function bestTripCandidateNameEvidence(
  candidate: TripAffiliateHotelCandidate,
  query: TripAffiliateSearchResponse['query'],
) {
  const candidateIdentities = cleanNameList(
    [
      ...cleanTripCandidateIdentities(candidate.hotelName, candidate.title ?? ''),
      ...(candidate.alternateHotelNames ?? []),
    ],
    '',
    16,
    160,
  )
  return bestTripNameEvidence(tripSearchNames(query), candidateIdentities, query.city)
}

function compareTripNameEvidence(a: TripNameEvidence, b: TripNameEvidence) {
  if (a.highConfidence !== b.highConfidence) return a.highConfidence ? -1 : 1
  if (a.exactNameMatch !== b.exactNameMatch) return a.exactNameMatch ? -1 : 1
  if (a.distinctiveCoverage !== b.distinctiveCoverage) {
    return b.distinctiveCoverage - a.distinctiveCoverage
  }
  if (a.candidateDistinctiveCoverage !== b.candidateDistinctiveCoverage) {
    return b.candidateDistinctiveCoverage - a.candidateDistinctiveCoverage
  }
  if (a.matchedDistinctiveTokenCount !== b.matchedDistinctiveTokenCount) {
    return b.matchedDistinctiveTokenCount - a.matchedDistinctiveTokenCount
  }
  return b.similarity - a.similarity
}

function compareTripCandidates(
  a: TripAffiliateHotelCandidate,
  b: TripAffiliateHotelCandidate,
  query: TripAffiliateSearchResponse['query'],
) {
  const aEvidence = bestTripCandidateNameEvidence(a, query)
  const bEvidence = bestTripCandidateNameEvidence(b, query)
  const aMatched = isHighConfidenceTripCandidate(a, query)
  const bMatched = isHighConfidenceTripCandidate(b, query)
  if (aMatched !== bMatched) return aMatched ? -1 : 1
  const aNeedsReview = !aMatched && a.score >= 0.68
  const bNeedsReview = !bMatched && b.score >= 0.68
  if (aNeedsReview !== bNeedsReview) return aNeedsReview ? -1 : 1

  const evidenceOrder = compareTripNameEvidence(aEvidence, bEvidence)
  if (evidenceOrder !== 0) return evidenceOrder
  if (a.score !== b.score) return b.score - a.score
  if (a.source !== b.source) return TRIP_CANDIDATE_SOURCE_PRIORITY[a.source] - TRIP_CANDIDATE_SOURCE_PRIORITY[b.source]
  return a.hotelId.localeCompare(b.hotelId)
}

function mergeTripCandidates(
  candidates: TripAffiliateHotelCandidate[],
  query: TripAffiliateSearchResponse['query'],
) {
  const byHotelId = new Map<string, TripAffiliateHotelCandidate>()
  candidates.forEach((candidate) => {
    const key = candidate.hotelId || candidate.originalUrl.toLowerCase()
    const existing = byHotelId.get(key)
    if (!existing || compareTripCandidates(candidate, existing, query) < 0) {
      byHotelId.set(key, candidate)
    }
  })
  return [...byHotelId.values()].sort((a, b) => compareTripCandidates(a, b, query))
}

function buildTripSearchQuery(hotelName: string) {
  const exactHotelName = hotelName
    .replace(/["“”]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  // Planner city labels can be Agoda catalogue regions (for example
  // "Okinawa Main island"), not the city used by Trip ("Naha").
  return [
    'site:trip.com/hotels',
    exactHotelName ? `"${exactHotelName}"` : '',
    'Trip.com',
  ]
    .filter(Boolean)
    .join(' ')
}

function buildTripSearchUrl(hotelName: string) {
  const url = new URL('https://www.google.com/search')
  url.searchParams.set('q', buildTripSearchQuery(hotelName))
  return url.toString()
}

function tripSearchNames(query: TripAffiliateSearchResponse['query']) {
  return cleanNameList([query.hotelName, ...query.alternateHotelNames], '', 5, 160)
    .filter((hotelName) => isUsableTripSearchName(hotelName, query.city))
    .slice(0, 3)
}

function isUsableTripSearchName(hotelName: string, city?: string) {
  const normalizedName = normalizeTripText(hotelName)
  if (!normalizedName || !isUsableHotelAffiliateName(hotelName)) return false
  return (
    distinctiveTripNameTokens(normalizedName, city).length > 0 ||
    hasNumericTripHotelBrandShape(normalizedName)
  )
}

function parseTripUrl(value: string | URL) {
  try {
    const url = value instanceof URL ? new URL(value.toString()) : new URL(value)
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      (hostname !== 'trip.com' && !hostname.endsWith('.trip.com'))
    ) {
      return null
    }
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
