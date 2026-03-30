import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '大阪市五日行程 | JieJourneys',
}

export default function OsakaJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
