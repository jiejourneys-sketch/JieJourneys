import type { Metadata } from 'next'

const title =
  '東京景點門票與一日遊攻略｜迪士尼、SHIBUYA SKY、teamLab、富士山行程整理 | JieJourneys (旅杰)'
const description =
  '東京票券攻略整理展望台、東京迪士尼、哈利波特影城、teamLab、水族館、富士山河口湖、鎌倉江之島、日光與常陸海濱公園一日遊，教你先分景點類型與交通難度，再比較 KKDAY、KLOOK、Trip 購票連結。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
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
