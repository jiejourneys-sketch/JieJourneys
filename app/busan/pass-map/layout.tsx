import type { Metadata } from 'next'

const title = '釜山通行證地圖｜景點價格高中低分類與順路路線規劃 | JieJourneys(旅杰)'
const description =
  '釜山通行證景點地圖整理 Visit Busan Pass 可用設施，依票價與使用價值分成價格高、中、低三類，標在互動地圖上方便比較位置、安排順路動線，規劃 24/48 小時通行證怎麼玩最划算。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山通行證地圖',
    '釜山Pass地圖',
    'Visit Busan Pass',
    '釜山通行證景點',
    '釜山通行證路線',
    '釜山自由行地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/pass-map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/pass-map' },
}

export default function BusanPassMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
