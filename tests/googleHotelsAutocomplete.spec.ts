import { expect, test } from '@playwright/test'
import { searchGoogleHotelsAutocompleteProperty } from '../lib/googleHotelsAutocomplete'

const originalFetch = globalThis.fetch
const originalSerpApiKey = process.env.SERPAPI_API_KEY
const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
const originalMinimumReserve = process.env.SERPAPI_PLANNER_MIN_CREDITS_RESERVE

test.beforeEach(() => {
  process.env.SERPAPI_API_KEY = 'google-hotels-autocomplete-test-key'
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test.afterEach(() => {
  globalThis.fetch = originalFetch
  restoreEnvironment('SERPAPI_API_KEY', originalSerpApiKey)
  restoreEnvironment('SERPAPI_PLANNER_ENABLED', originalPlannerEnabled)
  restoreEnvironment('SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED', originalAccountGuardEnabled)
  restoreEnvironment('SERPAPI_PLANNER_MIN_CREDITS_RESERVE', originalMinimumReserve)
})

test('accepts one accommodation only when its CID exactly matches the Google Maps data ID', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return jsonResponse({
      search_metadata: { status: 'Success' },
      suggestions: [
        {
          type: 'point_of_interest',
          value: 'Wrong result type',
          data_cid: '242587712928378716',
          property_token: 'wrong-type-token',
        },
        {
          type: 'accommodation',
          value: 'Nearby hotel',
          data_cid: '242587712928378717',
          property_token: 'wrong-cid-token',
        },
        {
          type: 'accommodation',
          value: 'Example Hotel Osaka',
          location: '1-2-3 Namba, Osaka',
          data_cid: '242587712928378716',
          property_token: 'ChgI3N7hv9WH9q4DGgwvZy8xaGY4X3MzM3EQAQ',
        },
      ],
    })
  }) as typeof fetch

  const result = await searchGoogleHotelsAutocompleteProperty({
    hotelName: '  Example\u0000 Hotel  ',
    alternateHotelNames: ['範例飯店'],
    city: 'Osaka',
    countryCode: 'jp',
    googleMapsDataId: '0x34674e0fd77f192f:0x35dd83d57f86f5c',
  })

  expect(requestedUrls).toHaveLength(1)
  expect(requestedUrls[0].hostname).toBe('serpapi.com')
  expect(requestedUrls[0].searchParams.get('engine')).toBe('google_hotels_autocomplete')
  expect(requestedUrls[0].searchParams.get('q')).toBe('Example Hotel Osaka')
  expect(requestedUrls[0].searchParams.get('gl')).toBe('jp')
  expect(requestedUrls[0].searchParams.get('hl')).toBe('en')
  expect(requestedUrls[0].searchParams.get('no_cache')).toBeNull()
  expect(result?.matchStatus).toBe('matched')
  expect(result?.requestCount).toBe(1)
  expect(result?.bestMatch).toEqual({
    propertyToken: 'ChgI3N7hv9WH9q4DGgwvZy8xaGY4X3MzM3EQAQ',
    canonicalName: 'Example Hotel Osaka',
    location: '1-2-3 Namba, Osaka',
    dataCid: '242587712928378716',
  })
})

test('uses a valid alias when the primary hotel name is unusable', async () => {
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    requestedUrls.push(new URL(String(input)))
    return jsonResponse({ search_metadata: { status: 'Success' }, suggestions: [] })
  }) as typeof fetch

  const result = await searchGoogleHotelsAutocompleteProperty({
    hotelName: 'https://maps.google.com/not-a-hotel-name',
    alternateHotelNames: ['Alias Hotel Kyoto'],
    city: 'Kyoto',
    countryCode: 'JP',
    expectedDataCid: '823456789012345678',
  })

  expect(requestedUrls).toHaveLength(1)
  expect(requestedUrls[0].searchParams.get('q')).toBe('Alias Hotel Kyoto')
  expect(result?.matchStatus).toBe('no_match')
  expect(result?.requestCount).toBe(1)
})

test('does not spend a request or auto-match without one trustworthy CID', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    throw new Error('must not fetch')
  }) as typeof fetch

  const missingCid = await searchGoogleHotelsAutocompleteProperty({
    hotelName: 'No CID Hotel Fukuoka',
    city: 'Fukuoka',
  })
  const conflictingCid = await searchGoogleHotelsAutocompleteProperty({
    hotelName: 'Conflicting CID Hotel Kobe',
    expectedDataCid: '13',
    googleMapsDataId: '0x123456:0xe',
  })

  expect(fetchCount).toBe(0)
  expect(missingCid?.matchStatus).toBe('no_match')
  expect(missingCid?.requestCount).toBe(0)
  expect(conflictingCid?.matchStatus).toBe('no_match')
  expect(conflictingCid?.requestCount).toBe(0)
})

test('rejects loose CID coercion, non-accommodation suggestions, and unusable tokens', async () => {
  globalThis.fetch = (async () => jsonResponse({
    search_metadata: { status: 'Success' },
    suggestions: [
      {
        type: 'accommodation',
        value: 'Numeric CID Hotel',
        data_cid: 923456789012345678,
        property_token: 'numeric-cid-token',
      },
      {
        type: 'landmark',
        value: 'Landmark With Exact CID',
        data_cid: '923456789012345678',
        property_token: 'landmark-token',
      },
      {
        type: 'accommodation',
        value: 'Leading Zero CID Hotel',
        data_cid: '0923456789012345678',
        property_token: 'leading-zero-token',
      },
      {
        type: 'accommodation',
        value: 'Whitespace CID Hotel',
        data_cid: ' 923456789012345678 ',
        property_token: 'whitespace-cid-token',
      },
      {
        type: 'accommodation',
        value: 'Unsafe Token Hotel',
        data_cid: '923456789012345678',
        property_token: 'bad token with spaces',
      },
    ],
  })) as typeof fetch

  const result = await searchGoogleHotelsAutocompleteProperty({
    hotelName: 'Strict Match Hotel Nagoya',
    city: 'Nagoya',
    countryCode: 'JP',
    expectedDataCid: '923456789012345678',
  })

  expect(result?.matchStatus).toBe('no_match')
  expect(result?.bestMatch).toBeUndefined()
  expect(result?.requestCount).toBe(1)
})

test('single-flights identical calls and keeps force refresh inside the local one-hour cache', async () => {
  let fetchCount = 0
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    fetchCount += 1
    requestedUrls.push(new URL(String(input)))
    await Promise.resolve()
    return jsonResponse({
      search_metadata: { status: 'Success' },
      suggestions: [{
        type: 'accommodation',
        value: 'Single Flight Hotel Sapporo',
        location: 'Sapporo, Japan',
        data_cid: '1023456789012345678',
        property_token: 'single-flight-property-token',
      }],
    })
  }) as typeof fetch

  const input = {
    hotelName: 'Single Flight Hotel Sapporo',
    city: 'Sapporo',
    countryCode: 'JP',
    expectedDataCid: '1023456789012345678',
  }
  const [first, joined] = await Promise.all([
    searchGoogleHotelsAutocompleteProperty(input),
    searchGoogleHotelsAutocompleteProperty(input),
  ])
  const cachedRefresh = await searchGoogleHotelsAutocompleteProperty({ ...input, forceRefresh: true })

  expect(fetchCount).toBe(1)
  expect([first?.requestCount, joined?.requestCount].sort()).toEqual([0, 1])
  expect(cachedRefresh?.matchStatus).toBe('matched')
  expect(cachedRefresh?.requestCount).toBe(0)
  expect(requestedUrls[0].searchParams.get('no_cache')).toBeNull()
})

test('reports zero search requests when the central account guard blocks before provider fetch', async () => {
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_MIN_CREDITS_RESERVE = '25'
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    if (url.pathname === '/account.json') {
      return jsonResponse({ total_searches_left: 25, this_hour_searches: 0 })
    }
    throw new Error('metered search must be blocked')
  }) as typeof fetch

  const result = await searchGoogleHotelsAutocompleteProperty({
    hotelName: 'Guard Blocked Hotel Sendai',
    city: 'Sendai',
    countryCode: 'JP',
    expectedDataCid: '1123456789012345678',
  })

  expect(requestedUrls).toHaveLength(1)
  expect(requestedUrls[0].pathname).toBe('/account.json')
  expect(result?.matchStatus).toBe('search_error')
  expect(result?.requestCount).toBe(0)
  expect(result?.error).toBe('serpapi_planner_credit_reserve')
})

function jsonResponse(value: unknown) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

function restoreEnvironment(name: string, value: string | undefined) {
  if (typeof value === 'string') process.env[name] = value
  else delete process.env[name]
}
