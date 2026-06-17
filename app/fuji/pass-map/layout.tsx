import type { Metadata } from 'next'

const title = '富士山周遊券地圖｜Mt. Fuji Pass 優惠景點、纜車、遊覽船與交通路線整理'
const description =
  '富士山周遊券地圖整理 Mt. Fuji Pass 可用與優惠景點，包含河口湖纜車、河口湖遊覽船、富士急樂園、富士山溫泉、山中湖遊覽船與飲食購物優惠，並可切換紅線、綠線、藍線巴士與富士急行線，快速確認景點位置和交通動線。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'
const searchImage = 'https://www.jiejourneys.com/assets/fuji-passmap-search.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士山周遊券地圖',
    'Mt Fuji Pass',
    '富士山周遊券',
    '富士山 Pass',
    '河口湖周遊券',
    '富士山周遊券景點',
    '富士山周遊券優惠',
    '河口湖纜車',
    '河口湖遊覽船',
    '山中湖遊覽船',
    '富士急樂園',
    '富士山溫泉',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/pass-map',
    images: [{ url: shareImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/pass-map' },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
    },
  },
}

export default function FujiPassMapLayout({ children }: { children: React.ReactNode }) {
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
            url: 'https://www.jiejourneys.com/fuji/pass-map',
            primaryImageOfPage: searchImage,
            thumbnailUrl: searchImage,
          }),
        }}
      />
      {children}
    </>
  )
}
