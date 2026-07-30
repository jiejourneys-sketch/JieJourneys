import { expect, test } from '@playwright/test'
import {
  cleanAgodaAlternateHotelNames,
  findAgodaHotelIndexIdentity,
  searchAgodaAffiliateHotels,
  scoreAgodaHotelNameAliases,
} from '../lib/agodaAffiliate'

test('cleans, deduplicates, and bounds Agoda alternate hotel names', () => {
  const aliases = cleanAgodaAlternateHotelNames([
    '  Centurion Hotel & Spa Ueno Station  ',
    'ＣＥＮＴＵＲＩＯＮ　ＨＯＴＥＬ　＆　ＳＰＡ　ＵＥＮＯ　ＳＴＡＴＩＯＮ',
    '',
    null,
    ...Array.from({ length: 10 }, (_, index) => `Alias ${index + 1}`),
  ], 'centurion hotel & spa ueno station')

  expect(aliases).toEqual(Array.from({ length: 8 }, (_, index) => `Alias ${index + 1}`))
})

test('uses the highest score across every query and candidate alias', () => {
  const primaryOnlyScore = scoreAgodaHotelNameAliases(
    ['日本〒110-'],
    ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  )
  const aliasScore = scoreAgodaHotelNameAliases(
    ['日本〒110-', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
    ['Unrelated current name', 'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring', 'Former name'],
  )

  expect(primaryOnlyScore).toBeLessThan(0.42)
  expect(aliasScore).toBe(1)
})

test('keeps the dense-area coordinate guard while allowing a canonical alias to match', async () => {
  const baseQuery = {
    hotelName: '日本〒110-',
    latitude: 35.7098512,
    longitude: 139.7756721,
    lodgingHint: true,
  }
  const coordinateOnlyResult = await searchAgodaAffiliateHotels(baseQuery)
  const canonicalAliasResult = await searchAgodaAffiliateHotels({
    ...baseQuery,
    alternateHotelNames: ['Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'],
  })

  expect(coordinateOnlyResult.matchStatus).toBe('needs_review')
  expect(canonicalAliasResult.matchStatus).toBe('matched')
  expect(canonicalAliasResult.bestMatch?.hotelId).toBe('2232362')
})

test('finds the Okinawa Kenchomae Agoda identity from the local index without network access', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (() => {
    throw new Error('findAgodaHotelIndexIdentity must not use the network')
  }) as typeof fetch

  try {
    const identity = await findAgodaHotelIndexIdentity({
      hotelName: '沖繩縣廳前大和ROYNET飯店',
      countryCode: 'JP',
      latitude: 26.2132974,
      longitude: 127.6766983,
      lodgingHint: true,
    })

    expect(identity).toEqual({
      hotelId: '247692',
      canonicalNames: ['Daiwa Roynet Hotel Okinawa Kenchomae'],
      city: 'Okinawa Main island',
      countryCode: 'JP',
      cityId: 717899,
      latitude: 26.213292,
      longitude: 127.676727,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('uses the local Agoda catalogue without spending SerpAPI quota', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  let fetchCount = 0
  process.env.SERPAPI_API_KEY = 'agoda-index-fallback-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => {
    fetchCount += 1
    throw new Error('Agoda catalogue matching must not use the network')
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: 'ART HOTEL Nippori Lungwood',
      countryCode: 'JP',
      latitude: 35.7281102,
      longitude: 139.7729396,
      lodgingHint: true,
      forceRefresh: true,
    })
    const translatedNameResult = await searchAgodaAffiliateHotels({
      hotelName: 'ART 日暮里郎伍德酒店',
      countryCode: 'JP',
      latitude: 35.7281102,
      longitude: 139.7729396,
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(fetchCount).toBe(0)
    expect(result.searchProvider).toBe('index')
    expect(result.matchStatus).toBe('matched')
    expect(result.bestMatch).toMatchObject({
      hotelId: '99066',
      hotelName: 'ART HOTEL Nippori Lungwood',
      source: 'index',
    })
    const bookingUrl = new URL(result.bestMatch?.bookingUrl ?? '')
    expect(bookingUrl.hostname).toBe('www.agoda.com')
    expect(bookingUrl.searchParams.get('hid')).toBe('99066')
    expect(bookingUrl.searchParams.get('cid')).toBeTruthy()
    expect(translatedNameResult.matchStatus).toBe('matched')
    expect(translatedNameResult.bestMatch?.hotelId).toBe('99066')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})

test('requires numeric hotel branch identities to agree', async () => {
  const wrongBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const wrongCompactBranchScore = scoreAgodaHotelNameAliases(
    ['Hotel No. 2 Busan'],
    ['Hotel No1 Busan'],
  )
  const correctBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Seoul Dongdaemun 2 Toyoko Inn Hotel'],
  )
  const currentNameWithFormerBranchScore = scoreAgodaHotelNameAliases(
    ['Toyoko Inn Seoul Dongdaemun No.2'],
    ['Toyoko Inn Seoul Dongdaemun No.2', 'Toyoko Inn Seoul Dongdaemun No.1'],
  )
  const compactNumberScores = [
    scoreAgodaHotelNameAliases(['7 Days Inn Busan'], ['7Days Inn Busan']),
    scoreAgodaHotelNameAliases(['24 Guesthouse Seoul'], ['24Guesthouse Seoul']),
    scoreAgodaHotelNameAliases(['Hotel No. 25 Busan'], ['Hotel No25 Busan']),
  ]
  const result = await searchAgodaAffiliateHotels({
    hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
    cityId: 14690,
    city: 'Seoul',
    countryCode: 'KR',
    latitude: 37.564529,
    longitude: 127.007813,
    lodgingHint: true,
  })

  expect(wrongBranchScore).toBeLessThan(0.78)
  expect(wrongCompactBranchScore).toBeLessThan(0.78)
  expect(correctBranchScore).toBeGreaterThan(0.78)
  expect(currentNameWithFormerBranchScore).toBe(1)
  compactNumberScores.forEach((score) => expect(score).toBeGreaterThan(0.77))
  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('86690097')
  expect(result.bestMatch?.hotelName).toContain('2')
})

test('rejects conflicting hotel branches even when the base name is identical', () => {
  const annexScore = scoreAgodaHotelNameAliases(
    ['Sakura Hotel Main Building'],
    ['Sakura Hotel Annex'],
  )
  const directionScore = scoreAgodaHotelNameAliases(
    ['Metro Hotel East Wing'],
    ['Metro Hotel West Wing'],
  )

  expect(annexScore).toBeLessThan(0.78)
  expect(directionScore).toBeLessThan(0.78)
})

test('uses a manually verified Google Place ID before fuzzy matching', async () => {
  const result = await searchAgodaAffiliateHotels({
    hotelName: '日本〒110-',
    googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
    latitude: 35.7098512,
    longitude: 139.7756721,
    lodgingHint: true,
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.confidence).toBe('verified')
  expect(result.bestMatch?.hotelId).toBe('2232362')
  expect(result.bestMatch?.source).toBe('verified')
})
