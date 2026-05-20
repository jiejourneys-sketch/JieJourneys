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
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import { cityMapMarkerIcon, cityMapMarkerZIndex } from '@/lib/cityMapMarkers'
import { getGtag } from '@/lib/gtag'
import { fireMapMarkerGtag, mapBarCardDataEvent } from '@/lib/mapGtag'
import styles from '@/app/tokyo/map/map.module.css'
import type { MapPlace } from '@/lib/mapPlace'

export type MapClientProps = {
  places: MapPlace[]
  mapCenter: { lat: number; lng: number }
  mapZoom?: number
  /** e.g. 'busanmap' | 'tokyomap' | 'northvietnammap' */
  gtagPrefix: string
  title: string
  backHref: string
  /** Override which categories are ON at mount. Defaults to solo 'spot'. */
  defaultCategories?: Record<CityMapPlaceCategory, boolean>
  /** Override which category toggle buttons to show. Defaults to all four. */
  categoryItems?: { key: CityMapPlaceCategory; label: string }[]
  /** Override category labels used in cards, list sections, and marker titles. */
  categoryLabels?: Partial<Record<CityMapPlaceCategory, string>>
  officialPassTierItems?: { key: NonNullable<MapPlace['officialPassTier']>; label: string }[]
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

/** 與各城市地圖共用，避免重複插入 script */
const SCRIPT_ID = 'gmaps-js'

/** 以目前景點 lat/lng 開啟 Google 地圖釘點（非導航路線） */
function googleMapsPinUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`
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
          <span className={styles.catPill}>{categoryLabels[place.category]}</span>
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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  // Derived event strings
  const tabGtagEvent = gtagPrefix.replace('map', '_map_tab')
  const defaultMapButtonEvent = `${gtagPrefix}_spot_map`

  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const userMarkerRef = useRef<google.maps.Marker | null>(null)

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
    useState<Record<CityMapPlaceCategory, boolean>>(() => defaultCategories ?? cityMapSoloCategory('spot'))
  const [officialPassTier, setOfficialPassTier] = useState<NonNullable<MapPlace['officialPassTier']> | 'all'>('all')
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [topActionsOpen, setTopActionsOpen] = useState(false)

  const allCategoriesOn = cityMapCategoriesAllOn(categoryOn)

  const filteredPlaces = useMemo(
    () =>
      places.filter(
        (p) => categoryOn[p.category] && (officialPassTier === 'all' || p.officialPassTier === officialPassTier),
      ),
    [places, categoryOn, officialPassTier],
  )

  const spotPlaces = useMemo(
    () => filteredPlaces.filter((p) => p.category === 'spot'),
    [filteredPlaces],
  )

  const freePlaces = useMemo(
    () => filteredPlaces.filter((p) => p.category === 'free'),
    [filteredPlaces],
  )

  const foodPlaces = useMemo(
    () => filteredPlaces.filter((p) => p.category === 'food'),
    [filteredPlaces],
  )

  const hotelPlaces = useMemo(
    () => filteredPlaces.filter((p) => p.category === 'hotel'),
    [filteredPlaces],
  )

  const listSections = useMemo(
    () => [
      {
        places: spotPlaces,
        title: categoryLabelMap.spot,
        sectionLabel: '票券頁相同連結',
        rowClass: styles.rowSpot,
        aria: categoryLabelMap.spot,
      },
      {
        places: freePlaces,
        title: categoryLabelMap.free,
        sectionLabel: '',
        rowClass: styles.rowFree,
        aria: categoryLabelMap.free,
      },
      {
        places: foodPlaces,
        title: categoryLabelMap.food,
        sectionLabel: '',
        rowClass: styles.rowFood,
        aria: categoryLabelMap.food,
      },
      {
        places: hotelPlaces,
        title: categoryLabelMap.hotel,
        sectionLabel: '與住宿頁相同連結',
        rowClass: styles.rowHotel,
        aria: categoryLabelMap.hotel,
      },
    ],
    [categoryLabelMap, spotPlaces, freePlaces, foodPlaces, hotelPlaces],
  )

  const hasAnyListPlaces = useMemo(
    () =>
      spotPlaces.length > 0 ||
      freePlaces.length > 0 ||
      foodPlaces.length > 0 ||
      hotelPlaces.length > 0,
    [spotPlaces, freePlaces, foodPlaces, hotelPlaces],
  )

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
  }, [])

  const syncMarkers = useCallback(
    (ps: MapPlace[]) => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      clearMarkers()
      for (const p of ps) {
        const marker = new google.maps.Marker({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: `${categoryLabelMap[p.category]}｜${p.name}`,
          icon: cityMapMarkerIcon(p.category, google.maps, p),
          zIndex: cityMapMarkerZIndex(p.category),
        })
        marker.addListener('click', () => {
          fireMapMarkerGtag(gtagPrefix, p)
          focusPlace(p, 'marker')
        })
        markersRef.current.push(marker)
      }
    },
    [categoryLabelMap, clearMarkers, focusPlace, gtagPrefix],
  )

  useEffect(() => {
    if (!apiKey) {
      setMapError('請在 .env.local 設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        await loadGoogleMapsScript(apiKey)
        if (cancelled || !mapElRef.current) return
        const map = new google.maps.Map(mapElRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          zoomControl: true,
        })
        mapRef.current = map
        mapLayoutIdleRef.current = false
        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapLayoutIdleRef.current = true
        })
        setMapReady(true)
        setMapError(null)
        syncMarkers(filteredPlaces)
      } catch {
        if (!cancelled) setMapError('無法載入 Google 地圖，請檢查 API Key 與權限。')
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once when key exists
  }, [apiKey])

  useEffect(() => {
    if (!mapReady) return
    syncMarkers(filteredPlaces)
  }, [mapReady, filteredPlaces, syncMarkers])

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
      fn('event', `${gtagPrefix}_mobile_scroll_below`, {
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

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const map = mapRef.current
        if (!map || !window.google?.maps) return
        if (!userMarkerRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            map,
            position: { lat, lng },
            title: '我的位置',
            zIndex: 10,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 11,
              fillColor: '#0ea5e9',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          })
        } else {
          userMarkerRef.current.setPosition({ lat, lng })
          userMarkerRef.current.setMap(map)
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

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
                        ? { spot: false, free: false, food: false, hotel: false }
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
                {activeCategoryItems.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    className={`tab ${categoryOn[key] ? 'active' : ''}`}
                    aria-pressed={categoryOn[key]}
                    data-area={key}
                    onClick={() => {
                      setCategoryOn((prev) => {
                        const next = cityMapCategoriesAllOn(prev)
                          ? cityMapSoloCategory(key)
                          : { ...prev, [key]: !prev[key] }
                        const fn = getGtag()
                        if (typeof fn === 'function') {
                          const area = (['spot', 'free', 'food', 'hotel'] as const)
                            .filter((k) => next[k])
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
                    {label}
                  </button>
                ))}
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
                    {belowContent ? (
                      <button
                        type="button"
                        className={`${styles.mapTopAction} ${styles.mapTopActionButton} ${styles.mobileOnlyTopAction}`}
                        data-event={`${gtagPrefix}_mobile_scroll_below`}
                        data-section="map_mobile"
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
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.listColumn} aria-label="地點列表（桌機）">
            <div ref={desktopListScrollRef} className={styles.desktopListScroll}>
              {listSections.map((s) =>
                s.places.length > 0 ? (
                  <section
                    key={`desk-${s.aria}`}
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
                          key={`mob-${s.aria}`}
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
