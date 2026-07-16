import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const RESOURCES_URL = 'https://www.jiejourneys.com/tools/resources'
const description = '整理 JieJourneys(旅杰) 合作旅遊資源與自由行工具。'

export const metadata: Metadata = {
  title: '其他旅遊資源｜JieJourneys(旅杰)',
  description,
  metadataBase: new URL('https://www.jiejourneys.com'),
  alternates: { canonical: RESOURCES_URL },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: RESOURCES_URL,
    siteName: 'JieJourneys(旅杰)',
    title: '其他旅遊資源｜JieJourneys(旅杰)',
    description,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '其他旅遊資源｜JieJourneys(旅杰)',
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function ToolsResourcesLayout({ children }: { children: ReactNode }) {
  return children
}
