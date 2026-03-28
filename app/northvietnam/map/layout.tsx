import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '越南北越地圖｜票券景點・住宿 | JieJourneys(旅杰)',
  description:
    '越南北越（河內、下龍灣、沙壩、陸龍灣等）票券景點與住宿地圖：與票券／住宿頁相同連結，KKDAY／KLOOK／Agoda 等一鍵開啟，並可 Google 導航；分類篩選與手機 bottom sheet。（需設定 Google Maps API Key）',
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/map' },
}

export default function NorthVietnamMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
