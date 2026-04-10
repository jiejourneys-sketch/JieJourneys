import type { Metadata } from 'next'

const title = '釜山自由行攻略｜景點怎麼玩＋釜山Pass＋行前準備一次看（短影片整理） | JieJourneys(旅杰)'
const description =
  '釜山自由行怎麼玩？整理海雲台、南浦洞、甘川洞、膠囊列車等熱門景點玩法，搭配釜山Pass 24/48小時走法與行前準備（入境卡、換匯）。用短影片快速找到最適合你的行程。'

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
