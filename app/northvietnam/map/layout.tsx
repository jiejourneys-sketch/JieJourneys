import type { Metadata } from 'next'

const title = '北越景點地圖｜河內・下龍灣・沙壩・陸龍灣景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '北越自由行互動地圖：河內、下龍灣、沙壩、陸龍灣景點與住宿位置一覽，含 KKDAY/KLOOK/Agoda 購買連結，一鍵開啟 Google 地圖導航，依分類快速篩選。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/map' },
}

export default function NorthVietnamMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
