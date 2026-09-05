'use client'

import { useEffect, useMemo, useState } from 'react'
import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import { BUSAN_MAP_CENTER } from '@/data/busan/map/places'
import { busanJourneyMatchPlaces, busanJourneyPlaces } from '@/data/busan/journeys'
import { OSAKA_MAP_CENTER, osakaMapPlaces } from '@/data/osaka/map/places'
import { osakaPassMapPlaces } from '@/data/osaka/pass-map/places'
import { TOKYO_MAP_CENTER, tokyoMapPlaces } from '@/data/tokyo'
import { FUJI_MAP_CENTER, fujiMapPlaces } from '@/data/fuji'
import { fujiPassMapPlaces } from '@/data/fuji/pass-map/places'
import { NORTH_VIETNAM_MAP_CENTER, northVietnamMapPlaces } from '@/data/northvietnam'
import type { MapPlace } from '@/lib/mapPlace'
import styles from './toolsPlanner.module.css'

type PlannerRegion = {
  key: string
  label: string
  shortLabel: string
  center: { lat: number; lng: number }
  zoom?: number
  places: MapPlace[]
  matchPlaces?: MapPlace[]
}

type PlannerSource = 'map' | 'pass'
type PlannerAccess = 'edit' | 'preview'
type InAppBrowser = 'instagram' | 'line' | 'messenger' | 'facebook' | null

type RecentPlanner = {
  id: string
  readToken?: string
  access: PlannerAccess
  regionKey: string
  source?: PlannerSource
  countryName: string
  updatedAt?: string
}

type PlannerBookMeta = {
  id?: string
  readToken?: string
  editToken?: string
  city?: string
}

type PlannerBookMetaLookup = {
  book: PlannerBookMeta | null
  unavailable: boolean
}

const GENERIC_CENTER = { lat: 23.8, lng: 121.0 }
const RECENT_PLANNERS_KEY = 'jiejourneys:tools-planner:recent:v1'
const PUBLIC_SITE_ORIGIN = 'https://www.jiejourneys.com'

type PendingPlannerStart = {
  region: PlannerRegion
  countryName: string
  shouldLoadKnownPlaces: boolean
  source: PlannerSource
  resetDraft?: boolean
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
  return 'App'
}

function plannerStartUrl(start: PendingPlannerStart) {
  const origin = typeof window === 'undefined' ? PUBLIC_SITE_ORIGIN : window.location.origin
  const url = new URL('/tools/planner', origin)
  url.searchParams.set('region', start.region.key)
  url.searchParams.set('resume', '1')
  if (start.source === 'pass') url.searchParams.set('source', 'pass')
  if (start.countryName !== start.region.shortLabel) url.searchParams.set('name', start.countryName)
  return url.toString()
}

function uniquePlaces(places: MapPlace[]) {
  const seen = new Set<string>()
  return places.filter((place) => {
    if (seen.has(place.id)) return false
    seen.add(place.id)
    return true
  })
}

const knownRegions: PlannerRegion[] = [
  {
    key: 'busan',
    label: '韓國釜山',
    shortLabel: '釜山',
    center: BUSAN_MAP_CENTER,
    places: busanJourneyPlaces,
    matchPlaces: busanJourneyMatchPlaces,
  },
  {
    key: 'osaka',
    label: '日本大阪',
    shortLabel: '大阪',
    center: OSAKA_MAP_CENTER,
    places: osakaMapPlaces,
    matchPlaces: osakaPassMapPlaces,
  },
  {
    key: 'tokyo',
    label: '日本東京',
    shortLabel: '東京',
    center: TOKYO_MAP_CENTER,
    places: tokyoMapPlaces,
    zoom: 11,
  },
  {
    key: 'fuji',
    label: '日本富士河口湖',
    shortLabel: '富士河口湖',
    center: FUJI_MAP_CENTER,
    places: fujiMapPlaces,
    matchPlaces: fujiPassMapPlaces,
    zoom: 9,
  },
  {
    key: 'northvietnam',
    label: '越南北越',
    shortLabel: '北越',
    center: NORTH_VIETNAM_MAP_CENTER,
    places: northVietnamMapPlaces,
    zoom: 7,
  },
]

const allKnownPlannerPlaces = uniquePlaces(
  knownRegions.flatMap((region) => [...region.places, ...(region.matchPlaces ?? [])]),
)

const semanticCategories: NonNullable<PlannerConfig['categoryItems']> = [
  { key: 'ticket', label: '票券' },
  { key: 'spot', label: '景點' },
  { key: 'restaurant', label: '餐廳' },
  { key: 'shop', label: '商店' },
  { key: 'hotel', label: '住宿' },
]

const semanticCategoryLabels: NonNullable<PlannerConfig['categoryLabels']> = {
  ticket: '票券',
  spot: '景點',
  restaurant: '餐廳',
  shop: '商店',
  hotel: '住宿',
}

function slugifyCountry(value: string) {
  const normalized = value.trim().toLowerCase()
  return (
    knownRegions.find((region) => normalized === region.key || normalized === region.label.toLowerCase() || normalized === region.shortLabel.toLowerCase())
      ?.key ??
    normalized
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) ??
    'custom'
  )
}

function plannerDisplayName(rawName: string | undefined, regionKey: string) {
  const knownRegion = knownRegions.find((region) => region.key === regionKey)
  const raw = (rawName ?? '').trim()
  const cleaned = raw
    .replace(/^toolsplanner[_-]*/i, '')
    .replace(/(?:map|pass)?planner$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim()
  const normalized = cleaned.toLowerCase()
  const matchedRegion = knownRegions.find(
    (region) =>
      normalized === region.key ||
      normalized === region.label.toLowerCase() ||
      normalized === region.shortLabel.toLowerCase(),
  )
  if (matchedRegion) return matchedRegion.shortLabel
  if (cleaned && !/planner/i.test(cleaned)) return cleaned
  if (knownRegion) return knownRegion.shortLabel
  return regionKey.trim() || cleaned || '自由行'
}

function customRegionFromUrl(regionKey: string, countryName: string): PlannerRegion {
  const key = regionKey.trim() || slugifyCountry(countryName) || 'custom'
  const label = plannerDisplayName(countryName, key)
  return {
    key,
    label,
    shortLabel: label,
    center: GENERIC_CENTER,
    places: [],
    matchPlaces: allKnownPlannerPlaces,
    zoom: 7,
  }
}

function cleanPlannerEditToken(value: string | null | undefined) {
  const token = value?.trim() ?? ''
  return /^[a-f0-9]{64}$/.test(token) ? token : ''
}

function plannerBookEditTokenStorageKey(storageKey: string, bookId: string) {
  return `${storageKey}:book-edit-token:${bookId}`
}

function localPlannerEditToken(storageKey: string, bookId: string) {
  return cleanPlannerEditToken(window.localStorage.getItem(plannerBookEditTokenStorageKey(storageKey, bookId)))
}

async function recoverPlannerEditToken(bookId: string, imageOwnerToken: string) {
  if (!bookId || !imageOwnerToken) return ''
  const res = await fetch('/api/pass-planner/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'recover_edit_token', id: bookId, image_owner_token: imageOwnerToken }),
  })
  if (!res.ok) return ''
  const data = (await res.json().catch(() => null)) as { edit_token?: unknown } | null
  return typeof data?.edit_token === 'string' ? cleanPlannerEditToken(data.edit_token) : ''
}

async function fetchPlannerBookMeta(plannerId: string, readToken: string, editorToken = ''): Promise<PlannerBookMetaLookup> {
  const query = plannerId
    ? `id=${encodeURIComponent(plannerId)}&e=${encodeURIComponent(editorToken)}`
    : `v=${encodeURIComponent(readToken)}`
  const res = await fetch(`/api/pass-planner/book?${query}`, { cache: 'no-store' })
  if (res.status === 404 || res.status === 410) return { book: null, unavailable: true }
  if (!res.ok) return { book: null, unavailable: false }
  const data = (await res.json()) as { id?: unknown; read_token?: unknown; edit_token?: unknown; city?: unknown }
  return {
    book: {
      id: typeof data.id === 'string' && data.id.trim() ? data.id.trim() : undefined,
      readToken:
        typeof data.read_token === 'string' && data.read_token.trim()
          ? data.read_token.trim()
          : undefined,
      editToken: cleanPlannerEditToken(typeof data.edit_token === 'string' ? data.edit_token : '' ) || undefined,
      city: typeof data.city === 'string' && data.city.trim() ? data.city.trim() : undefined,
    },
    unavailable: false,
  }
}

function cleanRecentPlannerItems(value: unknown): RecentPlanner[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : '',
      readToken: typeof item.readToken === 'string' ? item.readToken : undefined,
      access: (item.access === 'preview' ? 'preview' : 'edit') as PlannerAccess,
      regionKey: typeof item.regionKey === 'string' ? item.regionKey : '',
      source: (item.source === 'pass' ? 'pass' : 'map') as PlannerSource,
      countryName: plannerDisplayName(typeof item.countryName === 'string' ? item.countryName : '', typeof item.regionKey === 'string' ? item.regionKey : ''),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
    }))
    .filter((item) => item.id && item.regionKey && item.countryName)
}

function plannerStorageKey(regionKey: string, source: PlannerSource) {
  return `jiejourneys:tools-planner:${regionKey}${source === 'pass' ? ':pass' : ''}:v1`
}

function clearPlannerLocalDraft(regionKey: string, source: PlannerSource) {
  const key = plannerStorageKey(regionKey, source)
  window.localStorage.removeItem(key)
  window.localStorage.removeItem(`${key}:notes`)
  window.localStorage.removeItem(`${key}:custom-places`)
  window.localStorage.removeItem(`${key}:user-links`)
  const bookId = window.localStorage.getItem(`${key}:book-id`)
  window.localStorage.removeItem(`${key}:book-id`)
  window.localStorage.removeItem(`${key}:book-read-token`)
  if (bookId) window.localStorage.removeItem(plannerBookEditTokenStorageKey(key, bookId))
  window.localStorage.removeItem(`${key}:book-updated-at`)
  window.localStorage.removeItem(`${key}:day-view:draft`)
  window.localStorage.removeItem(`${key}:pre-departure:draft`)
  // Legacy key used before personal checklists were scoped per itinerary.
  window.localStorage.removeItem(`${key}:pre-departure`)
}

function hasPlannerLocalDraft(regionKey: string, source: PlannerSource) {
  const key = plannerStorageKey(regionKey, source)
  const storageKeys = [key, `${key}:notes`, `${key}:custom-places`, `${key}:user-links`]

  return storageKeys.some((storageKey) => {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return false
    try {
      const value = JSON.parse(raw) as unknown
      if (Array.isArray(value)) return value.length > 0
      return Boolean(value && typeof value === 'object' && Object.keys(value).length > 0)
    } catch {
      // Keep an unreadable local value until the user explicitly starts over.
      return true
    }
  })
}

function upsertRecentPlanner(planner: RecentPlanner) {
  const raw = window.localStorage.getItem(RECENT_PLANNERS_KEY)
  const current = cleanRecentPlannerItems(raw ? JSON.parse(raw) : [])
  const existing = current.find((item) => item.id === planner.id)
  const nextPlanner =
    existing?.access === 'edit' && planner.access === 'preview'
      ? { ...existing, countryName: planner.countryName, updatedAt: planner.updatedAt }
      : planner
  const next = [nextPlanner, ...current.filter((item) => item.id !== planner.id)].slice(0, 12)
  window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(next))
  return next
}

function removeRecentPlanner(planner: Pick<RecentPlanner, 'id' | 'readToken' | 'regionKey' | 'source'>) {
  const raw = window.localStorage.getItem(RECENT_PLANNERS_KEY)
  const current = cleanRecentPlannerItems(raw ? JSON.parse(raw) : [])
  const next = current.filter((item) => item.id !== planner.id)
  window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(next))
  window.sessionStorage.removeItem(`planner-book:id=${encodeURIComponent(planner.id)}`)
  if (planner.readToken) {
    window.sessionStorage.removeItem(`planner-book:v=${encodeURIComponent(planner.readToken)}`)
  }

  const storageKey = plannerStorageKey(planner.regionKey, planner.source ?? 'map')
  window.localStorage.removeItem(`${storageKey}:day-view:${planner.id}`)
  window.localStorage.removeItem(`${storageKey}:pre-departure:${planner.id}`)
  if (window.localStorage.getItem(`${storageKey}:book-id`) === planner.id) {
    window.localStorage.removeItem(`${storageKey}:book-id`)
    window.localStorage.removeItem(`${storageKey}:book-read-token`)
    window.localStorage.removeItem(plannerBookEditTokenStorageKey(storageKey, planner.id))
    window.localStorage.removeItem(`${storageKey}:book-updated-at`)
  }
  return next
}

async function pruneUnavailableRecentPlanners(items: RecentPlanner[]) {
  const checked = await Promise.all(
    items.map(async (item) => {
      try {
        const storageKey = plannerStorageKey(item.regionKey, item.source ?? 'map')
        const lookup = await fetchPlannerBookMeta(
          item.access === 'edit' ? item.id : '',
          item.access === 'preview' ? item.readToken ?? '' : '',
          item.access === 'edit' ? localPlannerEditToken(storageKey, item.id) : '',
        )
        if (lookup.unavailable) {
          removeRecentPlanner(item)
          return null
        }
        if (lookup.book) {
          return { ...item, countryName: plannerDisplayName(lookup.book.city, item.regionKey) }
        }
      } catch {
        // Keep the local entry when the network is temporarily unavailable.
      }
      return item
    }),
  )
  const next = checked.filter((item): item is RecentPlanner => Boolean(item))
  window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(next))
  return next
}

export default function ToolsPlannerPage() {
  const [countryInput, setCountryInput] = useState('')
  const [preferredSource, setPreferredSource] = useState<PlannerSource>('map')
  const [recentPlanners, setRecentPlanners] = useState<RecentPlanner[]>([])
  const [renameTarget, setRenameTarget] = useState<RecentPlanner | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renamingPlannerId, setRenamingPlannerId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RecentPlanner | null>(null)
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('')
  const [deletingPlannerId, setDeletingPlannerId] = useState<string | null>(null)
  const [started, setStarted] = useState<{
    region: PlannerRegion
    loadKnownPlaces: boolean
    countryName: string
    source: PlannerSource
    plannerId?: string
    readToken?: string
    editToken?: string
  } | null>(null)
  const [unavailablePlanner, setUnavailablePlanner] = useState<{
    countryName: string
  } | null>(null)
  const [checkingSharedPlanner, setCheckingSharedPlanner] = useState(false)
  const [inAppBrowser, setInAppBrowser] = useState<InAppBrowser>(null)
  const [inAppPromptOpen, setInAppPromptOpen] = useState(false)
  const [inAppPromptCopied, setInAppPromptCopied] = useState(false)
  const [pendingPlannerStart, setPendingPlannerStart] = useState<PendingPlannerStart | null>(null)
  const trimmedCountryInput = countryInput.trim()

  useEffect(() => {
    let cancelled = false

    try {
      const params = new URLSearchParams(window.location.search)
      setInAppBrowser(detectInAppBrowser())
      const regionKey = params.get('region')?.trim() ?? ''
      const source = params.get('source') === 'pass' ? 'pass' : 'map'
      const resumeDraft = params.get('resume') === '1'
      const requestedCountryName = params.get('name')?.trim() ?? ''
      setPreferredSource(source)
      const plannerId = params.get('p')?.trim() || ''
      const readToken = params.get('v')?.trim() || ''
      const urlEditorToken = cleanPlannerEditToken(params.get('e'))
      const linkStorageKey = plannerStorageKey(regionKey, source)
      if (plannerId && urlEditorToken) {
        window.localStorage.setItem(plannerBookEditTokenStorageKey(linkStorageKey, plannerId), urlEditorToken)
      }
      let editorToken = plannerId ? urlEditorToken || localPlannerEditToken(linkStorageKey, plannerId) : ''
      const legacyOwnerToken = plannerId
        ? params.get('i')?.trim() || window.localStorage.getItem(`${linkStorageKey}:planner-image-owner:${plannerId}`)?.trim() || ''
        : ''
      const planParam = params.get('plan')?.trim() || ''
      const shouldLoadSharedPlan = Boolean(plannerId || readToken || planParam)
      const region = knownRegions.find((item) => item.key === regionKey)
      if (region && shouldLoadSharedPlan) {
        if (plannerId || readToken) {
          setCheckingSharedPlanner(true)
          ;(async () => {
            try {
              if (plannerId && !editorToken) {
                editorToken = await recoverPlannerEditToken(plannerId, legacyOwnerToken)
                if (editorToken) window.localStorage.setItem(plannerBookEditTokenStorageKey(linkStorageKey, plannerId), editorToken)
              }
              const lookup = await fetchPlannerBookMeta(plannerId, readToken, editorToken)
              if (cancelled) return
              const book = lookup.book
              setCheckingSharedPlanner(false)
              if (!book) {
                if (lookup.unavailable && plannerId) {
                  setRecentPlanners(
                    removeRecentPlanner({
                      id: plannerId,
                      readToken: readToken || undefined,
                      regionKey: region.key,
                      source,
                    }).slice(0, 8),
                  )
                }
                setUnavailablePlanner({ countryName: region.shortLabel })
                setStarted(null)
                return
              }
              const countryName = plannerDisplayName(book.city, region.key)
              if (plannerId && book.editToken && !editorToken) {
                editorToken = book.editToken
                window.localStorage.setItem(plannerBookEditTokenStorageKey(linkStorageKey, plannerId), editorToken)
              }
              if (book.id) {
                setRecentPlanners(
                  upsertRecentPlanner({
                    id: book.id ?? plannerId,
                    readToken: (book.readToken ?? readToken) || undefined,
                    access: plannerId ? 'edit' : 'preview',
                    regionKey: region.key,
                    source,
                    countryName,
                    updatedAt: new Date().toISOString(),
                  }).slice(0, 8),
                )
              }
              setUnavailablePlanner(null)
              setStarted({
                region,
                loadKnownPlaces: true,
                countryName,
                source,
                plannerId: plannerId || undefined,
                readToken: plannerId ? undefined : readToken || undefined,
                editToken: plannerId ? editorToken || undefined : undefined,
              })
            } catch {
              if (cancelled) return
              setCheckingSharedPlanner(false)
              setUnavailablePlanner({ countryName: region.shortLabel })
              setStarted(null)
            }
          })()
          return () => {
            cancelled = true
          }
        }

        setUnavailablePlanner(null)
        setCheckingSharedPlanner(false)
        setStarted({
          region,
          loadKnownPlaces: true,
          countryName: region.shortLabel,
          source,
        })
        return
      }
      if (shouldLoadSharedPlan && regionKey) {
        const startCustomSharedPlanner = (book?: PlannerBookMeta | null) => {
          const countryName = plannerDisplayName(book?.city, regionKey)
          const customRegion = customRegionFromUrl(regionKey, countryName)
          if (plannerId && book?.editToken && !editorToken) {
            editorToken = book.editToken
            window.localStorage.setItem(plannerBookEditTokenStorageKey(linkStorageKey, plannerId), editorToken)
          }
          if (book?.id) {
            setRecentPlanners(
              upsertRecentPlanner({
                id: book?.id ?? plannerId,
                readToken: (book?.readToken ?? readToken) || undefined,
                access: plannerId ? 'edit' : 'preview',
                regionKey: customRegion.key,
                source,
                countryName,
                updatedAt: new Date().toISOString(),
              }).slice(0, 8),
            )
          }
          setUnavailablePlanner(null)
          setStarted({
            region: customRegion,
            loadKnownPlaces: false,
            countryName,
            source,
            plannerId: plannerId || undefined,
            readToken: plannerId ? undefined : readToken || undefined,
            editToken: plannerId ? editorToken || undefined : undefined,
          })
        }

        if (plannerId || readToken) {
          setCheckingSharedPlanner(true)
          ;(async () => {
            try {
              if (plannerId && !editorToken) {
                editorToken = await recoverPlannerEditToken(plannerId, legacyOwnerToken)
                if (editorToken) window.localStorage.setItem(plannerBookEditTokenStorageKey(linkStorageKey, plannerId), editorToken)
              }
              const lookup = await fetchPlannerBookMeta(plannerId, readToken, editorToken)
              if (cancelled) return
              const book = lookup.book
              setCheckingSharedPlanner(false)
              if (!book) {
                if (lookup.unavailable && plannerId) {
                  setRecentPlanners(
                    removeRecentPlanner({
                      id: plannerId,
                      readToken: readToken || undefined,
                      regionKey,
                      source,
                    }).slice(0, 8),
                  )
                }
                setUnavailablePlanner({ countryName: regionKey })
                setStarted(null)
                return
              }
              startCustomSharedPlanner(book)
            } catch {
              if (cancelled) return
              setCheckingSharedPlanner(false)
              setUnavailablePlanner({ countryName: regionKey })
              setStarted(null)
            }
          })()
          return () => {
            cancelled = true
          }
        }

        startCustomSharedPlanner()
        return
      }
      if (region && resumeDraft) {
        setUnavailablePlanner(null)
        setCheckingSharedPlanner(false)
        setStarted({
          region,
          loadKnownPlaces: true,
          countryName: requestedCountryName || region.shortLabel,
          source,
        })
        return
      }
      if (resumeDraft && regionKey) {
        const countryName = plannerDisplayName(requestedCountryName || regionKey, regionKey)
        setUnavailablePlanner(null)
        setCheckingSharedPlanner(false)
        setStarted({
          region: customRegionFromUrl(regionKey, countryName),
          loadKnownPlaces: false,
          countryName,
          source,
        })
        return
      }
      if (region) {
        setCountryInput(region.shortLabel)
      } else if (regionKey) {
        setCountryInput(regionKey)
      }
      setCheckingSharedPlanner(false)

      const raw = window.localStorage.getItem(RECENT_PLANNERS_KEY)
      const localRecent = cleanRecentPlannerItems(raw ? JSON.parse(raw) : []).slice(0, 8)
      setRecentPlanners(localRecent)
      void pruneUnavailableRecentPlanners(localRecent).then((next) => {
        if (!cancelled) setRecentPlanners(next.slice(0, 8))
      })
    } catch {
      setRecentPlanners([])
    }

    return () => {
      cancelled = true
    }
  }, [])

  const matchedRegion = useMemo(() => {
    const normalized = trimmedCountryInput.toLowerCase()
    if (!normalized) return null
    return (
      knownRegions.find(
        (region) =>
          normalized === region.key ||
          normalized === region.label.toLowerCase() ||
          normalized === region.shortLabel.toLowerCase() ||
          region.label.toLowerCase().includes(normalized) ||
          normalized.includes(region.shortLabel.toLowerCase()),
      ) ?? null
    )
  }, [trimmedCountryInput])

  const regionSuggestions = useMemo(() => {
    const normalized = trimmedCountryInput.toLowerCase()
    if (!normalized) return []
    return knownRegions
      .filter(
        (region) =>
          region.key.includes(normalized) ||
          region.label.toLowerCase().includes(normalized) ||
          region.shortLabel.toLowerCase().includes(normalized) ||
          normalized.includes(region.shortLabel.toLowerCase()),
      )
      .slice(0, 5)
  }, [trimmedCountryInput])

  const startPlanner = (
    region: PlannerRegion,
    countryName = region.shortLabel,
    shouldLoadKnownPlaces = true,
    source: PlannerSource = 'map',
    planner?: { id?: string; readToken?: string; editToken?: string },
    resetDraft = !planner,
  ) => {
    let shouldClearLocalDraft = resetDraft && !planner
    if (shouldClearLocalDraft && hasPlannerLocalDraft(region.key, source)) {
      const shouldResumeDraft = window.confirm(
        `偵測到「${countryName}」尚未分享保存的本機草稿。\n\n按「確定」繼續上次草稿；按「取消」清除草稿並建立新行程。`,
      )
      shouldClearLocalDraft = !shouldResumeDraft
    }

    if (!planner && inAppBrowser) {
      setPendingPlannerStart({ region, countryName, shouldLoadKnownPlaces, source, resetDraft: shouldClearLocalDraft })
      setInAppPromptCopied(false)
      setInAppPromptOpen(true)
      return
    }
    if (shouldClearLocalDraft) clearPlannerLocalDraft(region.key, source)
    if (!planner) {
      const url = new URL(plannerStartUrl({ region, countryName, shouldLoadKnownPlaces, source }), window.location.origin)
      window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`)
    }
    setStarted({
      region,
      loadKnownPlaces: shouldLoadKnownPlaces,
      countryName,
      source,
      plannerId: planner?.id,
      readToken: planner?.id ? undefined : planner?.readToken,
      editToken: planner?.id ? planner.editToken : undefined,
    })
  }

  const continuePendingPlanner = () => {
    const pending = pendingPlannerStart
    if (!pending) {
      setInAppPromptOpen(false)
      return
    }
    setInAppPromptOpen(false)
    if (pending.resetDraft) clearPlannerLocalDraft(pending.region.key, pending.source)
    setStarted({
      region: pending.region,
      loadKnownPlaces: pending.shouldLoadKnownPlaces,
      countryName: pending.countryName,
      source: pending.source,
    })
  }

  const closeInAppPrompt = () => {
    setInAppPromptOpen(false)
    setPendingPlannerStart(null)
  }

  const copyInAppPromptLink = async () => {
    if (!pendingPlannerStart) return
    try {
      await navigator.clipboard.writeText(plannerStartUrl(pendingPlannerStart))
      setInAppPromptCopied(true)
    } catch {
      setInAppPromptCopied(false)
    }
  }

  const openRecentPlanner = async (planner: RecentPlanner) => {
    if (planner.access === 'preview' && !planner.readToken) {
      setRecentPlanners(removeRecentPlanner(planner).slice(0, 8))
      alert('這個預覽連結已無法使用，已從最近行程移除。')
      return
    }
    const region =
      knownRegions.find((item) => item.key === planner.regionKey) ?? {
        key: planner.regionKey,
        label: planner.countryName,
        shortLabel: planner.countryName,
        center: GENERIC_CENTER,
        places: [],
        zoom: 7,
      }
    const editorToken =
      planner.access === 'edit'
        ? localPlannerEditToken(plannerStorageKey(planner.regionKey, planner.source ?? 'map'), planner.id)
        : ''
    const lookup = await fetchPlannerBookMeta(
      planner.access === 'edit' ? planner.id : '',
      planner.access === 'preview' ? planner.readToken ?? '' : '',
      editorToken,
    )
    if (!lookup.book) {
      if (lookup.unavailable) {
        setRecentPlanners(removeRecentPlanner(planner).slice(0, 8))
        alert('這個行程已經刪除，已從最近行程移除')
      } else {
        alert('暫時無法讀取這個行程，請稍後再試')
      }
      return
    }

    const countryName = plannerDisplayName(lookup.book.city, planner.regionKey)
    const nextPlanner = { id: planner.id, readToken: planner.readToken, editToken: editorToken, countryName }
    const params = new URLSearchParams()
    params.set('region', region.key)
    if (planner.source === 'pass') params.set('source', 'pass')
    if (planner.access === 'preview') params.set('v', planner.readToken ?? '')
    else params.set('p', planner.id)
    window.history.replaceState(null, '', `/tools/planner?${params.toString()}`)
    startPlanner(
      region,
      countryName,
      true,
      planner.source ?? 'map',
      planner.access === 'preview'
        ? { readToken: planner.readToken }
        : nextPlanner,
    )
  }

  const openRenamePlanner = (planner: RecentPlanner) => {
    setRenameTarget(planner)
    setRenameValue(planner.countryName)
  }

  const openDeleteDialog = (planner: RecentPlanner) => {
    setDeleteConfirmationName('')
    setDeleteTarget(planner)
  }

  const closeDeleteDialog = () => {
    if (deletingPlannerId) return
    setDeleteTarget(null)
    setDeleteConfirmationName('')
  }

  const saveRenamePlanner = async () => {
    const planner = renameTarget
    if (!planner || renamingPlannerId) return
    const nextName = plannerDisplayName(renameValue, planner.regionKey) || planner.countryName
    const editorToken = localPlannerEditToken(plannerStorageKey(planner.regionKey, planner.source ?? 'map'), planner.id)
    if (!editorToken) return
    setRenamingPlannerId(planner.id)
    try {
      const res = await fetch('/api/pass-planner/book', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planner.id,
          edit_token: editorToken,
          city: nextName,
        }),
      })
      if (!res.ok) {
        alert('名稱儲存失敗，請稍後再試')
        return
      }
      const saved = (await res.json().catch(() => null)) as { updated_at?: unknown } | null
      const updatedAt = typeof saved?.updated_at === 'string' ? saved.updated_at : new Date().toISOString()
      const nextRecent = recentPlanners.map((item) =>
        item.id === planner.id && item.regionKey === planner.regionKey
          ? { ...item, countryName: nextName, updatedAt }
          : item,
      )
      setRecentPlanners(nextRecent)
      window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(nextRecent))
      setRenameTarget(null)
      setRenameValue('')
    } finally {
      setRenamingPlannerId(null)
    }
  }

  const deleteRecentPlanner = async () => {
    const planner = deleteTarget
    if (!planner) return
    if (deletingPlannerId) return
    if (planner.access === 'edit' && deleteConfirmationName.trim() !== planner.countryName) return
    if (planner.access === 'preview') {
      setRecentPlanners(removeRecentPlanner(planner).slice(0, 8))
      setDeleteTarget(null)
      setDeleteConfirmationName('')
      return
    }
    const storageKey = plannerStorageKey(planner.regionKey, planner.source ?? 'map')
    const editorToken = localPlannerEditToken(storageKey, planner.id)
    if (!editorToken) return
    setDeletingPlannerId(planner.id)
    try {
      const params = new URLSearchParams({ id: planner.id })
      params.set('e', editorToken)
      const res = await fetch(`/api/pass-planner/book?${params.toString()}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert('刪除失敗，請稍後再試')
        return
      }
      const nextRecent = recentPlanners.filter((item) => item.id !== planner.id)
      setRecentPlanners(nextRecent)
      window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(nextRecent))
      window.sessionStorage.removeItem(`planner-book:id=${encodeURIComponent(planner.id)}`)
      if (planner.readToken) {
        window.sessionStorage.removeItem(`planner-book:v=${encodeURIComponent(planner.readToken)}`)
      }

      window.localStorage.removeItem(`${storageKey}:day-view:${planner.id}`)
      if (window.localStorage.getItem(`${storageKey}:book-id`) === planner.id) {
        window.localStorage.removeItem(`${storageKey}:book-id`)
        window.localStorage.removeItem(`${storageKey}:book-read-token`)
        window.localStorage.removeItem(plannerBookEditTokenStorageKey(storageKey, planner.id))
        window.localStorage.removeItem(`${storageKey}:book-updated-at`)
      }
      setDeleteTarget(null)
      setDeleteConfirmationName('')
    } finally {
      setDeletingPlannerId(null)
    }
  }

  const startCustomPlanner = (forceBlank = false) => {
    const countryName = trimmedCountryInput || '自由行'
    const blankMatchPlaces = matchedRegion
      ? uniquePlaces([...matchedRegion.places, ...(matchedRegion.matchPlaces ?? [])])
      : allKnownPlannerPlaces
    if (!forceBlank && matchedRegion) {
      startPlanner(matchedRegion, countryName, true, preferredSource)
      return
    }

    let key = slugifyCountry(countryName) || 'custom'
    if (forceBlank && knownRegions.some((region) => region.key === key)) {
      key = `custom-${key}`
    }
    startPlanner(
      {
        key,
        label: countryName,
        shortLabel: countryName,
        center: matchedRegion?.center ?? GENERIC_CENTER,
        places: [],
        matchPlaces: blankMatchPlaces,
        zoom: matchedRegion?.zoom ?? 7,
      },
      countryName,
      false,
    )
  }

  if (checkingSharedPlanner) {
    return (
      <>
        <CitySubpageHeader backHref="/" eventPrefix="toolsplanner" />
        <main className={styles.page}>
          <section className={`${styles.panel} ${styles.unavailablePanel}`} aria-label="確認行程連結">
            <p className={styles.eyebrow}>確認行程連結中</p>
            <h1>正在讀取行程</h1>
            <p className={styles.lead}>正在確認這個分享連結是否還能使用。</p>
          </section>
        </main>
      </>
    )
  }

  if (unavailablePlanner) {
    return (
      <>
        <CitySubpageHeader backHref="/" eventPrefix="toolsplanner" />
        <main className={styles.page}>
          <section className={`${styles.panel} ${styles.unavailablePanel}`} aria-label="行程連結狀態">
            <p className={styles.eyebrow}>行程連結已失效</p>
            <h1>{unavailablePlanner.countryName}行程不存在</h1>
            <p className={styles.lead}>這個行程已刪除，或分享連結已經失效。請回到旅杰規劃重新建立排序。</p>
            <div className={styles.unavailableActions}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => {
                  window.history.replaceState(null, '', '/tools/planner')
                  setUnavailablePlanner(null)
                  setCountryInput(unavailablePlanner.countryName)
                }}
              >
                回到旅杰規劃
              </button>
              <button type="button" className={styles.secondaryAction} onClick={() => window.history.back()}>
                回上一頁
              </button>
            </div>
          </section>
        </main>
      </>
    )
  }

  if (started) {
    const { region, countryName, source } = started
    const sourcePlaces = source === 'pass' && region.matchPlaces?.length ? region.matchPlaces : region.places
    const places = started.loadKnownPlaces ? sourcePlaces : []
    const config: Partial<PlannerConfig> = {
      storageKey: plannerStorageKey(region.key, source),
      headerBackHref: '/tools/planner',
      headerBackForceReload: true,
      eventPrefix: `toolsplanner_${region.key}`,
      title: `${countryName}行程排序`,
      description: '貼上 Google Maps 連結或加入我的景點資料，拖曳調整每天順序，保存後可分享給手機或朋友。',
      topAriaLabel: `${countryName}行程排序工具`,
      workspaceAriaLabel: '通用行程排序工作區',
      panelAriaLabel: '通用行程排序面板',
      shareTitle: `${countryName}行程排序`,
      shareText: `我的${countryName}行程順序`,
      shareActionLabel: '分享/保存',
      saveReminderEnabled: true,
      backLinkLabel: '',
      guideLink: {
        label: '教學',
        href: 'https://www.instagram.com/reel/Dap0wcrBB6_/',
        event: 'plannerIG_workspace',
      },
      shareSearchParams: { region: region.key, ...(source === 'pass' ? { source: 'pass' } : {}) },
      initialSearchParams: {
        region: region.key,
        ...(source === 'pass' ? { source: 'pass' } : {}),
        ...(started.plannerId ? { p: started.plannerId } : started.readToken ? { v: started.readToken } : {}),
        ...(started.plannerId && started.editToken ? { e: started.editToken } : {}),
      },
      recentListKey: RECENT_PLANNERS_KEY,
      recentRegionKey: region.key,
      recentSource: source,
      recentCountryName: countryName,
      plannerBookCityName: countryName,
      mapZoom: region.zoom ?? 11,
      categoryLabels: semanticCategoryLabels,
      categoryItems: semanticCategories,
      customCategoryItems: [...semanticCategories.filter((item) => item.key !== 'ticket'), { key: 'transport', label: '機場/車站' }],
      // 地圖仍只顯示本次選擇的地區；自訂景點則可比對旅杰所有已整理景點，
      // 讓跨城市行程（例如大阪行程加入晴空塔）也能繼承正確的既有連結。
      matchPlaces: allKnownPlannerPlaces,
      tierItems: [],
    }

    return <BusanPassPlannerClient mapCenter={region.center} places={places} config={config} />
  }

  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="toolsplanner" />
      <main className={styles.page}>
        <section className={styles.panel} aria-label="建立通用行程排序">
        <p className={styles.eyebrow}>JieJourneys Planner</p>
        <div className={styles.introRow}>
          <h1>旅杰規劃</h1>
          <a
            href="https://www.instagram.com/reel/Dap0wcrBB6_/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.guideLink}
            data-event="plannerIG"
          >
            <span className={styles.guideLinkIcon}>🎬</span>
            看看怎麼用
          </a>
        </div>
        <p className={styles.lead}>整理景點、住宿、餐廳與票券，排出每天的行程順序。</p>

        <label className={styles.field}>
          <span>國家 / 城市</span>
          <input
            value={countryInput}
            onChange={(event) => setCountryInput(event.target.value)}
            placeholder="例如：釜山、大阪、東京、北越"
            suppressHydrationWarning
          />
        </label>

        {trimmedCountryInput ? (
          <div className={styles.suggestions} aria-label="地區建議">
            {regionSuggestions.map((region) => (
              <button
                key={region.key}
                type="button"
                onClick={() => startPlanner(region, region.shortLabel, true)}
              >
                <span>
                  <strong>{region.shortLabel}</strong>
                  <small>{region.label}</small>
                </span>
                <em>可帶入資料</em>
              </button>
            ))}
            <button type="button" onClick={() => startCustomPlanner(true)}>
              <span>
                <strong>{trimmedCountryInput}</strong>
                <small>建立自訂行程</small>
              </span>
              <em>空白開始</em>
            </button>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => startCustomPlanner()} disabled={!trimmedCountryInput}>
            開始排行程
          </button>
        </div>

        {recentPlanners.length > 0 ? (
          <section className={styles.recent} aria-label="最近行程">
            <h2>最近行程</h2>
            <div className={styles.recentList}>
              {recentPlanners.map((planner) => (
                <article key={`${planner.regionKey}-${planner.id}`} className={styles.recentCard}>
                  <button className={styles.recentOpen} type="button" onClick={() => openRecentPlanner(planner)}>
                    <span>
                      <strong>
                        {planner.countryName}
                        <em className={planner.access === 'preview' ? styles.previewBadge : styles.editBadge}>
                          {planner.access === 'preview' ? '預覽' : '可編輯'}
                        </em>
                      </strong>
                      {planner.updatedAt ? <small>{new Date(planner.updatedAt).toLocaleString('zh-TW')}</small> : null}
                    </span>
                  </button>
                  <span className={styles.recentActions}>
                    {planner.access === 'edit' ? (
                      <button
                        className={styles.recentEditButton}
                        type="button"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          openRenamePlanner(planner)
                        }}
                        aria-label={`重新命名${planner.countryName}行程`}
                      >
                        ✎
                      </button>
                    ) : null}
                    <button
                      className={styles.recentDeleteButton}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        openDeleteDialog(planner)
                      }}
                      disabled={deletingPlannerId === planner.id}
                      aria-label={
                        planner.access === 'preview'
                          ? `從最近行程移除${planner.countryName}`
                          : `刪除${planner.countryName}行程`
                      }
                    >
                      ×
                    </button>
                  </span>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <section className={styles.seoIntro} aria-labelledby="planner-about-title">
        <h2 id="planner-about-title">第一次用旅杰規劃？1 分鐘看懂</h2>
        <p>
          <strong>旅杰規劃是免費的自由行行程規劃工具。</strong>
          輸入目的地後，你可以自行新增想去的地點；支援旅杰資料的城市，還能直接帶入已整理的景點資訊，依天數安排每天的行程。
        </p>
        <h3>三步驟開始使用</h3>
        <ol className={styles.toolSteps}>
          <li>
            <strong>輸入目的地</strong>
            <span>選擇支援資料的城市，或直接從空白行程開始。</span>
          </li>
          <li>
            <strong>加入並安排地點</strong>
            <span>把景點、住宿、餐廳、票券與備註依天數排好。</span>
          </li>
          <li>
            <strong>儲存與分享</strong>
            <span>建立專屬連結，方便旅伴一起規劃或在手機查看。</span>
          </li>
        </ol>
        <div className={styles.faq} aria-labelledby="planner-faq-title">
          <h3 id="planner-faq-title">常見問題</h3>
          <details>
            <summary>旅杰規劃需要登入嗎？</summary>
            <p>不用。輸入目的地即可開始建立行程；儲存後，同一個瀏覽器會在首頁顯示最近行程。</p>
          </details>
          <details>
            <summary>行程如何保存與分享？</summary>
            <p>加入至少一個地點後，按「分享／保存」即可建立專屬行程連結。建議把連結存到 LINE、備忘錄或書籤；在 Instagram、LINE 等 App 內建瀏覽器使用時尤其重要。</p>
          </details>
          <details>
            <summary>哪些城市可直接帶入旅杰整理的景點資料？</summary>
            <p>目前可帶入釜山、大阪、東京、富士河口湖與北越的旅杰景點資料。其他國家或城市也能建立空白行程，再自行新增想去的地點。</p>
          </details>
          <details>
            <summary>和直接請 AI 產生行程有什麼差別？</summary>
            <p>AI 適合協助發想景點與路線；旅杰規劃適合把已確認的景點、住宿、票券與備註整理成可調整、可保存、可分享的實際行程。</p>
          </details>
        </div>
      </section>
      </main>
      {renameTarget ? (
        <div className={styles.confirmOverlay} role="presentation" onMouseDown={() => setRenameTarget(null)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-rename-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.confirmClose} type="button" onClick={() => setRenameTarget(null)} aria-label="關閉">
              ×
            </button>
            <h2 id="planner-rename-title">編輯行程名稱</h2>
            <label className={styles.renameField}>
              <span>名稱</span>
              <input
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !renamingPlannerId) void saveRenamePlanner()
                }}
                autoFocus
              />
            </label>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmCancel} onClick={() => setRenameTarget(null)}>
                取消
              </button>
              <button type="button" className={styles.confirmSave} onClick={() => void saveRenamePlanner()} disabled={renamingPlannerId === renameTarget.id}>
                {renamingPlannerId === renameTarget.id ? '儲存中...' : '儲存'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {inAppPromptOpen && inAppBrowser && pendingPlannerStart ? (
        <div className={styles.confirmOverlay} role="presentation" onMouseDown={closeInAppPrompt}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-browser-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.confirmClose} type="button" onClick={closeInAppPrompt} aria-label="關閉">
              ×
            </button>
            <h2 id="planner-browser-title">建議用 {preferredBrowserName()} 開啟</h2>
            <p>
              你現在在 {inAppBrowserName(inAppBrowser)} 內建瀏覽器。建立行程時，建議先複製連結到 {preferredBrowserName()} 開啟，資料比較不容易因為 App 關閉而消失。
            </p>
            <p>複製的是旅杰規劃入口，不是已儲存行程連結。</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.promptPrimary} onClick={copyInAppPromptLink}>
                {inAppPromptCopied ? '已複製' : '複製連結'}
              </button>
              <button type="button" className={styles.promptSecondary} onClick={continuePendingPlanner}>
                仍然開始排行程
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {deleteTarget ? (
        <div className={styles.confirmOverlay} role="presentation" onMouseDown={closeDeleteDialog}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.confirmClose} type="button" onClick={closeDeleteDialog} aria-label="關閉">
              ×
            </button>
            <h2 id="planner-delete-title">
              {deleteTarget.access === 'preview' ? '從最近行程移除？' : '刪除這個行程？'}
            </h2>
            <p>
              {deleteTarget.access === 'preview'
                ? `「${deleteTarget.countryName}」只會從這台裝置的最近行程移除，不會刪除朋友分享的行程。`
                : `「${deleteTarget.countryName}」會從最近行程與雲端一併刪除，分享連結和預覽連結也會失效。`}
            </p>
            {deleteTarget.access === 'edit' ? (
              <label className={styles.deleteConfirmField} htmlFor="planner-delete-confirmation-name">
                <span>請輸入行程名稱 <strong>{deleteTarget.countryName}</strong> 以確認刪除</span>
                <input
                  id="planner-delete-confirmation-name"
                  value={deleteConfirmationName}
                  onChange={(event) => setDeleteConfirmationName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && deleteConfirmationName.trim() === deleteTarget.countryName) {
                      void deleteRecentPlanner()
                    }
                  }}
                  autoComplete="off"
                  autoFocus
                  spellCheck={false}
                />
              </label>
            ) : null}
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmCancel} onClick={closeDeleteDialog} disabled={Boolean(deletingPlannerId)}>
                取消
              </button>
              <button
                type="button"
                className={styles.confirmDelete}
                onClick={deleteRecentPlanner}
                disabled={
                  deletingPlannerId === deleteTarget.id ||
                  (deleteTarget.access === 'edit' && deleteConfirmationName.trim() !== deleteTarget.countryName)
                }
              >
                {deletingPlannerId === deleteTarget.id
                  ? '刪除中...'
                  : deleteTarget.access === 'preview'
                    ? '移除'
                    : '刪除'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
