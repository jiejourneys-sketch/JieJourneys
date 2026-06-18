import type { Metadata } from 'next'

const title =
  '大阪自由行短影片攻略｜景點玩法、交通教學、行前準備一次看 | JieJourneys(旅杰)'
const description =
  '大阪自由行短影片攻略整理，集中收錄大阪景點地圖、住宿、票券、關西機場交通、市區移動與日本行前準備重點，包含大阪周遊券、USJ、HARUKA、Rapi:t、Visit Japan Web、日幣換匯等實用內容，適合出發前快速掌握大阪行程。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/video' },
}

export default function OsakaVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
