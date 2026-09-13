'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import PopularGrid from '@/components/PopularGrid'
import Footer from '@/components/Footer'

export default function HomePage() {
  useEffect(() => {
    const header = document.querySelector('header')
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href')
        const id = hash && hash.startsWith('#') ? hash.slice(1) : null
        const el = id ? document.getElementById(id) : null
        if (!el) return
        e.preventDefault()
        const offset = (header?.getBoundingClientRect().height || 0) + 12
        const y = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
      })
    })
  }, [])

  return (
    <>
      <header>
        <nav className="nav">
          <Link href="/" className="brand" aria-label="回首頁" data-event="home_logo" data-item="brand">
            <Image src="/assets/logo.jpg" alt="旅杰 JieJourneys Logo" width={36} height={36} />
            <span>旅杰 JieJourneys</span>
          </Link>
          <div className="menu">
            <Link href="#popular" data-event="home_gonglue" data-item="popular">
              熱門攻略
            </Link>
            <Link href="#tools" data-event="home_tools" data-item="tools">
              旅遊資源
            </Link>
            <Link href="#follow" data-event="home_follow" data-item="follow">
              追蹤我們
            </Link>
            <Link href="#about" data-event="home_about" data-item="about">
              關於
            </Link>
            <Link href="/contact/" data-event="home_contact" data-item="contact">
              聯絡我們
            </Link>
          </div>
        </nav>
      </header>

      <main className="container">
        <h1 className="sr-only">旅杰 JieJourneys－自由行旅遊攻略</h1>
        <section id="popular" className="section" aria-label="熱門攻略">
          <h2>熱門攻略</h2>
          <p className="sub">先選國家，再選要去的城市</p>
          <PopularGrid />
        </section>

        <section id="tools" className="section" aria-label="旅遊資源">
          <h2>旅遊資源</h2>
          <p className="sub">行前會用到的工具與優惠</p>
          <div className="home-resource-grid">
            <section className="home-resource-card" aria-labelledby="home-tools-title">
              <h3 id="home-tools-title">旅遊工具</h3>
              <div className="home-resource-links">
                <a
                  href="/tools/planner"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="home_tools_planner"
                  data-item="tool"
                >
                  {'\u65c5\u6770\u898f\u5283'}
                </a>
                <a
                  href="/tools/bill"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="sitetobill"
                  data-item="tool"
                >
                  {'\u65c5\u6770\u5206\u5e33'}
                </a>
              </div>
            </section>
            <Link href="/tools/resources" className="home-resource-card home-resource-card-link" data-event="home_tools_travel_promos" data-item="tool">
              <h3>旅遊優惠</h3>
              <span>查看優惠碼</span>
            </Link>
          </div>
        </section>

        <section id="follow" className="section" aria-label="追蹤我們">
          <h2>追蹤我們</h2>
          <p className="sub">第一時間收到新攻略</p>
          <div className="social-row">
            <a
              href="https://www.instagram.com/jiejourneys"
              target="_blank"
              rel="noopener noreferrer"
              data-event="home_social_IG"
              data-platform="instagram"
            >
              Instagram
            </a>
            <a
              href="https://www.threads.net/@jiejourneys"
              target="_blank"
              rel="noopener noreferrer"
              data-event="home_social_Threads"
              data-platform="threads"
            >
              Threads
            </a>
            <a
              href="https://www.youtube.com/@jiejourneys"
              target="_blank"
              rel="noopener noreferrer"
              data-event="home_social_Youtube"
              data-platform="youtube"
            >
              YouTube
            </a>
          </div>
        </section>

        <section id="about" className="section" aria-label="關於我們">
          <h2>關於旅杰 JieJourneys</h2>
          <p className="sub">自助旅遊｜一看就懂的攻略</p>
          <div className="about">
            我們整理城市地圖、景點票券、住宿區域與交通資訊，幫你快速抓到旅行重點，不用從零開始爬文。
          </div>
        </section>

        <div className="business-card">
          <div className="business-title">品牌合作 / Business Inquiry</div>
          <a
            href="mailto:jiejourneys@gmail.com?subject=旅杰合作邀約"
            data-event="home_business_contact"
            className="business-email"
          >
            jiejourneys@gmail.com
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
