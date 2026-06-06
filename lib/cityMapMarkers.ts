/// <reference types="google.maps" />

import type { CityMapPlaceCategory } from '@/lib/cityMapPlaceCategory'
import type { MapPlace } from '@/lib/mapPlace'

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

const SPOT_PIN_URL = teardropPinDataUrl('#2563eb')
// 景點（free）：藍色
const FREE_PIN_URL = teardropPinDataUrl('#2563eb')
// 餐廳：橘色；商店：黑色
const RESTAURANT_PIN_URL = teardropPinDataUrl('#f97316')
const SHOP_PIN_URL = teardropPinDataUrl('#111827')

function myMapsInnerIconSvg(styleId?: string): string {
  const iconId = styleId?.match(/^icon-(\d+)-/)?.[1]
  if (iconId === '1577') {
    return `
      <g fill="none" stroke="#ffffff" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.4 6.6v4.2"/>
        <path d="M8.8 6.6v3.7c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6V6.6"/>
        <path d="M10.4 11.9v5.4"/>
        <path d="M18.5 6.8c-1.8.8-2.8 2.4-2.8 4.8v1.2h2.8v4.5"/>
      </g>
    `
  }
  if (iconId === '1686') {
    return `
      <g fill="none" stroke="#ffffff" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 11.5h12"/>
        <path d="M10 11.5v5.6h10v-5.6"/>
        <path d="M11 8.2h8l1.2 3.3H9.8z"/>
        <path d="M13.2 17.1v-2.7h3.6v2.7"/>
      </g>
    `
  }
  if (iconId === '1535') {
    return `
      <g fill="none" stroke="#ffffff" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 10.1h3l.8-1.5h4.4l.8 1.5h3v6.8H9z"/>
        <circle cx="15" cy="13.8" r="2.1"/>
      </g>
    `
  }
  if (iconId === '1549') {
    return `
      <g fill="none" stroke="#ffffff" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 8.4c1.3 0 2.1.8 2.1 1.8 0 1.6-2.1 1.4-2.1 3"/>
        <path d="M15 13.2l-6 3.8h12z"/>
      </g>
    `
  }
  if (iconId === '1523') {
    return `
      <g fill="none" stroke="#ffffff" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.4 9.6h2.6l1.1 2.2"/>
        <path d="M19.6 9.6H17l-1.1 2.2"/>
        <circle cx="11.3" cy="14" r="2.6"/>
        <circle cx="18.7" cy="14" r="2.6"/>
        <path d="M13.9 14h2.2"/>
      </g>
    `
  }
  return ''
}

function blankMyMapsPinDataUrl(fillHex: string): string {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <defs>
    <filter id="bp" x="-45%" y="-35%" width="190%" height="170%">
      <feDropShadow dx="0" dy="1.3" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#bp)">
    <path fill="${fillHex}" stroke="#ffffff" stroke-width="1.75" stroke-linejoin="round" d="${BUSAN_PIN_PATH_D}"/>
  </g>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

function myMapsBadgeDataUrl(fillHex: string, styleId: string): string {
  const innerIcon = myMapsInnerIconSvg(styleId)
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <defs>
    <filter id="bp" x="-35%" y="-35%" width="170%" height="170%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>
  <g filter="url(#bp)">
    <circle cx="15" cy="15" r="11.8" fill="${fillHex}" stroke="#ffffff" stroke-width="1.6"/>
    <g transform="translate(0 2)">${innerIcon}</g>
  </g>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

const HOTEL_MARKER_ENCODED = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
  <path fill="#8b5e34" stroke="#ffffff" stroke-width="4" d="M5 17h28v18H5z"/>
  <path fill="#b7793f" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" d="M3 17L19 8l16 9"/>
  <rect x="14" y="24" width="10" height="11" rx="1.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5"/>
</svg>`.replace(/\s+/g, ' ')
    .trim(),
)

const HOTEL_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${HOTEL_MARKER_ENCODED}`

const LAYOUT = { w: 30, h: 30, ax: 15, ay: 27 } as const

export function selectedMarkerArrowIcon(g: typeof google.maps, anchorY = 54): google.maps.Icon {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="26" viewBox="0 0 30 26">
  <defs>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path filter="url(#shadow)" d="M15 24 5.5 12.5h5.2V5h8.6v7.5h5.2z" fill="#b45309" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
</svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`,
    scaledSize: new g.Size(30, 26),
    anchor: new g.Point(15, anchorY),
  }
}

export function cityMapMarkerIcon(
  category: CityMapPlaceCategory,
  g: typeof google.maps,
  place?: Pick<MapPlace, 'markerColor' | 'markerIconUrl' | 'markerStyleId'>,
): google.maps.Icon {
  const { w, h, ax, ay } = LAYOUT
  const base = { scaledSize: new g.Size(w, h), anchor: new g.Point(ax, ay) }
  if (place?.markerColor && isHexColor(place.markerColor)) {
    const hasBadgeIcon = place.markerStyleId && myMapsInnerIconSvg(place.markerStyleId) !== ''
    if (place.markerStyleId && hasBadgeIcon) {
      return {
        scaledSize: new g.Size(30, 30),
        anchor: new g.Point(15, 15),
        url: myMapsBadgeDataUrl(place.markerColor, place.markerStyleId),
      }
    }
    return { ...base, url: blankMyMapsPinDataUrl(place.markerColor) }
  }
  if (category === 'hotel') {
    return { ...base, url: HOTEL_MARKER_URL }
  }
  if (category === 'ticket' || category === 'spot' || category === 'free') {
    return { ...base, url: FREE_PIN_URL }
  }
  if (category === 'restaurant') {
    return { ...base, url: RESTAURANT_PIN_URL }
  }
  if (category === 'shop' || category === 'food') {
    return { ...base, url: SHOP_PIN_URL }
  }
  return { ...base, url: SPOT_PIN_URL }
}

export function cityMapMarkerZIndex(category: CityMapPlaceCategory): number {
  if (category === 'ticket' || category === 'spot') return 5
  if (category === 'hotel') return 2
  return 3
}
