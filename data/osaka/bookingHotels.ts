import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'
import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'

type BookingPropertyPath = `/hotel/jp/${string}.html`

/**
 * Booking.com property pages verified against the hotel name and Osaka area.
 * Keep these locale-neutral and date-free; the affiliate wrapper is added below.
 */
export const osakaBookingHotelPropertyPaths = {
  '大阪瑞士南海飯店': '/hotel/jp/swissotel-nankai-osaka-osaka.html',
  '大阪皇家古典飯店': '/hotel/jp/royal-classic-osaka.html',
  '大阪難波格拉斯麗飯店': '/hotel/jp/hotel-gracery-osaka-namba.html',
  '大阪難波光芒飯店': '/hotel/jp/candeo-osaka-namba.html',
  '大阪日航飯店': '/hotel/jp/nikko-osaka.html',
  '捷絲旅大阪心齋橋館': '/hotel/jp/just-sleep-osaka-shinsaibashi.html',
  'VESSEL INN大阪心齋橋船舶酒店': '/hotel/jp/vessel-inn-shinsaibashi.html',
  '相鐵 FRESA INN 大阪心齋橋': '/hotel/jp/sotetsu-fresa-inn-osaka-shinsaibashi.html',
  '大阪麗思卡爾頓酒店': '/hotel/jp/the-ritz-carlton-osaka.html',
  '阪急大阪龍仕柏飯店': '/hotel/jp/hankyu-respire-osaka.html',
  '大阪梅田Intergate飯店': '/hotel/jp/intergate-osaka-umeda.html',
  '格蘭比亞大阪維斯奇歐飯店': '/hotel/jp/vischio-osaka-by-granvia.html',
  '大阪萬豪都酒店': '/hotel/jp/osaka-marriott-miyako.html',
  '大阪阿倍野Trusty飯店': '/hotel/jp/trusty-osaka-abeno.html',
  '大阪天王寺都城市飯店': '/hotel/jp/tennnouji-mayako.html',
  'VIA INN 阿倍野天王寺': '/hotel/jp/via-inn-abeno-tennoji.html',
  '大阪十字飯店': '/hotel/jp/cross-osaka.html',
  '唐草飯店大阪難波': '/hotel/jp/karaksa-osaka-namba.html',
  '大阪蒙特利格拉斯米爾飯店': '/hotel/jp/monterey-grasmere.html',
  '天然溫泉 御宿野乃 難波': '/hotel/jp/onyado-nono-namba-natural-hot-spring.html',
  '日和飯店大阪難波站前': '/hotel/jp/hiyori-hotel-osaka-namba.html',
  'MIMARU 大阪心齋橋 WEST': '/hotel/jp/mimaru-osaka-shinsaibashi-west.html',
  'HOTEL THE FLAG 心齋橋': '/hotel/jp/the-flag.html',
  '阪急國際飯店': '/hotel/jp/hoteruban-ji-intanasiyonaru.html',
  '大阪格蘭比亞飯店': '/hotel/jp/granvia-osaka.html',
  '大阪蒙特利飯店': '/hotel/jp/monterey-osaka.html',
  'Villa Fontaine Grand 大阪梅田': '/hotel/jp/villa-fontaine-grand-osaka-umeda.html',
  '環球影城前飯店': '/hotel/jp/the-park-front-hotel.html',
  'LIBER HOTEL 大阪': '/hotel/jp/riberuhoteru-atuto-yunibasarusutazioziyapantm.html',
  'OMO7 大阪 by 星野集團': '/hotel/jp/omo7-osaka-by-hoshino-resorts.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getOsakaBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = osakaBookingHotelPropertyPaths[
    hotelTitle as keyof typeof osakaBookingHotelPropertyPaths
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
  return /_agoda$/.test(value) ? value.replace(/_agoda$/, '_booking') : `${value}_booking`
}

function insertBookingAction(
  actions: CityCardAction[],
  bookingHref: string,
  fallbackEvent: string,
  section: 'hotel_card' | 'map_bar',
) {
  if (actions.some((action) => action.platform === 'Booking')) return actions

  const agodaIndex = actions.findIndex((action) => action.platform === 'Agoda')
  const agodaAction = agodaIndex >= 0 ? actions[agodaIndex] : undefined
  const event = bookingTrackingValue(agodaAction?.event, fallbackEvent)
  const bookingAction: CityCardAction = {
    label: 'Booking',
    href: bookingHref,
    className: 'btn',
    event,
    mapEvent: section === 'map_bar' ? event : undefined,
    platform: 'Booking',
    section,
    mapSection: section === 'map_bar' ? 'map_bar' : undefined,
  }
  const insertAt = agodaIndex >= 0 ? agodaIndex + 1 : actions.length

  return [
    ...actions.slice(0, insertAt),
    bookingAction,
    ...actions.slice(insertAt),
  ]
}

/** Adds the verified Booking affiliate action once, immediately after Agoda. */
export function withOsakaBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getOsakaBookingAffiliateUrl(card.title)
  if (!bookingHref) return card

  return {
    ...card,
    actions: insertBookingAction(
      card.actions,
      bookingHref,
      'osakahotel_booking',
      'hotel_card',
    ),
  }
}

/** Adds the same verified Booking affiliate action to Osaka hotel map cards. */
export function withOsakaBookingMapAction(place: MapPlace): MapPlace {
  if (place.category !== 'hotel' || !place.hotelActions) return place

  const bookingHref = getOsakaBookingAffiliateUrl(place.name)
  if (!bookingHref) return place

  return {
    ...place,
    hotelActions: insertBookingAction(
      place.hotelActions,
      bookingHref,
      'osakamap_hotel_booking',
      'map_bar',
    ),
  }
}
