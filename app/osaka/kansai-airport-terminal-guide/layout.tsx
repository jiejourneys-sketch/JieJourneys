import type { Metadata } from 'next'
import {
  kansaiAirportTerminalGuideCanonical,
  kansaiAirportTerminalGuideDescription,
  kansaiAirportTerminalGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: kansaiAirportTerminalGuideTitle,
  description: kansaiAirportTerminalGuideDescription,
  keywords: [
    '關西機場攻略',
    '關西機場第一航廈',
    '關西機場第二航廈',
    '關西機場 T1 T2',
    '關西機場接駁車',
    '關西機場 Rapi:t',
    '關西機場 HARUKA',
    '大阪自由行',
  ],
  alternates: { canonical: kansaiAirportTerminalGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: kansaiAirportTerminalGuideTitle,
    description: kansaiAirportTerminalGuideDescription,
    url: kansaiAirportTerminalGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kansaiAirportTerminalGuideTitle,
    description: kansaiAirportTerminalGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KansaiAirportTerminalGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
