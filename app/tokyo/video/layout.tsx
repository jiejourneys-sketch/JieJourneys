import type { Metadata } from 'next'

const title = '東京短影片合輯｜景點攻略・機場交通・行前準備 | JieJourneys(旅杰)'
const description =
  '東京自由行短影片攻略合輯，依景點攻略、交通、行前準備分類整理。從東京區域、淺草寺、明治神宮、晴空塔、SHIBUYA SKY，到成田/羽田機場交通、東京地鐵券、Visit Japan Web、換匯與退稅，快速找到對應影片與文章。'

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
