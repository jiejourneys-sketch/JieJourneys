import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import AnalyticsEvents from './components/AnalyticsEvents'
import BillLogo from './components/BillLogo'
import { BillPathProvider } from './components/BillPathProvider'

const desc =
  '旅杰分帳（JieJourneys Bill）是最簡單好用的旅行分帳工具：免登入建立帳本、多人共同記帳、支出分攤與結帳建議一目了然，快速算清楚每個人該付多少、該收多少。'

const SITE_URL = 'https://www.jiejourneys.com'
const OG_IMAGE = 'https://www.jiejourneys.com/assets/og-share.png'
const BILL_URL = `${SITE_URL}/tools/bill`

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: '旅杰分帳｜JieJourneys Bill', template: '%s｜JieJourneys Bill' },
    description: desc,
    alternates: { canonical: BILL_URL },
    icons: { icon: '/assets/logo.jpg', apple: '/assets/logo.jpg' },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      url: BILL_URL,
      siteName: 'JieJourneys',
      title: '旅杰分帳｜JieJourneys Bill',
      description: desc,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: '旅杰分帳 JieJourneys Bill' }]
    },
    twitter: {
      card: 'summary_large_image',
      title: '旅杰分帳｜JieJourneys Bill',
      description: desc,
      images: [OG_IMAGE]
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
    <div className="bill-app">
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
        <BillPathProvider initialBasePath="/tools/bill">
        <AnalyticsEvents />
        <header className="app-header">
          <nav className="app-nav">
            <a href="https://www.jiejourneys.com" className="brand" aria-label="回官網" data-event="logotosite">
              <span className="brand-logo" aria-hidden="true">
                <BillLogo />
              </span>
              <span className="brand-text">JieJourneys｜旅杰</span>
            </a>
            <div className="nav-actions">
              <a href="https://www.jiejourneys.com" target="_blank" rel="noreferrer" data-event="billtosite">
                回官網
              </a>
            </div>
          </nav>
        </header>
        <main className="app-main">{children}</main>
        </BillPathProvider>
    </div>
  )
}
