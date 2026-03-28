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
  'shibuya-sky': { lat: 35.6586719, lng: 139.7019848 },
  'tokyo-skytree': { lat: 35.7100627, lng: 139.8107004 },
  'roppongi-hills': { lat: 35.6600712, lng: 139.7292907 },
  'tokyo-tower': { lat: 35.6585805, lng: 139.7454329 },
  'tokyo-disneyland': { lat: 35.6328964, lng: 139.8803943 },
  'harry-potter-tokyo': { lat: 35.745183, lng: 139.6460909 },
  'teamlab-planets': { lat: 35.6491207, lng: 139.7897739 },
  'teamlab-borderless': { lat: 35.6620689, lng: 139.7432671 },
  'unko-museum': { lat: 35.6255273, lng: 139.776413 },
  'small-worlds-tokyo': { lat: 35.6379228, lng: 139.7883556 },
  'legoland-discovery-odaiba': { lat: 35.6288365, lng: 139.776083 },
  'sanrio-puroland': { lat: 35.624512, lng: 139.429293 },
  'sumida-aquarium': { lat: 35.7099301, lng: 139.8095855 },
  'ginza-art-aquarium': { lat: 35.6713698, lng: 139.7657375 },
  'maxell-aqua-park-shinagawa': { lat: 35.6282839, lng: 139.7352393 },
  'sunshine-aquarium': { lat: 35.7289254, lng: 139.7201573 },
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
