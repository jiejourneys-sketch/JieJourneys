import type { Metadata } from 'next'

const title = '越南北越票券攻略｜下龍灣遊輪・番西邦峰纜車・貓貓村・陸龍灣小船購買整理 | JieJourneys(旅杰)'
const description =
  '越南北越四大區票券攻略。下龍灣推薦兩天一夜豪華遊輪，可含日落派對與皮划艇體驗；沙壩番西邦峰纜車與貓貓村建議分兩天排；陸龍灣長安三谷竹筏或舞洞爬山二選一；河內可加古城人力車導覽。比較 KKDAY、KLOOK、Trip 平台價格，附行程安排建議。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/ticket' },
}

export default function NorthVietnamTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
