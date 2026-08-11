import type { CityCardAction } from '@/components/CityTabbedList'
import {
  osakaAdditionalHotelMapPlaceBySlug,
  osakaAdditionalHotelSlugs,
} from '@/data/osaka/hotel'
import { osakaShopMapPlaces } from '@/data/osaka/shop'
import { osakaPassMapPlaces } from '@/data/osaka/pass-map/places'
import type { MapPlace } from '@/lib/mapPlace'

export const OSAKA_MAP_CENTER = { lat: 34.735, lng: 135.555 }

const ticketPlatforms = ['KKDAY', 'KLOOK', 'Trip'] as const

type TicketActionInput = {
  label: (typeof ticketPlatforms)[number]
  href: string
  event: string
}

type TicketPlaceInput = {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  mapUrl?: string
  actions: TicketActionInput[]
  relatedTicketTag?: string
}

type SpotPlaceInput = {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  mapUrl?: string
  actions?: TicketActionInput[]
  relatedTicketTag?: string
  passMapPlaceId?: string
}

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function osakaRelatedTicketHref(tag: string, placeId: string): string {
  return `/osaka/ticket?tag=${encodeURIComponent(tag)}&from=map&place=${encodeURIComponent(placeId)}#ticketListTitle`
}

function osakaPassMapHref(placeId: string): string {
  return `/osaka/pass-map?place=${encodeURIComponent(placeId)}`
}

function ticketActions(actions: TicketActionInput[]): CityCardAction[] {
  return actions.map((action, index) => ({
    ...action,
    className: index === 0 ? 'btn primary' : 'btn',
    platform: action.label,
    section: 'map_bar',
  }))
}

function passMapAction(placeId: string, event: string): CityCardAction {
  return {
    label: '周遊券地圖',
    href: osakaPassMapHref(placeId),
    className: 'btn',
    event,
    platform: 'pass-map',
    section: 'map_bar',
  }
}

function ticketPlaceToMapPlace(place: TicketPlaceInput): MapPlace {
  return {
    id: place.id,
    category: 'spot',
    name: place.name,
    description: place.description,
    lat: place.lat,
    lng: place.lng,
    spotActions: ticketActions(place.actions),
    spotGoogleMapsUrl: place.mapUrl ?? googleMapsSearchUrl(place.name),
    mapButtonMapEvent: `osakamap_${place.id.replace(/-/g, '_')}_map`,
    ...(place.relatedTicketTag
      ? {
          relatedTicketHref: osakaRelatedTicketHref(place.relatedTicketTag, place.id),
          relatedTicketEvent: `osakamap_${place.id.replace(/-/g, '_')}_ticket`,
        }
      : {}),
  }
}

function spotPlaceToMapPlace(place: SpotPlaceInput): MapPlace {
  const actions = [
    ...(place.actions ? ticketActions(place.actions) : []),
    ...(place.passMapPlaceId ? [passMapAction(place.passMapPlaceId, `osakamap_${place.id.replace(/-/g, '_')}_passmap`)] : []),
  ]

  return {
    id: place.id,
    category: 'free',
    name: place.name,
    description: place.description,
    lat: place.lat,
    lng: place.lng,
    spotGoogleMapsUrl: place.mapUrl ?? googleMapsSearchUrl(place.name),
    mapButtonMapEvent: `osakamap_${place.id.replace(/-/g, '_')}_map`,
    spotActions: actions.length ? actions : undefined,
    ...(place.relatedTicketTag
      ? {
          relatedTicketHref: osakaRelatedTicketHref(place.relatedTicketTag, place.id),
          relatedTicketEvent: `osakamap_${place.id.replace(/-/g, '_')}_ticket`,
        }
      : {}),
  }
}

function osakaPassMapMainName(name: string): string {
  return name
    .replace(/\s+(?:原)?\d+(?:[.,]\d+)?元(?:\/\d+(?:[.,]\d+)?元)?(?:[（(][^）)]*[）)])?$/u, '')
    .replace(/\s+折\d+(?:[.,]\d+)?元(?:[（(][^）)]*[）)])?$/u, '')
    .replace(/\s+打\d+折(?:[（(][^）)]*[）)])?$/u, '')
    .replace(/\s+送.+$/u, '')
    .replace(/\s+[（(][^）)]*(?:元|折|視情況|原|送|付)[^）)]*[）)]$/u, '')
    .trim()
}

const OSAKA_PASS_MAIN_DESCRIPTIONS: Record<string, string> = {
  'osaka-pass-free-tsutenkaku-dive-walk': '周遊券免費景點｜通天閣的戶外高空體驗，可從新世界地標上方感受大阪街景。',
  'osaka-pass-free-umeda-sky-building': '周遊券免費景點｜梅田代表展望台，適合安排傍晚或夜景時段俯瞰大阪市區。',
  'osaka-pass-free-dotonbori-sightseeing-boat': '周遊券免費景點｜從道頓堀河面欣賞招牌與商圈夜景，是難波散步路線的經典體驗。',
  'osaka-pass-free-wonder-cruise': '周遊券免費景點｜道頓堀周邊的小型觀光遊船，適合把水上視角排進市區行程。',
  'osaka-pass-free-aqualiner': '周遊券免費景點｜大阪市區河川遊船，可從水上串起大阪城、中之島一帶景色。',
  'osaka-pass-free-santa-maria': '周遊券免費景點｜大阪港區觀光帆船，可和海遊館、天保山一帶安排在同一天。',
  'osaka-pass-free-osaka-castle-gozabune': '周遊券免費景點｜大阪城護城河遊船，能近距離欣賞石垣與天守閣周邊景色。',
  'osaka-pass-free-captain-line': '周遊券免費景點｜連接大阪港與環球影城周邊的船線，適合港區移動與順遊。',
  'osaka-pass-free-hachikenya-hama-pier': '周遊券免費景點｜大川沿岸碼頭，適合銜接中之島、大阪城水岸散步。',
  'osaka-pass-free-okawa-sakura-cruise': '周遊券免費景點｜春季熱門賞櫻遊船，可從河面欣賞大川兩岸景色。',
  'osaka-pass-free-kinutani-koji-sky-art-museum': '周遊券免費景點｜梅田藍天大廈內的美術館，適合搭配空中庭園一起安排。',
  'osaka-pass-free-glion-museum': '周遊券免費景點｜大阪港紅磚倉庫旁的經典車款博物館，適合喜歡復古車與拍照的人。',
  'osaka-pass-free-tsutenkaku-observatory': '周遊券免費景點｜新世界代表地標展望台，可俯瞰大阪南區街景。',
  'osaka-pass-free-osaka-castle': '周遊券免費景點｜大阪代表城郭景點，可看天守閣展示與市區景色。',
  'osaka-pass-free-sakishima-cosmo-tower': '周遊券免費景點｜大阪灣區高樓展望台，視野開闊，適合看港灣與城市景色。',
  'osaka-pass-free-osaka-wheel': '周遊券免費景點｜萬博、EXPOCITY 一帶的大型摩天輪，可俯瞰北大阪景色。',
  'osaka-pass-free-tower-slider': '周遊券免費景點｜通天閣旁的滑梯體驗，適合和新世界散步一起安排。',
  'osaka-pass-free-shinsekai-zaza-comedy': '周遊券免費景點｜新世界小劇場演出，可感受大阪在地娛樂氣氛。',
  'osaka-pass-free-kaiyodo-figure-museum': '周遊券免費景點｜大阪城周邊的公仔展示館，適合動漫與模型收藏愛好者。',
  'osaka-pass-free-tempozan-ferris-wheel': '周遊券免費景點｜大阪港旁的大摩天輪，可順遊海遊館與天保山市場街。',
  'osaka-pass-free-hep-five-ferris-wheel': '周遊券免費景點｜梅田商圈地標摩天輪，適合購物途中順路看市區景色。',
  'osaka-pass-free-shitennoji': '周遊券免費景點｜大阪歷史悠久的寺院，可看五重塔、庭園與傳統建築。',
  'osaka-pass-free-yagura-special-opening': '周遊券免費景點｜大阪城內的城郭建築公開點，適合喜歡城郭史與古蹟的人。',
  'osaka-pass-free-kamigata-ukiyoe-museum': '周遊券免費景點｜難波附近的浮世繪展示館，適合把傳統藝術排進市區散步。',
  'osaka-pass-free-osaka-museum-of-housing-and-living': '周遊券免費景點｜重現大阪昔日街景與生活樣貌的室內博物館，雨天也好安排。',
  'osaka-pass-free-osaka-history-museum': '周遊券免費景點｜用展覽串起大阪從古代到近代的城市故事，可和大阪城同區安排。',
  'osaka-pass-free-osaka-entrepreneurial-museum': '周遊券免費景點｜介紹大阪企業家與商業發展的博物館，適合想看城市產業脈絡的人。',
  'osaka-pass-free-tennoji-zoo': '周遊券免費景點｜天王寺公園旁的市立動物園，適合親子與半日市區行程。',
  'osaka-pass-free-sakuya-konohana-kan': '周遊券免費景點｜鶴見綠地內的大型溫室花園，可看各式植物與花卉展示。',
  'osaka-pass-free-osaka-city-museum-of-fine-arts': '周遊券免費景點｜天王寺公園內的美術館，適合搭配動物園、慶澤園一起走。',
  'osaka-pass-free-national-museum-of-art': '周遊券免費景點｜中之島美術館區的現代藝術場館，適合喜歡展覽與建築的人。',
  'osaka-pass-free-keitakuen-garden': '周遊券免費景點｜天王寺公園內的日式庭園，適合安靜散步與拍照。',
  'osaka-pass-free-osaka-museum-of-natural-history': '周遊券免費景點｜長居公園內的自然史博物館，適合親子與自然科學主題行程。',
  'osaka-pass-free-nagai-botanical-garden': '周遊券免費景點｜長居公園的大型植物園，適合花季散步與戶外行程。',
  'osaka-pass-free-sakai-risho-no-mori': '周遊券免費景點｜堺市文化與茶道歷史設施，適合安排大阪南部半日遊。',
  'osaka-pass-free-osaka-international-peace-center': '周遊券免費景點｜大阪城公園周邊的和平主題展示館，可和歷史景點一起安排。',
  'osaka-pass-free-nishinomaru-garden': '周遊券免費景點｜大阪城旁的開闊庭園，春季賞櫻尤其受歡迎。',
  'osaka-pass-free-sakai-city-museum': '周遊券免費景點｜大仙公園內的博物館，可了解堺市歷史與古墳文化。',
  'osaka-pass-free-expo-commemorative-park': '周遊券免費景點｜大阪萬博紀念地的大型公園，適合戶外散步與親子行程。',
  'osaka-pass-discount-legoland-discovery-center': '周遊券優惠景點｜天保山商場內的樂高室內樂園，適合親子與雨天行程。',
  'osaka-pass-discount-ninja-trick-house': '周遊券優惠景點｜道頓堀附近的忍者主題體驗館，適合安排短時間互動體驗。',
  'osaka-pass-discount-nakanoshima-river-cruise': '周遊券優惠景點｜中之島水上觀光船，可從河面欣賞大阪市中心建築景色。',
  'osaka-pass-discount-solaniwa-onsen': '周遊券優惠景點｜大阪灣區大型溫泉設施，適合安排放鬆休息的半日行程。',
  'osaka-pass-discount-spa-world': '周遊券優惠景點｜新世界旁的大型溫泉娛樂設施，可和通天閣、天王寺一起排。',
  'osaka-pass-discount-nani-wonder-bus': '周遊券優惠景點｜大阪市區觀光巴士，適合想用輕鬆方式看城市街景的人。',
  'osaka-pass-discount-harukas-300': '周遊券優惠景點｜阿倍野高樓展望台，可俯瞰天王寺與大阪市區景色。',
  'osaka-pass-discount-yamamoto-noh-theater': '周遊券優惠景點｜大阪傳統能樂劇場，適合想加入文化體驗的旅人。',
  'osaka-pass-discount-osaka-castle-road-train': '周遊券優惠景點｜大阪城公園內移動工具，適合想輕鬆串起園區景點的人。',
  'osaka-pass-discount-dotonbori-ferris-wheel': '周遊券優惠景點｜道頓堀地標摩天輪，可從商圈上方看大阪南區夜景。',
  'osaka-pass-discount-amagasaki-castle': '周遊券優惠景點｜尼崎市的城郭景點，適合從大阪往神戶方向順遊。',
  'osaka-pass-discount-natural-history-special-exhibition': '周遊券優惠景點｜長居自然史博物館的特別展，可和長居公園一起安排。',
  'osaka-pass-discount-osaka-hyakusei-xr': '周遊券優惠景點｜大阪生活今昔館相關 XR 體驗，適合喜歡城市歷史互動內容的人。',
  'osaka-pass-discount-nifrel': '周遊券優惠景點｜萬博紀念公園旁的水族館與生態展示設施，適合親子行程。',
  'osaka-pass-discount-abeno-harukas-art-museum': '周遊券優惠景點｜阿倍野 Harukas 內的美術館，可搭配展望台與天王寺商圈安排。',
}

function osakaPassMapMainDescription(place: MapPlace): string {
  return OSAKA_PASS_MAIN_DESCRIPTIONS[place.id] ?? place.description
}

const osakaPassTicketPlaces: MapPlace[] = osakaPassMapPlaces
  .filter((place) => place.category === 'spot' || place.category === 'free')
  .map((place) => ({
    id: place.id,
    category: 'spot',
    name: osakaPassMapMainName(place.name),
    description: osakaPassMapMainDescription(place),
    lat: place.lat,
    lng: place.lng,
    spotGoogleMapsUrl: place.spotGoogleMapsUrl,
    spotActions: place.spotActions,
    mapButtonMapEvent: place.mapButtonMapEvent,
    mapButtonLabel: place.mapButtonLabel,
    relatedArticleHref: place.relatedArticleHref?.replace('from=pass-map', 'from=map'),
    relatedArticleLabel: place.relatedArticleLabel,
    relatedArticleEvent: place.relatedArticleEvent?.replace('osakapassmap_', 'osakamap_'),
  }))

const osakaTicketPlaces: TicketPlaceInput[] = [
  {
    id: 'osaka-usj',
    name: '日本環球影城',
    description: '大阪最熱門主題樂園，門票與快速通關需另外購買。',
    lat: 34.665676,
    lng: 135.432318,
    mapUrl: 'https://maps.app.goo.gl/oehPiqYHqoJBpx8m6',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2247-universal-studios-japan-ticket-osaka?cid=22312', event: 'osakamap_ticket_usj_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/192375-universal-studios-japan-super-value-combo/?aid=93798', event: 'osakamap_ticket_usj_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/universal-studios-japan-81012?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', event: 'osakamap_ticket_usj_trip' },
    ],
  },
  {
    id: 'osaka-usj-express',
    name: '快速通關｜日本環球影城',
    description: 'USJ 熱門設施快速通關票，適合想壓縮排隊時間的行程。',
    lat: 34.665676,
    lng: 135.432318,
    mapUrl: 'https://maps.app.goo.gl/oehPiqYHqoJBpx8m6',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka?cid=22312', event: 'osakamap_ticket_usj_express_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3407-universal-studios-japan-express-pass-osaka/?aid=93798', event: 'osakamap_ticket_usj_express_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/universal-studios-japan-81012?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', event: 'osakamap_ticket_usj_express_trip' },
    ],
  },
  {
    id: 'osaka-kaiyukan',
    name: '大阪海遊館',
    description: '大阪灣區代表水族館，可順遊天保山摩天輪與港區景點。',
    lat: 34.654518,
    lng: 135.428964,
    mapUrl: 'https://maps.app.goo.gl/srJh1D9DVqCQttFF6',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4849-osaka-aquarium-kaiyukan-ticket?cid=22312', event: 'osakamap_ticket_kaiyukan_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/598-osaka-aquarium-kaiyukan-japan/?aid=93798', event: 'osakamap_ticket_kaiyukan_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/osaka-aquarium-kaiyukan-85082?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', event: 'osakamap_ticket_kaiyukan_trip' },
    ],
  },
  {
    id: 'osaka-hirakata-park',
    name: '大阪枚方公園',
    description: '大阪近郊老牌遊樂園，適合親子或想安排輕鬆遊樂園行程的人。',
    lat: 34.8059896,
    lng: 135.6392002,
    mapUrl: 'https://maps.app.goo.gl/h89oTmcG2dPiSVs86',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/267933-hirakata-park-osaka-ticket?cid=22312', event: 'osakamap_ticket_hirakata_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/49191-hirakata-park/?aid=93798', event: 'osakamap_ticket_hirakata_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/hirakata/hirakata-park-33116025?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', event: 'osakamap_ticket_hirakata_trip' },
    ],
  },
  {
    id: 'osaka-kids-plaza',
    name: '大阪兒童樂園',
    description: '室內親子景點，雨天或帶小孩旅行時很好排進市區行程。',
    lat: 34.7045728,
    lng: 135.5104418,
    mapUrl: 'https://maps.app.goo.gl/LzvvU58irQXXbpnP8',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/29583-kids-plaza-osaka-admission-ticket-japan?cid=22312', event: 'osakamap_ticket_kids_plaza_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/37845-kids-plaza-osaka-admission-ticket/?aid=93798', event: 'osakamap_ticket_kids_plaza_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/kids-plaza-osaka-22950750?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', event: 'osakamap_ticket_kids_plaza_trip' },
    ],
  },
  {
    id: 'osaka-miracle-world',
    name: 'Miracle World主題樂園',
    description: '大阪市區內的體驗型主題景點，可依行程空檔安排。',
    lat: 34.6655422,
    lng: 135.5033892,
    mapUrl: 'https://maps.app.goo.gl/Tu1qVuHwuYhbxm5z7',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/569796?cid=22312', event: 'osakamap_ticket_miracle_world_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/190774-osaka-miracleworld-admission-pass/?aid=93798', event: 'osakamap_ticket_miracle_world_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/osaka/miracle-world-osaka-153503047/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', event: 'osakamap_ticket_miracle_world_trip' },
    ],
  },
  {
    id: 'osaka-nijigen-no-mori',
    name: '火影忍者｜二次元之森',
    description: '淡路島動漫主題園區，適合包車或順路安排神戶、淡路島路線。',
    lat: 34.575579,
    lng: 135.0046027,
    mapUrl: 'https://maps.app.goo.gl/9Xuad6CQh8rnQ3MG8',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/119625-awaji-island-anime-theme-park-naruto-boruto-village-admission-ticket-japan?cid=22312', event: 'osakamap_ticket_nijigen_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/121686-nijigen-no-mori/?aid=93798', event: 'osakamap_ticket_nijigen_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/awaji-city/nijigen-no-mori-141964023/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', event: 'osakamap_ticket_nijigen_trip' },
    ],
  },
  {
    id: 'osaka-katsuoji',
    name: '箕面勝尾寺',
    description: '大阪近郊達摩寺院，一日遊常與京都或宇治路線搭配。',
    lat: 34.8657752,
    lng: 135.491087,
    mapUrl: 'https://maps.app.goo.gl/iYwdfnQimdaFVM1w8',
    relatedTicketTag: '勝尾寺',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/573710?cid=22312', event: 'osakamap_ticket_katsuoji_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/145411-osaka-katsuo-ji-temple/?aid=93798', event: 'osakamap_ticket_katsuoji_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/minoh/katsuo-ji-13456016?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16477085', event: 'osakamap_ticket_katsuoji_trip' },
    ],
  },
  {
    id: 'osaka-senshu-onsen',
    name: '天然溫泉泉州｜關西機場',
    description: '關西機場附近溫泉，適合回程前後銜接休息。',
    lat: 34.4148462,
    lng: 135.2981337,
    mapUrl: 'https://maps.app.goo.gl/H16vkz7x9A31zxa6A',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/263445?cid=22312', event: 'osakamap_ticket_senshu_onsen_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/50890-senshu-onsen-in-aqua-ignis-kansai-airport/?aid=93798', event: 'osakamap_ticket_senshu_onsen_klook' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/izumisano/natural-hot-spring-senshu-no-yu-kansai-airport-144941951/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252', event: 'osakamap_ticket_senshu_onsen_trip' },
    ],
  },
  {
    id: 'osaka-keisei-rose-garden',
    name: '千葉京成玫瑰園',
    description: '票券頁保留的關東花園景點，先放入票券地圖供你後續調整。',
    lat: 35.7311182,
    lng: 140.0865384,
    mapUrl: 'https://maps.app.goo.gl/7iUTxtqsVvap5XeZ9',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/284299?cid=22312', event: 'osakamap_ticket_keisei_rose_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/116025-keisei-rose-garden/?aid=93798', event: 'osakamap_ticket_keisei_rose_klook' },
    ],
  },
]

const osakaSpotPlaces: SpotPlaceInput[] = [
  {
    id: 'osaka-dotonbori',
    name: '道頓堀',
    description: '大阪自由行最常排的夜景與美食區，適合和心齋橋、難波一起安排。',
    lat: 34.6687234,
    lng: 135.5012971,
    mapUrl: 'https://maps.app.goo.gl/h53tpL2h2aXczQTS6',
  },
  {
    id: 'osaka-shinsaibashi',
    name: '心齋橋',
    description: '大阪市區購物主軸，適合排在難波、道頓堀同一天。',
    lat: 34.6724248,
    lng: 135.5010362,
    mapUrl: 'https://maps.app.goo.gl/MUzaku8HPqPYCh47A',
  },
  {
    id: 'osaka-kuromon-market',
    name: '黑門市場',
    description: '難波附近市場街區，適合安排早午餐或順路逛街。',
    lat: 34.6653529,
    lng: 135.5062406,
    mapUrl: 'https://maps.app.goo.gl/eDFM6a4xpmfNu1or5',
  },
  {
    id: 'osaka-shinsekai-hondori',
    name: '新世界本通商店街',
    description: '新世界通天閣周邊的商店街，適合串炸、美食與復古街景散步。',
    lat: 34.6516013,
    lng: 135.5059562,
    mapUrl: 'https://maps.app.goo.gl/fBvNQbRBciobV1216',
  },
  {
    id: 'osaka-nanyodori-shotengai',
    name: '南陽通商店街',
    description: '新世界到動物園前一帶的在地商店街，也常被安排成新世界散步路線。',
    lat: 34.6492448,
    lng: 135.5059526,
    mapUrl: 'https://maps.app.goo.gl/2rGg95eBnTCDkcrM8',
  },
  {
    id: 'osaka-nipponbashi-denki-gai',
    name: '日本橋電器街',
    description: '大阪的電器與動漫模型商圈，適合和難波、黑門市場同一天安排。',
    lat: 34.6604299,
    lng: 135.5058817,
    mapUrl: 'https://maps.app.goo.gl/sZKvvPH79UowEh677',
  },
  {
    id: 'osaka-namba-yasaka-shrine',
    name: '難波八阪神社',
    description: '以巨大獅子殿聞名的難波神社，從難波商圈步行就能順路抵達。',
    lat: 34.6615592,
    lng: 135.4967039,
    mapUrl: 'https://maps.app.goo.gl/tp5JarLveRfa7oBN7',
  },
  {
    id: 'osaka-sennichimae-doguyasuji',
    name: '千日前道具屋筋商店街',
    description: '餐具、廚房用品與食品模型商店街，適合和難波、美食路線一起逛。',
    lat: 34.6640141,
    lng: 135.5035063,
    mapUrl: 'https://maps.app.goo.gl/DaBLR7a9kt4yrMhm7',
  },
  {
    id: 'osaka-hozenji',
    name: '法善寺',
    description: '道頓堀旁的小寺院，以水掛不動尊與石板巷弄氣氛聞名。',
    lat: 34.6679398,
    lng: 135.5024676,
    mapUrl: 'https://maps.app.goo.gl/dK34igNkjhphi3wj7',
  },
  {
    id: 'osaka-namba-shrine',
    name: '難波神社',
    description: '位在本町、心齋橋之間的市區神社，適合和御堂筋散步一起安排。',
    lat: 34.6787746,
    lng: 135.4999284,
    mapUrl: 'https://maps.app.goo.gl/MGDHtqo5AmRNHXKy7',
  },
  {
    id: 'osaka-ikasuri-shrine',
    name: '坐摩神社',
    description: '本町附近的古社，位置接近難波神社，適合安排成市區神社散步路線。',
    lat: 34.68094,
    lng: 135.49859,
    mapUrl: 'https://maps.app.goo.gl/vwhiuWYd4doTdAUT6',
  },
  {
    id: 'osaka-kema-sakuranomiya-park',
    name: '毛馬櫻之宮公園',
    description: '大川沿岸的賞櫻與散步公園，春天可和大阪城、中之島水岸一起安排。',
    lat: 34.7051508,
    lng: 135.5188438,
    mapUrl: 'https://maps.app.goo.gl/oGA47iQXMWUTLbt86',
  },
  {
    id: 'osaka-amanohashidate-view-land',
    name: '天橋立View Land',
    description: '京都北部代表景點，大阪出發一日遊常見路線。',
    lat: 35.5519555,
    lng: 135.1813454,
    mapUrl: 'https://maps.app.goo.gl/w9YD5P1vUYAERds9A',
    relatedTicketTag: '天橋立View Land',
  },
  {
    id: 'osaka-kasamatsu-park',
    name: '天橋立傘松公園',
    description: '天橋立北側展望點，常與伊根舟屋、美山合掌村搭配。',
    lat: 35.5866965,
    lng: 135.1950036,
    mapUrl: 'https://maps.app.goo.gl/NLEY7XPNWVfP7WLD8',
    relatedTicketTag: '天橋立傘松公園',
  },
  {
    id: 'osaka-ine-funaya',
    name: '伊根舟屋',
    description: '京都北部海邊舟屋聚落，是大阪出發天橋立路線熱門停靠點。',
    lat: 35.675712,
    lng: 135.2874835,
    mapUrl: 'https://maps.app.goo.gl/bT1yw4x7i9yRya5bA',
    relatedTicketTag: '伊根舟屋',
  },
  {
    id: 'osaka-miyama-kayabuki',
    name: '美山合掌村',
    description: '京都山區茅葺聚落，常和天橋立或京都北部路線搭配。',
    lat: 35.3104446,
    lng: 135.6215373,
    mapUrl: 'https://maps.app.goo.gl/8LxGPMSE9W1abyr7A',
    relatedTicketTag: '美山合掌村',
  },
  {
    id: 'osaka-arashiyama-bamboo',
    name: '嵐山竹林',
    description: '京都經典散步景點，大阪出發京都一日遊常見主線。',
    lat: 35.0168187,
    lng: 135.6713013,
    mapUrl: 'https://maps.app.goo.gl/bqPXN5cCLpZJdemR6',
    relatedTicketTag: '嵐山竹林',
  },
  {
    id: 'osaka-sagano-train',
    name: '嵐山小火車',
    description: '嵐山到龜岡的觀光列車，常與保津川遊船或嵐山散策搭配。',
    lat: 35.0186085,
    lng: 135.6806606,
    mapUrl: 'https://maps.app.goo.gl/fqsg5wox8Qk8hFyx8',
    relatedTicketTag: '嵐山小火車',
  },
  {
    id: 'osaka-kinkakuji',
    name: '金閣寺',
    description: '京都代表寺院，經典京都一日遊常見停靠點。',
    lat: 35.03937,
    lng: 135.729243,
    mapUrl: 'https://maps.app.goo.gl/X2KSeMSCMgiwm5YEA',
    relatedTicketTag: '金閣寺',
  },
  {
    id: 'osaka-kiyomizudera',
    name: '清水寺',
    description: '京都東山代表景點，可和伏見稻荷、奈良或嵐山路線搭配。',
    lat: 34.9946662,
    lng: 135.784661,
    mapUrl: 'https://maps.app.goo.gl/rjjZ6K9YP5gY5tsR9',
    relatedTicketTag: '清水寺',
  },
  {
    id: 'osaka-nijo-castle',
    name: '二條城',
    description: '京都世界遺產城郭，部分京都景點一日遊會安排進路線。',
    lat: 35.0140379,
    lng: 135.7484258,
    mapUrl: 'https://maps.app.goo.gl/F7zUzo3UZkZqs1kV7',
    relatedTicketTag: '二條城',
  },
  {
    id: 'osaka-fushimi-inari',
    name: '伏見稻荷大社',
    description: '京都千本鳥居景點，常與奈良公園、清水寺同線。',
    lat: 34.9676945,
    lng: 135.7791876,
    mapUrl: 'https://maps.app.goo.gl/ARyUAkVg8MXcZwzH6',
    relatedTicketTag: '伏見稻荷大社',
  },
  {
    id: 'osaka-nara-park',
    name: '奈良公園',
    description: '奈良經典鹿群景點，大阪出發京都奈良一日遊常見目的地。',
    lat: 34.685047,
    lng: 135.843012,
    mapUrl: 'https://maps.app.goo.gl/Lz2oxK4wLCcQcj8H9',
    relatedTicketTag: '奈良公園',
  },
  {
    id: 'osaka-todaiji',
    name: '東大寺',
    description: '奈良大佛所在寺院，通常與奈良公園一起安排。',
    lat: 34.6889851,
    lng: 135.8398158,
    mapUrl: 'https://maps.app.goo.gl/aGof4HmKRPQzfY4cA',
    relatedTicketTag: '東大寺',
  },
  {
    id: 'osaka-yuzen-korin',
    name: '友禪光林',
    description: '京都傳統工藝體驗點，適合想把文化體驗排進一日遊的人。',
    lat: 35.0152682,
    lng: 135.6783695,
    mapUrl: 'https://maps.app.goo.gl/8d9oFN5jeFZrbXBE8',
    relatedTicketTag: '友禪光林',
  },
  {
    id: 'osaka-uji',
    name: '宇治',
    description: '京都南側抹茶與河岸小城，常與平等院、伏見稻荷或奈良搭配。',
    lat: 34.8845134,
    lng: 135.7997037,
    mapUrl: 'https://maps.app.goo.gl/iTszDH566JmGQPwk9',
    relatedTicketTag: '宇治',
  },
  {
    id: 'osaka-byodoin',
    name: '平等院',
    description: '宇治代表世界遺產，適合京都南線一日遊。',
    lat: 34.8892908,
    lng: 135.8076783,
    mapUrl: 'https://maps.app.goo.gl/8VcczQdmTpBpTmXZ8',
    relatedTicketTag: '平等院',
  },
  {
    id: 'osaka-sanzenin',
    name: '三千院',
    description: '京都大原寺院景點，部分滋賀、琵琶湖路線會一起安排。',
    lat: 35.119726,
    lng: 135.8344058,
    mapUrl: 'https://maps.app.goo.gl/R4etbA9SP8w6gVDE8',
    relatedTicketTag: '三千院',
  },
  {
    id: 'osaka-biwako-valley',
    name: '纜車｜琵琶湖谷',
    description: '滋賀山景與琵琶湖視野，適合想從大阪安排近郊自然景點的人。',
    lat: 35.2030278,
    lng: 135.9072117,
    mapUrl: 'https://maps.app.goo.gl/BYoGkiAfXWAEeFMy6',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138724-biwako-valley-ropeway-round-trip-ticket-japan?cid=22312', event: 'osakamap_ticket_biwako_valley_kkday' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/47068-biwako-valley-ropeway-ticket/?aid=93798', event: 'osakamap_ticket_biwako_valley_klook' },
    ],
    relatedTicketTag: '琵琶湖纜車',
  },
  {
    id: 'osaka-arima-onsen',
    name: '有馬溫泉',
    description: '神戶山區溫泉鄉，大阪出發神戶一日遊常見停靠點。',
    lat: 34.7978083,
    lng: 135.2476961,
    mapUrl: 'https://maps.app.goo.gl/G5qCWBbQzuRYuoYH6',
    relatedTicketTag: '有馬溫泉',
  },
  {
    id: 'osaka-mt-rokko',
    name: '六甲山',
    description: '神戶夜景與山景景點，常與有馬溫泉、Outlet 或神戶港區搭配。',
    lat: 34.7780226,
    lng: 135.2637238,
    mapUrl: 'https://maps.app.goo.gl/giHqJumo5hGaT55Z6',
    relatedTicketTag: '六甲山',
  },
  {
    id: 'osaka-wakayama-castle',
    name: '和歌山城',
    description: '和歌山市代表城郭，白濱與和歌山一日遊常見起點。',
    lat: 34.2276558,
    lng: 135.1715109,
    mapUrl: 'https://maps.app.goo.gl/g2hkDvVqt8ufBa3x6',
    relatedTicketTag: '和歌山城',
  },
  {
    id: 'osaka-miho-museum',
    name: 'MIHO美術館',
    description: '滋賀山區美術館，建築與自然景觀都很有特色。',
    lat: 34.9149168,
    lng: 136.0162153,
    mapUrl: 'https://maps.app.goo.gl/L6CZTTvMbMDMc5SX8',
    relatedTicketTag: 'MIHO美術館',
  },
]

const osakaHotelPlaces: MapPlace[] = [
  {
    id: 'osaka-hotel-swissotel-nankai',
    category: 'hotel',
    name: '大阪瑞士南海飯店',
    description: '5星級｜南海難波站樓上，機場Rapi:t直達最省力',
    lat: 34.6641574,
    lng: 135.5011441,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/uC4TKFZibGRNJwS88',
    mapButtonMapEvent: 'osakamap_hotel_swissotel_nankai_map',
    hotelActions: [
      {
        label: 'Trip',
        href: 'https://tw.trip.com/hotels/osaka-hotel-detail-976800?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417',
        className: 'btn primary',
        event: 'osakamap_hotel_swissotel_nankai_trip',
        platform: 'Trip',
        section: 'map_bar',
      },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=45609', className: 'btn', event: 'osakamap_hotel_swissotel_nankai_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-royal-classic',
    category: 'hotel',
    name: '大阪皇家古典飯店',
    description: '4星級｜難波站旁設計飯店，浴室空間舒適有質感',
    lat: 34.6659432,
    lng: 135.5000048,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/SbHmnan68timM1me7',
    mapButtonMapEvent: 'osakamap_hotel_royal_classic_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-49239788/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_royal_classic_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=11279046', className: 'btn', event: 'osakamap_hotel_royal_classic_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-gracery-namba',
    category: 'hotel',
    name: '大阪難波格拉斯麗飯店',
    description: '4星級｜近JR難波與OCAT巴士，機場移動方便',
    lat: 34.6657354,
    lng: 135.4975038,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/4G8Dj9Z3JA9t3zyB7',
    mapButtonMapEvent: 'osakamap_hotel_gracery_namba_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-29903490/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_gracery_namba_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=6180898', className: 'btn', event: 'osakamap_hotel_gracery_namba_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-candeo-namba',
    category: 'hotel',
    name: '大阪難波光芒飯店',
    description: '4星級｜道頓堀心齋橋步行圈，頂樓大浴場加分',
    lat: 34.6705797,
    lng: 135.5060496,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/ZLCegULymmyZaHzY6',
    mapButtonMapEvent: 'osakamap_hotel_candeo_namba_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-6666605/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_candeo_namba_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1899389', className: 'btn', event: 'osakamap_hotel_candeo_namba_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-nikko',
    category: 'hotel',
    name: '大阪日航飯店',
    description: '5星級｜心齋橋站直通，機場巴士與親子設備方便',
    lat: 34.6739002,
    lng: 135.4997105,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/952UjHJ3iw8nEfNf7',
    mapButtonMapEvent: 'osakamap_hotel_nikko_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-688209/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_nikko_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=45593', className: 'btn', event: 'osakamap_hotel_nikko_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-just-sleep-shinsaibashi',
    category: 'hotel',
    name: '捷絲旅大阪心齋橋館',
    description: '4星級｜台灣品牌，四大地鐵站可達交通彈性高',
    lat: 34.6779368,
    lng: 135.50358,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/ARnhrmDRy4SunWfb8',
    mapButtonMapEvent: 'osakamap_hotel_just_sleep_shinsaibashi_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-102347890/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_just_sleep_shinsaibashi_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=35944176', className: 'btn', event: 'osakamap_hotel_just_sleep_shinsaibashi_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-vessel-inn-shinsaibashi',
    category: 'hotel',
    name: 'VESSEL INN大阪心齋橋船舶酒店',
    description: '4星級｜心齋橋與長堀橋中間，商務小資好選擇',
    lat: 34.6753922,
    lng: 135.5038185,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/iVwgk84o22eVbPVL6',
    mapButtonMapEvent: 'osakamap_hotel_vessel_inn_shinsaibashi_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-7420957/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_vessel_inn_shinsaibashi_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1723530', className: 'btn', event: 'osakamap_hotel_vessel_inn_shinsaibashi_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-sotetsu-fresa-shinsaibashi',
    category: 'hotel',
    name: '相鐵 FRESA INN 大阪心齋橋',
    description: '3星級｜心齋橋、長堀橋步行圈，乾淨實用且交通方便',
    lat: 34.6746564,
    lng: 135.5040446,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/YFULwFeesgXF57Aa8',
    mapButtonMapEvent: 'osakamap_hotel_sotetsu_fresa_shinsaibashi_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-21369036/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16707581', className: 'btn primary', event: 'osakamap_hotel_sotetsu_fresa_shinsaibashi_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=5318330', className: 'btn', event: 'osakamap_hotel_sotetsu_fresa_shinsaibashi_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-ritz-carlton',
    category: 'hotel',
    name: '大阪麗思卡爾頓酒店',
    description: '5星級｜梅田奢華飯店，服務與房間質感很穩',
    lat: 34.69834,
    lng: 135.4925207,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/AycwCoouu4vBx7147',
    mapButtonMapEvent: 'osakamap_hotel_ritz_carlton_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-1280987/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_ritz_carlton_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=8000', className: 'btn', event: 'osakamap_hotel_ritz_carlton_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-hankyu-respire',
    category: 'hotel',
    name: '阪急大阪龍仕柏飯店',
    description: '4星級｜大阪站旁商場樓上，親子與購物都方便',
    lat: 34.7047014,
    lng: 135.4961473,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/aUbbQzascVWg8RZr5',
    mapButtonMapEvent: 'osakamap_hotel_hankyu_respire_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-63326122/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_hankyu_respire_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=59662949', className: 'btn', event: 'osakamap_hotel_hankyu_respire_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-intergate-umeda',
    category: 'hotel',
    name: '大阪梅田Intergate飯店',
    description: '4星級｜西梅田站近，有大浴場與免費點心宵夜',
    lat: 34.6981353,
    lng: 135.493225,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/QmZNid31ibfSUpBn7',
    mapButtonMapEvent: 'osakamap_hotel_intergate_umeda_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-63326122/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_intergate_umeda_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=13862639', className: 'btn', event: 'osakamap_hotel_intergate_umeda_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-vischio',
    category: 'hotel',
    name: '格蘭比亞大阪維斯奇歐飯店',
    description: '4星級｜JR大阪站北側，鬧中取靜且房間較舒適',
    lat: 34.706251,
    lng: 135.4953538,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/63HSwQQnE53G7Evp7',
    mapButtonMapEvent: 'osakamap_hotel_vischio_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-17502427/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_vischio_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=2865504', className: 'btn', event: 'osakamap_hotel_vischio_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-marriott-miyako',
    category: 'hotel',
    name: '大阪萬豪都酒店',
    description: '5星級｜阿倍野HARUKAS高樓層，夜景與交通都強',
    lat: 34.6457953,
    lng: 135.5142975,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/C7MayAfHg5es7uA18',
    mapButtonMapEvent: 'osakamap_hotel_marriott_miyako_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?hotelId=1113592&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_marriott_miyako_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=611445', className: 'btn', event: 'osakamap_hotel_marriott_miyako_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-trusty-abeno',
    category: 'hotel',
    name: '大阪阿倍野Trusty飯店',
    description: '4星級｜天王寺站前，阿倍野商圈吃逛都方便',
    lat: 34.646162,
    lng: 135.5123041,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/mTErnCTXXwdvrcSs9',
    mapButtonMapEvent: 'osakamap_hotel_trusty_abeno_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-1715723/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_trusty_abeno_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=400287', className: 'btn', event: 'osakamap_hotel_trusty_abeno_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-miyako-city-tennoji',
    category: 'hotel',
    name: '大阪天王寺都城市飯店',
    description: '4星級｜JR天王寺站連通，近近鐵百貨生活機能好',
    lat: 34.6455698,
    lng: 135.5157308,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/h4jDWWaaLYEqf1xz8',
    mapButtonMapEvent: 'osakamap_hotel_miyako_city_tennoji_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-993279/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_miyako_city_tennoji_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9071828', className: 'btn', event: 'osakamap_hotel_miyako_city_tennoji_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
  {
    id: 'osaka-hotel-via-inn-abeno',
    category: 'hotel',
    name: 'VIA INN 阿倍野天王寺',
    description: '3星級｜天王寺站近，樓下唐吉軻德採買方便',
    lat: 34.6472917,
    lng: 135.5115944,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/kUf1sYsymU85GJ2p8',
    mapButtonMapEvent: 'osakamap_hotel_via_inn_abeno_map',
    hotelActions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-12114407/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakamap_hotel_via_inn_abeno_trip', platform: 'Trip', section: 'map_bar' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9073534', className: 'btn', event: 'osakamap_hotel_via_inn_abeno_agoda', platform: 'Agoda', section: 'map_bar' },
    ],
  },
]

const insertedAdditionalHotelSlugs = new Set([
  'cross-hotel-osaka',
  'karaksa-hotel-osaka-namba',
  'hotel-monterey-grasmere-osaka',
  'onyado-nono-namba',
  'hiyori-hotel-osaka-namba-station',
  'mimaru-osaka-shinsaibashi-west',
  'hotel-the-flag-shinsaibashi',
  'hotel-hankyu-international',
  'hotel-granvia-osaka',
  'hotel-monterey-osaka',
  'villa-fontaine-grand-osaka-umeda',
])

function additionalHotelPlaces(slugs: string[]): MapPlace[] {
  return slugs
    .map((slug) => osakaAdditionalHotelMapPlaceBySlug[slug])
    .filter((place): place is MapPlace => Boolean(place))
}

const osakaOrderedHotelPlaces: MapPlace[] = [
  ...osakaHotelPlaces.flatMap((place) => {
    if (place.id === 'osaka-hotel-candeo-namba') {
      return [
        place,
        ...additionalHotelPlaces([
          'cross-hotel-osaka',
          'karaksa-hotel-osaka-namba',
          'hotel-monterey-grasmere-osaka',
          'onyado-nono-namba',
          'hiyori-hotel-osaka-namba-station',
        ]),
      ]
    }

    if (place.id === 'osaka-hotel-sotetsu-fresa-shinsaibashi') {
      return [
        ...additionalHotelPlaces(['mimaru-osaka-shinsaibashi-west']),
        place,
        ...additionalHotelPlaces(['hotel-the-flag-shinsaibashi']),
      ]
    }

    if (place.id === 'osaka-hotel-hankyu-respire') {
      return [...additionalHotelPlaces(['hotel-hankyu-international']), place]
    }

    if (place.id === 'osaka-hotel-vischio') {
      return [
        place,
        ...additionalHotelPlaces([
          'hotel-granvia-osaka',
          'hotel-monterey-osaka',
          'villa-fontaine-grand-osaka-umeda',
        ]),
      ]
    }

    return [place]
  }),
  ...osakaAdditionalHotelSlugs
    .filter((slug) => !insertedAdditionalHotelSlugs.has(slug))
    .map((slug) => osakaAdditionalHotelMapPlaceBySlug[slug]),
]

const osakaAirportPlaces: MapPlace[] = [
  {
    id: 'osaka-kansai-airport',
    category: 'free',
    name: '大阪關西國際機場（KIX）',
    description: '大阪、京都與關西自由行常用的國際機場；T1 可直接接 JR、南海與市區巴士，T2 要先搭免費接駁車到 T1／Aeroplaza 一側。',
    lat: 34.4319994,
    lng: 135.2366019,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/EH9UFMPLLUM3oq2z5',
    mapButtonMapEvent: 'osakamap_kansai_airport_map',
    spotActions: [
      { label: '航廈攻略', href: '/osaka/kansai-airport-terminal-guide?from=osaka-map', className: 'btn', mapEvent: 'osakamap_kansai_airport_terminal_article', platform: 'article' },
      { label: '進市區', href: '/osaka/kansai-airport-to-osaka?from=osaka-map', className: 'btn', mapEvent: 'osakamap_kansai_airport_city_article', platform: 'article' },
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DZzv-KlBF65/', className: 'btn', mapEvent: 'osakamap_kansai_airport_ig', platform: 'IG' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/RLZ9aIn_BUg', className: 'btn', mapEvent: 'osakamap_kansai_airport_youtube', platform: 'YouTube' },
    ],
  },
]

export const osakaMapPlaces: MapPlace[] = [
  ...osakaTicketPlaces.map(ticketPlaceToMapPlace),
  ...osakaPassTicketPlaces,
  ...osakaSpotPlaces.map(spotPlaceToMapPlace),
  ...osakaAirportPlaces,
  ...osakaShopMapPlaces,
  ...osakaOrderedHotelPlaces,
]
