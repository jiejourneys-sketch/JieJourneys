'use client'

import { useState } from 'react'

type Props = {
  href: string
  promoCode: string
  className?: string
  children: React.ReactNode
  [key: `data-${string}`]: string | undefined
}

export default function PromoLink({ href, promoCode, className, children, ...rest }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (copied) return
    navigator.clipboard.writeText(promoCode).catch(() => {})
    setCopied(true)
    setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer')
      setCopied(false)
    }, 2000)
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
