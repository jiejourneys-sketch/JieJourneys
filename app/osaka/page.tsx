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
        <h1>日本｜大阪・京都・奈良</h1>
        <p className="sub">完整連結快速選單</p>
        <div className="link-list">
          <Link className="link-item" href="/osaka/map" data-event="osaka_map" data-item="map" data-section="quick">
            <Image className="link-icon" src="/assets/ditu.png" alt="地圖" width={48} height={48} />
            <div className="link-text">旅杰大阪・京都・奈良地圖</div>
          </Link>
          <div className="link-pair" aria-label="住宿">
            <Link className="link-item link-pair-item" href="/osaka/hotel" data-event="osaka_hotel" data-item="osaka-hotel" data-section="quick">
              <Image className="link-icon" src="/assets/hotel.png" alt="大阪住宿" width={48} height={48} />
              <div className="link-text">大阪住宿</div>
            </Link>
            <Link className="link-item link-pair-item link-pair-item-no-icon" href="/kyoto-nara/hotel" data-event="osaka_kyotonara_hotel" data-item="kyoto-nara-hotel" data-section="quick">
              <div className="link-text">京都住宿</div>
            </Link>
          </div>
          <div className="link-pair" aria-label="旅遊攻略合輯">
            <Link className="link-item link-pair-item" href="/osaka/video" data-event="osaka_video" data-item="osaka-video" data-section="quick">
              <Image className="link-icon" src="/assets/video.png" alt="大阪旅遊攻略合輯" width={48} height={48} />
              <div className="link-text">大阪攻略</div>
            </Link>
            <Link className="link-item link-pair-item link-pair-item-no-icon" href="/kyoto-nara/video" data-event="osaka_kyotonara_video" data-item="kyoto-nara-video" data-section="quick">
              <div className="link-text">京都攻略</div>
            </Link>
          </div>
          <div className="link-pair" aria-label="票券">
            <Link className="link-item link-pair-item" href="/osaka/ticket" data-event="osaka_ticket" data-item="osaka-ticket" data-section="quick">
              <Image className="link-icon" src="/assets/piao.png" alt="大阪票券" width={48} height={48} />
              <div className="link-text">大阪票券</div>
            </Link>
            <Link className="link-item link-pair-item link-pair-item-no-icon" href="/kyoto-nara/ticket" data-event="osaka_kyotonara_ticket" data-item="kyoto-nara-ticket" data-section="quick">
              <div className="link-text">京都奈良票券</div>
            </Link>
          </div>
          <div className="link-pair" aria-label="通訊與交通">
            <Link className="link-item link-pair-item" href="/osaka/transport" data-event="osaka_transport" data-item="osaka-transport" data-section="quick">
              <Image className="link-icon" src="/assets/jiaotong.png" alt="大阪通訊與交通" width={48} height={48} />
              <div className="link-text">大阪通訊 / 交通</div>
            </Link>
            <Link className="link-item link-pair-item link-pair-item-no-icon" href="/kyoto-nara/transport" data-event="osaka_kyotonara_transport" data-item="kyoto-nara-transport" data-section="quick">
              <div className="link-text">京都奈良通訊 / 交通</div>
            </Link>
          </div>
          <div className="link-item pass-card" data-section="quick">
            <Image className="link-icon" src="/assets/ditu.png" alt="大阪周遊券" width={48} height={48} />
            <div className="pass-row">
              <div className="pass-title">大阪周遊券</div>
              <div className="pass-actions">
                <a
                  className="pass-btn primary"
                  href="https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osaka_pass_kkday"
                  data-platform="KKDAY"
                  data-section="quick"
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
                  data-section="quick"
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
                  data-section="quick"
                >
                  Trip
                </a>
                <a className="pass-btn" href="/osaka/pass-map" data-event="osaka_pass_map" data-platform="map" data-section="quick">
                  地圖
                </a>
                <a
                  className="pass-btn"
                  href="https://www.instagram.com/reel/Dap0xBSBbSI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osaka_pass_intro_ig"
                  data-platform="IG"
                  data-section="quick"
                >
                  介紹
                </a>
                <a className="pass-btn" href="/osaka/osaka-amazing-pass" data-event="osaka_pass_article" data-platform="article" data-section="quick">
                  文章
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
