import type { Metadata } from 'next'

const title = '釜山自由行攻略 2025｜住宿・交通・票券・景點全整理 | JieJourneys(旅杰)'
const description =
  '釜山自由行完整攻略：住宿選哪區（海雲台/廣安里/西面）、eSIM 通訊、T-Money 交通、釜山 Pass 票券、景點短影片，一站搞定釜山行前規劃。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan' },
}

export default function BusanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
