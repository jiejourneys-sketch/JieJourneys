import type { Metadata } from 'next'
import {
  autumnLeavesForecast2026Canonical,
  autumnLeavesForecast2026Description,
  autumnLeavesForecast2026Title,
} from './pageMeta'

const FORECAST_IMAGE = 'https://www.jiejourneys.com/assets/japan-autumn-leaves-forecast-2026/forecast-map.png'

export const metadata: Metadata = {
  title: autumnLeavesForecast2026Title,
  description: autumnLeavesForecast2026Description,
  keywords: [
    '2026日本賞楓預測',
    '日本紅葉預測2026',
    '日本楓葉預測2026',
    '東京紅葉2026',
    '京都紅葉2026',
    '大阪紅葉2026',
    '日本銀杏2026',
    '日本賞楓時間',
  ],
  alternates: { canonical: autumnLeavesForecast2026Canonical },
  openGraph: {
    type: 'article',
    locale: 'zh_TW',
    siteName: '旅杰 JieJourneys',
    title: autumnLeavesForecast2026Title,
    description: autumnLeavesForecast2026Description,
    url: autumnLeavesForecast2026Canonical,
    images: [{ url: FORECAST_IMAGE, width: 1122, height: 1400, alt: '2026 日本賞楓預測地圖' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: autumnLeavesForecast2026Title,
    description: autumnLeavesForecast2026Description,
    images: [FORECAST_IMAGE],
  },
}

export default function AutumnLeavesForecast2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
