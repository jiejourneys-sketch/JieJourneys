'use client'

import Link from 'next/link'
import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'

export default function OsakaPage() {
  return (
    <>
      <CitySubpageHeader backHref="/countries" eventPrefix="osaka" />
      <main className="busan-main">
        <h1>日本｜大阪</h1>
        <p className="sub">完整連結快速選單</p>
        <div className="link-list">
          <Link className="link-item" href="/osaka/journeys" data-event="osaka_sellpdf" data-item="guide" data-section="quick">
            <Image className="link-icon" src="/assets/gonglue.png" alt="行程PDF" width={48} height={48} />
            <div className="link-text">自由行攻略PDF</div>
          </Link>
          <Link className="link-item" href="/osaka/video" data-event="osaka_video" data-item="video" data-section="quick">
            <Image className="link-icon" src="/assets/video.png" alt="影片" width={48} height={48} />
            <div className="link-text">短影音合輯</div>
          </Link>
          <Link className="link-item" href="/osaka/hotel" data-event="osaka_hotel" data-item="hotel" data-section="quick">
            <Image className="link-icon" src="/assets/hotel.png" alt="住宿" width={48} height={48} />
            <div className="link-text">住宿</div>
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
            <Image className="link-icon" src="/assets/ditu.png" alt="東京迪士尼" width={48} height={48} />
            <div className="pass-row">
              <div className="pass-title">東京迪士尼</div>
              <div className="pass-actions">
                <a className="pass-btn primary" href="https://www.kkday.com/zh-tw/product/19252-tokyo-disney-resort-disneyland-disneysea?cid=22312" target="_blank" rel="noopener noreferrer" data-event="Osakadisney_kkday" data-platform="KKDAY">KKDAY</a>
                <a className="pass-btn" href="https://www.klook.com/zh-TW/activity/695-tokyo-disney-resort-1-day-pass-tokyo/?aid=93798" target="_blank" rel="noopener noreferrer" data-event="Osakadisney_klook" data-platform="KLOOK">KLOOK</a>
                <a className="pass-btn" href="https://tw.trip.com/travel-guide/attraction/urayasu/tokyo-disneyland-10758189/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738" target="_blank" rel="noopener noreferrer" data-event="Osakadisney_trip" data-platform="Trip">Trip</a>
                <a className="pass-btn" href="https://www.google.com/maps/d/edit?mid=1ys8gug0O1U9-eI7ja3oKE5AN3CepItM&usp=sharing" target="_blank" rel="noopener noreferrer" data-event="Osakadisney_ditu" data-platform="map">地圖</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
