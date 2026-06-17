import type { Metadata } from 'next'

const title = '釜山景點地圖｜免費互動地圖・GoogleMap/NaverMap一鍵導航'
const description =
  '去釜山前先收藏！這張免費互動地圖整合景點、美食、住宿、交通與票券資訊，支援分類篩選、導航與購票連結，一張地圖搞定整趟自由行。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'
const searchImage = 'https://www.jiejourneys.com/assets/busan-map-search.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '釜山景點地圖',
    '釜山地圖',
    '釜山自由行地圖',
    '釜山住宿地圖',
    '釜山票券地圖',
    '釜山Google Map',
    '釜山Naver Map',
    '海雲台地圖',
    '西面地圖',
    '南浦洞地圖',
    '廣安里地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/busan/map',
    images: [{ url: shareImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/busan/map' },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
    },
  },
}

export default function BusanMapLayout({ children }: { children: React.ReactNode }) {
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
            url: 'https://www.jiejourneys.com/busan/map',
            primaryImageOfPage: searchImage,
            thumbnailUrl: searchImage,
          }),
        }}
      />
      {children}
    </>
  )
}
