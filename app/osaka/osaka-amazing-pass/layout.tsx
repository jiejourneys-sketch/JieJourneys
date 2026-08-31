import type { Metadata } from 'next'
import {
  osakaAmazingPassCanonical,
  osakaAmazingPassDescription,
  osakaAmazingPassTitle,
} from './pageMeta'

const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'

export const metadata: Metadata = {
  title: osakaAmazingPassTitle,
  description: osakaAmazingPassDescription,
  keywords: [
    '大阪周遊券',
    'Osaka Amazing Pass',
    '大阪周遊券攻略',
    '大阪周遊券免費景點',
    '大阪周遊券優惠',
    '大阪周遊券地圖',
    '大阪自由行票券',
    '大阪交通票券',
  ],
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: osakaAmazingPassTitle,
    description: osakaAmazingPassDescription,
    url: osakaAmazingPassCanonical,
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: osakaAmazingPassTitle,
    description: osakaAmazingPassDescription,
    images: [shareImage],
  },
  alternates: { canonical: osakaAmazingPassCanonical },
}

export default function OsakaAmazingPassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
