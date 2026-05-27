import type { Metadata } from 'next'

const title = '東京景點排序工具｜地圖上安排東京自由行順序'
const description =
  '用東京景點排序工具把東京自由行想去的景點、票券、商店和住宿加入清單，拖曳排列順序，並在地圖上用數字標記與連線確認位置。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/planner',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/planner' },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function TokyoPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
