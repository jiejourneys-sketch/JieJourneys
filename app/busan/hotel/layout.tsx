import type { Metadata } from 'next'

const title = '釜山住宿推薦｜海雲台、廣安里、西面、南浦洞區域分析 | JieJourneys(旅杰)'
const description =
  '釜山住宿推薦按海雲台、廣安里、西面、南浦洞分區整理，說明海景夜景、交通轉乘、逛街美食與親子行程適合度。精選飯店含 Trip、Agoda 查價連結、Google Map 與 Naver Map 導航，幫你快速判斷第一次去釜山住哪區最順。'

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
