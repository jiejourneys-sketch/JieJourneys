import type { Metadata } from 'next'

const title = '富士河口湖票券攻略｜一日遊・二日遊・景點票購買總整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖票券攻略。整理富士急樂園、河口湖纜車、遊覽船、富士山五合目、音樂森林美術館、抹茶體驗、溫泉等熱門票券，以及包車一日遊、御殿場Outlet 行程安排，比較 KKDAY、KLOOK、Trip 平台價格與購票流程，幫你快速找到最划算的票券組合。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖票券',
    '富士山一日遊',
    '富士河口湖一日遊',
    '富士山五合目門票',
    '河口湖纜車',
    '忍野八海',
    '御殿場Outlet',
    '富士河口湖二日遊',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/ticket' },
}

export default function FujiTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
