import type { Metadata } from 'next'

const title = '越南北越自由行短影片攻略｜河內・下龍灣・沙壩・陸龍灣攻略全整理 | JieJourneys(旅杰)'
const description =
  '越南北越自由行短影片攻略合輯。依目的地分類整理，涵蓋河內古城、火車街咖啡廳、下龍灣豪華遊輪體驗、沙壩貓貓村梯田健行、陸龍灣長安竹筏與舞洞爬山，加上越南 eSIM 設定、機場包車預訂、簽證申請與換匯等行前準備，切換標籤快速找到你需要的那一支。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/video' },
}

export default function NorthVietnamVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
