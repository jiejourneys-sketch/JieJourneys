import { expect, test } from '@playwright/test'
import {
  addHotelAffiliateTransientRetryCandidate,
  eligibleHotelAffiliateTransientRetryProviders,
  HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAYS_MS,
  hotelAffiliateTransientRetryDelayMs,
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
  expect(HOTEL_AFFILIATE_TRANSIENT_RETRY_DELAYS_MS).toEqual([30_000, 300_000])
  expect(hotelAffiliateTransientRetryDelayMs(0)).toBe(30_000)
  expect(hotelAffiliateTransientRetryDelayMs(1)).toBe(300_000)
  expect(hotelAffiliateTransientRetryDelayMs(2)).toBeNull()
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
