'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      let el = e.target as HTMLElement | null
      while (el && el !== document.documentElement) {
        const eventName = el.getAttribute?.('data-event')
        if (eventName) {
          window.gtag?.('event', eventName)
          break
        }
        el = el.parentElement
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

