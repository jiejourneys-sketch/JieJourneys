'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BookRow = { id: string; name: string }

export default function Home() {
  const [books, setBooks] = useState<BookRow[]>([])
  const [recentBookIds, setRecentBookIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const howToUrl = process.env.NEXT_PUBLIC_BILL_HOWTO_URL || ''

  useEffect(() => {
    const RECENT_KEY = 'bill_recent_book_ids_v1'

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

  return (
    <div>
      <h1 className="tool-title">旅杰分帳</h1>
      <p className="tool-desc">最簡單的旅行分帳工具</p>

      <div className="card">
        <Link
          href="/tools/bill/book/new"
          className="btn"
          data-event="createbill"
          style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
        >
          ＋ 建立新帳本
        </Link>

        <h2 className="list-title">帳本清單</h2>

        {loading ? (
          <p className="empty-text">讀取中...</p>
        ) : books.length === 0 ? (
          <p className="empty-text">{recentBookIds.length ? '沒有符合的帳本（可能已刪除）' : '尚未有最近使用的帳本'}</p>
        ) : (
          <div className="grid">
            {books.map((b) => (
              <Link key={b.id} href={`/tools/bill/book/${b.id}`} className="book-card">
                <div className="book-icon">📒</div>
                <div className="book-name">{b.name}</div>
              </Link>
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

      <div
        className="card"
        style={{
          marginTop: 12,
          borderColor: 'rgba(31,122,140,.35)',
          background: '#fff'
        }}
      >
        <div style={{ fontWeight: 900, color: '#16324f', marginBottom: 6 }}>不會用？看 30 秒教學</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
          之後我會放 IG Reels，一步一步教你怎麼建立帳本、新增成員與記帳。
        </div>
        <a
          href={howToUrl || 'https://www.instagram.com/'}
          target="_blank"
          rel="noreferrer"
          className="btn secondary"
          style={{ display: 'inline-block', width: 'auto', textDecoration: 'none', padding: '10px 14px' }}
          data-event="howtovideo"
          aria-disabled={!howToUrl}
          onClick={(e) => {
            if (!howToUrl) e.preventDefault()
          }}
        >
          {howToUrl ? '前往 IG Reels 教學' : '教學影片準備中'}
        </a>
      </div>
    </div>
  )
}
