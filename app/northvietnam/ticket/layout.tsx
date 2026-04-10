import type { Metadata } from 'next'

const title = '北越票券攻略｜下龍灣遊輪・番西邦峰纜車・貓貓村・陸龍灣小船購買整理 | JieJourneys(旅杰)'
const description =
  '北越四大區票券整理：下龍灣遊輪建議兩天一夜、番西邦峰纜車和貓貓村不能排同天、陸龍灣長安三谷坐小船或舞洞爬山二選一、河內古蹟導覽。'

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
