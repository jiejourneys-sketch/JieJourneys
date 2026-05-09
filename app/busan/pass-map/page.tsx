'use client'

import MapClient from '@/components/map/MapClient'
import { BUSAN_PASS_MAP_CENTER, busanPassMapPlaces } from '@/data/busan/pass-map/places'

const categoryLabels = {
  spot: '價格高',
  free: '價格中',
  food: '價格低',
  hotel: '住宿',
}

export default function BusanPassMapPage() {
  return (
    <MapClient
      places={busanPassMapPlaces}
      mapCenter={BUSAN_PASS_MAP_CENTER}
      gtagPrefix="busanpassmap"
      title="釜山通行證地圖"
      backHref="/busan"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryLabels={categoryLabels}
      categoryItems={[
        { key: 'spot', label: '價格高' },
        { key: 'free', label: '價格中' },
        { key: 'food', label: '價格低' },
      ]}
    />
  )
}
