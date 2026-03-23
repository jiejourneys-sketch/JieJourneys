'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'

const SUPABASE_URL = 'https://fqhjwakhdizopjnnidni.supabase.co/functions/v1/contact-submit'
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxaGp3YWtoZGl6b3Bqbm5pZG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzcyNzAsImV4cCI6MjA3MTAxMzI3MH0.opToqcaOlh1UVdpXf4Gh9zjl8vWgkr35RPsYHkkaItY'

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const payload = Object.fromEntries(f.entries()) as Record<string, string>

    if (payload.email !== payload.confirmEmail) {
      alert('⚠️ 兩次輸入的 Email 不一致，請檢查。')
      return
    }

    delete payload.confirmEmail
    setSubmitting(true)

    try {
      const res = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        alert(`✅ 已送出！我們將回覆至：${payload.email}\n請確認 Email 是否正確。`)
        form.reset()
      } else {
        alert(`⚠️ 送出失敗：${data?.error || 'Unknown error'}`)
      }
    } catch (err) {
      alert('❌ 系統錯誤，請稍後再試。')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }, [])

  return (
    <>
      <div className="contact-container">
        <Link href="/" className="back-chip" data-event="contact_back" data-item="back">
          ← 回上一頁
        </Link>
        <div className="contact-card">
          <h1>聯絡我們</h1>
          <p className="contact-hint">提交後我們會盡快回覆你。</p>

          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="contact-name">您的名字</label>
              <input id="contact-name" name="name" required />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">您的 Email</label>
              <input id="contact-email" name="email" type="email" required />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-confirm">再次輸入 Email（避免打錯）</label>
              <input id="contact-confirm" name="confirmEmail" type="email" required />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">想詢問的問題</label>
              <textarea id="contact-message" name="message" required />
            </div>

            <div className="contact-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? '送出中…' : '送出'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
