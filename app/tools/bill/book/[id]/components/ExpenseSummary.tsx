'use client'

import { useEffect, useState } from 'react'
import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import { formatWithCurrency } from '@/lib/amount'
import { convertCents, type ExchangeRates } from '@/lib/currency'
import { computeMinTransactions, computeCentralizedSettlement } from '@/lib/settlement'

type SettlementMode = 'least' | 'simple'
type MemberRow = { id: string; name: string; created_at?: string }
type ExpenseRow = { id: string; amount: number; description: string; currency?: string }
type SplitRow = { expense_id: string; member_id: string; amount: number }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type BalanceRow = { id: string; name: string; paid: number; share: number; balance: number }
type SettlementRow = { fromId: string; fromName: string; toId: string; toName: string; amount: number }

export default function ExpenseSummary({
  bookId,
  showPlanButton = true,
  showSettlements = true,
  showPerPersonCost = false,
  baseCurrency,
  exchangeRates
}: {
  bookId: string
  showPlanButton?: boolean
  showSettlements?: boolean
  showPerPersonCost?: boolean
  baseCurrency: string
  exchangeRates: ExchangeRates
}) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settlementMode, setSettlementMode] = useState<SettlementMode>('least')

  useEffect(() => {
    let alive = true
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const [{ data: eData, error: eErr }, { data: mData, error: mErr }] =
        await Promise.all([
          supabase.from('expenses').select('id,amount,description,currency').eq('book_id', bookId),
          supabase.from('members').select('*').eq('book_id', bookId).order('created_at', { ascending: true })
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
          .from('expense_splits').select('expense_id,member_id,amount').in('expense_id', ids)
        if (!alive) return
        if (sErr) { console.error(sErr); setSplits([]) }
        else setSplits((sData as SplitRow[]) || [])

        const { data: pData, error: pErr } = await supabase
          .from('expense_payers').select('expense_id,member_id,amount').in('expense_id', ids)
        if (!alive) return
        if (pErr) { console.error(pErr); setPayers([]) }
        else setPayers((pData as PayerRow[]) || [])
      } else {
        setSplits([])
        setPayers([])
      }
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

  const compute = (mode: SettlementMode): { balances: BalanceRow[]; settlements: SettlementRow[] } => {
    if (!members.length) return { balances: [], settlements: [] }

    const membersStable = [...members].sort((a, b) => (a.created_at || a.id).localeCompare(b.created_at || b.id))
    const expCurrencyMap = new Map(expenses.map((e) => [e.id, e.currency || baseCurrency]))

    const convert = (cents: number, expenseId: string) =>
      convertCents(cents, expCurrencyMap.get(expenseId) || baseCurrency, baseCurrency, baseCurrency, exchangeRates)

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
        const converted = convert(Number(p.amount || 0), e.id)
        if (!isNaN(converted)) {
          paidById.set(p.member_id, (paidById.get(p.member_id) || 0) + converted)
        }
      }

      const sRows = splitsByExpense.get(e.id) || []
      if (sRows.length) {
        for (const s of sRows) {
          const converted = convert(Number(s.amount || 0), e.id)
          if (!isNaN(converted)) {
            shareById.set(s.member_id, (shareById.get(s.member_id) || 0) + converted)
          }
        }
      } else {
        const expCents = convert(Number(e.amount || 0), e.id)
        if (!isNaN(expCents)) {
          const n = membersStable.length
          const base = Math.floor(expCents / n)
          const rem = expCents - base * n
          membersStable.forEach((m, idx) => {
            shareById.set(m.id, (shareById.get(m.id) || 0) + base + (idx < rem ? 1 : 0))
          })
        }
      }
    }

    const balances: BalanceRow[] = membersStable.map((m) => {
      const paid = paidById.get(m.id) || 0
      const share = shareById.get(m.id) || 0
      const balance = Math.round(paid - share)
      return { id: m.id, name: m.name, paid, share, balance }
    })

    const settlements =
      mode === 'simple'
        ? computeCentralizedSettlement(balances)
        : computeMinTransactions(balances)

    return { balances, settlements }
  }

  const { balances, settlements } = compute(settlementMode)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#16324f' }}>
          每人餘額
        </h3>
        {showPlanButton ? (
          <BillLink href={`/book/${bookId}/plan`} className="pill-link" data-event="billdetail">
            費用明細
          </BillLink>
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
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '4px 0' }}
                      >
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.name}</div>
                        <div style={{ fontWeight: 900, color: '#16324f', fontVariantNumeric: 'tabular-nums' }}>
                          {formatWithCurrency(b.share, baseCurrency)}
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
                    const color = positive ? '#dc2626' : '#059669'
                    return (
                      <div
                        key={b.id}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '4px 0' }}
                      >
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{b.name}</div>
                        <div style={{ fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
                          {positive ? '+' : ''}
                          {formatWithCurrency(b.balance, baseCurrency)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {showSettlements ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontWeight: 800, color: '#16324f' }}>轉帳建議</div>
                      <div className="settlement-mode-toggle">
                        <button type="button" className={settlementMode === 'least' ? 'active' : ''} onClick={() => setSettlementMode('least')} title="轉帳次數最少">
                          最少轉帳
                        </button>
                        <button type="button" className={settlementMode === 'simple' ? 'active' : ''} onClick={() => setSettlementMode('simple')} title="集中付給主要收款者">
                          集中結算
                        </button>
                      </div>
                    </div>
                    {settlements.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: 13 }}>已結清</div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>共 {settlements.length} 筆轉帳</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {settlements.map((s, idx) => (
                            <div
                              key={`${s.fromId}-${s.toId}-${idx}`}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '4px 0' }}
                            >
                              <div style={{ color: '#0f172a', fontWeight: 700, minWidth: 0 }}>
                                <span style={{ fontWeight: 900 }}>{s.fromName}</span>
                                <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                                <span style={{ fontWeight: 900 }}>{s.toName}</span>
                              </div>
                              <div style={{ fontWeight: 900, color: '#16324f', fontVariantNumeric: 'tabular-nums' }}>
                                {formatWithCurrency(s.amount, baseCurrency)}
                              </div>
                            </div>
                          ))}
                        </div>
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
