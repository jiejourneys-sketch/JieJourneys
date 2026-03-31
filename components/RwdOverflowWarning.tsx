'use client'

import { useEffect } from 'react'

type OverflowPayload = {
  path: string
  innerWidth: number
  scrollWidth: number
  delta: number
}

export default function RwdOverflowWarning() {
  useEffect(() => {
    let raf = 0

    const check = () => {
      const de = document.documentElement
      const innerWidth = window.innerWidth
      const scrollWidth = de.scrollWidth
      const delta = scrollWidth - innerWidth
      if (delta > 0.5) {
        const payload: OverflowPayload = {
          path: location.pathname,
          innerWidth,
          scrollWidth,
          delta: Math.round(delta * 100) / 100,
        }
        // eslint-disable-next-line no-console
        console.warn('[RWD_OVERFLOW]', payload)
      }
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }

    schedule()
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
    }
  }, [])

  return null
}

