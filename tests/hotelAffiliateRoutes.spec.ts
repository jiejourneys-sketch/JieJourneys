import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as postPlannerBook } from '../app/api/pass-planner/book/route'
import { POST as postAffiliateLink } from '../app/api/pass-planner/book/affiliate-link/route'
import { POST as postAgodaAffiliate } from '../app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as postBookingAffiliate } from '../app/api/pass-planner/hotel-affiliate/booking/route'
import { POST as postHotelAffiliateResolution } from '../app/api/pass-planner/hotel-affiliate/resolve/route'
import { POST as postTripAffiliate } from '../app/api/pass-planner/hotel-affiliate/trip/route'

const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
const originalStoredIdentityLookupEnabled = process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED

test.beforeEach(() => {
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
  process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED = 'false'
})

test.afterEach(() => {
  if (typeof originalPlannerEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = originalPlannerEnabled
  else delete process.env.SERPAPI_PLANNER_ENABLED
  if (typeof originalAccountGuardEnabled === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = originalAccountGuardEnabled
  else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
  if (typeof originalStoredIdentityLookupEnabled === 'string') {
    process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED = originalStoredIdentityLookupEnabled
  } else delete process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED
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

test('a Booking CJ deep link is accepted only when its destination is Booking.com', async () => {
  const previousFetch = globalThis.fetch
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const previousSupabaseKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  const bodies: Record<string, unknown>[] = []
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = 'https://planner-affiliate-test.supabase.co'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = 'planner-affiliate-test-key'
  globalThis.fetch = (async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    bodies.push(await request.json() as Record<string, unknown>)
    return new Response(JSON.stringify({
      id: 'bookId12',
      read_token: 'abcdefghijklmnopqrstuv',
      changed: true,
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  const call = (href: string) => postAffiliateLink(new NextRequest(
    'http://localhost/api/pass-planner/book/affiliate-link',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: 'bookId12',
        edit_token: 'abcdefghijklmnopqrstuv',
        place_id: 'custom:hotel-1',
        provider: 'Booking',
        href,
      }),
    },
  ))

  try {
    const bookingDestination = 'https://www.booking.com/hotel/jp/safe-hotel.html'
    const validUrl = `https://www.jdoqocy.com/click-101881539-17293139?url=${encodeURIComponent(bookingDestination)}`
    expect((await call(validUrl)).status).toBe(200)
    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({ p_provider: 'Booking', p_href: validUrl })

    const maliciousUrl = `https://www.jdoqocy.com/click-101881539-17293139?url=${encodeURIComponent('https://example.com/phishing')}`
    expect((await call(maliciousUrl)).status).toBe(400)
    expect(bodies).toHaveLength(1)
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
          {
            label: 'Booking',
            href: `https://www.jdoqocy.com/click-101881539-17293139?url=${encodeURIComponent('https://www.booking.com/hotel/kr/planner-test-hotel.html')}`,
          },
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
      storedBook.custom_places['custom:hotel-1'].links[2],
    ])

    expect((await save(true)).status).toBe(200)
    expect((updateBodies[1].p_custom_places as typeof storedBook.custom_places)['custom:hotel-1'].links).toEqual([
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?hid=123' },
      storedBook.custom_places['custom:hotel-1'].links[2],
    ])
  } finally {
    globalThis.fetch = previousFetch
    if (typeof previousSupabaseUrl === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = previousSupabaseUrl
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
    if (typeof previousSupabaseKey === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = previousSupabaseKey
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  }
})

test('a full planner save records a newly added manual provider link through the narrow RPC', async () => {
  const previousFetch = globalThis.fetch
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const previousSupabaseKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  const observedBodies: Record<string, unknown>[] = []
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = 'https://planner-affiliate-test.supabase.co'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = 'planner-affiliate-test-key'
  const storedBook = {
    id: 'bookId12',
    read_token: 'abcdefghijklmnopqrstuv',
    edit_token: 'abcdefghijklmnopqrstuv',
    city: 'Tokyo',
    items: [],
    notes: {},
    custom_places: {
      'custom:hotel-1': {
        name: 'Planner Manual Hotel',
        category: 'hotel',
        lat: 35.7,
        lng: 139.7,
        googlePlaceId: 'ChIJ-planner-manual-hotel',
        links: [],
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
      return new Response(JSON.stringify({
        id: storedBook.id,
        read_token: storedBook.read_token,
        updated_at: '2026-09-24T12:00:00.000Z',
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    if (request.url.endsWith('/rpc/planner_book_add_affiliate_link')) {
      observedBodies.push(await request.json() as Record<string, unknown>)
      return new Response(JSON.stringify({
        id: storedBook.id,
        read_token: storedBook.read_token,
        updated_at: '2026-09-24T12:00:00.000Z',
        changed: false,
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error(`unexpected request: ${request.url}`)
  }) as typeof fetch

  try {
    const agodaUrl = 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=76543210'
    const bookingDestination = 'https://www.booking.com/hotel/jp/planner-manual-hotel.html'
    const bookingUrl = `https://www.jdoqocy.com/click-101881539-17293139?url=${encodeURIComponent(bookingDestination)}`
    const response = await postPlannerBook(new NextRequest(
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
          custom_places: {
            'custom:hotel-1': {
              ...storedBook.custom_places['custom:hotel-1'],
              links: [
                { label: 'Agoda', href: agodaUrl },
                { label: 'Booking', href: bookingUrl },
              ],
            },
          },
          user_links: {},
        }),
      },
    ))

    expect(response.status).toBe(200)
    expect(observedBodies).toHaveLength(2)
    expect(observedBodies).toEqual(expect.arrayContaining([
      {
        p_id: storedBook.id,
        p_edit_token: storedBook.edit_token,
        p_place_id: 'custom:hotel-1',
        p_provider: 'Agoda',
        p_href: agodaUrl,
      },
      {
        p_id: storedBook.id,
        p_edit_token: storedBook.edit_token,
        p_place_id: 'custom:hotel-1',
        p_provider: 'Booking',
        p_href: bookingUrl,
      },
    ]))
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

test('a durable verified identity bypasses provider searches for all routes', async () => {
  const previousFetch = globalThis.fetch
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
  const previousSupabaseKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  const requests: Request[] = []
  process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED = 'true'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = 'https://planner-affiliate-test.supabase.co'
  process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = 'planner-affiliate-test-key'
  globalThis.fetch = (async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(request)
    if (!request.url.endsWith('/rpc/planner_hotel_affiliate_identity_lookup')) {
      throw new Error(`unexpected provider request: ${request.url}`)
    }
    return new Response(JSON.stringify({
      google_place_id: 'ChIJ-durable-verified-hotel',
      canonical_names: ['Durable Verified Hotel Tokyo'],
      latitude: 35.701234,
      longitude: 139.712345,
      country_code: 'JP',
      agoda_hotel_id: '76543210',
      agoda_hotel_name: 'Durable Verified Hotel Tokyo',
      agoda_source_url: 'https://www.agoda.com/partners/partnersearch.aspx?hid=76543210',
      trip_hotel_id: '87654321',
      trip_hotel_name: 'Durable Verified Hotel Tokyo',
      trip_source_url: 'https://tw.trip.com/hotels/tokyo-hotel-detail-87654321/durable-verified-hotel-tokyo/',
      booking_property_id: 'jp/durable-verified-hotel-tokyo',
      booking_hotel_name: 'Durable Verified Hotel Tokyo',
      booking_source_url: 'https://www.booking.com/hotel/jp/durable-verified-hotel-tokyo.html',
      verified_at: '2026-09-24T00:00:00.000Z',
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await postHotelAffiliateResolution(new NextRequest(
      'http://localhost/api/pass-planner/hotel-affiliate/resolve',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          hotelName: 'Durable Verified Hotel Tokyo',
          googlePlaceName: 'Durable Verified Hotel Tokyo',
          googlePlaceId: 'ChIJ-durable-verified-hotel',
          city: 'Tokyo',
          countryCode: 'JP',
          lat: 35.701234,
          lng: 139.712345,
          lodgingHint: true,
          googlePlaceTypes: ['lodging'],
          providers: ['Trip', 'Agoda', 'Booking'],
        }),
      },
    ))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(requests).toHaveLength(1)
    expect(requests[0].url).toBe(
      'https://planner-affiliate-test.supabase.co/rest/v1/rpc/planner_hotel_affiliate_identity_lookup',
    )
    expect(await requests[0].json()).toEqual({
      p_google_place_id: 'ChIJ-durable-verified-hotel',
      p_latitude: 35.701234,
      p_longitude: 139.712345,
      p_country_code: 'JP',
    })
    expect(result.agoda.matchStatus).toBe('matched')
    expect(result.agoda.confidence).toBe('verified')
    expect(result.agoda.bestMatch.hotelId).toBe('76543210')
    expect(result.trip.matchStatus).toBe('matched')
    expect(result.trip.confidence).toBe('verified')
    expect(result.trip.discoveryMethod).toBe('verified')
    expect(result.trip.providerRequestCount).toBe(0)
    expect(result.trip.bestMatch.hotelId).toBe('87654321')
    expect(result.booking.matchStatus).toBe('matched')
    expect(result.booking.confidence).toBe('verified')
    expect(result.booking.providerRequestCount).toBe(0)
    expect(result.booking.bestMatch.hotelId).toBe('jp/durable-verified-hotel-tokyo')
    expect(new URL(result.booking.bestMatch.bookingUrl).hostname).toBe('www.jdoqocy.com')
  } finally {
    globalThis.fetch = previousFetch
    process.env.PLANNER_HOTEL_IDENTITY_LOOKUP_ENABLED = 'false'
    if (typeof previousSupabaseUrl === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL = previousSupabaseUrl
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL
    if (typeof previousSupabaseKey === 'string') process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY = previousSupabaseKey
    else delete process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY
  }
})

test('the combined route resolves all providers for a previously unseen hotel with one metered lookup', async () => {
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
        {
          source: 'Booking.com',
          link: 'https://www.booking.com/hotel/jp/unseen-riverside-hotel-kyoto.html',
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
          providers: ['Trip', 'Agoda', 'Booking'],
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
    expect(result.booking.matchStatus).toBe('matched')
    expect(result.booking.bestMatch.hotelId).toBe('jp/unseen-riverside-hotel-kyoto')
    const bookingUrl = new URL(result.booking.bestMatch.bookingUrl)
    expect(bookingUrl.hostname).toBe('www.jdoqocy.com')
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

test('Booking route resolves from the exact Google Hotels property details in two searches', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const requestedUrls: URL[] = []
  const hotelName = 'Adaptive Direct Details Hotel Matsuyama Q731'
  const propertyToken = 'adaptive-direct-details-token-q731'
  process.env.SERPAPI_API_KEY = 'booking-route-direct-details-q731'

  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    const engine = url.searchParams.get('engine')

    if (requestedUrls.length === 1 && engine === 'google_hotels' && !url.searchParams.has('property_token')) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        properties: [{
          name: hotelName,
          property_token: propertyToken,
          gps_coordinates: { latitude: 33.839157, longitude: 132.765575 },
          prices: [{ source: 'Agoda', link: 'https://www.agoda.com/adaptive-direct-details-q731' }],
        }],
      })
    }

    if (
      requestedUrls.length === 2 &&
      engine === 'google_hotels' &&
      url.searchParams.get('property_token') === propertyToken
    ) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        name: hotelName,
        property_token: propertyToken,
        gps_coordinates: { latitude: 33.839157, longitude: 132.765575 },
        prices: [{
          source: 'Booking.com',
          link: 'https://www.booking.com/hotel/jp/adaptive-direct-details-matsuyama-q731.html',
        }],
      })
    }

    throw new Error(`unexpected Booking direct-details request ${requestedUrls.length}: ${engine ?? 'missing-engine'}`)
  }) as typeof fetch

  try {
    const response = await postBookingAffiliate(bookingAffiliateRouteRequest({
      hotelName,
      googlePlaceName: hotelName,
      name: hotelName,
      googlePlaceId: 'ChIJ-adaptive-direct-details-q731',
      city: 'Matsuyama',
      countryCode: 'JP',
      lat: 33.839157,
      lng: 132.765575,
      lodgingHint: true,
      googlePlaceTypes: ['lodging'],
    }))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(requestedUrls).toHaveLength(2)
    expect(result.matchStatus).toBe('matched')
    expect(result.discoveryMethod).toBe('google_hotels')
    expect(result.providerRequestCount).toBe(2)
    expect(result.bestMatch?.hotelId).toBe('jp/adaptive-direct-details-matsuyama-q731')
    expect(new URL(result.bestMatch?.bookingUrl).hostname).toBe('www.jdoqocy.com')
  } finally {
    globalThis.fetch = previousFetch
    restoreHotelAffiliateRouteEnvironment('SERPAPI_API_KEY', previousSerpApiKey)
  }
})

test('Booking route uses one multilingual organic rescue after bounded Google Hotels details', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const requestedUrls: URL[] = []
  const hotelName = 'Adaptive Organic Harbor Hotel Yokohama Q842'
  const alternateName = 'Adaptive Organic Harbour Inn Yokohama Q842'
  const userName = 'Adaptive Route Lodging Yokohama Q842'
  const propertyToken = 'adaptive-organic-harbor-token-q842'
  process.env.SERPAPI_API_KEY = 'booking-route-organic-rescue-q842'

  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    const engine = url.searchParams.get('engine')

    if (requestedUrls.length === 1 && engine === 'google_hotels' && !url.searchParams.has('property_token')) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        properties: [{
          name: hotelName,
          property_token: propertyToken,
          gps_coordinates: { latitude: 35.443708, longitude: 139.638026 },
          prices: [{ source: 'Agoda', link: 'https://www.agoda.com/adaptive-organic-harbor-q842' }],
        }],
      })
    }

    if (
      requestedUrls.length === 2 &&
      engine === 'google_hotels' &&
      url.searchParams.get('property_token') === propertyToken
    ) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        name: hotelName,
        property_token: propertyToken,
        gps_coordinates: { latitude: 35.443708, longitude: 139.638026 },
        prices: [{ source: 'Agoda', link: 'https://www.agoda.com/adaptive-organic-harbor-q842' }],
      })
    }

    if (requestedUrls.length === 3 && engine === 'google') {
      const query = url.searchParams.get('q') ?? ''
      expect(query).toContain(`"${hotelName}"`)
      expect(query).toContain(`"${alternateName}"`)
      expect(query).toContain(`"${userName}"`)
      expect(query).toContain(' OR ')
      expect(url.searchParams.get('num')).toBe('30')
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        organic_results: [{
          position: 1,
          title: `${hotelName} - Booking.com`,
          link: 'https://www.booking.com/hotel/jp/adaptive-organic-harbor-yokohama-q842.html',
          snippet: `${hotelName} in Yokohama`,
        }],
      })
    }

    throw new Error(`unexpected Booking organic-rescue request ${requestedUrls.length}: ${engine ?? 'missing-engine'}`)
  }) as typeof fetch

  try {
    const response = await postBookingAffiliate(bookingAffiliateRouteRequest({
      hotelName,
      googlePlaceName: hotelName,
      googlePlaceNameZhTw: alternateName,
      name: userName,
      googlePlaceId: 'ChIJ-adaptive-organic-rescue-q842',
      city: 'Yokohama',
      countryCode: 'JP',
      lat: 35.443708,
      lng: 139.638026,
      lodgingHint: true,
      googlePlaceTypes: ['lodging'],
    }))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(requestedUrls).toHaveLength(3)
    expect(result.matchStatus).toBe('matched')
    expect(result.discoveryMethod).toBe('web_search')
    expect(result.providerRequestCount).toBe(3)
    expect(result.bestMatch?.hotelId).toBe('jp/adaptive-organic-harbor-yokohama-q842')
    expect(new URL(result.bestMatch?.bookingUrl).hostname).toBe('www.jdoqocy.com')
  } finally {
    globalThis.fetch = previousFetch
    restoreHotelAffiliateRouteEnvironment('SERPAPI_API_KEY', previousSerpApiKey)
  }
})

test('Booking route resolves an exact Maps CID through autocomplete within four searches', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const requestedUrls: URL[] = []
  const hotelName = 'Adaptive Exact CID Hotel Takamatsu Q953'
  const propertyToken = 'adaptive-exact-cid-property-token-q953'
  const googleMapsDataId = '0xabcdef123456:0x112210f47de98115'
  const expectedDataCid = '1234567890123456789'
  process.env.SERPAPI_API_KEY = 'booking-route-exact-cid-q953'

  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    const engine = url.searchParams.get('engine')

    if (requestedUrls.length === 1 && engine === 'google_hotels' && !url.searchParams.has('property_token')) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        properties: [],
      })
    }

    if (requestedUrls.length === 2 && engine === 'google') {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        organic_results: [],
      })
    }

    if (requestedUrls.length === 3 && engine === 'google_hotels_autocomplete') {
      expect(url.searchParams.get('q')).toBe(hotelName)
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        suggestions: [{
          type: 'accommodation',
          value: hotelName,
          location: 'Takamatsu, Japan',
          data_cid: expectedDataCid,
          property_token: propertyToken,
        }],
      })
    }

    if (
      requestedUrls.length === 4 &&
      engine === 'google_hotels' &&
      url.searchParams.get('property_token') === propertyToken
    ) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        name: hotelName,
        property_token: propertyToken,
        gps_coordinates: { latitude: 34.342787, longitude: 134.046574 },
        prices: [{
          source: 'Booking.com',
          link: 'https://www.booking.com/hotel/jp/adaptive-exact-cid-takamatsu-q953.html',
        }],
      })
    }

    throw new Error(`unexpected Booking exact-CID request ${requestedUrls.length}: ${engine ?? 'missing-engine'}`)
  }) as typeof fetch

  try {
    const response = await postBookingAffiliate(bookingAffiliateRouteRequest({
      hotelName,
      googlePlaceName: hotelName,
      name: hotelName,
      googlePlaceId: 'ChIJ-adaptive-exact-cid-q953',
      googleMapsDataId,
      city: 'Takamatsu',
      countryCode: 'JP',
      lat: 34.342787,
      lng: 134.046574,
      lodgingHint: true,
      googlePlaceTypes: ['lodging'],
    }))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(requestedUrls.map((url) => url.searchParams.get('engine'))).toEqual([
      'google_hotels',
      'google',
      'google_hotels_autocomplete',
      'google_hotels',
    ])
    expect(result.matchStatus).toBe('matched')
    expect(result.providerRequestCount).toBe(4)
    expect(result.bestMatch?.hotelId).toBe('jp/adaptive-exact-cid-takamatsu-q953')
    expect(new URL(result.bestMatch?.bookingUrl).hostname).toBe('www.jdoqocy.com')
  } finally {
    globalThis.fetch = previousFetch
    restoreHotelAffiliateRouteEnvironment('SERPAPI_API_KEY', previousSerpApiKey)
  }
})

test('Booking route rejects a wrong autocomplete CID without fetching property details', async () => {
  const previousFetch = globalThis.fetch
  const previousSerpApiKey = process.env.SERPAPI_API_KEY
  const requestedUrls: URL[] = []
  const hotelName = 'Adaptive Wrong CID Hotel Kagoshima Q164'
  const googleMapsDataId = '0xabcdef654321:0x1f02c7a8254d8115'
  process.env.SERPAPI_API_KEY = 'booking-route-wrong-cid-q164'

  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    const engine = url.searchParams.get('engine')

    if (requestedUrls.length === 1 && engine === 'google_hotels' && !url.searchParams.has('property_token')) {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        properties: [],
      })
    }

    if (requestedUrls.length === 2 && engine === 'google') {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        organic_results: [],
      })
    }

    if (requestedUrls.length === 3 && engine === 'google_hotels_autocomplete') {
      return hotelAffiliateRouteJsonResponse({
        search_metadata: { status: 'Success' },
        suggestions: [{
          type: 'accommodation',
          value: 'Nearby Wrong Branch Hotel Kagoshima',
          location: 'Kagoshima, Japan',
          data_cid: '2234567890123456790',
          property_token: 'wrong-cid-property-token-q164',
        }],
      })
    }

    throw new Error(`unexpected Booking wrong-CID request ${requestedUrls.length}: ${engine ?? 'missing-engine'}`)
  }) as typeof fetch

  try {
    const response = await postBookingAffiliate(bookingAffiliateRouteRequest({
      hotelName,
      googlePlaceName: hotelName,
      name: hotelName,
      googlePlaceId: 'ChIJ-adaptive-wrong-cid-q164',
      googleMapsDataId,
      city: 'Kagoshima',
      countryCode: 'JP',
      lat: 31.596554,
      lng: 130.557116,
      lodgingHint: true,
      googlePlaceTypes: ['lodging'],
    }))
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(requestedUrls).toHaveLength(3)
    expect(requestedUrls.map((url) => url.searchParams.get('engine'))).toEqual([
      'google_hotels',
      'google',
      'google_hotels_autocomplete',
    ])
    expect(result.matchStatus).toBe('no_match')
    expect(result.providerRequestCount).toBe(3)
    expect(result.bestMatch).toBeUndefined()
  } finally {
    globalThis.fetch = previousFetch
    restoreHotelAffiliateRouteEnvironment('SERPAPI_API_KEY', previousSerpApiKey)
  }
})

function bookingAffiliateRouteRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/pass-planner/hotel-affiliate/booking', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function hotelAffiliateRouteJsonResponse(value: unknown) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

function restoreHotelAffiliateRouteEnvironment(name: string, value: string | undefined) {
  if (typeof value === 'string') process.env[name] = value
  else delete process.env[name]
}
