import type { Metadata } from 'next'
import {
  tokyoShibuyaSkyGuideCanonical,
  tokyoShibuyaSkyGuideDescription,
  tokyoShibuyaSkyGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoShibuyaSkyGuideTitle,
  description: tokyoShibuyaSkyGuideDescription,
  keywords: [
    'SHIBUYA SKY 攻略',
    '澀谷展望台攻略',
    '澀谷天空',
    '澀谷 Scramble Square',
    '澀谷站東口',
    'SHIBUYA SKY 票券',
    'SHIBUYA SKY 日落',
    '東京夜景',
    '東京自由行',
  ],
  alternates: { canonical: tokyoShibuyaSkyGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: tokyoShibuyaSkyGuideTitle,
    description: tokyoShibuyaSkyGuideDescription,
    url: tokyoShibuyaSkyGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoShibuyaSkyGuideTitle,
    description: tokyoShibuyaSkyGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoShibuyaSkyGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
