import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanTicketCards, busanTicketTabs } from '@/data/busan'
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
          h1="釜山票券總整理｜通行證・體驗・交通票快速整理"
          intro="把常用票券用標籤分類整理，直接點選你需要的品項，比價後快速下單。"
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
          釜山票券推薦（通行證、景點門票一次看懂）
        </h2>

        <CityTabbedList tabs={busanTicketTabs} cards={busanTicketCards} tabEvent="busan_ticket_tab" />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busanticket_SEO_spotmap" />

        <SeoContentSection title="釜山票券快速理解">
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
