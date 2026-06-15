import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { tokyoTicketCards, tokyoTicketTabs } from '@/data/tokyo'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import { safePlannerReturnHref, type PageSearchParams } from '@/lib/plannerReturn'

type TokyoTicketPageProps = {
  searchParams?: PageSearchParams
}

export default async function TokyoTicketPage({ searchParams }: TokyoTicketPageProps) {
  const params = (await searchParams) ?? {}
  const backHref = safePlannerReturnHref(params.return, '/tokyo')

  return (
    <>
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyoticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="東京自由行票券"
          h1="東京票券購買｜景點門票、交通票、體驗快速整理"
          intro="把東京常用票券依類別整理，切換標籤快速找到你需要的品項，比價後直接下單。"
          eventPrefix="tokyoticket"
          showVisual={false}
          ctaLinks={[
            { label: '東京短影片攻略', href: 'https://www.jiejourneys.com/tokyo/video', dataEvent: 'tokyoticket_allvideos', platform: 'video' },
            { label: '東京住宿推薦', href: 'https://www.jiejourneys.com/tokyo/hotel', dataEvent: 'tokyoticket_allhotels', platform: 'hotel' },
            { label: '通訊&交通攻略', href: 'https://www.jiejourneys.com/tokyo/transport', dataEvent: 'tokyoticket_alltransport', platform: 'transport' },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">
          東京票券整理（依主題分類）
        </h2>
        <CityTabbedList
          tabs={tokyoTicketTabs}
          cards={tokyoTicketCards}
          tabEvent="tokyo_ticket_tab"
          tagFilterArea="一日遊"
          tagOrder={['富士山', '河口湖', '富士山一日遊', '鎌倉大佛', '鎌倉高中', '江之島', '鶴岡八幡宮', '江之電體驗', '小町通', '長谷寺', '極樂寺', '白燈塔', '橫濱空中纜車', '橫濱紅磚倉庫', '橫濱大摩天輪', '東照宮', '伊呂波山道', '中禪寺湖', '華嚴瀑布', '大洗磯前神社', '那珂湊海鮮市場', '國營常陸海濱公園']}
        />

        <SeoCtaSection text="" href="/tokyo/map" linkText="東京熱門景點地圖" newTab dataEvent="tokyoticket_SEO_spotmap" />

        <SeoContentSection title="東京票券快速理解">
          <h3 className="seo-h3">👉 東京景點票券怎麼分（先抓分類才好挑）</h3>
          <p>東京景點票券我會先分成：展望台／主題類／親子類／水族館，先選你想玩的類型。</p>

          <h3 className="seo-h3">👉 展望台（最多人買）</h3>
          <p>
            最有名的是 <strong>SHIBUYA SKY</strong>，<strong>晴空塔</strong>也是很多人必去。
            <br />
            其他還有東京鐵塔、六本木展望台，可以依你住哪區和行程順路程度選。
          </p>

          <h3 className="seo-h3">👉 主題類（需要先訂）</h3>
          <p>
            像是 <strong>哈利波特影城</strong>、<strong>東京迪士尼</strong> 這種主題型行程，熱門時段通常都要先線上買票，臨時才買很容易沒位子。
          </p>

          <h3 className="seo-h3">👉 東京近郊一日遊（富士山、鎌倉、日光、常陸海濱公園）</h3>
          <p>
            <strong>富士山・河口湖</strong>也是東京出發最熱門的一日遊，不過富士山票券已獨立整理在專區，建議直接到富士山票券頁比較完整。
            <br />
            東京近郊中，<strong>鎌倉</strong>也是很受歡迎的選擇——鎌倉大佛、江之島、鶴岡八幡宮加上江之電體驗，通常搭車過去約1小時就能玩到。
            <br />
            <strong>日光</strong>則適合想看世界遺產的旅人，東照宮搭配中禪寺湖、華嚴瀑布，從東京搭電車約2小時。
            <br />
            <strong>常陸海濱公園</strong>以粉蝶花和掃帚草聞名，通常搭配大洗磯前神社和那珂湊海鮮市場，適合喜歡自然風景的行程。
          </p>
          <p>以上行程都有不同團的選項，可切換到「一日遊」標籤篩選。</p>

          <h3 className="seo-h3">👉 小提醒：SHIBUYA SKY 傍晚很熱門</h3>
          <p>
            SHIBUYA SKY 的傍晚時段（看夕陽/夜景）通常最搶，建議<strong>14天前線上購票</strong>，行程才不會被票卡住。
          </p>
        </SeoContentSection>
        <SeoFaqSection
          title="東京票券常見問題"
          items={[
            {
              q: 'SHIBUYA SKY 和晴空塔哪個值得去？',
              a: (
                <>
                  ✔ SHIBUYA SKY：目前東京少數<strong>戶外展望台</strong>，可以直接看到整個澀谷夜景，氛圍比較強
                  <br />
                  ✔ 晴空塔：室內為主，有<strong>透明玻璃地板</strong>，高度更高、視野更廣
                </>
              ),
            },
            { q: '東京景點票要提前多久訂？', a: '結論：能提早就提早訂。熱門時段/旺季很容易售完，臨時才買常常會沒票或要排很久。' },
            {
              q: '東京景點票在哪買比較划算？',
              a: (
                <>
                  建議至少比 3 個平台的價格與取消規則：
                  <a
                    href="https://www.kkday.com/zh-tw/?cid=22312"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyoticket_faq_kkday"
                  >
                    <strong>KKDAY</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://www.klook.com/zh-TW/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyoticket_faq_klook"
                  >
                    <strong>KLOOK</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyoticket_faq_trip"
                  >
                    <strong>Trip</strong>
                  </a>
                  。
                </>
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
