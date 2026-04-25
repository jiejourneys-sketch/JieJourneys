'use client'

import MapClient from '@/components/map/MapClient'
import { fujiMapPlaces, FUJI_MAP_CENTER } from '@/data/fuji'

export default function FujiMapPage() {
  return (
    <MapClient
      places={fujiMapPlaces}
      mapCenter={FUJI_MAP_CENTER}
      gtagPrefix="fujimap"
      title="富士河口湖地圖"
      backHref="/fuji"
      defaultCategories={{ spot: true, free: true, food: false, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'hotel', label: '住宿' },
      ]}
    />
  )
}
