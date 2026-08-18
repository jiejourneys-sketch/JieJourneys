'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

const AFFILIATE_PLATFORM_LABELS: Record<string, string> = {
  kkday: 'KKDAY',
  klook: 'KLOOK',
  agoda: 'Agoda',
  trip: 'Trip',
  'trip.com': 'Trip',
}

function affiliatePlatform(platform: string, destinationUrl: string): string | null {
  const platformKey = platform.trim().toLowerCase()
  if (AFFILIATE_PLATFORM_LABELS[platformKey]) return AFFILIATE_PLATFORM_LABELS[platformKey]

  try {
    const hostname = new URL(destinationUrl).hostname.toLowerCase()
    if (hostname === 'kkday.com' || hostname.endsWith('.kkday.com')) return 'KKDAY'
    if (hostname === 'klook.com' || hostname.endsWith('.klook.com')) return 'KLOOK'
    if (hostname === 'agoda.com' || hostname.endsWith('.agoda.com')) return 'Agoda'
    if (hostname === 'trip.com' || hostname.endsWith('.trip.com')) return 'Trip'
  } catch {
    // A relative/internal link is not an affiliate destination.
  }

  return null
}

/** 文件層級 GA 點擊追蹤：捕捉所有 [data-event] 元素，與 HTML 版本一致 */
export default function GtagCapture() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // e.target 可能是子元素或 Text node，用 closest 從點擊處往上找含 data-event 的祖先
      const start = e.target instanceof Element ? e.target : (e.target as Node).parentElement
      const el = start?.closest?.('[data-event]')
      if (!el) return
      // 邊界：避免誤抓 form submit（未來若有人在 form 上加 data-event）
      if ((el as HTMLElement).tagName === 'FORM') return
      const name = (el as HTMLElement).dataset.event
      if (!name) return
      const gtagFn = getGtag()
      if (typeof gtagFn !== 'function') return

      const card = (el as HTMLElement).closest('[data-video],[data-hotel],.stay-card')
      const titleText = card?.querySelector('.title')?.textContent?.trim() || ''
      const element = el as HTMLElement
      const destinationUrl = (el as HTMLAnchorElement).href || ''
      const platform = element.dataset.platform || ''
      const eventParameters = {
        page_path: typeof window !== 'undefined' ? location.pathname : '',
        label: element.dataset.label || '',
        hotel: element.dataset.hotel || (card as HTMLElement)?.dataset?.hotel || titleText,
        platform,
        area: element.dataset.area || (card as HTMLElement)?.dataset?.area || '',
        url: destinationUrl,
        item: element.dataset.item || (card as HTMLElement)?.dataset?.item || '',
        section: element.dataset.section || (card as HTMLElement)?.dataset?.section || '',
        video: (card as HTMLElement)?.dataset?.video || '',
        title: (card as HTMLElement)?.dataset?.title || titleText,
      }

      gtagFn('event', name, eventParameters)

      const canonicalAffiliatePlatform = affiliatePlatform(platform, destinationUrl)
      if (canonicalAffiliatePlatform) {
        gtagFn('event', 'affiliate_click', {
          ...eventParameters,
          platform: canonicalAffiliatePlatform,
          affiliate_event: name,
          transport_type: 'beacon',
        })
      }
    }
    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return null
}
