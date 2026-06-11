import type { Metadata } from 'next'

const title = '大阪周遊券地圖｜免費互動地圖・Osaka Amazing Pass免費設施・優惠景點・店家優惠・一鍵GoogleMap導航'
const description =
  '大阪周遊券地圖整理了所有設施的位置，包含Osaka Amazing Pass 免費設施、優惠設施與店家優惠，也說明幾乎可免費搭大阪市區地鐵和巴士。包含通天閣、梅田藍天大廈、大阪城、道頓堀遊船、聖瑪麗亞號、天保山摩天輪、HEP FIVE 摩天輪等景點，可切換分類、查看高低價值標記、KKDAY、KLOOK、Trip 購買連結與 Google Map 導航。'
const image = 'https://www.jiejourneys.com/assets/osaka-passmap-og.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '大阪周遊券地圖',
    '大阪周遊卡地圖',
    'Osaka Amazing Pass',
    '大阪周遊券景點',
    '大阪周遊券免費設施',
    '大阪周遊券優惠設施',
    '大阪周遊券購買',
    '大阪周遊券KKDAY',
    '大阪周遊券KLOOK',
    '大阪周遊券Trip',
    '大阪周遊券划算',
    '大阪周遊券路線',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/pass-map',
    images: [{ url: image, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/pass-map' },
}

export default function OsakaPassMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
