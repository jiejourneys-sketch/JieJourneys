'use client'
/// <reference types="google.maps" />

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import {
  DEFAULT_CITY_MAP_CATEGORY_ON,
  cityMapSoloCategory,
  type CityMapPlaceCategory,
} from '@/lib/cityMapPlaceCategory'
import { cityMapMarkerIcon, cityMapMarkerZIndex } from '@/lib/cityMapMarkers'
import { getGtag } from '@/lib/gtag'
import type { MapPlace } from '@/lib/mapPlace'
import styles from './passPlanner.module.css'

type PlannerMode = 'add' | 'order'
type TierFilter = NonNullable<MapPlace['officialPassTier']> | 'all'
type FocusSource = 'marker' | 'list'
type InAppBrowser = 'instagram' | 'line' | 'facebook' | null

type Props = {
  places: MapPlace[]
  mapCenter: { lat: number; lng: number }
  config?: Partial<PlannerConfig>
}

export type PlannerConfig = {
  storageKey: string
  headerBackHref: string
  eventPrefix: string
  title: string
  description: string
  topAriaLabel: string
  workspaceAriaLabel: string
  panelAriaLabel: string
  shareTitle: string
  shareText: string
  shareActionLabel: string
  saveReminderEnabled: boolean
  backLinkLabel: string
  categoryLabels: Record<MapPlace['category'], string>
  categoryItems: { key: CityMapPlaceCategory; label: string }[]
  tierLabels: Partial<Record<NonNullable<MapPlace['officialPassTier']>, string>>
  tierItems: { key: Exclude<TierFilter, 'all'>; label: string }[]
}

const SCRIPT_ID = 'gmaps-js'
const SHARE_PARAM = 'plan'

const defaultCategoryLabels: Record<MapPlace['category'], string> = {
  spot: '價格高',
  free: '價格中',
  food: '價格低',
  hotel: '住宿',
}

const defaultCategoryItems: { key: CityMapPlaceCategory; label: string }[] = [
  { key: 'spot', label: '價格高' },
  { key: 'free', label: '價格中' },
  { key: 'food', label: '價格低' },
]

const defaultTierLabels: Record<NonNullable<MapPlace['officialPassTier']>, string> = {
  purple: '紫色/A區',
  blue: '藍色/B區',
}

const defaultTierItems: { key: Exclude<TierFilter, 'all'>; label: string }[] = [
  { key: 'purple', label: '紫色/A區景點' },
  { key: 'blue', label: '藍色/B區景點' },
]

const defaultPlannerConfig: PlannerConfig = {
  storageKey: 'jiejourneys:busan-pass-planner:v1',
  headerBackHref: '/busan/pass-map',
  eventPrefix: 'busanpassplanner',
  title: '釜山Pass景點排序',
  description: '加入想去的景點，拖曳調整順序，地圖會用數字和連線同步顯示位置。',
  topAriaLabel: '釜山Pass景點排序工具',
  workspaceAriaLabel: '排序工作區',
  panelAriaLabel: '景點排序面板',
  shareTitle: '釜山Pass景點排序',
  shareText: '我的釜山Pass景點順序',
  shareActionLabel: '分享',
  saveReminderEnabled: false,
  backLinkLabel: '回 Pass 地圖',
  categoryLabels: defaultCategoryLabels,
  categoryItems: defaultCategoryItems,
  tierLabels: defaultTierLabels,
  tierItems: defaultTierItems,
}

function plannerCategoriesAllOn(
  c: Record<CityMapPlaceCategory, boolean>,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
) {
  return categoryItems.every(({ key }) => c[key])
}

function plannerMarkerIcon(
  place: MapPlace,
  maps: typeof google.maps,
  order: number | null,
): google.maps.Icon {
  const icon = cityMapMarkerIcon(place.category, maps, place)
  if (!order) return icon
  return {
    ...icon,
    labelOrigin: new maps.Point(15, place.category === 'food' ? 15 : 14),
  }
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

function googleMapsPinUrl(place: MapPlace) {
  const url = place.spotGoogleMapsUrl?.trim()
  if (url && !url.includes('PASTE_YOUR_MAPS_LINK')) return url
  return `https://www.google.com/maps?q=${place.lat},${place.lng}`
}

function naverMapUrl(place: MapPlace) {
  const actions = place.spotActionRows?.flat() ?? place.spotActions ?? []
  return actions.find((action) => action.platform === 'NaverMap' || action.label.toLowerCase() === 'navermap')?.href
}

function shortName(name: string) {
  return name.replace(/\s*\d+\s*元$/, '').trim()
}

function isMobilePlannerViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 959px)').matches
}

function detectInAppBrowser(): InAppBrowser {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/Line\//i.test(ua)) return 'line'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook'
  return null
}

function preferredBrowserName() {
  if (typeof navigator === 'undefined') return 'Safari/Chrome'
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Safari' : 'Chrome'
}

function inAppBrowserName(browser: InAppBrowser) {
  if (browser === 'instagram') return 'IG'
  if (browser === 'line') return 'LINE'
  if (browser === 'facebook') return 'Facebook'
  return '內建'
}

function panMobilePlaceAbovePanel(map: google.maps.Map) {
  if (!isMobilePlannerViewport()) return
  map.panBy(0, Math.round(window.innerHeight * 0.2))
}

function focusMapOnPlace(map: google.maps.Map, place: MapPlace) {
  map.setCenter({ lat: place.lat, lng: place.lng })
  map.setZoom(16)
  window.setTimeout(() => panMobilePlaceAbovePanel(map), 140)
}

function encodeSharedPlan(ids: string[], places: MapPlace[]) {
  const indexById = new Map(places.map((place, index) => [place.id, index]))
  return ids
    .map((id) => indexById.get(id))
    .filter((index): index is number => typeof index === 'number')
    .map((index) => index.toString(36))
    .join('.')
}

function parseSharedPlan(search: string, placeById: Map<string, MapPlace>, places: MapPlace[]) {
  const params = new URLSearchParams(search)
  const raw = params.get(SHARE_PARAM)
  if (!raw) return null
  const seen = new Set<string>()

  if (!raw.includes(',')) {
    return raw
      .split('.')
      .map((token) => places[Number.parseInt(token, 36)]?.id)
      .filter((id): id is string => {
        if (!id || !placeById.has(id) || seen.has(id)) return false
        seen.add(id)
        return true
      })
  }

  return raw
    .split(',')
    .map((id) => id.trim())
    .filter((id): id is string => {
      if (!id || !placeById.has(id) || seen.has(id)) return false
      seen.add(id)
      return true
    })
}

function distanceKm(a: MapPlace, b: MapPlace) {
  const earthRadiusKm = 6371
  const toRad = (value: number) => (value * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h))
}

function sortPlacesByNearestNeighbor(places: MapPlace[]) {
  if (places.length <= 2) return places

  const sorted = [places[0]]
  const remaining = places.slice(1)

  while (remaining.length > 0) {
    const current = sorted[sorted.length - 1]
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    remaining.forEach((place, index) => {
      const distance = distanceKm(current, place)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    const [next] = remaining.splice(nearestIndex, 1)
    sorted.push(next)
  }

  return sorted
}

function placeMeta(
  place: MapPlace,
  categoryLabels: Record<MapPlace['category'], string>,
  tierLabels: PlannerConfig['tierLabels'],
) {
  return [categoryLabels[place.category], place.officialPassTier ? tierLabels[place.officialPassTier] : null]
    .filter(Boolean)
    .join('・')
}

function scrollCardFullyIntoView(card: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  const container = card.closest('[data-planner-scroll-list="true"]') as HTMLElement | null
  if (!container) return

  const padding = 12
  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const visibleTop = cRect.top + padding
  const visibleBottom = cRect.bottom - padding
  let delta = 0

  if (eRect.height >= cRect.height - padding * 2 || eRect.top < visibleTop) {
    delta = eRect.top - visibleTop
  } else if (eRect.bottom > visibleBottom) {
    delta = eRect.bottom - visibleBottom
  }

  if (Math.abs(delta) > 1) container.scrollBy({ top: delta, behavior })
}

function scrollCardToContainerCenter(card: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  const container = card.closest('[data-planner-scroll-list="true"]') as HTMLElement | null
  if (!container) return

  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const delta = eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2)
  if (Math.abs(delta) > 1) container.scrollBy({ top: delta, behavior })
}

function SortablePlanItem({
  place,
  label,
  selected,
  onFocus,
  onRemove,
  cardRef,
  categoryLabels,
  tierLabels,
}: {
  place: MapPlace
  label: string
  selected: boolean
  onFocus: () => void
  onRemove: () => void
  cardRef: (el: HTMLElement | null) => void
  categoryLabels: Record<MapPlace['category'], string>
  tierLabels: PlannerConfig['tierLabels']
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: place.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const setRefs = (el: HTMLElement | null) => {
    setNodeRef(el)
    cardRef(el)
  }

  return (
    <article
      ref={setRefs}
      style={style}
      className={`${styles.planCard} ${selected ? styles.planCardActive : ''} ${isDragging ? styles.planCardDragging : ''}`}
    >
      <button className={styles.dragHandle} type="button" aria-label={`拖曳排序 ${shortName(place.name)}`} {...attributes} {...listeners}>
        <span aria-hidden>☰</span>
      </button>
      <button className={styles.planMain} type="button" onClick={onFocus}>
          <span className={styles.planNumber}>{label}</span>
        <span className={styles.planText}>
          <span className={styles.placeName}>{shortName(place.name)}</span>
          <span className={styles.placeMeta}>{placeMeta(place, categoryLabels, tierLabels)}</span>
        </span>
      </button>
      <span className={styles.mapLinks}>
        <a className={styles.iconLink} href={googleMapsPinUrl(place)} target="_blank" rel="noopener noreferrer">
          Google
        </a>
        {naverMapUrl(place) ? (
          <a className={styles.iconLink} href={naverMapUrl(place)} target="_blank" rel="noopener noreferrer">
            Naver
          </a>
        ) : null}
      </span>
      <button className={styles.removeButton} type="button" onClick={onRemove} aria-label={`移除 ${shortName(place.name)}`}>
        ×
      </button>
    </article>
  )
}

export default function BusanPassPlannerClient({ places, mapCenter, config: configOverrides }: Props) {
  const config = useMemo(
    () => ({
      ...defaultPlannerConfig,
      ...configOverrides,
      categoryLabels: {
        ...defaultPlannerConfig.categoryLabels,
        ...configOverrides?.categoryLabels,
      },
      tierLabels: {
        ...defaultPlannerConfig.tierLabels,
        ...configOverrides?.tierLabels,
      },
    }),
    [configOverrides],
  )
  const categoryLabels = config.categoryLabels
  const plannerCategoryItems = config.categoryItems
  const tierLabels = config.tierLabels
  const tierItems = config.tierItems
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const lineRef = useRef<google.maps.Polyline | null>(null)
  const addCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const planCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const panelBodyRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const modeRef = useRef<PlannerMode>('add')
  const openTrackedRef = useRef(false)
  const panelDragSessionRef = useRef<{
    pointerId: number
    startY: number
    startHeightPx: number
    collapsedPx: number
    expandedPx: number
  } | null>(null)
  const panelLiveHeightRef = useRef<number | null>(null)
  const panelClickSuppressUntilRef = useRef(0)
  const panelBodyTouchStartYRef = useRef<number | null>(null)
  const panelBodyPullCanCollapseRef = useRef(false)

  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(() =>
    apiKey ? null : '請在環境變數設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  )
  const [mode, setMode] = useState<PlannerMode>('add')
  const [categoryOn, setCategoryOn] = useState<Record<CityMapPlaceCategory, boolean>>(() => ({
    ...DEFAULT_CITY_MAP_CATEGORY_ON,
    hotel: false,
  }))
  const [tier, setTier] = useState<TierFilter>('all')
  const [planIds, setPlanIds] = useState<string[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobilePageHeight, setMobilePageHeight] = useState<number | null>(null)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [mobilePanelDragging, setMobilePanelDragging] = useState(false)
  const [mobilePanelDragHeight, setMobilePanelDragHeight] = useState<number | null>(null)
  const [autoSortConfirmOpen, setAutoSortConfirmOpen] = useState(false)
  const [saveSheetUrl, setSaveSheetUrl] = useState<string | null>(null)
  const [saveLinkCopied, setSaveLinkCopied] = useState(false)
  const [inAppBrowser, setInAppBrowser] = useState<InAppBrowser>(null)

  const placeById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const validPlanIds = useMemo(() => planIds.filter((id) => placeById.has(id)), [placeById, planIds])
  const plannedPlaces = useMemo(
    () => validPlanIds.map((id) => placeById.get(id)).filter(Boolean) as MapPlace[],
    [placeById, validPlanIds],
  )
  const planCode = useMemo(() => encodeSharedPlan(validPlanIds, places), [places, validPlanIds])
  const trackPlannerEvent = useCallback(
    (eventSuffix: string, params: Record<string, string | number | boolean | null | undefined> = {}) => {
      const fn = getGtag()
      if (typeof fn !== 'function') return
      fn('event', `${config.eventPrefix}_${eventSuffix}`, {
        page_path: location.pathname,
        plan_count: validPlanIds.length,
        plan_code: planCode,
        ...params,
      })
    },
    [config.eventPrefix, planCode, validPlanIds.length],
  )
  const planOrderLabels = useMemo(() => {
    const labels = new Map<string, string>()
    validPlanIds.forEach((id, index) => {
      labels.set(id, String(index + 1))
    })
    return labels
  }, [validPlanIds])
  const plannedSet = useMemo(() => new Set(validPlanIds), [validPlanIds])

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (!categoryOn[place.category]) return false
      if (tier !== 'all' && place.officialPassTier !== tier) return false
      return true
    })
  }, [categoryOn, places, tier])

  const selectedPlace = selectedId ? placeById.get(selectedId) ?? null : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    if (openTrackedRef.current) return
    openTrackedRef.current = true
    trackPlannerEvent('open')
  }, [trackPlannerEvent])

  useEffect(() => {
    if (!config.saveReminderEnabled) return
    setInAppBrowser(detectInAppBrowser())
  }, [config.saveReminderEnabled])

  const getMobilePanelMetrics = useCallback(() => {
    const pageHeight = mobilePageHeight ?? (typeof window === 'undefined' ? 720 : window.innerHeight)
    return {
      collapsedPx: 72,
      expandedPx: Math.min(Math.round(pageHeight * 0.52), 430),
    }
  }, [mobilePageHeight])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 959px)')
    let observer: ResizeObserver | null = null

    const measureMobileHeight = () => {
      if (!media.matches) {
        setMobilePageHeight(null)
        return
      }

      const header = document.querySelector('header')
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0
      const availableHeight = Math.floor(window.innerHeight - headerBottom)
      setMobilePageHeight(Math.max(520, availableHeight))
    }

    const id = window.setTimeout(measureMobileHeight, 0)
    window.addEventListener('resize', measureMobileHeight)
    window.addEventListener('orientationchange', measureMobileHeight)
    media.addEventListener('change', measureMobileHeight)

    const header = document.querySelector('header')
    if (header) {
      observer = new ResizeObserver(measureMobileHeight)
      observer.observe(header)
    }

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', measureMobileHeight)
      window.removeEventListener('orientationchange', measureMobileHeight)
      media.removeEventListener('change', measureMobileHeight)
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const sharedPlan = parseSharedPlan(window.location.search, placeById, places)
        if (sharedPlan) {
          setPlanIds(sharedPlan)
          setMode('order')
          setMobilePanelOpen(true)
          return
        }

        const raw = window.localStorage.getItem(config.storageKey)
        if (raw) {
          const parsed = JSON.parse(raw) as unknown
          if (Array.isArray(parsed)) {
            setPlanIds(parsed.filter((item): item is string => typeof item === 'string'))
          }
        }
      } catch {
        setPlanIds([])
      } finally {
        setStorageReady(true)
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [config.storageKey, placeById, places])

  useEffect(() => {
    if (!storageReady) return
    window.localStorage.setItem(config.storageKey, JSON.stringify(validPlanIds))
  }, [config.storageKey, storageReady, validPlanIds])

  const focusPlace = useCallback((place: MapPlace, source: FocusSource = 'list') => {
    if (source === 'marker') setMobilePanelOpen(true)
    if (source === 'list' && isMobilePlannerViewport()) setMobilePanelOpen(false)
    setSelectedId(place.id)
    const map = mapRef.current
    if (map) {
      focusMapOnPlace(map, place)
    }

    if (source === 'marker') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const refs = modeRef.current === 'order' ? planCardRefs.current : addCardRefs.current
          const card = refs[place.id]
          if (card) {
            if (isMobilePlannerViewport()) scrollCardFullyIntoView(card)
            else scrollCardToContainerCenter(card)
          }
        })
      })
    }
  }, [])

  const fitMapToPlaces = useCallback(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps || places.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    places.forEach((place) => bounds.extend({ lat: place.lat, lng: place.lng }))
    map.fitBounds(bounds, 48)
  }, [places])

  const syncMap = useCallback(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return

    const maps = google.maps

    if (!lineRef.current) {
      lineRef.current = new maps.Polyline({
        geodesic: true,
        strokeColor: '#1f7a8c',
        strokeOpacity: 0.85,
        strokeWeight: 3,
      })
    }
    lineRef.current.setPath(plannedPlaces.map((place) => ({ lat: place.lat, lng: place.lng })))
    lineRef.current.setMap(plannedPlaces.length > 1 ? map : null)

    const visiblePlaces = mode === 'order' ? plannedPlaces : filteredPlaces
    const visibleIds = new Set(visiblePlaces.map((place) => place.id))

    places.forEach((place) => {
      const orderIndex = validPlanIds.indexOf(place.id)
      const inPlan = orderIndex >= 0
      const orderLabel = planOrderLabels.get(place.id) ?? null
      let marker = markersRef.current.get(place.id)
      if (!marker) {
        marker = new maps.Marker({
          position: { lat: place.lat, lng: place.lng },
        })
        marker.addListener('click', () => {
          focusPlace(place, 'marker')
        })
        markersRef.current.set(place.id, marker)
      }
      marker.setTitle(inPlan && orderLabel ? `${orderLabel}. ${place.name}` : place.name)
      marker.setZIndex(inPlan ? 1000 + orderIndex : cityMapMarkerZIndex(place.category))
      marker.setIcon(plannerMarkerIcon(place, maps, orderLabel ? 1 : null))
      marker.setLabel(orderLabel ? { text: orderLabel, color: '#ffffff', fontSize: '12px', fontWeight: '900' } : null)
      marker.setVisible(visibleIds.has(place.id))
      marker.setMap(map)
    })
  }, [filteredPlaces, focusPlace, mode, places, plannedPlaces, planOrderLabels, validPlanIds])

  useEffect(() => {
    if (!apiKey) return

    let cancelled = false
    ;(async () => {
      try {
        await loadGoogleMapsScript(apiKey)
        if (cancelled || !mapElRef.current) return
        mapRef.current = new google.maps.Map(mapElRef.current, {
          center: mapCenter,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          zoomControl: true,
        })
        mapRef.current.addListener('click', () => {
          setMobilePanelOpen(false)
        })
        mapRef.current.addListener('dragstart', () => {
          setMobilePanelOpen(false)
        })
        google.maps.event.addListenerOnce(mapRef.current, 'idle', fitMapToPlaces)
        setMapReady(true)
        setMapError(null)
      } catch {
        if (!cancelled) setMapError('無法載入 Google 地圖，請檢查 API Key 與權限。')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [apiKey, fitMapToPlaces, mapCenter])

  useEffect(() => {
    if (!mapReady) return
    syncMap()
  }, [mapReady, syncMap])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const resize = () => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      google.maps.event.trigger(map, 'resize')
    }
    const id = window.setTimeout(() => {
      resize()
      fitMapToPlaces()
    }, 120)
    window.addEventListener('resize', resize)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', resize)
    }
  }, [fitMapToPlaces, mapReady])

  const addPlace = (place: MapPlace) => {
    setPlanIds((ids) => {
      if (ids.includes(place.id)) return ids
      const nextIds = [...ids, place.id]
      trackPlannerEvent('add_place', {
        place_id: place.id,
        place_name: shortName(place.name),
        place_category: place.category,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, places),
      })
      return nextIds
    })
    setSelectedId(place.id)
    setMobilePanelOpen(true)
  }

  const removePlace = (placeId: string) => {
    setPlanIds((ids) => {
      const place = placeById.get(placeId)
      const nextIds = ids.filter((id) => id !== placeId)
      trackPlannerEvent('remove_place', {
        place_id: placeId,
        place_name: place ? shortName(place.name) : '',
        place_category: place?.category,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, places),
      })
      return nextIds
    })
    setSelectedId((id) => (id === placeId ? null : id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setPlanIds((items) => {
      const oldIndex = items.indexOf(String(active.id))
      const newIndex = items.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return items
      const nextIds = arrayMove(items, oldIndex, newIndex)
      const place = placeById.get(String(active.id))
      trackPlannerEvent('drag_sort', {
        place_id: String(active.id),
        place_name: place ? shortName(place.name) : '',
        place_category: place?.category,
        from_index: oldIndex + 1,
        to_index: newIndex + 1,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, places),
      })
      return nextIds
    })
  }

  const autoSortPlan = () => {
    if (plannedPlaces.length <= 1) return
    trackPlannerEvent('auto_sort_open', {
      plan_count: plannedPlaces.length,
    })
    setAutoSortConfirmOpen(true)
  }

  const confirmAutoSortPlan = () => {
    const sortedIds = sortPlacesByNearestNeighbor(plannedPlaces).map((place) => place.id)
    trackPlannerEvent('auto_sort', {
      plan_count: sortedIds.length,
      plan_code: encodeSharedPlan(sortedIds, places),
      first_place_id: sortedIds[0] ?? '',
    })
    setPlanIds(sortedIds)
    setMode('order')
    setMobilePanelOpen(true)
    setAutoSortConfirmOpen(false)
  }

  const buildShareUrl = useCallback(() => {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    if (validPlanIds.length > 0) {
      url.searchParams.set(SHARE_PARAM, encodeSharedPlan(validPlanIds, places))
    }
    return url
  }, [places, validPlanIds])

  const handleShare = useCallback(async () => {
    const url = buildShareUrl()
    const shareUrl = url.toString()
    const sharePath = `${url.pathname}${url.search}`
    trackPlannerEvent('share', {
      plan_count: validPlanIds.length,
      plan_code: encodeSharedPlan(validPlanIds, places),
      first_place_id: validPlanIds[0] ?? '',
      share_path: sharePath,
      share_has_plan: validPlanIds.length > 0,
    })

    if (config.saveReminderEnabled) {
      setSaveLinkCopied(false)
      setSaveSheetUrl(shareUrl)
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: config.shareTitle,
          text: config.shareText,
          url: shareUrl,
        })
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('已複製分享連結')
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }, [buildShareUrl, config.saveReminderEnabled, config.shareText, config.shareTitle, places, trackPlannerEvent, validPlanIds])

  const shareSavedLink = useCallback(async () => {
    if (!saveSheetUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.shareTitle,
          text: config.shareText,
          url: saveSheetUrl,
        })
        setSaveSheetUrl(null)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(saveSheetUrl)
      setSaveLinkCopied(true)
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }, [config.shareText, config.shareTitle, saveSheetUrl])

  const copySavedLink = useCallback(async () => {
    if (!saveSheetUrl) return
    try {
      await navigator.clipboard.writeText(saveSheetUrl)
      setSaveLinkCopied(true)
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }, [saveSheetUrl])

  const startMobilePanelDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      if (window.matchMedia('(min-width: 960px)').matches) return

      const target = e.target as HTMLElement
      if (target.closest('a') || target.closest('button') || target.closest(`.${styles.dragHandle}`)) return

      const panel = panelRef.current
      if (!panel) return

      const { collapsedPx, expandedPx } = getMobilePanelMetrics()
      const startHeightPx = Math.round(panel.getBoundingClientRect().height)
      panelDragSessionRef.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        startHeightPx,
        collapsedPx,
        expandedPx,
      }
      panelLiveHeightRef.current = startHeightPx
      setMobilePanelDragHeight(startHeightPx)

      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* noop */
      }
    },
    [getMobilePanelMetrics],
  )

  const moveMobilePanelDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = panelDragSessionRef.current
    if (!drag || e.pointerId !== drag.pointerId) return

    const delta = drag.startY - e.clientY
    const nextHeight = Math.round(drag.startHeightPx + delta)
    const clampedHeight = Math.min(drag.expandedPx, Math.max(drag.collapsedPx, nextHeight))
    panelLiveHeightRef.current = clampedHeight
    setMobilePanelDragHeight(clampedHeight)
    if (Math.abs(delta) > 6) setMobilePanelDragging(true)
  }, [])

  const endMobilePanelDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = panelDragSessionRef.current
    if (!drag || e.pointerId !== drag.pointerId) return

    panelDragSessionRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }

    const finalHeight = panelLiveHeightRef.current ?? drag.startHeightPx
    const moved = Math.abs(finalHeight - drag.startHeightPx) > 12
    panelLiveHeightRef.current = null
    setMobilePanelDragging(false)
    setMobilePanelDragHeight(null)

    if (moved) {
      panelClickSuppressUntilRef.current = Date.now() + 250
      setMobilePanelOpen(finalHeight >= (drag.collapsedPx + drag.expandedPx) / 2)
    }
  }, [])

  const handlePanelBodyTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!mobilePanelOpen || e.touches.length !== 1) return
    const target = e.target as HTMLElement
    if (target.closest(`.${styles.dragHandle}`)) {
      panelBodyTouchStartYRef.current = null
      panelBodyPullCanCollapseRef.current = false
      return
    }

    const scrollList = target.closest(`.${styles.addList}, .${styles.planList}`) as HTMLElement | null
    panelBodyTouchStartYRef.current = e.touches[0].clientY
    panelBodyPullCanCollapseRef.current = (scrollList?.scrollTop ?? 0) <= 0
  }, [mobilePanelOpen])

  const handlePanelBodyTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const startY = panelBodyTouchStartYRef.current
    if (!mobilePanelOpen || !panelBodyPullCanCollapseRef.current || startY == null || e.touches.length !== 1) return

    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 72) {
      e.preventDefault()
      panelBodyTouchStartYRef.current = null
      panelBodyPullCanCollapseRef.current = false
      setMobilePanelOpen(false)
    }
  }, [mobilePanelOpen])

  const handlePanelBodyTouchEnd = useCallback(() => {
    panelBodyTouchStartYRef.current = null
    panelBodyPullCanCollapseRef.current = false
  }, [])

  return (
    <>
      <CitySubpageHeader backHref={config.headerBackHref} eventPrefix={config.eventPrefix} />
      <main
        className={styles.plannerPage}
        style={
          mobilePageHeight
            ? ({ '--planner-mobile-height': `${mobilePageHeight}px` } as CSSProperties)
            : undefined
        }
      >
        <section className={styles.topBar} aria-label={config.topAriaLabel}>
          <div>
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.shareAction} type="button" onClick={handleShare}>
              {config.shareActionLabel}
            </button>
            <a className={styles.secondaryAction} href={config.headerBackHref}>
              {config.backLinkLabel}
            </a>
          </div>
        </section>

        <section className={styles.workspace} aria-label={config.workspaceAriaLabel}>
          <div className={styles.mapColumn}>
            <div className={styles.mapShell}>
              {mapError ? <div className={styles.mapFallback}>{mapError}</div> : <div ref={mapElRef} className={styles.mapCanvas} />}
            </div>
          </div>

          <aside
            ref={panelRef}
            className={`${styles.panel} ${mobilePanelOpen ? styles.panelOpen : styles.panelCollapsed} ${
              mobilePanelDragging ? styles.panelDragging : ''
            }`}
            aria-label={config.panelAriaLabel}
            style={
              mobilePanelDragHeight != null
                ? ({ height: mobilePanelDragHeight, maxHeight: mobilePanelDragHeight } as CSSProperties)
                : undefined
            }
            onClick={() => {
              if (Date.now() < panelClickSuppressUntilRef.current) return
              setMobilePanelOpen(true)
            }}
            onClickCapture={(e) => {
              if (Date.now() >= panelClickSuppressUntilRef.current) return
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div className={styles.panelChrome}>
              <div
                className={styles.panelDragZone}
                role="button"
                tabIndex={0}
                aria-expanded={mobilePanelOpen}
                aria-label={mobilePanelOpen ? '向下拖曳收合面板' : '向上拖曳展開面板'}
                onPointerDown={startMobilePanelDrag}
                onPointerMove={moveMobilePanelDrag}
                onPointerUp={endMobilePanelDrag}
                onPointerCancel={endMobilePanelDrag}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setMobilePanelOpen((open) => !open)
                  }
                }}
              />
              <span className={styles.panelHandleBar} aria-hidden />
            </div>
            <div className={styles.panelTabs} role="tablist" aria-label="景點操作">
              <button
                className={mode === 'add' ? styles.tabActive : styles.tab}
                type="button"
                onClick={() => {
                  setMode('add')
                  setMobilePanelOpen(true)
                }}
              >
                景點清單
              </button>
              <button
                className={mode === 'order' ? styles.tabActive : styles.tab}
                type="button"
                onClick={() => {
                  setMode('order')
                  setMobilePanelOpen(true)
                }}
              >
                我的順序 <span>{plannedPlaces.length}</span>
              </button>
            </div>

            {mode === 'add' ? (
              <div
                ref={panelBodyRef}
                className={styles.panelBody}
                onTouchStart={handlePanelBodyTouchStart}
                onTouchMove={handlePanelBodyTouchMove}
                onTouchEnd={handlePanelBodyTouchEnd}
                onTouchCancel={handlePanelBodyTouchEnd}
              >
                <div className={styles.filters}>
                  <div className={`${styles.filterTabs} tabs`} aria-label="分類篩選">
                    <button
                      type="button"
                      className={`tab ${plannerCategoriesAllOn(categoryOn, plannerCategoryItems) ? 'active' : ''}`}
                      onClick={() => {
                        setCategoryOn({ ...DEFAULT_CITY_MAP_CATEGORY_ON, hotel: false })
                        setSelectedId(null)
                      }}
                    >
                      全部
                    </button>
                    {plannerCategoryItems.map(({ key, label }) => (
                      <button
                        key={key}
                        className={`tab ${categoryOn[key] ? 'active' : ''}`}
                        type="button"
                        aria-pressed={categoryOn[key]}
                        data-area={key}
                        onClick={() => {
                          setCategoryOn((prev) =>
                            plannerCategoriesAllOn(prev, plannerCategoryItems)
                              ? cityMapSoloCategory(key)
                              : { ...prev, [key]: !prev[key] },
                          )
                          setSelectedId(null)
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {tierItems.length > 0 ? (
                    <div className={`${styles.filterTabs} tabs`} aria-label="官方區域篩選">
                      <button
                        type="button"
                        className={`tab ${tier === 'all' ? 'active' : ''}`}
                        data-area="official-all"
                        onClick={() => {
                          setTier('all')
                          setSelectedId(null)
                        }}
                      >
                        全部
                      </button>
                      {tierItems.map(({ key, label }) => (
                        <button
                          key={key}
                          className={`tab ${tier === key ? 'active' : ''}`}
                          type="button"
                          aria-pressed={tier === key}
                          data-area={`official-${key}`}
                          onClick={() => {
                            setTier((prev) => (prev === key ? 'all' : key))
                            setSelectedId(null)
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className={styles.addList} data-planner-scroll-list="true">
                  {filteredPlaces.map((place) => {
                    const added = plannedSet.has(place.id)
                    return (
                      <article
                        key={place.id}
                        ref={(el) => {
                          addCardRefs.current[place.id] = el
                        }}
                        className={`${styles.addCard} ${selectedId === place.id ? styles.addCardActive : ''}`}
                        onClick={(e) => {
                          const target = e.target as HTMLElement
                          if (target.closest('a') || target.closest('button')) return
                          focusPlace(place)
                        }}
                      >
                        <button className={styles.addCardMain} type="button" onClick={() => focusPlace(place)}>
                          <span className={styles.placeName}>{shortName(place.name)}</span>
                          <span className={styles.placeMeta}>{placeMeta(place, categoryLabels, tierLabels)}</span>
                          <span className={styles.placeDesc}>{place.description}</span>
                        </button>
                        <span className={styles.inlineMapLinks}>
                          <a href={googleMapsPinUrl(place)} target="_blank" rel="noopener noreferrer">
                            Google
                          </a>
                          {naverMapUrl(place) ? (
                            <a href={naverMapUrl(place)} target="_blank" rel="noopener noreferrer">
                              Naver
                            </a>
                          ) : null}
                        </span>
                        <button
                          className={added ? styles.addedButton : styles.addButton}
                          type="button"
                          onClick={() => {
                            addPlace(place)
                          }}
                        >
                          {added ? '已加入' : '加入'}
                        </button>
                      </article>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div
                ref={panelBodyRef}
                className={styles.panelBody}
                onTouchStart={handlePanelBodyTouchStart}
                onTouchMove={handlePanelBodyTouchMove}
                onTouchEnd={handlePanelBodyTouchEnd}
                onTouchCancel={handlePanelBodyTouchEnd}
              >
                {plannedPlaces.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>還沒有景點。</p>
                    <button type="button" onClick={() => setMode('add')}>
                      去加入景點
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.orderTools}>
                      <span>依地圖距離調整成較順路的順序</span>
                      <button type="button" onClick={autoSortPlan} disabled={plannedPlaces.length <= 1}>
                        自動排序
                      </button>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={validPlanIds} strategy={verticalListSortingStrategy}>
                        <div className={styles.planList} data-planner-scroll-list="true">
                          {plannedPlaces.map((place, index) => (
                            <SortablePlanItem
                              key={place.id}
                              place={place}
                              label={String(index + 1)}
                              selected={selectedId === place.id}
                              onFocus={() => focusPlace(place)}
                              onRemove={() => removePlace(place.id)}
                              cardRef={(el) => {
                                planCardRefs.current[place.id] = el
                              }}
                              categoryLabels={categoryLabels}
                              tierLabels={tierLabels}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </>
                )}
              </div>
            )}

            {selectedPlace ? (
              <div className={styles.selectedBar}>
                <span>{shortName(selectedPlace.name)}</span>
                <a href={googleMapsPinUrl(selectedPlace)} target="_blank" rel="noopener noreferrer">
                  開 Google Maps
                </a>
              </div>
            ) : null}
          </aside>
        </section>

        {autoSortConfirmOpen ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={() => setAutoSortConfirmOpen(false)}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auto-sort-confirm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="auto-sort-confirm-title">要重新自動排序嗎？</h2>
              <p>系統會依照目前加入的景點距離重新排列順序，原本手動排好的順序會被覆蓋。</p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmSecondary} onClick={() => setAutoSortConfirmOpen(false)}>
                  取消
                </button>
                <button type="button" className={styles.confirmPrimary} onClick={confirmAutoSortPlan}>
                  確認自動排序
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {saveSheetUrl ? (
          <div className={styles.saveBackdrop} role="presentation" onClick={() => setSaveSheetUrl(null)}>
            <section
              className={styles.saveSheet}
              role="dialog"
              aria-modal="true"
              aria-labelledby="save-plan-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.saveClose}
                aria-label="關閉"
                onClick={() => setSaveSheetUrl(null)}
              >
                ×
              </button>
              <h2 id="save-plan-title">保存這個排序</h2>
              <p>
                排序會暫存在目前瀏覽器；要跨手機/電腦使用，請把這條連結傳給自己保存。
              </p>
              {inAppBrowser ? (
                <p className={styles.saveHint}>
                  你現在在 {inAppBrowserName(inAppBrowser)} 內建瀏覽器，建議複製到 {preferredBrowserName()} 開啟，或傳到 LINE / 備忘錄保存。
                </p>
              ) : (
                <p className={styles.saveHint}>電腦排完也可以把連結傳到手機，出發時打開就能還原順序。</p>
              )}
              <div className={styles.saveUrl}>{saveSheetUrl}</div>
              <div className={styles.saveActions}>
                <button type="button" className={styles.confirmPrimary} onClick={shareSavedLink}>
                  分享連結
                </button>
                <button type="button" className={styles.confirmSecondary} onClick={copySavedLink}>
                  {saveLinkCopied ? '已複製' : '複製連結'}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </>
  )
}
