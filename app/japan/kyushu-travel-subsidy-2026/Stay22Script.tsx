'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const KYUSHU_SUBSIDY_PATH = '/japan/kyushu-travel-subsidy-2026'

function isKyushuSubsidyPath(pathname: string) {
  return pathname.replace(/\/+$/, '') === KYUSHU_SUBSIDY_PATH
}

export default function Stay22Script() {
  useEffect(() => {
    // Stay22 does not expose a documented teardown API. Force a full document
    // navigation when leaving this experiment so its global listeners cannot
    // carry into another Next.js route during client-side navigation.
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
      if (destination.origin !== window.location.origin || isKyushuSubsidyPath(destination.pathname)) return

      event.preventDefault()
      event.stopImmediatePropagation()
      window.location.assign(destination.href)
    }

    const handleHistoryNavigation = () => {
      if (!isKyushuSubsidyPath(window.location.pathname)) window.location.reload()
    }

    document.addEventListener('click', handleInternalNavigation, true)
    window.addEventListener('popstate', handleHistoryNavigation)
    return () => {
      document.removeEventListener('click', handleInternalNavigation, true)
      window.removeEventListener('popstate', handleHistoryNavigation)
    }
  }, [])

  return (
    <Script id="stay22-kyushu-subsidy" strategy="afterInteractive">
      {`
        (function (s, t, a, y, twenty, two) {
          s.Stay22 = s.Stay22 || {};
          s.Stay22.params = { lmaID: '6ad2380fdd2d6b34accebcab' };
          twenty = t.createElement(a);
          two = t.getElementsByTagName(a)[0];
          twenty.async = 1;
          twenty.src = y;
          two.parentNode.insertBefore(twenty, two);
        })(window, document, 'script', 'https://lma.stay22.com/letmeallez.js');
      `}
    </Script>
  )
}
