import type { Metadata } from 'next'

const title = '富士河口湖短影片攻略｜景點怎麼玩＋交通攻略一次看 | JieJourneys(旅杰)'
const description =
  '富士河口湖短影片攻略合輯。依主題分類整理，涵蓋富士急樂園、新倉山淺間公園五重塔、忍野八海、大石公園逆富士、河口湖纜車與遊覽船、Lawson 打卡點等熱門景點示範，以及富士回遊、高速巴士、包車自駕等交通攻略影片，快速找到你需要的那一支。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖景點',
    '富士河口湖怎麼玩',
    '忍野八海怎麼去',
    '淺間公園',
    '大石公園',
    '河口湖纜車',
    '富士山五合目',
    '富士河口湖行程',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/video' },
}

export default function FujiVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
