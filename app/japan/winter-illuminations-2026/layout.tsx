import type { Metadata } from 'next'
import Stay22PageScript from '@/components/Stay22PageScript'
import { winterIlluminations2026Canonical, winterIlluminations2026Description, winterIlluminations2026Title } from './pageMeta'

export const metadata: Metadata = {
  title: winterIlluminations2026Title,
  description: winterIlluminations2026Description,
  alternates: { canonical: winterIlluminations2026Canonical },
  keywords: ['日本耶誕2026', '日本聖誕市集2026', '東京聖誕市集新豐洲', '芝公園聖誕市集', '橫濱紅磚倉庫聖誕市集', '札幌慕尼黑聖誕市集', '天王寺聖誕市集', '梅田聖誕市集', '神戶布引香草園', '名古屋聖誕市集', '日本點燈地圖'],
  openGraph: {
    type: 'article', locale: 'zh_TW', siteName: '旅杰 JieJourneys',
    title: winterIlluminations2026Title, description: winterIlluminations2026Description,
    url: winterIlluminations2026Canonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630, alt: '旅杰日本冬季點燈與聖誕市集攻略' }],
  },
  twitter: { card: 'summary_large_image', title: winterIlluminations2026Title, description: winterIlluminations2026Description, images: ['https://www.jiejourneys.com/assets/og-share.png'] },
}

export default function WinterGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stay22PageScript pathname="/japan/winter-illuminations-2026" scriptId="stay22-winter-illuminations-2026" />
      {children}
    </>
  )
}
