export type HotelAffiliateTransientRetryProvider = 'Agoda' | 'Trip' | 'Booking'

export type HotelAffiliateTransientRetryCandidates = Partial<
  Record<HotelAffiliateTransientRetryProvider, string>
>

export const HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAYS_MS = [30_000, 5 * 60_000] as const

// Persisting an already matched link is a free, idempotent planner write. Keep
// its retry budget separate from provider discovery so a temporary save race
// never starts another paid hotel search.
export const HOTEL_AFFILIATE_PERSISTENCE_RETRY_DELAYS_MS = [2_000, 10_000] as const

export function hotelAffiliateTransientRetryDelayMs(completedRetryCount: number) {
  return HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAYS_MS[completedRetryCount] ?? null
}

export function hotelAffiliatePersistenceRetryDelayMs(completedRetryCount: number) {
  return HOTEL_AFFILIATE_PERSISTENCE_RETRY_DELAYS_MS[completedRetryCount] ?? null
}

export type HotelAffiliatePersistenceDisposition = 'discard' | 'wait' | 'persist'

export function hotelAffiliatePersistenceDisposition(input: {
  queuedBookId: string | null
  currentBookId: string | null
  hasEditToken: boolean
  readOnly: boolean
  linkStillPresent: boolean
  providerDisabled: boolean
}): HotelAffiliatePersistenceDisposition {
  if (input.readOnly || !input.linkStillPresent || input.providerDisabled) return 'discard'
  if (input.queuedBookId && input.currentBookId && input.queuedBookId !== input.currentBookId) return 'discard'
  if (!input.currentBookId || !input.hasEditToken) return 'wait'
  return 'persist'
}

const PROVIDER_ORDER: HotelAffiliateTransientRetryProvider[] = ['Trip', 'Agoda', 'Booking']

export function addHotelAffiliateTransientRetryCandidate(
  candidates: HotelAffiliateTransientRetryCandidates,
  provider: HotelAffiliateTransientRetryProvider,
  cacheKey: string,
) {
  return { ...candidates, [provider]: cacheKey }
}

export function eligibleHotelAffiliateTransientRetryProviders(input: {
  candidates: HotelAffiliateTransientRetryCandidates
  unresolvedProviders: Iterable<HotelAffiliateTransientRetryProvider>
  currentCacheKey: (provider: HotelAffiliateTransientRetryProvider) => string | null
}) {
  const unresolvedProviders = new Set(input.unresolvedProviders)
  return PROVIDER_ORDER.filter((provider) => {
    const expectedCacheKey = input.candidates[provider]
    return Boolean(
      expectedCacheKey &&
      unresolvedProviders.has(provider) &&
      input.currentCacheKey(provider) === expectedCacheKey,
    )
  })
}
