import type { Metadata } from 'next'
import {
  dotonboriCruiseGuideCanonical,
  dotonboriCruiseGuideDescription,
  dotonboriCruiseGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: dotonboriCruiseGuideTitle,
  description: dotonboriCruiseGuideDescription,
  keywords: [
    '道頓堀遊船',
    'Tombori River Cruise',
    'Wonder Cruise',
    '道頓堀川遊船',
    '大阪周遊券遊船',
    '固力果拍照',
    '大阪難波景點',
    '大阪自由行',
  ],
  alternates: { canonical: dotonboriCruiseGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: dotonboriCruiseGuideTitle,
    description: dotonboriCruiseGuideDescription,
    url: dotonboriCruiseGuideCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/dotonbori-cruise/wonder-glico-night.png',
        width: 1365,
        height: 2048,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: dotonboriCruiseGuideTitle,
    description: dotonboriCruiseGuideDescription,
    images: ['https://www.jiejourneys.com/assets/dotonbori-cruise/wonder-glico-night.png'],
  },
}

export default function DotonboriCruiseGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
