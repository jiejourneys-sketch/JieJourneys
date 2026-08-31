import type { Metadata } from 'next'
import {
  osakaCastleGuideCanonical,
  osakaCastleGuideDescription,
  osakaCastleGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: osakaCastleGuideTitle,
  description: osakaCastleGuideDescription,
  keywords: [
    '大阪城攻略',
    '大阪城交通',
    '大阪城天守閣',
    '大阪城公園',
    '大阪城御座船',
    '大阪城西之丸庭園',
    '大阪城公園電動車',
    '大阪城 Road Train',
    '大阪周遊券大阪城',
    '大阪自由行',
  ],
  alternates: { canonical: osakaCastleGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: osakaCastleGuideTitle,
    description: osakaCastleGuideDescription,
    url: osakaCastleGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: osakaCastleGuideTitle,
    description: osakaCastleGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function OsakaCastleGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
