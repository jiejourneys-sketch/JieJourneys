import type { Metadata } from 'next'

const title = '東京市五日行程 PDF｜自由行詳細動線 | JieJourneys'
const description =
  '東京五日自由行 PDF 行程，含淺草寺、晴空塔、新宿、澀谷、秋葉原、台場等熱門景點最佳順遊動線，搭配在地美食推薦與一鍵導航連結，購買後永久使用，隨時下載更新，NT$399 即可取得。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/journeys',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/journeys' },
}

export default function TokyoJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
