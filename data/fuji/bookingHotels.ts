import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'

type BookingPropertyPath = `/hotel/jp/${string}.html`

/** Booking.com property pages verified against the hotel name and Fuji area. */
export const fujiBookingHotelPropertyPaths = {
  '秀峰閣湖月': '/hotel/jp/shuhokaku-kogetsu.html',
  '馥府河口湖': '/hotel/jp/fufu-kawaguchiko.html',
  '富士河口湖拉維斯塔飯店': '/hotel/jp/la-vista-fujikawaguchiko.html',
  '河口湖城市渡假別墅': '/hotel/jp/kawaguchiko-urban-resort-villa.html',
  '雲之上富士飯店': '/hotel/jp/yun-noshang-fu-shi-hoteru.html',
  '富士山景溫泉大池飯店': '/hotel/jp/oike.html',
  '富士河口湖溫泉鄉湖南莊': '/hotel/jp/konanso.html',
  '富士湖飯店': '/hotel/jp/fuji-lake.html',
  'THE TOKI富士河口湖': '/hotel/jp/the-toki-fujikawaguchiko.html',
  '夢富士花之宿旅館': '/hotel/jp/villa-resort-yumefuji.html',
  'MYSTAYS富士山展望溫泉酒店': '/hotel/jp/mystays-premier-fujisan.html',
  'Megu Fuji 2021': '/hotel/jp/megu-fuji-2021.html',
  '富士山河口湖Kagelow青旅': '/hotel/jp/kagelow-mt-fuji-hostel-kawaguchiko.html',
  'THE GARDEN': '/hotel/jp/the-garden-fu-shi-he-kou-hu-ting.html',
  '河口湖車站旅館': '/hotel/jp/kawaguchiko-station-inn.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getFujiBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = fujiBookingHotelPropertyPaths[
    hotelTitle as keyof typeof fujiBookingHotelPropertyPaths
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

export function withFujiBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getFujiBookingAffiliateUrl(card.title)
  if (!bookingHref || card.actions.some((action) => action.platform === 'Booking')) {
    return card
  }

  const agodaIndex = card.actions.findIndex((action) => action.platform === 'Agoda')
  const tripIndex = card.actions.findIndex((action) => action.platform === 'Trip')
  const trackingAction = card.actions[agodaIndex >= 0 ? agodaIndex : tripIndex]
  const bookingAction: CityCardAction = {
    label: 'Booking',
    href: bookingHref,
    className: 'btn',
    event: bookingTrackingValue(trackingAction?.event, 'fujihotel_booking'),
    platform: 'Booking',
    section: 'hotel_card',
  }
  const mapIndex = card.actions.findIndex((action) => action.platform === 'Maps')
  const insertAt = agodaIndex >= 0
    ? agodaIndex + 1
    : mapIndex >= 0
      ? mapIndex
      : card.actions.length

  return {
    ...card,
    actions: [
      ...card.actions.slice(0, insertAt),
      bookingAction,
      ...card.actions.slice(insertAt),
    ],
  }
}

// Intentionally omitted as of 2026-10-24 because no exact Booking.com property
// page could be verified: 虹夕諾雅富士、Sunnide Resort Hotel、湖山亭產屋、
// 河口湖溫泉飯店KUKUNA、湖樂御宿富士吟景。
