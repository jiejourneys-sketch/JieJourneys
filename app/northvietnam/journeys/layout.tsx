import type { Metadata } from 'next'

const title = '北越8日行程 PDF｜河內・沙壩・陸龍灣・下龍灣 | JieJourneys'
const description =
  '北越八日自由行完整行程 PDF，含河內、沙壩、陸龍灣、下龍灣最佳動線、美食清單、景點攻略、一鍵導航連結，NT$499 立即取得永久使用。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
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
