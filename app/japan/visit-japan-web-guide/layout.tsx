import type { Metadata } from 'next'
import {
  visitJapanWebGuideCanonical,
  visitJapanWebGuideDescription,
  visitJapanWebGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: visitJapanWebGuideTitle,
  description: visitJapanWebGuideDescription,
  keywords: [
    'Visit Japan Web',
    '日本入境卡',
    '日本電子入境卡',
    '日本海關申報',
    'Visit Japan Web QR Code',
    '日本自由行行前準備',
  ],
  alternates: { canonical: visitJapanWebGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: visitJapanWebGuideTitle,
    description: visitJapanWebGuideDescription,
    url: visitJapanWebGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: visitJapanWebGuideTitle,
    description: visitJapanWebGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function VisitJapanWebGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
