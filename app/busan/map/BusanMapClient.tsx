'use client'

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AreaTabs, { type TabItem } from '@/components/AreaTabs'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import styles from '@/app/tokyo/map/map.module.css'
import {
  BUSAN_MAP_CENTER,
  busanMapPlaces,
  type BusanMapPlace,
  type BusanPlaceCategory,
} from '@/data/busanMapPlaces'

type Filter = 'all' | BusanPlaceCategory

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

const SPOT_MARKER_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
  <path fill="#1f7a8c" stroke="#fff" stroke-width="2" stroke-linejoin="round"
    d="M20 2C10.6 2 3 9.6 3 19c0 11 17 27 17 27s17-16 17-27C37 9.6 29.4 2 20 2z"/>
  <circle cx="20" cy="19" r="5.5" fill="#fff"/>
</svg>`.replace(/\s+/g, ' ')
    .trim(),
)

const HOTEL_MARKER_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
  <path fill="#c2410c" stroke="#fff" stroke-width="2" d="M5 17h28v18H5z"/>
  <path fill="#ea580c" stroke="#fff" stroke-width="2" stroke-linejoin="round" d="M3 17L19 8l16 9"/>
  <rect x="14" y="24" width="10" height="11" rx="1" fill="#fff7ed"/>
</svg>`.replace(/\s+/g, ' ')
    .trim(),
)

function mapMarkerIcon(place: BusanMapPlace): google.maps.Icon {
  const g = google.maps
  if (place.category === 'hotel') {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${HOTEL_MARKER_SVG}`,
      scaledSize: new g.Size(22, 22),
      anchor: new g.Point(11, 20),
    }
  }
  return {
    url: `data:image/svg+xml;charset=UTF-8,${SPOT_MARKER_SVG}`,
    scaledSize: new g.Size(24, 28),
    anchor: new g.Point(12, 28),
  }
}

const MAP_TABS: TabItem[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: 'spot', label: '景點', dataArea: 'spot' },
  { value: 'hotel', label: '住宿', dataArea: 'hotel' },
]

const CATEGORY_LABEL: Record<BusanPlaceCategory, string> = {
  spot: '景點',
  hotel: '住宿',
}

/** 與東京地圖共用，避免重複插入 script */
const SCRIPT_ID = 'gmaps-js'

function mapsNavigateUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
}

function isDesktopViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(DESKTOP_MQ).matches
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
}

function MapPlaceCard({ place, selected, onPick, cardRef }: MapPlaceCardProps) {
  return (
    <article
      ref={cardRef}
      className={`stay-card ${styles.hCardDesktop} ${selected ? styles.hCardActive : ''}`}
      role="button"
      tabIndex={0}
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
        <div className="actions">
          {place.hotelActions && place.hotelActions.length > 0
            ? place.hotelActions.map((a) => (
                <a
                  key={`${a.label}-${a.href}`}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={a.event}
                  data-platform={a.platform}
                  data-section={a.section}
                  className={a.className ?? 'btn'}
                  onClick={(e) => e.stopPropagation()}
                >
                  {a.label}
                </a>
              ))
            : null}
          {place.spotActions && place.spotActions.length > 0 ? (
            <>
              {place.spotActions.map((a) => (
                <a
                  key={`${a.label}-${a.href}`}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={a.event}
                  data-platform={a.platform}
                  data-section={a.section}
                  className={a.className ?? 'btn'}
                  onClick={(e) => e.stopPropagation()}
                >
                  {a.label}
                </a>
              ))}
              <a
                className="btn"
                href={mapsNavigateUrl(place.lat, place.lng)}
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanmap_spot_nav"
                data-platform="GoogleMaps"
                data-section="map_card"
                onClick={(e) => e.stopPropagation()}
              >
                導航
              </a>
            </>
          ) : null}
        </div>
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

  const desktopListScrollRef = useRef<HTMLDivElement>(null)
  const mobileSheetBodyRef = useRef<HTMLDivElement>(null)
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null)
  const desktopCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mobileCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const mapMoveFromFocusRef = useRef(false)
  const mapLayoutIdleRef = useRef(false)
  const mapClickSuppressUntilRef = useRef(0)
  const sheetPointerDownRef = useRef<{ y: number; id: number } | null>(null)
  const sheetDragMovedRef = useRef(false)
  const suppressHandleClickRef = useRef(false)
  const sheetTapHandledRef = useRef(false)
  const handleTouchStartYRef = useRef<number | null>(null)
  const handleTouchMovedRef = useRef(false)
  const singleSwipeStartRef = useRef<number | null>(null)

  const isMobileMapLayout = useMobileMapLayout()
  const siteHeaderPx = useSiteHeaderHeightPx()
  const [mobileSheetExpanded, setMobileSheetExpanded] = useState(true)
  const [mobileSheetBrowseDual, setMobileSheetBrowseDual] = useState(true)

  const [filter, setFilter] = useState<Filter>('all')
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredPlaces = useMemo(() => {
    if (filter === 'all') return busanMapPlaces
    return busanMapPlaces.filter((p) => p.category === filter)
  }, [filter])

  const spotPlaces = useMemo(() => {
    if (filter === 'hotel') return []
    return busanMapPlaces.filter((p) => p.category === 'spot')
  }, [filter])

  const hotelPlaces = useMemo(() => {
    if (filter === 'spot') return []
    return busanMapPlaces.filter((p) => p.category === 'hotel')
  }, [filter])

  const selectedPlace = useMemo(
    () => (selectedId ? busanMapPlaces.find((p) => p.id === selectedId) ?? null : null),
    [selectedId],
  )

  const showSingleMobileCard =
    mobileSheetExpanded &&
    !!selectedPlace &&
    !mobileSheetBrowseDual &&
    (spotPlaces.length > 0 || hotelPlaces.length > 0)

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
          title: `${p.category === 'hotel' ? '住宿' : '景點'}｜${p.name}`,
          icon: mapMarkerIcon(p),
          zIndex: p.category === 'spot' ? 3 : 2,
        })
        marker.addListener('click', () => focusPlace(p, 'marker'))
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
        const map = new google.maps.Map(mapElRef.current, {
          center: BUSAN_MAP_CENTER,
          zoom: 11,
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
  }, [filter, mapReady, filteredPlaces, syncMarkers])

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
  }, [filter])

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

  const onSheetHandlePointerDown = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return
    sheetPointerDownRef.current = { y: e.clientY, id: e.pointerId }
    sheetDragMovedRef.current = false
  }, [])

  const onSheetHandlePointerMove = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return
    const d = sheetPointerDownRef.current
    if (!d || d.id !== e.pointerId) return
    if (Math.abs(e.clientY - d.y) > 10) sheetDragMovedRef.current = true
  }, [])

  const onSheetHandlePointerUp = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return
    const d = sheetPointerDownRef.current
    if (!d || d.id !== e.pointerId) return
    const dy = e.clientY - d.y
    sheetPointerDownRef.current = null
    if (sheetDragMovedRef.current && Math.abs(dy) >= 28) {
      suppressHandleClickRef.current = true
      if (dy < 0) setMobileSheetExpanded(true)
      else setMobileSheetExpanded(false)
    }
    sheetDragMovedRef.current = false
  }, [])

  const onSheetHandlePointerCancel = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return
    sheetPointerDownRef.current = null
    sheetDragMovedRef.current = false
  }, [])

  const onSheetHandleTouchStart = useCallback((e: ReactTouchEvent<HTMLButtonElement>) => {
    if (e.touches.length !== 1) return
    handleTouchStartYRef.current = e.touches[0].clientY
    handleTouchMovedRef.current = false
  }, [])

  const onSheetHandleTouchMove = useCallback((e: ReactTouchEvent<HTMLButtonElement>) => {
    if (handleTouchStartYRef.current == null || e.touches.length !== 1) return
    const y = e.touches[0].clientY
    if (Math.abs(y - handleTouchStartYRef.current) > 12) handleTouchMovedRef.current = true
  }, [])

  const onSheetHandleTouchEnd = useCallback((e: ReactTouchEvent<HTMLButtonElement>) => {
    const startY = handleTouchStartYRef.current
    handleTouchStartYRef.current = null
    if (startY == null) return
    const t = e.changedTouches[0]
    const endY = t?.clientY
    if (endY === undefined) {
      handleTouchMovedRef.current = false
      return
    }
    const dy = endY - startY
    const moved = handleTouchMovedRef.current
    handleTouchMovedRef.current = false
    if (moved && Math.abs(dy) >= 28) {
      sheetTapHandledRef.current = true
      if (dy < 0) setMobileSheetExpanded(true)
      else setMobileSheetExpanded(false)
      return
    }
    if (!moved) {
      sheetTapHandledRef.current = true
      setMobileSheetExpanded((v) => !v)
    }
  }, [])

  const onSheetHandleClick = useCallback((e: ReactMouseEvent<HTMLButtonElement>) => {
    if (sheetTapHandledRef.current) {
      sheetTapHandledRef.current = false
      e.preventDefault()
      return
    }
    if (suppressHandleClickRef.current) {
      suppressHandleClickRef.current = false
      e.preventDefault()
      return
    }
    setMobileSheetExpanded((v) => !v)
  }, [])

  const onMobileSinglePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    singleSwipeStartRef.current = e.clientY
  }, [])

  const onMobileSinglePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (mobileSheetBrowseDual || singleSwipeStartRef.current == null) return
      if (singleSwipeStartRef.current - e.clientY > 24) {
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
      if (singleSwipeStartRef.current - y > 24) {
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
              scale: 10,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
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
            <AreaTabs
              tabs={MAP_TABS}
              activeTab={filter}
              onTabChange={(v) => {
                setFilter(v as Filter)
                setSelectedId(null)
                setMobileSheetBrowseDual(true)
                if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAP_MQ).matches) {
                  setMobileSheetExpanded(true)
                  mapClickSuppressUntilRef.current = Date.now() + 450
                }
              }}
              gtagEvent="busan_map_tab"
              showActive
            />
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
              {spotPlaces.length > 0 ? (
                <section
                  className={`${styles.desktopCardsSection} ${styles.rowSpot}`}
                  aria-label="景點"
                >
                  <h2 className={styles.sectionTitle}>景點</h2>
                  <p className={styles.sectionLabel}>票券頁相同連結</p>
                  <div className={styles.desktopCardStack}>
                    {spotPlaces.map((place) => (
                      <MapPlaceCard
                        key={`d-${place.id}`}
                        place={place}
                        selected={selectedId === place.id}
                        onPick={focusPlace}
                        cardRef={(el) => {
                          desktopCardRefs.current[place.id] = el
                        }}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
              {hotelPlaces.length > 0 ? (
                <section
                  className={`${styles.desktopCardsSection} ${styles.rowHotel}`}
                  aria-label="住宿"
                >
                  <h2 className={styles.sectionTitle}>住宿</h2>
                  <p className={styles.sectionLabel}>與住宿頁相同連結</p>
                  <div className={styles.desktopCardStack}>
                    {hotelPlaces.map((place) => (
                      <MapPlaceCard
                        key={`d-${place.id}`}
                        place={place}
                        selected={selectedId === place.id}
                        onPick={focusPlace}
                        cardRef={(el) => {
                          desktopCardRefs.current[place.id] = el
                        }}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </aside>
        </div>

        <div
          className={`${styles.mobileSheet} ${
            !mobileSheetExpanded
              ? styles.mobileSheetCollapsed
              : showSingleMobileCard
                ? styles.mobileSheetExpandedSingle
                : styles.mobileSheetExpanded
          }`}
          aria-label="地點列表（手機）"
        >
          <button
            type="button"
            className={styles.mobileSheetHandleButton}
            aria-expanded={mobileSheetExpanded}
            aria-label={mobileSheetExpanded ? '收合列表' : '展開列表'}
            data-event="busanmap_mobile_sheet_toggle"
            data-item="sheet_handle"
            onClick={onSheetHandleClick}
            onPointerDown={onSheetHandlePointerDown}
            onPointerMove={onSheetHandlePointerMove}
            onPointerUp={onSheetHandlePointerUp}
            onPointerCancel={onSheetHandlePointerCancel}
            onTouchStart={onSheetHandleTouchStart}
            onTouchMove={onSheetHandleTouchMove}
            onTouchEnd={onSheetHandleTouchEnd}
          >
            <span className={styles.mobileSheetHandle} aria-hidden />
          </button>
          <div ref={mobileSheetBodyRef} className={styles.mobileSheetBody}>
            {mobileSheetExpanded ? (
              spotPlaces.length === 0 && hotelPlaces.length === 0 ? (
                <div className={styles.mobileSheetEmpty}>目前沒有可顯示的地點</div>
              ) : showSingleMobileCard && selectedPlace ? (
                <div
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
                    向上滑可看更多，或點此瀏覽列表（約兩張卡片）
                  </button>
                </div>
              ) : (
                <div ref={mobileScrollContainerRef} className={styles.mobileSheetDualViewport}>
                  <div className={styles.mobileSheetSections}>
                    {spotPlaces.length > 0 ? (
                      <section
                        className={`${styles.desktopCardsSection} ${styles.rowSpot}`}
                        aria-label="景點"
                      >
                        <h2 className={styles.sectionTitle}>景點</h2>
                        <p className={styles.sectionLabel}>票券頁相同連結</p>
                        <div className={styles.desktopCardStack}>
                          {spotPlaces.map((place) => (
                            <MapPlaceCard
                              key={`m-${place.id}`}
                              place={place}
                              selected={selectedId === place.id}
                              onPick={focusPlace}
                              cardRef={(el) => {
                                mobileCardRefs.current[place.id] = el
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    ) : null}
                    {hotelPlaces.length > 0 ? (
                      <section
                        className={`${styles.desktopCardsSection} ${styles.rowHotel}`}
                        aria-label="住宿"
                      >
                        <h2 className={styles.sectionTitle}>住宿</h2>
                        <p className={styles.sectionLabel}>與住宿頁相同連結</p>
                        <div className={styles.desktopCardStack}>
                          {hotelPlaces.map((place) => (
                            <MapPlaceCard
                              key={`m-${place.id}`}
                              place={place}
                              selected={selectedId === place.id}
                              onPick={focusPlace}
                              cardRef={(el) => {
                                mobileCardRefs.current[place.id] = el
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    ) : null}
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
