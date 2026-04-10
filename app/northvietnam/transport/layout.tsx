import type { Metadata } from 'next'

const title = '越南北越自由行通訊交通攻略｜eSIM・機場接送・河內到沙壩/下龍灣/陸龍灣交通比較 | JieJourneys(旅杰)'
const description =
  '越南北越自由行通訊交通一頁整理：越南 eSIM/SIM 卡選擇、河內機場到市區建議預訂包車（Grab 可能加收過路費）、到沙壩的臥鋪巴士/火車/包車比較、下龍灣與陸龍灣接駁方式，附 KKDAY/KLOOK 購買連結。'

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
