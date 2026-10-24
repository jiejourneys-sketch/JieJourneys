import { expect, test } from '@playwright/test'
import {
  addHotelAffiliateTransientRetryCandidate,
  eligibleHotelAffiliateTransientRetryProviders,
  HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAY_MS,
} from '../lib/hotelAffiliateTransientRetry'

test('transient retries stay bounded and include only failed unresolved providers', () => {
  const candidates = addHotelAffiliateTransientRetryCandidate(
    addHotelAffiliateTransientRetryCandidate({}, 'Trip', 'trip:identity-a'),
    'Booking',
    'booking:identity-a',
  )

  const providers = eligibleHotelAffiliateTransientRetryProviders({
    candidates,
    unresolvedProviders: ['Trip', 'Agoda', 'Booking'],
    currentCacheKey: (provider) => `${provider.toLowerCase()}:identity-a`,
  })

  expect(providers).toEqual(['Trip', 'Booking'])
  expect(HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAY_MS).toBe(15_000)
})

test('transient retries stop when a link is resolved or the lodging identity changes', () => {
  const candidates = {
    Trip: 'trip:identity-a',
    Booking: 'booking:identity-a',
  }

  const providers = eligibleHotelAffiliateTransientRetryProviders({
    candidates,
    // Trip is already resolved. Booking is still missing, but its identity
    // changed while the delayed retry was waiting.
    unresolvedProviders: ['Agoda', 'Booking'],
    currentCacheKey: (provider) => provider === 'Booking' ? 'booking:identity-b' : `${provider}:identity-a`,
  })

  expect(providers).toEqual([])
})
