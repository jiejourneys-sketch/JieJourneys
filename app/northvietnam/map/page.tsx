'use client'

import MapClient from '@/components/map/MapClient'
import { northVietnamMapPlaces } from '@/data/northvietnam'

export default function NorthVietnamMapPage() {
  return (
    <MapClient
      places={northVietnamMapPlaces}
      mapCenter={{ lat: 21.3, lng: 105.45 }}
      mapZoom={7}
      gtagPrefix="northvietnammap"
      title="北越地圖"
      backHref="/northvietnam"
      defaultCategories={{ spot: true, free: true, food: false, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'food', label: '商店' },
        { key: 'hotel', label: '住宿' },
      ]}
    />
  )
}
