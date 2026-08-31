import type { Metadata } from 'next'

const title =
  '大阪交通與通訊攻略｜關西機場到難波、Rapi:t、HARUKA、eSIM、地鐵券整理 | JieJourneys(旅杰)'
const description =
  '大阪自由行交通與通訊懶人包，整理 eSIM、SIM 卡、WiFi 分享器，以及關西機場到大阪市區的主要移動方式。住難波、新今宮可比較南海電鐵 Rapi:t；住天王寺、大阪站、新大阪、京都可看 HARUKA；飯店附近有站牌或行李多可評估利木津巴士；親子、長輩同行或深夜早班機則可考慮機場包車。也整理大阪地鐵一日券/二日券、Metro 市區移動、包車、自駕租車與購買連結。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/transport',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/transport' },
}

export default function OsakaTransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
