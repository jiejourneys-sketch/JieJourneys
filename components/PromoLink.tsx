'use client'

import { useState } from 'react'

type Props = {
  href: string
  promoCode: string
  className?: string
  children: React.ReactNode
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

export default function PromoLink({ href, promoCode, className, children, ...rest }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (copied) return
    copyToClipboard(promoCode)
    setCopied(true)
    setTimeout(() => {
      if (isInAppBrowser()) {
        window.location.href = href
      } else {
        window.open(href, '_blank', 'noopener,noreferrer')
      }
      setCopied(false)
    }, 1500)
  }

  return (
    <a
      className={`${className ?? ''} ${copied ? 'promo-copied' : ''}`.trim()}
      href={href}
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-live="polite"
      {...rest}
    >
      {copied ? `✓ 已複製優惠碼：${promoCode}` : children}
    </a>
  )
}
