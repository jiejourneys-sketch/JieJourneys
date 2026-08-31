import type { Metadata } from 'next'
import {
  busanCapsuleTrainGuideCanonical,
  busanCapsuleTrainGuideDescription,
  busanCapsuleTrainGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: busanCapsuleTrainGuideTitle,
  description: busanCapsuleTrainGuideDescription,
  keywords: [
    '釜山膠囊列車攻略',
    '海雲台膠囊列車',
    '海雲台藍線公園',
    'Haeundae Blueline Park',
    '海岸列車',
    '天空膠囊列車',
    '青沙浦平交道',
    '青沙浦天空步道',
    '膠囊列車訂票',
    '釜山自由行',
  ],
  alternates: { canonical: busanCapsuleTrainGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: busanCapsuleTrainGuideTitle,
    description: busanCapsuleTrainGuideDescription,
    url: busanCapsuleTrainGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: busanCapsuleTrainGuideTitle,
    description: busanCapsuleTrainGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function BusanCapsuleTrainGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
