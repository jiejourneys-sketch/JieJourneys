import type { Metadata } from 'next'
import {
  busanNampoGuideCanonical,
  busanNampoGuideDescription,
  busanNampoGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanNampoGuideTitle,
  description: busanNampoGuideDescription,
  keywords: [
    '釜山南浦洞攻略',
    '南浦洞',
    'BIFF廣場',
    '釜山塔',
    '富平罐頭市場',
    '國際市場',
    '札嘎其市場',
    '樂天超市',
    '甘川洞文化村',
    '釜山自由行',
    '釜山景點',
    '南浦洞住宿',
  ],
  alternates: { canonical: busanNampoGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: busanNampoGuideTitle,
    description: busanNampoGuideDescription,
    url: busanNampoGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanNampoGuideTitle,
    description: busanNampoGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanNampoGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
