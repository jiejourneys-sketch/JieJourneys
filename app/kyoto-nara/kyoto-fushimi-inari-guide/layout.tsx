import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import {
  kyotoFushimiInariGuideCanonical,
  kyotoFushimiInariGuideDescription,
  kyotoFushimiInariGuideTitle,
} from './pageMeta'

const SHARE_IMAGE =
  'https://www.jiejourneys.com/assets/kyoto-fushimi-inari/precinct-map.png'

export const metadata: Metadata = {
  title: kyotoFushimiInariGuideTitle,
  description: kyotoFushimiInariGuideDescription,
  keywords: [
    '伏見稻荷大社',
    '千本鳥居',
    '伏見稻荷攻略',
    '伏見稻荷路線',
    '伏見稻荷所需時間',
    '京都自由行',
    'JR稻荷站',
  ],
  alternates: { canonical: kyotoFushimiInariGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoFushimiInariGuideTitle,
    description: kyotoFushimiInariGuideDescription,
    url: kyotoFushimiInariGuideCanonical,
    images: [{ url: SHARE_IMAGE, width: 1536, height: 871 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoFushimiInariGuideTitle,
    description: kyotoFushimiInariGuideDescription,
    images: [SHARE_IMAGE],
  },
}

export default function KyotoFushimiInariGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript
        pathname="/kyoto-nara/kyoto-fushimi-inari-guide"
        scriptId="stay22-kyoto-fushimi-inari-guide"
      />
      {children}
    </>
  )
}
