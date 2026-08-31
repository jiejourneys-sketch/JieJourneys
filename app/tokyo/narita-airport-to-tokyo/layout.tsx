import type { Metadata } from 'next'
import {
  naritaAirportToTokyoCanonical,
  naritaAirportToTokyoDescription,
  naritaAirportToTokyoTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: naritaAirportToTokyoTitle,
  description: naritaAirportToTokyoDescription,
  keywords: [
    '成田機場到東京',
    '成田機場交通',
    '成田到東京市區',
    'Skyliner',
    "N'EX",
    '成田特快',
    'Access 特急',
    '利木津巴士',
    'LCB 巴士',
    '東京自由行交通',
  ],
  alternates: { canonical: naritaAirportToTokyoCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: naritaAirportToTokyoTitle,
    description: naritaAirportToTokyoDescription,
    url: naritaAirportToTokyoCanonical,
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
    title: naritaAirportToTokyoTitle,
    description: naritaAirportToTokyoDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function NaritaAirportToTokyoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
