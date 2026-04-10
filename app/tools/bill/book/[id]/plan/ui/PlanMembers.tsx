'use client'

import BillLink from '@/app/tools/bill/components/BillLink'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCents } from '@/lib/amount'

type MemberRow = { id: string; name: string }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type SplitRow = { expense_id: string; member_id: string; amount: number }

export default function PlanMembers({
  bookId,
  members
}: {
  bookId: string
  members: MemberRow[]
}) {
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    const fetchData = async () => {
      setLoading(true)
      const { data: eData } = await supabase.from('expenses').select('id').eq('book_id', bookId)
      if (!alive) return
      const nextExpenses = (eData as { id: string }[]) || []
      const ids = nextExpenses.map((e) => e.id)

      if (!ids.length) {
        setPayers([])
        setSplits([])
        setLoading(false)
        return
      }

      const [{ data: pData }, { data: sData }] = await Promise.all([
        supabase.from('expense_payers').select('expense_id,member_id,amount').in('expense_id', ids),
        supabase.from('expense_splits').select('expense_id,member_id,amount').in('expense_id', ids)
      ])
      if (!alive) return
      setPayers((pData as PayerRow[]) || [])
      setSplits((sData as SplitRow[]) || [])
      setLoading(false)
    }

    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      fetchData()
    }

    fetchData()
    window.addEventListener('bill:expenseAdded', onChanged)
    window.addEventListener('bill:expensesChanged', onChanged)
    return () => {
      alive = false
      window.removeEventListener('bill:expenseAdded', onChanged)
      window.removeEventListener('bill:expensesChanged', onChanged)
    }
  }, [bookId])

  const summaryByMemberId = useMemo(() => {
    const paid = new Map<string, number>()
    const share = new Map<string, number>()
    for (const p of payers) paid.set(p.member_id, (paid.get(p.member_id) || 0) + Number(p.amount || 0))
    for (const s of splits) share.set(s.member_id, (share.get(s.member_id) || 0) + Number(s.amount || 0))
    return { paid, share }
  }, [payers, splits])

  return (
    <div>
      <div style={{ fontWeight: 800, color: '#16324f' }}>點選成員查看明細</div>
      <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
        {loading ? '計算中…' : `共 ${members.length} 位成員`}
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map((m) => {
          const paid = summaryByMemberId.paid.get(m.id) || 0
          const share = summaryByMemberId.share.get(m.id) || 0
          const balance = paid - share
          const color = balance >= 0 ? '#dc2626' : '#059669'  /* 正值紅、負值綠 */
          return (
            <BillLink
              key={m.id}
              href={`/book/${bookId}/plan/${m.id}`}
              className="member-item"
              style={{
                textDecoration: 'none',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.06)',
                marginTop: 0
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  費用：{formatCents(share)}　已付：{formatCents(paid)}
                </div>
              </div>
              <div style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {balance >= 0 ? '+' : ''}
                {formatCents(balance)}
              </div>
            </BillLink>
          )
        })}
      </div>
    </div>
  )
}

