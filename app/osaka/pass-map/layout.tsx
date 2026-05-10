import type { Metadata } from 'next'

const title =
  '大阪周遊卡地圖｜通天閣、梅田藍天大廈、大阪城、道頓堀遊船免費景點 | JieJourneys(旅杰)'
const description =
  '大阪周遊卡 Osaka Amazing Pass 地圖整理免費設施、優惠設施與店家優惠，包含通天閣、梅田藍天大廈空中庭園、大阪城天守閣、大阪城御座船、道頓堀水上觀光船、聖瑪麗亞號、天保山大摩天輪、HEP FIVE 摩天輪、四天王寺、天王寺動物園等常見景點。可依免費景點、優惠景點、餐廳店家優惠分類查看，搭配價值標示與 Google Map 導航，幫你判斷大阪周遊卡怎麼排比較划算。'

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
