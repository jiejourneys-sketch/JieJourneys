import type { Metadata } from 'next'

const title = '釜山住宿攻略｜第一次去住哪四大區？海雲台・西面・廣安里・南浦洞重點比較'
const description =
  '海雲台是最熱門的釜山住宿推薦區域，適合第一次來釜山、想住海景飯店的人，周邊有海雲台海水浴場與膠囊列車。廣安里是熱門的釜山海景住宿區域，適合情侶或喜歡拍照的人，晚上氣氛很好，還有無人機表演。西面是交通最方便的釜山住宿區域，地鐵交會站，去各大景點都順，適合第一次自由行或行程安排較多的人。'

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
