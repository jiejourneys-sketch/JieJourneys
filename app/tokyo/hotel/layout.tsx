import type { Metadata } from 'next'

const title = '東京住宿推薦｜住哪最方便？上野・淺草・新宿・澀谷・東京車站區域分析 | JieJourneys (旅杰)'
const description =
  '東京住宿怎麼選？新宿交通最方便、上野適合機場直達、淺草價格較便宜。整理東京熱門住宿區域優缺點，幫你快速選出最適合的住宿地點。'

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
