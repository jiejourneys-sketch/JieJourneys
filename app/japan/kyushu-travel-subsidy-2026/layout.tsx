import type { Metadata } from 'next'
import {
  kyushuTravelSubsidy2026Canonical,
  kyushuTravelSubsidy2026Description,
  kyushuTravelSubsidy2026Title,
} from './pageMeta'

export const metadata: Metadata = {
  title: kyushuTravelSubsidy2026Title,
  description: kyushuTravelSubsidy2026Description,
  keywords: [
    '九州旅遊補助',
    '九州旅遊補助2026',
    '九州復興應援割',
    '日本九州旅遊補助',
    '熊本旅遊補助',
    '鹿兒島旅遊補助',
    '九州住宿優惠',
    '熊本住宿優惠',
    '鹿兒島住宿優惠',
    '日本旅遊補助2026',
  ],
  alternates: { canonical: kyushuTravelSubsidy2026Canonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: kyushuTravelSubsidy2026Title,
    description: kyushuTravelSubsidy2026Description,
    url: kyushuTravelSubsidy2026Canonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyushuTravelSubsidy2026Title,
    description: kyushuTravelSubsidy2026Description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function KyushuTravelSubsidy2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
