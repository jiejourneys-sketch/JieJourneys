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

type PlannerSource = 'map' | 'pass'

type RecentPlanner = {
  id: string
  readToken?: string
  regionKey: string
  source?: PlannerSource
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
  const [preferredSource, setPreferredSource] = useState<PlannerSource>('map')
  const [recentPlanners, setRecentPlanners] = useState<RecentPlanner[]>([])
  const [deleteTarget, setDeleteTarget] = useState<RecentPlanner | null>(null)
  const [deletingPlannerId, setDeletingPlannerId] = useState<string | null>(null)
  const [started, setStarted] = useState<{
    region: PlannerRegion
    loadKnownPlaces: boolean
    countryName: string
    source: PlannerSource
    plannerId?: string
    readToken?: string
  } | null>(null)
  const [unavailablePlanner, setUnavailablePlanner] = useState<{
    countryName: string
  } | null>(null)
  const [checkingSharedPlanner, setCheckingSharedPlanner] = useState(false)
  const trimmedCountryInput = countryInput.trim()

  useEffect(() => {
    let cancelled = false

    try {
      const params = new URLSearchParams(window.location.search)
      const regionKey = params.get('region')?.trim() ?? ''
      const source = params.get('source') === 'pass' ? 'pass' : 'map'
      setPreferredSource(source)
      const plannerId = params.get('p')?.trim() || ''
      const readToken = params.get('v')?.trim() || ''
      const planParam = params.get('plan')?.trim() || ''
      const shouldLoadSharedPlan = Boolean(plannerId || readToken || planParam)
      const region = knownRegions.find((item) => item.key === regionKey)
      if (region && shouldLoadSharedPlan) {
        if (plannerId || readToken) {
          setCheckingSharedPlanner(true)
          ;(async () => {
            const query = readToken ? `v=${encodeURIComponent(readToken)}` : `id=${encodeURIComponent(plannerId)}`
            try {
              const res = await fetch(`/api/pass-planner/book?${query}`, { cache: 'no-store' })
              if (cancelled) return
              setCheckingSharedPlanner(false)
              if (!res.ok) {
                setUnavailablePlanner({ countryName: region.shortLabel })
                setStarted(null)
                return
              }
              setUnavailablePlanner(null)
              setStarted({
                region,
                loadKnownPlaces: true,
                countryName: region.shortLabel,
                source,
                plannerId: plannerId || undefined,
                readToken: readToken || undefined,
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
      if (region) {
        setCountryInput(region.shortLabel)
      }
      setCheckingSharedPlanner(false)

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
            source: (item.source === 'pass' ? 'pass' : 'map') as PlannerSource,
            countryName: typeof item.countryName === 'string' ? item.countryName : '',
            updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
          }))
          .filter((item) => item.id && item.regionKey && item.countryName)
          .slice(0, 8),
      )
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
    planner?: Pick<RecentPlanner, 'id' | 'readToken'>,
  ) => {
    setStarted({
      region,
      loadKnownPlaces: shouldLoadKnownPlaces,
      countryName,
      source,
      plannerId: planner?.id,
      readToken: planner?.readToken,
    })
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
    if (planner.source === 'pass') params.set('source', 'pass')
    params.set('p', planner.id)
    window.history.replaceState(null, '', `/tools/planner?${params.toString()}`)
    startPlanner(region, planner.countryName, true, planner.source ?? 'map', planner)
  }

  const deleteRecentPlanner = async () => {
    const planner = deleteTarget
    if (!planner) return
    if (deletingPlannerId) return
    setDeletingPlannerId(planner.id)
    try {
      const params = new URLSearchParams({ id: planner.id })
      if (planner.readToken) params.set('read_token', planner.readToken)
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

      const storageKey = `jiejourneys:tools-planner:${planner.regionKey}${planner.source === 'pass' ? ':pass' : ''}:v1`
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
    const blankMatchPlaces = matchedRegion
      ? uniquePlaces([...matchedRegion.places, ...(matchedRegion.matchPlaces ?? [])])
      : []
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
            <p className={styles.lead}>這個行程已刪除，或分享連結已經失效。請回到行程工具重新建立排序。</p>
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
                回到行程工具
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
    const matchPlaces =
      source === 'pass'
        ? uniquePlaces([...region.places, ...(region.matchPlaces ?? [])])
        : started.loadKnownPlaces
          ? region.matchPlaces
          : uniquePlaces([...region.places, ...(region.matchPlaces ?? [])])
    const config: Partial<PlannerConfig> = {
      storageKey: `jiejourneys:tools-planner:${region.key}${source === 'pass' ? ':pass' : ''}:v1`,
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
      shareSearchParams: { region: region.key, ...(source === 'pass' ? { source: 'pass' } : {}) },
      initialSearchParams: {
        region: region.key,
        ...(source === 'pass' ? { source: 'pass' } : {}),
        ...(started.plannerId ? { p: started.plannerId } : {}),
        ...(started.readToken ? { v: started.readToken } : {}),
      },
      recentListKey: RECENT_PLANNERS_KEY,
      recentRegionKey: region.key,
      recentSource: source,
      recentCountryName: countryName,
      mapZoom: region.zoom ?? 11,
      categoryLabels: semanticCategoryLabels,
      categoryItems: semanticCategories,
      customCategoryItems: semanticCategories.filter((item) => item.key !== 'ticket'),
      matchPlaces,
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
