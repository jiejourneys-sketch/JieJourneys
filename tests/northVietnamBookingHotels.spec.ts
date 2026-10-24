import { expect, test } from '@playwright/test'
import {
  getNorthVietnamBookingAffiliateUrl,
  northVietnamBookingHotelPropertyPaths,
} from '../data/northvietnam/bookingHotels'
import { northVietnamHotelCards } from '../data/northvietnam/hotels'
import { northVietnamMapPlaces } from '../data/northvietnam/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

test('all 25 North Vietnam hotels have verified Booking.com affiliate links', () => {
  const entries = Object.entries(northVietnamBookingHotelPropertyPaths)
  expect(entries).toHaveLength(25)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getNorthVietnamBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('North Vietnam hotel cards put Booking after Agoda', () => {
  expect(northVietnamHotelCards).toHaveLength(25)

  for (const card of northVietnamHotelCards) {
    const platforms = card.actions.map((action) => action.platform)
    const agodaIndex = platforms.indexOf('Agoda')
    const bookingIndex = platforms.indexOf('Booking')
    const mapIndex = platforms.indexOf('Maps')
    const bookingAction = card.actions[bookingIndex]

    expect(agodaIndex, card.title).toBeGreaterThanOrEqual(0)
    expect(bookingIndex, card.title).toBe(agodaIndex + 1)
    expect(bookingIndex, card.title).toBeLessThan(mapIndex)
    expect(isBookingAffiliateUrl(bookingAction.href), card.title).toBe(true)
    expect(bookingAction.event).toMatch(/^northvietnamhotel_.+_booking$/)
    expect(bookingAction.section).toBe('hotel_card')
  }
})

test('North Vietnam map mirrors all 25 Booking affiliate links', () => {
  const hotelPlaces = northVietnamMapPlaces.filter((place) => place.category === 'hotel')
  const mapBookingActions = hotelPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )

  expect(hotelPlaces).toHaveLength(25)
  expect(mapBookingActions).toHaveLength(25)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^northvietnammap_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})
