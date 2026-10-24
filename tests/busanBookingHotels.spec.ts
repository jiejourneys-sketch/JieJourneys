import { expect, test } from '@playwright/test'
import {
  busanBookingHotelPropertyPaths,
  getBusanBookingAffiliateUrl,
  withBusanBookingHotelAction,
} from '../data/busan/bookingHotels'
import { busanHotelCards } from '../data/busan/hotels'
import { busanMapPlaces } from '../data/busan/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

test('Busan hotel page has verified Booking.com affiliate links', () => {
  const entries = Object.entries(busanBookingHotelPropertyPaths)
  expect(entries).toHaveLength(22)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getBusanBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('Busan properties without an active Booking.com page stay omitted', () => {
  expect(getBusanBookingAffiliateUrl('霍默斯飯店')).toBeNull()
  expect(getBusanBookingAffiliateUrl('HyoiStay 廣安')).toBeNull()
  expect(getBusanBookingAffiliateUrl('釜山大道飯店')).toBeNull()
  expect(getBusanBookingAffiliateUrl('都市精品南浦BIFF飯店')).toBeNull()
})

test('Booking actions are shared by the Busan hotel page and map data', () => {
  const enrichedCards = busanHotelCards.map(withBusanBookingHotelAction)
  const cardsWithBooking = enrichedCards.filter((card) =>
    card.actions.some((action) => action.platform === 'Booking'),
  )
  expect(cardsWithBooking).toHaveLength(22)

  for (const card of cardsWithBooking) {
    const platforms = card.actions.map((action) => action.platform)
    expect(platforms.indexOf('Booking'), card.title).toBe(platforms.indexOf('Agoda') + 1)
  }

  const hotelPlaces = busanMapPlaces.filter((place) => place.category === 'hotel')
  const mapBookingActions = hotelPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )
  expect(hotelPlaces).toHaveLength(26)
  expect(mapBookingActions).toHaveLength(22)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^busanmap_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})
