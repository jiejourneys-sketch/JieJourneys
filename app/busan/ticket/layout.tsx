import type { Metadata } from 'next'

const title = '釜山票券攻略｜一日遊・釜山Pass・膠囊列車・景點門票總整理 | JieJourneys(旅杰)'
const description =
  '釜山票券攻略整理釜山通行證、一日遊、膠囊列車、遊艇與熱門景點門票怎麼選，教你先用行程判斷要買 Pass、一日遊或單點票，再比較 KKDAY、KLOOK、Trip 連結。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山票券',
    '釜山一日遊',
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
    siteName: '旅杰 JieJourneys',
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
