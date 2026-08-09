'use client'
/// <reference types="google.maps" />

import {
  Fragment,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
  type UIEvent as ReactUIEvent,
  type WheelEvent as ReactWheelEvent,
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
import {
  buildPlannerHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
} from '@/lib/hotelAffiliateIdentity'
import { hotelAffiliateGooglePlaceTypeSignal, hotelAffiliatePlaceNameSignal } from '@/lib/hotelAffiliatePlaceSignals'
import { clearSmartMapLabels, syncSmartMapLabels, type SmartMapLabelOverlay } from '@/lib/mapSmartLabels'
import type { MapPlace } from '@/lib/mapPlace'
import styles from './passPlanner.module.css'

type PlannerMode = 'add' | 'order'
type TierFilter = NonNullable<MapPlace['officialPassTier']> | 'all'
type FocusSource = 'marker' | 'list'
type InAppBrowser = 'instagram' | 'line' | 'messenger' | 'facebook' | null
type MobilePanelState = 'collapsed' | 'half' | 'full'
type PlannerItem = string
type PlannerFocusTarget =
  | { mode: 'add'; placeId: string }
  | { mode: 'order'; placeId: string; itemId: PlannerItem | null }
  | { mode: 'transport'; itemId: PlannerItem }
type TransportMode = 'walk' | 'subway' | 'bus' | 'train' | 'taxi' | 'car' | 'custom'
type TransportInfo = { id: string; mode: TransportMode; customLabel: string; duration: string; note: string; href: string }
type PlannerListDisplayItem =
  | { type: 'item'; item: PlannerItem }
  | { type: 'transport-group'; key: string; items: PlannerItem[] }
type TransportNavigationPlaces = { from: MapPlace; to: MapPlace }
type TransportNavigationPlaceIds = {
  fromGooglePlaceId?: string
  toGooglePlaceId?: string
  fromNaverPlaceId?: string
  toNaverPlaceId?: string
}
type ResolvedTransportNavigationIds = TransportNavigationPlaceIds & { key: string }
type DayView = 'all' | number
type PdfDownloadStatus = 'idle' | 'loading' | 'rendering'
type CustomPlannerLink = { label: string; href: string }
type PlannerUserLink = CustomPlannerLink
type PlannerCardImage = {
  id: string
  placeId: string
  url: string
  width: number
  height: number
  createdAt: string
}
type PreDepartureResourceId = 'hotel' | 'ticket' | 'esim' | 'shopping' | 'car-rental'
type PreDepartureItemScope = 'shared' | 'personal'
type PreDepartureTraveler = { id: string; name: string }
type PreDepartureChecklistItem = {
  id: string
  label: string
  custom?: boolean
  categoryId?: string
  resourceId?: PreDepartureResourceId
  scope?: PreDepartureItemScope
  travelerIds?: string[]
}
type PreDepartureChecklistCategory = { id: string; label: string; items: PreDepartureChecklistItem[] }
type PreDepartureResourceLink = {
  label: string
  href: string
  event: string
  platform: string
  promoCode?: string
}
type PreDepartureResource = {
  toggleLabel: string
  links: PreDepartureResourceLink[]
}
type PreDepartureChecklistStorage = {
  version: 2
  travelers: PreDepartureTraveler[]
  checked: Record<string, Record<string, true>>
  notes: Record<string, string>
  customItems: PreDepartureChecklistItem[]
  removedItemIds: Record<string, true>
  hiddenCategoryIds: Record<string, true>
}
type PreDepartureUndoAction = { type: 'item' | 'category'; id: string; label: string }
type PreDepartureTransferStatus = 'idle' | 'copied' | 'imported' | 'failed'
type PreDepartureCloudStatus = 'local' | 'saving' | 'saved' | 'error'
const PRE_DEPARTURE_OWNER: PreDepartureTraveler = { id: 'traveler-owner', name: '我' }
type HotelAffiliateProvider = 'Agoda' | 'Trip'
type HotelAffiliateStatus = 'searching' | 'matched' | 'none' | 'error' | 'not_configured' | 'needs_city_id' | 'skipped'
type HotelAffiliateCooldownStatus = Extract<
  HotelAffiliateStatus,
  'none' | 'error' | 'not_configured' | 'needs_city_id'
>
type PlannerCountryCode = 'JP' | 'KR' | 'VN' | 'TW' | ''
type HotelAffiliateEligibility = 'eligible' | 'pending_place_type' | 'skipped'
type HotelAffiliateNameSignal = 'lodging' | 'non_lodging' | 'unknown'
type GooglePlaceDetailsLocale = 'en' | 'zh-TW'
type GooglePlaceDetailsData = {
  name?: string
  formattedAddress?: string
  lat?: number
  lng?: number
  types?: string[]
  googleMapsUrl?: string
  website?: string
}
type GooglePlaceIdentityData = {
  googlePlaceId: string
  name?: string
  lat: number
  lng: number
  types: string[]
  exactMapsDataId?: boolean
}
type HotelAffiliatePlannerResponse = {
  matchStatus?: string
  bestMatch?: {
    hotelId?: unknown
    hotelName?: unknown
    bookingUrl?: unknown
    score?: unknown
  }
}
type ActiveHotelAffiliateLookup = {
  cacheKey: string
  controller: AbortController
}
type NearbyKnownPlacesSuggestion = {
  key: string
  label: string
  places: MapPlace[]
}

const plannerCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args)
}

const mobileDragTargetIndex = (fromIndex: number, toIndex: number, deltaY: number) => {
  if (!isMobilePlannerViewport() || Math.abs(toIndex - fromIndex) <= 1) return toIndex
  const dragDirection = Math.sign(toIndex - fromIndex)
  const maxSteps = Math.max(1, Math.ceil(Math.abs(deltaY) / 56))
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
  googlePlaceId?: string
  googlePlaceName?: string
  googlePlaceLat?: number
  googlePlaceLng?: number
  googlePlaceTypes?: string[]
  googlePlaceTypesResolved?: boolean
  naverUrl?: string
  naverPlaceId?: string
  naverPlaceName?: string
  hotelAffiliateManual?: boolean
  links?: CustomPlannerLink[]
}
type CustomPlaceDraft = {
  id: string | null
  name: string
  googleUrl: string
  googlePlaceId: string
  googlePlaceName: string
  googlePlaceLat: number | null
  googlePlaceLng: number | null
  googlePlaceTypes: string[]
  googlePlaceTypesResolved: boolean
  naverUrl: string
  naverPlaceId: string
  naverPlaceName: string
  linkLabel: string
  linkUrl: string
  note: string
  category: CityMapPlaceCategory
  lat: number | null
  lng: number | null
  picking: boolean
  nameConfirmed: boolean
}
type KnownPlaceMatchInput = {
  name: string
  googleUrl?: string
  googlePlaceId?: string
  googlePlaceName?: string
  lat: number | null
  lng: number | null
}

type Props = {
  places: MapPlace[]
  mapCenter: { lat: number; lng: number }
  config?: Partial<PlannerConfig>
}

const LOCATION_RECENTER_MIN_DISTANCE_METERS = 2
const LOCATION_FOLLOW_ZOOM = 16
const LOCATION_HEADING_UP_ZOOM = 18
const DEVICE_HEADING_STALE_MS = 5000
const LOCATION_CAMERA_ANIMATION_MS = 220
const LOCATION_CAMERA_GUARD_MS = 1000
const LOCATION_HEADING_CAMERA_GUARD_MS = 1200

type LocationFollowMode = 'idle' | 'follow' | 'heading'
type LocateButtonMode = 'idle' | 'located' | 'requesting' | 'following' | 'heading' | 'paused-follow' | 'paused-heading'
type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number
}
type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
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
  guideLink?: { label: string; href: string; event?: string }
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
  agodaCityId?: number
}

const SCRIPT_ID = 'gmaps-js'
const SHARE_PARAM = 'plan'
const SHARE_ID_PARAM = 's'
const PLANNER_BOOK_PARAM = 'p'
const PLANNER_PREVIEW_PARAM = 'v'
const PLANNER_IMAGE_OWNER_KEY = 'planner-image-owner'
const PLANNER_IMAGE_OWNER_PARAM = 'i'
const PLANNER_IMAGE_MAX_PER_BOOK = 24
const PLANNER_IMAGE_MAX_PER_PLACE = 3
const PLANNER_IMAGE_MAX_BYTES = 1_048_576
const PLANNER_IMAGE_SOURCE_MAX_BYTES = 10 * 1024 * 1024
const PUBLIC_SITE_ORIGIN = 'https://www.jiejourneys.com'
const PLANNER_BOOK_CACHE_TTL_MS = 10 * 60 * 1000
// v4 drops the old permanent "not found" result.  A short Google Maps link
// often has a feature ID (`g/...`) rather than a reusable `ChIJ...` Place ID,
// so an intermittent lookup failure must be retried instead of cached forever.
const RESOLVED_MAP_URL_CACHE_PREFIX = 'jiejourneys:planner:resolved-map-url:v4:'
const HOTEL_AFFILIATE_LOOKUP_CACHE_PREFIX = 'jiejourneys:planner:hotel-affiliate-lookup:'
const CUSTOM_MAP_URL_RESOLVE_TIMEOUT_MS = 25_000
// Agoda now resolves against the local catalogue and browser Places API (New).
// v19 also retries results made before multilingual aliases and named-match
// dominance could distinguish hotels sharing one building.
const HOTEL_AFFILIATE_LOOKUP_CACHE_VERSION = 'v19'
const GOOGLE_PLACE_TYPES_CACHE_PREFIX = 'jiejourneys:planner:google-place-types:'
// v6 discards place-name entries created before Maps data-ID resolution. Those
// old values can be incomplete URL labels and must not suppress the canonical
// English Maps name for up to the old 90-day TTL.
const GOOGLE_PLACE_DETAILS_CACHE_PREFIX = 'jiejourneys:planner:google-place-details:v6:'
const GOOGLE_PLACE_DETAILS_CACHE_TTL_MS = 90 * 24 * 60 * 60 * 1000
const GOOGLE_PLACE_DETAILS_ERROR_COOLDOWN_MS = 6 * 60 * 60 * 1000
const GOOGLE_PLACE_ID_ERROR_COOLDOWN_MS = 6 * 60 * 60 * 1000
const HOTEL_AFFILIATE_HIT_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000
const AGODA_AFFILIATE_NO_MATCH_COOLDOWN_MS = 24 * 60 * 60 * 1000
const AGODA_AFFILIATE_REVIEW_COOLDOWN_MS = 60 * 60 * 1000
const TRIP_AFFILIATE_NO_MATCH_COOLDOWN_MS = 30 * 60 * 1000
const TRIP_AFFILIATE_REVIEW_COOLDOWN_MS = 15 * 60 * 1000
const HOTEL_AFFILIATE_TRANSIENT_ERROR_COOLDOWN_MS = 5 * 60 * 1000
const HOTEL_AFFILIATE_NOT_CONFIGURED_COOLDOWN_MS = 6 * 60 * 60 * 1000
const NEARBY_KNOWN_PLACE_RADIUS_METERS = 25_000
const DAY_ITEM_PREFIX = 'day:'
const VISIT_ITEM_PREFIX = 'visit:'
const CUSTOM_PLACE_PREFIX = 'custom:'
const TRANSPORT_ITEM_PREFIX = 'transport:'
const NAVER_COORD_PRECISION = 10_000_000
const NAVER_COORD_OFFSET = 200 * NAVER_COORD_PRECISION
const NAVER_COORD_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NAVER_MAP_APP_NAME = 'www.jiejourneys.com'
const TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS = 250
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
  googlePlaceId: '',
  googlePlaceName: '',
  googlePlaceLat: null,
  googlePlaceLng: null,
  googlePlaceTypes: [],
  googlePlaceTypesResolved: false,
  naverUrl: '',
  naverPlaceId: '',
  naverPlaceName: '',
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

const destinationGeoHints: Array<{
  countryCode: Exclude<PlannerCountryCode, ''>
  city: string
  cityId?: number
  patterns: RegExp[]
  lat: number
  lng: number
  radiusKm: number
}> = [
  { cityId: 17172, countryCode: 'KR', city: 'Busan', patterns: [/busan|釜山/], lat: 35.1796, lng: 129.0756, radiusKm: 120 },
  { cityId: 14690, countryCode: 'KR', city: 'Seoul', patterns: [/seoul|首爾|首尔/], lat: 37.5665, lng: 126.978, radiusKm: 140 },
  { countryCode: 'KR', city: 'Jeju', patterns: [/jeju|濟州|济州/], lat: 33.4996, lng: 126.5312, radiusKm: 90 },
  { cityId: 5085, countryCode: 'JP', city: 'Tokyo', patterns: [/tokyo|東京|东京/], lat: 35.6762, lng: 139.6503, radiusKm: 180 },
  { cityId: 9590, countryCode: 'JP', city: 'Osaka', patterns: [/osaka|大阪|kansai|關西|関西|京阪/], lat: 34.6937, lng: 135.5023, radiusKm: 130 },
  { cityId: 247771, countryCode: 'JP', city: 'Fujikawaguchiko', patterns: [/fuji|河口湖|fujikawaguchiko|kawaguchiko/], lat: 35.5013, lng: 138.7649, radiusKm: 90 },
  { cityId: 1784, countryCode: 'JP', city: 'Kyoto', patterns: [/kyoto|京都/], lat: 35.0116, lng: 135.7681, radiusKm: 80 },
  { cityId: 13313, countryCode: 'JP', city: 'Nara', patterns: [/nara|奈良/], lat: 34.6851, lng: 135.8048, radiusKm: 70 },
  { cityId: 5235, countryCode: 'JP', city: 'Kobe', patterns: [/kobe|神戶|神戸/], lat: 34.6901, lng: 135.1955, radiusKm: 70 },
  { cityId: 16527, countryCode: 'JP', city: 'Fukuoka', patterns: [/fukuoka|福岡|福冈/], lat: 33.5902, lng: 130.4017, radiusKm: 130 },
  { cityId: 717899, countryCode: 'JP', city: 'Okinawa Main island', patterns: [/okinawa|naha|沖繩|冲绳|沖縄|那霸|那覇/], lat: 26.2124, lng: 127.6809, radiusKm: 180 },
  { countryCode: 'JP', city: 'Kumamoto', patterns: [/kumamoto|熊本/], lat: 32.8031, lng: 130.7079, radiusKm: 90 },
  { cityId: 2758, countryCode: 'VN', city: 'Hanoi', patterns: [/northvietnam|vietnam|hanoi|河內|河内|北越/], lat: 21.0278, lng: 105.8342, radiusKm: 160 },
  { cityId: 17160, countryCode: 'VN', city: 'Sapa', patterns: [/sapa|sa pa|沙壩|沙巴/], lat: 22.3364, lng: 103.8438, radiusKm: 90 },
  { cityId: 17245, countryCode: 'VN', city: 'Ninh Binh', patterns: [/ninh binh|ninh bình|寧平|宁平/], lat: 20.2506, lng: 105.9745, radiusKm: 90 },
  { cityId: 17182, countryCode: 'VN', city: 'Ha Long', patterns: [/ha long|hạ long|halong|下龍|下龙/], lat: 20.9712, lng: 107.0448, radiusKm: 90 },
]

function coordinateCountryCode(latitude?: number, longitude?: number): PlannerCountryCode {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return ''
  const lat = latitude as number
  const lng = longitude as number
  const nearest = destinationGeoHints
    .map((hint) => ({
      ...hint,
      distanceKm: distanceMeters({ lat, lng }, { lat: hint.lat, lng: hint.lng }) / 1000,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0]
  if (nearest && nearest.distanceKm <= nearest.radiusKm) return nearest.countryCode

  const inJapan = lat >= 24 && lat <= 46 && lng >= 122 && lng <= 146
  const inKorea = lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132
  const inVietnam = lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110
  const inTaiwan = lat >= 21.5 && lat <= 25.5 && lng >= 119 && lng <= 123
  if (inVietnam) return 'VN'
  if (inTaiwan) return 'TW'
  if (inJapan && inKorea) return nearest?.countryCode ?? ''
  if (inJapan) return 'JP'
  if (inKorea) return 'KR'
  return ''
}

function nearestDestinationHint(latitude?: number, longitude?: number, countryCode: PlannerCountryCode = '') {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  const lat = latitude as number
  const lng = longitude as number
  return destinationGeoHints
    .filter((hint) => !countryCode || hint.countryCode === countryCode)
    .map((hint) => ({
      ...hint,
      distanceKm: distanceMeters({ lat, lng }, { lat: hint.lat, lng: hint.lng }) / 1000,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null
}

function plannerAffiliateCountryCode(config: PlannerConfig, latitude?: number, longitude?: number): PlannerCountryCode {
  const coordinateCountry = coordinateCountryCode(latitude, longitude)
  if (coordinateCountry) return coordinateCountry

  const text = [
    config.storageKey,
    config.eventPrefix,
    config.shareSearchParams?.region,
    config.initialSearchParams?.region,
    config.recentRegionKey,
    config.recentCountryName,
    config.plannerBookCityName,
    config.shareTitle,
    config.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (/northvietnam|vietnam|越南|河內|河内/.test(text)) return 'VN'
  if (/kinmen|taiwan|臺灣|台灣|金門/.test(text)) return 'TW'
  if (/busan|korea|韓國|韩国|釜山|首爾|首尔/.test(text)) return 'KR'
  if (/osaka|tokyo|fuji|fukuoka|okinawa|naha|japan|日本|大阪|東京|东京|富士|河口湖|福岡|福冈|沖繩|冲绳|沖縄|那霸|那覇/.test(text)) return 'JP'
  return ''
}

function plannerAffiliateCityName(config: PlannerConfig, latitude?: number, longitude?: number) {
  const countryCode = plannerAffiliateCountryCode(config, latitude, longitude)
  const nearest = nearestDestinationHint(latitude, longitude, countryCode)
  if (nearest && nearest.distanceKm <= nearest.radiusKm) return nearest.city
  return config.plannerBookCityName ?? config.recentCountryName ?? config.shareTitle
}

function plannerAgodaCityId(config: PlannerConfig, latitude?: number, longitude?: number) {
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude)
  const coordinateCountry = coordinateCountryCode(latitude, longitude)
  const coordinateMatch = nearestDestinationHint(latitude, longitude, coordinateCountry)
  if (coordinateMatch && coordinateMatch.distanceKm <= coordinateMatch.radiusKm) return coordinateMatch.cityId
  if (hasCoordinates) return undefined

  const configuredCityId = config.agodaCityId
  if (typeof configuredCityId === 'number' && Number.isInteger(configuredCityId) && configuredCityId > 0) return configuredCityId

  const text = [
    config.storageKey,
    config.eventPrefix,
    config.shareSearchParams?.region,
    config.initialSearchParams?.region,
    config.recentRegionKey,
    config.recentCountryName,
    config.plannerBookCityName,
    config.shareTitle,
    config.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  const countryCode = plannerAffiliateCountryCode(config, latitude, longitude)
  const textMatch = destinationGeoHints.find(
    (hint) => hint.cityId && hint.patterns.some((pattern) => pattern.test(text)),
  )
  if (textMatch?.cityId) return textMatch.cityId
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return undefined

  const nearest = destinationGeoHints
    .filter((hint) => hint.cityId && (!countryCode || hint.countryCode === countryCode))
    .map((hint) => ({
      ...hint,
      distanceKm: distanceMeters({ lat: latitude as number, lng: longitude as number }, { lat: hint.lat, lng: hint.lng }) / 1000,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0]

  return nearest && nearest.distanceKm <= nearest.radiusKm ? nearest.cityId : undefined
}

function isHotelAffiliateProviderUrl(value: unknown, provider: HotelAffiliateProvider) {
  if (typeof value !== 'string') return false
  try {
    const parsed = new URL(value.trim())
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
    const providerHost = provider === 'Agoda' ? 'agoda.com' : 'trip.com'
    return hostname === providerHost || hostname.endsWith(`.${providerHost}`)
  } catch {
    return false
  }
}

function cleanHotelAffiliateBookingUrl(value: unknown, provider: HotelAffiliateProvider) {
  if (typeof value !== 'string') return ''
  const bookingUrl = value.trim()
  if (
    !bookingUrl ||
    bookingUrl.length > 500 ||
    !bookingUrl.toLowerCase().startsWith('https://') ||
    !isHotelAffiliateProviderUrl(bookingUrl, provider)
  ) {
    return ''
  }
  return bookingUrl
}

function hotelAffiliateProviderForLink(link: CustomPlannerLink) {
  const label = link.label.trim().toLowerCase()
  if (label === 'agoda' || isHotelAffiliateProviderUrl(link.href, 'Agoda')) return 'Agoda'
  if (label === 'trip' || isHotelAffiliateProviderUrl(link.href, 'Trip')) return 'Trip'
  return null
}

function mergeCustomPlannerLinks(
  links: CustomPlannerLink[] | undefined,
  link: CustomPlannerLink,
  options: { replaceProvider?: boolean } = {},
) {
  const cleanLink = {
    label: link.label.trim().slice(0, 40),
    href: link.href.trim().slice(0, 500),
  }
  if (!cleanLink.label || !cleanLink.href) return links ?? []
  const providerKey = cleanLink.label.toLowerCase()
  const provider = providerKey === 'agoda' ? 'Agoda' : providerKey === 'trip' ? 'Trip' : null
  const providerLinks = (links ?? []).filter((item) => {
    if (!provider) return false
    const itemLabel = item.label.trim().toLowerCase()
    return itemLabel === providerKey || isHotelAffiliateProviderUrl(item.href, provider)
  })
  if (provider) {
    if (providerLinks.length > 0 && !options.replaceProvider) return links ?? []
  }

  const seen = new Set<string>()
  const merged = [...(options.replaceProvider ? (links ?? []).filter((item) => !providerLinks.includes(item)) : (links ?? [])), cleanLink]
    .map((item) => ({ label: item.label.trim().slice(0, 40), href: item.href.trim().slice(0, 500) }))
    .filter((item) => {
      if (!item.label || !item.href) return false
      const urlKey = item.href.toLowerCase()
      const fullKey = `${item.label.toLowerCase()}::${urlKey}`
      if (seen.has(urlKey) || seen.has(fullKey)) return false
      seen.add(urlKey)
      seen.add(fullKey)
      return true
    })
    .slice(0, 8)
  return merged
}

function hasHotelAffiliateProviderLink(links: CustomPlannerLink[] | undefined, provider: HotelAffiliateProvider) {
  const providerKey = provider.toLowerCase()
  return (links ?? []).some((link) => {
    const label = link.label.trim().toLowerCase()
    return label === providerKey || isHotelAffiliateProviderUrl(link.href, provider)
  })
}

function customPlaceHotelAffiliateSearchNameSources(
  place: Pick<
    CustomPlannerPlace,
    'googlePlaceId' | 'googlePlaceName' | 'googlePlaceLat' | 'googlePlaceLng' | 'name' | 'lat' | 'lng'
  >,
) {
  const googlePlaceId = place.googlePlaceId?.trim() ?? ''
  const englishDetails = getCachedGooglePlaceDetails(googlePlaceId, 'en')
  const chineseDetails = getCachedGooglePlaceDetails(googlePlaceId, 'zh-TW')
  const googlePlaceName = englishDetails?.name?.trim() || place.googlePlaceName?.trim() || ''
  // If the English Details lookup failed and the Maps label is still a
  // translated/non-English string, do not mislabel it as an English result.
  // The official zh-TW result and user-entered name remain valid fallbacks.
  const mapsName =
    !englishDetails && googlePlaceDetailsCoolingDown(googlePlaceId, 'en') && /[^\x00-\x7F]/.test(googlePlaceName)
      ? ''
      : googlePlaceName
  return {
    googlePlaceName: mapsName,
    googlePlaceNameZhTw: chineseDetails?.name?.trim() ?? '',
    userName: place.name,
  }
}

function customPlaceHotelAffiliateSearchNames(
  place: Pick<
    CustomPlannerPlace,
    'googlePlaceId' | 'googlePlaceName' | 'googlePlaceLat' | 'googlePlaceLng' | 'name' | 'lat' | 'lng'
  >,
) {
  const names = customPlaceHotelAffiliateSearchNameSources(place)
  return buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: names.googlePlaceName,
    googlePlaceNameZhTw: names.googlePlaceNameZhTw,
    userName: names.userName,
  })
}

function cleanGooglePlaceTypes(value: unknown) {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => {
      if (!item || item.length > 64 || !/^[a-z0-9_]+$/.test(item) || seen.has(item)) return false
      seen.add(item)
      return true
    })
    .slice(0, 20)
}

function sameStringArray(a: string[] | undefined, b: string[]) {
  const left = a ?? []
  return left.length === b.length && left.every((item, index) => item === b[index])
}

function googlePlaceTypeSignal(types: string[]): HotelAffiliateNameSignal {
  return hotelAffiliateGooglePlaceTypeSignal(types)
}

function hotelAffiliateNameSignal(place: Pick<CustomPlannerPlace, 'name' | 'googlePlaceName'>): HotelAffiliateNameSignal {
  const normalizedSignal = hotelAffiliatePlaceNameSignal([place.googlePlaceName, place.name])
  if (normalizedSignal !== 'unknown') return normalizedSignal
  const text = [place.googlePlaceName, place.name].filter(Boolean).join(' ').toLowerCase()
  if (!text) return 'unknown'
  if (
    /\b(?:hotel|hostel|motel|inn|resort|ryokan|guest\s*house|guesthouse|b&b|bnb|aparthotel|villa|stay)\b|酒店|飯店|饭店|旅館|旅馆|旅店|旅舍|民宿|住宿|ホテル|宿|호텔|리조트|게스트하우스/i.test(
      text,
    )
  ) {
    return 'lodging'
  }
  if (
    /\b(?:airport|station|restaurant|steakhouse|cafe|coffee|bar|shop|store|mall|market|museum|park|temple|shrine|tower|castle|aquarium|zoo)\b|機場|机场|空港|餐廳|餐厅|咖啡|商店|百貨|百货|市場|市场|車站|车站|駅|公園|公园|博物館|博物馆|神社|寺|水族館|水族馆|動物園|动物园/i.test(
      text,
    )
  ) {
    return 'non_lodging'
  }
  return 'unknown'
}

function customPlaceHotelAffiliateEligibility(place: CustomPlannerPlace): HotelAffiliateEligibility {
  const typeSignal = googlePlaceTypeSignal(cleanGooglePlaceTypes(place.googlePlaceTypes))
  if (typeSignal === 'lodging') return 'eligible'
  if (typeSignal === 'non_lodging') return 'skipped'

  const nameSignal = hotelAffiliateNameSignal(place)
  const userMarkedHotel = cleanCustomPlaceCategory(place.category) === 'hotel' || place.hotelAffiliateManual
  if (nameSignal === 'non_lodging' && !userMarkedHotel) return 'skipped'
  if (nameSignal === 'lodging') return 'eligible'
  if (userMarkedHotel) return 'eligible'
  if (shouldProbeCustomPlaceHotelAffiliateGoogleDetails(place)) return 'pending_place_type'
  return 'skipped'
}

function customPlaceHotelAffiliateLodgingHint(place: CustomPlannerPlace) {
  const typeSignal = googlePlaceTypeSignal(cleanGooglePlaceTypes(place.googlePlaceTypes))
  if (typeSignal === 'lodging') return true
  if (typeSignal === 'non_lodging') return false
  return hotelAffiliateNameSignal(place) === 'lodging'
}

function customPlaceHotelAffiliateManualLookupAllowed(place: CustomPlannerPlace) {
  if (googlePlaceTypeSignal(cleanGooglePlaceTypes(place.googlePlaceTypes)) === 'non_lodging') return false
  return hotelAffiliateNameSignal(place) !== 'non_lodging'
}

function shouldProbeCustomPlaceHotelAffiliateGoogleDetails(place: CustomPlannerPlace) {
  if (!place.googlePlaceId?.trim()) return false
  const types = cleanGooglePlaceTypes(place.googlePlaceTypes)
  if (types.length > 0) return false
  const nameSignal = hotelAffiliateNameSignal(place)
  const userMarkedHotel = cleanCustomPlaceCategory(place.category) === 'hotel' || place.hotelAffiliateManual === true
  if (nameSignal === 'non_lodging' && !userMarkedHotel) return false
  return true
}

function shouldResolveCustomPlaceGoogleTypes(place: CustomPlannerPlace) {
  return shouldProbeCustomPlaceHotelAffiliateGoogleDetails(place)
}

function shouldResolveCustomPlaceGoogleAffiliateName(place: CustomPlannerPlace) {
  const googlePlaceId = place.googlePlaceId?.trim() ?? ''
  if (!googlePlaceId) return false

  const typeSignal = googlePlaceTypeSignal(cleanGooglePlaceTypes(place.googlePlaceTypes))
  if (typeSignal === 'non_lodging') return false

  const nameSignal = hotelAffiliateNameSignal(place)
  const userMarkedHotel = cleanCustomPlaceCategory(place.category) === 'hotel' || place.hotelAffiliateManual === true
  if (nameSignal === 'non_lodging' && !userMarkedHotel) return false
  if (typeSignal !== 'lodging' && nameSignal !== 'lodging' && !userMarkedHotel) return false

  return (
    (!getCachedGooglePlaceDetails(googlePlaceId, 'en') && !googlePlaceDetailsCoolingDown(googlePlaceId, 'en')) ||
    (!getCachedGooglePlaceDetails(googlePlaceId, 'zh-TW') && !googlePlaceDetailsCoolingDown(googlePlaceId, 'zh-TW'))
  )
}

function shouldResolveCustomPlaceGoogleDetails(place: CustomPlannerPlace) {
  if (!place.googlePlaceId?.trim()) return false
  const typeSignal = googlePlaceTypeSignal(cleanGooglePlaceTypes(place.googlePlaceTypes))
  if (typeSignal === 'non_lodging') return false
  const nameSignal = hotelAffiliateNameSignal(place)
  const userMarkedHotel = cleanCustomPlaceCategory(place.category) === 'hotel' || place.hotelAffiliateManual === true
  if (nameSignal === 'non_lodging' && !userMarkedHotel) return false

  const hasTypes = place.googlePlaceTypesResolved || cleanGooglePlaceTypes(place.googlePlaceTypes).length > 0
  const hasCoordinates = Number.isFinite(place.googlePlaceLat) && Number.isFinite(place.googlePlaceLng)
  if (shouldResolveCustomPlaceGoogleAffiliateName(place)) return true
  const googlePlaceId = place.googlePlaceId.trim()
  const hasCachedDetails = Boolean(
    getCachedGooglePlaceDetails(googlePlaceId, 'en') || getCachedGooglePlaceDetails(googlePlaceId, 'zh-TW'),
  )
  return hasCachedDetails && (!hasTypes || !hasCoordinates)
}

function shouldWaitForGooglePlaceAffiliateDetails(place: CustomPlannerPlace) {
  const googlePlaceId = place.googlePlaceId?.trim() ?? ''
  if (!googlePlaceId) return false
  return (
    (!getCachedGooglePlaceDetails(googlePlaceId, 'en') && !googlePlaceDetailsCoolingDown(googlePlaceId, 'en')) ||
    (!getCachedGooglePlaceDetails(googlePlaceId, 'zh-TW') && !googlePlaceDetailsCoolingDown(googlePlaceId, 'zh-TW'))
  )
}

function hasEveryHotelAffiliateProviderLink(links: CustomPlannerLink[] | undefined) {
  return hasHotelAffiliateProviderLink(links, 'Agoda') && hasHotelAffiliateProviderLink(links, 'Trip')
}

function shouldResolveCustomPlaceGoogleIdentityForAffiliate(
  place: CustomPlannerPlace,
  links: CustomPlannerLink[] | undefined,
) {
  if (hasEveryHotelAffiliateProviderLink(links)) return false
  const url = place.googleUrl?.trim() ?? ''
  if (!url || url.includes('PASTE_YOUR_MAPS_LINK') || !shouldResolveGoogleMapsUrl(url)) return false

  const cached = getResolvedMapUrlCache(url)
  const cachedPlaceId = cached?.googlePlaceId || googleMapsPlaceIdFromUrl(cached?.url)
  const currentPlaceId = place.googlePlaceId?.trim() ?? ''
  const googlePlaceId = currentPlaceId || cachedPlaceId
  const cachedEnglishName = getCachedGooglePlaceDetails(googlePlaceId, 'en')?.name?.trim() ?? ''
  // A direct ChIJ ID plus a short/ascii URL label is not necessarily the
  // canonical hotel name. Resolve it once as well, otherwise those incomplete
  // labels bypass the new Maps identity flow and go to provider search first.
  if (cachedEnglishName) return false
  if (googlePlaceIdResolutionCoolingDown(cached)) return false

  // A Maps URL is enough to classify the place once, even when the user put a
  // hotel in the sightseeing category or used a vague name.  This is a Maps
  // identity/type lookup only; Agoda and Trip are still called *after* Google
  // identifies it as lodging.  The result (including a confirmed non-lodging
  // place) is cached, so it does not repeatedly trigger provider searches.
  return true
}

function googlePlaceTypesCacheKey(placeId: string) {
  return `${GOOGLE_PLACE_TYPES_CACHE_PREFIX}${encodeURIComponent(placeId.trim())}`
}

function googlePlaceDetailsCacheKey(placeId: string, locale: GooglePlaceDetailsLocale) {
  return `${GOOGLE_PLACE_DETAILS_CACHE_PREFIX}${locale}:${encodeURIComponent(placeId.trim())}`
}

function getCachedGooglePlaceTypes(placeId: string) {
  if (typeof window === 'undefined' || !placeId.trim()) return null
  try {
    const raw = window.localStorage.getItem(googlePlaceTypesCacheKey(placeId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { types?: unknown; resolved?: unknown }
    const types = cleanGooglePlaceTypes(parsed.types)
    return { types, resolved: parsed.resolved === true || types.length > 0 }
  } catch {
    return null
  }
}

function rememberGooglePlaceTypes(placeId: string, types: string[], resolved = true) {
  if (typeof window === 'undefined' || !placeId.trim()) return
  try {
    window.localStorage.setItem(googlePlaceTypesCacheKey(placeId), JSON.stringify({ types, resolved }))
  } catch {
    // Type caching is best-effort only.
  }
}

function getCachedGooglePlaceDetails(placeId: string, locale: GooglePlaceDetailsLocale = 'en'): GooglePlaceDetailsData | null {
  if (typeof window === 'undefined' || !placeId.trim()) return null
  try {
    const raw = window.localStorage.getItem(googlePlaceDetailsCacheKey(placeId, locale))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { details?: unknown; expiresAt?: unknown; retryAfter?: unknown }
    const retryAfter = typeof parsed.retryAfter === 'number' ? parsed.retryAfter : 0
    if (retryAfter > Date.now()) return null
    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : 0
    if (expiresAt <= Date.now()) {
      window.localStorage.removeItem(googlePlaceDetailsCacheKey(placeId, locale))
      return null
    }
    return cleanGooglePlaceDetails(parsed.details)
  } catch {
    return null
  }
}

function googlePlaceDetailsCoolingDown(placeId: string, locale: GooglePlaceDetailsLocale = 'en') {
  if (typeof window === 'undefined' || !placeId.trim()) return false
  try {
    const raw = window.localStorage.getItem(googlePlaceDetailsCacheKey(placeId, locale))
    if (!raw) return false
    const parsed = JSON.parse(raw) as { retryAfter?: unknown }
    const retryAfter = typeof parsed.retryAfter === 'number' ? parsed.retryAfter : 0
    if (retryAfter > Date.now()) return true
    if (retryAfter > 0) window.localStorage.removeItem(googlePlaceDetailsCacheKey(placeId, locale))
    return false
  } catch {
    return false
  }
}

function rememberGooglePlaceDetails(
  placeId: string,
  locale: GooglePlaceDetailsLocale,
  details: GooglePlaceDetailsData,
) {
  if (typeof window === 'undefined' || !placeId.trim()) return
  try {
    window.localStorage.setItem(
      googlePlaceDetailsCacheKey(placeId, locale),
      JSON.stringify({ details, expiresAt: Date.now() + GOOGLE_PLACE_DETAILS_CACHE_TTL_MS }),
    )
  } catch {
    // Details caching is best-effort only.
  }
}

function rememberGooglePlaceDetailsMiss(placeId: string, locale: GooglePlaceDetailsLocale) {
  if (typeof window === 'undefined' || !placeId.trim()) return
  try {
    window.localStorage.setItem(
      googlePlaceDetailsCacheKey(placeId, locale),
      JSON.stringify({ retryAfter: Date.now() + GOOGLE_PLACE_DETAILS_ERROR_COOLDOWN_MS }),
    )
  } catch {
    // Details caching is best-effort only.
  }
}

function cleanGooglePlaceDetails(value: unknown): GooglePlaceDetailsData | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const data = value as Record<string, unknown>
  const lat = typeof data.lat === 'number' && Number.isFinite(data.lat) ? data.lat : undefined
  const lng = typeof data.lng === 'number' && Number.isFinite(data.lng) ? data.lng : undefined
  const types = cleanGooglePlaceTypes(data.types)
  const details: GooglePlaceDetailsData = {
    ...(typeof data.name === 'string' && data.name.trim() ? { name: data.name.trim().slice(0, 160) } : {}),
    ...(typeof data.formattedAddress === 'string' && data.formattedAddress.trim()
      ? { formattedAddress: data.formattedAddress.trim().slice(0, 240) }
      : {}),
    ...(lat != null ? { lat } : {}),
    ...(lng != null ? { lng } : {}),
    ...(types.length > 0 ? { types } : {}),
    ...(typeof data.googleMapsUrl === 'string' && data.googleMapsUrl.trim() ? { googleMapsUrl: data.googleMapsUrl.trim().slice(0, 500) } : {}),
    ...(typeof data.website === 'string' && data.website.trim() ? { website: data.website.trim().slice(0, 500) } : {}),
  }
  return Object.keys(details).length > 0 ? details : null
}

function hotelAffiliateLookupCacheKey(
  provider: HotelAffiliateProvider,
  googlePlaceId: string | undefined,
  hotelNames: string[],
  latitude: number,
  longitude: number,
  context: {
    city?: string
    cityId?: number
    countryCode?: PlannerCountryCode
    lodgingHint: boolean
    googlePlaceTypes: string[]
    googlePlaceTypesResolved: boolean
  },
) {
  const verifiedIdentity = getApplicableVerifiedHotelAffiliateIdentity(googlePlaceId, {
    latitude,
    longitude,
    countryCode: context.countryCode,
  })
  const verifiedProvider = provider === 'Agoda' ? verifiedIdentity?.agoda : verifiedIdentity?.trip
  const key = [
    HOTEL_AFFILIATE_LOOKUP_CACHE_VERSION,
    provider,
    googlePlaceId?.trim() ?? '',
    hotelNames.map((name) => name.toLowerCase().trim()).join('::'),
    latitude.toFixed(5),
    longitude.toFixed(5),
    context.countryCode ?? '',
    context.city?.trim().toLowerCase() ?? '',
    context.cityId ?? '',
    context.lodgingHint ? 'lodging' : 'unknown',
    context.googlePlaceTypesResolved ? 'types-resolved' : 'types-pending',
    [...context.googlePlaceTypes].sort().join(','),
    verifiedIdentity?.verifiedAt ?? '',
    verifiedProvider?.hotelId ?? '',
  ].join('|')
  return `${HOTEL_AFFILIATE_LOOKUP_CACHE_PREFIX}${encodeURIComponent(key)}`
}

function customPlaceHotelAffiliateLookupInput(
  provider: HotelAffiliateProvider,
  place: CustomPlannerPlace,
  config: PlannerConfig,
) {
  const nameSources = customPlaceHotelAffiliateSearchNameSources(place)
  const hotelNames = buildPlannerHotelAffiliateSearchNames(nameSources)
  const hotelName = hotelNames[0] ?? ''
  const latitude = place.googlePlaceLat ?? place.lat
  const longitude = place.googlePlaceLng ?? place.lng
  if (!hotelName || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

  const googlePlaceTypes = cleanGooglePlaceTypes(place.googlePlaceTypes)
  const lodgingHint = customPlaceHotelAffiliateLodgingHint(place)
  const city = plannerAffiliateCityName(config, latitude, longitude)
  const cityId = plannerAgodaCityId(config, latitude, longitude)
  const countryCode = plannerAffiliateCountryCode(config, latitude, longitude)
  const cacheKey = hotelAffiliateLookupCacheKey(
    provider,
    place.googlePlaceId,
    hotelNames,
    latitude,
    longitude,
    {
      city,
      cityId,
      countryCode,
      lodgingHint,
      googlePlaceTypes,
      googlePlaceTypesResolved: place.googlePlaceTypesResolved === true,
    },
  )

  return {
    cacheKey,
    hotelName,
    googlePlaceName: nameSources.googlePlaceName,
    googlePlaceNameZhTw: nameSources.googlePlaceNameZhTw,
    userName: nameSources.userName,
    latitude,
    longitude,
    googlePlaceTypes,
    lodgingHint,
    city,
    cityId,
    countryCode,
  }
}

function readHotelAffiliateLookupHit(cacheKey: string, provider: HotelAffiliateProvider) {
  try {
    const raw = window.localStorage.getItem(cacheKey)
    if (!raw) return ''
    const data = JSON.parse(raw) as { bookingUrl?: unknown; expiresAt?: unknown }
    const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : 0
    const bookingUrl = cleanHotelAffiliateBookingUrl(data.bookingUrl, provider)
    if (bookingUrl && expiresAt > Date.now()) return bookingUrl
    window.localStorage.removeItem(cacheKey)
    return ''
  } catch {
    return ''
  }
}

function hotelAffiliateLookupCoolingDown(cacheKey: string) {
  try {
    const raw = window.localStorage.getItem(cacheKey)
    if (!raw) return null
    const data = JSON.parse(raw) as { retryAfter?: unknown; status?: unknown }
    const retryAfter = typeof data.retryAfter === 'number' ? data.retryAfter : 0
    if (retryAfter > Date.now()) {
      const status: HotelAffiliateCooldownStatus =
        data.status === 'error' ||
        data.status === 'not_configured' ||
        data.status === 'needs_city_id'
          ? data.status
          : 'none'
      return status
    }
    window.localStorage.removeItem(cacheKey)
    return null
  } catch {
    return null
  }
}

function rememberHotelAffiliateLookupHit(cacheKey: string, bookingUrl: string, ttlMs: number) {
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify({ bookingUrl, expiresAt: Date.now() + ttlMs }))
  } catch {
    // Lookup caching is best-effort only.
  }
}

function rememberHotelAffiliateLookupMiss(
  cacheKey: string,
  ttlMs: number,
  status: HotelAffiliateCooldownStatus = 'none',
) {
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify({ retryAfter: Date.now() + ttlMs, status }))
  } catch {
    // Lookup caching is best-effort only.
  }
}

function knownPlannerRegionKey(place: MapPlace) {
  if (place.id.startsWith('osaka-')) return 'osaka'
  if (place.id.startsWith('busan-')) return 'busan'
  if (place.id.startsWith('tokyo-')) return 'tokyo'
  if (place.id.startsWith('fuji-')) return 'fuji'
  if (place.id.startsWith('northvietnam-')) return 'northvietnam'
  return ''
}

function knownPlannerRegionLabel(key: string) {
  if (key === 'osaka') return '大阪地圖'
  if (key === 'busan') return '釜山地圖'
  if (key === 'tokyo') return '東京地圖'
  if (key === 'fuji') return '富士河口湖地圖'
  if (key === 'northvietnam') return '北越地圖'
  return '附近地圖'
}

function nearbyKnownPlacesSuggestion(anchorPlaces: MapPlace[], candidatePlaces: MapPlace[]): NearbyKnownPlacesSuggestion | null {
  if (anchorPlaces.length === 0 || candidatePlaces.length === 0) return null
  const stats = new Map<string, { key: string; label: string; count: number; distance: number }>()

  candidatePlaces.forEach((candidate) => {
    const key = knownPlannerRegionKey(candidate)
    if (!key) return
    const nearestDistance = anchorPlaces.reduce((nearest, anchor) => {
      const distance = distanceMeters(anchor, candidate)
      return distance < nearest ? distance : nearest
    }, Number.POSITIVE_INFINITY)
    if (nearestDistance > NEARBY_KNOWN_PLACE_RADIUS_METERS) return
    const current = stats.get(key)
    stats.set(key, {
      key,
      label: knownPlannerRegionLabel(key),
      count: (current?.count ?? 0) + 1,
      distance: Math.min(current?.distance ?? Number.POSITIVE_INFINITY, nearestDistance),
    })
  })

  const best = [...stats.values()].sort((a, b) => b.count - a.count || a.distance - b.distance)[0]
  if (!best) return null
  const places = candidatePlaces.filter((place) => knownPlannerRegionKey(place) === best.key)
  return places.length > 0 ? { key: best.key, label: best.label, places } : null
}

function hotelAffiliateStatusText(provider: 'Agoda' | 'Trip', status: HotelAffiliateStatus | undefined) {
  if (status === 'searching') return `正在找 ${provider}`
  if (status === 'matched') return `已加入 ${provider}`
  if (status === 'none') return `${provider} 未命中`
  if (status === 'not_configured') return `${provider} 未設定`
  if (status === 'needs_city_id') return `${provider} 資料不足`
  if (status === 'error') return `${provider} 暫時無法查詢`
  if (status === 'skipped') return ''
  return ''
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
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('load failed'))
    document.head.appendChild(s)
  })
}

async function loadGooglePlacesLibrary() {
  if (typeof window === 'undefined') return false
  if (window.google?.maps?.places?.Place) return true
  const importer = (window.google?.maps as (typeof google.maps & { importLibrary?: (name: string) => Promise<unknown> }) | undefined)?.importLibrary
  if (typeof importer !== 'function') return false
  await importer('places').catch(() => null)
  return Boolean(window.google?.maps?.places?.Place)
}

function googlePlaceDetailsFromPlace(result: google.maps.places.Place | null | undefined): GooglePlaceDetailsData | null {
  if (!result) return null
  const location = result.location
  const lat = location ? location.lat() : undefined
  const lng = location ? location.lng() : undefined
  const details: GooglePlaceDetailsData = {
    ...(result.displayName?.trim() ? { name: result.displayName.trim().slice(0, 160) } : {}),
    ...(result.formattedAddress?.trim() ? { formattedAddress: result.formattedAddress.trim().slice(0, 240) } : {}),
    ...(typeof lat === 'number' && Number.isFinite(lat) ? { lat } : {}),
    ...(typeof lng === 'number' && Number.isFinite(lng) ? { lng } : {}),
    ...(cleanGooglePlaceTypes(result.types).length > 0 ? { types: cleanGooglePlaceTypes(result.types) } : {}),
    ...(result.googleMapsURI?.trim() ? { googleMapsUrl: result.googleMapsURI.trim().slice(0, 500) } : {}),
    ...(result.websiteURI?.trim() ? { website: result.websiteURI.trim().slice(0, 500) } : {}),
  }
  return Object.keys(details).length > 0 ? details : null
}

function googleMapsPinUrl(place: MapPlace) {
  const url = place.spotGoogleMapsUrl?.trim()
  const googleUrl = url && !url.includes('PASTE_YOUR_MAPS_LINK') ? googleMapsUrlFromInput(url) : ''
  if (googleUrl) return googleUrl
  return `https://www.google.com/maps?q=${place.lat},${place.lng}`
}

function googleMapsTravelMode(mode: TransportMode) {
  if (mode === 'walk') return 'walking'
  if (mode === 'car' || mode === 'taxi') return 'driving'
  if (mode === 'bus' || mode === 'subway' || mode === 'train') return 'transit'
  return null
}

function googleMapsPlaceIdFromUrl(value: string | undefined) {
  const raw = value?.trim()
  if (!raw) return ''

  try {
    const url = new URL(raw)
    for (const key of ['query_place_id', 'place_id', 'origin_place_id', 'destination_place_id']) {
      const id = url.searchParams.get(key)?.trim()
      if (id) return id
    }
  } catch {
    // Fall through to loose text matching.
  }

  const paramMatch = raw.match(/[?&](?:query_place_id|place_id|origin_place_id|destination_place_id)=([^&#]+)/i)
  if (paramMatch?.[1]) return decodeURIComponent(paramMatch[1]).trim()
  const dataMatch = raw.match(/!1s(ChI[A-Za-z0-9_-]{12,})/)
  return dataMatch?.[1] ?? ''
}

function googleMapsDataIdFromUrl(value: string | undefined) {
  const raw = value?.trim() ?? ''
  if (!raw) return ''
  const match = raw.match(/!1s(0x[0-9a-f]{6,}:0x[0-9a-f]{6,})/i)
  return match?.[1]?.toLowerCase() ?? ''
}

function trustedProviderPlaceId(
  place: MapPlace,
  placeId: string,
  providerLat: number | null | undefined,
  providerLng: number | null | undefined,
  requireProviderCoordinate = false,
) {
  const cleanPlaceId = placeId.trim()
  if (!cleanPlaceId) return ''
  if (providerLat == null || providerLng == null || !Number.isFinite(providerLat) || !Number.isFinite(providerLng)) {
    return requireProviderCoordinate ? '' : cleanPlaceId
  }
  return distanceMeters(place, { lat: providerLat, lng: providerLng }) <= TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS
    ? cleanPlaceId
    : ''
}

function googleMapsPlaceId(place: MapPlace) {
  const directPlaceId = trustedProviderPlaceId(
    place,
    place.googlePlaceId ?? '',
    place.googlePlaceLat,
    place.googlePlaceLng,
    isCustomPlaceId(place.id),
  )
  if (isCustomPlaceId(place.id)) return directPlaceId
  return directPlaceId || googleMapsPlaceIdFromUrl(place.spotGoogleMapsUrl)
}

function googleMapsDirectionsPoint(place: MapPlace, googlePlaceId = '') {
  const name = shortName(place.googlePlaceName || place.name).replace(/[,]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (googlePlaceId && name) return name
  return `${place.lat},${place.lng}`
}

function googleMapsDirectionsUrl(from: MapPlace, to: MapPlace, mode: TransportMode, placeIds: TransportNavigationPlaceIds = {}) {
  const travelMode = googleMapsTravelMode(mode)
  const fromGooglePlaceId = placeIds.fromGooglePlaceId || googleMapsPlaceId(from)
  const toGooglePlaceId = placeIds.toGooglePlaceId || googleMapsPlaceId(to)
  const params = new URLSearchParams({
    api: '1',
    origin: googleMapsDirectionsPoint(from, fromGooglePlaceId),
    destination: googleMapsDirectionsPoint(to, toGooglePlaceId),
  })

  if (fromGooglePlaceId) params.set('origin_place_id', fromGooglePlaceId)
  if (toGooglePlaceId) params.set('destination_place_id', toGooglePlaceId)
  if (travelMode) params.set('travelmode', travelMode)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function naverMapDirectionsMode(mode: TransportMode) {
  if (mode === 'walk') return 'walk'
  if (mode === 'car' || mode === 'taxi') return 'car'
  return 'transit'
}

function naverMapAppDirectionsMode(mode: TransportMode) {
  if (mode === 'walk') return 'walk'
  if (mode === 'car' || mode === 'taxi') return 'car'
  return 'public'
}

function naverMapEncodedCoordinate(value: number) {
  let numberValue = Math.round(value * NAVER_COORD_PRECISION) + NAVER_COORD_OFFSET
  if (numberValue <= 0) return NAVER_COORD_CHARS[0]

  let encoded = ''
  while (numberValue > 0) {
    encoded = NAVER_COORD_CHARS[numberValue % NAVER_COORD_CHARS.length] + encoded
    numberValue = Math.floor(numberValue / NAVER_COORD_CHARS.length)
  }
  return encoded
}

function naverMapPlaceIdFromUrl(value: string | undefined) {
  const url = value?.trim()
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/\/(?:p\/)?(?:entry\/)?place\/(\d+)/)
    return match?.[1] ?? ''
  } catch {
    const match = url.match(/\/(?:p\/)?(?:entry\/)?place\/(\d+)/)
    return match?.[1] ?? ''
  }
}

function naverMapPlaceId(place: MapPlace) {
  return place.naverPlaceId?.trim() || naverMapPlaceIdFromUrl(naverMapUrl(place))
}

function naverMapDirectionsPoint(place: MapPlace, resolvedPlaceId = '') {
  const placeId = resolvedPlaceId || naverMapPlaceId(place)
  const encodedName = encodeURIComponent(shortName(place.naverPlaceName || place.name).replace(/,/g, '©'))
  return [
    naverMapEncodedCoordinate(place.lng),
    naverMapEncodedCoordinate(place.lat),
    encodedName,
    placeId,
    'PLACE_POI',
  ].join(',')
}

function naverMapDirectionsUrl(from: MapPlace, to: MapPlace, mode: TransportMode, placeIds: TransportNavigationPlaceIds = {}) {
  const start = naverMapDirectionsPoint(from, placeIds.fromNaverPlaceId)
  const goal = naverMapDirectionsPoint(to, placeIds.toNaverPlaceId)
  return `https://map.naver.com/p/directions/${start}/${goal}/-/${naverMapDirectionsMode(mode)}`
}

function naverMapAppDirectionsUrl(from: MapPlace, to: MapPlace, mode: TransportMode) {
  const params = new URLSearchParams({
    slat: String(from.lat),
    slng: String(from.lng),
    sname: shortName(from.naverPlaceName || from.name),
    dlat: String(to.lat),
    dlng: String(to.lng),
    dname: shortName(to.naverPlaceName || to.name),
    appname: NAVER_MAP_APP_NAME,
  })
  return `nmap://route/${naverMapAppDirectionsMode(mode)}?${params.toString()}`
}

function isSouthKoreaCoordinate(place: MapPlace) {
  return coordinateCountryCode(place.lat, place.lng) === 'KR'
}

function transportNavigationUrl(from: MapPlace, to: MapPlace, mode: TransportMode, placeIds: TransportNavigationPlaceIds = {}) {
  return isSouthKoreaCoordinate(from) && isSouthKoreaCoordinate(to)
    ? naverMapDirectionsUrl(from, to, mode, placeIds)
    : googleMapsDirectionsUrl(from, to, mode, placeIds)
}

function naverMapUrl(place: MapPlace) {
  const actions = place.spotActionRows?.flat() ?? place.spotActions ?? []
  return actions.find((action) => action.platform === 'NaverMap' || action.label.toLowerCase() === 'navermap')?.href
}

function naverMapAppPlaceUrl(place: MapPlace, resolvedPlaceId = '') {
  const placeId = resolvedPlaceId || naverMapPlaceId(place)
  if (placeId) {
    const params = new URLSearchParams({
      id: placeId,
      appname: NAVER_MAP_APP_NAME,
    })
    return `nmap://place?${params.toString()}`
  }

  const params = new URLSearchParams({
    lat: String(place.lat),
    lng: String(place.lng),
    zoom: '16',
    appname: NAVER_MAP_APP_NAME,
  })
  return `nmap://map?${params.toString()}`
}

function canResolveGooglePlaceId(place: MapPlace) {
  const url = place.spotGoogleMapsUrl?.trim()
  if (!url || url.includes('PASTE_YOUR_MAPS_LINK')) return false
  if (googleMapsPlaceId(place) || cachedGooglePlaceId(place)) return false
  const cached = getResolvedMapUrlCache(url)
  return !cached?.googlePlaceIdResolved && !googlePlaceIdNavigationResolutionCoolingDown(cached)
}

function canResolveNaverPlaceId(place: MapPlace) {
  const url = naverMapUrl(place)?.trim()
  if (!url) return false
  if (naverMapPlaceId(place) || cachedNaverPlaceId(place)) return false
  return !getResolvedMapUrlCache(url)?.naverPlaceIdResolved
}

function needsTransportNavigationPlaceResolution(from: MapPlace, to: MapPlace) {
  const shouldUseNaver = isSouthKoreaCoordinate(from) && isSouthKoreaCoordinate(to)
  return shouldUseNaver
    ? canResolveNaverPlaceId(from) || canResolveNaverPlaceId(to)
    : canResolveGooglePlaceId(from) || canResolveGooglePlaceId(to)
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

function cleanProviderText(value: unknown, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function cleanProviderCoordinate(value: unknown) {
  const numberValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
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
    googlePlaceId: place.googlePlaceId || sourcePlace?.googlePlaceId,
    googlePlaceName: place.googlePlaceName || sourcePlace?.googlePlaceName,
    googlePlaceLat: place.googlePlaceLat ?? sourcePlace?.googlePlaceLat,
    googlePlaceLng: place.googlePlaceLng ?? sourcePlace?.googlePlaceLng,
    googlePlaceTypes: place.googlePlaceTypes ?? sourcePlace?.googlePlaceTypes,
    googlePlaceTypesResolved: place.googlePlaceTypesResolved ?? sourcePlace?.googlePlaceTypesResolved,
    naverPlaceId: place.naverPlaceId || sourcePlace?.naverPlaceId,
    naverPlaceName: place.naverPlaceName || sourcePlace?.naverPlaceName,
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
    const googlePlaceId = cleanProviderText(source.googlePlaceId)
    const googlePlaceName = cleanProviderText(source.googlePlaceName)
    const googlePlaceLat = cleanProviderCoordinate(source.googlePlaceLat)
    const googlePlaceLng = cleanProviderCoordinate(source.googlePlaceLng)
    const googlePlaceTypes = cleanGooglePlaceTypes(source.googlePlaceTypes)
    const googlePlaceTypesResolved = source.googlePlaceTypesResolved === true || googlePlaceTypes.length > 0
    const naverUrl = typeof source.naverUrl === 'string' ? source.naverUrl.trim() : ''
    const naverPlaceId = cleanProviderText(source.naverPlaceId, 80)
    const naverPlaceName = cleanProviderText(source.naverPlaceName)
    const category = cleanCustomPlaceCategory(source.category)
    const hotelAffiliateManual = source.hotelAffiliateManual === true
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
      ...(googlePlaceId ? { googlePlaceId } : {}),
      ...(googlePlaceName ? { googlePlaceName } : {}),
      ...(googlePlaceLat != null && googlePlaceLng != null ? { googlePlaceLat, googlePlaceLng } : {}),
      ...(googlePlaceTypes.length > 0 ? { googlePlaceTypes } : {}),
      ...(googlePlaceTypesResolved ? { googlePlaceTypesResolved: true } : {}),
      ...(naverUrl ? { naverUrl } : {}),
      ...(naverPlaceId ? { naverPlaceId } : {}),
      ...(naverPlaceName ? { naverPlaceName } : {}),
      ...(hotelAffiliateManual ? { hotelAffiliateManual: true } : {}),
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

function looksLikeUrl(value: string) {
  const trimmed = value.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) || /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#]|$)/i.test(trimmed)
}

function googleMapsInputNotice(value: string) {
  return looksLikeUrl(value)
    ? '請先貼 Google Maps 連結定位，其他連結可稍後新增。'
    : '請貼上 Google Maps 連結來定位景點。'
}

function setAffiliateParam(url: URL, key: string, value: string) {
  const lowerKey = key.toLowerCase()
  Array.from(url.searchParams.keys()).forEach((paramKey) => {
    if (paramKey.toLowerCase() === lowerKey) url.searchParams.delete(paramKey)
  })
  url.searchParams.set(key, value)
}

function parsePlannerLinkUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    return new URL(trimmed)
  } catch {
    if (!looksLikeUrl(trimmed)) return null
    try {
      return new URL(`https://${trimmed}`)
    } catch {
      return null
    }
  }
}

function normalizePlannerAffiliateHref(value: string) {
  const url = parsePlannerLinkUrl(value)
  if (!url) return value.trim()
  const hostname = url.hostname.toLowerCase()

  if (hostname === 'klook.com' || hostname.endsWith('.klook.com')) {
    url.protocol = 'https:'
    setAffiliateParam(url, 'aid', '93798')
    return url.toString()
  }

  if (hostname === 'kkday.com' || hostname.endsWith('.kkday.com')) {
    url.protocol = 'https:'
    setAffiliateParam(url, 'cid', '22312')
    return url.toString()
  }

  if (hostname === 'agoda.com' || hostname.endsWith('.agoda.com')) {
    const hotelId = url.searchParams.get('hid')?.trim()
    if (hotelId) {
      const partnerUrl = new URL('https://www.agoda.com/partners/partnersearch.aspx')
      partnerUrl.searchParams.set('pcs', '1')
      partnerUrl.searchParams.set('cid', '1945734')
      partnerUrl.searchParams.set('hid', hotelId)
      return partnerUrl.toString()
    }
    url.protocol = 'https:'
    setAffiliateParam(url, 'pcs', '1')
    setAffiliateParam(url, 'cid', '1945734')
    return url.toString()
  }

  if (hostname === 'trip.com' || hostname.endsWith('.trip.com')) {
    url.protocol = 'https:'
    url.hostname = 'tw.trip.com'
    setAffiliateParam(url, 'Allianceid', '6833709')
    setAffiliateParam(url, 'SID', '242535686')
    setAffiliateParam(url, 'trip_sub1', '')
    setAffiliateParam(url, 'trip_sub3', 'D16730765')
    return url.toString()
  }

  return value.trim()
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

function googleMapsUrlFromInput(value: string) {
  const trimmedGoogleUrl = extractGoogleMapsUrlFromText(value).trim()
  return shouldResolveGoogleMapsUrl(trimmedGoogleUrl) ? trimmedGoogleUrl : ''
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

function plannerReturnAwareHref(href: string) {
  if (typeof window === 'undefined') return href
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return href
    const returnUrl = new URL(window.location.href)
    if (returnUrl.pathname === '/tools/planner' && returnUrl.searchParams.get('region')) {
      returnUrl.searchParams.set('resume', '1')
    }
    url.searchParams.set('from', 'planner')
    url.searchParams.set('return', `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return href
  }
}

function preparePlannerActionLinkClick(
  event: ReactMouseEvent<HTMLAnchorElement>,
  action: { href: string; platform?: string },
) {
  if (action.platform?.trim().toLowerCase() !== 'ticket') return
  event.currentTarget.href = plannerReturnAwareHref(action.href)
}

function usePlannerBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof window === 'undefined') return
    const body = document.body
    const scrollY = window.scrollY
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      body.style.overflow = previous.overflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
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

function isDirectPlaceNameMatch(draftName: string, placeName: string) {
  if (draftName.length < 2 || placeName.length < 2) return false
  return draftName === placeName || draftName.includes(placeName) || placeName.includes(draftName)
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

function findDirectKnownPlaceMatch(input: KnownPlaceMatchInput, knownPlaces: MapPlace[]) {
  const draftGooglePlaceId = input.googlePlaceId?.trim() ?? ''
  if (draftGooglePlaceId) {
    const placeIdMatches = knownPlaces.filter((place) => place.googlePlaceId?.trim() === draftGooglePlaceId)
    if (placeIdMatches.length === 1) return placeIdMatches[0]
  }

  const normalizedDraftUrl = normalizePlaceMatchUrl(input.googleUrl)
  if (normalizedDraftUrl) {
    const urlMatches = knownPlaces.filter(
      (place) => normalizePlaceMatchUrl(place.spotGoogleMapsUrl) === normalizedDraftUrl,
    )
    if (urlMatches.length === 1) return urlMatches[0]
  }

  if (input.lat == null || input.lng == null) return null
  const draftNames = [input.name, input.googlePlaceName ?? '']
    .map(normalizePlaceMatchText)
    .filter(Boolean)
  if (draftNames.length === 0) return null

  const closeNameMatches = knownPlaces.filter((place) => {
    const normalizedPlaceName = normalizePlaceMatchText(place.name)
    const hasSameName = draftNames.some((draftName) => isDirectPlaceNameMatch(draftName, normalizedPlaceName))
    if (!hasSameName) return false
    return distanceMeters({ lat: input.lat ?? 0, lng: input.lng ?? 0 }, { lat: place.lat, lng: place.lng }) <= 35
  })
  return closeNameMatches.length === 1 ? closeNameMatches[0] : null
}

function isMobilePlannerViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 959px)').matches
}

function isMobileAppLaunchDevice() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function openMobileMapAppHref(appHref: string) {
  if (!appHref || !isMobileAppLaunchDevice()) return false
  window.location.href = appHref
  return true
}

function openMobileMapApp(event: ReactMouseEvent<HTMLAnchorElement>, appHref: string) {
  event.preventDefault()
  const opened = openMobileMapAppHref(appHref)
  if (!opened) {
    window.open((event.currentTarget as HTMLAnchorElement).href, '_blank', 'noopener,noreferrer')
  }
  return opened
}

function detectInAppBrowser(): InAppBrowser {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/Line\//i.test(ua)) return 'line'
  if (/Messenger|FBAN\/MessengerForiOS/i.test(ua)) return 'messenger'
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
  if (browser === 'messenger') return 'Messenger'
  if (browser === 'facebook') return 'Facebook'
  return '內建'
}

function locationPermissionGuide() {
  if (typeof navigator === 'undefined') return '點網址列左側圖示 → 位置 → 允許，再回到頁面開啟定位。'
  const ua = navigator.userAgent
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|EdgiOS|OPR|SamsungBrowser/i.test(ua)
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg|EdgiOS|OPR/i.test(ua)

  if (isIOS && isSafari) return 'iPhone Safari：設定 → 隱私權與安全性 → 定位服務 → Safari 網站 → 允許，再回到頁面開啟定位。'
  if (isIOS && isChrome) return 'iPhone Chrome：設定 → 隱私權與安全性 → 定位服務 → Chrome → 允許，再回到頁面開啟定位。'
  if (isAndroid && isChrome) return 'Android Chrome：設定 → 應用程式 → Chrome → 權限 → 位置 → 允許，再回到頁面開啟定位。'
  if (isChrome) return 'Chrome：點網址列左側圖示 → 位置 → 允許，再回到頁面開啟定位。'
  return '點網址列左側圖示 → 位置 → 允許，再回到頁面開啟定位。'
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
  googlePlaceId?: string
  googleMapsDataId?: string
  googlePlaceTypes?: string[]
  naverPlaceId?: string
  googlePlaceIdResolved?: boolean
  googlePlaceIdRetryAfter?: number
  googlePlaceIdNavigationRetryAfter?: number
  googlePlaceTypesResolved?: boolean
  naverPlaceIdResolved?: boolean
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
        const googlePlaceTypes = cleanGooglePlaceTypes(data.googlePlaceTypes)
        return typeof data.url === 'string'
          ? {
              url: data.url,
              ...(typeof data.name === 'string' && data.name.trim() ? { name: data.name.trim() } : {}),
              ...(typeof data.query === 'string' && data.query.trim() ? { query: data.query.trim() } : {}),
              ...(typeof data.lat === 'number' && Number.isFinite(data.lat) ? { lat: data.lat } : {}),
               ...(typeof data.lng === 'number' && Number.isFinite(data.lng) ? { lng: data.lng } : {}),
               ...(typeof data.googlePlaceId === 'string' && data.googlePlaceId.trim() ? { googlePlaceId: data.googlePlaceId.trim() } : {}),
              ...(typeof data.googleMapsDataId === 'string' && /^0x[0-9a-f]{6,}:0x[0-9a-f]{6,}$/i.test(data.googleMapsDataId.trim())
                ? { googleMapsDataId: data.googleMapsDataId.trim().toLowerCase() }
                : {}),
              ...(googlePlaceTypes.length > 0 ? { googlePlaceTypes } : {}),
              ...(typeof data.naverPlaceId === 'string' && data.naverPlaceId.trim() ? { naverPlaceId: data.naverPlaceId.trim() } : {}),
              ...(data.googlePlaceIdResolved === true ? { googlePlaceIdResolved: true } : {}),
              ...(typeof data.googlePlaceIdRetryAfter === 'number' && data.googlePlaceIdRetryAfter > Date.now()
                ? { googlePlaceIdRetryAfter: data.googlePlaceIdRetryAfter }
                : {}),
              ...(typeof data.googlePlaceIdNavigationRetryAfter === 'number' && data.googlePlaceIdNavigationRetryAfter > Date.now()
                ? { googlePlaceIdNavigationRetryAfter: data.googlePlaceIdNavigationRetryAfter }
                : {}),
              ...(data.googlePlaceTypesResolved === true || googlePlaceTypes.length > 0 ? { googlePlaceTypesResolved: true } : {}),
              ...(data.naverPlaceIdResolved === true ? { naverPlaceIdResolved: true } : {}),
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

function googlePlaceIdResolutionCoolingDown(data: ResolvedMapUrlData | null | undefined) {
  return typeof data?.googlePlaceIdRetryAfter === 'number' && data.googlePlaceIdRetryAfter > Date.now()
}

function googlePlaceIdNavigationResolutionCoolingDown(data: ResolvedMapUrlData | null | undefined) {
  return typeof data?.googlePlaceIdNavigationRetryAfter === 'number' && data.googlePlaceIdNavigationRetryAfter > Date.now()
}

function setResolvedMapUrlCache(url: string, data: ResolvedMapUrlData) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`${RESOLVED_MAP_URL_CACHE_PREFIX}${url}`, JSON.stringify(data))
  } catch {
    // Ignore storage limits or private-browser restrictions.
  }
}

function cachedGooglePlaceId(place: MapPlace) {
  const url = place.spotGoogleMapsUrl?.trim()
  if (!url || url.includes('PASTE_YOUR_MAPS_LINK')) return ''

  const cached = getResolvedMapUrlCache(url)
  const cachedCoordinates =
    cached?.lat != null && cached.lng != null ? { lat: cached.lat, lng: cached.lng } : parseGoogleMapsUrl(cached?.url ?? '')
  return trustedProviderPlaceId(
    place,
    cached?.googlePlaceId || googleMapsPlaceIdFromUrl(cached?.url),
    cachedCoordinates?.lat,
    cachedCoordinates?.lng,
    isCustomPlaceId(place.id),
  )
}

function cachedNaverPlaceId(place: MapPlace) {
  const url = naverMapUrl(place)?.trim()
  if (!url) return ''

  const cached = getResolvedMapUrlCache(url)
  return cached?.naverPlaceId || naverMapPlaceIdFromUrl(cached?.url)
}

async function resolveNaverMapUrlPlaceId(urlValue: string | undefined, signal: AbortSignal) {
  const url = urlValue?.trim()
  if (!url) return ''
  const directPlaceId = naverMapPlaceIdFromUrl(url)
  if (directPlaceId) return directPlaceId

  const cached = getResolvedMapUrlCache(url)
  const cachedPlaceId = cached?.naverPlaceId || naverMapPlaceIdFromUrl(cached?.url)
  if (cachedPlaceId) return cachedPlaceId
  if (cached?.naverPlaceIdResolved) return ''

  const res = await fetch(`/api/pass-planner/resolve-map-url?url=${encodeURIComponent(url)}`, {
    cache: 'no-store',
    signal,
  })
  if (!res.ok) return ''

  const data = (await res.json()) as { url?: unknown; naverPlaceId?: unknown }
  const resolvedUrl = typeof data.url === 'string' ? data.url : url
  const resolvedPlaceId =
    (typeof data.naverPlaceId === 'string' && data.naverPlaceId.trim()) ||
    naverMapPlaceIdFromUrl(resolvedUrl)

  setResolvedMapUrlCache(url, {
    url: resolvedUrl,
    ...(resolvedPlaceId ? { naverPlaceId: resolvedPlaceId } : {}),
    naverPlaceIdResolved: true,
  })

  return resolvedPlaceId || ''
}

async function resolveNaverPlaceId(place: MapPlace, signal: AbortSignal) {
  const directPlaceId = naverMapPlaceId(place)
  if (directPlaceId) return directPlaceId

  return resolveNaverMapUrlPlaceId(naverMapUrl(place), signal)
}

async function resolveGooglePlaceId(place: MapPlace, signal: AbortSignal) {
  const directPlaceId = googleMapsPlaceId(place)
  if (directPlaceId) return directPlaceId

  const url = place.spotGoogleMapsUrl?.trim()
  if (!url || url.includes('PASTE_YOUR_MAPS_LINK')) return ''

  const cached = getResolvedMapUrlCache(url)
  const cachedCoordinates =
    cached?.lat != null && cached.lng != null ? { lat: cached.lat, lng: cached.lng } : parseGoogleMapsUrl(cached?.url ?? '')
  const cachedPlaceId = trustedProviderPlaceId(
    place,
    cached?.googlePlaceId || googleMapsPlaceIdFromUrl(cached?.url),
    cachedCoordinates?.lat,
    cachedCoordinates?.lng,
    isCustomPlaceId(place.id),
  )
  if (cachedPlaceId) return cachedPlaceId
  if (googlePlaceIdNavigationResolutionCoolingDown(cached)) return ''

  const res = await fetch(`/api/pass-planner/resolve-map-url?url=${encodeURIComponent(url)}`, {
    cache: 'no-store',
    signal,
  })
  if (!res.ok) return ''

  const data = (await res.json()) as {
    url?: unknown
    title?: unknown
    query?: unknown
    lat?: unknown
    lng?: unknown
    googlePlaceId?: unknown
  }
  const resolvedUrl = typeof data.url === 'string' ? data.url : url
  const resolvedCoordinates =
    typeof data.lat === 'number' && Number.isFinite(data.lat) && typeof data.lng === 'number' && Number.isFinite(data.lng)
      ? { lat: data.lat, lng: data.lng }
      : parseGoogleMapsUrl(resolvedUrl)
  const resolvedPlaceId =
    trustedProviderPlaceId(
      place,
      (typeof data.googlePlaceId === 'string' && data.googlePlaceId.trim()) ||
        googleMapsPlaceIdFromUrl(resolvedUrl),
      resolvedCoordinates?.lat,
      resolvedCoordinates?.lng,
      isCustomPlaceId(place.id),
    )

  setResolvedMapUrlCache(url, {
    url: resolvedUrl,
    ...(typeof data.title === 'string' && data.title.trim() ? { name: data.title.trim() } : {}),
    ...(typeof data.query === 'string' && data.query.trim() ? { query: data.query.trim() } : {}),
    ...(resolvedCoordinates ? { lat: resolvedCoordinates.lat, lng: resolvedCoordinates.lng } : {}),
    ...(resolvedPlaceId ? { googlePlaceId: resolvedPlaceId } : {}),
    ...(resolvedPlaceId
      ? { googlePlaceIdResolved: true }
      : { googlePlaceIdNavigationRetryAfter: Date.now() + GOOGLE_PLACE_ID_ERROR_COOLDOWN_MS }),
  })

  return resolvedPlaceId || ''
}

function focusMapOnPosition(map: google.maps.Map, center: { lat: number; lng: number }, mobileOffsetRatio = 0.2) {
  map.setCenter(center)
  map.setZoom(16)
  window.setTimeout(() => {
    map.setCenter(center)
    if (isMobilePlannerViewport()) map.panBy(0, Math.round(window.innerHeight * mobileOffsetRatio))
  }, 140)
}

function panMapToUserPosition(map: google.maps.Map, center: { lat: number; lng: number }) {
  map.panTo(center)
  if ((map.getZoom() ?? 0) < 16) map.setZoom(16)
}

function userLocationIcon(
  heading: number | null,
  fillColor = '#2563eb',
): google.maps.Icon {
  const cone =
    typeof heading === 'number' && Number.isFinite(heading)
      ? `<path d="M80 80 L6 12 Q80 -22 154 12 Z" fill="url(#headingCone)" transform="rotate(${heading} 80 80)"/>
        <path d="M80 80 L23 26 Q80 1 137 26 Z" fill="#4f46e5" fill-opacity="0.12" transform="rotate(${heading} 80 80)"/>`
      : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="headingCone" x1="80" y1="80" x2="80" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#4058ff" stop-opacity="0.42"/>
        <stop offset="0.45" stop-color="#5b55d6" stop-opacity="0.24"/>
        <stop offset="1" stop-color="#5b55d6" stop-opacity="0.02"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.28"/>
      </filter>
    </defs>
    ${cone}
    <circle cx="80" cy="80" r="27" fill="#ffffff" filter="url(#shadow)"/>
    <circle cx="80" cy="80" r="21" fill="${fillColor}" fill-opacity="0.2"/>
    <circle cx="80" cy="80" r="16" fill="${fillColor}"/>
  </svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`,
    scaledSize: new google.maps.Size(96, 96),
    anchor: new google.maps.Point(48, 48),
  }
}

function locationHeadingFromPosition(pos: GeolocationPosition) {
  return typeof pos.coords.heading === 'number' && Number.isFinite(pos.coords.heading) ? pos.coords.heading : null
}

function normalizeMapHeading(heading: number) {
  return ((heading % 360) + 360) % 360
}

function headingDifference(a: number, b: number) {
  const diff = Math.abs(normalizeMapHeading(a) - normalizeMapHeading(b))
  return Math.min(diff, 360 - diff)
}

function locationHeadingZoomForSpeed(speed: number | null) {
  if (speed === null || speed < 0) return LOCATION_HEADING_UP_ZOOM
  if (speed >= 12) return 15
  if (speed >= 5.5) return 16
  if (speed >= 1.8) return 17
  return LOCATION_HEADING_UP_ZOOM
}

function locationHeadingFromDeviceOrientation(event: DeviceOrientationEventWithCompass) {
  if (typeof event.webkitCompassHeading === 'number' && Number.isFinite(event.webkitCompassHeading)) {
    return normalizeMapHeading(event.webkitCompassHeading)
  }
  if (typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
    return normalizeMapHeading(360 - event.alpha)
  }
  return null
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

function focusMapOnPlace(map: google.maps.Map, place: MapPlace) {
  focusMapOnPosition(map, { lat: place.lat, lng: place.lng })
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
  return Boolean(info.customLabel.trim() || info.duration.trim() || info.note.trim() || info.mode !== 'walk')
}

function groupConsecutiveTransportItems(items: PlannerItem[]): PlannerListDisplayItem[] {
  const groups: PlannerListDisplayItem[] = []
  let transportItems: PlannerItem[] = []

  const flushTransportItems = () => {
    if (transportItems.length === 0) return
    if (transportItems.length === 1) {
      groups.push({ type: 'item', item: transportItems[0] })
    } else {
      const key = `transport-group:${transportItems
        .map((item) => parseTransportItem(item)?.id ?? item)
        .join(':')}`
      groups.push({ type: 'transport-group', key, items: transportItems })
    }
    transportItems = []
  }

  items.forEach((item) => {
    if (isTransportItem(item)) {
      transportItems.push(item)
      return
    }
    flushTransportItems()
    groups.push({ type: 'item', item })
  })
  flushTransportItems()
  return groups
}

function transportGroupPreview(items: PlannerItem[]) {
  return items
    .map(parseTransportItem)
    .filter((info): info is TransportInfo => info !== null)
    .map((info) => [transportLabel(info), info.duration.trim()].filter(Boolean).join(' · '))
    .filter(Boolean)
    .join(' → ')
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

function transportNavigationPlaces(items: PlannerItem[], itemId: PlannerItem, placeById: Map<string, MapPlace>): TransportNavigationPlaces | null {
  const index = items.indexOf(itemId)
  if (index < 0) return null

  let from: MapPlace | null = null
  for (let i = index - 1; i >= 0; i -= 1) {
    if (isDayItem(items[i])) break
    const place = planItemPlace(items[i], placeById)
    if (place) {
      from = place
      break
    }
  }

  let to: MapPlace | null = null
  for (let i = index + 1; i < items.length; i += 1) {
    if (isDayItem(items[i])) break
    const place = planItemPlace(items[i], placeById)
    if (place) {
      to = place
      break
    }
  }

  return from && to ? { from, to } : null
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

  const query = id
    ? `id=${encodeURIComponent(id)}`
    : `${PLANNER_PREVIEW_PARAM}=${encodeURIComponent(viewToken ?? '')}`
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
    pre_departure?: unknown
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

  return (items.length > 0 || Object.keys(customPlaces).length > 0) && bookId
    ? {
        id: bookId,
        readToken: typeof data.read_token === 'string' ? data.read_token : null,
        readonly: data.readonly === true || Boolean(viewToken),
        updatedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
        items,
        notes,
        customPlaces,
        userLinks,
        preDeparture: data.pre_departure ? cleanPreDepartureChecklistStorage(data.pre_departure) : null,
      }
    : null
}

function cleanPlannerImages(value: unknown): PlannerCardImage[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []
    const item = raw as Record<string, unknown>
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    const placeId = typeof item.placeId === 'string' ? item.placeId.trim() : ''
    const url = typeof item.url === 'string' ? item.url.trim() : ''
    const width = typeof item.width === 'number' ? item.width : Number(item.width)
    const height = typeof item.height === 'number' ? item.height : Number(item.height)
    const createdAt = typeof item.createdAt === 'string' ? item.createdAt : ''
    if (!id || !placeId || !url || !Number.isFinite(width) || !Number.isFinite(height) || seen.has(id)) return []
    seen.add(id)
    return [{ id, placeId, url, width, height, createdAt }]
  })
}

function plannerImageOwnerFromSearch(search: string) {
  const token = new URLSearchParams(search).get(PLANNER_IMAGE_OWNER_PARAM)?.trim() ?? ''
  return /^[A-Za-z0-9_-]{24,96}$/.test(token) ? token : null
}

function plannerImageFunctionUrl(action?: string) {
  const base = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) return ''
  const url = new URL(`${base}/functions/v1/planner-images`)
  if (action) url.searchParams.set('action', action)
  return url.toString()
}

function plannerImageHeaders(ownerToken?: string) {
  const anonKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY ?? ''
  if (!anonKey) return {}
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    ...(ownerToken ? { 'x-planner-image-token': ownerToken } : {}),
  }
}

async function readPlannerImageResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as { images?: unknown; owner_token?: unknown; error?: unknown } | null
  if (!response.ok || !data) {
    return { images: null as PlannerCardImage[] | null, ownerToken: null, error: typeof data?.error === 'string' ? data.error : 'request_failed' }
  }
  return {
    images: cleanPlannerImages(data.images),
    ownerToken: typeof data.owner_token === 'string' ? data.owner_token : null,
    error: null,
  }
}

async function fetchPlannerImages(bookId: string, readToken: string | null) {
  const endpoint = plannerImageFunctionUrl()
  if (!endpoint || !bookId || !readToken) return null
  const url = new URL(endpoint)
  url.searchParams.set('bookId', bookId)
  url.searchParams.set('v', readToken)
  const result = await readPlannerImageResponse(await fetch(url.toString(), { headers: plannerImageHeaders() }))
  return result.images
}

async function claimPlannerImageOwner(bookId: string) {
  const endpoint = plannerImageFunctionUrl('claim')
  if (!endpoint || !bookId) return null
  const result = await readPlannerImageResponse(
    await fetch(endpoint, {
      method: 'POST',
      headers: { ...plannerImageHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId }),
    }),
  )
  return result.ownerToken
}

async function uploadPlannerImage(
  bookId: string,
  placeId: string,
  ownerToken: string,
  file: File,
  width: number,
  height: number,
) {
  const endpoint = plannerImageFunctionUrl('upload')
  if (!endpoint) return null
  const form = new FormData()
  form.set('bookId', bookId)
  form.set('placeId', placeId)
  form.set('width', String(width))
  form.set('height', String(height))
  form.set('image', file)
  return readPlannerImageResponse(
    await fetch(endpoint, {
      method: 'POST',
      headers: plannerImageHeaders(ownerToken),
      body: form,
    }),
  )
}

async function deletePlannerImage(bookId: string, imageId: string, ownerToken: string) {
  const endpoint = plannerImageFunctionUrl()
  if (!endpoint) return null
  return readPlannerImageResponse(
    await fetch(endpoint, {
      method: 'DELETE',
      headers: { ...plannerImageHeaders(ownerToken), 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, imageId }),
    }),
  )
}

async function copyPlannerImages(
  sourceBookId: string,
  sourceReadToken: string,
  targetBookId: string,
  targetOwnerToken: string,
) {
  const endpoint = plannerImageFunctionUrl('copy')
  if (!endpoint) return null
  return readPlannerImageResponse(
    await fetch(endpoint, {
      method: 'POST',
      headers: { ...plannerImageHeaders(targetOwnerToken), 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceBookId, sourceReadToken, targetBookId }),
    }),
  )
}

async function imageFromFile(file: File) {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type) || file.size <= 0 || file.size > PLANNER_IMAGE_SOURCE_MAX_BYTES) {
    throw new Error('unsupported_image')
  }
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('invalid_image'))
      element.src = objectUrl
    })
    const originalWidth = image.naturalWidth || image.width
    const originalHeight = image.naturalHeight || image.height
    if (!originalWidth || !originalHeight) throw new Error('invalid_image')

    let scale = Math.min(1, 1600 / Math.max(originalWidth, originalHeight))
    let quality = 0.84
    let blob: Blob | null = null
    let width = Math.max(1, Math.round(originalWidth * scale))
    let height = Math.max(1, Math.round(originalHeight * scale))
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('canvas_unavailable')
      context.drawImage(image, 0, 0, width, height)
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
      if (blob && blob.size <= PLANNER_IMAGE_MAX_BYTES) break
      scale *= 0.82
      quality = Math.max(0.58, quality - 0.08)
      width = Math.max(1, Math.round(originalWidth * scale))
      height = Math.max(1, Math.round(originalHeight * scale))
    }
    if (!blob || blob.size > PLANNER_IMAGE_MAX_BYTES) throw new Error('image_too_large')
    return {
      file: new File([blob], 'planner-photo.jpg', { type: 'image/jpeg' }),
      width,
      height,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function savePlannerBook(
  city: string,
  id: string | null,
  items: PlannerItem[],
  notes: Record<string, string>,
  customPlaces: Record<string, CustomPlannerPlace>,
  userLinks: Record<string, PlannerUserLink[]>,
  preDeparture: PreDepartureChecklistStorage,
) {
  const res = await fetch('/api/pass-planner/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      city,
      id,
      items,
      notes,
      custom_places: customPlaces,
      user_links: userLinks,
      pre_departure: serializePreDepartureChecklistStorage(preDeparture),
    }),
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

function elementTopWithinContainer(element: HTMLElement, container: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = element

  while (current && current !== container) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  if (current === container) return top

  const cRect = container.getBoundingClientRect()
  const eRect = element.getBoundingClientRect()
  return eRect.top - cRect.top + container.scrollTop
}

function scrollCardToContainerCenter(card: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  const container = card.closest('[data-planner-scroll-list="true"]') as HTMLElement | null
  if (!container) return

  const targetTop = elementTopWithinContainer(card, container) - (container.clientHeight / 2 - card.offsetHeight / 2)
  const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight)
  const nextScrollTop = Math.min(maxScrollTop, Math.max(0, targetTop))
  if (Math.abs(nextScrollTop - container.scrollTop) > 1) container.scrollTo({ top: nextScrollTop, behavior })
}

function scrollPlannerCardToFocusPosition(
  card: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
) {
  scrollCardToContainerCenter(card, behavior)
}

function cardIsNearlyOutsideScrollArea(card: HTMLElement, container: HTMLElement, visibleTolerance = 4) {
  const cRect = container.getBoundingClientRect()
  const eRect = card.getBoundingClientRect()
  const visibleTop = Math.max(eRect.top, cRect.top)
  const visibleBottom = Math.min(eRect.bottom, cRect.bottom)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  return visibleHeight <= visibleTolerance
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

let plannerModalTouchY = 0

function modalScrollableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.closest<HTMLElement>(`.${styles.linksModalBody}, .${styles.noteModalTextarea}, .${styles.noteReadOnly}`)
}

function canModalElementScroll(element: HTMLElement | false | null, deltaY: number) {
  if (!element) return false
  const scrollable = element.scrollHeight > element.clientHeight + 1
  if (!scrollable) return false
  if (deltaY < 0) return element.scrollTop + element.clientHeight < element.scrollHeight - 1
  if (deltaY > 0) return element.scrollTop > 1
  return true
}

function stopModalTouch(event: ReactTouchEvent<HTMLElement>) {
  event.stopPropagation()
  plannerModalTouchY = event.touches[0]?.clientY ?? plannerModalTouchY
}

function lockModalBackgroundTouch(event: ReactTouchEvent<HTMLElement>) {
  event.stopPropagation()
  const nextY = event.touches[0]?.clientY ?? plannerModalTouchY
  const deltaY = nextY - plannerModalTouchY
  plannerModalTouchY = nextY
  if (!canModalElementScroll(modalScrollableElement(event.target), deltaY) && event.cancelable) {
    event.preventDefault()
  }
}

function lockModalBackgroundWheel(event: ReactWheelEvent<HTMLElement>) {
  event.stopPropagation()
  if (!canModalElementScroll(modalScrollableElement(event.target), -event.deltaY) && event.cancelable) {
    event.preventDefault()
  }
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
  const links = useMemo(() => plannerMapLinks(place, userLinks), [place, userLinks])
  const naverLinks = useMemo(() => links.filter((link) => isNaverMapHref(link.href)), [links])
  const [resolvedNaverPlaceIds, setResolvedNaverPlaceIds] = useState<Record<string, string>>({})
  usePlannerBodyScrollLock(true)

  useEffect(() => {
    if (naverLinks.length === 0) return

    const controller = new AbortController()
    let cancelled = false
    Promise.all(
      naverLinks.map(async (link) => {
        const placeId = await resolveNaverMapUrlPlaceId(link.href, controller.signal)
        return [link.href, placeId] as const
      }),
    )
      .then((entries) => {
        if (cancelled) return
        setResolvedNaverPlaceIds(
          entries.reduce<Record<string, string>>((next, [href, placeId]) => {
            if (placeId) next[href] = placeId
            return next
          }, {}),
        )
      })
      .catch(() => {
        if (!cancelled) setResolvedNaverPlaceIds({})
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [naverLinks])

  return (
    <div
      className={styles.noteModalBackdrop}
      role="presentation"
      onTouchStart={stopModalTouch}
      onTouchMove={lockModalBackgroundTouch}
      onTouchEnd={stopModalTouch}
      onTouchCancel={stopModalTouch}
      onWheel={lockModalBackgroundWheel}
    >
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
            {links.map((link) => {
              const naverAppHref = isNaverMapHref(link.href)
                ? naverMapAppPlaceUrl(place, resolvedNaverPlaceIds[link.href] || naverMapPlaceIdFromUrl(link.href))
                : ''
              return (
                <a
                  key={`${link.label}-${link.href}`}
                  className={styles.plannerLinkChip}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    if (naverAppHref) openMobileMapApp(event, naverAppHref)
                  }}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

const PRE_DEPARTURE_CATEGORIES: PreDepartureChecklistCategory[] = [
  {
    id: 'essentials',
    label: '出行必備',
    items: [
      { id: 'passport', label: '護照' },
      { id: 'visa', label: '簽證' },
      { id: 'flight', label: '機票' },
      { id: 'accommodation', label: '住宿', resourceId: 'hotel' },
      { id: 'tickets', label: '票券', resourceId: 'ticket' },
      { id: 'money', label: '外幣/信用卡' },
    ],
  },
  {
    id: 'digital',
    label: '數位與上網',
    items: [
      { id: 'phone', label: '手機' },
      { id: 'esim', label: 'eSIM', resourceId: 'esim' },
      { id: 'charger', label: '充電器' },
      { id: 'cable', label: '充電線' },
      { id: 'power-bank', label: '行動電源' },
      { id: 'adapter', label: '轉接頭' },
      { id: 'earphones', label: '耳機' },
    ],
  },
  {
    id: 'clothing',
    label: '衣物配件',
    items: [
      { id: 'clothes', label: '衣褲' },
      { id: 'underwear', label: '內衣褲' },
      { id: 'sleepwear', label: '睡衣褲' },
      { id: 'shoes', label: '鞋襪' },
      { id: 'jacket', label: '外套' },
      { id: 'umbrella', label: '雨傘' },
    ],
  },
  {
    id: 'personal',
    label: '日用健康',
    items: [
      { id: 'toiletries', label: '盥洗用品' },
      { id: 'personal-medicine', label: '個人藥品' },
      { id: 'mask', label: '口罩' },
      { id: 'skincare', label: '化妝/保養品/防曬乳' },
      { id: 'shaver', label: '刮鬍機' },
      { id: 'glasses', label: '眼鏡/隱眼' },
      { id: 'shopping-bag', label: '購物袋' },
    ],
  },
  {
    id: 'japan-booking',
    label: '日本預訂',
    items: [
      { id: 'japan-shopping', label: '完美行購物', resourceId: 'shopping' },
      { id: 'japan-car-rental', label: '日本租車', resourceId: 'car-rental' },
    ],
  },
]
const ESIM_COUPON_CODE = 'JieJourneys'
const PRE_DEPARTURE_RESOURCES: Record<PreDepartureResourceId, PreDepartureResource> = {
  hotel: {
    toggleLabel: '訂房',
    links: [
      {
        label: 'Trip.com',
        href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
        event: 'planner_pre_departure_hotel_trip',
        platform: 'Trip',
      },
      {
        label: 'Agoda',
        href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw',
        event: 'planner_pre_departure_hotel_agoda',
        platform: 'Agoda',
      },
    ],
  },
  ticket: {
    toggleLabel: '購票',
    links: [
      {
        label: 'KKday',
        href: 'https://www.kkday.com/zh-tw/?cid=22312',
        event: 'planner_pre_departure_ticket_kkday',
        platform: 'KKDAY',
        promoCode: 'KKJIE94',
      },
      {
        label: 'Klook',
        href: 'https://www.klook.com/zh-TW/?aid=93798',
        event: 'planner_pre_departure_ticket_klook',
        platform: 'KLOOK',
        promoCode: 'JieJourneys',
      },
      {
        label: 'Trip.com',
        href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
        event: 'planner_pre_departure_ticket_trip',
        platform: 'Trip',
      },
    ],
  },
  esim: {
    toggleLabel: '優惠',
    links: [
      {
        label: '查看 eSIM 方案',
        href: 'https://esimconnect.com.tw/#/access/esimbuy?referencecode=jiejourneys',
        event: 'planner_esimconnect',
        platform: 'eSIM',
        promoCode: ESIM_COUPON_CODE,
      },
    ],
  },
  shopping: {
    toggleLabel: '優惠',
    links: [
      {
        label: '完美行購物',
        href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339',
        event: 'planner_pre_departure_wamazing_shopping',
        platform: 'WAmazing',
        promoCode: 'GGGT6XAA',
      },
    ],
  },
  'car-rental': {
    toggleLabel: '預訂',
    links: [
      {
        label: '日本合作租車',
        href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate',
        event: 'planner_pre_departure_tocoo_car_rental',
        platform: 'TOCOO',
        promoCode: 'K24ZW3',
      },
    ],
  },
}

async function savePreDepartureChecklistCloud(id: string, checklist: PreDepartureChecklistStorage) {
  const res = await fetch('/api/pass-planner/book', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pre_departure: serializePreDepartureChecklistStorage(checklist) }),
  })
  if (!res.ok) return null
  const data = (await res.json()) as { pre_departure?: unknown; updated_at?: unknown }
  return {
    checklist: cleanPreDepartureChecklistStorage(data.pre_departure),
    updatedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
  }
}

async function fetchPreDepartureChecklistCloud(id: string) {
  const res = await fetch(`/api/pass-planner/book?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { pre_departure?: unknown; updated_at?: unknown }
  if (!data.pre_departure) return null
  return {
    checklist: cleanPreDepartureChecklistStorage(data.pre_departure),
    updatedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
  }
}
const PRE_DEPARTURE_CATEGORY_IDS = new Set(PRE_DEPARTURE_CATEGORIES.map((category) => category.id))
const PRE_DEPARTURE_DEFAULT_ITEM_IDS = new Set(
  PRE_DEPARTURE_CATEGORIES.flatMap((category) => category.items.map((item) => item.id)),
)

function coordinateIsInJapan(lat: number, lng: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
  return (
    // 沖繩、八重山與奄美群島
    (lat >= 24 && lat <= 30.9 && lng >= 122.3 && lng <= 131.4) ||
    // 九州、四國與本州西南部（包含對馬）
    (lat >= 30.5 && lat <= 34.9 && lng >= 128.6 && lng <= 141.2) ||
    // 本州主要區域
    (lat >= 33 && lat <= 41.7 && lng >= 130.5 && lng <= 142.3) ||
    // 北海道
    (lat >= 41.2 && lat <= 45.8 && lng >= 139 && lng <= 146.3) ||
    // 小笠原群島
    (lat >= 24 && lat <= 28.6 && lng >= 140 && lng <= 143.8)
  )
}

function emptyPreDepartureChecklistStorage(): PreDepartureChecklistStorage {
  return { version: 2, travelers: [{ ...PRE_DEPARTURE_OWNER }], checked: {}, notes: {}, customItems: [], removedItemIds: {}, hiddenCategoryIds: {} }
}

function cleanPreDepartureChecklistStorage(value: unknown): PreDepartureChecklistStorage {
  const empty = emptyPreDepartureChecklistStorage()
  if (!value || typeof value !== 'object' || Array.isArray(value)) return empty
  const stored = value as Record<string, unknown>
  const travelers: PreDepartureTraveler[] = []
  const travelerIds = new Set<string>()
  if (Array.isArray(stored.travelers)) {
    stored.travelers.slice(0, 12).forEach((traveler) => {
      if (!traveler || typeof traveler !== 'object' || Array.isArray(traveler)) return
      const source = traveler as Record<string, unknown>
      const id = typeof source.id === 'string' ? source.id.trim().slice(0, 80) : ''
      const name = typeof source.name === 'string' ? source.name.trim().slice(0, 16) : ''
      if (!id.startsWith('traveler-') || !name || travelerIds.has(id)) return
      travelerIds.add(id)
      travelers.push({ id, name })
    })
  }
  if (travelers.length === 0) {
    travelerIds.add(PRE_DEPARTURE_OWNER.id)
    travelers.push({ ...PRE_DEPARTURE_OWNER })
  }
  const customItems: PreDepartureChecklistItem[] = []
  const customItemIds = new Set<string>()

  if (Array.isArray(stored.customItems)) {
    stored.customItems.slice(0, 80).forEach((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return
      const source = item as Record<string, unknown>
      const id = typeof source.id === 'string' ? source.id.trim().slice(0, 80) : ''
      const label = typeof source.label === 'string' ? source.label.trim().slice(0, 30) : ''
      const storedCategoryId = typeof source.categoryId === 'string' ? source.categoryId.trim() : ''
      const categoryId = PRE_DEPARTURE_CATEGORY_IDS.has(storedCategoryId) ? storedCategoryId : 'essentials'
      if (!id.startsWith('custom-') || !label || customItemIds.has(id)) return
      customItemIds.add(id)
      const scope: PreDepartureItemScope = 'personal'
      const assignedTravelerIds = Array.isArray(source.travelerIds)
        ? source.travelerIds.filter((travelerId): travelerId is string => typeof travelerId === 'string' && travelerIds.has(travelerId))
        : []
      customItems.push({
        id,
        label,
        custom: true,
        categoryId,
        scope,
        ...(scope === 'personal' && assignedTravelerIds.length > 0 ? { travelerIds: [...new Set(assignedTravelerIds)] } : {}),
      })
    })
  }

  const validItemIds = new Set([...PRE_DEPARTURE_DEFAULT_ITEM_IDS, ...customItemIds])
  const checked: Record<string, Record<string, true>> = {}
  const storedChecked =
    stored.checked && typeof stored.checked === 'object' && !Array.isArray(stored.checked)
      ? (stored.checked as Record<string, unknown>)
      : {}
  const hasTargetCheckedShape = Object.values(storedChecked).some(
    (target) => Boolean(target) && typeof target === 'object' && !Array.isArray(target),
  )
  if (hasTargetCheckedShape || stored.version === 2) {
    const validTargetIds = new Set(['shared', ...travelerIds])
    Object.entries(storedChecked).forEach(([targetId, rawItems]) => {
      if (!validTargetIds.has(targetId) || !rawItems || typeof rawItems !== 'object' || Array.isArray(rawItems)) return
      const targetItems = Object.fromEntries(
        Object.entries(rawItems as Record<string, unknown>)
          .filter(([itemId, isChecked]) => validItemIds.has(itemId) && isChecked === true)
          .map(([itemId]) => [itemId, true] as const),
      )
      if (Object.keys(targetItems).length > 0) checked[targetId] = targetItems
    })
    const formerlySharedItems = checked.shared
    if (formerlySharedItems) {
      travelers.forEach((traveler) => {
        checked[traveler.id] = { ...formerlySharedItems, ...(checked[traveler.id] ?? {}) }
      })
      delete checked.shared
    }
  } else {
    const legacyCheckedIds = new Set(
      Object.entries(storedChecked)
        .filter(([itemId, isChecked]) => validItemIds.has(itemId) && isChecked === true)
        .map(([itemId]) => itemId),
    )
    if (storedChecked.bookings === true) {
      legacyCheckedIds.add('flight')
      legacyCheckedIds.add('accommodation')
      legacyCheckedIds.add('tickets')
    }
    const legacyTraveler = travelers[0] ?? PRE_DEPARTURE_OWNER
    legacyCheckedIds.forEach((itemId) => {
      const targetId = legacyTraveler.id
      checked[targetId] = { ...(checked[targetId] ?? {}), [itemId]: true }
    })
  }
  const storedNotes =
    stored.notes && typeof stored.notes === 'object' && !Array.isArray(stored.notes)
      ? (stored.notes as Record<string, unknown>)
      : {}
  const currentGeneralNote = typeof storedNotes.general === 'string' ? storedNotes.general.trim() : ''
  const legacyGeneralNote = [
    ['flight', '機票'],
    ['accommodation', '住宿'],
    ['tickets', '票券'],
  ]
    .flatMap(([id, label]) => {
      const note = typeof storedNotes[id] === 'string' ? storedNotes[id].trim() : ''
      return note ? [`${label}：${note}`] : []
    })
    .join('\n')
  const generalNote = (currentGeneralNote || legacyGeneralNote).slice(0, 500)
  const notes: Record<string, string> = generalNote ? { general: generalNote } : {}
  const storedRemovedItemIds = Array.isArray(stored.removedItemIds)
    ? stored.removedItemIds
    : stored.removedItemIds && typeof stored.removedItemIds === 'object'
      ? Object.entries(stored.removedItemIds as Record<string, unknown>).filter(([, removed]) => removed === true).map(([id]) => id)
      : []
  const removedItemIds = Object.fromEntries(
    storedRemovedItemIds
      .filter((id): id is string => typeof id === 'string' && validItemIds.has(id))
      .map((id) => [id, true] as const),
  )
  const storedHiddenCategoryIds = Array.isArray(stored.hiddenCategoryIds)
    ? stored.hiddenCategoryIds
    : stored.hiddenCategoryIds && typeof stored.hiddenCategoryIds === 'object'
      ? Object.entries(stored.hiddenCategoryIds as Record<string, unknown>).filter(([, hidden]) => hidden === true).map(([id]) => id)
      : []
  const hiddenCategoryIds = Object.fromEntries(
    storedHiddenCategoryIds
      .filter((id): id is string => typeof id === 'string' && PRE_DEPARTURE_CATEGORY_IDS.has(id))
      .map((id) => [id, true] as const),
  )

  return { version: 2, travelers, checked, notes, customItems, removedItemIds, hiddenCategoryIds }
}

function serializePreDepartureChecklistStorage(value: PreDepartureChecklistStorage) {
  return {
    version: 2 as const,
    travelers: value.travelers,
    checked: value.checked,
    notes: value.notes,
    customItems: value.customItems,
    removedItemIds: Object.keys(value.removedItemIds),
    hiddenCategoryIds: Object.keys(value.hiddenCategoryIds),
  }
}

function encodePreDepartureTransfer(value: { bookId: string; checklist: PreDepartureChecklistStorage }) {
  const bytes = new TextEncoder().encode(JSON.stringify({ version: 1, ...value }))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function decodePreDepartureTransfer(value: string): { bookId: string; checklist: PreDepartureChecklistStorage } | null {
  try {
    const normalized = value.trim().replaceAll('-', '+').replaceAll('_', '/')
    if (!normalized || normalized.length > 12_000) return null
    const padded = `${normalized}${'='.repeat((4 - (normalized.length % 4)) % 4)}`
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const source = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>
    const bookId = typeof source.bookId === 'string' ? source.bookId.trim().slice(0, 32) : ''
    if (source.version !== 1 || !bookId) return null
    return { bookId, checklist: cleanPreDepartureChecklistStorage(source.checklist) }
  } catch {
    return null
  }
}

function PreDeparturePanel({
  categories,
  hiddenCategories,
  removedItems,
  checkedItems,
  notes,
  onToggle,
  onNoteChange,
  onAdd,
  onRemove,
  onHideCategory,
  onRestoreCategory,
  onRestoreItem,
  undoAction,
  onUndo,
  onTransfer,
  transferStatus,
  onFinish,
  onClose,
}: {
  categories: PreDepartureChecklistCategory[]
  hiddenCategories: PreDepartureChecklistCategory[]
  removedItems: PreDepartureChecklistItem[]
  checkedItems: Record<string, boolean>
  notes: Record<string, string>
  onToggle: (id: string) => void
  onNoteChange: (id: string, note: string) => void
  onAdd: (categoryId: string, label: string) => void
  onRemove: (id: string) => void
  onHideCategory: (categoryId: string, label: string) => void
  onRestoreCategory: (categoryId: string) => void
  onRestoreItem: (id: string) => void
  undoAction: PreDepartureUndoAction | null
  onUndo: () => void
  onTransfer?: () => void
  transferStatus: PreDepartureTransferStatus
  onFinish: () => void
  onClose: () => void
}) {
  const [customItemDraft, setCustomItemDraft] = useState('')
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null)
  const [expandedDetailItemId, setExpandedDetailItemId] = useState<string | null>(null)
  const [generalNoteOpen, setGeneralNoteOpen] = useState(false)
  const [pendingRemoveItem, setPendingRemoveItem] = useState<PreDepartureChecklistItem | null>(null)
  const [pendingRemoveCategory, setPendingRemoveCategory] = useState<PreDepartureChecklistCategory | null>(null)
  const [copiedPromoEvent, setCopiedPromoEvent] = useState<string | null>(null)
  const resourceItemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const resourceCollapseTimerRef = useRef<number | null>(null)
  usePlannerBodyScrollLock(true)
  const totalItemCount = categories.reduce((total, category) => total + category.items.length, 0)
  const checkedItemCount = categories.reduce(
    (total, category) => total + category.items.filter((item) => checkedItems[item.id]).length,
    0,
  )
  useEffect(() => {
    if (!copiedPromoEvent) return
    const timeout = window.setTimeout(() => setCopiedPromoEvent(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [copiedPromoEvent])

  useEffect(() => () => {
    if (resourceCollapseTimerRef.current != null) {
      window.clearTimeout(resourceCollapseTimerRef.current)
    }
  }, [])

  const scheduleExpandedResourceCollapseIfNearlyOutside = useCallback((container: HTMLDivElement) => {
    if (resourceCollapseTimerRef.current != null) {
      window.clearTimeout(resourceCollapseTimerRef.current)
    }
    resourceCollapseTimerRef.current = window.setTimeout(() => {
      const expandedItemId = expandedDetailItemId
      if (expandedItemId) {
        const item = resourceItemRefs.current[expandedItemId]
        if (item && cardIsNearlyOutsideScrollArea(item, container)) {
          setExpandedDetailItemId((current) => (current === expandedItemId ? null : current))
        }
      }
      resourceCollapseTimerRef.current = null
    }, 140)
  }, [expandedDetailItemId])

  const copyPromoCode = async (event: string, promoCode: string) => {
    try {
      await navigator.clipboard.writeText(promoCode)
      setCopiedPromoEvent(event)
    } catch {
      setCopiedPromoEvent(null)
    }
  }

  return (
    <>
    <div
      className={styles.noteModalBackdrop}
      role="presentation"
      onClick={onClose}
      onTouchStart={stopModalTouch}
      onTouchMove={lockModalBackgroundTouch}
      onTouchEnd={stopModalTouch}
      onTouchCancel={stopModalTouch}
      onWheel={lockModalBackgroundWheel}
      >
        <section
        className={`${styles.noteModal} ${styles.preDepartureModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pre-departure-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.noteModalHeader}>
          <div>
            <span className={styles.noteModalEyebrow}>行前準備</span>
            <h2 id="pre-departure-title">行前清單 <em>({checkedItemCount}/{totalItemCount})</em></h2>
          </div>
          <button className={styles.noteModalClose} type="button" onClick={onClose} aria-label="關閉行前準備">
            ×
          </button>
        </div>
        <div
          className={styles.linksModalBody}
          onScroll={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
          onTouchMove={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
          onWheel={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
        >
          <section className={styles.preDepartureSection}>
            <div className={styles.preDepartureStorageCard}>
              <div>
                <strong>清單自動存於這台裝置</strong>
                <span>下方會把景點行程存到雲端。</span>
              </div>
              {onTransfer ? (
                <button className={styles.preDepartureTransferButton} type="button" onClick={onTransfer}>
                  {transferStatus === 'copied' ? '連結已複製' : transferStatus === 'failed' ? '請再試一次' : '傳清單到手機'}
                </button>
              ) : null}
            </div>
            {transferStatus === 'copied' ? (
              <p className={styles.preDepartureTransferHint}>把連結傳到自己的手機開啟即可匯入；兩台裝置之後不會同步。</p>
            ) : transferStatus === 'imported' ? (
              <p className={styles.preDepartureTransferHint}>清單已存到這台裝置；之後會和原裝置分開保存。</p>
            ) : null}
            <section className={styles.preDepartureGeneralNote}>
              <button
                type="button"
                aria-expanded={generalNoteOpen}
                aria-controls="pre-departure-general-note"
                onClick={() => setGeneralNoteOpen((open) => !open)}
              >
                <span>
                  <strong>行前備忘</strong>
                  <small>{notes.general ? '已填寫，點擊可繼續編輯' : '點擊記錄航班、住宿或其他提醒'}</small>
                </span>
                <span className={styles.preDepartureGeneralNoteAction} aria-hidden="true">
                  {generalNoteOpen ? '收合' : notes.general ? '編輯' : '＋ 新增'}
                  <i>{generalNoteOpen ? '▴' : '▾'}</i>
                </span>
              </button>
              {generalNoteOpen ? (
                <div id="pre-departure-general-note" className={styles.preDepartureGeneralNoteField}>
                  <textarea
                    value={notes.general ?? ''}
                    maxLength={500}
                    rows={4}
                    placeholder="例如：BR123 09:30、飯店訂房編號、票券使用提醒……"
                    onChange={(event) => onNoteChange('general', event.target.value)}
                  />
                  <small>修改後自動儲存</small>
                </div>
              ) : null}
            </section>
            <div className={styles.preDepartureCategoryList}>
              {categories.map((category) => {
                const categoryCheckedCount = category.items.filter((item) => checkedItems[item.id]).length
                const addingItem = addingCategoryId === category.id
                return (
                  <section key={category.id} className={styles.preDepartureCategory}>
                    <div className={styles.preDepartureCategoryHeader}>
                      <h3>{category.label} <span>({categoryCheckedCount}/{category.items.length})</span></h3>
                      <div className={styles.preDepartureCategoryActions}>
                        <button
                          className={styles.preDepartureCategoryAdd}
                          type="button"
                          onClick={() => {
                            setCustomItemDraft('')
                            setExpandedDetailItemId(null)
                            setAddingCategoryId(category.id)
                          }}
                          aria-label={`新增${category.label}項目`}
                        >
                          ＋ 新增項目
                        </button>
                        <button
                          className={styles.preDepartureCategoryRemove}
                          type="button"
                          onClick={() => setPendingRemoveCategory(category)}
                          aria-label={`刪除${category.label}整個分類`}
                          title="刪除整個分類"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <ul className={styles.preDepartureChecklist}>
                      {category.items.map((item) => {
                        const resource = item.resourceId ? PRE_DEPARTURE_RESOURCES[item.resourceId] : null
                        const detailsExpanded = Boolean(resource && expandedDetailItemId === item.id)
                        return (
                          <li
                            key={item.id}
                            ref={(element) => {
                              resourceItemRefs.current[item.id] = element
                            }}
                            className={resource ? styles.preDepartureResourceItem : undefined}
                          >
                            <div className={styles.preDepartureItemRow}>
                              <label>
                                <input type="checkbox" checked={Boolean(checkedItems[item.id])} onChange={() => onToggle(item.id)} />
                                <span>{item.label}</span>
                              </label>
                              {resource ? (
                                <button
                                  className={styles.preDepartureResourceToggle}
                                  type="button"
                                  aria-expanded={detailsExpanded}
                                  aria-controls={`pre-departure-resource-${item.id}`}
                                  onClick={() => setExpandedDetailItemId((current) => (current === item.id ? null : item.id))}
                                >
                                  {resource.toggleLabel}
                                  <span aria-hidden="true">{detailsExpanded ? '▴' : '▾'}</span>
                                </button>
                              ) : null}
                              <button
                                className={styles.preDepartureRemove}
                                type="button"
                                onClick={() => setPendingRemoveItem(item)}
                                aria-label={`刪除${item.label}`}
                              >
                                ×
                              </button>
                            </div>
                            {detailsExpanded ? (
                              <aside
                                id={`pre-departure-resource-${item.id}`}
                                className={styles.preDepartureResourcePanel}
                                aria-label={`${item.label}詳細資料`}
                              >
                                <div className={styles.preDepartureResourceLinks}>
                                  {resource?.links.map((link) => (
                                    <div key={link.event} className={styles.preDepartureResourceEntry}>
                                      <a
                                        className={styles.preDepartureResourceLink}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-event={link.event}
                                        data-platform={link.platform}
                                        data-section="planner_pre_departure"
                                      >
                                        <strong>{link.label}</strong>
                                        <span>開啟 ↗</span>
                                      </a>
                                      {link.promoCode ? (
                                        <div className={styles.preDepartureResourcePromo}>
                                          <span>
                                            <small>優惠碼</small>
                                            <code>{link.promoCode}</code>
                                          </span>
                                          <button
                                            className={styles.preDeparturePromoCopy}
                                            type="button"
                                            onClick={() => void copyPromoCode(link.event, link.promoCode ?? '')}
                                          >
                                            {copiedPromoEvent === link.event ? '已複製' : '複製'}
                                          </button>
                                        </div>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              </aside>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>
                    {addingItem ? (
                      <form
                        className={styles.preDepartureAddForm}
                        onSubmit={(event) => {
                          event.preventDefault()
                          const label = customItemDraft.trim()
                          if (!label) return
                          onAdd(category.id, label)
                          setCustomItemDraft('')
                          setAddingCategoryId(null)
                        }}
                      >
                        <input
                          value={customItemDraft}
                          maxLength={30}
                          placeholder="新增自己的項目"
                          onChange={(event) => setCustomItemDraft(event.target.value)}
                          autoFocus
                        />
                        <button type="submit" disabled={!customItemDraft.trim()}>
                          新增
                        </button>
                        <button className={styles.preDepartureCancelButton} type="button" onClick={() => setAddingCategoryId(null)}>
                          取消
                        </button>
                      </form>
                    ) : null}
                  </section>
                )
              })}
            </div>
            {hiddenCategories.length > 0 ? (
              <details className={styles.preDepartureRestoreGroup}>
                <summary>已刪除分類（{hiddenCategories.length}）</summary>
                <div>
                  {hiddenCategories.map((category) => (
                    <button key={category.id} type="button" onClick={() => onRestoreCategory(category.id)}>
                      恢復「{category.label}」
                    </button>
                  ))}
                </div>
              </details>
            ) : null}
            {removedItems.length > 0 ? (
              <details className={styles.preDepartureRestoreGroup}>
                <summary>已刪除項目（{removedItems.length}）</summary>
                <div>
                  {removedItems.map((item) => (
                    <button key={item.id} type="button" onClick={() => onRestoreItem(item.id)}>
                      恢復「{item.label}」
                    </button>
                  ))}
                </div>
              </details>
            ) : null}
            {undoAction ? (
              <div className={styles.preDepartureUndo} role="status">
                <span>{undoAction.type === 'category' ? `已刪除「${undoAction.label}」分類` : `已刪除「${undoAction.label}」`}</span>
                <button type="button" onClick={onUndo}>復原</button>
              </div>
            ) : null}
            <button className={styles.preDepartureDoneButton} type="button" onClick={onFinish}>
              完成並儲存景點行程
            </button>
          </section>
        </div>
      </section>
    </div>
    {pendingRemoveItem ? (
      <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingRemoveItem(null)}>
        <section
          className={styles.confirmDialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-pre-departure-item-title"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 id="delete-pre-departure-item-title">刪除「{pendingRemoveItem.label}」？</h2>
          <p>會從行前清單移除，之後仍可從「已刪除項目」恢復。</p>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.confirmSecondary} onClick={() => setPendingRemoveItem(null)}>
              取消
            </button>
            <button
              type="button"
              className={styles.confirmDanger}
              onClick={() => {
                onRemove(pendingRemoveItem.id)
                setExpandedDetailItemId(null)
                setPendingRemoveItem(null)
              }}
            >
              確認刪除
            </button>
          </div>
        </section>
      </div>
    ) : null}
    {pendingRemoveCategory ? (
      <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingRemoveCategory(null)}>
        <section
          className={styles.confirmDialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-pre-departure-category-title"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 id="delete-pre-departure-category-title">刪除「{pendingRemoveCategory.label}」整個分類？</h2>
          <p>裡面的 {pendingRemoveCategory.items.length} 個項目會一起移除，之後仍可從「已刪除分類」恢復。</p>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.confirmSecondary} onClick={() => setPendingRemoveCategory(null)}>
              取消
            </button>
            <button
              type="button"
              className={styles.confirmDanger}
              onClick={() => {
                onHideCategory(pendingRemoveCategory.id, pendingRemoveCategory.label)
                setExpandedDetailItemId(null)
                setAddingCategoryId(null)
                setPendingRemoveCategory(null)
              }}
            >
              全部刪除
            </button>
          </div>
        </section>
      </div>
    ) : null}
    </>
  )
}

function preDepartureItemScope(item: PreDepartureChecklistItem): PreDepartureItemScope {
  return item.scope === 'shared' ? 'shared' : 'personal'
}

function preDepartureItemTravelerIds(item: PreDepartureChecklistItem, travelers: PreDepartureTraveler[]) {
  if (preDepartureItemScope(item) === 'shared') return []
  const assignedIds = item.travelerIds?.filter((id) => travelers.some((traveler) => traveler.id === id)) ?? []
  return assignedIds.length > 0 ? assignedIds : travelers.map((traveler) => traveler.id)
}

function PreDeparturePanelV2({
  categories,
  travelers,
  activeTargetId,
  checkedItems,
  notes,
  readOnly,
  cloudEnabled,
  onActiveTargetChange,
  onToggle,
  onNoteChange,
  onAdd,
  onRemove,
  onHideCategory,
  onAddTraveler,
  onRenameTraveler,
  onRemoveTraveler,
  onSave,
  onClose,
}: {
  categories: PreDepartureChecklistCategory[]
  travelers: PreDepartureTraveler[]
  activeTargetId: string
  checkedItems: Record<string, Record<string, true>>
  notes: Record<string, string>
  readOnly: boolean
  cloudEnabled: boolean
  onActiveTargetChange: (targetId: string) => void
  onToggle: (targetId: string, itemId: string) => void
  onNoteChange: (id: string, note: string) => void
  onAdd: (categoryId: string, label: string) => void
  onRemove: (id: string) => void
  onHideCategory: (categoryId: string, label: string) => void
  onAddTraveler: (name: string) => void
  onRenameTraveler: (id: string, name: string) => void
  onRemoveTraveler: (id: string) => void
  onSave: () => Promise<boolean> | boolean
  onClose: () => void
}) {
  const [customItemDraft, setCustomItemDraft] = useState('')
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null)
  const [expandedDetailItemId, setExpandedDetailItemId] = useState<string | null>(null)
  const [generalNoteOpen, setGeneralNoteOpen] = useState(false)
  const [generalNoteInitialValue, setGeneralNoteInitialValue] = useState('')
  const [generalNoteSaveStatus, setGeneralNoteSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [travelerFormOpen, setTravelerFormOpen] = useState(false)
  const [travelerDraft, setTravelerDraft] = useState('')
  const [renamingTravelerId, setRenamingTravelerId] = useState<string | null>(null)
  const [renameTravelerDraft, setRenameTravelerDraft] = useState('')
  const [pendingRemoveTraveler, setPendingRemoveTraveler] = useState<PreDepartureTraveler | null>(null)
  const [pendingRemoveItem, setPendingRemoveItem] = useState<PreDepartureChecklistItem | null>(null)
  const [pendingRemoveCategory, setPendingRemoveCategory] = useState<PreDepartureChecklistCategory | null>(null)
  const [copiedPromoEvent, setCopiedPromoEvent] = useState<string | null>(null)
  const [manualSaveStatus, setManualSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const resourceItemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const resourceCollapseTimerRef = useRef<number | null>(null)
  const resourceCollapseAnchorRef = useRef<{
    container: HTMLDivElement
    element: HTMLElement
    top: number
  } | null>(null)
  usePlannerBodyScrollLock(true)

  const activeTraveler = travelers.find((traveler) => traveler.id === activeTargetId) ?? null
  const itemTargets = useCallback((item: PreDepartureChecklistItem) => {
    if (preDepartureItemScope(item) === 'shared') return ['shared']
    return preDepartureItemTravelerIds(item, travelers)
  }, [travelers])
  const itemVisible = useCallback((item: PreDepartureChecklistItem) => {
    return itemTargets(item).includes(activeTargetId)
  }, [activeTargetId, itemTargets])
  const visibleCategories = useMemo(
    () => categories
      .map((category) => ({ ...category, items: category.items.filter(itemVisible) }))
      .filter((category) => !readOnly || category.items.length > 0),
    [categories, itemVisible, readOnly],
  )
  const visibleSlots = useMemo(
    () => visibleCategories.flatMap((category) => category.items.flatMap((item) => {
      const targets = itemTargets(item)
      return targets.includes(activeTargetId) ? [{ itemId: item.id, targetId: activeTargetId }] : []
    })),
    [activeTargetId, itemTargets, visibleCategories],
  )
  const checkedItemCount = visibleSlots.filter(({ itemId, targetId }) => checkedItems[targetId]?.[itemId]).length
  const generalNoteDirty = generalNoteOpen && (notes.general ?? '') !== generalNoteInitialValue

  useEffect(() => {
    if (!copiedPromoEvent) return
    const timeout = window.setTimeout(() => setCopiedPromoEvent(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [copiedPromoEvent])

  useEffect(() => {
    if (manualSaveStatus !== 'saved' && manualSaveStatus !== 'error') return
    const timeout = window.setTimeout(() => setManualSaveStatus('idle'), 1800)
    return () => window.clearTimeout(timeout)
  }, [manualSaveStatus])

  useEffect(() => () => {
    if (resourceCollapseTimerRef.current != null) window.clearTimeout(resourceCollapseTimerRef.current)
  }, [])

  useLayoutEffect(() => {
    const anchor = resourceCollapseAnchorRef.current
    if (!anchor) return
    resourceCollapseAnchorRef.current = null
    const nextTop = anchor.element.getBoundingClientRect().top
    const offset = nextTop - anchor.top
    if (Math.abs(offset) > 1) anchor.container.scrollTop += offset
  }, [expandedDetailItemId])

  const scheduleExpandedResourceCollapseIfNearlyOutside = useCallback((container: HTMLDivElement) => {
    if (resourceCollapseTimerRef.current != null) {
      window.clearTimeout(resourceCollapseTimerRef.current)
    }
    resourceCollapseTimerRef.current = window.setTimeout(() => {
      if (expandedDetailItemId) {
        const item = resourceItemRefs.current[expandedDetailItemId]
        if (item && cardIsNearlyOutsideScrollArea(item, container)) {
          const containerRect = container.getBoundingClientRect()
          const visibleAnchor = Array.from(
            container.querySelectorAll<HTMLElement>('[data-pre-departure-item-id]'),
          ).find((candidate) => {
            if (candidate === item) return false
            const rect = candidate.getBoundingClientRect()
            return rect.bottom > containerRect.top + 8 && rect.top < containerRect.bottom - 8
          })
          if (visibleAnchor) {
            resourceCollapseAnchorRef.current = {
              container,
              element: visibleAnchor,
              top: visibleAnchor.getBoundingClientRect().top,
            }
          }
          setExpandedDetailItemId((current) => (current === expandedDetailItemId ? null : current))
        }
      }
      resourceCollapseTimerRef.current = null
    }, 140)
  }, [expandedDetailItemId])

  const copyPromoCode = async (event: string, promoCode: string) => {
    try {
      await navigator.clipboard.writeText(promoCode)
      setCopiedPromoEvent(event)
    } catch {
      setCopiedPromoEvent(null)
    }
  }

  const openAddItem = (categoryId: string) => {
    setCustomItemDraft('')
    setExpandedDetailItemId(null)
    setAddingCategoryId(categoryId)
  }

  const toggleOrSaveGeneralNote = async () => {
    if (!generalNoteOpen) {
      setGeneralNoteInitialValue(notes.general ?? '')
      setGeneralNoteSaveStatus('idle')
      setGeneralNoteOpen(true)
      return
    }
    if (!generalNoteDirty) {
      setGeneralNoteOpen(false)
      return
    }
    if (!cloudEnabled) {
      setGeneralNoteInitialValue(notes.general ?? '')
      setGeneralNoteOpen(false)
      return
    }
    if (generalNoteSaveStatus === 'saving') return
    setGeneralNoteSaveStatus('saving')
    const saved = await Promise.resolve(onSave()).catch(() => false)
    if (!saved) {
      setGeneralNoteSaveStatus('error')
      return
    }
    setGeneralNoteInitialValue(notes.general ?? '')
    setGeneralNoteSaveStatus('idle')
    setGeneralNoteOpen(false)
  }

  return (
    <>
      <div
        className={styles.noteModalBackdrop}
        role="presentation"
        onClick={onClose}
        onTouchStart={stopModalTouch}
        onTouchMove={lockModalBackgroundTouch}
        onTouchEnd={stopModalTouch}
        onTouchCancel={stopModalTouch}
        onWheel={lockModalBackgroundWheel}
      >
        <section
          className={`${styles.noteModal} ${styles.preDepartureModal}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pre-departure-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.noteModalHeader}>
            <div>
              <span className={styles.noteModalEyebrow}>行前準備</span>
              <h2 id="pre-departure-title">行前清單 <em>({checkedItemCount}/{visibleSlots.length})</em></h2>
            </div>
            <button className={styles.noteModalClose} type="button" onClick={onClose} aria-label="關閉行前準備">×</button>
          </div>
          <div
            className={styles.linksModalBody}
            onScroll={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
            onTouchMove={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
            onWheel={(event) => scheduleExpandedResourceCollapseIfNearlyOutside(event.currentTarget)}
          >
            <section className={styles.preDepartureSection}>
              <section className={styles.preDepartureTravelers} aria-label="切換清單">
                <div className={styles.preDepartureTravelerTabs}>
                  {travelers.map((traveler) => (
                    <button key={traveler.id} type="button" className={activeTargetId === traveler.id ? styles.preDepartureTravelerTabActive : undefined} onClick={() => onActiveTargetChange(traveler.id)}>{traveler.name}</button>
                  ))}
                  {!readOnly && travelers.length < 12 ? (
                    <button type="button" className={styles.preDepartureAddTravelerButton} onClick={() => { setTravelerDraft(''); setTravelerFormOpen(true) }}>＋ 旅伴</button>
                  ) : null}
                </div>
                {!readOnly && activeTraveler && activeTraveler.id !== PRE_DEPARTURE_OWNER.id ? (
                  <div className={styles.preDepartureTravelerManage}>
                    {renamingTravelerId === activeTraveler.id ? (
                      <form onSubmit={(event) => { event.preventDefault(); const name = renameTravelerDraft.trim(); if (!name) return; onRenameTraveler(activeTraveler.id, name); setRenamingTravelerId(null) }}>
                        <input value={renameTravelerDraft} maxLength={16} onChange={(event) => setRenameTravelerDraft(event.target.value)} />
                        <button type="submit" disabled={!renameTravelerDraft.trim()}>儲存</button>
                        <button type="button" onClick={() => setRenamingTravelerId(null)}>取消</button>
                      </form>
                    ) : (
                      <><span>正在看「{activeTraveler.name}」的個人清單</span><button type="button" onClick={() => { setRenameTravelerDraft(activeTraveler.name); setRenamingTravelerId(activeTraveler.id) }}>改名</button><button type="button" className={styles.preDepartureTravelerDelete} onClick={() => setPendingRemoveTraveler(activeTraveler)}>刪除</button></>
                    )}
                  </div>
                ) : null}
                {!readOnly && travelerFormOpen ? (
                  <form className={styles.preDepartureTravelerForm} onSubmit={(event) => { event.preventDefault(); const name = travelerDraft.trim(); if (!name) return; onAddTraveler(name); setTravelerDraft(''); setTravelerFormOpen(false) }}>
                    <input value={travelerDraft} maxLength={16} placeholder="旅伴名稱，例如：小明" onChange={(event) => setTravelerDraft(event.target.value)} />
                    <button type="submit" disabled={!travelerDraft.trim()}>加入</button>
                    <button type="button" onClick={() => setTravelerFormOpen(false)}>取消</button>
                  </form>
                ) : null}
                {!readOnly && travelers.length === 1 ? <p className={styles.preDepartureTravelerHint}>加入旅伴後，每個人會有自己的勾選進度。</p> : null}
              </section>

              <section className={styles.preDepartureGeneralNote}>
                <button
                  type="button"
                  aria-label={generalNoteOpen ? generalNoteDirty ? '儲存行前備忘' : '收合行前備忘' : '開啟行前備忘'}
                  aria-expanded={generalNoteOpen}
                  aria-controls="pre-departure-general-note"
                  onClick={() => void toggleOrSaveGeneralNote()}
                >
                  <span><strong>行前備忘</strong><small>{notes.general ? '已填寫，點擊查看或編輯' : '航班、訂房編號與其他提醒'}</small></span>
                  <span className={`${styles.preDepartureGeneralNoteAction} ${generalNoteOpen && !generalNoteDirty ? styles.preDepartureGeneralNoteClose : ''}`} aria-hidden="true">
                    {generalNoteOpen
                      ? generalNoteDirty
                        ? generalNoteSaveStatus === 'saving' ? '儲存中…' : generalNoteSaveStatus === 'error' ? '再試一次' : '儲存'
                        : '×'
                      : notes.general ? '查看 ▾' : '＋ 新增 ▾'}
                  </span>
                </button>
                {generalNoteOpen ? (
                  <div id="pre-departure-general-note" className={styles.preDepartureGeneralNoteField}>
                    <textarea value={notes.general ?? ''} maxLength={500} rows={4} readOnly={readOnly} placeholder="例如：BR123 09:30、飯店訂房編號、票券提醒……" onChange={(event) => onNoteChange('general', event.target.value)} />
                    {!readOnly ? <small>修改後自動儲存</small> : null}
                  </div>
                ) : null}
              </section>

              <div className={styles.preDepartureCategoryList}>
                {visibleCategories.map((category) => {
                  const categorySlots = category.items.flatMap((item) => {
                    const targets = itemTargets(item)
                    return targets.includes(activeTargetId) ? [{ itemId: item.id, targetId: activeTargetId }] : []
                  })
                  const categoryCheckedCount = categorySlots.filter(({ itemId, targetId }) => checkedItems[targetId]?.[itemId]).length
                  const addingItem = addingCategoryId === category.id
                  return (
                    <section key={category.id} className={styles.preDepartureCategory}>
                      <div className={styles.preDepartureCategoryHeader}>
                        <h3>{category.label} <span>({categoryCheckedCount}/{categorySlots.length})</span></h3>
                        {!readOnly ? (
                          <div className={styles.preDepartureCategoryActions}>
                            <button className={styles.preDepartureCategoryAdd} type="button" onClick={() => openAddItem(category.id)} aria-label={`新增${category.label}項目`}>＋ 新增</button>
                            <button className={styles.preDepartureCategoryRemove} type="button" onClick={() => setPendingRemoveCategory(category)} aria-label={`刪除${category.label}整個分類`}>×</button>
                          </div>
                        ) : null}
                      </div>
                      {addingItem ? (
                        <form className={styles.preDepartureAddForm} onSubmit={(event) => { event.preventDefault(); const label = customItemDraft.trim(); if (!label) return; onAdd(category.id, label); setCustomItemDraft(''); setAddingCategoryId(null) }}>
                          <input value={customItemDraft} maxLength={30} placeholder="要準備什麼？" onChange={(event) => setCustomItemDraft(event.target.value)} />
                          <button type="submit" disabled={!customItemDraft.trim()}>新增</button><button className={styles.preDepartureCancelButton} type="button" onClick={() => setAddingCategoryId(null)}>取消</button>
                        </form>
                      ) : null}
                      {category.items.length === 0 ? <p className={styles.preDepartureEmptyCategory}>這個分類目前沒有項目</p> : null}
                      <ul className={styles.preDepartureChecklist}>
                        {category.items.map((item) => {
                          const resource = item.resourceId ? PRE_DEPARTURE_RESOURCES[item.resourceId] : null
                          const detailsExpanded = Boolean(resource && expandedDetailItemId === item.id)
                          return (
                            <li key={item.id} data-pre-departure-item-id={item.id} ref={(element) => { resourceItemRefs.current[item.id] = element }} className={resource ? styles.preDepartureResourceItem : undefined}>
                              <div className={styles.preDepartureItemRow}>
                                <label><input type="checkbox" disabled={readOnly} checked={Boolean(checkedItems[activeTargetId]?.[item.id])} onChange={() => onToggle(activeTargetId, item.id)} /><span>{item.label}</span></label>
                                {resource ? <button className={`${styles.preDepartureResourceToggle} ${detailsExpanded ? styles.preDepartureResourceClose : ''}`} type="button" aria-label={detailsExpanded ? `收合${item.label}詳細資料` : undefined} aria-expanded={detailsExpanded} aria-controls={`pre-departure-resource-${item.id}`} onClick={() => setExpandedDetailItemId((current) => current === item.id ? null : item.id)}>{detailsExpanded ? '×' : <>{resource.toggleLabel}<span aria-hidden="true">▾</span></>}</button> : null}
                                {!readOnly ? <button className={styles.preDepartureRemove} type="button" onClick={() => setPendingRemoveItem(item)} aria-label={`刪除${item.label}`}>×</button> : null}
                              </div>
                              {detailsExpanded ? (
                                <aside id={`pre-departure-resource-${item.id}`} className={styles.preDepartureResourcePanel} aria-label={`${item.label}詳細資料`}>
                                  <div className={styles.preDepartureResourceLinks}>
                                    {resource?.links.map((link) => (
                                      <div key={link.event} className={styles.preDepartureResourceEntry}>
                                        <a className={styles.preDepartureResourceLink} href={link.href} target="_blank" rel="noopener noreferrer" data-event={link.event} data-platform={link.platform} data-section="planner_pre_departure"><strong>{link.label}</strong><span>開啟 ↗</span></a>
                                        {link.promoCode ? <div className={styles.preDepartureResourcePromo}><span><small>優惠碼</small><code>{link.promoCode}</code></span><button className={styles.preDeparturePromoCopy} type="button" onClick={() => void copyPromoCode(link.event, link.promoCode ?? '')}>{copiedPromoEvent === link.event ? '已複製' : '複製'}</button></div> : null}
                                      </div>
                                    ))}
                                  </div>
                                </aside>
                              ) : null}
                            </li>
                          )
                        })}
                      </ul>
                    </section>
                  )
                })}
              </div>

            </section>
          </div>
          <div className={styles.preDepartureSaveBar}>
            {readOnly ? (
              <button className={styles.preDepartureDoneButton} type="button" onClick={onClose}>關閉</button>
            ) : (
              <button
                className={styles.preDepartureDoneButton}
                type="button"
                disabled={manualSaveStatus === 'saving'}
                onClick={() => {
                  if (manualSaveStatus === 'saving') return
                  setManualSaveStatus('saving')
                  void Promise.resolve(onSave())
                    .then((saved) => setManualSaveStatus(saved ? 'saved' : 'error'))
                    .catch(() => setManualSaveStatus('error'))
                }}
              >
                {manualSaveStatus === 'saving'
                  ? '儲存中…'
                  : manualSaveStatus === 'saved'
                    ? '已儲存'
                    : manualSaveStatus === 'error'
                      ? '儲存失敗，請再試一次'
                      : cloudEnabled ? '儲存' : '儲存景點行程與清單'}
              </button>
            )}
          </div>
        </section>
      </div>

      {pendingRemoveItem ? <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingRemoveItem(null)}><section className={styles.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="delete-pre-departure-item-v2-title" onClick={(event) => event.stopPropagation()}><h2 id="delete-pre-departure-item-v2-title">刪除「{pendingRemoveItem.label}」？</h2><p>會直接從所有人的行前清單刪除。</p><div className={styles.confirmActions}><button type="button" className={styles.confirmSecondary} onClick={() => setPendingRemoveItem(null)}>取消</button><button type="button" className={styles.confirmDanger} onClick={() => { onRemove(pendingRemoveItem.id); setExpandedDetailItemId(null); setPendingRemoveItem(null) }}>確認刪除</button></div></section></div> : null}
      {pendingRemoveCategory ? <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingRemoveCategory(null)}><section className={styles.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="delete-pre-departure-category-v2-title" onClick={(event) => event.stopPropagation()}><h2 id="delete-pre-departure-category-v2-title">刪除「{pendingRemoveCategory.label}」整個分類？</h2><p>分類會直接從所有人的清單刪除。</p><div className={styles.confirmActions}><button type="button" className={styles.confirmSecondary} onClick={() => setPendingRemoveCategory(null)}>取消</button><button type="button" className={styles.confirmDanger} onClick={() => { onHideCategory(pendingRemoveCategory.id, pendingRemoveCategory.label); setExpandedDetailItemId(null); setAddingCategoryId(null); setPendingRemoveCategory(null) }}>全部刪除</button></div></section></div> : null}
      {pendingRemoveTraveler ? <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingRemoveTraveler(null)}><section className={styles.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="delete-pre-departure-traveler-title" onClick={(event) => event.stopPropagation()}><h2 id="delete-pre-departure-traveler-title">刪除旅伴「{pendingRemoveTraveler.name}」？</h2><p>這位旅伴的勾選進度會一起刪除；其他人的清單不受影響。</p><div className={styles.confirmActions}><button type="button" className={styles.confirmSecondary} onClick={() => setPendingRemoveTraveler(null)}>取消</button><button type="button" className={styles.confirmDanger} onClick={() => { onRemoveTraveler(pendingRemoveTraveler.id); setPendingRemoveTraveler(null) }}>確認刪除</button></div></section></div> : null}
    </>
  )
}

function isNaverMapHref(href: string) {
  const normalized = href.trim().toLowerCase()
  return normalized.includes('naver.me') || normalized.includes('map.naver.com')
}

function isGoogleMapHref(href: string) {
  const normalized = href.trim().toLowerCase()
  return normalized.includes('maps.app.goo.gl') || /google\.[^/]+\/maps(?:[/?]|$)/.test(normalized)
}

function openPlannerMapLink(place: MapPlace, link: { href: string }) {
  const naverAppHref = isNaverMapHref(link.href)
    ? naverMapAppPlaceUrl(place, naverMapPlaceIdFromUrl(link.href))
    : ''
  if (naverAppHref && openMobileMapAppHref(naverAppHref)) return
  window.open(link.href, '_blank', 'noopener,noreferrer')
}

function isPlannerUserMapLink(href: string, label = '') {
  if (label.trim().startsWith('備選｜')) return false
  return isNaverMapHref(href) || isGoogleMapHref(href)
}

function plannerMapLinks(place: MapPlace, userLinks: PlannerUserLink[] = []) {
  const naverUrl = naverMapUrl(place)
  const userMapLinks = userLinks.filter((link) => isPlannerUserMapLink(link.href, link.label))
  const userGoogleMapLink = userMapLinks.find((link) => isGoogleMapHref(link.href))
  const userNaverMapLink = userMapLinks.find((link) => isNaverMapHref(link.href))
  const links = [
    { label: 'Google', href: userGoogleMapLink?.href.trim() || googleMapsPinUrl(place) },
    ...(userNaverMapLink || naverUrl
      ? [{ label: 'Naver', href: userNaverMapLink?.href.trim() || naverUrl || '' }]
      : []),
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
            openPlannerMapLink(place, links[0])
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
  images,
  imageUploadEnabled,
  imageBusy,
  onAddImage,
  onRemoveImage,
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
  images: PlannerCardImage[]
  imageUploadEnabled: boolean
  imageBusy: boolean
  onAddImage: (file: File) => Promise<void>
  onRemoveImage: (imageId: string) => Promise<void>
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
  const [openPanel, setOpenPanel] = useState<'note' | 'links' | 'map' | 'images' | null>(null)
  const [linkLabel, setLinkLabel] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const [draftNote, setDraftNote] = useState(note)
  const [noteDeleteConfirm, setNoteDeleteConfirm] = useState(false)
  const [pendingUserLinkDelete, setPendingUserLinkDelete] = useState<{ index: number; label: string } | null>(null)
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
  const generalUserLinks = userLinks.filter((link) => !isPlannerUserMapLink(link.href, link.label))
  const visibleUserLinkCount = generalUserLinks.filter((link) => !actionLinkKeys.has(link.label.trim() + '::' + link.href.trim())).length
  const userLinkCount = generalUserLinks.length
  const displayLinkCount = visibleUserLinkCount + customActionLinkCount
  const hasAnyLinks = actionLinkCount + userLinkCount > 0
  const imageCount = images.length
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

  usePlannerBodyScrollLock(Boolean(openPanel || noteDeleteConfirm || pendingUserLinkDelete))

  useEffect(() => {
    if (!openPanel) return
    const focusId = window.setTimeout(() => {
      if (openPanel === 'note') noteTextareaRef.current?.focus({ preventScroll: true })
    }, 160)
    return () => {
      window.clearTimeout(focusId)
    }
  }, [openPanel])

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
          className={`${styles.iconLink} ${imageCount > 0 ? styles.iconLinkActive : ''}`}
          type="button"
          onClick={() => setOpenPanel((panel) => (panel === 'images' ? null : 'images'))}
        >
          照片{imageCount > 0 ? ` ${imageCount}` : ''}
        </button>
        <button
          className={styles.iconLink}
          type="button"
          onClick={() => {
            const links = plannerMapLinks(place, userLinks)
            if (links.length === 1) {
              openPlannerMapLink(place, links[0])
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
        <div
          className={styles.noteModalBackdrop}
          role="presentation"
          onTouchStart={stopModalTouch}
          onTouchMove={lockModalBackgroundTouch}
          onTouchEnd={stopModalTouch}
          onTouchCancel={stopModalTouch}
          onWheel={lockModalBackgroundWheel}
        >
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
          onRequestRemoveUserLink={(index, link) => setPendingUserLinkDelete({ index, label: link.label })}
          onClose={() => setOpenPanel(null)}
          readOnly={readOnly}
        />
      ) : null}
      {openPanel === 'images' ? (
        <PlannerImagesPanel
          panelRef={detailElementRef}
          placeName={displayName}
          images={images}
          imageUploadEnabled={imageUploadEnabled}
          imageBusy={imageBusy}
          onAddImage={onAddImage}
          onRemoveImage={onRemoveImage}
          onClose={() => setOpenPanel(null)}
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
      ) : null}
      {pendingUserLinkDelete ? (
        <div className={styles.confirmBackdrop} role="presentation" onClick={() => setPendingUserLinkDelete(null)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-user-link-${itemId}`}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={`delete-user-link-${itemId}`}>刪除連結？</h2>
            <p>「{pendingUserLinkDelete.label}」會從這張卡片移除。</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmSecondary} onClick={() => setPendingUserLinkDelete(null)}>
                取消
              </button>
              <button
                type="button"
                className={styles.confirmDanger}
                onClick={() => {
                  onRemoveUserLink(pendingUserLinkDelete.index)
                  setPendingUserLinkDelete(null)
                }}
              >
                確認刪除
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

function PlannerImagesPanel({
  panelRef,
  placeName,
  images,
  imageUploadEnabled,
  imageBusy,
  onAddImage,
  onRemoveImage,
  onClose,
}: {
  panelRef: RefObject<HTMLDivElement | null>
  placeName: string
  images: PlannerCardImage[]
  imageUploadEnabled: boolean
  imageBusy: boolean
  onAddImage: (file: File) => Promise<void>
  onRemoveImage: (imageId: string) => Promise<void>
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const [imageActualSize, setImageActualSize] = useState(false)
  const activeImage = activeImageIndex === null ? null : images[activeImageIndex] ?? null
  usePlannerBodyScrollLock(true)

  useEffect(() => {
    if (!activeImage) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImageIndex(null)
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setImageActualSize(false)
        setActiveImageIndex((index) => (index === null ? 0 : (index - 1 + images.length) % images.length))
      }
      if (event.key === 'ArrowRight' && images.length > 1) {
        setImageActualSize(false)
        setActiveImageIndex((index) => (index === null ? 0 : (index + 1) % images.length))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeImage, images.length])

  const openImage = (index: number) => {
    setImageActualSize(false)
    setActiveImageIndex(index)
  }

  const showPreviousImage = () => {
    setImageActualSize(false)
    setActiveImageIndex((index) => (index === null ? 0 : (index - 1 + images.length) % images.length))
  }

  const showNextImage = () => {
    setImageActualSize(false)
    setActiveImageIndex((index) => (index === null ? 0 : (index + 1) % images.length))
  }

  return (
    <div
      className={styles.noteModalBackdrop}
      role="presentation"
      onTouchStart={stopModalTouch}
      onTouchMove={lockModalBackgroundTouch}
      onTouchEnd={stopModalTouch}
      onTouchCancel={stopModalTouch}
      onWheel={lockModalBackgroundWheel}
    >
      <section
        ref={panelRef}
        className={`${styles.noteModal} ${styles.imagesModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`images-modal-${placeName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.noteModalHeader}>
          <div>
            <span className={styles.noteModalEyebrow}>照片</span>
            <h2 id={`images-modal-${placeName}`}>{placeName}</h2>
          </div>
          <button className={styles.noteModalClose} type="button" onClick={onClose} aria-label="關閉照片">
            ×
          </button>
        </div>
        <div className={styles.imagesModalBody}>
          {images.length > 0 ? (
            <div className={styles.plannerImageGrid}>
              {images.map((image, index) => (
                <figure key={image.id} className={styles.plannerImageTile}>
                  <button
                    type="button"
                    className={styles.plannerImagePreviewButton}
                    onClick={() => openImage(index)}
                    aria-label={`放大查看 ${placeName} 的照片 ${index + 1}`}
                  >
                    <img src={image.url} alt={`${placeName} 的照片 ${index + 1}`} loading="lazy" />
                    <span>放大查看</span>
                  </button>
                  {imageUploadEnabled ? (
                    <button
                      type="button"
                      className={styles.plannerImageRemoveButton}
                      onClick={() => void onRemoveImage(image.id)}
                      disabled={imageBusy}
                      aria-label="移除照片"
                    >
                      移除
                    </button>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <p className={styles.plannerImageEmpty}>還沒有照片。</p>
          )}
          {imageUploadEnabled ? (
            <div className={styles.plannerImageUpload}>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={imageBusy || images.length >= PLANNER_IMAGE_MAX_PER_PLACE}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0]
                  if (!file) return
                  void onAddImage(file).finally(() => {
                    if (inputRef.current) inputRef.current.value = ''
                  })
                }}
              />
              <span>每個景點最多 {PLANNER_IMAGE_MAX_PER_PLACE} 張；整份行程最多 {PLANNER_IMAGE_MAX_PER_BOOK} 張。會自動壓縮成 JPEG。</span>
            </div>
          ) : null}
        </div>
        <div className={styles.noteModalFooter}>
          <span>{images.length}/{PLANNER_IMAGE_MAX_PER_PLACE} 張</span>
          <div className={styles.noteModalActions}>
            <button className={styles.notePrimaryAction} type="button" onClick={onClose}>關閉</button>
          </div>
        </div>
      </section>
      {activeImage ? (
        <div
          className={styles.plannerImageLightbox}
          role="presentation"
          onClick={() => setActiveImageIndex(null)}
        >
          <section
            className={styles.plannerImageLightboxPanel}
            role="dialog"
            aria-modal="true"
            aria-label={`${placeName} 放大照片`}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.plannerImageLightboxHeader}>
              <span>{activeImageIndex! + 1} / {images.length}</span>
              <div>
                {images.length > 1 ? (
                  <>
                    <button type="button" onClick={showPreviousImage} aria-label="上一張照片">上一張</button>
                    <button type="button" onClick={showNextImage} aria-label="下一張照片">下一張</button>
                  </>
                ) : null}
                <button type="button" onClick={() => setImageActualSize((value) => !value)}>
                  {imageActualSize ? '符合畫面' : '原尺寸'}
                </button>
                <a href={activeImage.url} target="_blank" rel="noopener noreferrer">開啟原圖</a>
                <button type="button" onClick={() => setActiveImageIndex(null)} aria-label="關閉放大照片">關閉</button>
              </div>
            </header>
            <div className={styles.plannerImageLightboxCanvas}>
              <button
                type="button"
                className={`${styles.plannerImageLightboxImageButton} ${imageActualSize ? styles.isActualSize : ''}`}
                onClick={() => setImageActualSize((value) => !value)}
                aria-label={imageActualSize ? '縮小為符合畫面' : '以原尺寸查看照片'}
              >
                <img src={activeImage.url} alt={`${placeName} 的放大照片`} />
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
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
  onRequestRemoveUserLink,
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
  onRequestRemoveUserLink?: (index: number, link: PlannerUserLink) => void
  onClose: () => void
  readOnly: boolean
}) {
  const actionLinks = plannerActionLinks(place)
  const actionLinkKeys = new Set(actionLinks.map((link) => link.label.trim() + '::' + link.href.trim()))
  const visibleUserLinks = userLinks
    .map((link, index) => ({ link, index }))
    .filter(({ link }) => !isPlannerUserMapLink(link.href, link.label) && !actionLinkKeys.has(link.label.trim() + '::' + link.href.trim()))
  usePlannerBodyScrollLock(true)

  return (
    <div
      className={styles.noteModalBackdrop}
      role="presentation"
      onTouchStart={stopModalTouch}
      onTouchMove={lockModalBackgroundTouch}
      onTouchEnd={stopModalTouch}
      onTouchCancel={stopModalTouch}
      onWheel={lockModalBackgroundWheel}
    >
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
              target="_blank"
              rel="noopener noreferrer"
              data-event={action.mapEvent ?? action.event}
              data-item={place.id}
              data-platform={action.platform}
              data-section={action.mapSection ?? 'planner_card'}
              onClick={(event) => preparePlannerActionLinkClick(event, action)}
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
              <a className={styles.userLinkOpen} href={link.href} target="_blank" rel="noopener noreferrer">
                <span>{link.label}</span>
                <span>開啟</span>
              </a>
              {!readOnly ? (
                <button
                  type="button"
                  onClick={() => (onRequestRemoveUserLink ? onRequestRemoveUserLink(index, link) : onRemoveUserLink(index))}
                  aria-label={`刪除 ${link.label}`}
                >
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
                target="_blank"
                rel="noopener noreferrer"
                data-event={action.mapEvent ?? action.event}
                data-item={place.id}
                data-platform={action.platform}
                data-section={action.mapSection ?? 'planner_card'}
                onClick={(event) => preparePlannerActionLinkClick(event, action)}
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

function PlannerInlineCardLinks({ place, userLinks = [] }: { place: MapPlace; userLinks?: PlannerUserLink[] }) {
  const [openPanel, setOpenPanel] = useState<'links' | 'map' | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const actionLinks = plannerActionLinks(place)
  const [linkLabel, setLinkLabel] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const customActionLinkCount = isCustomPlaceId(place.id)
    ? actionLinks.filter((link) => link.event === 'custom_place_link').length
    : 0
  const actionLinkKeys = new Set(actionLinks.map((link) => link.label.trim() + '::' + link.href.trim()))
  const generalUserLinks = userLinks.filter((link) => !isPlannerUserMapLink(link.href, link.label))
  const visibleUserLinkCount = generalUserLinks.filter((link) => !actionLinkKeys.has(link.label.trim() + '::' + link.href.trim())).length
  const displayLinkCount = customActionLinkCount + visibleUserLinkCount
  const hasInlineLinks = actionLinks.length > 0 || userLinks.some((link) => !isPlannerUserMapLink(link.href, link.label))
  const linkButtonClassName = `${styles.iconLink} ${styles.iconLinkActive} ${displayLinkCount > 0 ? styles.iconLinkPrimary : ''}`
  const linkButtonLabel = `\u9023\u7d50${displayLinkCount > 0 ? ` ${displayLinkCount}` : ''}`

  return (
    <>
      {hasInlineLinks ? (
        <button
          className={linkButtonClassName}
          type="button"
          aria-label={linkButtonLabel}
          data-link-label={linkButtonLabel}
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
            openPlannerMapLink(place, links[0])
            return
          }
          setOpenPanel((panel) => (panel === 'map' ? null : 'map'))
        }}
      >
        地圖
      </button>
      {openPanel === 'links' ? (
        <PlannerActionPanel
          panelRef={panelRef}
          place={place}
          userLinks={userLinks}
          linkLabel={linkLabel}
          linkHref={linkHref}
          onLinkLabelChange={setLinkLabel}
          onLinkHrefChange={setLinkHref}
          onAddUserLink={() => undefined}
          onRemoveUserLink={() => undefined}
          onClose={() => setOpenPanel(null)}
          readOnly={true}
        />
      ) : null}
      {openPanel === 'map' ? (
        <PlannerMapLinksPanel
          panelRef={panelRef}
          place={place}
          userLinks={userLinks}
          onClose={() => setOpenPanel(null)}
        />
      ) : null}
    </>
  )
}
function SortableTransportItem({
  itemId,
  info,
  expanded,
  navigationPlaces,
  onToggleExpanded,
  onChange,
  onRemove,
  cardRef,
  readOnly,
}: {
  itemId: PlannerItem
  info: TransportInfo
  expanded: boolean
  navigationPlaces?: TransportNavigationPlaces | null
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
  const [draft, setDraft] = useState(info)
  const hasDetails = hasSavedTransportDetails(info)
  const editing = expanded
  const dirty =
    draft.mode !== info.mode ||
    draft.customLabel !== info.customLabel ||
    draft.duration !== info.duration ||
    draft.note !== info.note
  const canSave = editing && !readOnly
  const summaryParts = [transportLabel(info), info.duration.trim(), info.note.trim()].filter(Boolean)
  const activeNavigationMode = editing ? draft.mode : info.mode
  const navigationFrom = navigationPlaces?.from ?? null
  const navigationTo = navigationPlaces?.to ?? null
  const navigationResolveKey =
    navigationFrom && navigationTo
      ? [
          navigationFrom.id,
          navigationFrom.lat,
          navigationFrom.lng,
          navigationFrom.googlePlaceId ?? '',
          navigationFrom.googlePlaceName ?? '',
          navigationFrom.googlePlaceLat ?? '',
          navigationFrom.googlePlaceLng ?? '',
          navigationFrom.naverPlaceId ?? '',
          navigationFrom.naverPlaceName ?? '',
          naverMapUrl(navigationFrom) ?? '',
          navigationFrom.spotGoogleMapsUrl ?? '',
          navigationTo.id,
          navigationTo.lat,
          navigationTo.lng,
          navigationTo.googlePlaceId ?? '',
          navigationTo.googlePlaceName ?? '',
          navigationTo.googlePlaceLat ?? '',
          navigationTo.googlePlaceLng ?? '',
          navigationTo.naverPlaceId ?? '',
          navigationTo.naverPlaceName ?? '',
          naverMapUrl(navigationTo) ?? '',
          navigationTo.spotGoogleMapsUrl ?? '',
        ].join('|')
      : ''
  const [resolvedNavigationIds, setResolvedNavigationIds] = useState<ResolvedTransportNavigationIds>({ key: '' })
  const activeResolvedNavigationIds =
    resolvedNavigationIds.key === navigationResolveKey
      ? resolvedNavigationIds
      : null
  const fromGooglePlaceId =
    activeResolvedNavigationIds?.fromGooglePlaceId ||
    (navigationFrom ? googleMapsPlaceId(navigationFrom) || cachedGooglePlaceId(navigationFrom) : '')
  const toGooglePlaceId =
    activeResolvedNavigationIds?.toGooglePlaceId ||
    (navigationTo ? googleMapsPlaceId(navigationTo) || cachedGooglePlaceId(navigationTo) : '')
  const fromNaverPlaceId =
    activeResolvedNavigationIds?.fromNaverPlaceId || (navigationFrom ? cachedNaverPlaceId(navigationFrom) : '')
  const toNaverPlaceId =
    activeResolvedNavigationIds?.toNaverPlaceId || (navigationTo ? cachedNaverPlaceId(navigationTo) : '')
  const navigationPlaceIds: TransportNavigationPlaceIds = {
    ...(fromGooglePlaceId ? { fromGooglePlaceId } : {}),
    ...(toGooglePlaceId ? { toGooglePlaceId } : {}),
    ...(fromNaverPlaceId ? { fromNaverPlaceId } : {}),
    ...(toNaverPlaceId ? { toNaverPlaceId } : {}),
  }
  const navigationHref = navigationPlaces
    ? transportNavigationUrl(navigationPlaces.from, navigationPlaces.to, activeNavigationMode, navigationPlaceIds)
    : ''
  const navigationKey = navigationHref
    ? `auto:${navigationPlaces?.from.id}:${navigationPlaces?.to.id}:${activeNavigationMode}:${navigationHref}`
    : ''
  const [navigationChangePending, setNavigationChangePending] = useState(false)
  const navigationKeyRef = useRef<string | null>(null)
  const navigationUpdating = navigationChangePending

  const commitDraft = () => {
    if (readOnly) return
    const nextInfo = {
      ...draft,
      customLabel: draft.customLabel.slice(0, 40),
      duration: draft.duration.slice(0, 40),
      note: draft.note.slice(0, 300),
      href: '',
    }
    onChange(nextInfo)
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
  const navigationLabel = navigationUpdating ? '生成中' : '導航'
  const navigationAriaLabel = navigationPlaces
    ? `導航：${shortName(navigationPlaces.from.name)}到${shortName(navigationPlaces.to.name)}`
    : '導航'
  const navigationLink = navigationHref ? (
    <a
      className={`${styles.transportNavigationLink} ${navigationUpdating ? styles.transportNavigationLinkPending : ''}`}
      href={navigationHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={navigationUpdating}
      aria-label={navigationAriaLabel}
      onClick={(event) => {
        if (navigationUpdating) {
          event.preventDefault()
          return
        }
        if (navigationFrom && navigationTo && isSouthKoreaCoordinate(navigationFrom) && isSouthKoreaCoordinate(navigationTo)) {
          openMobileMapApp(event, naverMapAppDirectionsUrl(navigationFrom, navigationTo, activeNavigationMode))
        }
      }}
    >
      {navigationLabel}
    </a>
  ) : null

  useEffect(() => {
    if (!navigationFrom || !navigationTo || !navigationResolveKey) return
    const shouldUseNaver = isSouthKoreaCoordinate(navigationFrom) && isSouthKoreaCoordinate(navigationTo)
    const shouldResolve = needsTransportNavigationPlaceResolution(navigationFrom, navigationTo)
    if (!shouldResolve) return

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    let cancelled = false

    const fromPlaceIdPromise = shouldUseNaver
      ? resolveNaverPlaceId(navigationFrom, controller.signal)
      : resolveGooglePlaceId(navigationFrom, controller.signal)
    const toPlaceIdPromise = shouldUseNaver
      ? resolveNaverPlaceId(navigationTo, controller.signal)
      : resolveGooglePlaceId(navigationTo, controller.signal)

    Promise.all([fromPlaceIdPromise, toPlaceIdPromise])
      .then(([fromPlaceId, toPlaceId]) => {
        if (cancelled) return
        setResolvedNavigationIds({
          key: navigationResolveKey,
          ...(fromPlaceId && shouldUseNaver ? { fromNaverPlaceId: fromPlaceId } : {}),
          ...(toPlaceId && shouldUseNaver ? { toNaverPlaceId: toPlaceId } : {}),
          ...(fromPlaceId && !shouldUseNaver ? { fromGooglePlaceId: fromPlaceId } : {}),
          ...(toPlaceId && !shouldUseNaver ? { toGooglePlaceId: toPlaceId } : {}),
        })
      })
      .catch(() => {
        if (!cancelled) setResolvedNavigationIds({ key: navigationResolveKey })
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [navigationFrom, navigationResolveKey, navigationTo])

  useEffect(() => {
    const previousNavigationKey = navigationKeyRef.current
    navigationKeyRef.current = navigationKey
    const shouldShowUpdating = Boolean(navigationKey && previousNavigationKey !== null && previousNavigationKey !== navigationKey)

    const startTimer = window.setTimeout(() => setNavigationChangePending(shouldShowUpdating), 0)
    const endTimer = shouldShowUpdating ? window.setTimeout(() => setNavigationChangePending(false), 260) : 0
    return () => {
      window.clearTimeout(startTimer)
      if (endTimer) window.clearTimeout(endTimer)
    }
  }, [navigationKey])

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
          if (target.closest('a, button, input, select, textarea, label, [data-transport-edit-block="true"]')) return
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
                {navigationLink}
              </span>
            </div>
          ) : (
            <>
              <div className={styles.transportHeader}>
                <span>{transportLabel(draft)}</span>
                {navigationLink}
              </div>
              <div className={styles.transportFields} data-transport-edit-block="true">
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
                  <span>備註</span>
                  <textarea value={draft.note} maxLength={300} placeholder="例如 從 2 號出口走過去" onChange={(event) => updateDraft({ note: event.target.value })} readOnly={readOnly} />
                </label>
              </div>
              {!readOnly ? (
                <div className={styles.transportActions} data-transport-edit-block="true">
                  <span>{dirty ? '尚未儲存' : hasDetails ? '已儲存' : '可直接儲存'}</span>
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
        {!readOnly && editing ? (
          <button className={styles.transportRemoveButton} type="button" onClick={collapseEditor} aria-label="取消編輯交通">
            ×
          </button>
        ) : null}
      </article>
    </div>
  )
}

function TransportItemGroup({
  items,
  expanded,
  onExpand,
  groupRef,
  children,
}: {
  items: PlannerItem[]
  expanded: boolean
  onExpand: () => void
  groupRef?: (el: HTMLElement | null) => void
  children: ReactNode
}) {
  const preview = transportGroupPreview(items)
  const summary = (
    <>
      <span className={styles.transportGroupBadge}>{items.length} 段交通</span>
      <span className={styles.transportGroupPreview}>{preview || '查看每一段交通安排'}</span>
      <span className={styles.transportGroupAction}>{expanded ? '逐段顯示' : '展開'}</span>
    </>
  )
  return (
    <section ref={groupRef} className={`${styles.transportGroup} ${expanded ? styles.transportGroupExpanded : ''}`}>
      {expanded ? (
        <div className={styles.transportGroupToggle}>{summary}</div>
      ) : (
        <button type="button" className={styles.transportGroupToggle} onClick={onExpand} aria-expanded={false}>
          {summary}
        </button>
      )}
      {expanded ? <div className={styles.transportGroupItems}>{children}</div> : null}
    </section>
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
  const mapShellRef = useRef<HTMLDivElement>(null)
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const initialMapFitDoneRef = useRef(false)
  const autoFittingMapRef = useRef(false)
  const userAdjustedMapRef = useRef(false)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const labelOverlaysRef = useRef<Map<string, SmartMapLabelOverlay>>(new Map())
  const selectedMarkerArrowRef = useRef<google.maps.Marker | null>(null)
  const lineRefs = useRef<google.maps.Polyline[]>([])
  const customDraftMarkerRef = useRef<google.maps.Marker | null>(null)
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const userPositionRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationWatchIdRef = useRef<number | null>(null)
  const locationWatchCenteredRef = useRef(false)
  const locationFollowModeRef = useRef<LocationFollowMode>('idle')
  const locationPausedFollowModeRef = useRef<Exclude<LocationFollowMode, 'idle'> | null>(null)
  const locationFollowingRef = useRef(false)
  const locationLastCenteredRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationRenderedPositionRef = useRef<google.maps.LatLngLiteral | null>(null)
  const locationAnimationFrameRef = useRef<number | null>(null)
  const locationCameraAnimationFrameRef = useRef<number | null>(null)
  const locationCameraHeadingTargetRef = useRef<number | null>(null)
  const locationHeadingRef = useRef<number | null>(null)
  const locationLastHeadingRef = useRef<number | null>(null)
  const locationSpeedRef = useRef<number | null>(null)
  const locationPositionUpdatedAtRef = useRef(0)
  const locationRequestingRef = useRef(false)
  const deviceHeadingRef = useRef<number | null>(null)
  const deviceHeadingUpdatedAtRef = useRef(0)
  const deviceHeadingListeningRef = useRef(false)
  const deviceHeadingPermissionRequestedRef = useRef(false)
  const deviceHeadingPermissionGrantedRef = useRef(false)
  const deviceOrientationHandlerRef = useRef<((event: DeviceOrientationEvent) => void) | null>(null)
  const autoCenteringLocationRef = useRef(false)
  const autoCenteringLocationTimerRef = useRef<number | null>(null)
  const mapUserGestureUntilRef = useRef(0)
  const locateButtonRef = useRef<HTMLButtonElement | null>(null)
  const customUrlResolveSeqRef = useRef(0)
  const googlePlaceDetailsResolveRef = useRef<Set<string>>(new Set())
  const addCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const planCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const dayDividerRefs = useRef<Record<string, HTMLElement | null>>({})
  const transportCardRefs = useRef<Record<string, HTMLElement | null>>({})
  const transportGroupRefs = useRef<Record<string, HTMLElement | null>>({})
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
  const customConfirmRef = useRef<HTMLDivElement | null>(null)
  const pendingCustomMapFocusRef = useRef<{ lat: number; lng: number } | null>(null)
  const customMapFocusTimersRef = useRef<number[]>([])
  const planListRef = useRef<HTMLDivElement | null>(null)
  const mobilePanelStateRef = useRef<MobilePanelState>('collapsed')
  const pendingHalfPanelFocusRef = useRef<PlannerFocusTarget | null>(null)
  const pendingHalfPanelExpandItemRef = useRef<PlannerItem | null>(null)
  const focusScrollTimerRef = useRef<number | null>(null)
  const pendingHalfPanelFocusRetryRef = useRef(0)
  const initialPlannerLoadRef = useRef(false)
  const expandedPlanScrollCollapseTimerRef = useRef<number | null>(null)
  const expandedPlanScrollAnchorRef = useRef<{ element: HTMLElement; top: number; container: HTMLElement } | null>(null)
  const transportGroupScrollAnchorRef = useRef<{ element: HTMLElement; top: number; container: HTMLElement } | null>(null)
  const hotelAffiliateLookupRequestRef = useRef<Map<string, ActiveHotelAffiliateLookup>>(new Map())
  const hotelAffiliateForceRefreshRef = useRef<Set<string>>(new Set())
  const customPlacesRef = useRef<Record<string, CustomPlannerPlace>>({})
  const googlePlaceTypeResolveRef = useRef<Set<string>>(new Set())
  const customPlaceGoogleIdentityResolveRef = useRef<Set<string>>(new Set())

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
  const [plannerImages, setPlannerImages] = useState<PlannerCardImage[]>([])
  const [plannerImageOwnerToken, setPlannerImageOwnerToken] = useState<string | null>(null)
  const [plannerImageBusy, setPlannerImageBusy] = useState(false)
  const [customPlaces, setCustomPlaces] = useState<Record<string, CustomPlannerPlace>>({})
  const [googlePlaceDetailsRevision, setGooglePlaceDetailsRevision] = useState(0)
  const [nearbyKnownPlaces, setNearbyKnownPlaces] = useState<MapPlace[]>([])
  const [nearbyKnownPlacesPrompt, setNearbyKnownPlacesPrompt] = useState<NearbyKnownPlacesSuggestion | null>(null)
  const [customDraft, setCustomDraft] = useState<CustomPlaceDraft>(emptyCustomPlaceDraft)
  const [agodaAffiliateStatus, setAgodaAffiliateStatus] = useState<Record<string, HotelAffiliateStatus>>({})
  const [tripAffiliateStatus, setTripAffiliateStatus] = useState<Record<string, HotelAffiliateStatus>>({})
  const [customDraftReturnMode, setCustomDraftReturnMode] = useState<'add' | 'order'>('add')
  const [customDraftReturnItem, setCustomDraftReturnItem] = useState<PlannerItem | null>(null)
  const [customPlaceSaveError, setCustomPlaceSaveError] = useState<'googleUrl' | 'name' | 'location' | null>(null)
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
  const [expandedTransportGroups, setExpandedTransportGroups] = useState<Record<string, true>>({})
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
  const [locationPromptOpen, setLocationPromptOpen] = useState(false)
  const [locationPromptMessage, setLocationPromptMessage] = useState('')
  const [locationRequesting, setLocationRequesting] = useState(false)
  const [dayView, setDayView] = useState<DayView>('all')
  const [dayViewStorageReadyKey, setDayViewStorageReadyKey] = useState('')
  const [openPlannerMenu, setOpenPlannerMenu] = useState<null | 'day' | 'actions'>(null)
  const [preDepartureOpen, setPreDepartureOpen] = useState(false)
  const [preDepartureTravelers, setPreDepartureTravelers] = useState<PreDepartureTraveler[]>([{ ...PRE_DEPARTURE_OWNER }])
  const [preDepartureActiveTargetId, setPreDepartureActiveTargetId] = useState(PRE_DEPARTURE_OWNER.id)
  const [preDepartureChecked, setPreDepartureChecked] = useState<Record<string, Record<string, true>>>({})
  const [preDepartureNotes, setPreDepartureNotes] = useState<Record<string, string>>({})
  const [preDepartureCustomItems, setPreDepartureCustomItems] = useState<PreDepartureChecklistItem[]>([])
  const [preDepartureRemovedItemIds, setPreDepartureRemovedItemIds] = useState<Record<string, true>>({})
  const [preDepartureHiddenCategoryIds, setPreDepartureHiddenCategoryIds] = useState<Record<string, true>>({})
  const [preDepartureStorageReadyKey, setPreDepartureStorageReadyKey] = useState('')
  const [preDepartureTransferStatus, setPreDepartureTransferStatus] = useState<PreDepartureTransferStatus>('idle')
  const [preDepartureCloudStatus, setPreDepartureCloudStatus] = useState<PreDepartureCloudStatus>('local')
  const plannerPdfModuleRef = useRef<Promise<typeof import('./plannerPdf')> | null>(null)
  const preDepartureMigrationTargetRef = useRef<string | null>(null)
  const preDepartureLastCloudSignatureRef = useRef('')
  const preDepartureCloudSaveTimerRef = useRef<number | null>(null)
  const pdfDownloading = pdfDownloadStatus !== 'idle'
  const dayViewStorageKey = `${config.storageKey}:day-view:${plannerBookId ?? 'draft'}`
  const preDepartureStorageKey = `${config.storageKey}:pre-departure:${plannerBookId ?? 'draft'}`
  const preDepartureDraftStorageKey = `${config.storageKey}:pre-departure:draft`
  const inAppPromptIdentity =
    config.initialSearchParams?.[PLANNER_BOOK_PARAM] ??
    config.initialSearchParams?.[PLANNER_PREVIEW_PARAM] ??
    ''
  const mobilePanelOpen = mobilePanelState !== 'collapsed'
  useLayoutEffect(() => {
    customPlacesRef.current = customPlaces
  }, [customPlaces])

  const cancelHotelAffiliateLookupForCustomPlace = useCallback(
    (placeId: string, provider?: HotelAffiliateProvider) => {
      const providers: HotelAffiliateProvider[] = provider ? [provider] : ['Agoda', 'Trip']
      providers.forEach((item) => {
        const requestKey = `${item}:${placeId}`
        const activeRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)
        if (activeRequest) {
          activeRequest.controller.abort()
          hotelAffiliateLookupRequestRef.current.delete(requestKey)
        }

        const setProviderStatus = item === 'Agoda' ? setAgodaAffiliateStatus : setTripAffiliateStatus
        setProviderStatus((status) => {
          if (status[placeId] !== 'searching') return status
          const nextStatus = { ...status }
          delete nextStatus[placeId]
          return nextStatus
        })
      })
    },
    [],
  )

  useEffect(() => {
    const activeRequests = hotelAffiliateLookupRequestRef.current
    return () => {
      activeRequests.forEach((request) => request.controller.abort())
      activeRequests.clear()
    }
  }, [])

  const setMobilePanelOpen = useCallback((next: boolean | ((open: boolean) => boolean)) => {
    setMobilePanelState((state) => {
      const currentlyOpen = state !== 'collapsed'
      const resolved = typeof next === 'function' ? next(currentlyOpen) : next
      return resolved ? 'half' : 'collapsed'
    })
  }, [])

  const syncLocateButtonState = useCallback(() => {
    const button = locateButtonRef.current
    if (!button) return
    const pausedMode = locationPausedFollowModeRef.current
    const mode: LocateButtonMode = locationRequestingRef.current
      ? 'requesting'
      : locationFollowModeRef.current === 'heading'
        ? 'heading'
        : locationFollowModeRef.current === 'follow' || locationFollowingRef.current
          ? 'following'
          : pausedMode === 'heading'
            ? 'paused-heading'
            : pausedMode === 'follow'
              ? 'paused-follow'
              : userPositionRef.current
                ? 'located'
                : 'idle'
    const labelByMode: Record<LocateButtonMode, string> = {
      idle: '定位我的目前位置',
      located: '回到我的位置',
      requesting: '定位中...',
      following: '開啟方向跟隨',
      heading: '切回一般定位',
      'paused-follow': '回到一般定位跟隨',
      'paused-heading': '回到方向跟隨',
    }
    button.dataset.locationMode = mode
    button.className = [
      styles.mapLocateButton,
      mode === 'following' ? styles.mapLocateButtonFollowing : '',
      mode === 'heading' ? styles.mapLocateButtonHeading : '',
      mode === 'paused-follow' || mode === 'paused-heading' ? styles.mapLocateButtonPaused : '',
      mode === 'paused-heading' ? styles.mapLocateButtonPausedHeading : '',
    ]
      .filter(Boolean)
      .join(' ')
    button.title = labelByMode[mode]
    button.setAttribute('aria-label', labelByMode[mode])
    button.toggleAttribute('disabled', mode === 'requesting')
  }, [])

  const setLocationRequestingState = useCallback(
    (next: boolean) => {
      locationRequestingRef.current = next
      setLocationRequesting(next)
      syncLocateButtonState()
    },
    [syncLocateButtonState],
  )

  const clearLocationWatch = useCallback(() => {
    if (locationWatchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationWatchIdRef.current)
      locationWatchIdRef.current = null
    }
  }, [])

  const markLocationAutoCentering = useCallback((duration = 700) => {
    autoCenteringLocationRef.current = true
    if (autoCenteringLocationTimerRef.current !== null) {
      window.clearTimeout(autoCenteringLocationTimerRef.current)
    }
    autoCenteringLocationTimerRef.current = window.setTimeout(() => {
      autoCenteringLocationRef.current = false
      autoCenteringLocationTimerRef.current = null
    }, duration)
  }, [])

  const markMapUserGesture = useCallback(() => {
    mapUserGestureUntilRef.current = Date.now() + 1800
  }, [])

  const currentLocationHeading = useCallback(() => {
    const deviceHeading = deviceHeadingRef.current
    if (deviceHeading !== null && Date.now() - deviceHeadingUpdatedAtRef.current <= DEVICE_HEADING_STALE_MS) {
      return deviceHeading
    }
    return locationHeadingRef.current ?? locationLastHeadingRef.current
  }, [])

  const moveLocationCamera = useCallback((map: google.maps.Map, cameraOptions: google.maps.CameraOptions, guardDuration = LOCATION_CAMERA_GUARD_MS) => {
    markLocationAutoCentering(guardDuration)
    map.moveCamera(cameraOptions)
  }, [markLocationAutoCentering])

  const stopLocationAnimation = useCallback(() => {
    if (locationAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(locationAnimationFrameRef.current)
      locationAnimationFrameRef.current = null
    }
  }, [])

  const stopLocationCameraAnimation = useCallback(() => {
    locationCameraHeadingTargetRef.current = null
    if (locationCameraAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(locationCameraAnimationFrameRef.current)
      locationCameraAnimationFrameRef.current = null
    }
  }, [])

  const animateLocationMapHeading = useCallback(
    (map: google.maps.Map, heading: number, immediate = false) => {
      const nextHeading = normalizeMapHeading(heading)
      if (immediate) {
        stopLocationCameraAnimation()
        locationCameraHeadingTargetRef.current = nextHeading
        moveLocationCamera(map, { heading: nextHeading }, LOCATION_HEADING_CAMERA_GUARD_MS)
        return
      }
      locationCameraHeadingTargetRef.current = nextHeading
      if (locationCameraAnimationFrameRef.current !== null) return
      const startedAt = performance.now()
      const step = (now: number) => {
        const targetHeading = locationCameraHeadingTargetRef.current
        const liveHeading = map.getHeading()
        if (targetHeading === null) {
          locationCameraAnimationFrameRef.current = null
          return
        }
        if (typeof liveHeading !== 'number' || !Number.isFinite(liveHeading)) {
          moveLocationCamera(map, { heading: targetHeading }, LOCATION_HEADING_CAMERA_GUARD_MS)
          locationCameraAnimationFrameRef.current = null
          return
        }
        const diff = ((targetHeading - normalizeMapHeading(liveHeading) + 540) % 360) - 180
        if (Math.abs(diff) < 0.55 || now - startedAt > LOCATION_CAMERA_ANIMATION_MS) {
          moveLocationCamera(map, { heading: targetHeading }, LOCATION_HEADING_CAMERA_GUARD_MS)
          locationCameraAnimationFrameRef.current = null
          return
        }
        const nextFrameHeading = normalizeMapHeading(liveHeading + diff * 0.72)
        moveLocationCamera(map, { heading: nextFrameHeading }, LOCATION_HEADING_CAMERA_GUARD_MS)
        locationCameraAnimationFrameRef.current = window.requestAnimationFrame(step)
      }
      locationCameraAnimationFrameRef.current = window.requestAnimationFrame(step)
    },
    [moveLocationCamera, stopLocationCameraAnimation],
  )

  const currentLocationIconHeading = useCallback(() => {
    if (locationFollowModeRef.current === 'heading') return 0
    const heading = currentLocationHeading()
    if (heading === null) return null
    return heading
  }, [currentLocationHeading])

  const applyLocationHeadingToMap = useCallback(
    (map: google.maps.Map, immediate = false, center?: google.maps.LatLngLiteral) => {
      const heading = currentLocationHeading()
      const headingZoom = locationHeadingZoomForSpeed(locationSpeedRef.current)
      const currentMapHeading = map.getHeading()
      const cameraHeading =
        heading ??
        locationCameraHeadingTargetRef.current ??
        (typeof currentMapHeading === 'number' && Number.isFinite(currentMapHeading)
          ? normalizeMapHeading(currentMapHeading)
          : 0)
      let headingMovedWithCamera = false
      try {
        const currentZoom = map.getZoom()
        const currentTilt = map.getTilt()
        const cameraOptions: google.maps.CameraOptions = {}
        if (center) {
          cameraOptions.center = center
        }
        if (typeof currentZoom !== 'number' || Math.abs(currentZoom - headingZoom) > 0.25) {
          cameraOptions.zoom = headingZoom
        }
        if (typeof currentTilt !== 'number' || currentTilt < 40) {
          cameraOptions.tilt = 45
        }
        if (immediate) {
          cameraOptions.heading = normalizeMapHeading(cameraHeading)
          headingMovedWithCamera = true
        }
        if (Object.keys(cameraOptions).length > 0) {
          moveLocationCamera(map, cameraOptions, immediate ? LOCATION_HEADING_CAMERA_GUARD_MS : LOCATION_CAMERA_GUARD_MS)
        }
      } catch {
        // Some embedded map renderers reject camera updates while initializing.
      }
      if (headingMovedWithCamera) return
      try {
        animateLocationMapHeading(map, cameraHeading, immediate)
      } catch {
        // Heading is best-effort; the blue dot still shows direction if map rotation is unavailable.
      }
    },
    [animateLocationMapHeading, currentLocationHeading, moveLocationCamera],
  )

  const resetLocationHeadingCamera = useCallback(
    (map: google.maps.Map, center?: google.maps.LatLngLiteral) => {
      markLocationAutoCentering(LOCATION_CAMERA_GUARD_MS)
      stopLocationCameraAnimation()
      try {
        moveLocationCamera(map, {
          ...(center ? { center } : {}),
          heading: 0,
          tilt: 0,
          zoom: LOCATION_FOLLOW_ZOOM,
        }, LOCATION_CAMERA_GUARD_MS)
      } catch {
        // Ignore camera reset failures on partially initialized maps.
      }
    },
    [markLocationAutoCentering, moveLocationCamera, stopLocationCameraAnimation],
  )

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const heading = locationHeadingFromDeviceOrientation(event as DeviceOrientationEventWithCompass)
      if (heading === null) return
      const previousHeading = currentLocationHeading()
      deviceHeadingRef.current = heading
      deviceHeadingUpdatedAtRef.current = Date.now()
      locationLastHeadingRef.current = heading
      if (previousHeading !== null && headingDifference(previousHeading, heading) < 2) return
      locationHeadingRef.current = heading
      userMarkerRef.current?.setIcon(userLocationIcon(locationFollowModeRef.current === 'heading' ? 0 : heading))
      if (locationFollowModeRef.current !== 'heading') return
      const map = mapRef.current
      if (!map) return
      applyLocationHeadingToMap(map, locationCameraHeadingTargetRef.current === null)
    },
    [applyLocationHeadingToMap, currentLocationHeading],
  )

  const startDeviceHeadingWatch = useCallback(async () => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent || deviceHeadingListeningRef.current) return
    const OrientationEvent = window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission
    if (typeof OrientationEvent.requestPermission === 'function') {
      if (!deviceHeadingPermissionRequestedRef.current) {
        deviceHeadingPermissionRequestedRef.current = true
        try {
          const permission = await OrientationEvent.requestPermission()
          deviceHeadingPermissionGrantedRef.current = permission === 'granted'
        } catch {
          deviceHeadingPermissionGrantedRef.current = false
        }
      }
      if (!deviceHeadingPermissionGrantedRef.current) return
    }
    if (!locationFollowingRef.current && locationFollowModeRef.current === 'idle' && locationWatchIdRef.current === null) return
    window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true)
    window.addEventListener('deviceorientation', handleDeviceOrientation, true)
    deviceOrientationHandlerRef.current = handleDeviceOrientation
    deviceHeadingListeningRef.current = true
  }, [handleDeviceOrientation])

  const stopDeviceHeadingWatch = useCallback(() => {
    if (!deviceHeadingListeningRef.current) return
    const handler = deviceOrientationHandlerRef.current
    if (handler) {
      window.removeEventListener('deviceorientationabsolute', handler, true)
      window.removeEventListener('deviceorientation', handler, true)
    }
    deviceHeadingListeningRef.current = false
    deviceOrientationHandlerRef.current = null
  }, [])

  const exitLocationFollowMode = useCallback((resumeOnNextLocate = false) => {
    const previousMode = locationFollowModeRef.current
    if (resumeOnNextLocate) {
      locationPausedFollowModeRef.current =
        previousMode !== 'idle' ? previousMode : locationPausedFollowModeRef.current
    } else {
      locationPausedFollowModeRef.current = null
    }
    locationFollowModeRef.current = 'idle'
    locationFollowingRef.current = false
    stopLocationCameraAnimation()
    if (locationWatchIdRef.current === null) stopDeviceHeadingWatch()
    syncLocateButtonState()
  }, [stopDeviceHeadingWatch, stopLocationCameraAnimation, syncLocateButtonState])

  const followUserPositionOnMap = useCallback(
    (map: google.maps.Map, position: google.maps.LatLngLiteral, immediate = false) => {
      const headingFollow = locationFollowModeRef.current === 'heading'
      markLocationAutoCentering(headingFollow ? 900 : 700)
      userAdjustedMapRef.current = true
      const marker = userMarkerRef.current
      const from = locationRenderedPositionRef.current ?? userPositionRef.current ?? position
      stopLocationAnimation()
      if (immediate || distanceMeters(from, position) < 0.5) {
        marker?.setPosition(position)
        if (headingFollow) {
          applyLocationHeadingToMap(map, true, position)
        } else {
          resetLocationHeadingCamera(map, position)
        }
        locationRenderedPositionRef.current = position
        return
      }
      const distance = distanceMeters(from, position)
      if (!headingFollow && (map.getZoom() ?? 0) < LOCATION_FOLLOW_ZOOM) {
        moveLocationCamera(map, { zoom: LOCATION_FOLLOW_ZOOM }, 700)
      }
      const duration = Math.min(1200, Math.max(420, distance * 45))
      const startedAt = performance.now()
      const step = (now: number) => {
        const progress = easeOutCubic(Math.min(1, (now - startedAt) / duration))
        const nextPosition = interpolatePosition(from, position, progress)
        marker?.setPosition(nextPosition)
        if (locationFollowingRef.current) {
          markLocationAutoCentering(locationFollowModeRef.current === 'heading' ? 900 : 700)
          if (locationFollowModeRef.current === 'heading') {
            applyLocationHeadingToMap(map, false, nextPosition)
          } else {
            map.setCenter(nextPosition)
          }
        }
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
    [applyLocationHeadingToMap, markLocationAutoCentering, moveLocationCamera, resetLocationHeadingCamera, stopLocationAnimation],
  )

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

    mapUserGestureUntilRef.current = 0
    if (locationWatchIdRef.current !== null) {
      setLocationPromptOpen(false)
      const position = userPositionRef.current
      if (position) {
        const currentMode = locationFollowModeRef.current
        const pausedMode = locationPausedFollowModeRef.current
        const nextMode: Exclude<LocationFollowMode, 'idle'> =
          currentMode === 'heading'
            ? 'follow'
            : currentMode === 'follow'
              ? 'heading'
              : pausedMode ?? 'follow'
        const wasHeadingFollow = currentMode === 'heading'
        const shouldEnterHeadingFollow = nextMode === 'heading'
        locationPausedFollowModeRef.current = null
        locationFollowModeRef.current = nextMode
        locationFollowingRef.current = true
        if (shouldEnterHeadingFollow) {
          void startDeviceHeadingWatch()
        } else if (wasHeadingFollow) {
          resetLocationHeadingCamera(map, position)
        } else {
          void startDeviceHeadingWatch()
        }
        userMarkerRef.current?.setIcon(userLocationIcon(currentLocationIconHeading()))
        followUserPositionOnMap(map, position, true)
        setMobilePanelOpen(false)
        locationLastCenteredRef.current = position
      }
      syncLocateButtonState()
      if (position || locationRequestingRef.current) return
      clearLocationWatch()
      locationWatchCenteredRef.current = false
      locationPausedFollowModeRef.current = null
      locationFollowModeRef.current = 'idle'
      locationFollowingRef.current = false
      stopDeviceHeadingWatch()
      stopLocationAnimation()
    }

    setLocationRequestingState(true)
    setLocationPromptMessage('')
    locationWatchCenteredRef.current = false
    locationPausedFollowModeRef.current = null
    locationFollowModeRef.current = 'follow'
    locationFollowingRef.current = true
    syncLocateButtonState()
    void startDeviceHeadingWatch()
    locationWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocationRequestingState(false)
        setLocationPromptOpen(false)
        const position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        const gpsHeading = locationHeadingFromPosition(pos)
        const renderedPosition = locationRenderedPositionRef.current
        const travelHeading = reliableMovementHeading(pos, renderedPosition, position)
        const gpsSpeed = typeof pos.coords.speed === 'number' && Number.isFinite(pos.coords.speed) ? pos.coords.speed : null
        const previousPosition = userPositionRef.current
        const previousPositionAt = locationPositionUpdatedAtRef.current
        const measuredAt = typeof pos.timestamp === 'number' && Number.isFinite(pos.timestamp) ? pos.timestamp : Date.now()
        const movedMeters = previousPosition ? distanceMeters(previousPosition, position) : 0
        const inferredSpeed =
          gpsSpeed === null && previousPosition && previousPositionAt > 0
            ? (() => {
                const seconds = (measuredAt - previousPositionAt) / 1000
                if (seconds < 0.5 || seconds > 30) return null
                const accuracy = typeof pos.coords.accuracy === 'number' && Number.isFinite(pos.coords.accuracy)
                  ? pos.coords.accuracy
                  : 0
                if (movedMeters < Math.max(8, accuracy * 0.45)) return null
                return movedMeters / seconds
              })()
            : null
        const speed = gpsSpeed ?? inferredSpeed
        locationSpeedRef.current = speed
        locationPositionUpdatedAtRef.current = measuredAt
        if (gpsHeading !== null && (speed === null || speed >= 0.7)) {
          const normalizedHeading = normalizeMapHeading(gpsHeading)
          locationHeadingRef.current = normalizedHeading
          locationLastHeadingRef.current = normalizedHeading
        } else if (travelHeading !== null) {
          const normalizedHeading = normalizeMapHeading(travelHeading)
          locationHeadingRef.current = normalizedHeading
          locationLastHeadingRef.current = normalizedHeading
        }
        const icon = userLocationIcon(currentLocationIconHeading())
        userPositionRef.current = position
        if (!userMarkerRef.current) {
          locationRenderedPositionRef.current = position
          userMarkerRef.current = new google.maps.Marker({
            map,
            position,
            title: '我的位置',
            zIndex: 5000,
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
          followUserPositionOnMap(map, position, !lastCentered || !locationWatchCenteredRef.current)
          setMobilePanelOpen(false)
          locationLastCenteredRef.current = position
          locationWatchCenteredRef.current = true
        } else if (locationFollowingRef.current && locationFollowModeRef.current === 'heading') {
          userMarkerRef.current?.setPosition(position)
          applyLocationHeadingToMap(map, false, position)
          locationRenderedPositionRef.current = position
          locationWatchCenteredRef.current = true
        } else {
          userMarkerRef.current?.setPosition(position)
          locationRenderedPositionRef.current = position
          if (!locationWatchCenteredRef.current) {
            locationWatchCenteredRef.current = true
          }
        }
        syncLocateButtonState()
      },
      (error) => {
        const hadPosition = userPositionRef.current !== null
        setLocationRequestingState(false)
        if (error.code === error.PERMISSION_DENIED || !hadPosition) {
          clearLocationWatch()
          locationWatchCenteredRef.current = false
          locationPausedFollowModeRef.current = null
          locationFollowModeRef.current = 'idle'
          locationFollowingRef.current = false
          stopDeviceHeadingWatch()
          stopLocationAnimation()
          stopLocationCameraAnimation()
        }
        if (error.code === error.PERMISSION_DENIED) {
          setLocationPromptMessage(`定位權限尚未開啟。${locationPermissionGuide()}`)
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationPromptMessage('暫時無法取得位置，請確認手機或瀏覽器定位功能已開啟。')
        } else if (error.code === error.TIMEOUT) {
          setLocationPromptMessage(hadPosition ? '定位逾時，系統會持續嘗試更新目前位置。' : '定位逾時，請再按一次定位。')
        } else {
          setLocationPromptMessage(hadPosition ? '定位暫時失敗，系統會持續嘗試更新目前位置。' : '定位暫時失敗，請再按一次定位。')
        }
        syncLocateButtonState()
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      },
    )
  }, [
    applyLocationHeadingToMap,
    clearLocationWatch,
    currentLocationIconHeading,
    followUserPositionOnMap,
    resetLocationHeadingCamera,
    setLocationRequestingState,
    setMobilePanelOpen,
    startDeviceHeadingWatch,
    stopDeviceHeadingWatch,
    stopLocationAnimation,
    stopLocationCameraAnimation,
    syncLocateButtonState,
  ])

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

  const syncExpandedPlanItemSelection = useCallback((nextItem: PlannerItem | null) => {
    if (!nextItem) {
      setSelectedPlanItem(null)
      return
    }

    const placeId = planItemPlaceId(nextItem)
    if (!placeId) {
      setSelectedPlanItem(null)
      setSelectedId(null)
      return
    }

    setSelectedPlanItem(nextItem)
    setSelectedId(placeId)
  }, [])

  const flushPendingHalfPanelFocus = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const pendingFocus = pendingHalfPanelFocusRef.current
      if (!pendingFocus) return
      const didScroll = scrollFocusTargetToCenter(pendingFocus, behavior)
      if (didScroll) {
        pendingHalfPanelFocusRef.current = null
        const pendingExpandItem = pendingHalfPanelExpandItemRef.current
        pendingHalfPanelExpandItemRef.current = null
        if (pendingExpandItem) {
          syncExpandedPlanItemSelection(pendingExpandItem)
          setExpandedPlanItem(pendingExpandItem)
          window.setTimeout(() => scrollFocusTargetToCenter(pendingFocus, 'auto'), 80)
        }
        pendingHalfPanelFocusRetryRef.current = 0
        return
      }
      if (pendingHalfPanelFocusRetryRef.current >= 4) {
        pendingHalfPanelFocusRef.current = null
        pendingHalfPanelExpandItemRef.current = null
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
    [clearFocusScrollTimers, scrollFocusTargetToCenter, syncExpandedPlanItemSelection],
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
  const knownSourcePlaces = useMemo(() => Array.from(sourcePlaceById.values()), [sourcePlaceById])
  const customMapPlaces = useMemo(
    () =>
      Object.values(customPlaces).map((place) =>
        customPlaceToMapPlace(place, place.sourcePlaceId ? sourcePlaceById.get(place.sourcePlaceId) : undefined, customCategoryItems),
      ),
    [customCategoryItems, customPlaces, sourcePlaceById],
  )
  const customPlaceCount = useMemo(() => Object.keys(customPlaces).length, [customPlaces])
  const allPlaces = useMemo(
    () => [...places, ...nearbyKnownPlaces, ...customMapPlaces],
    [customMapPlaces, nearbyKnownPlaces, places],
  )
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
  const hasSavablePlannerContent = validPlanItems.length > 0 || customPlaceCount > 0
  const validPlanPlaceIds = useMemo(
    () => validPlanIds.map((item) => planItemPlaceId(item)).filter(Boolean) as string[],
    [validPlanIds],
  )
  const plannedPlaces = useMemo(
    () => validPlanIds.map((item) => planItemPlace(item, placeById)).filter(Boolean) as MapPlace[],
    [placeById, validPlanIds],
  )
  const showJapanPreDepartureBooking = useMemo(
    () => plannedPlaces.some((place) => coordinateIsInJapan(place.lat, place.lng)),
    [plannedPlaces],
  )
  const preDepartureAllCategories = useMemo(
    () =>
      PRE_DEPARTURE_CATEGORIES
        .filter((category) => category.id !== 'japan-booking' || showJapanPreDepartureBooking)
        .map((category) => ({
          ...category,
          items: [
            ...category.items,
            ...preDepartureCustomItems.filter((item) => item.categoryId === category.id),
          ],
        })),
    [preDepartureCustomItems, showJapanPreDepartureBooking],
  )
  const preDepartureCategories = useMemo(
    () =>
      preDepartureAllCategories
        .filter((category) => !preDepartureHiddenCategoryIds[category.id])
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => !preDepartureRemovedItemIds[item.id]),
        })),
    [preDepartureAllCategories, preDepartureHiddenCategoryIds, preDepartureRemovedItemIds],
  )
  const preDepartureChecklist = useMemo<PreDepartureChecklistStorage>(() => ({
    version: 2,
    travelers: preDepartureTravelers,
    checked: preDepartureChecked,
    notes: preDepartureNotes,
    customItems: preDepartureCustomItems,
    removedItemIds: preDepartureRemovedItemIds,
    hiddenCategoryIds: preDepartureHiddenCategoryIds,
  }), [
    preDepartureChecked,
    preDepartureCustomItems,
    preDepartureHiddenCategoryIds,
    preDepartureNotes,
    preDepartureRemovedItemIds,
    preDepartureTravelers,
  ])
  const preDepartureChecklistSignature = useMemo(
    () => JSON.stringify(serializePreDepartureChecklistStorage(preDepartureChecklist)),
    [preDepartureChecklist],
  )
  const nearbyKnownPlacesStorageKey = `${config.storageKey}:nearby-known:${plannerBookId ?? 'draft'}`
  const nearbyKnownPlacesSuggestionForDraft = useMemo(() => {
    if (places.length > 0 || nearbyKnownPlaces.length > 0) return null
    return nearbyKnownPlacesSuggestion([...customMapPlaces, ...plannedPlaces], config.matchPlaces ?? [])
  }, [config.matchPlaces, customMapPlaces, nearbyKnownPlaces.length, places.length, plannedPlaces])
  useEffect(() => {
    if (!storageReady) return
    const suggestion = nearbyKnownPlacesSuggestionForDraft
    if (!suggestion) return

    const stored = window.localStorage.getItem(nearbyKnownPlacesStorageKey)
    if (stored === `accepted:${suggestion.key}`) {
      setNearbyKnownPlaces(suggestion.places)
      setNearbyKnownPlacesPrompt(null)
      return
    }
    if (stored === `dismissed:${suggestion.key}`) return
    setNearbyKnownPlacesPrompt(suggestion)
  }, [
    nearbyKnownPlacesSuggestionForDraft,
    nearbyKnownPlacesStorageKey,
    storageReady,
  ])
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
  const visiblePlanItemGroups = useMemo(
    () => groupConsecutiveTransportItems(visiblePlanItems),
    [visiblePlanItems],
  )
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

  const directMatchedKnownPlace = useMemo(() => {
    return findDirectKnownPlaceMatch(customDraft, knownSourcePlaces)
  }, [customDraft, knownSourcePlaces])
  useEffect(() => {
    if (!storageReady || readOnlyPlan || customPlaceCount === 0) return
    setCustomPlaces((current) => {
      let changed = false
      const next = Object.fromEntries(
        Object.entries(current).map(([id, place]) => {
          if (place.sourcePlaceId) return [id, place]
          const match = findDirectKnownPlaceMatch(place, knownSourcePlaces)
          if (!match) return [id, place]
          changed = true
          return [id, { ...place, sourcePlaceId: match.id }]
        }),
      )
      return changed ? next : current
    })
  }, [customPlaceCount, knownSourcePlaces, readOnlyPlan, storageReady])

  const selectedPlace = selectedId ? placeById.get(selectedId) ?? null : null
  const customDraftCategoryLabel =
    customCategoryItems.find((item) => item.key === customDraft.category)?.label ?? '景點'
  const customDraftLinks = customDraft.id ? (placeUserLinks[customDraft.id] ?? customPlaces[customDraft.id]?.links ?? []) : []
  const customDraftSavedPlace = customDraft.id ? customPlaces[customDraft.id] : undefined
  const customDraftHasAgodaLink = hasHotelAffiliateProviderLink(customDraftLinks, 'Agoda')
  const customDraftHasTripLink = hasHotelAffiliateProviderLink(customDraftLinks, 'Trip')
  const customDraftAffiliateLookupPending =
    customDraftSavedPlace != null &&
    (agodaAffiliateStatus[customDraftSavedPlace.id] === 'searching' || tripAffiliateStatus[customDraftSavedPlace.id] === 'searching')
  const showCustomDraftHotelAffiliateRecheck =
    customDraftSavedPlace != null &&
    cleanCustomPlaceCategory(customDraftSavedPlace.category) === 'hotel' &&
    customPlaceHotelAffiliateManualLookupAllowed(customDraftSavedPlace) &&
    customPlaceHotelAffiliateEligibility(customDraftSavedPlace) !== 'pending_place_type' &&
    customDraftHasAgodaLink &&
    customDraftHasTripLink
  const customGoogleUrlNotice =
    customDraft.googleUrl.trim() && !googleMapsUrlFromInput(customDraft.googleUrl)
      ? googleMapsInputNotice(customDraft.googleUrl)
      : ''
  const showCustomPlaceConfirm =
    !customGoogleUrlNotice && Boolean(customDraft.googleUrl.trim() || customDraft.lat != null || customUrlResolving)

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

  useEffect(() => {
    if (!expandedPlanItem) return
    const isExpandedInsideTransportGroup = visiblePlanItemGroups.some(
      (item) => item.type === 'transport-group' && item.items.includes(expandedPlanItem),
    )
    if (!isExpandedInsideTransportGroup) {
      setExpandedTransportGroups((current) => (Object.keys(current).length > 0 ? {} : current))
    }
  }, [expandedPlanItem, visiblePlanItemGroups])

  useEffect(() => {
    setExpandedTransportGroups((current) => (Object.keys(current).length > 0 ? {} : current))
  }, [dayView])

  useLayoutEffect(() => {
    const anchor = expandedPlanScrollAnchorRef.current
    if (!anchor) return
    expandedPlanScrollAnchorRef.current = null
    const nextTop = anchor.element.getBoundingClientRect().top
    const offset = nextTop - anchor.top
    if (Math.abs(offset) > 1) anchor.container.scrollTop += offset
  }, [expandedPlanItem])

  useLayoutEffect(() => {
    const anchor = transportGroupScrollAnchorRef.current
    if (!anchor) return
    transportGroupScrollAnchorRef.current = null
    const nextTop = anchor.element.getBoundingClientRect().top
    const offset = nextTop - anchor.top
    if (Math.abs(offset) > 1) anchor.container.scrollTop += offset
  }, [expandedTransportGroups])

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

  useEffect(() => {
    if (customDraft.id && customDraft.lat != null && customDraft.lng != null) return
    pendingCustomMapFocusRef.current = null
  }, [customDraft.id, customDraft.lat, customDraft.lng])

  useEffect(() => {
    return () => {
      customMapFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      customMapFocusTimersRef.current = []
    }
  }, [])

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

    const id = window.setTimeout(() => {
      if (initialPlannerLoadRef.current) return
      initialPlannerLoadRef.current = true
      ;(async () => {
        try {
          const initialSearch = config.initialSearchParams
            ? `?${new URLSearchParams(config.initialSearchParams).toString()}`
            : window.location.search
          const initialParams = new URLSearchParams(initialSearch)
          const urlImageOwnerToken = plannerImageOwnerFromSearch(window.location.search)
          const hasPlannerBookLink = Boolean(
            initialParams.get(PLANNER_BOOK_PARAM)?.trim() || initialParams.get(PLANNER_PREVIEW_PARAM)?.trim(),
          )
          const plannerBook = await fetchPlannerBook(initialSearch, placeById)
          if (plannerBook) {
            const hasOrderedPlaces = plannerBook.items.some((item) => Boolean(planItemPlaceId(item)))
            const hasCustomPlaces = Boolean(plannerBook.customPlaces && Object.keys(plannerBook.customPlaces).length > 0)
            setPlannerLinkUnavailable(false)
            setPlannerBookId(plannerBook.id)
            setPlannerBookReadToken(plannerBook.readToken)
            setPlannerBookUpdatedAt(plannerBook.updatedAt)
            setReadOnlyPlan(plannerBook.readonly)
            setPlannerImages([])
            const imageOwnerStorageKey = `${config.storageKey}:${PLANNER_IMAGE_OWNER_KEY}:${plannerBook.id}`
            const imageOwnerToken = plannerBook.readonly
              ? null
              : urlImageOwnerToken ?? window.localStorage.getItem(imageOwnerStorageKey)
            setPlannerImageOwnerToken(imageOwnerToken)
            if (imageOwnerToken) {
              window.localStorage.setItem(imageOwnerStorageKey, imageOwnerToken)
              if (urlImageOwnerToken) {
                const cleanUrl = new URL(window.location.href)
                cleanUrl.searchParams.delete(PLANNER_IMAGE_OWNER_PARAM)
                window.history.replaceState(null, '', `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`)
              }
            }
            if (plannerBook.readToken) {
              void fetchPlannerImages(plannerBook.id, plannerBook.readToken).then((images) => {
                if (images) setPlannerImages(images)
              })
            }
            const checklistStorageKey = `${config.storageKey}:pre-departure:${plannerBook.id}`
            if (plannerBook.preDeparture) {
              const checklist = plannerBook.preDeparture
              setPreDepartureTravelers(checklist.travelers)
              setPreDepartureChecked(checklist.checked)
              setPreDepartureNotes(checklist.notes)
              setPreDepartureCustomItems(checklist.customItems)
              setPreDepartureRemovedItemIds(checklist.removedItemIds)
              setPreDepartureHiddenCategoryIds(checklist.hiddenCategoryIds)
              setPreDepartureActiveTargetId(checklist.travelers[0]?.id ?? PRE_DEPARTURE_OWNER.id)
              setPreDepartureStorageReadyKey(checklistStorageKey)
              preDepartureLastCloudSignatureRef.current = JSON.stringify(
                serializePreDepartureChecklistStorage(checklist),
              )
              setPreDepartureCloudStatus('saved')
            } else if (plannerBook.readonly) {
              const checklist = emptyPreDepartureChecklistStorage()
              setPreDepartureTravelers(checklist.travelers)
              setPreDepartureChecked({})
              setPreDepartureNotes({})
              setPreDepartureCustomItems([])
              setPreDepartureRemovedItemIds({})
              setPreDepartureHiddenCategoryIds({})
              setPreDepartureActiveTargetId(PRE_DEPARTURE_OWNER.id)
              setPreDepartureStorageReadyKey(checklistStorageKey)
              preDepartureLastCloudSignatureRef.current = JSON.stringify(
                serializePreDepartureChecklistStorage(checklist),
              )
              setPreDepartureCloudStatus('saved')
            }
            if (plannerBook.customPlaces) setCustomPlaces(plannerBook.customPlaces)
            if (plannerBook.userLinks) setPlaceUserLinks(plannerBook.userLinks)
            setPlanItems(plannerBook.items)
            if (plannerBook.notes) setPlaceNotes(plannerBook.notes)
            setMode(hasOrderedPlaces ? 'order' : 'add')
            setCustomOnly(!hasOrderedPlaces && hasCustomPlaces)
            setMobilePanelOpen(true)
            return
          }
          if (hasPlannerBookLink) {
            setPlannerLinkUnavailable(true)
            setPlanItems([])
            setPlaceNotes({})
            setCustomPlaces({})
            setPlaceUserLinks({})
            setPlannerImages([])
            setPlannerImageOwnerToken(null)
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

  useEffect(() => {
    if (!storageReady || dayViewStorageReadyKey === dayViewStorageKey) return
    let nextDayView: DayView = 'all'
    try {
      const stored = window.localStorage.getItem(dayViewStorageKey)
      const storedDay = stored ? Number.parseInt(stored, 10) : Number.NaN
      if (Number.isInteger(storedDay) && storedDay >= 1 && storedDay <= plannedDays.length) {
        nextDayView = storedDay
      } else if (
        !stored &&
        dayViewStorageReadyKey.endsWith(':draft') &&
        dayView !== 'all' &&
        dayView <= plannedDays.length
      ) {
        nextDayView = dayView
      }
    } catch {
      // Keep the default view when storage is unavailable.
    }
    setDayView(nextDayView)
    setDayViewStorageReadyKey(dayViewStorageKey)
  }, [dayView, dayViewStorageKey, dayViewStorageReadyKey, plannedDays.length, storageReady])

  useEffect(() => {
    if (!storageReady || dayViewStorageReadyKey !== dayViewStorageKey) return
    try {
      window.localStorage.setItem(dayViewStorageKey, String(dayView))
    } catch {
      // The planner still works when storage is unavailable.
    }
  }, [dayView, dayViewStorageKey, dayViewStorageReadyKey, storageReady])

  useEffect(() => {
    if (
      !storageReady ||
      !plannerBookId ||
      preDepartureMigrationTargetRef.current !== plannerBookId ||
      preDepartureStorageReadyKey === preDepartureStorageKey
    ) {
      return
    }
    try {
      const currentBookChecklist = window.localStorage.getItem(preDepartureStorageKey)
      const draftChecklist = window.localStorage.getItem(preDepartureDraftStorageKey)
      if (!currentBookChecklist && draftChecklist) {
        window.localStorage.setItem(preDepartureStorageKey, draftChecklist)
      }
    } catch {
      // The new personal checklist can still start empty if storage is blocked.
    } finally {
      preDepartureMigrationTargetRef.current = null
    }
  }, [
    plannerBookId,
    preDepartureDraftStorageKey,
    preDepartureStorageKey,
    preDepartureStorageReadyKey,
    storageReady,
  ])

  useEffect(() => {
    if (!storageReady || preDepartureStorageReadyKey === preDepartureStorageKey) return
    let nextChecklist = emptyPreDepartureChecklistStorage()
    try {
      const raw =
        window.localStorage.getItem(preDepartureStorageKey) ??
        (preDepartureStorageKey === preDepartureDraftStorageKey
          ? window.localStorage.getItem(`${config.storageKey}:pre-departure`)
          : null)
      nextChecklist = cleanPreDepartureChecklistStorage(raw ? JSON.parse(raw) : null)
    } catch {
      // Keep a usable empty personal checklist when storage is unavailable.
    }
    setPreDepartureTravelers(nextChecklist.travelers)
    setPreDepartureChecked(nextChecklist.checked)
    setPreDepartureNotes(nextChecklist.notes)
    setPreDepartureCustomItems(nextChecklist.customItems)
    setPreDepartureRemovedItemIds(nextChecklist.removedItemIds)
    setPreDepartureHiddenCategoryIds(nextChecklist.hiddenCategoryIds)
    let storedTargetId = PRE_DEPARTURE_OWNER.id
    try {
      storedTargetId = window.localStorage.getItem(`${preDepartureStorageKey}:active-target`) ?? PRE_DEPARTURE_OWNER.id
    } catch {
      // Keep the shared list selected when local storage is unavailable.
    }
    const validTarget = nextChecklist.travelers.some((traveler) => traveler.id === storedTargetId)
    setPreDepartureActiveTargetId(validTarget ? storedTargetId : nextChecklist.travelers[0]?.id ?? PRE_DEPARTURE_OWNER.id)
    setPreDepartureStorageReadyKey(preDepartureStorageKey)
  }, [config.storageKey, preDepartureDraftStorageKey, preDepartureStorageKey, preDepartureStorageReadyKey, storageReady])

  useEffect(() => {
    if (!storageReady || preDepartureStorageReadyKey !== preDepartureStorageKey) return
    try {
      window.localStorage.setItem(
        preDepartureStorageKey,
        JSON.stringify(serializePreDepartureChecklistStorage(preDepartureChecklist)),
      )
    } catch {
      // The checklist remains usable for this visit when storage is unavailable.
    }
  }, [
    preDepartureChecklist,
    preDepartureStorageKey,
    preDepartureStorageReadyKey,
    storageReady,
  ])

  useEffect(() => {
    if (!storageReady || preDepartureStorageReadyKey !== preDepartureStorageKey) return
    if (
      !preDepartureTravelers.some((traveler) => traveler.id === preDepartureActiveTargetId)
    ) {
      setPreDepartureActiveTargetId(preDepartureTravelers[0]?.id ?? PRE_DEPARTURE_OWNER.id)
      return
    }
    try {
      window.localStorage.setItem(`${preDepartureStorageKey}:active-target`, preDepartureActiveTargetId)
    } catch {
      // The selected tab is convenience-only and does not affect the checklist.
    }
  }, [
    preDepartureActiveTargetId,
    preDepartureStorageKey,
    preDepartureStorageReadyKey,
    preDepartureTravelers,
    storageReady,
  ])

  useEffect(() => () => {
    if (preDepartureCloudSaveTimerRef.current != null) {
      window.clearTimeout(preDepartureCloudSaveTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (
      !storageReady ||
      readOnlyPlan ||
      !plannerBookId ||
      preDepartureStorageReadyKey !== preDepartureStorageKey
    ) {
      if (!plannerBookId) setPreDepartureCloudStatus('local')
      return
    }
    if (preDepartureChecklistSignature === preDepartureLastCloudSignatureRef.current) {
      setPreDepartureCloudStatus('saved')
      return
    }
    if (preDepartureCloudSaveTimerRef.current != null) {
      window.clearTimeout(preDepartureCloudSaveTimerRef.current)
    }
    const checklist = preDepartureChecklist
    preDepartureCloudSaveTimerRef.current = window.setTimeout(() => {
      setPreDepartureCloudStatus('saving')
      void savePreDepartureChecklistCloud(plannerBookId, checklist)
        .then((result) => {
          if (!result) {
            setPreDepartureCloudStatus('error')
            return
          }
          preDepartureLastCloudSignatureRef.current = JSON.stringify(
            serializePreDepartureChecklistStorage(result.checklist),
          )
          setPreDepartureCloudStatus('saved')
          if (result.updatedAt) setPlannerBookUpdatedAt(result.updatedAt)
        })
        .catch(() => setPreDepartureCloudStatus('error'))
      preDepartureCloudSaveTimerRef.current = null
    }, 650)
    return () => {
      if (preDepartureCloudSaveTimerRef.current != null) {
        window.clearTimeout(preDepartureCloudSaveTimerRef.current)
        preDepartureCloudSaveTimerRef.current = null
      }
    }
  }, [
    plannerBookId,
    preDepartureChecklist,
    preDepartureChecklistSignature,
    preDepartureStorageKey,
    preDepartureStorageReadyKey,
    readOnlyPlan,
    storageReady,
  ])

  useEffect(() => {
    if (!preDepartureOpen || !plannerBookId || preDepartureCloudStatus === 'saving') return
    let cancelled = false
    const refresh = async () => {
      const result = await fetchPreDepartureChecklistCloud(plannerBookId).catch(() => null)
      if (!result || cancelled) return
      const remoteSignature = JSON.stringify(serializePreDepartureChecklistStorage(result.checklist))
      if (
        remoteSignature === preDepartureLastCloudSignatureRef.current ||
        preDepartureChecklistSignature !== preDepartureLastCloudSignatureRef.current
      ) {
        return
      }
      const checklist = result.checklist
      preDepartureLastCloudSignatureRef.current = remoteSignature
      setPreDepartureTravelers(checklist.travelers)
      setPreDepartureChecked(checklist.checked)
      setPreDepartureNotes(checklist.notes)
      setPreDepartureCustomItems(checklist.customItems)
      setPreDepartureRemovedItemIds(checklist.removedItemIds)
      setPreDepartureHiddenCategoryIds(checklist.hiddenCategoryIds)
      setPreDepartureCloudStatus('saved')
      if (result.updatedAt) setPlannerBookUpdatedAt(result.updatedAt)
    }
    void refresh()
    const interval = window.setInterval(() => void refresh(), 5000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [
    plannerBookId,
    preDepartureChecklistSignature,
    preDepartureCloudStatus,
    preDepartureOpen,
  ])

  useEffect(() => {
    if (preDepartureTransferStatus === 'idle') return
    const timeout = window.setTimeout(() => setPreDepartureTransferStatus('idle'), 7000)
    return () => window.clearTimeout(timeout)
  }, [preDepartureTransferStatus])

  useEffect(() => {
    if (!storageReady || !plannerBookId || typeof window === 'undefined') return
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
    const transferValue = new URLSearchParams(hash).get('pre-departure') ?? ''
    const transfer = decodePreDepartureTransfer(transferValue)
    if (!transfer || transfer.bookId !== plannerBookId) return

    const { checklist } = transfer
    setPreDepartureTravelers(checklist.travelers)
    setPreDepartureChecked(checklist.checked)
    setPreDepartureNotes(checklist.notes)
    setPreDepartureCustomItems(checklist.customItems)
    setPreDepartureRemovedItemIds(checklist.removedItemIds)
    setPreDepartureHiddenCategoryIds(checklist.hiddenCategoryIds)
    setPreDepartureStorageReadyKey(preDepartureStorageKey)
    try {
      window.localStorage.setItem(
        preDepartureStorageKey,
        JSON.stringify(serializePreDepartureChecklistStorage(checklist)),
      )
    } catch {
      // The transferred checklist remains usable for this visit when storage is unavailable.
    }
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setPreDepartureOpen(true)
    setPreDepartureTransferStatus('imported')
  }, [plannerBookId, preDepartureStorageKey, storageReady])

  const selectDayView = useCallback((nextDayView: DayView) => {
    setDayView(nextDayView)
    window.requestAnimationFrame(() => {
      planListRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    })
  }, [])

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
      pendingHalfPanelExpandItemRef.current = focusTarget.mode === 'order' && focusTarget.itemId ? focusTarget.itemId : null
      pendingHalfPanelFocusRetryRef.current = 0
    } else {
      pendingHalfPanelExpandItemRef.current = null
    }
    if (source === 'marker' || (source === 'list' && isMobilePlannerViewport())) setMobilePanelState('half')
    setSelectedPlanItem(planItem)
    setSelectedId(place.id)
    const map = mapRef.current
    if (map) {
      exitLocationFollowMode()
      focusMapOnPlace(map, place)
    }

    if (!shouldScrollAfterPanelShrink) {
      scheduleFocusTargetCenter(focusTarget)
    }
  }, [exitLocationFollowMode, scheduleFocusTargetCenter])

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
      if (map) {
        exitLocationFollowMode()
        focusMapOnPlace(map, place)
      }

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
      exitLocationFollowMode,
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
    const applyExpandedPlanItem = (item: PlannerItem | null) => {
      syncExpandedPlanItemSelection(item)
      setExpandedPlanItem(item)
    }
    if (expandedPlanScrollCollapseTimerRef.current != null) {
      window.clearTimeout(expandedPlanScrollCollapseTimerRef.current)
      expandedPlanScrollCollapseTimerRef.current = null
    }
    if (previousItem === nextItem) {
      applyExpandedPlanItem(nextItem)
      return
    }

    if (nextItem && isMobilePlannerViewport()) {
      expandedPlanScrollAnchorRef.current = null
      applyExpandedPlanItem(nextItem)
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
      applyExpandedPlanItem(nextItem)
      return
    }

    expandedPlanScrollAnchorRef.current = {
      element: anchorCard,
      top: anchorCard.getBoundingClientRect().top,
      container,
    }
    applyExpandedPlanItem(nextItem)
  }, [expandedPlanItem, scheduleFocusTargetCenter, syncExpandedPlanItemSelection])

  const rememberTransportGroupScrollAnchor = useCallback((container: HTMLElement | null) => {
    if (!container) return
    const anchorCard = findStableVisiblePlanCard(container)
    if (!anchorCard) return
    transportGroupScrollAnchorRef.current = {
      element: anchorCard,
      top: anchorCard.getBoundingClientRect().top,
      container,
    }
  }, [])

  const collapseOpenTransportGroups = useCallback(() => {
    if (Object.keys(expandedTransportGroups).length === 0) return
    rememberTransportGroupScrollAnchor(planListRef.current)
    setExpandedTransportGroups((current) => (Object.keys(current).length > 0 ? {} : current))
  }, [expandedTransportGroups, rememberTransportGroupScrollAnchor])

  const scheduleExpandedPlanItemCollapseIfNearlyOutside = useCallback((event: ReactUIEvent<HTMLDivElement>) => {
    const container = event.currentTarget
    if (expandedPlanScrollCollapseTimerRef.current != null) {
      window.clearTimeout(expandedPlanScrollCollapseTimerRef.current)
    }
    expandedPlanScrollCollapseTimerRef.current = window.setTimeout(() => {
      let activeCardCollapsed = false
      if (expandedPlanItem) {
        const card = planCardRefs.current[expandedPlanItem] ?? transportCardRefs.current[expandedPlanItem]
        if (card && cardIsNearlyOutsideScrollArea(card, container)) {
          activeCardCollapsed = true
          setExpandedPlanItemWithScrollCompensation(null, findStableVisiblePlanCard(container, expandedPlanItem))
        }
      }

      const groupKeysToCollapse = Object.keys(expandedTransportGroups).filter((key) => {
        const group = transportGroupRefs.current[key]
        return group && cardIsNearlyOutsideScrollArea(group, container)
      })
      if (groupKeysToCollapse.length > 0) {
        rememberTransportGroupScrollAnchor(container)
        setExpandedTransportGroups((current) => {
          const next = { ...current }
          groupKeysToCollapse.forEach((key) => delete next[key])
          return next
        })
        const activeItemIsInCollapsedGroup = visiblePlanItemGroups.some(
          (item) =>
            item.type === 'transport-group' &&
            groupKeysToCollapse.includes(item.key) &&
            expandedPlanItem !== null &&
            item.items.includes(expandedPlanItem),
        )
        if (activeItemIsInCollapsedGroup && !activeCardCollapsed) {
          setExpandedPlanItemWithScrollCompensation(null, findStableVisiblePlanCard(container, expandedPlanItem))
        }
      }
      expandedPlanScrollCollapseTimerRef.current = null
    }, 140)
  }, [expandedPlanItem, expandedTransportGroups, rememberTransportGroupScrollAnchor, setExpandedPlanItemWithScrollCompensation, visiblePlanItemGroups])

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
    const map = mapRef.current
    if (!mapReady || !map || !window.google?.maps) return

    const orderMarkerItems = visiblePlanItems
      .map((item) => {
        const place = planItemPlace(item, placeById)
        return place ? { item, place } : null
      })
      .filter(Boolean) as { item: PlannerItem; place: MapPlace }[]
    const markerEntries =
      mode === 'order'
        ? orderMarkerItems.map((entry, index) => ({ ...entry, key: entry.item, orderIndex: index }))
        : filteredPlaces.map((place, index) => ({ item: place.id, place, key: place.id, orderIndex: index }))
    const markerPlaceTotals = new Map<string, number>()
    markerEntries.forEach(({ place }) => {
      markerPlaceTotals.set(place.id, (markerPlaceTotals.get(place.id) ?? 0) + 1)
    })
    const markerPlaceSeen = new Map<string, number>()

    const labelItems = markerEntries.map(({ item, place, key, orderIndex }) => {
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
      const selected =
        mode === 'order' ? (selectedPlanItem ? key === selectedPlanItem : place.id === selectedId) : place.id === selectedId
      return {
        id: key,
        position: markerPosition,
        text: mode === 'order' && orderLabel ? `${orderLabel}. ${plannerPlaceName(place)}` : plannerPlaceName(place),
        selected,
        priority: (selected ? 10000 : 0) + (mode === 'order' ? 500 : 0) - orderIndex,
      }
    })

    const updateLabels = () => {
      syncSmartMapLabels(map, labelOverlaysRef.current, labelItems, {
        className: styles.smartMapLabel,
        selectedClassName: styles.smartMapLabelSelected,
        minZoom: mode === 'order' ? 13 : 15,
        fullZoom: 17,
        maxMobileLabels: readOnlyPlan ? 14 : 10,
        maxDesktopLabels: readOnlyPlan ? 42 : 30,
      })
    }

    updateLabels()
    const idleL = google.maps.event.addListener(map, 'idle', updateLabels)
    const zoomL = google.maps.event.addListener(map, 'zoom_changed', updateLabels)
    return () => {
      google.maps.event.removeListener(idleL)
      google.maps.event.removeListener(zoomL)
    }
  }, [filteredPlaces, mapReady, mode, placeById, planOrderLabels, readOnlyPlan, selectedId, selectedPlanItem, visiblePlanItems])

  useEffect(() => {
    const overlays = labelOverlaysRef.current
    return () => clearSmartMapLabels(overlays)
  }, [])

  useEffect(() => {
    if (!apiKey) return
    if (mapRef.current) return

    let cancelled = false
    const cleanupFns: Array<() => void> = []
    ;(async () => {
      try {
        await loadGoogleMapsScript(apiKey)
        if (cancelled || !mapElRef.current) return
        const mapOptions: google.maps.MapOptions = {
          center: mapCenter,
          zoom: config.mapZoom,
          disableDefaultUI: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          draggable: true,
          scrollwheel: true,
          zoomControl: false,
          renderingType: google.maps.RenderingType.VECTOR,
          headingInteractionEnabled: true,
          tiltInteractionEnabled: true,
        }
        mapRef.current = new google.maps.Map(mapElRef.current, mapOptions)
        const mapElement = mapElRef.current
        const markGesture = () => markMapUserGesture()
        const markTouchGesture = (event: TouchEvent) => {
          if (event.touches.length >= 2) markMapUserGesture()
        }
        mapElement.addEventListener('pointerdown', markGesture, { passive: true })
        mapElement.addEventListener('wheel', markGesture, { passive: true })
        mapElement.addEventListener('touchstart', markTouchGesture, { passive: true })
        mapElement.addEventListener('touchmove', markTouchGesture, { passive: true })
        mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (customDraftRef.current.picking && e.latLng) {
            exitLocationFollowMode()
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            setCustomDraft((draft) => ({
              ...draft,
              lat,
              lng,
              googlePlaceId: '',
              googlePlaceName: '',
              googlePlaceLat: null,
              googlePlaceLng: null,
              googlePlaceTypes: [],
              googlePlaceTypesResolved: false,
              naverPlaceId: '',
              naverPlaceName: '',
            }))
            return
          }
          setMobilePanelOpen(false)
        })
        const handleManualCameraChange = () => {
          const userGestureActive = Date.now() <= mapUserGestureUntilRef.current
          if (autoFittingMapRef.current || (autoCenteringLocationRef.current && !userGestureActive)) return
          userAdjustedMapRef.current = true
          exitLocationFollowMode(true)
        }
        const zoomListener = mapRef.current.addListener('zoom_changed', handleManualCameraChange)
        const headingListener = mapRef.current.addListener('heading_changed', handleManualCameraChange)
        const tiltListener = mapRef.current.addListener('tilt_changed', handleManualCameraChange)
        const dragListener = mapRef.current.addListener('dragstart', () => {
          userAdjustedMapRef.current = true
          exitLocationFollowMode(true)
          setMobilePanelOpen(false)
        })
        cleanupFns.push(() => zoomListener.remove())
        cleanupFns.push(() => headingListener.remove())
        cleanupFns.push(() => tiltListener.remove())
        cleanupFns.push(() => dragListener.remove())
        cleanupFns.push(() => mapElement.removeEventListener('pointerdown', markGesture))
        cleanupFns.push(() => mapElement.removeEventListener('wheel', markGesture))
        cleanupFns.push(() => mapElement.removeEventListener('touchstart', markTouchGesture))
        cleanupFns.push(() => mapElement.removeEventListener('touchmove', markTouchGesture))
        setMapReady(true)
        setMapError(null)
      } catch {
        if (!cancelled) setMapError('無法載入 Google 地圖，請檢查 API Key 與權限。')
      }
    })()

    return () => {
      cancelled = true
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [apiKey, config.mapZoom, exitLocationFollowMode, mapCenter, markMapUserGesture, setMobilePanelOpen])

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
    const draftPosition = { lat: customDraft.lat, lng: customDraft.lng }
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
        exitLocationFollowMode()
        setCustomDraft((draft) => ({
          ...draft,
          lat: e.latLng?.lat() ?? draft.lat,
          lng: e.latLng?.lng() ?? draft.lng,
          googlePlaceId: '',
          googlePlaceName: '',
          googlePlaceLat: null,
          googlePlaceLng: null,
          googlePlaceTypes: [],
          googlePlaceTypesResolved: false,
          naverPlaceId: '',
          naverPlaceName: '',
        }))
      })
    }
    customDraftMarkerRef.current.setPosition(draftPosition)
    customDraftMarkerRef.current.setTitle(customDraft.name || '自訂景點')
    customDraftMarkerRef.current.setDraggable(true)
    customDraftMarkerRef.current.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: 16,
      fillColor: '#475569',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 3,
    })
    customDraftMarkerRef.current.setLabel({ text: '?', color: '#ffffff', fontSize: '13px', fontWeight: '900' })
    customDraftMarkerRef.current.setZIndex(3000)
    customDraftMarkerRef.current.setMap(map)
  }, [customDraft.lat, customDraft.lng, customDraft.name, exitLocationFollowMode, mapReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !customDraft.picking || customDraft.lat == null || customDraft.lng == null) return
    const position = { lat: customDraft.lat, lng: customDraft.lng }
    const pendingPosition = pendingCustomMapFocusRef.current
    if (
      pendingPosition &&
      Math.abs(pendingPosition.lat - position.lat) < 0.0000001 &&
      Math.abs(pendingPosition.lng - position.lng) < 0.0000001
    ) {
      return
    }
    window.setTimeout(() => {
      exitLocationFollowMode()
      focusMapOnPosition(map, position, 0.25)
    }, 160)
  }, [customDraft.lat, customDraft.lng, customDraft.picking, exitLocationFollowMode, mapReady])

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

  useEffect(() => {
    return () => {
      clearLocationWatch()
      locationFollowModeRef.current = 'idle'
      locationPausedFollowModeRef.current = null
      if (autoCenteringLocationTimerRef.current !== null) {
        window.clearTimeout(autoCenteringLocationTimerRef.current)
        autoCenteringLocationTimerRef.current = null
      }
      stopLocationAnimation()
      stopLocationCameraAnimation()
      stopDeviceHeadingWatch()
      autoCenteringLocationRef.current = false
      locationFollowingRef.current = false
      locationLastCenteredRef.current = null
      locationRenderedPositionRef.current = null
      locationHeadingRef.current = null
      locationLastHeadingRef.current = null
      locationSpeedRef.current = null
      locationPositionUpdatedAtRef.current = 0
      deviceHeadingRef.current = null
      deviceHeadingUpdatedAtRef.current = 0
      locationRequestingRef.current = false
    }
  }, [clearLocationWatch, stopDeviceHeadingWatch, stopLocationAnimation, stopLocationCameraAnimation])

  useEffect(() => {
    if (!mapReady || mapError || !mapShellRef.current || locateButtonRef.current) return

    const button = document.createElement('button')
    button.type = 'button'
    button.className = styles.mapLocateButton
    button.setAttribute('aria-label', '定位我的目前位置')
    button.title = '定位我的目前位置'

    const iconDot = document.createElement('span')
    iconDot.setAttribute('aria-hidden', 'true')
    button.append(iconDot)
    const openPrompt = () => {
      setLocationPromptMessage('')
      locateUser()
    }
    button.addEventListener('click', openPrompt)
    mapShellRef.current.append(button)
    locateButtonRef.current = button
    syncLocateButtonState()

    return () => {
      button.removeEventListener('click', openPrompt)
      button.remove()
      if (locateButtonRef.current === button) locateButtonRef.current = null
    }
  }, [locateUser, mapError, mapReady, syncLocateButtonState])

  const dismissInAppPrompt = useCallback(() => {
    try {
      if (inAppPromptIdentity) {
        window.sessionStorage.setItem(
          `${config.storageKey}:in-app-browser-prompt-dismissed:${inAppPromptIdentity}`,
          '1',
        )
      }
    } catch {
      // Ignore storage limits or private-browser restrictions.
    }
    setInAppPromptOpen(false)
  }, [config.storageKey, inAppPromptIdentity])

  const maybeOpenInAppPrompt = useCallback(() => {
    if (!config.saveReminderEnabled || !inAppBrowser || !inAppPromptIdentity) return
    try {
      if (
        window.sessionStorage.getItem(
          `${config.storageKey}:in-app-browser-prompt-dismissed:${inAppPromptIdentity}`,
        ) === '1'
      ) {
        return
      }
    } catch {
      // If storage is blocked, still show the prompt once in this session.
    }
    setInAppPromptCopied(false)
    setInAppPromptOpen(true)
  }, [config.saveReminderEnabled, config.storageKey, inAppBrowser, inAppPromptIdentity])

  useEffect(() => {
    if (!storageReady || !plannerBookId) return
    maybeOpenInAppPrompt()
  }, [maybeOpenInAppPrompt, plannerBookId, storageReady])

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
    cancelHotelAffiliateLookupForCustomPlace(placeId)
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
      setAgodaAffiliateStatus((status) => {
        const nextStatus = { ...status }
        delete nextStatus[placeId]
        return nextStatus
      })
      setTripAffiliateStatus((status) => {
        const nextStatus = { ...status }
        delete nextStatus[placeId]
        return nextStatus
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
    setMobilePanelState(isMobilePlannerViewport() ? 'full' : 'half')
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
    setExpandedPlanItem(null)
    scheduleFocusTargetCenter({ mode: 'transport', itemId: nextItem }, 'smooth', 90)
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

  const ensurePlannerImageOwner = useCallback(async () => {
    if (!plannerBookId || readOnlyPlan) return null
    if (plannerImageOwnerToken) return plannerImageOwnerToken
    const storageKey = `${config.storageKey}:${PLANNER_IMAGE_OWNER_KEY}:${plannerBookId}`
    const storedToken = window.localStorage.getItem(storageKey)?.trim() ?? ''
    if (storedToken) {
      setPlannerImageOwnerToken(storedToken)
      return storedToken
    }
    const claimedToken = await claimPlannerImageOwner(plannerBookId)
    if (!claimedToken) {
      alert('這份行程的圖片管理權限已在其他瀏覽器建立。請回到原本建立行程的裝置管理圖片。')
      return null
    }
    window.localStorage.setItem(storageKey, claimedToken)
    setPlannerImageOwnerToken(claimedToken)
    return claimedToken
  }, [config.storageKey, plannerBookId, plannerImageOwnerToken, readOnlyPlan])

  const addPlannerImage = useCallback(async (itemId: string, file: File) => {
    if (readOnlyPlan) return
    if (!plannerBookId) {
      alert('請先按「儲存更新」建立你的行程，再加入照片。')
      return
    }
    if (plannerImageBusy) return
    if (plannerImages.length >= PLANNER_IMAGE_MAX_PER_BOOK) {
      alert(`每份行程最多 ${PLANNER_IMAGE_MAX_PER_BOOK} 張照片。`)
      return
    }
    if (plannerImages.filter((image) => image.placeId === itemId).length >= PLANNER_IMAGE_MAX_PER_PLACE) {
      alert(`每個景點最多 ${PLANNER_IMAGE_MAX_PER_PLACE} 張照片。`)
      return
    }
    setPlannerImageBusy(true)
    try {
      const prepared = await imageFromFile(file)
      const ownerToken = await ensurePlannerImageOwner()
      if (!ownerToken) return
      const result = await uploadPlannerImage(plannerBookId, itemId, ownerToken, prepared.file, prepared.width, prepared.height)
      if (result?.images) {
        setPlannerImages(result.images)
        return
      }
      if (result?.error === 'image_limit_reached') {
        alert(`照片數量已達上限：每個景點 ${PLANNER_IMAGE_MAX_PER_PLACE} 張、每份行程 ${PLANNER_IMAGE_MAX_PER_BOOK} 張。`)
      } else if (result?.error === 'owner_required') {
        alert('圖片管理權限已失效，請重新開啟你的行程後再試。')
      } else {
        alert('照片上傳失敗，請換一張較小的 JPEG、PNG 或 WebP 圖片再試。')
      }
    } catch (error) {
      alert(error instanceof Error && error.message === 'unsupported_image' ? '請選擇 10MB 以下的 JPEG、PNG 或 WebP 圖片。' : '照片壓縮失敗，請換一張圖片再試。')
    } finally {
      setPlannerImageBusy(false)
    }
  }, [ensurePlannerImageOwner, plannerBookId, plannerImageBusy, plannerImages, readOnlyPlan])

  const removePlannerImage = useCallback(async (imageId: string) => {
    if (!plannerBookId || plannerImageBusy || readOnlyPlan) return
    setPlannerImageBusy(true)
    try {
      const ownerToken = await ensurePlannerImageOwner()
      if (!ownerToken) return
      const result = await deletePlannerImage(plannerBookId, imageId, ownerToken)
      if (result?.images) setPlannerImages(result.images)
      else alert('照片移除失敗，請稍後再試。')
    } finally {
      setPlannerImageBusy(false)
    }
  }, [ensurePlannerImageOwner, plannerBookId, plannerImageBusy, readOnlyPlan])

  const addPlaceUserLink = (placeId: string, link: PlannerUserLink) => {
    if (readOnlyPlan) return
    const label = link.label.trim().slice(0, 40)
    const href = normalizePlannerAffiliateHref(link.href).slice(0, 500)
    if (!label || !href) return
    const provider = hotelAffiliateProviderForLink({ label, href })
    if (provider) cancelHotelAffiliateLookupForCustomPlace(placeId, provider)
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
    const href = normalizePlannerAffiliateHref(hrefValue).slice(0, 500)
    if (!label || !href) return
    const provider = hotelAffiliateProviderForLink({ label, href })
    if (provider) cancelHotelAffiliateLookupForCustomPlace(placeId, provider)
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

  const appendHotelAffiliateLink = useCallback((
    placeId: string,
    provider: HotelAffiliateProvider,
    bookingUrl: string,
    options?: { persist?: boolean; replaceProvider?: boolean },
  ) => {
    const shouldPersist = options?.persist !== false
    const safeBookingUrl = cleanHotelAffiliateBookingUrl(bookingUrl, provider)
    if (!safeBookingUrl) return
    const link = { label: provider, href: safeBookingUrl }
    setPlaceUserLinks((links) => {
      const nextLinks = mergeCustomPlannerLinks(links[placeId], link, {
        replaceProvider: options?.replaceProvider === true,
      })
      if (nextLinks === links[placeId]) return links
      return { ...links, [placeId]: nextLinks }
    })
    if (!shouldPersist) return
    setCustomPlaces((current) => {
      const place = current[placeId]
      if (!place) return current
      const nextLinks = mergeCustomPlannerLinks(place.links, link, {
        replaceProvider: options?.replaceProvider === true,
      })
      if (nextLinks === place.links) return current
      return {
        ...current,
        [placeId]: {
          ...place,
          links: nextLinks,
        },
      }
    })
  }, [])

  const setCustomPlaceGoogleTypes = useCallback((placeId: string, googlePlaceId: string, typesValue: unknown, resolved = true) => {
    const types = cleanGooglePlaceTypes(typesValue)
    const currentPlace = customPlacesRef.current[placeId]
    if (
      currentPlace?.googlePlaceId?.trim() === googlePlaceId.trim() &&
      (!sameStringArray(currentPlace.googlePlaceTypes, types) || currentPlace.googlePlaceTypesResolved !== resolved)
    ) {
      cancelHotelAffiliateLookupForCustomPlace(placeId)
    }
    setCustomPlaces((current) => {
      const place = current[placeId]
      if (!place || place.googlePlaceId?.trim() !== googlePlaceId.trim()) return current
      if (sameStringArray(place.googlePlaceTypes, types) && place.googlePlaceTypesResolved === resolved) return current

      const nextPlace: CustomPlannerPlace = {
        ...place,
        googlePlaceTypesResolved: resolved,
      }
      if (types.length > 0) nextPlace.googlePlaceTypes = types
      else delete nextPlace.googlePlaceTypes
      return { ...current, [placeId]: nextPlace }
    })
  }, [cancelHotelAffiliateLookupForCustomPlace])

  const setCustomPlaceGoogleIdentity = useCallback((
    placeId: string,
    identity: {
      resolvedUrl?: string
      name?: string
      googlePlaceId?: string
      googlePlaceLat?: number
      googlePlaceLng?: number
      googlePlaceTypes?: string[]
      googlePlaceTypesResolved?: boolean
    },
  ) => {
    const googlePlaceTypes = cleanGooglePlaceTypes(identity.googlePlaceTypes)
    const currentPlace = customPlacesRef.current[placeId]
    const nextGooglePlaceId = identity.googlePlaceId?.trim() ?? ''
    const nextGooglePlaceName = identity.name?.trim() ?? ''
    const coordinatesChanged =
      typeof identity.googlePlaceLat === 'number' &&
      typeof identity.googlePlaceLng === 'number' &&
      (
        currentPlace?.googlePlaceLat !== identity.googlePlaceLat ||
        currentPlace?.googlePlaceLng !== identity.googlePlaceLng
      )
    if (
      currentPlace &&
      (
        (nextGooglePlaceId && nextGooglePlaceId !== currentPlace.googlePlaceId) ||
        (nextGooglePlaceName && nextGooglePlaceName !== currentPlace.googlePlaceName) ||
        coordinatesChanged ||
        (googlePlaceTypes.length > 0 &&
          !sameStringArray(cleanGooglePlaceTypes(currentPlace.googlePlaceTypes), googlePlaceTypes)) ||
        (
          (identity.googlePlaceTypesResolved === true || googlePlaceTypes.length > 0) &&
          currentPlace.googlePlaceTypesResolved !== true
        )
      )
    ) {
      cancelHotelAffiliateLookupForCustomPlace(placeId)
    }
    setCustomPlaces((current) => {
      const place = current[placeId]
      if (!place) return current

      const nextPlace: CustomPlannerPlace = { ...place }
      const resolvedUrl = identity.resolvedUrl?.trim()
      if (resolvedUrl && resolvedUrl !== place.googleUrl) nextPlace.googleUrl = resolvedUrl

      const googlePlaceId = identity.googlePlaceId?.trim() ?? ''
      if (googlePlaceId && googlePlaceId !== place.googlePlaceId) nextPlace.googlePlaceId = googlePlaceId

      const googlePlaceName = identity.name?.trim()
      if (googlePlaceName && googlePlaceName !== place.googlePlaceName) nextPlace.googlePlaceName = googlePlaceName

      if (typeof identity.googlePlaceLat === 'number' && typeof identity.googlePlaceLng === 'number') {
        nextPlace.googlePlaceLat = identity.googlePlaceLat
        nextPlace.googlePlaceLng = identity.googlePlaceLng
      }
      if (googlePlaceTypes.length > 0) nextPlace.googlePlaceTypes = googlePlaceTypes
      if (identity.googlePlaceTypesResolved === true || googlePlaceTypes.length > 0) nextPlace.googlePlaceTypesResolved = true

      const unchanged =
        nextPlace.googleUrl === place.googleUrl &&
        nextPlace.googlePlaceId === place.googlePlaceId &&
        nextPlace.googlePlaceName === place.googlePlaceName &&
        nextPlace.googlePlaceLat === place.googlePlaceLat &&
        nextPlace.googlePlaceLng === place.googlePlaceLng &&
        sameStringArray(cleanGooglePlaceTypes(nextPlace.googlePlaceTypes), cleanGooglePlaceTypes(place.googlePlaceTypes)) &&
        nextPlace.googlePlaceTypesResolved === place.googlePlaceTypesResolved
      if (unchanged) return current

      return { ...current, [placeId]: nextPlace }
    })
  }, [cancelHotelAffiliateLookupForCustomPlace])

  const setCustomPlaceGoogleDetails = useCallback((
    placeId: string,
    googlePlaceId: string,
    details: GooglePlaceDetailsData,
    options?: { persist?: boolean },
  ) => {
    const types = cleanGooglePlaceTypes(details.types)
    const shouldPersist = options?.persist !== false
    const currentPlace = customPlacesRef.current[placeId]
    const nextName = details.name?.trim() ?? ''
    if (
      currentPlace?.googlePlaceId?.trim() === googlePlaceId.trim() &&
      (
        (nextName && nextName !== currentPlace.googlePlaceName) ||
        (
          typeof details.lat === 'number' &&
          typeof details.lng === 'number' &&
          (currentPlace.googlePlaceLat !== details.lat || currentPlace.googlePlaceLng !== details.lng)
        ) ||
        (types.length > 0 &&
          !sameStringArray(cleanGooglePlaceTypes(currentPlace.googlePlaceTypes), types)) ||
        currentPlace.googlePlaceTypesResolved !== true
      )
    ) {
      cancelHotelAffiliateLookupForCustomPlace(placeId)
    }
    setCustomPlaces((current) => {
      const place = current[placeId]
      if (!place || place.googlePlaceId?.trim() !== googlePlaceId.trim()) return current

      const nextPlace: CustomPlannerPlace = { ...place }
      const nextName = details.name?.trim()
      if (nextName && nextName !== place.googlePlaceName) nextPlace.googlePlaceName = nextName
      if (typeof details.lat === 'number' && typeof details.lng === 'number') {
        nextPlace.googlePlaceLat = details.lat
        nextPlace.googlePlaceLng = details.lng
      }
      if (types.length > 0) nextPlace.googlePlaceTypes = types
      nextPlace.googlePlaceTypesResolved = true

      const unchanged =
        nextPlace.googlePlaceName === place.googlePlaceName &&
        nextPlace.googlePlaceLat === place.googlePlaceLat &&
        nextPlace.googlePlaceLng === place.googlePlaceLng &&
        sameStringArray(cleanGooglePlaceTypes(nextPlace.googlePlaceTypes), cleanGooglePlaceTypes(place.googlePlaceTypes)) &&
        nextPlace.googlePlaceTypesResolved === place.googlePlaceTypesResolved
      if (unchanged) return current

      return { ...current, [placeId]: nextPlace }
    })
  }, [cancelHotelAffiliateLookupForCustomPlace])

  const resolveGooglePlaceDetailsInBrowser = useCallback(async (
    googlePlaceId: string,
    _locale: GooglePlaceDetailsLocale,
  ) => {
    const placesReady = await loadGooglePlacesLibrary()
    const Place = window.google?.maps?.places?.Place
    if (!placesReady || !Place) return null
    const place = new Place({ id: googlePlaceId })
    const response = await place
      .fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'types', 'googleMapsURI', 'websiteURI'] })
      .then(() => place)
      .catch(() => null)
    return googlePlaceDetailsFromPlace(response)
  }, [])

  // Use Places API (New) for the canonical identity. PlacesService is a legacy
  // API and is intentionally not enabled for this project.
  const findGooglePlaceIdentityInBrowser = useCallback(async (
    query: string,
    referenceCoordinates: { lat: number; lng: number },
  ): Promise<GooglePlaceIdentityData | null> => {
    const cleanQuery = query.trim()
    if (!cleanQuery) return null

    const placesReady = await loadGooglePlacesLibrary()
    const Place = window.google?.maps?.places?.Place
    if (!placesReady || !Place) return null

    const response = await Place.searchByText({
      textQuery: cleanQuery,
      fields: ['id', 'displayName', 'location', 'types'],
      language: 'en',
      locationBias: {
        center: referenceCoordinates,
        radius: TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS * 3,
      },
      maxResultCount: 10,
    }).catch(() => null)
    if (!response?.places) return null

    const matches = response.places
      .map((place) => {
        const googlePlaceId = place.id.trim()
        const details = googlePlaceDetailsFromPlace(place)
        const lat = details?.lat
        const lng = details?.lng
        if (!googlePlaceId || !details || lat == null || lng == null) return null
        const distance = distanceMeters(referenceCoordinates, { lat, lng })
        if (distance > TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS) return null
        return {
          googlePlaceId,
          ...(details.name ? { name: details.name } : {}),
          lat,
          lng,
          types: cleanGooglePlaceTypes(details.types),
          distance,
        }
      })
      .filter((result): result is GooglePlaceIdentityData & { distance: number } => result !== null)
      .sort((left, right) => left.distance - right.distance)

    const match = matches[0]
    if (!match) return null
    const { distance: _distance, ...identity } = match
    return identity
  }, [])

  // A Maps feature ID (`0x...` or `g/...`) is not a reusable Place ID. Resolve
  // from the title and coordinates in the browser without spending SerpAPI;
  // the provider-specific Trip lookup remains the only SerpAPI consumer.
  const findGooglePlaceIdentityFromQuery = useCallback(async (
    query: string,
    referenceCoordinates: { lat: number; lng: number },
    _googleMapsDataId = '',
  ): Promise<GooglePlaceIdentityData | null> => {
    const cleanQuery = query.trim()
    if (!cleanQuery) return null
    return findGooglePlaceIdentityInBrowser(cleanQuery, referenceCoordinates)
  }, [findGooglePlaceIdentityInBrowser])

  const resolveGooglePlaceDetailsForCustomPlace = useCallback((place: CustomPlannerPlace) => {
    if (!shouldResolveCustomPlaceGoogleDetails(place)) return
    const googlePlaceId = place.googlePlaceId?.trim() ?? ''
    if (!googlePlaceId) return

    const resolveKey = `${place.id}:${googlePlaceId}`
    if (googlePlaceDetailsResolveRef.current.has(resolveKey)) return
    googlePlaceDetailsResolveRef.current.add(resolveKey)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    const loadDetails = async (locale: GooglePlaceDetailsLocale) => {
      const cached = getCachedGooglePlaceDetails(googlePlaceId, locale)
      if (cached || googlePlaceDetailsCoolingDown(googlePlaceId, locale)) return cached
      const res = await fetch(
        `/api/pass-planner/google-place-details?placeId=${encodeURIComponent(googlePlaceId)}&language=${encodeURIComponent(locale)}&mode=affiliate`,
        {
          cache: 'no-store',
          signal: controller.signal,
        },
      ).catch(() => null)
      const data = res?.ok ? await res.json().catch(() => null) : null
      const details = cleanGooglePlaceDetails(data)
      if (details) rememberGooglePlaceDetails(googlePlaceId, locale, details)
      return details
    }
    const englishCached = getCachedGooglePlaceDetails(googlePlaceId, 'en')
    const chineseCached = getCachedGooglePlaceDetails(googlePlaceId, 'zh-TW')
    const englishCoolingDown = googlePlaceDetailsCoolingDown(googlePlaceId, 'en')
    const chineseCoolingDown = googlePlaceDetailsCoolingDown(googlePlaceId, 'zh-TW')

    Promise.all([loadDetails('en'), loadDetails('zh-TW')])
      .then(async ([englishDetails, chineseDetails]) => {
        let resolvedEnglishDetails = englishDetails
        let resolvedChineseDetails = chineseDetails
        const [englishFallback, chineseFallback] = await Promise.all([
          !resolvedEnglishDetails && !englishCached && !englishCoolingDown
            ? resolveGooglePlaceDetailsInBrowser(googlePlaceId, 'en')
            : Promise.resolve(null),
          !resolvedChineseDetails && !chineseCached && !chineseCoolingDown
            ? resolveGooglePlaceDetailsInBrowser(googlePlaceId, 'zh-TW')
            : Promise.resolve(null),
        ])
        if (!resolvedEnglishDetails && englishFallback) {
          resolvedEnglishDetails = englishFallback
          rememberGooglePlaceDetails(googlePlaceId, 'en', resolvedEnglishDetails)
        } else if (!resolvedEnglishDetails && !englishCached && !englishCoolingDown) {
          rememberGooglePlaceDetailsMiss(googlePlaceId, 'en')
        }
        if (!resolvedChineseDetails && chineseFallback) {
          resolvedChineseDetails = chineseFallback
          rememberGooglePlaceDetails(googlePlaceId, 'zh-TW', resolvedChineseDetails)
        } else if (!resolvedChineseDetails && !chineseCached && !chineseCoolingDown) {
          rememberGooglePlaceDetailsMiss(googlePlaceId, 'zh-TW')
        }

        const detailsToApply = resolvedEnglishDetails ?? resolvedChineseDetails
        if (!detailsToApply) return
        if (resolvedEnglishDetails) {
          setCustomPlaceGoogleDetails(place.id, googlePlaceId, resolvedEnglishDetails, { persist: !readOnlyPlan })
          return
        }
        const { name: _localizedName, ...metadata } = detailsToApply
        setCustomPlaceGoogleDetails(place.id, googlePlaceId, metadata, { persist: !readOnlyPlan })
      })
      .catch(() => {
        if (!englishCached && !englishCoolingDown) rememberGooglePlaceDetailsMiss(googlePlaceId, 'en')
        if (!chineseCached && !chineseCoolingDown) rememberGooglePlaceDetailsMiss(googlePlaceId, 'zh-TW')
      })
      .finally(() => {
        window.clearTimeout(timeout)
        googlePlaceDetailsResolveRef.current.delete(resolveKey)
        setGooglePlaceDetailsRevision((revision) => revision + 1)
      })
  }, [readOnlyPlan, resolveGooglePlaceDetailsInBrowser, setCustomPlaceGoogleDetails])

  const resolveGooglePlaceTypesForCustomPlace = useCallback((place: CustomPlannerPlace) => {
    if (!shouldResolveCustomPlaceGoogleTypes(place)) return
    const googlePlaceId = place.googlePlaceId?.trim() ?? ''
    if (!googlePlaceId) return

    const cached = getCachedGooglePlaceTypes(googlePlaceId)
    if (cached) {
      setCustomPlaceGoogleTypes(place.id, googlePlaceId, cached.types, cached.resolved)
      return
    }

    if (!window.google?.maps?.Geocoder) return
    const resolveKey = `${place.id}:${googlePlaceId}`
    if (googlePlaceTypeResolveRef.current.has(resolveKey)) return
    googlePlaceTypeResolveRef.current.add(resolveKey)

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ placeId: googlePlaceId }, (results, status) => {
      if (status !== 'OK' && status !== 'ZERO_RESULTS') return
      const types = status === 'OK' ? cleanGooglePlaceTypes(results?.[0]?.types) : []
      rememberGooglePlaceTypes(googlePlaceId, types, true)
      setCustomPlaceGoogleTypes(place.id, googlePlaceId, types, true)
    })
  }, [setCustomPlaceGoogleTypes])

  const resolveCustomPlaceGoogleIdentityForAffiliate = useCallback((place: CustomPlannerPlace, links: CustomPlannerLink[]) => {
    if (!shouldResolveCustomPlaceGoogleIdentityForAffiliate(place, links)) return
    const url = place.googleUrl?.trim() ?? ''
    if (!url) return

    const resolveKey = `${place.id}:${url}:${place.lat.toFixed(5)}:${place.lng.toFixed(5)}`
    if (customPlaceGoogleIdentityResolveRef.current.has(resolveKey)) return
    customPlaceGoogleIdentityResolveRef.current.add(resolveKey)

    const applyIdentity = (identity: {
      resolvedUrl: string
      name?: string
      googlePlaceId?: string
      googlePlaceLat?: number
      googlePlaceLng?: number
      googlePlaceTypes?: string[]
      googlePlaceTypesResolved?: boolean
    }) => {
      setCustomPlaceGoogleIdentity(place.id, identity)
    }

    const cached = getResolvedMapUrlCache(url)
    const cachedCoordinates =
      cached?.lat != null && cached.lng != null ? { lat: cached.lat, lng: cached.lng } : parseGoogleMapsUrl(cached?.url ?? '')
    const cachedPlaceId = trustedProviderPlaceId(
      customPlaceToMapPlace(place),
      cached?.googlePlaceId || googleMapsPlaceIdFromUrl(cached?.url),
      cachedCoordinates?.lat,
      cachedCoordinates?.lng,
      true,
    )
    const directPlaceId = trustedProviderPlaceId(
      customPlaceToMapPlace(place),
      place.googlePlaceId ?? '',
      place.googlePlaceLat,
      place.googlePlaceLng,
      true,
    )
    const knownPlaceIdentity: GooglePlaceIdentityData | null = cachedPlaceId && cachedCoordinates
      ? {
          googlePlaceId: cachedPlaceId,
          lat: cachedCoordinates.lat,
          lng: cachedCoordinates.lng,
          types: cleanGooglePlaceTypes(cached?.googlePlaceTypes),
        }
      : directPlaceId
        ? {
            googlePlaceId: directPlaceId,
            lat: place.googlePlaceLat ?? place.lat,
            lng: place.googlePlaceLng ?? place.lng,
            types: cleanGooglePlaceTypes(place.googlePlaceTypes),
          }
        : null

    const rememberIdentityMiss = (
      resolvedUrl: string,
      query: string,
      name: string,
      referenceCoordinates: { lat: number; lng: number },
      googleMapsDataId = '',
    ) => {
      setResolvedMapUrlCache(url, {
        url: resolvedUrl,
        ...(name ? { name } : {}),
        ...(query ? { query } : {}),
        ...(googleMapsDataId ? { googleMapsDataId } : {}),
        lat: referenceCoordinates.lat,
        lng: referenceCoordinates.lng,
        googlePlaceIdRetryAfter: Date.now() + GOOGLE_PLACE_ID_ERROR_COOLDOWN_MS,
        googlePlaceTypesResolved: false,
      })
    }

    const applyResolvedIdentity = (
      resolvedUrl: string,
      query: string,
      name: string,
      identity: GooglePlaceIdentityData,
      googleMapsDataId = '',
    ) => {
      const googlePlaceTypes = cleanGooglePlaceTypes(identity.types)
      const englishName = identity.name?.trim() ?? ''
      const resolvedName = englishName || name
      // SerpAPI Maps supplies the canonical English Maps name. The title from
      // the shared Maps URL is retained as the independently searched
      // localized name, so neither one needs the unavailable browser Places
      // permission to reach the provider lookup.
      if (englishName) {
        rememberGooglePlaceDetails(identity.googlePlaceId, 'en', {
          name: englishName,
          lat: identity.lat,
          lng: identity.lng,
          types: googlePlaceTypes,
        })
      }
      const mapsLocalizedName = name.trim()
      const hasDistinctLocalizedMapsName =
        Boolean(mapsLocalizedName) &&
        /[^\x00-\x7F]/.test(mapsLocalizedName) &&
        mapsLocalizedName.localeCompare(englishName, undefined, { sensitivity: 'base' }) !== 0
      if (hasDistinctLocalizedMapsName) {
        rememberGooglePlaceDetails(identity.googlePlaceId, 'zh-TW', {
          name: mapsLocalizedName,
          lat: identity.lat,
          lng: identity.lng,
          types: googlePlaceTypes,
        })
      } else {
        // There is no confirmed localized Maps name. Skip the unavailable
        // Places Details round and let the third, user-entered-name fallback
        // run instead of searching the English label twice.
        rememberGooglePlaceDetailsMiss(identity.googlePlaceId, 'zh-TW')
      }
      setResolvedMapUrlCache(url, {
        url: resolvedUrl,
        ...(resolvedName ? { name: resolvedName } : {}),
        ...(query ? { query } : {}),
        ...(googleMapsDataId ? { googleMapsDataId } : {}),
        lat: identity.lat,
        lng: identity.lng,
        googlePlaceId: identity.googlePlaceId,
        ...(googlePlaceTypes.length > 0 ? { googlePlaceTypes } : {}),
        googlePlaceIdResolved: true,
        ...(!englishName ? { googlePlaceIdRetryAfter: Date.now() + GOOGLE_PLACE_ID_ERROR_COOLDOWN_MS } : {}),
        googlePlaceTypesResolved: googlePlaceTypes.length > 0,
      })
      applyIdentity({
        resolvedUrl,
        ...(resolvedName ? { name: resolvedName } : {}),
        googlePlaceId: identity.googlePlaceId,
        googlePlaceLat: identity.lat,
        googlePlaceLng: identity.lng,
        googlePlaceTypes,
        googlePlaceTypesResolved: googlePlaceTypes.length > 0,
      })
    }

    const geocodeResolvedIdentity = (
      resolvedUrl: string,
      query: string,
      name: string,
      referenceCoordinates: { lat: number; lng: number },
      googleMapsDataId = '',
    ) => new Promise<void>((resolve) => {
      if (!window.google?.maps?.Geocoder || !query) {
        rememberIdentityMiss(resolvedUrl, query, name, referenceCoordinates, googleMapsDataId)
        resolve()
        return
      }

      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: query, location: referenceCoordinates }, (results, status) => {
        const result = status === 'OK' ? results?.[0] : null
        const location = result?.geometry?.location ?? null
        const geocodedCoordinates = location ? { lat: location.lat(), lng: location.lng() } : null
        const trustedGoogleResult =
          Boolean(geocodedCoordinates) &&
          distanceMeters(referenceCoordinates, geocodedCoordinates as { lat: number; lng: number }) <= TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS
        const googlePlaceId = trustedGoogleResult ? result?.place_id?.trim() ?? '' : ''
        const googlePlaceTypes = trustedGoogleResult ? cleanGooglePlaceTypes(result?.types) : []

        if (!googlePlaceId || !geocodedCoordinates) {
          rememberIdentityMiss(resolvedUrl, query, name, referenceCoordinates, googleMapsDataId)
          resolve()
          return
        }
        applyResolvedIdentity(resolvedUrl, query, name, {
          googlePlaceId,
          lat: geocodedCoordinates.lat,
          lng: geocodedCoordinates.lng,
          types: googlePlaceTypes,
        }, googleMapsDataId)
        resolve()
      })
    })

    const resolveIdentityFromQuery = async (
      resolvedUrl: string,
      query: string,
      name: string,
      referenceCoordinates: { lat: number; lng: number },
      fallbackIdentity: GooglePlaceIdentityData | null,
      googleMapsDataId = '',
    ) => {
      if (!query && !googleMapsDataId) {
        if (fallbackIdentity) applyResolvedIdentity(resolvedUrl, query, name, fallbackIdentity, googleMapsDataId)
        else rememberIdentityMiss(resolvedUrl, query, name, referenceCoordinates, googleMapsDataId)
        return
      }

      const placeIdentity = await findGooglePlaceIdentityFromQuery(query, referenceCoordinates, googleMapsDataId).catch(() => null)
      if (placeIdentity) {
        applyResolvedIdentity(resolvedUrl, query, name, placeIdentity, googleMapsDataId)
        return
      }

      if (fallbackIdentity) {
        applyResolvedIdentity(resolvedUrl, query, name, fallbackIdentity, googleMapsDataId)
        return
      }

      if (query) await geocodeResolvedIdentity(resolvedUrl, query, name, referenceCoordinates, googleMapsDataId)
      else rememberIdentityMiss(resolvedUrl, query, name, referenceCoordinates, googleMapsDataId)
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    fetch(`/api/pass-planner/resolve-map-url?url=${encodeURIComponent(url)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(async (data: {
        url?: unknown
        title?: unknown
        query?: unknown
        lat?: unknown
        lng?: unknown
        googlePlaceId?: unknown
        googleMapsDataId?: unknown
      } | null) => {
        if (typeof data?.url !== 'string') return

        const resolvedUrl = data.url
        const resolvedTitle = typeof data.title === 'string' ? cleanGoogleMapsQueryPlaceName(data.title) : ''
        const resolvedQuery =
          typeof data.query === 'string' && data.query.trim() ? data.query.trim() : parseGoogleMapsQuery(resolvedUrl)
        const resolvedCoordinates =
          typeof data.lat === 'number' && Number.isFinite(data.lat) && typeof data.lng === 'number' && Number.isFinite(data.lng)
            ? { lat: data.lat, lng: data.lng }
            : parseGoogleMapsUrl(resolvedUrl) ?? { lat: place.lat, lng: place.lng }
        const resolvedName = resolvedTitle || parseGoogleMapsPlaceName(resolvedUrl) || place.name
        const directPlaceId =
          (typeof data.googlePlaceId === 'string' && data.googlePlaceId.trim()) ||
          googleMapsPlaceIdFromUrl(resolvedUrl)
        const trustedPlaceId = trustedProviderPlaceId(
          customPlaceToMapPlace(place),
          directPlaceId,
          resolvedCoordinates.lat,
          resolvedCoordinates.lng,
          true,
        )

        const identityQuery = resolvedQuery || resolvedName
        const googleMapsDataId =
          (typeof data.googleMapsDataId === 'string' && data.googleMapsDataId.trim()) ||
          googleMapsDataIdFromUrl(resolvedUrl) ||
          cached?.googleMapsDataId ||
          googleMapsDataIdFromUrl(cached?.url)
        const fallbackIdentity = trustedPlaceId
          ? {
              googlePlaceId: trustedPlaceId,
              lat: resolvedCoordinates.lat,
              lng: resolvedCoordinates.lng,
              types: [],
            }
          : knownPlaceIdentity
        await resolveIdentityFromQuery(
          resolvedUrl,
          identityQuery,
          resolvedName,
          resolvedCoordinates,
          fallbackIdentity,
          googleMapsDataId,
        )
      })
      .catch(() => {
        // Existing custom places should remain usable even if background enrichment fails.
      })
      .finally(() => {
        window.clearTimeout(timeout)
        customPlaceGoogleIdentityResolveRef.current.delete(resolveKey)
      })
  }, [findGooglePlaceIdentityFromQuery, setCustomPlaceGoogleIdentity])

  const resolveAgodaAffiliateLinkForCustomPlace = useCallback((
    place: CustomPlannerPlace,
    options: { forceRefresh?: boolean; replaceExisting?: boolean } = {},
  ) => {
    const provider = 'Agoda' as const
    const requestKey = `${provider}:${place.id}`
    const eligibility = customPlaceHotelAffiliateEligibility(place)
    const lookupInput = eligibility === 'eligible'
      ? customPlaceHotelAffiliateLookupInput(provider, place, config)
      : null
    const activeRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)

    if (!lookupInput) {
      if (activeRequest) {
        activeRequest.controller.abort()
        hotelAffiliateLookupRequestRef.current.delete(requestKey)
      }
      if (!readOnlyPlan && eligibility === 'skipped') {
        setAgodaAffiliateStatus((status) => (status[place.id] === 'skipped' ? status : { ...status, [place.id]: 'skipped' }))
      } else if (eligibility === 'eligible') {
        setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'none' }))
      }
      return
    }

    const {
      cacheKey,
      hotelName,
      googlePlaceName,
      googlePlaceNameZhTw,
      userName,
      latitude,
      longitude,
      googlePlaceTypes,
      lodgingHint,
      city,
      cityId,
      countryCode,
    } = lookupInput
    if (activeRequest?.cacheKey === cacheKey) return
    if (activeRequest) activeRequest.controller.abort()
    hotelAffiliateLookupRequestRef.current.delete(requestKey)

    const cachedBookingUrl = options.forceRefresh ? null : readHotelAffiliateLookupHit(cacheKey, provider)
    if (cachedBookingUrl) {
      appendHotelAffiliateLink(place.id, provider, cachedBookingUrl, {
        persist: !readOnlyPlan,
        replaceProvider: options.replaceExisting === true,
      })
      setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'matched' }))
      return
    }
    const cooldownStatus = options.forceRefresh ? null : hotelAffiliateLookupCoolingDown(cacheKey)
    if (cooldownStatus) {
      setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: cooldownStatus }))
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12000)
    hotelAffiliateLookupRequestRef.current.set(requestKey, { cacheKey, controller })
    const isCurrentRequest = () => {
      const currentRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)
      if (currentRequest?.controller !== controller || currentRequest.cacheKey !== cacheKey) return false
      const currentPlace = customPlacesRef.current[place.id]
      if (!currentPlace || customPlaceHotelAffiliateEligibility(currentPlace) !== 'eligible') return false
      return customPlaceHotelAffiliateLookupInput(provider, currentPlace, config)?.cacheKey === cacheKey
    }

    setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'searching' }))
    fetch('/api/pass-planner/hotel-affiliate/agoda', {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        hotelName,
        googlePlaceName,
        googlePlaceNameZhTw,
        name: userName,
        googlePlaceId: place.googlePlaceId,
        city,
        cityId,
        countryCode,
        lat: latitude,
        lng: longitude,
        lodgingHint,
        googlePlaceTypes,
        language: 'zh-tw',
        forceRefresh: options.forceRefresh === true,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as HotelAffiliatePlannerResponse | null
        if (!data) throw new Error('agoda_affiliate_invalid_response')
        if (data.matchStatus === 'api_error') throw new Error('agoda_affiliate_api_error')
        if (!res.ok && data.matchStatus !== 'not_configured' && data.matchStatus !== 'needs_city_id') {
          throw new Error('agoda_affiliate_http_error')
        }
        return data
      })
      .then((data) => {
        if (!isCurrentRequest()) return
        if (data.matchStatus === 'not_configured') {
          rememberHotelAffiliateLookupMiss(cacheKey, HOTEL_AFFILIATE_NOT_CONFIGURED_COOLDOWN_MS, 'not_configured')
          setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'not_configured' }))
          return
        }
        if (data.matchStatus === 'needs_city_id') {
          rememberHotelAffiliateLookupMiss(cacheKey, AGODA_AFFILIATE_NO_MATCH_COOLDOWN_MS, 'needs_city_id')
          setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'needs_city_id' }))
          return
        }
        if (data.matchStatus === 'needs_review' || data.matchStatus === 'no_match') {
          rememberHotelAffiliateLookupMiss(
            cacheKey,
            data.matchStatus === 'needs_review'
              ? AGODA_AFFILIATE_REVIEW_COOLDOWN_MS
              : AGODA_AFFILIATE_NO_MATCH_COOLDOWN_MS,
          )
          setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'none' }))
          return
        }
        if (data.matchStatus !== 'matched') throw new Error('agoda_affiliate_unknown_status')

        const bookingUrl = cleanHotelAffiliateBookingUrl(data.bestMatch?.bookingUrl, provider)
        if (!bookingUrl) throw new Error('agoda_affiliate_invalid_booking_url')
        rememberHotelAffiliateLookupHit(cacheKey, bookingUrl, HOTEL_AFFILIATE_HIT_CACHE_TTL_MS)
        appendHotelAffiliateLink(place.id, provider, bookingUrl, {
          persist: !readOnlyPlan,
          replaceProvider: options.replaceExisting === true,
        })
        setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'matched' }))
      })
      .catch(() => {
        if (!isCurrentRequest()) return
        rememberHotelAffiliateLookupMiss(cacheKey, HOTEL_AFFILIATE_TRANSIENT_ERROR_COOLDOWN_MS, 'error')
        setAgodaAffiliateStatus((status) => ({ ...status, [place.id]: 'error' }))
        // Auto affiliate lookup is helpful but should never block saving the custom place.
      })
      .finally(() => {
        window.clearTimeout(timeout)
        const currentRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)
        if (currentRequest?.controller === controller) hotelAffiliateLookupRequestRef.current.delete(requestKey)
      })
  }, [appendHotelAffiliateLink, config, readOnlyPlan])

  const resolveTripAffiliateLinkForCustomPlace = useCallback((
    place: CustomPlannerPlace,
    options: { forceRefresh?: boolean; replaceExisting?: boolean } = {},
  ) => {
    const provider = 'Trip' as const
    const requestKey = `${provider}:${place.id}`
    const eligibility = customPlaceHotelAffiliateEligibility(place)
    const lookupInput = eligibility === 'eligible'
      ? customPlaceHotelAffiliateLookupInput(provider, place, config)
      : null
    const activeRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)

    if (!lookupInput) {
      if (activeRequest) {
        activeRequest.controller.abort()
        hotelAffiliateLookupRequestRef.current.delete(requestKey)
      }
      if (!readOnlyPlan && eligibility === 'skipped') {
        setTripAffiliateStatus((status) => (status[place.id] === 'skipped' ? status : { ...status, [place.id]: 'skipped' }))
      } else if (eligibility === 'eligible') {
        setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'none' }))
      }
      return
    }

    const {
      cacheKey,
      hotelName,
      googlePlaceName,
      googlePlaceNameZhTw,
      userName,
      latitude,
      longitude,
      googlePlaceTypes,
      lodgingHint,
      city,
      cityId,
      countryCode,
    } = lookupInput
    if (activeRequest?.cacheKey === cacheKey) return
    if (activeRequest) activeRequest.controller.abort()
    hotelAffiliateLookupRequestRef.current.delete(requestKey)

    const cachedBookingUrl = options.forceRefresh ? null : readHotelAffiliateLookupHit(cacheKey, provider)
    if (cachedBookingUrl) {
      appendHotelAffiliateLink(place.id, provider, cachedBookingUrl, {
        persist: !readOnlyPlan,
        replaceProvider: options.replaceExisting === true,
      })
      setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'matched' }))
      return
    }
    const cooldownStatus = options.forceRefresh ? null : hotelAffiliateLookupCoolingDown(cacheKey)
    if (cooldownStatus) {
      setTripAffiliateStatus((status) => ({ ...status, [place.id]: cooldownStatus }))
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 30000)
    hotelAffiliateLookupRequestRef.current.set(requestKey, { cacheKey, controller })
    const isCurrentRequest = () => {
      const currentRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)
      if (currentRequest?.controller !== controller || currentRequest.cacheKey !== cacheKey) return false
      const currentPlace = customPlacesRef.current[place.id]
      if (!currentPlace || customPlaceHotelAffiliateEligibility(currentPlace) !== 'eligible') return false
      return customPlaceHotelAffiliateLookupInput(provider, currentPlace, config)?.cacheKey === cacheKey
    }

    setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'searching' }))
    fetch('/api/pass-planner/hotel-affiliate/trip', {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        hotelName,
        googlePlaceName,
        googlePlaceNameZhTw,
        name: userName,
        googlePlaceId: place.googlePlaceId,
        city,
        cityId,
        countryCode,
        lat: latitude,
        lng: longitude,
        lodgingHint,
        googlePlaceTypes,
        forceRefresh: options.forceRefresh === true,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as HotelAffiliatePlannerResponse | null
        if (!data) throw new Error('trip_affiliate_invalid_response')
        if (data.matchStatus === 'search_error') throw new Error('trip_affiliate_search_error')
        if (!res.ok && data.matchStatus !== 'not_configured') throw new Error('trip_affiliate_http_error')
        return data
      })
      .then((data) => {
        if (!isCurrentRequest()) return
        if (data.matchStatus === 'not_configured') {
          rememberHotelAffiliateLookupMiss(cacheKey, HOTEL_AFFILIATE_NOT_CONFIGURED_COOLDOWN_MS, 'not_configured')
          setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'not_configured' }))
          return
        }
        if (data.matchStatus === 'needs_review' || data.matchStatus === 'no_match') {
          rememberHotelAffiliateLookupMiss(
            cacheKey,
            data.matchStatus === 'needs_review'
              ? TRIP_AFFILIATE_REVIEW_COOLDOWN_MS
              : TRIP_AFFILIATE_NO_MATCH_COOLDOWN_MS,
          )
          setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'none' }))
          return
        }
        if (data.matchStatus !== 'matched') throw new Error('trip_affiliate_unknown_status')

        const bookingUrl = cleanHotelAffiliateBookingUrl(data.bestMatch?.bookingUrl, provider)
        if (!bookingUrl) throw new Error('trip_affiliate_invalid_booking_url')
        rememberHotelAffiliateLookupHit(cacheKey, bookingUrl, HOTEL_AFFILIATE_HIT_CACHE_TTL_MS)
        appendHotelAffiliateLink(place.id, provider, bookingUrl, {
          persist: !readOnlyPlan,
          replaceProvider: options.replaceExisting === true,
        })
        setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'matched' }))
      })
      .catch(() => {
        if (!isCurrentRequest()) return
        rememberHotelAffiliateLookupMiss(cacheKey, HOTEL_AFFILIATE_TRANSIENT_ERROR_COOLDOWN_MS, 'error')
        setTripAffiliateStatus((status) => ({ ...status, [place.id]: 'error' }))
      })
      .finally(() => {
        window.clearTimeout(timeout)
        const currentRequest = hotelAffiliateLookupRequestRef.current.get(requestKey)
        if (currentRequest?.controller === controller) hotelAffiliateLookupRequestRef.current.delete(requestKey)
      })
  }, [appendHotelAffiliateLink, config, readOnlyPlan])

  const forceHotelAffiliateLookupForCustomPlace = useCallback(
    (placeId: string) => {
      const place = customPlaces[placeId]
      if (!place || readOnlyPlan) return
      const manualPlace: CustomPlannerPlace = { ...place, hotelAffiliateManual: true }
      hotelAffiliateForceRefreshRef.current.add(placeId)
      setCustomPlaces((current) => ({ ...current, [placeId]: manualPlace }))
      cancelHotelAffiliateLookupForCustomPlace(placeId, 'Agoda')
      cancelHotelAffiliateLookupForCustomPlace(placeId, 'Trip')
      if (shouldResolveCustomPlaceGoogleDetails(manualPlace)) {
        resolveGooglePlaceDetailsForCustomPlace(manualPlace)
      }
    },
    [
      cancelHotelAffiliateLookupForCustomPlace,
      customPlaces,
      readOnlyPlan,
      resolveGooglePlaceDetailsForCustomPlace,
    ],
  )

  useEffect(() => {
    // Resolve the Maps identity first; the provider effect below starts each
    // lookup exactly once after the required name and coordinate data is ready.
    if (!storageReady || readOnlyPlan) return
    Object.values(customPlaces).forEach((place) => {
      const links = [...(place.links ?? []), ...(placeUserLinks[place.id] ?? [])]
      if (shouldResolveCustomPlaceGoogleIdentityForAffiliate(place, links)) {
        resolveCustomPlaceGoogleIdentityForAffiliate(place, links)
        return
      }
      if (shouldResolveCustomPlaceGoogleDetails(place)) resolveGooglePlaceDetailsForCustomPlace(place)
      else resolveGooglePlaceTypesForCustomPlace(place)
    })
  }, [
    customPlaces,
    googlePlaceDetailsRevision,
    placeUserLinks,
    readOnlyPlan,
    resolveCustomPlaceGoogleIdentityForAffiliate,
    resolveGooglePlaceDetailsForCustomPlace,
    resolveGooglePlaceTypesForCustomPlace,
    storageReady,
  ])

  useEffect(() => {
    if (!storageReady) return
    const currentPlaceIds = new Set(Object.keys(customPlaces))
    hotelAffiliateLookupRequestRef.current.forEach((request, requestKey) => {
      const placeId = requestKey.slice(requestKey.indexOf(':') + 1)
      if (currentPlaceIds.has(placeId)) return
      request.controller.abort()
      hotelAffiliateLookupRequestRef.current.delete(requestKey)
    })

    Object.values(customPlaces).forEach((place) => {
      const eligibility = customPlaceHotelAffiliateEligibility(place)
      if (eligibility !== 'eligible') {
        cancelHotelAffiliateLookupForCustomPlace(place.id)
        if (eligibility === 'skipped') {
          setAgodaAffiliateStatus((status) => (status[place.id] === 'skipped' ? status : { ...status, [place.id]: 'skipped' }))
          setTripAffiliateStatus((status) => (status[place.id] === 'skipped' ? status : { ...status, [place.id]: 'skipped' }))
        }
        return
      }
      const links = [...(place.links ?? []), ...(placeUserLinks[place.id] ?? [])]
      if (shouldResolveCustomPlaceGoogleIdentityForAffiliate(place, links)) {
        cancelHotelAffiliateLookupForCustomPlace(place.id)
        return
      }
      // Wait for Google's English and zh-TW Place Details names before
      // querying providers. A locale that has already failed its request is
      // skipped after its short cooldown, so a failure never blocks the
      // user-name fallback forever.
      const isWaitingForGooglePlaceDetails = shouldWaitForGooglePlaceAffiliateDetails(place)
      if (isWaitingForGooglePlaceDetails) {
        cancelHotelAffiliateLookupForCustomPlace(place.id)
        return
      }
      if (customPlaceHotelAffiliateSearchNames(place).length === 0) {
        cancelHotelAffiliateLookupForCustomPlace(place.id)
        return
      }

      const forceRefresh = hotelAffiliateForceRefreshRef.current.delete(place.id)
      if (forceRefresh || !hasHotelAffiliateProviderLink(links, 'Agoda')) {
        resolveAgodaAffiliateLinkForCustomPlace(place, {
          forceRefresh,
          replaceExisting: forceRefresh,
        })
      } else cancelHotelAffiliateLookupForCustomPlace(place.id, 'Agoda')

      if (forceRefresh || !hasHotelAffiliateProviderLink(links, 'Trip')) {
        resolveTripAffiliateLinkForCustomPlace(place, {
          forceRefresh,
          replaceExisting: forceRefresh,
        })
      } else cancelHotelAffiliateLookupForCustomPlace(place.id, 'Trip')
    })
  }, [
    cancelHotelAffiliateLookupForCustomPlace,
    customPlaces,
    googlePlaceDetailsRevision,
    placeUserLinks,
    readOnlyPlan,
    resolveAgodaAffiliateLinkForCustomPlace,
    resolveTripAffiliateLinkForCustomPlace,
    storageReady,
  ])

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
    setMobilePanelState('full')
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
      googlePlaceId: place.googlePlaceId ?? '',
      googlePlaceName: place.googlePlaceName ?? '',
      googlePlaceLat: place.googlePlaceLat ?? null,
      googlePlaceLng: place.googlePlaceLng ?? null,
      googlePlaceTypes: cleanGooglePlaceTypes(place.googlePlaceTypes),
      googlePlaceTypesResolved: place.googlePlaceTypesResolved === true,
      naverUrl: place.naverUrl ?? '',
      naverPlaceId: place.naverPlaceId ?? '',
      naverPlaceName: place.naverPlaceName ?? '',
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

  const focusCustomMapPosition = useCallback((position: { lat: number; lng: number }) => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return
    exitLocationFollowMode()
    google.maps.event.trigger(map, 'resize')
    focusMapOnPosition(map, position, 0.25)
  }, [exitLocationFollowMode])

  const refocusPendingCustomMapPosition = useCallback(() => {
    const position = pendingCustomMapFocusRef.current
    if (!position) return
    window.setTimeout(() => focusCustomMapPosition(position), 260)
  }, [focusCustomMapPosition])

  const scheduleCustomMapFocus = useCallback((position: { lat: number; lng: number }) => {
    pendingCustomMapFocusRef.current = position
    customMapFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    customMapFocusTimersRef.current = [260].map((delay) =>
      window.setTimeout(() => {
        focusCustomMapPosition(position)
      }, delay),
    )
  }, [focusCustomMapPosition])

  const revealResolvedCustomPlace = useCallback((position: { lat: number; lng: number } | null) => {
    if (!isMobilePlannerViewport()) return
    setMode('add')
    setMobilePanelState('half')

    window.setTimeout(() => {
      customConfirmRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }, 180)

    if (!position) return
    scheduleCustomMapFocus(position)
  }, [scheduleCustomMapFocus])

  const continueCustomPlaceManually = useCallback((fallbackName = '') => {
    setCustomDraft((draft) => ({
      ...draft,
      name: draft.name.trim() || fallbackName.trim() || '自填名稱',
      picking: true,
      nameConfirmed: true,
    }))
    revealResolvedCustomPlace(null)
    window.setTimeout(() => {
      const map = mapRef.current
      if (!map || !window.google?.maps) return
      exitLocationFollowMode()
      google.maps.event.trigger(map, 'resize')
      map.setCenter(mapCenter)
      map.setZoom(config.mapZoom)
    }, 220)
  }, [config.mapZoom, exitLocationFollowMode, mapCenter, revealResolvedCustomPlace])

  const geocodeResolvedMapQuery = (
    query: string,
    resolvedUrl: string,
    resolvedName: string,
    cacheKey: string,
    nextSeq: number,
    options: { referenceCoordinates?: { lat: number; lng: number } } = {},
  ) => {
    if (!query) return false
    setCustomUrlResolving(true)

    const finishWithIdentity = (
      finalCoordinates: { lat: number; lng: number },
      identity: GooglePlaceIdentityData | null,
    ) => {
      if (customUrlResolveSeqRef.current !== nextSeq) return
      const name = identity?.name?.trim() || resolvedName || cleanGoogleMapsQueryPlaceName(query)
      const googlePlaceId = identity?.googlePlaceId ?? ''
      const googlePlaceTypes = cleanGooglePlaceTypes(identity?.types)
      setResolvedMapUrlCache(cacheKey, {
        url: resolvedUrl,
        ...(name ? { name } : {}),
        query,
        lat: finalCoordinates.lat,
        lng: finalCoordinates.lng,
        ...(googlePlaceId ? { googlePlaceId } : {}),
        ...(googlePlaceTypes.length > 0 ? { googlePlaceTypes } : {}),
        ...(googlePlaceId
          ? { googlePlaceIdResolved: true }
          : { googlePlaceIdRetryAfter: Date.now() + GOOGLE_PLACE_ID_ERROR_COOLDOWN_MS }),
        googlePlaceTypesResolved: googlePlaceTypes.length > 0,
      })
      setCustomDraft((draft) => ({
        ...draft,
        googleUrl: resolvedUrl,
        ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && name ? { name } : {}),
        lat: finalCoordinates.lat,
        lng: finalCoordinates.lng,
        ...(googlePlaceId
            ? {
                googlePlaceId,
                googlePlaceName: name,
                googlePlaceLat: identity?.lat ?? finalCoordinates.lat,
                googlePlaceLng: identity?.lng ?? finalCoordinates.lng,
              }
            : {}),
        googlePlaceTypes,
        googlePlaceTypesResolved: googlePlaceTypes.length > 0,
        picking: true,
      }))
      revealResolvedCustomPlace(finalCoordinates)
      setCustomUrlResolving(false)
    }

    const failWithoutCoordinates = () => {
      if (customUrlResolveSeqRef.current !== nextSeq) return
      continueCustomPlaceManually(resolvedName || cleanGoogleMapsQueryPlaceName(query))
      setCustomUrlResolving(false)
    }

    const geocodeFallback = () => {
      const referenceCoordinates = options.referenceCoordinates
      if (!window.google?.maps?.Geocoder) {
        if (referenceCoordinates) finishWithIdentity(referenceCoordinates, null)
        else failWithoutCoordinates()
        return
      }

      const geocoder = new window.google.maps.Geocoder()
      const request: google.maps.GeocoderRequest = { address: query }
      if (referenceCoordinates) request.location = referenceCoordinates
      geocoder.geocode(request, (results, status) => {
        if (customUrlResolveSeqRef.current !== nextSeq) return
        const result = status === 'OK' ? results?.[0] : null
        const location = result?.geometry?.location ?? null
        const geocodedCoordinates = location ? { lat: location.lat(), lng: location.lng() } : null
        const finalCoordinates = referenceCoordinates ?? geocodedCoordinates
        if (!finalCoordinates) {
          failWithoutCoordinates()
          return
        }
        const trustedGoogleResult =
          Boolean(geocodedCoordinates) &&
          (!referenceCoordinates || distanceMeters(referenceCoordinates, geocodedCoordinates as { lat: number; lng: number }) <= TRUSTED_PROVIDER_PLACE_MAX_DISTANCE_METERS)
        const googlePlaceId = trustedGoogleResult ? result?.place_id?.trim() ?? '' : ''
        finishWithIdentity(
          finalCoordinates,
          googlePlaceId && geocodedCoordinates
            ? {
                googlePlaceId,
                lat: geocodedCoordinates.lat,
                lng: geocodedCoordinates.lng,
                types: trustedGoogleResult ? cleanGooglePlaceTypes(result?.types) : [],
              }
            : null,
        )
      })
    }

    const referenceCoordinates = options.referenceCoordinates
    if (!referenceCoordinates) {
      geocodeFallback()
      return true
    }

    findGooglePlaceIdentityFromQuery(query, referenceCoordinates, googleMapsDataIdFromUrl(resolvedUrl))
      .then((identity) => {
        if (customUrlResolveSeqRef.current !== nextSeq) return
        if (identity) {
          finishWithIdentity({ lat: identity.lat, lng: identity.lng }, identity)
          return
        }
        geocodeFallback()
      })
      .catch(() => {
        if (customUrlResolveSeqRef.current !== nextSeq) return
        geocodeFallback()
      })
    return true
  }

  const updateCustomGoogleUrl = (googleUrl: string) => {
    const extractedGoogleUrl = extractGoogleMapsUrlFromText(googleUrl)
    const trimmedGoogleUrl = extractedGoogleUrl.trim()
    const isGoogleMapsInput = Boolean(trimmedGoogleUrl && shouldResolveGoogleMapsUrl(trimmedGoogleUrl))
    const nextSeq = customUrlResolveSeqRef.current + 1
    customUrlResolveSeqRef.current = nextSeq
    setCustomUrlResolving(false)
    if (googleUrl.trim() && !isGoogleMapsInput) {
      setCustomDraft((draft) => ({
        ...draft,
        googleUrl,
        googlePlaceId: '',
        googlePlaceName: '',
        googlePlaceLat: null,
        googlePlaceLng: null,
        googlePlaceTypes: [],
        googlePlaceTypesResolved: false,
      }))
      return
    }

    const coordinates = isGoogleMapsInput ? parseGoogleMapsUrl(trimmedGoogleUrl) : null
    const directGooglePlaceId = isGoogleMapsInput ? googleMapsPlaceIdFromUrl(trimmedGoogleUrl) : ''
    const parsedName = isGoogleMapsInput
      ? parseGoogleMapsSharedTextName(googleUrl, trimmedGoogleUrl) || parseGoogleMapsPlaceName(trimmedGoogleUrl)
      : ''
    setCustomDraft((draft) => ({
      ...draft,
      googleUrl: googleUrl.trim() ? trimmedGoogleUrl || googleUrl : '',
      googlePlaceId: directGooglePlaceId,
      googlePlaceName: directGooglePlaceId ? parsedName : '',
      googlePlaceLat: directGooglePlaceId && coordinates ? coordinates.lat : null,
      googlePlaceLng: directGooglePlaceId && coordinates ? coordinates.lng : null,
      googlePlaceTypes: [],
      googlePlaceTypesResolved: false,
      ...(!draft.name.trim() && parsedName ? { name: parsedName } : {}),
      ...(coordinates ? { lat: coordinates.lat, lng: coordinates.lng, picking: true } : {}),
    }))
    if (coordinates) revealResolvedCustomPlace(coordinates)
    const shouldResolveUrl =
      isGoogleMapsInput && (isShortGoogleMapsUrl(trimmedGoogleUrl) || !coordinates || !parsedName)
    if (!shouldResolveUrl) return

    const cachedResolved = getResolvedMapUrlCache(trimmedGoogleUrl)
    if (cachedResolved) {
      const resolvedCoordinates =
        typeof cachedResolved.lat === 'number' && typeof cachedResolved.lng === 'number'
          ? { lat: cachedResolved.lat, lng: cachedResolved.lng }
          : parseGoogleMapsUrl(cachedResolved.url)
      const resolvedName =
        cleanGoogleMapsQueryPlaceName(cachedResolved.name || '') || parseGoogleMapsPlaceName(cachedResolved.url)
      const cachedGooglePlaceId = cachedResolved.googlePlaceId || googleMapsPlaceIdFromUrl(cachedResolved.url)
      const cachedGooglePlaceTypes = cleanGooglePlaceTypes(cachedResolved.googlePlaceTypes)
      if (!resolvedCoordinates && cachedResolved.query) {
        if (geocodeResolvedMapQuery(cachedResolved.query, cachedResolved.url, resolvedName, trimmedGoogleUrl, nextSeq)) return
        continueCustomPlaceManually(resolvedName)
        return
      }
      if (resolvedCoordinates) {
        if (!cachedGooglePlaceId && cachedResolved.query && !googlePlaceIdResolutionCoolingDown(cachedResolved)) {
          if (
            geocodeResolvedMapQuery(
              cachedResolved.query,
              cachedResolved.url,
              resolvedName,
              trimmedGoogleUrl,
              nextSeq,
              { referenceCoordinates: resolvedCoordinates },
            )
          ) {
            return
          }
        }
        setCustomDraft((draft) => ({
          ...draft,
          googleUrl: cachedResolved.url,
          ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && resolvedName
            ? { name: resolvedName }
            : {}),
          lat: resolvedCoordinates.lat,
          lng: resolvedCoordinates.lng,
          ...(cachedGooglePlaceId
            ? {
                googlePlaceId: cachedGooglePlaceId,
                googlePlaceName: resolvedName,
                googlePlaceLat: resolvedCoordinates.lat,
                googlePlaceLng: resolvedCoordinates.lng,
              }
            : {}),
          googlePlaceTypes: cachedGooglePlaceTypes,
          googlePlaceTypesResolved: cachedResolved.googlePlaceTypesResolved === true || cachedGooglePlaceTypes.length > 0,
          picking: true,
        }))
        revealResolvedCustomPlace(resolvedCoordinates)
        return
      }
    }

    setCustomUrlResolving(true)
    const resolveController = new AbortController()
    const resolveTimeout = window.setTimeout(() => resolveController.abort(), CUSTOM_MAP_URL_RESOLVE_TIMEOUT_MS)
    fetch(`/api/pass-planner/resolve-map-url?url=${encodeURIComponent(trimmedGoogleUrl)}`, {
      cache: 'no-store',
      signal: resolveController.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { url?: unknown; title?: unknown; query?: unknown; lat?: unknown; lng?: unknown; googlePlaceId?: unknown } | null) => {
        if (customUrlResolveSeqRef.current !== nextSeq) return
        if (typeof data?.url !== 'string') {
          continueCustomPlaceManually(parsedName)
          return
        }
        const resolvedUrl = data.url
        const resolvedTitle = typeof data.title === 'string' ? cleanGoogleMapsQueryPlaceName(data.title) : ''
        const resolvedQuery =
          typeof data.query === 'string' && data.query.trim() ? data.query.trim() : parseGoogleMapsQuery(resolvedUrl)
        const resolvedLat = typeof data.lat === 'number' && Number.isFinite(data.lat) ? data.lat : null
        const resolvedLng = typeof data.lng === 'number' && Number.isFinite(data.lng) ? data.lng : null
        const resolvedGooglePlaceId = typeof data.googlePlaceId === 'string' && data.googlePlaceId.trim() ? data.googlePlaceId.trim() : ''
        const resolvedCoordinates =
          resolvedLat != null && resolvedLng != null ? { lat: resolvedLat, lng: resolvedLng } : parseGoogleMapsUrl(resolvedUrl)
        const resolvedName = resolvedTitle || parseGoogleMapsPlaceName(resolvedUrl)
        const resolvedIdentityQuery = resolvedQuery || resolvedName
        setResolvedMapUrlCache(trimmedGoogleUrl, {
          url: resolvedUrl,
          ...(resolvedName ? { name: resolvedName } : {}),
          ...(resolvedIdentityQuery ? { query: resolvedIdentityQuery } : {}),
          ...(resolvedLat != null ? { lat: resolvedLat } : {}),
          ...(resolvedLng != null ? { lng: resolvedLng } : {}),
          ...(resolvedGooglePlaceId ? { googlePlaceId: resolvedGooglePlaceId } : {}),
          ...(resolvedGooglePlaceId ? { googlePlaceIdResolved: true } : {}),
          googlePlaceTypesResolved: false,
        })
        if (!resolvedCoordinates && resolvedIdentityQuery) {
          if (geocodeResolvedMapQuery(resolvedIdentityQuery, resolvedUrl, resolvedName, trimmedGoogleUrl, nextSeq)) return
          continueCustomPlaceManually(resolvedName)
          return
        }
        if (resolvedCoordinates && !resolvedGooglePlaceId && resolvedIdentityQuery) {
          if (
            geocodeResolvedMapQuery(
              resolvedIdentityQuery,
              resolvedUrl,
              resolvedName,
              trimmedGoogleUrl,
              nextSeq,
              { referenceCoordinates: resolvedCoordinates },
            )
          ) {
            return
          }
        }
        setCustomDraft((draft) => ({
          ...draft,
          googleUrl: resolvedUrl,
          ...((!draft.name.trim() || isGenericGoogleMapsPlaceName(draft.name)) && resolvedName
            ? { name: resolvedName }
            : {}),
          ...(resolvedCoordinates
            ? {
                lat: resolvedCoordinates.lat,
                lng: resolvedCoordinates.lng,
                ...(resolvedGooglePlaceId
                  ? {
                      googlePlaceId: resolvedGooglePlaceId,
                      googlePlaceName: resolvedName,
                      googlePlaceLat: resolvedCoordinates.lat,
                      googlePlaceLng: resolvedCoordinates.lng,
                    }
                  : {}),
                googlePlaceTypes: [],
                googlePlaceTypesResolved: false,
                picking: true,
              }
            : {}),
        }))
        if (resolvedCoordinates) revealResolvedCustomPlace(resolvedCoordinates)
        else continueCustomPlaceManually(resolvedName)
      })
      .catch(() => {
        if (customUrlResolveSeqRef.current === nextSeq) continueCustomPlaceManually(parsedName)
      })
      .finally(() => {
        window.clearTimeout(resolveTimeout)
        if (customUrlResolveSeqRef.current === nextSeq) setCustomUrlResolving(false)
      })
  }

  const saveCustomPlace = () => {
    const id = customDraft.id ?? `${CUSTOM_PLACE_PREFIX}${Date.now().toString(36)}`
    const name = customDraft.name.trim()
    if (customDraft.googleUrl.trim() && !googleMapsUrlFromInput(customDraft.googleUrl)) {
      setCustomPlaceSaveError('googleUrl')
      return
    }
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
    const cleanGoogleUrl = googleMapsUrlFromInput(customDraft.googleUrl)
    const existingPlace = customPlaces[id]
    const googleUrlChanged =
      Boolean(existingPlace?.googleUrl && cleanGoogleUrl) &&
      normalizePlaceMatchUrl(existingPlace?.googleUrl) !== normalizePlaceMatchUrl(cleanGoogleUrl)
    const sourcePlaceId = directMatchedKnownPlace?.id ?? (googleUrlChanged ? undefined : existingPlace?.sourcePlaceId)
    const baseLinks = placeUserLinks[id] ?? existingPlace?.links ?? []
    const pendingLinks = linkLabel && linkUrl ? [{ label: linkLabel, href: linkUrl }] : []
    const seenCustomLinks = new Set<string>()
    const nextLinks = [...baseLinks, ...pendingLinks]
      .map((link) => ({ label: link.label.trim().slice(0, 40), href: normalizePlannerAffiliateHref(link.href).slice(0, 500) }))
      .filter((link) => {
        if (!link.label || !link.href) return false
        const key = link.label + '::' + link.href
        if (seenCustomLinks.has(key)) return false
        seenCustomLinks.add(key)
        return true
      })
    const customPlace: CustomPlannerPlace = {
      id,
      ...(sourcePlaceId ? { sourcePlaceId } : {}),
      name,
      category: semanticPlannerCategory(cleanCustomPlaceCategory(customDraft.category), customCategoryItems),
      lat: customDraft.lat,
      lng: customDraft.lng,
      ...(cleanGoogleUrl ? { googleUrl: cleanGoogleUrl } : {}),
      ...(customDraft.googlePlaceId.trim() ? { googlePlaceId: customDraft.googlePlaceId.trim() } : {}),
      ...(customDraft.googlePlaceName.trim() ? { googlePlaceName: customDraft.googlePlaceName.trim() } : {}),
      ...(customDraft.googlePlaceId.trim() && customDraft.googlePlaceLat != null && customDraft.googlePlaceLng != null
        ? { googlePlaceLat: customDraft.googlePlaceLat, googlePlaceLng: customDraft.googlePlaceLng }
        : {}),
      ...(customDraft.googlePlaceTypes.length > 0 ? { googlePlaceTypes: cleanGooglePlaceTypes(customDraft.googlePlaceTypes) } : {}),
      ...(customDraft.googlePlaceTypesResolved ? { googlePlaceTypesResolved: true } : {}),
      ...(customDraft.naverUrl.trim() ? { naverUrl: customDraft.naverUrl.trim() } : {}),
      ...(customDraft.naverPlaceId.trim() ? { naverPlaceId: customDraft.naverPlaceId.trim() } : {}),
      ...(customDraft.naverPlaceName.trim() ? { naverPlaceName: customDraft.naverPlaceName.trim() } : {}),
      ...(existingPlace?.hotelAffiliateManual ? { hotelAffiliateManual: true } : {}),
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
      source_place_id: sourcePlaceId ?? '',
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
      const googlePlaceId = results[0].place_id?.trim() ?? ''
      const googlePlaceTypes = cleanGooglePlaceTypes(results[0].types)
      setCustomDraft((draft) => {
        if (!draft.id || !draft.nameConfirmed) return draft
        const lat = location.lat()
        const lng = location.lng()
        return {
          ...draft,
          lat,
          lng,
          ...(googlePlaceId
            ? {
                googlePlaceId,
                googlePlaceName: confirmedName,
                googlePlaceLat: lat,
                googlePlaceLng: lng,
              }
            : {}),
          googlePlaceTypes,
          googlePlaceTypesResolved: googlePlaceTypes.length > 0,
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


  const copyPreDepartureTransferLink = useCallback(async () => {
    if (!plannerBookId) return
    const transferUrl = new URL(window.location.href)
    Object.entries(config.shareSearchParams ?? {}).forEach(([key, value]) => {
      if (value) transferUrl.searchParams.set(key, value)
    })
    transferUrl.searchParams.delete(PLANNER_BOOK_PARAM)
    transferUrl.searchParams.delete(PLANNER_PREVIEW_PARAM)
    if (readOnlyPlan) {
      if (!plannerBookReadToken) {
        setPreDepartureTransferStatus('failed')
        return
      }
      transferUrl.searchParams.set(PLANNER_PREVIEW_PARAM, plannerBookReadToken)
    } else {
      transferUrl.searchParams.set(PLANNER_BOOK_PARAM, plannerBookId)
    }
    const transferValue = encodePreDepartureTransfer({
      bookId: plannerBookId,
      checklist: preDepartureChecklist,
    })
    transferUrl.hash = new URLSearchParams({ 'pre-departure': transferValue }).toString()
    if (transferUrl.toString().length > 8000) {
      setPreDepartureTransferStatus('failed')
      return
    }
    try {
      await navigator.clipboard.writeText(transferUrl.toString())
      setPreDepartureTransferStatus('copied')
    } catch {
      setPreDepartureTransferStatus('failed')
    }
  }, [
    config.shareSearchParams,
    plannerBookId,
    plannerBookReadToken,
    preDepartureChecklist,
    readOnlyPlan,
  ])

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
      if (!hasSavablePlannerContent) {
        setSaveLinkCopied(false)
        setSavePreviewCopied(false)
        setSaveSheetUrl(null)
        setSaveSheetPreviewUrl(null)
        alert('請先新增景點，或把景點加入我的順序後再保存。')
        return
      }

      if (hasSavablePlannerContent) {
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
          preDepartureChecklist,
        ).catch(() => null)
        if (book) {
          saveSucceeded = true
          savedPlannerBookId = book.id
          savedReadToken = book.readToken ?? plannerBookReadToken
          const updatedAt = new Date().toISOString()
          if (!plannerBookId) preDepartureMigrationTargetRef.current = book.id
          setPlannerBookId(book.id)
          setPlannerBookReadToken(savedReadToken)
          setPlannerBookUpdatedAt(updatedAt)
          preDepartureLastCloudSignatureRef.current = preDepartureChecklistSignature
          setPreDepartureCloudStatus('saved')
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
                access: 'edit',
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
      if (hasSavablePlannerContent && !saveSucceeded) {
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
        share_has_book: Boolean(savedPlannerBookId),
        planner_book_id: savedPlannerBookId,
        share_short_id: shortShareId,
        custom_place_count: customPlaceCount,
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
    customPlaceCount,
    lookupPlaces,
    customPlaces,
    hasSavablePlannerContent,
    placeUserLinks,
    placeNotes,
    plannerBookId,
    plannerBookReadToken,
    preDepartureChecklist,
    preDepartureChecklistSignature,
    trackPlannerEvent,
    validPlanIds,
    validPlanItems,
  ])

  const forkSharedPlan = useCallback(() => {
    if (!readOnlyPlan || shareSaving || !hasSavablePlannerContent) return
    void (async () => {
      setShareSaving(true)
      try {
        const sharedNotes = Object.fromEntries(
          validPlanIds.map((id) => [id, placeNotes[id]?.trim() ?? '']).filter(([, note]) => note),
        )
        const book = await savePlannerBook(
          config.plannerBookCityName ?? config.recentCountryName ?? config.shareTitle,
          null,
          validPlanItems,
          sharedNotes,
          customPlaces,
          placeUserLinks,
          preDepartureChecklist,
        ).catch(() => null)
        if (!book) {
          alert('建立副本失敗，請稍後再試一次')
          return
        }

        const updatedAt = new Date().toISOString()
        const readToken = book.readToken ?? null
        setPlannerBookId(book.id)
        setPlannerBookReadToken(readToken)
        setPlannerBookUpdatedAt(updatedAt)
        setReadOnlyPlan(false)
        setPlannerImages([])
        setPlannerImageOwnerToken(null)
        const imageOwnerToken = await claimPlannerImageOwner(book.id)
        if (imageOwnerToken) {
          window.localStorage.setItem(`${config.storageKey}:${PLANNER_IMAGE_OWNER_KEY}:${book.id}`, imageOwnerToken)
          setPlannerImageOwnerToken(imageOwnerToken)
          if (plannerBookId && plannerBookReadToken) {
            const copiedImages = await copyPlannerImages(plannerBookId, plannerBookReadToken, book.id, imageOwnerToken)
            if (copiedImages?.images) setPlannerImages(copiedImages.images)
          }
        }
        setSaveSheetUrl(null)
        setSaveSheetPreviewUrl(null)
        setPlannerLinkUnavailable(false)
        preDepartureLastCloudSignatureRef.current = preDepartureChecklistSignature
        setPreDepartureCloudStatus('saved')
        removeJsonCache(`planner-book:id=${encodeURIComponent(book.id)}`)
        if (readToken) removeJsonCache(`planner-book:${PLANNER_PREVIEW_PARAM}=${encodeURIComponent(readToken)}`)

        window.localStorage.setItem(`${config.storageKey}:book-id`, book.id)
        if (readToken) window.localStorage.setItem(`${config.storageKey}:book-read-token`, readToken)
        window.localStorage.setItem(`${config.storageKey}:book-updated-at`, updatedAt)
        if (config.recentListKey && config.recentRegionKey) {
          const rawRecent = window.localStorage.getItem(config.recentListKey)
          let recentItems: unknown = []
          try {
            recentItems = rawRecent ? (JSON.parse(rawRecent) as unknown) : []
          } catch {
            // A malformed local recent-list must not block creating the copy.
          }
          const existingItems = Array.isArray(recentItems)
            ? recentItems.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
            : []
          window.localStorage.setItem(
            config.recentListKey,
            JSON.stringify([
              {
                id: book.id,
                readToken: readToken ?? '',
                access: 'edit',
                regionKey: config.recentRegionKey,
                source: config.recentSource ?? 'map',
                countryName: config.recentCountryName ?? config.shareTitle,
                updatedAt,
              },
              ...existingItems.filter((item) => item.id !== book.id),
            ].slice(0, 12)),
          )
        }

        const url = new URL(window.location.pathname, window.location.origin)
        Object.entries(config.shareSearchParams ?? {}).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value)
        })
        url.searchParams.set(PLANNER_BOOK_PARAM, book.id)
        window.history.replaceState(null, '', `${url.pathname}${url.search}`)
        alert('已建立你的行程副本，現在可以自由調整，不會影響原分享行程。')
      } finally {
        setShareSaving(false)
      }
    })()
  }, [
    config.plannerBookCityName,
    config.recentCountryName,
    config.recentListKey,
    config.recentRegionKey,
    config.recentSource,
    config.shareSearchParams,
    config.shareTitle,
    config.storageKey,
    customPlaces,
    hasSavablePlannerContent,
    placeNotes,
    placeUserLinks,
    plannerBookId,
    plannerBookReadToken,
    preDepartureChecklist,
    preDepartureChecklistSignature,
    readOnlyPlan,
    shareSaving,
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

  const applyNearbyKnownPlaces = useCallback((suggestion: NearbyKnownPlacesSuggestion) => {
    setNearbyKnownPlaces(suggestion.places)
    setNearbyKnownPlacesPrompt(null)
    setCustomOnly(false)
    setCategoryOn(allCategoryOn)
    try {
      window.localStorage.setItem(nearbyKnownPlacesStorageKey, `accepted:${suggestion.key}`)
    } catch {
      // Ignore blocked storage.
    }
  }, [allCategoryOn, nearbyKnownPlacesStorageKey])

  const acceptNearbyKnownPlaces = useCallback(() => {
    const suggestion = nearbyKnownPlacesPrompt
    if (!suggestion) return
    applyNearbyKnownPlaces(suggestion)
  }, [applyNearbyKnownPlaces, nearbyKnownPlacesPrompt])

  const loadNearbyKnownPlacesManually = useCallback(() => {
    const suggestion = nearbyKnownPlacesSuggestionForDraft
    if (!suggestion) return
    applyNearbyKnownPlaces(suggestion)
  }, [applyNearbyKnownPlaces, nearbyKnownPlacesSuggestionForDraft])

  const showNearbyKnownPlacesManualAction =
    !readOnlyPlan &&
    storageReady &&
    !nearbyKnownPlacesPrompt &&
    nearbyKnownPlaces.length === 0 &&
    Boolean(nearbyKnownPlacesSuggestionForDraft)

  const dismissNearbyKnownPlaces = useCallback(() => {
    const suggestion = nearbyKnownPlacesPrompt
    setNearbyKnownPlacesPrompt(null)
    if (!suggestion) return
    try {
      window.localStorage.setItem(nearbyKnownPlacesStorageKey, `dismissed:${suggestion.key}`)
    } catch {
      // Ignore blocked storage.
    }
  }, [nearbyKnownPlacesPrompt, nearbyKnownPlacesStorageKey])

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
            const navigationPlaces = transportNavigationPlaces(day.items, item, placeById)
            const href = navigationPlaces
              ? printLinkHref(transportNavigationUrl(navigationPlaces.from, navigationPlaces.to, transport.mode))
              : ''
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
    if (target.closest(`.${styles.dragHandle}, .${styles.transportDragHandle}, .${styles.dayDragHandle}`)) {
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
        onClickCapture={(event) => {
          const target = event.target as HTMLElement
          if (!target.closest(`.${styles.transportGroup}`)) collapseOpenTransportGroups()
        }}
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
                {readOnlyPlan ? <span>分享範本・複製後可自由修改</span> : null}
                {plannerBookUpdatedAt ? <span>最後更新 {formatPlannerUpdatedAt(plannerBookUpdatedAt)}</span> : null}
              </div>
            ) : null}
          </div>
          <div className={styles.topActions}>
            {config.guideLink ? (
              <a
                className={styles.guideAction}
                href={config.guideLink.href}
                target="_blank"
                rel="noopener noreferrer"
                data-event={config.guideLink.event}
                data-section="planner_header"
              >
                <span aria-hidden="true">▶</span>
                {config.guideLink.label}
              </a>
            ) : null}
            {readOnlyPlan ? (
              <button className={styles.shareAction} type="button" onClick={forkSharedPlan} disabled={shareSaving || !hasSavablePlannerContent}>
                {shareSaving ? '建立副本中...' : '複製成我的行程'}
              </button>
            ) : (
              <button className={styles.shareAction} type="button" onClick={handleShare} disabled={shareSaving}>
                {shareSaving ? '儲存中...' : plannerBookId ? '儲存更新' : config.shareActionLabel}
              </button>
            )}
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
            <div ref={mapShellRef} className={styles.mapShell}>
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
              if (mobilePanelStateRef.current === 'half' && pendingCustomMapFocusRef.current) {
                focusCustomMapPosition(pendingCustomMapFocusRef.current)
              }
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
                  {showNearbyKnownPlacesManualAction && nearbyKnownPlacesSuggestionForDraft ? (
                    <div className={styles.nearbyKnownPlacesHint}>
                      <span>{`${nearbyKnownPlacesSuggestionForDraft.label}\u53ef\u4ee5\u52a0\u5165`}</span>
                      <button type="button" onClick={loadNearbyKnownPlacesManually}>
                        {'\u8f09\u5165\u666f\u9ede'}
                      </button>
                    </div>
                  ) : null}
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
                            onBlur={() => {
                              refocusPendingCustomMapPosition()
                              if (customGoogleUrlNotice) setCustomPlaceSaveError('googleUrl')
                            }}
                            placeholder="貼上 Google Maps 分享連結"
                          />
                        </label>
                        {customGoogleUrlNotice ? (
                          <p className={styles.customPlaceStatus}>
                            {customGoogleUrlNotice}
                          </p>
                        ) : null}
                      </div>
                      {showCustomPlaceConfirm ? (
                        <div ref={customConfirmRef} className={styles.customPlaceConfirm}>
                          <div className={styles.customPlaceStepTitle}>
                            <span>2</span>
                            {'\u78ba\u8a8d\u8cc7\u6599'}
                          </div>
                          <>
                            <label>
                              <span className={styles.customPlaceLabel}>
                                名稱
                                {customUrlResolving ? (
                                  <span className={styles.customPlaceFieldSearching} role="status" aria-live="polite">
                                    <i aria-hidden="true" />
                                    搜尋中
                                  </span>
                                ) : null}
                              </span>
                              <input
                                value={customDraft.name}
                                onChange={(event) => setCustomDraft((draft) => ({ ...draft, name: event.target.value }))}
                                placeholder={customUrlResolving ? '名稱搜尋中…' : '可自己修改景點名稱'}
                                aria-busy={customUrlResolving || undefined}
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
                            {directMatchedKnownPlace ? (
                              <p className={styles.customPlaceMatchedHint}>
                                已帶入旅杰整理的連結
                              </p>
                            ) : null}
                          </>
                            <>
                              <p className={styles.customPlaceStatus}>
                                {customDraft.lat != null && customDraft.lng != null
                                  ? '\u5df2\u5e36\u5165\u4f4d\u7f6e\uff0c\u8acb\u770b\u4e0a\u65b9\u5730\u5716\u78ba\u8a8d\u6a19\u8a18\u5f8c\u518d\u5132\u5b58\u3002'
                                  : customDraft.picking
                                    ? '\u627e\u4e0d\u5230\u5b8c\u6574\u4f4d\u7f6e\uff0c\u5df2\u5207\u63db\u70ba\u624b\u52d5\u5efa\u7acb\u3002\u8acb\u78ba\u8a8d\u540d\u7a31\uff0c\u518d\u5230\u5730\u5716\u9ede\u4e00\u4e0b\u6a19\u8a18\u4f4d\u7f6e\u3002'
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
                                  {'\u5230\u5730\u5716\u6a19\u8a18\u4f4d\u7f6e'}
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
                                            onClick={() => {
                                              if (!customDraft.id) return
                                              if (window.confirm(`刪除「${link.label}」這個連結？`)) {
                                                removePlaceUserLink(customDraft.id, index)
                                              }
                                            }}
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
                      {showCustomDraftHotelAffiliateRecheck ? (
                        <button
                          type="button"
                          className={styles.customPlaceAffiliateRecheck}
                          onClick={() => {
                            if (customDraftSavedPlace) forceHotelAffiliateLookupForCustomPlace(customDraftSavedPlace.id)
                          }}
                          disabled={customDraftAffiliateLookupPending}
                          title="會以目前已儲存的住宿資料重新查詢；若剛修改名稱或 Google Maps 連結，請先儲存後再按。"
                        >
                          {customDraftAffiliateLookupPending ? '正在重新驗證 Agoda／Trip…' : '重新驗證 Agoda／Trip'}
                        </button>
                      ) : null}
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
                    const customPlace = isCustomPlace ? customPlaces[place.id] : undefined
                    const customHotelLinks = customPlace ? [...(customPlace.links ?? []), ...(placeUserLinks[place.id] ?? [])] : []
                    const customHotelHasAgodaLink = hasHotelAffiliateProviderLink(customHotelLinks, 'Agoda')
                    const customHotelHasTripLink = hasHotelAffiliateProviderLink(customHotelLinks, 'Trip')
                    const customHotelHasAffiliateLink = customHotelHasAgodaLink || customHotelHasTripLink
                    const customHotelEligibility = customPlace ? customPlaceHotelAffiliateEligibility(customPlace) : 'skipped'
                    const customHotelAffiliateLookupPending =
                      customHotelEligibility === 'pending_place_type' ||
                      (!customHotelHasAgodaLink && agodaAffiliateStatus[place.id] === 'searching') ||
                      (!customHotelHasTripLink && tripAffiliateStatus[place.id] === 'searching')
                    const showManualHotelAffiliateLookup =
                      customPlace
                        ? !readOnlyPlan &&
                          plannerPlaceCategory(place, customCategoryItems) === 'hotel' &&
                          customPlaceHotelAffiliateManualLookupAllowed(customPlace) &&
                          customHotelEligibility !== 'pending_place_type' &&
                          (!customHotelHasAgodaLink || !customHotelHasTripLink) &&
                          !customHotelAffiliateLookupPending
                        : false
                    const hotelAffiliateStatuses =
                      isCustomPlace && plannerPlaceCategory(place, customCategoryItems) === 'hotel'
                        ? [
                            customHotelHasAgodaLink ? '' : hotelAffiliateStatusText('Agoda', agodaAffiliateStatus[place.id]),
                            customHotelHasTripLink ? '' : hotelAffiliateStatusText('Trip', tripAffiliateStatus[place.id]),
                          ].filter(Boolean)
                        : []
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
                          {customHotelHasAffiliateLink ? (
                            <span className={styles.inlineMapLinks}>
                              <PlannerInlineCardLinks place={place} userLinks={placeUserLinks[place.id] ?? []} />
                            </span>
                          ) : null}
                          {hotelAffiliateStatuses.map((status) => (
                            <span key={status} className={styles.affiliateStatus}>{status}</span>
                          ))}
                          {showManualHotelAffiliateLookup ? (
                            <button
                              type="button"
                              className={styles.affiliateLookupButton}
                              onClick={() => forceHotelAffiliateLookupForCustomPlace(place.id)}
                            >
                              {customHotelEligibility === 'eligible' ? '重新驗證住宿' : '仍查住宿'}
                            </button>
                          ) : null}
                          {!customHotelHasAffiliateLink ? (
                            <span className={styles.inlineMapLinks}>
                              <PlannerInlineCardLinks place={place} userLinks={placeUserLinks[place.id] ?? []} />
                            </span>
                          ) : null}
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
                                  selectDayView('all')
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
                                    selectDayView(index + 1)
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
                          <button
                            type="button"
                            onClick={() => {
                              setOpenPlannerMenu(null)
                              setPreDepartureOpen(true)
                              trackPlannerEvent('pre_departure_open', { reminder_count: 7 })
                            }}
                          >
                            行前準備
                          </button>
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
                          ref={planListRef}
                          className={styles.planList}
                          data-planner-scroll-list="true"
                          onScroll={scheduleExpandedPlanItemCollapseIfNearlyOutside}
                          onTouchMove={scheduleExpandedPlanItemCollapseIfNearlyOutside}
                          onWheel={scheduleExpandedPlanItemCollapseIfNearlyOutside}
                        >
                          {visiblePlanItemGroups.map((displayItem) => {
                            const renderPlanListItem = (item: PlannerItem) => {
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
                              const navigationPlaces = transportNavigationPlaces(validPlanItems, item, placeById)
                              return (
                                <SortableTransportItem
                                  key={item}
                                  itemId={item}
                                  info={transport}
                                  expanded={expandedPlanItem === item}
                                  navigationPlaces={navigationPlaces}
                                  onToggleExpanded={() => {
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
                                  images={plannerImages.filter((image) => image.placeId === item)}
                                  imageUploadEnabled={!readOnlyPlan}
                                  imageBusy={plannerImageBusy}
                                  onAddImage={(file) => addPlannerImage(item, file)}
                                  onRemoveImage={removePlannerImage}
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
                            }

                            if (displayItem.type === 'item') return renderPlanListItem(displayItem.item)

                            const expanded =
                              expandedTransportGroups[displayItem.key] === true ||
                              (expandedPlanItem !== null && displayItem.items.includes(expandedPlanItem))
                            return (
                              <TransportItemGroup
                                key={displayItem.key}
                                items={displayItem.items}
                                expanded={expanded}
                                groupRef={(el) => {
                                  transportGroupRefs.current[displayItem.key] = el
                                }}
                                onExpand={() => {
                                  setExpandedPlanItemWithScrollCompensation(null)
                                  setExpandedTransportGroups((current) => ({ ...current, [displayItem.key]: true }))
                                }}
                              >
                                {displayItem.items.map(renderPlanListItem)}
                              </TransportItemGroup>
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
                {customPlaceSaveError === 'googleUrl'
                  ? '請貼上 Google Maps 連結'
                  : customPlaceSaveError === 'name'
                    ? '先確認景點名稱'
                    : '先確認地圖位置'}
              </h2>
              <p>
                {customPlaceSaveError === 'googleUrl'
                  ? customGoogleUrlNotice || '請貼上 Google Maps 連結來定位景點。'
                  : customPlaceSaveError === 'name'
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
                  {customPlaceSaveError === 'googleUrl'
                    ? '回去貼連結'
                    : customPlaceSaveError === 'name'
                      ? '回去填名稱'
                      : '到地圖確認'}
                </button>
                <button type="button" className={styles.confirmSecondary} onClick={() => setCustomPlaceSaveError(null)}>
                  先取消
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {preDepartureOpen ? (
          <PreDeparturePanelV2
            categories={preDepartureCategories}
            travelers={preDepartureTravelers}
            activeTargetId={preDepartureActiveTargetId}
            checkedItems={preDepartureChecked}
            notes={preDepartureNotes}
            readOnly={readOnlyPlan}
            cloudEnabled={Boolean(plannerBookId)}
            onActiveTargetChange={setPreDepartureActiveTargetId}
            onToggle={(targetId, itemId) => {
              if (readOnlyPlan) return
              setPreDepartureChecked((current) => {
                const targetItems = { ...(current[targetId] ?? {}) }
                if (targetItems[itemId]) delete targetItems[itemId]
                else targetItems[itemId] = true
                const next = { ...current }
                if (Object.keys(targetItems).length > 0) next[targetId] = targetItems
                else delete next[targetId]
                return next
              })
            }}
            onNoteChange={(id, note) => {
              setPreDepartureNotes((items) => {
                const next = { ...items }
                const cleanNote = note.slice(0, 500)
                if (cleanNote) next[id] = cleanNote
                else delete next[id]
                return next
              })
            }}
            onAdd={(categoryId, label) => {
              setPreDepartureCustomItems((items) => [
                ...items,
                {
                  id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
                  label,
                  custom: true,
                  categoryId,
                  scope: 'personal',
                },
              ])
            }}
            onRemove={(id) => {
              const item = preDepartureAllCategories.flatMap((category) => category.items).find((entry) => entry.id === id)
              if (!item) return
              if (item.custom) {
                setPreDepartureCustomItems((items) => items.filter((entry) => entry.id !== id))
              } else {
                setPreDepartureRemovedItemIds((items) => ({ ...items, [id]: true }))
              }
              setPreDepartureChecked((items) => {
                let changed = false
                const next = Object.fromEntries(Object.entries(items).map(([targetId, targetItems]) => {
                  if (!targetItems[id]) return [targetId, targetItems]
                  changed = true
                  const nextTargetItems = { ...targetItems }
                  delete nextTargetItems[id]
                  return [targetId, nextTargetItems]
                }).filter(([, targetItems]) => Object.keys(targetItems).length > 0))
                if (!changed) return items
                return next
              })
            }}
            onHideCategory={(categoryId) => {
              setPreDepartureHiddenCategoryIds((items) => ({ ...items, [categoryId]: true }))
            }}
            onAddTraveler={(name) => {
              const id = `traveler-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
              setPreDepartureTravelers((travelers) => [...travelers, { id, name: name.slice(0, 16) }])
              setPreDepartureActiveTargetId(id)
            }}
            onRenameTraveler={(id, name) => {
              setPreDepartureTravelers((travelers) => travelers.map((traveler) => (
                traveler.id === id ? { ...traveler, name: name.slice(0, 16) } : traveler
              )))
            }}
            onRemoveTraveler={(id) => {
              setPreDepartureTravelers((travelers) => travelers.filter((traveler) => traveler.id !== id))
              setPreDepartureChecked((checked) => {
                if (!checked[id]) return checked
                const next = { ...checked }
                delete next[id]
                return next
              })
              setPreDepartureCustomItems((items) => items.flatMap((item) => {
                if (preDepartureItemScope(item) !== 'personal' || !item.travelerIds?.includes(id)) return [item]
                const travelerIds = item.travelerIds.filter((travelerId) => travelerId !== id)
                return travelerIds.length > 0 ? [{ ...item, travelerIds }] : []
              }))
              setPreDepartureActiveTargetId(PRE_DEPARTURE_OWNER.id)
            }}
            onSave={async () => {
              if (readOnlyPlan) return false
              if (!plannerBookId) {
                setPreDepartureOpen(false)
                handleShare()
                return true
              }
              if (preDepartureCloudSaveTimerRef.current != null) {
                window.clearTimeout(preDepartureCloudSaveTimerRef.current)
                preDepartureCloudSaveTimerRef.current = null
              }
              if (preDepartureChecklistSignature === preDepartureLastCloudSignatureRef.current) {
                setPreDepartureCloudStatus('saved')
                return true
              }
              setPreDepartureCloudStatus('saving')
              const result = await savePreDepartureChecklistCloud(plannerBookId, preDepartureChecklist).catch(() => null)
              if (!result) {
                setPreDepartureCloudStatus('error')
                return false
              }
              preDepartureLastCloudSignatureRef.current = JSON.stringify(
                serializePreDepartureChecklistStorage(result.checklist),
              )
              setPreDepartureCloudStatus('saved')
              if (result.updatedAt) setPlannerBookUpdatedAt(result.updatedAt)
              return true
            }}
            onClose={() => setPreDepartureOpen(false)}
          />
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

        {nearbyKnownPlacesPrompt ? (
          <div className={styles.confirmBackdrop} role="presentation" onClick={dismissNearbyKnownPlaces}>
            <section
              className={styles.confirmDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="nearby-known-places-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="nearby-known-places-title">載入{nearbyKnownPlacesPrompt.label}？</h2>
              <p>這份行程的位置靠近旅杰已整理的地圖資料，可以加入景點、住宿和商店清單一起排。</p>
              <div className={styles.confirmActions}>
                <button type="button" className={styles.confirmSecondary} onClick={dismissNearbyKnownPlaces}>
                  先不要
                </button>
                <button type="button" className={styles.confirmPrimary} onClick={acceptNearbyKnownPlaces}>
                  載入地圖資料
                </button>
              </div>
            </section>
          </div>
        ) : null}

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
              aria-labelledby="planner-location-title"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="planner-location-title">允許使用目前位置？</h2>
              <p>JieJourneys 會在地圖上顯示你的目前位置，走動時藍點會跟著更新，定位不會儲存在行程裡。</p>
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
                  {locationRequesting ? '定位中...' : '開始定位'}
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
                你現在透過 {inAppBrowserName(inAppBrowser)} 內建瀏覽器查看分享行程，關閉 App 後可能不容易再次找到這個頁面。
              </p>
              <p>建議複製完整連結，再到 {preferredBrowserName()} 開啟。</p>
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
              <h2 id="save-plan-title">行程與清單已儲存</h2>
              <p>景點與行前清單都已同步雲端；用同一個編輯連結即可跨裝置更新。</p>
              {inAppBrowser ? (
                <p className={styles.saveHint}>
                  建議複製到 {preferredBrowserName()} 開啟，或傳到 LINE / 備忘錄保存。
                </p>
              ) : (
                <p className={styles.saveHint}>電腦排完也可以傳到手機，出發時直接打開。</p>
              )}
              <div className={styles.saveLinkGroup}>
                <div className={styles.saveLinkHeader}>
                  <span>我的編輯連結</span>
                </div>
                <div className={styles.saveUrlRow}>
                  <div className={styles.saveUrl}>{saveSheetUrl}</div>
                  <button type="button" className={styles.saveCopyButton} onClick={copySavedLink}>
                    {saveLinkCopied ? '已複製' : '複製給自己'}
                  </button>
                </div>
              </div>
              {saveSheetPreviewUrl ? (
                <div className={styles.saveLinkGroup}>
                  <div className={styles.saveLinkHeader}>
                    <span>可分享範本連結</span>
                  </div>
                  <p className={styles.saveHint}>朋友可先查看；想調整時按「複製成我的行程」，會建立自己的副本，不會改到你的原始行程。</p>
                  <div className={styles.saveUrlRow}>
                    <div className={styles.saveUrl}>{saveSheetPreviewUrl}</div>
                    <button type="button" className={styles.saveCopyButton} onClick={copyPreviewLink}>
                      {savePreviewCopied ? '已複製' : '複製'}
                    </button>
                  </div>
                </div>
              ) : null}
              <div className={styles.saveActions}>
                <button type="button" className={styles.confirmPrimary} onClick={saveSheetPreviewUrl ? sharePreviewLink : shareSavedLink}>
                  {saveSheetPreviewUrl ? '分享範本連結' : '分享連結'}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </>
  )
}
