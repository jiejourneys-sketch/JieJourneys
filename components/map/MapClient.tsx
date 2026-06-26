'use client'
/// <reference types="google.maps" />

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import type { CityCardAction } from '@/components/CityTabbedList'
import Footer from '@/components/Footer'
import {
  CITY_MAP_CATEGORY_LABEL,
  CITY_MAP_CATEGORY_TOGGLE_ITEMS,
  DEFAULT_CITY_MAP_CATEGORY_ON,
  cityMapCategoriesAllOn,
  cityMapSoloCategory,
  type CityMapPlaceCategory,
} from '@/lib/cityMapPlaceCategory'
import { cityMapMarkerIcon, cityMapMarkerZIndex, selectedMarkerArrowIcon } from '@/lib/cityMapMarkers'
import { getGtag } from '@/lib/gtag'
import { fireMapMarkerGtag, mapBarCardDataEvent } from '@/lib/mapGtag'
import { clearSmartMapLabels, syncSmartMapLabels, type SmartMapLabelOverlay } from '@/lib/mapSmartLabels'
import styles from '@/app/tokyo/map/map.module.css'
import type { MapPlace } from '@/lib/mapPlace'
import type { MapRouteOverlay } from '@/lib/mapRoute'

export type MapClientProps = {
  places: MapPlace[]
  mapCenter: { lat: number; lng: number }
  mapZoom?: number
  /** e.g. 'busanmap' | 'tokyomap' | 'northvietnammap' */
  gtagPrefix: string
  title: string
  backHref: string
  /** Override which categories are ON at mount. Defaults to solo 'spot'. */
  defaultCategories?: Partial<Record<CityMapPlaceCategory, boolean>>
  /** Override which category toggle buttons to show. Defaults to all four. */
  categoryItems?: { key: CityMapPlaceCategory; label: string; keys?: CityMapPlaceCategory[] }[]
  /** Override category labels used in cards, list sections, and marker titles. */
  categoryLabels?: Partial<Record<CityMapPlaceCategory, string>>
  officialPassTierItems?: { key: NonNullable<MapPlace['officialPassTier']>; label: string }[]
  routeLayers?: MapRouteOverlay[]
  initialFitToPlaces?: boolean
  topActions?: {
    label: string
    href: string
    event: string
    platform: string
    primary?: boolean
    external?: boolean
    placement?: 'afterBelowContent'
  }[]
  /** Static content rendered below the interactive map, before the footer. */
  belowContent?: ReactNode
}

const CATEGORY_LABEL = CITY_MAP_CATEGORY_LABEL

const DESKTOP_MQ = '(min-width: 960px)'
const MOBILE_MAP_MQ = '(max-width: 959px)'
const LOCATION_RECENTER_MIN_DISTANCE_METERS = 2
const LOCATION_FOLLOW_ZOOM = 16
const LOCATION_HEADING_UP_ZOOM = 18

function useMobileMapLayout() {
  const [yes, setYes] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MAP_MQ)
    const go = () => setYes(mq.matches)
    go()
    mq.addEventListener('change', go)
    return () => mq.removeEventListener('change', go)
  }, [])
  return yes
}

/** 實際測量導覽列高度，避免 --navH 與換行後真實高度不符造成上方留白 */
function useSiteHeaderHeightPx() {
  const [h, setH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const read = () => {
      const el = document.querySelector('header')
      if (!el) return
      const next = Math.ceil(el.getBoundingClientRect().height)
      if (next > 0) setH(next)
    }
    read()
    const el = document.querySelector('header')
    if (!el) return
    const ro = new ResizeObserver(read)
    ro.observe(el)
    window.addEventListener('resize', read)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [])
  return h
}

function cityMapSectionRowClass(category: CityMapPlaceCategory) {
  if (category === 'ticket' || category === 'spot') return styles.rowSpot
  if (category === 'free') return styles.rowFree
  if (category === 'restaurant') return styles.rowRestaurant
  if (category === 'shop' || category === 'food') return styles.rowShop
  if (category === 'hotel') return styles.rowHotel
  return styles.rowFree
}

function categoryItemKeys(item: { key: CityMapPlaceCategory; keys?: CityMapPlaceCategory[] }) {
  return item.keys?.length ? item.keys : [item.key]
}

function cityMapSectionLabel(category: CityMapPlaceCategory, label: string) {
  if (category === 'ticket' || label.includes('票券')) return '票券頁相同連結'
  if (category === 'hotel') return '與住宿頁相同連結'
  return ''
}

function locationPermissionGuide() {
  if (typeof navigator === 'undefined') return '點網址列左側圖示 → 位置 → 允許，再按一次定位。'
  const ua = navigator.userAgent
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|EdgiOS|OPR|SamsungBrowser/i.test(ua)
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg|EdgiOS|OPR/i.test(ua)

  if (isIOS && isSafari) return 'iPhone Safari：設定 → 隱私權與安全性 → 定位服務 → Safari 網站 → 允許，再按一次定位。'
  if (isIOS && isChrome) return 'iPhone Chrome：設定 → 隱私權與安全性 → 定位服務 → Chrome → 允許，再按一次定位。'
  if (isAndroid && isChrome) return 'Android Chrome：設定 → 應用程式 → Chrome → 權限 → 位置 → 允許，再按一次定位。'
  if (isChrome) return 'Chrome：點網址列左側圖示 → 位置 → 允許，再按一次定位。'
  return '點網址列左側圖示 → 位置 → 允許，再按一次定位。'
}

/** 與各城市地圖共用，避免重複插入 script */
const SCRIPT_ID = 'gmaps-js'

/** 以目前景點 lat/lng 開啟 Google 地圖釘點（非導航路線） */
function googleMapsPinUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function userLocationIcon(
  heading: number | null,
  fillColor = '#2563eb',
): google.maps.Icon {
  const cone =
    typeof heading === 'number' && Number.isFinite(heading)
      ? `<path d="M48 48 L22 10 A48 48 0 0 1 74 10 Z" fill="#4f7df3" fill-opacity="0.42" transform="rotate(${heading} 48 48)"/>`
      : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.28"/>
      </filter>
    </defs>
    ${cone}
    <circle cx="48" cy="48" r="18" fill="#ffffff" filter="url(#shadow)"/>
    <circle cx="48" cy="48" r="11" fill="${fillColor}"/>
  </svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`,
    scaledSize: new google.maps.Size(68, 68),
    anchor: new google.maps.Point(34, 34),
  }
}

function locationHeadingFromPosition(pos: GeolocationPosition) {
  return typeof pos.coords.heading === 'number' && Number.isFinite(pos.coords.heading) ? pos.coords.heading : null
}

type CompassDeviceOrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number }

function locationHeadingFromOrientation(event: DeviceOrientationEvent) {
  const compassEvent = event as CompassDeviceOrientationEvent
  if (typeof compassEvent.webkitCompassHeading === 'number' && Number.isFinite(compassEvent.webkitCompassHeading)) {
    return compassEvent.webkitCompassHeading
  }
  if (event.absolute && typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
    return (360 - event.alpha + 360) % 360
  }
  return null
}

async function requestDeviceOrientationAccess() {
  if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') return false
  const orientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<PermissionState>
  }
  if (typeof orientationEvent.requestPermission !== 'function') return true
  try {
    return (await orientationEvent.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function interpolatePosition(
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral,
  progress: number,
): google.maps.LatLngLiteral {
  const eased = easeOutCubic(progress)
  return {
    lat: from.lat + (to.lat - from.lat) * eased,
    lng: from.lng + (to.lng - from.lng) * eased,
  }
}

function movementHeading(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) {
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const dLng = ((to.lng - from.lng) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

function reliableMovementHeading(
  pos: GeolocationPosition,
  from: google.maps.LatLngLiteral | null,
  to: google.maps.LatLngLiteral,
) {
  if (!from) return null
  const distance = distanceMeters(from, to)
  const speed = typeof pos.coords.speed === 'number' && Number.isFinite(pos.coords.speed) ? pos.coords.speed : null
  const accuracy =
    typeof pos.coords.accuracy === 'number' && Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null
  if (speed !== null && speed < 0.7 && distance < 12) return null
  const minDistance = speed !== null && speed >= 0.7 ? 2.5 : Math.max(6, Math.min(18, (accuracy ?? 20) * 0.35))
  return distance >= minDistance ? movementHeading(from, to) : null
}

function routeStopIconUrl(color: string): string {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <circle cx="15" cy="15" r="12" fill="${color}" stroke="#ffffff" stroke-width="3"/>
    <circle cx="15" cy="15" r="4" fill="#ffffff"/>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

const MAP_URL_PLACEHOLDER_TOKEN = 'PASTE_YOUR_MAPS_LINK'

function spotMapButtonHref(place: MapPlace): string {
  const url = place.spotGoogleMapsUrl?.trim()
  if (url && !url.includes(MAP_URL_PLACEHOLDER_TOKEN)) return url
  return googleMapsPinUrl(place.lat, place.lng)
}

function mapBarMapButtonEvent(place: MapPlace, defaultEvent: string): string {
  const e = place.mapButtonMapEvent?.trim()
  return e || defaultEvent
}

function mapBarMapButtonLabel(place: MapPlace): string {
  const t = place.mapButtonLabel?.trim()
  return t || '地圖'
}

function cityMapLegendDefaultColor(category: CityMapPlaceCategory) {
  if (category === 'ticket' || category === 'spot' || category === 'free') return '#2563eb'
  if (category === 'restaurant') return '#f97316'
  if (category === 'shop' || category === 'food') return '#111827'
  if (category === 'hotel') return '#8b5e34'
  return '#2563eb'
}

function cityMapLegendColorName(color: string, context: string) {
  if (context.includes('osakapassmap')) {
    switch (color.toLowerCase()) {
      case '#ff5252':
        return '價值高'
      case '#ffea00':
        return '價值中'
      case '#0f9d58':
        return '價值低'
      case '#757575':
        return '優惠較好'
      case '#bdbdbd':
        return '優惠普通'
      default:
        return '標記'
    }
  }
  switch (color.toLowerCase()) {
    case '#ff5252':
      return '價格高'
    case '#ffea00':
      return '價格中'
    case '#0f9d58':
      return '價格低'
    case '#616161':
    case '#757575':
      return '高價值優惠'
    case '#9e9e9e':
    case '#bdbdbd':
      return '低價值優惠'
    default:
      return '標記'
  }
}

function cityMapLegendOrder(category: CityMapPlaceCategory, color: string, usesSourceMarkerColor: boolean) {
  if (usesSourceMarkerColor) {
    const colorOrder: Record<string, number> = {
      '#ff5252': 10,
      '#ffea00': 20,
      '#0f9d58': 30,
      '#616161': 40,
      '#757575': 40,
      '#9e9e9e': 50,
      '#bdbdbd': 50,
    }
    return colorOrder[color.toLowerCase()] ?? 90
  }
  if (category === 'ticket' || category === 'spot' || category === 'free') return 100
  if (category === 'restaurant') return 110
  if (category === 'shop' || category === 'food') return 120
  if (category === 'hotel') return 130
  return 140
}

function cityMapLegendLabel(
  category: CityMapPlaceCategory,
  color: string,
  usesSourceMarkerColor: boolean,
  categoryLabels: Record<CityMapPlaceCategory, string>,
  context: string,
) {
  if (usesSourceMarkerColor) {
    const sourceLabel = cityMapLegendColorName(color, context)
    return sourceLabel === '標記' ? categoryLabels[category] : sourceLabel
  }
  if (context.includes('passmap')) return categoryLabels[category]
  if (category === 'ticket' || category === 'spot' || category === 'free') return '票券/景點'
  return categoryLabels[category]
}

function cityMapMarkerValueLabel(
  place: MapPlace,
  categoryLabels: Record<CityMapPlaceCategory, string>,
  context: string,
) {
  if (!place.markerColor) return null
  const valueLabel = cityMapLegendColorName(place.markerColor, context)
  if (valueLabel === '標記') return null
  if (valueLabel === categoryLabels[place.category]) return null
  return valueLabel
}

function cityMapCategoryPillStyle(place: MapPlace, context: string): CSSProperties | undefined {
  if (context.includes('osakapassmap')) return undefined
  return { '--category-pill-color': place.markerColor ?? cityMapLegendDefaultColor(place.category) } as CSSProperties
}

function relatedTicketButtonLabel(place: MapPlace): string {
  const t = place.relatedTicketLabel?.trim()
  return t || '含此景點的一日遊'
}

function relatedTicketButtonEvent(place: MapPlace, gtagPrefix: string): string {
  const e = place.relatedTicketEvent?.trim()
  return e || `${gtagPrefix}_${place.id.replace(/-/g, '_').toLowerCase()}_ticket`
}

function hasPrimarySpotAction(place: MapPlace): boolean {
  const actions = place.spotActionRows?.flat() ?? place.spotActions ?? []
  return actions.some((a) => a.className?.split(/\s+/).includes('primary'))
}

function isNaverMapAction(action: { label: string; href: string }) {
  return action.label.toLowerCase() === 'navermap' || action.href.includes('naver.me')
}

function isDesktopViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(DESKTOP_MQ).matches
}

function isMobileMapViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_MAP_MQ).matches
}

function panMobileMarkerAboveSheet(map: google.maps.Map) {
  if (!isMobileMapViewport()) return
  const offsetY = Math.round(window.innerHeight * 0.2)
  map.panBy(0, offsetY)
}

function getMobileSheetMetrics() {
  if (typeof window === 'undefined') return { collapsedPx: 72, expandedPx: 400 }
  const h = window.innerHeight
  return { collapsedPx: Math.round(h * 0.1), expandedPx: Math.round(h * 0.55) }
}

function scrollCardIntoScrollContainer(container: HTMLElement, card: HTMLElement) {
  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const delta =
    eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2)
  container.scrollBy({ top: delta, behavior: 'smooth' })
}

function scrollCardFullyIntoView(
  container: HTMLElement,
  card: HTMLElement,
  padding = 12,
  behavior: ScrollBehavior = 'auto',
) {
  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const innerH = cRect.height - padding * 2
  let delta = 0
  if (eRect.height > innerH) {
    delta = eRect.top - cRect.top - padding
  } else if (eRect.top < cRect.top + padding) {
    delta = eRect.top - cRect.top - padding
  } else if (eRect.bottom > cRect.bottom - padding) {
    delta = eRect.bottom - cRect.bottom + padding
  }
  if (delta !== 0) {
    container.scrollBy({ top: delta, behavior })
  }
}

type FocusSource = 'marker' | 'list'

type MapPlaceCardProps = {
  place: MapPlace
  selected: boolean
  onPick: (p: MapPlace, source: FocusSource) => void
  cardRef: (el: HTMLElement | null) => void
  gtagPrefix: string
  defaultMapButtonEvent: string
  categoryLabels: Record<CityMapPlaceCategory, string>
}

function stopCardPick(e: ReactMouseEvent<HTMLAnchorElement> | ReactPointerEvent<HTMLAnchorElement>) {
  e.stopPropagation()
}

function MapActionLink({ action, placeId }: { action: CityCardAction; placeId: string }) {
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      data-event={action.mapEvent ?? action.event}
      data-item={placeId}
      data-platform={action.platform}
      data-section={action.mapSection ?? 'map_bar'}
      className={action.className ?? 'btn'}
      onClick={stopCardPick}
      onPointerDown={stopCardPick}
    >
      {action.label}
    </a>
  )
}
function MapPlaceCard({
  place,
  selected,
  onPick,
  cardRef,
  gtagPrefix,
  defaultMapButtonEvent,
  categoryLabels,
}: MapPlaceCardProps) {
  const relatedTicketClassName = hasPrimarySpotAction(place) ? 'btn' : 'btn primary'
  const officialPassTierLabel =
    place.officialPassTier === 'purple'
      ? '紫色/A區景點'
      : place.officialPassTier === 'blue'
        ? '藍色/B區景點'
        : null
  const markerValueLabel = cityMapMarkerValueLabel(place, categoryLabels, gtagPrefix)

  return (
    <article
      ref={cardRef}
      className={`stay-card ${styles.hCardDesktop} ${selected ? styles.hCardActive : ''}`}
      role="button"
      tabIndex={0}
      data-event={mapBarCardDataEvent(gtagPrefix, place.id)}
      data-item={place.id}
      data-section="map_bar"
      data-label="bar"
      data-title={place.name}
      data-area={categoryLabels[place.category]}
      {...(place.category === 'hotel' ? { 'data-hotel': place.name } : {})}
      onClick={() => onPick(place, 'list')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPick(place, 'list')
        }
      }}
    >
      <div>
        <div className={styles.mapCardPills}>
          <span className={styles.catPill} style={cityMapCategoryPillStyle(place, gtagPrefix)}>
            {categoryLabels[place.category]}
          </span>
          {markerValueLabel ? (
            <span className={styles.markerValuePill} style={{ '--marker-value-color': place.markerColor } as CSSProperties}>
              {markerValueLabel}
            </span>
          ) : null}
          {officialPassTierLabel ? (
            <span className={`${styles.officialTierPill} ${styles[`officialTierPill_${place.officialPassTier}`]}`}>
              {officialPassTierLabel}
            </span>
          ) : null}
        </div>
        <h3 className="title">{place.name}</h3>
        <p className="desc">{place.description}</p>
        {place.hotelActions && place.hotelActions.length > 0 ? (
          <div className="actions">
            {place.hotelActions.map((a) => (
              <a
                key={`${a.label}-${a.href}`}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                data-event={a.mapEvent ?? a.event}
                data-item={place.id}
                data-platform={a.platform}
                data-section={a.mapSection ?? 'map_bar'}
                className={a.className ?? 'btn'}
                onClick={stopCardPick}
                onPointerDown={stopCardPick}
              >
                {a.label}
              </a>
            ))}
            <a
              href={spotMapButtonHref(place)}
              target="_blank"
              rel="noopener noreferrer"
              data-event={mapBarMapButtonEvent(place, defaultMapButtonEvent)}
              data-item={place.id}
              data-platform="Google Maps"
              data-section="map_bar"
              className="btn"
              onClick={stopCardPick}
              onPointerDown={stopCardPick}
            >
              {mapBarMapButtonLabel(place)}
            </a>
          </div>
        ) : null}
        {place.spotActionRows && place.spotActionRows.length > 0 ? (
          <div className={styles.mapActionsStacked}>
            {place.spotActionRows.map((row, ri) => (
              <div key={`row-${ri}`} className={styles.mapActionRow}>
                {row.filter((a) => !isNaverMapAction(a)).map((a) => (
                  <MapActionLink key={`${a.label}-${a.href}`} action={a} placeId={place.id} />
                ))}
                {ri === 0 ? (
                  <>
                    {place.relatedTicketHref ? (
                      <a
                        className={relatedTicketClassName}
                        href={place.relatedTicketHref}
                        data-event={relatedTicketButtonEvent(place, gtagPrefix)}
                        data-item={place.id}
                        data-platform="ticket"
                        data-section="map_bar"
                        onClick={stopCardPick}
                        onPointerDown={stopCardPick}
                      >
                        {relatedTicketButtonLabel(place)}
                      </a>
                    ) : null}
                    {row.filter(isNaverMapAction).map((a) => (
                      <MapActionLink key={`${a.label}-${a.href}`} action={a} placeId={place.id} />
                    ))}
                    <a
                      className="btn"
                      href={spotMapButtonHref(place)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event={mapBarMapButtonEvent(place, defaultMapButtonEvent)}
                      data-item={place.id}
                      data-platform="GoogleMaps"
                      data-section="map_bar"
                      onClick={stopCardPick}
                      onPointerDown={stopCardPick}
                    >
                      {mapBarMapButtonLabel(place)}
                    </a>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : place.spotActions && place.spotActions.length > 0 ? (
          <div className="actions">
            {place.spotActions.filter((a) => !isNaverMapAction(a)).map((a) => (
              <MapActionLink key={`${a.label}-${a.href}`} action={a} placeId={place.id} />
            ))}
            {place.relatedTicketHref ? (
              <a
                className={relatedTicketClassName}
                href={place.relatedTicketHref}
                data-event={relatedTicketButtonEvent(place, gtagPrefix)}
                data-item={place.id}
                data-platform="ticket"
                data-section="map_bar"
                onClick={stopCardPick}
                onPointerDown={stopCardPick}
              >
                {relatedTicketButtonLabel(place)}
              </a>
            ) : null}
            {place.spotActions.filter(isNaverMapAction).map((a) => (
              <MapActionLink key={`${a.label}-${a.href}`} action={a} placeId={place.id} />
            ))}
            <a
              className="btn"
              href={spotMapButtonHref(place)}
              target="_blank"
              rel="noopener noreferrer"
              data-event={mapBarMapButtonEvent(place, defaultMapButtonEvent)}
              data-item={place.id}
              data-platform="GoogleMaps"
              data-section="map_bar"
              onClick={stopCardPick}
              onPointerDown={stopCardPick}
            >
              {mapBarMapButtonLabel(place)}
            </a>
          </div>
        ) : place.category !== 'hotel' &&
          !(place.spotActions && place.spotActions.length > 0) &&
          !(place.spotActionRows && place.spotActionRows.length > 0) ? (
          <div className="actions">
            {place.relatedTicketHref ? (
              <a
                className={relatedTicketClassName}
                href={place.relatedTicketHref}
                data-event={relatedTicketButtonEvent(place, gtagPrefix)}
                data-item={place.id}
                data-platform="ticket"
                data-section="map_bar"
                onClick={stopCardPick}
                onPointerDown={stopCardPick}
              >
                {relatedTicketButtonLabel(place)}
              </a>
            ) : null}
            <a
              className="btn"
              href={spotMapButtonHref(place)}
              target="_blank"
              rel="noopener noreferrer"
              data-event={mapBarMapButtonEvent(place, defaultMapButtonEvent)}
              data-item={place.id}
              data-platform="GoogleMaps"
              data-section="map_bar"
              onClick={stopCardPick}
              onPointerDown={stopCardPick}
            >
              {mapBarMapButtonLabel(place)}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  )
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.google?.maps?.Map) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      const done = () => {
        if (window.google?.maps?.Map) resolve()
        else reject(new Error('Google Maps failed'))
      }
      if (window.google?.maps?.Map) {
        done()
        return
      }
      existing.addEventListener('load', done)
      existing.addEventListener('error', () => reject(new Error('script error')))
      return
    }

    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('load failed'))
    document.head.appendChild(s)
  })
}

export default function MapClient({
  places,
  mapCenter,
  mapZoom = 11,
  gtagPrefix,
  title,
  backHref,
  defaultCategories,
  categoryItems,
  categoryLabels,
  officialPassTierItems,
  routeLayers,
  initialFitToPlaces = false,
  topActions,
  belowContent,
}: MapClientProps) {
  const topMenuActions = useMemo(
    () => topActions?.filter((action) => action.placement !== 'afterBelowContent') ?? [],
    [topActions],
  )
  const afterBelowContentActions = useMemo(
    () => topActions?.filter((action) => action.placement === 'afterBelowContent') ?? [],
    [topActions],
  )
  const hasManualBelowContentAction = useMemo(
    () => topActions?.some((action) => action.label === '整理') ?? false,
    [topActions],
  )
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  // Derived event strings
  const tabGtagEvent = gtagPrefix.replace('map', '_map_tab')
  const defaultMapButtonEvent = `${gtagPrefix}_spot_map`

  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const markerByIdRef = useRef<Record<string, google.maps.Marker>>({})
  const labelOverlaysRef = useRef<Map<string, SmartMapLabelOverlay>>(new Map())
  const selectedMarkerArrowRef = useRef<google.maps.Marker | null>(null)
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const userPositionRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationWatchIdRef = useRef<number | null>(null)
  const locationFollowModeRef = useRef<'idle' | 'follow' | 'heading'>('idle')
  const locationFollowingRef = useRef(false)
  const locationLastCenteredRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationRenderedPositionRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationAnimationFrameRef = useRef<number | null>(null)
  const locationHeadingRef = useRef<number | null>(null)
  const locationCompassHeadingRef = useRef<number | null>(null)
  const locationCompassHeadingAtRef = useRef(0)
  const locationHeadingUpRef = useRef(false)
  const autoCenteringLocationRef = useRef(false)
  const autoCenteringLocationTimerRef = useRef<number | null>(null)
  const routeLineRefs = useRef<google.maps.Polyline[]>([])
  const routeStopMarkerRefs = useRef<google.maps.Marker[]>([])

  const desktopListScrollRef = useRef<HTMLDivElement>(null)
  const mobileSheetBodyRef = useRef<HTMLDivElement>(null)
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null)
  const desktopCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mobileCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mapMoveFromFocusRef = useRef(false)
  const mapLayoutIdleRef = useRef(false)
  const mapClickSuppressUntilRef = useRef(0)
  const mobileSheetRef = useRef<HTMLDivElement>(null)
  const belowContentRef = useRef<HTMLDivElement>(null)
  const sheetDragSessionRef = useRef<{
    pointerId: number
    startY: number
    startHeightPx: number
    collapsedPx: number
    expandedPx: number
  } | null>(null)
  const sheetLiveHeightRef = useRef<number | null>(null)
  const singleSwipeStartRef = useRef<number | null>(null)
  const singleSwipeWrapRef = useRef<HTMLDivElement | null>(null)
  const showSingleMobileCardRef = useRef(false)
  const singleCardWhenSheetDragStartedRef = useRef(false)
  const dualScrollPullStartRef = useRef<number | null>(null)
  const prevBrowseDualRef = useRef(true)

  const isMobileMapLayout = useMobileMapLayout()
  const siteHeaderPx = useSiteHeaderHeightPx()
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(false)
  const [mobileSheetBrowseDual, setMobileSheetBrowseDual] = useState(true)
  const [sheetDragging, setSheetDragging] = useState(false)
  const [sheetDragHeightPx, setSheetDragHeightPx] = useState<number | null>(null)
  const [mobileBelowContentActive, setMobileBelowContentActive] = useState(false)

  const activeCategoryItems = categoryItems ?? CITY_MAP_CATEGORY_TOGGLE_ITEMS
  const categoryLabelMap = useMemo(
    () => ({ ...CATEGORY_LABEL, ...categoryLabels }),
    [categoryLabels],
  )

  const [categoryOn, setCategoryOn] =
    useState<Record<CityMapPlaceCategory, boolean>>(() => ({
      ...DEFAULT_CITY_MAP_CATEGORY_ON,
      ...(defaultCategories ?? cityMapSoloCategory('spot')),
    }))
  const [officialPassTier, setOfficialPassTier] = useState<NonNullable<MapPlace['officialPassTier']> | 'all'>('all')
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [topActionsOpen, setTopActionsOpen] = useState(false)
  const [locationPromptOpen, setLocationPromptOpen] = useState(false)
  const [locationPromptMessage, setLocationPromptMessage] = useState('')
  const [locationRequesting, setLocationRequesting] = useState(false)
  const [locationHeadingUpActive, setLocationHeadingUpActive] = useState(false)
  const [routeLayerOn, setRouteLayerOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((routeLayers ?? []).map((layer) => [layer.id, layer.defaultVisible ?? true])),
  )

  const allCategoriesOn = cityMapCategoriesAllOn(categoryOn)

  const filteredPlaces = useMemo(
    () =>
      places.filter(
        (p) => categoryOn[p.category] && (officialPassTier === 'all' || p.officialPassTier === officialPassTier),
      ),
    [places, categoryOn, officialPassTier],
  )

  const mapLegendItems = useMemo(() => {
    const items: {
      key: string
      categoryKey: CityMapPlaceCategory
      label: string
      color: string
      order: number
      group: 'marker' | 'category'
    }[] = []
    const shown = new Set<string>()
    const hasSourceMarkerColors = filteredPlaces.some((place) => Boolean(place.markerColor))

    filteredPlaces.forEach((place) => {
      const usesSourceMarkerColor = Boolean(place.markerColor)
      if (hasSourceMarkerColors && !usesSourceMarkerColor) return
      const color = place.markerColor ?? cityMapLegendDefaultColor(place.category)
      const label = cityMapLegendLabel(place.category, color, usesSourceMarkerColor, categoryLabelMap, gtagPrefix)
      const key = `${color.toLowerCase()}-${label}`
      if (shown.has(key)) return
      shown.add(key)
      items.push({
        key,
        categoryKey: place.category,
        label,
        color,
        order: cityMapLegendOrder(place.category, color, usesSourceMarkerColor),
        group: usesSourceMarkerColor ? 'marker' : 'category',
      })
    })

    return items.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-Hant'))
  }, [categoryLabelMap, filteredPlaces, gtagPrefix])

  const listSections = useMemo(
    () =>
      activeCategoryItems.map((item) => {
        const { key, label } = item
        const keys = categoryItemKeys(item)
        const sectionTitle = categoryLabelMap[key] ?? label
        return {
          key,
          places: filteredPlaces.filter((p) => keys.includes(p.category)),
          title: sectionTitle,
          sectionLabel: cityMapSectionLabel(key, sectionTitle),
          rowClass: cityMapSectionRowClass(key),
          aria: sectionTitle,
        }
      }),
    [activeCategoryItems, categoryLabelMap, filteredPlaces],
  )

  const hasAnyListPlaces = filteredPlaces.length > 0

  const selectedPlace = useMemo(
    () => (selectedId ? places.find((p) => p.id === selectedId) ?? null : null),
    [places, selectedId],
  )

  useEffect(() => {
    if (!selectedId) return
    if (!filteredPlaces.some((p) => p.id === selectedId)) setSelectedId(null)
  }, [filteredPlaces, selectedId])

  const showSingleMobileCard =
    mobileSheetExpanded && !!selectedPlace && !mobileSheetBrowseDual && hasAnyListPlaces

  showSingleMobileCardRef.current = showSingleMobileCard

  const focusPlace = useCallback((place: MapPlace, source: FocusSource = 'list') => {
    setSelectedId(place.id)
    if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
      setMobileSheetExpanded(true)
      setMobileSheetBrowseDual(source === 'list')
      if (source === 'marker') {
        mapClickSuppressUntilRef.current = Date.now() + 500
      }
    }
    const map = mapRef.current
    if (map) {
      mapMoveFromFocusRef.current = true
      map.setCenter({ lat: place.lat, lng: place.lng })
      map.setZoom(16)
      // 手機版：讓標記出現在可視區上半段（避免被下方 sheet 遮住）
      panMobileMarkerAboveSheet(map)
      window.setTimeout(() => {
        mapMoveFromFocusRef.current = false
      }, 850)
    }

    const align = (behavior: ScrollBehavior = 'smooth') => {
      if (isDesktopViewport()) {
        const el = desktopCardRefs.current[place.id]
        const container = desktopListScrollRef.current
        if (el && container) scrollCardIntoScrollContainer(container, el)
        return
      }
      if (source === 'marker') return
      const el = mobileCardRefs.current[place.id]
      const container = mobileScrollContainerRef.current
      if (el && container) scrollCardFullyIntoView(container, el, 14, behavior)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        align(isDesktopViewport() ? 'smooth' : 'smooth')
      })
    })
  }, [])

  useEffect(() => {
    if (!mapReady || typeof window === 'undefined') return
    const placeId = new URLSearchParams(window.location.search).get('place')?.trim()
    if (!placeId) return
    const place = places.find((p) => p.id === placeId)
    if (!place) return
    const id = window.setTimeout(() => {
      setCategoryOn((prev) => (prev[place.category] ? prev : { ...prev, [place.category]: true }))
      focusPlace(place, 'marker')
      if (isMobileMapViewport()) {
        window.setTimeout(() => {
          const map = mapRef.current
          if (!map) return
          map.setCenter({ lat: place.lat, lng: place.lng })
          panMobileMarkerAboveSheet(map)
        }, 450)
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [focusPlace, mapReady, places])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    markerByIdRef.current = {}
  }, [])

  const syncMarkers = useCallback(
    (ps: MapPlace[]) => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      clearMarkers()
      for (const p of ps) {
        const selected = p.id === selectedId
        const marker = new google.maps.Marker({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: `${categoryLabelMap[p.category]}｜${p.name}`,
          icon: cityMapMarkerIcon(p.category, google.maps, p),
          zIndex: selected ? 10000 : cityMapMarkerZIndex(p.category),
        })
        marker.addListener('click', () => {
          fireMapMarkerGtag(gtagPrefix, p)
          focusPlace(p, 'marker')
        })
        markersRef.current.push(marker)
        markerByIdRef.current[p.id] = marker
      }
    },
    [categoryLabelMap, clearMarkers, focusPlace, gtagPrefix, selectedId],
  )

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return

    filteredPlaces.forEach((place) => {
      const marker = markerByIdRef.current[place.id]
      if (!marker) return
      const selected = place.id === selectedId
      marker.setZIndex(selected ? 10000 : cityMapMarkerZIndex(place.category))
      marker.setOpacity(1)
    })

    if (!selectedPlace) {
      selectedMarkerArrowRef.current?.setMap(null)
      selectedMarkerArrowRef.current = null
      return
    }

    const position = { lat: selectedPlace.lat, lng: selectedPlace.lng }
    if (!selectedMarkerArrowRef.current) {
      selectedMarkerArrowRef.current = new google.maps.Marker({
        map,
        position,
        icon: selectedMarkerArrowIcon(google.maps),
        clickable: false,
        zIndex: 10001,
      })
      return
    }

    selectedMarkerArrowRef.current.setMap(map)
    selectedMarkerArrowRef.current.setPosition(position)
  }, [filteredPlaces, selectedId, selectedPlace])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !window.google?.maps) return

    const labelItems = filteredPlaces.map((place, index) => {
      const selected = place.id === selectedId
      return {
        id: place.id,
        position: { lat: place.lat, lng: place.lng },
        text: place.name,
        selected,
        priority:
          (selected ? 10000 : 0) +
          (place.category === 'ticket' || place.category === 'spot' ? 80 : 0) +
          (place.category === 'hotel' ? 40 : 0) -
          index,
      }
    })

    const updateLabels = () => {
      syncSmartMapLabels(map, labelOverlaysRef.current, labelItems, {
        className: styles.smartMapLabel,
        selectedClassName: styles.smartMapLabelSelected,
        minZoom: 15,
        fullZoom: 17,
        maxMobileLabels: 10,
        maxDesktopLabels: 30,
      })
    }

    updateLabels()
    const idleL = google.maps.event.addListener(map, 'idle', updateLabels)
    const zoomL = google.maps.event.addListener(map, 'zoom_changed', updateLabels)
    return () => {
      google.maps.event.removeListener(idleL)
      google.maps.event.removeListener(zoomL)
    }
  }, [filteredPlaces, mapReady, selectedId])

  useEffect(() => {
    const overlays = labelOverlaysRef.current
    return () => clearSmartMapLabels(overlays)
  }, [])

  useEffect(() => {
    if (!apiKey) {
      setMapError('請在 .env.local 設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
      return
    }

    let cancelled = false
    const cleanupFns: Array<() => void> = []
    ;(async () => {
      try {
        await loadGoogleMapsScript(apiKey)
        if (cancelled || !mapElRef.current) return
        const mapOptions: google.maps.MapOptions & { cameraControl?: boolean } = {
          center: mapCenter,
          zoom: mapZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          zoomControl: false,
          renderingType: google.maps.RenderingType.VECTOR,
        }
        const map = new google.maps.Map(mapElRef.current, mapOptions)
        mapRef.current = map
        mapLayoutIdleRef.current = false
        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapLayoutIdleRef.current = true
        })
        const stopFollowingFromMapGesture = () => {
          if (locationAnimationFrameRef.current !== null) {
            window.cancelAnimationFrame(locationAnimationFrameRef.current)
            locationAnimationFrameRef.current = null
          }
          locationFollowModeRef.current = 'idle'
          locationFollowingRef.current = false
          locationHeadingUpRef.current = false
          setLocationHeadingUpActive(false)
          map.setHeading(0)
        }
        const mapElement = mapElRef.current
        mapElement.addEventListener('pointerdown', stopFollowingFromMapGesture, { passive: true })
        cleanupFns.push(() => mapElement.removeEventListener('pointerdown', stopFollowingFromMapGesture))
        const dragListener = map.addListener('dragstart', stopFollowingFromMapGesture)
        cleanupFns.push(() => dragListener.remove())
        setMapReady(true)
        setMapError(null)
        syncMarkers(filteredPlaces)
      } catch {
        if (!cancelled) setMapError('無法載入 Google 地圖，請檢查 API Key 與權限。')
      }
    })()

    return () => {
      cancelled = true
      cleanupFns.forEach((cleanup) => cleanup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once when key exists
  }, [apiKey])

  useEffect(() => {
    if (!mapReady) return
    syncMarkers(filteredPlaces)
  }, [mapReady, filteredPlaces, syncMarkers])

  const clearRouteOverlays = useCallback(() => {
    routeLineRefs.current.forEach((line) => line.setMap(null))
    routeStopMarkerRefs.current.forEach((marker) => marker.setMap(null))
    routeLineRefs.current = []
    routeStopMarkerRefs.current = []
  }, [])

  useEffect(() => {
    setRouteLayerOn((prev) =>
      Object.fromEntries(
        (routeLayers ?? []).map((layer) => [layer.id, prev[layer.id] ?? layer.defaultVisible ?? true]),
      ),
    )
  }, [routeLayers])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !window.google?.maps) return
    clearRouteOverlays()
    const routeStopLabels: Array<{ marker: google.maps.Marker; label: google.maps.MarkerLabel }> = []
    ;(routeLayers ?? []).forEach((routeLayer) => {
      if (!routeLayerOn[routeLayer.id]) return
      const line = new google.maps.Polyline({
        map,
        path: routeLayer.path,
        strokeColor: routeLayer.color,
        strokeOpacity: 0.9,
        strokeWeight: 4,
        zIndex: 1,
      })
      routeLineRefs.current.push(line)
      routeLayer.stops.forEach((stop) => {
        const label = {
          text: `${stop.order} ${stop.name}`,
          className: styles.routeStopLabel,
          color: '#0f172a',
          fontSize: '12px',
          fontWeight: '700',
        }
        const marker = new google.maps.Marker({
          map,
          position: { lat: stop.lat, lng: stop.lng },
          title: `${stop.order} ${stop.name}`,
          zIndex: 4,
          icon: {
            url: routeStopIconUrl(routeLayer.color),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12),
            labelOrigin: new google.maps.Point(12, -8),
          },
        })
        routeStopLabels.push({ marker, label })
        routeStopMarkerRefs.current.push(marker)
      })
    })

    const syncRouteStopLabels = () => {
      const showLabels = (map.getZoom() ?? 0) >= 15
      routeStopLabels.forEach(({ marker, label }) => {
        marker.setLabel(showLabels ? label : null)
      })
    }

    syncRouteStopLabels()
    const idleL = google.maps.event.addListener(map, 'idle', syncRouteStopLabels)
    const zoomL = google.maps.event.addListener(map, 'zoom_changed', syncRouteStopLabels)
    return () => {
      google.maps.event.removeListener(idleL)
      google.maps.event.removeListener(zoomL)
      clearRouteOverlays()
    }
  }, [clearRouteOverlays, mapReady, routeLayerOn, routeLayers])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const t = window.setTimeout(() => {
      google.maps.event.trigger(mapRef.current!, 'resize')
    }, 250)
    return () => window.clearTimeout(t)
  }, [mapReady])

  useEffect(() => {
    if (!mapReady || !mapRef.current || !isMobileMapLayout) return
    const map = mapRef.current
    let zoomTimer: number | undefined

    const collapseSheet = () => {
      setMobileSheetExpanded(false)
    }

    const onDragStart = () => {
      collapseSheet()
    }
    const onMapClick = () => {
      if (!mapLayoutIdleRef.current || mapMoveFromFocusRef.current) return
      if (Date.now() < mapClickSuppressUntilRef.current) return
      collapseSheet()
    }
    const onZoomChanged = () => {
      if (!mapLayoutIdleRef.current || mapMoveFromFocusRef.current) return
      if (zoomTimer !== undefined) window.clearTimeout(zoomTimer)
      zoomTimer = window.setTimeout(() => {
        if (!mapMoveFromFocusRef.current) collapseSheet()
      }, 220)
    }

    const dragL = google.maps.event.addListener(map, 'dragstart', onDragStart)
    const clickL = google.maps.event.addListener(map, 'click', onMapClick)
    const zoomL = google.maps.event.addListener(map, 'zoom_changed', onZoomChanged)
    return () => {
      if (zoomTimer !== undefined) window.clearTimeout(zoomTimer)
      google.maps.event.removeListener(dragL)
      google.maps.event.removeListener(clickL)
      google.maps.event.removeListener(zoomL)
    }
  }, [mapReady, isMobileMapLayout])

  useEffect(() => {
    if (!mapReady || !mapRef.current || !isMobileMapLayout) return
    const t = window.setTimeout(() => {
      google.maps.event.trigger(mapRef.current!, 'resize')
    }, 300)
    return () => window.clearTimeout(t)
  }, [mobileSheetExpanded, mapReady, isMobileMapLayout])

  const markLocationAutoCentering = useCallback(() => {
    autoCenteringLocationRef.current = true
    mapMoveFromFocusRef.current = true
    if (autoCenteringLocationTimerRef.current !== null) {
      window.clearTimeout(autoCenteringLocationTimerRef.current)
    }
    autoCenteringLocationTimerRef.current = window.setTimeout(() => {
      autoCenteringLocationRef.current = false
      mapMoveFromFocusRef.current = false
      autoCenteringLocationTimerRef.current = null
    }, 360)
  }, [])

  const currentLocationHeading = useCallback(() => {
    const compassHeading = locationCompassHeadingRef.current
    if (compassHeading !== null && Date.now() - locationCompassHeadingAtRef.current < 3000) return compassHeading
    return locationHeadingRef.current
  }, [])

  const currentLocationIconHeading = useCallback(() => {
    const heading = currentLocationHeading()
    if (heading === null) return null
    return locationHeadingUpRef.current ? 0 : heading
  }, [currentLocationHeading])

  const applyLocationMapHeading = useCallback((map: google.maps.Map) => {
    if (!locationHeadingUpRef.current) {
      map.setHeading(0)
      return
    }
    const heading = currentLocationHeading()
    if (heading !== null) map.setHeading(heading)
  }, [currentLocationHeading])

  const applyLocationOrientationHeading = useCallback(
    (heading: number) => {
      locationCompassHeadingRef.current = heading
      locationCompassHeadingAtRef.current = Date.now()
      const map = mapRef.current
      if (!map || !userMarkerRef.current) return
      applyLocationMapHeading(map)
      userMarkerRef.current.setIcon(userLocationIcon(currentLocationIconHeading()))
    },
    [applyLocationMapHeading, currentLocationIconHeading],
  )

  const stopLocationAnimation = useCallback(() => {
    if (locationAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(locationAnimationFrameRef.current)
      locationAnimationFrameRef.current = null
    }
  }, [])

  const applyLocationZoom = useCallback((map: google.maps.Map, force = false) => {
    const targetZoom = locationHeadingUpRef.current ? LOCATION_HEADING_UP_ZOOM : LOCATION_FOLLOW_ZOOM
    const currentZoom = map.getZoom() ?? 0
    if (force || currentZoom < targetZoom) map.setZoom(targetZoom)
  }, [])

  const followUserPositionOnMap = useCallback(
    (map: google.maps.Map, position: google.maps.LatLngLiteral, immediate = false) => {
      markLocationAutoCentering()
      if (immediate) applyLocationZoom(map, true)
      const marker = userMarkerRef.current
      const from = locationRenderedPositionRef.current ?? userPositionRef.current ?? position
      stopLocationAnimation()
      if (immediate || distanceMeters(from, position) < 0.5) {
        marker?.setPosition(position)
        map.panTo(position)
        locationRenderedPositionRef.current = position
        return
      }
      const distance = distanceMeters(from, position)
      const duration = Math.min(1400, Math.max(700, distance * 60))
      const startedAt = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        const nextPosition = interpolatePosition(from, position, progress)
        marker?.setPosition(nextPosition)
        if (locationFollowingRef.current) map.setCenter(nextPosition)
        locationRenderedPositionRef.current = nextPosition
        if (progress < 1) {
          locationAnimationFrameRef.current = window.requestAnimationFrame(step)
          return
        }
        locationAnimationFrameRef.current = null
        locationRenderedPositionRef.current = position
      }
      locationAnimationFrameRef.current = window.requestAnimationFrame(step)
    },
    [applyLocationZoom, markLocationAutoCentering, stopLocationAnimation],
  )

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      const heading = locationHeadingFromOrientation(event)
      if (heading === null) return
      applyLocationOrientationHeading(heading)
    }
    window.addEventListener('deviceorientationabsolute', onOrientation, true)
    window.addEventListener('deviceorientation', onOrientation, true)
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrientation, true)
      window.removeEventListener('deviceorientation', onOrientation, true)
    }
  }, [applyLocationOrientationHeading])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map || !initialFitToPlaces || filteredPlaces.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    filteredPlaces.forEach((place) => bounds.extend({ lat: place.lat, lng: place.lng }))
    map.fitBounds(bounds, 64)
  }, [filteredPlaces, initialFitToPlaces, mapReady])

  const prevMobileLayoutRef = useRef(false)
  useEffect(() => {
    const wasMobile = prevMobileLayoutRef.current
    prevMobileLayoutRef.current = isMobileMapLayout
    // 只在「手機 → 桌機」切換時重置 sheet，避免 mount 時因 isMobileMapLayout 初始 false 誤觸展開
    if (wasMobile && !isMobileMapLayout) setMobileSheetExpanded(false)
  }, [isMobileMapLayout])

  useEffect(() => {
    const el = mobileScrollContainerRef.current
    if (el) el.scrollTop = 0
  }, [categoryOn, officialPassTier])

  useEffect(() => {
    const wasSingle = !prevBrowseDualRef.current
    prevBrowseDualRef.current = mobileSheetBrowseDual

    // 只在「單卡 → 雙列」切換時才捲動，避免在雙列點卡片時與 align 衝突
    if (!mobileSheetBrowseDual || !selectedId || !wasSingle) return

    const id = selectedId
    const t = window.setTimeout(() => {
      const el = mobileCardRefs.current[id]
      const c = mobileScrollContainerRef.current
      if (!el || !c) return
      const delta = el.getBoundingClientRect().top - c.getBoundingClientRect().top - 14
      c.scrollTop = Math.max(0, c.scrollTop + delta)
    }, 150)
    return () => window.clearTimeout(t)
  }, [mobileSheetBrowseDual, selectedId])

  useEffect(() => {
    if (!isMobileMapLayout || !showSingleMobileCard) return
    const el = singleSwipeWrapRef.current
    if (!el) return
    let startY: number | null = null

    const onStart = (ev: TouchEvent) => {
      if (ev.touches.length !== 1) return
      startY = ev.touches[0].clientY
    }
    const onMove = (ev: TouchEvent) => {
      if (startY == null || ev.touches.length !== 1) return
      const y = ev.touches[0].clientY
      if (startY - y > 18) {
        setMobileSheetBrowseDual(true)
        startY = null
        return
      }
      if (y - startY > 44) {
        setMobileSheetExpanded(false)
        startY = null
        return
      }
      if (Math.abs(y - startY) > 8) ev.preventDefault()
    }
    const onEnd = () => {
      startY = null
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
    }
  }, [isMobileMapLayout, showSingleMobileCard, selectedPlace?.id])

  const onMobileSheetDragPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const sheet = mobileSheetRef.current
    if (!sheet) return
    singleCardWhenSheetDragStartedRef.current = showSingleMobileCardRef.current
    const { collapsedPx, expandedPx } = getMobileSheetMetrics()
    const startHeightPx = Math.round(sheet.getBoundingClientRect().height)
    sheetDragSessionRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startHeightPx,
      collapsedPx,
      expandedPx,
    }
    sheetLiveHeightRef.current = startHeightPx
    setSheetDragHeightPx(startHeightPx)
    setSheetDragging(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }, [])

  const onMobileSheetDragPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = sheetDragSessionRef.current
    if (!d || e.pointerId !== d.pointerId) return

    if (showSingleMobileCardRef.current) {
      const pullUp = d.startY - e.clientY
      if (pullUp > 32) {
        singleCardWhenSheetDragStartedRef.current = false
        setMobileSheetBrowseDual(true)
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          /* noop */
        }
        sheetDragSessionRef.current = null
        setSheetDragging(false)
        sheetLiveHeightRef.current = null
        setSheetDragHeightPx(null)
        return
      }
    }

    const delta = d.startY - e.clientY
    const next = Math.round(d.startHeightPx + delta)
    const clamped = Math.min(d.expandedPx, Math.max(d.collapsedPx, next))
    sheetLiveHeightRef.current = clamped
    setSheetDragHeightPx(clamped)
  }, [])

  const endMobileSheetDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = sheetDragSessionRef.current
    if (!d || e.pointerId !== d.pointerId) return
    sheetDragSessionRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
    setSheetDragging(false)
    const finalH = sheetLiveHeightRef.current ?? d.startHeightPx
    const moved = Math.abs(finalH - d.startHeightPx) > 8
    sheetLiveHeightRef.current = null
    const mid = (d.collapsedPx + d.expandedPx) / 2
    const singleAtStart = singleCardWhenSheetDragStartedRef.current
    singleCardWhenSheetDragStartedRef.current = false
    if (!moved) {
      setMobileSheetExpanded((prev) => !prev)
    } else {
      setMobileSheetExpanded(finalH >= mid)
    }
    if (singleAtStart && moved && finalH > d.startHeightPx + 12) {
      setMobileSheetBrowseDual(true)
    }
    setSheetDragHeightPx(null)
  }, [])

  const onMobileSheetClose = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    sheetDragSessionRef.current = null
    sheetLiveHeightRef.current = null
    setSheetDragging(false)
    setSheetDragHeightPx(null)
    setMobileSheetExpanded(false)
  }, [])

  const onMobileSinglePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    singleSwipeStartRef.current = e.clientY
  }, [])

  const onMobileSinglePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (mobileSheetBrowseDual || singleSwipeStartRef.current == null) return
      if (singleSwipeStartRef.current - e.clientY > 20) {
        setMobileSheetBrowseDual(true)
        singleSwipeStartRef.current = null
      } else if (e.clientY - singleSwipeStartRef.current > 44) {
        setMobileSheetExpanded(false)
        singleSwipeStartRef.current = null
      }
    },
    [mobileSheetBrowseDual],
  )

  const onMobileSinglePointerUp = useCallback(() => {
    singleSwipeStartRef.current = null
  }, [])

  const onMobileSingleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return
    singleSwipeStartRef.current = e.touches[0].clientY
  }, [])

  const onMobileSingleTouchMove = useCallback(
    (e: ReactTouchEvent<HTMLDivElement>) => {
      if (mobileSheetBrowseDual || singleSwipeStartRef.current == null) return
      if (e.touches.length !== 1) return
      const y = e.touches[0].clientY
      if (singleSwipeStartRef.current - y > 20) {
        setMobileSheetBrowseDual(true)
        singleSwipeStartRef.current = null
      } else if (y - singleSwipeStartRef.current > 44) {
        setMobileSheetExpanded(false)
        singleSwipeStartRef.current = null
      }
    },
    [mobileSheetBrowseDual],
  )

  const onMobileSingleTouchEnd = useCallback(() => {
    singleSwipeStartRef.current = null
  }, [])

  const onDualScrollTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return
    const container = mobileScrollContainerRef.current
    if (!container || container.scrollTop > 4) return
    dualScrollPullStartRef.current = e.touches[0].clientY
  }, [])

  const onDualScrollTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const container = mobileScrollContainerRef.current
    if (!container || dualScrollPullStartRef.current == null) return
    if (container.scrollTop > 4) {
      dualScrollPullStartRef.current = null
      return
    }
    const delta = e.touches[0].clientY - dualScrollPullStartRef.current
    if (delta > 60) {
      dualScrollPullStartRef.current = null
      setMobileSheetExpanded(false)
    }
  }, [])

  const onDualScrollTouchEnd = useCallback(() => {
    dualScrollPullStartRef.current = null
  }, [])

  const onMobileSingleWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      if (mobileSheetBrowseDual || !selectedPlace) return
      if (e.deltaY > 12) setMobileSheetBrowseDual(true)
    },
    [mobileSheetBrowseDual, selectedPlace],
  )

  const scrollToBelowContent = useCallback(() => {
    const target = belowContentRef.current
    if (!target) return
    setMobileSheetExpanded(false)
    setMobileBelowContentActive(true)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const fn = getGtag()
    if (typeof fn === 'function') {
      fn('event', `${gtagPrefix}_scroll_below`, {
        page_path: location.pathname,
      })
    }
  }, [gtagPrefix])

  useEffect(() => {
    if (!isMobileMapLayout || !belowContent) {
      setMobileBelowContentActive(false)
      return
    }
    const onScroll = () => {
      const threshold = Math.max(120, window.innerHeight * 0.45)
      setMobileBelowContentActive(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [belowContent, isMobileMapLayout])

  const locateUser = useCallback(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) {
      setLocationPromptMessage('地圖尚未載入完成，請稍後再試一次。')
      return
    }
    if (!navigator.geolocation) {
      setLocationPromptMessage('這個瀏覽器不支援定位，請改用 Safari 或 Chrome 開啟。')
      return
    }
    void requestDeviceOrientationAccess()
    if (locationWatchIdRef.current !== null) {
      setLocationPromptOpen(false)
      const position = userPositionRef.current
      if (position) {
        const nextMode = locationFollowModeRef.current === 'follow' ? 'heading' : 'follow'
        locationFollowModeRef.current = nextMode
        locationFollowingRef.current = true
        const nextHeadingUp = nextMode === 'heading'
        locationHeadingUpRef.current = nextHeadingUp
        setLocationHeadingUpActive(nextHeadingUp)
        applyLocationMapHeading(map)
        userMarkerRef.current?.setIcon(userLocationIcon(currentLocationIconHeading()))
        followUserPositionOnMap(map, position, true)
        locationLastCenteredRef.current = position
      }
      return
    }

    setLocationRequesting(true)
    setLocationPromptMessage('')
    locationFollowModeRef.current = 'follow'
    locationFollowingRef.current = true
    locationHeadingUpRef.current = false
    setLocationHeadingUpActive(false)
    applyLocationMapHeading(map)
    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocationRequesting(false)
        setLocationPromptOpen(false)
        const position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        const gpsHeading = locationHeadingFromPosition(pos)
        const renderedPosition = locationRenderedPositionRef.current
        const travelHeading = reliableMovementHeading(pos, renderedPosition, position)
        const speed = typeof pos.coords.speed === 'number' && Number.isFinite(pos.coords.speed) ? pos.coords.speed : null
        if (gpsHeading !== null && (speed === null || speed >= 0.7)) {
          locationHeadingRef.current = gpsHeading
        } else if (travelHeading !== null) {
          locationHeadingRef.current = travelHeading
        }
        applyLocationMapHeading(map)
        const icon = userLocationIcon(currentLocationIconHeading())
        userPositionRef.current = position
        if (!userMarkerRef.current) {
          locationRenderedPositionRef.current = position
          userMarkerRef.current = new google.maps.Marker({
            map,
            position,
            title: '我的位置',
            zIndex: 10002,
            icon,
          })
        } else {
          userMarkerRef.current.setIcon(icon)
          userMarkerRef.current.setMap(map)
        }
        const lastCentered = locationLastCenteredRef.current
        const shouldRecenter =
          locationFollowingRef.current &&
          (!lastCentered || distanceMeters(lastCentered, position) >= LOCATION_RECENTER_MIN_DISTANCE_METERS)
        if (shouldRecenter) {
          followUserPositionOnMap(map, position, !lastCentered)
          locationLastCenteredRef.current = position
        }
      },
      (error) => {
        setLocationRequesting(false)
        if (error.code === error.PERMISSION_DENIED && locationWatchIdRef.current !== null) {
          navigator.geolocation.clearWatch(locationWatchIdRef.current)
          locationWatchIdRef.current = null
          locationFollowModeRef.current = 'idle'
          locationFollowingRef.current = false
          locationHeadingUpRef.current = false
          setLocationHeadingUpActive(false)
          stopLocationAnimation()
        }
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPromptMessage(`定位權限尚未開啟。${locationPermissionGuide()}`)
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationPromptMessage('暫時無法取得位置，請確認手機或瀏覽器定位功能已開啟。')
        } else if (error.code === error.TIMEOUT) {
          setLocationPromptMessage('定位逾時，請再試一次。')
        } else {
          setLocationPromptMessage('定位失敗，請再試一次。')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    )
  }, [applyLocationMapHeading, currentLocationIconHeading, followUserPositionOnMap, stopLocationAnimation])

  useEffect(() => {
    return () => {
      if (locationWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current)
        locationWatchIdRef.current = null
      }
      locationFollowModeRef.current = 'idle'
      if (autoCenteringLocationTimerRef.current !== null) {
        window.clearTimeout(autoCenteringLocationTimerRef.current)
        autoCenteringLocationTimerRef.current = null
      }
      stopLocationAnimation()
      autoCenteringLocationRef.current = false
      locationFollowingRef.current = false
      locationLastCenteredRef.current = null
      locationRenderedPositionRef.current = null
      locationHeadingRef.current = null
      locationCompassHeadingRef.current = null
      locationCompassHeadingAtRef.current = 0
      locationHeadingUpRef.current = false
      setLocationHeadingUpActive(false)
    }
  }, [stopLocationAnimation])

  return (
    <>
      <CitySubpageHeader backHref={backHref} eventPrefix={gtagPrefix} />
      <main
        className={`transport-main ${styles.mapPage}`}
        style={
          siteHeaderPx != null
            ? ({ ['--map-header-offset']: `${siteHeaderPx}px` } as CSSProperties)
            : undefined
        }
      >
        <div className={`${styles.topBar} ${mobileBelowContentActive ? styles.mobileTopBarHidden : ''}`}>
          <h1>{title}</h1>
          <div className={styles.introBlock}>
            <div className={styles.mapFilterGroups}>
              <div
                className="tabs"
                id={`${gtagPrefix}CategoryToggles`}
                role="group"
                aria-label="地圖分類：全部可切換全開／全關；四類可複選"
              >
                <button
                  type="button"
                  className={`tab ${allCategoriesOn ? 'active' : ''}`}
                  data-area="all"
                  onClick={() => {
                    setCategoryOn((prev) => {
                      const next = cityMapCategoriesAllOn(prev)
                        ? (Object.fromEntries(
                            Object.keys(prev).map((key) => [key, false]),
                          ) as Record<CityMapPlaceCategory, boolean>)
                        : { ...DEFAULT_CITY_MAP_CATEGORY_ON }
                      const fn = getGtag()
                      if (typeof fn === 'function') {
                        fn('event', tabGtagEvent, {
                          area: cityMapCategoriesAllOn(next) ? 'all' : 'none',
                          page_path: location.pathname,
                        })
                      }
                      return next
                    })
                    setSelectedId(null)
                    setMobileSheetBrowseDual(true)
                    if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
                      setMobileSheetExpanded(false)
                      mapClickSuppressUntilRef.current = Date.now() + 450
                    }
                  }}
                >
                  全部
                </button>
                {activeCategoryItems.map((item) => {
                  const keys = categoryItemKeys(item)
                  const active = keys.every((key) => categoryOn[key])
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`tab ${active ? 'active' : ''}`}
                      aria-pressed={active}
                      data-area={item.key}
                      onClick={() => {
                        setCategoryOn((prev) => {
                          const next = cityMapCategoriesAllOn(prev)
                            ? ({
                                ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
                                ...Object.fromEntries(keys.map((key) => [key, true])),
                              } as Record<CityMapPlaceCategory, boolean>)
                            : ({
                                ...prev,
                                ...Object.fromEntries(keys.map((key) => [key, !active])),
                              } as Record<CityMapPlaceCategory, boolean>)
                          const fn = getGtag()
                          if (typeof fn === 'function') {
                            const area = activeCategoryItems
                              .flatMap(categoryItemKeys)
                              .filter((key) => next[key])
                              .join(',')
                            fn('event', tabGtagEvent, {
                              area: area || 'none',
                              page_path: location.pathname,
                            })
                          }
                          return next
                        })
                        setSelectedId(null)
                        setMobileSheetBrowseDual(true)
                        if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
                          setMobileSheetExpanded(false)
                          mapClickSuppressUntilRef.current = Date.now() + 450
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
              {officialPassTierItems && officialPassTierItems.length > 0 ? (
                <div
                  className="tabs"
                  id={`${gtagPrefix}OfficialPassTierToggles`}
                  role="group"
                  aria-label="釜山通行證官方分類：全部／紫色A區景點／藍色B區景點"
                >
                  <button
                    type="button"
                    className={`tab ${officialPassTier === 'all' ? 'active' : ''}`}
                    data-area="official-all"
                    onClick={() => {
                      setOfficialPassTier('all')
                      setSelectedId(null)
                      setMobileSheetBrowseDual(true)
                    }}
                  >
                    全部
                  </button>
                  {officialPassTierItems.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      className={`tab ${officialPassTier === key ? 'active' : ''}`}
                      aria-pressed={officialPassTier === key}
                      data-area={`official-${key}`}
                      onClick={() => {
                        setOfficialPassTier((prev) => (prev === key ? 'all' : key))
                        setSelectedId(null)
                        setMobileSheetBrowseDual(true)
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
              {routeLayers && routeLayers.length > 0 ? (
                <div className="tabs" id={`${gtagPrefix}RouteToggles`} role="group" aria-label="交通路線">
                  {routeLayers.map((routeLayer) => (
                    <button
                      key={routeLayer.id}
                      type="button"
                      className={`tab ${routeLayerOn[routeLayer.id] ? 'active' : ''}`}
                      aria-pressed={routeLayerOn[routeLayer.id]}
                      style={{ borderColor: routeLayer.color, color: routeLayerOn[routeLayer.id] ? undefined : routeLayer.color }}
                      onClick={() => {
                        setRouteLayerOn((prev) => ({ ...prev, [routeLayer.id]: !prev[routeLayer.id] }))
                        const fn = getGtag()
                        if (typeof fn === 'function') {
                          fn('event', `${gtagPrefix}_route_toggle`, {
                            route_id: routeLayer.id,
                            route_label: routeLayer.label,
                            page_path: location.pathname,
                          })
                        }
                      }}
                    >
                      {routeLayer.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {topActions && topActions.length > 0 ? (
              <div className={styles.mapTopActions} aria-label="快速連結">
                <button
                  type="button"
                  className={styles.mapTopActionTrigger}
                  aria-expanded={topActionsOpen}
                  aria-controls={`${gtagPrefix}TopActionsMenu`}
                  data-event={`${gtagPrefix}_top_buy_toggle`}
                  data-platform="buy-menu"
                  data-section="map_top"
                  onClick={() => setTopActionsOpen((open) => !open)}
                >
                  連結
                  <span aria-hidden>{topActionsOpen ? '▴' : '▾'}</span>
                </button>
                {topActionsOpen ? (
                  <div id={`${gtagPrefix}TopActionsMenu`} className={styles.mapTopActionMenu}>
                    {topMenuActions.map((action) => (
                      <a
                        key={`${action.label}-${action.href}`}
                        className={`${styles.mapTopAction} ${action.primary ? styles.mapTopActionPrimary : ''}`}
                        href={action.href}
                        {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        data-event={action.event}
                        data-platform={action.platform}
                        data-section="map_top"
                      >
                        {action.label}
                      </a>
                    ))}
                    {belowContent && !hasManualBelowContentAction ? (
                      <button
                        type="button"
                        className={`${styles.mapTopAction} ${styles.mapTopActionButton}`}
                        data-event={`${gtagPrefix}_scroll_below`}
                        data-section="map_top"
                        onClick={() => {
                          setTopActionsOpen(false)
                          scrollToBelowContent()
                        }}
                      >
                        整理
                      </button>
                    ) : null}
                    {afterBelowContentActions.map((action) => (
                      <a
                        key={`${action.label}-${action.href}`}
                        className={`${styles.mapTopAction} ${action.primary ? styles.mapTopActionPrimary : ''}`}
                        href={action.href}
                        {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        data-event={action.event}
                        data-platform={action.platform}
                        data-section="map_top"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`${styles.splitWrap} ${mobileBelowContentActive ? styles.mobileMapHidden : ''}`}>
          <div className={styles.mapColumn}>
            <div className={styles.mapColumnInner}>
              <div className={styles.mapShellWrap}>
                <div className={styles.mapShell}>
                  {mapError ? (
                    <div className={styles.mapFallback}>{mapError}</div>
                  ) : (
                    <div ref={mapElRef} className={styles.mapCanvas} />
                  )}
                  {!mapError ? (
                    <button
                      type="button"
                      className={`${styles.mapLocateButton} ${locationHeadingUpActive ? styles.mapLocateButtonActive : ''}`}
                      aria-label="定位我的目前位置"
                      title="定位我的目前位置"
                      disabled={locationRequesting}
                      data-event={`${gtagPrefix}_locate`}
                      data-platform="geolocation"
                      data-section="map"
                      onClick={() => {
                        if (userPositionRef.current || locationWatchIdRef.current !== null) {
                          locateUser()
                          return
                        }
                        setLocationPromptMessage('')
                        setLocationPromptOpen(true)
                      }}
                    >
                      <span aria-hidden="true" />
                    </button>
                  ) : null}
                  {mapLegendItems.length > 0 ? (
                    <div className={styles.mapLegend} data-map-prefix={gtagPrefix} aria-label="地圖標記說明">
                      {mapLegendItems.map((item, index) => (
                        <Fragment key={item.key}>
                          {index > 0 && item.group !== mapLegendItems[index - 1]?.group ? (
                            <span className={styles.mapLegendBreak} aria-hidden="true" />
                          ) : null}
                          <span className={styles.mapLegendItem}>
                            <span className={styles.mapLegendDot} style={{ backgroundColor: item.color }} aria-hidden="true" />
                            {item.label}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.listColumn} aria-label="地點列表（桌機）">
            <div ref={desktopListScrollRef} className={styles.desktopListScroll}>
              {listSections.map((s) =>
                s.places.length > 0 ? (
                  <section
                    key={`desk-${s.key}`}
                    className={`${styles.desktopCardsSection} ${s.rowClass}`}
                    aria-label={s.aria}
                  >
                    <h2 className={styles.sectionTitle}>{s.title}</h2>
                    {s.sectionLabel ? (
                      <p className={styles.sectionLabel}>{s.sectionLabel}</p>
                    ) : null}
                    <div className={styles.desktopCardStack}>
                      {s.places.map((place) => (
                        <MapPlaceCard
                          key={`d-${place.id}`}
                          place={place}
                          selected={selectedId === place.id}
                          onPick={focusPlace}
                          gtagPrefix={gtagPrefix}
                          defaultMapButtonEvent={defaultMapButtonEvent}
                          categoryLabels={categoryLabelMap}
                          cardRef={(el) => {
                            desktopCardRefs.current[place.id] = el
                          }}
                        />
                      ))}
                    </div>
                  </section>
                ) : null,
              )}
            </div>
          </aside>
        </div>

        <div
          ref={mobileSheetRef}
          className={`${styles.mobileSheet} ${mobileBelowContentActive ? styles.mobileSheetHidden : ''} ${
            sheetDragging ? styles.mobileSheetDragging : ''
          } ${
            !mobileSheetExpanded
              ? styles.mobileSheetCollapsed
              : showSingleMobileCard
                ? styles.mobileSheetExpandedSingle
                : styles.mobileSheetExpanded
          }`}
          style={
            sheetDragHeightPx != null
              ? ({ height: sheetDragHeightPx, maxHeight: sheetDragHeightPx } as CSSProperties)
              : undefined
          }
          aria-label="地點列表（手機）"
        >
          <div className={styles.mobileSheetChrome}>
            <div
              className={styles.mobileSheetDragZone}
              role="button"
              tabIndex={0}
              aria-expanded={mobileSheetExpanded}
              aria-label={
                mobileSheetExpanded ? '拖曳調整高度，鬆手吸附；點一下切換收合' : '向上拖曳展開；點一下切換'
              }
              data-event={`${gtagPrefix}_mobile_sheet_drag`}
              data-item="sheet_drag"
              onPointerDown={onMobileSheetDragPointerDown}
              onPointerMove={onMobileSheetDragPointerMove}
              onPointerUp={endMobileSheetDrag}
              onPointerCancel={endMobileSheetDrag}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setMobileSheetExpanded((v) => !v)
                }
              }}
            />
            <span className={styles.mobileSheetHandleBar} aria-hidden />
            <button
              type="button"
              className={styles.mobileSheetCloseBtn}
              aria-label="關閉面板"
              data-event={`${gtagPrefix}_mobile_sheet_close`}
              data-item="sheet_close"
              onClick={onMobileSheetClose}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span aria-hidden>×</span>
            </button>
          </div>
          <div ref={mobileSheetBodyRef} className={styles.mobileSheetBody}>
            {mobileSheetExpanded ? (
              !hasAnyListPlaces ? (
                <div className={styles.mobileSheetEmpty}>目前沒有可顯示的地點</div>
              ) : showSingleMobileCard && selectedPlace ? (
                <div
                  ref={singleSwipeWrapRef}
                  className={styles.mobileSheetSingleWrap}
                  onPointerDown={onMobileSinglePointerDown}
                  onPointerMove={onMobileSinglePointerMove}
                  onPointerUp={onMobileSinglePointerUp}
                  onPointerCancel={onMobileSinglePointerUp}
                  onTouchStart={onMobileSingleTouchStart}
                  onTouchMove={onMobileSingleTouchMove}
                  onTouchEnd={onMobileSingleTouchEnd}
                  onWheel={onMobileSingleWheel}
                >
                  <MapPlaceCard
                    key={`ms-${selectedPlace.id}`}
                    place={selectedPlace}
                    selected
                    onPick={focusPlace}
                    gtagPrefix={gtagPrefix}
                    defaultMapButtonEvent={defaultMapButtonEvent}
                    categoryLabels={categoryLabelMap}
                    cardRef={(el) => {
                      mobileCardRefs.current[selectedPlace.id] = el
                    }}
                  />
                  <button
                    type="button"
                    className={styles.mobileSheetSingleHint}
                    data-event={`${gtagPrefix}_mobile_sheet_more`}
                    data-item="single_hint"
                    onClick={() => setMobileSheetBrowseDual(true)}
                  >
                    向上滑可看更多，或點此瀏覽完整列表
                  </button>
                </div>
              ) : (
                <div
                  ref={mobileScrollContainerRef}
                  className={styles.mobileSheetDualViewport}
                  onTouchStart={onDualScrollTouchStart}
                  onTouchMove={onDualScrollTouchMove}
                  onTouchEnd={onDualScrollTouchEnd}
                  onTouchCancel={onDualScrollTouchEnd}
                >
                  <div className={styles.mobileSheetSections}>
                    {listSections.map((s) =>
                      s.places.length > 0 ? (
                        <section
                          key={`mob-${s.key}`}
                          className={`${styles.desktopCardsSection} ${s.rowClass}`}
                          aria-label={s.aria}
                        >
                          <h2 className={styles.sectionTitle}>{s.title}</h2>
                          {s.sectionLabel ? (
                            <p className={styles.sectionLabel}>{s.sectionLabel}</p>
                          ) : null}
                          <div className={styles.desktopCardStack}>
                            {s.places.map((place) => (
                              <MapPlaceCard
                                key={`m-${place.id}`}
                                place={place}
                                selected={selectedId === place.id}
                                onPick={focusPlace}
                                gtagPrefix={gtagPrefix}
                                defaultMapButtonEvent={defaultMapButtonEvent}
                                categoryLabels={categoryLabelMap}
                                cardRef={(el) => {
                                  mobileCardRefs.current[place.id] = el
                                }}
                              />
                            ))}
                          </div>
                        </section>
                      ) : null,
                    )}
                  </div>
                </div>
              )
            ) : selectedPlace ? (
              <p className={styles.mobileSheetPeekName}>{selectedPlace.name}</p>
            ) : (
              <div className={styles.mobileSheetEmpty} aria-hidden>
                &nbsp;
              </div>
            )}
          </div>
        </div>

        {locationPromptOpen ? (
          <div
            className={styles.confirmBackdrop}
            role="presentation"
            onClick={() => {
              if (!locationRequesting) setLocationPromptOpen(false)
            }}
          >
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${gtagPrefix}-location-title`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id={`${gtagPrefix}-location-title`}>允許使用目前位置？</h2>
              <p>JieJourneys 會把地圖移到你的目前位置，定位不會儲存在地圖裡。</p>
              {locationPromptMessage ? <p className={styles.confirmNotice}>{locationPromptMessage}</p> : null}
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.confirmSecondary}
                  onClick={() => setLocationPromptOpen(false)}
                  disabled={locationRequesting}
                >
                  先不要
                </button>
                <button
                  type="button"
                  className={styles.confirmPrimary}
                  onClick={locateUser}
                  disabled={locationRequesting}
                >
                  {locationRequesting ? '定位中...' : '允許定位'}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        <div className={styles.mobileMainSpacer} aria-hidden />
        {belowContent ? (
          <div ref={belowContentRef} className={styles.mapBelowContent}>
            {belowContent}
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
