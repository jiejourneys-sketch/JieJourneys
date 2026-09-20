import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postPlannerBook } from '../app/api/pass-planner/book/route'
import { POST as postAffiliateLink } from '../app/api/pass-planner/book/affiliate-link/route'
import { POST as postAgodaAffiliate } from '../app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as postHotelAffiliateResolution } from '../app/api/pass-planner/hotel-affiliate/resolve/route'
import { POST as postTripAffiliate } from '../app/api/pass-planner/hotel-affiliate/trip/route'

const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED

test.beforeEach(() => {
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test.afterEach(() => {
  if (typeof originalPlannerEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = originalPlannerEnabled
  else delete process.env.SERPAPI_PLANNER_ENABLED
  if (typeof originalAccountGuardEnabled === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = originalAccountGuardEnabled
  else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
})

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

test('a full planner save preserves newer affiliate links unless the owner explicitly removes one', async () => {
  const previousFetch = globalThis.fetch
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const previousSupabaseKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  const updateBodies: Record<string, unknown>[] = []
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = 'https://planner-affiliate-test.supabase.co'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = 'planner-affiliate-test-key'
  const storedBook = {
    id: 'bookId12',
    read_token: 'abcdefghijklmnopqrstuv',
    edit_token: 'abcdefghijklmnopqrstuv',
    city: 'Busan',
    items: [],
    notes: {},
    custom_places: {
      'custom:hotel-1': {
        name: 'Planner Test Hotel',
        category: 'hotel',
        lat: 35.16,
        lng: 129.06,
        links: [
          { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?hid=123' },
          { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?hotelId=456' },
        ],
      },
    },
    user_links: {},
  }
  globalThis.fetch = (async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    if (request.url.endsWith('/rpc/planner_book_read_edit')) {
      return new Response(JSON.stringify(storedBook), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    if (request.url.endsWith('/rpc/planner_book_update')) {
      updateBodies.push(await request.json() as Record<string, unknown>)
      return new Response(JSON.stringify({
        id: storedBook.id,
        read_token: storedBook.read_token,
        updated_at: '2026-09-20T12:00:00.000Z',
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error(`unexpected request: ${request.url}`)
  }) as typeof fetch

  const submittedPlace = {
    name: 'Planner Test Hotel',
    category: 'hotel',
    lat: 35.16,
    lng: 129.06,
    links: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?hid=123' }],
  }
  const save = async (removed = false) => postPlannerBook(new NextRequest(
    'http://localhost/api/pass-planner/book',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: storedBook.id,
        edit_token: storedBook.edit_token,
        city: storedBook.city,
        items: [],
        notes: {},
        custom_places: { 'custom:hotel-1': submittedPlace },
        user_links: {},
        ...(removed
          ? { removed_affiliate_links: [{ place_id: 'custom:hotel-1', provider: 'Trip' }] }
          : {}),
      }),
    },
  ))

  try {
    expect((await save()).status).toBe(200)
    expect((updateBodies[0].p_custom_places as typeof storedBook.custom_places)['custom:hotel-1'].links).toEqual([
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?hid=123' },
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?hotelId=456' },
    ])

    expect((await save(true)).status).toBe(200)
    expect((updateBodies[1].p_custom_places as typeof storedBook.custom_places)['custom:hotel-1'].links).toEqual([
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?hid=123' },
    ])
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSupabaseUrl === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = previousSupabaseUrl
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
    if (typeof previousSupabaseKey === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = previousSupabaseKey
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  }
})

test('manually verified Agoda and Trip identities bypass all paid searches', async () => {
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
    if (url.searchParams.get('engine') === 'google_hotels') {
      return new Response(JSON.stringify({
        search_metadata: { status: 'Success' },
        name: 'Centurion Hotel & Spa Ueno Station',
        property_token: 'centurion-google-hotels-token',
        gps_coordinates: { latitude: 35.7098512, longitude: 139.7756721 },
        prices: [{
          source: 'Trip.com',
          link: 'https://www.trip.com/hotels/redirect?hotelid=10748373',
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

    expect(requestedQueries).toEqual([])
    expect(agodaResponse.status).toBe(200)
    expect(agoda.matchStatus).toBe('matched')
    expect(agoda.confidence).toBe('verified')
    expect(agoda.bestMatch?.hotelId).toBe('2232362')
    expect(new URL(agoda.bestMatch?.bookingUrl).searchParams.get('hid')).toBe('2232362')

    expect(tripResponse.status).toBe(200)
    expect(trip.matchStatus).toBe('matched')
    expect(trip.confidence).toBe('verified')
    expect(trip.discoveryMethod).toBe('verified')
    expect(trip.providerRequestCount).toBe(0)
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

test('the combined route resolves both providers for a previously unseen hotel with one metered lookup', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousTripSearchProvider = process.env.TRIP_SEARCH_PROVIDER
  let fetchCount = 0
  process.env.SERPAPI_API_KEY = 'combined-route-unseen-hotel'
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      name: 'Unseen Riverside Hotel Kyoto',
      property_token: 'unseen-riverside-hotel-kyoto-token',
      gps_coordinates: { latitude: 35.012345, longitude: 135.765432 },
      prices: [
        {
          source: 'Agoda',
          link: 'https://www.agoda.com/partners/partnersearch.aspx?hid=76543210',
        },
        {
          source: 'Trip.com',
          link: 'https://tw.trip.com/hotels/kyoto-hotel-detail-87654321/unseen-riverside-hotel-kyoto/',
        },
      ],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await postHotelAffiliateResolution(new NextRequest(
      'http://localhost/api/pass-planner/hotel-affiliate/resolve',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          hotelName: 'Unseen Riverside Hotel Kyoto',
          googlePlaceName: 'Unseen Riverside Hotel Kyoto',
          googlePlaceId: 'ChIJ-unseen-riverside-hotel-kyoto',
          city: 'Kyoto',
          countryCode: 'JP',
          lat: 35.012345,
          lng: 135.765432,
          lodgingHint: true,
          googlePlaceTypes: ['lodging'],
          providers: ['Agoda', 'Trip'],
        }),
      },
    ))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(fetchCount).toBe(1)
    expect(result.agoda.matchStatus).toBe('matched')
    expect(result.agoda.bestMatch.hotelId).toBe('76543210')
    expect(result.trip.matchStatus).toBe('matched')
    expect(result.trip.bestMatch.hotelId).toBe('87654321')
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSerpApiKey === 'string') process.env.SERPAPI_API_KEY = previousSerpApiKey
    else delete process.env.SERPAPI_API_KEY
    if (typeof previousTripSearchProvider === 'string') process.env.TRIP_SEARCH_PROVIDER = previousTripSearchProvider
    else delete process.env.TRIP_SEARCH_PROVIDER
  }
})

test('Agoda stays local while bounded Google Hotels uses one organic Trip fallback', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const previousAgodaSearchProvider = process.env.AGODA_SEARCH_PROVIDER
  const previousTripSearchProvider = process.env.TRIP_SEARCH_PROVIDER
  const mapsEnglishName = 'Planner Harbor View Hotel'
  const mapsTraditionalChineseName = '地圖繁中港景飯店'
  const userName = '使用者輸入海灣飯店'
  const organicTripQueries: string[] = []
  const tripQueries: string[] = []
  process.env.SERPAPI_API_KEY = 'route-three-name-regression'
  process.env.AGODA_SEARCH_PROVIDER = 'serpapi'
  process.env.TRIP_SEARCH_PROVIDER = 'serpapi'
  globalThis.fetch = (async (input) => {
    const query = new URL(String(input)).searchParams.get('q') ?? ''
    const engine = new URL(String(input)).searchParams.get('engine')
    const isTrip = engine === 'google_hotels'
    if (isTrip) tripQueries.push(query)
    else if (engine === 'google') organicTripQueries.push(query)
    const candidateName = query.includes(userName) ? userName : ''
    return new Response(JSON.stringify({
      search_metadata: { status: 'Success' },
      properties: candidateName
        ? [{
            name: candidateName,
            property_token: 'localized-google-hotels-token',
            gps_coordinates: { latitude: 26.2132974, longitude: 127.6766983 },
            prices: [{
              source: 'Trip.com',
              link: 'https://www.trip.com/hotels/redirect?hotelid=703607',
            }],
          }]
        : [],
      organic_results: engine === 'google'
        ? [{
            position: 1,
            title: `${mapsEnglishName} - Trip.com`,
            link: 'https://www.trip.com/hotels/naha-hotel-detail-703607/planner-harbor-view-hotel/',
            snippet: mapsEnglishName,
          }]
        : [],
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

    expect(tripQueries).toEqual([
      `${mapsEnglishName} Naha`,
      `${mapsTraditionalChineseName} Naha`,
    ])
    expect(organicTripQueries).toEqual([
      `site:trip.com/hotels ${mapsEnglishName} Trip.com`,
    ])
    expect([...organicTripQueries, ...tripQueries].join(' ')).not.toContain('This name must never be searched')
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
      name: 'ART HOTEL Nippori Lungwood',
      property_token: 'art-hotel-google-hotels-token',
      gps_coordinates: { latitude: 35.7281102, longitude: 139.7729396 },
      prices: [{
        source: 'Trip.com',
        link: 'https://www.trip.com/hotels/redirect?hotelid=1234567',
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

    expect(queries[0]).toBe('ART HOTEL Nippori Lungwood')
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
