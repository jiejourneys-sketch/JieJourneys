/**
 * 東京地圖：景點由 `../tickets` ＋ `spotExtraActions` 組裝；景點／商店見 Free／Food；住宿見 `../hotels`。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { tokyoFoodMapPlaces } from '@/data/tokyo/food'
import { tokyoFreeMapPlaces } from '@/data/tokyo/free'
import { tokyoHotelCards } from '@/data/tokyo/hotels'
import type { TokyoMapPlace } from '@/data/tokyo/map/types'
import { tokyoTicketCards } from '@/data/tokyo/tickets'
import { TOKYO_MAP_SPOT_EXTRA_ACTIONS } from '@/data/tokyo/map/spotExtraActions'

export type { PlaceCategory, TokyoMapPlace } from '@/data/tokyo/map/types'

function spotActionRowsFromMapNextRow(actions: CityCardAction[]): CityCardAction[][] | undefined {
  if (actions.length === 0) return undefined
  const rows: CityCardAction[][] = []
  let current: CityCardAction[] = []
  for (let i = 0; i < actions.length; i++) {
    const a = actions[i]
    if (i > 0 && a.mapNextRow) {
      rows.push(current)
      current = []
    }
    current.push(a)
  }
  if (current.length > 0) rows.push(current)
  return rows.length > 1 ? rows : undefined
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
  'shinjuku-gardens',
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
  'shinjuku-gardens': { lat: 35.6851763, lng: 139.7100517 },
  'small-worlds-tokyo': { lat: 35.6379228, lng: 139.7883556 },
  'legoland-discovery-odaiba': { lat: 35.6288365, lng: 139.776083 },
  'sanrio-puroland': { lat: 35.624512, lng: 139.429293 },
  'sumida-aquarium': { lat: 35.7099301, lng: 139.8095855 },
  'ginza-art-aquarium': { lat: 35.6713698, lng: 139.7657375 },
  'maxell-aqua-park-shinagawa': { lat: 35.6282839, lng: 139.7352393 },
  'sunshine-aquarium': { lat: 35.7289254, lng: 139.7201573 },
}

/**
 * 景點「地圖」按鈕：只改下面陣列，**由上到下第 1 筆 = 第 1 個景點**，依序對應 TICKET_SPOT_IDS。
 * 每行整段換成你的 `https://maps.app.goo.gl/...`（務必包在引號裡）。含 `PASTE_YOUR_MAPS_LINK` 時會先用 lat/lng 釘點。**勿改 lat/lng。**
 */
const TOKYO_SPOT_GOOGLE_MAP_URLS: string[] = [
  'https://maps.app.goo.gl/UhTEtJqB9rCA8Xn98', // 1 shibuya-sky
  'https://maps.app.goo.gl/NDgjtaiVmkzW4JrRA', // 2 tokyo-skytree
  'https://maps.app.goo.gl/WRQVFFu4gHZ9vwso9', // 3 roppongi-hills
  'https://maps.app.goo.gl/HX6VfiTaST9q98FM6', // 4 tokyo-tower
  'https://maps.app.goo.gl/yCFoFGKh2i1KK54E8', // 5 tokyo-disneyland
  'https://maps.app.goo.gl/z9SERjRGv83LujwXA', // 6 harry-potter-tokyo
  'https://maps.app.goo.gl/zSigJXUbaPPWm62x6', // 7 teamlab-planets
  'https://maps.app.goo.gl/zQqv9CXg6P3KtMsh7', // 8 teamlab-borderless
  'https://maps.app.goo.gl/Va4ydgMCCskN8y4AA', // 9 unko-museum
  'https://maps.app.goo.gl/QoPnKUm52tGjej6f7', // 10 shinjuku-gardens
  'https://maps.app.goo.gl/HR1K6GuTaRz8uKPw9', // 10 small-worlds-tokyo
  'https://maps.app.goo.gl/LTKhYmpyqXSSWxkd8', // 11 legoland-discovery-odaiba
  'https://maps.app.goo.gl/yVFcM5RQhguDCeb37', // 12 sanrio-puroland
  'https://maps.app.goo.gl/8dRCam93cYCPdFt59', // 13 sumida-aquarium
  'https://maps.app.goo.gl/gt3vGioUfiabRNMz8', // 14 ginza-art-aquarium
  'https://maps.app.goo.gl/xjnKwpRU8mY8AceKA', // 15 maxell-aqua-park-shinagawa
  'https://maps.app.goo.gl/zTLjycncsN3zHKkj8', // 16 sunshine-aquarium
]

function ticketCardsToSpots(): TokyoMapPlace[] {
  if (tokyoTicketCards.length !== TICKET_SPOT_IDS.length) {
    throw new Error('tokyo/map/places: tokyo/tickets 與 TICKET_SPOT_IDS 數量需一致')
  }
  if (TOKYO_SPOT_GOOGLE_MAP_URLS.length !== TICKET_SPOT_IDS.length) {
    throw new Error('tokyo/map/places: TOKYO_SPOT_GOOGLE_MAP_URLS 筆數須等於景點數')
  }
  return tokyoTicketCards.map((card, i) => {
    const id = TICKET_SPOT_IDS[i]
    const { lat, lng } = TICKET_SPOT_COORDS[id]
    const mapSpotActions = [...card.actions, ...(TOKYO_MAP_SPOT_EXTRA_ACTIONS[card.title] ?? [])]
    return {
      id,
      category: 'spot',
      name: card.title,
      description: card.area,
      lat,
      lng,
      spotActions: mapSpotActions,
      spotActionRows: spotActionRowsFromMapNextRow(mapSpotActions),
      spotGoogleMapsUrl: TOKYO_SPOT_GOOGLE_MAP_URLS[i],
    }
  })
}

function hotelCardToPlace(card: (typeof tokyoHotelCards)[number], index: number): TokyoMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`tokyo/hotels: missing lat/lng for ${card.title}`)
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
  ...tokyoFreeMapPlaces,
  ...tokyoFoodMapPlaces,
  ...tokyoHotelCards.map(hotelCardToPlace),
]
