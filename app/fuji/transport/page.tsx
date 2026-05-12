import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '交通', label: '交通', dataArea: '交通' },
]

const cards: CityCard[] = [
  // ── 通訊 ─────────────────────────────────────────────────
  {
    title: 'eSIM卡',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'eSIM卡',
    actions: [
      { label: '合作eSIM', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'fujitransport_esim_connect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'fujitransport_esim_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109393-japan-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'fujitransport_esim_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37658069?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'fujitransport_esim_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡｜郵寄到府',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'SIM卡｜郵寄到府',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/126982?cid=22312', className: 'btn primary', event: 'fujitransport_simhome_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/17147-softbank-4g-sim-japan/?aid=93798', className: 'btn', event: 'fujitransport_simhome_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡｜桃園機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'SIM卡｜桃園機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19991?cid=22312', className: 'btn primary', event: 'fujitransport_simtpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/40060-4g-sim-card-japan-docomo/?aid=93798', className: 'btn', event: 'fujitransport_simtpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜台灣機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'Wifi分享器｜台灣機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11157?cid=22312', className: 'btn primary', event: 'fujitransport_wifitpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16627-4g-wifi-japan/?aid=93798', className: 'btn', event: 'fujitransport_wifitpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜日本機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'Wifi分享器｜日本機場領取',
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798', className: 'btn primary', event: 'fujitransport_wifijpn_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/59496665?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'fujitransport_wifijpn_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  // ── 交通 ─────────────────────────────────────────────────
  {
    title: '新宿 ⇄ 富士山/河口湖｜富士回遊',
    meta: '交通', area: '交通', datasetKey: 'title', datasetValue: '新宿 ⇄ 河口湖站｜富士回遊',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/transportation/list_page/japan-rail/jp-shinjuku-rail-to-jp-kawaguchiko-rail?cid=22312', className: 'btn primary', event: 'fujitransport_excursion_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/japan-rail/kawaguchiko-station/28-tokyo/?aid=93798', className: 'btn', event: 'fujitransport_excursion_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: '時刻表', href: 'https://www.fujikyu-railway.jp/fujikaiyuu/', className: 'btn', event: 'fujitransport_excursion_timetable', platform: 'Timetable', section: 'transport_card' },
    ],
  },
  {
    title: '機場/東京 ⇄ 富士山/河口湖｜高速巴士',
    meta: '交通', area: '交通', datasetKey: 'title', datasetValue: '新宿 ⇄ 河口湖站｜高速巴士',
    actions: [
     { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/159339-tokyo-mtfuji-highway-bus/?aid=93798', className: 'btn primary', event: 'fujitransport_express_bus_klook', platform: 'KLOOK', section: 'transport_card' },
     { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/68978254/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujitransport_express_bus_trip', platform: 'Trip', section: 'transport_card' },
     { label: '官網', href: 'https://highway-buses.jp/chi/', className: 'btn', event: 'fujitransport_express_bus_official', platform: 'Timetable', section: 'transport_card' },
     { label: '時刻表', href: 'https://japantravel.navitime.com/zh-tw/area/jp/highwaybus/list/tokyo-to-yamanashi/', className: 'btn', event: 'fujitransport_express_bus_timetable', platform: 'Timetable', section: 'transport_card' },
    ],
  },
  {
    title: '機場/東京市區 ⇄ 富士山/河口湖｜包車',
    meta: '交通', area: '交通', datasetKey: 'title', datasetValue: '機場 ⇄ 富士山/河口湖｜包車',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/129967-narita-airport-tokyo-private-transfer-japan?cid=22312', className: 'btn primary', event: 'fujitransport_baoche_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/120898-car-rental-with-driver-tokyo-mtfuji-chinesespeaking/?aid=93798', className: 'btn', event: 'fujitransport_baoche_klook', platform: 'KLOOK', section: 'transport_card' }, 
    ],
  },
  {
    title: '機場/東京市區 ⇄ 富士山/河口湖｜自駕',
    meta: '交通', area: '交通', datasetKey: 'title', datasetValue: '機場/東京市區 ⇄ 富士山/河口湖｜自駕',
    actions: [
      { label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2561&utm_source=2561&utm_medium=affiliate', className: 'btn primary recommend', event: 'fujitransport_self_tocoo', platform: 'TOCOO', section: 'transport_card', promoCode: 'BADN3O' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/car-rentals?cid=22312', className: 'btn', event: 'fujitransport_self_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-HK/car-rentals/city/28-tokyo-car-rentals/?aid=93798', className: 'btn', event: 'fujitransport_self_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/carhire/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujitransport_self_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
]

export default function FujiTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujitransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="富士河口湖自由行工具"
          h1="富士河口湖通訊&交通攻略｜eSIM、巴士、機場接送一次整理"
          intro="把富士河口湖自由行常用的通訊與交通工具集中在這一頁：讓你快速找到最適合的方案與購買連結。"
          eventPrefix="fujitransport"
          showVisual={false}
          ctaLinks={[
            {
              label: '富士河口湖短影片攻略',
              href: 'https://www.jiejourneys.com/fuji/video',
              dataEvent: 'fujitransport_allvideos',
              platform: 'video',
            },
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/fuji/hotel',
              dataEvent: 'fujitransport_allhotels',
              platform: 'hotel',
            },
            {
              label: '富士河口湖票券總整理',
              href: 'https://www.jiejourneys.com/fuji/ticket',
              dataEvent: 'fujitransport_alltickets',
              platform: 'ticket',
            },
          ]}
        />

        <h2 className="seo-h2" id="transportListTitle">
          富士河口湖通訊&交通整理（eSIM、巴士、機場接送）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="fuji_transport_tab" />

        <SeoCtaSection text="" href="/fuji/map" linkText="富士河口湖熱門景點地圖" newTab dataEvent="fujitransport_SEO_spotmap" />

        <SeoContentSection title="富士河口湖通訊 & 交通怎麼選？">
          <h3 className="seo-h3">通訊方案：eSIM 最方便，多人就用 WiFi</h3>
          <p>
            eSIM 免換卡、出發前掃 QR code 設定好直接用，一個人旅行的首選。
            SIM 卡分郵寄到府和機場領取，適合不支援 eSIM 的舊機型。
            兩人以上同行的話，WiFi 分享器共用可以省不少通訊費。
          </p>

          <h3 className="seo-h3">東京 ↔ 富士河口湖：富士回遊 vs 高速巴士</h3>
          <p>
            富士回遊是從新宿直達河口湖的特急列車，沿途景色漂亮、車廂舒適，約 2 小時，適合喜歡鐵道體驗的旅客。
            高速巴士從新宿或機場出發，價格較便宜，可提前在 KKDAY / KLOOK 購票，但遇塞車時間會拉長。
            兩者都直達河口湖站，選哪個看你的出發地點和預算。
          </p>

          <h3 className="seo-h3">包車 vs 自駕：彈性最大的選擇</h3>
          <p>
            包車（含司機）適合不想自己開車但需要點對點接送的旅客，機場直達河口湖不用轉車，多人分攤也不貴。
            自駕自由度最高，可以隨時停車拍照、深入山區，但需要國際駕照，路況和停車費也要提前了解。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖通訊交通常見問題"
          items={[
            { q: '東京怎麼去富士河口湖？', a: '高速巴士從新宿西口出發約 2 小時最省錢；富士回遊特急景色好、較舒適；多人或行李多可包車直達，建議提前預訂。' },
            { q: '富士回遊和高速巴士哪個好？', a: '富士回遊班次固定、準點率高，車廂舒適適合第一次去；高速巴士從機場也能直接搭，班次多但受塞車影響較大。' },
            { q: '富士河口湖適合自駕嗎？', a: '適合，可以深入五合目、精進湖等不易搭車到的地點，靈活度高；需持有效國際駕照，旺季停車場建議提前查好位置。' },
            { q: '富士河口湖 eSIM 哪裡買？', a: '推薦在合作 eSIM 平台、KKDAY 或 KLOOK 購買日本 eSIM，出發前掃 QR code 安裝，完全不需換卡。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
