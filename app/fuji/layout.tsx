import type { Metadata } from 'next'

const title = '富士河口湖自由行攻略｜景點・票券・住宿・交通全整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖自由行攻略整理景點、票券、住宿、交通與地圖：淺間公園五重塔、忍野八海、大石公園、河口湖纜車、遊覽船、富士急樂園、御殿場Outlet、五合目與箱根路線一次看。比較逆富士住宿、近車站飯店、富士回遊、高速巴士與 eSIM，東京出發也能快速規劃。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖自由行',
    '富士河口湖攻略',
    '富士山一日遊',
    '忍野八海',
    '淺間公園',
    '大石公園',
    '御殿場Outlet',
    '富士山五合目',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji' },
}

export default function FujiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
