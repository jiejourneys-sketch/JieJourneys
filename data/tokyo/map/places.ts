/**
 * 東京地圖：景點由 `../tickets` 組裝（排除一日遊行程票、無固定東京釘點票）＋ `spotExtraActions`；
 * 免費景點見 Free／Shop；住宿見 `../hotels`。
 * 一日遊行程票不顯示為個別地圖釘點，改以 free.ts 景點的 relatedTicketHref 串接。
 */
import type { CityCardAction } from '@/components/CityTabbedList'
import { tokyoShopMapPlaces } from '@/data/tokyo/shop'
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

export const TOKYO_MAP_CENTER = { lat: 35.676, lng: 139.742 }

/** 地圖不顯示：無固定釘點者（一日遊行程票由 tag 查詢）。 */
const EXCLUDE_FROM_MAP = new Set<string>()

/** 票券標題 → 地圖 ID */
const TOKYO_SPOT_ID: Record<string, string> = {
  'SHIBUYA SKY': 'shibuya-sky',
  '晴空塔': 'tokyo-skytree',
  '六本木展望台': 'roppongi-hills',
  '東京鐵塔': 'tokyo-tower',
  '東京迪士尼': 'tokyo-disneyland',
  '哈利波特影城': 'harry-potter-tokyo',
  '吉卜力公園': 'ghibli-park',
  '東京雙層觀光巴士': 'tokyo-sightseeing-bus',
  'TeamLab Planets': 'teamlab-planets',
  'TeamLab Borderless': 'teamlab-borderless',
  '便便博物館': 'unko-museum',
  '新宿御苑': 'shinjuku-gardens',
  '迷你世界博物館': 'small-worlds-tokyo',
  '樂高樂園': 'legoland-discovery-odaiba',
  '三麗鷗彩虹樂園': 'sanrio-puroland',
  '墨田水族館': 'sumida-aquarium',
  '東京銀座藝術水族館': 'ginza-art-aquarium',
  '東京品川水族館': 'maxell-aqua-park-shinagawa',
  '池袋陽光水族館': 'sunshine-aquarium',
}

/**
 * 票券標題 → 建物／入口參考座標（可依 Google 釘選微調）
 */
const TOKYO_SPOT_GEO: Record<string, { lat: number; lng: number }> = {
  'SHIBUYA SKY': { lat: 35.6586719, lng: 139.7019848 },
  '晴空塔': { lat: 35.7100627, lng: 139.8107004 },
  '六本木展望台': { lat: 35.6600712, lng: 139.7292907 },
  '東京鐵塔': { lat: 35.6585805, lng: 139.7454329 },
  '東京迪士尼': { lat: 35.6328964, lng: 139.8803943 },
  '哈利波特影城': { lat: 35.745183, lng: 139.6460909 },
  '吉卜力公園': { lat: 35.6961, lng: 139.5704 }, // 三鷹の森ジブリ美術館（東京都三鷹市）
  '東京雙層觀光巴士': { lat: 35.6816, lng: 139.7672 }, // 東京站丸之內出口（主要乘車處）
  'TeamLab Planets': { lat: 35.6491207, lng: 139.7897739 },
  'TeamLab Borderless': { lat: 35.6620689, lng: 139.7432671 },
  '便便博物館': { lat: 35.6255273, lng: 139.776413 },
  '新宿御苑': { lat: 35.6851763, lng: 139.7100517 },
  '迷你世界博物館': { lat: 35.6379228, lng: 139.7883556 },
  '樂高樂園': { lat: 35.6288365, lng: 139.776083 },
  '三麗鷗彩虹樂園': { lat: 35.624512, lng: 139.429293 },
  '墨田水族館': { lat: 35.7099301, lng: 139.8095855 },
  '東京銀座藝術水族館': { lat: 35.6713698, lng: 139.7657375 },
  '東京品川水族館': { lat: 35.6282839, lng: 139.7352393 },
  '池袋陽光水族館': { lat: 35.7289254, lng: 139.7201573 },
}

/**
 * 景點「地圖」按鈕連結：依標題填入 `https://maps.app.goo.gl/...`。
 * 含 `PASTE_YOUR_MAPS_LINK` 時地圖元件改用 lat、lng 釘點。**勿改 lat/lng。**
 */
const TOKYO_SPOT_GOOGLE_MAP_URLS: Record<string, string> = {
  'SHIBUYA SKY': 'https://maps.app.goo.gl/UhTEtJqB9rCA8Xn98',
  '晴空塔': 'https://maps.app.goo.gl/NDgjtaiVmkzW4JrRA',
  '六本木展望台': 'https://maps.app.goo.gl/WRQVFFu4gHZ9vwso9',
  '東京鐵塔': 'https://maps.app.goo.gl/HX6VfiTaST9q98FM6',
  '東京迪士尼': 'https://maps.app.goo.gl/yCFoFGKh2i1KK54E8',
  '哈利波特影城': 'https://maps.app.goo.gl/z9SERjRGv83LujwXA',
  '吉卜力公園': 'PASTE_YOUR_MAPS_LINK',
  '東京雙層觀光巴士': 'PASTE_YOUR_MAPS_LINK',
  'TeamLab Planets': 'https://maps.app.goo.gl/zSigJXUbaPPWm62x6',
  'TeamLab Borderless': 'https://maps.app.goo.gl/zQqv9CXg6P3KtMsh7',
  '便便博物館': 'https://maps.app.goo.gl/Va4ydgMCCskN8y4AA',
  '新宿御苑': 'https://maps.app.goo.gl/QoPnKUm52tGjej6f7',
  '迷你世界博物館': 'https://maps.app.goo.gl/HR1K6GuTaRz8uKPw9',
  '樂高樂園': 'https://maps.app.goo.gl/LTKhYmpyqXSSWxkd8',
  '三麗鷗彩虹樂園': 'https://maps.app.goo.gl/yVFcM5RQhguDCeb37',
  '墨田水族館': 'https://maps.app.goo.gl/8dRCam93cYCPdFt59',
  '東京銀座藝術水族館': 'https://maps.app.goo.gl/gt3vGioUfiabRNMz8',
  '東京品川水族館': 'https://maps.app.goo.gl/xjnKwpRU8mY8AceKA',
  '池袋陽光水族館': 'https://maps.app.goo.gl/zTLjycncsN3zHKkj8',
}

const TOKYO_SPOT_DESCRIPTION_BY_ID: Record<string, string> = {
  'shibuya-sky': '澀谷最高人氣展望台，可俯瞰十字路口、代代木公園與東京市景，日落時段尤其熱門。',
  'tokyo-skytree': '東京代表性地標，高度與視野都很有震撼感，晴天可遠眺富士山，適合安排淺草、押上同區行程。',
  'roppongi-hills': '六本木高樓觀景台，可欣賞東京鐵塔與都心夜景，適合和六本木、美術館、東京中城一起安排。',
  'tokyo-tower': '東京經典紅白鐵塔，位置靠近芝公園與增上寺，適合第一次東京自由行或夜景行程。',
  'tokyo-disneyland': '東京迪士尼度假區門票，適合安排一整天遊玩，購票前可先確認入園日期與園區種類。',
  'harry-potter-tokyo': '哈利波特影城東京，展示電影場景、服裝與互動體驗，館內停留時間通常需要抓半天以上。',
  'ghibli-park': '吉卜力相關票券與行程，適合喜歡動畫場景、展覽與主題空間的旅人，交通和入場規則建議先確認。',
  'tokyo-sightseeing-bus': '東京市區觀光巴士，適合想用較輕鬆方式串起主要景點，或安排剛抵達東京的快速導覽。',
  'teamlab-planets': '豐洲沉浸式數位藝術展，需赤腳進入多個互動空間，適合拍照與體驗型行程。',
  'teamlab-borderless': '麻布台 Hills 的沉浸式藝術展，作品會在空間中流動變化，適合安排六本木、東京鐵塔周邊行程。',
  'unko-museum': '台場室內主題展，以繽紛互動裝置為主，適合親子、朋友或雨天備案。',
  'shinjuku-gardens': '新宿大型庭園，四季景色都很適合散步，春天賞櫻、秋天看楓葉都很受歡迎。',
  'small-worlds-tokyo': '有明室內微縮模型主題館，展示機場、城市與動畫場景，適合親子或雨天行程。',
  'legoland-discovery-odaiba': '台場室內樂高樂園，主打親子互動、積木遊戲與迷你東京模型，適合帶小朋友安排半日遊。',
  'sanrio-puroland': '三麗鷗角色主題樂園，位在多摩中心，適合喜歡 Hello Kitty、布丁狗與角色表演的旅人。',
  'sumida-aquarium': '晴空塔旁的室內水族館，可和東京晴空塔、押上商場一起安排，雨天也很好用。',
  'ginza-art-aquarium': '銀座室內金魚藝術展，燈光與水槽設計很有拍照感，適合和銀座逛街排在一起。',
  'maxell-aqua-park-shinagawa': '品川站旁的室內水族館，交通方便，海豚表演和燈光效果是主要亮點。',
  'sunshine-aquarium': '池袋 Sunshine City 樓上的水族館，以都市高空水族館為特色，適合和池袋逛街一起安排。',
}

function tokyoRelatedTicketHref(tag: string, placeId: string): string {
  return `/tokyo/ticket?tag=${encodeURIComponent(tag)}&from=map&place=${encodeURIComponent(placeId)}#ticketListTitle`
}

function eventSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function mapActionPlatform(action: CityCardAction): string {
  const platform = eventSlug(action.platform || action.label || 'link')
  return platform === 'maps' ? 'map' : platform
}

function mapArticleHref(href: string): string {
  const url = new URL(href, 'https://www.jiejourneys.com')
  url.searchParams.set('from', 'map')
  return `${url.pathname}${url.search}${url.hash}`
}

function tokyoMapTicketAction(action: CityCardAction, placeId: string): CityCardAction {
  const platform = mapActionPlatform(action)
  const ticketSlug = action.event?.match(new RegExp(`^tokyoticket_(.+)_${platform}$`))?.[1] ?? eventSlug(placeId)
  return {
    ...action,
    ...(platform === 'article' ? { label: '攻略', href: mapArticleHref(action.href) } : {}),
    mapEvent: `tokyomap_ticket_${ticketSlug}_${platform}`,
    mapSection: 'map_bar',
  }
}

function tokyoHotelSlugFromAction(action: CityCardAction): string {
  const platform = mapActionPlatform(action)
  const event = action.event?.trim() ?? ''
  const match = event.match(new RegExp(`^tokyohotel_(.+)_${platform}$`))
  return match?.[1] ?? eventSlug(event || action.label)
}

function tokyoMapHotelAction(action: CityCardAction): CityCardAction {
  const platform = mapActionPlatform(action)
  return {
    ...action,
    mapEvent: `tokyomap_hotel_${tokyoHotelSlugFromAction(action)}_${platform}`,
    mapSection: 'map_bar',
  }
}

/** 票券景點標題 → 一日遊 tag（目前個別景點票無對應一日遊；一日遊景點由 free.ts 的 relatedTicketHref 串接） */
const TOKYO_RELATED_TICKET_TAG_BY_SPOT_TITLE: Record<string, string> = {}

function ticketCardsToSpots(): TokyoMapPlace[] {
  const filtered = tokyoTicketCards.filter(
    (c) => c.area !== '一日遊' && !EXCLUDE_FROM_MAP.has(c.title) && TOKYO_SPOT_GEO[c.title] !== undefined,
  )
  return filtered.map((card) => {
    const geo = TOKYO_SPOT_GEO[card.title]
    const id = TOKYO_SPOT_ID[card.title]
    if (!geo || !id) throw new Error(`tokyo/map/places: 缺少座標或 id：${card.title}`)
    const mapSpotActions = [
      ...card.actions.map((action) => tokyoMapTicketAction(action, id)),
      ...(TOKYO_MAP_SPOT_EXTRA_ACTIONS[card.title] ?? []),
    ]
    const relatedTicketTag = TOKYO_RELATED_TICKET_TAG_BY_SPOT_TITLE[card.title]
    return {
      id,
      category: 'spot' as const,
      name: card.title,
      description: TOKYO_SPOT_DESCRIPTION_BY_ID[id] ?? card.area,
      lat: geo.lat,
      lng: geo.lng,
      spotActions: mapSpotActions,
      spotActionRows: spotActionRowsFromMapNextRow(mapSpotActions),
      spotGoogleMapsUrl: TOKYO_SPOT_GOOGLE_MAP_URLS[card.title],
      ...(relatedTicketTag
        ? {
            relatedTicketHref: tokyoRelatedTicketHref(relatedTicketTag, id),
            relatedTicketEvent: `tokyomap_${eventSlug(id)}_ticket`,
          }
        : {}),
    }
  })
}

function hotelCardToPlace(card: (typeof tokyoHotelCards)[number]): TokyoMapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`tokyo/hotels: missing lat/lng for ${card.title}`)
  }
  const mapAction = card.actions.find((action) => action.platform === 'Maps')
  const hotelActions = card.actions
    .filter((action) => action.platform !== 'Maps')
    .map((action) => tokyoMapHotelAction(action))
  const hotelSlug = mapAction
    ? tokyoHotelSlugFromAction(mapAction)
    : hotelActions[0]
      ? tokyoHotelSlugFromAction(hotelActions[0])
      : eventSlug(card.title)

  return {
    id: `hotel-${hotelSlug}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    spotGoogleMapsUrl: mapAction?.href,
    mapButtonMapEvent: `tokyomap_hotel_${hotelSlug}_map`,
    hotelActions,
  }
}

export const tokyoMapPlaces: TokyoMapPlace[] = [
  ...ticketCardsToSpots(),
  ...tokyoFreeMapPlaces,
  ...tokyoShopMapPlaces,
  ...tokyoHotelCards.map(hotelCardToPlace),
]
