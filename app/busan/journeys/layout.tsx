import type { Metadata } from 'next'

const title = '釜山五日行程 PDF｜自由行詳細動線 | JieJourneys'
const description =
  '釜山五日自由行 PDF 行程把每日動線、景點順序、美食清單、票券連結與一鍵導航整理好，涵蓋膠囊列車、甘川文化村、海雲台、廣安里夜景、南浦洞、松島與白淺灘等重點。適合想少做功課、照著走也能玩順的旅人，購買後永久使用。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/journeys',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/journeys' },
}

export default function BusanJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
