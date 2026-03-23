import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-韓國釜山自由行速成攻略',
  description:
    'JieJourneys(旅杰)釜山自由行-整合短影片示範、住宿/交通建議、票券與互動PDF，助你用最少時間規劃最完整的行程。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: 'JieJourneys(旅杰)-韓國釜山自由行速成攻略',
    description:
      'JieJourneys(旅杰)釜山自由行-整合短影片示範、住宿/交通建議、票券與互動PDF，助你用最少時間規劃最完整的行程。',
    url: 'https://www.jiejourneys.com/busan/',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)-韓國釜山自由行速成攻略',
    description:
      'JieJourneys(旅杰)釜山自由行-整合短影片示範、住宿/交通建議、票券與互動PDF，助你用最少時間規劃最完整的行程。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/' },
}

export default function BusanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
