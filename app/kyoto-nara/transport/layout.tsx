import type { Metadata } from 'next'

const title = '京都奈良通訊與交通攻略｜eSIM、關西機場、市區移動 | JieJourneys(旅杰)'
const description = '京都奈良自由行通訊與交通整理：日本 eSIM、SIM 卡、Wi‑Fi 分享器，關西機場往京都的 HARUKA 與利木津巴士，以及京都市區、嵐山、大阪與奈良往返的選擇原則。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.jiejourneys.com/kyoto-nara/transport' },
}

export default function KyotoNaraTransportLayout({ children }: { children: React.ReactNode }) {
  return children
}
