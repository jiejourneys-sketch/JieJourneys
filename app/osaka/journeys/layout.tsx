import type { Metadata } from 'next'

const title = '大阪市五日行程 PDF｜自由行詳細動線 | JieJourneys'
const description =
  '大阪五日自由行完整行程 PDF，含道頓堀、大阪城、環球影城周邊等熱門景點最佳動線、美食清單、一鍵導航連結，NT$399 立即取得永久使用。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/journeys',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/journeys' },
}

export default function OsakaJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
