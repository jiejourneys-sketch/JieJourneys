import styles from './AffiliateDecisionPanel.module.css'

export type AffiliateDecisionOption = {
  intent: string
  title: string
  description: string
  action: string
  href: string
  event: string
  platform: string
}

type Props = {
  id: string
  eyebrow: string
  heading: string
  intro: string
  options: AffiliateDecisionOption[]
}

export default function AffiliateDecisionPanel({ id, eyebrow, heading, intro, options }: Props) {
  return (
    <aside className={styles.panel} id={id} aria-labelledby={`${id}-heading`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.heading} id={`${id}-heading`}>{heading}</h2>
      <p className={styles.intro}>{intro}</p>
      <div className={styles.grid}>
        {options.map((option) => (
          <a
            className={styles.card}
            href={option.href}
            key={option.event}
            target="_blank"
            rel="sponsored noopener noreferrer"
            data-event={option.event}
            data-platform={option.platform}
            data-section="affiliate_next_step"
            data-label={option.title}
            data-item={option.intent}
            data-promotion-id="kyushu_travel_next_step"
            data-promotion-name="九州旅遊下一步"
            data-creative-slot="article_inline"
          >
            <span className={styles.intent}>{option.intent}</span>
            <strong>{option.title}</strong>
            <span className={styles.cardDescription}>{option.description}</span>
            <span className={styles.action}>{option.action} <span aria-hidden="true">→</span></span>
          </a>
        ))}
      </div>
    </aside>
  )
}
