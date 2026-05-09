'use client'

import MapClient from '@/components/map/MapClient'
import { OSAKA_MAP_CENTER, osakaMapPlaces } from '@/data/osaka/map/places'

export default function OsakaMapPage() {
  return (
    <MapClient
      places={osakaMapPlaces}
      mapCenter={{ lat: 34.733, lng: 135.555 }}
      mapZoom={10}
      gtagPrefix="osakamap"
      title="大阪熱門景點地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: false, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'hotel', label: '住宿' },
      ]}
      categoryLabels={{
        spot: '票券',
        free: '景點',
        hotel: '住宿',
      }}
    />
  )
}
