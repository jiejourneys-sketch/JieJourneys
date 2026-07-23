import { expect, test } from '@playwright/test'
import { busanHotelCards } from '../data/busan/hotels'
import { fujiHotelCards } from '../data/fuji/hotels'
import { northVietnamHotelCards } from '../data/northvietnam/hotels'
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
  expect(buildTripAffiliateUrl('https://tw.trip.com/hotels/tokyo-hotel-detail-123/example/')).toContain('tw.trip.com')
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

test('uses a manually verified Google Place ID before external search', async () => {
  const result = await searchTripAffiliateHotels({
    hotelName: '上野世紀SPA酒店-鐳溫泉',
    googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
    city: 'Tokyo',
    countryCode: 'JP',
    latitude: 35.7098512,
    longitude: 139.7756721,
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.confidence).toBe('verified')
  expect(result.bestMatch?.hotelId).toBe('10748373')
  expect(result.bestMatch?.source).toBe('verified')
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

test('keeps every curated site-index Trip hotel self-matchable', async () => {
  const groups = [
    { cards: busanHotelCards, countryCode: 'KR' },
    { cards: tokyoHotelCards, countryCode: 'JP' },
    { cards: fujiHotelCards, countryCode: 'JP' },
    { cards: northVietnamHotelCards, countryCode: 'VN' },
  ]
  let checked = 0

  for (const { cards, countryCode } of groups) {
    for (const card of cards) {
      const tripAction = card.actions?.find(
        (action) => action.label.toLowerCase() === 'trip' && action.href.includes('trip.com'),
      )
      if (!tripAction) continue
      checked += 1
      const result = await searchTripAffiliateHotels({
        hotelName: card.title,
        city: card.area || card.meta,
        countryCode,
        latitude: card.lat,
        longitude: card.lng,
      })
      expect(result.matchStatus, card.title).toBe('matched')
      expect(result.bestMatch?.source, card.title).toBe('site_index')
    }
  }

  expect(checked).toBeGreaterThan(50)
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
