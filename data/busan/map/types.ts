import type { CityCardAction } from '@/components/CityTabbedList'
import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'

export type BusanPlaceCategory = CityMapPlaceCategory

export type BusanMapPlace = {
  id: string
  category: BusanPlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  /** 僅地圖 UI：票券 actions + 地圖專用影片，再以 `mapNextRow` 分排；「地圖」接在第一排末 */
  spotActionRows?: CityCardAction[][]
  /** Google 地點分享連結；見 `places.ts` 內 `BUSAN_SPOT_GOOGLE_MAP_URLS` */
  spotGoogleMapsUrl?: string
  /** 方塊最後一顆「地圖」按鈕的 `data-event`；未填則用頁面預設字串 */
  mapButtonMapEvent?: string
  /** 「地圖」按鈕文字；未填則「地圖」 */
  mapButtonLabel?: string
  relatedTicketHref?: string
  relatedTicketLabel?: string
  relatedTicketEvent?: string
  hotelActions?: CityCardAction[]
}
