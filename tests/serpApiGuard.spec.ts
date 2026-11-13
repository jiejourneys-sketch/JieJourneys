import { expect, test } from '@playwright/test'
import {
  fetchPlannerSerpApi,
  getPlannerSerpApiRequestMetadata,
} from '../lib/serpApiGuard'

const originalFetch = globalThis.fetch
const originalPlannerEnabled = process.env.SERPAPI_PLANNER_ENABLED
const originalAccountGuardEnabled = process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED
const originalMinimumReserve = process.env.SERPAPI_PLANNER_MIN_CREDITS_RESERVE

test.beforeEach(() => {
  process.env.SERPAPI_PLANNER_ENABLED = 'true'
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'false'
})

test.afterEach(() => {
  globalThis.fetch = originalFetch
  restoreEnv('SERPAPI_PLANNER_ENABLED', originalPlannerEnabled)
  restoreEnv('SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED', originalAccountGuardEnabled)
  restoreEnv('SERPAPI_PLANNER_MIN_CREDITS_RESERVE', originalMinimumReserve)
})

test('records an actual search fetch without claiming provider cache or billing state', async () => {
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response('{}', { status: 200 })
  }) as typeof fetch

  const response = await fetchPlannerSerpApi(searchUrl())

  expect(fetchCount).toBe(1)
  expect(getPlannerSerpApiRequestMetadata(response)).toEqual({
    searchFetchAttempted: true,
    outcome: 'response',
    responseStatus: 200,
    providerCacheStatus: 'unknown',
    billingStatus: 'unknown',
  })
})

test('records a non-success HTTP response as a completed outbound attempt', async () => {
  globalThis.fetch = (async () => new Response('unavailable', { status: 503 })) as typeof fetch

  const response = await fetchPlannerSerpApi(searchUrl())

  expect(getPlannerSerpApiRequestMetadata(response)).toMatchObject({
    searchFetchAttempted: true,
    outcome: 'response',
    responseStatus: 503,
  })
})

test('records a network failure on the original caught error', async () => {
  const failure = new TypeError('network unavailable')
  globalThis.fetch = (async () => {
    throw failure
  }) as typeof fetch

  let caught: unknown
  try {
    await fetchPlannerSerpApi(searchUrl())
  } catch (error) {
    caught = error
  }

  expect(caught).toBe(failure)
  expect(getPlannerSerpApiRequestMetadata(caught)).toEqual({
    searchFetchAttempted: true,
    outcome: 'network_error',
    responseStatus: null,
    providerCacheStatus: 'unknown',
    billingStatus: 'unknown',
  })
})

test('distinguishes a guard rejection from a search fetch attempt', async () => {
  process.env.SERPAPI_PLANNER_ENABLED = 'false'
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response('{}')
  }) as typeof fetch

  let caught: unknown
  try {
    await fetchPlannerSerpApi(searchUrl())
  } catch (error) {
    caught = error
  }

  expect(fetchCount).toBe(0)
  expect(caught).toBeInstanceOf(Error)
  expect(getPlannerSerpApiRequestMetadata(caught)).toEqual({
    searchFetchAttempted: false,
    outcome: 'blocked',
    responseStatus: null,
    providerCacheStatus: 'unknown',
    billingStatus: 'unknown',
  })
})

test('allows the final available credit when no reserve is configured', async () => {
  process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED = 'true'
  delete process.env.SERPAPI_PLANNER_MIN_CREDITS_RESERVE
  let accountFetchCount = 0
  let searchFetchCount = 0
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input))
    if (url.pathname === '/account.json') {
      accountFetchCount += 1
      return new Response(JSON.stringify({
        total_searches_left: 1,
        this_hour_searches: 0,
        account_rate_limit_per_hour: 200,
      }), { status: 200 })
    }
    searchFetchCount += 1
    return new Response('{}', { status: 200 })
  }) as typeof fetch

  const response = await fetchPlannerSerpApi(searchUrl('final-credit-test-key'))

  expect(response.status).toBe(200)
  expect(accountFetchCount).toBe(1)
  expect(searchFetchCount).toBe(1)
})

test('does not serialize request secrets into metadata', async () => {
  globalThis.fetch = (async () => new Response('{}')) as typeof fetch
  const url = searchUrl()
  url.searchParams.set('q', 'Private Hotel Name')

  const response = await fetchPlannerSerpApi(url)
  const serialized = JSON.stringify(getPlannerSerpApiRequestMetadata(response))

  expect(serialized).not.toContain('test-secret-key')
  expect(serialized).not.toContain('Private Hotel Name')
  expect(serialized).not.toContain('serpapi.com')
})

function searchUrl(apiKey = 'test-secret-key') {
  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine', 'google_hotels')
  url.searchParams.set('q', 'Test Hotel')
  url.searchParams.set('api_key', apiKey)
  return url
}

function restoreEnv(name: string, value: string | undefined) {
  if (typeof value === 'string') process.env[name] = value
  else delete process.env[name]
}
