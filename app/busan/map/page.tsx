'use client'

import MapClient from '@/components/map/MapClient'
import { busanMapPlaces, BUSAN_MAP_CENTER } from '@/data/busan/map/places'

export default function BusanMapPage() {
  return (
    <MapClient
      places={busanMapPlaces}
      mapCenter={BUSAN_MAP_CENTER}
      gtagPrefix="busanmap"
      title="釜山地圖"
      backHref="/busan"
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
