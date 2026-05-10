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

        <SeoCtaSection text="" href="/northvietnam/map" linkText="北越熱門景點地圖" newTab dataEvent="northvietnamhotel_SEO_map" />

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

        <SeoContentSection title="沙壩住宿怎麼選？市區、山景飯店與度假村差在哪">
          <h3 className="seo-h3">第一次去沙壩：住市區最穩</h3>
          <p>第一次安排沙壩自由行，住宿建議先選沙壩市區或沙壩廣場、石教堂附近。這一帶餐廳、按摩、便利商店與番西邦纜車接駁都比較方便，晚上要散步吃飯也不用額外叫車。像沙壩穹頂飯店、沙壩地平線飯店、竹薩帕飯店、沙壩廣場飯店這類位置都適合第一次來的人。</p>

          <h3 className="seo-h3">想看山景：選有陽台或高樓層的飯店</h3>
          <p>沙壩住宿最大的亮點就是山景與雲海，但不是每間飯店都能看到漂亮景色。訂房時可以優先看「山景房、陽台房、高樓層」這些條件，像帕歐沙壩休閒酒店、KK 沙壩飯店、沙壩開心果飯店、越南徒步沙壩酒店都比較適合想把景觀放進行程的人。</p>

          <h3 className="seo-h3">想度假：選大型度假村或山坡飯店</h3>
          <p>如果這趟沙壩不是只拿來健行，而是想放慢步調、泡在飯店裡看山景，可以選薩帕雷迪山度假村、蒙特維爾山度假村、沙壩翡翠山 Spa 度假村這類空間感更強的住宿。這些飯店通常離最熱鬧的市區稍微遠一點，但換來更好的景觀、泳池、庭園或度假感。</p>

          <h3 className="seo-h3">沙壩住宿建議住幾晚？</h3>
          <p>河內到沙壩單程約 5–6 小時，若只住 1 晚會比較趕。比較順的安排是 3 天 2 夜：第一天從河內移動到沙壩，第二天安排番西邦、貓貓村或梯田健行，第三天再回河內。預算夠的話，2 晚可以一晚住市區方便吃飯，一晚住山景或度假村。</p>
        </SeoContentSection>

        <SeoFaqSection
          title="北越住宿常見問題"
          items={[
            { q: '第一次去北越住哪裡？', a: '建議以河內為基地，首尾各住一晚，其他地區依行程安排（沙壩住山區、下龍灣住遊輪）。' },
            { q: '下龍灣要一日遊還是住一晚遊輪？', a: '建議選 2天1夜遊輪。一日遊時間較趕，住一晚可以看到日落、日出，體驗差很多。預算夠的話，直接選過夜遊輪最值得' },
            { q: '沙壩住宿怎麼選？', a: '河內到沙壩單程5–6小時，建議直接安排3天2夜。住宿部分：市區方便、梯田漂亮，第一次去建議先住市區就好' },
            { q: '沙壩住宿要住市區還是山景飯店？', a: '第一次去建議住市區，吃飯、接駁與行程集合都方便；如果已經熟悉沙壩，或想放空看雲海，再選山坡上的山景飯店或度假村。' },
            { q: '沙壩適合住幾晚？', a: '最推薦 2 晚。因為河內到沙壩車程較長，住 2 晚才比較能安排番西邦、貓貓村、梯田健行與市區散步，不會只剩下搭車時間。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
