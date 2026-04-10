import type { Metadata } from 'next'

const title = '東京票券攻略｜SHIBUYA SKY・晴空塔・teamLab 景點票購買整理 | JieJourneys (旅杰)'
const description =
  '東京熱門景點票券整理：SHIBUYA SKY、晴空塔、teamLab 是否要提前訂？哪裡買最便宜？KKDAY / KLOOK / 官網比價一次看。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/ticket' },
}

export default function TokyoTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
