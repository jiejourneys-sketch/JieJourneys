import type { Metadata } from 'next'
import {
  osakaAmazingPassHiddenSpotsGuideCanonical,
  osakaAmazingPassHiddenSpotsGuideDescription,
  osakaAmazingPassHiddenSpotsGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: osakaAmazingPassHiddenSpotsGuideTitle,
  description: osakaAmazingPassHiddenSpotsGuideDescription,
  keywords: [
    '大阪周遊券景點',
    '大阪周遊券低調景點',
    '四天王寺大阪周遊券',
    'GLION MUSEUM大阪周遊券',
    '天王寺動物園大阪周遊券',
    '大阪自由行',
    '大阪天王寺景點',
    '大阪港景點',
  ],
  alternates: { canonical: osakaAmazingPassHiddenSpotsGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: osakaAmazingPassHiddenSpotsGuideTitle,
    description: osakaAmazingPassHiddenSpotsGuideDescription,
    url: osakaAmazingPassHiddenSpotsGuideCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/osaka-amazing-pass-hidden-spots/shitennoji-gates-map.png',
        width: 1075,
        height: 963,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: osakaAmazingPassHiddenSpotsGuideTitle,
    description: osakaAmazingPassHiddenSpotsGuideDescription,
    images: ['https://www.jiejourneys.com/assets/osaka-amazing-pass-hidden-spots/shitennoji-gates-map.png'],
  },
}

export default function OsakaAmazingPassHiddenSpotsGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
