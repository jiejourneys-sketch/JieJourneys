import { expect, test } from '@playwright/test'
import {
  buildBookingAffiliateUrl,
  searchBookingAffiliateHotels,
} from '../lib/bookingAffiliate'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

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
  expect(requestedUrls[0].searchParams.get('q')).toBe('site:booking.com/hotel/ Apartment Hotel 11 Namba Minami III Osaka')
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
