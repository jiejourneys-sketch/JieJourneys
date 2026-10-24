import { expect, test } from '@playwright/test'
import {
  fujiBookingHotelPropertyPaths,
  getFujiBookingAffiliateUrl,
} from '../data/fuji/bookingHotels'
import { fujiHotelCards } from '../data/fuji/hotels'
import { fujiMapPlaces } from '../data/fuji/map/places'
import { bookingPropertyIdFromUrl, isBookingAffiliateUrl } from '../lib/plannerAffiliate'

const omittedHotelTitles = [
  '虹夕諾雅富士',
  'Sunnide Resort Hotel',
  '湖山亭產屋',
  '河口湖溫泉飯店KUKUNA',
  '湖樂御宿富士吟景',
]

test('15 Fuji hotels have verified Booking.com affiliate links', () => {
  const entries = Object.entries(fujiBookingHotelPropertyPaths)
  expect(entries).toHaveLength(15)

  for (const [hotelTitle, propertyPath] of entries) {
    const affiliateUrl = getFujiBookingAffiliateUrl(hotelTitle)
    expect(affiliateUrl, hotelTitle).not.toBeNull()
    expect(isBookingAffiliateUrl(affiliateUrl!), hotelTitle).toBe(true)
    expect(bookingPropertyIdFromUrl(affiliateUrl!), hotelTitle).toBe(
      propertyPath.replace(/^\/hotel\//, '').replace(/\.html$/, ''),
    )
  }
})

test('Fuji hotel cards add Booking only to verified properties', () => {
  expect(fujiHotelCards).toHaveLength(20)

  for (const card of fujiHotelCards) {
    const platforms = card.actions.map((action) => action.platform)
    const bookingIndex = platforms.indexOf('Booking')

    if (omittedHotelTitles.includes(card.title)) {
      expect(bookingIndex, card.title).toBe(-1)
      continue
    }

    const agodaIndex = platforms.indexOf('Agoda')
    const mapIndex = platforms.indexOf('Maps')
    const bookingAction = card.actions[bookingIndex]

    expect(bookingIndex, card.title).toBe(agodaIndex + 1)
    expect(bookingIndex, card.title).toBeLessThan(mapIndex)
    expect(isBookingAffiliateUrl(bookingAction.href), card.title).toBe(true)
    expect(bookingAction.event).toMatch(/^fujihotel_.+_booking$/)
    expect(bookingAction.section).toBe('hotel_card')
  }
})

test('Fuji map mirrors the 15 verified Booking affiliate links', () => {
  const hotelPlaces = fujiMapPlaces.filter((place) => place.category === 'hotel')
  const mapBookingActions = hotelPlaces.flatMap((place) =>
    (place.hotelActions ?? []).filter((action) => action.platform === 'Booking'),
  )

  expect(hotelPlaces).toHaveLength(20)
  expect(mapBookingActions).toHaveLength(15)

  for (const action of mapBookingActions) {
    expect(isBookingAffiliateUrl(action.href)).toBe(true)
    expect(action.mapEvent).toMatch(/^fujimap_hotel_.+_booking$/)
    expect(action.mapSection).toBe('map_bar')
  }
})
