import { expect, test } from '@playwright/test'
import { normalizePlannerAffiliateUrl } from '../lib/plannerAffiliate'

test('converts GetYourGuide activity links to JieJourneys affiliate deep links', () => {
  const affiliateUrl = new URL(
    normalizePlannerAffiliateUrl(
      new URL('http://www.getyourguide.com/tokyo-l193/tokyo-skytree-entry-ticket-t12345/?Partner_ID=OTHER&utm_medium=social&date=2026-10-08'),
    ) ?? '',
  )

  expect(affiliateUrl.protocol).toBe('https:')
  expect(affiliateUrl.hostname).toBe('www.getyourguide.com')
  expect(affiliateUrl.pathname).toBe('/tokyo-l193/tokyo-skytree-entry-ticket-t12345/')
  expect(affiliateUrl.searchParams.get('partner_id')).toBe('HDXRJVZ')
  expect(affiliateUrl.searchParams.getAll('partner_id')).toHaveLength(1)
  expect(affiliateUrl.searchParams.get('utm_medium')).toBe('online_publisher')
  expect(affiliateUrl.searchParams.getAll('utm_medium')).toHaveLength(1)
  expect(affiliateUrl.searchParams.get('date')).toBe('2026-10-08')
})

test('does not add tracking to lookalike GetYourGuide domains', () => {
  expect(normalizePlannerAffiliateUrl(new URL('https://notgetyourguide.com/tokyo'))).toBeNull()
})
