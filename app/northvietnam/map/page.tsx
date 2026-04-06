'use client'

import MapClient from '@/components/map/MapClient'
import { northVietnamMapPlaces, NORTH_VIETNAM_MAP_CENTER } from '@/data/northvietnam'

export default function NorthVietnamMapPage() {
  return (
    <MapClient
      places={northVietnamMapPlaces}
      mapCenter={NORTH_VIETNAM_MAP_CENTER}
      gtagPrefix="northvietnammap"
      title="北越地圖"
      backHref="/northvietnam"
    />
  )
}
