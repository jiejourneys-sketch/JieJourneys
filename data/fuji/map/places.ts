import type { MapPlace } from '@/lib/mapPlace'
import { fujiHotelCards } from '@/data/fuji/hotels'

export const FUJI_MAP_CENTER = { lat: 35.5112, lng: 138.7630 }

function eventSlug(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function mapActionPlatform(action: NonNullable<MapPlace['hotelActions']>[number]): string {
  const platform = eventSlug(action.platform || action.label || 'link')
  return platform === 'maps' ? 'map' : platform
}

function fujiHotelSlugFromAction(action: NonNullable<MapPlace['hotelActions']>[number]): string {
  const platform = mapActionPlatform(action)
  const event = action.event?.trim() ?? ''
  const match = event.match(new RegExp(`^fujihotel_(.+)_${platform}$`))
  return match?.[1] ?? eventSlug(event || action.label)
}

function hotelCardToPlace(card: (typeof fujiHotelCards)[number], index: number): MapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`fuji/hotels: missing lat/lng for ${card.title}`)
  }
  const mapAction = card.actions.find((action) => action.platform === 'Maps')
  const hotelActions = card.actions
    .filter((action) => action.platform !== 'Maps')
    .map((action) => ({
      ...action,
      mapEvent: `fujimap_hotel_${fujiHotelSlugFromAction(action)}_${mapActionPlatform(action)}`,
      mapSection: 'map_bar',
    }))
  const hotelSlug = mapAction
    ? fujiHotelSlugFromAction(mapAction)
    : hotelActions[0]
      ? fujiHotelSlugFromAction(hotelActions[0])
      : eventSlug(card.title)

  return {
    id: `fuji-hotel-${index + 1}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    spotGoogleMapsUrl: mapAction?.href,
    mapButtonMapEvent: `fujimap_hotel_${hotelSlug}_map`,
    hotelActions,
  }
}

const fujiTicketSpots: MapPlace[] = [
  {
    id: 'fuji-highland',
    category: 'spot',
    name: '富士急樂園',
    description: '日本最刺激的主題樂園之一，富士山腳下的極速體驗。',
    lat: 35.4869467,
    lng: 138.7805511,
    spotActions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20133-fuji-q-highland-e-ticket?cid=22312', className: 'btn primary', event: 'fujimap_ticket_highland_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/95879-fujiq-highland-admission-ticket/?aid=93798', className: 'btn', event: 'fujimap_ticket_highland_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujiyoshida/fuji-q-highland-90440/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_ticket_highland_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/kGBPMZTBuMfB69b17',
    mapButtonMapEvent: 'fujimap_highland_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%AF%8C%E5%A3%AB%E6%80%A5%E6%A8%82%E5%9C%92&from=map&place=fuji-highland#ticketListTitle',
  },
  {
    id: 'fuji-ropeway',
    category: 'spot',
    name: '纜車｜河口湖',
    description: '天上山公園纜車，可俯瞰整個河口湖與富士山全景。',
    lat: 35.5040321,
    lng: 138.7720895,
    spotActions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/89462-mt-fuji-panoramic-ropeway-round-trip-ticket-yamanashi/?aid=93798', className: 'btn primary', event: 'fujimap_ticket_cable_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/mt-fuji-panoramic-ropeway-23487867?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_ticket_cable_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/87qi3yMZoWTcNBYy9',
    mapButtonMapEvent: 'fujimap_ropeway_map',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B2%B3%E5%8F%A3%E6%B9%96%E7%BA%9C%E8%BB%8A&from=map&place=fuji-ropeway#ticketListTitle',
  },
  {
    id: 'fuji-cruise',
    category: 'spot',
    name: '遊覽船｜河口湖',
    description: '搭乘遊覽船在河口湖上欣賞富士山倒影，晴天必玩。',
    lat: 35.5037494,
    lng: 138.7705261,
    spotActions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/574488?cid=22312', className: 'btn primary', event: 'fujimap_ticket_cruise_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/lake-kawaguchiko-sightseeing-boat-appare-29874636?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_ticket_cruise_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/U67YGdp5Z8SdaoRs7',
    mapButtonMapEvent: 'fujimap_cruise_map',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B2%B3%E5%8F%A3%E6%B9%96%E9%81%8A%E8%A6%BD%E8%88%B9&from=map&place=fuji-cruise#ticketListTitle',
  },
  {
    id: 'fuji-music-forest',
    category: 'spot',
    name: '音樂森林美術館',
    description: '河口湖畔的歐式音樂博物館，可聆聽自動演奏樂器與欣賞富士山景。',
    lat: 35.5224188,
    lng: 138.768715,
    spotActions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138288-yamanashi-kawaguchiko-music-forest-museum-admission-ticket?cid=22312', className: 'btn primary', event: 'fujimap_ticket_music_forest_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/85583-kawaguchiko-music-forest-museum-admission-admission-yamanashi/?aid=93798', className: 'btn', event: 'fujimap_ticket_music_forest_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/kawaguchiko-music-forest-museum-23515819/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_ticket_music_forest_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/jCyTHDetG8jtZP9p7',
    mapButtonMapEvent: 'fujimap_musicforest_map',
  },
]

const fujiFreeSpots: MapPlace[] = [
  {
    id: 'fuji-oishi-park',
    category: 'free',
    name: '大石公園',
    description: '河口湖北岸花田，可正面欣賞富士山，春天薰衣草、秋天楓葉最美。',
    lat: 35.522904,
    lng: 138.7457522,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Z8T4gZGsJ1ZsNazq7',
    mapButtonMapEvent: 'fujimap_oishipark_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%A4%A7%E7%9F%B3%E5%85%AC%E5%9C%92&from=map&place=fuji-oishi-park#ticketListTitle',
  },
  {
    id: 'fuji-oshino-hakkai',
    category: 'free',
    name: '忍野八海',
    description: '富士山雪融湧出的八處清澈泉水，世界遺產構成資産，拍照打卡必去。',
    lat: 35.4600675,
    lng: 138.8324741,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/x3YTUfRV2CrNKTaM6',
    mapButtonMapEvent: 'fujimap_oshinohakkai_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%BF%8D%E9%87%8E%E5%85%AB%E6%B5%B7&from=map&place=fuji-oshino-hakkai#ticketListTitle',
  },
  {
    id: 'fuji-yamanakako',
    category: 'free',
    name: '山中湖',
    description: '富士五湖中面積最大的湖泊，天晴時可看到富士山倒影，適合散步悠遊。',
    lat: 35.4270454,
    lng: 138.8711827,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/2FNDwSYyAYc4tkBLA',
    mapButtonMapEvent: 'fujimap_yamanakako_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%B1%B1%E4%B8%AD%E6%B9%96&from=map&place=fuji-yamanakako#ticketListTitle',
  },
  {
    id: 'fuji-saiko',
    category: 'free',
    name: '西湖｜療癒之里根場',
    description: '富士五湖之一，療癒之里根場有傳統茅草屋聚落，適合拍富士山與日式村落景色。',
    lat: 35.505,
    lng: 138.66167,
    spotGoogleMapsUrl: 'https://www.google.com/maps?q=35.505,138.66167',
    mapButtonMapEvent: 'fujimap_saiko_map',
    relatedTicketHref: '/fuji/ticket?tag=%E8%A5%BF%E6%B9%96&from=map&place=fuji-saiko#ticketListTitle',
  },
  {
    id: 'fuji-5th-station',
    category: 'free',
    name: '富士山五合目',
    description: '富士山半山腰的代表性觀景點，也是許多登山與一日遊行程的停靠站。',
    lat: 35.394282,
    lng: 138.733089,
    spotGoogleMapsUrl: 'https://www.google.com/maps?q=35.394282,138.733089',
    mapButtonMapEvent: 'fujimap_5thstation_map',
    relatedTicketHref: '/fuji/ticket?tag=%E4%BA%94%E5%90%88%E7%9B%AE&from=map&place=fuji-5th-station#ticketListTitle',
  },
  {
    id: 'fuji-sengen-park',
    category: 'free',
    name: '新倉山淺間公園',
    description: '富士吉田著名的賞富士山視角，五重塔＋富士山的構圖是日本代表性風景。',
    lat: 35.5013908,
    lng: 138.8016313,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/hXNs1UMa8EB6yhw48',
    mapButtonMapEvent: 'fujimap_sengenpark_map',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B7%BA%E9%96%93%E5%85%AC%E5%9C%92&from=map&place=fuji-sengen-park#ticketListTitle',
  },
  {
    id: 'fuji-hikawa-tokei',
    category: 'free',
    name: '日川時計店',
    description: '河口湖站附近的老字號時計店，與富士山同框的打卡名景，許多旅人必訪。',
    lat: 35.492682,
    lng: 138.804085,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/8EqhjHPNiamWyGTeA',
    mapButtonMapEvent: 'fujimap_hikawatokei_map',
    relatedTicketHref: '/fuji/ticket?tag=%E6%97%A5%E5%B7%9D%E6%99%82%E8%A8%88&from=map&place=fuji-hikawa-tokei#ticketListTitle',
  },
  {
    id: 'fuji-lawson',
    category: 'free',
    name: 'Lawson｜富士山打卡',
    description: '全日本最有名的 Lawson，背景就是富士山，是河口湖最熱門的打卡地點。',
    lat: 35.4986175,
    lng: 138.7671672,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/RcxRDArwsz14sVbn8',
    mapButtonMapEvent: 'fujimap_lawson_map',
    relatedTicketHref: '/fuji/ticket?tag=Lawson&from=map&place=fuji-lawson#ticketListTitle',
  },
  {
    id: 'fuji-gotemba-outlet',
    category: 'free',
    name: '御殿場 Premium Outlet',
    description: '日本最大的戶外 Outlet，從河口湖開車約 40 分鐘，許多一日遊行程順路帶到。',
    lat: 35.307271,
    lng: 138.9656467,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/88YtonXq7HbDSbGA9',
    mapButtonMapEvent: 'fujimap_gotembaoutlet_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%BE%A1%E6%AE%BF%E5%A0%B4Outlet&from=map&place=fuji-gotemba-outlet#ticketListTitle',
  },
  {
    id: 'fuji-hakone-shrine',
    category: 'free',
    name: '箱根神社',
    description: '蘆之湖畔的代表神社，湖上鳥居是箱根最經典的拍照畫面之一。',
    lat: 35.2048263,
    lng: 139.0253782,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/buZB2a1wFE5cVygb9',
    mapButtonMapEvent: 'fujimap_hakoneshrine_map',
    relatedTicketHref: '/fuji/ticket?tag=%E7%AE%B1%E6%A0%B9%E7%A5%9E%E7%A4%BE&from=map&place=fuji-hakone-shrine#ticketListTitle',
  },
  {
    id: 'fuji-hakone-ropeway',
    category: 'free',
    name: '箱根纜車',
    description: '連接早雲山、大涌谷與桃源台，可俯瞰火山地形，天氣好時也能遠望富士山。',
    lat: 35.2444273,
    lng: 139.0150413,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/SmPGLo1Tm5nJm1bD9',
    mapButtonMapEvent: 'fujimap_hakoneropeway_map',
    relatedTicketHref: '/fuji/ticket?tag=%E7%AE%B1%E6%A0%B9%E7%BA%9C%E8%BB%8A&from=map&place=fuji-hakone-ropeway#ticketListTitle',
  },
  {
    id: 'fuji-owakudani',
    category: 'free',
    name: '大涌谷',
    description: '箱根火山地貌代表景點，可看硫磺煙霧與山谷景觀，也是箱根纜車熱門停靠站。',
    lat: 35.2436011,
    lng: 139.0197304,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/9q1za4Eux43tALNy5',
    mapButtonMapEvent: 'fujimap_owakudani_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%A4%A7%E6%B6%8C%E8%B0%B7&from=map&place=fuji-owakudani#ticketListTitle',
  },
  {
    id: 'fuji-lake-ashi',
    category: 'free',
    name: '蘆之湖',
    description: '箱根火山湖，常與箱根神社、海賊船、纜車一起安排，晴天可遠望富士山。',
    lat: 35.2095674,
    lng: 139.0034626!,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Eh77DVGk2nweHvmm9',
    mapButtonMapEvent: 'fujimap_lakeashi_map',
    relatedTicketHref: '/fuji/ticket?tag=%E8%98%86%E4%B9%8B%E6%B9%96&from=map&place=fuji-lake-ashi#ticketListTitle',
  },
  {
    id: 'fuji-hakone-pirate-ship',
    category: 'free',
    name: '箱根海賊船',
    description: '行駛於蘆之湖上的觀光船，常串聯桃源台港、元箱根港與箱根町港。',
    lat: 35.1899925,
    lng: 139.0245259,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/QCo6kAjVi4ubAGhcA',
    mapButtonMapEvent: 'fujimap_hakonepirateship_map',
    relatedTicketHref: '/fuji/ticket?tag=%E7%AE%B1%E6%A0%B9%E6%B5%B7%E8%B3%8A%E8%88%B9&from=map&place=fuji-hakone-pirate-ship#ticketListTitle',
  },
  {
    id: 'fuji-enoshima',
    category: 'free',
    name: '江之島',
    description: '湘南海岸外的小島，常與鎌倉、箱根或富士山一日遊搭配，適合看海景與夕陽。',
    lat: 35.2990992,
    lng: 139.4809269,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/CRCXzNrScMJ3d2EEA',
    mapButtonMapEvent: 'fujimap_enoshima_map',
    relatedTicketHref: '/fuji/ticket?tag=%E6%B1%9F%E4%B9%8B%E5%B3%B6&from=map&place=fuji-enoshima#ticketListTitle',
  },
  {
    id: 'fuji-kawagoe',
    category: 'free',
    name: '川越',
    description: '有小江戶之稱的古街區，保留藏造老屋、鐘樓與商店街，常與富士山行程搭配。',
    lat: 35.9229715,
    lng: 139.4831524,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/dUnvECMZwrbt984M6',
    mapButtonMapEvent: 'fujimap_kawagoe_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%B7%9D%E8%B6%8A&from=map&place=fuji-kawagoe#ticketListTitle',
  },
  {
    id: 'fuji-safari-park',
    category: 'free',
    name: '富士野生動物園',
    description: '富士山南麓的野生動物園，可搭園內巴士或自駕進入 Safari 區近距離看動物。',
    lat: 35.2589772,
    lng: 138.8116172,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/htZ5B2gvowNXZVTYA',
    mapButtonMapEvent: 'fujimap_safaripark_map',
    relatedTicketHref: '/fuji/ticket?tag=%E5%AF%8C%E5%A3%AB%E9%87%8E%E7%94%9F%E5%8B%95%E7%89%A9%E5%9C%92&from=map&place=fuji-safari-park#ticketListTitle',
  },
  {
    id: 'fuji-mountain',
    category: 'free',
    name: '富士山',
    description: '日本最高峰，也是富士五湖、箱根與御殿場一帶最重要的景觀核心。',
    lat: 35.3606255,
    lng: 138.7273634,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/itAKgiDV3QvXoALp7',
    mapButtonMapEvent: 'fujimap_mountain_map',
  },
]

export const fujiMapPlaces: MapPlace[] = [
  ...fujiTicketSpots,
  ...fujiFreeSpots,
  ...fujiHotelCards.map(hotelCardToPlace),
]
