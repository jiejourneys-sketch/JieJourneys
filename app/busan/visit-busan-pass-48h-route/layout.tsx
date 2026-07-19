import type { Metadata } from 'next'
import {
  visitBusanPass48hRouteCanonical,
  visitBusanPass48hRouteDescription,
  visitBusanPass48hRouteTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: visitBusanPass48hRouteTitle,
  description: visitBusanPass48hRouteDescription,
  keywords: [
    '釜山通行證48小時',
    'Visit Busan Pass 48小時',
    '釜山Pass路線',
    '釜山通行證行程',
    '甘川洞文化村',
    '松島海上纜車',
    '釜山塔',
    'Skyline Luge釜山',
    '海雲台海岸列車',
    '樂天世界釜山',
    '釜山自由行',
  ],
  alternates: { canonical: visitBusanPass48hRouteCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: visitBusanPass48hRouteTitle,
    description: visitBusanPass48hRouteDescription,
    url: visitBusanPass48hRouteCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: visitBusanPass48hRouteTitle,
    description: visitBusanPass48hRouteDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function VisitBusanPass48hRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
