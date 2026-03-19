import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AnalyticsEvents from './components/AnalyticsEvents'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const desc =
  '旅杰分帳（JieJourneys Bill）是最簡單好用的旅行分帳工具：免登入建立帳本、多人共同記帳、支出分攤與結帳建議一目了然，快速算清楚每個人該付多少、該收多少。'

export function generateMetadata(): Metadata {
  const icon = '/logo.jpg'
  return {
    metadataBase: new URL('https://www.jiejourneys.com'),
    title: { default: '旅杰分帳｜JieJourneys Bill', template: '%s｜JieJourneys Bill' },
    description: desc,
    icons: { icon, apple: icon },
    openGraph: {
      type: 'website',
      title: '旅杰分帳｜JieJourneys Bill',
      description: desc,
      images: [icon]
    },
    twitter: {
      card: 'summary_large_image',
      title: '旅杰分帳｜JieJourneys Bill',
      description: desc,
      images: [icon]
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script id="ga-init">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        ) : null}
        <AnalyticsEvents />
        <header className="app-header">
          <nav className="app-nav">
            <Link href="/" className="brand" aria-label="回首頁" data-event="logotosite">
              <span className="brand-logo" aria-hidden="true">
                <Image src="/logo.jpg" alt="" width={34} height={34} priority />
              </span>
              <span className="brand-text">JieJourneys｜旅杰</span>
            </Link>
            <div className="nav-actions">
              <a href="https://www.jiejourneys.com" target="_blank" rel="noreferrer" data-event="billtosite">
                回官網
              </a>
            </div>
          </nav>
        </header>
        <main className="app-main">{children}</main>
      </body>
    </html>
  )
}
