import type { Metadata } from 'next'

const title = '富士河口湖票券攻略｜一日遊・二日遊・景點票購買總整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖票券攻略可用景點標籤快速篩選一日遊、二日遊與單景點門票。整理淺間公園、忍野八海、大石公園、山中湖、五合目、御殿場Outlet、河口湖纜車、遊覽船、富士急樂園，以及箱根神社、蘆之湖、大涌谷路線，並比較 KKDAY、KLOOK、Trip 價格與行程內容。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖票券',
    '富士山一日遊',
    '富士河口湖一日遊',
    '富士山五合目',
    '河口湖纜車',
    '河口湖遊覽船',
    '忍野八海',
    '大石公園',
    '淺間公園',
    '西湖療癒之里',
    '山中湖',
    '御殿場Outlet',
    '箱根一日遊',
    '箱根神社',
    '蘆之湖',
    '大涌谷',
    '箱根纜車',
    '箱根海賊船',
    '富士急樂園',
    'KABA水陸巴士',
    '富士野生動物園',
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
