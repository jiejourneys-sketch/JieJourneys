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
      { label: '合作eSIM', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E9%9F%93%E5%9C%8B&referencecode=jiejourneys', className: 'btn primary recommend', event: 'busantransport_esim_connect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/268527?cid=22312', className: 'btn', event: 'busantransport_esim_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109354-south-korea-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'busantransport_esim_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37694225/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_esim_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'SIM卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20721-4g-lte-sim-card-with-t-money-card-calls-pick-up-south-korea-airports-south-korea?cid=22312', className: 'btn primary', event: 'busantransport_sim_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16469-kt-olleh-4g-sim-south-korea/?aid=93798', className: 'btn', event: 'busantransport_sim_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/53602741/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_sim_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜韓國機場領取',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'Wifi分享器｜韓國機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7452-unlimited-4g-pocket-wi-fi-rental-with-airports-and-seoul-pick-up-south-korea?cid=22312', className: 'btn primary', event: 'busantransport_wifi_korea_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16463-4g-wifi-south-korea/?aid=93798', className: 'btn', event: 'busantransport_wifi_korea_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48575899?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'busantransport_wifi_korea_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜台灣機場領取',
    meta: '通訊',
    area: '通訊',
    datasetKey: 'title' as const,
    datasetValue: 'Wifi分享器｜台灣機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/9675-south-korea-kt-olleh-unlimited-4g-wi-fi-rental-taiwan-airports-delivery?cid=22312', className: 'btn primary', event: 'busantransport_wifi_tpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16959-4g-wifi-south-korea/?aid=93798', className: 'btn', event: 'busantransport_wifi_tpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'WOWPASS卡',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'WOWPASS卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/149562?qs=WOWPASS%E5%8D%A1&cid=22312', className: 'btn primary', event: 'busantransport_wowpass_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/86208-wowpass-card-seoul/?aid=93798', className: 'btn', event: 'busantransport_wowpass_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/66033197/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busantransport_wowpass_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: 'T money 交通卡',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'T money 交通卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/132542-korea-4g-high-speed-esim?cid=22312', className: 'btn primary', event: 'busantransport_tmoney_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18054-klook-t-money-card-seoul/?aid=93798', className: 'btn', event: 'busantransport_tmoney_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/83635246/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busantransport_tmoney_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: 'KTX 韓國鐵路通票',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: 'KTX 韓國鐵路通票',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2930-korea-ktx-train-discounted-korail-day-pass?cid=22312', className: 'btn primary', event: 'busantransport_ktx_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/47751-ktx-one-way-ticket-busan/?aid=93798', className: 'btn', event: 'busantransport_ktx_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/trains/korail/route/seoul-to-busan/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busantransport_ktx_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: '釜山金海機場 ↔ 釜山市區',
    meta: '交通',
    area: '交通',
    datasetKey: 'title' as const,
    datasetValue: '釜山金海機場 ↔ 釜山市區',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18410?cid=22312', className: 'btn primary', event: 'busantransport_airport_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/service/pus-gimhae-international-airport/?aid=93798', className: 'btn', event: 'busantransport_airport_klook', platform: 'KLOOK', section: 'transport_card' },
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
        <SeoCtaSection text="" href="/busan/pass-map" linkText="釜山通行證地圖" newTab dataEvent="busantransport_SEO_passmap" />

        <SeoContentSection title="釜山通訊與交通怎麼選？落地後照這個順序">
          <p>
            釜山自由行交通其實不難，先把三件事處理好：手機網路、金海機場進市區、市區移動。大多數人會用 eSIM 或 SIM 卡解決網路，用交通卡搭地鐵和公車；如果抵達時間太晚、同行人多或行李很多，再考慮機場接送。
          </p>

          <h3 className="seo-h3">通訊方案：eSIM、SIM 卡、WiFi 分享器怎麼選？</h3>
          <table>
            <thead>
              <tr>
                <th>方案</th>
                <th>適合誰</th>
                <th>注意</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>eSIM</td>
                <td>一個人旅行、手機支援 eSIM、想出發前先設定好的人。</td>
                <td>下單前確認手機型號支援，抵達後通常最省事。</td>
              </tr>
              <tr>
                <td>SIM 卡</td>
                <td>手機不支援 eSIM，或習慣插實體卡的人。</td>
                <td>要換卡，原本門號可能無法收簡訊或電話。</td>
              </tr>
              <tr>
                <td>WiFi 分享器</td>
                <td>多人一起走、每個人都會待在一起的人。</td>
                <td>要充電、要歸還，分開行動時會麻煩。</td>
              </tr>
            </tbody>
          </table>

          <h3 className="seo-h3">金海機場到市區：先看住宿區域</h3>
          <p>
            金海機場進市區主要看你住哪裡。住西面，可以搭金海輕軌到沙上站，再轉地鐵 2 號線；住海雲台或廣安里，也可以用地鐵轉乘，但拖行李會比較累。機場巴士有往西面/釜田、海雲台/機張方向的路線，適合不想轉車的人；深夜抵達、多人同行或行李很多，才建議看包車接送。
          </p>
          <p>
            想直接預約接送可以用
            <a
              href="https://www.kkday.com/zh-tw/product/18410?cid=22312"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busantransport_airport_article_kkday"
              data-platform="KKDAY"
              data-section="article"
            >
              <strong>KKDAY</strong>
            </a>
            或
            <a
              href="https://www.klook.com/zh-TW/airport-transfers/service/pus-gimhae-international-airport/?aid=93798"
              target="_blank"
              rel="noopener noreferrer"
              data-event="busantransport_airport_article_klook"
              data-platform="KLOOK"
              data-section="article"
            >
              <strong>KLOOK</strong>
            </a>
            ；如果想先看住宿區域，可以回
            <a
              href="/busan/hotel"
              data-event="busantransport_hotel_inline"
              data-platform="internal"
              data-section="article"
            >
              <strong>釜山住宿推薦</strong>
            </a>
            。
          </p>

          <h3 className="seo-h3">釜山市區交通：地鐵為主，公車補足最後一段</h3>
          <p>
            釜山地鐵有多條路線，旅客最常用的是 1 號線和 2 號線。1 號線串釜山站、南浦洞、札嘎其、西面；2 號線串沙上、西面、廣安里、海雲台方向。多數景點先用地鐵拉近距離，再走路或轉公車補最後一段。
          </p>
          <p>
            釜山地鐵有 1 日券、3 日券這類都市鐵道票，但它們主要是給地鐵使用，不包含公車、東海線和金海輕軌等路線。一般自由行如果每天只是搭幾趟地鐵，用 T-money / Cashbee / Hanaro 這類交通卡最直覺；如果你一天內會密集搭地鐵多次，再考慮地鐵一日券。
          </p>

          <h3 className="seo-h3">T-money、WOWPASS、交通卡怎麼選？</h3>
          <p>
            如果你只想搭車，交通卡就夠了；如果你想同時解決換匯、刷卡和交通，才看 WOWPASS。交通卡可以在車站或便利商店購買與加值，搭地鐵、公車、部分計程車都方便；WOWPASS 的重點則是付款功能，適合想少帶現金的人。
          </p>

          <h3 className="seo-h3">KTX 與跨城市移動</h3>
          <p>
            如果你從首爾進釜山，KTX 是最常見的移動方式；如果只是釜山市區內玩，不需要買 KTX 或 Korail Pass。只有你會連跑首爾、釜山、慶州、大邱等多段長距離鐵路時，才需要認真算韓國鐵路通票。
          </p>

          <h3 className="seo-h3">我的行前順序</h3>
          <ol>
            <li>出發前先確認手機能不能用 eSIM。</li>
            <li>決定住宿區域，再選機場進市區方式。</li>
            <li>準備交通卡或 WOWPASS，不要到現場才猶豫。</li>
            <li>膠囊列車、通行證、一日遊另外看票券頁。</li>
            <li>抵達時間晚於一般交通尖峰或行李很多，再看包車。</li>
          </ol>
        </SeoContentSection>
        

        <SeoFaqSection
          title="釜山通訊交通常見問題"
          items={[
            { q: '釜山 eSIM 和 SIM 卡哪個比較好？', a: '手機支援 eSIM 的話，一個人旅行首選 eSIM，出發前設定好最省事。手機不支援 eSIM 或需要通話門號，再看實體 SIM 卡。' },
            { q: '釜山有交通一日券嗎？', a: '有都市鐵道用的 1 日券和 3 日券，但主要限地鐵使用，不包含公車、東海線、金海輕軌等路線。一般自由行用交通卡加值通常最直覺。' },
            { q: '金海機場怎麼進市區最方便？', a: '住西面可搭金海輕軌到沙上站轉地鐵 2 號線；住海雲台或廣安里且行李多，可以評估機場巴士或接送。深夜抵達、多人同行、帶長輩小孩時，包車會更輕鬆。' },
            { q: 'T-money 和 WOWPASS 要買哪一個？', a: '只搭車買交通卡即可；想同時處理付款、換匯和交通，再看 WOWPASS。不要為了交通功能硬買 WOWPASS，重點是你是否需要它的付款功能。' },
            { q: '釜山市區適合租車嗎？', a: '第一次自由行通常不建議。市區停車和路線不一定省事，地鐵、公車、計程車和一日遊比較適合旅客；除非你要自駕去郊外或多人長天數移動。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
