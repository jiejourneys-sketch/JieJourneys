'use client'

import { useState } from 'react'
import { CITY_TAB_SELECT_EVENT, type CityCard } from '@/components/CityTabbedList'
import { getGtag } from '@/lib/gtag'
import styles from './HotelQuickGuide.module.css'

export type HotelQuickGuideScenario = {
  id: string
  label: string
  area: string
  tabValue: string
  summary: string
  note: string
  hotels: Array<{
    title: string
    reason: string
  }>
}

type Props = {
  scenarios: HotelQuickGuideScenario[]
  cards: CityCard[]
  eventPrefix: string
  badge: string
  title: string
  description: string
  listAnchorId?: string
}

export default function HotelQuickGuide({
  scenarios,
  cards,
  eventPrefix,
  badge,
  title,
  description,
  listAnchorId = 'stayListTitle',
}: Props) {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id ?? '')
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0]

  if (!activeScenario) return null

  const recommendations = activeScenario.hotels
    .map((recommendation) => {
      const hotel = cards.find((card) => card.title === recommendation.title)
      return hotel ? { ...recommendation, hotel } : null
    })
    .filter((recommendation): recommendation is HotelQuickGuideScenario['hotels'][number] & { hotel: CityCard } => recommendation !== null)

  const selectMobileScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId)
    const scenario = scenarios.find((item) => item.id === scenarioId)
    const gtag = getGtag()
    if (!scenario || typeof gtag !== 'function') return
    gtag('event', `${eventPrefix}_quick_choice`, {
      page_path: window.location.pathname,
      page_type: 'hotel',
      label: scenario.label,
      area: scenario.area,
      section: 'quick_choice',
      placement: 'hotel_page_top_mobile',
      input_type: 'select',
    })
  }

  const showAreaHotelList = () => {
    window.dispatchEvent(new CustomEvent(CITY_TAB_SELECT_EVENT, { detail: { value: activeScenario.tabValue } }))
  }

  const titleId = `${eventPrefix}-quick-title`
  const panelId = `${eventPrefix}-quick-result`
  const mobileSelectId = `${eventPrefix}-quick-mobile-scenario`

  return (
    <section className={styles.guide} aria-labelledby={titleId}>
      <div className={styles.heading}>
        <span>{badge}</span>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>

      <div className={styles.scenarioTabs} role="tablist" aria-label="住宿情境選擇">
        {scenarios.map((scenario) => {
          const active = scenario.id === activeScenario.id
          return (
            <button
              key={scenario.id}
              id={`${eventPrefix}-quick-tab-${scenario.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={panelId}
              className={active ? styles.activeScenario : undefined}
              data-event={`${eventPrefix}_quick_choice`}
              data-label={scenario.label}
              data-area={scenario.area}
              data-section="quick_choice"
              data-placement="hotel_page_top"
              data-page-type="hotel"
              onClick={() => setActiveScenarioId(scenario.id)}
            >
              {scenario.label}
            </button>
          )
        })}
      </div>

      <label className={styles.mobileScenarioSelect} htmlFor={mobileSelectId}>
        <span>這趟旅行最重視什麼？</span>
        <select
          id={mobileSelectId}
          value={activeScenario.id}
          onChange={(event) => selectMobileScenario(event.target.value)}
        >
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>{scenario.label}</option>
          ))}
        </select>
      </label>

      <div
        id={panelId}
        className={styles.result}
        role="tabpanel"
        aria-labelledby={`${eventPrefix}-quick-tab-${activeScenario.id}`}
      >
        <div className={styles.areaSummary}>
          <div className={styles.areaTitle}>
            <span>推薦先看</span>
            <h3>{activeScenario.area}</h3>
          </div>
          <p>{activeScenario.summary}</p>
          <small className={styles.desktopAreaNote}>{activeScenario.note}</small>
          <details className={styles.mobileAreaNote}>
            <summary>選這區要注意</summary>
            <small>{activeScenario.note}</small>
          </details>
        </div>

        <div className={styles.hotelGrid} data-card-count={Math.min(recommendations.length, 3)}>
          {recommendations.map(({ hotel, reason }) => {
            const bookingActions = hotel.actions.filter(
              (action) => action.platform === 'Trip' || action.platform === 'Agoda' || action.platform === 'Booking',
            )
            return (
              <article className={styles.hotelCard} key={`${activeScenario.id}-${hotel.title}`} data-hotel={hotel.title} data-area={hotel.area}>
                <div>
                  <span className={styles.pickReason}>{reason}</span>
                  <h3 className="title">{hotel.title}</h3>
                  <p>{hotel.meta}</p>
                </div>
                <div className={styles.hotelActions}>
                  {bookingActions.map((action) => (
                    <a
                      key={`${hotel.title}-${action.platform}`}
                      className={action.platform === 'Trip' ? styles.primaryAction : styles.secondaryAction}
                      href={action.href}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      aria-label={`${hotel.title} ${action.platform} 訂房連結`}
                      data-event={`${eventPrefix}_quick_affiliate`}
                      data-platform={action.platform}
                      data-hotel={hotel.title}
                      data-area={hotel.area}
                      data-item={hotel.datasetValue ?? hotel.title}
                      data-item-id={hotel.datasetValue ?? hotel.title}
                      data-item-name={hotel.title}
                      data-label={`${activeScenario.label}｜${hotel.title}`}
                      data-section="quick_pick"
                      data-placement="hotel_page_top"
                      data-page-type="hotel"
                    >
                      {action.platform}
                    </a>
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <div className={styles.resultFooter}>
          <a
            href={`#${listAnchorId}`}
            data-event={`${eventPrefix}_quick_full_list`}
            data-label={activeScenario.label}
            data-area={activeScenario.area}
            data-section="quick_pick"
            data-placement="hotel_page_top"
            onClick={showAreaHotelList}
          >
            查看{activeScenario.area}全部飯店 ↓
          </a>
        </div>
      </div>
    </section>
  )
}
