import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '大阪住宿推薦｜難波、心齋橋、梅田、天王寺飯店地圖整理｜JieJourneys',
  description:
    '大阪自由行住宿推薦，整理難波、心齋橋、梅田大阪站、天王寺四大區域飯店，搭配大阪熱門景點地圖與周遊券地圖，快速比較交通、購物、美食與機場動線。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: '大阪住宿推薦｜難波、心齋橋、梅田、天王寺飯店地圖整理｜JieJourneys',
    description:
      '大阪自由行住宿推薦，整理難波、心齋橋、梅田大阪站、天王寺四大區域飯店，搭配大阪熱門景點地圖與周遊券地圖，快速比較交通、購物、美食與機場動線。',
    url: 'https://www.jiejourneys.com/osaka/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '大阪住宿推薦｜難波、心齋橋、梅田、天王寺飯店地圖整理｜JieJourneys',
    description:
      '大阪自由行住宿推薦，整理難波、心齋橋、梅田大阪站、天王寺四大區域飯店，搭配大阪熱門景點地圖與周遊券地圖，快速比較交通、購物、美食與機場動線。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/hotel' },
}

export default function OsakaHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
