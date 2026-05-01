'use client'

import MapClient from '@/components/map/MapClient'
import { osakaMapPlaces, OSAKA_MAP_CENTER } from '@/data/osaka/map/places'

export default function OsakaMapPage() {
  return (
    <MapClient
      places={osakaMapPlaces}
      mapCenter={OSAKA_MAP_CENTER}
      gtagPrefix="osakamap"
      title="大阪地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: false, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'hotel', label: '住宿' },
      ]}
    />
  )
}