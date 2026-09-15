import type { Metadata } from 'next'

const title = '京都住宿推薦｜京都站、四條河原町、二條城住哪裡 | JieJourneys(旅杰)'
const description = '京都住宿推薦依行程動線整理京都站、四條河原町與二條城周邊飯店。第一次自由行、親子、逛街與質感旅宿快速比較。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.jiejourneys.com/kyoto-nara/hotel' },
}

export default function KyotoNaraHotelLayout({ children }: { children: React.ReactNode }) {
  return children
}
