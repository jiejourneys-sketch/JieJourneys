import type { Metadata } from 'next'

const title = '日本退稅新制懶人包｜2026/11/1 起免稅流程、機場退稅、完美行購物一次看懂'
const description =
  '日本 2026 年 11 月 1 日起調整外國旅客免稅制度，從現場直接免稅改為先付款、出境確認後退稅。整理新舊制度差異、最新退稅流程、機場 KIOSK 退稅注意事項，以及完美行購物優惠碼 GGGT6XAA。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '日本退稅',
    '日本退稅新制',
    '日本退稅2026',
    '日本免稅',
    '日本免稅制度',
    '日本退稅流程',
    '日本機場退稅',
    '日本購物攻略',
    '完美行購物',
    'WAmazing',
    'GGGT6XAA',
  ],
  alternates: { canonical: 'https://www.jiejourneys.com/japan/tax-free-2026' },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title,
    description,
    url: 'https://www.jiejourneys.com/japan/tax-free-2026',
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [shareImage],
  },
}

export default function JapanTaxFree2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
