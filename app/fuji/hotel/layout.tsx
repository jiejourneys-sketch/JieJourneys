import type { Metadata } from 'next'

const title = '富士河口湖住宿怎麼選｜富士山景飯店、湖景溫泉旅館、河口湖站住宿推薦 | JieJourneys(旅杰)'
const description =
  '富士河口湖住宿攻略，依富士山景、湖景溫泉、交通方便/高CP三種需求整理推薦飯店。想在房間看富士山、泡河口湖溫泉、一泊二食，或住近河口湖站方便搭巴士與拖行李，都能快速比較 Trip、Agoda 查價與地圖位置。'

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
    siteName: '旅杰 JieJourneys',
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
