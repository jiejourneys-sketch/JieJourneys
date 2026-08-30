'use client'

import { useEffect } from 'react'
import { useShortVideoMenuAutoClose } from '@/components/shortVideoMenu'

type PurchaseOption = {
  label: string
  href: string
  event: string
  primary?: boolean
  platform?: string
}

type Props = {
  label?: string
  options: PurchaseOption[]
}

export default function SeoPurchaseMenu({ label = '購票', options }: Props) {
  const { detailsRef, onToggle } = useShortVideoMenuAutoClose({ revealOnOpen: true })

  useEffect(() => {
    const closeWhenClickingAway = (event: PointerEvent) => {
      const menu = detailsRef.current
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false
      }
    }

    document.addEventListener('pointerdown', closeWhenClickingAway)
    return () => document.removeEventListener('pointerdown', closeWhenClickingAway)
  }, [detailsRef])

  return (
    <details ref={detailsRef} name="short-video-menu" className="seo-purchase-details" onToggle={onToggle}>
      <summary className="seo-buy-link">{label}</summary>
      <div className="seo-purchase-options" aria-label={label}>
        {options.map((option) => (
          <a
            key={option.event}
            className={`seo-buy-link${option.primary ? ' primary' : ''}`}
            href={option.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            data-event={option.event}
            data-platform={option.platform ?? 'affiliate'}
            data-section="related_links_purchase"
            onClick={() => {
              if (detailsRef.current) detailsRef.current.open = false
            }}
          >
            {option.label}
          </a>
        ))}
      </div>
    </details>
  )
}
