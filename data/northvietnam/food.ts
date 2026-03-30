import type { CityCardAction } from '@/components/CityTabbedList'
import type { NorthVietnamMapPlace } from '@/data/northvietnam/map/types'

/**
 * 北越地圖｜美食類釘點（與 `hotels.ts`、`tickets.ts` 同層；複製後改 id／座標／按鈕）
 */
const exampleAction: CityCardAction[] = [
  {
    label: '範例連結（請改）',
    href: 'https://www.google.com/',
    mapEvent: 'nv_map_food_example',
  },
]

export const northVietnamFoodMapPlaces: NorthVietnamMapPlace[] = [
  {
    id: 'northvietnam-TrangTienPlaza',
    category: 'food',
    name: 'Trang Tien Plaza',
    description: '購物中心',
    lat: 21.0248168,
    lng: 105.8532846,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/qs5mgCRp8ebGmvKn9',
    mapButtonMapEvent: 'northvietnamMap_TrangTienPlazaMap',
    spotActions: [
    ],
  },
  {
    id: 'northvietnam-VincomCenterMetropolis',
    category: 'food',
    name: 'Vincom Center Metropolis',
    description: '購物中心',
    lat: 21.0313057,
    lng: 105.8147359,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/g8MhfX5KH9b1rnAEA',
    mapButtonMapEvent: 'northvietnamMap_VincomCenterMetropolisMap',
    spotActions: [
    ],
  },
  {
    id: 'northvietnam-VincomCenterBaTrieu',
    category: 'food',
    name: 'Vincom Center Ba Trieu',
    description: '購物中心',
    lat: 21.0108794,
    lng: 105.8495797,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/4eMZaVBtctsgJ51j7',
    mapButtonMapEvent: 'northvietnamMap_VincomCenterBaTrieuMap',
    spotActions: [
    ],
  },
  {
    id: 'northvietnam-TheGardenShoppingCenter',
    category: 'food',
    name: 'The Garden Shopping Center',
    description: '購物中心',
    lat: 21.0151696,
    lng: 105.7776755,
    spotGoogleMapsUrl: 'https://maps.app.goo.gl/f3zjzabDUuhzstqKA',
    mapButtonMapEvent: 'northvietnamMap_TheGardenShoppingCenterMap',
    spotActions: [
    ],
  },
]
