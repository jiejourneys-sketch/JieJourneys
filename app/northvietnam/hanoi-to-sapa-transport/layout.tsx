import type { Metadata } from 'next'
import {
  hanoiToSapaTransportCanonical,
  hanoiToSapaTransportDescription,
  hanoiToSapaTransportTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: hanoiToSapaTransportTitle,
  description: hanoiToSapaTransportDescription,
  keywords: [
    '河內到沙壩',
    '河內沙壩交通',
    '沙壩交通方式',
    'Sapa 交通',
    'Hanoi to Sapa',
    '沙壩臥鋪巴士',
    '河內到沙壩包車',
    '河內到老街火車',
    'Lao Cai to Sapa',
    '北越自由行交通',
  ],
  alternates: { canonical: hanoiToSapaTransportCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: hanoiToSapaTransportTitle,
    description: hanoiToSapaTransportDescription,
    url: hanoiToSapaTransportCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: hanoiToSapaTransportTitle,
    description: hanoiToSapaTransportDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function HanoiToSapaTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
