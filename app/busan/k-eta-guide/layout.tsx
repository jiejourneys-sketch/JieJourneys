import type { Metadata } from 'next'
import { kEtaGuideCanonical, kEtaGuideDescription, kEtaGuideTitle } from './pageMeta'

export const metadata: Metadata = {
  title: kEtaGuideTitle,
  description: kEtaGuideDescription,
  keywords: [
    'K-ETA',
    '韓國K-ETA',
    'K-ETA 台灣',
    'K-ETA 2026',
    '韓國免申請K-ETA',
    '韓國電子旅行許可',
    '韓國入境',
    '釜山自由行入境',
  ],
  alternates: { canonical: kEtaGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: kEtaGuideTitle,
    description: kEtaGuideDescription,
    url: kEtaGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kEtaGuideTitle,
    description: kEtaGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KEtaGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
