import type { Metadata } from 'next'
import {
  tokyoMeijiJinguGuideCanonical,
  tokyoMeijiJinguGuideDescription,
  tokyoMeijiJinguGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoMeijiJinguGuideTitle,
  description: tokyoMeijiJinguGuideDescription,
  keywords: [
    '明治神宮攻略',
    '明治神宮',
    '明治神宮前站',
    '原宿站',
    '南參道',
    '夫婦楠',
    '明治神宮御守',
    '明治神宮繪馬',
    '明治神宮參拜',
    '東京自由行',
  ],
  alternates: { canonical: tokyoMeijiJinguGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: tokyoMeijiJinguGuideTitle,
    description: tokyoMeijiJinguGuideDescription,
    url: tokyoMeijiJinguGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoMeijiJinguGuideTitle,
    description: tokyoMeijiJinguGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoMeijiJinguGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
