import type { ReactNode } from 'react'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'

type Tab = { value: string; label: string; dataArea: string }

type Props = {
  eventPrefix: string
  badge: string
  title: string
  intro: string
  listTitle: string
  tabs: Tab[]
  cards: CityCard[]
  tagFilterArea?: string
  tagOrder?: string[]
  tagHideOnAll?: boolean
  showGuideList?: boolean
  contentTitle: string
  children: ReactNode
  faqTitle: string
  faqs: { q: string; a: string }[]
}

export default function KyotoNaraGuidePage({
  eventPrefix,
  badge,
  title,
  intro,
  listTitle,
  tabs,
  cards,
  tagFilterArea,
  tagOrder,
  tagHideOnAll,
  showGuideList = true,
  contentTitle,
  children,
  faqTitle,
  faqs,
}: Props) {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix={eventPrefix} />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge={badge}
          h1={title}
          intro={intro}
          eventPrefix={eventPrefix}
          showVisual={false}
          ctaLinks={[
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', dataEvent: `${eventPrefix}_map`, platform: 'map' },
            { label: '京都攻略', href: '/kyoto-nara/video', dataEvent: `${eventPrefix}_video`, platform: 'video' },
            { label: '京都住宿', href: '/kyoto-nara/hotel', dataEvent: `${eventPrefix}_hotel`, platform: 'hotel' },
            { label: '京都奈良票券', href: '/kyoto-nara/ticket', dataEvent: `${eventPrefix}_ticket`, platform: 'ticket' },
            { label: '京都奈良通訊&交通', href: '/kyoto-nara/transport', dataEvent: `${eventPrefix}_transport`, platform: 'transport' },
          ]}
        />

        {showGuideList ? (
          <>
            <h2 className="seo-h2" id="guideListTitle">
              {listTitle}
            </h2>
            <CityTabbedList
              tabs={tabs}
              cards={cards}
              tabEvent={`${eventPrefix}_tab`}
              tagFilterArea={tagFilterArea}
              tagOrder={tagOrder}
              tagHideOnAll={tagHideOnAll}
            />
          </>
        ) : null}

        <section className="seo-content" aria-label={contentTitle}>
          <h2 className="seo-h2">{contentTitle}</h2>
          <div className="seo-prose">{children}</div>
        </section>

        <SeoFaqSection title={faqTitle} items={faqs} />
      </main>
      <Footer />
    </>
  )
}
