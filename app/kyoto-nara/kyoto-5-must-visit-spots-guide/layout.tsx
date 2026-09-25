import type { Metadata } from 'next'
import {
  kyotoFiveMustVisitGuideCanonical,
  kyotoFiveMustVisitGuideDescription,
  kyotoFiveMustVisitGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: kyotoFiveMustVisitGuideTitle,
  description: kyotoFiveMustVisitGuideDescription,
  keywords: ['京都自由行', '京都必去景點', '京都景點推薦', '二條城', '金閣寺', '伏見稻荷', '清水寺', '下鴨神社'],
  alternates: { canonical: kyotoFiveMustVisitGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoFiveMustVisitGuideTitle,
    description: kyotoFiveMustVisitGuideDescription,
    url: kyotoFiveMustVisitGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoFiveMustVisitGuideTitle,
    description: kyotoFiveMustVisitGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KyotoFiveMustVisitGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
