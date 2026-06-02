'use client'

import { useEffect, useMemo, useState } from 'react'
import BusanPassPlannerClient from '@/app/busan/pass-planner/BusanPassPlannerClient'
import type { PlannerConfig } from '@/app/busan/pass-planner/BusanPassPlannerClient'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import { BUSAN_MAP_CENTER, busanMapPlaces } from '@/data/busan/map/places'
import { busanPassMapPlaces } from '@/data/busan/pass-map/places'
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

type RecentPlanner = {
  id: string
  readToken?: string
  regionKey: string
  countryName: string
  updatedAt?: string
}

const GENERIC_CENTER = { lat: 23.8, lng: 121.0 }
const RECENT_PLANNERS_KEY = 'jiejourneys:tools-planner:recent:v1'

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
    places: busanMapPlaces,
    matchPlaces: busanPassMapPlaces,
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

export default function ToolsPlannerPage() {
  const [countryInput, setCountryInput] = useState('')
  const [recentPlanners, setRecentPlanners] = useState<RecentPlanner[]>([])
  const [deleteTarget, setDeleteTarget] = useState<RecentPlanner | null>(null)
  const [deletingPlannerId, setDeletingPlannerId] = useState<string | null>(null)
  const [started, setStarted] = useState<{
    region: PlannerRegion
    loadKnownPlaces: boolean
    countryName: string
  } | null>(null)
  const trimmedCountryInput = countryInput.trim()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const regionKey = params.get('region')?.trim() ?? ''
      const shouldLoadSharedPlan = Boolean(params.get('p') || params.get('v') || params.get('plan'))
      const region = knownRegions.find((item) => item.key === regionKey)
      if (region && shouldLoadSharedPlan) {
        setStarted({ region, loadKnownPlaces: true, countryName: region.shortLabel })
        return
      }

      const raw = window.localStorage.getItem(RECENT_PLANNERS_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : []
      if (!Array.isArray(parsed)) return
      setRecentPlanners(
        parsed
          .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
          .map((item) => ({
            id: typeof item.id === 'string' ? item.id : '',
            readToken: typeof item.readToken === 'string' ? item.readToken : undefined,
            regionKey: typeof item.regionKey === 'string' ? item.regionKey : '',
            countryName: typeof item.countryName === 'string' ? item.countryName : '',
            updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
          }))
          .filter((item) => item.id && item.regionKey && item.countryName)
          .slice(0, 8),
      )
    } catch {
      setRecentPlanners([])
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

  const startPlanner = (region: PlannerRegion, countryName = region.shortLabel, shouldLoadKnownPlaces = true) => {
    setStarted({ region, loadKnownPlaces: shouldLoadKnownPlaces, countryName })
  }

  const openRecentPlanner = (planner: RecentPlanner) => {
    const region =
      knownRegions.find((item) => item.key === planner.regionKey) ?? {
        key: planner.regionKey,
        label: planner.countryName,
        shortLabel: planner.countryName,
        center: GENERIC_CENTER,
        places: [],
        zoom: 7,
      }
    const params = new URLSearchParams()
    params.set('region', region.key)
    params.set('p', planner.id)
    window.history.replaceState(null, '', `/tools/planner?${params.toString()}`)
    startPlanner(region, planner.countryName, true)
  }

  const deleteRecentPlanner = async () => {
    const planner = deleteTarget
    if (!planner) return
    if (deletingPlannerId) return
    setDeletingPlannerId(planner.id)
    try {
      const res = await fetch(`/api/pass-planner/book?id=${encodeURIComponent(planner.id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert('刪除失敗，請稍後再試')
        return
      }
      const nextRecent = recentPlanners.filter((item) => item.id !== planner.id)
      setRecentPlanners(nextRecent)
      window.localStorage.setItem(RECENT_PLANNERS_KEY, JSON.stringify(nextRecent))

      const storageKey = `jiejourneys:tools-planner:${planner.regionKey}:v1`
      if (window.localStorage.getItem(`${storageKey}:book-id`) === planner.id) {
        window.localStorage.removeItem(`${storageKey}:book-id`)
        window.localStorage.removeItem(`${storageKey}:book-read-token`)
        window.localStorage.removeItem(`${storageKey}:book-updated-at`)
      }
      setDeleteTarget(null)
    } finally {
      setDeletingPlannerId(null)
    }
  }

  const startCustomPlanner = (forceBlank = false) => {
    const countryName = trimmedCountryInput || '自由行'
    if (!forceBlank && matchedRegion) {
      startPlanner(matchedRegion, countryName, true)
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
        center: GENERIC_CENTER,
        places: [],
        zoom: 7,
      },
      countryName,
      false,
    )
  }

  if (started) {
    const { region, countryName } = started
    const places = started.loadKnownPlaces ? region.places : []
    const config: Partial<PlannerConfig> = {
      storageKey: `jiejourneys:tools-planner:${region.key}:v1`,
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
      shareSearchParams: { region: region.key },
      recentListKey: RECENT_PLANNERS_KEY,
      recentRegionKey: region.key,
      recentCountryName: countryName,
      mapZoom: region.zoom ?? 11,
      categoryLabels: semanticCategoryLabels,
      categoryItems: semanticCategories,
      customCategoryItems: semanticCategories.filter((item) => item.key !== 'ticket'),
      matchPlaces: started.loadKnownPlaces ? region.matchPlaces : uniquePlaces([...region.places, ...(region.matchPlaces ?? [])]),
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
        <h1>旅杰行程</h1>
        <p className={styles.lead}>輸入目的地，開始排行程。</p>

        <label className={styles.field}>
          <span>國家 / 城市</span>
          <input
            value={countryInput}
            onChange={(event) => setCountryInput(event.target.value)}
            placeholder="例如：釜山、大阪、東京、北越"
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
                      <strong>{planner.countryName}</strong>
                      {planner.updatedAt ? <small>{new Date(planner.updatedAt).toLocaleString('zh-TW')}</small> : null}
                    </span>
                  </button>
                  <button
                    className={styles.recentDeleteButton}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setDeleteTarget(planner)
                    }}
                    disabled={deletingPlannerId === planner.id}
                    aria-label={`刪除${planner.countryName}行程`}
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
      </main>
      {deleteTarget ? (
        <div className={styles.confirmOverlay} role="presentation" onMouseDown={() => setDeleteTarget(null)}>
          <section
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="planner-delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.confirmClose} type="button" onClick={() => setDeleteTarget(null)} aria-label="關閉">
              ×
            </button>
            <h2 id="planner-delete-title">刪除這個行程？</h2>
            <p>「{deleteTarget.countryName}」會從最近行程移除，分享連結和預覽連結也會失效。</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmCancel} onClick={() => setDeleteTarget(null)}>
                取消
              </button>
              <button
                type="button"
                className={styles.confirmDelete}
                onClick={deleteRecentPlanner}
                disabled={deletingPlannerId === deleteTarget.id}
              >
                {deletingPlannerId === deleteTarget.id ? '刪除中...' : '刪除'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
