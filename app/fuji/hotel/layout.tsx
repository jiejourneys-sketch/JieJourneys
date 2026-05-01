import type { Metadata } from 'next'

const title = '富士河口湖住宿推薦｜逆富士湖景旅館・近車站飯店選區攻略 | JieJourneys(旅杰)'
const description =
  '富士河口湖住宿推薦分成逆富士湖景區與近河口湖站區比較：想看富士山倒影、泡溫泉、拍湖景選逆富士；想搭巴士、找餐廳、搬行李省力選近車站。精選飯店附 Trip、Agoda 查價與地圖連結，並提醒賞櫻、楓葉、暑假旺季提早訂房。'

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
