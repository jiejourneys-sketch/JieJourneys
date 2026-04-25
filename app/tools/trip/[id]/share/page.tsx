'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { BRAND, BRAND_LIGHT, TYPE_CFG } from '../../lib/types'
import type { PlanItem, Plan } from '../../lib/types'
import { fetchPlan, duplicatePlan, addRecentPlanId } from '../../lib/storage'
import { MOCK_ITEMS } from '../../lib/mockData'

function ShareCard({ item, isLast }: { item: PlanItem; isLast: boolean }) {
  const cfg = TYPE_CFG[item.type]
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20, paddingTop: 14 }}>
        <div className="w-3 h-3 rounded-full bg-white flex-shrink-0" style={{ border: `2px solid ${BRAND}`, boxShadow: `0 0 0 4px ${BRAND}1a` }} />
        {!isLast && <div className="w-px flex-1 bg-gray-200" style={{ marginTop: 4, minHeight: 44 }} />}
      </div>
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {/* Thumbnail banner */}
        {item.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail} alt={item.name} className="w-full object-cover" style={{ height: 120 }} />
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: BRAND_LIGHT, color: BRAND }}>{item.time}</span>
            <span className="text-xs text-gray-300">{item.duration}分鐘</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 leading-snug">{item.name}</p>
              {item.address && <p className="text-xs text-gray-400 mt-0.5 truncate">📍 {item.address}</p>}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
          </div>
          {item.notes && <p className="text-sm text-gray-500 mt-2.5 pl-9 leading-relaxed">{item.notes}</p>}
          {(item.affiliate_url || item.booking_url) && (
            <div className="mt-3 pl-9 flex items-center gap-3 flex-wrap">
              <a
                href={item.affiliate_url ?? item.booking_url}
                target="_blank" rel="noreferrer noopener"
                className="text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ background: BRAND, color: '#fff' }}
              >
                🛒 立即預訂
              </a>
              {item.price && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#fff7ed', color: '#c2410c' }}>
                  {item.price}
                </span>
              )}
            </div>
          )}
          {item.lat && (
            <div className="mt-3 pl-9">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                target="_blank" rel="noreferrer"
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg inline-block transition-colors"
                style={{ color: BRAND, background: BRAND_LIGHT }}
              >
                🗺️ 在地圖上查看
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const planId = params?.id as string
  const isMock = !planId || planId === 'demo'

  const [plan, setPlan] = useState<Plan | null>(null)
  const [items, setItems] = useState<PlanItem[]>([])
  const [activeDay, setActiveDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [dupeMsg, setDupeMsg] = useState<string | null>(null)
  const dupeMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isMock) {
      setPlan({ id: 'demo', title: '釜山 Demo 行程', days: 3, items: [] })
      setItems(MOCK_ITEMS)
      setLoading(false)
      return
    }
    fetchPlan(planId).then(({ plan: p, items: it }) => {
      if (p) { setPlan(p); setItems(it) }
      setLoading(false)
    })
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [planId, isMock])

  const totalDays = plan?.days ?? Math.max(...items.map((i) => i.day), 1)
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)
  const dayItems = items.filter((i) => i.day === activeDay)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  const handleDuplicate = async () => {
    if (isMock) { alert('Demo 模式無法複製'); return }
    setDuplicating(true)
    const newId = await duplicatePlan(planId)
    setDuplicating(false)
    if (newId) {
      addRecentPlanId(newId)
      if (dupeMsgTimer.current) clearTimeout(dupeMsgTimer.current)
      setDupeMsg('已建立副本，正在前往新行程…')
      dupeMsgTimer.current = setTimeout(() => setDupeMsg(null), 4000)
      router.push(`/tools/trip/${newId}`)
    } else {
      if (dupeMsgTimer.current) clearTimeout(dupeMsgTimer.current)
      setDupeMsg('複製失敗，請稍後再試')
      dupeMsgTimer.current = setTimeout(() => setDupeMsg(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: BRAND }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BRAND }}>
            <span className="text-white text-sm font-bold">✈</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate leading-snug">{plan?.title ?? '行程分享'}</p>
            <p className="text-xs text-gray-400">{totalDays} 天 · {items.length} 個景點</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            {copied ? '✓ 已複製' : '🔗 複製連結'}
          </button>
          {!isMock && (
            <Link href={`/tools/trip/${planId}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ background: BRAND }}>
              ✏️ 編輯
            </Link>
          )}
        </div>
      </div>

      {/* Day tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {days.map((day) => {
            const count = items.filter((i) => i.day === day).length
            const active = day === activeDay
            return (
              <button key={day} onClick={() => setActiveDay(day)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={active ? { background: BRAND, color: '#fff' } : { background: '#f1f5f9', color: '#64748b' }}
              >
                Day {day}
                <span className="text-xs px-1.5 py-px rounded-full font-bold"
                  style={active ? { background: 'rgba(255,255,255,0.25)', color: '#fff' } : { background: '#e2e8f0', color: '#64748b' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-28">
        <p className="text-xs font-bold uppercase mb-5" style={{ color: BRAND, letterSpacing: '0.1em' }}>Day {activeDay}</p>
        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-4xl mb-3 opacity-30">🗺️</span>
            <p className="font-semibold text-gray-400">這天還沒有行程</p>
          </div>
        ) : (
          dayItems.map((item, idx) => (
            <ShareCard key={item.id} item={item} isLast={idx === dayItems.length - 1} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4" style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}>
        {dupeMsg && (
          <div
            className="max-w-2xl mx-auto mb-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
            style={{ background: dupeMsg.includes('失敗') ? '#dc2626' : '#0f766e' }}
          >
            {dupeMsg}
          </div>
        )}
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">用這份行程當起點？</p>
            <p className="text-xs text-gray-400">複製後可自由修改，不影響原始行程</p>
          </div>
          <button
            onClick={handleDuplicate}
            disabled={duplicating}
            className="text-sm font-bold px-4 py-2.5 rounded-xl text-white flex-shrink-0 transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center gap-1.5"
            style={{ background: BRAND }}
          >
            {duplicating
              ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />複製中</>
              : '📋 複製這份行程'}
          </button>
          <Link
            href="/tools/trip"
            className="text-sm font-semibold px-4 py-2.5 rounded-xl flex-shrink-0 transition-colors hover:bg-gray-100 text-gray-600 border border-gray-200"
          >
            建立新的
          </Link>
        </div>
      </div>
    </div>
  )
}
