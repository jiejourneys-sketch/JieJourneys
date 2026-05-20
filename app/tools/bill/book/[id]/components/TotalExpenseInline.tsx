'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatWithCurrency } from '@/lib/amount'
import { convertCents, type ExchangeRates } from '@/lib/currency'
import { useBillBookDataContext } from './BillBookDataProvider'

type ExpenseRow = { amount: number; currency?: string }

export default function TotalExpenseInline({
  bookId,
  baseCurrency,
  exchangeRates
}: {
  bookId: string
  baseCurrency: string
  exchangeRates: ExchangeRates
}) {
  const shared = useBillBookDataContext()
  const [localExpenses, setLocalExpenses] = useState<ExpenseRow[]>([])
  const [localLoading, setLocalLoading] = useState(false)
  const expenses = shared?.bookId === bookId ? shared.expenses : localExpenses
  const loading = shared?.bookId === bookId ? shared.loading : localLoading

  useEffect(() => {
    if (shared?.bookId === bookId) return
    let alive = true

    const fetchData = async () => {
      setLocalLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('amount,currency')
        .eq('book_id', bookId)

      if (!alive) return
      if (error) { console.error(error); setLocalExpenses([]); setLocalLoading(false); return }
      setLocalExpenses((data as ExpenseRow[]) || [])
      setLocalLoading(false)
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
  }, [bookId, shared])

  const text = useMemo(() => {
    if (loading) return '總支出：…'
    if (!expenses.length) return `總支出：${formatWithCurrency(0, baseCurrency)}`

    let convertedTotal = 0
    let hasUnconverted = false

    for (const e of expenses) {
      const cur = e.currency || baseCurrency
      const cents = Number(e.amount || 0)
      if (cur === baseCurrency) {
        convertedTotal += cents
      } else {
        const converted = convertCents(cents, cur, baseCurrency, baseCurrency, exchangeRates)
        if (isNaN(converted)) {
          hasUnconverted = true
        } else {
          convertedTotal += converted
        }
      }
    }

    const suffix = hasUnconverted ? '（部分未換算）' : ''
    return `總支出：${formatWithCurrency(convertedTotal, baseCurrency)}${suffix}`
  }, [loading, expenses, baseCurrency, exchangeRates])

  return (
    <div style={{ color: '#64748b', fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  )
}
