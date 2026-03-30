import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '東京地圖｜票券景點・住宿 | JieJourneys(旅杰)',
  description:
    '東京票券景點與住宿地圖：KKDAY／KLOOK／Trip 購票連結，景點可一鍵開啟 Google 地圖釘點；分類篩選、標記與距離估算。（需設定 Google Maps API Key）',
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/map' },
}

export default function TokyoMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
