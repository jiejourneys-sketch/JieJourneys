import type { Metadata } from 'next'

const title = '東京短影片合輯｜景點攻略・機場交通・行前準備 | JieJourneys (旅杰)'
const description =
  '東京自由行短影片全整理：怎麼排景點、交通怎麼搭、成田機場和羽田羽田怎麼進市區、Visit Japan Web 教學，一頁快速搞懂東京自由行。'

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
