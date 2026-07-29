import { expect, test } from '@playwright/test'
import { tokyoHotelCards } from '../data/tokyo/hotels'
import {
  buildTripAffiliateUrl,
  evaluateTripAffiliateCandidateMatch,
  searchTripAffiliateHotels,
  TRIP_SEARCH_CACHE_MAX_ENTRIES,
} from '../lib/tripAffiliate'

const correctHotelName =
  'Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring'

test('accepts only real Trip hostnames for generated affiliate links', () => {
  expect(buildTripAffiliateUrl('https://nottrip.com/hotels/tokyo-hotel-detail-123/example/')).toBe('')
  expect(buildTripAffiliateUrl('ftp://tw.trip.com/hotels/tokyo-hotel-detail-123/example/')).toBe('')
  const affiliateUrl = new URL(
    buildTripAffiliateUrl('https://www.trip.com/hotels/tokyo-hotel-detail-123/example/?tid=another-partner'),
  )
  expect(affiliateUrl.hostname).toBe('tw.trip.com')
  expect(affiliateUrl.pathname).toBe('/hotels/detail/')
  expect(affiliateUrl.searchParams.get('hotelId')).toBe('123')
  expect(affiliateUrl.searchParams.get('Allianceid')).toBeTruthy()
  expect(affiliateUrl.searchParams.has('tid')).toBe(false)
})

test('does not turn postal, city, snippet, URL, or rank context into Trip identity evidence', () => {
  const result = evaluateTripAffiliateCandidateMatch({
    hotelName: '日本〒110-',
    city: 'Tokyo',
    candidateTitle: 'Hotel Comfact - Trip.com',
    candidateSnippet: `日本〒110- Tokyo ${correctHotelName}`,
    candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=25273314',
    rankIndex: 0,
  })

  expect(result.matchStatus).toBe('no_match')
  expect(result.hasDistinctiveNameEvidence).toBe(false)
  expect(result.highConfidenceNameEvidence).toBe(false)
})

test('ignores an exact hotel-name mention in the snippet when the Trip title is another hotel', () => {
  const result = evaluateTripAffiliateCandidateMatch({
    hotelName: correctHotelName,
    city: 'Tokyo',
    candidateTitle: 'Hotel Comfact - Trip.com',
    candidateSnippet: `${correctHotelName}, 日本〒110-0005 Tokyo`,
    candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=25273314',
    rankIndex: 0,
  })

  expect(result.matchStatus).toBe('no_match')
  expect(result.hasDistinctiveNameEvidence).toBe(false)
})

test('accepts a correct distinctive Trip title, including through a valid alternate name', () => {
  const result = evaluateTripAffiliateCandidateMatch({
    hotelName: '日本〒110-',
    alternateHotelNames: [
      '日本〒111-',
      'Japan 110',
      'Tokyo 0005',
      correctHotelName,
    ],
    city: 'Tokyo',
    candidateTitle: `${correctHotelName} - Trip.com`,
    candidateSnippet: 'Tokyo hotel booking',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-10748373',
    rankIndex: 0,
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.nameSimilarity).toBe(1)
  expect(result.hasDistinctiveNameEvidence).toBe(true)
  expect(result.highConfidenceNameEvidence).toBe(true)
})

test('keeps numeric hotel brands matchable without treating postcodes as brands', () => {
  const numericBrand = evaluateTripAffiliateCandidateMatch({
    hotelName: 'Hotel 1899 Tokyo',
    city: 'Tokyo',
    candidateTitle: 'Hotel 1899 Tokyo - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-12345678/hotel-1899-tokyo/',
    rankIndex: 0,
  })
  const postcode = evaluateTripAffiliateCandidateMatch({
    hotelName: '日本〒110-',
    city: 'Tokyo',
    candidateTitle: 'Hotel 1899 Tokyo - Trip.com',
    candidateSnippet: 'Japan, 〒110-0005 Tokyo',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-12345678/hotel-1899-tokyo/',
    rankIndex: 0,
  })

  expect(numericBrand.matchStatus).toBe('matched')
  expect(numericBrand.hasDistinctiveNameEvidence).toBe(true)
  expect(postcode.matchStatus).toBe('no_match')
})

test('requires a branch qualifier for a one-character CJK hotel brand', () => {
  const qualified = evaluateTripAffiliateCandidateMatch({
    hotelName: '界 仙石原',
    candidateTitle: '界 仙石原 - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
    rankIndex: 0,
  })
  const brandOnly = evaluateTripAffiliateCandidateMatch({
    hotelName: '界',
    candidateTitle: '界 - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
    rankIndex: 0,
  })

  expect(qualified.matchStatus).toBe('matched')
  expect(brandOnly.matchStatus).not.toBe('matched')
})

test('keeps sufficiently specific CJK and Hangul exact names matchable', () => {
  const cases = [
    '東京上野諾加上飯店',
    '虹夕諾雅富士',
    'MYSTAYS富士山展望溫泉酒店',
    '롯데호텔서울',
  ]

  for (const hotelName of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      candidateTitle: `${hotelName} - Trip.com`,
      candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
      rankIndex: 0,
    })
    expect(result.matchStatus, `${hotelName} must remain matchable`).toBe('matched')
  }
})

test('uses external search even when a Google Place ID has a historical mapping', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  let fetchCount = 0
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'trip-place-id-regression'
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'Centurion Hotel & Spa Ueno Station - Trip.com',
        link: 'https://www.trip.com/hotels/tokyo-hotel-detail-10748373/centurion-hotelandspa-ueno-station/',
        snippet: 'Centurion Hotel & Spa Ueno Station, Tokyo',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotels({
      hotelName: 'Centurion Hotel & Spa Ueno Station',
      googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
      city: 'Tokyo',
      countryCode: 'JP',
      latitude: 35.7098512,
      longitude: 139.7756721,
      forceRefresh: true,
    })

    expect(fetchCount).toBe(1)
    expect(result.matchStatus).toBe('matched')
    expect(result.confidence).toBe('high')
    expect(result.bestMatch?.hotelId).toBe('10748373')
    expect(result.bestMatch?.source).toBe('serpapi')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('accepts a localized Trip title with its canonical alias and ignores marketing wrappers', () => {
  const result = evaluateTripAffiliateCandidateMatch({
    hotelName: 'Mitsui Garden Hotel Ueno - Tokyo',
    city: 'Tokyo',
    candidateTitle:
      '2026最新訂房優惠｜三井花園飯店上野 / 東京(Mitsui Garden Hotel Ueno - Tokyo) | 東京住宿推薦 - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-688243/mitsui-garden-hotel-ueno/',
    rankIndex: 0,
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.highConfidenceNameEvidence).toBe(true)
})

test('does not confuse numeric hotel branches', () => {
  const cases = [
    ['Nine Tree Premier Hotel Myeongdong 2', 'Nine Tree Premier Hotel Myeongdong 1'],
    ['Toyoko Inn Seoul Gangnam No.1', 'Toyoko Inn Seoul Gangnam No.2'],
    ['7 Days Inn Busan', '8 Days Inn Busan'],
    ['Megu Fuji 2021', 'Megu Fuji 2022'],
  ]

  for (const [hotelName, candidateTitle] of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      candidateTitle: `${candidateTitle} - Trip.com`,
      candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
      rankIndex: 0,
    })
    expect(result.matchStatus, `${hotelName} must not match ${candidateTitle}`).not.toBe('matched')
  }
})

test('does not let a conflicting alternate branch override the primary hotel identity', () => {
  const wrongBranch = evaluateTripAffiliateCandidateMatch({
    hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
    alternateHotelNames: ['Toyoko Inn Seoul Dongdaemun No.1'],
    city: 'Seoul',
    candidateTitle: 'Toyoko Inn Seoul Dongdaemun No.1 - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/seoul-hotel-detail-12345678/toyoko-inn-dongdaemun-1/',
  })
  const correctBranch = evaluateTripAffiliateCandidateMatch({
    hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
    alternateHotelNames: ['Toyoko Inn Seoul Dongdaemun No.1'],
    city: 'Seoul',
    candidateTitle: 'Toyoko Inn Seoul Dongdaemun No.2 - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/seoul-hotel-detail-12345679/toyoko-inn-dongdaemun-2/',
  })

  expect(wrongBranch.matchStatus).not.toBe('matched')
  expect(correctBranch.matchStatus).toBe('matched')
})

test('treats attached and separated numeric brand tokens as the same identity', () => {
  const cases = [
    ['7 Days Inn Busan', '7Days Inn Busan', 'Busan'],
    ['24 Guesthouse Seoul', '24Guesthouse Seoul', 'Seoul'],
    ['Hotel No. 25 Busan', 'Hotel No25 Busan', 'Busan'],
  ]

  for (const [hotelName, candidateTitle, city] of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      city,
      candidateTitle: `${candidateTitle} - Trip.com`,
      candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
    })
    expect(result.matchStatus, `${hotelName} should match ${candidateTitle}`).toBe('matched')
  }
})

test('does not auto-match a different or omitted branch of the same chain', () => {
  const cases = [
    ['Ramada Encore by Wyndham Busan Station', 'Ramada Encore by Wyndham Haeundae', 'Busan'],
    ['Four Points by Sheraton Seoul Gangnam', 'Four Points by Sheraton Seoul Myeongdong', 'Seoul'],
    ['Four Points by Sheraton Seoul Gangnam', 'Four Points by Sheraton Seoul', 'Seoul'],
  ]

  for (const [hotelName, candidateTitle, city] of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      city,
      candidateTitle: `${candidateTitle} - Trip.com`,
      candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
      rankIndex: 0,
    })
    expect(result.matchStatus, `${hotelName} must not match ${candidateTitle}`).not.toBe('matched')
  }
})

test('keeps exact short brands and low-ranked exact titles matchable', () => {
  const shortBrand = evaluateTripAffiliateCandidateMatch({
    hotelName: 'W Osaka',
    city: 'Osaka',
    candidateTitle: 'W Osaka - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-12345678/w-osaka/',
    rankIndex: 8,
  })
  const exactLowRank = evaluateTripAffiliateCandidateMatch({
    hotelName: 'Hotel Gracery Shinjuku',
    city: 'Tokyo',
    candidateTitle: 'Hotel Gracery Shinjuku - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-12345678/hotel-gracery-shinjuku/',
    rankIndex: 8,
  })

  expect(shortBrand.matchStatus).toBe('matched')
  expect(exactLowRank.matchStatus).toBe('matched')
})

test('matches canonical aliases inside Japanese and Chinese Trip titles', () => {
  const hoshinoya = evaluateTripAffiliateCandidateMatch({
    hotelName: 'HOSHINOYA Fuji',
    city: 'Fuji',
    candidateTitle: '虹夕諾雅富士 (HOSHINOYA Fuji) - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/fujikawaguchiko-hotel-detail-12345678/hoshinoya-fuji/',
    rankIndex: 0,
  })
  const centurion = evaluateTripAffiliateCandidateMatch({
    hotelName: 'センチュリオンホテル＆スパ上野駅前',
    city: 'Tokyo',
    candidateTitle:
      '上野站前百夫長飯店及水療中心 (センチュリオンホテル＆スパ上野駅前) - Trip.com',
    candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-10748373/centurion-hotelandspa-ueno-station/',
    rankIndex: 0,
  })

  expect(hoshinoya.matchStatus).toBe('matched')
  expect(centurion.matchStatus).toBe('matched')
})

test('does not strip a branch qualifier in parentheses or bare mixed-script text', () => {
  const cases = [
    ['Nine Tree Premier Hotel', 'Nine Tree Premier Hotel (Myeongdong 2)'],
    ['Toyoko Inn', 'Toyoko Inn (Seoul Gangnam No.2)'],
    ['Hotel Gracery', 'Hotel Gracery (Shinjuku)'],
    ['Mitsui Garden Hotel', 'Mitsui Garden Hotel 三井花園飯店上野'],
  ]

  for (const [hotelName, candidateTitle] of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      candidateTitle: `${candidateTitle} - Trip.com`,
      candidateUrl: 'https://tw.trip.com/hotels/detail/?hotelId=12345678',
      rankIndex: 0,
    })
    expect(result.matchStatus, `${hotelName} must not match ${candidateTitle}`).not.toBe('matched')
  }
})

test('removes Trip annual price/review wrappers without removing numeric hotel brands', () => {
  const cases = [
    [
      'Hotel Gracery Shinjuku',
      'Tokyo',
      'Hotel Gracery Shinjuku (Tokyo) - 2026 Prices, Reviews & Deals | Trip.com',
    ],
    [
      'Centurion Hotel&Spa Ueno Station',
      'Tokyo',
      'Centurion Hotel&Spa Ueno Station (Tokyo) - 2026 Prices, Reviews, Deals & Photos | Trip.com',
    ],
    [
      'Megu Fuji 2021',
      'Fujiyoshida',
      'Megu Fuji 2021 (Fujiyoshida) - 2026 Prices, Reviews & Deals | Trip.com',
    ],
  ]

  for (const [hotelName, city, candidateTitle] of cases) {
    const result = evaluateTripAffiliateCandidateMatch({
      hotelName,
      city,
      candidateTitle,
      candidateUrl: 'https://tw.trip.com/hotels/tokyo-hotel-detail-12345678/example/',
      rankIndex: 8,
    })
    expect(result.matchStatus, candidateTitle).toBe('matched')
  }
})

test('does not bypass provider search with a curated site card', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  const knownCard = tokyoHotelCards.find((card) =>
    card.actions?.some((action) => action.label.toLowerCase() === 'trip' && action.href.includes('trip.com')),
  )
  let fetchCount = 0
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'trip-site-card-regression'
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    expect(knownCard).toBeTruthy()
    const result = await searchTripAffiliateHotels({
      hotelName: knownCard?.title ?? '',
      city: knownCard?.area || knownCard?.meta,
      countryCode: 'JP',
      latitude: knownCard?.lat,
      longitude: knownCard?.lng,
    })

    expect(fetchCount).toBe(1)
    expect(result.matchStatus).toBe('no_match')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('recovers the Trip hotel from the Maps English name with one no-city SerpAPI query', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  const requestedUrls: string[] = []

  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'okinawa-trip-regression'
  globalThis.fetch = (async (input) => {
    requestedUrls.push(String(input))
    return {
      ok: true,
      json: async () => ({
        search_metadata: { status: 'Success' },
        organic_results: [
          {
            position: 1,
            title:
              'Daiwa Roynet Hotel Okinawa-Kenchomae (Naha) - 2026 Prices, Reviews & Deals | Trip.com',
            link:
              'https://www.trip.com/hotels/naha-hotel-detail-703607/daiwa-roynet-hotel-okinawa-kenchomae/?tid=another-partner',
            snippet: 'Book this Naha hotel near Kokusai Dori.',
          },
        ],
      }),
    } as Response
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotels({
      hotelName: 'Daiwa Roynet Hotel Okinawa Kenchomae',
      city: 'Okinawa Main island',
      countryCode: 'JP',
      latitude: 26.2132974,
      longitude: 127.6766983,
      lodgingHint: true,
    })

    expect(requestedUrls).toHaveLength(1)
    const searchQuery = new URL(requestedUrls[0]).searchParams.get('q') ?? ''
    expect(searchQuery).toContain('Daiwa Roynet Hotel Okinawa Kenchomae')
    expect(searchQuery).not.toContain('Okinawa Main island')
    expect(result.matchStatus).toBe('matched')
    expect(result.bestMatch?.hotelId).toBe('703607')
    expect(result.bestMatch?.source).toBe('serpapi')

    const bookingUrl = new URL(result.bestMatch?.bookingUrl ?? '')
    expect(bookingUrl.hostname).toBe('tw.trip.com')
    expect(bookingUrl.pathname).toBe('/hotels/detail/')
    expect(bookingUrl.searchParams.get('hotelId')).toBe('703607')
    expect(bookingUrl.searchParams.get('Allianceid')).toBeTruthy()
    expect(bookingUrl.searchParams.get('SID')).toBeTruthy()
    expect(bookingUrl.searchParams.has('tid')).toBe(false)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('tries the user name only after the Maps English name has no Trip result', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  const queries: string[] = []
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'trip-two-name-regression'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    queries.push(query)
    const isUserNameSearch = query.includes('沖繩縣廳前大和ROYNET飯店')
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: isUserNameSearch
        ? [{
            position: 1,
            title: '沖繩縣廳前大和ROYNET飯店 - Trip.com',
            link: 'https://www.trip.com/hotels/naha-hotel-detail-703607/daiwa-roynet-hotel-okinawa-kenchomae/',
            snippet: '沖繩縣廳前大和ROYNET飯店',
          }]
        : [],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotels({
      hotelName: 'Daiwa Roynet Hotel Okinawa Kenchomae',
      alternateHotelNames: ['沖繩縣廳前大和ROYNET飯店', 'This name must never be searched'],
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(queries).toEqual([
      'site:trip.com/hotels Daiwa Roynet Hotel Okinawa Kenchomae Trip.com',
      'site:trip.com/hotels 沖繩縣廳前大和ROYNET飯店 Trip.com',
    ])
    expect(result.matchStatus).toBe('matched')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('bounds the external Trip search cache', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  let fetchCount = 0

  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'bounded-cache-test'
  globalThis.fetch = (async () => {
    fetchCount += 1
    return {
      ok: true,
      json: async () => ({ organic_results: [] }),
    } as Response
  }) as typeof fetch

  try {
    for (let index = 0; index <= TRIP_SEARCH_CACHE_MAX_ENTRIES; index += 1) {
      await searchTripAffiliateHotels({
        hotelName: `Cache Probe ${index} Lodge`,
      })
    }
    await searchTripAffiliateHotels({
      hotelName: 'Cache Probe 0 Lodge',
    })

    expect(fetchCount).toBe(TRIP_SEARCH_CACHE_MAX_ENTRIES + 2)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('lets a manual Trip retry bypass an empty server search cache', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  let fetchCount = 0

  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'manual-refresh-cache-test'
  globalThis.fetch = (async () => {
    fetchCount += 1
    return {
      ok: true,
      json: async () => ({
        search_metadata: { status: 'Success' },
        organic_results: [],
      }),
    } as Response
  }) as typeof fetch

  try {
    const query = { hotelName: 'Manual Refresh Cache Probe Lodge' }
    await searchTripAffiliateHotels(query)
    await searchTripAffiliateHotels({ ...query, forceRefresh: true })
    expect(fetchCount).toBe(2)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('treats a partial Trip search outage as retryable instead of a no-match', async () => {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousFetch = globalThis.fetch
  let fetchCount = 0

  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'trip-partial-error-regression'
  globalThis.fetch = (async () => {
    fetchCount += 1
    if (fetchCount === 1) {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        organic_results: [],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error('temporary SerpAPI outage')
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotels({
      hotelName: 'Trip Partial Outage Primary Lodge',
      alternateHotelNames: ['Trip Partial Outage Alternate Lodge'],
      lodgingHint: true,
    })

    expect(fetchCount).toBe(2)
    expect(result.matchStatus).toBe('search_error')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
  }
})
