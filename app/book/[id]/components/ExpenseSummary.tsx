'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type MemberRow = { id: string; name: string }
type ExpenseRow = {
  id: string
  amount: number
  description: string
}
type SplitRow = { expense_id: string; member_id: string; amount: number }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type BalanceRow = { id: string; name: string; paid: number; share: number; balance: number }
type SettlementRow = { fromId: string; fromName: string; toId: string; toName: string; amount: number }

export default function ExpenseSummary({
  bookId,
  showPlanButton = true,
  showSettlements = true,
  showPerPersonCost = false
}: {
  bookId: string
  showPlanButton?: boolean
  showSettlements?: boolean
  showPerPersonCost?: boolean
}) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const [{ data: eData, error: eErr }, { data: mData, error: mErr }] =
        await Promise.all([
          supabase.from('expenses').select('*').eq('book_id', bookId),
          supabase.from('members').select('*').eq('book_id', bookId)
        ])

      if (!alive) return
      if (eErr || mErr) {
        console.error(eErr || mErr)
        setError('讀取資料失敗')
        setLoading(false)
        return
      }

      const nextExpenses = (eData as ExpenseRow[]) || []
      setExpenses(nextExpenses)
      setMembers((mData as MemberRow[]) || [])

      if (nextExpenses.length) {
        const ids = nextExpenses.map((e) => e.id)
        const { data: sData, error: sErr } = await supabase
          .from('expense_splits')
          .select('*')
          .in('expense_id', ids)
        if (!alive) return
        if (sErr) {
          console.error(sErr)
          setSplits([])
        } else {
          setSplits((sData as SplitRow[]) || [])
        }

        const { data: pData, error: pErr } = await supabase
          .from('expense_payers')
          .select('*')
          .in('expense_id', ids)
        if (!alive) return
        if (pErr) {
          console.error(pErr)
          setPayers([])
        } else {
          setPayers((pData as PayerRow[]) || [])
        }
      } else {
        setSplits([])
        setPayers([])
      }
      setLoading(false)
    }

    const onExpenseAdded = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      fetchData()
    }

    fetchData()
    window.addEventListener('bill:expenseAdded', onExpenseAdded)
    window.addEventListener('bill:expensesChanged', onExpenseAdded)
    return () => {
      alive = false
      window.removeEventListener('bill:expenseAdded', onExpenseAdded)
      window.removeEventListener('bill:expensesChanged', onExpenseAdded)
    }
  }, [bookId])

  const compute = (): { total: number; balances: BalanceRow[]; settlements: SettlementRow[] } => {
    if (!members.length) {
      return { total: 0, balances: [], settlements: [] }
    }

    const membersStable = [...members].sort((a, b) => a.id.localeCompare(b.id))
    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
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
      if (pRows.length) {
        for (const p of pRows) {
          paidById.set(
            p.member_id,
            (paidById.get(p.member_id) || 0) + Number(p.amount || 0)
          )
        }
      }

      const sRows = splitsByExpense.get(e.id) || []
      if (sRows.length) {
        for (const s of sRows) {
          shareById.set(s.member_id, (shareById.get(s.member_id) || 0) + Number(s.amount || 0))
        }
      } else {
        // legacy: no splits stored -> assume all members equal
        const n = membersStable.length
        const base = Math.floor(Number(e.amount || 0) / n)
        const rem = Number(e.amount || 0) - base * n
        membersStable.forEach((m, idx) => {
          shareById.set(m.id, (shareById.get(m.id) || 0) + base + (idx < rem ? 1 : 0))
        })
      }
    }

    const balances: BalanceRow[] = membersStable.map((m) => {
      const paid = paidById.get(m.id) || 0
      const share = shareById.get(m.id) || 0
      return { id: m.id, name: m.name, paid, share, balance: paid - share }
    })

    const creditors = balances
      .filter((b) => b.balance > 0)
      .map((b) => ({ ...b }))
      .sort((a, b) => b.balance - a.balance)
    const debtors = balances
      .filter((b) => b.balance < 0)
      .map((b) => ({ ...b, balance: -b.balance }))
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

    return {
      total,
      balances,
      settlements
    }
  }

  const { total, balances, settlements } = compute()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#16324f' }}>
          每人餘額
        </h3>
        {showPlanButton ? (
          <Link href={`/book/${bookId}/plan`} className="pill-link" data-event="billdetail">
            費用明細
          </Link>
        ) : null}
      </div>

      {loading && <div>讀取中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <div>尚無成員或支出</div>
          ) : (
            <div style={{ marginTop: 12 }}>
              {showPerPersonCost ? (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>每人費用</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {balances.map((b) => (
                      <div
                        key={b.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12,
                          padding: '4px 0'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.name}</div>
                        <div style={{ fontWeight: 900, color: '#16324f', fontVariantNumeric: 'tabular-nums' }}>
                          {b.share}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {balances.map((b) => {
                    const positive = b.balance >= 0
                    const color = positive ? '#059669' : '#dc2626'
                    return (
                      <div
                        key={b.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12,
                          padding: '4px 0'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{b.name}</div>
                        <div style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
                          {positive ? '+' : ''}
                          {b.balance}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {showSettlements ? (
                  <>
                    <div style={{ fontWeight: 800, marginBottom: 6, color: '#16324f' }}>轉帳建議</div>
                    {settlements.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: 13 }}>已結清</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {settlements.map((s, idx) => (
                          <div
                            key={`${s.fromId}-${s.toId}-${idx}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 12,
                              padding: '4px 0'
                            }}
                          >
                            <div style={{ color: '#0f172a', fontWeight: 700, minWidth: 0 }}>
                              <span style={{ fontWeight: 900 }}>{s.fromName}</span>
                              <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                              <span style={{ fontWeight: 900 }}>{s.toName}</span>
                            </div>
                            <div
                              style={{
                                fontWeight: 900,
                                color: '#16324f',
                                fontVariantNumeric: 'tabular-nums'
                              }}
                            >
                              {s.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}