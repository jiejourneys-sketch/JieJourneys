'use client'

import { useCallback, useEffect, useRef } from 'react'

const SHORT_VIDEO_MENU_OPEN_EVENT = 'jiejourneys:short-video-menu-open'
const SHORT_VIDEO_MENU_SELECTOR = 'details[name="short-video-menu"]'
const SHORT_VIDEO_SCROLL_LISTENER_KEY = '__jieJourneysShortVideoScrollCloseAttached'
let ignoreScrollCloseUntil = 0

function closeAllShortVideoMenus() {
  if (Date.now() < ignoreScrollCloseUntil) return
  document.querySelectorAll<HTMLDetailsElement>(`${SHORT_VIDEO_MENU_SELECTOR}[open]`).forEach((menu) => {
    menu.open = false
  })
}

function nearestScrollableAncestor(element: HTMLElement) {
  let parent = element.parentElement
  while (parent) {
    const overflowY = window.getComputedStyle(parent).overflowY
    if (/(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight + 1) {
      return parent
    }
    parent = parent.parentElement
  }
  return null
}

function revealOpenMenu(menu: HTMLDetailsElement) {
  window.requestAnimationFrame(() => {
    if (!menu.open) return
    const scroller = nearestScrollableAncestor(menu)
    if (!scroller) return

    const menuRect = menu.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    const padding = 12
    const below = menuRect.bottom - (scrollerRect.bottom - padding)
    const above = scrollerRect.top + padding - menuRect.top
    const offset = below > 0 ? below : above > 0 ? -above : 0
    if (offset === 0) return

    // This scroll is only to reveal the menu that was just opened; do not let
    // the global manual-scroll handler immediately close that same menu.
    ignoreScrollCloseUntil = Date.now() + 700
    scroller.scrollBy({ top: offset, behavior: 'smooth' })
  })
}

if (typeof window !== 'undefined') {
  const browserWindow = window as typeof window & { [SHORT_VIDEO_SCROLL_LISTENER_KEY]?: boolean }
  if (!browserWindow[SHORT_VIDEO_SCROLL_LISTENER_KEY]) {
    document.addEventListener('scroll', closeAllShortVideoMenus, { capture: true, passive: true })
    browserWindow[SHORT_VIDEO_SCROLL_LISTENER_KEY] = true
  }
}

/**
 * Keeps short-video platform menus lightweight: only one stays open at a time
 * and any scroll closes the current menu before the card moves away.
 */
export function useShortVideoMenuAutoClose({ revealOnOpen = false }: { revealOnOpen?: boolean } = {}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const closeMenu = useCallback(() => {
    if (detailsRef.current?.open) {
      detailsRef.current.open = false
    }
  }, [])

  const onToggle = useCallback(() => {
    const menu = detailsRef.current
    if (menu?.open) {
      // Expanding a details element can trigger browser scroll anchoring even
      // without a reader scrolling. Keep that layout adjustment from closing
      // the menu that has just been opened.
      ignoreScrollCloseUntil = Date.now() + 250
      if (revealOnOpen) revealOpenMenu(menu)
    }
  }, [revealOnOpen])

  useEffect(() => {
    const menu = detailsRef.current
    const handleAnotherMenuOpen = (event: Event) => {
      const source = (event as CustomEvent<HTMLDetailsElement>).detail
      if (source !== detailsRef.current) closeMenu()
    }
    const announceMenuOpen = () => {
      if (menu?.open) {
        window.dispatchEvent(new CustomEvent(SHORT_VIDEO_MENU_OPEN_EVENT, { detail: menu }))
      }
    }

    window.addEventListener(SHORT_VIDEO_MENU_OPEN_EVENT, handleAnotherMenuOpen)
    menu?.addEventListener('toggle', announceMenuOpen)

    return () => {
      window.removeEventListener(SHORT_VIDEO_MENU_OPEN_EVENT, handleAnotherMenuOpen)
      menu?.removeEventListener('toggle', announceMenuOpen)
    }
  }, [closeMenu])

  return { detailsRef, onToggle }
}
