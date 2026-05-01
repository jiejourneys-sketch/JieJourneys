import type { Metadata } from 'next'

const title = '釜山景點地圖｜海雲台・南浦洞・西面票券景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '釜山景點地圖把票券、免費景點、美食與住宿放在同一張互動地圖：海雲台、廣安里、南浦洞、甘川文化村、松島纜車、釜山塔、X the Sky、SPA LAND 等位置一目了然，可切換分類、查看購票連結並一鍵開啟 Google Map 或 Naver Map 導航。'

export const metadata: Metadata = {
  title,
  description,
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
