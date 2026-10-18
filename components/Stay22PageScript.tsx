'use client'

import { useEffect } from 'react'

const STAY22_LMA_ID = '6ad2380fdd2d6b34accebcab'
const STAY22_SCRIPT_URL = 'https://lma.stay22.com/letmeallez.js'

declare global {
  interface Window {
    Stay22?: {
      params?: { lmaID: string }
    }
  }
}

type Stay22PageScriptProps = {
  pathname: string
  scriptId: string
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

export default function Stay22PageScript({ pathname, scriptId }: Stay22PageScriptProps) {
  useEffect(() => {
    const experimentPath = normalizePathname(pathname)
    const isExperimentPath = (candidate: string) => normalizePathname(candidate) === experimentPath

    window.Stay22 = window.Stay22 || {}
    window.Stay22.params = { lmaID: STAY22_LMA_ID }

    if (!document.querySelector(`script[src="${STAY22_SCRIPT_URL}"]`)) {
      const loader = document.createElement('script')
      loader.id = scriptId
      loader.async = true
      loader.src = STAY22_SCRIPT_URL

      const firstScript = document.getElementsByTagName('script')[0]
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(loader, firstScript)
      } else {
        document.head.appendChild(loader)
      }
    }

    // Stay22 does not expose a documented teardown API. Force a full document
    // navigation when leaving this page so its global listeners cannot carry
    // into another Next.js route during client-side navigation.
    const handleInternalNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.download || (anchor.target && anchor.target !== '_self')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin || isExperimentPath(destination.pathname)) return

      event.preventDefault()
      event.stopImmediatePropagation()
      window.location.assign(destination.href)
    }

    const handleHistoryNavigation = () => {
      if (!isExperimentPath(window.location.pathname)) window.location.reload()
    }

    document.addEventListener('click', handleInternalNavigation, true)
    window.addEventListener('popstate', handleHistoryNavigation)
    return () => {
      document.removeEventListener('click', handleInternalNavigation, true)
      window.removeEventListener('popstate', handleHistoryNavigation)
    }
  }, [pathname, scriptId])

  return null
}
