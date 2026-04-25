import type { Metadata } from 'next'

const title = '釜山票券攻略｜釜山Pass・膠囊列車・景點門票購買總整理 | JieJourneys(旅杰)'
const description =
  '釜山票券攻略。整理釜山Pass 24/48小時涵蓋景點與值不值得買分析，膠囊列車訂票方式，樂天世界、X the Sky 展望台、松島纜車、SPA LAND 汗蒸幕、Running Man 體驗館等單景點門票，比較 KKDAY、KLOOK、Trip 平台價格，幫你快速找到最划算的票券組合。'

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
