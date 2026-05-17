import type { Metadata } from 'next'

const title = '釜山自由行攻略｜第一次去釜山行程・住宿・交通・景點地圖'
const description =
  '第一次釜山自由行從這裡開始：整理海雲台、廣安里、西面、南浦洞、甘川文化村動線，釜山Pass 24/48小時玩法，金海機場交通、eSIM、T-Money、住宿選區、票券比較與免費互動地圖，快速排出好走行程。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan' },
}

export default function BusanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
