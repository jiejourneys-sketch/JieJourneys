import type { Metadata } from 'next'
import {
  sakishimaCosmoTowerGuideCanonical,
  sakishimaCosmoTowerGuideDescription,
  sakishimaCosmoTowerGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: sakishimaCosmoTowerGuideTitle,
  description: sakishimaCosmoTowerGuideDescription,
  keywords: [
    '咲洲宇宙塔展望台',
    '咲洲宇宙塔',
    '大阪府咲洲廳舍展望台',
    '咲洲 Cosmo Tower',
    '貿易中心前站',
    'ATC 大阪',
    '大阪周遊券',
    '大阪灣區景點',
  ],
  alternates: { canonical: sakishimaCosmoTowerGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: sakishimaCosmoTowerGuideTitle,
    description: sakishimaCosmoTowerGuideDescription,
    url: sakishimaCosmoTowerGuideCanonical,
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/sakishima-cosmo-tower/building-entrance.jpg',
        width: 3024,
        height: 4032,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: sakishimaCosmoTowerGuideTitle,
    description: sakishimaCosmoTowerGuideDescription,
    images: ['https://www.jiejourneys.com/assets/sakishima-cosmo-tower/building-entrance.jpg'],
  },
}

export default function SakishimaCosmoTowerGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
