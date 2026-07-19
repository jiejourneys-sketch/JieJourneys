import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { tokyoTicketCards, tokyoTicketTabs } from '@/data/tokyo'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { safePlannerReturnHref, type PageSearchParams } from '@/lib/plannerReturn'

type TokyoTicketPageProps = {
  searchParams?: PageSearchParams
}

const observationVideos = {
  shibuyaSky: [
    { label: 'IG', href: 'https://www.instagram.com/reel/DWJbrmXFDuf/', event: 'tokyoticket_article_shibuya_sky_ig', platform: 'IG' },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/Y0mGY55bSFs', event: 'tokyoticket_article_shibuya_sky_yt', platform: 'YouTube' },
  ],
  skytree: [
    { label: 'IG', href: 'https://www.instagram.com/reel/DV3aGGdFNsc/', event: 'tokyoticket_article_skytree_ig', platform: 'IG' },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/Q-zM2k47oVY', event: 'tokyoticket_article_skytree_yt', platform: 'YouTube' },
  ],
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

        <SeoContentSection title="東京票券怎麼買？先把景點分成五種">
          <p>
            東京票券不要全部一起看，會很亂。我會先分成展望台、主題型、親子水族館、一日遊、交通票五種；先決定你這趟旅行的重點，再回到上方卡片比 KKDAY、KLOOK、Trip 的價格和取消規則。
          </p>

          <h3 className="seo-h3">展望台：先選想看的城市角度</h3>
          <p>
            <strong>SHIBUYA SKY</strong> 是澀谷上方的戶外感展望台，適合想看十字路口、夕陽和夜景的人；<strong>晴空塔</strong> 高度更高，適合安排淺草、押上、晴空塔商場一起玩。東京鐵塔和六本木展望台則比較適合住銀座、六本木、東京車站一帶的人順路排。
          </p>
          <div className="seo-buy-links tokyo-ticket-observation-links" aria-label="東京展望台相關連結">
            <SeoVideoLinkMenu label="SHIBUYA SKY" links={observationVideos.shibuyaSky} />
            <a
              className="seo-buy-link seo-ticket-article-link"
              href="/tokyo/shibuya-sky-guide?from=tokyo-ticket"
              data-event="tokyoticket_article_shibuya_sky_guide"
              data-platform="article"
              data-section="article"
            >
              文章
            </a>
            <SeoVideoLinkMenu label="晴空塔" links={observationVideos.skytree} />
            <a
              className="seo-buy-link seo-ticket-article-link"
              href="/tokyo/skytree-guide?from=tokyo-ticket"
              data-event="tokyoticket_article_skytree_guide"
              data-platform="article"
              data-section="article"
            >
              文章
            </a>
          </div>

          <h3 className="seo-h3">主題型：迪士尼、哈利波特影城要先卡日期</h3>
          <p>
            東京迪士尼、東京迪士尼海洋、哈利波特影城這類不是「有空再去」的景點，通常要先決定日期和入場時段。尤其旺季、週末、連假，越晚處理越容易被票券限制行程。
          </p>

          <h3 className="seo-h3">親子與水族館：適合雨天和半日行程</h3>
          <p>
            親子類和水族館很適合塞在半天，像晴空塔搭配墨田水族館、品川水族館搭配品川/東京車站、台場或豐洲搭配室內展館。這類票不用每個都買，選一個最順路的就好。
          </p>

          <h3 className="seo-h3">東京近郊一日遊：看交通難度，不是只看景點名</h3>
          <p>
            富士山河口湖、鎌倉江之島、日光、常陸海濱公園都可以從東京出發。我的判斷方式是：自己搭車簡單的可以自由行；轉乘麻煩、景點分散、想拍照不想查車的人，再看一日遊。上方「一日遊」標籤可以用景點關鍵字篩選。
          </p>

          <h3 className="seo-h3">交通票：市區看地鐵券，郊外才看 JR Pass</h3>
          <p>
            如果行程多在東京市區，先看
            <a
              href="/tokyo/tokyo-subway-ticket?from=tokyo-ticket"
              data-event="tokyoticket_article_subway_ticket"
              data-platform="article"
              data-section="article"
            >
              <strong> 東京地鐵券完整攻略</strong>
            </a>
            。如果會跑鎌倉、日光、富士山或多段新幹線，再回頭算 JR Pass 或區域 Pass，不要看到 Pass 就先買。
          </p>

          <h3 className="seo-h3">我會照這個順序買</h3>
          <ol>
            <li>先買一定會滿或一定要指定日期的票：迪士尼、哈利波特影城、熱門展望台。</li>
            <li>再處理一日遊：富士山、日光、常陸海濱公園這類交通比較麻煩的路線。</li>
            <li>最後才買交通券和零散景點票，避免行程還沒定就買錯。</li>
          </ol>
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
            { q: '東京景點票要提前多久訂？', a: '迪士尼、哈利波特影城、熱門展望台建議先處理日期；水族館、一般展館和比較彈性的景點，可以等行程大致排好再買。' },
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
                    data-platform="KKDAY"
                    data-section="faq"
                  >
                    <strong>KKDAY</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://www.klook.com/zh-TW/?aid=93798"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyoticket_faq_klook"
                    data-platform="KLOOK"
                    data-section="faq"
                  >
                    <strong>KLOOK</strong>
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="tokyoticket_faq_trip"
                    data-platform="Trip"
                    data-section="faq"
                  >
                    <strong>Trip</strong>
                  </a>
                  。
                </>
              ),
            },
            { q: '東京一日遊要自己去還是買團？', a: '鎌倉江之島自己去不難；富士山拍照點、日光多點移動、常陸海濱公園接大洗時，買一日遊會省掉很多轉乘和時間壓力。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
