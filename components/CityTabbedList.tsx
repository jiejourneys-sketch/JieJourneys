'use client'

import { useMemo, useState } from 'react'
import AreaTabs, { type TabItem } from '@/components/AreaTabs'

export type CityCardAction = {
  label: string
  href: string
  className?: string
  event?: string
  platform?: string
  section?: string
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
}

type Props = {
  tabs: TabItem[]
  cards: CityCard[]
  tabEvent: string
}

export default function CityTabbedList({ tabs, cards, tabEvent }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [hasSelectedTab, setHasSelectedTab] = useState(false)

  const shownCards = useMemo(
    () => cards.filter((card) => activeTab === 'all' || card.area === activeTab),
    [activeTab, cards],
  )

  return (
    <>
      <AreaTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(value) => {
          setActiveTab(value)
          setHasSelectedTab(true)
        }}
        gtagEvent={tabEvent}
        showActive={hasSelectedTab}
      />
      <section className="stay-list" id="stayList">
        {shownCards.map((card) => {
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
                  {card.actions.map((action) => (
                    <a
                      key={`${card.title}-${action.label}-${action.href}`}
                      className={action.className || 'btn'}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-event={action.event}
                      data-platform={action.platform}
                      data-section={action.section}
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}
