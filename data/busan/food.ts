import type { CityCardAction } from '@/components/CityTabbedList'
import type { BusanMapPlace } from '@/data/busan/map/types'

/**
 * 釜山地圖｜商店類別（`category: 'food'`，畫面上為「商店」）
 *
 * - `spotGoogleMapsUrl`：**地圖**按鈕開的連結，請貼 `https://maps.app.goo.gl/...`。
 *   若還沒有短網址，可暫留 `PASTE_YOUR_MAPS_LINK`，按鈕會改用 lat/lng 釘點。
 * - 其他按鈕（Naver 等）：放在 `spotActions`，`{ label, href, mapEvent }` 複製即可。
 */
const MAP_LINK_PLACEHOLDER = 'PASTE_YOUR_MAPS_LINK'

export const busanFoodMapPlaces: BusanMapPlace[] = [
  {
    id: 'busan-lotteoutlet',
    category: 'food',
    name: '樂天Outlet',
    description: '',
    lat: 35.1916524,
    lng: 129.2137288,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/FULoB51aB2jh9pHWA',
    spotActions: [
      {
        label: '樓層介紹',
        className: "btn primary",
        href: 'https://global.lotteshopping.com/cht/store/floor?cstrCd=0352',
        mapEvent: 'busanmap_LotteOutlet_floor',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/GwpMkOIT',
        mapEvent: 'busanmap_NaverLotteOutlet',
      },
    ],
  },
  {
    id: 'busan-Seomyeonlotte',
    category: 'food',
    name: '樂天百貨(釜山本店)',
    description: '',
    lat: 35.1564378,
    lng: 129.0556096,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/5iHUfqqRXVGprvHaA',
    spotActions: [
      {
        label: '樓層介紹',
        className: "btn primary",
        href: 'https://global.lotteshopping.com/cht/store/floor?cstrCd=0005',
        mapEvent: 'busanmap_Seomyeonlotte_floor',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/xZVbDc9R',
        mapEvent: 'busanmap_NaverSeomyeonlotte',
      },
    ],
  },
  {
    id: 'busan-Nampodonglotte',
    category: 'food',
    name: '樂天百貨(南浦洞光復店)',
    description: '',
    lat: 35.0981871,
    lng: 129.0366183,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/M1Ag432izwFX7xtv9',
    spotActions: [
      {
        label: '樓層介紹',
        className: "btn primary",
        href: 'https://global.lotteshopping.com/cht/store/floor?cstrCd=0333',
        mapEvent: 'busanmap_Nampodonglotte_floor',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/xucpJ9UW',
        mapEvent: 'busanmap_NaverNampodonglotte',
      },
    ],
  },
  {
    id: 'busan-CentumCitylotte',
    category: 'food',
    name: '新世界百貨(釜山Centum City店)',
    description: '',
    lat: 35.1689218,
    lng: 129.1296311,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/NPzQqU22eTYUWKGk8',
    spotActions: [
      {
        label: '樓層介紹',
        className: "btn primary",
        href: 'https://shinsegae.cn/store/introduce.do?storeSeq=3',
        mapEvent: 'busanmap_CentumCitylotte_floor',
      },
      {
        label: 'NaverMap',
        href: 'https://naver.me/5chuGOAf',
        mapEvent: 'busanmap_NaverCentumCitylotte',
      },
    ],
  },
]
