import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import {
  kyotoSannenzakaNinenzakaGuideCanonical,
  kyotoSannenzakaNinenzakaGuideDescription,
  kyotoSannenzakaNinenzakaGuideTitle,
} from './pageMeta'

const SHARE_IMAGE =
  'https://www.jiejourneys.com/assets/kyoto-higashiyama-slopes/kiyomizuzaka-sannenzaka-ninenzaka-route.png'

export const metadata: Metadata = {
  title: kyotoSannenzakaNinenzakaGuideTitle,
  description: kyotoSannenzakaNinenzakaGuideDescription,
  keywords: [
    '三年坂攻略',
    '二年坂攻略',
    '一年坂攻略',
    '產寧坂',
    '二寧坂',
    '一念坂',
    '清水寺散步路線',
    '京都東山自由行',
  ],
  alternates: { canonical: kyotoSannenzakaNinenzakaGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoSannenzakaNinenzakaGuideTitle,
    description: kyotoSannenzakaNinenzakaGuideDescription,
    url: kyotoSannenzakaNinenzakaGuideCanonical,
    images: [{ url: SHARE_IMAGE, width: 606, height: 1078 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoSannenzakaNinenzakaGuideTitle,
    description: kyotoSannenzakaNinenzakaGuideDescription,
    images: [SHARE_IMAGE],
  },
}

export default function KyotoSannenzakaNinenzakaGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript
        pathname="/kyoto-nara/kyoto-sannenzaka-ninenzaka-guide"
        scriptId="stay22-kyoto-sannenzaka-ninenzaka-guide"
      />
      {children}
    </>
  )
}
