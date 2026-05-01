import type { Metadata } from 'next'

const title = '大阪景點地圖｜道頓堀・USJ・海遊館・空中庭園等大阪熱門景點一覽 | JieJourneys(旅杰)'
const description =
  '大阪景點地圖整合票券景點、免費景點與住宿位置：道頓堀、心齋橋、大阪城、環球影城USJ、海遊館、空中庭園展望台、通天閣都可切換查看，一鍵開啟 Google Map 導航。'

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