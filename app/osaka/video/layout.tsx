import type { Metadata } from 'next'

const title =
  '大阪旅遊攻略合輯｜5個區域攻略、關西機場交通與行前準備 | JieJourneys(旅杰)'
const description =
  '大阪旅遊攻略合輯，整理大阪住宿攻略、大阪周遊券、5個區域攻略、關西機場到大阪市區3種方式、Visit Japan Web、日幣換匯等影片，快速理解住宿區域、景點動線、票券與交通重點。'

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
