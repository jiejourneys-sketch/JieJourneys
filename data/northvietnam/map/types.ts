import type { CityCardAction } from '@/components/CityTabbedList'
import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'

export type NorthVietnamPlaceCategory = CityMapPlaceCategory

export type NorthVietnamMapPlace = {
  id: string
  category: NorthVietnamPlaceCategory
  name: string
  description: string
  lat: number
  lng: number
  spotActions?: CityCardAction[]
  spotActionRows?: CityCardAction[][]
  spotGoogleMapsUrl?: string
  mapButtonMapEvent?: string
  mapButtonLabel?: string
  relatedTicketHref?: string
  relatedTicketLabel?: string
  relatedTicketEvent?: string
  hotelActions?: CityCardAction[]
}
