import type { Metadata } from 'next'

const title = '京都奈良自由行｜景點地圖與行程規劃 | JieJourneys(旅杰)'
const description =
  '京都奈良景點地圖整理清水寺、祇園、嵐山、貴船、伏見稻荷、宇治、奈良公園、東大寺、春日大社與西之京寺院，一張互動地圖就能安排關西自由行。'

export const metadata: Metadata = {
  title,
  description,
  keywords: ['京都奈良自由行', '京都奈良景點地圖', '京都地圖', '奈良地圖', '京都行程', '奈良行程'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/kyoto-nara',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/kyoto-nara' },
}

export default function KyotoNaraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
