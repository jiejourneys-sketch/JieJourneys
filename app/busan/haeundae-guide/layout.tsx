import type { Metadata } from 'next'
import {
  busanHaeundaeGuideCanonical,
  busanHaeundaeGuideDescription,
  busanHaeundaeGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanHaeundaeGuideTitle,
  description: busanHaeundaeGuideDescription,
  keywords: [
    '海雲台攻略',
    '海雲台',
    '海雲台大道',
    '海雲台傳統市場',
    '海雲台海灘',
    'BUSAN X the SKY',
    '釜山 X the Sky',
    '釜山膠囊列車',
    '海雲台膠囊列車',
    '海理團路',
    '海雲台自由行',
    '釜山自由行',
  ],
  alternates: { canonical: busanHaeundaeGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanHaeundaeGuideTitle,
    description: busanHaeundaeGuideDescription,
    url: busanHaeundaeGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanHaeundaeGuideTitle,
    description: busanHaeundaeGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanHaeundaeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
