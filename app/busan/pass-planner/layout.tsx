import type { Metadata } from 'next'

const title = '釜山Pass景點排序工具｜地圖上排列 Visit Busan Pass 行程順序'
const description =
  '用釜山Pass景點排序工具把 Visit Busan Pass 想去的景點加入清單，拖曳排列順序，並在地圖上用數字標記與連線確認景點位置。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/pass-planner',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/pass-planner' },
}

export default function BusanPassPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
