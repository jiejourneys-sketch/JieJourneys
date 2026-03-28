import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '東京地圖｜票券景點・住宿 | JieJourneys(旅杰)',
  description:
    '東京票券景點與住宿地圖：與票券頁相同的 KKDAY／KLOOK／Trip 連結，並可一鍵 Google 導航；分類篩選、標記與距離估算。（需設定 Google Maps API Key）',
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/map' },
}

export default function TokyoMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
