import { expect, test } from '@playwright/test'
import { NextRequest } from 'next/server'
import { POST as resolveGoogleMapsIdentity } from '../app/api/pass-planner/google-maps-identity/route'

const originalFetch = globalThis.fetch
const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED

function identityRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/pass-planner/google-maps-identity', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (typeof originalPlannerEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = originalPlannerEnabled
  else delete process.env.SERPAPI_PLANNER_ENABLED
  if (typeof originalAccountGuardEnabled === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = originalAccountGuardEnabled
  else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
})

test.beforeEach(() => {
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test('uses a Maps data ID for an exact English identity instead of a name guess', async () => {
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.SERPAPI_API_KEY = 'maps-identity-test-key'
  let requestedUrl = ''
  globalThis.fetch = (async (input) => {
    requestedUrl = String(input)
    return new Response(JSON.stringify({
      place_results: {
        title: 'ART HOTEL Nippori Lungwood',
        place_id: 'ChIJ34dpfn-OGGAR2DQfsjVyA_Y',
        gps_coordinates: { latitude: 35.7281102, longitude: 139.7729396 },
        type: ['Hotel', 'Banquet hall', 'Restaurant'],
      },
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      query: 'ART 日暮里郎伍德酒店',
      lat: 35.7281102,
      lng: 139.7729396,
      dataId: '0x60188e7f7e6987df:0xf6037235b21f34d8',
    }))
    const payload = await response.json()
    const url = new URL(requestedUrl)

    expect(response.status).toBe(200)
    expect(url.searchParams.get('engine')).toBe('google_maps')
    expect(url.searchParams.get('type')).toBe('place')
    expect(url.searchParams.get('hl')).toBe('en')
    expect(url.searchParams.get('q')).toBeNull()
    expect(url.searchParams.get('data_cid')).toBe('17727138133207626968')
    expect(url.searchParams.get('data')).toBeNull()
    expect(payload).toEqual({
      configured: true,
      identity: {
        placeId: 'ChIJ34dpfn-OGGAR2DQfsjVyA_Y',
        name: 'ART HOTEL Nippori Lungwood',
        lat: 35.7281102,
        lng: 139.7729396,
        types: ['lodging'],
      },
      identitySource: 'data_id',
    })
  } finally {
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('uses an exact Maps data ID even when the shared URL has no readable label', async () => {
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.SERPAPI_API_KEY = 'maps-data-id-only-test-key'
  let requestedUrl = ''
  globalThis.fetch = (async (input) => {
    requestedUrl = String(input)
    return new Response(JSON.stringify({
      place_results: {
        title: 'Data ID Only Hotel',
        place_id: 'ChIJdataidonly123456789',
        gps_coordinates: { latitude: 35.701, longitude: 139.701 },
        type: 'Hotel',
      },
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      lat: 35.701,
      lng: 139.701,
      dataId: '0xaaaaaa:0xbbbbbb',
    }))
    const payload = await response.json()
    const url = new URL(requestedUrl)

    expect(response.status).toBe(200)
    expect(url.searchParams.get('type')).toBe('place')
    expect(url.searchParams.get('q')).toBeNull()
    expect(payload.identity).toMatchObject({
      placeId: 'ChIJdataidonly123456789',
      name: 'Data ID Only Hotel',
      types: ['lodging'],
    })
  } finally {
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('does not reject an exact Maps data ID when a shared URL carries an old viewport coordinate', async () => {
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.SERPAPI_API_KEY = 'maps-exact-coordinate-test-key'
  globalThis.fetch = (async () => new Response(JSON.stringify({
    place_results: {
      title: 'Exact Data ID Hotel',
      place_id: 'ChIJexactcoordinate1234567',
      gps_coordinates: { latitude: 35.71, longitude: 139.71 },
      type: 'Hotel',
    },
  }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      lat: 35.701,
      lng: 139.701,
      dataId: '0xeeeeee:0xffffff',
    }))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.identity).toMatchObject({
      placeId: 'ChIJexactcoordinate1234567',
      name: 'Exact Data ID Hotel',
    })
    expect(payload.identitySource).toBe('data_id')
  } finally {
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('does not spend a second Maps request when an exact data ID is retired', async () => {
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.SERPAPI_API_KEY = 'maps-data-id-fallback-test-key'
  const requestedUrls: URL[] = []
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedUrls.push(url)
    const payload = url.searchParams.get('type') === 'place'
      ? { place_results: {} }
      : {
          local_results: [{
            title: 'Fallback Identity Hotel',
            place_id: 'ChIJfallbackidentity123456',
            gps_coordinates: { latitude: 35.702, longitude: 139.702 },
            type: 'Hotel',
          }],
        }
    return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      query: 'Fallback Identity Hotel',
      lat: 35.702,
      lng: 139.702,
      dataId: '0xcccccc:0xdddddd',
    }))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(requestedUrls.map((url) => url.searchParams.get('type'))).toEqual(['place'])
    expect(payload.identity).toBeUndefined()
  } finally {
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('uses a coordinate-verified Maps text search only when a data ID is unavailable', async () => {
  const previousKey = process.env.SERPAPI_API_KEY
  process.env.SERPAPI_API_KEY = 'maps-identity-fallback-test-key'
  let requestedUrl = ''
  globalThis.fetch = (async (input) => {
    requestedUrl = String(input)
    return new Response(JSON.stringify({
      local_results: [
        {
          title: 'Same Name, Wrong Branch',
          place_id: 'ChIJwrongbranch123456789',
          gps_coordinates: { latitude: 35.738, longitude: 139.78 },
          type: 'Hotel',
        },
        {
          title: 'Nearest Planner Hotel',
          place_id: 'ChIJnearesthotel123456789',
          gps_coordinates: { latitude: 35.7281, longitude: 139.77294 },
          type: 'Hotel',
        },
      ],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      query: 'Planner Hotel',
      lat: 35.7281,
      lng: 139.77294,
    }))
    const payload = await response.json()
    const url = new URL(requestedUrl)

    expect(response.status).toBe(200)
    expect(url.searchParams.get('type')).toBe('search')
    expect(url.searchParams.get('q')).toBe('Planner Hotel')
    expect(url.searchParams.get('ll')).toBe('@35.7281,139.77294,18z')
    expect(payload.identity).toMatchObject({
      placeId: 'ChIJnearesthotel123456789',
      name: 'Nearest Planner Hotel',
      types: ['lodging'],
    })
  } finally {
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('keeps SerpAPI disabled when the emergency kill switch is off', async () => {
  const previousEnabled = process.env.SERPAPI_PLANNER_ENABLED
  const previousKey = process.env.SERPAPI_API_KEY
  let fetchCount = 0
  process.env.SERPAPI_PLANNER_ENABLED = 'false'
  process.env.SERPAPI_API_KEY = 'local-development-must-not-search'
  globalThis.fetch = (async () => {
    fetchCount += 1
    throw new Error('unexpected external request')
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      query: 'Local Development Hotel',
      lat: 35.7,
      lng: 139.7,
    }))
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ error: 'serpapi_disabled' })
    expect(fetchCount).toBe(0)
  } finally {
    if (typeof previousEnabled === 'string') process.env.SERPAPI_PLANNER_ENABLED = previousEnabled
    else delete process.env.SERPAPI_PLANNER_ENABLED
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})

test('stops before a metered search when the account hourly ceiling is reached', async () => {
  const previousAccountGuard = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
  const previousHourlyLimit = process.env.SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR
  const previousKey = process.env.SERPAPI_API_KEY
  const requestedPaths: string[] = []
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR = '20'
  process.env.SERPAPI_API_KEY = 'hourly-guard-mocked-key'
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    requestedPaths.push(url.pathname)
    if (url.pathname === '/account.json') {
      return new Response(JSON.stringify({
        total_searches_left: 500,
        this_hour_searches: 20,
        account_rate_limit_per_hour: 100,
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }
    throw new Error('metered search must remain blocked')
  }) as typeof fetch

  try {
    const response = await resolveGoogleMapsIdentity(identityRequest({
      query: 'Hourly Guard Hotel',
      lat: 35.71,
      lng: 139.71,
    }))
    expect(response.status).toBe(502)
    expect(requestedPaths).toEqual(['/account.json'])
  } finally {
    if (typeof previousAccountGuard === 'string') process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = previousAccountGuard
    else delete process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
    if (typeof previousHourlyLimit === 'string') process.env.SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR = previousHourlyLimit
    else delete process.env.SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR
    if (typeof previousKey === 'string') process.env.SERPAPI_API_KEY = previousKey
    else delete process.env.SERPAPI_API_KEY
  }
})
