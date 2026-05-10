import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { fujiHotelCards, fujiHotelTabs } from '@/data/fuji'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

export default function FujiHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujihotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="富士河口湖自由行攻略"
          h1="富士河口湖住宿推薦｜富士山景、湖景溫泉、交通方便住宿完整分析"
          intro="富士河口湖住宿選區影響你整趟旅程的體驗。這頁整理富士山景、湖景溫泉與交通方便住宿特色，幫你快速鎖定最值得住的地點。"
          eventPrefix="fujihotel"
          showVisual={false}
          ctaLinks={[
            {
              label: '富士河口湖短影片攻略',
              href: 'https://www.jiejourneys.com/fuji/video',
              dataEvent: 'fujihotel_allvideos',
              platform: 'video',
            },
            {
              label: '富士河口湖票券總整理',
              href: 'https://www.jiejourneys.com/fuji/ticket',
              dataEvent: 'fujihotel_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/fuji/transport',
              dataEvent: 'fujihotel_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="stayListTitle">
          富士河口湖住宿推薦飯店
        </h2>
        <CityTabbedList tabs={fujiHotelTabs} cards={fujiHotelCards} tabEvent="fuji_hotel_tab" />

        <SeoCtaSection text="" href="/fuji/map" linkText="富士河口湖熱門景點地圖" newTab dataEvent="fujihotel_SEO_spotmap" />

        <SeoContentSection title="富士河口湖住宿區域怎麼選？">
          <h3 className="seo-h3">富士山景｜想直接看富士山</h3>
          <p>
            富士山景類住宿主打房間、露台或公共空間能看到富士山，適合以賞景、拍照和待在飯店放鬆為主要目的旅客。
            這類房型旺季非常搶手，建議至少提前 1–2 個月預訂。
          </p>

          <h3 className="seo-h3">湖景溫泉｜想看湖景、泡溫泉</h3>
          <p>
            湖景溫泉類以湖畔視野、溫泉浴池、一泊二食或日式旅館體驗為主，很多飯店也能同時看到富士山。
            如果你想把住宿本身當成河口湖行程重點，這類最適合。
          </p>

          <h3 className="seo-h3">交通方便｜車站與接駁移動最省事</h3>
          <p>
            交通方便類不一定都在車站正旁，但多半靠近河口湖站、步行可到，或接駁與巴士動線方便。適合不想一直拉行李轉乘的旅客。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖住宿常見問題"
          items={[
            { q: '富士河口湖住宿要選哪一區？', a: '想直接看富士山選富士山景，想看湖景泡溫泉選湖景溫泉，想節省移動時間選交通方便。' },
            { q: '富士河口湖溫泉旅館怎麼選？', a: '湖景溫泉類有多間溫泉旅館，部分可在泡湯時直接看到富士山，旺季需提早訂。' },
            { q: '富士河口湖住宿要提前多久訂？', a: '旺季（春天賞櫻 3–4 月、夏天五合目 7–8 月、秋天楓葉 10–11 月）住宿非常搶手，湖景房建議提前 1–2 個月預訂。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
