'use client'

import { useEffect } from 'react'

const RECENT_KEY = 'bill_recent_book_ids_v1'

export default function RememberBook({ bookId }: { bookId: string }) {
  useEffect(() => {
    if (!bookId) return

    try {
      const raw = window.localStorage.getItem(RECENT_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : []

      const arr = Array.isArray(parsed) ? parsed : []
      const ids = arr.filter((x) => typeof x === 'string') as string[]

      const next = [bookId, ...ids.filter((id) => id !== bookId)].slice(0, 20)
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))

      // Notify home page to refresh without full reload.
      window.dispatchEvent(new CustomEvent('bill:recentBooksChanged'))
    } catch {
      // ignore localStorage errors (private mode / blocked storage)
    }
  }, [bookId])

  return null
}

