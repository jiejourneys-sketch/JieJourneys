import type { Metadata } from 'next'

const title = '富士山一日遊與河口湖票券攻略｜大石公園、新倉山淺間公園、忍野八海、河口湖 | JieJourneys(旅杰)'
const description =
  '東京出發富士山、河口湖票券懶人包，整理富士山周遊券、富士山五合目、新倉山淺間公園、忍野八海、河口湖、大石公園、山中湖、御殿場 Outlet、箱根神社、蘆之湖、河口湖纜車、遊覽船、富士急樂園等熱門景點的一日遊、二日遊、包車與門票，方便比較 KKDAY、KLOOK、Trip 行程與預訂連結。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖票券',
    '富士山周遊券',
    'Mt Fuji Pass',
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
