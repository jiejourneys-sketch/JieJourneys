'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

type SearchBoxProps = {
  /** 包住 `.popular-grid` 的外層元素 id，搜尋只篩選此區塊內的卡片 */
  rootId?: string
  /** 搜尋框 input 的 id（多處使用時請給不同值） */
  inputId?: string
  /** gtag 事件名稱 */
  eventName?: string
}

export default function SearchBox({
  rootId,
  inputId = 'searchInput',
  eventName = 'home_search',
}: SearchBoxProps) {
  useEffect(() => {
    const searchInput = document.getElementById(inputId)
    const root = rootId ? document.getElementById(rootId) : document
    if (!searchInput || !root) return

    const cards = Array.from(root.querySelectorAll('.popular-grid .card'))
    if (cards.length === 0) return

    const norm = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '')

    const handleInput = () => {
      const kw = norm((searchInput as HTMLInputElement).value)
      if (!kw) {
        cards.forEach((c) => ((c as HTMLElement).style.display = ''))
        return
      }
      cards.forEach((card) => {
        const bag = norm(
          card.textContent + ' ' + (card.getAttribute('data-tags') || '')
        )
        ;(card as HTMLElement).style.display = bag.includes(kw) ? '' : 'none'
      })
    }
    searchInput.addEventListener('input', handleInput)
    return () => searchInput.removeEventListener('input', handleInput)
  }, [inputId, rootId])

  useEffect(() => {
    const input = document.getElementById(inputId)
    const root = rootId ? document.getElementById(rootId) : document
    if (!input || !root) return

    let timer: ReturnType<typeof setTimeout>
    const handleInput = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const fn = getGtag()
        if (typeof fn !== 'function') return
        const term = ((input as HTMLInputElement).value || '').trim()
        const cards = [...root.querySelectorAll('.popular-grid .card')]
        const shown = cards.filter((c) => (c as HTMLElement).style.display !== 'none').length
        fn('event', eventName, {
          page_path: location.pathname,
          term,
          result_count: shown,
        })
      }, 400)
    }
    input.addEventListener('input', handleInput)
    return () => input.removeEventListener('input', handleInput)
  }, [inputId, rootId, eventName])

  return (
    <div className="search-box">
      <input type="text" id={inputId} placeholder="輸入國家或城市名稱..." />
    </div>
  )
}
