import type { MapPlace } from '@/lib/mapPlace'
import { fujiHotelCards } from '@/data/fuji/hotels'

export const FUJI_MAP_CENTER = { lat: 35.5112, lng: 138.7630 }

function hotelCardToPlace(card: (typeof fujiHotelCards)[number], index: number): MapPlace {
  const lat = card.lat
  const lng = card.lng
  if (lat === undefined || lng === undefined) {
    throw new Error(`fuji/hotels: missing lat/lng for ${card.title}`)
  }
  return {
    id: `fuji-hotel-${index + 1}`,
    category: 'hotel',
    name: card.title,
    description: card.meta,
    lat,
    lng,
    hotelActions: card.actions,
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
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20133-fuji-q-highland-e-ticket?cid=22312', className: 'btn primary', event: 'fujimap_highland_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/95879-fujiq-highland-admission-ticket/?aid=93798', className: 'btn', event: 'fujimap_highland_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujiyoshida/fuji-q-highland-90440/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_highland_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/kGBPMZTBuMfB69b17',
    mapButtonMapEvent: 'fujimap_highland_map',
  },
  {
    id: 'fuji-ropeway',
    category: 'spot',
    name: '纜車｜河口湖',
    description: '天上山公園纜車，可俯瞰整個河口湖與富士山全景。',
    lat: 35.5040321,
    lng: 138.7720895,
    spotActions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/89462-mt-fuji-panoramic-ropeway-round-trip-ticket-yamanashi/?aid=93798', className: 'btn primary', event: 'fujimap_cable_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/mt-fuji-panoramic-ropeway-23487867?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_cable_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/87qi3yMZoWTcNBYy9',
    mapButtonMapEvent: 'fujimap_ropeway_map',
  },
  {
    id: 'fuji-cruise',
    category: 'spot',
    name: '遊覽船｜河口湖',
    description: '搭乘遊覽船在河口湖上欣賞富士山倒影，晴天必玩。',
    lat: 35.5037494,
    lng: 138.7705261,
    spotActions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/574488?cid=22312', className: 'btn primary', event: 'fujimap_cruise_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/lake-kawaguchiko-sightseeing-boat-appare-29874636?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_cruise_trip', platform: 'Trip', section: 'map_bar' },
    ],
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/U67YGdp5Z8SdaoRs7',
    mapButtonMapEvent: 'fujimap_cruise_map',
  },
  {
    id: 'fuji-music-forest',
    category: 'spot',
    name: '音樂森林美術館',
    description: '河口湖畔的歐式音樂博物館，可聆聽自動演奏樂器與欣賞富士山景。',
    lat: 35.5224188,
    lng: 138.768715,
    spotActions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138288-yamanashi-kawaguchiko-music-forest-museum-admission-ticket?cid=22312', className: 'btn primary', event: 'fujimap_musicforest_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/85583-kawaguchiko-music-forest-museum-admission-admission-yamanashi/?aid=93798', className: 'btn', event: 'fujimap_musicforest_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/kawaguchiko-music-forest-museum-23515819/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujimap_musicforest_trip', platform: 'Trip', section: 'map_bar' },
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
  },
  {
    id: 'fuji-mountain',
    category: 'free',
    name: '富士山',
    description: '',
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
