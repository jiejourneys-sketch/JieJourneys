import type { Metadata } from 'next'
import {
  osaka5AreasGuideCanonical,
  osaka5AreasGuideDescription,
  osaka5AreasGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: osaka5AreasGuideTitle,
  description: osaka5AreasGuideDescription,
  keywords: [
    '大阪5大區域',
    '大阪自由行區域',
    '難波心齋橋攻略',
    '大阪城攻略',
    '梅田攻略',
    '天王寺新世界攻略',
    '大阪港環球影城攻略',
    '大阪景點排行程',
  ],
  alternates: { canonical: osaka5AreasGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: osaka5AreasGuideTitle,
    description: osaka5AreasGuideDescription,
    url: osaka5AreasGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: osaka5AreasGuideTitle,
    description: osaka5AreasGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function Osaka5AreasGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
