import type { Metadata } from 'next'
import {
  mtFujiPassCanonical,
  mtFujiPassDescription,
  mtFujiPassTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: mtFujiPassTitle,
  description: mtFujiPassDescription,
  keywords: [
    '富士山周遊券',
    'Mt Fuji Pass',
    '富士山 Pass',
    '富士山周遊券攻略',
    '河口湖周遊券',
    '河口湖紅線',
    '西湖綠線',
    '本棲湖藍線',
    '富士急行線',
    '富士河口湖交通',
  ],
  alternates: { canonical: mtFujiPassCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: mtFujiPassTitle,
    description: mtFujiPassDescription,
    url: mtFujiPassCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: mtFujiPassTitle,
    description: mtFujiPassDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function MtFujiPassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
