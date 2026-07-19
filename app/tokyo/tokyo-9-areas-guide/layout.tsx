import type { Metadata } from 'next'
import {
  tokyo9AreasGuideCanonical,
  tokyo9AreasGuideDescription,
  tokyo9AreasGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyo9AreasGuideTitle,
  description: tokyo9AreasGuideDescription,
  keywords: [
    '東京市區景點',
    '東京9大區域',
    '東京區域攻略',
    '東京自由行景點',
    '上野景點',
    '淺草寺',
    '晴空塔',
    '皇居',
    '銀座',
    '築地市場',
    '新宿',
    '原宿',
    '澀谷',
  ],
  alternates: { canonical: tokyo9AreasGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: tokyo9AreasGuideTitle,
    description: tokyo9AreasGuideDescription,
    url: tokyo9AreasGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyo9AreasGuideTitle,
    description: tokyo9AreasGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function Tokyo9AreasGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
