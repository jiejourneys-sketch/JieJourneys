import type { Metadata } from 'next'

const title = '富士河口湖自由行攻略｜景點・票券・住宿・交通全整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖自由行全攻略。淺間公園五重塔賞富士山、忍野八海世界遺產清泉、大石公園逆富士倒影、御殿場Outlet血拼，加上富士急樂園、河口湖纜車與遊覽船等熱門票券，住宿逆富士區與近車站區比較、eSIM 通訊推薦、富士回遊與高速巴士交通攻略，行前規劃一站搞定。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖自由行',
    '富士河口湖攻略',
    '富士山一日遊',
    '忍野八海',
    '淺間公園',
    '大石公園',
    '御殿場Outlet',
    '富士山五合目',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji' },
}

export default function FujiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
