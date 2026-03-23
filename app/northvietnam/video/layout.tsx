import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-越南北越自由行認識河內、下龍灣、陸龍灣、沙壩',
  description:
    'JieJourneys(旅杰)越南北越自由行-一頁整理所有越南北越短影片：認識河內、下龍灣、陸龍灣、沙壩。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: 'JieJourneys(旅杰)-越南北越自由行認識河內、下龍灣、陸龍灣、沙壩',
    description:
      'JieJourneys(旅杰)越南北越自由行-一頁整理所有越南北越短影片：認識河內、下龍灣、陸龍灣、沙壩。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
    url: 'https://www.jiejourneys.com/northvietnam/video',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)-越南北越自由行認識河內、下龍灣、陸龍灣、沙壩',
    description:
      'JieJourneys(旅杰)越南北越自由行-一頁整理所有越南北越短影片：認識河內、下龍灣、陸龍灣、沙壩。每支影片含示範動線與一鍵跳轉至 IG/YouTube/小紅書，快速完成規劃。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/video' },
}

export default function NorthVietnamVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
