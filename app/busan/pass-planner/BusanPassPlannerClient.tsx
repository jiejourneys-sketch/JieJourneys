'use client'
/// <reference types="google.maps" />

import {
  Fragment,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
  type UIEvent as ReactUIEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  closestCenter,
  type CollisionDetection,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
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
  cityMapSoloCategory,
  type CityMapPlaceCategory,
} from '@/lib/cityMapPlaceCategory'
import { cityMapMarkerZIndex, selectedMarkerArrowIcon } from '@/lib/cityMapMarkers'
import { getGtag } from '@/lib/gtag'
import type { MapPlace } from '@/lib/mapPlace'
import styles from './passPlanner.module.css'

type PlannerMode = 'add' | 'order'
type TierFilter = NonNullable<MapPlace['officialPassTier']> | 'all'
type FocusSource = 'marker' | 'list'
type InAppBrowser = 'instagram' | 'line' | 'facebook' | null
type MobilePanelState = 'collapsed' | 'half' | 'full'
type PlannerItem = string
type PlannerFocusTarget =
  | { mode: 'add'; placeId: string }
  | { mode: 'order'; placeId: string; itemId: PlannerItem | null }
  | { mode: 'transport'; itemId: PlannerItem }
type TransportMode = 'walk' | 'subway' | 'bus' | 'train' | 'taxi' | 'car' | 'custom'
type TransportInfo = { id: string; mode: TransportMode; customLabel: string; duration: string; note: string; href: string }
type DayView = 'all' | number
type PdfDownloadStatus = 'idle' | 'loading' | 'rendering'
type CustomPlannerLink = { label: string; href: string }
type PlannerUserLink = CustomPlannerLink

const plannerCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args)
}

const mobileDragTargetIndex = (fromIndex: number, toIndex: number, deltaY: number) => {
  if (!isMobilePlannerViewport() || Math.abs(toIndex - fromIndex) <= 1) return toIndex
  const dragDirection = Math.sign(toIndex - fromIndex)
  const maxSteps = Math.max(1, Math.floor(Math.abs(deltaY) / 96))
  return fromIndex + dragDirection * Math.min(Math.abs(toIndex - fromIndex), maxSteps)
}

type CustomPlannerPlace = {
  id: string
  sourcePlaceId?: string
  name: string
  category?: CityMapPlaceCategory
  lat: number
  lng: number
  googleUrl?: string
  naverUrl?: string
  links?: CustomPlannerLink[]
}
type CustomPlaceDraft = {
  id: string | null
  name: string
  googleUrl: string
  naverUrl: string
  linkLabel: string
  linkUrl: string
  note: string
  category: CityMapPlaceCategory
  lat: number | null
  lng: number | null
  picking: boolean
  nameConfirmed: boolean
}

type Props = {
  places: MapPlace[]
  mapCenter: { lat: number; lng: number }
  config?: Partial<PlannerConfig>
}

export type PlannerConfig = {
  storageKey: string
  headerBackHref: string
  headerBackForceReload: boolean
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
  mapZoom: number
  categoryLabels: Partial<Record<CityMapPlaceCategory, string>>
  categoryItems: { key: CityMapPlaceCategory; label: string }[]
  customCategoryItems?: { key: CityMapPlaceCategory; label: string }[]
  matchPlaces?: MapPlace[]
  tierLabels: Partial<Record<NonNullable<MapPlace['officialPassTier']>, string>>
  tierItems: { key: Exclude<TierFilter, 'all'>; label: string }[]
  shareSearchParams?: Record<string, string>
  initialSearchParams?: Record<string, string>
  recentListKey?: string
  recentRegionKey?: string
  recentCountryName?: string
  recentSource?: 'map' | 'pass'
  plannerBookCityName?: string
}

const SCRIPT_ID = 'gmaps-js'
const SHARE_PARAM = 'plan'
const SHARE_ID_PARAM = 's'
const PLANNER_BOOK_PARAM = 'p'
const PLANNER_PREVIEW_PARAM = 'v'
const PUBLIC_SITE_ORIGIN = 'https://www.jiejourneys.com'
const PLANNER_BOOK_CACHE_TTL_MS = 10 * 60 * 1000
const RESOLVED_MAP_URL_CACHE_PREFIX = 'jiejourneys:planner:resolved-map-url:'
const DAY_ITEM_PREFIX = 'day:'
const VISIT_ITEM_PREFIX = 'visit:'
const CUSTOM_PLACE_PREFIX = 'custom:'
const TRANSPORT_ITEM_PREFIX = 'transport:'
const TRANSPORT_MODE_LABELS: Record<TransportMode, string> = {
  walk: '步行',
  subway: '地鐵',
  bus: '公車',
  train: '火車',
  taxi: '計程車',
  car: '開車',
  custom: '自訂',
}
const TRANSPORT_MODE_OPTIONS: { key: TransportMode; label: string }[] = [
  { key: 'walk', label: '步行' },
  { key: 'subway', label: '地鐵' },
  { key: 'bus', label: '公車' },
  { key: 'train', label: '火車' },
  { key: 'taxi', label: '計程車' },
  { key: 'car', label: '開車' },
  { key: 'custom', label: '自訂' },
]
const DAY_ROUTE_COLORS = ['#1f7a8c', '#f97316', '#7c3aed', '#16a34a', '#db2777', '#0f766e']

const emptyCustomPlaceDraft: CustomPlaceDraft = {
  id: null,
  name: '',
  googleUrl: '',
  naverUrl: '',
  linkLabel: '',
  linkUrl: '',
  note: '',
  category: 'spot',
  lat: null,
  lng: null,
  picking: false,
  nameConfirmed: false,
}

const defaultCategoryLabels: Partial<Record<CityMapPlaceCategory, string>> = {
  ticket: '票券',
  restaurant: '餐廳',
  shop: '商店',
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

const defaultCustomCategoryItems: { key: CityMapPlaceCategory; label: string }[] = [
  { key: 'spot', label: '景點' },
  { key: 'restaurant', label: '餐廳' },
  { key: 'shop', label: '商店' },
  { key: 'hotel', label: '住宿' },
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
  headerBackForceReload: false,
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
  mapZoom: 11,
  categoryLabels: defaultCategoryLabels,
  categoryItems: defaultCategoryItems,
  customCategoryItems: defaultCustomCategoryItems,
  matchPlaces: [],
  tierLabels: defaultTierLabels,
  tierItems: defaultTierItems,
}

function plannerCategoriesAllOn(
  c: Record<CityMapPlaceCategory, boolean>,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
) {
  return categoryItems.every(({ key }) => c[key])
}

function plannerCategoriesOn(categoryItems: { key: CityMapPlaceCategory; label: string }[]) {
  return categoryItems.reduce(
    (next, item) => ({ ...next, [item.key]: true }),
    {} as Record<CityMapPlaceCategory, boolean>,
  )
}

function plannerUsesSemanticCategories(categoryItems: { key: CityMapPlaceCategory; label: string }[]) {
  return categoryItems.some((item) => item.key === 'ticket' || item.key === 'restaurant' || item.key === 'shop')
}

function semanticPlannerCategory(
  category: CityMapPlaceCategory | undefined,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
): CityMapPlaceCategory {
  const safeCategory = category ?? 'spot'
  if (!plannerUsesSemanticCategories(categoryItems)) return safeCategory
  if (safeCategory === 'free') return 'spot'
  if (safeCategory === 'food') {
    return categoryItems.some((item) => item.key === 'restaurant') && !categoryItems.some((item) => item.key === 'shop')
      ? 'restaurant'
      : 'shop'
  }
  if (safeCategory === 'spot') return categoryItems.some((item) => item.key === 'ticket') ? 'ticket' : 'spot'
  return safeCategory
}

function plannerCategoryLabel(
  category: CityMapPlaceCategory,
  categoryLabels: Partial<Record<CityMapPlaceCategory, string>>,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
) {
  return categoryLabels[category] ?? categoryItems.find((item) => item.key === category)?.label ?? category
}

function plannerPlaceCategory(
  place: MapPlace,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
) {
  if (place.plannerCategory) return place.plannerCategory
  return semanticPlannerCategory(place.category, categoryItems)
}

function plannerMarkerColor(category: CityMapPlaceCategory) {
  if (category === 'ticket' || category === 'spot' || category === 'free') return '#2563eb'
  if (category === 'restaurant') return '#f97316'
  if (category === 'shop') return '#111827'
  if (category === 'food') return '#0f9d58'
  if (category === 'hotel') return '#8b5e34'
  return '#1f7a8c'
}

function plannerLegendColor(item: { key: CityMapPlaceCategory; label: string }) {
  if (item.label.includes('價格高')) return '#ff5252'
  if (item.label.includes('價格中')) return '#ffea00'
  if (item.label.includes('價格低')) return '#0f9d58'
  return plannerMarkerColor(item.key)
}

function plannerMarkerColorName(color: string, context = '') {
  if (context.includes('osaka')) {
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
        return '標記色'
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
    case '#8e24aa':
      return '紫色標記'
    case '#1e88e5':
      return '藍色標記'
    default:
      return '標記色'
  }
}

function plannerMarkerLegendOrder(category: CityMapPlaceCategory, color: string, usesSourceMarkerColor: boolean) {
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

function plannerMarkerLegendLabel(
  category: CityMapPlaceCategory,
  color: string,
  usesSourceMarkerColor: boolean,
  categoryLabels: Partial<Record<CityMapPlaceCategory, string>>,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
  context = '',
) {
  if (usesSourceMarkerColor) return plannerMarkerColorName(color, context)
  if (category === 'ticket' || category === 'spot' || category === 'free') return '票券/景點'
  return plannerCategoryLabel(category, categoryLabels, categoryItems)
}

function plannerPlaceColor(
  place: MapPlace,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
) {
  return place.markerColor ?? plannerMarkerColor(plannerPlaceCategory(place, categoryItems))
}

function plannerPinDataUrl(fillHex: string) {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <defs>
    <filter id="p" x="-45%" y="-35%" width="190%" height="170%">
      <feDropShadow dx="0" dy="1.3" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#p)">
    <path fill="${fillHex}" stroke="#ffffff" stroke-width="1.75" stroke-linejoin="round" d="M15 4.5c-4.1 0-7.4 3.3-7.4 7.4 0 5.6 7.4 14 7.4 14s7.4-8.4 7.4-14c0-4.1-3.3-7.4-7.4-7.4z"/>
    <circle cx="15" cy="10.8" r="2.45" fill="#ffffff"/>
  </g>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

function plannerHotelMarkerDataUrl() {
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 38 38">
  <path fill="#8b5e34" stroke="#ffffff" stroke-width="4" d="M5 17h28v18H5z"/>
  <path fill="#b7793f" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" d="M3 17L19 8l16 9"/>
  <rect x="14" y="24" width="10" height="11" rx="1.5" fill="#0f172a" stroke="#ffffff" stroke-width="1.5"/>
</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(raw.replace(/\s+/g, ' ').trim())}`
}

function plannerPlaceStyle(
  place: MapPlace,
  categoryItems: { key: CityMapPlaceCategory; label: string }[],
): CSSProperties {
  return { '--planner-category-color': plannerPlaceColor(place, categoryItems) } as CSSProperties
}

function printLinkHref(href: string) {
  try {
    const url = new URL(href, PUBLIC_SITE_ORIGIN)
    return url.toString()
  } catch {
    return href
  }
}

function printTravelTitle(title: string) {
  const base = title
    .replace(/^(?:tools)?planner[_-]*/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/Pass/gi, '')
    .replace(/周遊券/g, '')
    .replace(/景點/g, '')
    .replace(/地圖/g, '')
    .replace(/行程/g, '')
    .replace(/排序/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!base) return '旅遊行程'
  return base.endsWith('旅遊') ? base : `${base}旅遊`
}

function plannerMarkerIcon(
  place: MapPlace,
  maps: typeof google.maps,
  order: number | null,
  color: string,
  category: CityMapPlaceCategory,
): google.maps.Icon | google.maps.Symbol {
  if (order) {
    return {
      path: maps.SymbolPath.CIRCLE,
      scale: 13,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    }
  }
  if (category === 'hotel') {
    return {
      scaledSize: new maps.Size(34, 34),
      anchor: new maps.Point(17, 32),
      url: plannerHotelMarkerDataUrl(),
    }
  }
  return {
    scaledSize: new maps.Size(30, 30),
    anchor: new maps.Point(15, 27),
    url: plannerPinDataUrl(color),
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

function isCustomPlaceId(id: string) {
  return id.startsWith(CUSTOM_PLACE_PREFIX)
}

function cleanCustomPlaceCategory(value: unknown): CityMapPlaceCategory {
  if (
    value === 'ticket' ||
    value === 'spot' ||
    value === 'restaurant' ||
    value === 'shop' ||
    value === 'hotel' ||
    value === 'free' ||
    value === 'food'
  ) {
    return value
  }
  return 'spot'
}

function customPlaceToMapPlace(
  place: CustomPlannerPlace,
  sourcePlace?: MapPlace,
  customCategoryItems: { key: CityMapPlaceCategory; label: string }[] = defaultCustomCategoryItems,
): MapPlace {
  const category = cleanCustomPlaceCategory(place.category)
  const customLabel = customCategoryItems.find((item) => item.key === category)?.label ?? '\u666f\u9ede'
  const actions = [
    ...(place.naverUrl
      ? [
          {
            label: 'Naver',
            href: place.naverUrl,
            platform: 'NaverMap',
            event: 'custom_place_naver',
            mapSection: 'planner_card',
          },
        ]
      : []),
    ...(place.links ?? []).map((link) => ({
      label: link.label,
      href: link.href,
      platform: link.label,
      event: 'custom_place_link',
      mapSection: 'planner_card',
    })),
  ]

  return {
    ...(sourcePlace ?? {}),
    id: place.id,
    category: cleanCustomPlaceCategory(place.category),
    name: place.name,
    description: `自訂${customLabel}`,
    lat: place.lat,
    lng: place.lng,
    markerColor: undefined,
    markerIconUrl: undefined,
    markerStyleId: undefined,
    officialPassTier: undefined,
    spotGoogleMapsUrl: place.googleUrl || sourcePlace?.spotGoogleMapsUrl,
    spotActions: [...(sourcePlace?.spotActions ?? []), ...actions],
  }
}

function cleanCustomPlaces(value: unknown): Record<string, CustomPlannerPlace> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const places: Record<string, CustomPlannerPlace> = {}
  Object.entries(value as Record<string, unknown>).forEach(([idKey, rawPlace]) => {
    if (!rawPlace || typeof rawPlace !== 'object' || Array.isArray(rawPlace)) return
    const source = rawPlace as Record<string, unknown>
    const id = idKey.trim()
    const name = typeof source.name === 'string' ? source.name.trim().slice(0, 80) : ''
    const sourcePlaceId = typeof source.sourcePlaceId === 'string' ? source.sourcePlaceId.trim().slice(0, 120) : ''
    const lat = typeof source.lat === 'number' ? source.lat : Number(source.lat)
    const lng = typeof source.lng === 'number' ? source.lng : Number(source.lng)
    if (!id || !isCustomPlaceId(id) || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) return
    const googleUrl = typeof source.googleUrl === 'string' ? source.googleUrl.trim() : ''
    const naverUrl = typeof source.naverUrl === 'string' ? source.naverUrl.trim() : ''
    const category = cleanCustomPlaceCategory(source.category)
    const links = Array.isArray(source.links)
      ? source.links
          .filter((link): link is Record<string, unknown> => Boolean(link) && typeof link === 'object' && !Array.isArray(link))
          .map((link) => ({
            label: typeof link.label === 'string' ? link.label.trim().slice(0, 40) : '',
            href: typeof link.href === 'string' ? link.href.trim() : '',
          }))
          .filter((link) => link.label && link.href)
      : []
    places[id] = {
      id,
      ...(sourcePlaceId ? { sourcePlaceId } : {}),
      name,
      category,
      lat,
      lng,
      ...(googleUrl ? { googleUrl } : {}),
      ...(naverUrl ? { naverUrl } : {}),
      ...(links.length > 0 ? { links } : {}),
    }
  })
  return places
}

function cleanUserLinks(value: unknown): Record<string, PlannerUserLink[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const linksByPlace: Record<string, PlannerUserLink[]> = {}
  Object.entries(value as Record<string, unknown>).forEach(([placeId, rawLinks]) => {
    if (!placeId || !Array.isArray(rawLinks)) return
    const links = rawLinks
      .filter((link): link is Record<string, unknown> => Boolean(link) && typeof link === 'object' && !Array.isArray(link))
      .map((link) => ({
        label: typeof link.label === 'string' ? link.label.trim().slice(0, 40) : '',
        href: typeof link.href === 'string' ? link.href.trim().slice(0, 500) : '',
      }))
      .filter((link) => link.label && link.href)
      .slice(0, 8)
    if (links.length > 0) linksByPlace[placeId] = links
  })
  return linksByPlace
}

function parseGoogleMapsUrl(value: string) {
  const url = value.trim()
  if (!url) return null
  const coordinatePatterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]destination=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  ]
  for (const pattern of coordinatePatterns) {
    const match = url.match(pattern)
    if (!match) continue
    const isLngLatPattern = pattern.source.startsWith('!2d')
    const lat = Number(match[isLngLatPattern ? 2 : 1])
    const lng = Number(match[isLngLatPattern ? 1 : 2])
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
  }
  return null
}

function extractGoogleMapsUrlFromText(value: string) {
  const trimmed = value.trim()
  const match = trimmed.match(/https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl|maps\.google\.[^\s/]+|(?:www\.)?google\.[^\s/]+\/maps)[^\s<>"']*/i)
  return (match?.[0] ?? trimmed).replace(/[)\].,，。]+$/g, '')
}

function cleanGoogleMapsPlaceName(name: string) {
  const normalized = name
    .trim()
    .replace(/\s*[-|]\s*(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe))\s*$/i, '')
    .replace(/^(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe))\s*$/i, '')
    .replace(/\s+/g, ' ')
  if (!normalized) return ''
  if (/^\d{3,6}\s*/.test(normalized)) return ''
  if (/\d+.*(路|街|巷|弄|號|段|Road|Rd\.?|Street|St\.?|Avenue|Ave\.?)/i.test(normalized)) return ''
  return normalized.slice(0, 80)
}

function cleanGoogleMapsQueryPlaceName(name: string) {
  const normalized = stripGoogleMapsPlusCode(name)
    .trim()
    .replace(/\s+/g, ' ')
  const locationTailStripped = stripGoogleMapsLocationTail(normalized)
  if (locationTailStripped !== normalized) return cleanGoogleMapsPlaceName(locationTailStripped)
  const embeddedPlaceName = extractEmbeddedNonLatinPlaceName(normalized)
  if (embeddedPlaceName && isLikelyGoogleMapsAddress(normalized)) return cleanGoogleMapsPlaceName(embeddedPlaceName)
  if (isLikelyGoogleMapsAddress(normalized)) return ''
  const addressStart = normalized.search(
    /\d{1,6}\s*(?:[A-Za-z]|$)|\s(?:[A-Za-z0-9.-]+\s+)?(?:ro|gil|gu|dong|myeon|eup|si),|\s(?:[A-Za-z0-9.-]+-)?\d{1,5},/i,
  )
  if (addressStart > 1) return cleanGoogleMapsPlaceName(normalized.slice(0, addressStart).trim())
  const stripped = normalized
    .replace(/^(.{2,70}?)(?=\d{1,6}\s*[A-Za-z])/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+\d{1,6}\s)/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:[A-Za-z0-9.-]+\s+)?(?:ro|gil|gu|dong|myeon|eup|si),)/iu, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:[A-Za-z0-9.-]+-)?\d{1,5},)/u, '$1')
    .replace(/^(.{2,70}?)(?=\s+(?:韓國|南韓|日本|台灣|臺灣|越南|Korea|Japan|Taiwan|Vietnam)\b)/iu, '$1')
    .trim()
  const candidate = stripped || normalized
  return isLikelyGoogleMapsAddress(candidate) ? '' : cleanGoogleMapsPlaceName(candidate)
}

function stripGoogleMapsLocationTail(value: string) {
  const commaIndex = value.lastIndexOf(',')
  if (commaIndex <= 0) return value

  const beforeCountry = value.slice(0, commaIndex).trim()
  const country = value.slice(commaIndex + 1).trim()
  const countryLooksLikeCountry =
    /[^\x00-\x7F]/.test(country) ||
    /^(?:South Korea|Korea|Japan|Taiwan|Vietnam|China|Thailand)$/i.test(country)
  if (!countryLooksLikeCountry || country.length > 40) return value

  const beforeCountryWithoutPlusCode = stripGoogleMapsPlusCode(beforeCountry)
  const roadStart = beforeCountryWithoutPlusCode.search(
    /\s+(?:(?:[A-Za-z0-9()'.-]+)\s+){0,4}(?:Road|Rd\.?|Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?)\b|\s+(?:Thanon|Soi)\s+[A-Za-z]/i,
  )
  if (roadStart > 1) return beforeCountryWithoutPlusCode.slice(0, roadStart).trim()

  const adminStart = beforeCountryWithoutPlusCode.search(
    /\s+(?:[A-Za-z0-9()'.-]+-)?(?:dong|gu|si|ga|ro|gil|daero|myeon|eup)\b/i,
  )
  if (adminStart > 1) return beforeCountryWithoutPlusCode.slice(0, adminStart).trim()

  const asciiTailMatch = beforeCountryWithoutPlusCode.match(/^(.+?)\s+[A-Za-z][A-Za-z .'-]{1,40}$/u)
  if (asciiTailMatch?.[1] && /[^\x00-\x7F]/.test(asciiTailMatch[1])) return asciiTailMatch[1].trim()

  const stripped = beforeCountryWithoutPlusCode
    .replace(
      /\s+(?:Busan|Seoul|Tokyo|Osaka|Kyoto|Kobe|Nara|Fukuoka|Kawaguchiko|Fujikawaguchiko|Kinmen|Taipei|Hanoi|Ho Chi Minh City|Da Nang)$/iu,
      '',
    )
    .trim()
  return stripped.length >= 2 && stripped !== beforeCountry ? stripped : value
}

function stripGoogleMapsPlusCode(value: string) {
  return value.replace(/^[23456789CFGHJMPQRVWX]{4,8}(?:\+|\s+)[23456789CFGHJMPQRVWX]{2,3}\s+/i, '').trim()
}

function extractEmbeddedNonLatinPlaceName(value: string) {
  const normalized = stripGoogleMapsPlusCode(value).replace(/\s+/g, ' ').trim()
  const matches = Array.from(
    normalized.matchAll(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}]{2,}/gu),
  )
    .map((match) =>
      match[0]
        .replace(/(?:新加坡|泰國|泰国|南韓|韓國|韩国|日本|台灣|臺灣|台湾|越南|中國|中国)$/u, '')
        .trim(),
    )
    .filter((text) => text.length >= 2 && !isLikelyGoogleMapsAddress(text))

  return matches.sort((a, b) => b.length - a.length)[0] ?? ''
}

function isLikelyGoogleMapsAddress(value: string) {
  const normalized = value.trim()
  return (
    /^\d{1,6}\b/.test(normalized) ||
    /\d+.*(?:\u8def|\u8857|\u5df7|\u5f04|\u865f|\u53f7|\u6bb5|Road|Rd\.?|Street|St\.?|Avenue|Ave\.?)/i.test(normalized) ||
    /\b(?:Thanon|Soi)\s+[A-Za-z]/i.test(normalized) ||
    /\b(?:[A-Za-z0-9()'.-]+-)?(?:dong|gu|si|ga|ro|gil|daero|myeon|eup)\b.*,/i.test(normalized)
  )
}

function parseGoogleMapsSharedTextName(value: string, extractedUrl: string) {
  if (!extractedUrl || value.trim() === extractedUrl) return ''
  const beforeUrl = value.split(extractedUrl)[0] ?? ''
  const candidate = beforeUrl
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop()
  return candidate ? cleanGoogleMapsPlaceName(candidate) : ''
}

function isGenericGoogleMapsPlaceName(name: string) {
  return /^(?:Google Maps|Google\s*(?:\u5730\u5716|\u5730\u56fe)|Google Maps \S+)$/.test(name.trim())
}

function parseGoogleMapsPlaceName(value: string) {
  const match = value.match(/\/place\/([^/?@]+)/)
  if (match) {
    try {
      return cleanGoogleMapsPlaceName(decodeURIComponent(match[1].replace(/\+/g, ' ')))
    } catch {
      return cleanGoogleMapsPlaceName(match[1].replace(/\+/g, ' '))
    }
  }

  const searchMatch = value.match(/\/search\/([^/?@]+)/)
  if (searchMatch) {
    try {
      return cleanGoogleMapsPlaceName(decodeURIComponent(searchMatch[1].replace(/\+/g, ' ')))
    } catch {
      return cleanGoogleMapsPlaceName(searchMatch[1].replace(/\+/g, ' '))
    }
  }

  try {
    const url = new URL(value)
    const query = url.searchParams.get('q') || url.searchParams.get('query')
    if (!query || /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(query.trim())) return ''
    return cleanGoogleMapsQueryPlaceName(query)
  } catch {
    return ''
  }
}

function parseGoogleMapsQuery(value: string) {
  try {
    const url = new URL(value)
    const query = url.searchParams.get('q') || url.searchParams.get('query')
    if (!query || /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(query.trim())) return ''
    return query.replace(/\s+/g, ' ').trim()
  } catch {
    return ''
  }
}

function shouldResolveGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return (
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl' ||
      url.hostname.startsWith('maps.google.') ||
      ((url.hostname === 'google.com' || url.hostname.startsWith('google.') || url.hostname.startsWith('www.google.')) &&
        url.pathname.startsWith('/maps'))
    )
  } catch {
    return false
  }
}

function isShortGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.hostname === 'maps.app.goo.gl' || url.hostname === 'goo.gl'
  } catch {
    return false
  }
}

function isPlannerMapAction(action: { label: string; href: string; platform?: string }) {
  const label = action.label.toLowerCase()
  const platform = action.platform?.toLowerCase() ?? ''
  return (
    label === 'google' ||
    label === 'google maps' ||
    label === 'navermap' ||
    label === 'naver' ||
    label === '地圖' ||
    platform.includes('map') ||
    action.href.includes('google.com/maps') ||
    action.href.includes('maps.app.goo.gl') ||
    action.href.includes('naver.me')
  )
}

function isPlannerRouteAction(action: { label: string; platform?: string }) {
  const label = action.label.trim().toLowerCase()
  const platform = action.platform?.trim().toLowerCase() ?? ''
  return label === '路線' || label === 'route' || platform === 'route'
}

function plannerActionLinks(place: MapPlace) {
  const links = [
    ...(place.spotActionRows?.flat() ?? []),
    ...(place.spotActions ?? []),
    ...(place.hotelActions ?? []),
    ...(place.relatedTicketHref
      ? [
          {
            label: place.relatedTicketLabel?.trim() || '一日遊',
            href: place.relatedTicketHref,
            event: place.relatedTicketEvent,
            platform: 'ticket',
            mapSection: 'planner_card',
          },
        ]
      : []),
  ].filter((action) => action.href && !isPlannerMapAction(action))

  const seen = new Set<string>()
  return links.filter((action) => {
    const key = `${action.label}::${action.href}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function shortName(name: string) {
  return name.replace(/\s*\d+\s*元$/, '').trim()
}

function normalizePlaceMatchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[（(].*?[）)]/g, '')
    .replace(/\d+\s*元/g, '')
    .replace(/\s+/g, '')
    .replace(/[·・|｜\-–—_/\\.,，。:：'"]/g, '')
    .trim()
}

function longestCommonSubstringLength(a: string, b: string) {
  if (!a || !b) return 0
  const previous = new Array(b.length + 1).fill(0)
  let best = 0
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = 0
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j]
      previous[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : 0
      if (previous[j] > best) best = previous[j]
      diagonal = above
    }
  }
  return best
}

function isLikelySamePlaceName(draftName: string, placeName: string) {
  if (draftName.length < 2 || placeName.length < 2) return false
  if (placeName.includes(draftName) || draftName.includes(placeName)) return true
  const commonLength = longestCommonSubstringLength(draftName, placeName)
  return commonLength >= 4 || commonLength >= Math.min(draftName.length, placeName.length, 6)
}

function normalizePlaceMatchUrl(value: string | undefined) {
  if (!value) return ''
  try {
    const url = new URL(value)
    url.hash = ''
    url.searchParams.sort()
    return url.toString().replace(/\/$/, '')
  } catch {
    return value.trim().replace(/\/$/, '')
  }
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

function publicCurrentPlannerUrl() {
  if (typeof window === 'undefined') return PUBLIC_SITE_ORIGIN
  const url = new URL(window.location.pathname, PUBLIC_SITE_ORIGIN)
  url.search = window.location.search
  url.hash = window.location.hash
  return url.toString()
}

function getJsonCache<T>(key: string, ttlMs: number): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts?: unknown; value?: unknown }
    if (typeof parsed.ts !== 'number' || Date.now() - parsed.ts > ttlMs) {
      window.sessionStorage.removeItem(key)
      return null
    }
    return parsed.value as T
  } catch {
    return null
  }
}

function setJsonCache(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }))
  } catch {
    // Ignore storage limits or private-browser restrictions.
  }
}

function removeJsonCache(key: string) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    // Ignore private-browser restrictions.
  }
}

type ResolvedMapUrlData = {
  url: string
  name?: string
  query?: string
  lat?: number
  lng?: number
}

function getResolvedMapUrlCache(url: string): ResolvedMapUrlData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(`${RESOLVED_MAP_URL_CACHE_PREFIX}${url}`)?.trim()
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const data = parsed as Record<string, unknown>
        return typeof data.url === 'string'
          ? {
              url: data.url,
              ...(typeof data.name === 'string' && data.name.trim() ? { name: data.name.trim() } : {}),
              ...(typeof data.query === 'string' && data.query.trim() ? { query: data.query.trim() } : {}),
              ...(typeof data.lat === 'number' && Number.isFinite(data.lat) ? { lat: data.lat } : {}),
              ...(typeof data.lng === 'number' && Number.isFinite(data.lng) ? { lng: data.lng } : {}),
            }
          : null
      }
    } catch {
      return { url: raw }
    }
    return null
  } catch {
    return null
  }
}

function setResolvedMapUrlCache(url: string, data: ResolvedMapUrlData) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`${RESOLVED_MAP_URL_CACHE_PREFIX}${url}`, JSON.stringify(data))
  } catch {
    // Ignore storage limits or private-browser restrictions.
  }
}

function focusMapOnPlace(map: google.maps.Map, place: MapPlace) {
  const center = { lat: place.lat, lng: place.lng }
  map.setCenter(center)
  map.setZoom(16)
  window.setTimeout(() => {
    map.setCenter(center)
    if (isMobilePlannerViewport()) map.panBy(0, Math.round(window.innerHeight * 0.2))
  }, 140)
}

function isDayItem(item: PlannerItem) {
  return item.startsWith(DAY_ITEM_PREFIX)
}

function dayItemTitle(item: PlannerItem | null | undefined) {
  if (!item || !isDayItem(item)) return ''
  const separatorIndex = item.indexOf('|')
  if (separatorIndex < 0) return ''
  return decodeTransportPart(item.slice(separatorIndex + 1)).slice(0, 40)
}

function dayTitle(dayNumber: number, item?: PlannerItem | null) {
  return dayItemTitle(item) || `第 ${dayNumber} 天`
}

function updateDayItemTitle(item: PlannerItem, title: string) {
  const rawId = item.slice(DAY_ITEM_PREFIX.length).split('|')[0] || Date.now().toString(36)
  const trimmedTitle = title.trim().slice(0, 40)
  return `${DAY_ITEM_PREFIX}${rawId}${trimmedTitle ? `|${encodeTransportPart(trimmedTitle)}` : ''}`
}

function createDayItem(title = '') {
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
  return updateDayItemTitle(`${DAY_ITEM_PREFIX}${token}`, title)
}

function isVisitItem(item: PlannerItem) {
  return item.startsWith(VISIT_ITEM_PREFIX)
}

function isTransportItem(item: PlannerItem) {
  return item.startsWith(TRANSPORT_ITEM_PREFIX)
}

function encodeTransportPart(value: string) {
  return encodeURIComponent(value.trim().slice(0, 500))
}

function decodeTransportPart(value: string | undefined) {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch {
    return ''
  }
}

function serializeTransportItem(info: TransportInfo) {
  return `${TRANSPORT_ITEM_PREFIX}${info.id}|${info.mode}|${encodeTransportPart(info.duration)}|${encodeTransportPart(info.note)}|${encodeTransportPart(info.href)}|${encodeTransportPart(info.customLabel)}`
}

function createTransportItem(info: Partial<Omit<TransportInfo, 'id'>> = {}) {
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return serializeTransportItem({
    id: token,
    mode: info.mode ?? 'walk',
    customLabel: info.customLabel ?? '',
    duration: info.duration ?? '',
    note: info.note ?? '',
    href: info.href ?? '',
  })
}

function parseTransportItem(item: PlannerItem): TransportInfo | null {
  if (!isTransportItem(item)) return null
  const [rawId = '', rawMode = '', rawDuration = '', rawNote = '', rawHref = '', rawCustomLabel = ''] = item.slice(TRANSPORT_ITEM_PREFIX.length).split('|')
  const mode = TRANSPORT_MODE_OPTIONS.some((option) => option.key === rawMode) ? (rawMode as TransportMode) : 'custom'
  return {
    id: rawId || 'transport',
    mode,
    customLabel: decodeTransportPart(rawCustomLabel).slice(0, 40),
    duration: decodeTransportPart(rawDuration).slice(0, 40),
    note: decodeTransportPart(rawNote).slice(0, 300),
    href: decodeTransportPart(rawHref).slice(0, 500),
  }
}

function transportLabel(info: TransportInfo) {
  if (info.mode !== 'custom') return TRANSPORT_MODE_LABELS[info.mode]
  return info.customLabel.trim() || TRANSPORT_MODE_LABELS.custom
}

function hasSavedTransportDetails(info: TransportInfo) {
  return Boolean(info.customLabel.trim() || info.duration.trim() || info.note.trim() || info.href.trim() || info.mode !== 'walk')
}

function planItemPlaceId(item: PlannerItem) {
  if (isDayItem(item) || isTransportItem(item)) return null
  if (!isVisitItem(item)) return item
  const separatorIndex = item.indexOf('|')
  return separatorIndex >= 0 ? item.slice(separatorIndex + 1) : null
}

function createVisitItem(placeId: string) {
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return `${VISIT_ITEM_PREFIX}${token}|${placeId}`
}

function canRepeatPlanPlace(_place: MapPlace) {
  return true
}

function planItemPlace(item: PlannerItem, placeById: Map<string, MapPlace>) {
  const placeId = planItemPlaceId(item)
  return placeId ? placeById.get(placeId) ?? null : null
}

function normalizePlanItems(items: PlannerItem[], placeById: Map<string, MapPlace>) {
  const seenPlaceIds = new Set<string>()
  const seenVisitItems = new Set<string>()

  return items.flatMap((item) => {
    if (isDayItem(item) || isTransportItem(item)) return [item]

    const placeId = planItemPlaceId(item)
    const place = placeId ? placeById.get(placeId) ?? null : null
    if (!place || !placeId) return []

    if (isVisitItem(item)) {
      if (seenVisitItems.has(item)) {
        const visitItem = createVisitItem(placeId)
        seenVisitItems.add(visitItem)
        seenPlaceIds.add(placeId)
        return [visitItem]
      }
      seenVisitItems.add(item)
      seenPlaceIds.add(placeId)
      return [item]
    }

    if (seenPlaceIds.has(placeId)) {
      const visitItem = createVisitItem(placeId)
      seenVisitItems.add(visitItem)
      return [visitItem]
    }

    seenPlaceIds.add(placeId)
    return [item]
  })
}

function encodeSharedPlan(items: PlannerItem[], places: MapPlace[]) {
  const indexById = new Map(places.map((place, index) => [place.id, index]))
  const days: string[][] = [[]]
  items.forEach((item) => {
    if (isDayItem(item)) {
      if (days[days.length - 1].length > 0) days.push([])
      return
    }
    if (isTransportItem(item)) return
    const placeId = planItemPlaceId(item)
    const index = placeId ? indexById.get(placeId) : undefined
    if (typeof index === 'number') days[days.length - 1].push(index.toString(36))
  })
  return days.map((day) => day.join('.')).filter(Boolean).join('|')
}

function parseSharedPlan(search: string, placeById: Map<string, MapPlace>, places: MapPlace[]) {
  const params = new URLSearchParams(search)
  const raw = params.get(SHARE_PARAM)
  if (!raw) return null

  if (raw.includes('|')) {
    const items: PlannerItem[] = []
    raw.split('|').forEach((day, dayIndex) => {
      if (dayIndex > 0 && items.length > 0) items.push(`${DAY_ITEM_PREFIX}${dayIndex + 1}`)
      day
        .split('.')
        .map((token) => places[Number.parseInt(token, 36)]?.id)
        .forEach((id) => {
          if (!id || !placeById.has(id)) return
          items.push(id)
        })
    })
    return items
  }

  if (!raw.includes(',')) {
    return raw
      .split('.')
      .map((token) => places[Number.parseInt(token, 36)]?.id)
      .filter((id): id is string => {
        if (!id || !placeById.has(id)) return false
        return true
      })
  }

  return raw
    .split(',')
    .map((id) => id.trim())
    .filter((id): id is string => {
      if (!id || !placeById.has(id)) return false
      return true
    })
}

async function fetchShortSharedPlan(search: string, placeById: Map<string, MapPlace>) {
  const params = new URLSearchParams(search)
  const id = params.get(SHARE_ID_PARAM)?.trim()
  if (!id) return null

  const cacheKey = `planner-share:${id}`
  const cachedData = getJsonCache<{ items?: unknown; notes?: unknown; custom_places?: unknown; user_links?: unknown }>(
    cacheKey,
    PLANNER_BOOK_CACHE_TTL_MS,
  )
  const data =
    cachedData ??
    ((await (async () => {
      const res = await fetch(`/api/pass-planner/share?id=${encodeURIComponent(id)}`, {
        cache: 'no-store',
      })
      if (!res.ok) return null
      const nextData = (await res.json()) as {
        items?: unknown
        notes?: unknown
        custom_places?: unknown
        user_links?: unknown
      }
      setJsonCache(cacheKey, nextData)
      return nextData
    })()) as { items?: unknown; notes?: unknown; custom_places?: unknown; user_links?: unknown } | null)
  if (!data) return null

  const customPlaces = cleanCustomPlaces(data.custom_places)
  const customPlaceById = new Map(Object.values(customPlaces).map((place) => [place.id, customPlaceToMapPlace(place)]))
  const items = Array.isArray(data.items)
    ? data.items
        .filter((item): item is string => typeof item === 'string')
        .filter((item) => {
          if (isDayItem(item) || isTransportItem(item)) return true
          const placeId = planItemPlaceId(item)
          if (!placeId || (!placeById.has(placeId) && !customPlaceById.has(placeId))) return false
          return true
        })
    : []

  const notes =
    data.notes && typeof data.notes === 'object' && !Array.isArray(data.notes)
      ? Object.fromEntries(
          Object.entries(data.notes as Record<string, unknown>).filter(
            (entry): entry is [string, string] =>
              typeof entry[1] === 'string',
          ),
        )
      : {}

  const userLinks = cleanUserLinks(data.user_links)

  return items.length > 0 ? { items, notes, customPlaces, userLinks } : null
}

async function fetchPlannerBook(search: string, placeById: Map<string, MapPlace>) {
  const params = new URLSearchParams(search)
  const id = params.get(PLANNER_BOOK_PARAM)?.trim()
  const viewToken = params.get(PLANNER_PREVIEW_PARAM)?.trim()
  if (!id && !viewToken) return null

  const query = viewToken
    ? `${PLANNER_PREVIEW_PARAM}=${encodeURIComponent(viewToken)}`
    : `id=${encodeURIComponent(id ?? '')}`
  const res = await fetch(`/api/pass-planner/book?${query}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = (await res.json()) as {
    id?: unknown
    read_token?: unknown
    readonly?: unknown
    updated_at?: unknown
    items?: unknown
    notes?: unknown
    custom_places?: unknown
    user_links?: unknown
  }
  if (!data) return null

  const customPlaces = cleanCustomPlaces(data.custom_places)
  const customPlaceById = new Map(Object.values(customPlaces).map((place) => [place.id, customPlaceToMapPlace(place)]))
  const items = Array.isArray(data.items)
    ? data.items
        .filter((item): item is string => typeof item === 'string')
        .filter((item) => {
          if (isDayItem(item) || isTransportItem(item)) return true
          const placeId = planItemPlaceId(item)
          if (!placeId || (!placeById.has(placeId) && !customPlaceById.has(placeId))) return false
          return true
        })
    : []

  const notes =
    data.notes && typeof data.notes === 'object' && !Array.isArray(data.notes)
      ? Object.fromEntries(
          Object.entries(data.notes as Record<string, unknown>).filter(
            (entry): entry is [string, string] =>
              typeof entry[1] === 'string',
          ),
        )
      : {}

  const bookId = typeof data.id === 'string' && data.id ? data.id : id
  const userLinks = cleanUserLinks(data.user_links)

  return items.length > 0 && bookId
    ? {
        id: bookId,
        readToken: typeof data.read_token === 'string' ? data.read_token : null,
        readonly: data.readonly === true || Boolean(viewToken),
        updatedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
        items,
        notes,
        customPlaces,
        userLinks,
      }
    : null
}

async function savePlannerBook(
  city: string,
  id: string | null,
  items: PlannerItem[],
  notes: Record<string, string>,
  customPlaces: Record<string, CustomPlannerPlace>,
  userLinks: Record<string, PlannerUserLink[]>,
) {
  const res = await fetch('/api/pass-planner/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, id, items, notes, custom_places: customPlaces, user_links: userLinks }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { id?: unknown; read_token?: unknown }
  return typeof data.id === 'string' && data.id
    ? {
        id: data.id,
        readToken: typeof data.read_token === 'string' ? data.read_token : null,
      }
    : null
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

function splitPlanItemsByDay(items: PlannerItem[], placeById: Map<string, MapPlace>) {
  const days: { divider: string | null; items: PlannerItem[]; places: MapPlace[]; title: string }[] = [
    { divider: null, items: [], places: [], title: dayTitle(1) },
  ]
  items.forEach((item) => {
    if (isDayItem(item)) {
      if (days.length === 1 && days[0].items.length === 0 && days[0].places.length === 0 && !days[0].divider) {
        days[0] = { divider: item, items: [], places: [], title: dayTitle(1, item) }
        return
      }
      days.push({ divider: item, items: [], places: [], title: dayTitle(days.length + 1, item) })
      return
    }
    if (isTransportItem(item)) {
      days[days.length - 1].items.push(item)
      return
    }
    const place = planItemPlace(item, placeById)
    if (place) {
      days[days.length - 1].items.push(item)
      days[days.length - 1].places.push(place)
    }
  })
  return days.filter((day) => day.places.length > 0)
}

function insertPlaceIntoDay(
  items: PlannerItem[],
  place: MapPlace,
  dayNumber: number | 'end',
  itemId: PlannerItem = canRepeatPlanPlace(place) ? createVisitItem(place.id) : place.id,
) {
  if (!canRepeatPlanPlace(place) && items.some((item) => planItemPlaceId(item) === place.id)) return items
  if (dayNumber === 'end') return [...items, itemId]
  const dividerIndexes = items
    .map((item, index) => (isDayItem(item) ? index : -1))
    .filter((index) => index >= 0)
  const firstItemIsDayDivider = dividerIndexes[0] === 0
  if (dayNumber <= 1) {
    const firstDividerIndex = firstItemIsDayDivider ? dividerIndexes[0] : -1
    const nextDividerIndex = firstItemIsDayDivider ? dividerIndexes[1] : dividerIndexes[0]
    const insertIndex = nextDividerIndex ?? items.length
    if (firstDividerIndex == null || firstDividerIndex < 0) return [...items.slice(0, insertIndex), itemId, ...items.slice(insertIndex)]
    return [...items.slice(0, insertIndex), itemId, ...items.slice(insertIndex)]
  }
  const startDividerIndex = dividerIndexes[firstItemIsDayDivider ? dayNumber - 1 : dayNumber - 2]
  if (startDividerIndex == null) return [...items, itemId]
  const nextDividerIndex = dividerIndexes[firstItemIsDayDivider ? dayNumber : dayNumber - 1]
  const insertIndex = nextDividerIndex ?? items.length
  return [...items.slice(0, insertIndex), itemId, ...items.slice(insertIndex)]
}

function placeMeta(
  place: MapPlace,
  categoryLabels: PlannerConfig['categoryLabels'],
  tierLabels: PlannerConfig['tierLabels'],
  categoryItems: PlannerConfig['categoryItems'],
  customCategoryItems?: PlannerConfig['customCategoryItems'],
) {
  const labelItems = isCustomPlaceId(place.id) && customCategoryItems?.length ? customCategoryItems : categoryItems
  const category = plannerPlaceCategory(place, labelItems)
  const categoryLabel =
    labelItems.find((item) => item.key === category)?.label ?? plannerCategoryLabel(category, categoryLabels, labelItems)
  return [categoryLabel, place.officialPassTier ? tierLabels[place.officialPassTier] : null]
    .filter(Boolean)
    .join('・')
}

function plannerPlaceName(place: MapPlace) {
  return shortName(place.name)
    .replace(
      /\s+(?:折?\d+\s*元(?:\s*\/\s*(?:\d+\s*)?元?)?(?:\([^)]*\))?|原\d+\s*元|打\d+折(?:\([^)]*\))?|送[^（(]*(?:[（(][^)）]*[)）])?|[（(]視情況打折[)）])$/u,
      '',
    )
    .trim()
}

function formatPlannerUpdatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
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

function scrollPlannerCardToFocusPosition(
  card: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
) {
  scrollCardToContainerCenter(card, behavior)
}

function cardIsNearlyOutsideScrollArea(card: HTMLElement, container: HTMLElement) {
  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const visibleTop = Math.max(eRect.top, cRect.top)
  const visibleBottom = Math.min(eRect.bottom, cRect.bottom)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  return visibleHeight <= 4
}

function findStableVisiblePlanCard(container: HTMLElement, excludingItem?: PlannerItem | null) {
  const cRect = container.getBoundingClientRect()
  const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-plan-item-id]'))
  return cards.find((card) => {
    if (excludingItem && card.dataset.planItemId === excludingItem) return false
    const rect = card.getBoundingClientRect()
    return rect.bottom > cRect.top + 8 && rect.top < cRect.bottom - 8
  }) ?? null
}

function PlannerMapLinksPanel({
  panelRef,
  place,
  userLinks = [],
  onClose,
}: {
  panelRef?: RefObject<HTMLDivElement | null>
  place: MapPlace
  userLinks?: PlannerUserLink[]
  onClose: () => void
}) {
  const links = plannerMapLinks(place, userLinks)

  return (
    <div className={styles.noteModalBackdrop} role="presentation" onClick={onClose}>
      <section
        ref={panelRef}
        className={`${styles.noteModal} ${styles.mapModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`map-modal-${place.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.noteModalHeader}>
          <div>
            <span className={styles.noteModalEyebrow}>地圖</span>
            <h2 id={`map-modal-${place.id}`}>{plannerPlaceName(place)}</h2>
          </div>
          <button className={styles.noteModalClose} type="button" onClick={onClose} aria-label="關閉地圖">
            ×
          </button>
        </div>
        <div className={styles.linksModalBody}>
          <div className={styles.plannerLinksGrid}>
            {links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                className={styles.plannerLinkChip}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function isPlannerUserMapLink(href: string) {
  const normalized = href.trim().toLowerCase()
  return normalized.includes('naver.me') || normalized.includes('map.naver.com')
}

function plannerMapLinks(place: MapPlace, userLinks: PlannerUserLink[] = []) {
  const naverUrl = naverMapUrl(place)
  const links = [
    { label: 'Google', href: googleMapsPinUrl(place) },
    ...(naverUrl ? [{ label: 'Naver', href: naverUrl }] : []),
    ...userLinks
      .filter((link) => isPlannerUserMapLink(link.href))
      .map((link) => ({
        label: link.label.trim() || 'Naver',
        href: link.href.trim(),
      })),
  ]
  const seen = new Set<string>()
  return links.filter((link) => {
    const key = link.href.trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function PlannerMapLinks({ place }: { place: MapPlace }) {
  const [mapOpen, setMapOpen] = useState(false)
  const mapBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapOpen) return
    const firstId = window.setTimeout(() => {
      if (mapBoxRef.current) scrollCardFullyIntoView(mapBoxRef.current, 'auto')
    }, 0)
    const secondId = window.setTimeout(() => {
      if (mapBoxRef.current) scrollCardFullyIntoView(mapBoxRef.current, 'smooth')
    }, 140)
    return () => {
      window.clearTimeout(firstId)
      window.clearTimeout(secondId)
    }
  }, [mapOpen])

  return (
    <>
      <button
        className={styles.iconLink}
        type="button"
        onClick={() => {
          const links = plannerMapLinks(place)
          if (links.length === 1) {
            window.open(links[0].href, '_blank', 'noopener,noreferrer')
            return
          }
          setMapOpen((open) => !open)
        }}
      >
        地圖
      </button>
      {mapOpen ? <PlannerMapLinksPanel panelRef={mapBoxRef} place={place} onClose={() => setMapOpen(false)} /> : null}
    </>
  )
}

function SortablePlanItem({
  itemId,
  place,
  label,
  note,
  expanded,
  selected,
  onFocus,
  onToggleExpanded,
  onRemove,
  onEditCustom,
  onNoteChange,
  userLinks,
  onAddUserLink,
  onRemoveUserLink,
  cardRef,
  categoryLabels,
  categoryItems,
  customCategoryItems,
  tierLabels,
  readOnly,
}: {
  itemId: PlannerItem
  place: MapPlace
  label: string
  note: string
  expanded: boolean
  selected: boolean
  onFocus: () => void
  onToggleExpanded: () => void
  onRemove: () => void
  onEditCustom?: () => void
  onNoteChange: (note: string) => void
  userLinks: PlannerUserLink[]
  onAddUserLink: (link: PlannerUserLink) => void
  onRemoveUserLink: (index: number) => void
  cardRef: (el: HTMLElement | null) => void
  categoryLabels: PlannerConfig['categoryLabels']
  categoryItems: PlannerConfig['categoryItems']
  customCategoryItems?: PlannerConfig['customCategoryItems']
  tierLabels: PlannerConfig['tierLabels']
  readOnly: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
    disabled: readOnly,
  })
  const [openPanel, setOpenPanel] = useState<'note' | 'links' | 'map' | null>(null)
  const [linkLabel, setLinkLabel] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const [draftNote, setDraftNote] = useState(note)
  const [noteDeleteConfirm, setNoteDeleteConfirm] = useState(false)
  const cardElementRef = useRef<HTMLElement | null>(null)
  const detailElementRef = useRef<HTMLDivElement | null>(null)
  const noteTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const displayName = plannerPlaceName(place)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const setRefs = (el: HTMLElement | null) => {
    cardElementRef.current = el
    setNodeRef(el)
    cardRef(el)
  }

  const noteDirty = draftNote !== note
  const actionLinks = plannerActionLinks(place)
  const actionLinkCount = actionLinks.length
  const customActionLinkCount = isCustomPlaceId(place.id)
    ? actionLinks.filter((link) => link.event === 'custom_place_link').length
    : 0
  const actionLinkKeys = new Set(actionLinks.map((link) => link.label.trim() + '::' + link.href.trim()))
  const generalUserLinks = userLinks.filter((link) => !isPlannerUserMapLink(link.href))
  const visibleUserLinkCount = generalUserLinks.filter((link) => !actionLinkKeys.has(link.label.trim() + '::' + link.href.trim())).length
  const userLinkCount = generalUserLinks.length
  const displayLinkCount = visibleUserLinkCount + customActionLinkCount
  const hasAnyLinks = actionLinkCount + userLinkCount > 0
  const canEditCustom = Boolean(onEditCustom && isCustomPlaceId(place.id) && !readOnly)
  const saveNote = () => {
    onNoteChange(draftNote)
    setNoteDeleteConfirm(false)
    setOpenPanel(null)
  }
  const cancelNote = () => {
    setDraftNote(note)
    setNoteDeleteConfirm(false)
    setOpenPanel(null)
  }
  const deleteNote = () => {
    setNoteDeleteConfirm(true)
  }
  const confirmDeleteNote = () => {
    onNoteChange('')
    setDraftNote('')
    setNoteDeleteConfirm(false)
    setOpenPanel(null)
  }

  const toggleCard = () => {
    onFocus()
    onToggleExpanded()
  }

  useEffect(() => {
    if (!openPanel) return

    const closePanel = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && cardElementRef.current?.contains(target)) return
      if (target && detailElementRef.current?.contains(target)) return
      setOpenPanel(null)
    }

    document.addEventListener('pointerdown', closePanel, true)

    const scrollIntoView = () => {
      const target = detailElementRef.current ?? cardElementRef.current
      if (!target) return
      scrollCardFullyIntoView(target, 'auto')
    }
    const firstId = window.setTimeout(() => {
      scrollIntoView()
    }, 0)
    const secondId = window.setTimeout(() => {
      if (openPanel === 'note') noteTextareaRef.current?.focus({ preventScroll: true })
      scrollIntoView()
    }, 160)
    const thirdId = window.setTimeout(scrollIntoView, 320)
    return () => {
      document.removeEventListener('pointerdown', closePanel, true)
      window.clearTimeout(firstId)
      window.clearTimeout(secondId)
      window.clearTimeout(thirdId)
    }
  }, [itemId, openPanel])

  useEffect(() => {
    if (expanded) return
    const id = window.setTimeout(() => setOpenPanel(null), 0)
    return () => window.clearTimeout(id)
  }, [expanded])

  return (
    <div
      ref={setRefs}
      style={style}
      className={`${styles.planItem} ${isDragging ? styles.planCardDragging : ''}`}
      data-plan-item-id={itemId}
    >
      <article
        className={`${styles.planCard} ${expanded ? styles.planCardExpanded : styles.planCardCollapsed} ${selected ? styles.planCardActive : ''}`}
        style={plannerPlaceStyle(place, categoryItems)}
        onClick={(event) => {
          const target = event.target as HTMLElement | null
          if (target?.closest('a, button, textarea, input, [data-no-card-focus="true"]')) return
          toggleCard()
        }}
      >
      <button className={styles.dragHandle} type="button" aria-label={`拖曳排序 ${displayName}`} disabled={readOnly} {...attributes} {...listeners}>
        <span aria-hidden>☰</span>
      </button>
      <button className={styles.planMain} type="button" onClick={toggleCard} aria-expanded={expanded}>
          <span className={styles.planNumber}>{label}</span>
        <span className={styles.planText}>
          <span className={styles.placeName}>{displayName}</span>
          {expanded ? (
            <span className={styles.placeMeta}>
              {placeMeta(place, categoryLabels, tierLabels, categoryItems, customCategoryItems)}
            </span>
          ) : null}
          {note ? (
            <span
              className={styles.notePreview}
              data-no-card-focus="true"
              onClick={(event) => {
                if (!expanded) return
                event.preventDefault()
                event.stopPropagation()
                setDraftNote(note)
                setNoteDeleteConfirm(false)
                setOpenPanel('note')
              }}
            >
              {note}
            </span>
          ) : null}
        </span>
      </button>
      {expanded ? <span className={styles.mapLinks}>
        <button
          className={styles.iconLink}
          type="button"
          disabled={readOnly && !note}
          onClick={() => {
            setDraftNote(note)
            setNoteDeleteConfirm(false)
            setOpenPanel((panel) => (panel === 'note' ? null : 'note'))
          }}
        >
          備註
        </button>
        <button
          className={`${styles.iconLink} ${hasAnyLinks ? styles.iconLinkActive : ''} ${userLinkCount > 0 ? styles.iconLinkPrimary : ''}`}
          type="button"
          onClick={() => setOpenPanel((panel) => (panel === 'links' ? null : 'links'))}
        >
          連結{displayLinkCount > 0 ? ` ${displayLinkCount}` : ''}
        </button>
        <button
          className={styles.iconLink}
          type="button"
          onClick={() => {
            const links = plannerMapLinks(place, userLinks)
            if (links.length === 1) {
              window.open(links[0].href, '_blank', 'noopener,noreferrer')
              return
            }
            setOpenPanel((panel) => (panel === 'map' ? null : 'map'))
          }}
        >
          地圖
        </button>
      </span> : null}
      {expanded && !readOnly ? (
        <span className={styles.planCardManage}>
          {canEditCustom ? (
            <button className={styles.cardEditButton} type="button" onClick={onEditCustom} aria-label={`編輯 ${displayName}`}>
              ✎
            </button>
          ) : null}
          <button className={styles.removeButton} type="button" onClick={onRemove} aria-label={`移除 ${displayName}`}>
            ×
          </button>
        </span>
      ) : null}
      </article>
      {openPanel === 'note' ? (
        <div className={styles.noteModalBackdrop} role="presentation" onClick={cancelNote}>
          <section
            ref={detailElementRef}
            className={styles.noteModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`note-modal-${itemId}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.noteModalHeader}>
              <div>
                <span className={styles.noteModalEyebrow}>備註</span>
                <h2 id={`note-modal-${itemId}`}>{displayName}</h2>
              </div>
              <button className={styles.noteModalClose} type="button" onClick={cancelNote} aria-label="關閉備註">
                ×
              </button>
            </div>
            {readOnly ? (
              <p className={styles.noteReadOnly}>{note || '沒有備註'}</p>
            ) : (
              <textarea
                ref={noteTextareaRef}
                className={styles.noteModalTextarea}
                aria-label={`${displayName} 備註`}
                value={draftNote}
                maxLength={500}
                onChange={(event) => setDraftNote(event.target.value)}
                placeholder="輸入這張卡片的備註"
              />
            )}
            <div className={styles.noteModalFooter}>
              {!readOnly ? <span>{draftNote.length}/500</span> : <span />}
              <div className={styles.noteModalActions}>
                {!readOnly ? (
                  <>
                    <button className={styles.notePrimaryAction} type="button" onClick={saveNote} disabled={!noteDirty}>
                      儲存
                    </button>
                    {note ? (
                      <button className={styles.noteDangerAction} type="button" onClick={deleteNote}>
                        刪除
                      </button>
                    ) : null}
                    <button className={styles.noteSecondaryAction} type="button" onClick={cancelNote}>
                      取消
                    </button>
                  </>
                ) : (
                  <button className={styles.notePrimaryAction} type="button" onClick={cancelNote}>
                    關閉
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
      {openPanel === 'links' ? (
        <PlannerActionPanel
          panelRef={detailElementRef}
          place={place}
          userLinks={userLinks}
          linkLabel={linkLabel}
          linkHref={linkHref}
          onLinkLabelChange={setLinkLabel}
          onLinkHrefChange={setLinkHref}
          onAddUserLink={() => {
            onAddUserLink({ label: linkLabel, href: linkHref })
            setLinkLabel('')
            setLinkHref('')
          }}
          onRemoveUserLink={onRemoveUserLink}
          onClose={() => setOpenPanel(null)}
          readOnly={readOnly}
        />
      ) : null}
      {openPanel === 'map' ? (
        <PlannerMapLinksPanel
          panelRef={detailElementRef}
          place={place}
          userLinks={userLinks}
          onClose={() => setOpenPanel(null)}
        />
      ) : null}
      {noteDeleteConfirm ? (
        <div className={styles.confirmBackdrop} role="presentation" onClick={() => setNoteDeleteConfirm(false)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-note-${itemId}`}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={`delete-note-${itemId}`}>刪除備註？</h2>
            <p>{displayName} 的備註會被刪除。</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmSecondary} onClick={() => setNoteDeleteConfirm(false)}>
                取消
              </button>
              <button type="button" className={styles.confirmDanger} onClick={confirmDeleteNote}>
                確認刪除
              </button>
            </div>
          </section>
        </div>
      ) : null}    </div>
  )
}

function PlannerActionPanel({
  panelRef,
  place,
  userLinks,
  linkLabel,
  linkHref,
  onLinkLabelChange,
  onLinkHrefChange,
  onAddUserLink,
  onRemoveUserLink,
  onClose,
  readOnly,
}: {
  panelRef: RefObject<HTMLDivElement | null>
  place: MapPlace
  userLinks: PlannerUserLink[]
  linkLabel: string
  linkHref: string
  onLinkLabelChange: (value: string) => void
  onLinkHrefChange: (value: string) => void
  onAddUserLink: () => void
  onRemoveUserLink: (index: number) => void
  onClose: () => void
  readOnly: boolean
}) {
  const actionLinks = plannerActionLinks(place)
  const actionLinkKeys = new Set(actionLinks.map((link) => link.label.trim() + '::' + link.href.trim()))
  const visibleUserLinks = userLinks
    .map((link, index) => ({ link, index }))
    .filter(({ link }) => !isPlannerUserMapLink(link.href) && !actionLinkKeys.has(link.label.trim() + '::' + link.href.trim()))

  return (
    <div className={styles.noteModalBackdrop} role="presentation" onClick={onClose}>
      <section
        ref={panelRef}
        className={`${styles.noteModal} ${styles.linksModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`links-modal-${place.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.noteModalHeader}>
          <div>
            <span className={styles.noteModalEyebrow}>連結</span>
            <h2 id={`links-modal-${place.id}`}>{plannerPlaceName(place)}</h2>
          </div>
          <button className={styles.noteModalClose} type="button" onClick={onClose} aria-label="關閉連結">
            ×
          </button>
        </div>
        <div className={styles.linksModalBody}>
      {actionLinks.length > 0 ? (
        <div className={styles.plannerLinksGrid}>
          {actionLinks.map((action) => (
            <a
              key={`${action.label}-${action.href}`}
              className={styles.plannerLinkChip}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              data-event={action.mapEvent ?? action.event}
              data-item={place.id}
              data-platform={action.platform}
              data-section={action.mapSection ?? 'planner_card'}
              onClick={onClose}
            >
              {action.label}
            </a>
          ))}
        </div>
      ) : null}
      {visibleUserLinks.length > 0 ? (
        <div className={styles.userLinksList}>
          {visibleUserLinks.map(({ link, index }) => (
            <span key={`${link.label}-${link.href}-${index}`} className={styles.userLinkRow}>
              <a className={styles.userLinkOpen} href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
                <span>{link.label}</span>
                <span>開啟</span>
              </a>
              {!readOnly ? (
                <button type="button" onClick={() => onRemoveUserLink(index)} aria-label={`刪除 ${link.label}`}>
                  ×
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
          {!readOnly ? (
            <div className={styles.userLinkForm}>
              <input value={linkLabel} onChange={(event) => onLinkLabelChange(event.target.value)} placeholder="名稱" />
              <input value={linkHref} onChange={(event) => onLinkHrefChange(event.target.value)} placeholder="連結" />
              <button type="button" onClick={onAddUserLink} disabled={!linkLabel.trim() || !linkHref.trim()}>
                新增
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function PlannerActionLinks({ place }: { place: MapPlace }) {
  const [linksOpen, setLinksOpen] = useState(false)
  const linksBoxRef = useRef<HTMLDivElement | null>(null)
  const actionLinks = plannerActionLinks(place)

  useEffect(() => {
    if (!linksOpen) return
    const firstId = window.setTimeout(() => {
      if (linksBoxRef.current) scrollCardFullyIntoView(linksBoxRef.current, 'auto')
    }, 0)
    const secondId = window.setTimeout(() => {
      if (linksBoxRef.current) scrollCardFullyIntoView(linksBoxRef.current, 'smooth')
    }, 140)
    return () => {
      window.clearTimeout(firstId)
      window.clearTimeout(secondId)
    }
  }, [linksOpen])

  if (actionLinks.length === 0) return null

  return (
    <>
      <button className={styles.iconLink} type="button" onClick={() => setLinksOpen((open) => !open)}>
        連結
      </button>
      {linksOpen ? (
        <div ref={linksBoxRef} className={styles.plannerLinksBox}>
          <span>連結</span>
          <div className={styles.plannerLinksGrid}>
            {actionLinks.map((action) => (
              <a
                key={`${action.label}-${action.href}`}
                className={styles.plannerLinkChip}
                href={action.href}
                target={action.href.startsWith('http') ? '_blank' : undefined}
                rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-event={action.mapEvent ?? action.event}
                data-item={place.id}
                data-platform={action.platform}
                data-section={action.mapSection ?? 'planner_card'}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

function PlannerInlineCardLinks({ place }: { place: MapPlace }) {
  const [openPanel, setOpenPanel] = useState<'links' | 'map' | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const actionLinks = plannerActionLinks(place)

  useEffect(() => {
    if (!openPanel) return
    const firstId = window.setTimeout(() => {
      if (panelRef.current) scrollCardFullyIntoView(panelRef.current, 'auto')
    }, 0)
    const secondId = window.setTimeout(() => {
      if (panelRef.current) scrollCardFullyIntoView(panelRef.current, 'smooth')
    }, 140)
    return () => {
      window.clearTimeout(firstId)
      window.clearTimeout(secondId)
    }
  }, [openPanel])

  return (
    <>
      {actionLinks.length > 0 ? (
        <button
          className={styles.iconLink}
          type="button"
          onClick={() => setOpenPanel((panel) => (panel === 'links' ? null : 'links'))}
        >
          連結
        </button>
      ) : null}
      <button
        className={styles.iconLink}
        type="button"
        onClick={() => {
          const links = plannerMapLinks(place)
          if (links.length === 1) {
            window.open(links[0].href, '_blank', 'noopener,noreferrer')
            return
          }
          setOpenPanel((panel) => (panel === 'map' ? null : 'map'))
        }}
      >
        地圖
      </button>
      {openPanel === 'links' ? (
        <div ref={panelRef} className={styles.plannerLinksBox}>
          <span>連結</span>
          <div className={styles.plannerLinksGrid}>
            {actionLinks.map((action) => (
              <a
                key={`${action.label}-${action.href}`}
                className={styles.plannerLinkChip}
                href={action.href}
                target={action.href.startsWith('http') ? '_blank' : undefined}
                rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-event={action.mapEvent ?? action.event}
                data-item={place.id}
                data-platform={action.platform}
                data-section={action.mapSection ?? 'planner_card'}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
      {openPanel === 'map' ? <PlannerMapLinksPanel panelRef={panelRef} place={place} onClose={() => setOpenPanel(null)} /> : null}
    </>
  )
}
function SortableTransportItem({
  itemId,
  info,
  expanded,
  onToggleExpanded,
  onChange,
  onRemove,
  cardRef,
  readOnly,
}: {
  itemId: PlannerItem
  info: TransportInfo
  expanded: boolean
  onToggleExpanded: () => void
  onChange: (info: TransportInfo) => void
  onRemove: () => void
  cardRef?: (el: HTMLElement | null) => void
  readOnly: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
    disabled: readOnly,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const saved = hasSavedTransportDetails(info)
  const [draft, setDraft] = useState(info)
  const editing = !saved || expanded
  const href = draft.href.trim()
  const savedHref = info.href.trim()
  const dirty =
    draft.mode !== info.mode ||
    draft.customLabel !== info.customLabel ||
    draft.duration !== info.duration ||
    draft.note !== info.note ||
    draft.href !== info.href
  const canSave = dirty && !readOnly
  const summaryParts = [transportLabel(info), info.duration.trim(), info.note.trim()].filter(Boolean)

  const commitDraft = () => {
    if (readOnly) return
    onChange({
      ...draft,
      customLabel: draft.customLabel.slice(0, 40),
      duration: draft.duration.slice(0, 40),
      note: draft.note.slice(0, 300),
      href: draft.href.slice(0, 500),
    })
    if (expanded) onToggleExpanded()
  }
  const updateDraft = (patch: Partial<TransportInfo>) => setDraft((current) => ({ ...current, ...patch }))
  const collapseEditor = () => {
    setDraft(info)
    if (expanded) onToggleExpanded()
  }

  const setCardRefs = (el: HTMLDivElement | null) => {
    setNodeRef(el)
    cardRef?.(el)
  }

  return (
    <div
      ref={setCardRefs}
      style={style}
      className={`${styles.transportItem} ${isDragging ? styles.planCardDragging : ''}`}
      data-plan-item-id={itemId}
    >
      <article
        className={`${styles.transportCard} ${!editing ? styles.transportCardCompact : ''}`}
        onClick={(event) => {
          const target = event.target as HTMLElement
          if (editing || target.closest('a, button, input, select, textarea')) return
          onToggleExpanded()
        }}
      >
        <button className={styles.transportDragHandle} type="button" aria-label="拖曳交通" disabled={readOnly} {...attributes} {...listeners}>
          <span aria-hidden>☰</span>
        </button>
        <div className={styles.transportMain}>
          {!editing ? (
            <div className={styles.transportSummary}>
              <span className={styles.transportSummaryText}>{summaryParts.length > 0 ? summaryParts.join(' · ') : '交通'}</span>
              <span className={styles.transportSummaryActions}>
                {savedHref ? (
                  <a href={savedHref} target="_blank" rel="noopener noreferrer">
                    導航
                  </a>
                ) : null}
              </span>
            </div>
          ) : (
            <>
              <div className={styles.transportHeader}>
                <span>{transportLabel(draft)}</span>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    導航
                  </a>
                ) : null}
              </div>
              <div className={styles.transportFields}>
                <label>
                  <span>方式</span>
                  <select value={draft.mode} onChange={(event) => updateDraft({ mode: event.target.value as TransportMode })} disabled={readOnly}>
                    {TRANSPORT_MODE_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>時間</span>
                  <input value={draft.duration} maxLength={40} placeholder="例如 25 分鐘" onChange={(event) => updateDraft({ duration: event.target.value })} readOnly={readOnly} />
                </label>
                {draft.mode === 'custom' ? (
                  <label className={styles.transportWideField}>
                    <span>交通名稱</span>
                    <input value={draft.customLabel} maxLength={40} placeholder="例如 Grab、渡輪、包車" onChange={(event) => updateDraft({ customLabel: event.target.value })} readOnly={readOnly} />
                  </label>
                ) : null}
                <label className={styles.transportWideField}>
                  <span>連結</span>
                  <input value={draft.href} maxLength={500} placeholder="Google Maps 導航連結" onChange={(event) => updateDraft({ href: event.target.value })} readOnly={readOnly} />
                </label>
                <label className={styles.transportWideField}>
                  <span>備註</span>
                  <textarea value={draft.note} maxLength={300} placeholder="例如 從 2 號出口走過去" onChange={(event) => updateDraft({ note: event.target.value })} readOnly={readOnly} />
                </label>
              </div>
              {!readOnly ? (
                <div className={styles.transportActions}>
                  <span>{dirty ? '尚未儲存' : saved ? '已儲存' : '填寫後請儲存'}</span>
                  <button type="button" onClick={commitDraft} disabled={!canSave}>
                    儲存交通
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
        {!readOnly && !editing ? (
          <button className={styles.transportRemoveButton} type="button" onClick={onRemove} aria-label="移除交通">
            ×
          </button>
        ) : null}
        {!readOnly && editing && saved ? (
          <button className={styles.transportRemoveButton} type="button" onClick={collapseEditor} aria-label="取消編輯交通">
            ×
          </button>
        ) : null}
      </article>
    </div>
  )
}

function SortableDayDivider({
  id,
  dayNumber,
  title,
  onTitleChange,
  onRemove,
  readOnly,
  dividerRef,
}: {
  id: string
  dayNumber: number
  title: string
  onTitleChange: (title: string) => void
  onRemove: () => void
  cardRef?: (el: HTMLElement | null) => void
  readOnly: boolean
  dividerRef?: (el: HTMLDivElement | null) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: readOnly })
  const [editingTitle, setEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const setRefs = (el: HTMLDivElement | null) => {
    setNodeRef(el)
    dividerRef?.(el)
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const fallbackTitle = dayTitle(dayNumber)
  const displayTitle = title.trim() || fallbackTitle
  const saveTitle = () => {
    onTitleChange(draftTitle.trim())
    setEditingTitle(false)
  }

  useEffect(() => {
    setDraftTitle(title)
  }, [title])

  return (
    <div
      ref={setRefs}
      style={style}
      className={`${styles.dayDivider} ${isDragging ? styles.dayDividerDragging : ''}`}
    >
      <button className={styles.dayDragHandle} type="button" aria-label={`拖曳第 ${dayNumber} 天`} disabled={readOnly} {...attributes} {...listeners}>
        <span aria-hidden>☰</span>
      </button>
      <span className={styles.dayDividerLine} aria-hidden />
      {editingTitle && !readOnly ? (
        <input
          className={styles.dayDividerInput}
          value={draftTitle}
          maxLength={40}
          aria-label={`編輯${fallbackTitle}標題`}
          placeholder={fallbackTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') saveTitle()
            if (event.key === 'Escape') {
              setDraftTitle(title)
              setEditingTitle(false)
            }
          }}
          autoFocus
        />
      ) : (
        <button
          className={styles.dayDividerLabel}
          type="button"
          onClick={() => {
            if (readOnly) return
            setDraftTitle(title)
            setEditingTitle(true)
          }}
          disabled={readOnly}
          title={readOnly ? undefined : '點擊編輯日期或天數名稱'}
        >
          {displayTitle}
        </button>
      )}
      <span className={styles.dayDividerLine} aria-hidden />
      {!readOnly ? (
        <button className={styles.dayRemoveButton} type="button" onClick={onRemove} aria-label={`移除第 ${dayNumber} 天分隔`}>
          ×
        </button>
      ) : null}
    </div>
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
  const customCategoryItems = useMemo(
    () => {
      if (config.customCategoryItems?.length) return config.customCategoryItems
      return defaultCustomCategoryItems
    },
    [config.customCategoryItems],
  )
  const tierLabels = config.tierLabels
  const tierItems = config.tierItems
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const initialMapFitDoneRef = useRef(false)
  const autoFittingMapRef = useRef(false)
  const userAdjustedMapRef = useRef(false)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const selectedMarkerArrowRef = useRef<google.maps.Marker | null>(null)
  const lineRefs = useRef<google.maps.Polyline[]>([])
  const customDraftMarkerRef = useRef<google.maps.Marker | null>(null)
  const customUrlResolveSeqRef = useRef(0)
  const addCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const planCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const dayDividerRefs = useRef<Record<string, HTMLElement | null>>({})
  const transportCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const pendingDayDividerScrollRef = useRef<string | null>(null)
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
    fullPx: number
  } | null>(null)
  const panelLiveHeightRef = useRef<number | null>(null)
  const panelClickSuppressUntilRef = useRef(0)
  const panelBodyTouchStartYRef = useRef<number | null>(null)
  const panelBodyPullCanCollapseRef = useRef(false)
  const panelControlTouchStartRef = useRef<{ x: number; y: number; collapsed: boolean } | null>(null)
  const customDraftRef = useRef<CustomPlaceDraft>(emptyCustomPlaceDraft)
  const mobilePanelStateRef = useRef<MobilePanelState>('collapsed')
  const pendingHalfPanelFocusRef = useRef<PlannerFocusTarget | null>(null)
  const focusScrollTimerRef = useRef<number | null>(null)
  const pendingHalfPanelFocusRetryRef = useRef(0)
  const initialPlannerLoadRef = useRef(false)
  const expandedPlanScrollCollapseTimerRef = useRef<number | null>(null)
  const expandedPlanScrollAnchorRef = useRef<{ element: HTMLElement; top: number; container: HTMLElement } | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(() =>
    apiKey ? null : '請在環境變數設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  )
  const [mode, setMode] = useState<PlannerMode>('add')
  const [categoryOn, setCategoryOn] = useState<Record<CityMapPlaceCategory, boolean>>(() =>
    plannerCategoriesOn(config.categoryItems),
  )
  const [customOnly, setCustomOnly] = useState(false)
  const [tier, setTier] = useState<TierFilter>('all')
  const [planItems, setPlanItems] = useState<PlannerItem[]>([])
  const [placeNotes, setPlaceNotes] = useState<Record<string, string>>({})
  const [placeUserLinks, setPlaceUserLinks] = useState<Record<string, PlannerUserLink[]>>({})
  const [customPlaces, setCustomPlaces] = useState<Record<string, CustomPlannerPlace>>({})
  const [customDraft, setCustomDraft] = useState<CustomPlaceDraft>(emptyCustomPlaceDraft)
  const [customDraftReturnMode, setCustomDraftReturnMode] = useState<'add' | 'order'>('add')
  const [customDraftReturnItem, setCustomDraftReturnItem] = useState<PlannerItem | null>(null)
  const [customPlaceSaveError, setCustomPlaceSaveError] = useState<'name' | 'location' | null>(null)
  const [customUrlResolving, setCustomUrlResolving] = useState(false)
  const [storageReady, setStorageReady] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedPlanItem, setSelectedPlanItem] = useState<PlannerItem | null>(null)
  const [mobilePageHeight, setMobilePageHeight] = useState<number | null>(null)
  const [mobilePanelState, setMobilePanelState] = useState<MobilePanelState>('collapsed')
  const [mobilePanelDragging, setMobilePanelDragging] = useState(false)
  const [mobilePanelDragHeight, setMobilePanelDragHeight] = useState<number | null>(null)
  const [updateShareConfirmOpen, setUpdateShareConfirmOpen] = useState(false)
  const [pendingAddPlace, setPendingAddPlace] = useState<MapPlace | null>(null)
  const [pendingAddPlaceNote, setPendingAddPlaceNote] = useState('')
  const [pendingDelete, setPendingDelete] = useState<
    { type: 'plan' | 'custom'; placeId: string } | { type: 'day' | 'transport'; itemId: string } | null
  >(null)
  const [recentlyAddedPlaceId, setRecentlyAddedPlaceId] = useState<string | null>(null)
  const [expandedPlanItem, setExpandedPlanItem] = useState<PlannerItem | null>(null)
  const [pdfDownloadStatus, setPdfDownloadStatus] = useState<PdfDownloadStatus>('idle')
  const [shareSaving, setShareSaving] = useState(false)
  const [plannerBookId, setPlannerBookId] = useState<string | null>(null)
  const [plannerBookReadToken, setPlannerBookReadToken] = useState<string | null>(null)
  const [plannerBookUpdatedAt, setPlannerBookUpdatedAt] = useState<string | null>(null)
  const [plannerLinkUnavailable, setPlannerLinkUnavailable] = useState(false)
  const [readOnlyPlan, setReadOnlyPlan] = useState(false)
  const [saveSheetUrl, setSaveSheetUrl] = useState<string | null>(null)
  const [saveSheetPreviewUrl, setSaveSheetPreviewUrl] = useState<string | null>(null)
  const [saveLinkCopied, setSaveLinkCopied] = useState(false)
  const [savePreviewCopied, setSavePreviewCopied] = useState(false)
  const [inAppBrowser, setInAppBrowser] = useState<InAppBrowser>(null)
  const [inAppPromptOpen, setInAppPromptOpen] = useState(false)
  const [inAppPromptCopied, setInAppPromptCopied] = useState(false)
  const [dayView, setDayView] = useState<DayView>('all')
  const [openPlannerMenu, setOpenPlannerMenu] = useState<null | 'day' | 'actions'>(null)
  const plannerPdfModuleRef = useRef<Promise<typeof import('./plannerPdf')> | null>(null)
  const pdfDownloading = pdfDownloadStatus !== 'idle'
  const mobilePanelOpen = mobilePanelState !== 'collapsed'
  const setMobilePanelOpen = useCallback((next: boolean | ((open: boolean) => boolean)) => {
    setMobilePanelState((state) => {
      const currentlyOpen = state !== 'collapsed'
      const resolved = typeof next === 'function' ? next(currentlyOpen) : next
      return resolved ? 'half' : 'collapsed'
    })
  }, [])

  const focusTargetCard = useCallback((target: PlannerFocusTarget) => {
    if (target.mode === 'add') return addCardRefs.current[target.placeId] ?? null
    if (target.mode === 'transport') return transportCardRefs.current[target.itemId] ?? null
    return (target.itemId ? planCardRefs.current[target.itemId] : null) ?? planCardRefs.current[target.placeId] ?? null
  }, [])

  const clearFocusScrollTimers = useCallback(() => {
    if (focusScrollTimerRef.current != null) {
      window.clearTimeout(focusScrollTimerRef.current)
      focusScrollTimerRef.current = null
    }
  }, [])

  const scrollFocusTargetToCenter = useCallback(
    (target: PlannerFocusTarget, behavior: ScrollBehavior = 'smooth') => {
      const card = focusTargetCard(target)
      if (!card) return false
      scrollPlannerCardToFocusPosition(card, behavior)
      return true
    },
    [focusTargetCard],
  )

  const scheduleFocusTargetCenter = useCallback(
    (target: PlannerFocusTarget, behavior: ScrollBehavior = 'smooth', delay = 0) => {
      clearFocusScrollTimers()
      const run = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollFocusTargetToCenter(target, behavior))
        })
      }
      if (delay > 0) {
        focusScrollTimerRef.current = window.setTimeout(() => {
          focusScrollTimerRef.current = null
          run()
        }, delay)
        return
      }
      run()
    },
    [clearFocusScrollTimers, scrollFocusTargetToCenter],
  )

  const flushPendingHalfPanelFocus = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const pendingFocus = pendingHalfPanelFocusRef.current
      if (!pendingFocus) return
      const didScroll = scrollFocusTargetToCenter(pendingFocus, behavior)
      if (didScroll) {
        pendingHalfPanelFocusRef.current = null
        pendingHalfPanelFocusRetryRef.current = 0
        return
      }
      if (pendingHalfPanelFocusRetryRef.current >= 4) {
        pendingHalfPanelFocusRef.current = null
        pendingHalfPanelFocusRetryRef.current = 0
        return
      }
      pendingHalfPanelFocusRetryRef.current += 1
      clearFocusScrollTimers()
      focusScrollTimerRef.current = window.setTimeout(() => {
        focusScrollTimerRef.current = null
        flushPendingHalfPanelFocus(behavior)
      }, 80)
    },
    [clearFocusScrollTimers, scrollFocusTargetToCenter],
  )

  useEffect(() => {
    mobilePanelStateRef.current = mobilePanelState
  }, [mobilePanelState])

  useEffect(() => {
    if (mobilePanelState !== 'half') return
    if (!pendingHalfPanelFocusRef.current) return
    const fallbackTimer = window.setTimeout(() => flushPendingHalfPanelFocus('auto'), 360)
    return () => window.clearTimeout(fallbackTimer)
  }, [flushPendingHalfPanelFocus, mobilePanelState])

  const sourcePlaceById = useMemo(() => {
    const seen = new Map<string, MapPlace>()
    ;[...places, ...(config.matchPlaces ?? [])].forEach((place) => {
      if (!seen.has(place.id)) seen.set(place.id, place)
    })
    return seen
  }, [config.matchPlaces, places])
  const customMapPlaces = useMemo(
    () =>
      Object.values(customPlaces).map((place) =>
        customPlaceToMapPlace(place, place.sourcePlaceId ? sourcePlaceById.get(place.sourcePlaceId) : undefined, customCategoryItems),
      ),
    [customCategoryItems, customPlaces, sourcePlaceById],
  )
  const allPlaces = useMemo(() => [...places, ...customMapPlaces], [customMapPlaces, places])
  const lookupPlaces = useMemo(() => {
    const seen = new Set<string>()
    return [...allPlaces, ...(config.matchPlaces ?? [])].filter((place) => {
      if (seen.has(place.id)) return false
      seen.add(place.id)
      return true
    })
  }, [allPlaces, config.matchPlaces])
  const placeById = useMemo(() => new Map(lookupPlaces.map((place) => [place.id, place])), [lookupPlaces])
  const allCategoryOn = useMemo(() => plannerCategoriesOn(plannerCategoryItems), [plannerCategoryItems])
  const validPlanItems = useMemo(
    () => {
      const normalizedItems = normalizePlanItems(planItems, placeById)
      if (normalizedItems.some(isDayItem) && !isDayItem(normalizedItems[0] ?? '')) {
        return [createDayItem(), ...normalizedItems]
      }
      return normalizedItems
    },
    [placeById, planItems],
  )
  const validPlanIds = useMemo(
    () => validPlanItems.filter((item) => Boolean(planItemPlace(item, placeById))),
    [placeById, validPlanItems],
  )
  const validPlanPlaceIds = useMemo(
    () => validPlanIds.map((item) => planItemPlaceId(item)).filter(Boolean) as string[],
    [validPlanIds],
  )
  const plannedPlaces = useMemo(
    () => validPlanIds.map((item) => planItemPlace(item, placeById)).filter(Boolean) as MapPlace[],
    [placeById, validPlanIds],
  )
  const plannedDays = useMemo(
    () => splitPlanItemsByDay(validPlanItems, placeById),
    [placeById, validPlanItems],
  )
  const planDayCount = useMemo(
    () => validPlanItems.filter(isDayItem).length + (isDayItem(validPlanItems[0] ?? '') ? 0 : 1),
    [validPlanItems],
  )
  const hasDayDividers = useMemo(() => validPlanItems.some(isDayItem), [validPlanItems])
  const findPlanItemDayView = useCallback((targetItem: PlannerItem | null | undefined): DayView => {
    if (!targetItem) return 'all'
    const dayIndex = plannedDays.findIndex((day) => day.items.includes(targetItem))
    return dayIndex >= 0 ? dayIndex + 1 : 'all'
  }, [plannedDays])
  const visiblePlanItems = useMemo(() => {
    if (dayView === 'all') return validPlanItems
    const day = plannedDays[dayView - 1]
    if (!day) return validPlanItems
    return day.divider ? [day.divider, ...day.items] : day.items
  }, [dayView, plannedDays, validPlanItems])
  const visiblePlannedPlaces = useMemo(() => {
    if (dayView === 'all') return plannedPlaces
    return plannedDays[dayView - 1]?.places ?? plannedPlaces
  }, [dayView, plannedDays, plannedPlaces])
  const mapLegendItems = useMemo(() => {
    const items: { key: string; categoryKey: CityMapPlaceCategory; label: string; color: string; group: 'value' | 'category' }[] = []
    const shownCategories = new Set<CityMapPlaceCategory>()


    config.categoryItems.forEach((item) => {
      if (shownCategories.has(item.key)) return
      const isValueItem = item.label.includes('價格')
      items.push({
        key: item.key,
        categoryKey: item.key,
        label: item.label,
        color: plannerLegendColor(item),
        group: isValueItem ? 'value' : 'category',
      })
      shownCategories.add(item.key)
    })

    customCategoryItems.forEach((item) => {
      const existingSpotLabel = config.categoryItems.find((option) => option.key === 'spot')?.label ?? ''
      const isValueSpot = item.key === 'spot' && existingSpotLabel.includes('價格')
      if (item.key === 'spot' && shownCategories.has('spot') && !isValueSpot) return
      if (!isValueSpot && shownCategories.has(item.key)) return
      const label = isValueSpot ? '自定票券/景點' : item.label
      items.push({
        key: `custom-${item.key}`,
        categoryKey: item.key,
        label,
        color: plannerMarkerColor(item.key),
        group: 'category',
      })
      if (!isValueSpot) shownCategories.add(item.key)
    })

    visiblePlannedPlaces.forEach((place) => {
      const itemsForPlace = isCustomPlaceId(place.id) && customCategoryItems.length > 0 ? customCategoryItems : plannerCategoryItems
      const category = plannerPlaceCategory(place, itemsForPlace)
      if (shownCategories.has(category)) return
      const item = itemsForPlace.find((option) => option.key === category)
      items.push({
        key: `visible-${category}`,
        categoryKey: category,
        label: item?.label ?? plannerCategoryLabel(category, categoryLabels, itemsForPlace),
        color: plannerMarkerColor(category),
        group: 'category',
      })
      shownCategories.add(category)
    })

    return items
  }, [categoryLabels, config.categoryItems, customCategoryItems, plannerCategoryItems, visiblePlannedPlaces])
  const visiblePlannedDays = useMemo(() => {
    if (dayView === 'all') return plannedDays
    const day = plannedDays[dayView - 1]
    return day ? [day] : plannedDays
  }, [dayView, plannedDays])
  const planCode = useMemo(() => encodeSharedPlan(validPlanItems, lookupPlaces), [lookupPlaces, validPlanItems])
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
    let placeIndex = 0
    const itemsForLabels =
      dayView === 'all'
        ? validPlanItems
        : (plannedDays[dayView - 1]?.items ?? validPlanItems)
    itemsForLabels.forEach((item) => {
      if (isDayItem(item) || !planItemPlace(item, placeById)) return
      placeIndex += 1
      labels.set(item, String(placeIndex))
    })
    return labels
  }, [dayView, placeById, plannedDays, validPlanItems])
  const plannedSet = useMemo(() => new Set(validPlanPlaceIds), [validPlanPlaceIds])
  const plannedPlaceCounts = useMemo(() => {
    const counts = new Map<string, number>()
    validPlanPlaceIds.forEach((placeId) => {
      counts.set(placeId, (counts.get(placeId) ?? 0) + 1)
    })
    return counts
  }, [validPlanPlaceIds])

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => {
      if (customOnly) return isCustomPlaceId(place.id)
      const markerCategoryItems =
        isCustomPlaceId(place.id) && customCategoryItems.length > 0 ? customCategoryItems : plannerCategoryItems
      const category = plannerPlaceCategory(place, markerCategoryItems)
      if (!categoryOn[category]) return false
      if (tier !== 'all' && place.officialPassTier !== tier) return false
      return true
    })
  }, [allPlaces, categoryOn, customCategoryItems, customOnly, plannerCategoryItems, tier])

  const mapMarkerLegendItems = useMemo(() => {
    const items: {
      key: string
      categoryKey: CityMapPlaceCategory
      label: string
      color: string
      group: 'marker' | 'category'
      order: number
    }[] = []
    const shown = new Set<string>()
    const legendPlaces = mode === 'order' && visiblePlannedPlaces.length > 0 ? visiblePlannedPlaces : filteredPlaces

    legendPlaces.forEach((place) => {
      const itemsForPlace = isCustomPlaceId(place.id) && customCategoryItems.length > 0 ? customCategoryItems : plannerCategoryItems
      const category = plannerPlaceCategory(place, itemsForPlace)
      const color = plannerPlaceColor(place, itemsForPlace)
      const usesSourceMarkerColor = Boolean(place.markerColor)
      const label = plannerMarkerLegendLabel(
        category,
        color,
        usesSourceMarkerColor,
        categoryLabels,
        itemsForPlace,
        config.eventPrefix,
      )
      const key = `${color.toLowerCase()}-${label}`
      if (shown.has(key)) return

      items.push({
        key,
        categoryKey: category,
        label,
        color,
        group: usesSourceMarkerColor ? 'marker' : 'category',
        order: plannerMarkerLegendOrder(category, color, usesSourceMarkerColor),
      })
      shown.add(key)
    })

    if (items.length > 0) return items.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-Hant'))

    const fallbackSeen = new Set<string>()
    return plannerCategoryItems
      .map((item) => {
        const color = plannerLegendColor(item)
        const label = plannerMarkerLegendLabel(item.key, color, false, categoryLabels, plannerCategoryItems, config.eventPrefix)
        return {
          key: `${color.toLowerCase()}-${label}`,
          categoryKey: item.key,
          label,
          color,
          group: 'category' as const,
          order: plannerMarkerLegendOrder(item.key, color, false),
        }
      })
      .filter((item) => {
        if (fallbackSeen.has(item.key)) return false
        fallbackSeen.add(item.key)
        return true
      })
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-Hant'))
  }, [categoryLabels, config.eventPrefix, customCategoryItems, filteredPlaces, mode, plannerCategoryItems, visiblePlannedPlaces])

  const customPlaceMatches = useMemo(() => {
    const normalizedDraftName = normalizePlaceMatchText(customDraft.name)
    const normalizedDraftUrl = normalizePlaceMatchUrl(customDraft.googleUrl)
    const hasDraftPosition = customDraft.lat != null && customDraft.lng != null
    if (!normalizedDraftName && !normalizedDraftUrl && !hasDraftPosition) return []

    return lookupPlaces
      .filter((place) => !isCustomPlaceId(place.id))
      .map((place) => {
        const normalizedPlaceName = normalizePlaceMatchText(place.name)
        const normalizedPlaceUrl = normalizePlaceMatchUrl(place.spotGoogleMapsUrl)
        const nameMatch = isLikelySamePlaceName(normalizedDraftName, normalizedPlaceName)
        const urlMatch = Boolean(normalizedDraftUrl && normalizedPlaceUrl && normalizedDraftUrl === normalizedPlaceUrl)
        const distance = hasDraftPosition
          ? distanceMeters({ lat: customDraft.lat ?? 0, lng: customDraft.lng ?? 0 }, { lat: place.lat, lng: place.lng })
          : Number.POSITIVE_INFINITY
        const positionMatch = distance <= 600
        if (!urlMatch && !nameMatch && !positionMatch) return null
        return {
          place,
          score: (urlMatch ? -1000 : 0) + (positionMatch ? 0 : 1000) + Math.min(distance, 999) + (nameMatch ? 0 : 500),
        }
      })
      .filter((item): item is { place: MapPlace; score: number } => Boolean(item))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((item) => item.place)
  }, [customDraft.googleUrl, customDraft.lat, customDraft.lng, customDraft.name, lookupPlaces])

  const selectedPlace = selectedId ? placeById.get(selectedId) ?? null : null
  const customDraftCategoryLabel =
    customCategoryItems.find((item) => item.key === customDraft.category)?.label ?? '景點'
  const customDraftLinks = customDraft.id ? (placeUserLinks[customDraft.id] ?? customPlaces[customDraft.id]?.links ?? []) : []

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 110, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    if (planItems.length === validPlanItems.length && planItems.every((item, index) => item === validPlanItems[index])) {
      return
    }
    setPlanItems(validPlanItems)
  }, [planItems, validPlanItems])

  useEffect(() => {
    const dividerId = pendingDayDividerScrollRef.current
    if (!dividerId) return
    if (!visiblePlanItems.includes(dividerId)) return

    const timer = window.setTimeout(() => {
      const divider = dayDividerRefs.current[dividerId]
      if (!divider) return
      if (isMobilePlannerViewport()) scrollCardFullyIntoView(divider)
      else scrollCardToContainerCenter(divider)
      pendingDayDividerScrollRef.current = null
    }, 0)

    return () => window.clearTimeout(timer)
  }, [visiblePlanItems])

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

  useEffect(() => {
    if (dayView !== 'all' && dayView > plannedDays.length) setDayView('all')
  }, [dayView, plannedDays.length])

  useEffect(() => {
    if (expandedPlanItem && !validPlanItems.includes(expandedPlanItem)) setExpandedPlanItem(null)
  }, [expandedPlanItem, validPlanItems])

  useLayoutEffect(() => {
    const anchor = expandedPlanScrollAnchorRef.current
    if (!anchor) return
    expandedPlanScrollAnchorRef.current = null
    const nextTop = anchor.element.getBoundingClientRect().top
    const offset = nextTop - anchor.top
    if (Math.abs(offset) > 1) anchor.container.scrollTop += offset
  }, [expandedPlanItem])

  useEffect(() => {
    return () => {
      clearFocusScrollTimers()
      if (expandedPlanScrollCollapseTimerRef.current != null) {
        window.clearTimeout(expandedPlanScrollCollapseTimerRef.current)
      }
    }
  }, [clearFocusScrollTimers])

  useEffect(() => {
    if (!openPlannerMenu) return

    const closeMenu = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest('[data-planner-menu="true"]')) return
      setOpenPlannerMenu(null)
    }

    document.addEventListener('pointerdown', closeMenu)
    return () => document.removeEventListener('pointerdown', closeMenu)
  }, [openPlannerMenu])

  const preloadPlannerPdf = useCallback(() => {
    if (!plannerPdfModuleRef.current) {
      plannerPdfModuleRef.current = import('./plannerPdf').catch((error) => {
        plannerPdfModuleRef.current = null
        throw error
      })
    }
    return plannerPdfModuleRef.current
  }, [])

  useEffect(() => {
    if (plannedPlaces.length === 0) return
    if (openPlannerMenu !== 'actions') return
    void preloadPlannerPdf()
  }, [openPlannerMenu, plannedPlaces.length, preloadPlannerPdf])

  useEffect(() => {
    customDraftRef.current = customDraft
  }, [customDraft])

  const getMobilePanelMetrics = useCallback(() => {
    const pageHeight = mobilePageHeight ?? (typeof window === 'undefined' ? 720 : window.innerHeight)
    const expandedPx = Math.min(Math.round(pageHeight * 0.52), 430)
    return {
      collapsedPx: 72,
      expandedPx,
      fullPx: Math.max(expandedPx, pageHeight - 8),
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
    if (initialPlannerLoadRef.current) return
    initialPlannerLoadRef.current = true

    const id = window.setTimeout(() => {
      ;(async () => {
        try {
          const initialSearch = config.initialSearchParams
            ? `?${new URLSearchParams(config.initialSearchParams).toString()}`
            : window.location.search
          const initialParams = new URLSearchParams(initialSearch)
          const hasPlannerBookLink = Boolean(
            initialParams.get(PLANNER_BOOK_PARAM)?.trim() || initialParams.get(PLANNER_PREVIEW_PARAM)?.trim(),
          )
          const plannerBook = await fetchPlannerBook(initialSearch, placeById)
          if (plannerBook) {
            setPlannerLinkUnavailable(false)
            setPlannerBookId(plannerBook.id)
            setPlannerBookReadToken(plannerBook.readToken)
            setPlannerBookUpdatedAt(plannerBook.updatedAt)
            setReadOnlyPlan(plannerBook.readonly)
            if (plannerBook.customPlaces) setCustomPlaces(plannerBook.customPlaces)
            if (plannerBook.userLinks) setPlaceUserLinks(plannerBook.userLinks)
            setPlanItems(plannerBook.items)
            if (plannerBook.notes) setPlaceNotes(plannerBook.notes)
            setMode('order')
            setMobilePanelOpen(true)
            return
          }
          if (hasPlannerBookLink) {
            setPlannerLinkUnavailable(true)
            setPlanItems([])
            setPlaceNotes({})
            setCustomPlaces({})
            setPlaceUserLinks({})
            setPlannerBookId(null)
            setPlannerBookReadToken(null)
            setPlannerBookUpdatedAt(null)
            setReadOnlyPlan(true)
            return
          }
          setPlannerLinkUnavailable(false)

          const shortSharedPlan = await fetchShortSharedPlan(initialSearch, placeById)
          const sharedPlan = shortSharedPlan?.items ?? parseSharedPlan(initialSearch, placeById, lookupPlaces)
          if (sharedPlan?.length) {
            if (shortSharedPlan?.customPlaces) setCustomPlaces(shortSharedPlan.customPlaces)
            if (shortSharedPlan?.userLinks) setPlaceUserLinks(shortSharedPlan.userLinks)
            setPlanItems(sharedPlan)
            if (shortSharedPlan?.notes) setPlaceNotes(shortSharedPlan.notes)
            setMode('order')
            setMobilePanelOpen(true)
            return
          }

          const raw = window.localStorage.getItem(config.storageKey)
          if (raw) {
            const parsed = JSON.parse(raw) as unknown
            if (Array.isArray(parsed)) {
              setPlanItems(parsed.filter((item): item is string => typeof item === 'string'))
            }
          }
          const rawBookId = window.localStorage.getItem(`${config.storageKey}:book-id`)
          const rawBookReadToken = window.localStorage.getItem(`${config.storageKey}:book-read-token`)
          const rawBookUpdatedAt = window.localStorage.getItem(`${config.storageKey}:book-updated-at`)
          if (rawBookId) {
            setPlannerBookId(rawBookId)
            if (rawBookReadToken) setPlannerBookReadToken(rawBookReadToken)
            if (rawBookUpdatedAt) setPlannerBookUpdatedAt(rawBookUpdatedAt)
          }
          const rawNotes = window.localStorage.getItem(`${config.storageKey}:notes`)
          if (rawNotes) {
            const parsedNotes = JSON.parse(rawNotes) as unknown
            if (parsedNotes && typeof parsedNotes === 'object' && !Array.isArray(parsedNotes)) {
              const notes = Object.fromEntries(
                Object.entries(parsedNotes as Record<string, unknown>)
                  .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
                  .map(([key, value]) => [key, value.slice(0, 500)]),
              )
              setPlaceNotes(notes)
            }
          }
          const rawCustomPlaces = window.localStorage.getItem(`${config.storageKey}:custom-places`)
          if (rawCustomPlaces) {
            setCustomPlaces(cleanCustomPlaces(JSON.parse(rawCustomPlaces)))
          }
          const rawUserLinks = window.localStorage.getItem(`${config.storageKey}:user-links`)
          if (rawUserLinks) {
            setPlaceUserLinks(cleanUserLinks(JSON.parse(rawUserLinks)))
          }
        } catch {
          setPlannerLinkUnavailable(false)
          setPlanItems([])
          setPlaceNotes({})
          setCustomPlaces({})
          setPlaceUserLinks({})
        } finally {
          setStorageReady(true)
        }
      })()
    }, 0)
    return () => window.clearTimeout(id)
  }, [config.initialSearchParams, config.storageKey, lookupPlaces, placeById, setMobilePanelOpen])

  useEffect(() => {
    if (!storageReady || readOnlyPlan) return
    window.localStorage.setItem(config.storageKey, JSON.stringify(validPlanItems))
  }, [config.storageKey, readOnlyPlan, storageReady, validPlanItems])

  useEffect(() => {
    if (!storageReady || readOnlyPlan) return
    window.localStorage.setItem(`${config.storageKey}:notes`, JSON.stringify(placeNotes))
  }, [config.storageKey, placeNotes, readOnlyPlan, storageReady])

  useEffect(() => {
    if (!storageReady || readOnlyPlan) return
    window.localStorage.setItem(`${config.storageKey}:custom-places`, JSON.stringify(customPlaces))
  }, [config.storageKey, customPlaces, readOnlyPlan, storageReady])

  useEffect(() => {
    if (!storageReady || readOnlyPlan) return
    window.localStorage.setItem(`${config.storageKey}:user-links`, JSON.stringify(placeUserLinks))
  }, [config.storageKey, placeUserLinks, readOnlyPlan, storageReady])

  useEffect(() => {
    if (!storageReady || readOnlyPlan || !plannerBookId) return
    window.localStorage.setItem(`${config.storageKey}:book-id`, plannerBookId)
    if (plannerBookReadToken) {
      window.localStorage.setItem(`${config.storageKey}:book-read-token`, plannerBookReadToken)
    }
    if (plannerBookUpdatedAt) {
      window.localStorage.setItem(`${config.storageKey}:book-updated-at`, plannerBookUpdatedAt)
    }
  }, [config.storageKey, plannerBookId, plannerBookReadToken, plannerBookUpdatedAt, readOnlyPlan, storageReady])

  const focusPlace = useCallback((place: MapPlace, source: FocusSource = 'list', planItem: PlannerItem | null = null) => {
    const currentMode = modeRef.current
    const focusTarget: PlannerFocusTarget =
      currentMode === 'order'
        ? { mode: 'order', placeId: place.id, itemId: planItem }
        : { mode: 'add', placeId: place.id }
    const shouldScrollAfterPanelShrink =
      mobilePanelStateRef.current === 'full' && isMobilePlannerViewport() && (source === 'list' || source === 'marker')
    if (shouldScrollAfterPanelShrink) {
      pendingHalfPanelFocusRef.current = focusTarget
      pendingHalfPanelFocusRetryRef.current = 0
    }
    if (source === 'marker' || (source === 'list' && isMobilePlannerViewport())) setMobilePanelState('half')
    setSelectedPlanItem(planItem)
    setSelectedId(place.id)
    const map = mapRef.current
    if (map) {
      focusMapOnPlace(map, place)
    }

    if (!shouldScrollAfterPanelShrink) {
      scheduleFocusTargetCenter(focusTarget)
    }
  }, [scheduleFocusTargetCenter])

  const scrollSelectedPlaceInMode = useCallback(
    (targetMode: PlannerMode) => {
      const placeId = selectedId
      const place =
        placeId && placeById.has(placeId)
          ? placeById.get(placeId) ?? null
          : placeId && customPlaces[placeId]
            ? customPlaceToMapPlace(customPlaces[placeId])
            : null
      setMode(targetMode)
      setMobilePanelState((state) => (state === 'collapsed' ? 'half' : state))

      if (!place) return
      let targetPlanItem: PlannerItem | null = null
      setSelectedPlanItem(null)
      setSelectedId(place.id)
      if (targetMode === 'add') {
        const isCustomPlace = isCustomPlaceId(place.id)
        setCustomOnly(isCustomPlace)
        if (!isCustomPlace) {
          const category = plannerPlaceCategory(place, plannerCategoryItems)
          setCategoryOn((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, true])),
            [category]: true,
          }) as Record<CityMapPlaceCategory, boolean>)
        }
        setTier('all')
      } else if (!validPlanPlaceIds.includes(place.id)) {
        return
      } else {
        const targetItem = selectedPlanItem && planItemPlaceId(selectedPlanItem) === place.id
          ? selectedPlanItem
          : validPlanItems.find((item) => planItemPlaceId(item) === place.id) ?? null
        targetPlanItem = targetItem
        setSelectedPlanItem(targetItem)
        const targetDayView = findPlanItemDayView(targetItem)
        if (targetDayView !== 'all') setDayView(targetDayView)
      }

      const map = mapRef.current
      if (map) focusMapOnPlace(map, place)

      window.setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scheduleFocusTargetCenter(
              targetMode === 'order'
                ? { mode: 'order', placeId: place.id, itemId: targetPlanItem }
                : { mode: 'add', placeId: place.id },
            )
          })
        })
      }, 0)
    },
    [
      customPlaces,
      findPlanItemDayView,
      placeById,
      plannerCategoryItems,
      scheduleFocusTargetCenter,
      selectedId,
      selectedPlanItem,
      validPlanItems,
      validPlanPlaceIds,
    ],
  )

  const openOrderMode = useCallback(() => {
    setMode('order')
    setMobilePanelState((state) => (state === 'collapsed' ? 'half' : state))
  }, [])

  const scrollBackToCustomCard = (placeId: string, returnMode: 'add' | 'order', returnItem: PlannerItem | null) => {
    const fallbackItem = planItems.find((item) => planItemPlaceId(item) === placeId) ?? null
    scheduleFocusTargetCenter(
      returnMode === 'order'
        ? { mode: 'order', placeId, itemId: returnItem ?? fallbackItem }
        : { mode: 'add', placeId },
    )
  }

  const scrollToTransportCard = (itemId: PlannerItem) => {
    scheduleFocusTargetCenter({ mode: 'transport', itemId })
  }

  const setExpandedPlanItemWithScrollCompensation = useCallback((nextItem: PlannerItem | null, preferredAnchor?: HTMLElement | null) => {
    const previousItem = expandedPlanItem
    if (expandedPlanScrollCollapseTimerRef.current != null) {
      window.clearTimeout(expandedPlanScrollCollapseTimerRef.current)
      expandedPlanScrollCollapseTimerRef.current = null
    }
    if (previousItem === nextItem) {
      setExpandedPlanItem(nextItem)
      return
    }

    if (nextItem && isMobilePlannerViewport()) {
      expandedPlanScrollAnchorRef.current = null
      setExpandedPlanItem(nextItem)
      if (mobilePanelStateRef.current === 'full') return
      const placeId = planItemPlaceId(nextItem)
      scheduleFocusTargetCenter(
        placeId ? { mode: 'order', placeId, itemId: nextItem } : { mode: 'transport', itemId: nextItem },
      )
      return
    }

    const anchorCard = preferredAnchor ?? (
      nextItem
        ? planCardRefs.current[nextItem] ?? transportCardRefs.current[nextItem]
        : previousItem
          ? planCardRefs.current[previousItem] ?? transportCardRefs.current[previousItem]
          : null
    )
    const container = anchorCard?.closest('[data-planner-scroll-list="true"]') as HTMLElement | null
    if (!anchorCard || !container) {
      expandedPlanScrollAnchorRef.current = null
      setExpandedPlanItem(nextItem)
      return
    }

    expandedPlanScrollAnchorRef.current = {
      element: anchorCard,
      top: anchorCard.getBoundingClientRect().top,
      container,
    }
    setExpandedPlanItem(nextItem)
  }, [expandedPlanItem, scheduleFocusTargetCenter])

  const scheduleExpandedPlanItemCollapseIfNearlyOutside = useCallback((event: ReactUIEvent<HTMLDivElement>) => {
    if (!expandedPlanItem) return
    const container = event.currentTarget
    if (expandedPlanScrollCollapseTimerRef.current != null) {
      window.clearTimeout(expandedPlanScrollCollapseTimerRef.current)
    }
    expandedPlanScrollCollapseTimerRef.current = window.setTimeout(() => {
      const card = planCardRefs.current[expandedPlanItem] ?? transportCardRefs.current[expandedPlanItem]
      if (card && cardIsNearlyOutsideScrollArea(card, container)) {
        setExpandedPlanItemWithScrollCompensation(null, findStableVisiblePlanCard(container, expandedPlanItem))
      }
      expandedPlanScrollCollapseTimerRef.current = null
    }, 140)
  }, [expandedPlanItem, setExpandedPlanItemWithScrollCompensation])

  const fitMapToPlaces = useCallback((force = false) => {
    const map = mapRef.current
    if (!map || !window.google?.maps || allPlaces.length === 0) return
    if (!force && userAdjustedMapRef.current) return
    const bounds = new google.maps.LatLngBounds()
    allPlaces.forEach((place) => bounds.extend({ lat: place.lat, lng: place.lng }))
    autoFittingMapRef.current = true
    map.fitBounds(bounds, 48)
    window.setTimeout(() => {
      autoFittingMapRef.current = false
    }, 300)
  }, [allPlaces])

  const syncMap = useCallback(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return

    const maps = google.maps

    lineRefs.current.forEach((line) => line.setMap(null))
    lineRefs.current = visiblePlannedDays.map((day, dayIndex) => {
      const line = new maps.Polyline({
        geodesic: true,
        strokeColor: DAY_ROUTE_COLORS[(dayView === 'all' ? dayIndex : dayView - 1) % DAY_ROUTE_COLORS.length],
        strokeOpacity: 0.88,
        strokeWeight: 3,
        path: day.places.map((place) => ({ lat: place.lat, lng: place.lng })),
      })
      line.setMap(mode === 'order' && day.places.length > 1 ? map : null)
      return line
    })

    const orderMarkerItems = visiblePlanItems
      .map((item) => {
        const place = planItemPlace(item, placeById)
        return place ? { item, place } : null
      })
      .filter(Boolean) as { item: PlannerItem; place: MapPlace }[]
    const markerEntries =
      mode === 'order'
        ? orderMarkerItems.map((entry, index) => ({ ...entry, key: entry.item, orderIndex: index }))
        : filteredPlaces.map((place) => ({ item: place.id, place, key: place.id, orderIndex: -1 }))
    const visibleIds = new Set(markerEntries.map((entry) => entry.key))
    const markerPlaceTotals = new Map<string, number>()
    markerEntries.forEach(({ place }) => {
      markerPlaceTotals.set(place.id, (markerPlaceTotals.get(place.id) ?? 0) + 1)
    })
    const markerPlaceSeen = new Map<string, number>()

    markersRef.current.forEach((marker, markerId) => {
      if (visibleIds.has(markerId)) return
      marker.setMap(null)
      markersRef.current.delete(markerId)
    })

    markerEntries.forEach(({ item, place, key, orderIndex }) => {
      const orderLabel = planOrderLabels.get(item) ?? null
      const totalAtPlace = markerPlaceTotals.get(place.id) ?? 1
      const seenAtPlace = markerPlaceSeen.get(place.id) ?? 0
      markerPlaceSeen.set(place.id, seenAtPlace + 1)
      const offsetAngle = seenAtPlace * 1.7
      const offsetDistance = mode === 'order' && totalAtPlace > 1 ? 0.00008 : 0
      const markerPosition = {
        lat: place.lat + Math.sin(offsetAngle) * offsetDistance,
        lng: place.lng + Math.cos(offsetAngle) * offsetDistance * 1.25,
      }
      let marker = markersRef.current.get(key)
      if (!marker) {
        marker = new maps.Marker({
          position: markerPosition,
        })
        marker.addListener('click', () => {
          focusPlace(place, 'marker', modeRef.current === 'order' ? key : null)
          if (modeRef.current === 'order') {
            setExpandedPlanItemWithScrollCompensation(key)
          }
        })
        markersRef.current.set(key, marker)
      }
      marker.setPosition(markerPosition)
      const showOrderMarker = mode === 'order' && typeof orderLabel === 'string'
      marker.setTitle(showOrderMarker ? `${orderLabel}. ${place.name}` : place.name)
      const markerCategoryItems =
        isCustomPlaceId(place.id) && customCategoryItems.length > 0 ? customCategoryItems : plannerCategoryItems
      const category = plannerPlaceCategory(place, markerCategoryItems)
      marker.setZIndex(showOrderMarker ? 1000 + orderIndex : cityMapMarkerZIndex(category))
      marker.setIcon(
        plannerMarkerIcon(
          place,
          maps,
          showOrderMarker ? Number(orderLabel) : null,
          plannerPlaceColor(place, markerCategoryItems),
          category,
        ),
      )
      marker.setLabel(
        showOrderMarker ? { text: orderLabel, color: '#ffffff', fontSize: '13px', fontWeight: '900' } : null,
      )
      marker.setVisible(true)
      marker.setMap(map)
    })

    const selectedMarkerEntry = markerEntries.find(({ key, place }) => {
      if (mode === 'order') {
        if (selectedPlanItem) return key === selectedPlanItem
        return place.id === selectedId
      }
      return place.id === selectedId
    })
    const selectedMarker = selectedMarkerEntry ? markersRef.current.get(selectedMarkerEntry.key) : null
    const selectedMarkerPosition = selectedMarker?.getPosition()
    if (!selectedMarker || !selectedMarkerPosition) {
      selectedMarkerArrowRef.current?.setMap(null)
      selectedMarkerArrowRef.current = null
      return
    }

    const selectedArrowAnchorY = mode === 'order' ? 44 : 54
    selectedMarker.setZIndex(10000)
    if (!selectedMarkerArrowRef.current) {
      selectedMarkerArrowRef.current = new maps.Marker({
        map,
        position: selectedMarkerPosition,
        icon: selectedMarkerArrowIcon(maps, selectedArrowAnchorY),
        clickable: false,
        zIndex: 10001,
      })
      return
    }

    selectedMarkerArrowRef.current.setIcon(selectedMarkerArrowIcon(maps, selectedArrowAnchorY))
    selectedMarkerArrowRef.current.setMap(map)
    selectedMarkerArrowRef.current.setPosition(selectedMarkerPosition)
  }, [
    dayView,
    filteredPlaces,
    focusPlace,
    mode,
    placeById,
    customCategoryItems,
    plannerCategoryItems,
    planOrderLabels,
    selectedId,
    selectedPlanItem,
    setExpandedPlanItemWithScrollCompensation,
    visiblePlanItems,
    visiblePlannedDays,
  ])

  useEffect(() => {
    if (!apiKey) return
    if (mapRef.current) return

    let cancelled = false
    ;(async () => {
      try {
        await loadGoogleMapsScript(apiKey)
        if (cancelled || !mapElRef.current) return
        mapRef.current = new google.maps.Map(mapElRef.current, {
          center: mapCenter,
          zoom: config.mapZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          zoomControl: true,
        })
        mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (customDraftRef.current.picking && e.latLng) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            setCustomDraft((draft) => ({ ...draft, lat, lng }))
            return
          }
          setMobilePanelOpen(false)
        })
        mapRef.current.addListener('zoom_changed', () => {
          if (!autoFittingMapRef.current) userAdjustedMapRef.current = true
        })
        mapRef.current.addListener('dragstart', () => {
          userAdjustedMapRef.current = true
          setMobilePanelOpen(false)
        })
        setMapReady(true)
        setMapError(null)
      } catch {
        if (!cancelled) setMapError('無法載入 Google 地圖，請檢查 API Key 與權限。')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [apiKey, mapCenter, config.mapZoom, setMobilePanelOpen])

  useEffect(() => {
    if (!mapReady || initialMapFitDoneRef.current || allPlaces.length === 0) return
    initialMapFitDoneRef.current = true
    const fitTimer = window.setTimeout(() => {
      fitMapToPlaces(true)
    }, 0)

    return () => {
      window.clearTimeout(fitTimer)
    }
  }, [allPlaces.length, fitMapToPlaces, mapReady])

  useEffect(() => {
    if (!mapReady) return
    syncMap()
  }, [mapReady, syncMap])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return
    if (customDraft.lat == null || customDraft.lng == null) {
      customDraftMarkerRef.current?.setMap(null)
      customDraftMarkerRef.current = null
      return
    }
      if (!customDraftMarkerRef.current) {
        customDraftMarkerRef.current = new google.maps.Marker({
          map,
          zIndex: 3000,
          title: customDraft.name || '自訂景點',
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 16,
            fillColor: '#475569',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
          label: { text: '?', color: '#ffffff', fontSize: '13px', fontWeight: '900' },
        })
        customDraftMarkerRef.current.addListener('dragend', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return
          setCustomDraft((draft) => ({
            ...draft,
            lat: e.latLng?.lat() ?? draft.lat,
            lng: e.latLng?.lng() ?? draft.lng,
          }))
        })
      }
    customDraftMarkerRef.current.setPosition({ lat: customDraft.lat, lng: customDraft.lng })
    customDraftMarkerRef.current.setTitle(customDraft.name || '自訂景點')
    customDraftMarkerRef.current.setDraggable(true)
    customDraftMarkerRef.current.setMap(map)
  }, [customDraft.lat, customDraft.lng, customDraft.name, mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !customDraft.picking || customDraft.lat == null || customDraft.lng == null) return
    const position = { lat: customDraft.lat, lng: customDraft.lng }
    window.setTimeout(() => {
      map.panTo(position)
      if ((map.getZoom() ?? 0) < 16) map.setZoom(16)
    }, 160)
  }, [customDraft.lat, customDraft.lng, customDraft.picking, mapReady])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const resize = () => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      google.maps.event.trigger(map, 'resize')
    }
    const id = window.setTimeout(() => {
      resize()
    }, 120)
    window.addEventListener('resize', resize)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', resize)
    }
  }, [fitMapToPlaces, mapReady])

  const dismissInAppPrompt = useCallback(() => {
    try {
      window.localStorage.setItem(`${config.storageKey}:in-app-browser-prompt-dismissed`, '1')
    } catch {
      // Ignore storage limits or private-browser restrictions.
    }
    setInAppPromptOpen(false)
  }, [config.storageKey])

  const maybeOpenInAppPrompt = useCallback(() => {
    if (!config.saveReminderEnabled || !inAppBrowser) return
    try {
      if (window.localStorage.getItem(`${config.storageKey}:in-app-browser-prompt-dismissed`) === '1') return
    } catch {
      // If storage is blocked, still show the prompt once in this session.
    }
    setInAppPromptCopied(false)
    setInAppPromptOpen(true)
  }, [config.saveReminderEnabled, config.storageKey, inAppBrowser])

  const copyInAppPromptLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicCurrentPlannerUrl())
      setInAppPromptCopied(true)
    } catch {
      setInAppPromptCopied(false)
    }
  }, [])

  const addPlaceToPlan = (place: MapPlace, dayNumber: number | 'end' = 'end', initialNote = '') => {
    if (readOnlyPlan) return
    const itemId = canRepeatPlanPlace(place) ? createVisitItem(place.id) : place.id
    setPlanItems((ids) => {
      if (!canRepeatPlanPlace(place) && ids.some((item) => planItemPlaceId(item) === place.id)) return ids
      const nextIds = insertPlaceIntoDay(ids, place, dayNumber, itemId)
      trackPlannerEvent('add_place', {
        place_id: place.id,
        place_name: shortName(place.name),
        place_category: place.category,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, lookupPlaces),
        target_day: dayNumber === 'end' ? '' : dayNumber,
      })
      return nextIds
    })
    if (initialNote.trim()) updatePlaceNote(itemId, initialNote)
    setSelectedPlanItem(itemId)
    setSelectedId(place.id)
    setExpandedPlanItemWithScrollCompensation(itemId)
    if (typeof dayNumber === 'number') setDayView(dayNumber)
    setRecentlyAddedPlaceId(place.id)
    window.setTimeout(() => {
      setRecentlyAddedPlaceId((id) => (id === place.id ? null : id))
    }, 1400)
    if (modeRef.current === 'order') setMobilePanelOpen(true)
  }

  const addPlace = (place: MapPlace, initialNote = '') => {
    const noteForNewItem = initialNote
    if (hasDayDividers && (canRepeatPlanPlace(place) || !plannedSet.has(place.id))) {
      setPendingAddPlace(place)
      setPendingAddPlaceNote(noteForNewItem)
      return
    }
    addPlaceToPlan(place, 'end', noteForNewItem)
  }

  const confirmAddPlaceToDay = (dayNumber: number | 'end') => {
    if (!pendingAddPlace) return
    addPlaceToPlan(pendingAddPlace, dayNumber, pendingAddPlaceNote)
    setPendingAddPlace(null)
    setPendingAddPlaceNote('')
  }

  const removePlace = (itemId: string) => {
    if (readOnlyPlan) return
    setPlanItems((ids) => {
      const placeId = planItemPlaceId(itemId) ?? itemId
      const place = placeById.get(placeId)
      const nextIds = ids.filter((id) => id !== itemId)
      trackPlannerEvent('remove_place', {
        place_id: placeId,
        place_name: place ? shortName(place.name) : '',
        place_category: place?.category,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, lookupPlaces),
      })
      return nextIds
    })
    const placeId = planItemPlaceId(itemId) ?? itemId
    setSelectedPlanItem((item) => (item === itemId ? null : item))
    setSelectedId((id) => (id === placeId ? null : id))
  }

  const deleteCustomPlace = (placeId: string) => {
    if (readOnlyPlan) return
    setPlanItems((ids) => ids.filter((item) => planItemPlaceId(item) !== placeId))
    if (isCustomPlaceId(placeId)) {
      setCustomPlaces((places) => {
        const nextPlaces = { ...places }
        delete nextPlaces[placeId]
        return nextPlaces
      })
      setPlaceNotes((notes) => {
        const nextNotes = { ...notes }
        delete nextNotes[placeId]
        return nextNotes
      })
      setPlaceUserLinks((links) => {
        const nextLinks = { ...links }
        delete nextLinks[placeId]
        return nextLinks
      })
    }
  }

  const requestRemovePlace = (placeId: string) => {
    setPendingDelete({ type: 'plan', placeId })
  }

  const requestDeleteCustomPlace = (placeId: string) => {
    setPendingDelete({ type: 'custom', placeId })
  }

  const requestRemoveDayDivider = (itemId: string) => {
    if (readOnlyPlan) return
    setPendingDelete({ type: 'day', itemId })
  }

  const addTransportAfter = (itemId: PlannerItem | null) => {
    if (readOnlyPlan) return
    const transportItem = createTransportItem()
    setMode('order')
    setMobilePanelOpen(true)
    setOpenPlannerMenu(null)
    setPlanItems((items) => {
      const fallbackIndex = (() => {
        for (let index = items.length - 1; index >= 0; index -= 1) {
          if (planItemPlace(items[index], placeById)) return index
        }
        return -1
      })()
      const baseIndex = itemId ? items.indexOf(itemId) : -1
      if (baseIndex < 0 && fallbackIndex < 0) return items
      let insertIndex = (baseIndex >= 0 ? baseIndex : fallbackIndex) + 1
      while (insertIndex < items.length && isTransportItem(items[insertIndex])) {
        insertIndex += 1
      }
      const nextItems = [...items.slice(0, insertIndex), transportItem, ...items.slice(insertIndex)]
      trackPlannerEvent('add_transport', {
        plan_count: nextItems.length,
        plan_code: encodeSharedPlan(nextItems, lookupPlaces),
      })
      return nextItems
    })
    setExpandedPlanItemWithScrollCompensation(transportItem)
    scrollToTransportCard(transportItem)
  }

  const addTransportFromMenu = () => {
    if (readOnlyPlan) return
    const selectedItem =
      selectedPlanItem && validPlanItems.includes(selectedPlanItem) && planItemPlace(selectedPlanItem, placeById)
        ? selectedPlanItem
        : selectedId
          ? validPlanItems.find((item) => planItemPlaceId(item) === selectedId) ?? null
          : null
    addTransportAfter(selectedItem ?? null)
  }

  const updateTransportItem = (itemId: PlannerItem, info: TransportInfo) => {
    if (readOnlyPlan) return
    const nextItem = serializeTransportItem(info)
    setPlanItems((items) => items.map((item) => (item === itemId ? nextItem : item)))
  }

  const requestRemoveTransport = (itemId: string) => {
    if (readOnlyPlan) return
    const transport = parseTransportItem(itemId)
    if (!transport || !hasSavedTransportDetails(transport)) {
      removeTransport(itemId)
      return
    }
    setPendingDelete({ type: 'transport', itemId })
  }

  const removeTransport = (itemId: string) => {
    if (readOnlyPlan) return
    setPlanItems((items) => items.filter((item) => item !== itemId))
  }

  const confirmPendingDelete = () => {
    if (!pendingDelete) return
    if (pendingDelete.type === 'custom') deleteCustomPlace(pendingDelete.placeId)
    else if (pendingDelete.type === 'day') removeDayDivider(pendingDelete.itemId)
    else if (pendingDelete.type === 'transport') removeTransport(pendingDelete.itemId)
    else if (pendingDelete.type === 'plan') removePlace(pendingDelete.placeId)
    setPendingDelete(null)
  }

  const finishCustomPlacePicking = () => {
    setCustomDraft((draft) => ({ ...draft, picking: false }))
    setMobilePanelOpen(true)
  }
  const addDayDivider = () => {
    if (readOnlyPlan) return
    const dividerId = createDayItem()
    pendingDayDividerScrollRef.current = dividerId
    setMode('order')
    setDayView('all')
    setOpenPlannerMenu(null)
    setMobilePanelOpen(false)
    setPlanItems((items) => {
      const selectedItem =
        selectedPlanItem && items.includes(selectedPlanItem) && planItemPlace(selectedPlanItem, placeById)
          ? selectedPlanItem
          : selectedId
            ? items.find((item) => planItemPlaceId(item) === selectedId) ?? null
            : null
      const hasFirstDayDivider = isDayItem(items[0] ?? '')
      const firstDayDivider = hasFirstDayDivider ? null : createDayItem()
      const workingItems = firstDayDivider ? [firstDayDivider, ...items] : items
      const fallbackIndex = workingItems.length
      const baseIndex = selectedItem ? items.indexOf(selectedItem) : -1
      let insertIndex = baseIndex >= 0 ? baseIndex + 1 + (firstDayDivider ? 1 : 0) : fallbackIndex
      while (insertIndex < workingItems.length && isTransportItem(workingItems[insertIndex])) {
        insertIndex += 1
      }
      const dayCount = workingItems.filter(isDayItem).length + (hasFirstDayDivider || firstDayDivider ? 1 : 2)
      const nextItems = [...workingItems.slice(0, insertIndex), dividerId, ...workingItems.slice(insertIndex)]
      trackPlannerEvent('add_day_divider', {
        day_count: dayCount,
        plan_count: validPlanIds.length,
        plan_code: encodeSharedPlan(nextItems, lookupPlaces),
      })
      return nextItems
    })
  }

  const removeDayDivider = (itemId: string) => {
    if (readOnlyPlan) return
    setPlanItems((items) => items.filter((item) => item !== itemId))
  }

  const updateDayDividerTitle = (itemId: string, title: string) => {
    if (readOnlyPlan) return
    const nextItem = updateDayItemTitle(itemId, title)
    setPlanItems((items) => items.map((item) => (item === itemId ? nextItem : item)))
    setSelectedPlanItem((item) => (item === itemId ? nextItem : item))
  }

  const updateNoteKeys = (keys: string[], note: string) => {
    if (readOnlyPlan) return
    const trimmedNote = note.slice(0, 500)
    const uniqueKeys = Array.from(new Set(keys.filter(Boolean)))
    if (uniqueKeys.length === 0) return
    setPlaceNotes((notes) => {
      const nextNotes = { ...notes }
      uniqueKeys.forEach((key) => {
        if (!trimmedNote.trim()) delete nextNotes[key]
        else nextNotes[key] = trimmedNote
      })
      return nextNotes
    })
  }

  const updatePlaceNote = (itemId: string, note: string) => {
    updateNoteKeys([itemId], note)
  }

  const addPlaceUserLink = (placeId: string, link: PlannerUserLink) => {
    if (readOnlyPlan) return
    const label = link.label.trim().slice(0, 40)
    const href = link.href.trim().slice(0, 500)
    if (!label || !href) return
    setPlaceUserLinks((links) => ({
      ...links,
      [placeId]: [...(links[placeId] ?? []), { label, href }].slice(0, 8),
    }))
  }

  const removePlaceUserLink = (placeId: string, index: number) => {
    if (readOnlyPlan) return
    setPlaceUserLinks((links) => {
      const nextLinks = (links[placeId] ?? []).filter((_, linkIndex) => linkIndex !== index)
      if (nextLinks.length === 0) {
        const cleanLinks = { ...links }
        delete cleanLinks[placeId]
        return cleanLinks
      }
      return { ...links, [placeId]: nextLinks }
    })
  }

  const setCustomPlacePrimaryUserLink = (placeId: string, labelValue: string, hrefValue: string) => {
    if (readOnlyPlan) return
    const label = labelValue.trim().slice(0, 40)
    const href = hrefValue.trim().slice(0, 500)
    if (!label || !href) return
    const nextPrimary = { label, href }
    const nextPrimaryKey = label + '::' + href
    setPlaceUserLinks((links) => {
      const restLinks = (links[placeId] ?? [])
        .slice(1)
        .filter((link) => link.label.trim() + '::' + link.href.trim() !== nextPrimaryKey)
      return {
        ...links,
        [placeId]: [nextPrimary, ...restLinks].slice(0, 8),
      }
    })
  }

  const addCustomDraftLink = () => {
    if (!customDraft.id) return
    addPlaceUserLink(customDraft.id, { label: customDraft.linkLabel, href: customDraft.linkUrl })
    setCustomDraft((draft) => ({ ...draft, linkLabel: '', linkUrl: '' }))
  }
  const startCustomPlaceDraft = () => {
    if (readOnlyPlan) return
    setCustomDraftReturnMode('add')
    setCustomDraftReturnItem(null)
    setCustomDraft({
      ...emptyCustomPlaceDraft,
      id: `${CUSTOM_PLACE_PREFIX}${Date.now().toString(36)}`,
      category: customCategoryItems[0]?.key ?? 'free',
      nameConfirmed: true,
    })
    setCustomUrlResolving(false)
    setMobilePanelOpen(true)
    setMode('add')
  }

  const editCustomPlace = (placeId: string, returnMode: 'add' | 'order' = 'add', returnItem: PlannerItem | null = null) => {
    const place = customPlaces[placeId]
    if (!place) return
    const relatedItem = returnItem && planItemPlaceId(returnItem) === placeId
      ? returnItem
      : selectedPlanItem && planItemPlaceId(selectedPlanItem) === placeId
        ? selectedPlanItem
        : planItems.find((item) => planItemPlaceId(item) === placeId)
    if ((place.links?.length ?? 0) > 0 && (placeUserLinks[placeId]?.length ?? 0) === 0) {
      setPlaceUserLinks((links) => ({ ...links, [placeId]: place.links ?? [] }))
    }
    setCustomDraftReturnMode(returnMode)
    setCustomDraftReturnItem(returnItem)
    setCustomDraft({
      id: place.id,
      name: place.name,
      googleUrl: place.googleUrl ?? '',
      naverUrl: place.naverUrl ?? '',
      linkLabel: '',
      linkUrl: '',
      note: relatedItem ? placeNotes[relatedItem] ?? '' : '',
      category: cleanCustomPlaceCategory(place.category),
      lat: place.lat,
      lng: place.lng,
      picking: false,
      nameConfirmed: true,
    })
    setCustomUrlResolving(false)
    setCustomOnly(true)
    setSelectedId(place.id)
    setMode('add')
    setMobilePanelOpen(true)
  }

  const geocodeResolvedMapQuery = (
    query: string,
    resolvedUrl: string,
    resolvedName: string,
    cacheKey: string,
    nextSeq: number,
  ) => {
    if (!query || !window.google?.maps?.Geocoder) return false
    setCustomUrlResolving(true)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: query }, (results, status) => {
      if (customUrlResolveSeqRef.current !== nextSeq) return
      const location = status === 'OK' ? results?.[0]?.geometry?.location : null
      if (!location) {
        setCustomUrlResolving(false)
        return
      }
      const lat = location.lat()
      const lng = location.lng()
      const name = resolvedName || cleanGoogleMapsQueryPlaceName(query)
      setResolvedMapUrlCache(cacheKey, {
        url: resolvedUrl,
        ...(name ? { name } : {}),
        query,
        lat,
        lng,
      })
      setCustomDraft((draft) => ({
        ...draft,
        googleUrl: resolvedUrl,
        ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && name ? { name } : {}),
        lat,
        lng,
        picking: true,
      }))
      setCustomUrlResolving(false)
    })
    return true
  }

  const updateCustomGoogleUrl = (googleUrl: string) => {
    const extractedGoogleUrl = extractGoogleMapsUrlFromText(googleUrl)
    const trimmedGoogleUrl = extractedGoogleUrl.trim()
    const coordinates = parseGoogleMapsUrl(trimmedGoogleUrl)
    const parsedName = parseGoogleMapsSharedTextName(googleUrl, trimmedGoogleUrl) || parseGoogleMapsPlaceName(trimmedGoogleUrl)
    const nextSeq = customUrlResolveSeqRef.current + 1
    customUrlResolveSeqRef.current = nextSeq
    setCustomUrlResolving(false)
    setCustomDraft((draft) => ({
      ...draft,
      googleUrl: trimmedGoogleUrl || googleUrl,
      ...(!draft.name.trim() && parsedName ? { name: parsedName } : {}),
      ...(coordinates ? { lat: coordinates.lat, lng: coordinates.lng, picking: true } : {}),
    }))
    const shouldResolveUrl =
      shouldResolveGoogleMapsUrl(trimmedGoogleUrl) && (isShortGoogleMapsUrl(trimmedGoogleUrl) || !coordinates || !parsedName)
    if (!shouldResolveUrl) return

    const cachedResolved = getResolvedMapUrlCache(trimmedGoogleUrl)
    if (cachedResolved) {
      const resolvedCoordinates =
        typeof cachedResolved.lat === 'number' && typeof cachedResolved.lng === 'number'
          ? { lat: cachedResolved.lat, lng: cachedResolved.lng }
          : parseGoogleMapsUrl(cachedResolved.url)
      const resolvedName =
        cleanGoogleMapsQueryPlaceName(cachedResolved.name || '') || parseGoogleMapsPlaceName(cachedResolved.url)
      if (!resolvedCoordinates && cachedResolved.query) {
        geocodeResolvedMapQuery(cachedResolved.query, cachedResolved.url, resolvedName, trimmedGoogleUrl, nextSeq)
        return
      }
      if (resolvedCoordinates) {
        setCustomDraft((draft) => ({
          ...draft,
          googleUrl: cachedResolved.url,
          ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && resolvedName
            ? { name: resolvedName }
            : {}),
          lat: resolvedCoordinates.lat,
          lng: resolvedCoordinates.lng,
          picking: true,
        }))
        return
      }
    }

    setCustomUrlResolving(true)
    fetch(`/api/pass-planner/resolve-map-url?url=${encodeURIComponent(trimmedGoogleUrl)}`, {
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { url?: unknown; title?: unknown; query?: unknown; lat?: unknown; lng?: unknown } | null) => {
        if (customUrlResolveSeqRef.current !== nextSeq || typeof data?.url !== 'string') return
        const resolvedUrl = data.url
        const resolvedTitle = typeof data.title === 'string' ? cleanGoogleMapsQueryPlaceName(data.title) : ''
        const resolvedQuery =
          typeof data.query === 'string' && data.query.trim() ? data.query.trim() : parseGoogleMapsQuery(resolvedUrl)
        const resolvedLat = typeof data.lat === 'number' && Number.isFinite(data.lat) ? data.lat : null
        const resolvedLng = typeof data.lng === 'number' && Number.isFinite(data.lng) ? data.lng : null
        setResolvedMapUrlCache(trimmedGoogleUrl, {
          url: resolvedUrl,
          ...(resolvedTitle ? { name: resolvedTitle } : {}),
          ...(resolvedQuery ? { query: resolvedQuery } : {}),
          ...(resolvedLat != null ? { lat: resolvedLat } : {}),
          ...(resolvedLng != null ? { lng: resolvedLng } : {}),
        })
        const resolvedCoordinates =
          resolvedLat != null && resolvedLng != null ? { lat: resolvedLat, lng: resolvedLng } : parseGoogleMapsUrl(resolvedUrl)
        const resolvedName = resolvedTitle || parseGoogleMapsPlaceName(resolvedUrl)
        if (!resolvedCoordinates && resolvedQuery) {
          geocodeResolvedMapQuery(resolvedQuery, resolvedUrl, resolvedName, trimmedGoogleUrl, nextSeq)
          return
        }
        setCustomDraft((draft) => ({
          ...draft,
          googleUrl: resolvedUrl,
          ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && resolvedName
            ? { name: resolvedName }
            : {}),
          ...(resolvedCoordinates ? { lat: resolvedCoordinates.lat, lng: resolvedCoordinates.lng, picking: true } : {}),
        }))
      })
      .catch(() => null)
      .finally(() => {
        if (customUrlResolveSeqRef.current === nextSeq) setCustomUrlResolving(false)
      })
  }

  const saveCustomPlace = () => {
    const id = customDraft.id ?? `${CUSTOM_PLACE_PREFIX}${Date.now().toString(36)}`
    const name = customDraft.name.trim()
    if (!name) {
      setCustomPlaceSaveError('name')
      return
    }
    if (customDraft.lat == null || customDraft.lng == null) {
      setCustomPlaceSaveError('location')
      return
    }
    const linkLabel = customDraft.linkLabel.trim()
    const linkUrl = customDraft.linkUrl.trim()
    const existingPlace = customPlaces[id]
    const baseLinks = placeUserLinks[id] ?? existingPlace?.links ?? []
    const pendingLinks = linkLabel && linkUrl ? [{ label: linkLabel, href: linkUrl }] : []
    const seenCustomLinks = new Set<string>()
    const nextLinks = [...baseLinks, ...pendingLinks]
      .map((link) => ({ label: link.label.trim().slice(0, 40), href: link.href.trim().slice(0, 500) }))
      .filter((link) => {
        if (!link.label || !link.href) return false
        const key = link.label + '::' + link.href
        if (seenCustomLinks.has(key)) return false
        seenCustomLinks.add(key)
        return true
      })
    const customPlace: CustomPlannerPlace = {
      id,
      ...(existingPlace?.sourcePlaceId ? { sourcePlaceId: existingPlace.sourcePlaceId } : {}),
      name,
      category: semanticPlannerCategory(cleanCustomPlaceCategory(customDraft.category), customCategoryItems),
      lat: customDraft.lat,
      lng: customDraft.lng,
      ...(customDraft.googleUrl.trim() ? { googleUrl: customDraft.googleUrl.trim() } : {}),
      ...(customDraft.naverUrl.trim() ? { naverUrl: customDraft.naverUrl.trim() } : {}),
      ...(nextLinks.length > 0 ? { links: nextLinks } : {}),
    }

    setCustomPlaces((current) => ({ ...current, [id]: customPlace }))
    setPlaceUserLinks((links) => {
      if (nextLinks.length === 0) {
        const cleanLinks = { ...links }
        delete cleanLinks[id]
        return cleanLinks
      }
      return { ...links, [id]: nextLinks }
    })
    setSelectedId(id)
    const returnMode = customDraftReturnMode
    const returnItem = customDraftReturnItem && planItemPlaceId(customDraftReturnItem) === id ? customDraftReturnItem : null
    setMode(returnMode)
    if (returnMode === 'add') setCustomOnly(true)
    if (returnMode === 'order') setSelectedPlanItem(returnItem ?? planItems.find((item) => planItemPlaceId(item) === id) ?? null)
    else setSelectedPlanItem(null)
    setMobilePanelOpen(true)
    setCustomDraft(emptyCustomPlaceDraft)
    setCustomDraftReturnItem(null)
    setCustomUrlResolving(false)
    scrollBackToCustomCard(id, returnMode, returnItem)
    trackPlannerEvent('add_custom_place', {
      place_id: id,
      place_name: name,
      place_category: customDraft.category,
      plan_count: validPlanIds.length,
    })
  }

  const handleMatchedPlaceAsCustom = (match: MapPlace) => {
    if (readOnlyPlan) return
    const id = customDraft.id ?? `${CUSTOM_PLACE_PREFIX}${Date.now().toString(36)}`
    const category = semanticPlannerCategory(cleanCustomPlaceCategory(match.category), customCategoryItems)
    const customPlace: CustomPlannerPlace = {
      id,
      sourcePlaceId: match.id,
      name: shortName(match.name),
      category,
      lat: match.lat,
      lng: match.lng,
      ...(match.spotGoogleMapsUrl || customDraft.googleUrl.trim()
        ? { googleUrl: match.spotGoogleMapsUrl || customDraft.googleUrl.trim() }
        : {}),
    }
    const customMapPlace = customPlaceToMapPlace(customPlace, match, customCategoryItems)
    setCustomPlaces((current) => ({ ...current, [id]: customPlace }))
    setCustomPlacePrimaryUserLink(id, customDraft.linkLabel, customDraft.linkUrl)
    addPlace(customMapPlace)
    setSelectedId(id)
    setCustomDraft(emptyCustomPlaceDraft)
    setCustomUrlResolving(false)
    setCustomOnly(true)
    setCategoryOn({ ...allCategoryOn, [category]: true })
    setMode('add')
    setMobilePanelOpen(true)
    scheduleFocusTargetCenter({ mode: 'add', placeId: id })
    trackPlannerEvent('use_matched_custom_place', {
      place_id: id,
      source_place_id: match.id,
      place_name: shortName(match.name),
      place_category: category,
      plan_count: validPlanIds.length,
    })
  }

  const cancelCustomPlaceDraft = () => {
    const returnMode = customDraftReturnMode
    const placeId = customDraft.id
    const returnItem = placeId && customDraftReturnItem && planItemPlaceId(customDraftReturnItem) === placeId ? customDraftReturnItem : null
    setCustomDraft(emptyCustomPlaceDraft)
    setCustomDraftReturnItem(null)
    setCustomUrlResolving(false)
    setMode(returnMode)
    if (placeId) setSelectedId(placeId)
    if (returnMode === 'order') {
      setSelectedPlanItem(returnItem ?? (placeId ? planItems.find((item) => planItemPlaceId(item) === placeId) ?? null : null))
      setMobilePanelOpen(true)
    } else {
      setSelectedPlanItem(null)
      setMobilePanelOpen(true)
    }
    if (placeId) scrollBackToCustomCard(placeId, returnMode, returnItem)
  }

  const confirmCustomPlaceName = () => {
    const currentDraft = customDraftRef.current
    const rawName = currentDraft.name.trim()
    const confirmedName = rawName || 'Google Maps 景點'
    const hasPosition = currentDraft.lat != null && currentDraft.lng != null
    setCustomDraft((draft) => ({
      ...draft,
      name: draft.name.trim() || 'Google Maps 景點',
      nameConfirmed: true,
      picking: true,
    }))
    setMobilePanelOpen(false)

    if (hasPosition || !rawName || !window.google?.maps) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: confirmedName }, (results, status) => {
      if (status !== 'OK' || !results?.[0]?.geometry?.location) return
      const location = results[0].geometry.location
      setCustomDraft((draft) => {
        if (!draft.id || !draft.nameConfirmed) return draft
        return {
          ...draft,
          lat: location.lat(),
          lng: location.lng(),
          picking: true,
        }
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnlyPlan) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    setPlanItems((items) => {
      const oldIndex = items.indexOf(String(active.id))
      const newIndex = items.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return items
      const targetIndex = mobileDragTargetIndex(oldIndex, newIndex, event.delta.y)
      const nextIds = arrayMove(items, oldIndex, targetIndex)
      const placeId = planItemPlaceId(String(active.id)) ?? String(active.id)
      const place = placeById.get(placeId)
      trackPlannerEvent('drag_sort', {
        place_id: placeId,
        place_name: place ? shortName(place.name) : '',
        place_category: place?.category,
        from_index: oldIndex + 1,
        to_index: targetIndex + 1,
        plan_count: nextIds.length,
        plan_code: encodeSharedPlan(nextIds, lookupPlaces),
      })
      return nextIds
    })
  }


  const buildShareUrl = useCallback(() => {
    const url = new URL(window.location.pathname, PUBLIC_SITE_ORIGIN)
    url.search = ''
    url.hash = ''
    Object.entries(config.shareSearchParams ?? {}).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
    if (validPlanIds.length > 0) {
      url.searchParams.set(SHARE_PARAM, encodeSharedPlan(validPlanItems, lookupPlaces))
    }
    return url
  }, [config.shareSearchParams, lookupPlaces, validPlanIds.length, validPlanItems])

  const saveAndSharePlan = useCallback(async () => {
    setShareSaving(true)
    const url = buildShareUrl()
    let shortShareId = ''
    let saveSucceeded = false
    const currentParams = new URLSearchParams(window.location.search)
    const urlPlannerBookId = currentParams.get(PLANNER_BOOK_PARAM)?.trim() ?? ''
    const storedPlannerBookId = window.localStorage.getItem(`${config.storageKey}:book-id`)?.trim() ?? ''
    const currentPlannerBookId = plannerBookId ?? (urlPlannerBookId || storedPlannerBookId || '')
    let savedPlannerBookId = currentPlannerBookId
    let savedReadToken = plannerBookReadToken

    try {
      if (validPlanIds.length > 0) {
        const sharedNotes = Object.fromEntries(
          validPlanIds.map((id) => [id, placeNotes[id]?.trim() ?? '']).filter(([, note]) => note),
        )
        const book = await savePlannerBook(
          config.plannerBookCityName ?? config.recentCountryName ?? config.shareTitle,
          currentPlannerBookId,
          validPlanItems,
          sharedNotes,
          customPlaces,
          placeUserLinks,
        ).catch(() => null)
        if (book) {
          saveSucceeded = true
          savedPlannerBookId = book.id
          savedReadToken = book.readToken ?? plannerBookReadToken
          const updatedAt = new Date().toISOString()
          setPlannerBookId(book.id)
          setPlannerBookReadToken(savedReadToken)
          setPlannerBookUpdatedAt(updatedAt)
          removeJsonCache(`planner-book:id=${encodeURIComponent(book.id)}`)
          if (savedReadToken) removeJsonCache(`planner-book:${PLANNER_PREVIEW_PARAM}=${encodeURIComponent(savedReadToken)}`)
          window.localStorage.setItem(`${config.storageKey}:book-id`, book.id)
          if (savedReadToken) window.localStorage.setItem(`${config.storageKey}:book-read-token`, savedReadToken)
          window.localStorage.setItem(`${config.storageKey}:book-updated-at`, updatedAt)
          if (config.recentListKey && config.recentRegionKey) {
            const rawRecent = window.localStorage.getItem(config.recentListKey)
            const recentItems = rawRecent ? (JSON.parse(rawRecent) as unknown) : []
            const existingItems = Array.isArray(recentItems)
              ? recentItems.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
              : []
            const nextRecent = [
              {
                id: book.id,
                readToken: savedReadToken ?? '',
                regionKey: config.recentRegionKey,
                source: config.recentSource ?? 'map',
                countryName: config.recentCountryName ?? config.shareTitle,
                updatedAt,
              },
              ...existingItems.filter((item) => item.id !== book.id),
            ].slice(0, 12)
            window.localStorage.setItem(config.recentListKey, JSON.stringify(nextRecent))
          }
          url.search = ''
          Object.entries(config.shareSearchParams ?? {}).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value)
          })
          url.searchParams.set(PLANNER_BOOK_PARAM, book.id)
        } else {
          shortShareId = ''
        }
      }
      if (validPlanIds.length > 0 && !saveSucceeded) {
        setSaveLinkCopied(false)
        setSavePreviewCopied(false)
        setSaveSheetUrl(null)
        setSaveSheetPreviewUrl(null)
        alert('保存失敗，請稍後再試一次')
        return
      }
      const shareUrl = url.toString()
      const sharePath = `${url.pathname}${url.search}`
      trackPlannerEvent('share', {
        plan_count: validPlanIds.length,
        plan_code: encodeSharedPlan(validPlanItems, lookupPlaces),
        first_place_id: planItemPlaceId(validPlanIds[0] ?? '') ?? '',
        share_path: sharePath,
        share_has_plan: validPlanIds.length > 0,
        planner_book_id: savedPlannerBookId,
        share_short_id: shortShareId,
      })

      if (config.saveReminderEnabled) {
        setSaveLinkCopied(false)
        setSavePreviewCopied(false)
        setSaveSheetUrl(shareUrl)
        if (savedReadToken) {
          const token = savedReadToken
          const previewUrl = token ? new URL(window.location.pathname, PUBLIC_SITE_ORIGIN) : null
          if (previewUrl) {
            Object.entries(config.shareSearchParams ?? {}).forEach(([key, value]) => {
              if (value) previewUrl.searchParams.set(key, value)
            })
            previewUrl.searchParams.set(PLANNER_PREVIEW_PARAM, token)
            setSaveSheetPreviewUrl(previewUrl.toString())
          } else {
            setSaveSheetPreviewUrl(null)
          }
        } else {
          setSaveSheetPreviewUrl(null)
        }
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
    } finally {
      setShareSaving(false)
    }
  }, [
    buildShareUrl,
    config.saveReminderEnabled,
    config.shareText,
    config.shareTitle,
    config.shareSearchParams,
    config.recentCountryName,
    config.recentListKey,
    config.recentRegionKey,
    config.recentSource,
    config.plannerBookCityName,
    config.storageKey,
    lookupPlaces,
    customPlaces,
    placeUserLinks,
    placeNotes,
    plannerBookId,
    plannerBookReadToken,
    trackPlannerEvent,
    validPlanIds,
    validPlanItems,
  ])

  const handleShare = useCallback(() => {
    if (readOnlyPlan) return
    if (shareSaving) return
    if (plannerBookId) {
      setUpdateShareConfirmOpen(true)
      return
    }
    void saveAndSharePlan()
  }, [plannerBookId, readOnlyPlan, saveAndSharePlan, shareSaving])

  const handleDownloadPdf = useCallback(async () => {
    if (pdfDownloading || plannedPlaces.length === 0) return
    setPdfDownloadStatus('loading')
    try {
      const days = plannedDays.map((day, dayIndex) => {
        const stops: Array<{
          order: number
          name: string
          category: string
          color: string
          note?: string
          links: Array<{ label: string; href: string }>
          transportAfter?: Array<{ label: string; note?: string; links: Array<{ label: string; href: string }> }>
        }> = []

        day.items.forEach((item) => {
          const transport = parseTransportItem(item)
          if (transport) {
            if (stops.length === 0) return
            const href = printLinkHref(transport.href)
            const transportAfter = stops[stops.length - 1].transportAfter ?? []
            stops[stops.length - 1].transportAfter = [
              ...transportAfter,
              {
                label: `${transportLabel(transport)}${transport.duration ? `・${transport.duration}` : ''}`,
                note: transport.note.trim() || undefined,
                links: href ? [{ label: '導航', href }] : [],
              },
            ]
            return
          }

          const place = planItemPlace(item, placeById)
          if (!place) return
          const pdfCategoryItems =
            isCustomPlaceId(place.id) && customCategoryItems.length > 0 ? customCategoryItems : plannerCategoryItems
          const naverUrl = naverMapUrl(place)
          const rawLinks = [
            { label: 'Google Maps', href: googleMapsPinUrl(place) },
            ...(naverUrl ? [{ label: 'Naver', href: naverUrl }] : []),
            ...plannerActionLinks(place).map((link) => ({ label: link.label, href: link.href })),
            ...(placeUserLinks[place.id] ?? []),
          ]
          const seenLinks = new Set<string>()
          const links = rawLinks
            .map((link) => ({ label: link.label.trim(), href: printLinkHref(link.href) }))
            .filter((link) => {
              if (!link.label || !link.href) return false
              const key = `${link.label}::${link.href}`
              if (seenLinks.has(key)) return false
              seenLinks.add(key)
              return true
            })

          stops.push({
            order: stops.length + 1,
            name: plannerPlaceName(place),
            category: plannerCategoryLabel(
              plannerPlaceCategory(place, pdfCategoryItems),
              categoryLabels,
              pdfCategoryItems,
            ),
            color: plannerPlaceColor(place, pdfCategoryItems),
            note: placeNotes[item]?.trim() || undefined,
            links,
          })
        })

        return {
          title: day.title,
          stops,
        }
      })
      const { downloadPlannerPdf } = await preloadPlannerPdf()
      setPdfDownloadStatus('rendering')
      await downloadPlannerPdf({
        title: printTravelTitle(config.shareTitle),
        updatedAt: plannerBookUpdatedAt ? formatPlannerUpdatedAt(plannerBookUpdatedAt) : undefined,
        days,
      })
      trackPlannerEvent('download_pdf', {
        day_count: days.length,
        plan_count: plannedPlaces.length,
      })
      setOpenPlannerMenu(null)
    } catch (error) {
      console.error(error)
      alert('PDF 產生失敗，請稍後再試一次')
    } finally {
      setPdfDownloadStatus('idle')
    }
  }, [
    categoryLabels,
    config.shareTitle,
    customCategoryItems,
    pdfDownloading,
    placeById,
    placeNotes,
    placeUserLinks,
    plannedDays,
    plannedPlaces.length,
    plannerBookUpdatedAt,
    plannerCategoryItems,
    preloadPlannerPdf,
    trackPlannerEvent,
  ])
  const confirmUpdateSharedPlan = useCallback(() => {
    if (shareSaving) return
    void (async () => {
      await saveAndSharePlan()
      setUpdateShareConfirmOpen(false)
    })()
  }, [saveAndSharePlan, shareSaving])

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
        setSaveSheetPreviewUrl(null)
        setSaveLinkCopied(false)
        setSavePreviewCopied(false)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(saveSheetUrl)
      setSaveLinkCopied(true)
      setSavePreviewCopied(false)
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }, [config.shareText, config.shareTitle, saveSheetUrl])

  const sharePreviewLink = useCallback(async () => {
    if (!saveSheetPreviewUrl) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.shareTitle,
          text: '只給朋友查看，不會出現編輯或儲存更新。',
          url: saveSheetPreviewUrl,
        })
        setSaveSheetUrl(null)
        setSaveSheetPreviewUrl(null)
        setSaveLinkCopied(false)
        setSavePreviewCopied(false)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(saveSheetPreviewUrl)
      setSaveLinkCopied(false)
      setSavePreviewCopied(true)
    } catch {
      alert('複製失敗，請手動複製連結')
    }
  }, [config.shareTitle, saveSheetPreviewUrl])

  const copySavedLink = useCallback(async () => {
    if (!saveSheetUrl) return
    try {
      await navigator.clipboard.writeText(saveSheetUrl)
      setSaveLinkCopied(true)
      setSavePreviewCopied(false)
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }, [saveSheetUrl])

  const copyPreviewLink = useCallback(async () => {
    if (!saveSheetPreviewUrl) return
    try {
      await navigator.clipboard.writeText(saveSheetPreviewUrl)
      setSaveLinkCopied(false)
      setSavePreviewCopied(true)
    } catch {
      alert('複製失敗，請手動複製連結')
    }
  }, [saveSheetPreviewUrl])

  const closeSaveSheet = useCallback(() => {
    setSaveSheetUrl(null)
    setSaveSheetPreviewUrl(null)
    setSaveLinkCopied(false)
    setSavePreviewCopied(false)
  }, [])

  const startMobilePanelDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      if (window.matchMedia('(min-width: 960px)').matches) return

      const target = e.target as HTMLElement
      if (target.closest('a') || target.closest('button') || target.closest(`.${styles.dragHandle}`)) return

      const panel = panelRef.current
      if (!panel) return

      const { collapsedPx, expandedPx, fullPx } = getMobilePanelMetrics()
      const startHeightPx = Math.round(panel.getBoundingClientRect().height)
      panelDragSessionRef.current = {
        pointerId: e.pointerId,
        startY: e.clientY,
        startHeightPx,
        collapsedPx,
        expandedPx,
        fullPx,
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
    const clampedHeight = Math.min(drag.fullPx, Math.max(drag.collapsedPx, nextHeight))
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
      const snapPoints = [
        { state: 'collapsed' as const, height: drag.collapsedPx },
        { state: 'half' as const, height: drag.expandedPx },
        { state: 'full' as const, height: drag.fullPx },
      ]
      const nearest = snapPoints.reduce((best, point) =>
        Math.abs(point.height - finalHeight) < Math.abs(best.height - finalHeight) ? point : best,
      )
      setMobilePanelState(nearest.state)
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

    const scrollList = target.closest('[data-planner-scroll-list="true"]') as HTMLElement | null
    panelBodyTouchStartYRef.current = e.touches[0].clientY
    panelBodyPullCanCollapseRef.current = Boolean(scrollList && scrollList.scrollTop <= 0)
  }, [mobilePanelOpen])

  const handlePanelBodyTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const startY = panelBodyTouchStartYRef.current
    if (!mobilePanelOpen || !panelBodyPullCanCollapseRef.current || startY == null || e.touches.length !== 1) return

    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 72) {
      e.preventDefault()
      panelBodyTouchStartYRef.current = null
      panelBodyPullCanCollapseRef.current = false
      setMobilePanelState((state) => (state === 'full' ? 'half' : 'collapsed'))
    }
  }, [mobilePanelOpen])

  const handlePanelBodyTouchEnd = useCallback(() => {
    panelBodyTouchStartYRef.current = null
    panelBodyPullCanCollapseRef.current = false
  }, [])

  const handlePanelControlTouchStart = useCallback((e: ReactTouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1 || !isMobilePlannerViewport()) return
    const target = e.target as HTMLElement
    if (!target.closest(`.${styles.panelChrome}, .${styles.panelTabs}, .${styles.filters}, .${styles.orderControlBar}`)) {
      panelControlTouchStartRef.current = null
      return
    }
    const touch = e.touches[0]
    panelControlTouchStartRef.current = { x: touch.clientX, y: touch.clientY, collapsed: false }
  }, [])

  const handlePanelControlTouchMove = useCallback((e: ReactTouchEvent<HTMLElement>) => {
    const start = panelControlTouchStartRef.current
    if (!start || start.collapsed || e.touches.length !== 1) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const verticalSwipe = Math.abs(deltaY) > 34 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2
    if (!verticalSwipe) return

    if (mobilePanelOpen && deltaY > 0) {
      if (e.cancelable) e.preventDefault()
      start.collapsed = true
      setOpenPlannerMenu(null)
      setMobilePanelState((state) => (state === 'full' ? 'half' : 'collapsed'))
      return
    }

    if (!mobilePanelOpen && deltaY < 0) {
      if (e.cancelable) e.preventDefault()
      start.collapsed = true
      setMobilePanelState('half')
      return
    }

    if (mobilePanelState === 'half' && deltaY < 0) {
      if (e.cancelable) e.preventDefault()
      start.collapsed = true
      setMobilePanelState('full')
    }
  }, [mobilePanelOpen, mobilePanelState])

  const handlePanelControlTouchEnd = useCallback(() => {
    panelControlTouchStartRef.current = null
  }, [])

  const panelControlSwipeProps = {
    onTouchStart: handlePanelControlTouchStart,
    onTouchMove: handlePanelControlTouchMove,
    onTouchEnd: handlePanelControlTouchEnd,
    onTouchCancel: handlePanelControlTouchEnd,
  }

  return (
    <>
      <CitySubpageHeader
        backHref={config.headerBackHref}
        eventPrefix={config.eventPrefix}
        forceBackReload={config.headerBackForceReload}
      />
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
            {readOnlyPlan || plannerBookUpdatedAt ? (
              <div className={styles.plannerMeta}>
                {readOnlyPlan ? <span>預覽模式</span> : null}
                {plannerBookUpdatedAt ? <span>最後更新 {formatPlannerUpdatedAt(plannerBookUpdatedAt)}</span> : null}
              </div>
            ) : null}
          </div>
          <div className={styles.topActions}>
            {!readOnlyPlan ? (
              <button className={styles.shareAction} type="button" onClick={handleShare} disabled={shareSaving}>
                {shareSaving ? '儲存中...' : plannerBookId ? '儲存更新' : config.shareActionLabel}
              </button>
            ) : null}
            {config.backLinkLabel ? (
              <a className={styles.secondaryAction} href={config.headerBackHref}>
                {config.backLinkLabel}
              </a>
            ) : null}
          </div>
        </section>

        {plannerLinkUnavailable ? (
          <section className={styles.unavailableState} aria-label="行程連結失效">
            <p>行程連結已失效</p>
            <h2>這個行程已刪除或連結不存在</h2>
            <span>請回到旅杰規劃重新建立排序，或使用最新儲存後產生的分享連結。</span>
            <div className={styles.unavailableActions}>
              <a href={config.headerBackHref}>回到旅杰規劃</a>
              <button type="button" onClick={() => window.history.back()}>
                回上一頁
              </button>
            </div>
          </section>
        ) : (
        <section className={styles.workspace} aria-label={config.workspaceAriaLabel}>
          <div className={styles.mapColumn}>
            <div className={styles.mapShell}>
              {mapError ? <div className={styles.mapFallback}>{mapError}</div> : <div ref={mapElRef} className={styles.mapCanvas} />}
              {mapMarkerLegendItems.length > 0 ? (
                <div className={styles.mapLegend} aria-label="地圖分類說明">
                  {mapMarkerLegendItems.map((item, index) => (
                    <Fragment key={item.key}>
                      {index > 0 && item.group !== mapMarkerLegendItems[index - 1]?.group ? (
                        <span className={styles.mapLegendBreak} aria-hidden="true" />
                      ) : null}
                      <span className={styles.mapLegendItem}>
                        <span
                          className={styles.mapLegendDot}
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        {item.label}
                      </span>
                    </Fragment>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside
            ref={panelRef}
            className={`${styles.panel} ${
              mobilePanelState === 'full'
                ? styles.panelFull
                : mobilePanelOpen
                  ? styles.panelOpen
                  : styles.panelCollapsed
            } ${
              mobilePanelDragging ? styles.panelDragging : ''
            }`}
            aria-label={config.panelAriaLabel}
            style={
              mobilePanelDragHeight != null
                ? ({ height: mobilePanelDragHeight, maxHeight: mobilePanelDragHeight } as CSSProperties)
                : undefined
            }
            onTouchStart={panelControlSwipeProps.onTouchStart}
            onTouchMove={panelControlSwipeProps.onTouchMove}
            onTouchEnd={panelControlSwipeProps.onTouchEnd}
            onTouchCancel={panelControlSwipeProps.onTouchCancel}
            onTransitionEnd={(event) => {
              if (event.currentTarget !== event.target) return
              if (event.propertyName !== 'height') return
              if (mobilePanelStateRef.current !== 'half') return
              flushPendingHalfPanelFocus('auto')
            }}
            onClick={() => {
              if (Date.now() < panelClickSuppressUntilRef.current) return
              setMobilePanelState((state) => (state === 'collapsed' ? 'half' : state))
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
                aria-label={mobilePanelState === 'full' ? '向下拖曳縮小面板' : mobilePanelOpen ? '拖曳調整面板高度' : '向上拖曳展開面板'}
                onPointerDown={startMobilePanelDrag}
                onPointerMove={moveMobilePanelDrag}
                onPointerUp={endMobilePanelDrag}
                onPointerCancel={endMobilePanelDrag}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setMobilePanelState((state) => (state === 'collapsed' ? 'half' : state === 'half' ? 'full' : 'collapsed'))
                  }
                }}
              />
              <span className={styles.panelHandleBar} aria-hidden />
            </div>
            <div className={styles.panelTabs} role="tablist" aria-label="景點操作">
              <button
                className={mode === 'add' ? styles.tabActive : styles.tab}
                type="button"
                onClick={() => scrollSelectedPlaceInMode('add')}
              >
                景點清單
              </button>
              <button
                className={mode === 'order' ? styles.tabActive : styles.tab}
                type="button"
                onClick={openOrderMode}
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
                {!customDraft.id ? (
                <div className={`${styles.filters} ${tierItems.length > 0 ? styles.filtersDense : ''}`}>
                  <div className={`${styles.filterTabs} tabs`} aria-label="分類篩選">
                    {plannerCategoryItems.map(({ key, label }) => (
                      <button
                        key={key}
                        className={`tab ${!customOnly && categoryOn[key] ? 'active' : ''}`}
                        type="button"
                        aria-pressed={categoryOn[key]}
                        data-area={key}
                        onClick={() => {
                          setCustomOnly(false)
                          setCategoryOn((prev) => {
                            if (customOnly || plannerCategoriesAllOn(prev, plannerCategoryItems)) return cityMapSoloCategory(key)
                            const next = { ...prev, [key]: !prev[key] }
                            return plannerCategoryItems.some((item) => next[item.key]) ? next : allCategoryOn
                          })
                          setTier('all')
                          setSelectedPlanItem(null)
                          setSelectedId(null)
                        }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      className={`tab ${customOnly ? 'active' : ''}`}
                      type="button"
                      aria-pressed={customOnly}
                      data-area="custom"
                      onClick={() => {
                        setCustomOnly(true)
                        setTier('all')
                        setSelectedPlanItem(null)
                        setSelectedId(null)
                      }}
                    >
                      自定
                    </button>
                  </div>
                  {tierItems.length > 0 ? (
                    <div className={`${styles.filterTabs} tabs`} aria-label="官方區域篩選">
                      {tierItems.map(({ key, label }) => (
                        <button
                          key={key}
                          className={`tab ${tier === key ? 'active' : ''}`}
                          type="button"
                          aria-pressed={tier === key}
                          data-area={`official-${key}`}
                        onClick={() => {
                          setCustomOnly(false)
                          setTier((prev) => (prev === key ? 'all' : key))
                          setSelectedPlanItem(null)
                          setSelectedId(null)
                        }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                ) : null}
                {!readOnlyPlan ? (
                <div className={`${styles.customPlacePanel} ${customDraft.id ? styles.customPlacePanelActive : ''}`}>
                  {customDraft.id ? (
                    <div className={styles.customPlaceForm} data-planner-scroll-list="true">
                      <div className={styles.customPlaceHeader}>
                        <strong>自訂{customDraftCategoryLabel}</strong>
                        <button type="button" onClick={cancelCustomPlaceDraft}>
                          取消
                        </button>
                      </div>
                      <div className={styles.customPlaceStep}>
                        <span>1</span>
                        <label>
                          貼上 Google Maps 連結
                          <input
                            value={customDraft.googleUrl}
                            onChange={(event) => updateCustomGoogleUrl(event.target.value)}
                            placeholder="貼上 Google Maps 分享連結"
                          />
                        </label>
                      </div>
                      {customDraft.googleUrl.trim() || customDraft.lat != null || customUrlResolving ? (
                        <div className={styles.customPlaceConfirm}>
                          <div className={styles.customPlaceStepTitle}>
                            <span>2</span>
                            {'\u78ba\u8a8d\u8cc7\u6599'}
                          </div>
                          <>
                            <label>
                              名稱
                              <input
                                value={customDraft.name}
                                onChange={(event) => setCustomDraft((draft) => ({ ...draft, name: event.target.value }))}
                                placeholder="可自己修改景點名稱"
                              />
                            </label>
                            <label>
                              分類
                              <select
                                value={customDraft.category}
                                onChange={(event) =>
                                  setCustomDraft((draft) => ({
                                    ...draft,
                                    category: event.target.value as CityMapPlaceCategory,
                                  }))
                                }
                              >
                                {customCategoryItems.map((item) => (
                                  <option key={item.key} value={item.key}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            {customPlaceMatches.length > 0 ? (
                              <div className={styles.customPlaceMatches}>
                                <span>清單裡可能已經有：</span>
                                {customPlaceMatches.map((match) => (
                                  <button
                                    key={match.id}
                                    type="button"
                                    onClick={() => handleMatchedPlaceAsCustom(match)}
                                  >
                                    使用「{shortName(match.name)}」
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </>
                            <>
                              <p className={styles.customPlaceStatus}>
                                {customDraft.lat != null && customDraft.lng != null
                                  ? '\u5df2\u5e36\u5165\u4f4d\u7f6e\uff0c\u8acb\u770b\u4e0a\u65b9\u5730\u5716\u78ba\u8a8d\u6a19\u8a18\u5f8c\u518d\u5132\u5b58\u3002'
                                  : customDraft.picking
                                    ? '\u9ede\u64ca\u5730\u5716\u8a2d\u5b9a\u4f4d\u7f6e\u3002'
                                    : '\u8acb\u5148\u9078\u64c7\u4f4d\u7f6e\u3002'}
                              </p>
                              {customDraft.lat == null || customDraft.lng == null ? (
                                <button
                                  type="button"
                                  className={styles.customPlaceAdjust}
                                  onClick={() => {
                                    setCustomDraft((draft) => ({ ...draft, picking: true, nameConfirmed: true }))
                                    setMobilePanelOpen(false)
                                  }}
                                >
                                  {'\u5230\u5730\u5716\u9078\u4f4d\u7f6e'}
                                </button>
                              ) : null}
                              {false ? (
                              <div className={styles.customPlaceOptional}>
                                <label>
                                  備註
                                  <textarea
                                    value={customDraft.note}
                                    maxLength={500}
                                    onChange={(event) => setCustomDraft((draft) => ({ ...draft, note: event.target.value }))}
                                    placeholder="可寫營業時間、想點的餐、訂房資訊"
                                  />
                                </label>
                                <div className={styles.customPlaceLinkGroup}>
                                  <div className={styles.customPlaceLinkFields}>
                                    <label>
                                      連結名稱
                                      <input
                                        value={customDraft.linkLabel}
                                        onChange={(event) =>
                                          setCustomDraft((draft) => ({ ...draft, linkLabel: event.target.value }))
                                        }
                                        placeholder="官網、訂房、菜單"
                                      />
                                    </label>
                                    <label>
                                      連結
                                      <input
                                        value={customDraft.linkUrl}
                                        onChange={(event) =>
                                          setCustomDraft((draft) => ({ ...draft, linkUrl: event.target.value }))
                                        }
                                        placeholder="https://..."
                                      />
                                    </label>
                                  </div>
                                  <button
                                    className={styles.customPlaceAddLink}
                                    type="button"
                                    onClick={addCustomDraftLink}
                                    disabled={!customDraft.linkLabel.trim() || !customDraft.linkUrl.trim()}
                                  >
                                    新增連結
                                  </button>
                                  {customDraftLinks.length > 0 ? (
                                    <div className={styles.customPlaceLinkList}>
                                      {customDraftLinks.map((link, index) => (
                                        <span key={`${link.label}-${link.href}-${index}`} className={styles.customPlaceLinkItem}>
                                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                                            {link.label}
                                          </a>
                                          <button
                                            type="button"
                                            aria-label={`刪除 ${link.label}`}
                                            onClick={() => customDraft.id && removePlaceUserLink(customDraft.id, index)}
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              ) : null}
                            </>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        className={styles.customPlaceSave}
                        onClick={saveCustomPlace}
                      >
                        {'\u5132\u5b58\u5230\u6e05\u55ae'}
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={styles.customPlaceOpen} onClick={startCustomPlaceDraft}>
                      + 自訂地點
                    </button>
                  )}
                </div>
                ) : null}
                {!customDraft.id ? (
                <div className={styles.addList} data-planner-scroll-list="true">
                  {filteredPlaces.map((place) => {
                    const addedCount = plannedPlaceCounts.get(place.id) ?? 0
                    const justAdded = recentlyAddedPlaceId === place.id
                    const displayAddedCount = addedCount || (justAdded ? 1 : 0)
                    const added = displayAddedCount > 0
                    const isCustomPlace = isCustomPlaceId(place.id)
                    return (
                      <article
                        key={place.id}
                        ref={(el) => {
                          addCardRefs.current[place.id] = el
                        }}
                        className={`${styles.addCard} ${isCustomPlace ? styles.addCardCustom : ''} ${selectedId === place.id ? styles.addCardActive : ''}`}
                        style={plannerPlaceStyle(place, plannerCategoryItems)}
                        onClick={(e) => {
                          const target = e.target as HTMLElement
                          if (target.closest('a') || target.closest('button')) return
                          focusPlace(place)
                        }}
                      >
                        <button className={styles.addCardMain} type="button" onClick={() => focusPlace(place)}>
                          <span className={styles.placeName}>{plannerPlaceName(place)}</span>
                          <span className={styles.placeMeta}>
                            {placeMeta(place, categoryLabels, tierLabels, plannerCategoryItems, customCategoryItems)}
                          </span>
                          <span className={styles.placeDesc}>{place.description}</span>
                        </button>
                        {isCustomPlace && !readOnlyPlan ? (
                          <span className={styles.addCardManage}>
                            <button
                              className={styles.editCustomButton}
                              type="button"
                              aria-label={`編輯 ${plannerPlaceName(place)}`}
                              onClick={() => editCustomPlace(place.id, 'add', null)}
                            >
                              ✎
                            </button>
                            <button
                              className={styles.deleteCustomButton}
                              type="button"
                              aria-label={`刪除 ${plannerPlaceName(place)}`}
                              onClick={() => requestDeleteCustomPlace(place.id)}
                            >
                              ×
                            </button>
                          </span>
                        ) : null}
                        <span className={styles.addCardControls}>
                          <span className={styles.inlineMapLinks}>
                            <PlannerInlineCardLinks place={place} />
                          </span>
                          {!readOnlyPlan ? (
                            <span className={styles.addCardActions}>
                              {added ? <span className={styles.addedButton}>已加入 {displayAddedCount}</span> : null}
                              <button className={styles.addButton} type="button" onClick={() => addPlace(place)}>
                                {added ? '再加入' : '加入'}
                              </button>
                            </span>
                          ) : null}
                        </span>
                      </article>
                    )
                  })}
                </div>
                ) : null}
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
                    <div className={styles.orderControlBar}>
                      <div className={styles.dayViewControl} aria-label="行程查看範圍">
                        {hasDayDividers ? (
                          <div className={styles.dayMenu} data-planner-menu="true">
                            <button
                              type="button"
                              className={openPlannerMenu === 'day' ? styles.menuButtonActive : styles.menuButton}
                              onClick={() => setOpenPlannerMenu((menu) => (menu === 'day' ? null : 'day'))}
                            >
                              {dayView === 'all' ? '全行程' : (plannedDays[dayView - 1]?.title ?? dayTitle(dayView))}
                            </button>
                            {openPlannerMenu === 'day' ? (
                            <div className={styles.dayMenuList}>
                              <button
                                type="button"
                                className={dayView === 'all' ? styles.dayMenuItemActive : styles.dayMenuItem}
                                onClick={() => {
                                  setDayView('all')
                                  setOpenPlannerMenu(null)
                                }}
                              >
                                全行程
                              </button>
                              {plannedDays.map((day, index) => (
                                <button
                                  key={day.divider ?? `day-${index + 1}`}
                                  type="button"
                                  className={dayView === index + 1 ? styles.dayMenuItemActive : styles.dayMenuItem}
                                  onClick={() => {
                                    setDayView(index + 1)
                                    setOpenPlannerMenu(null)
                                  }}
                                >
                                  {day.title}
                                </button>
                              ))}
                            </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className={styles.dayViewStatic}>全行程</span>
                        )}
                      </div>
                      <div className={styles.orderMenu} data-planner-menu="true">
                        <button
                          type="button"
                          className={openPlannerMenu === 'actions' ? styles.menuButtonActive : styles.menuButton}
                          onClick={() => setOpenPlannerMenu((menu) => (menu === 'actions' ? null : 'actions'))}
                        >
                          操作
                        </button>
                        {openPlannerMenu === 'actions' ? (
                        <div className={styles.orderTools}>
                          {!readOnlyPlan ? (
                            <>
                              <button type="button" onClick={addDayDivider} disabled={plannedPlaces.length === 0}>
                                + 天數
                              </button>
                              <button type="button" onClick={addTransportFromMenu} disabled={plannedPlaces.length === 0}>
                                + 交通
                              </button>
                            </>
                          ) : null}
                          <button type="button" onClick={handleDownloadPdf} disabled={plannedPlaces.length === 0 || pdfDownloading}>
                            {pdfDownloading ? <span className={styles.pdfSpinner} aria-hidden="true" /> : null}
                            <span className={styles.pdfButtonText} aria-live="polite">
                              {pdfDownloadStatus === 'loading'
                                ? '載入 PDF 工具...'
                                : pdfDownloadStatus === 'rendering'
                                  ? '正在產生 PDF...'
                                  : '下載 PDF'}
                              {pdfDownloading ? <small>首次可能需要 10-20 秒</small> : null}
                            </span>
                          </button>
                        </div>
                        ) : null}
                      </div>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={plannerCollisionDetection} onDragEnd={handleDragEnd}>
                      <SortableContext items={visiblePlanItems} strategy={verticalListSortingStrategy}>
                        <div
                          className={styles.planList}
                          data-planner-scroll-list="true"
                          onTouchMove={scheduleExpandedPlanItemCollapseIfNearlyOutside}
                          onWheel={scheduleExpandedPlanItemCollapseIfNearlyOutside}
                        >
                          {visiblePlanItems.map((item) => {
                            if (isDayItem(item)) {
                              const dayNumber =
                                validPlanItems.slice(0, validPlanItems.indexOf(item)).filter(isDayItem).length +
                                (isDayItem(validPlanItems[0] ?? '') ? 1 : 2)
                              return (
                                <SortableDayDivider
                                  key={item}
                                  id={item}
                                  dayNumber={dayNumber}
                                  title={dayItemTitle(item)}
                                  onTitleChange={(title) => updateDayDividerTitle(item, title)}
                                  onRemove={() => requestRemoveDayDivider(item)}
                                  readOnly={readOnlyPlan}
                                  dividerRef={(el) => {
                                    dayDividerRefs.current[item] = el
                                  }}
                                />
                              )
                            }

                            const transport = parseTransportItem(item)
                            if (transport) {
                              return (
                                <SortableTransportItem
                                  key={item}
                                  itemId={item}
                                  info={transport}
                                  expanded={expandedPlanItem === item}
                                  onToggleExpanded={() => {
                                    if (mobilePanelStateRef.current === 'full' && isMobilePlannerViewport()) {
                                      pendingHalfPanelFocusRef.current = { mode: 'transport', itemId: item }
                                      pendingHalfPanelFocusRetryRef.current = 0
                                      setMobilePanelState('half')
                                      return
                                    }
                                    setExpandedPlanItemWithScrollCompensation(expandedPlanItem === item ? null : item)
                                  }}
                                  onChange={(info) => updateTransportItem(item, info)}
                                  onRemove={() => requestRemoveTransport(item)}
                                  cardRef={(el) => {
                                    transportCardRefs.current[item] = el
                                  }}
                                  readOnly={readOnlyPlan}
                                />
                              )
                            }

                            const place = planItemPlace(item, placeById)
                            if (!place) return null
                            return (
                              <Fragment key={item}>
                                <SortablePlanItem
                                  itemId={item}
                                  place={place}
                                  label={planOrderLabels.get(item) ?? ''}
                                  note={placeNotes[item] ?? ''}
                                  expanded={expandedPlanItem === item}
                                  selected={selectedPlanItem ? selectedPlanItem === item : selectedId === place.id}
                                  onFocus={() => focusPlace(place, 'list', item)}
                                  onToggleExpanded={() => {
                                    if (mobilePanelStateRef.current === 'full' && isMobilePlannerViewport()) {
                                      return
                                    }
                                    setExpandedPlanItemWithScrollCompensation(expandedPlanItem === item ? null : item)
                                  }}
                                  onRemove={() => requestRemovePlace(item)}
                                  onEditCustom={isCustomPlaceId(place.id) ? () => editCustomPlace(place.id, 'order', item) : undefined}
                                  onNoteChange={(note) => updatePlaceNote(item, note)}
                                  userLinks={placeUserLinks[place.id] ?? []}
                                  onAddUserLink={(link) => addPlaceUserLink(place.id, link)}
                                  onRemoveUserLink={(index) => removePlaceUserLink(place.id, index)}
                                  cardRef={(el) => {
                                    planCardRefs.current[item] = el
                                  }}
                                  categoryLabels={categoryLabels}
                                  categoryItems={plannerCategoryItems}
                                  customCategoryItems={customCategoryItems}
                                  tierLabels={tierLabels}
                                  readOnly={readOnlyPlan}
                                />
                              </Fragment>
                            )
                          })}
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
        )}

        {pendingAddPlace ? (
          <div
            className={styles.confirmBackdrop}
            role="presentation"
            onClick={() => {
              setPendingAddPlace(null)
              setPendingAddPlaceNote('')
            }}
          >
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-place-day-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="add-place-day-title">加入哪一天？</h2>
              <p>{shortName(pendingAddPlace.name)}</p>
              <div className={styles.dayChoiceList}>
                {Array.from({ length: planDayCount }, (_, index) => {
                  const dayNumber = index + 1
                  return (
                    <button
                      key={dayNumber}
                      type="button"
                      className={styles.dayChoiceButton}
                      onClick={() => confirmAddPlaceToDay(dayNumber)}
                    >
                      {plannedDays[index]?.title ?? dayTitle(dayNumber)}
                    </button>
                  )
                })}
              </div>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.confirmSecondary}
                  onClick={() => {
                    setPendingAddPlace(null)
                    setPendingAddPlaceNote('')
                  }}
                >
                  取消
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {pendingDelete ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingDelete(null)}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-place-confirm-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="delete-place-confirm-title">
                {pendingDelete.type === 'custom'
                  ? '刪除自訂景點？'
                  : pendingDelete.type === 'day'
                    ? '刪除這個天數？'
                    : pendingDelete.type === 'transport'
                      ? '刪除這段已儲存的交通？'
                      : '從我的順序移除？'}
              </h2>
              <p>
                {pendingDelete.type === 'custom'
                  ? '這會從景點清單刪除，也會一起從我的順序移除。'
                  : pendingDelete.type === 'day'
                    ? '這會移除我的排序中的天數分隔線，景點會保留在原本順序中。'
                    : pendingDelete.type === 'transport'
                      ? '這會移除這段手動填寫的交通資訊。'
                  : '這只會從我的順序移除，景點清單仍然會保留。'}
              </p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmSecondary} onClick={() => setPendingDelete(null)}>
                  取消
                </button>
                <button type="button" className={styles.confirmDanger} onClick={confirmPendingDelete}>
                  確認刪除
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {customPlaceSaveError ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={() => setCustomPlaceSaveError(null)}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="custom-place-save-error-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="custom-place-save-error-title">
                {customPlaceSaveError === 'name' ? '先確認景點名稱' : '先確認地圖位置'}
              </h2>
              <p>
                {customPlaceSaveError === 'name'
                  ? '這條 Google Maps 連結只解析到地址，請補上景點、餐廳或住宿名稱後再儲存。'
                  : '請先看上方地圖確認標記位置，或點地圖設定位置後再儲存。'}
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.confirmPrimary}
                  onClick={() => {
                    const errorType = customPlaceSaveError
                    setCustomPlaceSaveError(null)
                    if (errorType === 'location') {
                      setCustomDraft((draft) => ({ ...draft, picking: true, nameConfirmed: true }))
                      setMobilePanelOpen(false)
                    }
                  }}
                >
                  {customPlaceSaveError === 'name' ? '回去填名稱' : '到地圖確認'}
                </button>
                <button type="button" className={styles.confirmSecondary} onClick={() => setCustomPlaceSaveError(null)}>
                  先取消
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {updateShareConfirmOpen ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={() => setUpdateShareConfirmOpen(false)}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="shared-plan-update-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="shared-plan-update-title">更新共享行程？</h2>
              <p>這會覆蓋這份共享行程，拿到同一條連結的人重新打開後都會看到新版。</p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmSecondary} onClick={() => setUpdateShareConfirmOpen(false)}>
                  取消
                </button>
                <button type="button" className={styles.confirmPrimary} onClick={confirmUpdateSharedPlan} disabled={shareSaving}>
                  {shareSaving ? '儲存中...' : '儲存更新'}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {inAppPromptOpen && inAppBrowser ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={dismissInAppPrompt}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="in-app-browser-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="in-app-browser-title">建議用 {preferredBrowserName()} 開啟</h2>
              <p>
                你現在在 {inAppBrowserName(inAppBrowser)} 內建瀏覽器。排好的行程會先存在這裡，但 App 關掉後比較容易被清掉。
              </p>
              <p>複製連結到 {preferredBrowserName()} 開啟，行程比較不容易消失。</p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmPrimary} onClick={copyInAppPromptLink}>
                  {inAppPromptCopied ? '已複製' : '複製連結'}
                </button>
                <button type="button" className={styles.confirmSecondary} onClick={dismissInAppPrompt}>
                  我先繼續
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {saveSheetUrl ? (
          <div className={styles.saveBackdrop} role="presentation" onClick={closeSaveSheet}>
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
                onClick={closeSaveSheet}
              >
                ×
              </button>
              <h2 id="save-plan-title">{plannerBookId ? '共享行程已更新' : '保存這個排序'}</h2>
              <p>
                {plannerBookId
                  ? '已保存更新。用同一條連結打開，就會看到最新版。'
                  : '要跨手機/電腦使用，請保存這條連結。'}
              </p>
              {inAppBrowser ? (
                <p className={styles.saveHint}>
                  建議複製到 {preferredBrowserName()} 開啟，或傳到 LINE / 備忘錄保存。
                </p>
              ) : (
                <p className={styles.saveHint}>電腦排完也可以傳到手機，出發時直接打開。</p>
              )}
              <div className={styles.saveLinkGroup}>
                <div className={styles.saveLinkHeader}>
                  <span>行程連結</span>
                </div>
                <div className={styles.saveUrlRow}>
                  <div className={styles.saveUrl}>{saveSheetUrl}</div>
                  <button type="button" className={styles.saveCopyButton} onClick={copySavedLink}>
                    {saveLinkCopied ? '已複製' : '複製'}
                  </button>
                </div>
              </div>
              {saveSheetPreviewUrl ? (
                <div className={styles.saveLinkGroup}>
                  <div className={styles.saveLinkHeader}>
                    <span>預覽連結</span>
                  </div>
                  <p className={styles.saveHint}>只給朋友查看，不會出現編輯、拖曳或儲存更新。</p>
                  <div className={styles.saveUrlRow}>
                    <div className={styles.saveUrl}>{saveSheetPreviewUrl}</div>
                    <button type="button" className={styles.saveCopyButton} onClick={copyPreviewLink}>
                      {savePreviewCopied ? '已複製' : '複製'}
                    </button>
                  </div>
                </div>
              ) : null}
              <div className={styles.saveActions}>
                <button type="button" className={styles.confirmPrimary} onClick={shareSavedLink}>
                  分享連結
                </button>
                {saveSheetPreviewUrl ? (
                  <button type="button" className={styles.confirmSecondary} onClick={sharePreviewLink}>
                    分享預覽連結
                  </button>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </>
  )
}
