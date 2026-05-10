import type { Metadata } from 'next'

const title = '東京交通和通訊攻略｜西瓜卡/地鐵券要買嗎？成田機場和羽田機場到市區怎麼選？eSIM和SIM卡怎麼買？ | JieJourneys (旅杰)'
const description =
  '東京交通通訊全攻略。eSIM 下機即用免換卡，多人共用選 WiFi 分享器；西瓜卡（Suica）全東京通用最方便，地鐵券適合短天數密集觀光。成田機場可搭 Narita Express 或高速巴士進市區，羽田機場搭京急線或單軌電車最快，也可預訂包車或自駕接送，省去轉乘拉行李的麻煩。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/transport' },
}

export default function TokyoTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
