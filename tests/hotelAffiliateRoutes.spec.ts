import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postAffiliateLink } from '../app/api/pass-planner/book/affiliate-link/route'
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

test('a matched hotel link uses the narrow planner merge RPC and rejects other domains', async () => {
  const previousFetch = globalThis.fetch
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const previousSupabaseKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  const requests: Request[] = []
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = 'https://planner-affiliate-test.supabase.co'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = 'planner-affiliate-test-key'
  globalThis.fetch = (async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(request)
    return new Response(JSON.stringify({
      id: 'bookId12',
      read_token: 'abcdefghijklmnopqrstuv',
      updated_at: '2026-09-10T12:00:00.000Z',
      changed: true,
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await postAffiliateLink(new NextRequest(
      'http://localhost/api/pass-planner/book/affiliate-link',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'bookId12',
          edit_token: 'abcdefghijklmnopqrstuv',
          place_id: 'custom:hotel-1',
          provider: 'Agoda',
          href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=665695',
        }),
      },
    ))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toEqual({
      id: 'bookId12',
      read_token: 'abcdefghijklmnopqrstuv',
      updated_at: '2026-09-10T12:00:00.000Z',
      changed: true,
    })
    expect(requests).toHaveLength(1)
    expect(requests[0].url).toBe('https://planner-affiliate-test.supabase.co/rest/v1/rpc/planner_book_add_affiliate_link')
    expect(await requests[0].json()).toEqual({
      p_id: 'bookId12',
      p_edit_token: 'abcdefghijklmnopqrstuv',
      p_place_id: 'custom:hotel-1',
      p_provider: 'Agoda',
      p_href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=665695',
    })

    const rejected = await postAffiliateLink(new NextRequest(
      'http://localhost/api/pass-planner/book/affiliate-link',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: 'bookId12',
          edit_token: 'abcdefghijklmnopqrstuv',
          place_id: 'custom:hotel-1',
          provider: 'Agoda',
          href: 'https://www.agoda.com.example.invalid/hotel',
        }),
      },
    ))
    expect(rejected.status).toBe(400)
    expect(requests).toHaveLength(1)
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSupabaseUrl === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = previousSupabaseUrl
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
    if (typeof previousSupabaseKey === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = previousSupabaseKey
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  }
})

test('Agoda stays local while Trip falls back from the verified catalogue identity to the Maps English name', async () => {
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

    expect(requestedQueries).toEqual([
      'site:trip.com/hotels Centurion Hotel & Spa Ueno Station -Artificial Radium Hot Spring Trip.com',
      'site:trip.com/hotels Centurion Hotel & Spa Ueno Station Trip.com',
    ])
    expect(agodaResponse.status).toBe(200)
    expect(agoda.matchStatus).toBe('matched')
    expect(agoda.confidence).toBe('verified')
    expect(agoda.bestMatch?.hotelId).toBe('2232362')
    expect(new URL(agoda.bestMatch?.bookingUrl).searchParams.get('hid')).toBe('2232362')

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

test('Agoda makes no web searches while Trip keeps localized names separate and ordered', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousAgodaSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const previousTripSearchProvider = process.env.TRIP_SEARCH_PROVIDER
  const mapsEnglishName = 'Planner Harbor View Hotel'
  const mapsTraditionalChineseName = '地圖繁中港景飯店'
  const userName = '使用者輸入海灣飯店'
  const agodaQueries: string[] = []
  const tripQueries: string[] = []
  process.env.SERPAPI_API_KEY = 'route-three-name-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    const isTrip = query.startsWith('site:trip.com/hotels')
    if (isTrip) tripQueries.push(query)
    else agodaQueries.push(query)
    const candidateName =
      query.includes(mapsEnglishName)
        ? mapsTraditionalChineseName
        : query.includes(mapsTraditionalChineseName)
          ? userName
          : userName
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: `${candidateName} - ${isTrip ? 'Trip.com' : 'Agoda.com'}`,
        link: isTrip
          ? 'https://www.trip.com/hotels/naha-hotel-detail-703607/planner-harbor-view-hotel/'
          : 'https://www.agoda.com/planner-harbor-view-hotel/hotel/okinawa-main-island-jp.html',
        snippet: candidateName,
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const requestBody = {
    hotelName: mapsEnglishName,
    googlePlaceName: mapsEnglishName,
    googlePlaceNameZhTw: mapsTraditionalChineseName,
    name: userName,
    alternateHotelNames: ['This name must never be searched'],
    googlePlaceId: 'planner-route-three-name-regression',
    city: 'Naha',
    countryCode: 'JP',
    lat: 26.2132974,
    lng: 127.6766983,
    lodgingHint: true,
    googlePlaceTypes: ['lodging'],
    forceRefresh: true,
  }
  const makeRequest = (path: string) => new NextRequest(`http://localhost${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  try {
    const [agodaResponse, tripResponse] = await Promise.all([
      postAgodaAffiliate(makeRequest('/api/pass-planner/hotel-affiliate/agoda')),
      postTripAffiliate(makeRequest('/api/pass-planner/hotel-affiliate/trip')),
    ])
    const [agoda, trip] = await Promise.all([agodaResponse.json(), tripResponse.json()])

    expect(agodaQueries).toEqual([])
    expect(tripQueries).toEqual([
      `site:trip.com/hotels ${mapsEnglishName} Trip.com`,
      `site:trip.com/hotels ${mapsTraditionalChineseName} Trip.com`,
      `site:trip.com/hotels ${userName} Trip.com`,
    ])
    expect([...agodaQueries, ...tripQueries].join(' ')).not.toContain('This name must never be searched')
    expect(agodaResponse.status).toBe(200)
    expect(agoda.matchStatus).toBe('needs_review')
    expect(tripResponse.status).toBe(200)
    expect(trip.matchStatus).toBe('matched')
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

test('Trip searches the Agoda catalogue identity before a translated user name', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousTripSearchProvider = process.env.TRIP_SEARCH_PROVIDER
  const queries: string[] = []
  process.env.SERPAPI_API_KEY = 'trip-agoda-identity-regression'
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    queries.push(query)
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      organic_results: [{
        position: 1,
        title: 'ART HOTEL Nippori Lungwood - Trip.com',
        link: 'https://www.trip.com/hotels/tokyo-hotel-detail-1234567/art-hotel-nippori-lungwood/',
        snippet: 'ART HOTEL Nippori Lungwood, Tokyo',
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await postTripAffiliate(new NextRequest(
      'http://localhost/api/pass-planner/hotel-affiliate/trip',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          hotelName: 'ART 日暮里郎伍德酒店',
          name: 'ART 日暮里郎伍德酒店',
          countryCode: 'JP',
          lat: 35.7281102,
          lng: 139.7729396,
          lodgingHint: true,
          googlePlaceTypes: ['lodging'],
          forceRefresh: true,
        }),
      },
    ))
    const result = await response.json()

    expect(queries[0]).toBe('site:trip.com/hotels ART HOTEL Nippori Lungwood Trip.com')
    expect(result.matchStatus).toBe('matched')
    expect(result.bestMatch?.hotelId).toBe('1234567')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousTripSearchProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousTripSearchProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
  }
})
