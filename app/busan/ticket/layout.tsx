import type { Metadata } from 'next'

const title = '釜山票券攻略｜釜山Pass・膠囊列車・景點門票購買總整理 | JieJourneys(旅杰)'
const description =
  '釜山票券怎麼買？整理釜山Pass（24/48小時）、膠囊列車、景點門票是否包含與購買方式，比較 KKDAY / KLOOK / Trip，快速找到最適合的票券組合。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山票券',
    '釜山通行證',
    '釜山Pass',
    '膠囊列車訂票',
    '釜山景點門票',
    '釜山Pass 48小時',
    '釜山Pass 24小時',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/ticket' },
}

export default function BusanTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
