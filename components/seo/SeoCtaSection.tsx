'use client'

import React from 'react'

type Props = {
  text: string
  href: string
  linkText?: string
  newTab?: boolean
  dataEvent?: string
}

export default function SeoCtaSection({ text, href, linkText = '直接看推薦飯店 ↓', newTab = false, dataEvent }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (newTab) return
    if (!href.startsWith('#')) return
    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return
    e.preventDefault()

    const rawNavH = getComputedStyle(document.documentElement).getPropertyValue('--navH')
    const navH = Number.parseInt(rawNavH || '0', 10) || 0

    const top = window.scrollY + el.getBoundingClientRect().top - (navH + 12)
    window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })

    // Keep hash in URL (without triggering another jump).
    try {
      history.replaceState(null, '', href)
    } catch {
      // ignore
    }
  }

  return (
    <section className="seo-cta cta-box" aria-label="CTA">
      <a
        className="cta-link"
        href={href}
        onClick={handleClick}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        data-event={dataEvent}
      >
        {text ? `${text} ` : ''}
        {linkText}
      </a>
    </section>
  )
}

