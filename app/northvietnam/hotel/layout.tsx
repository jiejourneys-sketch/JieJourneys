import type { Metadata } from 'next'

const title = '越南北越自由行住宿推薦｜河內・沙壩・下龍灣・陸龍灣住哪裡？區域分析 | JieJourneys(旅杰)'
const description =
  '越南北越住宿怎麼選？河內老城區交通方便，適合作各地出發基地；沙壩可選市區飯店或山間梯田民宿，體驗截然不同；下龍灣直接入住遊輪最有體驗感也省交通；陸龍灣寧靜小鎮適合放慢節奏。各區特色與行程安排一次整理，幫你快速決定住哪最順。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
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
