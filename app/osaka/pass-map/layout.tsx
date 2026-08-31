import type { Metadata } from 'next'

const title = '大阪周遊券地圖｜免費設施・優惠景點・餐飲特典互動地圖 | JieJourneys(旅杰)'
const description =
  '用大阪周遊券地圖快速查看免費設施、優惠景點與餐飲特典位置，搭配高價值/中價值/低價值標記、Google Map 導航、行程排序工具與大阪周遊券購買連結，方便規劃難波、梅田、大阪城、天保山等區域路線。'
const searchImage = 'https://www.jiejourneys.com/assets/osaka-passmap-search.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '大阪周遊券地圖',
    '大阪周遊卡地圖',
    'Osaka Amazing Pass',
    '大阪周遊券景點',
    '大阪周遊券免費設施',
    '大阪周遊券優惠設施',
    '大阪周遊券購買',
    '大阪周遊券KKDAY',
    '大阪周遊券KLOOK',
    '大阪周遊券Trip',
    '大阪周遊券划算',
    '大阪周遊券路線',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/pass-map',
    images: [{ url: searchImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [searchImage],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/pass-map' },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
    },
  },
}

export default function OsakaPassMapLayout({ children }: { children: React.ReactNode }) {
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
            url: 'https://www.jiejourneys.com/osaka/pass-map',
            primaryImageOfPage: searchImage,
            thumbnailUrl: searchImage,
          }),
        }}
      />
      {children}
    </>
  )
}
