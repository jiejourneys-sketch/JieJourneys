import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '大阪交通與通訊攻略｜關西機場到市區、eSIM、地鐵券整理｜JieJourneys',
  description:
    '大阪自由行交通與通訊整理：eSIM、SIM 卡、WiFi 分享器、關西機場到難波與大阪市區的 Rapi:t、HARUKA、利木津巴士、包車、自駕租車與大阪地鐵券一次比較。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: '大阪交通與通訊攻略｜關西機場到市區、eSIM、地鐵券整理｜JieJourneys',
    description:
      '大阪自由行交通與通訊整理：eSIM、SIM 卡、WiFi 分享器、關西機場到難波與大阪市區的 Rapi:t、HARUKA、利木津巴士、包車、自駕租車與大阪地鐵券一次比較。',
    url: 'https://www.jiejourneys.com/osaka/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '大阪交通與通訊攻略｜關西機場到市區、eSIM、地鐵券整理｜JieJourneys',
    description:
      '大阪自由行交通與通訊整理：eSIM、SIM 卡、WiFi 分享器、關西機場到難波與大阪市區的 Rapi:t、HARUKA、利木津巴士、包車、自駕租車與大阪地鐵券一次比較。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/transport' },
}

export default function OsakaTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
