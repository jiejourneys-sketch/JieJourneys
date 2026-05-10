import type { Metadata } from 'next'

const title =
  '大阪景點地圖｜環球影城、道頓堀、大阪城、海遊館、心齋橋位置整理 | JieJourneys(旅杰)'
const description =
  '大阪自由行景點地圖，整理日本環球影城、道頓堀、大阪城、海遊館、心齋橋、黑門市場、通天閣新世界、難波八阪神社等大阪熱門景點位置，也收錄京都、奈良、神戶、和歌山、天橋立、伊根舟屋等大阪出發一日遊目的地，以及難波、心齋橋、梅田、大阪站周邊住宿地圖，方便規劃路線與開啟 Google Map 導航。'

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
