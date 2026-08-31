import type { Metadata } from 'next'

const title = '釜山交通攻略｜金海機場到市區・地鐵T-Money・eSIM/SIM卡'
const description =
  '釜山交通攻略整理 eSIM、SIM卡、WiFi 分享器、金海機場到市區、地鐵一日券、T-money、WOWPASS、KTX 與機場接送怎麼選，適合第一次釜山自由行先看。'

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
    siteName: '旅杰 JieJourneys',
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
