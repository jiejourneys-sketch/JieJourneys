import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-日本東京自由行票券攻略',
  description:
    'JieJourneys(旅杰)日本東京自由行-一頁整理所有日本東京票券，包含教學短片、行程建議與購票連結，幫你在最短時間內選好票券。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: 'JieJourneys(旅杰)日本東京自由行-日本東京自由行票券攻略',
    description:
      'JieJourneys(旅杰)-一頁整理所有日本東京票券，包含教學短片、行程建議與購票連結，幫你在最短時間內選好票券。',
    url: 'https://www.jiejourneys.com/tokyo/ticket',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)日本東京自由行-日本東京自由行票券攻略',
    description:
      'JieJourneys(旅杰)-一頁整理所有日本東京票券，包含教學短片、行程建議與購票連結，幫你在最短時間內選好票券。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/tokyo/ticket' },
}

export default function TokyoTicketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
