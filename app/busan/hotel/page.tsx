import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanHotelCards, busanHotelTabs } from '@/data/busan/hotels'

export default function BusanHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanhotel" />
      <main className="busan-main transport-main">
        <h1 className="sr-only">釜山住宿精選｜JieJourneys(旅杰)</h1>

        <section className="stay-list" id="videoList">
          <article className="stay-card" data-video="hotel-20s" data-title="住宿選擇，20秒看懂">
            <h3 className="title">住宿選擇，20秒看懂</h3>
            <div className="actions">
              <a
                className="btn primary"
                href="https://www.instagram.com/reel/DNarO86zk_v/"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanhotel_IGvideo"
                data-platform="IG"
                data-section="video"
              >
                IG Reels
              </a>
              <a
                className="btn"
                href="https://www.youtube.com/shorts/BJxtiKK-Lxk"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanhotel_YTvideo"
                data-platform="YouTube"
                data-section="video"
              >
                YouTube
              </a>
              <a
                className="btn"
                href="https://xhslink.com/o/5qAuAKeAyZA"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busanhotel_XHSvideo"
                data-platform="小紅書"
                data-section="video"
              >
                小紅書
              </a>
            </div>
          </article>
        </section>

        <h2>釜山住宿精選</h2>
        <CityTabbedList tabs={busanHotelTabs} cards={busanHotelCards} tabEvent="busan_hotel_tab" />
      </main>
      <Footer />
    </>
  )
}
