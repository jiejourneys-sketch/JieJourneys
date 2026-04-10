'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <h2>發生了一些問題</h2>
      <p style={{ color: '#6b7280', marginTop: 8 }}>請稍後再試，或聯絡我們。</p>
      <button
        onClick={reset}
        style={{ marginTop: 24, padding: '10px 24px', cursor: 'pointer' }}
      >
        重試
      </button>
    </div>
  )
}
