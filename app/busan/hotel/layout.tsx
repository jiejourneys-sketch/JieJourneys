import type { Metadata } from 'next'

const title = '釜山住宿推薦｜海雲台、廣安里、西面、南浦洞區域分析 | JieJourneys(旅杰)'
const description =
  '釜山住宿怎麼選？海雲台賞海景散步、廣安里欣賞廣安大橋夜景、西面地鐵交匯轉乘最便利、南浦洞緊鄰 BIFF 廣場與札嘎其市場吃逛最方便。整理四大區域特色與適合對象，比較 Trip、Agoda 即時房價，幫你快速鎖定最適合你的釜山住宿地點。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山住宿推薦',
    '釜山住哪裡',
    '釜山飯店推薦',
    '海雲台住宿',
    '西面住宿',
    '廣安里住宿',
    '南浦洞住宿',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/hotel' },
}

export default function BusanHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
