'use client'

import { useState, useEffect, useRef } from 'react'
import { BRAND, BRAND_LIGHT, TYPE_CFG } from '../../lib/types'
import type { ItemType } from '../../lib/types'
import { useGoogleMaps } from '../../lib/useGoogleMaps'

interface SearchResult {
  placeId: string
  name: string
  address: string
  lat?: number
  lng?: number
}

interface Props {
  day: number
  totalDays: number
  onAdd: (params: {
    day: number
    name: string
    type: ItemType
    address?: string
    lat?: number
    lng?: number
    notes?: string
    duration: number
  }) => void
  onClose: () => void
}

const TYPE_OPTIONS: { value: ItemType; label: string }[] = [
  { value: 'attraction', label: '📍 景點' },
  { value: 'food',       label: '🍜 餐廳' },
  { value: 'hotel',      label: '🏨 住宿' },
  { value: 'transport',  label: '🚉 交通' },
  { value: 'other',      label: '📌 其他' },
]

const DURATION_OPTIONS = [30, 60, 90, 120, 180, 240]

export default function SearchModal({ day, totalDays, onAdd, onClose }: Props) {
  const mapsReady = useGoogleMaps()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [type, setType] = useState<ItemType>('attraction')
  const [duration, setDuration] = useState(90)
  const [notes, setNotes] = useState('')
  const [targetDay, setTargetDay] = useState(day)
  const [searching, setSearching] = useState(false)
  const [tab, setTab] = useState<'search' | 'manual'>('search')
  const [manualName, setManualName] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const svcRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (mapsReady && !svcRef.current) {
      svcRef.current = new google.maps.places.AutocompleteService()
    }
  }, [mapsReady])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab !== 'search' || !query.trim()) { setResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (!svcRef.current) return
      setSearching(true)
      svcRef.current.getPlacePredictions(
        { input: query, language: 'zh-TW' },
        (preds, status) => {
          setSearching(false)
          if (status !== google.maps.places.PlacesServiceStatus.OK || !preds) { setResults([]); return }
          setResults(preds.map((p) => ({
            placeId: p.place_id,
            name: p.structured_formatting.main_text,
            address: p.structured_formatting.secondary_text ?? '',
          })))
        }
      )
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, tab])

  function selectResult(r: SearchResult) {
    if (!mapsReady) return
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ placeId: r.placeId }, (res, status) => {
      if (status === 'OK' && res?.[0]) {
        const loc = res[0].geometry.location
        setSelected({ ...r, lat: loc.lat(), lng: loc.lng() })
      } else {
        setSelected(r)
      }
    })
    setQuery(r.name)
    setResults([])
  }

  function handleSubmit() {
    if (tab === 'search' && !selected) return
    if (tab === 'manual' && !manualName.trim()) return
    onAdd({
      day: targetDay,
      name: tab === 'search' ? selected!.name : manualName.trim(),
      type,
      address: tab === 'search' ? selected?.address : manualAddress.trim() || undefined,
      lat: tab === 'search' ? selected?.lat : undefined,
      lng: tab === 'search' ? selected?.lng : undefined,
      notes: notes.trim() || undefined,
      duration,
    })
  }

  const canSubmit = tab === 'search' ? !!selected : !!manualName.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl overflow-hidden"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-900">新增行程項目</p>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(['search', 'manual'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={tab === t ? { background: '#fff', color: BRAND, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: '#94a3b8' }}
              >
                {t === 'search' ? '🔍 搜尋地點' : '✏️ 手動輸入'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {tab === 'search' ? (
            <div className="relative">
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                placeholder={mapsReady ? '搜尋景點、餐廳、住宿…' : '載入 Google Maps 中…'}
                disabled={!mapsReady}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#1f7a8c] animate-spin" />
              )}
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                  {results.map((r) => (
                    <button
                      key={r.placeId}
                      onClick={() => selectResult(r)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      {r.address && <p className="text-xs text-gray-400 mt-0.5 truncate">{r.address}</p>}
                    </button>
                  ))}
                </div>
              )}
              {selected && (
                <div className="mt-2 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg" style={{ background: BRAND_LIGHT, color: BRAND }}>
                  <span>✓</span>
                  <span className="truncate">{selected.name}</span>
                  {selected.lat && <span className="ml-auto opacity-60">📍 已定位</span>}
                </div>
              )}
              {!mapsReady && (
                <p className="mt-2 text-xs text-gray-400 text-center">需設定 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 才能搜尋</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                autoFocus
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="地點名稱"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
              />
              <input
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="地址（選填）"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
              />
            </div>
          )}

          {/* Type */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">類型</p>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setType(o.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={type === o.value
                    ? { background: BRAND, color: '#fff', borderColor: BRAND }
                    : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">停留時間</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={duration === d
                    ? { background: BRAND, color: '#fff', borderColor: BRAND }
                    : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
                >
                  {d < 60 ? `${d}分` : `${d / 60}小時`}
                </button>
              ))}
            </div>
          </div>

          {/* Day selector */}
          {totalDays > 1 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">加入第幾天</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                  <button
                    key={d}
                    onClick={() => setTargetDay(d)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={targetDay === d
                      ? { background: BRAND, color: '#fff', borderColor: BRAND }
                      : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
                  >
                    Day {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">備註（選填）</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="開放時間、訂位資訊…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#1f7a8c] transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-opacity"
            style={{ background: BRAND, opacity: canSubmit ? 1 : 0.4 }}
          >
            ＋ 加入行程
          </button>
        </div>
      </div>
    </div>
  )
}
