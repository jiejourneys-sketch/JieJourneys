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
    return d.toLocaleString('zh-TW', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  } catch {
    return ''
  }
}

export default function ChangeLogModal({
  bookId,
  onClose
}: {
  bookId: string
  onClose: () => void
}) {
  const [items, setItems] = useState<ChangeLogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const alive = true
    const fetchItems = async () => {
      const { data } = await supabase
        .from('change_logs')
        .select('id,user_name,action_type,target,amount_before,amount_after,created_at')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (!alive) return
      setItems((data as ChangeLogRow[]) || [])
      setLoading(false)
      if (data && data.length > 0) {
        const latest = (data[0] as ChangeLogRow).created_at
        localStorage.setItem(LAST_SEEN_KEY + bookId, latest)
      }
    }
    fetchItems()
    const onChanged = () => fetchItems()
    window.addEventListener('bill:changeLogsChanged', onChanged)
    return () => window.removeEventListener('bill:changeLogsChanged', onChanged)
  }, [bookId])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-log-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          maxHeight: '70vh',
          background: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 20,
          overflowY: 'auto',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 id="change-log-title" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
            變更記錄
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '4px 8px',
              fontSize: 14,
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            關閉
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#94a3b8', fontSize: 14 }}>讀取中...</div>
        ) : items.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: 14 }}>尚無變更記錄</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((row) => (
              <li
                key={row.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: 14,
                  color: '#334155',
                  lineHeight: 1.5
                }}
              >
                <div>{formatChangeRow(row)}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{formatTime(row.created_at)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
