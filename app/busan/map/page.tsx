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
    />
  )
}
