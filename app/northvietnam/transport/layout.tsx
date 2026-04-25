import type { Metadata } from 'next'

const title = '越南北越自由行通訊交通攻略｜eSIM・機場接送・河內到沙壩/下龍灣/陸龍灣交通比較 | JieJourneys(旅杰)'
const description =
  '北越交通通訊全攻略。越南 eSIM 與 SIM 卡下機即用；河內內排機場到市區建議預訂包車，Grab 有時加收過路費需注意。前往沙壩可選臥鋪巴士、夜間火車或包車；下龍灣與陸龍灣接駁通常含在遊輪或行程票價內。各方案優缺點完整比較，附 KKDAY、KLOOK 購買連結。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/transport' },
}

export default function NorthVietnamTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
