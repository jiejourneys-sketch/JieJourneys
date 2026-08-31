import type { Metadata } from 'next'
import {
  tokyoToKawaguchikoCanonical,
  tokyoToKawaguchikoDescription,
  tokyoToKawaguchikoTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoToKawaguchikoTitle,
  description: tokyoToKawaguchikoDescription,
  keywords: [
    '東京到河口湖',
    '河口湖交通',
    '富士回遊',
    '富士回遊訂票',
    '河口湖高速巴士',
    '新宿到河口湖',
    '東京到富士山',
    '富士山包車',
    '河口湖自駕',
  ],
  alternates: { canonical: tokyoToKawaguchikoCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: tokyoToKawaguchikoTitle,
    description: tokyoToKawaguchikoDescription,
    url: tokyoToKawaguchikoCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoToKawaguchikoTitle,
    description: tokyoToKawaguchikoDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoToKawaguchikoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
