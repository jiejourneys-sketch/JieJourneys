'use client'

import BillLink from '@/app/tools/bill/components/BillLink'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCents } from '@/lib/amount'
import { computeMinTransactions, computeCentralizedSettlement } from '@/lib/settlement'

type SettlementMode = 'least' | 'simple'
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

export default function PlanDashboard({ bookId }: { bookId: string }) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showExplain, setShowExplain] = useState(false)
  const [settlementMode, setSettlementMode] = useState<SettlementMode>('least')

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

    const payersByExpense = new Map<string, PayerRow[]>()
    for (const p of payers) {
      const arr = payersByExpense.get(p.expense_id) || []
      arr.push(p)
      payersByExpense.set(p.expense_id, arr)
    }
    const splitsByExpense = new Map<string, SplitRow[]>()
    for (const s of splits) {
      const arr = splitsByExpense.get(s.expense_id) || []
      arr.push(s)
      splitsByExpense.set(s.expense_id, arr)
    }

    for (const e of expenses) {
      const pRows = payersByExpense.get(e.id) || []
      for (const p of pRows) {
        paidById.set(p.member_id, (paidById.get(p.member_id) || 0) + Number(p.amount || 0))
      }
      const sRows = splitsByExpense.get(e.id) || []
      if (sRows.length) {
        for (const s of sRows) {
          shareById.set(s.member_id, (shareById.get(s.member_id) || 0) + Number(s.amount || 0))
        }
      } else {
        const n = members.length
        if (n) {
          const base = Math.floor(Number(e.amount || 0) / n)
          const rem = Number(e.amount || 0) - base * n
          members.forEach((m, idx) => {
            shareById.set(m.id, (shareById.get(m.id) || 0) + base + (idx < rem ? 1 : 0))
          })
        }
      }
    }

    const rows = members.map((m) => {
      const paid = paidById.get(m.id) || 0
      const share = shareById.get(m.id) || 0
      const balance = Math.round(paid - share)
      return { id: m.id, name: m.name, paid, share, balance }
    })

    const settlements =
      settlementMode === 'simple'
        ? computeCentralizedSettlement(rows)
        : computeMinTransactions(rows)

    return { total, members: rows, settlements, byMemberId }
  }, [expenses, members, payers, splits, settlementMode])

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
              flexWrap: 'wrap'
            }}
          >
            <div style={{ fontWeight: 800, color: '#16324f' }}>結帳建議</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="settlement-mode-toggle">
                <button
                  type="button"
                  className={settlementMode === 'least' ? 'active' : ''}
                  onClick={() => setSettlementMode('least')}
                  title="轉帳次數最少"
                >
                  最少轉帳
                </button>
                <button
                  type="button"
                  className={settlementMode === 'simple' ? 'active' : ''}
                  onClick={() => setSettlementMode('simple')}
                  title="集中付給主要收款者"
                >
                  集中結算
                </button>
              </div>
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
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                共 {computed.settlements.length} 筆轉帳
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {computed.settlements.map((s, idx) => (
                <div
                  key={`${s.fromId}-${s.toId}-${idx}`}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                >
                  <div style={{ minWidth: 0, fontWeight: 700 }}>
                    {s.fromName} → {s.toName}
                  </div>
                  <div style={{ fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{formatCents(s.amount)}</div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>成員</div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>點名字看自己的消費明細</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {computed.members.map((m) => {
              const color = m.balance >= 0 ? '#dc2626' : '#059669'  /* 正值紅、負值綠 */
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
                      消費：{formatCents(m.share)}　已付：{formatCents(m.paid)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {m.balance >= 0 ? '+' : ''}
                    {formatCents(m.balance)}
                  </div>
                </BillLink>
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
                綠色＝還要付｜紅色＝會收回
                <br />
                轉帳建議：把「還要付」的人付給「會收回」的人，達到平衡
              </div>
              <div style={{ marginTop: 10, padding: 10, background: '#f8fafc', borderRadius: 10, fontSize: 13 }}>
                兩種模式下每個人的最終應付與應收差額皆相同且正確
              </div>

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {computed.members.map((m) => {
                  const color = m.balance >= 0 ? '#dc2626' : '#059669'  /* 正值紅、負值綠 */
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
                        費用 {formatCents(m.share)}｜已付 {formatCents(m.paid)}｜差額{' '}
                        <span style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
                          {m.balance >= 0 ? '+' : ''}
                          {formatCents(m.balance)}
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
                      <div style={{ fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{formatCents(s.amount)}</div>
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

