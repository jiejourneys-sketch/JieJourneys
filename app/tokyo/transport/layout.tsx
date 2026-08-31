import type { Metadata } from 'next'

const title = '東京交通和通訊攻略｜西瓜卡/地鐵券要買嗎？成田機場和羽田機場到市區怎麼選？eSIM和SIM卡怎麼買？ | JieJourneys (旅杰)'
const description =
  '東京交通通訊攻略整理 eSIM、SIM卡、WiFi 分享器、Suica、東京地鐵券、JR Pass、成田機場 Skyliner/NEX/利木津巴士/Access 特急，以及羽田機場京急電鐵、東京單軌電車、巴士和包車怎麼選。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
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
