import type { Metadata } from 'next'

const title = '釜山住宿攻略｜第一次去住哪四大區？海雲台・西面・廣安里・南浦洞重點比較'
const description =
  '釜山住宿攻略整理海雲台、廣安里、西面、南浦洞四大區域差異，從看海、夜景、交通、逛街美食與行程天數判斷住哪裡最順，並附釜山住宿地圖與飯店比價連結。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山住宿推薦',
    '釜山住哪裡',
    '釜山飯店推薦',
    '海雲台住宿',
    '西面住宿',
    '廣安里住宿',
    '南浦洞住宿',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/hotel' },
}

export default function BusanHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
