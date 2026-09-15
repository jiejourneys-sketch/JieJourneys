import type { Metadata } from 'next'

const title = '大阪・京都・奈良旅杰地圖 | JieJourneys(旅杰)'
const description =
  '此網址已整合至大阪・京都・奈良旅杰地圖。'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['大阪京都奈良地圖', '關西地圖'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/map',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/map' },
  robots: { index: false, follow: true, googleBot: { 'max-image-preview': 'large' } },
}

export default function KyotoNaraMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
