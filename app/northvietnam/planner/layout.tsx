import type { Metadata } from 'next'

const title = '北越景點排序工具｜地圖上安排河內、下龍灣、沙壩行程'
const description =
  '用北越景點排序工具把河內、下龍灣、沙壩和陸龍灣想去的景點、票券、商店和住宿加入清單，拖曳排列順序，並在地圖上確認位置。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/planner',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/planner' },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function NorthVietnamPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
