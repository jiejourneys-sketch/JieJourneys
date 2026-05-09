'use client'

import MapClient from '@/components/map/MapClient'
import { OSAKA_PASS_MAP_CENTER, osakaPassMapPlaces } from '@/data/osaka/pass-map/places'

export default function OsakaPassMapPage() {
  return (
    <MapClient
      places={osakaPassMapPlaces}
      mapCenter={OSAKA_PASS_MAP_CENTER}
      gtagPrefix="osakapassmap"
      title="大阪周遊券地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '免費設施' },
        { key: 'free', label: '優惠設施' },
        { key: 'food', label: '店家優惠' },
      ]}
    />
  )
}
