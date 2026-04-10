import type { Metadata } from 'next'

const title = '越南北越自由行住宿推薦｜河內・沙壩・下龍灣・陸龍灣住哪裡？區域分析 | JieJourneys(旅杰)'
const description =
  '越南北越住宿怎麼選？河內住老城區當基地、沙壩選市區或梯田民宿、下龍灣直接住遊輪。各區優缺點與行程安排一次整理，快速決定住哪裡最順。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/hotel' },
}

export default function NorthVietnamHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
