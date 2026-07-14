'use client'

import { useEffect, useMemo, useState } from 'react'
import AreaTabs, { type TabItem } from '@/components/AreaTabs'
import PromoLink from '@/components/PromoLink'

export type CityCardAction = {
  label: string
  href: string
  className?: string
  event?: string
  platform?: string
  section?: string
  /** 點擊後先複製此優惠碼並顯示 toast，1 秒後再跳轉 */
  promoCode?: string
  /** 僅影響地圖卡片按鈕分排：設在「新一排的第一顆」上（勿設在第一顆）。/busan/ticket 仍為單排。 */
  mapNextRow?: boolean
  /**
   * 僅地圖方塊內 `<a>` 的 `data-event`（完整字串）。
   * 票券頁也會出現的按鈕：請**保留** `event`（給 `/ticket`），另加 `mapEvent`（給地圖）才能兩邊分開計。
   * 只有地圖才有的按鈕：可只寫 `mapEvent`，或只寫 `event`（地圖會用 `mapEvent ?? event`）。
   */
  mapEvent?: string
  /** 僅地圖方塊內連結的 `data-section`；未填則為 `map_bar`。 */
  mapSection?: string
}

export type CityCard = {
  title: string
  meta: string
  /** 額外的「推薦語」：用於內容感的卡片說明（可選）。 */
  note?: string
  /** 卡片可展開詳解（可選）：3~6 條短重點，供 SEO/快速理解。 */
  details?: string[]
  area: string
  datasetKey?: 'video' | 'hotel' | 'title'
  datasetValue?: string
  actions: CityCardAction[]
  /** 與「地圖」分享連結對應的座標（供 /tokyo/map 等使用） */
  lat?: number
  lng?: number
  /** 關鍵字標籤，供 tagFilterArea 啟用時多選篩選（AND 邏輯） */
  tags?: string[]
}

type Props = {
  tabs: TabItem[]
  cards: CityCard[]
  tabEvent: string
  /**
   * 指定哪個 tab 的 area 值要顯示 tag 多選篩選列。
   * 例如 tagFilterArea="一日遊" 時，切到「一日遊」tab 會在卡片上方出現 tag 篩選按鈕。
   */
  tagFilterArea?: string
  tagFilterAreas?: string[]
  /** 指定篩選 bar 的 tag 顯示順序；未列出的 tag 排在最後。 */
  tagOrder?: string[]
  /** true 時 tag 篩選列只在 tagFilterArea tab 出現，不會在「全部」tab 預設顯示。 */
  tagHideOnAll?: boolean
  /** 在「全部」tab 預設顯示指定 area 的 tag，但卡片仍維持全部列表。 */
  tagDefaultAreaOnAll?: string
}

export default function CityTabbedList({ tabs, cards, tabEvent, tagFilterArea, tagFilterAreas, tagOrder, tagHideOnAll, tagDefaultAreaOnAll }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [hasSelectedTab, setHasSelectedTab] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [returnHref, setReturnHref] = useState<string | null>(null)
  const filterAreas = useMemo(() => tagFilterAreas ?? (tagFilterArea ? [tagFilterArea] : []), [tagFilterArea, tagFilterAreas])

  const returnMapLabel = useMemo(() => {
    if (!returnHref) return '← 返回地圖'
    if (returnHref.startsWith('/busan/')) return '← 返回釜山地圖'
    if (returnHref.startsWith('/fuji/')) return '← 返回富士地圖'
    return '← 返回地圖'
  }, [returnHref])

  const tabCards = useMemo(
    () => cards.filter((card) => activeTab === 'all' || card.area === activeTab),
    [activeTab, cards],
  )

  const showTagFilter = filterAreas.length > 0 && (filterAreas.includes(activeTab) || (!tagHideOnAll && activeTab === 'all'))
  const isTagFilterActive = filterAreas.includes(activeTab)

  const tagAreaCards = useMemo(
    () => (filterAreas.length > 0 ? cards.filter((card) => activeTab === 'all' ? (tagDefaultAreaOnAll ? card.area === tagDefaultAreaOnAll : filterAreas.includes(card.area)) : card.area === activeTab) : []),
    [activeTab, cards, filterAreas, tagDefaultAreaOnAll],
  )

  const availableTags = useMemo(() => {
    if (filterAreas.length === 0) return []
    const seen = new Set<string>()
    for (const card of tagAreaCards) {
      for (const tag of card.tags ?? []) seen.add(tag)
    }
    if (!tagOrder) return [...seen]
    const ordered = tagOrder.filter((t) => seen.has(t))
    for (const t of seen) {
      if (!tagOrder.includes(t)) ordered.push(t)
    }
    return ordered
  }, [filterAreas, tagAreaCards, tagOrder])

  useEffect(() => {
    if (filterAreas.length === 0 || typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const tag = params.get('tag')?.trim()
    const id = window.setTimeout(() => {
      const from = params.get('from')
      if (from === 'planner') {
        const returnParam = params.get('return')?.trim()
        if (returnParam?.startsWith('/tools/planner')) setReturnHref(returnParam)
      } else if (from === 'map' || from === 'pass-map') {
        const place = params.get('place')?.trim()
        const mapPath = window.location.pathname.replace(/\/ticket\/?$/, from === 'pass-map' ? '/pass-map' : '/map')
        setReturnHref(place ? `${mapPath}?place=${encodeURIComponent(place)}` : mapPath)
      }
      if (!tag) return
      const matchingCard = cards.find((card) => filterAreas.includes(card.area) && (card.tags ?? []).includes(tag))
      if (!matchingCard) return
      setActiveTab(matchingCard.area)
      setHasSelectedTab(true)
      setSelectedTags(new Set([tag]))
    }, 0)
    return () => window.clearTimeout(id)
  }, [cards, filterAreas])

  const shownCards = useMemo(() => {
    if (!isTagFilterActive || selectedTags.size === 0) return tabCards
    return tabCards.filter((card) => {
      const cardTags = new Set(card.tags ?? [])
      for (const t of selectedTags) {
        if (!cardTags.has(t)) return false
      }
      return true
    })
  }, [isTagFilterActive, selectedTags, tabCards])

  const toggleTag = (tag: string) => {
    if (activeTab === 'all' && filterAreas.length > 0) {
      setActiveTab(filterAreas[0])
      setHasSelectedTab(true)
    }
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setHasSelectedTab(true)
    setSelectedTags(new Set())
  }

  return (
    <>
      <AreaTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        gtagEvent={tabEvent}
        showActive={hasSelectedTab}
      />

      {showTagFilter && availableTags.length > 0 && (
        <div className="tag-filter-row">
          <span className="tag-filter-label">
            {isTagFilterActive ? '篩選景點' : '點選景點篩選一日遊'}
          </span>
          <div className="tag-chips">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-chip ${selectedTags.has(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.size > 0 && (
            <button
              type="button"
              className="tag-clear"
              onClick={() => setSelectedTags(new Set())}
            >
              清除篩選
            </button>
          )}
          {returnHref ? (
            <a className="tag-clear tag-return" href={returnHref}>
              {returnHref.startsWith('/tools/planner') ? '← 返回行程排序' : returnMapLabel}
            </a>
          ) : null}
        </div>
      )}

      <section className="stay-list" id="stayList">
        {shownCards.length === 0 && showTagFilter && selectedTags.size > 0 ? (
          <p className="tag-no-result">目前沒有符合所有條件的行程，請取消部分篩選。</p>
        ) : (
          shownCards.map((card) => {
            const dataProps: Record<string, string> = { 'data-area': card.area }
            if (card.datasetKey && card.datasetValue) {
              dataProps[`data-${card.datasetKey}`] = card.datasetValue
            }
            return (
              <article key={`${card.area}-${card.title}`} className="stay-card" {...dataProps}>
                <div>
                  <h3 className="title">{card.title}</h3>
                  {card.note ? <p className="card-note">{card.note}</p> : null}
                  <p className="meta">{card.meta}</p>
                  {card.details?.length ? (
                    <details className="card-accordion">
                      <summary className="card-accordion-summary">展開詳解</summary>
                      <ul className="card-bullets">
                        {card.details.map((item, idx) => (
                          <li key={`${card.title}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                  <div className="actions">
                    {card.actions.map((action) => {
                      const isExternal = /^https?:\/\//.test(action.href)
                      return action.promoCode ? (
                        <PromoLink
                          key={`${card.title}-${action.label}-${action.href}`}
                          className={action.className || 'btn'}
                          href={action.href}
                          promoCode={action.promoCode}
                          data-event={action.event}
                          data-platform={action.platform}
                          data-section={action.section}
                        >
                          {action.label}
                        </PromoLink>
                      ) : (
                        <a
                          key={`${card.title}-${action.label}-${action.href}`}
                          className={action.className || 'btn'}
                          href={action.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          data-event={action.event}
                          data-platform={action.platform}
                          data-section={action.section}
                        >
                          {action.label}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </article>
            )
          })
        )}
      </section>
    </>
  )
}
