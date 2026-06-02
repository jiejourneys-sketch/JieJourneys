import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const PLANNER_URL = 'https://www.jiejourneys.com/tools/planner'
const OG_IMAGE = 'https://www.jiejourneys.com/assets/og-share.png'
const description =
  '旅杰行程（JieJourneys Planner）是一款免費的自由行行程規劃工具，可整理景點、住宿、美食餐廳、交通資訊、備註與 Google 地圖連結，輕鬆規劃日本、韓國、越南等旅遊行程，並快速分享給朋友或手機查看。'

export const metadata: Metadata = {
  metadataBase: new URL(PLANNER_URL),
  title: '旅杰行程｜JieJourneys Planner',
  description,
  alternates: {
    canonical: PLANNER_URL,
  },
  icons: { icon: '/assets/logo.jpg', apple: '/assets/logo.jpg' },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: PLANNER_URL,
    siteName: 'JieJourneys',
    title: '旅杰行程｜JieJourneys Planner',
    description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: '旅杰行程 JieJourneys Planner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '旅杰行程｜JieJourneys Planner',
    description,
    images: [OG_IMAGE],
  },
}

export default function ToolsPlannerLayout({ children }: { children: ReactNode }) {
  return children
}
