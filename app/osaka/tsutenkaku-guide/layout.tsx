import type { Metadata } from 'next'
import {
  tsutenkakuGuideCanonical,
  tsutenkakuGuideDescription,
  tsutenkakuGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tsutenkakuGuideTitle,
  description: tsutenkakuGuideDescription,
  keywords: [
    '通天閣攻略',
    '大阪通天閣',
    '通天閣大阪周遊卡',
    '通天閣 Tower Slider',
    '通天閣 Dive Walk',
    '新世界商店街',
    '惠美須町站通天閣',
    '動物園前站通天閣',
  ],
  alternates: { canonical: tsutenkakuGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: tsutenkakuGuideTitle,
    description: tsutenkakuGuideDescription,
    url: tsutenkakuGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tsutenkakuGuideTitle,
    description: tsutenkakuGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TsutenkakuGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
