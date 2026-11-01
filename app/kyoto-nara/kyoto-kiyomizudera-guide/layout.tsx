import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import {
  kyotoKiyomizuderaGuideCanonical,
  kyotoKiyomizuderaGuideDescription,
  kyotoKiyomizuderaGuideTitle,
} from './pageMeta'

const SHARE_IMAGE =
  'https://www.jiejourneys.com/assets/kyoto-kiyomizudera/precinct-route-map.png'

export const metadata: Metadata = {
  title: kyotoKiyomizuderaGuideTitle,
  description: kyotoKiyomizuderaGuideDescription,
  keywords: [
    '清水寺攻略',
    '清水寺參觀路線',
    '清水寺門票',
    '清水寺交通',
    '清水舞台',
    '音羽瀑布',
    '京都自由行',
  ],
  alternates: { canonical: kyotoKiyomizuderaGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoKiyomizuderaGuideTitle,
    description: kyotoKiyomizuderaGuideDescription,
    url: kyotoKiyomizuderaGuideCanonical,
    images: [{ url: SHARE_IMAGE, width: 1223, height: 1286 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoKiyomizuderaGuideTitle,
    description: kyotoKiyomizuderaGuideDescription,
    images: [SHARE_IMAGE],
  },
}

export default function KyotoKiyomizuderaGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript
        pathname="/kyoto-nara/kyoto-kiyomizudera-guide"
        scriptId="stay22-kyoto-kiyomizudera-guide"
      />
      {children}
    </>
  )
}
