import type { Metadata } from 'next'
import {
  tokyoSubwayVsJrGuideCanonical,
  tokyoSubwayVsJrGuideDescription,
  tokyoSubwayVsJrGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoSubwayVsJrGuideTitle,
  description: tokyoSubwayVsJrGuideDescription,
  keywords: [
    '東京地鐵 JR 差別',
    '東京地鐵 vs JR',
    '東京 Metro 都營地鐵',
    '東京山手線',
    '東京交通攻略',
    'Suica PASMO',
    'Tokyo Subway Ticket',
    '東京自由行交通',
  ],
  alternates: { canonical: tokyoSubwayVsJrGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: tokyoSubwayVsJrGuideTitle,
    description: tokyoSubwayVsJrGuideDescription,
    url: tokyoSubwayVsJrGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoSubwayVsJrGuideTitle,
    description: tokyoSubwayVsJrGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoSubwayVsJrGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
