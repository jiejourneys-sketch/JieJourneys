import type { Metadata } from 'next'
import {
  kansaiAirportToOsakaCanonical,
  kansaiAirportToOsakaDescription,
  kansaiAirportToOsakaTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: kansaiAirportToOsakaTitle,
  description: kansaiAirportToOsakaDescription,
  keywords: [
    '關西機場到大阪',
    '關西機場交通',
    '關西機場到難波',
    'Rapi:t',
    '南海電鐵',
    'HARUKA',
    '關西機場特快',
    '利木津巴士',
    '大阪自由行交通',
  ],
  alternates: { canonical: kansaiAirportToOsakaCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kansaiAirportToOsakaTitle,
    description: kansaiAirportToOsakaDescription,
    url: kansaiAirportToOsakaCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kansaiAirportToOsakaTitle,
    description: kansaiAirportToOsakaDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KansaiAirportToOsakaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
