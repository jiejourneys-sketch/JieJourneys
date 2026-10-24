export type HotelAffiliateTransientRetryProvider = 'Agoda' | 'Trip' | 'Booking'

export type HotelAffiliateTransientRetryCandidates = Partial<
  Record<HotelAffiliateTransientRetryProvider, string>
>

export const HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAY_MS = 15_000

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
