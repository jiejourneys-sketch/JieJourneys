'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

export default function SearchBox() {
  useEffect(() => {
    const searchInput = document.getElementById('searchInput')
    const cards = Array.from(document.querySelectorAll('.popular-grid .card'))
    if (!searchInput) return

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
  }, [])

  useEffect(() => {
    const input = document.getElementById('searchInput')
    if (!input) return
    let timer: ReturnType<typeof setTimeout>
    const handleInput = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const fn = getGtag()
        if (typeof fn !== 'function') return
        const term = ((input as HTMLInputElement).value || '').trim()
        const shown = [...document.querySelectorAll('.popular-grid .card')].filter(
          (c) => (c as HTMLElement).style.display !== 'none'
        ).length
        fn('event', 'home_search', {
          page_path: location.pathname,
          term,
          result_count: shown,
        })
      }, 400)
    }
    input.addEventListener('input', handleInput)
    return () => input.removeEventListener('input', handleInput)
  }, [])

  return (
    <div className="search-box">
      <input type="text" id="searchInput" placeholder="輸入國家或城市名稱..." />
    </div>
  )
}
