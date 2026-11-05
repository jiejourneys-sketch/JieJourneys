'use client'

import { useMemo, useState, type ReactNode } from 'react'
import MapClient from '@/components/map/MapClient'
import type { MapPlace } from '@/lib/mapPlace'
import { winterEvents, winterMapPlaces, winterScheduleLines, winterRegions, type WinterRegionId } from '@/data/japan/winter-illuminations-2026'
import styles from './winterGuide.module.css'

function activityDetails(place: MapPlace) {
  const event = winterEvents.find((item) => item.id === place.id)!
  return <dl className={styles.cardFacts}>
    <div><dt>日期</dt><dd>{winterScheduleLines(event).map((line) => <span key={line} className={styles.cardPeriod}>{line}</span>)}</dd></div>
    <div><dt>費用</dt><dd>{event.fee}</dd></div>
    {!!event.closedDates?.length && <div><dt>休息日</dt><dd>{event.closedDates.map((date) => date.replaceAll('-', '/')).join('、')}</dd></div>}
  </dl>
}

export default function WinterGuideMap({ initialRegion = 'tokyo', backHref, children }: { initialRegion?: WinterRegionId; backHref: string; children: ReactNode }) {
  const [region, setRegion] = useState<WinterRegionId>(initialRegion)
  const activeRegion = winterRegions.find((item) => item.id === region)!
  const places = useMemo(() => winterMapPlaces.filter((place) => winterEvents.some((event) => event.id === place.id && event.region === region)), [region])

  return (
    <div id="activity-map">
      <MapClient
        key={region}
        places={places}
        mapCenter={activeRegion.center}
        mapZoom={14}
        initialFitToPlaces={places.length > 1}
        gtagPrefix="winter2026map"
        title="2026 日本熱門耶誕活動地圖"
        backHref={backHref}
        defaultCategories={{ spot: true, ticket: true }}
        showCategoryFilters={false}
        categoryItems={[{ key: 'spot', keys: ['spot', 'ticket'], label: '耶誕活動' }]}
        categoryLabels={{ spot: '耶誕活動', ticket: '耶誕活動' }}
        filterContent={<div className={styles.regionFilter}>
          <label className={styles.regionPicker}>
            <span>地區</span>
            <select value={region} onChange={(event) => setRegion(event.target.value as WinterRegionId)} data-event="winter2026map_region_select" data-item={region}>
              {winterRegions.map((item) => <option key={item.id} value={item.id}>{item.name}（{winterEvents.filter((event) => event.region === item.id).length} 處）</option>)}
            </select>
          </label>
          <div className={`tabs ${styles.regionTabs}`} role="group" aria-label="地圖地區">
            {winterRegions.map((item) => <button className={`tab${region === item.id ? ' active' : ''}`} key={item.id} type="button" aria-pressed={region === item.id} onClick={() => setRegion(item.id)} data-event={`winter2026map_region_${item.id}`}>{item.name}</button>)}
          </div>
        </div>}
        placeDetails={activityDetails}
        topActions={[
          { label: '東京攻略', href: '/tokyo', event: 'winter2026map_top_tokyo', platform: 'article', group: 'guide', groupLabel: '攻略' },
          { label: '大阪攻略', href: '/osaka', event: 'winter2026map_top_osaka', platform: 'article', group: 'guide', groupLabel: '攻略' },
        ]}
        belowContent={children}
      />
    </div>
  )
}
