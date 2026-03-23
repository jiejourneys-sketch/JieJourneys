import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '東京市五日行程 | JieJourneys',
}

export default function TokyoJourneysLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
