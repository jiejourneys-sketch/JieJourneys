import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import {
  kyotoKinkakujiGuideCanonical,
  kyotoKinkakujiGuideDescription,
  kyotoKinkakujiGuideTitle,
} from './pageMeta'

const SHARE_IMAGE =
  'https://www.jiejourneys.com/assets/kyoto-kinkakuji/grounds-access-map.jpg'

export const metadata: Metadata = {
  title: kyotoKinkakujiGuideTitle,
  description: kyotoKinkakujiGuideDescription,
  keywords: [
    '金閣寺攻略',
    '京都金閣寺',
    '金閣寺門票',
    '金閣寺交通',
    '金閣寺參觀路線',
    '鹿苑寺',
    '京都自由行',
  ],
  alternates: { canonical: kyotoKinkakujiGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: kyotoKinkakujiGuideTitle,
    description: kyotoKinkakujiGuideDescription,
    url: kyotoKinkakujiGuideCanonical,
    images: [{ url: SHARE_IMAGE, width: 3509, height: 2216 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: kyotoKinkakujiGuideTitle,
    description: kyotoKinkakujiGuideDescription,
    images: [SHARE_IMAGE],
  },
}

export default function KyotoKinkakujiGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript
        pathname="/kyoto-nara/kyoto-kinkakuji-guide"
        scriptId="stay22-kyoto-kinkakuji-guide"
      />
      {children}
    </>
  )
}
