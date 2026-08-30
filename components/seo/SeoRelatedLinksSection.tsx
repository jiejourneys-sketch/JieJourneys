import SeoPurchaseMenu from '@/components/seo/SeoPurchaseMenu'

type RelatedLink = {
  label: string
  href: string
  event: string
  primary?: boolean
  affiliate?: boolean
  platform?: string
}

type Props = {
  title?: string
  intro?: string
  links: RelatedLink[]
  purchaseLabel?: string
  purchaseOptions?: RelatedLink[]
}

export default function SeoRelatedLinksSection({
  title = '接著規劃你的行程',
  intro,
  links,
  purchaseLabel,
  purchaseOptions = [],
}: Props) {
  const hasAffiliate = links.some((link) => link.affiliate) || purchaseOptions.length > 0

  return (
    <section className="seo-content" aria-label={title}>
      <h2 className="seo-h2">{title}</h2>
      <div className="seo-prose">
        {intro ? <p>{intro}</p> : null}
        {hasAffiliate ? (
          <p><small>本頁含聯盟行銷連結；若透過連結完成訂購，旅杰可能獲得佣金。</small></p>
        ) : null}
        <div className="seo-buy-links seo-action-links">
          {links.map((link) => {
            const external = /^https?:\/\//.test(link.href)
            return (
              <a
                key={link.event}
                className={`seo-buy-link${link.primary ? ' primary' : ''}`}
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? (link.affiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer') : undefined}
                data-event={link.event}
                data-platform={link.platform ?? (link.affiliate ? 'affiliate' : external ? 'external' : 'internal')}
                data-section="related_links"
              >
                {link.label}
              </a>
            )
          })}
          {purchaseOptions.length > 0 ? <SeoPurchaseMenu label={purchaseLabel} options={purchaseOptions} /> : null}
        </div>
      </div>
    </section>
  )
}
