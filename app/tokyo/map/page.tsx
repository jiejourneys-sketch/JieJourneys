'use client'

import MapClient from '@/components/map/MapClient'
import { tokyoMapPlaces, TOKYO_MAP_CENTER } from '@/data/tokyo'

export default function TokyoMapPage() {
  return (
    <MapClient
      places={tokyoMapPlaces}
      mapCenter={TOKYO_MAP_CENTER}
      gtagPrefix="tokyomap"
      title="東京地圖"
      backHref="/tokyo"
    />
  )
}
