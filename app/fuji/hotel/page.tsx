import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { fujiHotelCards, fujiHotelTabs } from '@/data/fuji'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

export default function FujiHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujihotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="富士河口湖自由行攻略"
          h1="富士河口湖住宿推薦｜逆富士山、近車站區域完整分析"
          intro="富士河口湖住宿選區影響你整趟旅程的體驗。這頁整理兩大住宿區域的特色與適合對象，幫你快速鎖定最值得住的地點。"
          eventPrefix="fujihotel"
          showVisual={false}
          ctaLinks={[
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

        <SeoContentSection title="富士河口湖住宿區域怎麼選？">
          <h3 className="seo-h3">逆富士山區｜追景必住</h3>
          <p>
            顧名思義，這一區的飯店能看到「逆富士山」——富士山倒映在河口湖上的經典景色。
            大石公園一帶的湖畔旅館、溫泉飯店大多集中在這裡，適合以賞景、拍照為主要目的旅客。
            旺季湖景房非常搶手，建議至少提前 1–2 個月預訂。
          </p>

          <h3 className="seo-h3">近車站區｜交通最方便</h3>
          <p>
            河口湖站周邊步行可達商店、餐廳與巴士站，適合不想一直搭車移動的旅客。不特別在意湖景的人選這區最省事。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖住宿常見問題"
          items={[
            { q: '富士河口湖住逆富士山還是近車站？', a: '以賞景拍照為主選逆富士山區，湖景房能看到富士山倒影；以行程便利為主選近車站區，步行就能搭巴士出發。' },
            { q: '富士河口湖溫泉旅館怎麼選？', a: '逆富士山一帶有多間溫泉旅館，部分可在泡湯時直接看到富士山，旺季需提早訂。' },
            { q: '富士河口湖住宿要提前多久訂？', a: '旺季（春天賞櫻 3–4 月、夏天五合目 7–8 月、秋天楓葉 10–11 月）住宿非常搶手，湖景房建議提前 1–2 個月預訂。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
