import type { Metadata } from 'next'

const title =
  '大阪短影片合輯｜5個區域攻略、關西機場交通與行前準備 | JieJourneys(旅杰)'
const description =
  '大阪短影片攻略合輯，先用大阪5個區域攻略快速理解難波、心齋橋、梅田、天王寺與環球影城動線，再看關西機場到大阪市區3種方式，搭配 Visit Japan Web、日幣換匯等行前準備影片，適合第一次大阪自由行出發前快速抓重點。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/video' },
}

export default function OsakaVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
