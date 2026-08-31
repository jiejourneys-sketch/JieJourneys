import type { Metadata } from 'next'

const title =
  '大阪住宿推薦與區域攻略｜難波、心齋橋、梅田、天王寺飯店怎麼選 | JieJourneys(旅杰)'
const description =
  '大阪自由行住宿推薦，整理道頓堀/難波、心齋橋、梅田/大阪站、天王寺四大住宿區域。第一次去大阪、想逛道頓堀和黑門市場可選難波；重視購物和地鐵動線可住心齋橋；會安排京都、神戶、奈良或 USJ 日本環球影城一日遊，梅田大阪站最省轉車時間；想控制預算又方便往返關西機場，天王寺也是好選擇。頁面附飯店查價、住宿地圖與大阪周遊卡景點位置，方便比較 Trip、Agoda 與實際行程動線。'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/osaka/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/osaka/hotel' },
}

export default function OsakaHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
