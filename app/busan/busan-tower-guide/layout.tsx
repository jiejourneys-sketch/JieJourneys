import type { Metadata } from 'next'
import {
  busanTowerGuideCanonical,
  busanTowerGuideDescription,
  busanTowerGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanTowerGuideTitle,
  description: busanTowerGuideDescription,
  keywords: [
    '釜山塔攻略',
    '釜山塔',
    'Busan Tower',
    'Diamond Tower',
    '龍頭山公園',
    '釜山塔手扶梯',
    '釜山塔夜景',
    '釜山塔光雕煙火秀',
    '南浦洞釜山塔',
    '釜山自由行',
    '釜山景點',
  ],
  alternates: { canonical: busanTowerGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanTowerGuideTitle,
    description: busanTowerGuideDescription,
    url: busanTowerGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanTowerGuideTitle,
    description: busanTowerGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanTowerGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
