import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanTicketCards, busanTicketTabs } from '@/data/busan/tickets'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import { safePlannerReturnHref, type PageSearchParams } from '@/lib/plannerReturn'

type BusanTicketPageProps = {
  searchParams?: PageSearchParams
}

export default async function BusanTicketPage({ searchParams }: BusanTicketPageProps) {
  const params = (await searchParams) ?? {}
  const backHref = safePlannerReturnHref(params.return, '/busan')

  return (
    <>
      <CitySubpageHeader backHref={backHref} eventPrefix="busanticket" />
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

        <SeoContentSection title="釜山票券怎麼買？先分三種情境">
          <p>
            釜山票券不要一開始就全買。先判斷你需要的是「通行證」、「一日遊」還是「單點門票」：通行證用來集中玩高單價景點，一日遊用來解決分散景點的交通，單點門票則適合你只想玩一兩個重點。
          </p>

          <h3 className="seo-h3">三種票券快速比較</h3>
          <table>
            <thead>
              <tr>
                <th>類型</th>
                <th>適合誰</th>
                <th>我的判斷</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>釜山通行證</td>
                <td>想把展望台、遊艇、汗蒸幕、樂園或體驗景點集中玩的人。</td>
                <td>先用通行證地圖排路線，能集中玩才買，不要只看景點數量。</td>
              </tr>
              <tr>
                <td>一日遊</td>
                <td>想去甘川洞、海東龍宮寺、青沙浦、白淺灘或慶州，但不想自己轉車的人。</td>
                <td>適合第一次去、帶長輩、帶小孩、或想把分散景點塞進同一天。</td>
              </tr>
              <tr>
                <td>單點門票</td>
                <td>只想搭膠囊列車、去樂天世界、X the Sky、松島纜車或特定體驗的人。</td>
                <td>行程鬆散時最乾淨，不會為了回本硬跑景點。</td>
              </tr>
            </tbody>
          </table>

          <h3 className="seo-h3">釜山通行證：先排路線，再買票</h3>
          <p>
            釜山通行證分成 24 / 48 小時，以及 Big 3 / Big 5。限時型適合把景點集中在一天或兩天內玩，限制型適合只挑少數高單價景點。我的做法是先把想去的景點全部標在
            <a
              href="/busan/pass-map"
              data-event="busanticket_passmap_inline"
              data-platform="internal"
              data-section="article"
            >
              <strong>釜山通行證地圖</strong>
            </a>
            ，再看能不能排成順路；如果一天內只能用到一兩個點，就先不要急著買。
          </p>
          <p>
            想看完整規則、不能使用的景點和需要預約的項目，可以先看
            <a
              href="/busan/visit-busan-pass?from=ticket"
              data-event="busanticket_pass_article"
              data-platform="article"
              data-section="article"
            >
              <strong>釜山通行證完整攻略</strong>
            </a>
            ，或搭配
            <a
              href="https://www.instagram.com/reel/DUDiZzQkdUe/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_pass_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong>釜山通行證短影片</strong>
            </a>
            先抓重點。
          </p>
          <div className="seo-buy-links seo-action-links" aria-label="購買釜山通行證">
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

          <h3 className="seo-h3">一日遊：用景點標籤反推路線</h3>
          <p>
            一日遊最適合處理「自己去很麻煩」的景點，例如甘川文化村、白淺灘文化村、海東龍宮寺、青沙浦踏石展望台、松島海水浴場，或釜山出發到慶州的佛國寺、大陵苑、皇理團路、東宮與月池。不要只看行程名稱，先看它有沒有包含你最想去的點，再比集合地、停留時間和是否含膠囊列車。
          </p>

          <h3 className="seo-h3">膠囊列車：熱門時段要提早處理</h3>
          <p>
            海雲台藍線公園的膠囊列車熱門時段很容易滿，官方訂票通常會提前開放一段時間，現場票數量有限。想拍照的人通常會先鎖定尾浦、青沙浦方向和時段，再決定要不要搭配海岸列車。
          </p>
          <p>
            可以先看
            <a
              href="https://www.instagram.com/reel/DMu5uZxTdO8/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_capsule_ig"
              data-platform="IG"
              data-section="article"
            >
              <strong>膠囊列車影片</strong>
            </a>
            ，購票可以用
            <a
              href="https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_capsule_kkday"
              data-platform="KKDAY"
              data-section="article"
            >
              <strong>KKDAY</strong>
            </a>
            或
            <a
              href="https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_capsule_klook"
              data-platform="KLOOK"
              data-section="article"
            >
              <strong>KLOOK</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">遊艇：先決定要拍照，還是要用 Pass</h3>
          <p>
            水營灣遊艇偏小船、拍照和煙火感比較明顯；鑽石灣遊艇船體較大，重點是可搭配釜山通行證。兩個不是誰一定比較好，而是目的不同。想先比較，可以看
            <a
              href="/busan/busan-yacht-suyeong-diamond-bay?from=ticket"
              data-event="busanticket_link_yacht_article"
              data-platform="article"
              data-section="seo_content"
            >
              <strong>水營灣 vs 鑽石灣遊艇整理</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">熱門單點門票怎麼排？</h3>
          <p>
            如果你只想玩一兩個重點，就不要硬買通行證。膠囊列車、樂天世界釜山、Busan X the Sky、松島纜車、SPA LAND、Running Man 這類單點門票，直接買單品通常更清楚。上方卡片可以用分類和景點標籤篩選，再看 KKDAY、KLOOK、Trip 哪個價格和取消規則最適合。
          </p>

          <h3 className="seo-h3">我的購買順序</h3>
          <ol>
            <li>先把必去景點列出來，不要先買票。</li>
            <li>如果高單價景點能集中，先算釜山通行證。</li>
            <li>如果景點很分散，改看一日遊。</li>
            <li>如果只玩一兩個點，買單點票就好。</li>
            <li>膠囊列車、遊艇、熱門樂園先處理時段，再處理其他門票。</li>
          </ol>

          <h3 className="seo-h3">行前小提醒</h3>
          <p>
            出發前 3 天內先填好
            <a
              href="https://www.instagram.com/reel/DKMrn6dzS4G/"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busanticket_link_earrival"
              data-platform="IG"
              data-section="article"
            >
              <strong>電子入境卡</strong>
            </a>
            ，落地會更順。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="釜山票券常見問題"
          items={[
            { q: '釜山通行證怎麼選？', a: '先分清楚兩種：限時型是 24/48 小時內集中玩景點，限制型是 Big 3/Big 5 挑指定數量景點。先用地圖排路線，能集中玩高單價景點才買。' },
            { q: '第一次去釜山要買一日遊嗎？', a: '如果你想去甘川洞、白淺灘、海東龍宮寺、青沙浦、松島或慶州，又不想自己轉車，一日遊會省很多力。只在市區逛街吃飯就不一定需要。' },
            { q: '膠囊列車有包含在釜山通行證嗎？', a: '膠囊列車通常要另外處理票券或時段，不要把它當成一定被通行證解決的項目。熱門時段建議提早訂。' },
            { q: '遊艇有包含在釜山通行證嗎？', a: '通常要分水營灣和鑽石灣看。想用通行證多半看鑽石灣；想拍照、拍立得或煙火感，會比較常看水營灣。' },
            { q: 'KKDAY、KLOOK、Trip 要怎麼比？', a: '先比是否含你要的時段和景點，再比集合地、取消規則、語言、價格。不要只看最低價，因為路線內容差一個點就會差很多。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
