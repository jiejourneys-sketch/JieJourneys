'use client'
import { useEffect, useState } from 'react'

// Module-level state so the script is only injected once
let state: 'idle' | 'loading' | 'ready' = 'idle'
const waiters: Array<() => void> = []

function loadScript() {
  if (state !== 'idle') return
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key) return
  state = 'loading'
  const s = document.createElement('script')
  s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
  s.async = true
  s.onload = () => {
    state = 'ready'
    waiters.forEach((fn) => fn())
    waiters.length = 0
  }
  document.head.appendChild(s)
}

export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(() =>
    typeof window !== 'undefined' && !!window.google?.maps
  )

  useEffect(() => {
    if (ready) return
    if (state === 'ready' && window.google?.maps) { setReady(true); return }
    waiters.push(() => setReady(true))
    loadScript()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ready
}
