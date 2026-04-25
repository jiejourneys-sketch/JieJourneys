'use client'

import { useState } from 'react'

type Props = {
  href: string
  promoCode: string
  className?: string
  children: React.ReactNode
  [key: `data-${string}`]: string | undefined
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

  const handleClick = () => {
    copyToClipboard(promoCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
