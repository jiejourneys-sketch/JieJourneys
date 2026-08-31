import type { Metadata } from 'next'
import {
  visitBusanPassCanonical,
  visitBusanPassDescription,
  visitBusanPassTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: visitBusanPassTitle,
  description: visitBusanPassDescription,
  keywords: [
    '釜山通行證',
    'Visit Busan Pass',
    '釜山Pass',
    '釜山通行證景點',
    'Visit Busan Pass Big3',
    'Visit Busan Pass Big5',
    '釜山通行證地圖',
    '釜山膠囊列車',
    '釜山自由行',
  ],
  alternates: { canonical: visitBusanPassCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: visitBusanPassTitle,
    description: visitBusanPassDescription,
    url: visitBusanPassCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/og-share.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: visitBusanPassTitle,
    description: visitBusanPassDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function VisitBusanPassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
