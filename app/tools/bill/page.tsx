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
      <p className="tool-desc">旅行多人分帳，記錄支出、分攤費用、快速結帳。</p>

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

      <section className="tool-about" aria-labelledby="bill-about-title">
        <h2 id="bill-about-title">第一次用旅杰分帳？1 分鐘看懂</h2>
        <p>
          <strong>旅杰分帳是免登入的旅行多人分帳工具。</strong>
          建立帳本並分享連結給旅伴後，大家可以一起記錄誰先付款、費用要怎麼分攤，最後快速看懂每個人該收多少、該付多少。
        </p>
        <h3>三步驟開始使用</h3>
        <ol className="tool-steps">
          <li>
            <strong>建立帳本</strong>
            <span>輸入旅程名稱，設定最後結算要使用的貨幣。</span>
          </li>
          <li>
            <strong>加入旅伴與支出</strong>
            <span>記錄住宿、交通、餐費、門票等共同花費與付款人。</span>
          </li>
          <li>
            <strong>查看結帳結果</strong>
            <span>系統整理每個人的應收與應付，再分享帳本給旅伴。</span>
          </li>
        </ol>
        <div className="tool-faq" aria-labelledby="bill-faq-title">
          <h3 id="bill-faq-title">常見問題</h3>
          <details>
            <summary>旅杰分帳需要登入嗎？</summary>
            <p>不用。建立帳本後即可開始記錄；同一個瀏覽器會顯示最近開啟的帳本。</p>
          </details>
          <details>
            <summary>帳本如何保存與分享？</summary>
            <p>每本帳本都有專屬連結。在帳本內按「分享帳本」即可傳給旅伴；建議也把連結存到 LINE、備忘錄或書籤。持有連結的人可以開啟帳本，請勿公開分享含有私人資訊的帳本。</p>
          </details>
          <details>
            <summary>支援哪些貨幣？</summary>
            <p>內建台幣、日圓、韓元、越南盾、美金、港幣、歐元、泰銖、新幣、馬幣、菲幣、印尼盾、澳幣與人民幣；帳本設定也能新增自訂貨幣。每筆支出可使用不同貨幣，最後依帳本設定的結算貨幣整理。</p>
          </details>
          <details>
            <summary>和直接問 AI 算分帳有什麼差別？</summary>
            <p>AI 適合協助估算預算或回答問題；旅杰分帳則把實際付款、分攤與結帳結果留在同一本帳裡，旅伴可直接一起查看與更新。</p>
          </details>
        </div>
      </section>

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
