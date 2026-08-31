import type { Metadata } from 'next'
import {
  umedaSkyBuildingGuideCanonical,
  umedaSkyBuildingGuideDescription,
  umedaSkyBuildingGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: umedaSkyBuildingGuideTitle,
  description: umedaSkyBuildingGuideDescription,
  keywords: [
    '梅田空中庭園攻略',
    '梅田藍天大廈',
    '空中庭園展望台',
    '梅田藍天大廈交通',
    '大阪夜景',
    '大阪周遊券梅田空中庭園',
    '絹谷幸二天空美術館',
    '大阪自由行',
  ],
  alternates: { canonical: umedaSkyBuildingGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: umedaSkyBuildingGuideTitle,
    description: umedaSkyBuildingGuideDescription,
    url: umedaSkyBuildingGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: umedaSkyBuildingGuideTitle,
    description: umedaSkyBuildingGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function UmedaSkyBuildingGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
