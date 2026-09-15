import type { Metadata } from 'next'

const title = '京都・奈良旅遊攻略合輯｜分區排景點更順 | JieJourneys(旅杰)'
const description = '京都與奈良自由行攻略，整理東山、嵐山、伏見宇治與奈良公園的分區排法，搭配官方旅遊資訊與景點地圖。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.jiejourneys.com/kyoto-nara/video' },
}

export default function KyotoNaraVideoLayout({ children }: { children: React.ReactNode }) {
  return children
}
