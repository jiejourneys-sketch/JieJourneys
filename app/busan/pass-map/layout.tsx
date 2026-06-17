import type { Metadata } from 'next'

const title = '釜山Pass地圖｜免費互動地圖｜高中低價值景點・A/B區景點・24/48小時路線'
const description =
  '釜山Pass地圖整理 Visit Busan Pass 可用景點與設施，依價格高、中、低和紫色/A區、藍色/B區分類，放在互動地圖上比較位置與順路動線。快速規劃 24/48 小時、Big3、Big5 怎麼玩最划算，並附 KKDAY、KLOOK、Trip 購買連結。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'
const searchImage = 'https://www.jiejourneys.com/assets/busan-passmap-search.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山通行證地圖',
    '釜山Pass地圖',
    'Visit Busan Pass',
    'Visit Busan Pass地圖',
    '釜山Pass A區景點',
    '釜山Pass B區景點',
    '釜山Pass 24小時',
    '釜山Pass 48小時',
    '釜山Pass Big3',
    '釜山Pass Big5',
    '釜山通行證景點',
    '釜山通行證路線',
    '釜山自由行地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/pass-map',
    images: [{ url: shareImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/pass-map' },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
    },
  },
}

export default function BusanPassMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url: 'https://www.jiejourneys.com/busan/pass-map',
            primaryImageOfPage: searchImage,
            thumbnailUrl: searchImage,
          }),
        }}
      />
      {children}
    </>
  )
}
