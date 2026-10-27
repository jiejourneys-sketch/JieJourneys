import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { plannerFeatures, plannerPageDescription, plannerPageTitle } from './pageContent'

const PLANNER_URL = 'https://www.jiejourneys.com/tools/planner'
const OG_IMAGE = 'https://www.jiejourneys.com/assets/og-share.png'
const description = plannerPageDescription

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '旅杰規劃｜JieJourneys Planner',
  description,
  url: PLANNER_URL,
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  inLanguage: 'zh-Hant',
  featureList: plannerFeatures.map((item) => item.title),
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'TWD',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(PLANNER_URL),
  title: plannerPageTitle,
  description,
  alternates: {
    canonical: PLANNER_URL,
  },
  icons: { icon: '/assets/logo.jpg', apple: '/assets/logo.jpg' },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: PLANNER_URL,
    siteName: '旅杰 JieJourneys',
    title: plannerPageTitle,
    description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: '旅杰規劃 JieJourneys Planner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: plannerPageTitle,
    description,
    images: [OG_IMAGE],
  },
}

export default function ToolsPlannerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {children}
    </>
  )
}
