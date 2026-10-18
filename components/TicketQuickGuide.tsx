'use client'

import { useState } from 'react'
import { CITY_TAB_SELECT_EVENT, type CityCard } from '@/components/CityTabbedList'
import { getGtag } from '@/lib/gtag'
import styles from './TicketQuickGuide.module.css'

export type TicketQuickGuideScenario = {
  id: string
  label: string
  category: string
  tabValue: string
  summary: string
  note: string
  listLinkLabel?: string
  tickets: Array<{
    title: string
    reason: string
  }>
}

type Props = {
  scenarios: TicketQuickGuideScenario[]
  cards: CityCard[]
  eventPrefix: string
  badge: string
  title: string
  description: string
  listAnchorId?: string
}

const affiliatePlatforms = new Set(['KKDAY', 'KLOOK', 'Trip'])

export default function TicketQuickGuide({
  scenarios,
  cards,
  eventPrefix,
  badge,
  title,
  description,
  listAnchorId = 'ticketListTitle',
}: Props) {
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id ?? '')
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? scenarios[0]

  if (!activeScenario) return null

  const recommendations = activeScenario.tickets
    .map((recommendation) => {
      const ticket = cards.find((card) => card.title === recommendation.title)
      return ticket ? { ...recommendation, ticket } : null
    })
    .filter((recommendation): recommendation is TicketQuickGuideScenario['tickets'][number] & { ticket: CityCard } => recommendation !== null)

  const selectMobileScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId)
    const scenario = scenarios.find((item) => item.id === scenarioId)
    const gtag = getGtag()
    if (!scenario || typeof gtag !== 'function') return
    gtag('event', `${eventPrefix}_quick_choice`, {
      page_path: window.location.pathname,
      page_type: 'ticket',
      label: scenario.label,
      area: scenario.category,
      section: 'quick_choice',
      placement: 'ticket_page_top_mobile',
      input_type: 'select',
    })
  }

  const showCategoryTicketList = () => {
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

      <div className={styles.scenarioTabs} role="tablist" aria-label="票券需求選擇">
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
              data-area={scenario.category}
              data-section="quick_choice"
              data-placement="ticket_page_top"
              data-page-type="ticket"
              onClick={() => setActiveScenarioId(scenario.id)}
            >
              {scenario.label}
            </button>
          )
        })}
      </div>

      <label className={styles.mobileScenarioSelect} htmlFor={mobileSelectId}>
        <span>這趟最想安排什麼？</span>
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
        <div className={styles.categorySummary}>
          <div className={styles.categoryTitle}>
            <span>這類先看</span>
            <h3>{activeScenario.category}</h3>
          </div>
          <p>{activeScenario.summary}</p>
          <small className={styles.desktopCategoryNote}>{activeScenario.note}</small>
          <details className={styles.mobileCategoryNote}>
            <summary>購買前要注意</summary>
            <small>{activeScenario.note}</small>
          </details>
        </div>

        <div className={styles.ticketGrid} data-card-count={Math.min(recommendations.length, 3)}>
          {recommendations.map(({ ticket, reason }) => {
            const ticketActions = ticket.actions.filter((action) =>
              affiliatePlatforms.has(action.platform ?? '') || action.platform === 'internal',
            )

            return (
              <article
                className={styles.ticketCard}
                key={`${activeScenario.id}-${ticket.title}`}
                data-ticket={ticket.title}
                data-area={ticket.area}
              >
                <div>
                  <span className={styles.pickReason}>{reason}</span>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.note ?? ticket.meta}</p>
                </div>
                <div className={styles.ticketActions} data-action-count={ticketActions.length}>
                  {ticketActions.map((action, actionIndex) => {
                    const isExternal = /^https?:\/\//.test(action.href)
                    const isAffiliate = affiliatePlatforms.has(action.platform ?? '')
                    const isPrimary = action.className?.includes('primary') || actionIndex === 0

                    return (
                      <a
                        key={`${ticket.title}-${action.label}-${action.href}`}
                        className={isPrimary ? styles.primaryAction : styles.secondaryAction}
                        href={action.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? (isAffiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer') : undefined}
                        aria-label={`${ticket.title} ${action.label}`}
                        data-event={`${eventPrefix}_${isAffiliate ? 'quick_affiliate' : 'quick_internal'}`}
                        data-platform={action.platform}
                        data-area={ticket.area}
                        data-item={ticket.datasetValue ?? ticket.title}
                        data-item-id={ticket.datasetValue ?? ticket.title}
                        data-item-name={ticket.title}
                        data-label={`${activeScenario.label}｜${ticket.title}`}
                        data-section="quick_pick"
                        data-placement="ticket_page_top"
                        data-page-type="ticket"
                      >
                        {action.label}
                      </a>
                    )
                  })}
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
            data-area={activeScenario.category}
            data-section="quick_pick"
            data-placement="ticket_page_top"
            data-page-type="ticket"
            onClick={showCategoryTicketList}
          >
            {activeScenario.listLinkLabel ?? `查看全部${activeScenario.category}票券 ↓`}
          </a>
        </div>
      </div>
    </section>
  )
}
