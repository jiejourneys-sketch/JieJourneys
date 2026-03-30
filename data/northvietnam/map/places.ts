/**
 * 越南北越地圖：景點由 `../tickets` ＋ `spotExtraActions` 組裝；景點／商店見 Free／Food；住宿見 `../hotels`。
 * 票券 title 須與 `northvietnam/tickets` 完全一致；座標可依 Google 釘選微調。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { northVietnamFoodMapPlaces } from '@/data/northvietnam/food'
import { northVietnamFreeMapPlaces } from '@/data/northvietnam/free'
import { northVietnamHotelCards } from '@/data/northvietnam/hotels'
import type { NorthVietnamMapPlace } from '@/data/northvietnam/map/types'
import { northVietnamTicketCards } from '@/data/northvietnam/tickets'
import { NORTH_VIETNAM_MAP_SPOT_EXTRA_ACTIONS } from '@/data/northvietnam/map/spotExtraActions'

export type { NorthVietnamMapPlace, NorthVietnamPlaceCategory } from '@/data/northvietnam/map/types'

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

/** 北越範圍大，初始視角取河內—下龍一帶；使用者可再縮放平移 */
export const NORTH_VIETNAM_MAP_CENTER = { lat: 20.95, lng: 105.85 }

/** 票券標題 → 參考座標（下龍郵輪類集中圖倫／下龍市一帶並略為錯開釘點） */
const NV_SPOT_GEO: Record<string, { lat: number; lng: number }> = {
  番西邦峰: { lat: 22.3033333, lng: 103.775 },
  玻璃天空步道: { lat: 22.3723777, lng: 103.7575047 },
  '頂級郵輪｜2天1夜': { lat: 20.9167672, lng: 106.9918762 },
  'Athena Cruise｜2天1夜': { lat: 20.9529719, lng: 107.0560726 },
  'Aqua Elegance｜2天1夜': { lat: 20.9269935, lng: 106.9824404 },
  'Alisa Premier Cruise｜2天1夜': { lat: 20.9220339, lng: 106.9838349 },
  'Ambassador Cruise｜1日遊': { lat: 20.9536861, lng: 107.055974 },
  'Olympus Day Cruise｜1日遊': { lat: 20.9224804, lng: 106.9907306 },
  '方案1｜華閭 - 三谷/長安 - 舞洞': { lat: 20.2843154, lng: 105.9083607 },
  '方案2｜白亭 - 長安 - 舞洞': { lat: 20.2758964, lng: 105.8657699 },
  '方案3｜華閭 - 白亭 - 長安 - 舞洞': { lat: 20.2531292, lng: 105.918861 },
  '方案4｜華閭 - 三谷 - 舞洞 - 白亭 - 長安': { lat: 20.2163242, lng: 105.9374664 },
  'La Belle Spa按摩': { lat: 21.0327469, lng: 105.8504278 },
  水上木偶秀: { lat: 21.0316826, lng: 105.8533466 },
  樂天觀景台: { lat: 21.0321022, lng: 105.8126712 },
  樂天世界水族館: { lat: 21.0759777, lng: 105.8129133 },
}

const NV_SPOT_ID: Record<string, string> = {
  番西邦峰: 'nv-fansipan',
  玻璃天空步道: 'nv-glass-bridge',
  '頂級郵輪｜2天1夜': 'nv-cruise-premium',
  'Athena Cruise｜2天1夜': 'nv-cruise-athena',
  'Aqua Elegance｜2天1夜': 'nv-cruise-aqua',
  'Alisa Premier Cruise｜2天1夜': 'nv-cruise-alisa',
  'Ambassador Cruise｜1日遊': 'nv-cruise-ambassador',
  'Olympus Day Cruise｜1日遊': 'nv-cruise-olympus',
  '方案1｜華閭 - 三谷/長安 - 舞洞': 'nv-trangan-1',
  '方案2｜白亭 - 長安 - 舞洞': 'nv-trangan-2',
  '方案3｜華閭 - 白亭 - 長安 - 舞洞': 'nv-trangan-3',
  '方案4｜華閭 - 三谷 - 舞洞 - 白亭 - 長安': 'nv-trangan-4',
  'La Belle Spa按摩': 'nv-la-belle-spa',
  水上木偶秀: 'nv-water-puppet',
  樂天觀景台: 'nv-lotte-deck',
  樂天世界水族館: 'nv-lotte-aqua',
}

/**
 * 景點「地圖」按鈕：只改下面陣列，順序與 `northvietnam/tickets` 完全一致（第 1 筆 = 第 1 張票券）。
 * 每行貼 `https://maps.app.goo.gl/...`（須加引號）。**勿改 lat/lng。**
 */
const NV_SPOT_GOOGLE_MAP_URLS: string[] = [
  'https://maps.app.goo.gl/JCkYRfe12yyMtFiN9', // 1 番西邦峰
  'https://maps.app.goo.gl/4M7UAjoV2rQqTos77', // 2 玻璃天空步道
  'https://maps.app.goo.gl/BLAuP7LbevvNL4yn9', // 3 頂級郵輪｜2天1夜
  'https://maps.app.goo.gl/nfsF24rnwjsZtWMXA', // 4 Athena Cruise｜2天1夜
  'https://maps.app.goo.gl/wnssvbkcMqqB3Cqj9', // 5 Aqua Elegance｜2天1夜
  'https://maps.app.goo.gl/E6MjUuku7PqJDe1h7', // 6 Alisa Premier Cruise｜2天1夜
  'https://maps.app.goo.gl/19SaKeRXvCeNnKTg6', // 7 Ambassador Cruise｜1日遊
  'https://maps.app.goo.gl/hUWhpYTDKdrJdh679', // 8 Olympus Day Cruise｜1日遊
  'https://maps.app.goo.gl/8iAU4QWomcsRj96o7', // 9 方案1｜華閭 - 三谷/長安 - 舞洞
  'https://maps.app.goo.gl/eggKDmDzq2fuDx2W8', // 10 方案2｜白亭 - 長安 - 舞洞
  'https://maps.app.goo.gl/HFxtKgAk7BjWJWmM9', // 11 方案3｜華閭 - 白亭 - 長安 - 舞洞
  'https://maps.app.goo.gl/62Nir68Z22qV3zUG6', // 12 方案4｜華閭 - 三谷 - 舞洞 - 白亭 - 長安
  'https://maps.app.goo.gl/F6P6zLfHxkWkUr8R9', // 13 La Belle Spa按摩
  'https://maps.app.goo.gl/PYKeekdGoQkEGJu67', // 14 水上木偶秀
  'https://maps.app.goo.gl/cz5JWjzdgufHqSzBA', // 15 樂天觀景台
  'https://maps.app.goo.gl/mk6ZQWbz3gX2nq7d7', // 16 樂天世界水族館
]

function ticketCardsToSpots(): NorthVietnamMapPlace[] {
  if (NV_SPOT_GOOGLE_MAP_URLS.length !== northVietnamTicketCards.length) {
    throw new Error('northvietnam/map/places: NV_SPOT_GOOGLE_MAP_URLS 筆數須與票券數相同')
  }
  return northVietnamTicketCards.map((card, i) => {
    const geo = NV_SPOT_GEO[card.title]
    const id = NV_SPOT_ID[card.title]
    if (!geo || !id) {
      throw new Error(`northvietnam/map/places: 缺少座標或 id：${card.title}`)
    }
    const mapSpotActions = [...card.actions, ...(NORTH_VIETNAM_MAP_SPOT_EXTRA_ACTIONS[card.title] ?? [])]
    return {
      id,
      category: 'spot',
      name: card.title,
      description: card.meta,
      lat: geo.lat,
      lng: geo.lng,
      spotActions: mapSpotActions,
      spotActionRows: spotActionRowsFromMapNextRow(mapSpotActions),
      spotGoogleMapsUrl: NV_SPOT_GOOGLE_MAP_URLS[i],
    }
  })
}

function hotelCardToPlace(card: (typeof northVietnamHotelCards)[number], index: number): NorthVietnamMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`northvietnam/hotels: missing lat/lng for ${card.title}`)
  }
  return {
    id: `nv-hotel-${index + 1}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    hotelActions: card.actions,
  }
}

export const northVietnamMapPlaces: NorthVietnamMapPlace[] = [
  ...ticketCardsToSpots(),
  ...northVietnamFreeMapPlaces,
  ...northVietnamFoodMapPlaces,
  ...northVietnamHotelCards.map(hotelCardToPlace),
]
