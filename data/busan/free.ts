import type { BusanMapPlace } from '@/data/busan/map/types'

/**
 * 釜山地圖｜景點類別釘點（`category: 'free'` 僅為程式分類，畫面上叫「景點」）
 *
 * 【最後一顆「地圖」按鈕】
 * - 連結：`spotGoogleMapsUrl`（沒填就用 lat、lng 開 Google 釘點）
 * - `mapButtonMapEvent`（選填）：這顆按鈕的 data-event；沒寫就用全站預設
 * - `mapButtonLabel`（選填）：按鈕文字；沒寫就顯示「地圖」
 *
 * 【其他按鈕】在 `spotActions` 裡一筆一顆，複製下面這行改三個欄位即可：
 *   { label: '按鈕名字', href: 'https://...', mapEvent: '你的event字串' },
 */
export const busanFreeMapPlaces: BusanMapPlace[] = [
  {
    id: 'busan-haeundae',
    category: 'free',
    name: '海雲台海灘',
    description: '',
    lat: 35.1586975,
    lng: 129.1603842,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/ZUHjykERqibiiedU8',
    mapButtonMapEvent: 'busanmap_haeundae',
    spotActions: [
      {
        label: '介紹',
        className: "btn primary",
        href: 'https://www.instagram.com/reel/DLuh1WzzM0c/',
        mapEvent: 'busanmap_haeundaeIG',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/FfeOimOk',
        mapEvent: 'busanmap_Naverhaeundae',
      },
    ],
  },
  {
    id: 'haeundae-market',
    category: 'free',
    name: '傳統市場｜海雲臺',
    description: '',
    lat: 35.1614537,
    lng: 129.1622489,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/pGBmAJYDTMGKFenU9',
    mapButtonMapEvent: 'busanmap_haeundaemarket',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/5T0OOJyP',
        mapEvent: 'busanmap_Naverhaeundaemarket',
      },
    ],
  },
  {
    id: 'haeundae-road',
    category: 'free',
    name: '海理團路',
    description: '多可愛小店',
    lat: 35.1648405,
    lng: 129.1576274,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/PhumBieF71rLbVyK8',
    mapButtonMapEvent: 'busanmap_haeundae_road',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/xs3GyweZ',
        mapEvent: 'busanmap_Naverhaeundaeroad',
      },
    ],
  },
  {
    id: 'haeundae-crossing',
    category: 'free',
    name: '灌籃高手平交道',
    description: '',
    lat: 35.1616631,
    lng: 129.1918625,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/8FoxiUM5L5sdHUi37',
    mapButtonMapEvent: 'busanmap_haeundae_crossing',
    spotActions: [
      {
        label: '介紹',
        className: "btn primary",
        href: 'https://www.instagram.com/reel/DMu5uZxTdO8/',
        mapEvent: 'busanmap_haeundae_crossingIG',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/FbO6BFdc',
        mapEvent: 'busanmap_Naverhaeundaecrossing',
      },
    ],
  },
  {
    id: 'haeundae-stone',
    category: 'free',
    name: '青沙浦踏石觀景台',
    description: '',
    lat: 35.1640365,
    lng: 129.1967173,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/wwPCGt2PEJLsHxmL7',
    mapButtonMapEvent: 'busanmap_haeundaestone',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/53lKWBRN',
        mapEvent: 'busanmap_Naverhaeundaestone',
      },
    ],
  },
  {
    id: 'haeundae-temple',
    category: 'free',
    name: '海東龍宮寺',
    description: '海上寺廟',
    lat: 35.1884543,
    lng: 129.2231109,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/7MkiL8m9XovutUnq5',
    mapButtonMapEvent: 'busanmap_haeundaetemple',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/58NdWaSm',
        mapEvent: 'busanmap_Naverhaeundatemple',
      },
    ],
  },
  {
    id: 'Gwangalli-beach',
    category: 'free',
    name: '廣安里海灘',
    description: '',
    lat: 35.1531794,
    lng: 129.1186609,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/4yVvHrhWyiNVHoJK9',
    mapButtonMapEvent: 'busanmap_Gwangalli_beach',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/xzxmzK1j',
        mapEvent: 'busanmap_NaverGwangalli_beach',
      },
    ],
  },
  {
    id: 'White-sand-village',
    category: 'free',
    name: '白淺灘文化村',
    description: '',
    lat: 35.0782798,
    lng: 129.0453198,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/roTicHz4MnZViNND6',
    mapButtonMapEvent: 'busanmap_White_sand_village',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/xLWAPvjS',
        mapEvent: 'busanmap_NaverWhite_sand_village',
      },
    ],
  },
  {
    id: 'Songdo-skywalk',
    category: 'free',
    name: '松島天空步道',
    description: '',
    lat: 35.0759423,
    lng: 129.0215731,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/5SFYNJMgaoSpLADy8',
    mapButtonMapEvent: 'busanmap_Songdo_skywalk',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/FHlk6DdP',
        mapEvent: 'busanmap_NaverSongdo_skywalk',
      },
    ],
  },
  {
    id: 'Canning-market',
    category: 'free',
    name: '富平罐頭市場',
    description: '傳統小吃',
    lat: 35.101854,
    lng: 129.0258719,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/sqSYXifborQ7efhg7',
    mapButtonMapEvent: 'busanmap_canning_market',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/GCvq48kt',
        mapEvent: 'busanmap_Navercanning_market',
      },
    ],
  },
  {
    id: 'International-market',
    category: 'free',
    name: '國際市場',
    description: '賣棉被',
    lat: 35.1013575,
    lng: 129.0281978,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/oH1oo731Y9RGup1E7',
    mapButtonMapEvent: 'busanmap_International_market',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/xdphsWw1',
        mapEvent: 'busanmap_NaverInternational_market',
      },
    ],
  },
  {
    id: 'BIFF-square',
    category: 'free',
    name: 'BIFF 廣場',
    description: '吃糖餅',
    lat: 35.098243,
    lng: 129.029212,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Jv8mzkDq4CMQJM6S9',
    mapButtonMapEvent: 'busanmap_BIFF_square',
    spotActions: [
      {
        label: '介紹',
        className: "btn primary",
        href: 'https://www.instagram.com/reel/DLKer30zmDd/',
        mapEvent: 'busanmap_BIFF_squareIG',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/FDnCfOLW',
        mapEvent: 'busanmap_NaverBIFF_square',
      },
    ],
  },
  {
    id: 'Jagalchi-market',
    category: 'free',
    name: '札嘎其市場',
    description: '海鮮市場',
    lat: 35.0966339,
    lng: 129.0307965,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/MsdxNx816XE1XLmU8',
    mapButtonMapEvent: 'busanmap_Jagalchi_market',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/x52LM68U',
        mapEvent: 'busanmap_NaverJagalchi_market',
      },
    ],
  },
  {
    id: 'BIFF-street',
    category: 'free',
    name: '光復路時尚街',
    description: '逛街',
    lat: 35.0993125,
    lng: 129.0314375,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/jCKjmxUDp9AwyRYs8',
    mapButtonMapEvent: 'busanmap_Jagalchi_market',
    spotActions: [
      {
        label: 'NaverMap',
        href: 'https://naver.me/Gsj2q3ln',
        mapEvent: 'busanmap_NaverBIFF_street',
      },
    ],
  },
  {
    id: 'Cultural-village',
    category: 'free',
    name: '甘川洞文化村',
    description: '小王子',
    lat: 35.0973904,
    lng: 129.0105924,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/Z8CdjqBEfW9H5qnQ8',
    mapButtonMapEvent: 'busanmap_Cultural_village',
    spotActions: [
      {
        label: '介紹',
        className: "btn primary",
        href: 'https://www.instagram.com/reel/DL408o_ze1X/',
        mapEvent: 'busanmap_Cultural_villageIG',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/5iTdxyDV',
        mapEvent: 'busanmap_NaverCultural_village',
      },
    ],
  },
]
