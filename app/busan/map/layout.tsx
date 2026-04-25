import type { Metadata } from 'next'

const title = '釜山景點地圖｜海雲台・南浦洞・西面票券景點與住宿一覽 | JieJourneys(旅杰)'
const description =
  '釜山互動景點地圖。標示樂天世界、斜坡滑車、X the Sky 展望台、SPA LAND 汗蒸幕、松島纜車、Running Man 體驗館、釜山塔等票券景點，以及海雲台、甘川洞、廣安里等免費景點，加上四大住宿區精選飯店位置，含 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google 地圖導航。'

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
