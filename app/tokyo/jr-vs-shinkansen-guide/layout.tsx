import type { Metadata } from 'next'
import {
  jrVsShinkansenGuideCanonical,
  jrVsShinkansenGuideDescription,
  jrVsShinkansenGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: jrVsShinkansenGuideTitle,
  description: jrVsShinkansenGuideDescription,
  keywords: [
    'JR 新幹線差別',
    '日本JR怎麼搭',
    '在來線 特急 快速 普通 差別',
    '新幹線 特急券',
    'JR Pass 希望號',
    'JR Pass 瑞穗號',
    '日本自由行交通',
  ],
  alternates: { canonical: jrVsShinkansenGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: jrVsShinkansenGuideTitle,
    description: jrVsShinkansenGuideDescription,
    url: jrVsShinkansenGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: jrVsShinkansenGuideTitle,
    description: jrVsShinkansenGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function JrVsShinkansenGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
