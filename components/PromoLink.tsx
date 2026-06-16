'use client'

import { useState } from 'react'

type Props = {
  href: string
  promoCode: string
  className?: string
  children: React.ReactNode
  /** KKday/Klook：不 preventDefault、不改點擊前 UI，讓 Universal Links 保留原生 App 跳轉 */
  universalLink?: boolean
  [key: `data-${string}`]: string | undefined
}

function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(ua)
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    try { document.execCommand('copy') } catch { /* noop */ }
    document.body.removeChild(el)
  }
}

export default function PromoLink({ href, promoCode, className, children, universalLink, ...rest }: Props) {
  const [copied, setCopied] = useState(false)

  const showCopied = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (universalLink) {
      copyToClipboard(promoCode)
    } else {
      e.preventDefault()
      if (copied) return
      copyToClipboard(promoCode)
      showCopied()
      setTimeout(() => {
        if (isInAppBrowser()) {
          window.location.href = href
        } else {
          window.open(href, '_blank', 'noopener,noreferrer')
        }
      }, 1500)
    }
  }

  return (
    <a
      className={`${className ?? ''} ${copied ? 'promo-copied' : ''}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-live="polite"
      {...rest}
    >
      {copied ? `✓ 已複製優惠碼：${promoCode}` : children}
    </a>
  )
}
