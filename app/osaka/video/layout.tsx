import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-日本大阪自由行認識大阪・景點攻略・行前準備',
  description:
    'JieJourneys(旅杰)日本大阪自由行-一頁整理相關短影片：認識城市、景點攻略與行前準備。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: 'JieJourneys(旅杰)-日本大阪自由行認識大阪・景點攻略・行前準備',
    description:
      'JieJourneys(旅杰)日本大阪自由行-一頁整理相關短影片：認識城市、景點攻略與行前準備。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
    url: 'https://www.jiejourneys.com/osaka/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)-日本大阪自由行認識大阪・景點攻略・行前準備',
    description:
      'JieJourneys(旅杰)日本大阪自由行-一頁整理相關短影片：認識城市、景點攻略與行前準備。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/video' },
}

export default function OsakaVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
