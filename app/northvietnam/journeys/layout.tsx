import type { Metadata } from 'next'

const title = '北越8日行程 PDF｜河內・沙壩・陸龍灣・下龍灣 | JieJourneys'
const description =
  '北越八日自由行 PDF 行程，含河內古城、沙壩貓貓村與梯田、陸龍灣長安竹筏、下龍灣豪華遊輪四大區最佳順遊動線，搭配在地美食推薦與一鍵導航連結，購買後永久使用，隨時下載更新，NT$499 即可取得。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/journeys',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/journeys' },
}

export default function NorthVietnamJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
