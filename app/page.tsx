'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PopularGrid from '@/components/PopularGrid'
import Footer from '@/components/Footer'

const GROUP_BUY_URL = 'https://www.lapo.com.tw/zh-TW/products/lt17lt28-jiejourneys'
const GROUP_BUY_VIDEO_URL = 'https://www.instagram.com/reel/DfUg41ntz6n/'
const GROUP_BUY_IMAGE_SRC = '/assets/group-buy/lapo-loop-vacuum-bag-20261105.png'
const GROUP_BUY_START_AT = new Date('2026-11-05T00:00:00+08:00').getTime()
const GROUP_BUY_END_AT = new Date('2026-11-13T00:00:00+08:00').getTime()
const GROUP_BUY_ENABLED = true
const GROUP_BUY_VIDEO_ENABLED = true

type GroupBuyCountdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  started: boolean
  ended: boolean
}

function getGroupBuyCountdown(): GroupBuyCountdown {
  const now = Date.now()
  const started = now >= GROUP_BUY_START_AT
  const remaining = Math.max(0, (started ? GROUP_BUY_END_AT : GROUP_BUY_START_AT) - now)
  const totalSeconds = Math.ceil(remaining / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    started,
    ended: now >= GROUP_BUY_END_AT,
  }
}

export default function HomePage() {
  const [groupBuyCountdown, setGroupBuyCountdown] = useState<GroupBuyCountdown | null>(null)
  const [isGroupBuyImageOpen, setGroupBuyImageOpen] = useState(false)

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

  useEffect(() => {
    if (!isGroupBuyImageOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setGroupBuyImageOpen(false)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isGroupBuyImageOpen])

  useEffect(() => {
    if (!GROUP_BUY_ENABLED) return

    const updateCountdown = () => setGroupBuyCountdown(getGroupBuyCountdown())
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const groupBuyEnded = groupBuyCountdown?.ended ?? false

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
        {GROUP_BUY_ENABLED ? (
          <>
        <section className="group-buy-banner" aria-labelledby="group-buy-title">
          <button
            type="button"
            className="group-buy-media"
            onClick={() => setGroupBuyImageOpen(true)}
            data-event="home_groupbuy_lapo_20261105_image_open"
            data-section="group_buy"
            aria-label="放大查看電動真空行李收納袋團購圖片"
          >
            <Image src={GROUP_BUY_IMAGE_SRC} alt="Loop 電動真空行李收納袋，17L 與 28L 團購優惠" fill sizes="(max-width: 680px) 120px, 240px" />
            <span className="group-buy-image-expand" aria-hidden="true">↗ 放大圖片</span>
          </button>
          <div className="group-buy-copy">
            <div className="group-buy-heading">
              <p className="group-buy-kicker">旅杰團購｜11/5–11/12</p>
              <h2 id="group-buy-title">電動真空收納袋<span className="group-buy-title-divider">：</span><span className="group-buy-subtitle">行李更好收</span></h2>
            </div>
            <div className="group-buy-price" aria-label="團購價格">
              <p><span>17L</span><strong>NT$790</strong><s>NT$990</s></p>
              <p><span>28L</span><strong>NT$890</strong><s>NT$1,190</s></p>
            </div>
            <div className="group-buy-actions">
              <div className="group-buy-countdown" aria-live="polite" aria-label="團購倒數時間">
                {groupBuyEnded ? (
                  <strong>活動已結束</strong>
                ) : groupBuyCountdown ? (
                  <>
                    <span>{groupBuyCountdown.started ? '結團倒數' : '距離開團'}</span>
                    <strong>
                      {String(groupBuyCountdown.days).padStart(2, '0')} 天 {String(groupBuyCountdown.hours).padStart(2, '0')}:{String(groupBuyCountdown.minutes).padStart(2, '0')}:{String(groupBuyCountdown.seconds).padStart(2, '0')}
                    </strong>
                  </>
                ) : (
                  <span>倒數載入中</span>
                )}
              </div>
              {GROUP_BUY_VIDEO_ENABLED ? (
                <a
                  className="group-buy-video-button"
                  href={GROUP_BUY_VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="home_groupbuy_lapo_20261105_video_open"
                  data-platform="instagram"
                  data-section="group_buy"
                >
                  <span aria-hidden="true">▶</span> 觀看影片
                </a>
              ) : null}
              {!groupBuyEnded ? (
                <a
                  className="group-buy-cta"
                  href={GROUP_BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="home_groupbuy_lapo_20261105_cta"
                  data-platform="LAPO"
                  data-section="group_buy"
                >
                  查看優惠 <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>
        {isGroupBuyImageOpen ? (
          <div className="group-buy-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGroupBuyImageOpen(false) }}>
            <div className="group-buy-image-modal-dialog" role="dialog" aria-modal="true" aria-label="電動真空行李收納袋團購圖片">
              <button
                type="button"
                className="group-buy-modal-close"
                onClick={() => setGroupBuyImageOpen(false)}
                data-event="home_groupbuy_lapo_20261105_image_close"
                data-section="group_buy"
                aria-label="關閉圖片"
              >
                ×
              </button>
              <Image src={GROUP_BUY_IMAGE_SRC} alt="Loop 電動真空行李收納袋團購資訊" width={941} height={1672} sizes="(max-width: 680px) calc(100vw - 32px), 780px" />
            </div>
          </div>
        ) : null}
          </>
        ) : null}
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
