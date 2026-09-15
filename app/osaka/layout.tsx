import type { Metadata } from 'next'

const title =
  '大阪・京都・奈良自由行攻略｜景點、交通、住宿與旅杰地圖 | JieJourneys(旅杰)'
const description =
  '大阪、京都、奈良自由行懶人包，整理大阪市區、京都、奈良與天橋立等關西景點，並收錄住宿、關西機場交通、票券與一張整合互動地圖，方便一次規劃關西行程。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka' },
}

export default function OsakaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
