import type { Metadata } from 'next'

const title = '京都・奈良一日遊票券｜天橋立、嵐山、宇治、奈良景點篩選 | JieJourneys(旅杰)'
const description = '京都、奈良與天橋立一日遊票券整理，可依嵐山、伏見稻荷、宇治、奈良公園、伊根舟屋等景點 tag 篩選行程。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.jiejourneys.com/kyoto-nara/ticket' },
}

export default function KyotoNaraTicketLayout({ children }: { children: React.ReactNode }) {
  return children
}
