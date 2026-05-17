import type { Metadata } from 'next'

const title = '東京景點地圖｜免費互動地圖・住宿票券美食・GoogleMap一鍵導航'
const description =
  '東京景點地圖整理新宿、澀谷、原宿、淺草、上野、東京車站、銀座、台場等熱門區域，並把票券景點、免費景點、商店美食與住宿推薦放在同一張免費互動地圖。可切換票券、景點、商店、住宿分類，查看 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google Map 導航。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '東京景點地圖',
    '東京地圖',
    '東京自由行地圖',
    '東京住宿地圖',
    '東京票券地圖',
    '東京Google Map',
    '新宿地圖',
    '澀谷地圖',
    '淺草地圖',
    '上野地圖',
    '東京車站地圖',
    '台場地圖',
  ],
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
