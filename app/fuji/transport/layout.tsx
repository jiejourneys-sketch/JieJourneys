import type { Metadata } from 'next'

const title = '富士河口湖交通攻略｜東京出發・eSIM・富士回遊・巴士・周遊券全整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖交通通訊攻略整理東京到河口湖 3 種方式：富士回遊、高速巴士、包車自駕，也比較 eSIM、SIM卡、WiFi 分享器怎麼選。想去五合目、御殿場Outlet、箱根或山中湖，可快速找到適合的移動方式、購買平台與時刻表連結。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖交通',
    '富士河口湖怎麼去',
    '東京到富士河口湖',
    '東京到河口湖',
    '富士回遊',
    '河口湖高速巴士',
    '河口湖巴士',
    '富士河口湖eSIM',
    '富士河口湖周遊券',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/transport' },
}

export default function FujiTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
