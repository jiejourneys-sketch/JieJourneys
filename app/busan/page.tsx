'use client'

import Link from 'next/link'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'

export default function BusanPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="busan" />
      <main className="busan-main">
        <h1>韓國｜釜山</h1>
        <p className="sub">完整連結快速選單</p>

        <div className="link-list">
          <Link
            className="link-item"
            href="/busan/journeys"
            data-event="busan_sellpdf"
            data-item="guide"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/gonglue.png" alt="行程PDF" />
            <div className="link-text">自由行攻略PDF</div>
          </Link>

          <Link
            className="link-item"
            href="/busan/video"
            data-event="busan_video"
            data-item="video"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/video.png" alt="影片" />
            <div className="link-text">短影音合輯</div>
          </Link>

          <Link
            className="link-item"
            href="/busan/hotel"
            data-event="busan_hotel"
            data-item="hotel"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/hotel.png" alt="住宿" />
            <div className="link-text">住宿</div>
          </Link>

          <Link
            className="link-item"
            href="/busan/ticket"
            data-event="busan_ticket"
            data-item="ticket"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/piao.png" alt="票券" />
            <div className="link-text">票券</div>
          </Link>

          <Link
            className="link-item"
            href="/busan/transport"
            data-event="busan_transport"
            data-item="transport"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/jiaotong.png" alt="交通" />
            <div className="link-text">通訊 / 交通</div>
          </Link>

          <Link
            className="link-item"
            href="/busan/map"
            data-event="busan_map"
            data-item="map"
            data-section="quick"
          >
            <img className="link-icon" src="/assets/ditu.png" alt="地圖" />
            <div className="link-text">旅杰釜山地圖</div>
          </Link>

          <div className="link-item pass-card" data-section="quick">
            <img className="link-icon" src="/assets/ditu.png" alt="通行證" />
            <div className="pass-row">
              <div className="pass-title">釜山通行證(釜山Pass)</div>
              <div className="pass-actions">
                <a
                  className="pass-btn primary"
                  href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busan_pass_kkday"
                  data-platform="KKDAY"
                >
                  KKDAY
                </a>
                <a
                  className="pass-btn"
                  href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busan_pass_klook"
                  data-platform="KLOOK"
                >
                  KLOOK
                </a>
                <a
                  className="pass-btn"
                  href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busan_pass_trip"
                  data-platform="Trip"
                >
                  Trip
                </a>
                <a
                  className="pass-btn"
                  href="https://www.google.com/maps/d/edit?mid=1XsSQewsHL9iIolJLr7wTnD0bz44jOIs&usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busan_ditu"
                  data-platform="map"
                >
                  地圖
                </a>
                <a
                  className="pass-btn"
                  href="https://www.instagram.com/reel/DUDiZzQkdUe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busan_2026"
                  data-platform="map"
                >
                  介紹
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
