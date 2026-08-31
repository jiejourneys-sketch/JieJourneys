import type { Metadata } from 'next'
import {
  tokyoSubwayTicketCanonical,
  tokyoSubwayTicketDescription,
  tokyoSubwayTicketTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoSubwayTicketTitle,
  description: tokyoSubwayTicketDescription,
  keywords: [
    '東京地鐵券',
    'Tokyo Subway Ticket',
    '東京地鐵多日券',
    '東京地鐵24小時券',
    '東京地鐵48小時券',
    '東京地鐵72小時券',
    '東京自由行交通',
    '東京 Metro',
    '都營地鐵',
    'JR Pass 東京',
  ],
  alternates: { canonical: tokyoSubwayTicketCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: tokyoSubwayTicketTitle,
    description: tokyoSubwayTicketDescription,
    url: tokyoSubwayTicketCanonical,
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
    title: tokyoSubwayTicketTitle,
    description: tokyoSubwayTicketDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoSubwayTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
