import type { Metadata } from 'next'

const title = '富士河口湖・箱根景點地圖｜富士山・河口湖・富士急景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '富士河口湖與箱根景點地圖整合票券景點、免費景點與住宿位置：富士急樂園、河口湖纜車、遊覽船、音樂森林美術館、大石公園、忍野八海、五合目、西湖、箱根神社、大涌谷、蘆之湖、御殿場與山中湖都可切換查看，一鍵開啟 Google Map 導航。'

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
