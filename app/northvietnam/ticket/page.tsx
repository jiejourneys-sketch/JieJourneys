import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { northVietnamTicketCards, northVietnamTicketTabs } from '@/data/northvietnam'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import { safePlannerReturnHref, type PageSearchParams } from '@/lib/plannerReturn'

type NorthVietnamTicketPageProps = {
  searchParams?: PageSearchParams
}

export default async function NorthVietnamTicketPage({ searchParams }: NorthVietnamTicketPageProps) {
  const params = (await searchParams) ?? {}
  const backHref = safePlannerReturnHref(params.return, '/northvietnam')

  return (
    <>
      <CitySubpageHeader backHref={backHref} eventPrefix="northvietnamticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="北越票券與行程整理"
          h1="北越票券整理｜河內、沙壩、下龍灣、陸龍灣怎麼買"
          intro="北越票券可以先用地區分成河內、沙壩、下龍灣和陸龍灣，再依景點、天數或郵輪等級篩選。這頁把單點票券、一日遊、多日遊和遊輪方案整理在一起，方便你照行程節奏比較。"
          eventPrefix="northvietnamticket"
          showVisual={false}
          ctaLinks={[
            { label: '北越短影片攻略', href: 'https://www.jiejourneys.com/northvietnam/video', dataEvent: 'northvietnamticket_allvideos', platform: 'video' },
            { label: '北越住宿推薦', href: 'https://www.jiejourneys.com/northvietnam/hotel', dataEvent: 'northvietnamticket_allhotels', platform: 'hotel' },
            { label: '通訊與交通攻略', href: 'https://www.jiejourneys.com/northvietnam/transport', dataEvent: 'northvietnamticket_alltransport', platform: 'transport' },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">北越票券整理（依地區與標籤篩選）</h2>
        <CityTabbedList
          tabs={northVietnamTicketTabs}
          cards={northVietnamTicketCards}
          tabEvent="northvietnam_ticket_tab"
          tagFilterAreas={['河內', '沙壩', '下龍灣', '陸龍灣']}
          tagDefaultAreaOnAll="河內"
          tagOrder={['火車街', '還劍湖', '玉山祠', '胡志明陵寢', '胡志明博物館', '河內教堂', '文廟', '鎮國寺', '越南民族學博物館', '越南婦女博物館', '火爐監獄博物館', '昇龍皇城', '龍邊橋', '西湖', '陶瓷路', '同春市場', '吉普車', '河內香村', '制帽體驗', '水木偶', '鉢場陶瓷村', '河內大世界', '水舞表演', '美食之旅', '番西邦峰', '番西邦纜車', '貓貓村', 'Moana Sapa', '沙壩高山滑車', '玻璃天空步道', '銀瀑', '天堂之門', '義靈湖、老寨和塔萬村莊', '華閭古都', '白亭寺', '三谷', '長安', '舞洞', '1日遊', '2日遊', '3日遊', '6星級', '5星級', '3星級']}
        />

        <SeoCtaSection text="" href="/northvietnam/map" linkText="北越熱門景點地圖" newTab dataEvent="northvietnamticket_SEO_spotmap" />

        <SeoContentSection title="北越票券怎麼安排比較順？">
          <h3 className="seo-h3">先用地區決定票券類型</h3>
          <p>北越的票券不太適合全部混在一起看，因為每個地區的玩法不同。河內適合用半日或一日遊串起市區景點，也可以單買按摩、水上木偶秀、觀景台或水族館；沙壩則以番西邦峰纜車、貓貓村、玻璃天空步道和山區行程為主；下龍灣重點是遊輪；陸龍灣則是長安、三谷、舞洞、華閭古都和白亭寺的組合。</p>

          <h3 className="seo-h3">河內票券適合補行程空檔</h3>
          <p>河內市區景點密度高，最適合把票券當成補空檔的工具。第一次到河內可以先看火車街、還劍湖、玉山祠、文廟、鎮國寺、胡志明陵寢這類經典景點；想省交通和導覽時間，就選含多個景點的一日遊。晚上或雨天則可以安排水上木偶秀、按摩、觀景台或水族館，彈性比較高。</p>

          <h3 className="seo-h3">沙壩要用景點和天數一起篩</h3>
          <p>沙壩距離河內較遠，行程安排比河內更需要看天數。只停一天可以挑番西邦峰、貓貓村、Moana Sapa 或玻璃天空步道這種主題明確的行程；兩天以上再把銀瀑、天堂之門、義靈湖、老寨和塔萬村莊放進來。篩選時可以先點景點 tag，再用 1日遊、2日遊、3日遊縮小範圍。</p>

          <h3 className="seo-h3">下龍灣看天數和郵輪等級</h3>
          <p>下龍灣遊輪主要差在天數、船型、餐食和房間等級。一日遊適合時間有限、想從河內當天往返的人；兩日遊比較能慢慢看海灣、洞穴和船上設施。若你在意住宿與服務，可以用 6星級、5星級、3星級這類標籤先做預算分層，再比較平台價格和取消規則。</p>

          <h3 className="seo-h3">陸龍灣用景點 tag 找組合</h3>
          <p>陸龍灣的方案很適合用景點 tag 篩選。想看古都就選華閭古都，想坐小船就比較三谷和長安，想爬高看全景就把舞洞放進行程，白亭寺則適合和長安一起排。若只想單買船票，可以先看長安生態保護區；若想從河內出發省交通，則選含接送的一日遊或兩日遊方案。</p>
        </SeoContentSection>

        <SeoContentSection title="北越票券挑選小提醒">
          <h3 className="seo-h3">同一景點先比方案內容，不只比價格</h3>
          <p>KKDAY、KLOOK 和 Trip 上看起來相似的商品，實際可能差在接送地點、語言、餐食、停留時間和是否含門票。尤其是下龍灣遊輪、陸龍灣一日遊和沙壩多日遊，建議先確認包含哪些景點，再看平台價格。</p>

          <h3 className="seo-h3">需要交通的行程優先看集合方式</h3>
          <p>沙壩、下龍灣和陸龍灣都不是河內市區內景點，如果行程含河內接送，通常會比自己拆交通更省心。訂購前可以先確認是否到飯店接送、是否只接老城區、回程停靠在哪裡，避免最後一天和住宿位置衝突。</p>

          <h3 className="seo-h3">單點票券適合搭配地圖使用</h3>
          <p>如果你已經知道會去哪些景點，可以先到北越地圖看位置，再回到票券頁用 tag 找行程。像貓貓村、銀瀑、天堂之門、長安、三谷、舞洞這種景點，地圖卡片會比較容易判斷動線；票券頁則適合比較平台和方案。</p>
        </SeoContentSection>

        <SeoFaqSection
          title="北越票券常見問題"
          items={[
            { q: '北越票券需要提前買嗎？', a: '熱門行程建議提前訂，特別是下龍灣遊輪、沙壩多日遊和陸龍灣一日遊。河內市區的水上木偶秀、按摩和觀景台彈性較高，但提前買通常比較好安排時間。' },
            { q: '下龍灣一日遊和兩日遊怎麼選？', a: '時間有限可以選一日遊，但兩日遊節奏比較舒服，也更能體驗船上設施和海灣景色。若你特別期待遊輪本身，建議優先看兩日遊。' },
            { q: '沙壩番西邦峰和貓貓村可以排同一天嗎？', a: '可以，但行程會比較滿。若只去沙壩一天，可以選已經排好的組合行程；若有兩天以上，再把玻璃天空步道、銀瀑或村莊健行加進去會比較舒服。' },
            { q: '陸龍灣長安和三谷要選哪個？', a: '兩者都是小船景觀路線。長安路線較完整、景點感更強；三谷更偏自然田園感。第一次去可以依方案搭配選，若想看全景，舞洞可以一起排。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
