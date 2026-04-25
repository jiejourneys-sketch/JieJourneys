'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BRAND, BRAND_LIGHT } from './lib/types'
import type { Plan } from './lib/types'
import {
  getRecentPlanIds,
  fetchRecentPlans,
  createPlan,
  deletePlan,
  duplicatePlan,
  addRecentPlanId,
  removeRecentPlanId,
} from './lib/storage'

const DEST_EMOJI: Record<string, string> = {
  日本: '🇯🇵', 東京: '🇯🇵', 大阪: '🇯🇵', 京都: '🇯🇵', 北海道: '🇯🇵',
  韓國: '🇰🇷', 首爾: '🇰🇷', 釜山: '🇰🇷',
  泰國: '🇹🇭', 曼谷: '🇹🇭', 清邁: '🇹🇭',
  越南: '🇻🇳', 峇里: '🇮🇩', 新加坡: '🇸🇬', 香港: '🇭🇰',
  歐洲: '🌍', 美國: '🇺🇸', 台灣: '🇹🇼',
}

function getPlanEmoji(plan: Plan): string {
  const haystack = `${plan.destination ?? ''} ${plan.title}`
  for (const [key, emoji] of Object.entries(DEST_EMOJI)) {
    if (haystack.includes(key)) return emoji
  }
  return '🗺️'
}

export default function PlanListPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDest, setNewDest] = useState('')
  const [creating, setCreating] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const ids = getRecentPlanIds()
    if (ids.length === 0) { setLoading(false); return }
    const data = await fetchRecentPlans(ids)
    setPlans(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!menuId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const close = () => setMenuId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuId])

  const handleCreate = async () => {
    setCreating(true)
    const title = newTitle.trim() || (newDest.trim() ? `${newDest.trim()}行程` : '未命名行程')
    const id = await createPlan(title)
    if (id) {
      addRecentPlanId(id)
      router.push(`/tools/trip/${id}`)
    } else {
      setCreating(false)
      router.push('/tools/trip/demo')
    }
  }

  const handleDuplicate = async (planId: string) => {
    setMenuId(null)
    setDuplicatingId(planId)
    const newId = await duplicatePlan(planId)
    if (newId) {
      addRecentPlanId(newId)
      router.push(`/tools/trip/${newId}`)
    } else {
      setDuplicatingId(null)
      alert('複製失敗，請稍後再試')
    }
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('確定要刪除這個行程嗎？')) return
    await deletePlan(planId)
    removeRecentPlanId(planId)
    setPlans((prev) => prev.filter((p) => p.id !== planId))
    setMenuId(null)
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="https://www.jiejourneys.com" className="flex items-center gap-2 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="旅杰" width={34} height={34} className="rounded-lg object-contain" />
            <span className="font-bold text-gray-900 text-sm">JieJourneys｜旅杰</span>
          </a>
          <div className="flex-1" />
          <a
            href="https://www.jiejourneys.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all flex-shrink-0"
            style={{ color: BRAND, background: '#f0f9fb', borderColor: BRAND }}
          >
            回首頁
          </a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">我的行程</h1>
        <p className="text-sm text-gray-400 mb-8">拖曳排序、地圖預覽、自動算時間 ✈️</p>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div className="animate-pulse">
                  <div className="h-28 bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-5 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-6xl mb-4 opacity-30">🗺️</span>
            <p className="text-lg font-bold text-gray-400 mb-2">還沒有行程</p>
            <p className="text-sm text-gray-300 mb-6">建立第一個行程，把想去的地方都排進來吧！</p>
            <button
              onClick={() => setShowCreate(true)}
              className="text-sm font-bold px-6 py-3 rounded-2xl text-white transition-opacity hover:opacity-90"
              style={{ background: BRAND }}
            >
              ＋ 建立行程
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="relative group">
                <Link
                  href={`/tools/trip/${plan.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', pointerEvents: duplicatingId === plan.id ? 'none' : undefined }}
                >
                  {/* Cover */}
                  <div
                    className="h-28 flex items-center justify-center relative"
                    style={{ background: `linear-gradient(135deg, ${BRAND}22, ${BRAND}11)` }}
                  >
                    <span className="text-4xl">{getPlanEmoji(plan)}</span>
                    {/* Duplicating overlay */}
                    {duplicatingId === plan.id && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-t-2xl" style={{ background: 'rgba(255,255,255,0.85)' }}>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-[#1f7a8c] animate-spin" />
                          <p className="text-xs font-semibold" style={{ color: BRAND }}>複製中…</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Body */}
                  <div className="p-4">
                    {plan.destination && (
                      <p className="text-xs font-semibold mb-1" style={{ color: BRAND }}>{plan.destination}</p>
                    )}
                    <p className="font-bold text-gray-900 leading-snug mb-2 truncate">{plan.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: BRAND_LIGHT, color: BRAND }}>
                        {plan.days} 天
                      </span>
                      <span>拖曳行程規劃</span>
                    </div>
                  </div>
                </Link>

                {/* Menu button */}
                <button
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-white transition-all flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMenuId(menuId === plan.id ? null : plan.id)
                  }}
                >
                  ···
                </button>
                {menuId === plan.id && (
                  <div
                    className="absolute top-10 right-3 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden"
                    style={{ minWidth: 140 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/tools/trip/${plan.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ✏️ 編輯
                    </Link>
                    <Link
                      href={`/tools/trip/${plan.id}/share`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      🔗 分享
                    </Link>
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      onClick={() => handleDuplicate(plan.id)}
                    >
                      📋 複製行程
                    </button>
                    <div className="h-px bg-gray-100 mx-3" />
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                      onClick={() => handleDelete(plan.id)}
                    >
                      🗑 刪除
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add tile */}
            <button
              onClick={() => setShowCreate(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 h-full min-h-[180px] text-gray-400 hover:text-[#1f7a8c] hover:border-[#1f7a8c] transition-all font-medium text-sm"
            >
              <span className="text-3xl">＋</span>
              <span>新行程</span>
            </button>
          </div>
        )}
      </main>

      {/* ── Create modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-gray-900 text-lg mb-5">建立新行程</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">目的地</label>
                <input
                  autoFocus
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="東京、大阪、釜山…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">行程名稱（選填）</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="例：2025 春櫻京都 5 天"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1f7a8c] transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: BRAND }}
              >
                {creating ? '建立中…' : '建立 →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
