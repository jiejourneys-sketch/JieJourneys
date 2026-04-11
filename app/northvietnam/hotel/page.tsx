import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { northVietnamHotelCards, northVietnamHotelTabs } from '@/data/northvietnam'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

export default function NorthVietnamHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamhotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="越南北越自由行攻略"
          h1="北越住宿推薦｜河內、沙壩、下龍灣住哪裡？區域完整分析"
          intro="北越各地住宿選擇差異大，河內、沙壩、下龍灣各有不同住宿生態。本頁整理各區特色，幫你快速選出最適合行程的住宿地點。"
          eventPrefix="northvietnamhotel"
          showVisual={false}
          ctaLinks={[
            { label: '北越短影片攻略', href: 'https://www.jiejourneys.com/northvietnam/video', dataEvent: 'northvietnamhotel_allvideos', platform: 'video' },
            { label: '北越票券總整理', href: 'https://www.jiejourneys.com/northvietnam/ticket', dataEvent: 'northvietnamhotel_alltickets', platform: 'ticket' },
            { label: '通訊&交通攻略', href: 'https://www.jiejourneys.com/northvietnam/transport', dataEvent: 'northvietnamhotel_alltransport', platform: 'transport' },
          ]}
        />

        <h2 className="seo-h2" id="stayListTitle">北越住宿推薦飯店</h2>
        <CityTabbedList tabs={northVietnamHotelTabs} cards={northVietnamHotelCards} tabEvent="northvietnam_hotel_tab" />

        <SeoCtaSection text="" href="/northvietnam/map" linkText="北越住宿推薦地圖" newTab dataEvent="northvietnamhotel_SEO_map" />

        <SeoContentSection title="北越住宿區域怎麼選？">
          <h3 className="seo-h3">河內（旅遊基地）</h3>
          <p>北越自由行的出發點，機場交通方便，往各地的班車、行程多從河內出發。老城區（還劍湖周邊）步行景點多，適合待 1–2 晚後再前往其他地區。</p>

          <h3 className="seo-h3">沙壩（山景健行）</h3>
          <p>海拔約 1500 公尺，氣候涼爽。市區內有許多民宿與精品小屋，部分可看梯田景。適合喜歡健行、自然風景、慢旅行的人。</p>

          <h3 className="seo-h3">下龍灣（海上過夜）</h3>
          <p>大多數旅客選擇搭乘遊輪在海上過夜，體驗海灣夜景。船上含住宿、餐食與行程，直接訂遊輪即可，不需另外找飯店。</p>

          <h3 className="seo-h3">北越住宿怎麼安排最順？</h3>
          <ul>
            <li>落腳基地：河內，首尾各住一晚</li>
            <li>下龍灣：直接訂遊輪含住宿</li>
            <li>沙壩：市區民宿或精品小屋，依預算選擇</li>
            <li>陸龍灣（寧平）：多為一日來回，通常不需住宿</li>
          </ul>
        </SeoContentSection>

        <SeoFaqSection
          title="北越住宿常見問題"
          items={[
            { q: '第一次去北越住哪裡？', a: '建議以河內為基地，首尾各住一晚，其他地區依行程安排（沙壩住山區、下龍灣住遊輪）。' },
            { q: '下龍灣要一日遊還是住一晚遊輪？', a: '建議選 2天1夜遊輪。一日遊時間較趕，住一晚可以看到日落、日出，體驗差很多。預算夠的話，直接選過夜遊輪最值得' },
            { q: '沙壩住宿怎麼選？', a: '河內到沙壩單程5–6小時，建議直接安排3天2夜。住宿部分：市區方便、梯田漂亮，第一次去建議先住市區就好' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
