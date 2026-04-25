import type { Metadata } from 'next'

const title = '富士河口湖交通攻略｜東京出發・eSIM・巴士・周遊券全整理 | JieJourneys(旅杰)'
const description =
  '富士河口湖交通通訊全攻略。從東京新宿搭富士回遊直達河口湖站約兩小時，也可選高速巴士彈性出發；當地富士山周遊巴士串聯各大景點。通訊推薦 eSIM 免換卡，多人共用選 WiFi 分享器；想行程最自由可選包車或自駕，輕鬆深入五合目與御殿場Outlet。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖交通',
    '富士河口湖怎麼去',
    '東京到富士河口湖',
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
