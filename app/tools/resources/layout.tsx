import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const RESOURCES_URL = 'https://www.jiejourneys.com/tools/resources'
const description = '整理 JieJourneys(旅杰) 的旅遊優惠碼、合作服務與自由行工具，包含 KKday、Klook、完美行購物、eSIM、租車與訂房連結。'

export const metadata: Metadata = {
  title: '旅遊優惠與資源｜JieJourneys(旅杰)',
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
    siteName: '旅杰 JieJourneys',
    title: '旅遊優惠與資源｜JieJourneys(旅杰)',
    description,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '旅遊優惠與資源｜JieJourneys(旅杰)',
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function ToolsResourcesLayout({ children }: { children: ReactNode }) {
  return children
}
