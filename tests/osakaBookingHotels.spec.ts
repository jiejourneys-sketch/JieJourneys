import { expect, test } from '@playwright/test'
import type { CityCard } from '../components/CityTabbedList'
import {
  getOsakaBookingAffiliateUrl,
  osakaBookingHotelPropertyPaths,
  withOsakaBookingHotelAction,
} from '../data/osaka/bookingHotels'
import { osakaMapPlaces } from '../data/osaka/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

test('Osaka hotel page has verified Booking.com affiliate links', () => {
  const entries = Object.entries(osakaBookingHotelPropertyPaths)
  expect(entries).toHaveLength(30)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getOsakaBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('Booking actions are added immediately after Agoda on Osaka hotel cards', () => {
  for (const hotelTitle of Object.keys(osakaBookingHotelPropertyPaths)) {
    const card: CityCard = {
      title: hotelTitle,
      meta: '',
      area: '',
      actions: [
        { label: 'Trip', href: '#trip', platform: 'Trip' },
        {
          label: 'Agoda',
          href: '#agoda',
          event: 'osakahotel_test_agoda',
          platform: 'Agoda',
        },
        { label: '地圖', href: '#map', platform: 'Map' },
      ],
    }
    const enrichedCard = withOsakaBookingHotelAction(card)
    const platforms = enrichedCard.actions.map((action) => action.platform)
    const bookingAction = enrichedCard.actions.find((action) => action.platform === 'Booking')

    expect(platforms.indexOf('Booking'), hotelTitle).toBe(platforms.indexOf('Agoda') + 1)
    expect(isBookingAffiliateUrl(bookingAction!.href), hotelTitle).toBe(true)
    expect(bookingAction!.event).toBe('osakahotel_test_booking')
    expect(bookingAction!.section).toBe('hotel_card')
  }
})

test('all 30 Osaka hotel map cards use the same Booking affiliate links', () => {
  const hotelPlaces = osakaMapPlaces.filter((place) => place.id.startsWith('osaka-hotel-'))
  const mapBookingActions = hotelPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )

  expect(hotelPlaces).toHaveLength(30)
  expect(mapBookingActions).toHaveLength(30)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^osakamap_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})
