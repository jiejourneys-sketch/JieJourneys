const SERPAPI_HOST = 'serpapi.com'
const ACCOUNT_CACHE_TTL_MS = 15_000
const DEFAULT_MAX_REQUESTS_PER_HOUR = 20
const DEFAULT_MIN_CREDITS_RESERVE = 25

type SerpApiAccountPayload = {
  total_searches_left?: unknown
  plan_searches_left?: unknown
  searches_left?: unknown
  remaining_credits?: unknown
  this_hour_searches?: unknown
  searches_this_hour?: unknown
  account_rate_limit_per_hour?: unknown
}

type AccountSnapshot = {
  apiKey: string
  expiresAt: number
  remaining: number
  thisHourSearches: number
  providerHourlyLimit: number | null
}

let accountSnapshot: AccountSnapshot | null = null
let accountRequest: { apiKey: string; promise: Promise<AccountSnapshot> } | null = null
let localRequestReservations: number[] = []

/**
 * Paid planner discovery is disabled in local development by default, even if
 * a developer's .env.local still contains the production key. Production keeps
 * the legacy TRIP_SEARCH_PROVIDER=serpapi behaviour, while the dedicated flag
 * can explicitly enable or emergency-disable it in any environment.
 */
export function plannerSerpApiIsEnabled() {
  const explicit = readBoolean(process.env.SERPAPI_PLANNER_ENABLED)
  if (explicit != null) return explicit
  if (process.env.NODE_ENV !== 'production') return false
  return process.env.TRIP_SEARCH_PROVIDER?.trim().toLowerCase() === 'serpapi'
}

/**
 * The only allowed path for planner code to perform a metered SerpAPI search.
 * It checks the free Account API first, preserves a credit reserve, and applies
 * a conservative account-wide hourly ceiling before sending the search.
 */
export async function fetchPlannerSerpApi(input: URL, init?: RequestInit) {
  if (!plannerSerpApiIsEnabled()) throw new Error('serpapi_planner_disabled')
  if (input.protocol !== 'https:' || input.hostname !== SERPAPI_HOST || !/^\/search(?:\.json)?$/.test(input.pathname)) {
    throw new Error('serpapi_planner_invalid_endpoint')
  }

  const apiKey = input.searchParams.get('api_key')?.trim() ?? ''
  if (!apiKey) throw new Error('serpapi_key_missing')
  if (readBoolean(process.env.SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED) !== false) {
    await reserveSerpApiRequest(apiKey)
  }
  return fetch(input, init)
}

async function reserveSerpApiRequest(apiKey: string) {
  const snapshot = await readAccountSnapshot(apiKey)
  const now = Date.now()
  localRequestReservations = localRequestReservations.filter((reservedAt) => now - reservedAt < 60 * 60 * 1000)

  const configuredHourlyLimit = readPositiveInteger(
    process.env.SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR,
    DEFAULT_MAX_REQUESTS_PER_HOUR,
    1,
    10_000,
  )
  const hourlyLimit = snapshot.providerHourlyLimit == null
    ? configuredHourlyLimit
    : Math.min(configuredHourlyLimit, snapshot.providerHourlyLimit)
  const conservativeHourlyUsage = snapshot.thisHourSearches + localRequestReservations.length
  if (conservativeHourlyUsage >= hourlyLimit) throw new Error('serpapi_planner_hourly_limit')

  const minimumReserve = readPositiveInteger(
    process.env.SERPAPI_PLANNER_MIN_CREDITS_RESERVE,
    DEFAULT_MIN_CREDITS_RESERVE,
    0,
    10_000_000,
  )
  if (snapshot.remaining - localRequestReservations.length <= minimumReserve) {
    throw new Error('serpapi_planner_credit_reserve')
  }

  // Reserve before the metered request starts so concurrent requests in this
  // server process cannot all pass the same account snapshot.
  localRequestReservations.push(now)
}

async function readAccountSnapshot(apiKey: string) {
  const now = Date.now()
  if (accountSnapshot?.apiKey === apiKey && accountSnapshot.expiresAt > now) return accountSnapshot
  if (accountRequest?.apiKey === apiKey) return accountRequest.promise

  const request = fetchAccountSnapshot(apiKey)
  accountRequest = { apiKey, promise: request }
  try {
    const snapshot = await request
    accountSnapshot = snapshot
    return snapshot
  } finally {
    if (accountRequest?.promise === request) accountRequest = null
  }
}

async function fetchAccountSnapshot(apiKey: string): Promise<AccountSnapshot> {
  const url = new URL('https://serpapi.com/account.json')
  url.searchParams.set('api_key', apiKey)
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  }).catch(() => null)
  if (!response?.ok) throw new Error('serpapi_account_guard_unavailable')

  const payload = (await response.json().catch(() => null)) as SerpApiAccountPayload | null
  if (!payload) throw new Error('serpapi_account_guard_invalid')
  const remaining = firstFiniteNumber(
    payload.total_searches_left,
    payload.plan_searches_left,
    payload.searches_left,
    payload.remaining_credits,
  )
  const thisHourSearches = firstFiniteNumber(payload.this_hour_searches, payload.searches_this_hour)
  if (remaining == null || thisHourSearches == null) throw new Error('serpapi_account_guard_invalid')

  return {
    apiKey,
    expiresAt: Date.now() + ACCOUNT_CACHE_TTL_MS,
    remaining: Math.max(0, remaining),
    thisHourSearches: Math.max(0, thisHourSearches),
    providerHourlyLimit: firstFiniteNumber(payload.account_rate_limit_per_hour),
  }
}

function firstFiniteNumber(...values: unknown[]) {
  for (const value of values) {
    const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
    if (Number.isFinite(number)) return number
  }
  return null
}

function readBoolean(value: unknown) {
  if (typeof value !== 'string') return null
  const clean = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'on'].includes(clean)) return true
  if (['0', 'false', 'no', 'off'].includes(clean)) return false
  return null
}

function readPositiveInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback
}
