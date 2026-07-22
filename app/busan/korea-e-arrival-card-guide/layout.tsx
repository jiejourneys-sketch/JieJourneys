import type { Metadata } from 'next'
import {
  koreaEArrivalCardGuideCanonical,
  koreaEArrivalCardGuideDescription,
  koreaEArrivalCardGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: koreaEArrivalCardGuideTitle,
  description: koreaEArrivalCardGuideDescription,
  keywords: [
    '韓國電子入境卡',
    'e-Arrival card',
    '韓國入境卡',
    '韓國電子入境申報',
    '韓國入境資料',
    '釜山自由行入境',
  ],
  alternates: { canonical: koreaEArrivalCardGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: koreaEArrivalCardGuideTitle,
    description: koreaEArrivalCardGuideDescription,
    url: koreaEArrivalCardGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: koreaEArrivalCardGuideTitle,
    description: koreaEArrivalCardGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KoreaEArrivalCardGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
