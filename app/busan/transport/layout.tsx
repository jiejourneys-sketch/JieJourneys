import type { Metadata } from 'next'

const title = '釜山交通&通訊攻略｜eSIM・SIM卡・T-Money・機場到市區怎麼搭 | JieJourneys(旅杰)'
const description =
  '釜山交通與通訊攻略整理 eSIM、SIM卡、WiFi 分享器、T-Money 交通卡、WOWPASS、KTX 與金海機場到市區方式。比較地鐵輕軌、機場接送、台灣或韓國機場取件的優缺點與購買連結，幫你出發前一次處理上網和移動。'

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
