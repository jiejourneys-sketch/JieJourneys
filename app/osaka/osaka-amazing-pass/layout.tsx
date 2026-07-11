import type { Metadata } from 'next'
import {
  osakaAmazingPassCanonical,
  osakaAmazingPassDescription,
  osakaAmazingPassTitle,
} from './pageMeta'

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
    siteName: 'JieJourneys(旅杰)',
    title: osakaAmazingPassTitle,
    description: osakaAmazingPassDescription,
    url: osakaAmazingPassCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/osaka-pass-summary.png',
        width: 762,
        height: 542,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: osakaAmazingPassTitle,
    description: osakaAmazingPassDescription,
    images: ['https://www.jiejourneys.com/assets/osaka-pass-summary.png'],
  },
  alternates: { canonical: osakaAmazingPassCanonical },
}

export default function OsakaAmazingPassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
