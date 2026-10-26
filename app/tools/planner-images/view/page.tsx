import type { Metadata } from 'next'
import PlannerImageViewerClient from '../PlannerImageViewerClient'

export const metadata: Metadata = {
  title: 'Planner 照片',
  description: 'Planner 私人照片唯讀檢視頁。',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default function PlannerImageViewerPage() {
  return (
    <>
      {/* The share token lives in the URL fragment. Disable GA before its
          afterInteractive script runs so the capability URL is not collected. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "window['ga-disable-G-NCTMJ4F5XP']=true;",
        }}
      />
      <PlannerImageViewerClient />
    </>
  )
}
