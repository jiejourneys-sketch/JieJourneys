/// <reference types="google.maps" />

import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'

/**
 * 與釜山地圖一致：票券紅／景點藍／商店黑水滴釘＋白邊陰影；住宿為旅館方塊圖示。
 */
const BUSAN_PIN_PATH_D =
  'M15 4.5c-4.1 0-7.4 3.3-7.4 7.4 0 5.6 7.4 14 7.4 14s7.4-8.4 7.4-14c0-4.1-3.3-7.4-7.4-7.4z'

function teardropPinDataUrl(fillHex: string): string {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <defs>
    <filter id="bp" x="-45%" y="-35%" width="190%" height="170%">
      <feDropShadow dx="0" dy="1.3" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#bp)">
    <path fill="${fillHex}" stroke="#ffffff" stroke-width="1.75" stroke-linejoin="round" d="${BUSAN_PIN_PATH_D}"/>
    <circle cx="15" cy="10.8" r="2.45" fill="#ffffff"/>
  </g>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

const SPOT_PIN_URL = teardropPinDataUrl('#EA4335')
// 景點（free）：藍色
const FREE_PIN_URL = teardropPinDataUrl('#2563eb')
// 商店（food）：黑色
const FOOD_PIN_URL = teardropPinDataUrl('#0b0f19')

const HOTEL_MARKER_ENCODED = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
  <path fill="#dc2626" stroke="#ffffff" stroke-width="4" d="M5 17h28v18H5z"/>
  <path fill="#fbbf24" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" d="M3 17L19 8l16 9"/>
  <rect x="14" y="24" width="10" height="11" rx="1.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5"/>
</svg>`.replace(/\s+/g, ' ')
    .trim(),
)

const HOTEL_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${HOTEL_MARKER_ENCODED}`

const LAYOUT = { w: 30, h: 30, ax: 15, ay: 27 } as const

export function cityMapMarkerIcon(
  category: CityMapPlaceCategory,
  g: typeof google.maps,
): google.maps.Icon {
  const { w, h, ax, ay } = LAYOUT
  const base = { scaledSize: new g.Size(w, h), anchor: new g.Point(ax, ay) }
  if (category === 'hotel') {
    return { ...base, url: HOTEL_MARKER_URL }
  }
  if (category === 'free') {
    return { ...base, url: FREE_PIN_URL }
  }
  if (category === 'food') {
    return { ...base, url: FOOD_PIN_URL }
  }
  return { ...base, url: SPOT_PIN_URL }
}

export function cityMapMarkerZIndex(category: CityMapPlaceCategory): number {
  if (category === 'spot') return 5
  if (category === 'hotel') return 2
  return 3
}
