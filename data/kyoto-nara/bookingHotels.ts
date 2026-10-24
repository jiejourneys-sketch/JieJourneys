import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'
import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'

type BookingPropertyPath = `/hotel/jp/${string}.html`

/** Booking.com property pages verified against the hotel name and Kyoto area. */
export const kyotoBookingHotelPropertyPaths = {
  '京都比偲奇飯店': '/hotel/jp/hoteruvuisukiojing-du.html',
  '三井花園飯店京都站前': '/hotel/jp/mitsui-garden-hotel-kyoto-station-japan.html',
  'THE THOUSAND KYOTO': '/hotel/jp/the-thousand-kyoto.html',
  '京都格蘭比亞大酒店': '/hotel/jp/granvia-kyoto-kyoto.html',
  'GOOD NATURE HOTEL KYOTO': '/hotel/jp/good-nature-kyoto.html',
  'Richmond Hotel Premier 京都四條': '/hotel/jp/ritutimondohoterupuremiajing-du-si-tiao.html',
  'MIMARU 京都站': '/hotel/jp/mimaru-jing-du-station.html',
  '麗嘉 GRAN 京都': '/hotel/jp/rigaguranjing-du.html',
  'THE GATE HOTEL 京都高瀨川 by HULIC': '/hotel/jp/the-gate-hoteljing-du-gao-lai-chuan-by-hulic.html',
  'Hotel Kanra Kyoto': '/hotel/jp/kanra-kyoto.html',
  'HOTEL THE CELESTINE 京都祇園': '/hotel/jp/the-celestine-kyoto-gion.html',
  'Ace Hotel Kyoto': '/hotel/jp/ace-hotel-kyoto.html',
  'HOTEL THE MITSUI KYOTO': '/hotel/jp/the-mitsui-kyoto-a-luxury-collection-spa.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getKyotoBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = kyotoBookingHotelPropertyPaths[
    hotelTitle as keyof typeof kyotoBookingHotelPropertyPaths
  ]
  if (!propertyPath) return null

  const affiliateUrl = normalizePlannerAffiliateUrl(
    new URL(propertyPath, 'https://www.booking.com'),
  )
  if (!affiliateUrl) {
    throw new Error(`Invalid Booking.com property path for ${hotelTitle}`)
  }
  return affiliateUrl
}

function bookingTrackingValue(value: string | undefined, fallback: string) {
  if (!value) return fallback
  if (/_agoda$/.test(value)) return value.replace(/_agoda$/, '_booking')
  if (/_trip$/.test(value)) return value.replace(/_trip$/, '_booking')
  return `${value}_booking`
}

function insertBookingAction(
  actions: CityCardAction[],
  bookingHref: string,
  fallbackEvent: string,
  section: 'hotel_card' | 'map_bar',
) {
  if (actions.some((action) => action.platform === 'Booking')) return actions

  const agodaIndex = actions.findIndex((action) => action.platform === 'Agoda')
  const tripIndex = actions.findIndex((action) => action.platform === 'Trip')
  const trackingAction = actions[agodaIndex >= 0 ? agodaIndex : tripIndex]
  const bookingAction: CityCardAction = {
    label: 'Booking',
    href: bookingHref,
    className: 'btn',
    event: bookingTrackingValue(trackingAction?.event, fallbackEvent),
    mapEvent: section === 'map_bar'
      ? bookingTrackingValue(trackingAction?.mapEvent ?? trackingAction?.event, fallbackEvent)
      : undefined,
    platform: 'Booking',
    section,
    mapSection: section === 'map_bar' ? 'map_bar' : undefined,
  }
  const mapIndex = actions.findIndex((action) => /^(map|maps)$/i.test(action.platform ?? ''))
  const insertAt = agodaIndex >= 0
    ? agodaIndex + 1
    : mapIndex >= 0
      ? mapIndex
      : actions.length

  return [
    ...actions.slice(0, insertAt),
    bookingAction,
    ...actions.slice(insertAt),
  ]
}

export function withKyotoBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getKyotoBookingAffiliateUrl(card.title)
  if (!bookingHref) return card

  return {
    ...card,
    actions: insertBookingAction(
      card.actions,
      bookingHref,
      'kyotonarahotel_booking',
      'hotel_card',
    ),
  }
}

export function withKyotoBookingMapAction(place: MapPlace): MapPlace {
  if (place.category !== 'hotel' || !place.hotelActions) return place

  const bookingHref = getKyotoBookingAffiliateUrl(place.name)
  if (!bookingHref) return place

  return {
    ...place,
    hotelActions: insertBookingAction(
      place.hotelActions,
      bookingHref,
      'osakamap_kyoto_hotel_booking',
      'map_bar',
    ),
  }
}
