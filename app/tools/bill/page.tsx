'use client'

import BillLink from '@/app/tools/bill/components/BillLink'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BookRow = { id: string; name: string }

const RECENT_KEY = 'bill_recent_book_ids_v1'

export default function Home() {
  const [books, setBooks] = useState<BookRow[]>([])
  const [recentBookIds, setRecentBookIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const loadRecent = () => {
      try {
        const raw = window.localStorage.getItem(RECENT_KEY)
        const parsed = raw ? (JSON.parse(raw) as unknown) : []
        const ids = Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
        setRecentBookIds(ids as string[])
      } catch {
        setRecentBookIds([])
      }
    }

    loadRecent()

    const onChanged = () => loadRecent()
    window.addEventListener('bill:recentBooksChanged', onChanged)

    return () => {
      window.removeEventListener('bill:recentBooksChanged', onChanged)
    }
  }, [])

  useEffect(() => {
    let alive = true

    const fetchBooks = async () => {
      if (!recentBookIds.length) {
        setBooks([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('id,name')
        .in('id', recentBookIds)

      if (!alive) return
      if (error) {
        console.error(error)
        setBooks([])
        setLoading(false)
        return
      }

      const map = new Map((data as BookRow[] | null | undefined)?.map((b) => [b.id, b] as const) || [])
      const ordered = recentBookIds.map((id) => map.get(id)).filter(Boolean) as BookRow[]
      setBooks(ordered)
      setLoading(false)
    }

    fetchBooks()
    return () => {
      alive = false
    }
  }, [recentBookIds])

  // 點擊外部關閉選單（延遲掛載，避免開啟按鈕的點擊立即觸發關閉）
  useEffect(() => {
    if (!openMenuId) return
    const close = () => setOpenMenuId(null)
    const t = setTimeout(() => document.addEventListener('click', close), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('click', close)
    }
  }, [openMenuId])

  const handleDeleteBook = async (bookId: string, bookName: string) => {
    if (!confirm(`確定要刪除帳本「${bookName}」嗎？此操作無法復原。`)) return

    setDeletingId(bookId)
    setOpenMenuId(null)

    const { error } = await supabase.from('books').delete().eq('id', bookId)

    if (error) {
      console.error(error)
      alert('刪除失敗，請稍後再試')
      setDeletingId(null)
      return
    }

    // 從最近使用清單移除
    try {
      const raw = window.localStorage.getItem(RECENT_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : []
      const ids = Array.isArray(parsed) ? (parsed as string[]) : []
      const next = ids.filter((id) => id !== bookId)
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent('bill:recentBooksChanged'))
    } catch {
      // ignore
    }

    setBooks((prev) => prev.filter((b) => b.id !== bookId))
    setRecentBookIds((prev) => prev.filter((id) => id !== bookId))
    setDeletingId(null)
  }

  return (
    <div>
      <h1 className="tool-title">旅杰分帳</h1>
      <p className="tool-desc">最簡單的旅行分帳工具</p>

      <div className="card">
        <BillLink
          href="/book/new"
          className="btn"
          data-event="createbill"
          style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
        >
          ＋ 建立新帳本
        </BillLink>

        <h2 className="list-title">帳本清單</h2>

        {loading ? (
          <p className="empty-text">讀取中...</p>
        ) : books.length === 0 ? (
          <p className="empty-text">{recentBookIds.length ? '沒有符合的帳本（可能已刪除）' : '尚未有最近使用的帳本'}</p>
        ) : (
          <div className="grid">
            {books.map((b) => (
              <div key={b.id} className="book-card-wrapper">
                <BillLink
                  href={`/book/${b.id}`}
                  className="book-card"
                  style={{ opacity: deletingId === b.id ? 0.6 : 1 }}
                >
                  <div className="book-icon">📒</div>
                  <div className="book-name">{b.name}</div>
                </BillLink>
                <button
                  type="button"
                  className="book-card-menu-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === b.id ? null : b.id)
                  }}
                  disabled={deletingId === b.id}
                  aria-label="更多選項"
                >
                  ⋯
                </button>
                {openMenuId === b.id && (
                  <div
                    className="book-card-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="book-card-dropdown-item book-card-dropdown-item--danger"
                      onClick={() => handleDeleteBook(b.id, b.name)}
                      disabled={deletingId === b.id}
                    >
                      {deletingId === b.id ? '刪除中...' : '刪除'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p
        style={{
          marginTop: 24,
          fontSize: 12,
          color: '#9ca3af',
          textAlign: 'center'
        }}
      >
        提醒：帳本若連續 1 年沒有更新，系統會自動刪除該帳本及其明細。
      </p>
    </div>
  )
}