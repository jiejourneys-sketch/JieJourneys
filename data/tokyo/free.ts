import type { CityCardAction } from '@/components/CityTabbedList'
import type { TokyoMapPlace } from '@/data/tokyo/map/types'

/**
 * 東京地圖｜免費類釘點（與 `hotels.ts`、`tickets.ts` 同層；複製後改 id／座標／按鈕）
 */
const exampleAction: CityCardAction[] = [
  {
    label: '範例連結（請改）',
    href: 'https://www.google.com/maps?q=35.6717,139.6949',
    mapEvent: 'tokyo_map_free_example',
  },
]

export const tokyoFreeMapPlaces: TokyoMapPlace[] = [
  {
    id: 'tokyo-UenoPark',
    category: 'free',
    name: '上野恩賜公園',
    description: '',
    lat: 35.7147557,
    lng: 139.7734312,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/z3m5ujikB9yBgGcp7',
    mapButtonMapEvent: 'tokyomap_UenoParkMap',
    spotActions: [
    {
      label: '景點',
      className: "btn primary",
      href: 'https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/midokoro',
      mapEvent: 'tokyomap_UenoPark_spot',
    },
  ],
},
{
  id: 'tokyo-AmeyokoMarket',
  category: 'free',
  name: '阿美橫商店街',
  description: '',
  lat: 35.7090028,
  lng: 139.7746259,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/AVejbKHAqhPx28AD8',
  mapButtonMapEvent: 'tokyomap_AmeyokoMarketMap',
  spotActions: [
],
},
{
  id: 'tokyo-AsakusaTemple',
  category: 'free',
  name: '淺草寺',
  description: '',
  lat: 35.7147651,
  lng: 139.7966553,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/A1i5xhQt3ceED98n7',
  mapButtonMapEvent: 'tokyomap_AsakusaTempleMap',
  spotActions: [
],
},
{
  id: 'tokyo-ImperialPalace',
  category: 'free',
  name: '皇居',
  description: '',
  lat: 35.685175,
  lng: 139.7527995,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/pGoyG2WXux9p2TETA',
  mapButtonMapEvent: 'tokyomap_ImperialPalaceMap',
  spotActions: [
  {
    label: '官網',
    className: "btn primary",
    href: 'https://sankan.kunaicho.go.jp/english/index.html',
    mapEvent: 'tokyomap_ImperialPalace_Official',
  },
  {
    label: '預約',
    className: "btn",
    href: 'https://sankan.kunaicho.go.jp/register/month/1001',
    mapEvent: 'tokyomap_ImperialPalace_Reservation',
  },
],
},
{
  id: 'tokyo-TsukijiMarket',
  category: 'free',
  name: '築地市場',
  description: '道地美食',
  lat: 35.6647703,
  lng: 139.7702515,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/Q5CMX5za4ektymPH8',
  mapButtonMapEvent: 'tokyomap_TsukijiMarketMap',
  spotActions: [
],
},
{
  id: 'tokyo-RoppongiChristmas',
  category: 'free',
  name: '六本木｜聖誕點燈',
  description: '',
  lat: 35.6592465,
  lng: 139.7299422,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/eZ4hUjVPXsip7WrM7',
  mapButtonMapEvent: 'tokyomap_RoppongiChristmasMap',
  spotActions: [
  {
    label: '路線',
    className: "btn primary",
    href: 'https://www.instagram.com/reel/DSfemOTEqbL/',
    mapEvent: 'tokyomap_RoppongiChristmas_IG',
  },
],
},
{
  id: 'tokyo-HibiyaGardenPlaza',
  category: 'free',
  name: '惠比壽花園廣場｜聖誕點燈',
  description: '',
  lat: 35.6424892,
  lng: 139.7138345,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/YUoo6XLsGNPrdELe6',
  mapButtonMapEvent: 'tokyomap_HibiyaGardenPlazaMap',
  spotActions: [
  {
    label: '路線',
    className: "btn primary",
    href: 'https://www.instagram.com/reel/DShsI6gEa8u/',
    mapEvent: 'tokyomap_HibiyaGardenPlaza_IG',
  },
],
},
{
  id: 'tokyo-ShibuyaCrossing',
  category: 'free',
  name: '涉谷｜十字路口',
  description: '',
  lat: 35.659482,
  lng: 139.7005596,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/RmKRvE769PXkkFi46',
  mapButtonMapEvent: 'tokyomap_ShibuyaCrossingMap',
  spotActions: [
],
},
{
  id: 'tokyo-HachikoStatue',
  category: 'free',
  name: '忠犬八公像',
  description: '',
  lat: 35.6590579,
  lng: 139.7006293,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/ttFeV169rkeAmJ2u8',
  mapButtonMapEvent: 'tokyomap_HachikoStatueMap',
  spotActions: [
],
},
{
  id: 'tokyo-YoyogiPark',
  category: 'free',
  name: '代代木公園',
  description: '',
  lat: 35.6700649,
  lng: 139.6949656,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/5gqoWLer49aDr1rYA',
  mapButtonMapEvent: 'tokyomap_YoyogiParkMap',
  spotActions: [
],
},
{
  id: 'tokyo-MeijiShrine',
  category: 'free',
  name: '明治神宮',
  description: '',
  lat: 35.6763976,
  lng: 139.6993259,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/zSBnMgXBEBbeodeV9',
  mapButtonMapEvent: 'tokyomap_MeijiShrineMap',
  spotActions: [
],
},
{
  id: 'tokyo-TokyoCityHall',
  category: 'free',
  name: '東京都廳',
  description: '免費展望台',
  lat: 35.689733,
  lng: 139.6916563,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/gkmBAjq2FGHzKycS8',
  mapButtonMapEvent: 'tokyomap_TokyoCityHallMap',
  spotActions: [
    {
      label: '官網',
      className: "btn primary",
      href: 'https://www.zaimu.metro.tokyo.lg.jp/tochousha/goannai/tenbou',
      mapEvent: 'tokyomap_TokyoCityHall_Official',
    },
],
},
{
  id: 'tokyo-HanaGardenShrine',
  category: 'free',
  name: '花園神社',
  description: '',
  lat: 35.6935311,
  lng: 139.7053279,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/bwTV1wZvDP1Wgui88',
  mapButtonMapEvent: 'tokyomap_HanaGardenShrineMap',
  spotActions: [
],
},
]
