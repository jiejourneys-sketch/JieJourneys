import type { Metadata } from 'next'
import {
  busanPreparationGuideCanonical,
  busanPreparationGuideDescription,
  busanPreparationGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanPreparationGuideTitle,
  description: busanPreparationGuideDescription,
  keywords: [
    '釜山自由行行前準備',
    '釜山自由行',
    '釜山5天4夜',
    'K-ETA 台灣',
    '韓國電子入境卡',
    'e-Arrival card',
    '釜山通行證48小時',
    '釜山叫車',
    'Kakao T',
    'k.ride',
    'Naver Map',
  ],
  alternates: { canonical: busanPreparationGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanPreparationGuideTitle,
    description: busanPreparationGuideDescription,
    url: busanPreparationGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanPreparationGuideTitle,
    description: busanPreparationGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanPreparationGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
