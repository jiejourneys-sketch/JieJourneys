'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'

type FormStatus = { type: 'success' | 'error'; message: string } | null

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<FormStatus>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const payload = Object.fromEntries(f.entries()) as Record<string, string>

    if (payload.email !== payload.confirmEmail) {
      setStatus({ type: 'error', message: '兩次輸入的 Email 不一致，請檢查。' })
      return
    }

    delete payload.confirmEmail
    setSubmitting(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        setStatus({ type: 'success', message: `已送出！我們將回覆至：${payload.email}，請確認 Email 是否正確。` })
        form.reset()
      } else {
        setStatus({ type: 'error', message: `送出失敗：${data?.error || 'Unknown error'}` })
      }
    } catch {
      setStatus({ type: 'error', message: '系統錯誤，請稍後再試。' })
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

            {status && (
              <p role="alert" className={`contact-status contact-status--${status.type}`}>
                {status.message}
              </p>
            )}

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
