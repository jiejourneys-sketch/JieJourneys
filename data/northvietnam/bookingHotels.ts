import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'

type BookingPropertyPath = `/hotel/vn/${string}.html`

/** Booking.com property pages verified against the hotel name and North Vietnam area. */
export const northVietnamBookingHotelPropertyPaths = {
  '沙壩穹頂飯店 - 美憬閣系列': '/hotel/vn/de-la-coupole-mgallery-by-sofitel.html',
  '沙壩翡翠山Spa度假村': '/hotel/vn/sapa-jade-hill-resort-amp-spa.html',
  '帕歐沙壩休閒酒店': '/hotel/vn/paos-sapa-leisure.html',
  '薩帕雷迪山度假村': '/hotel/vn/lady-hill-sapa-resort.html',
  'KK 沙壩飯店': '/hotel/vn/kk-sapa-hoteo.html',
  '蒙特維爾山度假村': '/hotel/vn/ville-de-mont-mountain-resort.html',
  '沙壩地平線飯店': '/hotel/vn/sapa-paradise-view.html',
  '竹薩帕飯店': '/hotel/vn/bamboo-sapa.html',
  '沙壩廣場飯店-美利亞旗下': '/hotel/vn/u-sapa.html',
  '沙壩開心果飯店': '/hotel/vn/pistachio-sapa.html',
  '越南徒步沙壩酒店': '/hotel/vn/po-viettrekking-sapa.html',
  '橄欖石豪華精品飯店': '/hotel/vn/peridot-grand-amp-spa-by-aira-hoan-kiem1.html',
  '河內西湖洲際飯店': '/hotel/vn/intercontinental-westlake.html',
  '河內索拉里亞飯店': '/hotel/vn/solaria-hanoi.html',
  '密涅瓦高級飯店': '/hotel/vn/minerva-premium.html',
  '河內湖濱飯店': '/hotel/vn/hanoian-lakeside.html',
  '河內珍珠飯店': '/hotel/vn/hanoi-pearl.html',
  '河內定製時尚飯店': '/hotel/vn/hanoi-la-siesta-hotel-trendy.html',
  '河內拉耶思塔杭碧高級飯店': '/hotel/vn/la-siesta-classic-hang-be.html',
  '博塞拉飯店': '/hotel/vn/diamond.html',
  '翡翠水域優雅飯店': '/hotel/vn/essence-palace.html',
  'Tam Coc Wonderland Lodge': '/hotel/vn/tam-coc-wonderland-ninh-binh12.html',
  '三谷艾美度假村': '/hotel/vn/tam-coc-la-montagne-tcm.html',
  'Tam Coc Peaceful Nature': '/hotel/vn/tam-coc-peaceful-nature.html',
  'La Sen Village': '/hotel/vn/sun-boutique-tam-coc-ninh-binh-fields-view.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getNorthVietnamBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = northVietnamBookingHotelPropertyPaths[
    hotelTitle as keyof typeof northVietnamBookingHotelPropertyPaths
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

export function withNorthVietnamBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getNorthVietnamBookingAffiliateUrl(card.title)
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
    event: bookingTrackingValue(trackingAction?.event, 'northvietnamhotel_booking'),
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
