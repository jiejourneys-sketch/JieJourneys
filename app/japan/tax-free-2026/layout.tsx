import type { Metadata } from 'next'

const title = '日本退稅新制懶人包｜2026/11/1 退稅流程、VJW 與 90 天規定'
const description =
  '日本 2026 年 11 月 1 日購買分起改採先付含稅價、出境確認後退款。整理同店同日未稅 5,000 日圓門檻、90 天期限、KIOSK、Visit Japan Web 七座機場、紅綠燈判定與托運注意事項。'
const shareImage = 'https://www.jiejourneys.com/assets/og-share.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    '日本退稅',
    '日本退稅新制',
    '日本退稅2026',
    '日本免稅',
    '日本免稅新制',
    '日本機場退稅',
    'Visit Japan Web退稅',
    '日本退稅90天',
    'Tax Refund Kiosk',
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
