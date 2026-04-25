import type { Metadata } from 'next'

const title = '富士河口湖住宿推薦｜逆富士湖景旅館・近車站飯店選區攻略 | JieJourneys(旅杰)'
const description =
  '富士河口湖住宿怎麼選？逆富士區可欣賞湖面倒映富士山景色，溫泉旅館與湖景飯店最適合追景拍照；近車站區步行即達巴士站與餐廳，交通最省事。整理兩大區域精選住宿，比較 Trip、Agoda 即時房價，旺季湖景房建議提早一至兩個月預訂。'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖住宿',
    '富士河口湖飯店',
    '河口湖溫泉旅館',
    '富士河口湖民宿',
    '富士河口湖住宿推薦',
    '富士山景觀旅館',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/hotel' },
}

export default function FujiHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
