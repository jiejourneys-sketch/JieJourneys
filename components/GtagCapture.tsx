'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

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

      gtagFn('event', name, {
        page_path: typeof window !== 'undefined' ? location.pathname : '',
        label: (el as HTMLElement).dataset.label || '',
        hotel: (el as HTMLElement).dataset.hotel || (card as HTMLElement)?.dataset?.hotel || titleText,
        platform: (el as HTMLElement).dataset.platform || '',
        area: (el as HTMLElement).dataset.area || (card as HTMLElement)?.dataset?.area || '',
        url: (el as HTMLAnchorElement).href || '',
        item: (el as HTMLElement).dataset.item || (card as HTMLElement)?.dataset?.item || '',
        section: (el as HTMLElement).dataset.section || (card as HTMLElement)?.dataset?.section || '',
        video: (card as HTMLElement)?.dataset?.video || '',
        title: (card as HTMLElement)?.dataset?.title || titleText,
      })
    }
    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return null
}
