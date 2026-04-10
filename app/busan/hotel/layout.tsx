import type { Metadata } from 'next'

const title = '釜山住宿推薦｜海雲台、廣安里、西面、南浦洞區域分析 | JieJourneys(旅杰)'
const description =
  '釜山住哪裡？海雲台看海、廣安里夜景、西面交通方便、南浦洞吃逛最方便。完整住宿區域分析＋飯店推薦與比價，快速找到最適合你的釜山住宿。'

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
    siteName: 'JieJourneys(旅杰)',
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
