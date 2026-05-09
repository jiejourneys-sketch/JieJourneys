import type { Metadata } from 'next'

const title = '大阪熱門景點地圖｜票券・一日遊景點・住宿位置整理 | JieJourneys(旅杰)'
const description =
  '大阪熱門景點地圖整理票券景點、一日遊目的地與住宿區示範，包含 USJ、海遊館、勝尾寺、天橋立、伊根舟屋、京都、奈良、神戶、和歌山等大阪自由行常見地點。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
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
}

export default function OsakaMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
