import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '交通', label: '交通', dataArea: '交通' },
]

const cards = [
  {
    title: 'eSIM卡',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'eSIM卡',
    actions: [
      { label: '輸入JieJourneys', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E9%9F%93%E5%9C%8B&referencecode=jiejourneys', className: 'btn primary recommend', event: 'busantransport_esimconnect', platform: 'connect', section: 'comm_card' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/268527?cid=22312', className: 'btn', event: 'busantransport_esimKKday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109354-south-korea-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'busantransport_esimKLOOK', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37694225/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_esimTrip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'SIM卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20721-4g-lte-sim-card-with-t-money-card-calls-pick-up-south-korea-airports-south-korea?cid=22312', className: 'btn primary', event: 'busantransport_simKKday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16469-kt-olleh-4g-sim-south-korea/?aid=93798', className: 'btn', event: 'busantransport_simKLOOK', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/53602741/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_simTrip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜韓國機場領取',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'Wifi分享器｜韓國機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7452-unlimited-4g-pocket-wi-fi-rental-with-airports-and-seoul-pick-up-south-korea?cid=22312', className: 'btn primary', event: 'busantransport_WifiKoreaKKday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16463-4g-wifi-south-korea/?aid=93798', className: 'btn', event: 'busantransport_WifiKoreaKLOOK', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48575899?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'busantransport_WifiKoreaTrip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜台灣機場領取',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'Wifi分享器｜台灣機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/9675-south-korea-kt-olleh-unlimited-4g-wi-fi-rental-taiwan-airports-delivery?cid=22312', className: 'btn primary', event: 'busantransport_WifiTPEKKday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16959-4g-wifi-south-korea/?aid=93798', className: 'btn', event: 'busantransport_WifiTPEKLOOK', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'WOWPASS卡',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'WOWPASS卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/149562?qs=WOWPASS%E5%8D%A1&cid=22312', className: 'btn primary', event: 'busantransport_wowKKday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/86208-wowpass-card-seoul/?aid=93798', className: 'btn', event: 'busantransport_wowKLOOK', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/66033197/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busantransport_wowTrip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: 'T money 交通卡',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'T money 交通卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/132542-korea-4g-high-speed-esim?cid=22312', className: 'btn primary', event: 'busantransport_TmoneyKKday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18054-klook-t-money-card-seoul/?aid=93798', className: 'btn', event: 'busantransport_TmoneyKLOOK', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/83635246/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busantransport_TmoneyTrip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: 'KTX 韓國鐵路通票',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'KTX 韓國鐵路通票',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2930-korea-ktx-train-discounted-korail-day-pass?cid=22312', className: 'btn primary', event: 'busantransport_KTXKKday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/47751-ktx-one-way-ticket-busan/?aid=93798', className: 'btn', event: 'busantransport_KTXKLOOK', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/trains/korail/route/seoul-to-busan/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_KTXTrip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: '釜山金海機場 ↔ 釜山市區',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: '釜山金海機場 ↔ 釜山市區',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18410?cid=22312', className: 'btn primary', event: 'busantransport_airportKKday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/service/pus-gimhae-international-airport/?aid=93798', className: 'btn', event: 'busantransport_airportKLOOK', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
]

export default function BusanTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busantransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="釜山自由行工具"
          h1="釜山通訊&交通攻略｜eSIM、交通卡、機場接送一次整理"
          intro="把釜山自由行常用的通訊與交通工具集中在這一頁：讓你快速找到最適合的方案與購買連結。"
          eventPrefix="busantransport"
          showVisual={false}
          ctaLinks={[
            {
              label: '釜山短影片攻略',
              href: 'https://www.jiejourneys.com/busan/video',
              dataEvent: 'busantransport_allvideos',
              platform: 'video',
            },
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/busan/hotel',
              dataEvent: 'busantransport_allhotels',
              platform: 'hotel',
            },
            {
              label: '釜山票券總整理',
              href: 'https://www.jiejourneys.com/busan/ticket',
              dataEvent: 'busantransport_alltickets',
              platform: 'ticket',
            },
          ]}
        />

        <h2 className="seo-h2" id="transportListTitle">
          釜山通訊&交通整理（eSIM、交通卡、機場接送）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="busan_transport_tab" />

        <SeoCtaSection text="" href="/busan/map" linkText="釜山熱門景點地圖" newTab dataEvent="busantransport_SEO_spotmap" />

        <SeoContentSection title="釜山通訊 & 交通怎麼選？">
          <h3 className="seo-h3">通訊方案：eSIM vs SIM卡 vs WiFi分享器</h3>
          <p>eSIM免換卡、出發前設定好直接用，是最方便的選擇；SIM卡需要換卡，但訊號通常較穩；WiFi分享器適合多人共用。一個人旅行首選 eSIM，兩人以上可評估 WiFi 分享器划不划算。</p>

          <h3 className="seo-h3">釜山市區交通</h3>
          <p>釜山市區以地鐵為主，T-Money 交通卡可搭地鐵和公車，可在機場或便利商店購入。景點之間多靠步行或地鐵串連。</p>

          <h3 className="seo-h3">釜山機場進市區</h3>
          <p>金海機場進市區有地鐵輕軌（轉乘一次可到西面/海雲台）或包車接送（適合多人或深夜抵達）。</p>
        </SeoContentSection>
        

        <SeoFaqSection
          title="釜山通訊交通常見問題"
          items={[
            { q: '釜山eSIM和SIM卡哪個比較好？', a: '一個人首選eSIM，免換卡直接用；但部分手機只能用SIM卡，依需求選擇。' },
            { q: '釜山有交通一日券嗎？', a: '釜山地鐵沒有一日券，建議買T-Money交通卡儲值使用，搭地鐵、公車都能刷。' },
            { q: '釜山機場怎麼進市區最方便？', a: '機場輕軌到沙上站然後轉乘地鐵2號線即可到達西面；多人同行可評估機場巴士或包車。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
