import type { Metadata } from 'next'
import {
  tokyoSkytreeGuideCanonical,
  tokyoSkytreeGuideDescription,
  tokyoSkytreeGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoSkytreeGuideTitle,
  description: tokyoSkytreeGuideDescription,
  keywords: [
    '東京晴空塔攻略',
    '晴空塔攻略',
    'Tokyo Skytree',
    '東京晴空塔',
    '押上站',
    '天望甲板',
    '天望回廊',
    '晴空塔票券',
    '東京夜景',
    '東京自由行',
  ],
  alternates: { canonical: tokyoSkytreeGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: tokyoSkytreeGuideTitle,
    description: tokyoSkytreeGuideDescription,
    url: tokyoSkytreeGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoSkytreeGuideTitle,
    description: tokyoSkytreeGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoSkytreeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
