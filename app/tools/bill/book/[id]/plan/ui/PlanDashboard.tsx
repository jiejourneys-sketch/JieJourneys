'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type MemberRow = { id: string; name: string }
type ExpenseRow = {
  id: string
  amount: number
  description: string
  occurred_at?: string
  created_at?: string
}
type PayerRow = { expense_id: string; member_id: string; amount: number }
type SplitRow = { expense_id: string; member_id: string; amount: number }

type SettlementRow = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

export default function PlanDashboard({ bookId }: { bookId: string }) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showExplain, setShowExplain] = useState(false)

  useEffect(() => {
    let alive = true
    const fetchData = async () => {
      setError(null)

      const [{ data: mData, error: mErr }, { data: eData, error: eErr }] = await Promise.all([
        supabase
          .from('members')
          .select('id,name')
          .eq('book_id', bookId)
          .order('created_at', { ascending: true }),
        supabase
          .from('expenses')
          .select('id,amount,description,occurred_at,created_at')
          .eq('book_id', bookId)
          .order('created_at', { ascending: false })
      ])

      if (!alive) return
      if (mErr || eErr) {
        console.error(mErr || eErr)
        setError('讀取資料失敗')
        return
      }

      const nextMembers = (mData as MemberRow[]) || []
      const nextExpenses = (eData as ExpenseRow[]) || []
      setMembers(nextMembers)
      setExpenses(nextExpenses)

      if (!nextExpenses.length) {
        setPayers([])
        setSplits([])
        return
      }

      const ids = nextExpenses.map((e) => e.id)
      const [{ data: pData, error: pErr }, { data: sData, error: sErr }] = await Promise.all([
        supabase.from('expense_payers').select('expense_id,member_id,amount').in('expense_id', ids),
        supabase.from('expense_splits').select('expense_id,member_id,amount').in('expense_id', ids)
      ])
      if (!alive) return
      if (pErr) console.error(pErr)
      if (sErr) console.error(sErr)
      setPayers((pData as PayerRow[]) || [])
      setSplits((sData as SplitRow[]) || [])
    }

    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      fetchData()
    }

    fetchData()
    window.addEventListener('bill:expenseAdded', onChanged)
    window.addEventListener('bill:expensesChanged', onChanged)
    window.addEventListener('bill:membersChanged', onChanged)
    return () => {
      alive = false
      window.removeEventListener('bill:expenseAdded', onChanged)
      window.removeEventListener('bill:expensesChanged', onChanged)
      window.removeEventListener('bill:membersChanged', onChanged)
    }
  }, [bookId])

  const computed = useMemo(() => {
    const byMemberId = new Map(members.map((m) => [m.id, m.name] as const))

    const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)

    const paidById = new Map<string, number>()
    const shareById = new Map<string, number>()
    for (const p of payers) {
      paidById.set(p.member_id, (paidById.get(p.member_id) || 0) + Number(p.amount || 0))
    }
    for (const s of splits) {
      shareById.set(s.member_id, (shareById.get(s.member_id) || 0) + Number(s.amount || 0))
    }

    const rows = members.map((m) => {
      const paid = paidById.get(m.id) || 0
      const share = shareById.get(m.id) || 0
      const balance = paid - share
      return { id: m.id, name: m.name, paid, share, balance }
    })

    const creditors = rows
      .filter((r) => r.balance > 0)
      .map((r) => ({ ...r }))
      .sort((a, b) => b.balance - a.balance)
    const debtors = rows
      .filter((r) => r.balance < 0)
      .map((r) => ({ ...r, balance: -r.balance }))
      .sort((a, b) => b.balance - a.balance)

    const settlements: SettlementRow[] = []
    let i = 0
    let j = 0
    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i]
      const c = creditors[j]
      const amount = Math.min(d.balance, c.balance)
      if (amount > 0) {
        settlements.push({
          fromId: d.id,
          fromName: d.name,
          toId: c.id,
          toName: c.name,
          amount
        })
      }
      d.balance -= amount
      c.balance -= amount
      if (d.balance === 0) i++
      if (c.balance === 0) j++
    }

    return { total, members: rows, settlements, byMemberId }
  }, [expenses, members, payers, splits])

  return (
    <div>
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6
            }}
          >
            <div style={{ fontWeight: 800, color: '#16324f' }}>結帳建議</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="pill-link"
                style={{ border: 'none', cursor: 'pointer' }}
                type="button"
                onClick={() => setShowExplain(true)}
                data-event="howtocalculate"
              >
                怎麼算
              </button>
            </div>
          </div>
          {computed.settlements.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13 }}>已結清</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {computed.settlements.map((s, idx) => (
                <div
                  key={`${s.fromId}-${s.toId}-${idx}`}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                >
                  <div style={{ minWidth: 0, fontWeight: 700 }}>
                    {s.fromName} → {s.toName}
                  </div>
                  <div style={{ fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{s.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>成員</div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>點名字看自己的消費明細</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {computed.members.map((m) => {
              const color = m.balance >= 0 ? '#059669' : '#dc2626'
              return (
                <Link
                  key={m.id}
                  href={`/tools/bill/book/${bookId}/plan/${m.id}`}
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
                      消費：{m.share}　已付：{m.paid}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {m.balance >= 0 ? '+' : ''}
                    {m.balance}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {showExplain ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowExplain(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">結帳怎麼算</div>
              <button className="modal-close" onClick={() => setShowExplain(false)}>
                關閉
              </button>
            </div>
            <div className="modal-body">
              <div style={{ color: '#64748b', fontSize: 13 }}>
                紅色＝還要付｜綠色＝會收回
                <br />
                轉帳建議：把「還要付」的人付給「會收回」的人，大家就打平
              </div>

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {computed.members.map((m) => {
                  const color = m.balance >= 0 ? '#059669' : '#dc2626'
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 12
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13, textAlign: 'right' }}>
                        費用 {m.share}｜已付 {m.paid}｜差額{' '}
                        <span style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
                          {m.balance >= 0 ? '+' : ''}
                          {m.balance}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 14, fontWeight: 800, color: '#16324f' }}>轉帳建議</div>
              {computed.settlements.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>已結清，不需要轉帳。</div>
              ) : (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {computed.settlements.map((s, idx) => (
                    <div
                      key={`ex-${s.fromId}-${s.toId}-${idx}`}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                    >
                      <div style={{ fontWeight: 700 }}>
                        {s.fromName} → {s.toName}
                      </div>
                      <div style={{ fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{s.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="pill-link"
                style={{ border: 'none', cursor: 'pointer' }}
                type="button"
                onClick={() => setShowExplain(false)}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  )
}
