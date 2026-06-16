'use client'

import { useRef, useState } from 'react'

type Props = {
  href: string
  promoCode: string
  className?: string
  children: React.ReactNode
  /** KKday/Klook：不 preventDefault，讓 Universal Links 直接跳 app，toast 在過渡期短暫顯示 */
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
  const universalCopyPrimed = useRef(false)

  const showCopied = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleUniversalPointerDown = () => {
    universalCopyPrimed.current = true
    copyToClipboard(promoCode)
    showCopied()
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (universalLink) {
      if (!universalCopyPrimed.current) {
        copyToClipboard(promoCode)
        showCopied()
      }
      universalCopyPrimed.current = false
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
      onPointerDown={universalLink ? handleUniversalPointerDown : undefined}
      onClick={handleClick}
      aria-live="polite"
      {...rest}
    >
      {copied ? `✓ 已複製優惠碼：${promoCode}` : children}
    </a>
  )
}
