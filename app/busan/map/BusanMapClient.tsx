'use client'
/// <reference types="google.maps" />

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import CitySubpageHeader from '@/components/CitySubpageHeader'
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
import type { BusanMapPlace, BusanPlaceCategory } from '@/data/busan/map/types'
import {
  BUSAN_MAP_CENTER,
  busanMapPlaces,
} from '@/data/busan/map/places'

const MAP_GTAG_PREFIX = 'busanmap'

const CATEGORY_LABEL = CITY_MAP_CATEGORY_LABEL

function busanMapSectionRowClass(category: CityMapPlaceCategory) {
  if (category === 'ticket' || category === 'spot') return styles.rowSpot
  if (category === 'free') return styles.rowFree
  if (category === 'restaurant' || category === 'shop' || category === 'food') return styles.rowFood
  if (category === 'hotel') return styles.rowHotel
  return styles.rowFree
}

function busanMapSectionLabel(category: CityMapPlaceCategory, label: string) {
  if (category === 'ticket' || label.includes('票券')) return '票券頁相同連結'
  if (category === 'hotel') return '與住宿頁相同連結'
  return ''
}

function busanMapMarkerIcon(place: BusanMapPlace): google.maps.Icon {
  return cityMapMarkerIcon(place.category, google.maps)
}

/** 方塊內「地圖」按鈕的 `data-event` 預設值（每筆地點可再用 `mapButtonMapEvent` 覆寫） */
const MAP_SPOT_GOOGLE_MAPS_BUTTON_EVENT = 'busanmap_spot_map'

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

/** 與東京地圖共用，避免重複插入 script */
const SCRIPT_ID = 'gmaps-js'
const LOCATION_RECENTER_MIN_DISTANCE_METERS = 20

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

const MAP_URL_PLACEHOLDER_TOKEN = 'PASTE_YOUR_MAPS_LINK'

function spotMapButtonHref(place: BusanMapPlace): string {
  const url = place.spotGoogleMapsUrl?.trim()
  if (url && !url.includes(MAP_URL_PLACEHOLDER_TOKEN)) return url
  return googleMapsPinUrl(place.lat, place.lng)
}

function mapBarMapButtonEvent(place: BusanMapPlace): string {
  const e = place.mapButtonMapEvent?.trim()
  return e || MAP_SPOT_GOOGLE_MAPS_BUTTON_EVENT
}

function mapBarMapButtonLabel(place: BusanMapPlace): string {
  const t = place.mapButtonLabel?.trim()
  return t || '地圖'
}

function isDesktopViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(DESKTOP_MQ).matches
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
  place: BusanMapPlace
  selected: boolean
  onPick: (p: BusanMapPlace, source: FocusSource) => void
  cardRef: (el: HTMLElement | null) => void
  gtagPrefix: string
}

function MapPlaceCard({ place, selected, onPick, cardRef, gtagPrefix }: MapPlaceCardProps) {
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
      data-area={CATEGORY_LABEL[place.category]}
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
        <span className={styles.catPill}>{CATEGORY_LABEL[place.category]}</span>
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
                onClick={(e) => e.stopPropagation()}
              >
                {a.label}
              </a>
            ))}
          </div>
        ) : null}
        {place.spotActionRows && place.spotActionRows.length > 0 ? (
          <div className={styles.mapActionsStacked}>
            {place.spotActionRows.map((row, ri) => (
              <div key={`row-${ri}`} className={styles.mapActionRow}>
                {row.map((a) => (
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    {a.label}
                  </a>
                ))}
                {ri === 0 ? (
                  <a
                    className="btn"
                    href={spotMapButtonHref(place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event={mapBarMapButtonEvent(place)}
                    data-item={place.id}
                    data-platform="GoogleMaps"
                    data-section="map_bar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {mapBarMapButtonLabel(place)}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : place.spotActions && place.spotActions.length > 0 ? (
          <div className="actions">
            {place.spotActions.map((a) => (
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
                onClick={(e) => e.stopPropagation()}
              >
                {a.label}
              </a>
            ))}
            <a
              className="btn"
              href={spotMapButtonHref(place)}
              target="_blank"
              rel="noopener noreferrer"
              data-event={mapBarMapButtonEvent(place)}
              data-item={place.id}
              data-platform="GoogleMaps"
              data-section="map_bar"
              onClick={(e) => e.stopPropagation()}
            >
              {mapBarMapButtonLabel(place)}
            </a>
          </div>
        ) : place.category !== 'hotel' &&
          !(place.spotActions && place.spotActions.length > 0) &&
          !(place.spotActionRows && place.spotActionRows.length > 0) ? (
          <div className="actions">
            <a
              className="btn"
              href={spotMapButtonHref(place)}
              target="_blank"
              rel="noopener noreferrer"
              data-event={mapBarMapButtonEvent(place)}
              data-item={place.id}
              data-platform="GoogleMaps"
              data-section="map_bar"
              onClick={(e) => e.stopPropagation()}
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

export default function BusanMapClient() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const userPositionRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationWatchIdRef = useRef<number | null>(null)
  const locationFollowingRef = useRef(false)
  const locationLastCenteredRef = useRef<google.maps.LatLngLiteral | null>(null)
  const autoCenteringLocationRef = useRef(false)
  const autoCenteringLocationTimerRef = useRef<number | null>(null)

  const desktopListScrollRef = useRef<HTMLDivElement>(null)
  const mobileSheetBodyRef = useRef<HTMLDivElement>(null)
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null)
  const desktopCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mobileCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mapMoveFromFocusRef = useRef(false)
  const mapLayoutIdleRef = useRef(false)
  const mapClickSuppressUntilRef = useRef(0)
  const mobileSheetRef = useRef<HTMLDivElement>(null)
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

  const isMobileMapLayout = useMobileMapLayout()
  const siteHeaderPx = useSiteHeaderHeightPx()
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(true)
  const [mobileSheetBrowseDual, setMobileSheetBrowseDual] = useState(true)
  const [sheetDragging, setSheetDragging] = useState(false)
  const [sheetDragHeightPx, setSheetDragHeightPx] = useState<number | null>(null)

  const [categoryOn, setCategoryOn] =
    useState<Record<BusanPlaceCategory, boolean>>(DEFAULT_CITY_MAP_CATEGORY_ON)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allCategoriesOn = cityMapCategoriesAllOn(categoryOn)

  const filteredPlaces = useMemo(
    () => busanMapPlaces.filter((p) => categoryOn[p.category]),
    [categoryOn],
  )

  const busanListSections = useMemo(
    () =>
      CITY_MAP_CATEGORY_TOGGLE_ITEMS.map(({ key, label }) => {
        const sectionTitle = CATEGORY_LABEL[key] ?? label
        return {
          places: filteredPlaces.filter((p) => p.category === key),
          title: sectionTitle,
          sectionLabel: busanMapSectionLabel(key, sectionTitle),
          rowClass: busanMapSectionRowClass(key),
          aria: sectionTitle,
        }
      }),
    [filteredPlaces],
  )

  const hasAnyListPlaces = filteredPlaces.length > 0
  const selectedPlace = useMemo(
    () => (selectedId ? busanMapPlaces.find((p) => p.id === selectedId) ?? null : null),
    [selectedId],
  )

  useEffect(() => {
    if (!selectedId) return
    if (!filteredPlaces.some((p) => p.id === selectedId)) setSelectedId(null)
  }, [filteredPlaces, selectedId])

  const showSingleMobileCard =
    mobileSheetExpanded && !!selectedPlace && !mobileSheetBrowseDual && hasAnyListPlaces

  showSingleMobileCardRef.current = showSingleMobileCard

  const focusPlace = useCallback((place: BusanMapPlace, source: FocusSource = 'list') => {
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
      map.panTo({ lat: place.lat, lng: place.lng })
      map.setZoom(16)
      window.setTimeout(() => {
        mapMoveFromFocusRef.current = false
      }, 650)
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

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
  }, [])

  const syncMarkers = useCallback(
    (places: BusanMapPlace[]) => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      clearMarkers()
      for (const p of places) {
        const marker = new google.maps.Marker({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: `${CATEGORY_LABEL[p.category]}｜${p.name}`,
          icon: busanMapMarkerIcon(p),
          zIndex: cityMapMarkerZIndex(p.category),
        })
        marker.addListener('click', () => {
          fireMapMarkerGtag(MAP_GTAG_PREFIX, p)
          focusPlace(p, 'marker')
        })
        markersRef.current.push(marker)
      }
    },
    [clearMarkers, focusPlace],
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
        const mapOptions: google.maps.MapOptions & { cameraControl?: boolean } = {
          center: BUSAN_MAP_CENTER,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          cameraControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          zoomControl: false,
        }
        const map = new google.maps.Map(mapElRef.current, mapOptions)
        mapRef.current = map
        mapLayoutIdleRef.current = false
        google.maps.event.addListenerOnce(map, 'idle', () => {
          mapLayoutIdleRef.current = true
        })
        map.addListener('dragstart', () => {
          locationFollowingRef.current = false
        })
        map.addListener('zoom_changed', () => {
          if (autoCenteringLocationRef.current || mapMoveFromFocusRef.current) return
          locationFollowingRef.current = false
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

  useEffect(() => {
    if (!isMobileMapLayout) setMobileSheetExpanded(true)
  }, [isMobileMapLayout])

  useEffect(() => {
    const el = mobileScrollContainerRef.current
    if (el) el.scrollTop = 0
  }, [categoryOn])

  useEffect(() => {
    if (!mobileSheetBrowseDual || !selectedId) return
    const id = selectedId
    const t = window.setTimeout(() => {
      const el = mobileCardRefs.current[id]
      const c = mobileScrollContainerRef.current
      if (el && c) scrollCardFullyIntoView(c, el, 14, 'auto')
    }, 80)
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
      }
    },
    [mobileSheetBrowseDual],
  )

  const onMobileSingleTouchEnd = useCallback(() => {
    singleSwipeStartRef.current = null
  }, [])

  const onMobileSingleWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      if (mobileSheetBrowseDual || !selectedPlace) return
      if (e.deltaY > 12) setMobileSheetBrowseDual(true)
    },
    [mobileSheetBrowseDual, selectedPlace],
  )

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

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return
    if (locationWatchIdRef.current !== null) {
      const position = userPositionRef.current
      const map = mapRef.current
      if (position && map) {
        locationFollowingRef.current = true
        markLocationAutoCentering()
        map.setCenter(position)
        map.setZoom(Math.max(map.getZoom() ?? 0, 15))
        locationLastCenteredRef.current = position
      }
      return
    }
    locationFollowingRef.current = true
    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const position = { lat, lng }
        userPositionRef.current = position
        const map = mapRef.current
        if (!map || !window.google?.maps) return
        if (!userMarkerRef.current) {
          userMarkerRef.current = new google.maps.Marker({
            map,
            position,
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
          userMarkerRef.current.setPosition(position)
          userMarkerRef.current.setMap(map)
        }
        const lastCentered = locationLastCenteredRef.current
        const shouldRecenter =
          locationFollowingRef.current &&
          (!lastCentered || distanceMeters(lastCentered, position) >= LOCATION_RECENTER_MIN_DISTANCE_METERS)
        if (shouldRecenter) {
          markLocationAutoCentering()
          map.setCenter(position)
          map.setZoom(Math.max(map.getZoom() ?? 0, 15))
          locationLastCenteredRef.current = position
        }
      },
      () => {
        locationFollowingRef.current = false
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    )
  }, [markLocationAutoCentering])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  useEffect(() => {
    return () => {
      if (locationWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current)
        locationWatchIdRef.current = null
      }
      if (autoCenteringLocationTimerRef.current !== null) {
        window.clearTimeout(autoCenteringLocationTimerRef.current)
        autoCenteringLocationTimerRef.current = null
      }
      autoCenteringLocationRef.current = false
      locationFollowingRef.current = false
      locationLastCenteredRef.current = null
    }
  }, [])

  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanmap" />
      <main
        className={`transport-main ${styles.mapPage}`}
        style={
          siteHeaderPx != null
            ? ({ ['--map-header-offset']: `${siteHeaderPx}px` } as CSSProperties)
            : undefined
        }
      >
        <div className={styles.topBar}>
          <h1>釜山地圖</h1>
          <div className={styles.introBlock}>
            <div
              className="tabs"
              id="busanMapCategoryToggles"
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
                      ? Object.fromEntries(
                          Object.keys(prev).map((category) => [category, false]),
                        ) as Record<CityMapPlaceCategory, boolean>
                      : { ...DEFAULT_CITY_MAP_CATEGORY_ON }
                    const fn = getGtag()
                    if (typeof fn === 'function') {
                      fn('event', 'busan_map_tab', {
                        area: cityMapCategoriesAllOn(next) ? 'all' : 'none',
                        page_path: location.pathname,
                      })
                    }
                    return next
                  })
                  setSelectedId(null)
                  setMobileSheetBrowseDual(true)
                  if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
                    setMobileSheetExpanded(true)
                    mapClickSuppressUntilRef.current = Date.now() + 450
                  }
                }}
              >
                全部
              </button>
              {CITY_MAP_CATEGORY_TOGGLE_ITEMS.map(({ key, label }) => (
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
                        const area = CITY_MAP_CATEGORY_TOGGLE_ITEMS
                          .map((item) => item.key)
                          .filter((k) => next[k])
                          .join(',')
                        fn('event', 'busan_map_tab', {
                          area: area || 'none',
                          page_path: location.pathname,
                        })
                      }
                      return next
                    })
                    setSelectedId(null)
                    setMobileSheetBrowseDual(true)
                    if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
                      setMobileSheetExpanded(true)
                      mapClickSuppressUntilRef.current = Date.now() + 450
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.splitWrap}>
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
              {busanListSections.map((s) =>
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
                          gtagPrefix={MAP_GTAG_PREFIX}
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
          className={`${styles.mobileSheet} ${sheetDragging ? styles.mobileSheetDragging : ''} ${
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
              data-event="busanmap_mobile_sheet_drag"
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
              data-event="busanmap_mobile_sheet_close"
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
                    gtagPrefix={MAP_GTAG_PREFIX}
                    cardRef={(el) => {
                      mobileCardRefs.current[selectedPlace.id] = el
                    }}
                  />
                  <button
                    type="button"
                    className={styles.mobileSheetSingleHint}
                    data-event="busanmap_mobile_sheet_more"
                    data-item="single_hint"
                    onClick={() => setMobileSheetBrowseDual(true)}
                  >
                    向上滑可看更多，或點此瀏覽完整列表
                  </button>
                </div>
              ) : (
                <div ref={mobileScrollContainerRef} className={styles.mobileSheetDualViewport}>
                  <div className={styles.mobileSheetSections}>
                    {busanListSections.map((s) =>
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
                                gtagPrefix={MAP_GTAG_PREFIX}
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
      </main>
      <Footer />
    </>
  )
}
