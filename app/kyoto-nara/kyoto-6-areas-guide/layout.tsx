import type { Metadata } from 'next'
import {
  kyotoSixAreasGuideCanonical,
  kyotoSixAreasGuideDescription,
  kyotoSixAreasGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: kyotoSixAreasGuideTitle,
  description: kyotoSixAreasGuideDescription,
  keywords: ['京都自由行', '京都區域', '京都景點分區', '京都行程安排', '京都車站', '清水寺', '嵐山', '伏見稻荷'],
  alternates: { canonical: kyotoSixAreasGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoSixAreasGuideTitle,
    description: kyotoSixAreasGuideDescription,
    url: kyotoSixAreasGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/kyoto-guides/kyoto-six-areas-map.png', width: 1080, height: 1920 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoSixAreasGuideTitle,
    description: kyotoSixAreasGuideDescription,
    images: ['https://www.jiejourneys.com/assets/kyoto-guides/kyoto-six-areas-map.png'],
  },
}

export default function KyotoSixAreasGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
