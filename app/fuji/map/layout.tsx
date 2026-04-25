import type { Metadata } from 'next'

const title = '富士河口湖景點地圖｜富士山・河口湖・富士急景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '富士河口湖互動景點地圖。標示富士急樂園、河口湖纜車、遊覽船、音樂森林美術館等票券景點，以及大石公園、忍野八海、新倉山淺間公園、日川時計店、Lawson 打卡點、御殿場 Premium Outlet 等免費景點，加上精選住宿位置，含 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google 地圖導航。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/map' },
}

export default function FujiMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
