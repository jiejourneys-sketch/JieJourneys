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
}

export type CityCard = {
  title: string
  meta: string
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
                <p className="meta">{card.meta}</p>
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
