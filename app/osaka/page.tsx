'use client'

import Link from 'next/link'
import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'

export default function OsakaPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="osaka" />
      <main className="busan-main">
        <h1>日本｜大阪</h1>
        <p className="sub">完整連結快速選單</p>
        <div className="link-list">
          <Link className="link-item" href="/osaka/map" data-event="osaka_map" data-item="map" data-section="quick">
            <Image className="link-icon" src="/assets/ditu.png" alt="地圖" width={48} height={48} />
            <div className="link-text">旅杰大阪地圖</div>
          </Link>
          <Link className="link-item" href="/osaka/hotel" data-event="osaka_hotel" data-item="hotel" data-section="quick">
            <Image className="link-icon" src="/assets/hotel.png" alt="住宿" width={48} height={48} />
            <div className="link-text">住宿</div>
          </Link>
          <Link className="link-item" href="/osaka/video" data-event="osaka_video" data-item="video" data-section="quick">
            <Image className="link-icon" src="/assets/video.png" alt="影片" width={48} height={48} />
            <div className="link-text">短影音合輯</div>
          </Link>
          <Link className="link-item" href="/osaka/ticket" data-event="osaka_ticket" data-item="ticket" data-section="quick">
            <Image className="link-icon" src="/assets/piao.png" alt="票券" width={48} height={48} />
            <div className="link-text">票券</div>
          </Link>
          <Link className="link-item" href="/osaka/transport" data-event="osaka_transport" data-item="transport" data-section="quick">
            <Image className="link-icon" src="/assets/jiaotong.png" alt="交通" width={48} height={48} />
            <div className="link-text">通訊 / 交通</div>
          </Link>
          <div className="link-item pass-card" data-section="quick">
            <Image className="link-icon" src="/assets/ditu.png" alt="大阪周遊券" width={48} height={48} />
            <div className="pass-row">
              <div className="pass-title">大阪周遊券地圖</div>
              <div className="pass-actions">
                <a
                  className="pass-btn primary"
                  href="https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osaka_pass_kkday"
                  data-platform="KKDAY"
                >
                  KKDAY
                </a>
                <a
                  className="pass-btn"
                  href="https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osaka_pass_klook"
                  data-platform="KLOOK"
                >
                  KLOOK
                </a>
                <a
                  className="pass-btn"
                  href="https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osaka_pass_trip"
                  data-platform="Trip"
                >
                  Trip
                </a>
                <a className="pass-btn" href="/osaka/pass-map" data-event="osaka_pass_map" data-platform="map">
                  地圖
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
