import type { Metadata } from 'next'
import {
  hanedaAirportToTokyoCanonical,
  hanedaAirportToTokyoDescription,
  hanedaAirportToTokyoTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: hanedaAirportToTokyoTitle,
  description: hanedaAirportToTokyoDescription,
  keywords: [
    '羽田機場到東京',
    '羽田機場交通',
    '羽田到東京市區',
    '京急電鐵',
    '京急線',
    '東京單軌電車',
    'Tokyo Monorail',
    '利木津巴士',
    '羽田機場巴士',
    '東京自由行交通',
  ],
  alternates: { canonical: hanedaAirportToTokyoCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: hanedaAirportToTokyoTitle,
    description: hanedaAirportToTokyoDescription,
    url: hanedaAirportToTokyoCanonical,
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
    title: hanedaAirportToTokyoTitle,
    description: hanedaAirportToTokyoDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function HanedaAirportToTokyoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
