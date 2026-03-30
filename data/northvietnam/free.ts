import type { CityCardAction } from '@/components/CityTabbedList'
import type { NorthVietnamMapPlace } from '@/data/northvietnam/map/types'

/**
 * 北越地圖｜免費類釘點（與 `hotels.ts`、`tickets.ts` 同層；複製後改 id／座標／按鈕）
 */
const exampleAction: CityCardAction[] = [
  {
    label: '範例連結（請改）',
    href: 'https://www.google.com/maps?q=21.0285,105.8542',
    mapEvent: 'nv_map_free_example',
  },
]

export const northVietnamFreeMapPlaces: NorthVietnamMapPlace[] = [
  {
    id: 'northvietnam-CatCat',
    category: 'free',
    name: '貓貓村',
    description: '',
    lat: 22.3310248,
    lng: 103.8339731,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/u6Bd2rtnNMhLtiHg9',
    mapButtonMapEvent: 'northvietnamMap_CatCatMap',
    spotActions: [
    {
      label: '介紹',
      className: "btn primary",
      href: 'https://www.instagram.com/reel/DR7EOgwkT1w/',
      mapEvent: 'northvietnamMap_CatCatIG',
    },
  ],
},
{
  id: 'northvietnam-SapaPlaza',
  category: 'free',
  name: '沙壩廣場',
  description: '',
  lat: 22.3310248,
  lng: 103.8339731,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/xZnXq85zCcRhgn2z5',
  mapButtonMapEvent: 'northvietnamMap_SapaPlazaMap',
  spotActions: [
  {
    label: '介紹',
    className: "btn primary",
    href: 'https://www.instagram.com/reel/DSNF0KWkfol/',
    mapEvent: 'northvietnamMap_SapaPlazaIG',
  },
],
},
{
  id: 'northvietnam-MoanaSapa',
  category: 'free',
  name: 'Moana Sapa',
  description: '拍照打卡景點',
  lat: 22.3273593,
  lng: 103.8459589,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/n9aCzohfFqhjnQJY9',
  mapButtonMapEvent: 'northvietnamMap_MoanaSapaMap',
  spotActions: [
],
},
{
  id: 'northvietnam-TrainStreet',
  category: 'free',
  name: '河內火車街',
  description: '',
  lat: 21.0299218,
  lng: 105.8438593,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/JNVXEYtZvKjuh9af8',
  mapButtonMapEvent: 'northvietnamMap_TrainStreetMap',
  spotActions: [
    {
      label: '介紹',
      className: "btn primary",
      href: 'https://www.instagram.com/reel/DQ9RIxgEaPv/',
      mapEvent: 'northvietnamMap_TrainStreetIG',
    },
],
},
{
  id: 'northvietnam-ThirtySixStreet',
  category: 'free',
  name: '三十六古街',
  description: '逛街',
  lat: 21.0340592,
  lng: 105.8501498,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/dLpn6K8v11rg2vm4A',
  mapButtonMapEvent: 'northvietnamMap_ThirtySixStreetMap',
  spotActions: [
],
},
{
  id: 'northvietnam-HoanKiemLake',
  category: 'free',
  name: '還劍湖',
  description: '',
  lat: 21.0286669,
  lng: 105.8521484,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/fy8Mp6d9XRCZ5nXZA',
  mapButtonMapEvent: 'northvietnamMap_HoanKiemLakeMap',
  spotActions: [
    {
      label: '介紹',
      className: "btn primary",
      href: 'https://www.instagram.com/reel/DQg8YLfEy8c/',
      mapEvent: 'northvietnamMap_HoanKiemLakeIG',
    },
],
},
{
  id: 'northvietnam-OperaHouse',
  category: 'free',
  name: '河內歌劇院',
  description: '',
  lat: 21.0242438,
  lng: 105.8576254,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/rHZF1Fmza3aPbZ9V7',
  mapButtonMapEvent: 'northvietnamMap_OperaHouseMap',
  spotActions: [
],
},
{
  id: 'northvietnam-Church',
  category: 'free',
  name: '河內教堂',
  description: '',
  lat: 21.0285957,
  lng: 105.8488606,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/w1EqxjzFP6abD7EY7',
  mapButtonMapEvent: 'northvietnamMap_ChurchMap',
  spotActions: [
],
},
{
  id: 'northvietnam-YushanShrine',
  category: 'free',
  name: '玉山祠',
  description: '現場買票',
  lat: 21.0306883,
  lng: 105.8523861,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/ivF9qPBiFbNoJaAq6',
  mapButtonMapEvent: 'northvietnamMap_YushanShrineMap',
  spotActions: [
],
},
{
  id: 'northvietnam-PrisonMuseum',
  category: 'free',
  name: '監獄博物館',
  description: '現場買票',
  lat: 21.0253297,
  lng: 105.8464781,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/jj5xb7pF95kbBbMa7',
  mapButtonMapEvent: 'northvietnamMap_PrisonMuseumMap',
  spotActions: [
],
},
{
  id: 'northvietnam-ImperialCity',
  category: 'free',
  name: '昇龍皇城遺址',
  description: '現場買票',
  lat: 21.0352231,
  lng: 105.8402594,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/9UHVqtC87ZxqXjbZ9',
  mapButtonMapEvent: 'northvietnamMap_ImperialCityMap',
  spotActions: [
],
},
{
  id: 'northvietnam-HoChiMinhMausoleum',
  category: 'free',
  name: '胡志明陵寢',
  description: '現場買票',
  lat: 21.0368973,
  lng: 105.8346667,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/81WT4vhPdC8JYKQF7',
  mapButtonMapEvent: 'northvietnamMap_HoChiMinhMausoleumMap',
  spotActions: [
    {
      label: '介紹',
      className: "btn primary",
      href: 'https://www.instagram.com/reel/DQy97hwkfGc/',
      mapEvent: 'northvietnamMap_HoChiMinhMausoleumIG',
    },
],
},
{
  id: 'northvietnam-ZhenGuoTemple',
  category: 'free',
  name: '鎮國寺',
  description: '',
  lat: 21.047871,
  lng: 105.8368738,
  spotGoogleMapsUrl: 'https://maps.app.goo.gl/b1WSRoiBdE6LnnRu6',
  mapButtonMapEvent: 'northvietnamMap_ZhenGuoTempleMap',
  spotActions: [
],
},
]
