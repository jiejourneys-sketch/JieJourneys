import { expect, test } from '@playwright/test'
import {
  buildBookingAffiliateUrl,
  searchBookingAffiliateHotels,
} from '../lib/bookingAffiliate'
import {
  bookingPropertyIdFromUrl,
  isBookingAffiliateUrl,
  shouldResolveBookingAffiliate,
} from '../lib/plannerAffiliate'

const originalFetch = globalThis.fetch
const originalSerpApiKey = process.env.SERPAPI_API_KEY
const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED

test.beforeEach(() => {
  process.env.SERPAPI_API_KEY = 'booking-affiliate-test-key'
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (typeof originalSerpApiKey === 'string') process.env.SERPAPI_API_KEY = originalSerpApiKey
  else delete process.env.SERPAPI_API_KEY
  if (typeof originalPlannerEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = originalPlannerEnabled
  else delete process.env.SERPAPI_PLANNER_ENABLED
  if (typeof originalAccountGuardEnabled === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = originalAccountGuardEnabled
  else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
})

test('creates a date-independent CJ deep link for one exact Booking property', () => {
  const source = 'https://www.booking.com/hotel/jp/r-b-hotel-otsukaeki-kitaguchi.html?aid=someone-else&checkin=2026-11-02&checkout=2026-11-04'
  const result = buildBookingAffiliateUrl(source)
  const affiliateUrl = new URL(result)
  const destination = new URL(affiliateUrl.searchParams.get('url') ?? '')

  expect(affiliateUrl.hostname).toBe('www.jdoqocy.com')
  expect(destination.hostname).toBe('www.booking.com')
  expect(destination.pathname).toBe('/hotel/jp/r-b-hotel-otsukaeki-kitaguchi.html')
  expect(destination.searchParams.get('checkin')).toBeNull()
  expect(destination.searchParams.get('checkout')).toBeNull()
  expect(destination.searchParams.get('aid')).toBeNull()
  expect(bookingPropertyIdFromUrl(result)).toBe('jp/r-b-hotel-otsukaeki-kitaguchi')
  expect(bookingPropertyIdFromUrl('https://www.booking.com/hotel/jp/r-b-hotel-otsukaeki-kitaguchi.zh-tw.html'))
    .toBe('jp/r-b-hotel-otsukaeki-kitaguchi')
  expect(isBookingAffiliateUrl(result)).toBe(true)
})

test('auto-resolves Booking only for a new lodging or an explicit recheck', () => {
  expect(shouldResolveBookingAffiliate({
    forceRefresh: false,
    newlyCreatedLodging: true,
    hasBookingLink: false,
  })).toBe(true)
  expect(shouldResolveBookingAffiliate({
    forceRefresh: false,
    newlyCreatedLodging: false,
    hasBookingLink: false,
  })).toBe(false)
  expect(shouldResolveBookingAffiliate({
    forceRefresh: true,
    newlyCreatedLodging: false,
    hasBookingLink: false,
  })).toBe(true)
  expect(shouldResolveBookingAffiliate({
    forceRefresh: false,
    newlyCreatedLodging: true,
    hasBookingLink: true,
  })).toBe(false)
})

test('uses one bounded organic search and accepts an exact Booking result', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'Apartment Hotel 11 Namba Minami III - Booking.com',
        link: 'https://www.booking.com/hotel/jp/apartment-hotel-11-namba-minami-iii.html?aid=old',
        snippet: 'Apartment Hotel 11 Namba Minami III in Osaka',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Apartment Hotel 11 Namba Minami III',
    city: 'Osaka',
    countryCode: 'JP',
    latitude: 34.655,
    longitude: 135.501,
  })

  expect(requestedUrls).toHaveLength(1)
  expect(requestedUrls[0].searchParams.get('engine')).toBe('google')
  expect(requestedUrls[0].searchParams.get('q')).toBe('site:booking.com/hotel/jp/ "Apartment Hotel 11 Namba Minami III" Osaka')
  expect(result.matchStatus).toBe('matched')
  expect(result.providerRequestCount).toBe(1)
  expect(result.bestMatch?.hotelId).toBe('jp/apartment-hotel-11-namba-minami-iii')
  expect(new URL(result.bestMatch?.bookingUrl ?? '').hostname).toBe('www.jdoqocy.com')
})

test('uses one date-free Booking directory fallback after the exact web query misses', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    if (url.searchParams.get('engine') === 'booking') {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        properties: [{
          position: 1,
          name: '神戶自動搜尋河景住宿',
          link: 'https://www.booking.com/hotel/jp/automatic-recall-riverside.html',
          location: 'Kobe',
          address: '1-2-3 Harbor Street',
          gps_coordinates: { latitude: 34.6901, longitude: 135.1955 },
        }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Automatic Recall Riverside',
    alternateHotelNames: ['神戶自動搜尋河景住宿'],
    city: 'Kobe',
    countryCode: 'JP',
  })

  expect(requestedUrls).toHaveLength(2)
  expect(requestedUrls[0].searchParams.get('engine')).toBe('google')
  expect(requestedUrls[1].searchParams.get('engine')).toBe('booking')
  expect(requestedUrls[1].searchParams.get('q')).toBe('Automatic Recall Riverside')
  expect(requestedUrls[1].searchParams.get('check_in_date')).toBeNull()
  expect(requestedUrls[1].searchParams.get('check_out_date')).toBeNull()
  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/automatic-recall-riverside')
  expect(result.providerRequestCount).toBe(2)
})

test('recovers a stable Booking URL when Google returns only an opaque redirect', async () => {
  const requestedEngines: string[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    const engine = url.searchParams.get('engine') ?? ''
    requestedEngines.push(engine)
    if (engine === 'booking') {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        properties: [{
          position: 1,
          property_id: 6770974,
          name: 'I Cube Kozu Apartment',
          link: 'https://www.booking.com/hotel/jp/i-cube-kozu-apartment-da-ban-shi.html?lang=en-us',
          location: 'Chuo Ward, Osaka',
          address: 'Chuo-ku Kozu 2-5-2',
          gps_coordinates: { latitude: 34.6674355, longitude: 135.5105559 },
        }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 8,
        title: 'I Cube Kozu Apartment, Osaka (updated prices for 2027)',
        link: '/goto?url=CAEShAEBopaque',
        displayed_link: 'https://www.booking.com › hotel',
        source: 'Booking.com',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'I Cube Kozu Apartment',
    alternateHotelNames: ['I Cube Kōzu'],
    city: 'Osaka',
    countryCode: 'JP',
    latitude: 34.6674408,
    longitude: 135.5105534,
  })

  expect(requestedEngines).toEqual(['google', 'booking'])
  expect(result.matchStatus).toBe('matched')
  expect(result.providerRequestCount).toBe(2)
  expect(result.bestMatch?.hotelId).toBe('jp/i-cube-kozu-apartment-da-ban-shi')
  expect(result.bestMatch?.latitude).toBeCloseTo(34.6674355)
  expect(result.bestMatch?.longitude).toBeCloseTo(135.5105559)
  const destination = new URL(new URL(result.bestMatch?.bookingUrl ?? '').searchParams.get('url') ?? '')
  expect(destination.pathname).toBe('/hotel/jp/i-cube-kozu-apartment-da-ban-shi.html')
  expect(destination.search).toBe('')
})

test('accepts an exact Booking property with a localized city and annual price suffix', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: 'T-Hotel入谷, Tokio (nove cijene za 2026.)',
      link: 'https://www.booking.com/hotel/jp/t-hotelru-gu.is.html',
      snippet: 'T-Hotel入谷 in Tokyo',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'T-Hotel 入谷',
    city: 'Tokyo',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/t-hotelru-gu')
  expect(result.bestMatch?.hotelName).toBe('T-Hotel入谷')
})

test('accepts the same Booking branch when No.1 is written as 1', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: 'Toyoko Inn Busan Station No.1, Busan (updated prices for 2026)',
      link: 'https://www.booking.com/hotel/kr/toyoko-inn-busan-no-1.html',
      snippet: 'Toyoko Inn Busan Station No.1 in Busan',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Toyoko Inn Busan Station 1',
    city: 'Busan',
    countryCode: 'KR',
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.confidence).toBe('high')
  expect(result.bestMatch?.hotelId).toBe('kr/toyoko-inn-busan-no-1')
  expect(result.providerRequestCount).toBe(1)
})

test('uses the canonical Booking property slug when the visible title is localized', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: '三井花園飯店上野, 東京 (2026 年最新價格)',
      link: 'https://www.booking.com/hotel/jp/mitsui-garden-ueno.html',
      snippet: '位於東京上野的住宿',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Mitsui Garden Hotel Ueno - Tokyo',
    city: 'Tokyo',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/mitsui-garden-ueno')
  expect(result.bestMatch?.alternateHotelNames).toContain('mitsui garden ueno')
  expect(result.providerRequestCount).toBe(1)
})

test('recognizes a canonical alias inside a bilingual Booking title', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: '三井花園飯店上野 / Mitsui Garden Hotel Ueno - Booking.com',
      link: 'https://www.booking.com/hotel/jp/ueno-garden-property.html',
      snippet: 'Hotel in Tokyo',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Mitsui Garden Hotel Ueno',
    city: 'Tokyo',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/ueno-garden-property')
})

test('does not use the query name as evidence when a Booking result has no title', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: '',
      link: 'https://www.booking.com/hotel/jp/different-property.html',
      snippet: 'Target Riverside Lodge appears only in this untrusted snippet',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Target Riverside Lodge',
    city: 'Tokyo',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('no_match')
  expect(result.bestMatch).toBeUndefined()
})

test('requires review when two Booking properties are equally strong matches', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [
      {
        position: 1,
        title: 'Harbor View Hotel - Booking.com',
        link: 'https://www.booking.com/hotel/jp/harbor-view-main.html',
        snippet: 'Harbor View Hotel in Yokohama',
      },
      {
        position: 2,
        title: 'Harbor View Hotel - Booking.com',
        link: 'https://www.booking.com/hotel/jp/harbor-view-annex.html',
        snippet: 'Harbor View Hotel in Yokohama',
      },
    ],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Harbor View Hotel',
    city: 'Yokohama',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('needs_review')
  expect(result.candidates).toHaveLength(2)
  expect(result.providerRequestCount).toBe(1)
})

test('does not accept a different numbered branch', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: 'Apartment Hotel 11 Namba Minami II, Osaka (updated prices for 2026)',
      link: 'https://www.booking.com/hotel/jp/apartment-hotel-11-namba-minami-ii.html',
      snippet: 'Apartment Hotel 11 Namba Minami II in Osaka',
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Apartment Hotel 11 Namba Minami III Wrong Branch Check',
    alternateHotelNames: ['Apartment Hotel 11 Namba Minami III'],
    city: 'Osaka',
    countryCode: 'JP',
  })

  expect(result.matchStatus).not.toBe('matched')
})

test('does not repeat a city already present in the exact hotel name', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'RIHGA Royal Hotel Kyoto - Booking.com',
        link: 'https://www.booking.com/hotel/jp/rihga-royal-kyoto.html',
        snippet: 'RIHGA Royal Hotel Kyoto in Kyoto',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'RIHGA Royal Hotel Kyoto',
    city: 'Kyoto',
    countryCode: 'JP',
  })

  expect(requestedUrls[0].searchParams.get('q')).toBe('site:booking.com/hotel/jp/ "RIHGA Royal Hotel Kyoto"')
  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/rihga-royal-kyoto')
})

test('searches locale aliases in one bounded request', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'RIHGA Royal Hotel Kyoto - Booking.com',
        link: 'https://www.booking.com/hotel/jp/rihga-royal-kyoto.html',
        snippet: 'RIHGA Royal Hotel Kyoto in Kyoto',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: '京都麗嘉皇家酒店',
    alternateHotelNames: ['RIHGA Royal Hotel Kyoto', 'リーガロイヤルホテル京都'],
    city: 'Kyoto',
    countryCode: 'JP',
  })

  expect(requestedUrls).toHaveLength(1)
  expect(requestedUrls[0].searchParams.get('q')).toBe(
    'site:booking.com/hotel/jp/ ("京都麗嘉皇家酒店" OR "RIHGA Royal Hotel Kyoto" OR "リーガロイヤルホテル京都")',
  )
  expect(result.matchStatus).toBe('matched')
  expect(result.bestMatch?.hotelId).toBe('jp/rihga-royal-kyoto')
})

test('manual refresh reuses a fresh server-side organic Booking result', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'Cache Refresh Hotel Sapporo - Booking.com',
        link: 'https://www.booking.com/hotel/jp/cache-refresh-hotel-sapporo.html',
        snippet: 'Cache Refresh Hotel Sapporo in Sapporo',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const input = {
    hotelName: 'Cache Refresh Hotel Sapporo',
    city: 'Sapporo',
    countryCode: 'JP',
  }
  const first = await searchBookingAffiliateHotels(input)
  const second = await searchBookingAffiliateHotels(input)
  expect(fetchCount).toBe(1)
  expect(first.providerRequestCount).toBe(1)
  expect(second.providerRequestCount).toBe(0)

  const refreshed = await searchBookingAffiliateHotels({ ...input, forceRefresh: true })
  expect(fetchCount).toBe(1)
  expect(refreshed.providerRequestCount).toBe(0)
})

test('counts an in-flight shared Booking search only for the request owner', async () => {
  let fetchCount = 0
  let releaseFetch: (() => void) | undefined
  let markFetchStarted: (() => void) | undefined
  const fetchStarted = new Promise<void>((resolve) => {
    markFetchStarted = resolve
  })
  const fetchGate = new Promise<void>((resolve) => {
    releaseFetch = resolve
  })
  globalThis.fetch = (async () => {
    fetchCount += 1
    markFetchStarted?.()
    await fetchGate
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'Concurrent Booking Hotel Nagoya - Booking.com',
        link: 'https://www.booking.com/hotel/jp/concurrent-booking-hotel-nagoya.html',
        snippet: 'Concurrent Booking Hotel Nagoya in Nagoya',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const input = {
    hotelName: 'Concurrent Booking Hotel Nagoya',
    city: 'Nagoya',
    countryCode: 'JP',
  }
  const ownerRequest = searchBookingAffiliateHotels(input)
  await fetchStarted
  const sharedRequest = searchBookingAffiliateHotels(input)
  releaseFetch?.()
  const [owner, shared] = await Promise.all([ownerRequest, sharedRequest])

  expect(fetchCount).toBe(1)
  expect(owner.providerRequestCount).toBe(1)
  expect(shared.providerRequestCount).toBe(0)
  expect(shared.bestMatch?.hotelId).toBe(owner.bestMatch?.hotelId)
})

test('counts a real Booking search fetch even when the network fails', async () => {
  globalThis.fetch = (async () => {
    throw new TypeError('temporary network failure')
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Booking Network Failure Hotel Fukuoka',
    city: 'Fukuoka',
    countryCode: 'JP',
  })

  expect(result.matchStatus).toBe('search_error')
  expect(result.providerRequestCount).toBe(1)
})

test('does not count the free account check when the guard blocks before Booking search', async () => {
  process.env.SERPAPI_API_KEY = 'booking-guard-blocked-key'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'true'
  const requestedPaths: string[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedPaths.push(url.pathname)
    if (url.pathname === '/account.json') {
      return new Response(JSON.stringify({
        total_searches_left: 500,
        this_hour_searches: 20,
        account_rate_limit_per_hour: 20,
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error('paid Booking search must remain blocked')
  }) as typeof fetch

  const result = await searchBookingAffiliateHotels({
    hotelName: 'Booking Guard Blocked Hotel Sendai',
    city: 'Sendai',
    countryCode: 'JP',
  })

  expect(requestedPaths).toEqual(['/account.json'])
  expect(result.matchStatus).toBe('search_error')
  expect(result.providerRequestCount).toBe(0)
})
