import type { Metadata } from 'next'

const title =
  '東京景點門票與一日遊攻略｜迪士尼、SHIBUYA SKY、teamLab、富士山行程整理 | JieJourneys (旅杰)'
const description =
  '東京自由行門票懶人包，整理東京迪士尼、SHIBUYA SKY、晴空塔、東京鐵塔、哈利波特影城、teamLab、水族館等熱門景點票券，也收錄富士山、鎌倉江之島、日光、茨城等近郊一日遊，方便出發前比較 KKDAY、KLOOK、Trip 預訂連結。'

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
