'use client'

import { useEffect, useRef } from 'react'

export default function Footer() {
  const yearRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = String(new Date().getFullYear())
    }
  }, [])

  return (
    <footer>
      <div>
        <strong>JieJourneys</strong> © <span ref={yearRef} />
      </div>
    </footer>
  )
}
