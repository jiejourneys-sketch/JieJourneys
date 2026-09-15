import { expect, test } from '@playwright/test'
import { searchTripAffiliateHotelsWithGoogleHotels } from '../lib/tripGoogleHotels'

const originalFetch = globalThis.fetch
const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED

test.beforeEach(() => {
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (typeof originalPlannerEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = originalPlannerEnabled
  else delete process.env.SERPAPI_PLANNER_ENABLED
  if (typeof originalAccountGuardEnabled === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = originalAccountGuardEnabled
  else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
})
function withSerpApi() {
  const previousProvider = process.env.TRIP_SEARCH_PROVIDER
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  process.env.SERPAPI_API_KEY = 'google-hotels-test-key'
  return () => {
    if (typeof previousProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
}

test('gets a Trip hotel ID from an exact Google Hotels booking source in one request', async () => {
  const restoreEnvironment = withSerpApi()
  const requestedUrls: URL[] = []
  const tripDestination = 'https://www.trip.com/hotels/redirect?hotelid=6236690&Allianceid=someone-else'
  const googleRedirect = `https://www.google.com/travel/click?pcurl=${encodeURIComponent(tripDestination)}`
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      name: 'Super Hotel Totsuka Station East Exit',
      property_token: 'totsuka-property-token',
      gps_coordinates: { latitude: 35.4017402, longitude: 139.5342374 },
      prices: [{ source: 'Trip.com', link: googleRedirect }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotelsWithGoogleHotels({
      hotelName: 'Super Hotel Totsukaeki Higashiguchi',
      alternateHotelNames: ['Super Hotel Totsuka Station East Exit'],
      googlePlaceId: 'ChIJ_wZajIRaGGAR87A3xmKJcQc',
      city: 'Yokohama',
      countryCode: 'JP',
      latitude: 35.4017402,
      longitude: 139.5342374,
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(requestedUrls).toHaveLength(1)
    expect(requestedUrls[0].searchParams.get('engine')).toBe('google_hotels')
    expect(requestedUrls[0].searchParams.get('check_in_date')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(requestedUrls[0].searchParams.get('check_out_date')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result?.matchStatus).toBe('matched')
    expect(result?.providerRequestCount).toBe(1)
    expect(result?.bestMatch?.hotelId).toBe('6236690')
    const affiliateUrl = new URL(result?.bestMatch?.bookingUrl ?? '')
    expect(affiliateUrl.hostname).toBe('tw.trip.com')
    expect(affiliateUrl.pathname).toBe('/hotels/detail/')
    expect(affiliateUrl.searchParams.get('hotelId')).toBe('6236690')
    expect(affiliateUrl.searchParams.get('Allianceid')).toBe('6833709')
    expect(affiliateUrl.searchParams.get('SID')).toBe('242535686')
    expect(affiliateUrl.searchParams.get('Allianceid')).not.toBe('someone-else')
  } finally {
    restoreEnvironment()
  }
})

test('uses at most one exact property-detail request when Trip is initially unavailable', async () => {
  const restoreEnvironment = withSerpApi()
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    if (requestedUrls.length === 1) {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        properties: [{
          name: 'Super Hotel Tokyo Otsuka',
          property_token: 'otsuka-property-token',
          gps_coordinates: { latitude: 35.733452, longitude: 139.728165 },
          prices: [{ source: 'Booking.com', link: 'https://www.booking.com/hotel/example' }],
        }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    const tripLink = 'https://www.trip.com/hotels/redirect?hotelId=2562030'
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      name: 'Super Hotel Tokyo Otsuka',
      property_token: 'otsuka-property-token',
      gps_coordinates: { latitude: 35.733452, longitude: 139.728165 },
      prices: requestedUrls.length >= 3
        ? [{ source: 'Trip.com', link: tripLink }]
        : [{ source: 'Agoda', link: 'https://www.agoda.com/example' }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotelsWithGoogleHotels({
      hotelName: 'Super Hotel Tokyo Otsuka',
      countryCode: 'JP',
      latitude: 35.733452,
      longitude: 139.728165,
      lodgingHint: true,
      forceRefresh: true,
    })

    expect(result?.matchStatus).toBe('no_match')
    expect(result?.bestMatch).toBeUndefined()
    expect(result?.providerRequestCount).toBe(2)
    expect(requestedUrls[0].searchParams.get('property_token')).toBeNull()
    expect(requestedUrls[1].searchParams.get('property_token')).toBe('otsuka-property-token')
    expect(requestedUrls).toHaveLength(2)
  } finally {
    restoreEnvironment()
  }
})

test('stops Google Hotels after two requests when no Trip booking source appears', async () => {
  const restoreEnvironment = withSerpApi()
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      name: 'Bounded Search Hotel',
      property_token: 'bounded-property-token',
      gps_coordinates: { latitude: 35.7, longitude: 139.7 },
      prices: [{ source: 'Booking.com', link: 'https://www.booking.com/hotel/example' }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const result = await searchTripAffiliateHotelsWithGoogleHotels({
      hotelName: 'Bounded Search Hotel',
      latitude: 35.7,
      longitude: 139.7,
      lodgingHint: true,
      forceRefresh: true,
    })
    expect(result?.matchStatus).toBe('no_match')
    expect(result?.providerRequestCount).toBe(2)
    expect(fetchCount).toBe(2)
  } finally {
    restoreEnvironment()
  }
})

test('does not accept a different branch even if that property contains a Trip link', async () => {
  const restoreEnvironment = withSerpApi()
  globalThis.fetch = (async () => new Response(JSON.stringify({
    search_metadata: { status: 'Success' },
    properties: [{
      name: 'Toyoko Inn Seoul Dongdaemun No.1',
      property_token: 'wrong-branch-token',
      gps_coordinates: { latitude: 37.566, longitude: 126.978 },
      prices: [{ source: 'Trip.com', link: 'https://www.trip.com/hotels/redirect?hotelid=1111111' }],
    }],
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const result = await searchTripAffiliateHotelsWithGoogleHotels({
      hotelName: 'Toyoko Inn Seoul Dongdaemun No.2',
      countryCode: 'KR',
      latitude: 37.566,
      longitude: 126.978,
      lodgingHint: true,
      forceRefresh: true,
    })
    expect(result?.matchStatus).toBe('no_match')
    expect(result?.bestMatch).toBeUndefined()
  } finally {
    restoreEnvironment()
  }
})
