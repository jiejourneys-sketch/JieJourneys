'use client'

import { useShortVideoMenuAutoClose } from '@/components/shortVideoMenu'

type VideoLink = {
  label: string
  href: string
  event: string
  platform?: string
  primary?: boolean
}

function platformMeta(link: VideoLink) {
  const value = link.platform || link.label
  if (/youtube/i.test(value)) return { key: 'youtube', label: 'YouTube' }
  if (/instagram|ig/i.test(value)) return { key: 'instagram', label: 'IG' }
  return { key: 'other', label: value }
}

function externalProps(href: string) {
  const isExternal = /^https?:\/\//.test(href)
  return {
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined,
  }
}

function ExpandedSeoVideoLinkMenu({ label, links }: { label: string; links: VideoLink[] }) {
  const { detailsRef } = useShortVideoMenuAutoClose()

  return (
    <div className="seo-video-link-row" aria-label={label}>
      <details ref={detailsRef} name="short-video-menu" className="seo-video-menu">
        <summary>
          {label}
        </summary>
        <div className="seo-video-platforms">
          {links.map((link) => {
            const platform = platformMeta(link)
            return (
              <a
                key={`${link.label}-${link.href}`}
                className={`seo-video-platform seo-video-platform-${platform.key}`}
                href={link.href}
                {...externalProps(link.href)}
                data-event={link.event}
                data-platform={link.platform ?? link.label}
                data-section="video_link"
              >
                <span>{platform.label}</span>
              </a>
            )
          })}
        </div>
      </details>
    </div>
  )
}

export default function SeoVideoLinkMenu({ label, links }: { label: string; links: VideoLink[] }) {
  if (links.length === 0) return null

  if (links.length === 1) {
    const link = links[0]
    return (
      <div className="seo-video-link-row" aria-label={label}>
        <a
          className="seo-video-direct"
          href={link.href}
          {...externalProps(link.href)}
          data-event={link.event}
          data-platform={link.platform ?? link.label}
          data-section="video_link"
        >
          {label}
        </a>
      </div>
    )
  }

  return <ExpandedSeoVideoLinkMenu label={label} links={links} />
}
