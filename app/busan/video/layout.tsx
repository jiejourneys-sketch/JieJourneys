import type { Metadata } from 'next'

const title = '釜山自由行攻略｜景點怎麼玩＋釜山Pass＋行前準備一次看（短影片整理） | JieJourneys(旅杰)'
const description =
  '釜山短影片攻略合輯。依主題分類整理，涵蓋海雲台、廣安里夜景、南浦洞、甘川洞文化村、西面、膠囊列車、松島纜車等熱門景點示範，以及釜山Pass 走法建議、金海機場交通、入境卡填寫與換匯等行前準備，切換標籤快速找到你需要的那一支。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
      '釜山自由行',
      '釜山自由行攻略',
      '釜山怎麼玩',
      '釜山景點推薦',
      '釜山必去景點',
      '海雲台景點',
      '南浦洞景點',
      '釜山膠囊列車',
      '釜山Pass',
    ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/video' },
}

export default function BusanVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
