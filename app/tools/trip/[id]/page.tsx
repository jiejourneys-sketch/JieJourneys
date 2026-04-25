'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TYPE_CFG, BRAND, BRAND_LIGHT } from '../lib/types'
import type { PlanItem, Plan, ItemType } from '../lib/types'
import { detectSource, toAffiliateUrl } from '../lib/affiliate'
import { recalculateTimes } from '../lib/time'
import { MOCK_ITEMS } from '../lib/mockData'
import {
  fetchPlan,
  addPlanItem,
  deletePlanItem,
  updatePlanItem,
  duplicatePlan,
  saveItemsOrder,
  updatePlanTitle,
  updatePlanDays,
  addRecentPlanId,
} from '../lib/storage'
import dynamic from 'next/dynamic'
import SearchModal from './components/SearchModal'

const MapPanel = dynamic(() => import('./components/MapPanel'), { ssr: false })

// ─── constants ────────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { value: 30,  label: '30分' },
  { value: 60,  label: '1小時' },
  { value: 90,  label: '1.5小時' },
  { value: 120, label: '2小時' },
  { value: 180, label: '3小時' },
  { value: 240, label: '4小時' },
]

// ─── DragHandle ───────────────────────────────────────────────────────────────

function DragHandle({ listeners }: { listeners?: Record<string, unknown> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = listeners as any
  return (
    <svg
      {...props}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      width="12" height="18" viewBox="0 0 12 18" fill="currentColor"
      className="text-gray-300 hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
    >
      <circle cx="3.5" cy="3"  r="1.5" />
      <circle cx="8.5" cy="3"  r="1.5" />
      <circle cx="3.5" cy="9"  r="1.5" />
      <circle cx="8.5" cy="9"  r="1.5" />
      <circle cx="3.5" cy="15" r="1.5" />
      <circle cx="8.5" cy="15" r="1.5" />
    </svg>
  )
}

// ─── EditPanel (shared by desktop inline + mobile sheet) ─────────────────────

const SOURCE_LABEL: Record<string, string> = {
  agoda: 'Agoda', kkday: 'KKday', klook: 'Klook', booking: 'Booking.com', trip: 'Trip.com',
}

type EditPatch = {
  duration?: number; notes?: string
  booking_url?: string | null; affiliate_url?: string | null
  thumbnail?: string | null; price?: string | null
}

function EditPanel({
  item,
  onUpdate,
  onDelete,
  onClose,
}: {
  item: PlanItem
  onUpdate: (id: string, patch: EditPatch) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [bookingDraft, setBookingDraft] = useState(item.booking_url ?? '')
  const [priceDraft, setPriceDraft] = useState(item.price ?? '')
  const [thumbnailPreview, setThumbnailPreview] = useState(item.thumbnail ?? '')
  const [ogLoading, setOgLoading] = useState(false)

  async function handleBookingBlur() {
    const trimmed = bookingDraft.trim()
    if (!trimmed) {
      onUpdate(item.id, { booking_url: null, affiliate_url: null, thumbnail: null })
      setThumbnailPreview('')
      return
    }
    const source = detectSource(trimmed)
    const affiliateUrl = toAffiliateUrl(trimmed, source)
    onUpdate(item.id, { booking_url: trimmed, affiliate_url: affiliateUrl })

    // Auto-fetch OG thumbnail if not already set
    if (!thumbnailPreview) {
      setOgLoading(true)
      try {
        const res = await fetch(`/api/trip/og?url=${encodeURIComponent(trimmed)}`)
        if (res.ok) {
          const og = await res.json()
          if (og.image) {
            setThumbnailPreview(og.image)
            onUpdate(item.id, { thumbnail: og.image })
          }
        }
      } catch { /* noop */ }
      setOgLoading(false)
    }
  }

  const detectedSource = bookingDraft.trim() ? detectSource(bookingDraft.trim()) : null
  const sourceLabel = detectedSource && detectedSource !== 'manual' ? SOURCE_LABEL[detectedSource] : null

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Duration */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-400 mb-2">停留時間</p>
        <div className="flex flex-wrap gap-1.5">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate(item.id, { duration: opt.value })}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={item.duration === opt.value
                ? { background: BRAND, color: '#fff', borderColor: BRAND }
                : { background: '#fff', color: '#64748b', borderColor: '#e2e8f0' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-400 mb-2">備註</p>
        <textarea
          value={item.notes ?? ''}
          onChange={(e) => onUpdate(item.id, { notes: e.target.value })}
          placeholder="開放時間、訂位資訊…"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-[#1f7a8c] transition-colors"
        />
      </div>

      {/* Booking URL */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-400 mb-2">訂購連結（選填）</p>
        <div className="relative">
          <input
            type="url"
            value={bookingDraft}
            onChange={(e) => setBookingDraft(e.target.value)}
            onBlur={handleBookingBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="貼上 Agoda / KKday / Klook / Trip.com 連結…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
            style={{ paddingRight: sourceLabel ? '80px' : '12px' }}
          />
          {(sourceLabel || ogLoading) && (
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1"
              style={{ background: BRAND_LIGHT, color: BRAND }}
            >
              {ogLoading
                ? <span className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin" />
                : sourceLabel}
            </span>
          )}
        </div>
        {bookingDraft.trim() && sourceLabel && (
          <p className="text-xs mt-1" style={{ color: BRAND }}>✓ 分享頁面將顯示「立即預訂」按鈕</p>
        )}
        {/* Thumbnail preview */}
        {thumbnailPreview && (
          <div className="mt-2 rounded-xl overflow-hidden relative" style={{ height: 72 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => { setThumbnailPreview(''); onUpdate(item.id, { thumbnail: null }) }}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
            >×</button>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-2">參考價格（選填）</p>
        <input
          type="text"
          value={priceDraft}
          onChange={(e) => setPriceDraft(e.target.value)}
          onBlur={() => onUpdate(item.id, { price: priceDraft.trim() || null })}
          placeholder="例：NT$1,200 / 從 $20"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { onDelete(item.id); onClose() }}
          className="text-xs font-medium px-3 py-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
        >
          🗑 刪除
        </button>
        <button
          onClick={onClose}
          className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: BRAND }}
        >
          完成 ✓
        </button>
      </div>
    </div>
  )
}

// ─── Mobile bottom sheet ──────────────────────────────────────────────────────

function EditSheet({
  item,
  onUpdate,
  onDelete,
  onClose,
}: {
  item: PlanItem
  onUpdate: (id: string, patch: EditPatch) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl px-5 pt-5 pb-8"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.1)', animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
        {/* Item name */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">{item.emoji}</span>
          <div>
            <p className="font-bold text-gray-900 leading-snug">{item.name}</p>
            <p className="text-xs font-bold" style={{ color: BRAND }}>{item.time}</p>
          </div>
        </div>
        <EditPanel item={item} onUpdate={onUpdate} onDelete={onDelete} onClose={onClose} />
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </div>
  )
}

// ─── PlanCard ─────────────────────────────────────────────────────────────────

function PlanCard({
  item,
  isLast,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  dragListeners,
  isDragging = false,
}: {
  item: PlanItem
  isLast: boolean
  isExpanded: boolean
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: EditPatch) => void
  onDelete: (id: string) => void
  dragListeners?: Record<string, unknown>
  isDragging?: boolean
}) {
  const cfg = TYPE_CFG[item.type]

  return (
    <div className="flex gap-3" style={{ opacity: isDragging ? 0.4 : 1 }}>
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20, paddingTop: 14 }}>
        <div
          className="w-3 h-3 rounded-full bg-white flex-shrink-0 transition-all duration-150"
          style={{
            border: `2px solid ${isExpanded ? BRAND : BRAND}`,
            boxShadow: isExpanded ? `0 0 0 5px ${BRAND}22` : `0 0 0 4px ${BRAND}1a`,
          }}
        />
        {!isLast && (
          <div className="w-px flex-1 bg-gray-200" style={{ marginTop: 4, minHeight: 44 }} />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 bg-white rounded-2xl border mb-4 overflow-hidden transition-all duration-150"
        style={{
          borderColor: isExpanded ? `${BRAND}55` : '#f1f5f9',
          boxShadow: isExpanded ? `0 2px 12px ${BRAND}18` : '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {/* ── Clickable header ── */}
        <div
          className="p-4 cursor-pointer select-none"
          onClick={() => onToggle(item.id)}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full transition-colors"
              style={{ background: BRAND_LIGHT, color: BRAND }}
            >
              {item.time}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300">{item.duration}分鐘</span>
              <DragHandle listeners={dragListeners} />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 leading-snug">{item.name}</p>
              {item.address && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">📍 {item.address}</p>
              )}
              {!isExpanded && item.notes && (
                <p className="text-xs text-gray-400 mt-1 truncate italic">{item.notes}</p>
              )}
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* ── Expandable edit section (desktop) ── */}
        <div
          className="hidden md:block overflow-hidden transition-all duration-200"
          style={{ maxHeight: isExpanded ? 300 : 0 }}
        >
          <div className="px-4 pb-4 border-t border-gray-50 pt-3">
            <EditPanel item={item} onUpdate={onUpdate} onDelete={onDelete} onClose={() => onToggle(item.id)} />
          </div>
        </div>

        {/* Map link (desktop, not expanded) */}
        {!isExpanded && item.lat && (
          <div className="hidden md:block px-4 pb-3 -mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`, '_blank') }}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ color: BRAND }}
              onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_LIGHT)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              🗺️ 地圖
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SortableCard ─────────────────────────────────────────────────────────────

function SortableCard(props: {
  item: PlanItem
  isLast: boolean
  isExpanded: boolean
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: EditPatch) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.item.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes}>
      <PlanCard {...props} dragListeners={listeners} isDragging={isDragging} />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PlanPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params?.id as string
  const isMock = !planId || planId === 'demo'

  const [plan, setPlan] = useState<Plan | null>(null)
  const [items, setItems] = useState<PlanItem[]>([])
  const [activeDay, setActiveDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [dragItem, setDragItem] = useState<PlanItem | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sheetItem, setSheetItem] = useState<PlanItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // per-item debounce refs: key = `${id}-duration` or `${id}-notes`
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Load data
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isMock) {
      setPlan({ id: 'demo', title: '釜山 Demo 行程', days: 3, items: [] })
      setItems(MOCK_ITEMS)
      setLoading(false)
      return
    }
    addRecentPlanId(planId)
    fetchPlan(planId).then(({ plan: p, items: it }) => {
      if (p) { setPlan(p); setTitleDraft(p.title); setItems(it) }
      else { setPlan({ id: planId, title: '未命名行程', days: 1, items: [] }) }
      setLoading(false)
    })
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [planId, isMock])

  const totalDays = plan?.days ?? Math.max(...items.map((i) => i.day), 1)
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)
  const dayItems = items.filter((i) => i.day === activeDay)

  // ── Toggle expand (desktop) / open sheet (mobile) ──────────────────────────
  const handleToggle = useCallback((id: string) => {
    if (isMobile) {
      const found = items.find((i) => i.id === id)
      if (found) setSheetItem(found)
    } else {
      setExpandedId((prev) => (prev === id ? null : id))
    }
  }, [isMobile, items])

  // ── Update any item field ─────────────────────────────────────────────────
  const handleUpdate = useCallback((id: string, patch: EditPatch) => {
    // null → undefined for state (PlanItem uses optional, not nullable)
    const statePatch = {
      ...patch,
      booking_url: patch.booking_url ?? undefined,
      affiliate_url: patch.affiliate_url ?? undefined,
      thumbnail: patch.thumbnail ?? undefined,
      price: patch.price ?? undefined,
    }
    setItems((prev) => {
      const day = prev.find((i) => i.id === id)?.day ?? activeDay
      const updated = prev.map((i) => i.id === id ? { ...i, ...statePatch } : i)
      if (patch.duration !== undefined) {
        const recalced = recalculateTimes(updated.filter((i) => i.day === day))
        return updated.map((i) => (i.day === day ? (recalced.find((r) => r.id === i.id) ?? i) : i))
      }
      return updated
    })

    // Also update sheetItem live if open
    if (sheetItem?.id === id) setSheetItem((prev) => prev ? { ...prev, ...statePatch } : prev)

    // Debounce save
    if (patch.booking_url !== undefined || patch.affiliate_url !== undefined) {
      const key = `${id}-booking`
      clearTimeout(debounceRefs.current[key])
      debounceRefs.current[key] = setTimeout(() => {
        if (!isMock) updatePlanItem(id, patch)
      }, 400)
    } else {
      const field = patch.duration !== undefined ? 'duration' : 'notes'
      const key = `${id}-${field}`
      clearTimeout(debounceRefs.current[key])
      debounceRefs.current[key] = setTimeout(() => {
        if (!isMock) updatePlanItem(id, patch)
      }, field === 'duration' ? 300 : 500)
    }
  }, [activeDay, isMock, sheetItem?.id])

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : prev))
    setItems((prev) => {
      const day = prev.find((i) => i.id === id)?.day ?? 1
      const next = prev.filter((i) => i.id !== id)
      const recalced = recalculateTimes(next.filter((i) => i.day === day))
      if (!isMock) { deletePlanItem(id); saveItemsOrder(recalced) }
      return next.map((i) => (i.day === day ? (recalced.find((r) => r.id === i.id) ?? i) : i))
    })
  }, [isMock])

  // ── Drag ──────────────────────────────────────────────────────────────────
  const scheduleSave = useCallback((updated: PlanItem[], day: number) => {
    if (isMock) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveItemsOrder(updated.filter((i) => i.day === day)), 600)
  }, [isMock])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setExpandedId(null)
    setDragItem(items.find((i) => i.id === event.active.id) ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDragItem(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const day = prev.find((i) => i.id === active.id)?.day ?? activeDay
      const dayArr = prev.filter((i) => i.day === day)
      const oldIdx = dayArr.findIndex((i) => i.id === active.id)
      const newIdx = dayArr.findIndex((i) => i.id === over.id)
      if (oldIdx === -1 || newIdx === -1) return prev
      const reordered = recalculateTimes(arrayMove(dayArr, oldIdx, newIdx))
      scheduleSave(reordered, day)
      return prev.map((i) => (i.day === day ? (reordered.find((r) => r.id === i.id) ?? i) : i))
    })
  }

  // ── Add item ─────────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (params: {
    day: number; name: string; type: ItemType
    address?: string; lat?: number; lng?: number; notes?: string; duration: number
  }) => {
    setShowSearch(false)
    const EMOJI: Record<ItemType, string> = { hotel: '🏨', attraction: '📍', food: '🍜', transport: '🚉', other: '📌' }
    const targetItems = items.filter((i) => i.day === params.day)
    const last = targetItems[targetItems.length - 1]
    const baseTime = last
      ? (() => { const [h, m] = last.time.split(':').map(Number); const t = h * 60 + m + last.duration + 30; return `${String(Math.floor(t / 60) % 24).padStart(2,'0')}:${String(t % 60).padStart(2,'0')}` })()
      : '09:00'

    const optimistic: PlanItem = {
      id: `tmp-${Date.now()}`, day: params.day, name: params.name, type: params.type,
      address: params.address, time: baseTime, duration: params.duration,
      notes: params.notes, emoji: EMOJI[params.type], lat: params.lat, lng: params.lng,
    }
    setItems((prev) => {
      const next = [...prev, optimistic]
      const recalced = recalculateTimes(next.filter((i) => i.day === params.day))
      return next.map((i) => (i.day === params.day ? (recalced.find((r) => r.id === i.id) ?? i) : i))
    })
    if (params.day !== activeDay) setActiveDay(params.day)

    if (!isMock && plan) {
      const saved = await addPlanItem({
        plan_id: plan.id, day: params.day, name: params.name, type: params.type,
        address: params.address, lat: params.lat, lng: params.lng,
        notes: params.notes, duration: params.duration,
        order_index: targetItems.length, start_time: baseTime,
      })
      if (saved) {
        setItems((prev) => {
          const replaced = prev.map((i) => (i.id === optimistic.id ? saved : i))
          const recalced = recalculateTimes(replaced.filter((i) => i.day === params.day))
          return replaced.map((i) => (i.day === params.day ? (recalced.find((r) => r.id === i.id) ?? i) : i))
        })
      }
    }
  }, [items, isMock, plan, activeDay])

  const handleAddDay = () => {
    if (!plan) return
    const nd = plan.days + 1
    setPlan((p) => p ? { ...p, days: nd } : p)
    if (!isMock) updatePlanDays(plan.id, nd)
    setActiveDay(nd)
  }

  const handleTitleSave = () => {
    setEditingTitle(false)
    if (!plan || !titleDraft.trim()) return
    setPlan((p) => p ? { ...p, title: titleDraft.trim() } : p)
    if (!isMock) updatePlanTitle(plan.id, titleDraft.trim())
  }

  const showToast = useCallback((msg: string, ok: boolean) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, ok })
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const handleDuplicate = useCallback(async () => {
    if (isMock) { showToast('Demo 模式無法複製', false); return }
    setDuplicating(true)
    const newId = await duplicatePlan(planId)
    setDuplicating(false)
    if (newId) {
      addRecentPlanId(newId)
      showToast('已建立副本，正在前往新行程…', true)
      setTimeout(() => router.push(`/tools/trip/${newId}`), 800)
    } else {
      showToast('複製失敗，請稍後再試', false)
    }
  }, [isMock, planId, router, showToast])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: BRAND }} />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>

      {/* ── Left panel ── */}
      <div className="flex flex-col w-full md:w-[520px] lg:w-[560px] h-screen flex-shrink-0">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2 flex-shrink-0" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Brand */}
          <a href="https://www.jiejourneys.com" className="flex items-center gap-2 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="旅杰" width={32} height={32} className="rounded-lg object-contain" />
            <span className="font-bold text-gray-900 text-xs hidden md:block">JieJourneys｜旅杰</span>
          </a>
          <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
          {/* Title */}
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <input
                autoFocus value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="font-bold text-gray-900 w-full outline-none border-b border-gray-300 focus:border-[#1f7a8c] bg-transparent leading-snug text-sm"
              />
            ) : (
              <p className="font-bold text-gray-900 truncate leading-snug cursor-pointer hover:text-[#1f7a8c] transition-colors text-sm" onClick={() => { setEditingTitle(true); setTitleDraft(plan?.title ?? '') }}>
                {plan?.title ?? '未命名行程'}
              </p>
            )}
            <p className="text-xs text-gray-400">{totalDays} 天 · {items.length} 個行程項目</p>
          </div>
          {/* Actions */}
          <a
            href="https://www.jiejourneys.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex-shrink-0 hidden md:block"
            style={{ color: BRAND, background: '#f0f9fb', borderColor: BRAND }}
          >
            回首頁
          </a>
          <Link href="/tools/trip" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 hidden sm:block">
            ← 上一頁
          </Link>
          {!isMock && (
            <>
              <button
                onClick={handleDuplicate}
                disabled={duplicating}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                {duplicating
                  ? <><span className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />複製中</>
                  : '📋 複製'}
              </button>
              <Link href={`/tools/trip/${planId}/share`} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0">
                🔗 分享
              </Link>
            </>
          )}
          <button onClick={() => setShowSearch(true)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ background: BRAND }}>
            ＋ 新增
          </button>
        </div>

        {/* Day tabs */}
        <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
          {days.map((day) => {
            const count = items.filter((i) => i.day === day).length
            const active = day === activeDay
            return (
              <button key={day} onClick={() => { setActiveDay(day); setExpandedId(null) }}
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
          <button onClick={handleAddDay} className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            ＋ 天數
          </button>
        </div>

        {/* Timeline */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-5 pb-28"
          onClick={() => setExpandedId(null)}
        >
          <p className="text-xs font-bold uppercase mb-5" style={{ color: BRAND, letterSpacing: '0.1em' }}>Day {activeDay}</p>

          {dayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <span className="text-4xl mb-3 opacity-30">🗺️</span>
              <p className="font-semibold text-gray-400">這天還沒有行程</p>
              <p className="text-sm mt-1 text-gray-300">點擊上方「＋ 新增」加入景點</p>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={dayItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  {dayItems.map((item, idx) => (
                    <SortableCard
                      key={item.id}
                      item={item}
                      isLast={idx === dayItems.length - 1}
                      isExpanded={expandedId === item.id}
                      onToggle={handleToggle}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
                <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
                  {dragItem && (
                    <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
                      <PlanCard
                        item={dragItem} isLast={false} isExpanded={false}
                        onToggle={() => {}} onUpdate={() => {}} onDelete={() => {}}
                      />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>

              <button
                onClick={() => setShowSearch(true)}
                className="w-full mt-1 py-3.5 border-2 border-dashed rounded-2xl text-sm font-medium transition-colors"
                style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8' }}
              >
                ＋ 新增景點 · 美食 · 住宿
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel: map ── */}
      <div className="hidden md:block flex-1 h-screen">
        <MapPanel items={dayItems} activeDay={activeDay} />
      </div>

      {/* Search modal */}
      {showSearch && (
        <SearchModal day={activeDay} totalDays={totalDays} onAdd={handleAdd} onClose={() => setShowSearch(false)} />
      )}

      {/* Mobile edit sheet */}
      {sheetItem && (
        <EditSheet
          item={sheetItem}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setSheetItem(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl pointer-events-none whitespace-nowrap"
          style={{ background: toast.ok ? '#0f766e' : '#dc2626', animation: 'fadeInUp 0.2s ease-out' }}
        >
          {toast.ok ? '✓ ' : '✕ '}{toast.msg}
        </div>
      )}
      <style>{`@keyframes fadeInUp { from { opacity:0; transform: translate(-50%, 8px) } to { opacity:1; transform: translate(-50%, 0) } }`}</style>
    </div>
  )
}
