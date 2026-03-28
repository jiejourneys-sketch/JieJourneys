/**
 * 東京地圖：景點與 /tokyo/ticket 票券連結同步；住宿與 tokyoHotels 同步。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { tokyoTicketCards } from '@/data/tokyoTicketCards'
import { tokyoHotelCards } from '@/data/tokyoHotels'

export type PlaceCategory = 'spot' | 'hotel'

export type TokyoMapPlace = {
  id: string
  category: PlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  /** 與票券頁相同（KKDAY / KLOOK / Trip）；地圖 UI 另加「導航」。 */
  spotActions?: CityCardAction[]
  /** 住宿：與 /tokyo/hotel 相同按鈕 */
  hotelActions?: CityCardAction[]
}

export const TOKYO_MAP_CENTER = { lat: 35.6812, lng: 139.7671 }

const TICKET_SPOT_IDS = [
  'shibuya-sky',
  'tokyo-skytree',
  'roppongi-hills',
  'tokyo-tower',
  'tokyo-disneyland',
  'harry-potter-tokyo',
  'teamlab-planets',
  'teamlab-borderless',
  'unko-museum',
  'small-worlds-tokyo',
  'legoland-discovery-odaiba',
  'sanrio-puroland',
  'sumida-aquarium',
  'ginza-art-aquarium',
  'maxell-aqua-park-shinagawa',
  'sunshine-aquarium',
] as const

/**
 * 各景點建物／主要入口座標（盡量對齊 Google Maps 地點釘選；可再依實地走訪微調）
 * 參考：OSM／官方地址／地標中心；Small Worlds 為江東區有明 1-3-33（非台場 Aomi）
 */
const TICKET_SPOT_COORDS: Record<(typeof TICKET_SPOT_IDS)[number], { lat: number; lng: number }> = {
  'shibuya-sky': { lat: 35.6582857, lng: 139.7022617 },
  'tokyo-skytree': { lat: 35.7100627, lng: 139.8107004 },
  'roppongi-hills': { lat: 35.660174, lng: 139.729267 },
  'tokyo-tower': { lat: 35.658621, lng: 139.745438 },
  'tokyo-disneyland': { lat: 35.632972, lng: 139.880811 },
  'harry-potter-tokyo': { lat: 35.643222, lng: 139.825806 },
  'teamlab-planets': { lat: 35.649148, lng: 139.789803 },
  'teamlab-borderless': { lat: 35.657523, lng: 139.736218 },
  'unko-museum': { lat: 35.625074, lng: 139.775301 },
  'small-worlds-tokyo': { lat: 35.638056, lng: 139.788333 },
  'legoland-discovery-odaiba': { lat: 35.626112, lng: 139.774668 },
  'sanrio-puroland': { lat: 35.625833, lng: 139.426311 },
  'sumida-aquarium': { lat: 35.710102, lng: 139.810593 },
  'ginza-art-aquarium': { lat: 35.671938, lng: 139.764669 },
  'maxell-aqua-park-shinagawa': { lat: 35.627938, lng: 139.738507 },
  'sunshine-aquarium': { lat: 35.728942, lng: 139.719285 },
}

function ticketCardsToSpots(): TokyoMapPlace[] {
  if (tokyoTicketCards.length !== TICKET_SPOT_IDS.length) {
    throw new Error('tokyoMapPlaces: tokyoTicketCards 與 TICKET_SPOT_IDS 數量需一致')
  }
  return tokyoTicketCards.map((card, i) => {
    const id = TICKET_SPOT_IDS[i]
    const { lat, lng } = TICKET_SPOT_COORDS[id]
    return {
      id,
      category: 'spot',
      name: card.title,
      description: `${card.area}｜與票券頁相同購買連結`,
      lat,
      lng,
      spotActions: card.actions,
    }
  })
}

function hotelCardToPlace(card: (typeof tokyoHotelCards)[number], index: number): TokyoMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`tokyoHotels: missing lat/lng for ${card.title}`)
  }
  return {
    id: `hotel-${index + 1}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    hotelActions: card.actions,
  }
}

export const tokyoMapPlaces: TokyoMapPlace[] = [
  ...ticketCardsToSpots(),
  ...tokyoHotelCards.map(hotelCardToPlace),
]
