import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '道頓堀/難波', label: '道頓堀/難波', dataArea: '道頓堀/難波' },
  { value: '心齋橋', label: '心齋橋', dataArea: '心齋橋' },
  { value: '梅田/大阪站', label: '梅田/大阪站', dataArea: '梅田/大阪站' },
  { value: '天王寺', label: '天王寺', dataArea: '天王寺' },
]

const cards: CityCard[] = [
  {
    title: '（範例）難波區域住宿',
    meta: '道頓堀/難波｜近心齋橋/地鐵難波站/美食密集',
    area: '道頓堀/難波',
    datasetKey: 'hotel',
    datasetValue: '難波區域住宿',
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/zh-tw/city/osaka-jp.html?cid=1945734', className: 'btn primary', event: 'osakahotel_namba1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: 'Trip', href: 'https://tw.trip.com/hotels/?Allianceid=6833709&SID=242535686', className: 'btn', event: 'osakahotel_namba1_trip', platform: 'Trip', section: 'hotel_card' },
    ],
  },
  {
    title: '（範例）心齋橋區域住宿',
    meta: '心齋橋｜購物方便/地鐵心齋橋站步行圈',
    area: '心齋橋',
    datasetKey: 'hotel',
    datasetValue: '心齋橋區域住宿',
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/zh-tw/city/osaka-jp.html?cid=1945734', className: 'btn primary', event: 'osakahotel_shinsaibashi1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: 'Trip', href: 'https://tw.trip.com/hotels/?Allianceid=6833709&SID=242535686', className: 'btn', event: 'osakahotel_shinsaibashi1_trip', platform: 'Trip', section: 'hotel_card' },
    ],
  },
  {
    title: '（範例）梅田/大阪站區域住宿',
    meta: '梅田/大阪站｜交通樞紐/出差/往返京都神戶方便',
    area: '梅田/大阪站',
    datasetKey: 'hotel',
    datasetValue: '梅田大阪站住宿',
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/zh-tw/city/osaka-jp.html?cid=1945734', className: 'btn primary', event: 'osakahotel_umeda1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: 'Trip', href: 'https://tw.trip.com/hotels/?Allianceid=6833709&SID=242535686', className: 'btn', event: 'osakahotel_umeda1_trip', platform: 'Trip', section: 'hotel_card' },
    ],
  },
  {
    title: '（範例）天王寺區域住宿',
    meta: '天王寺｜通天閣/CP值高/關西機場交通方便',
    area: '天王寺',
    datasetKey: 'hotel',
    datasetValue: '天王寺住宿',
    actions: [
      { label: 'Agoda', href: 'https://www.agoda.com/zh-tw/city/osaka-jp.html?cid=1945734', className: 'btn primary', event: 'osakahotel_tennoji1_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: 'Trip', href: 'https://tw.trip.com/hotels/?Allianceid=6833709&SID=242535686', className: 'btn', event: 'osakahotel_tennoji1_trip', platform: 'Trip', section: 'hotel_card' },
    ],
  },
]

export default function OsakaHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakahotel" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="大阪自由行攻略"
          h1="大阪住宿推薦｜道頓堀、梅田、心齋橋區域完整分析"
          intro="大阪住宿選區影響你整趟旅程的體驗。這頁整理各大住宿區域的特色與適合對象，幫你快速鎖定最值得住的地點。"
          eventPrefix="osakahotel"
          showVisual={false}
          ctaLinks={[
            {
              label: '大阪票券總整理',
              href: 'https://www.jiejourneys.com/osaka/ticket',
              dataEvent: 'osakahotel_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/osaka/transport',
              dataEvent: 'osakahotel_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="stayListTitle">
          大阪住宿推薦
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="osaka_hotel_tab" />

        <SeoContentSection title="大阪住宿區域怎麼選？">
          <h3 className="seo-h3">道頓堀/難波｜玩樂美食核心</h3>
          <p>
            大阪最熱鬧的區域，道頓堀、心齋橋、黑門市場都在步行範圍內。想每天晚上都在外面吃宵夜的人住這區最方便。
            地鐵難波站是搭 HARUKA 前往關西機場的轉乘點，交通也很便利。
          </p>

          <h3 className="seo-h3">梅田/大阪站｜交通最便利</h3>
          <p>
            大阪最大的交通樞紐，JR、阪急、阪神、地鐵都從這裡出發。
            計劃當天往返京都、神戶的旅客首選。百貨公司、伊勢丹在樓上，下雨天也不怕。
          </p>

          <h3 className="seo-h3">心齋橋｜購物主場</h3>
          <p>
            心齋橋拱廊商店街、美國村、藥妝店密集，適合購物派旅客。
            離道頓堀也很近，步行約 10 分鐘可以來回兩區。
          </p>

          <h3 className="seo-h3">天王寺｜CP 值高選擇</h3>
          <p>
            通天閣、新世界串炸就在附近，生活圈物價偏低，CP 值高。
            從天王寺搭 HARUKA 可直達關西機場，適合第一天或最後一天住這邊。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="大阪住宿常見問題"
          items={[
            { q: '大阪住哪個區域最方便？', a: '以玩樂便利度選道頓堀/難波，美食購物步行可達；以交通便利選梅田，往返京都/神戶最快。第一次去的人多數選道頓堀/難波，生活機能最齊全。' },
            { q: '大阪住宿要提前多久訂？', a: '旺季（春天賞櫻 3–4 月、暑假 7–8 月、秋楓 11 月）建議提前 1–2 個月訂。熱門地段連淡季也建議提早，大阪近年旅客量大幅增加，好房源很快就滿。' },
            { q: '關西機場附近需要住宿嗎？', a: '不一定。HARUKA 特急從機場到難波只需約 40 分鐘，建議直接住大阪市區。除非深夜抵達或凌晨出發，否則住市區比住機場附近靈活多了。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}