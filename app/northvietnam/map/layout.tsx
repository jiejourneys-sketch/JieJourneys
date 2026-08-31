import type { Metadata } from 'next'

const title = '越南北越地圖｜免費互動地圖・河內沙壩下龍灣陸龍灣・住宿票券交通・GoogleMap一鍵導航'
const description =
  '北越地圖整理河內、沙壩、下龍灣、陸龍灣、寧平等熱門區域，並把票券景點、免費景點、商店美食與住宿推薦放在同一張免費互動地圖。可切換票券、景點、商店、住宿分類，查看 KKDAY、KLOOK、Agoda 連結，一鍵開啟 Google Map 導航，快速規劃北越自由行路線。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'
const searchImage = 'https://www.jiejourneys.com/assets/northvietnam-map-search.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '北越地圖',
    '越南北越地圖',
    '北越景點地圖',
    '北越住宿地圖',
    '北越票券地圖',
    '河內地圖',
    '沙壩地圖',
    '下龍灣地圖',
    '陸龍灣地圖',
    '寧平地圖',
    '北越自由行地圖',
    '北越Google Map',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/northvietnam/map',
    images: [{ url: shareImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/map' },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
    },
  },
}

export default function NorthVietnamMapLayout({ children }: { children: React.ReactNode }) {
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
            url: 'https://www.jiejourneys.com/northvietnam/map',
            primaryImageOfPage: searchImage,
            thumbnailUrl: searchImage,
          }),
        }}
      />
      {children}
    </>
  )
}
