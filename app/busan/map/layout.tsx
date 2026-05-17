import type { Metadata } from 'next'

const title = '釜山景點地圖｜免費互動地圖・住宿票券商店・GoogleMap/NaverMap一鍵導航'
const description =
  '釜山景點地圖整理了所有熱門景點的位置，包含海雲台、廣安里、西面、南浦洞、甘川文化村、松島纜車、釜山塔、X the Sky、SPA LAND 等位置，並把住宿推薦、票券景點、商店美食放在同一張免費互動地圖。可切換票券、景點、商店、住宿分類，查看 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google Map 或 Naver Map 導航。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山景點地圖',
    '釜山地圖',
    '釜山自由行地圖',
    '釜山住宿地圖',
    '釜山票券地圖',
    '釜山Google Map',
    '釜山Naver Map',
    '海雲台地圖',
    '西面地圖',
    '南浦洞地圖',
    '廣安里地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/map' },
}

export default function BusanMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
