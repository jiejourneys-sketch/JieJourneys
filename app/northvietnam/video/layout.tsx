import type { Metadata } from 'next'

const title = '北越自由行短影片攻略｜河內・下龍灣・沙壩・陸龍灣攻略全整理 | JieJourneys(旅杰)'
const description =
  '北越自由行短影片全整理：河內古城、火車街、下龍灣遊輪體驗、沙壩貓貓村與梯田、陸龍灣竹筏，加上越南簽證、換匯行前準備，切換標籤快速找到你要的影片。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/video' },
}

export default function NorthVietnamVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
