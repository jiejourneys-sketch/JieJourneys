type Props = {
  id: string
  title: string
  intro: string
  destination: string
  agodaHref: string
  tripHref: string
  eventPrefix: string
}

export default function AccommodationAffiliatePanel({
  id,
  title,
  intro,
  destination,
  agodaHref,
  tripHref,
  eventPrefix,
}: Props) {
  const promotionId = `${eventPrefix}_accommodation`
  const links = [
    { label: 'Agoda 查房價', href: agodaHref, event: `${eventPrefix}_agoda`, platform: 'Agoda' },
    { label: 'Trip.com 查房價', href: tripHref, event: `${eventPrefix}_trip`, platform: 'Trip' },
  ]

  return (
    <section className="seo-content" id={id} aria-labelledby={`${id}-heading`}>
      <h2 className="seo-h2" id={`${id}-heading`}>{title}</h2>
      <div className="seo-prose">
        <p>{intro}</p>
        <div className="seo-buy-links seo-action-links" aria-label={`${destination}住宿比價平台`}>
          {links.map((link) => (
            <a
              className="seo-buy-link"
              href={link.href}
              key={link.platform}
              target="_blank"
              rel="sponsored noopener noreferrer"
              data-event={link.event}
              data-platform={link.platform}
              data-section="accommodation_affiliate"
              data-label={`${destination}住宿比價`}
              data-item={destination}
              data-promotion-id={promotionId}
              data-promotion-name={`${destination}住宿比價`}
              data-creative-slot="article_inline"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p><small>本區含聯盟連結；若完成預訂，本站可能獲得分潤，價格不會因此增加。房況與價格以平台頁面為準。</small></p>
      </div>
    </section>
  )
}
