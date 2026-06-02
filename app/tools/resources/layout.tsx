import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '其他旅遊資源｜JieJourneys(旅杰)',
  description: '整理 JieJourneys(旅杰) 合作旅遊資源與自由行工具。',
}

export default function ToolsResourcesLayout({ children }: { children: ReactNode }) {
  return children
}
