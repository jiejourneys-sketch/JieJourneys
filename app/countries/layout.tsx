import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '其他國家／地區攻略 | JieJourneys(旅杰)',
  description: 'JieJourneys(旅杰) 其他國家與地區自由行攻略總覽，搜尋或點選卡片進入各區攻略。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'JieJourneys(旅杰)',
    title: '其他國家／地區攻略 | JieJourneys(旅杰)',
    description: '搜尋或點選卡片進入各區攻略。',
    url: 'https://www.jiejourneys.com/countries/',
    images: [{ url: 'https://www.jiejourneys.com/assets/og-share.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.jiejourneys.com/countries/' },
}

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
