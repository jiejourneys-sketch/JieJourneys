import type { Metadata } from 'next'
import Script from 'next/script'
import GtagCapture from '@/components/GtagCapture'
import RwdOverflowWarning from '@/components/RwdOverflowWarning'
import './globals.css'

export const metadata: Metadata = {
  title: 'JieJourneys(旅杰)-自由行旅遊速成攻略',
  description:
    'JieJourneys(旅杰)-以短片拆解旅行重點，含可下載行程與票券連結，讓你用最短時間精準規劃旅程。',
  metadataBase: new URL('https://www.jiejourneys.com'),
  icons: { icon: '/assets/logo.jpg', apple: '/assets/logo.jpg' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys (旅杰)',
    title: 'JieJourneys(旅杰)-自由行旅遊速成攻略',
    description:
      'JieJourneys(旅杰)-以短片拆解旅行重點，含可下載行程與票券連結，讓你用最短時間精準規劃旅程。',
    url: 'https://www.jiejourneys.com/',
    images: [
      {
        url: 'https://www.jiejourneys.com/assets/og-share.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JieJourneys(旅杰)-自由行旅遊速成攻略',
    description:
      'JieJourneys(旅杰)-以短片拆解旅行重點，含可下載行程與票券連結，讓你用最短時間精準規劃旅程。',
    images: ['https://www.jiejourneys.com/assets/og-share.png'],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/' },
}

const GA_ID = 'G-NCTMJ4F5XP'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preload" as="image" href="/assets/logo.jpg" />
        <link rel="preload" as="image" href="/busan/journeys/assets/logo.jpg" />
        <link rel="preload" as="image" href="/busan/journeys/assets/preview.png" />
        <link rel="preload" as="image" href="/tokyo/journeys/assets/logo.jpg" />
        <link rel="preload" as="image" href="/tokyo/journeys/assets/preview.png" />
        <link rel="preload" as="image" href="/northvietnam/journeys/assets/logo.jpg" />
        <link rel="preload" as="image" href="/northvietnam/journeys/assets/preview.png" />
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.va = window.va || function () {
                (window.vaq = window.vaq || []).push(arguments);
              };
            `,
          }}
        />
        {process.env.VERCEL === '1' && (
          <Script defer src="/_vercel/insights/script.js" strategy="afterInteractive" />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'JieJourneys',
              alternateName: '旅杰',
              url: 'https://www.jiejourneys.com/',
              logo: 'https://www.jiejourneys.com/assets/og-share.png',
              image: 'https://www.jiejourneys.com/assets/og-share.png',
              sameAs: [
                'https://instagram.com/jiejourneys',
                'https://youtube.com/@jiejourneys',
                'https://threads.net/@jiejourneys',
                'https://xhslink.com/m/6OAjLumXIO1',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'JieJourneys',
              alternateName: '旅杰',
              url: 'https://www.jiejourneys.com/',
              publisher: {
                '@type': 'Organization',
                name: 'JieJourneys',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.jiejourneys.com/assets/og-share.png',
                },
              },
            }),
          }}
        />
        <GtagCapture />
        <RwdOverflowWarning />
        {children}
      </body>
    </html>
  )
}
