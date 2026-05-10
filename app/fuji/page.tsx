'use client'

import Link from 'next/link'
import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'

export default function FujiPage() {
  return (
    <>
      <CitySubpageHeader backHref="/" eventPrefix="fuji" />
      <main className="busan-main">
        <h1>日本｜富士河口湖</h1>
        <p className="sub">完整連結快速選單</p>

        <div className="link-list">
          <Link
            className="link-item"
            href="/fuji/map"
            data-event="fuji_map"
            data-item="map"
            data-section="quick"
          >
            <Image className="link-icon" src="/assets/ditu.png" alt="地圖" width={48} height={48} />
            <div className="link-text">旅杰富士河口湖地圖</div>
          </Link>

          <Link
            className="link-item"
            href="/fuji/video"
            data-event="fuji_video"
            data-item="video"
            data-section="quick"
          >
            <Image className="link-icon" src="/assets/video.png" alt="短影片" width={48} height={48} />
            <div className="link-text">短影音合輯</div>
          </Link>

          <Link
            className="link-item"
            href="/fuji/hotel"
            data-event="fuji_hotel"
            data-item="hotel"
            data-section="quick"
          >
            <Image className="link-icon" src="/assets/hotel.png" alt="住宿" width={48} height={48} />
            <div className="link-text">住宿</div>
          </Link>

          <Link
            className="link-item"
            href="/fuji/ticket"
            data-event="fuji_ticket"
            data-item="ticket"
            data-section="quick"
          >
            <Image className="link-icon" src="/assets/piao.png" alt="票券" width={48} height={48} />
            <div className="link-text">票券</div>
          </Link>

          <Link
            className="link-item"
            href="/fuji/transport"
            data-event="fuji_transport"
            data-item="transport"
            data-section="quick"
          >
            <Image className="link-icon" src="/assets/jiaotong.png" alt="交通" width={48} height={48} />
            <div className="link-text">通訊 / 交通</div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
