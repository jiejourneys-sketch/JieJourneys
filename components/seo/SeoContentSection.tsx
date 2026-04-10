import type { ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
}

export default function SeoContentSection({ title = '住宿區域怎麼選？', children }: Props) {
  return (
    <section className="seo-content" aria-label="SEO 內容">
      {title ? <h2 className="seo-h2">{title}</h2> : null}
      <div className="seo-prose">{children}</div>
    </section>
  )
}

