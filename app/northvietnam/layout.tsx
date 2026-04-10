import type { Metadata } from 'next'

const title = '北越自由行攻略 2025｜河內・下龍灣・沙壩・陸龍灣全整理 | JieJourneys(旅杰)'
const description =
  '北越自由行完整攻略：河內、下龍灣、沙壩、陸龍灣各地玩法，住宿推薦、交通方式比較、遊輪票券選擇，加上越南簽證與換匯，一站搞定北越行前規劃。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam' },
}

export default function NorthVietnamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
