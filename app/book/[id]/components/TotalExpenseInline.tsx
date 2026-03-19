'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ExpenseRow = { amount: number }

export default function TotalExpenseInline({ bookId }: { bookId: string }) {
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true

    const fetchTotal = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('book_id', bookId)

      if (!alive) return
      if (error) {
        console.error(error)
        setTotal(0)
        setLoading(false)
        return
      }

      const rows = (data as ExpenseRow[]) || []
      setTotal(rows.reduce((s, r) => s + Number(r.amount || 0), 0))
      setLoading(false)
    }

    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      fetchTotal()
    }

    fetchTotal()
    window.addEventListener('bill:expenseAdded', onChanged)
    window.addEventListener('bill:expensesChanged', onChanged)
    return () => {
      alive = false
      window.removeEventListener('bill:expenseAdded', onChanged)
      window.removeEventListener('bill:expensesChanged', onChanged)
    }
  }, [bookId])

  const text = useMemo(() => {
    if (loading) return '總支出：…'
    return `總支出：${total}`
  }, [loading, total])

  return (
    <div style={{ color: '#64748b', fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  )
}

