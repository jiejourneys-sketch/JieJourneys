import type { Metadata } from 'next'

const title = '富士河口湖地圖｜免費互動地圖・住宿票券景點・GoogleMap一鍵導航'
const description =
  '富士河口湖地圖整理河口湖站、大石公園、忍野八海、淺間公園、富士急樂園、五合目、御殿場 Outlet、箱根、山中湖等熱門區域，並把票券景點、免費景點與住宿推薦放在同一張免費互動地圖。可切換票券、景點、住宿分類，查看 KKDAY、KLOOK、Trip 購票連結，一鍵開啟 Google Map 導航。'
const image = 'https://www.jiejourneys.com/assets/fuji-map-og.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '富士河口湖地圖',
    '富士山地圖',
    '河口湖地圖',
    '富士河口湖景點地圖',
    '富士河口湖住宿地圖',
    '富士河口湖票券地圖',
    '河口湖住宿地圖',
    '河口湖景點',
    '忍野八海地圖',
    '大石公園地圖',
    '富士急樂園地圖',
    '箱根地圖',
  ],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title,
    description,
    url: 'https://www.jiejourneys.com/fuji/map',
    images: [{ url: image, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/fuji/map' },
}

export default function FujiMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
