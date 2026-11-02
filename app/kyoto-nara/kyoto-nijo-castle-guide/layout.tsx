import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import {
  kyotoNijoCastleGuideCanonical,
  kyotoNijoCastleGuideDescription,
  kyotoNijoCastleGuideTitle,
} from './pageMeta'

const SHARE_IMAGE =
  'https://www.jiejourneys.com/assets/kyoto-nijo-castle/recommended-2-hour-route.png'

export const metadata: Metadata = {
  title: kyotoNijoCastleGuideTitle,
  description: kyotoNijoCastleGuideDescription,
  keywords: [
    '二條城攻略',
    '二条城攻略',
    '二條城門票',
    '二條城參觀路線',
    '二之丸御殿',
    '本丸御殿預約',
    '京都自由行',
  ],
  alternates: { canonical: kyotoNijoCastleGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoNijoCastleGuideTitle,
    description: kyotoNijoCastleGuideDescription,
    url: kyotoNijoCastleGuideCanonical,
    images: [{ url: SHARE_IMAGE, width: 960, height: 708 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoNijoCastleGuideTitle,
    description: kyotoNijoCastleGuideDescription,
    images: [SHARE_IMAGE],
  },
}

export default function KyotoNijoCastleGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript
        pathname="/kyoto-nara/kyoto-nijo-castle-guide"
        scriptId="stay22-kyoto-nijo-castle-guide"
      />
      {children}
    </>
  )
}
