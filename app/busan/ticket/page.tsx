import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanTicketCards, busanTicketTabs } from '@/data/busan/tickets'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
export default function BusanTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="釜山自由行票券"
          h1="釜山票券總整理｜一日遊・通行證・體驗票快速整理"
          intro="把一日遊、通行證與常用票券用標籤分類整理，直接點選你需要的品項，比價後快速下單。"
          eventPrefix="busanticket"
          showVisual={false}
          ctaLinks={[
            {
              label: '釜山短影片攻略',
              href: 'https://www.jiejourneys.com/busan/video',
              dataEvent: 'busanticket_allvideos',
              platform: 'video',
            },
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/busan/hotel',
              dataEvent: 'busanticket_allhotels',
              platform: 'hotel',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/busan/transport',
              dataEvent: 'busanticket_alltransport',
              platform: 'transport',
            },
          ]}
        />

<h2 className="seo-h2" id="ticketListTitle">
          釜山票券推薦（一日遊、通行證、景點門票一次看懂）
        </h2>

        <CityTabbedList
          tabs={busanTicketTabs}
          cards={busanTicketCards}
          tabEvent="busan_ticket_tab"
          tagFilterArea="一日遊"
          tagOrder={['甘川文化村', '膠囊列車', '海岸列車', '遊艇', '白淺灘文化村', '海東龍宮寺', '青沙浦踏石展望台', '南浦洞', '五六島天空步道', '太宗台', '松島海水浴場', '松島纜車', '松島步道', '松島龍宮雲橋', '佛國寺', '大陵苑', '皇理團路', '慶州校村', '慶州良洞村', '東宮與月池', '月精橋']}
        />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busanticket_SEO_spotmap" />
        <SeoCtaSection text="" href="/busan/pass-map" linkText="釜山通行證地圖" newTab dataEvent="busanticket_SEO_passmap" />

        <SeoContentSection title="釜山一日遊與票券快速理解">
          <h3 className="seo-h3">👉 一日遊怎麼選：先用想去的景點篩選</h3>
          <p>
            如果第一次到釜山、想把交通比較分散的景點排在同一天，可以先看<strong>一日遊票券</strong>。
            <br />
            常見路線會把<strong>甘川文化村</strong>、<strong>膠囊列車</strong>、<strong>海東龍宮寺</strong>、<strong>白淺灘文化村</strong>、<strong>青沙浦踏石展望台</strong>排在一起；想去慶州的話，也可以直接選含<strong>佛國寺</strong>、<strong>大陵苑</strong>、<strong>皇理團路</strong>、<strong>東宮與月池</strong>的釜山出發一日遊。
            <br />
            上方可以用景點標籤快速篩選，先挑你最想去的點，再比較 KKDAY、KLOOK、Trip 的路線內容和價格。
          </p>

          <h3 className="seo-h3">👉 最重要：搞懂釜山通行證（Visit Busan Pass）</h3>
          <p>
            <a
              href="https://www.instagram.com/reels/DUDiZzQkdUe/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_link_pass"
            >
              <strong>釜山通行證</strong>
            </a>
            主要分成<strong>限時型</strong>和<strong>限制型</strong>。
            <br />
            限時型：24 / 48 小時內玩所有包含的景點；限制型：Big 3（玩 3 個景點）/ Big 5（玩 5 個景點）。
            <br />
            基本上大多數人會買<strong>48 小時</strong>，CP 值最高、也比較好安排。
          </p>
          <div className="seo-buy-links" aria-label="購買釜山通行證">
            <a
              className="seo-buy-link primary"
              href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_pass_buy_kkday"
              data-platform="KKDAY"
              data-section="seo_content"
            >
              KKDAY 購買
            </a>
            <a
              className="seo-buy-link"
              href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_pass_buy_klook"
              data-platform="KLOOK"
              data-section="seo_content"
            >
              KLOOK 比價
            </a>
            <a
              className="seo-buy-link"
              href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_pass_buy_trip"
              data-platform="Trip"
              data-section="seo_content"
            >
              Trip 查看
            </a>
          </div>

          <h3 className="seo-h3">👉 Pass 沒包含怎麼辦？最熱門是膠囊列車（需另外買票）</h3>
          <p>
            膠囊列車最常搭的就是<strong>尾浦站</strong>和<strong>青沙浦站</strong>來回。
            <br />
            多數人喜歡尾浦 → 青沙浦（覺得更靠海），但缺點是人多、票比較難買。
            <br />
            我的建議：可以改成<strong>青沙浦 → 尾浦</strong>搭
            <a
              href="https://www.instagram.com/reels/DMu5uZxTdO8/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_link_capsule"
            >
              <strong>膠囊列車</strong>
            </a>
            ；尾浦 → 青沙浦就用通行證內含的<strong>海岸列車</strong>，沿途一樣看得到海，體感差不多但更順。
          </p>

          <h3 className="seo-h3">👉 遊艇怎麼買：水營灣不含、鑽石灣才含</h3>
          <p>
            <strong>水營灣遊艇</strong>不包含在釜山通行證裡，需要另外購買；通行證只能搭乘<strong>鑽石灣遊艇</strong>。
          </p>

          <h3 className="seo-h3">👉 汗蒸幕與其他熱門景點</h3>
          <p>
            汗蒸幕基本上多數都包含在釜山通行證裡。
            <br />
            另外通行證涵蓋景點很多，熱門還包含：<strong>斜坡滑車</strong>、<strong>Busan X the Sky 展望台</strong>、<strong>松島纜車</strong>。
          </p>

          <h3 className="seo-h3">👉 行前小提醒</h3>
          <p>
            出發前 3 天內先填好
            <a
              href="https://www.instagram.com/reels/DKMrn6dzS4G/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_link_earrival"
            >
              <strong>電子入境卡</strong>
            </a>
            ，落地會更順。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="釜山票券常見問題"
          items={[
            { q: '釜山通行證怎麼選？', a: '先分清楚兩種：限時型（24/48 小時內玩包含景點）與限制型（Big 3/Big 5）。第一次來、景點想跑多一點的人，多數都會選 48 小時。' },
            { q: '膠囊列車怎麼搭比較順？', a: '膠囊列車通常是尾浦站 ↔ 青沙浦站，但熱門方向（尾浦→青沙浦）人多票難買。可以改搭青沙浦→尾浦，再用通行證內含的海岸列車補回尾浦→青沙浦，沿途一樣看海、體感差不多。' },
            { q: '遊艇有包含在釜山通行證嗎？', a: '釜山通行證只能搭鑽石灣遊艇；水營灣遊艇不包含，需另外購票。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
