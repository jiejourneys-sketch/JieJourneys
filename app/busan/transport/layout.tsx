import type { Metadata } from 'next'

const title = '釜山交通&通訊攻略｜eSIM・SIM卡・T-Money・機場到市區怎麼搭 | JieJourneys(旅杰)'
const description =
  '釜山交通通訊全攻略。eSIM 免換卡最方便，多人共用選 WiFi 分享器，SIM 卡下機直用；T-Money 交通卡可搭地鐵與公車，建議在機場入境大廳購入。金海機場到市區可搭地鐵輕軌轉乘，或預訂包車接送省去換車麻煩，全程各方案優缺點一次比較。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山交通',
    '釜山交通攻略',
    '釜山eSIM',
    '釜山SIM卡',
    '釜山WiFi分享器',
    'T-Money卡',
    '釜山機場交通',
    '金海機場到市區',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/transport' },
}

export default function BusanTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
