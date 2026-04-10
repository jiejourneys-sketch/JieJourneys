'use client'

import type { CSSProperties } from 'react'
import { getShareUrl, getCanonicalPathFromPathname } from '@/lib/billPath'

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
    const url =
      typeof path === 'string'
        ? getShareUrl(path)
        : getShareUrl(getCanonicalPathFromPathname(window.location.pathname))

    if (navigator.share) {
      try {
        await navigator.share({ url, title: '帳本連結' })
      } catch (err) {
        // 使用者取消分享不需要提示
        if (err instanceof Error && err.name !== 'AbortError') {
          await fallbackCopy(url)
        }
      }
    } else {
      await fallbackCopy(url)
    }
  }

  const fallbackCopy = async (url: string) => {
    try {
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

