import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postAgodaAffiliate } from '../app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as postTripAffiliate } from '../app/api/pass-planner/hotel-affiliate/trip/route'

const centurionRequest = {
  hotelName: '日本〒110-',
  name: '上野车站世纪温泉酒店-人工镭温泉',
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

test('verified routes recover from a polluted Google name without fuzzy matching', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousAgodaSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const requestedQueries: string[] = []
  process.env.SERPAPI_API_KEY = 'agoda-route-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedQueries.push(url.searchParams.get('q') ?? '')
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

    expect(requestedQueries).toEqual(['site:agoda.com Centurion Hotel & Spa Ueno Station Agoda'])
    expect(agodaResponse.status).toBe(200)
    expect(agoda.matchStatus).toBe('matched')
    expect(agoda.confidence).toBe('high')
    expect(agoda.bestMatch?.bookingUrl).toContain('/centurion-hotel-spa-ueno-station/hotel/tokyo-jp.html')

    expect(tripResponse.status).toBe(200)
    expect(trip.matchStatus).toBe('matched')
    expect(trip.confidence).toBe('verified')
    expect(trip.bestMatch?.hotelId).toBe('10748373')
    expect(trip.bestMatch?.bookingUrl).toContain('hotelId=10748373')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousAgodaSearchProvider === 'string') process.env.AGODA_SEARCH_PROVIDER = previousAgodaSearchProvider
    else delete process.env.AGODA_SEARCH_PROVIDER
  }
})
