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
            {
              label: '小紅書',
              href: 'https://xhslink.com/o/5qAuAKeAyZA',
              dataEvent: 'busanhotel_XHSvideo',
              platform: '小紅書',
            },
          ]}
        />

<h2 className="seo-h2" id="stayListTitle">
          釜山住宿推薦飯店（海雲台／廣安里／西面／南浦洞）
        </h2>
        <CityTabbedList tabs={busanHotelTabs} cards={hotelCards} tabEvent="busan_hotel_tab" />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busanhotel_SEO_spotmap" />
        <SeoCtaSection text="" href="/busan/pass-map" linkText="釜山通行證地圖" newTab dataEvent="busanhotel_SEO_passmap" />

        <SeoContentSection title="釜山住宿區域怎麼選？">
          <h3 className="seo-h3">海雲台（看海＋放鬆）</h3>
          <p>海雲台是最熱門的釜山住宿推薦區域，適合第一次來釜山、想住海景飯店的人，周邊有海雲台海水浴場與膠囊列車，整體氛圍偏度假放鬆。</p>

          <h3 className="seo-h3">廣安里（海景＋夜景）</h3>
          <p>
            廣安里是熱門的釜山海景住宿區域，適合情侶或喜歡拍照的人，晚上氣氛很好，還有
            <a
              href="https://www.gwangallimdrone.co.kr/en/information"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanhotel_drone"
            >
              無人機表演
            </a>
            ，是釜山住宿推薦中夜景最強的區域之一。
          </p>
          <h3 className="seo-h3">西面（交通最方便）</h3>
          <p>西面是交通最方便的釜山住宿區域，地鐵交會站，去各大景點都順，適合第一次自由行或行程安排較多的人，是最實用的釜山住宿推薦選擇。</p>

          <h3 className="seo-h3">南浦洞（美食＋逛街）</h3>
          <p>南浦洞是釜山美食與逛街集中區域，靠近 BIFF、札嘎其市場，適合喜歡吃東西與購物的人，是釜山住宿推薦中生活機能最方便的區域之一。</p>

          <h3 className="seo-h3">第一次去釜山住哪裡？</h3>
          <ul>
            <li>想住海邊看海景：海雲台或廣安里</li>
            <li>想交通方便：西面</li>
            <li>想吃東西＋逛街：南浦洞</li>
          </ul>

          <h3 className="seo-h3">快速比較表（可選）</h3>
          <table>
            <thead>
              <tr>
                <th>區域</th>
                <th>適合誰</th>
                <th>優點</th>
                <th>注意</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>海雲台</td>
                <td>第一次來、想度假看海</td>
                <td>海景強、氛圍放鬆、靠近膠囊列車</td>
                <td>到南浦洞較遠</td>
              </tr>
              <tr>
                <td>廣安里</td>
                <td>喜歡夜景、拍照、生活感</td>
                <td>海景夜景漂亮、氛圍感強</td>
                <td>距離地鐵站走路10分鐘</td>
              </tr>
              <tr>
                <td>西面</td>
                <td>行程密集、交通優先</td>
                <td>靠近機場、地鐵交會、去哪都順</td>
                <td>不是海邊</td>
              </tr>
              <tr>
                <td>南浦洞</td>
                <td>愛逛街、美食、想住熱鬧</td>
                <td>市場/商圈集中、吃逛方便</td>
                <td>不是海邊</td>
              </tr>
            </tbody>
          </table>
        </SeoContentSection>  

        <SeoFaqSection
          title="釜山住宿常見問題"
          items={[
              {
                q: '第一次去釜山住哪裡？',
                a: '大方向這樣選：想看海景選海雲台或廣安里，想交通方便選西面，想吃東西與逛街選南浦洞。',
              },
              {
                q: '釜山住海雲台還是西面比較好？',
                a: '想放鬆看海景選海雲台；如果行程密集、每天移動較多，西面交通更方便。',
              },
              {
                q: '釜山住宿一晚多少錢？',
                a: '釜山住宿價格依區域與季節不同，平價飯店約台幣1500～3000元，高級海景飯店可能4000元以上。',
              },
            ]}
        />
      </main>
      <Footer />
    </>
    
  )
}
