import type { Metadata } from 'next'

const title = '東京交通和通訊攻略｜西瓜卡/地鐵券要買嗎？成田機場和羽田機場到市區怎麼選 | JieJourneys (旅杰)'
const description =
  '東京自由行交通攻略：eSIM、SIM卡怎麼選？西瓜卡 vs 地鐵券差異，成田與羽田機場進市區方式完整比較，快速找到最適合你的交通方案。'

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
