import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '釜山地圖｜票券景點・住宿 | JieJourneys(旅杰)',
  description:
    '韓國釜山票券景點與住宿地圖：與票券／住宿頁相同連結，KKDAY／KLOOK／Trip 等一鍵開啟，並可 Google 導航；分類篩選、標記與 sticky 地圖。（需設定 Google Maps API Key）',
  alternates: { canonical: 'https://www.jiejourneys.com/busan/map' },
}

export default function BusanMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
