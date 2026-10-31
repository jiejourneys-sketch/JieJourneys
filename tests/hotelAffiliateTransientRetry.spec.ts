import { expect, test } from '@playwright/test'
import {
  addHotelAffiliateTransientRetryCandidate,
  eligibleHotelAffiliateTransientRetryProviders,
  hotelAffiliatePersistenceDisposition,
  HOTEL_AFFILIATE_PERSISTENCE_RETRY_DELAYS_MS,
  hotelAffiliatePersistenceRetryDelayMs,
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

test('matched-link persistence waits for planner credentials without another provider search', () => {
  const base = {
    queuedBookId: null,
    currentBookId: null,
    hasEditToken: false,
    readOnly: false,
    linkStillPresent: true,
    providerDisabled: false,
  }

  expect(hotelAffiliatePersistenceDisposition(base)).toBe('wait')
  expect(hotelAffiliatePersistenceDisposition({
    ...base,
    currentBookId: 'planner-a',
    hasEditToken: true,
  })).toBe('persist')
  expect(HOTEL_AFFILIATE_PERSISTENCE_RETRY_DELAYS_MS).toEqual([2_000, 10_000])
  expect(hotelAffiliatePersistenceRetryDelayMs(0)).toBe(2_000)
  expect(hotelAffiliatePersistenceRetryDelayMs(1)).toBe(10_000)
  expect(hotelAffiliatePersistenceRetryDelayMs(2)).toBeNull()
})

test('matched-link persistence discards stale or user-removed work', () => {
  const base = {
    queuedBookId: 'planner-a',
    currentBookId: 'planner-a',
    hasEditToken: true,
    readOnly: false,
    linkStillPresent: true,
    providerDisabled: false,
  }

  expect(hotelAffiliatePersistenceDisposition({ ...base, linkStillPresent: false })).toBe('discard')
  expect(hotelAffiliatePersistenceDisposition({ ...base, providerDisabled: true })).toBe('discard')
  expect(hotelAffiliatePersistenceDisposition({ ...base, readOnly: true })).toBe('discard')
  expect(hotelAffiliatePersistenceDisposition({ ...base, currentBookId: 'planner-b' })).toBe('discard')
})
