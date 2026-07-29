import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postAgodaAffiliate } from '../app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as postTripAffiliate } from '../app/api/pass-planner/hotel-affiliate/trip/route'

const centurionRequest = {
  hotelName: '日本〒110-',
  googlePlaceName: 'Centurion Hotel & Spa Ueno Station',
  name: '上野车站世纪温泉酒店-人工镭温泉',
  alternateHotelNames: ['This name must never be searched'],
  googlePlaceId: 'ChIJzfgJWQCPGGAR2_B6cNH4KIw',
  city: 'Tokyo',
  countryCode: 'JP',
  lat: 35.7098512,
  lng: 139.7756721,
  lodgingHint: true,
  googlePlaceTypes: ['lodging'],
}

function affiliateRequest(path: string) {
  return new NextRequest(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(centurionRequest),
  })
}

test('routes search the Maps English name before the user name', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousAgodaSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const previousTripSearchProvider = process.env.TRIP_SEARCH_PROVIDER
  const requestedQueries: string[] = []
  process.env.SERPAPI_API_KEY = 'agoda-route-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    const searchQuery = url.searchParams.get('q') ?? ''
    requestedQueries.push(searchQuery)
    if (searchQuery.startsWith('site:trip.com/hotels')) {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        organic_results: [{
          position: 1,
          title: 'Centurion Hotel & Spa Ueno Station - Trip.com',
          link: 'https://www.trip.com/hotels/tokyo-hotel-detail-10748373/centurion-hotelandspa-ueno-station/',
          snippet: 'Centurion Hotel & Spa Ueno Station, Tokyo',
        }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'Centurion Hotel & Spa Ueno Station - Agoda.com',
        link: 'https://www.agoda.com/centurion-hotel-spa-ueno-station/hotel/tokyo-jp.html',
        snippet: 'Centurion Hotel & Spa Ueno Station, Tokyo',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const [agodaResponse, tripResponse] = await Promise.all([
      postAgodaAffiliate(affiliateRequest('/api/pass-planner/hotel-affiliate/agoda')),
      postTripAffiliate(affiliateRequest('/api/pass-planner/hotel-affiliate/trip')),
    ])
    const agoda = await agodaResponse.json()
    const trip = await tripResponse.json()

    expect(requestedQueries.sort()).toEqual([
      'site:agoda.com Centurion Hotel & Spa Ueno Station Agoda',
      'site:trip.com/hotels Centurion Hotel & Spa Ueno Station Trip.com',
    ])
    expect(agodaResponse.status).toBe(200)
    expect(agoda.matchStatus).toBe('matched')
    expect(agoda.confidence).toBe('high')
    expect(agoda.bestMatch?.bookingUrl).toContain('/centurion-hotel-spa-ueno-station/hotel/tokyo-jp.html')

    expect(tripResponse.status).toBe(200)
    expect(trip.matchStatus).toBe('matched')
    expect(trip.confidence).toBe('high')
    expect(trip.bestMatch?.hotelId).toBe('10748373')
    expect(trip.bestMatch?.bookingUrl).toContain('hotelId=10748373')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousAgodaSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousAgodaSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
    if (typeof previousTripSearchProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousTripSearchProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
  }
})
