import type { Metadata } from 'next'

const title = '大阪景點地圖｜免費互動地圖・住宿票券景點・Google一鍵導航'
const description =
  '大阪景點地圖整理難波、心齋橋、梅田、天王寺、環球影城、大阪城、海遊館、道頓堀等熱門區域，並把票券景點、免費景點與住宿推薦放在同一張免費互動地圖。可切換票券、景點、住宿分類，查看 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google Map 導航。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '大阪景點地圖',
    '大阪地圖',
    '大阪自由行地圖',
    '大阪住宿地圖',
    '大阪票券地圖',
    '大阪Google Map',
    '難波地圖',
    '心齋橋地圖',
    '梅田地圖',
    '大阪環球影城地圖',
    '大阪城地圖',
    '道頓堀地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/map' },
}

export default function OsakaMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
