import type { Metadata } from 'next'

const title = '北越自由行攻略｜河內・下龍灣・沙壩・陸龍灣全整理 | JieJourneys(旅杰)'
const description =
  '北越自由行全攻略。整理河內古城與火車街景點、下龍灣豪華遊輪選擇、沙壩番西邦峰纜車與貓貓村梯田健行、陸龍灣長安竹筏與舞洞爬山，加上越南 eSIM 通訊、機場包車、城市間交通比較，以及越南簽證申請與換匯攻略，一站搞定北越行前規劃。'

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
