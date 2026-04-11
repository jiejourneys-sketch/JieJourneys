import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { northVietnamTicketCards, northVietnamTicketTabs } from '@/data/northvietnam'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

export default function NorthVietnamTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="越南北越自由行票券"
          h1="北越票券整理｜下龍灣遊輪・番西邦峰纜車・陸龍灣小船・河內古蹟"
          intro="北越四大區各有必買票券：下龍灣遊輪建議兩天一夜、沙壩的番西邦峰纜車和貓貓村不能排同天、陸龍灣長安三谷坐小船或舞洞爬山二選一。依目的地切換標籤，直接找你需要的票券。"
          eventPrefix="northvietnamticket"
          showVisual={false}
          ctaLinks={[
            { label: '北越短影片攻略', href: 'https://www.jiejourneys.com/northvietnam/video', dataEvent: 'northvietnamticket_allvideos', platform: 'video' },
            { label: '北越住宿推薦', href: 'https://www.jiejourneys.com/northvietnam/hotel', dataEvent: 'northvietnamticket_allhotels', platform: 'hotel' },
            { label: '通訊&交通攻略', href: 'https://www.jiejourneys.com/northvietnam/transport', dataEvent: 'northvietnamticket_alltransport', platform: 'transport' },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">北越票券整理（依類別分類）</h2>
        <CityTabbedList tabs={northVietnamTicketTabs} cards={northVietnamTicketCards} tabEvent="northvietnam_ticket_tab" />

        <SeoCtaSection text="" href="/northvietnam/map" linkText="北越熱門景點地圖" newTab dataEvent="northvietnamticket_SEO_spotmap" />

        <SeoContentSection title="北越各地票券重點整理">
          <h3 className="seo-h3">下龍灣遊輪票</h3>
          <p>下龍灣的核心玩法是搭遊輪欣賞石灰岩島嶼，通常包含驚訝洞（鐘乳石洞）、英雄島海灘、划小船等活動，船上設施也是體驗的一部分。建議選兩天一夜比較不趕，從河內出發約兩小時抵達碼頭。遊輪等級差距大，從普通船到六星級郵輪都有，建議依預算提早訂。</p>

          <h3 className="seo-h3">沙壩景點票券</h3>
          <p>沙壩主要花費在番西邦峰纜車和貓貓村門票。番西邦峰是東南亞最高峰，搭纜車上山是最多人的選擇；貓貓村則是梯田村落健行體驗。這兩個景點都很耗體力，不建議排在同一天。旺季期間番西邦峰纜車等候時間長，建議提前購票。</p>

          <h3 className="seo-h3">陸龍灣體驗票券</h3>
          <p>陸龍灣的亮點分兩種玩法：長安/三谷是坐小船穿梭河谷欣賞美景；舞洞則是爬山俯瞰河谷，體力需求不同。兩者之外還有華閭古都和白亭寺可以搭配參觀建，議事前透過平台訂好。</p>

          <h3 className="seo-h3">河內景點票券</h3>
          <p>河內以古蹟和市區逛街吃美食為主。主要付費景點包含胡志明陵寢、文廟、還劍湖周邊等，部分可現場購票，熱門導覽體驗建議事前在平台預訂比較保險。</p>
        </SeoContentSection>

        <SeoFaqSection
          title="北越票券常見問題"
          items={[
            { q: '下龍灣遊輪訂一天還是兩天一夜？', a: '強烈建議兩天一夜，一天行程太趕，很多活動走馬看花。兩天一夜可以完整體驗驚訝洞、英雄島海灘、划小船，晚上還能感受海灣夜景。' },
            { q: '番西邦峰和貓貓村可以排同一天嗎？', a: '不建議，兩個景點都很耗體力，排同一天很容易撐不住。建議分開兩天，各留充足時間慢慢玩。' },
            { q: '陸龍灣長安三谷和舞洞要選哪個？', a: '兩者玩法不同：長安/三谷是坐小船穿梭河谷，較輕鬆；舞洞是爬山俯瞰河谷，體力需求較高但視野更好。通常建議兩個都排。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
