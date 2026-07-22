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
          h1="富士河口湖住宿推薦｜富士山景、湖景溫泉、交通方便/高CP住宿完整分析"
          intro="富士河口湖住宿選區影響你整趟旅程的體驗。這頁整理富士山景、湖景溫泉與交通方便/高CP住宿特色，幫你快速鎖定最值得住的地點。"
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

        <SeoCtaSection text="" href="/fuji/map" linkText="富士河口湖住宿點地圖" newTab dataEvent="fujihotel_SEO_spotmap" />

        <SeoContentSection title="富士河口湖住宿區域怎麼選？">
          <h3 className="seo-h3">先用行程分 3 區：交通、湖景、逆富士</h3>
          <p>
            這不是官方行政區劃，而是最適合自由行選房的分法：第一次來、搭大眾交通的人優先住河口湖站或富士山站周邊；想把住宿當度假的人選湖南岸湖畔旅館；最在意富士山倒影的人，再往北岸大石、河口一帶找。
          </p>

          <div className="narita-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>住宿區</th>
                  <th>適合誰</th>
                  <th>優點</th>
                  <th>注意事項</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>第一區：河口湖站／富士山站交通方便區</td>
                  <td>第一次來、搭高速巴士或富士急行、行李多的人。</td>
                  <td>車站、巴士、餐廳、超商與租車資源較好找，進出河口湖最省力。</td>
                  <td>兩站不是同一個步行住宿圈；下訂前確認飯店實際離哪一站近、是否有接駁。</td>
                </tr>
                <tr>
                  <td>第二區：湖南岸湖景溫泉區</td>
                  <td>想泡湯、看湖、住一泊二食旅館的人。</td>
                  <td>淺川、船津、小立一帶湖畔飯店與溫泉旅館選擇較集中，度假感最完整。</td>
                  <td>湖景不一定等於富士山景；晚到時也要先確認車站接駁與飯店晚餐時間。</td>
                </tr>
                <tr>
                  <td>第三區：北岸大石／河口逆富士區</td>
                  <td>想拍富士山、逆富士，或自駕慢遊的人。</td>
                  <td>河口湖與富士山同框的視野更經典，早晨有機會拍到湖面倒影。</td>
                  <td>交通、餐廳與便利商店較分散；逆富士仍取決於雲量、風與湖面，不能保證。</td>
                </tr>
              </tbody>
            </table>
          </div>

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

          <h3 className="seo-h3">交通方便/高CP｜車站與接駁移動最省事</h3>
          <p>
            交通方便/高CP類不一定都在車站正旁，但多半靠近河口湖站、步行可到，或接駁與巴士動線方便。適合不想一直拉行李轉乘的旅客。
          </p>

          <h3 className="seo-h3">訂房前再檢查 4 件事</h3>
          <ul>
            <li><strong>房型方向：</strong>確認是湖景、富士山景、湖＋富士山景，或只有公共區域看得到富士山。</li>
            <li><strong>車站接駁：</strong>確認要不要預約、時段到幾點，以及接的是河口湖站還是富士山站。</li>
            <li><strong>餐食與周邊：</strong>偏遠旅館若沒有一泊二食，先確認晚餐和早餐的選項。</li>
            <li><strong>天氣備案：</strong>逆富士是加分畫面，不要把整趟行程只押在一次清晨拍攝。</li>
          </ul>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖住宿常見問題"
          items={[
            { q: '富士河口湖住宿要選哪一區？', a: '第一次自由行、搭大眾交通優先河口湖站或富士山站周邊；想泡湯看湖選湖南岸湖畔旅館；想拍逆富士可看北岸大石、河口一帶，但須接受交通較分散與天氣不保證。' },
            { q: '富士河口湖溫泉旅館怎麼選？', a: '湖景溫泉類有多間溫泉旅館，部分可在泡湯時直接看到富士山，旺季需提早訂。' },
            { q: '富士河口湖住宿要提前多久訂？', a: '旺季（春天賞櫻 3–4 月、夏天五合目 7–8 月、秋天楓葉 10–11 月）住宿非常搶手，湖景房建議提前 1–2 個月預訂。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
