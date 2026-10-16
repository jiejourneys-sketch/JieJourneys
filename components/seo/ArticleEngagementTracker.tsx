'use client'

import { useEffect } from 'react'
import { getGtag } from '@/lib/gtag'

type Props = {
  contentId: string
  sectionIds: string[]
  affiliateSectionId?: string
}

const scrollThresholds = [25, 50, 75, 90] as const

export default function ArticleEngagementTracker({ contentId, sectionIds, affiliateSectionId }: Props) {
  useEffect(() => {
    const gtag = getGtag()
    if (typeof gtag !== 'function') return

    const common = {
      content_id: contentId,
      page_path: window.location.pathname,
    }
    const viewedSections = new Set<string>()
    const reachedScrollDepths = new Set<number>()
    let ticking = false

    gtag('event', 'article_view', common)

    const reportScrollDepth = () => {
      ticking = false
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100))

      for (const threshold of scrollThresholds) {
        if (percent < threshold || reachedScrollDepths.has(threshold)) continue
        reachedScrollDepths.add(threshold)
        gtag('event', 'article_scroll', {
          ...common,
          percent_scrolled: threshold,
        })
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(reportScrollDepth)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const section = (entry.target as HTMLElement).dataset.trackSection
          if (!section || viewedSections.has(section)) continue

          viewedSections.add(section)
          const isAffiliateOffer = section === affiliateSectionId
          gtag('event', isAffiliateOffer ? 'affiliate_offer_view' : 'article_section_view', {
            ...common,
            section,
            ...(isAffiliateOffer ? { offer_id: 'kyushu_travel_next_step' } : {}),
          })
          if (isAffiliateOffer) {
            const links = Array.from(entry.target.querySelectorAll<HTMLElement>('[data-promotion-id]'))
            const first = links[0]
            const promotionId = first?.dataset.promotionId || 'kyushu_travel_next_step'
            gtag('event', 'view_promotion', {
              promotion_id: promotionId,
              promotion_name: first?.dataset.promotionName || '九州旅遊下一步',
              creative_slot: first?.dataset.creativeSlot || 'article_inline',
              items: links.map((link) => ({
                item_id: `${promotionId}_${(link.dataset.platform || 'affiliate').toLowerCase()}`,
                item_name: link.dataset.platform || link.dataset.label || 'affiliate',
                affiliation: '旅杰 JieJourneys',
              })),
            })
          }
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -30% 0px', threshold: 0.08 },
    )

    for (const sectionId of sectionIds) {
      const section = document.getElementById(sectionId)
      if (!section) continue
      section.dataset.trackSection = sectionId
      observer.observe(section)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    reportScrollDepth()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [affiliateSectionId, contentId, sectionIds])

  return null
}
