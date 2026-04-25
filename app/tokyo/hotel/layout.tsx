import type { Metadata } from 'next'

const title = '東京住宿推薦｜住哪最方便？上野・淺草・新宿・澀谷・東京車站區域分析 | JieJourneys (旅杰)'
const description =
  '東京住宿怎麼選？新宿地鐵線路最多轉乘最方便、上野搭 Narita Express 直達最省事、淺草保留江戶風情且房價相對親民、澀谷潮流購物首選、東京車站適合喜愛新幹線移動的旅客。各區特色與適合對象完整分析，比較 Trip、Agoda 即時房價，快速鎖定最適合的住宿。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/tokyo/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/hotel' },
}

export default function TokyoHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
