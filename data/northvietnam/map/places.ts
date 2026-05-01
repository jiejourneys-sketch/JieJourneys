import type { CityCardAction } from '@/components/CityTabbedList'
import { northVietnamFoodMapPlaces } from '@/data/northvietnam/food'
import { northVietnamFreeMapPlaces } from '@/data/northvietnam/free'
import { northVietnamHotelCards } from '@/data/northvietnam/hotels'
import type { NorthVietnamMapPlace } from '@/data/northvietnam/map/types'
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

function makeSpot(
  id: string,
  name: string,
  description: string,
  lat: number,
  lng: number,
  buyActions: CityCardAction[],
  spotGoogleMapsUrl: string,
  mapButtonMapEvent: string,
  relatedTicketTag?: string,
): NorthVietnamMapPlace {
  const extraActions = NORTH_VIETNAM_MAP_SPOT_EXTRA_ACTIONS[name] ?? []
  const allActions = [...buyActions, ...extraActions]
  return {
    id,
    category: 'spot',
    name,
    description,
    lat,
    lng,
    spotActions: allActions,
    spotActionRows: spotActionRowsFromMapNextRow(allActions),
    spotGoogleMapsUrl,
    mapButtonMapEvent,
    ...(relatedTicketTag
      ? {
          relatedTicketHref: `/northvietnam/ticket?tag=${encodeURIComponent(relatedTicketTag)}&from=map&place=${encodeURIComponent(id)}#ticketListTitle`,
          relatedTicketLabel: '含此景點的行程',
          relatedTicketEvent: `northvietnammap_${id}_ticket`,
        }
      : {}),
  }
}

const NV_FREE_PLACE_ORDER = [
  'northvietnam-TrainStreet',
  'northvietnam-HoanKiemLake',
  'northvietnam-YushanShrine',
  'northvietnam-HoChiMinhMausoleum',
  'northvietnam-HoChiMinhMuseum',
  'northvietnam-Church',
  'northvietnam-TempleOfLiterature',
  'northvietnam-ZhenGuoTemple',
  'northvietnam-EthnologyMuseum',
  'northvietnam-WomenMuseum',
  'northvietnam-PrisonMuseum',
  'northvietnam-ImperialCity',
  'northvietnam-LongBienBridge',
  'northvietnam-WestLake',
  'northvietnam-CeramicMosaicRoad',
  'northvietnam-DongXuanMarket',
  'northvietnam-IncenseVillage',
  'northvietnam-HatMakingExperience',
  'northvietnam-BatTrangPotteryVillage',
  'northvietnam-GrandWorld',
  'northvietnam-ThirtySixStreet',
  'northvietnam-OperaHouse',
  'northvietnam-CatCat',
  'northvietnam-MoanaSapa',
  'northvietnam-SapaAlpineCoaster',
  'northvietnam-SilverWaterfall',
  'northvietnam-HeavenGate',
  'northvietnam-YLinhHoLaoChaiTaVan',
  'northvietnam-SapaPlaza',
]

function orderPlacesById<T extends { id: string }>(places: T[], order: readonly string[]): T[] {
  const orderMap = new Map(order.map((id, index) => [id, index]))
  return [...places].sort((a, b) => (orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER))
}

const nvFreeMapPlaces = orderPlacesById(northVietnamFreeMapPlaces, NV_FREE_PLACE_ORDER)
const nvTicketSpots: NorthVietnamMapPlace[] = [
  // ── 河內 ──────────────────────────────────────────────────
  makeSpot(
    'nv-water-puppet', '水上木偶秀',
    '千年歷史的越南傳統民俗藝術，在水上表演的木偶戲，是河內必看演出。',
    21.0316826, 105.8533466,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/129554-hanoi-water-puppet-show-express-pass-vietnam?cid=22312', className: 'btn primary', event: 'northvietnammap_waterpuppet_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/35653-thang-long-water-puppet-show-ticket-hanoi/?aid=93798', className: 'btn', event: 'northvietnammap_waterpuppet_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/PYKeekdGoQkEGJu67',
    'northvietnammap_waterpuppet_map',
  ),
  makeSpot(
    'nv-la-belle-spa', 'La Belle Spa按摩',
    '河內知名按摩Spa，提供越式傳統按摩，交通方便。',
    21.0327469, 105.8504278,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/32025-ha-noi-la-belle-spa-message-voucher/?cid=22312', className: 'btn primary', event: 'northvietnammap_labelle_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18679-la-belle-spa-hanoi-halong-bay/?aid=93798', className: 'btn', event: 'northvietnammap_labelle_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/F6P6zLfHxkWkUr8R9',
    'northvietnammap_labelle_map',
  ),
  makeSpot(
    'nv-lotte-deck', '樂天觀景台',
    '樂天酒店高樓觀景台，俯瞰整個河內市景，晴天可遠眺西湖。',
    21.0321022, 105.8126712,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/23559-ha-noi-lotte-observation-deck-transparent-skywalk-ticket?cid=22312', className: 'btn primary', event: 'northvietnammap_lottedeck_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/22529-lotte-observation-deck-ticket-hanoi/?aid=93798', className: 'btn', event: 'northvietnammap_lottedeck_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/cz5JWjzdgufHqSzBA',
    'northvietnammap_lottedeck_map',
  ),
  makeSpot(
    'nv-lotte-aqua', '樂天世界水族館',
    '位在河內樂天大廈的大型水族館，適合親子同遊。',
    21.0759777, 105.8129133,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/163666-vinvonders-hanoi-congviennuoc?cid=22312', className: 'btn primary', event: 'northvietnammap_lotteaqua_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109708-ha-noi-lotte-world-aquarium/?aid=93798', className: 'btn', event: 'northvietnammap_lotteaqua_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/mk6ZQWbz3gX2nq7d7',
    'northvietnammap_lotteaqua_map',
  ),
  // ── 沙壩 ──────────────────────────────────────────────────
  makeSpot(
    'nv-fansipan', '番西邦峰',
    '東南亞最高峰，搭纜車直達山頂欣賞雲海與梯田，是沙壩必訪地標。',
    22.3033333, 103.775,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/36100-sapa-sunworld-fansipan-legend-cable-car-ticket?cid=22312', className: 'btn primary', event: 'northvietnammap_fansipan_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/11904-fansipan-cable-car-ticket-transfers-sapa/?aid=93798', className: 'btn', event: 'northvietnammap_fansipan_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/tt-sa-pa/sun-world-fansipan-legend-130369464?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5784662', className: 'btn', event: 'northvietnammap_fansipan_trip', platform: 'Trip', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/JCkYRfe12yyMtFiN9',
    'northvietnammap_fansipan_map',
    '番西邦峰',
  ),
  makeSpot(
    'nv-glass-bridge', '玻璃天空步道',
    '沙壩高空玻璃橋，踩在透明橋面上俯瞰山谷梯田，視覺衝擊強烈。',
    22.3723777, 103.7575047,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/139366-rong-may-sapa-glass-bridge-ticket-vietnam?cid=22312', className: 'btn primary', event: 'northvietnammap_glassbr_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/57672-rong-may-sapa-glass-bridge-ticket/?aid=93798', className: 'btn', event: 'northvietnammap_glassbr_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/97861270?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5784662', className: 'btn', event: 'northvietnammap_glassbr_trip', platform: 'Trip', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/4M7UAjoV2rQqTos77',
    'northvietnammap_glassbr_map',
    '玻璃天空步道',
  ),
  // ── 下龍灣 ──────────────────────────────────────────────────
  makeSpot(
    'nv-cruise-premium', '頂級郵輪｜2日遊、6星級',
    '下龍灣最高規格郵輪，兩天一夜含鐘乳石洞、划船、自助餐等全套行程。',
    20.9167672, 106.9918762,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/284294?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_premium_kkday', platform: 'KKDAY', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/BLAuP7LbevvNL4yn9',
    'northvietnammap_halong_premium_map',
  ),
  makeSpot(
    'nv-cruise-alisa', 'Alisa Premier Cruise｜2日遊、5星級',
    '下龍灣 Alisa Premier 豪華郵輪，兩天一夜欣賞海灣風景與船上設施。',
    20.9220339, 106.9838349,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/98369-ha-long-bay-alisa-premier-luxury-cruise/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_alisa_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/E6MjUuku7PqJDe1h7',
    'northvietnammap_halong_alisa_map',
  ),
  makeSpot(
    'nv-cruise-athena', 'Athena Cruise｜2日遊、5星級',
    '下龍灣 Athena 豪華郵輪，兩天一夜行程，設備與服務均受旅客好評。',
    20.9529719, 107.0560726,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/146313?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_athena_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/45689-ha-long-bay-athena-luxury-cruise/?aid=93798', className: 'btn', event: 'northvietnammap_halong_athena_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/nfsF24rnwjsZtWMXA',
    'northvietnammap_halong_athena_map',
  ),
  makeSpot(
    'nv-cruise-hermes', 'Hermes Cruise｜2日遊、5星級',
    '下龍灣 Hermes 豪華郵輪，兩天一夜遊覽海灣、洞穴與島嶼。',
    20.9230625, 106.9820625,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/144473?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_hermes_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/39304-2d1n-ha-long-bay-hermes-cruise-tour/?aid=93798', className: 'btn', event: 'northvietnammap_halong_hermes_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/cgdnzCmavUQ6Bjyc7',
    'northvietnammap_halong_hermes_map',
  ),
  makeSpot(
    'nv-cruise-aqua', 'Aqua Elegance｜2日遊、5星級',
    '下龍灣精品郵輪，兩天一夜深度探索下龍灣石灰岩島嶼。',
    20.9269935, 106.9824404,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/131806-ha-long-bay-aqua-elegance-luxury-cruise/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_aqua_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/wnssvbkcMqqB3Cqj9',
    'northvietnammap_halong_aqua_map',
  ),
  makeSpot(
    'nv-cruise-ambassador', 'Ambassador Cruise｜1日遊、5星級',
    '下龍灣 Ambassador 一日遊郵輪，輕鬆探索下龍灣的熱門選擇。',
    20.9536861, 107.055974,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/36086-halong-bay-cruise-tour-hanoi/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_ambassador_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/19SaKeRXvCeNnKTg6',
    'northvietnammap_halong_ambassador_map',
  ),
  makeSpot(
    'nv-cruise-cozy-bay', 'Cozy Bay Premium Cruise｜1日遊、5星級',
    '下龍灣 Cozy Bay Premium 一日遊郵輪，適合從河內出發當天往返。',
    20.9184752, 106.9855222,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/137889-halong-bay-day-tour-by-cozy-bay-premium-cruise-vietnam?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_cozy_bay_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/34034-ha-long-bay-half-day-trip/?aid=93798', className: 'btn', event: 'northvietnammap_halong_cozy_bay_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/BatAZcgZ9wMewaLYA',
    'northvietnammap_halong_cozy_bay_map',
  ),
  makeSpot(
    'nv-cruise-diamond-era', 'Diamond Era Cruise｜1日遊、5星級',
    '下龍灣 Diamond Era 一日遊郵輪，搭配海灣景觀與船上餐食體驗。',
    20.92314, 106.9906558,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/563476?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_diamond_era_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/55771-ha-long-bay-diamond-era-day-cruise/?aid=93798', className: 'btn', event: 'northvietnammap_halong_diamond_era_klook', platform: 'KLOOK', section: 'map_bar' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/103256169/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16391314', className: 'btn', event: 'northvietnammap_halong_diamond_era_trip', platform: 'Trip', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/ARLaTSxgm4vpCsf3A',
    'northvietnammap_halong_diamond_era_map',
  ),
  makeSpot(
    'nv-cruise-olympus', 'Olympus Day Cruise｜1日遊、5星級',
    '下龍灣 Olympus 豪華一日遊郵輪。',
    20.9224804, 106.9907306,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133081-ha-long-bay-day-tour-olympus-luxury-cruise/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_olympus_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/hUWhpYTDKdrJdh679',
    'northvietnammap_halong_olympus_map',
  ),
  makeSpot(
    'nv-cruise-hercules', 'Hercules Premium Cruise｜1日遊、5星級',
    '下龍灣 Hercules Premium 一日遊郵輪，適合安排精華海灣行程。',
    20.9224804, 106.9907306,
    [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/152722?cid=22312', className: 'btn primary', event: 'northvietnammap_halong_hercules_kkday', platform: 'KKDAY', section: 'map_bar' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/123414-ha-long-bay-day-hercules-premium-cruise/?aid=93798', className: 'btn', event: 'northvietnammap_halong_hercules_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/Bqd4hryNaJmfdv4m7',
    'northvietnammap_halong_hercules_map',
  ),
  makeSpot(
    'nv-cruise-reina', 'Reina Day Cruise｜1日遊、3星級',
    '下龍灣 Reina 一日遊郵輪，走經典下龍灣精華路線。',
    20.9254518, 106.9821941,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/13066-luon-cave-titop-island-full-day-tour-hanoi-halong-bay/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_reina_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/8Y56gDKuYeQLQXDQA',
    'northvietnammap_halong_reina_map',
  ),
  makeSpot(
    'nv-cruise-dragonfly', 'Dragonfly Cruise｜1日遊、3星級',
    '下龍灣 Dragonfly 一日遊郵輪，適合初次體驗下龍灣。',
    20.9224804, 106.9907306,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/7448-halong-bay-day-tour-hanoi-halong-bay/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_dragonfly_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/Xa9JKYFVTTjF6CVv9',
    'northvietnammap_halong_dragonfly_map',
  ),
  makeSpot(
    'nv-cruise-phoenix', 'Phoenix Cruise｜1日遊、3星級',
    '下龍灣 Phoenix 一日遊郵輪，經典海灣巡航行程。',
    20.9224804, 106.9907306,
    [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1176-halong-bay-day-trip-hanoi/?aid=93798', className: 'btn primary', event: 'northvietnammap_halong_phoenix_klook', platform: 'KLOOK', section: 'map_bar' },
    ],
    'https://maps.app.goo.gl/Xa9JKYFVTTjF6CVv9',
    'northvietnammap_halong_phoenix_map',
  ),
  // ── 陸龍灣 ──────────────────────────────────────────────────
  makeSpot(
    'nv-ninhbinh-hoa-lu', '華閭古都',
    '陸龍灣代表性古都遺址，常和三谷、長安、舞洞一起安排一日遊。',
    20.2843154, 105.9083607,
    [],
    'https://maps.app.goo.gl/8iAU4QWomcsRj96o7',
    'northvietnammap_ninhbinh_hoa_lu_map',
    '華閭古都',
  ),
  makeSpot(
    'nv-ninhbinh-tam-coc', '三谷',
    '陸龍灣小船路線之一，沿河穿越山水與稻田景觀。',
    20.2163242, 105.9374664,
    [],
    'https://maps.app.goo.gl/62Nir68Z22qV3zUG6',
    'northvietnammap_ninhbinh_tam_coc_map',
    '三谷',
  ),
  makeSpot(
    'nv-ninhbinh-trang-an', '長安',
    '陸龍灣經典小船路線，穿梭石灰岩山、水道與洞穴。',
    20.2531292, 105.918861,
    [],
    'https://maps.app.goo.gl/HFxtKgAk7BjWJWmM9',
    'northvietnammap_ninhbinh_trang_an_map',
    '長安',
  ),
  makeSpot(
    'nv-ninhbinh-mua-cave', '舞洞',
    '陸龍灣熱門登高景點，爬上山頂可俯瞰三谷與寧平山水。',
    20.2310125, 105.9377969,
    [],
    'https://maps.app.goo.gl/MN5YgRN3aZGabQj67',
    'northvietnammap_ninhbinh_mua_cave_map',
    '舞洞',
  ),
  makeSpot(
    'nv-ninhbinh-bai-dinh', '白亭寺',
    '寧平大型佛教寺院群，常與長安、舞洞組成陸龍灣一日遊。',
    20.2758964, 105.8657699,
    [],
    'https://maps.app.goo.gl/eggKDmDzq2fuDx2W8',
    'northvietnammap_ninhbinh_bai_dinh_map',
    '白亭寺',
  ),

]

export const northVietnamMapPlaces: NorthVietnamMapPlace[] = [
  ...nvTicketSpots,
  ...nvFreeMapPlaces,
  ...northVietnamFoodMapPlaces,
  ...northVietnamHotelCards.map(hotelCardToPlace),
]
