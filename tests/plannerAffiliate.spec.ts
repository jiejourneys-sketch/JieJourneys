import { expect, test } from '@playwright/test'
import { BOOKING_AFFILIATE_HOME_URL, normalizePlannerAffiliateUrl } from '../lib/plannerAffiliate'

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

test('uses the supplied CJ Booking.com home link for travel promos', () => {
  expect(BOOKING_AFFILIATE_HOME_URL).toBe(
    'https://www.anrdoezrs.net/click-101881539-17293139?url=https%3A%2F%2Fwww.booking.com%2Findex.zh-tw.html',
  )
})

test('converts Booking.com property links into CJ affiliate deep links', () => {
  const affiliateUrl = new URL(
    normalizePlannerAffiliateUrl(
      new URL('http://www.booking.com/hotel/jp/daiwa-roynet-hotel-kyoto-ekimae.zh-tw.html?checkin=2026-10-08'),
    ) ?? '',
  )

  expect(affiliateUrl.origin).toBe('https://www.jdoqocy.com')
  expect(affiliateUrl.pathname).toBe('/click-101881539-17293139')
  expect(affiliateUrl.searchParams.get('url')).toBe(
    'https://www.booking.com/hotel/jp/daiwa-roynet-hotel-kyoto-ekimae.zh-tw.html?checkin=2026-10-08',
  )
})

test('matches the supplied CJ Booking.com deep-link format for a clean property URL', () => {
  expect(
    normalizePlannerAffiliateUrl(
      new URL('https://www.booking.com/hotel/gb/stgileshotel.zh-tw.html'),
    ),
  ).toBe(
    'https://www.jdoqocy.com/click-101881539-17293139?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fgb%2Fstgileshotel.zh-tw.html',
  )
})

test('keeps Booking.com stay details but removes existing affiliate and search tracking', () => {
  const affiliateUrl = new URL(
    normalizePlannerAffiliateUrl(
      new URL('https://www.booking.com/hotel/it/kaydee-guest-house.zh-tw.html?aid=356980&label=gog235jc-10CAsocUISa2F5ZGVlLWd1ZXN0LWhvdXNlSDNYA2jnAYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgC7dnJ1QbAAgHSAiRhNWFkZWRlYS0yOTY1LTRlZDctODk4MC1iY2FjMzhhMTYzYTTYAgHgAgE&sid=324f503fe4c37366c999cd893535c1d2&checkin=2026-10-06&checkout=2026-10-10&dest_id=-126693&dest_type=city&dist=0&group_adults=1&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=1&req_children=0&room1=A&sb_price_type=total&soh=1&sr_order=popularity&srepoch=1790078193&srpvid=0db253f780430079&type=total&ucfs=1&#no_availability_msg'),
    ) ?? '',
  )
  const destination = new URL(affiliateUrl.searchParams.get('url') ?? '')

  expect(destination.pathname).toBe('/hotel/it/kaydee-guest-house.zh-tw.html')
  expect(destination.searchParams.get('checkin')).toBe('2026-10-06')
  expect(destination.searchParams.get('checkout')).toBe('2026-10-10')
  expect(destination.searchParams.get('group_adults')).toBe('1')
  expect(destination.searchParams.get('room1')).toBe('A')
  expect(destination.searchParams.get('aid')).toBeNull()
  expect(destination.searchParams.get('label')).toBeNull()
  expect(destination.searchParams.get('sid')).toBeNull()
  expect(destination.searchParams.get('srpvid')).toBeNull()
  expect(destination.hash).toBe('')
})

test('replaces known CJ Booking.com links with the JieJourneys CJ deep link', () => {
  const affiliateUrl = new URL(
    normalizePlannerAffiliateUrl(
      new URL(
        'https://www.tkqlhce.com/click-999999-111111?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fit%2Fkaydee-guest-house.zh-tw.html%3Faid%3D356980%26checkin%3D2026-10-06%26checkout%3D2026-10-10',
      ),
    ) ?? '',
  )

  expect(affiliateUrl.origin).toBe('https://www.jdoqocy.com')
  expect(affiliateUrl.pathname).toBe('/click-101881539-17293139')
  expect(affiliateUrl.searchParams.get('url')).toBe(
    'https://www.booking.com/hotel/it/kaydee-guest-house.zh-tw.html?checkin=2026-10-06&checkout=2026-10-10',
  )
})
