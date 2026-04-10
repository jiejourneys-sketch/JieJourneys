import type { ReactNode } from 'react'

type FaqItem = {
  q: string
  a: ReactNode
}

type Props = {
  title?: string
  /** 要顯示幾則就傳幾則；元件會全部 render，沒有筆數上限 */
  items: FaqItem[]
}

/**
 * FAQ 區塊：`items` 陣列有幾筆就呈現幾筆（無 slice / 隱藏上限）。
 */
export default function SeoFaqSection({ title = '常見問題', items }: Props) {
  return (
    <section className="seo-faq" id="seo-faq" aria-label="FAQ">
      <h2 className="seo-h2">{title}</h2>
      <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
        {items.map((item, index) => (
          <li key={index} className="seo-faq-item">
            <h3 className="seo-h3 seo-faq-q">
              <span className="seo-faq-qicon" aria-hidden="true">
                Q
              </span>
              <span>{item.q}</span>
            </h3>
            <p className="seo-faq-a">{item.a}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
