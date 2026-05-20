'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export type BillMemberRow = { id: string; name: string; created_at?: string; is_active?: boolean | null }
export type BillExpenseRow = {
  id: string
  book_id: string
  amount: number
  currency?: string
  description: string
  occurred_at?: string
  created_at?: string
  note?: string | null
}
export type BillPayerRow = { expense_id: string; member_id: string; amount: number }
export type BillSplitRow = { expense_id: string; member_id: string; amount: number }

type BillBookData = {
  bookId: string
  expenses: BillExpenseRow[]
  members: BillMemberRow[]
  payers: BillPayerRow[]
  splits: BillSplitRow[]
  loading: boolean
  error: string | null
  refresh: () => void
}

const BillBookDataContext = createContext<BillBookData | null>(null)

export function useBillBookDataContext() {
  return useContext(BillBookDataContext)
}

export default function BillBookDataProvider({
  bookId,
  children
}: {
  bookId: string
  children: ReactNode
}) {
  const [expenses, setExpenses] = useState<BillExpenseRow[]>([])
  const [members, setMembers] = useState<BillMemberRow[]>([])
  const [payers, setPayers] = useState<BillPayerRow[]>([])
  const [splits, setSplits] = useState<BillSplitRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const refresh = () => setRefreshToken((value) => value + 1)

  useEffect(() => {
    let alive = true

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const [{ data: eData, error: eErr }, { data: mData, error: mErr }] = await Promise.all([
        supabase
          .from('expenses')
          .select('id,book_id,amount,currency,description,occurred_at,created_at,note')
          .eq('book_id', bookId)
          .order('created_at', { ascending: false }),
        supabase
          .from('members')
          .select('id,name,created_at,is_active')
          .eq('book_id', bookId)
          .order('created_at', { ascending: true })
      ])

      if (!alive) return
      if (eErr || mErr) {
        console.error(eErr || mErr)
        setError('讀取帳本資料失敗')
        setLoading(false)
        return
      }

      const nextExpenses = (eData as BillExpenseRow[]) || []
      setExpenses(nextExpenses)
      setMembers((mData as BillMemberRow[]) || [])

      if (!nextExpenses.length) {
        setPayers([])
        setSplits([])
        setLoading(false)
        return
      }

      const expenseIds = nextExpenses.map((expense) => expense.id)
      const [{ data: pData, error: pErr }, { data: sData, error: sErr }] = await Promise.all([
        supabase.from('expense_payers').select('expense_id,member_id,amount').in('expense_id', expenseIds),
        supabase.from('expense_splits').select('expense_id,member_id,amount').in('expense_id', expenseIds)
      ])

      if (!alive) return
      if (pErr || sErr) {
        console.error(pErr || sErr)
        setError('讀取分帳明細失敗')
        setLoading(false)
        return
      }

      setPayers((pData as BillPayerRow[]) || [])
      setSplits((sData as BillSplitRow[]) || [])
      setLoading(false)
    }

    fetchData()

    return () => {
      alive = false
    }
  }, [bookId, refreshToken])

  useEffect(() => {
    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      refresh()
    }

    window.addEventListener('bill:expenseAdded', onChanged)
    window.addEventListener('bill:expensesChanged', onChanged)
    window.addEventListener('bill:membersChanged', onChanged)
    return () => {
      window.removeEventListener('bill:expenseAdded', onChanged)
      window.removeEventListener('bill:expensesChanged', onChanged)
      window.removeEventListener('bill:membersChanged', onChanged)
    }
  }, [bookId])

  const value = useMemo(
    () => ({ bookId, expenses, members, payers, splits, loading, error, refresh }),
    [bookId, expenses, members, payers, splits, loading, error]
  )

  return <BillBookDataContext.Provider value={value}>{children}</BillBookDataContext.Provider>
}
