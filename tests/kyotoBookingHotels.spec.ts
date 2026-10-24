import { expect, test } from '@playwright/test'
import type { CityCard } from '../components/CityTabbedList'
import {
  getKyotoBookingAffiliateUrl,
  kyotoBookingHotelPropertyPaths,
  withKyotoBookingHotelAction,
} from '../data/kyoto-nara/bookingHotels'
import { kyotoNaraHotelMapPlaces } from '../data/kyoto-nara/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

test('Kyoto hotels have verified Booking.com affiliate links', () => {
  const entries = Object.entries(kyotoBookingHotelPropertyPaths)
  expect(entries).toHaveLength(13)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getKyotoBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('Booking is inserted after Agoda on Kyoto hotel cards', () => {
  for (const hotelTitle of Object.keys(kyotoBookingHotelPropertyPaths)) {
    const card: CityCard = {
      title: hotelTitle,
      meta: '',
      area: '',
      actions: [
        { label: 'Trip', href: '#trip', platform: 'Trip' },
        {
          label: 'Agoda',
          href: '#agoda',
          event: 'kyotonarahotel_test_agoda',
          platform: 'Agoda',
        },
        { label: '地圖', href: '#map', platform: 'map' },
      ],
    }
    const enrichedCard = withKyotoBookingHotelAction(card)
    const platforms = enrichedCard.actions.map((action) => action.platform)
    const bookingAction = enrichedCard.actions.find((action) => action.platform === 'Booking')

    expect(platforms.indexOf('Booking'), hotelTitle).toBe(platforms.indexOf('Agoda') + 1)
    expect(isBookingAffiliateUrl(bookingAction!.href), hotelTitle).toBe(true)
    expect(bookingAction!.event).toBe('kyotonarahotel_test_booking')
    expect(bookingAction!.section).toBe('hotel_card')
  }
})

test('all 13 Kyoto map hotel cards use the same Booking affiliate links', () => {
  const mapBookingActions = kyotoNaraHotelMapPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )

  expect(kyotoNaraHotelMapPlaces).toHaveLength(13)
  expect(mapBookingActions).toHaveLength(13)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^osakamap_kyoto_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})
