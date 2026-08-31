import type { Metadata } from 'next'
import {
  busanFastGuideCanonical,
  busanFastGuideDescription,
  busanFastGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanFastGuideTitle,
  description: busanFastGuideDescription,
  keywords: [
    '釜山最速攻略',
    '釜山自由行',
    '釜山區域攻略',
    '西面',
    '南浦洞',
    '海雲台',
    '松島',
    '廣安里',
    '樂天世界釜山',
    '海東龍宮寺',
    '釜山行程安排',
    '釜山景點',
  ],
  alternates: { canonical: busanFastGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanFastGuideTitle,
    description: busanFastGuideDescription,
    url: busanFastGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanFastGuideTitle,
    description: busanFastGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanFastGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
