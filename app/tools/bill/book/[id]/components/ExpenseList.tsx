'use client'

import { useEffect, useState, useMemo } from 'react'
import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import { formatWithCurrency } from '@/lib/amount'
import { convertCents, type ExchangeRates } from '@/lib/currency'

type MemberRow = { id: string; name: string }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type ExpenseRow = {
  id: string
  book_id: string
  amount: number
  currency?: string
  description: string
  occurred_at?: string
  created_at?: string
  note?: string | null
}

export default function ExpenseList({ bookId, baseCurrency, exchangeRates }: { bookId: string; baseCurrency: string; exchangeRates: ExchangeRates }) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)

    const [{ data: eData, error: eErr }, { data: mData, error: mErr }] =
      await Promise.all([
        supabase
          .from('expenses')
          .select('*')
          .eq('book_id', bookId)
          .order('created_at', { ascending: false }),
        supabase.from('members').select('*').eq('book_id', bookId)
      ])

    if (eErr || mErr) {
      console.error(eErr || mErr)
      setError('讀取支出失敗')
      setLoading(false)
      return
    }

    const nextExpenses = (eData as ExpenseRow[]) || []
    setExpenses(nextExpenses)
    setMembers((mData as MemberRow[]) || [])

    if (nextExpenses.length) {
      const ids = nextExpenses.map((e) => e.id)
      const { data: pData, error: pErr } = await supabase
        .from('expense_payers')
        .select('*')
        .in('expense_id', ids)
      if (pErr) {
        console.error(pErr)
        setPayers([])
      } else {
        setPayers((pData as PayerRow[]) || [])
      }
    } else {
      setPayers([])
    }
    setLoading(false)
  }

  useEffect(() => {
    let alive = true
    const run = async () => {
      await fetchAll()
    }
    run()

    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      if (!alive) return
      fetchAll()
    }
    window.addEventListener('bill:expensesChanged', onChanged)
    window.addEventListener('bill:membersChanged', onChanged)
    window.addEventListener('bill:expenseAdded', onChanged)
    return () => {
      alive = false
      window.removeEventListener('bill:expensesChanged', onChanged)
      window.removeEventListener('bill:membersChanged', onChanged)
      window.removeEventListener('bill:expenseAdded', onChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  const payerSummaryByExpenseId = useMemo(() => {
    const byMemberId = new Map(members.map((m) => [m.id, m.name] as const))
    const grouped = new Map<string, PayerRow[]>()
    for (const p of payers) {
      const arr = grouped.get(p.expense_id) || []
      arr.push(p)
      grouped.set(p.expense_id, arr)
    }
    const out = new Map<string, string>()
    for (const e of expenses) {
      const cur = e.currency || baseCurrency
      const rows = (grouped.get(e.id) || []).slice().sort((a, b) => b.amount - a.amount)
      if (rows.length === 0) {
        out.set(e.id, '未知')
        continue
      }
      if (rows.length === 1) {
        const r = rows[0]
        out.set(e.id, `${byMemberId.get(r.member_id) || '未知'} ${formatWithCurrency(r.amount, cur)}`)
      } else {
        const first = rows[0]
        const name = byMemberId.get(first.member_id) || '多人'
        out.set(e.id, `${name}等${rows.length}人`)
      }
    }
    return out
  }, [expenses, members, payers, baseCurrency])

  const expenseGroups = useMemo(() => {
    const groups = new Map<string, ExpenseRow[]>()
    const getKey = (e: ExpenseRow) => {
      const iso = e.occurred_at || e.created_at
      if (!iso) return '未知日期'
      const d = new Date(iso)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    for (const e of expenses) {
      const k = getKey(e)
      const arr = groups.get(k) || []
      arr.push(e)
      groups.set(k, arr)
    }
    return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [expenses])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 10
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#16324f' }}>
          支出
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <BillLink href={`/book/${bookId}/expenses/new`} className="pill-link" data-event="addnewbill">
            + 新增帳目
          </BillLink>
        </div>
      </div>

      {loading && <div className="empty-text">讀取中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-text">尚無支出</div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {expenseGroups.map(([day, list]) => (
            <div key={day}>
              <div style={{ color: '#64748b', fontWeight: 700, marginBottom: 8 }}>
                {day}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.map((e) => {
                  const cur = e.currency || baseCurrency
                  const converted = cur !== baseCurrency
                    ? convertCents(e.amount, cur, baseCurrency, baseCurrency, exchangeRates)
                    : null
                  return (
                    <BillLink
                      key={e.id}
                      className="member-item"
                      href={`/book/${bookId}/expenses/${e.id}/edit`}
                      style={{
                        background: '#fff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        marginTop: 0
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#16324f' }}>
                          {e.description}
                        </div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                          付款：{payerSummaryByExpenseId.get(e.id) || '未知'}
                        </div>
                        {e.note ? (
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                            {e.note}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 800 }}>
                          {formatWithCurrency(e.amount, cur)}
                        </div>
                        {converted !== null && !isNaN(converted) && (
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {formatWithCurrency(converted, baseCurrency)}
                          </div>
                        )}
                      </div>
                    </BillLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
