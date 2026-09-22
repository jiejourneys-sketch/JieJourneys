'use client'

import { useEffect, useState } from 'react'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import PromoResourceCard from '@/components/PromoResourceCard'
import { BOOKING_AFFILIATE_HOME_URL } from '@/lib/plannerAffiliate'

type Resource = {
  title: string
  tags: string
  href: string
  event: string
  promoCode?: string
}

const travelResources: Resource[] = [
  {
    title: 'KKday',
    tags: 'KKday 優惠碼 票券 行程 體驗',
    href: 'https://www.kkday.com/zh-tw/?cid=22312',
    event: 'promo_KKDAY',
    promoCode: 'KKJIE94',
  },
  {
    title: 'Klook',
    tags: 'Klook 優惠碼 票券 行程 體驗',
    href: 'https://www.klook.com/zh-TW/?aid=93798',
    event: 'promo_KLOOK',
    promoCode: 'JieJourneys',
  },
  {
    title: 'Trip.com',
    tags: 'Trip.com 訂房 飯店 住宿',
    href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
    event: 'promo_Trip',
  },
  {
    title: 'Agoda',
    tags: 'Agoda 訂房 飯店 住宿',
    href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw',
    event: 'promo_Agoda',
  },
  {
    title: 'Booking.com',
    tags: 'Booking.com 訂房 飯店 民宿',
    href: BOOKING_AFFILIATE_HOME_URL,
    event: 'promo_Booking',
  },
  {
    title: '日本完美行購物',
    tags: '完美行購物 優惠碼 日本 購物',
    href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339',
    event: 'promo_wamazingbuy',
    promoCode: 'GGGT6XAA',
  },
  {
    title: 'KarDear 上網卡',
    tags: 'eSIM SIM 卡 實體卡 旅遊上網 KarDear',
    href: 'https://kardear.com/?ref=390',
    event: 'promo_kardear',
  },
  {
    title: 'GetYourGuide',
    tags: 'GetYourGuide 歐洲旅遊 景點 體驗 行程',
    href: 'https://gyg.me/jiejourneys-app',
    event: 'promo_getyourguide',
    promoCode: 'JIEJOURNEYS5',
  },
  {
    title: 'TOCOO 租車',
    tags: '日本 租車 優惠碼 自駕 合作 tocoo car rental japan',
    href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate',
    event: 'japancarrental_tocoo',
    promoCode: 'K24ZW3',
  },
  {
    title: '日本完美行滑雪',
    tags: '日本 滑雪 預訂 合作 wamazing snow japan',
    href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=2i98k457',
    event: 'wamazingsnow',
  },
]

function ResourceGrid({ resources, section }: { resources: Resource[]; section: string }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!copiedCode) return
    const timeout = window.setTimeout(() => setCopiedCode(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [copiedCode])

  return (
    <>
      <div className="resources-grid">
        {resources.map((resource) => (
          <PromoResourceCard key={resource.event} {...resource} section={section} onCopied={setCopiedCode} />
        ))}
      </div>
      {copiedCode ? <div className="promo-copy-toast" role="status">已複製優惠碼：{copiedCode}</div> : null}
    </>
  )
}

export default function ToolsResourcesPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="toolsresources" />
      <main className="container">
        <h1>旅遊優惠</h1>
        <section id="travel-promos" className="section" aria-label="旅遊優惠" style={{ paddingTop: 0 }}>
          <ResourceGrid resources={travelResources} section="travel_resources" />
        </section>
      </main>
      <Footer />
    </>
  )
}
