import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import { normalizePlannerAffiliateUrl } from '@/lib/plannerAffiliate'

type BookingPropertyPath = `/hotel/jp/${string}.html`

/**
 * Booking.com property pages verified against the hotel name and Tokyo area.
 * Keep these locale-neutral and date-free; the affiliate wrapper is added below.
 */
export const tokyoBookingHotelPropertyPaths = {
  '明恩上野': '/hotel/jp/minn-ueno.html',
  '上野曼迪高級公寓': '/hotel/jp/monday-apart-premium-ueno.html',
  '東京上野諾加上飯店': '/hotel/jp/nohga-ueno.html',
  '三井花園飯店': '/hotel/jp/mitsui-garden-ueno.html',
  '&Here 東京上野': '/hotel/jp/amp-here-tokyo-ueno.html',
  '上野瑞索爾飯店': '/hotel/jp/hotel-resol-ueno.html',
  '上野御徒町多美迎飯店': '/hotel/jp/dormy-inn-ueno-okachimachi.html',
  '淺草田原町KOKO飯店住宅': '/hotel/jp/koko-residence-qian-cao-tian-yuan-ting.html',
  '淺草雷門休雷克蓋特飯店': '/hotel/jp/the-gate-asakusa-kaminarimon-by-hulic.html',
  '淺草雷門竹之宿旅館': '/hotel/jp/qian-cao-lei-men-zhu-nai-su.html',
  '御宿野乃淺草別邸': '/hotel/jp/tian-ran-wen-quan-ling-tian-notang-yu-su-ye-nai-qian-cao-bie-di.html',
  '淺草豪景飯店': '/hotel/jp/asakusa-view-tokyo.html',
  '東京淺草遠東鄉村飯店': '/hotel/jp/far-east-village-asakusa-tokyo.html',
  '里士滿淺草國際飯店': '/hotel/jp/richmond-premier-asakusa-international.html',
  '千禧 三井花園飯店 東京/銀座': '/hotel/jp/millennium-mitsui-garden-hotel-tokyo.html',
  '東京車站飯店': '/hotel/jp/tokyo-station.html',
  '東京丸之內大都會飯店': '/hotel/jp/metropolitan-marunouchi.html',
  '東京龍名館飯店': '/hotel/jp/ryumeikan-tokyo.html',
  '東京京橋雷姆飯店': '/hotel/jp/remm-tokyo-kyobashi.html',
  '東京銀座金特薩酒店': '/hotel/jp/quintessa-hotel-tokyo-ginza.html',
  '唐草飯店東京站': '/hotel/jp/karakusahoterudong-jing-sutesiyon.html',
  '東京京王廣場飯店': '/hotel/jp/keio-plaza-tokyo.html',
  '格拉斯麗新宿酒店': '/hotel/jp/gracery-shinjuku.html',
  'JR九州飯店 Blossom 新宿': '/hotel/jp/jr-kyushu-blossom-shinjuku.html',
  '小田急世紀南悅飯店': '/hotel/jp/century-southern-tower.html',
  'WPÜ飯店新宿': '/hotel/jp/wpu-shinjuku.html',
  '普樂美雅飯店-CABIN-新宿': '/hotel/jp/vintage-shinjuku.html',
  '東京澀谷英迪格飯店': '/hotel/jp/indigo-tokyo-shibuya-an-ihg.html',
  '澀谷藍塔東急飯店': '/hotel/jp/cerulean-tower-tokyu.html',
  '澀谷東急卓越大飯店': '/hotel/jp/shibuya-excel-tokyu.html',
  '澀谷溪流酒店': '/hotel/jp/shibuya-stream-excel-tokyu.html',
  '澀谷飯店EN': '/hotel/jp/shibuya-city.html',
} as const satisfies Record<string, BookingPropertyPath>

export function getTokyoBookingAffiliateUrl(hotelTitle: string) {
  const propertyPath = tokyoBookingHotelPropertyPaths[
    hotelTitle as keyof typeof tokyoBookingHotelPropertyPaths
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
export function withTokyoBookingHotelAction(card: CityCard): CityCard {
  const bookingHref = getTokyoBookingAffiliateUrl(card.title)
  if (!bookingHref || card.actions.some((action) => action.platform === 'Booking')) {
    return card
  }

  const agodaIndex = card.actions.findIndex((action) => action.platform === 'Agoda')
  const agodaAction = agodaIndex >= 0 ? card.actions[agodaIndex] : undefined
  const bookingAction: CityCardAction = {
    label: 'Booking',
    href: bookingHref,
    className: 'btn',
    event: bookingTrackingValue(agodaAction?.event, 'tokyohotel_booking'),
    mapEvent: bookingTrackingValue(agodaAction?.mapEvent, 'tokyomap_hotel_booking'),
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
