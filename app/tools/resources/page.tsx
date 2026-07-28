'use client'

import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import PromoLink from '@/components/PromoLink'

type Resource = {
  title: string
  tags: string
  href: string
  event: string
  promoCode?: string
  universalLink?: boolean
}

const travelPromos: Resource[] = [
  {
    title: 'KKday 優惠｜KKJIE94',
    tags: 'KKday 優惠碼 票券 行程 體驗',
    href: 'https://www.kkday.com/zh-tw/?cid=22312',
    event: 'promo_KKDAY',
    promoCode: 'KKJIE94',
    universalLink: true,
  },
  {
    title: 'Klook 優惠｜JieJourneys',
    tags: 'Klook 優惠碼 票券 行程 體驗',
    href: 'https://www.klook.com/zh-TW/?aid=93798',
    event: 'promo_KLOOK',
    promoCode: 'JieJourneys',
    universalLink: true,
  },
  {
    title: 'eSIM 優惠｜JieJourneys',
    tags: 'eSIM 優惠 旅遊上網 esimconnect',
    href: 'https://esimconnect.com.tw/#/access/esimbuy?referencecode=jiejourneys',
    event: 'promo_esimconnect',
    promoCode: 'jiejourneys',
  },
]

const travelServices: Resource[] = [
  {
    title: '日本租車優惠｜K24ZW3',
    tags: '日本 租車 優惠碼 自駕 合作 tocoo car rental japan',
    href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate',
    event: 'japancarrental_tocoo',
    promoCode: 'K24ZW3',
  },
  {
    title: '日本滑雪預訂（合作）',
    tags: '日本 滑雪 預訂 合作 wamazing snow japan',
    href: 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=2i98k457',
    event: 'wamazingsnow',
  },
  {
    title: 'Trip.com 訂房',
    tags: 'Trip.com 訂房 飯店 住宿',
    href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
    event: 'promo_Trip',
  },
  {
    title: 'Agoda 訂房',
    tags: 'Agoda 訂房 飯店 住宿',
    href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw',
    event: 'promo_Agoda',
  },
]

function ResourceGrid({ resources, section }: { resources: Resource[]; section: string }) {
  return (
    <div className="popular-grid resources-grid">
      {resources.map((resource) =>
        resource.promoCode ? (
          <PromoLink
            key={resource.event}
            href={resource.href}
            promoCode={resource.promoCode}
            universalLink={resource.universalLink}
            className="card"
            data-event={resource.event}
            data-item="tool"
            data-section={section}
            data-tags={resource.tags}
            aria-label={`${resource.title}，點擊複製優惠碼`}
          >
            <div className="card-body">
              <h3>{resource.title}</h3>
            </div>
          </PromoLink>
        ) : (
          <a
            key={resource.event}
            href={resource.href}
            className="card"
            target="_blank"
            rel="noopener noreferrer"
            data-event={resource.event}
            data-item="tool"
            data-section={section}
            data-tags={resource.tags}
            aria-label={`${resource.title}資源`}
          >
            <div className="card-body">
              <h3>{resource.title}</h3>
            </div>
          </a>
        ),
      )}
    </div>
  )
}

export default function ToolsResourcesPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="toolsresources" />
      <main className="container">
        <h1>旅遊優惠與資源</h1>
        <section id="travel-promos" className="section" aria-label="旅遊優惠" style={{ paddingTop: 0 }}>
          <h2>旅遊優惠</h2>
          <p className="sub">點擊優惠卡片會先複製優惠碼，再前往合作網站。</p>
          <ResourceGrid resources={travelPromos} section="travel_promos" />
        </section>
        <section id="travel-services" className="section" aria-label="合作旅遊服務">
          <h2>合作旅遊服務</h2>
          <p className="sub">租車、滑雪預訂與訂房連結整理。</p>
          <ResourceGrid resources={travelServices} section="travel_services" />
        </section>
      </main>
      <Footer />
    </>
  )
}
