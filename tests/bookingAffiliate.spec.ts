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

test('creates a CJ deep link for one exact Booking property', () => {
  const source = 'https://www.booking.com/hotel/jp/r-b-hotel-otsukaeki-kitaguchi.html?aid=someone-else&checkin=2026-11-02&checkout=2026-11-04'
  const result = buildBookingAffiliateUrl(source)
  const affiliateUrl = new URL(result)
  const destination = new URL(affiliateUrl.searchParams.get('url') ?? '')

  expect(affiliateUrl.hostname).toBe('www.jdoqocy.com')
  expect(destination.hostname).toBe('www.booking.com')
  expect(destination.pathname).toBe('/hotel/jp/r-b-hotel-otsukaeki-kitaguchi.html')
  expect(destination.searchParams.get('checkin')).toBe('2026-11-02')
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

test('does not accept a different numbered branch', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    organic_results: [{
      position: 1,
      title: 'Apartment Hotel 11 Namba Minami II - Booking.com',
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
