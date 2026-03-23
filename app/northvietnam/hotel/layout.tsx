import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-越南北越自由行住宿攻略',
  description:
    'JieJourneys(旅杰)越南北越自由行-短影片示範、實測動線與區域住宿比較，含票券與互動地圖連結，幫你在最短時間內選好越南北越住宿。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: 'JieJourneys(旅杰)-越南北越自由行住宿攻略',
    description:
      'JieJourneys(旅杰)越南北越自由行-短影片示範、實測動線與區域住宿比較，含票券與互動地圖連結，幫你在最短時間內選好越南北越住宿。',
    url: 'https://www.jiejourneys.com/northvietnam/hotel',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)-越南北越自由行住宿攻略',
    description:
      'JieJourneys(旅杰)越南北越自由行-短影片示範、實測動線與區域住宿比較，含票券與互動地圖連結，幫你在最短時間內選好越南北越住宿。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/northvietnam/hotel' },
}

export default function NorthVietnamHotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
