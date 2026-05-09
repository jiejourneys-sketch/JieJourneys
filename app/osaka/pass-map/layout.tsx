import type { Metadata } from 'next'

const title = '大阪周遊券地圖｜免費設施・優惠設施・店家優惠一覽 | JieJourneys(旅杰)'
const description =
  '大阪周遊券地圖整理 Osaka Amazing Pass 涵蓋的免費設施、優惠設施與店家優惠，依類型與價值用顏色區分，方便安排大阪周遊券路線與一鍵開啟 Google Map 導航。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/pass-map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/pass-map' },
}

export default function OsakaPassMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
