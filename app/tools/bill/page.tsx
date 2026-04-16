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
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  const [editingBookName, setEditingBookName] = useState('')
  const [renamingBookId, setRenamingBookId] = useState<string | null>(null)

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

  const startBookEdit = (bookId: string, currentName: string) => {
    setOpenMenuId(null)
    setEditingBookId(bookId)
    setEditingBookName(currentName)
  }

  const cancelBookEdit = () => {
    setEditingBookId(null)
    setEditingBookName('')
  }

  const saveBookName = async (bookId: string) => {
    const trimmed = editingBookName.trim()
    if (!trimmed) return alert('名稱不能為空')
    const current = books.find((b) => b.id === bookId)
    if (current && trimmed === current.name) {
      cancelBookEdit()
      return
    }

    setRenamingBookId(bookId)
    const { error } = await supabase.from('books').update({ name: trimmed }).eq('id', bookId)
    setRenamingBookId(null)
    if (error) {
      console.error(error)
      alert('更新失敗，請稍後再試')
      return
    }
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, name: trimmed } : b)))
    cancelBookEdit()
  }

  const handleDeleteBook = async (bookId: string, bookName: string) => {
    if (!confirm(`確定要刪除帳本「${bookName}」嗎？此操作無法復原。`)) return

    setDeletingId(bookId)
    setOpenMenuId(null)

    // 先取出所有帳目 ID，再逐層刪除子資料
    const { data: expData } = await supabase.from('expenses').select('id').eq('book_id', bookId)
    const expIds = (expData || []).map((e: { id: string }) => e.id)
    if (expIds.length) {
      const { error: payerDeleteError } = await supabase.from('expense_payers').delete().in('expense_id', expIds)
      if (payerDeleteError) {
        console.error(payerDeleteError)
        alert('刪除失敗：付款者資料沒有刪乾淨')
        setDeletingId(null)
        return
      }

      const { error: splitDeleteError } = await supabase.from('expense_splits').delete().in('expense_id', expIds)
      if (splitDeleteError) {
        console.error(splitDeleteError)
        alert('刪除失敗：分攤資料沒有刪乾淨')
        setDeletingId(null)
        return
      }
    }

    const { error: expenseDeleteError } = await supabase.from('expenses').delete().eq('book_id', bookId)
    if (expenseDeleteError) {
      console.error(expenseDeleteError)
      alert('刪除失敗：帳目資料沒有刪乾淨')
      setDeletingId(null)
      return
    }

    const { error: memberDeleteError } = await supabase.from('members').delete().eq('book_id', bookId)
    if (memberDeleteError) {
      console.error(memberDeleteError)
      alert('刪除失敗：成員資料沒有刪乾淨')
      setDeletingId(null)
      return
    }

    const { error } = await supabase.from('books').delete().eq('id', bookId)

    if (error) {
      console.error(error)
      alert('刪除失敗，請稍後再試')
      setDeletingId(null)
      return
    }

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

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <a
          href="https://www.instagram.com/reel/DWbdQp7T0t7/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ig"
          data-event="billIG"
        >
          <span className="btn-ig-icon">🎬</span>
          看看怎麼用
        </a>
      </div>

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
                {editingBookId === b.id ? (
                  <div
                    className="book-card book-card-rename"
                    role="group"
                    aria-label="重新命名帳本"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="book-card-rename__icon" aria-hidden>
                      📒
                    </div>
                    <label className="book-card-rename__label" htmlFor={`book-rename-${b.id}`}>
                      帳本名稱
                    </label>
                    <input
                      id={`book-rename-${b.id}`}
                      className="book-card-rename__input"
                      value={editingBookName}
                      onChange={(e) => setEditingBookName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void saveBookName(b.id)
                        if (e.key === 'Escape') cancelBookEdit()
                      }}
                      disabled={renamingBookId === b.id}
                      maxLength={120}
                      autoComplete="off"
                      autoFocus
                    />
                    <div className="book-card-rename__actions">
                      <button
                        type="button"
                        className="book-card-rename__save"
                        onClick={() => void saveBookName(b.id)}
                        disabled={renamingBookId === b.id || !editingBookName.trim()}
                      >
                        {renamingBookId === b.id ? '儲存中…' : '儲存'}
                      </button>
                      <button
                        type="button"
                        className="book-card-rename__cancel"
                        onClick={cancelBookEdit}
                        disabled={renamingBookId === b.id}
                        aria-label="取消"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <BillLink
                    href={`/book/${b.id}`}
                    className="book-card"
                    style={{ opacity: deletingId === b.id ? 0.6 : 1 }}
                  >
                    <div className="book-icon">📒</div>
                    <div className="book-name">{b.name}</div>
                  </BillLink>
                )}
                {editingBookId !== b.id && (
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
                )}
                {openMenuId === b.id && (
                  <div
                    className="book-card-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="book-card-dropdown-item"
                      onClick={() => startBookEdit(b.id, b.name)}
                      disabled={deletingId === b.id}
                    >
                      改名
                    </button>
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
