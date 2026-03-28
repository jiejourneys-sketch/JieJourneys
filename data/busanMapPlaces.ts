/**
 * 釜山地圖：景點與 /busan/ticket 同步（排除無單一釘點之 Pass／一日遊）；住宿與 busanHotels 同步。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { busanHotelCards } from '@/data/busanHotels'
import { busanTicketCards } from '@/data/busanTicketCards'

export type BusanPlaceCategory = 'spot' | 'hotel'

export type BusanMapPlace = {
  id: string
  category: BusanPlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  hotelActions?: CityCardAction[]
}

export const BUSAN_MAP_CENTER = { lat: 35.1156, lng: 129.0422 }

const EXCLUDE_FROM_MAP = new Set(['釜山通行證(釜山Pass)', '釜山一日遊'])

/** 票券標題 → 建物／入口參考座標（可再依 Google 釘選微調） */
const BUSAN_SPOT_GEO: Record<string, { lat: number; lng: number }> = {
  樂天世界: { lat: 35.1962453, lng: 129.2149345 },
  '斜坡滑車SkyLine Luge': { lat: 35.1940567, lng: 129.2186386 },
  '釜山 X the Sky 展望台': { lat: 35.1594862, lng: 129.1701677 },
  '汗蒸幕｜新世界SPA LAND': { lat: 35.1682338, lng: 129.1295279 },
  松島海上纜車: { lat: 35.0763876, lng: 129.0236199 },
  '韓服體驗｜釜山甘川文化村': { lat: 35.0983995, lng: 129.010016 },
  釜山塔: { lat: 35.1011934, lng: 129.0323676 },
  '膠囊列車&海岸列車': { lat: 35.158284, lng: 129.1727672 },
  'Diamond Bay Yacht｜鑽石灣遊艇': { lat: 35.1327702, lng: 129.1166164 },
  'Yacht Holic｜水營灣遊艇': { lat: 35.1604828, lng: 129.1412039 },
  'Yacht G｜水營灣遊艇': { lat: 35.1609325, lng: 129.1405238 },
  'GoGo Yacht｜水營灣遊艇': { lat: 35.1604828, lng: 129.1412039 },
  'Yachtwa｜水營灣遊艇': { lat: 35.1597089, lng: 129.1409765 },
  'The Yacht｜水營灣遊艇': { lat: 35.1588654, lng: 129.1418666 },
  'Y Holic｜水營灣遊艇': { lat: 35.1610996, lng: 129.1392469 },
  'Yacht Tale｜水營灣遊艇': { lat: 35.156182, lng: 129.1520376 },
  'SEA LIFE 釜山水族館門票': { lat: 35.1592713, lng: 129.1610038 },
  太宗台海洋飛行主題樂園: { lat: 35.0598226, lng: 129.0716234 },
}

const BUSAN_SPOT_ID: Record<string, string> = {
  樂天世界: 'busan-lotte-world',
  '斜坡滑車SkyLine Luge': 'busan-skyline-luge',
  '釜山 X the Sky 展望台': 'busan-x-the-sky',
  '汗蒸幕｜新世界SPA LAND': 'busan-spa-land',
  松島海上纜車: 'busan-songdo-cable',
  '韓服體驗｜釜山甘川文化村': 'busan-gamcheon-hanbok',
  釜山塔: 'busan-tower',
  '膠囊列車&海岸列車': 'busan-blueline-park',
  'Diamond Bay Yacht｜鑽石灣遊艇': 'busan-diamond-bay-yacht',
  'Yacht Holic｜水營灣遊艇': 'busan-yacht-holic',
  'Yacht G｜水營灣遊艇': 'busan-yacht-g',
  'GoGo Yacht｜水營灣遊艇': 'busan-gogo-yacht',
  'Yachtwa｜水營灣遊艇': 'busan-yachtwa',
  'The Yacht｜水營灣遊艇': 'busan-the-yacht',
  'Y Holic｜水營灣遊艇': 'busan-y-holic',
  'Yacht Tale｜水營灣遊艇': 'busan-yacht-tale',
  'SEA LIFE 釜山水族館門票': 'busan-sealife',
  太宗台海洋飛行主題樂園: 'busan-taejongdae-flying',
}

function ticketCardsToSpots(): BusanMapPlace[] {
  return busanTicketCards
    .filter((c) => !EXCLUDE_FROM_MAP.has(c.title))
    .map((card) => {
      const geo = BUSAN_SPOT_GEO[card.title]
      const id = BUSAN_SPOT_ID[card.title]
      if (!geo || !id) {
        throw new Error(`busanMapPlaces: 缺少座標或 id：${card.title}`)
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

function hotelCardToPlace(card: (typeof busanHotelCards)[number], index: number): BusanMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`busanHotels: missing lat/lng for ${card.title}`)
  }
  return {
    id: `busan-hotel-${index + 1}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    hotelActions: card.actions,
  }
}

export const busanMapPlaces: BusanMapPlace[] = [
  ...ticketCardsToSpots(),
  ...busanHotelCards.map(hotelCardToPlace),
]
