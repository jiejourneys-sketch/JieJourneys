import type { Metadata } from 'next'
import {
  busanGamcheonGuideCanonical,
  busanGamcheonGuideDescription,
  busanGamcheonGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanGamcheonGuideTitle,
  description: busanGamcheonGuideDescription,
  keywords: [
    '甘川洞文化村攻略',
    '甘川洞文化村',
    '釜山小王子',
    '新版小王子',
    '小王子之家',
    '釜山彩色村',
    '釜山拍照景點',
    '南浦洞甘川洞',
    '釜山自由行',
    '釜山景點',
  ],
  alternates: { canonical: busanGamcheonGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanGamcheonGuideTitle,
    description: busanGamcheonGuideDescription,
    url: busanGamcheonGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanGamcheonGuideTitle,
    description: busanGamcheonGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanGamcheonGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
