import type { Metadata } from 'next'

const title = '東京短影片合輯｜景點攻略・機場交通・行前準備 | JieJourneys(旅杰)'
const description =
  '東京自由行短影片攻略合輯。依主題分類整理，涵蓋淺草寺、澀谷十字路口、新宿、秋葉原、台場、晴空塔等景點示範，以及成田與羽田機場交通攻略、Visit Japan Web 入境卡填寫教學、換匯與行前準備建議，切換標籤快速找到你需要的那一支。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/video' },
}

export default function TokyoVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
