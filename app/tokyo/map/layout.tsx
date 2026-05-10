import type { Metadata } from 'next'

const title = '東京景點地圖｜上野・新宿・原宿・淺草・澀谷・富士山・河口湖票券景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '東京互動景點地圖。標示 SHIBUYA SKY、晴空塔、teamLab、東京鐵塔、淺草寺、台場獨角獸鋼彈等票券景點，以及新宿御苑、上野公園、代代木公園等免費景點，加上各區精選住宿位置，含 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google 地圖導航，依區域分類快速篩選。'

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
