import type { Metadata } from 'next'
import {
  tokyoSensojiGuideCanonical,
  tokyoSensojiGuideDescription,
  tokyoSensojiGuideTitle,
} from './pageMeta'

export const metadata: Metadata = {
  title: tokyoSensojiGuideTitle,
  description: tokyoSensojiGuideDescription,
  keywords: [
    '淺草寺攻略',
    '淺草寺',
    '雷門',
    '仲見世通',
    '寶藏門',
    '五重塔',
    '淺草文化觀光中心',
    '淺草免費觀景台',
    '淺草站出口',
    '東京自由行',
  ],
  alternates: { canonical: tokyoSensojiGuideCanonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: tokyoSensojiGuideTitle,
    description: tokyoSensojiGuideDescription,
    url: tokyoSensojiGuideCanonical,
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: tokyoSensojiGuideTitle,
    description: tokyoSensojiGuideDescription,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
}

export default function TokyoSensojiGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
