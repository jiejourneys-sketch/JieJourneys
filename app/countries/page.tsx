'use client'

import Link from 'next/link'
import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import SearchBox from '@/components/SearchBox'
import Footer from '@/components/Footer'

export default function CountriesPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="countries" />
      <main className="container">
        <h1>其他國家／地區</h1>
        <p className="sub">搜尋或點選下方卡片進入攻略</p>
        <section id="countries-popular" className="section" aria-label="國家與地區列表" style={{ paddingTop: 0 }}>
          <SearchBox
            rootId="countries-popular"
            inputId="countriesSearchInput"
            eventName="countries_search"
          />
          <div className="popular-grid">
            <Link
              href="/northvietnam"
              className="card"
              data-event="countries_card_northvietnam"
              data-item="northvietnam"
              data-section="countries"
              data-tags="越南 北越 河內 hanoi vietnam 下龍"
              aria-label="前往北越攻略頁面"
            >
              <Image className="thumb" src="/assets/hanoi.png" alt="北越 Hanoi" width={320} height={180} />
              <div className="card-body">
                <h3>越南｜北越</h3>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
