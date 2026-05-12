'use client'

import Link from 'next/link'
import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'

export default function NorthVietnamPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="northvietnam" />
      <main className="busan-main">
        <h1>越南｜北越</h1>
        <p className="sub">完整連結快速選單</p>
        <div className="link-list">
          <Link className="link-item" href="/northvietnam/map" data-event="northvietnam_map" data-item="map" data-section="quick">
            <Image className="link-icon" src="/assets/ditu.png" alt="地圖" width={48} height={48} />
            <div className="link-text">旅杰北越地圖</div>
          </Link>

          <Link className="link-item" href="/northvietnam/journeys" data-event="northvietnam_pdf" data-item="pdf" data-section="quick">
            <Image className="link-icon" src="/assets/gonglue.png" alt="攻略 PDF" width={48} height={48} />
            <div className="link-text">自由行攻略PDF</div>
          </Link>

          <Link className="link-item" href="/northvietnam/video" data-event="northvietnam_video" data-item="video" data-section="quick">
            <Image className="link-icon" src="/assets/video.png" alt="影片" width={48} height={48} />
            <div className="link-text">短影音合輯</div>
          </Link>

          <Link className="link-item" href="/northvietnam/hotel" data-event="northvietnam_hotel" data-item="hotel" data-section="quick">
            <Image className="link-icon" src="/assets/hotel.png" alt="住宿" width={48} height={48} />
            <div className="link-text">住宿</div>
          </Link>

          <Link className="link-item" href="/northvietnam/ticket" data-event="northvietnam_ticket" data-item="ticket" data-section="quick">
            <Image className="link-icon" src="/assets/piao.png" alt="票券" width={48} height={48} />
            <div className="link-text">票券</div>
          </Link>

          <Link className="link-item" href="/northvietnam/transport" data-event="northvietnam_transport" data-item="transport" data-section="quick">
            <Image className="link-icon" src="/assets/jiaotong.png" alt="交通" width={48} height={48} />
            <div className="link-text">通訊 / 交通</div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
