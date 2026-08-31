import type { Metadata } from 'next'

const title = '富士河口湖短影片攻略｜景點怎麼玩＋交通攻略一次看 | JieJourneys(旅杰)'
const description =
  '富士河口湖短影片攻略把景點玩法、住宿、票券與交通教學集中整理，包含富士急樂園、新倉山淺間公園五重塔、忍野八海、大石公園逆富士、河口湖住宿、富士山周遊券、河口湖玩幾天、東京到河口湖、富士回遊、高速巴士、包車自駕等實用影片。'

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
    '東京到河口湖',
    '河口湖交通',
    '富士山周遊券',
    '河口湖住宿',
    '河口湖玩幾天',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
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
