import type { Metadata } from 'next'

const title = '東京自由行攻略｜住宿・交通・票券・景點全整理 | JieJourneys(旅杰)'
const description =
  '東京自由行全攻略。整理新宿、淺草、澀谷、池袋、上野等住宿區選區分析，西瓜卡與地鐵券差異比較，成田與羽田機場到市區交通選擇，SHIBUYA SKY、晴空塔、teamLab 等熱門景點票券整理，一站搞定東京行前所有規劃。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo' },
}

export default function TokyoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
