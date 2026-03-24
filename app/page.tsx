'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import TopBanner from '@/components/TopBanner'
import SearchBox from '@/components/SearchBox'
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
      <TopBanner />

      <header>
        <nav className="nav">
          <Link href="/" className="brand" aria-label="回首頁" data-event="home_logo" data-item="brand">
            <img src="/assets/logo.jpg" alt="JieJourneys(旅杰) Logo" />
            <span>JieJourneys｜旅杰</span>
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
        <h1 className="sr-only">JieJourneys(旅杰)— 自由行旅遊攻略</h1>
        <section id="popular" className="section" aria-label="熱門攻略">
          <h2>熱門攻略</h2>
          <p className="sub">點擊國家卡片，會有連結總整理</p>
          <SearchBox />
          <PopularGrid />
        </section>

        <section id="tools" className="section" aria-label="旅遊資源">
          <h2>旅遊資源</h2>
          <p className="sub">自由行需要的工具、優惠與服務整理</p>
          <div className="tools-row">
            <a
              href="/tools/bill"
              className="tool-bill-link"
              target="_blank"
              rel="noopener noreferrer"
              data-event="sitetobill"
              data-item="tool"
            >
              旅杰分帳
            </a>
            <a
              href="https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339"
              target="_blank"
              rel="noopener noreferrer"
              data-event="wamazingbuy"
              data-item="tool"
            >
              日本購物(合作)
            </a>
            <a
              href="https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=2i98k457"
              target="_blank"
              rel="noopener noreferrer"
              data-event="wamazingsnow"
              data-item="tool"
            >
              滑雪預訂(合作)
            </a>
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
            <a
              href="https://xhslink.com/m/6OAjLumXIO1"
              target="_blank"
              rel="noopener noreferrer"
              data-event="home_social_xiaohongshu"
              data-platform="xiaohongshu"
            >
              小紅書
            </a>
          </div>
        </section>

        <section id="about" className="section" aria-label="關於我們">
          <h2>關於 JieJourneys(旅杰)</h2>
          <p className="sub">自助旅遊｜一看就懂的攻略</p>
          <div className="about">
            我們專做「打開就能用」的旅行攻略，把複雜資訊整理成清楚的路線與連結，讓你最快掌握重點。
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
