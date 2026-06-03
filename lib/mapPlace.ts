import type { CityCardAction } from '@/components/CityTabbedList'
import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'

/** 城市地圖共用地點型別（釜山 / 東京 / 北越結構一致） */
export type MapPlace = {
  id: string
  category: CityMapPlaceCategory
  plannerCategory?: CityMapPlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  spotActionRows?: CityCardAction[][]
  spotGoogleMapsUrl?: string
  mapButtonMapEvent?: string
  mapButtonLabel?: string
  markerColor?: string
  markerIconUrl?: string
  markerStyleId?: string
  officialPassTier?: 'purple' | 'blue'
  relatedTicketHref?: string
  relatedTicketLabel?: string
  relatedTicketEvent?: string
  hotelActions?: CityCardAction[]
}
