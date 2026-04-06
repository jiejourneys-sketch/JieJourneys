import type { Metadata } from 'next'

const title = '東京景點地圖｜新宿・淺草・澀谷票券景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '東京自由行互動地圖：新宿、淺草、澀谷、池袋等熱門區域景點與住宿位置一覽，含 KKDAY/KLOOK/Trip 購買連結，一鍵開啟 Google 地圖導航，依區域分類篩選。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/map' },
}

export default function TokyoMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
