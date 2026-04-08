/**
 * 釜山地圖：景點由 `../tickets` 組裝（排除釜山 Pass）＋ `spotNaverActions`＋ `spotVideoActions`；景點／商店見 `../free.ts`、`../food.ts`；住宿由 `../hotels`。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { busanFoodMapPlaces } from '@/data/busan/food'
import { busanFreeMapPlaces } from '@/data/busan/free'
import { busanHotelCards } from '@/data/busan/hotels'
import type { BusanMapPlace } from '@/data/busan/map/types'
import { busanTicketCards } from '@/data/busan/tickets'
import { BUSAN_MAP_SPOT_NAVER_ACTIONS } from '@/data/busan/map/spotNaverActions'
import { BUSAN_MAP_SPOT_VIDEO_ACTIONS } from '@/data/busan/map/spotVideoActions'

export type { BusanMapPlace, BusanPlaceCategory } from '@/data/busan/map/types'

export const BUSAN_MAP_CENTER = { lat: 35.1156, lng: 129.0422 }

/** 地圖不顯示：無單一實體釘點者（一日遊已改為顯示，見票券與座標表） */
const EXCLUDE_FROM_MAP = new Set(['釜山通行證(釜山Pass)'])

/** 票券標題 → 建物／入口參考座標（可再依 Google 釘選微調） */
const BUSAN_SPOT_GEO: Record<string, { lat: number; lng: number }> = {
  '釜山一日遊': { lat: 35.1731121, lng: 129.0714122 },
  '樂天世界': { lat: 35.1962453, lng: 129.2149345 },
  '斜坡滑車SkyLine Luge': { lat: 35.1940567, lng: 129.2186386 },
  '釜山 X the Sky 展望台': { lat: 35.1594862, lng: 129.1701677 },
  '汗蒸幕｜新世界SPA LAND': { lat: 35.1682338, lng: 129.1295279 },
  '松島海上纜車': { lat: 35.0763876, lng: 129.0236199 },
  '松島龍宮空中步道': { lat: 35.061897, lng: 129.022214 },
  'Running Man 體驗館': { lat: 35.1528885, lng: 129.0596857 },
  'Museum 1 ': { lat: 35.1713288, lng: 129.1289794 },
  '哲秀與英熙｜韓服體驗': { lat: 35.0973229, lng: 129.0102234 },
  '韓服體驗｜釜山甘川文化村': { lat: 35.0983995, lng: 129.010016 },
  '釜山塔': { lat: 35.1011934, lng: 129.0323676 },
  'Club D Oasis': { lat: 35.1600514, lng: 129.1684719 },
  'Hillspa': { lat: 35.1584686, lng: 129.1753048 },
  'Diamond Bay Yacht｜鑽石灣遊艇': { lat: 35.1327702, lng: 129.1166164 },
  'Yacht Holic｜水營灣遊艇': { lat: 35.146254, lng: 129.11525 },
  'Yacht G｜水營灣遊艇': { lat: 35.1609325, lng: 129.1405238 },
  'GoGo Yacht｜水營灣遊艇': { lat: 35.1604828, lng: 129.1412039 },
  'Yachtwa｜水營灣遊艇': { lat: 35.1597089, lng: 129.1409765 },
  'The Yacht｜水營灣遊艇': { lat: 35.1588654, lng: 129.1418666 },
  'Y Holic｜水營灣遊艇': { lat: 35.1610996, lng: 129.1392469 },
  'Yacht Tale｜水營灣遊艇': { lat: 35.156182, lng: 129.1520376 },
  '膠囊列車&海岸列車': { lat: 35.158284, lng: 129.1727672 },
  'SEA LIFE 釜山水族館門票': { lat: 35.1592713, lng: 129.1610038 },
  '太宗台海洋飛行主題樂園': { lat: 35.0598226, lng: 129.0716234 },
  '釜山藝術博物館': { lat: 35.0870682, lng: 129.076373 },
}

const BUSAN_SPOT_ID: Record<string, string> = {
  '釜山一日遊': 'busan-day-tour',
  '樂天世界': 'busan-lotte-world',
  '斜坡滑車SkyLine Luge': 'busan-skyline-luge',
  '釜山 X the Sky 展望台': 'busan-x-the-sky',
  '汗蒸幕｜新世界SPA LAND': 'busan-spa-land',
  '松島海上纜車': 'busan-songdo-cable',
  '松島龍宮空中步道': 'busan-songdo-skywalk',
  'Running Man 體驗館': 'busan-running-man',
  'Museum 1 ': 'busan-museum-1',
  '哲秀與英熙｜韓服體驗': 'busan-jeosoo-hanbok',
  '韓服體驗｜釜山甘川文化村': 'busan-gamcheon-hanbok',
  '釜山塔': 'busan-tower',
  'Club D Oasis': 'busan-club-d-oasis',
  'Hillspa': 'busan-hillspa',
  'Diamond Bay Yacht｜鑽石灣遊艇': 'busan-diamond-bay-yacht',
  'Yacht Holic｜水營灣遊艇': 'busan-yacht-holic',
  'Yacht G｜水營灣遊艇': 'busan-yacht-g',
  'GoGo Yacht｜水營灣遊艇': 'busan-gogo-yacht',
  'Yachtwa｜水營灣遊艇': 'busan-yachtwa',
  'The Yacht｜水營灣遊艇': 'busan-the-yacht',
  'Y Holic｜水營灣遊艇': 'busan-y-holic',
  'Yacht Tale｜水營灣遊艇': 'busan-yacht-tale',
  '膠囊列車&海岸列車': 'busan-blueline-park',
  'SEA LIFE 釜山水族館門票': 'busan-sealife',
  '太宗台海洋飛行主題樂園': 'busan-taejongdae-flying',
  '釜山藝術博物館': 'busan-arte-museum',
}

/** 依合併後 actions 的 `mapNextRow` 組地圖多排；無標記或僅一排則 undefined。 */
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

/**
 * 景點「地圖」按鈕：順序 = `busan/tickets` 排除「釜山Pass」後的順序（樂天世界 → … → 太宗台 → **最後一筆釜山一日遊**）。
 * 每行貼 `https://maps.app.goo.gl/...`（須加引號）。**勿改 lat/lng。**
 */
const BUSAN_SPOT_GOOGLE_MAP_URLS: string[] = [
  'https://maps.app.goo.gl/KpsrDFMHvghRT4SbA', // 釜山一日遊（票券順序最後一張）
  'https://maps.app.goo.gl/z77aGdoCsgS9UPNM7', // 樂天世界
  'https://maps.app.goo.gl/XxczztM93CbaixwQ6', // 斜坡滑車SkyLine Luge
  'https://maps.app.goo.gl/w3Kw2USRXYBEPRu3A', // 釜山 X the Sky 展望台
  'https://maps.app.goo.gl/Cr9QMgy3Uzy1N2dv5', // 汗蒸幕｜新世界SPA LAND
  'https://maps.app.goo.gl/FwL1ihmeVaZmW9yCA', // 松島海上纜車
  'https://maps.app.goo.gl/RCAHBMAu3cBYksrG6', // 松島龍宮空中步道
  'https://maps.app.goo.gl/xWGvGHmjhhazmXnQA', // Running Man 體驗館
  'https://maps.app.goo.gl/RKCMMMF1q42Ms5277', // Museum 1 
  'https://maps.app.goo.gl/YX6RjHJnTvvU4Tyh7', // 哲秀與英熙｜韓服體驗
  'https://maps.app.goo.gl/DEnqtJqFWw4Du4JT6', // 韓服體驗｜釜山甘川文化村
  'https://maps.app.goo.gl/QMviSwJn8W85UEwa6', // 釜山塔
  'https://maps.app.goo.gl/woi34j4htv9YDFH49', // Club D Oasis
  'https://maps.app.goo.gl/jb5NqNsVd4mRcYGg9', // Hillspa
  'https://maps.app.goo.gl/qL8tHTjDAgRpXswx8', // Diamond Bay Yacht｜鑽石灣遊艇
  'https://maps.app.goo.gl/vTBbr6NQuqgVJMeu7', // Yacht Holic｜水營灣遊艇
  'https://maps.app.goo.gl/b4wXDdxvo2Se1zL47', // Yacht G｜水營灣遊艇
  'https://maps.app.goo.gl/KT1v6jgEeKkdSwVW6', // GoGo Yacht｜水營灣遊艇
  'https://maps.app.goo.gl/2FDz9u1ay9ug5wSC9', // Yachtwa｜水營灣遊艇
  'https://maps.app.goo.gl/9sDpTou5d4FLERcA8', // The Yacht｜水營灣遊艇
  'https://maps.app.goo.gl/ELCF8dSAqzCwwktS7', // Y Holic｜水營灣遊艇
  'https://maps.app.goo.gl/fwUnSUfbjmxMo1zF9', // Yacht Tale｜水營灣遊艇
  'https://maps.app.goo.gl/rLq2iLrxXCpk3qkMA', // 膠囊列車&海岸列車
  'https://maps.app.goo.gl/4cMpbSza55dPWLQt6', // SEA LIFE 釜山水族館門票
  'https://maps.app.goo.gl/AQPVqVZoPCGKs2Kp9', // 太宗台海洋飛行主題樂園
  'https://maps.app.goo.gl/Fopr6TrA4y5y2eJ68', // 釜山藝術博物館
]

function ticketCardsToSpots(): BusanMapPlace[] {
  const filtered = busanTicketCards.filter((c) => !EXCLUDE_FROM_MAP.has(c.title))
  if (filtered.length !== BUSAN_SPOT_GOOGLE_MAP_URLS.length) {
    throw new Error('busan/map/places: BUSAN_SPOT_GOOGLE_MAP_URLS 筆數須與地圖景點數相同')
  }
  return filtered.map((card, i) => {
    const geo = BUSAN_SPOT_GEO[card.title]
    const id = BUSAN_SPOT_ID[card.title]
    if (!geo || !id) {
      throw new Error(`busan/map/places: 缺少座標或 id：${card.title}`)
    }
    const mapSpotActions = [
      ...card.actions,
      ...(BUSAN_MAP_SPOT_NAVER_ACTIONS[card.title] ?? []),
      ...(BUSAN_MAP_SPOT_VIDEO_ACTIONS[card.title] ?? []),
    ]
    return {
      id,
      category: 'spot',
      name: card.title,
      description: card.meta,
      lat: geo.lat,
      lng: geo.lng,
      spotActions: mapSpotActions,
      spotActionRows: spotActionRowsFromMapNextRow(mapSpotActions),
      spotGoogleMapsUrl: BUSAN_SPOT_GOOGLE_MAP_URLS[i],
    }
  })
}

function hotelCardToPlace(card: (typeof busanHotelCards)[number], index: number): BusanMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`busan/hotels: missing lat/lng for ${card.title}`)
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
  ...busanFreeMapPlaces,
  ...busanFoodMapPlaces,
  ...busanHotelCards.map(hotelCardToPlace),
]
