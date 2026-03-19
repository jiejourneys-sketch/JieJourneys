'use client'

import type { CSSProperties } from 'react'

export default function ShareBookButton({
  path,
  label,
  style
}: {
  path?: string
  label?: string
  style?: CSSProperties
}) {
  const handleClick = async () => {
    try {
      const url = path
        ? new URL(path, window.location.origin).toString()
        : window.location.href
      await navigator.clipboard.writeText(url)
      alert('已複製帳本連結')
    } catch {
      alert('複製失敗，請手動複製網址列')
    }
  }

  return (
    <button type="button" className="pill-link" onClick={handleClick} style={style} data-event="sharebill">
      {label || '分享帳本'}
    </button>
  )
}
