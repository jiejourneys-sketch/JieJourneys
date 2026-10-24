import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'
import type { CityCard, CityCardAction } from '@/components/CityTabbedList'

type BookingPropertyPath = `/hotel/kr/${string}.html`

/**
 * Booking.com property pages verified against the hotel name and Busan area.
 * Keep these locale-neutral and date-free; the affiliate wrapper is added below.
 */
export const busanBookingHotelPropertyPaths = {
  '信一釜山飯店': '/hotel/kr/signiel-busan.html',
  '釜山朝昕經典飯店': '/hotel/kr/grand-josun-busan.html',
  'L7海雲台': '/hotel/kr/l7-haeundae-busan.html',
  '新羅舒泰飯店': '/hotel/kr/shilla-stay-haeundae.html',
  '柯榮海雲飯店': '/hotel/kr/seacloud-busan.html',
  '海雲台MS飯店': '/hotel/kr/ms-busan.html',
  'UH Suite 海雲台飯店': '/hotel/kr/uh-suite-the-haeundae-busan.html',
  '廣安裡凱星頓肯特飯店': '/hotel/kr/kent-gwangalli.html',
  '水上皇宮大飯店': '/hotel/kr/aqua-palace.html',
  '廣安里飯店1': '/hotel/kr/gwanganli-1.html',
  '釜山樂天飯店': '/hotel/kr/lotte-busan.html',
  '阿爾班飯店': '/hotel/kr/arban.html',
  '釜山商務飯店': '/hotel/kr/busan-business-busan.html',
  '京城旅館': '/hotel/kr/kyungsung.html',
  '西面棕色點點商務飯店': '/hotel/kr/browndot-seomyeon-business.html',
  '西面城市住宿飯店': '/hotel/kr/urbanstay-seomyeon.html',
  '釜山西面皇后飯店': '/hotel/kr/goodstay-queens-motel.html',
  '釜山斯坦福飯店': '/hotel/kr/stanford-inn-busan.html',
  '南浦獵犬尊貴飯店': '/hotel/kr/hound-bupyeong.html',
  '弗萊特普瑞米爾南浦飯店': '/hotel/kr/foret-premier-nampo.html',
  '格里芬灣飯店': '/hotel/kr/geuripinbeihotel.html',
  '美好時光飯店': '/hotel/kr/gusoldeijeu.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getBusanBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = busanBookingHotelPropertyPaths[
    hotelTitle as keyof typeof busanBookingHotelPropertyPaths
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

/** Adds the verified Booking affiliate action once, immediately after Agoda. */
export function withBusanBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getBusanBookingAffiliateUrl(card.title)
  if (!bookingHref || card.actions.some((action) => action.platform === 'Booking')) {
    return card
  }

  const agodaIndex = card.actions.findIndex((action) => action.platform === 'Agoda')
  const agodaAction = agodaIndex >= 0 ? card.actions[agodaIndex] : undefined
  const bookingAction: CityCardAction = {
    label: 'Booking',
    href: bookingHref,
    className: 'btn',
    event: bookingTrackingValue(agodaAction?.event, 'busanhotel_booking'),
    mapEvent: bookingTrackingValue(agodaAction?.mapEvent, 'busanmap_hotel_booking'),
    platform: 'Booking',
    section: 'hotel_card',
    mapSection: 'map_bar',
  }
  const insertAt = agodaIndex >= 0 ? agodaIndex + 1 : card.actions.length

  return {
    ...card,
    actions: [
      ...card.actions.slice(0, insertAt),
      bookingAction,
      ...card.actions.slice(insertAt),
    ],
  }
}

// Intentionally omitted as of 2026-10-24:
// - 霍默斯飯店: its former Booking.com property page redirects to the Busan index.
// - HyoiStay 廣安: Booking.com currently marks the property as not accepting reservations.
// - 釜山大道飯店: its former Booking.com property page redirects to the Busan index.
// - 都市精品南浦BIFF飯店: its former Booking.com property page redirects to the Busan index.
