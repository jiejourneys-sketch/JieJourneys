import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '行程規劃｜JieJourneys', template: '%s｜JieJourneys Plan' },
  description: '拖曳排程、自動算時間、一鍵分享的旅遊行程規劃工具',
}

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
