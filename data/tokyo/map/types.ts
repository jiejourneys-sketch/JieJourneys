import type { CityCardAction } from '@/components/CityTabbedList'
import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'

export type PlaceCategory = CityMapPlaceCategory

export type TokyoMapPlace = {
  id: string
  category: PlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  /** 僅地圖：依 `mapNextRow` 分排；與釜山相同 */
  spotActionRows?: CityCardAction[][]
  spotGoogleMapsUrl?: string
  mapButtonMapEvent?: string
  mapButtonLabel?: string
  relatedTicketHref?: string
  relatedTicketLabel?: string
  relatedTicketEvent?: string
  hotelActions?: CityCardAction[]
}
