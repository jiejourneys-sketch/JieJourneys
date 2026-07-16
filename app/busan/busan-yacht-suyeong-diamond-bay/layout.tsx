import type { Metadata } from 'next'
import {
  busanYachtCanonical,
  busanYachtDescription,
  busanYachtTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanYachtTitle,
  description: busanYachtDescription,
  keywords: [
    '釜山遊艇',
    '水營灣遊艇',
    '鑽石灣遊艇',
    '釜山遊艇怎麼選',
    '釜山Pass遊艇',
    'Visit Busan Pass 鑽石灣遊艇',
    'Yacht Holic',
    'Diamond Bay Yacht',
    '廣安里無人機表演',
    '釜山自由行',
  ],
  alternates: { canonical: busanYachtCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: busanYachtTitle,
    description: busanYachtDescription,
    url: busanYachtCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/og-share.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanYachtTitle,
    description: busanYachtDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanYachtLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
