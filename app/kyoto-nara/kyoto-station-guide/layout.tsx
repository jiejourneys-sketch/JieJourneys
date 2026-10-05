import type { Metadata } from 'next'
import {
  kyotoStationGuideCanonical,
  kyotoStationGuideDescription,
  kyotoStationGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: kyotoStationGuideTitle,
  description: kyotoStationGuideDescription,
  keywords: [
    '京都車站攻略',
    '京都站出口',
    '京都站中央口',
    '京都站八條口',
    '京都站南北自由通路',
    '京都 HARUKA',
    '京都站新幹線',
    '京都站近鐵',
    '京都站空中徑路',
    '京都站大階段',
    '京都拉麵小路',
  ],
  alternates: { canonical: kyotoStationGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoStationGuideTitle,
    description: kyotoStationGuideDescription,
    url: kyotoStationGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoStationGuideTitle,
    description: kyotoStationGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KyotoStationGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
