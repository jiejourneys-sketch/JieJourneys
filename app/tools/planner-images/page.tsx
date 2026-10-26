import type { Metadata } from 'next'
import PlannerImageOverviewClient from './PlannerImageOverviewClient'

export const metadata: Metadata = {
  title: 'Planner 圖片檢視器',
  description: '私人 Planner 圖片逐張檢視工具。',
  robots: { index: false, follow: false },
}

export default function PlannerImagesPage() {
  return <PlannerImageOverviewClient />
}
