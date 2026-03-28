/**
 * 越南北越地圖：景點與 /northvietnam/ticket 同步；住宿與 northVietnamHotels 同步。
 * 票券列標題需與 northVietnamTicketCards.title 完全一致；座標可依 Google 釘選微調。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { northVietnamHotelCards } from '@/data/northVietnamHotels'
import { northVietnamTicketCards } from '@/data/northVietnamTicketCards'

export type NorthVietnamPlaceCategory = 'spot' | 'hotel'

export type NorthVietnamMapPlace = {
  id: string
  category: NorthVietnamPlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  hotelActions?: CityCardAction[]
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

function ticketCardsToSpots(): NorthVietnamMapPlace[] {
  return northVietnamTicketCards.map((card) => {
    const geo = NV_SPOT_GEO[card.title]
    const id = NV_SPOT_ID[card.title]
    if (!geo || !id) {
      throw new Error(`northVietnamMapPlaces: 缺少座標或 id：${card.title}`)
    }
    return {
      id,
      category: 'spot',
      name: card.title,
      description: `${card.meta}｜與票券頁相同連結`,
      lat: geo.lat,
      lng: geo.lng,
      spotActions: card.actions,
    }
  })
}

function hotelCardToPlace(card: (typeof northVietnamHotelCards)[number], index: number): NorthVietnamMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`northVietnamHotels: missing lat/lng for ${card.title}`)
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
  ...northVietnamHotelCards.map(hotelCardToPlace),
]
