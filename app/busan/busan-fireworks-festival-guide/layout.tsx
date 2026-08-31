import type { Metadata } from 'next'
import {
  busanFireworksFestivalGuideCanonical,
  busanFireworksFestivalGuideDescription,
  busanFireworksFestivalGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanFireworksFestivalGuideTitle,
  description: busanFireworksFestivalGuideDescription,
  keywords: [
    '釜山煙火節',
    '釜山煙火節2026',
    'Busan Fireworks Festival 2026',
    '廣安里煙火節',
    '釜山煙火節門票',
    '釜山煙火節交通',
    '廣安里海水浴場',
    '二妓台煙火',
    '海雲台煙火',
    '釜山自由行',
  ],
  alternates: { canonical: busanFireworksFestivalGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanFireworksFestivalGuideTitle,
    description: busanFireworksFestivalGuideDescription,
    url: busanFireworksFestivalGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanFireworksFestivalGuideTitle,
    description: busanFireworksFestivalGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanFireworksFestivalGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
