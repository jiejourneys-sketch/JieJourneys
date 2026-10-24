import { expect, test } from '@playwright/test'
import {
  getTokyoBookingAffiliateUrl,
  tokyoBookingHotelPropertyPaths,
  withTokyoBookingHotelAction,
} from '../data/tokyo/bookingHotels'
import { tokyoHotelCards } from '../data/tokyo/hotels'
import { tokyoMapPlaces } from '../data/tokyo/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

test('Tokyo hotel page has verified Booking.com affiliate links', () => {
  const entries = Object.entries(tokyoBookingHotelPropertyPaths)
  expect(entries).toHaveLength(32)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getTokyoBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('Booking actions are shared by the Tokyo hotel page and map data', () => {
  const enrichedCards = tokyoHotelCards.map(withTokyoBookingHotelAction)
  const cardsWithBooking = enrichedCards.filter((card) =>
    card.actions.some((action) => action.platform === 'Booking'),
  )
  expect(cardsWithBooking).toHaveLength(32)

  for (const card of cardsWithBooking) {
    const platforms = card.actions.map((action) => action.platform)
    expect(platforms.indexOf('Booking'), card.title).toBe(platforms.indexOf('Agoda') + 1)
  }

  const hotelPlaces = tokyoMapPlaces.filter((place) => place.category === 'hotel')
  const mapBookingActions = hotelPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )
  expect(hotelPlaces).toHaveLength(32)
  expect(mapBookingActions).toHaveLength(32)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^tokyomap_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})

test('Richmond Hotel Premier Asakusa uses the confirmed Trip property ID everywhere', () => {
  const expectedPropertyPath = '/hotels/tokyo-hotel-detail-5024267/'
  const card = tokyoHotelCards.find((hotel) => hotel.title === '里士滿淺草國際飯店')
  const place = tokyoMapPlaces.find((hotel) => hotel.name === '里士滿淺草國際飯店')
  const cardTrip = card?.actions.find((action) => action.platform === 'Trip')
  const mapTrip = place?.hotelActions?.find((action) => action.platform === 'Trip')

  expect(new URL(cardTrip!.href).pathname).toBe(expectedPropertyPath)
  expect(new URL(mapTrip!.href).pathname).toBe(expectedPropertyPath)
})
