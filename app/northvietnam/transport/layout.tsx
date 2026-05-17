import type { Metadata } from 'next'

const title = '越南北越交通攻略｜河內・下龍灣・沙壩・陸龍灣所有交通資訊'
const description =
  '河內到下龍灣怎麼去？整理下龍灣遊輪接送、包車、共乘接駁的重點比較。也整理河內到沙壩的3種交通方式，還有陸龍灣交通方式，包含機場到市區、Grab 注意事項、越南 eSIM/SIM 卡與 KKDAY、KLOOK 預訂連結。'

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
