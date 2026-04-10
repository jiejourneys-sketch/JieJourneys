'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCents } from '@/lib/amount'

const LAST_SEEN_KEY = 'bill_change_log_last_seen_'

type ChangeLogRow = {
  id: string
  user_name: string
  action_type: string
  target: string
  amount_before: number | null
  amount_after: number | null
  created_at: string
}

function formatChangeRow(row: ChangeLogRow): string {
  const target = `「${row.target}」`
  if (row.action_type === 'add') {
    const amt = row.amount_after != null ? ` NT$${formatCents(row.amount_after)}` : ''
    return `${row.user_name} 新增${target}${amt}`
  }
  if (row.action_type === 'edit') {
    const before = row.amount_before != null ? formatCents(row.amount_before) : '?'
    const after = row.amount_after != null ? formatCents(row.amount_after) : '?'
    return `${row.user_name} 修改${target} NT$${before} → NT$${after}`
  }
  if (row.action_type === 'delete') {
    const amt = row.amount_before != null ? ` NT$${formatCents(row.amount_before)}` : ''
    return `${row.user_name} 刪除${target}${amt}`
  }
  return `${row.user_name} 變更${target}`
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) {
      return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
    }
    return d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return ''
  }
}

export default function ChangeLogBanner({
  bookId,
  onOpenModal
}: {
  bookId: string
  onOpenModal: () => void
}) {
  const [latest, setLatest] = useState<ChangeLogRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    const alive = true
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('change_logs')
        .select('id,user_name,action_type,target,amount_before,amount_after,created_at')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (!alive) return
      setLatest((data as ChangeLogRow) || null)
      if (data) {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY + bookId)
        setHasNew(!lastSeen || new Date((data as ChangeLogRow).created_at) > new Date(lastSeen))
      }
      setLoading(false)
    }
    fetchLatest()
    const onChanged = () => fetchLatest()
    window.addEventListener('bill:changeLogsChanged', onChanged)
    return () => window.removeEventListener('bill:changeLogsChanged', onChanged)
  }, [bookId])

  const handleView = () => {
    if (latest) {
      localStorage.setItem(LAST_SEEN_KEY + bookId, latest.created_at)
      setHasNew(false)
    }
    onOpenModal()
  }

  if (loading || !latest) return null

  return (
    <div
      style={{
        marginBottom: 12,
        padding: '12px 14px',
        background: hasNew ? '#f0f9ff' : '#f8fafc',
        borderRadius: 12,
        border: '1px solid #e2e8f0'
      }}
    >
      {hasNew && (
        <div style={{ fontSize: 12, color: '#0284c7', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span aria-hidden>🔔</span>
          有新變更
        </div>
      )}
      <div style={{ fontSize: 14, color: '#1e293b', marginBottom: 6 }}>
        此賬本已更新
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {formatChangeRow(latest)} · {formatTime(latest.created_at)}
      </div>
      <button
        type="button"
        onClick={handleView}
        style={{
          padding: '6px 12px',
          fontSize: 13,
          background: '#fff',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          color: '#475569',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        查看變更
      </button>
    </div>
  )
}
