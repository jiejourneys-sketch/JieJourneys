import type { Metadata } from 'next'
import {
  visitBusanPass24hRouteCanonical,
  visitBusanPass24hRouteDescription,
  visitBusanPass24hRouteTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: visitBusanPass24hRouteTitle,
  description: visitBusanPass24hRouteDescription,
  keywords: [
    '釜山通行證24小時',
    'Visit Busan Pass 24小時',
    '釜山Pass走法',
    '釜山通行證行程',
    '樂天世界釜山',
    'Skyline Luge釜山',
    'BUSAN X the SKY',
    '釜山遊艇',
    '海雲台海岸列車',
    '釜山自由行',
  ],
  alternates: { canonical: visitBusanPass24hRouteCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: visitBusanPass24hRouteTitle,
    description: visitBusanPass24hRouteDescription,
    url: visitBusanPass24hRouteCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: visitBusanPass24hRouteTitle,
    description: visitBusanPass24hRouteDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function VisitBusanPass24hRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
