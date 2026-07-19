import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanHotelCards, busanHotelTabs } from '@/data/busan/hotels'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

export default function BusanHotelPage() {
  const hotelCards = busanHotelCards.map((c) => ({
    ...c,
    note: undefined,
    actions: c.actions
      .filter((a) => a.label === 'Trip' || a.label === 'Agoda' || a.label === '地圖' || a.label === 'Navermap')
      .slice()
      .sort((a, b) => {
        const order: Record<string, number> = { Trip: 0, Agoda: 1, 地圖: 2, Navermap: 3 }
        return (order[a.label] ?? 99) - (order[b.label] ?? 99)
      })
      .map((a) => {
        if (a.label === 'Trip') return { ...a, className: 'btn primary' }
        if (a.label === 'Agoda') return { ...a, className: 'btn' }
        return a
      }),
  }))

  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanhotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="釜山自由行攻略"
          h1="釜山住宿推薦｜釜山住哪個區域？海雲台、廣安里、西面、南浦洞完整分析"
          intro="釜山住宿推薦主要集中在海雲台、廣安里、西面與南浦洞，不同區域適合不同旅遊方式。本篇整理釜山住宿推薦區域、釜山住哪裡與釜山飯店推薦重點，幫你快速選出最適合的住宿地點。"
          videoTitle="20秒看懂住宿差異（短影片）"
          eventPrefix="busanhotel"
          showVisual={false}
          ctaLinks={[
            {
              label: '釜山短影片攻略',
              href: 'https://www.jiejourneys.com/busan/video',
              dataEvent: 'busanhotel_allvideos',
              platform: 'video',
            },
            {
              label: '釜山票券總整理',
              href: 'https://www.jiejourneys.com/busan/ticket',
              dataEvent: 'busanhotel_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/busan/transport',
              dataEvent: 'busanhotel_alltransport',
              platform: 'transport',
            },
          ]}
          videoLinks={[
            {
              label: 'IG Reels',
              href: 'https://www.instagram.com/reel/DNarO86zk_v/',
              dataEvent: 'busanhotel_IGvideo',
              platform: 'IG',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/shorts/BJxtiKK-Lxk',
              dataEvent: 'busanhotel_YTvideo',
              platform: 'YouTube',
            },
          ]}
        />

<h2 className="seo-h2" id="stayListTitle">
          釜山住宿推薦飯店（海雲台／廣安里／西面／南浦洞）
        </h2>
        <CityTabbedList tabs={busanHotelTabs} cards={hotelCards} tabEvent="busan_hotel_tab" />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山住宿地圖" newTab dataEvent="busanhotel_SEO_spotmap" />
        <SeoCtaSection text="" href="/busan/pass-map" linkText="釜山通行證地圖" newTab dataEvent="busanhotel_SEO_passmap" />

        <SeoContentSection title="釜山住宿怎麼選？先看你的行程重心">
          <p>
            釜山住宿不要只看飯店漂亮不漂亮，先看你每天要跑哪一區。釜山景點是沿著海岸和地鐵線分散的城市，住錯區域會把時間花在移動上；住對區域，行程會舒服很多。
          </p>

          <h3 className="seo-h3">四大住宿區域快速比較</h3>
          <table>
            <thead>
              <tr>
                <th>區域</th>
                <th>最適合</th>
                <th>優點</th>
                <th>注意</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>海雲台</td>
                <td>想看海、放鬆、搭膠囊列車</td>
                <td>海灘、藍線公園、海雲台商圈集中，度假感最強。</td>
                <td>離南浦洞、甘川洞較遠，行程跑西邊會拉車程。</td>
              </tr>
              <tr>
                <td>廣安里</td>
                <td>想看夜景、遊艇、週六無人機</td>
                <td>廣安大橋夜景很有記憶點，晚上吃飯喝咖啡選擇多。</td>
                <td>多數飯店到地鐵站需要走一段，拖大行李要留意距離。</td>
              </tr>
              <tr>
                <td>西面</td>
                <td>第一次自由行、每天都要換區</td>
                <td>地鐵 1 號線和 2 號線交會，去南浦洞、海雲台、機場方向都平均。</td>
                <td>不是海邊，飯店景觀通常不會是主打。</td>
              </tr>
              <tr>
                <td>南浦洞</td>
                <td>想吃市場、美食、舊市區景點</td>
                <td>札嘎其市場、BIFF、國際市場、釜山塔、甘川洞和松島都好接。</td>
                <td>到海雲台和東釜山較遠，想天天看海不適合。</td>
              </tr>
            </tbody>
          </table>

          <h3 className="seo-h3">我的住宿選法</h3>
          <ol>
            <li>第一次去釜山、行程還沒很確定：先選西面，交通最保守。</li>
            <li>想要一早醒來就是海：選海雲台，膠囊列車、海岸列車、海雲台海灘都順。</li>
            <li>重視夜景和氣氛：選廣安里，週六晚上可以把無人機和遊艇排在一起。</li>
            <li>想吃市場、逛街、跑甘川洞：選南浦洞，舊市區行程最省時間。</li>
          </ol>

          <h3 className="seo-h3">不同天數怎麼住？</h3>
          <p>
            3 天 2 夜不建議換飯店，西面或你最想玩的區域選一個就好。4 天 3 夜可以住西面或海雲台一路到底；如果是 5 天 4 夜以上，可以前半住南浦洞或西面跑舊市區，後半住海雲台或廣安里，把海景和夜景集中玩。
          </p>

          <h3 className="seo-h3">海雲台和廣安里怎麼選？</h3>
          <p>
            海雲台比較像度假區，白天行程更強，適合搭
            <a
              href="https://www.instagram.com/reel/DMu5uZxTdO8/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanhotel_capsule_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong>膠囊列車</strong>
            </a>
            、逛海雲台海灘、跑東釜山。廣安里比較像夜生活和海景餐廳區，適合排
            <a
              href="https://www.instagram.com/reel/DVTW_MLkpj4/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanhotel_yacht_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong>遊艇</strong>
            </a>
            和廣安大橋夜景。想看更完整區域位置，可以搭配
            <a
              href="/busan/map"
              data-event="busanhotel_map_inline"
              data-platform="internal"
              data-section="article"
            >
              <strong>釜山住宿地圖</strong>
            </a>
            一起看。
          </p>

          <h3 className="seo-h3">西面和南浦洞怎麼選？</h3>
          <p>
            西面是效率解，適合每天往不同方向跑；南浦洞是生活感和美食解，適合把札嘎其市場、BIFF、國際市場、甘川洞、釜山塔放在行程主軸。你如果第一次去又很怕交通麻煩，我會先選西面；如果你本來就想吃市場、逛舊市區，南浦洞會更有旅行感。
          </p>
        </SeoContentSection>  

        <SeoFaqSection
          title="釜山住宿常見問題"
          items={[
              {
                q: '第一次去釜山住哪裡？',
                a: '最保守選西面，因為地鐵 1 號線和 2 號線交會，去南浦洞、海雲台、機場方向都相對平均。想度假看海再選海雲台或廣安里。',
              },
              {
                q: '釜山住海雲台還是西面比較好？',
                a: '海雲台適合把海景、膠囊列車、東釜山排成主軸；西面適合每天換區、想減少交通失誤的人。第一次自由行如果還沒決定行程，西面比較穩。',
              },
              {
                q: '釜山住廣安里方便嗎？',
                a: '廣安里晚上很漂亮，適合夜景、餐廳、咖啡廳和遊艇，但很多飯店離地鐵站要走一段。行李多或長輩同行時，要特別看飯店到地鐵出口的距離。',
              },
              {
                q: '釜山可以分兩區住宿嗎？',
                a: '5 天 4 夜以上可以分。前半住南浦洞或西面跑舊市區，後半住海雲台或廣安里玩海線；3 天 2 夜不太建議換飯店，移動成本太高。',
              },
              {
                q: '南浦洞適合第一次去釜山嗎？',
                a: '適合喜歡市場、美食、舊市區的人。札嘎其市場、國際市場、BIFF、釜山塔、甘川洞都好接；但如果你最期待海雲台和膠囊列車，南浦洞就會偏遠。',
              },
            ]}
        />
      </main>
      <Footer />
    </>
    
  )
}
