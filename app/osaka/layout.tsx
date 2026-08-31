import type { Metadata } from 'next'

const title =
  '大阪自由行攻略｜環球影城、道頓堀、大阪城、通天閣景點交通住宿整理 | JieJourneys(旅杰)'
const description =
  '大阪自由行懶人包，整理日本環球影城、道頓堀、大阪城、通天閣、梅田藍天大廈、海遊館等熱門景點，並收錄大阪住宿、關西機場交通、大阪周遊卡、景點門票、京都奈良神戶一日遊與互動地圖，方便第一次規劃大阪行程。'

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
