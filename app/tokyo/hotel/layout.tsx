import type { Metadata } from 'next'

const title = '東京住宿推薦｜住哪最方便？上野・淺草・新宿・澀谷・東京車站區域分析 | JieJourneys (旅杰)'
const description =
  '東京住宿怎麼選？整理上野、淺草、東京車站、銀座、新宿、澀谷住宿區域差異，依成田/羽田機場進市區、東側或西側行程、逛街購物、河口湖富士山動線，快速判斷第一次東京自由行住哪一區最順。'

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
