import type { Metadata } from 'next'

const title = '釜山自由行攻略｜住宿・交通・票券・景點全整理 | JieJourneys(旅杰)'
const description =
  '釜山自由行全攻略。整理海雲台、廣安里、西面、南浦洞、甘川洞文化村等熱門景點玩法，釜山Pass 24/48小時走法比較，eSIM 通訊與 T-Money 交通卡設定，金海機場到市區方式，以及四大住宿區選區分析，一站搞定釜山行前規劃。'

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
