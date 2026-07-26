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

  expect(coordinateOnlyResult.matchStatus).toBe('no_match')
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

test('uses one exact Agoda web search as the primary path and preserves only our affiliate parameters', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const requests: URL[] = []
  process.env.SERPAPI_API_KEY = 'agoda-web-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requests.push(url)
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        link: 'https://www.agoda.com/en-us/daiwa-roynet-hotel-okinawa-kenchomae/?cid=another-publisher',
        title: 'Daiwa Roynet Hotel Okinawa Kenchomae - Agoda.com',
        snippet: 'Daiwa Roynet Hotel Okinawa Kenchomae, Naha',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchAgodaAffiliateHotels({
      hotelName: '沖繩縣廳前大和ROYNET飯店',
      countryCode: 'JP',
      latitude: 26.2132974,
      longitude: 127.6766983,
      lodgingHint: true,
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]?.searchParams.get('q')).toBe('site:agoda.com "Daiwa Roynet Hotel Okinawa Kenchomae" Agoda')
    expect(result.matchStatus).toBe('matched')
    expect(result.bestMatch?.source).toBe('serpapi')
    const bookingUrl = new URL(result.bestMatch?.bookingUrl ?? '')
    expect(bookingUrl.hostname).toBe('www.agoda.com')
    expect(bookingUrl.pathname).toBe('/en-us/daiwa-roynet-hotel-okinawa-kenchomae/')
    expect(bookingUrl.searchParams.get('cid')).not.toBe('another-publisher')
    expect(bookingUrl.searchParams.get('pcs')).toBe('1')
    expect(bookingUrl.searchParams.has('another-publisher')).toBe(false)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})
