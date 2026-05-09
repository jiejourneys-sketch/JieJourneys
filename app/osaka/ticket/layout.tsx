import type { Metadata } from 'next'

const title = '大阪票券總整理｜大阪周遊券・景點門票・大阪出發一日遊攻略 | JieJourneys(旅杰)'
const description =
  '大阪票券攻略一次看懂：整理大阪周遊券、周遊券涵蓋與優惠景點、USJ 門票與快速通關、海遊館、琵琶湖谷、勝尾寺，以及大阪出發的京都、奈良、神戶、和歌山、琵琶湖一日遊，快速比較 KKDAY、KLOOK、Trip 購票連結。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '大阪票券',
    '大阪周遊券',
    '大阪一日遊',
    '大阪景點門票',
    'USJ 門票',
    'USJ 快速通關',
    '大阪海遊館',
    '大阪出發京都一日遊',
    '大阪出發奈良一日遊',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/ticket' },
}

export default function OsakaTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
