import type { Metadata } from 'next'

const title = '大阪周遊券景點排序工具｜地圖上排列 Osaka Amazing Pass 行程順序'
const description =
  '用大阪周遊券景點排序工具把 Osaka Amazing Pass 想去的免費設施、優惠設施和店家優惠加入清單，拖曳排列順序，並在地圖上用數字標記與連線確認景點位置。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/pass-planner',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/pass-planner' },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function OsakaPassPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
