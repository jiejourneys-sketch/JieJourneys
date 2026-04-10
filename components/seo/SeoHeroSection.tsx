type VideoLink = {
  label: string
  href: string
  /** legacy field, mapped to data-event */
  event?: string
  /** preferred explicit field mapped to data-event */
  dataEvent?: string
  platform?: string
}

type CtaLink = {
  label: string
  href: string
  /** legacy field, mapped to data-event */
  event?: string
  /** preferred explicit field mapped to data-event */
  dataEvent?: string
  platform?: string
}

type Props = {
  badge?: string
  h1: string
  intro?: string
  videoTitle?: string
  videoLinks?: VideoLink[]
  ctaLinks?: CtaLink[]
  eventPrefix?: string
  /** 右側品牌視覺區塊（可選） */
  showVisual?: boolean
}

export default function SeoHeroSection({
  badge,
  h1,
  intro,
  videoTitle = '短影音快速看懂',
  videoLinks = [],
  ctaLinks = [],
  eventPrefix = 'page',
  showVisual = true,
}: Props) {
  const KEYWORD = '釜山住宿'
  const [rawTitle, rawSubtitle] = h1.split('｜')
  const title = rawTitle?.trim() || h1
  const subtitle = rawSubtitle?.trim()

  const keywordIndex = title.indexOf(KEYWORD)
  const titleNode =
    keywordIndex >= 0 ? (
      <>
        {title.slice(0, keywordIndex)}
        <span className="hero-keyword">{KEYWORD}</span>
        {title.slice(keywordIndex + KEYWORD.length)}
      </>
    ) : (
      title
    )

  return (
    <section className="seo-hero" aria-label="Hero">
      <div className={showVisual ? 'hero-grid has-visual' : 'hero-grid'}>
        <div className="hero-left">
          {badge ? <div className="hero-badge">{badge}</div> : null}

          <h1 className="seo-h1">
            <span className="hero-title">{titleNode}</span>
            {subtitle ? <span className="hero-subtitle">{subtitle}</span> : null}
          </h1>

          {intro ? <p className="seo-lead">{intro}</p> : null}

          {videoLinks.length > 0 ? (
            <div className="hero-video">
              <div className="hero-video-label">{videoTitle}</div>
              <div className="hero-video-pills" role="list">
                {videoLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    className="hero-pill"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event={
                      link.dataEvent ?? link.event ?? `${eventPrefix}_${link.label.replace(/\s+/g, '')}`
                    }
                    data-platform={link.platform ?? link.label}
                    data-section="video"
                    role="listitem"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {ctaLinks.length > 0 ? (
            <div className="hero-cta" aria-label="Hero CTA">
              {ctaLinks.map((link) => (
                (() => {
                  const isHash = link.href.startsWith('#')
                  const isExternal = /^https?:\/\//.test(link.href)
                  return (
                <a
                  key={`${link.label}-${link.href}`}
                  className="hero-cta-btn"
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  data-event={
                    link.dataEvent ?? link.event ?? `${eventPrefix}_cta_${link.label.replace(/\s+/g, '')}`
                  }
                  data-platform={link.platform ?? link.label}
                  data-section="hero"
                >
                  {link.label}
                </a>
                  )
                })()
              ))}
            </div>
          ) : null}
        </div>

        {showVisual ? (
          <div className="hero-right" aria-hidden="true">
            <div className="hero-visual">
              <svg viewBox="0 0 360 240" className="hero-map" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 172 C 70 120, 98 128, 132 96 S 202 52, 252 76 S 300 128, 336 110" />
                <path d="M26 96 C 68 80, 110 62, 140 72 S 212 112, 256 120 S 310 96, 336 78" />
                <path d="M54 210 C 92 186, 126 170, 164 168 S 232 170, 284 154 S 320 132, 340 130" />
                <circle cx="82" cy="132" r="5" />
                <circle cx="156" cy="92" r="5" />
                <circle cx="238" cy="120" r="5" />
                <circle cx="300" cy="108" r="5" />
              </svg>
              <div className="hero-pin hero-pin-1" />
              <div className="hero-pin hero-pin-2" />
            </div>
          </div>
        ) : null}
      </div>

    </section>
  )
}

