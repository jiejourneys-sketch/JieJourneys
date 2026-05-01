import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '關西機場交通', label: '關西機場交通', dataArea: '關西機場交通' },
  { value: '大阪市區交通', label: '大阪市區交通', dataArea: '大阪市區交通' },
]

const cards: CityCard[] = [
  // ── 通訊 ─────────────────────────────────────────────────
  {
    title: 'eSIM卡',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'eSIM卡',
    actions: [
      { label: '輸入JieJourneys', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'osakatransport_esimconnect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'osakatransport_esim_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109393-japan-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'osakatransport_esim_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37658069?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'osakatransport_esim_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡｜郵寄到府',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'SIM卡｜郵寄到府',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/126982?cid=22312', className: 'btn primary', event: 'osakatransport_simhome_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/17147-softbank-4g-sim-japan/?aid=93798', className: 'btn', event: 'osakatransport_simhome_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'SIM卡｜桃園機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'SIM卡｜桃園機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19991?cid=22312', className: 'btn primary', event: 'osakatransport_simtpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/40060-4g-sim-card-japan-docomo/?aid=93798', className: 'btn', event: 'osakatransport_simtpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜台灣機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'Wifi分享器｜台灣機場領取',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11157?cid=22312', className: 'btn primary', event: 'osakatransport_wifitpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16627-4g-wifi-japan/?aid=93798', className: 'btn', event: 'osakatransport_wifitpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wifi分享器｜日本機場領取',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'Wifi分享器｜日本機場領取',
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798', className: 'btn primary', event: 'osakatransport_wifijpn_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/59496665?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'osakatransport_wifijpn_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  // ── 關西機場交通 ────────────────────────────────────────────
  {
    title: '關西機場 ⇄ 難波/天王寺｜HARUKA特急',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 難波/天王寺｜HARUKA特急',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/21197-haruka-limited-express-one-way-round-trip-ticket?cid=22312', className: 'btn primary', event: 'osakatransport_haruka_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3019-haruka-airport-express-ticket-osaka/?aid=93798', className: 'btn', event: 'osakatransport_haruka_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/27680861/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'osakatransport_haruka_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 大阪市區｜利木津巴士',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 大阪市區｜利木津巴士',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/21202-osaka-kansai-airport-limousine-bus-ticket?cid=22312', className: 'btn primary', event: 'osakatransport_limousine_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/4091-kansai-airport-limousine-bus/?aid=93798', className: 'btn', event: 'osakatransport_limousine_klook', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 大阪市區｜包車',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 大阪市區｜包車',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/6891-kansai-airport-private-transfer?cid=22312', className: 'btn primary', event: 'osakatransport_car_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', className: 'btn', event: 'osakatransport_car_klook', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
  // ── 大阪市區交通 ────────────────────────────────────────────
  {
    title: 'ICOCA IC卡｜關西機場/大阪領取',
    meta: '大阪市區交通', area: '大阪市區交通', datasetKey: 'title', datasetValue: 'ICOCA IC卡',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/106005-icoca-ic-card-kansai-area?cid=22312', className: 'btn primary', event: 'osakatransport_icoca_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/26878-icoca-ic-card-kansai-airport/?aid=93798', className: 'btn', event: 'osakatransport_icoca_klook', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
  {
    title: '大阪地鐵 1 日/2 日券',
    meta: '大阪市區交通', area: '大阪市區交通', datasetKey: 'title', datasetValue: '大阪地鐵1日2日券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4326-osaka-metro-1-day-pass?cid=22312', className: 'btn primary', event: 'osakatransport_metro_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/5095-osaka-metro-1-day-pass/?aid=93798', className: 'btn', event: 'osakatransport_metro_klook', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
]

export default function OsakaTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakatransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="大阪自由行工具"
          h1="大阪通訊&交通攻略｜eSIM、HARUKA、機場接送一次整理"
          intro="把大阪自由行常用的通訊與交通工具集中在這一頁，快速找到最適合的方案與購買連結。"
          eventPrefix="osakatransport"
          showVisual={false}
          ctaLinks={[
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/osaka/hotel',
              dataEvent: 'osakatransport_allhotels',
              platform: 'hotel',
            },
            {
              label: '大阪票券總整理',
              href: 'https://www.jiejourneys.com/osaka/ticket',
              dataEvent: 'osakatransport_alltickets',
              platform: 'ticket',
            },
          ]}
        />

        <h2 className="seo-h2" id="transportListTitle">
          大阪通訊&交通整理（eSIM、HARUKA、地鐵券）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="osaka_transport_tab" />

        <SeoContentSection title="大阪通訊 & 交通怎麼選？">
          <h3 className="seo-h3">通訊方案：eSIM 最方便，多人就用 WiFi</h3>
          <p>
            eSIM 免換卡、出發前掃 QR code 設定好直接用，一個人旅行的首選。
            SIM 卡分郵寄到府和機場領取，適合不支援 eSIM 的舊機型。
            兩人以上同行的話，WiFi 分享器共用可以省不少通訊費。
          </p>

          <h3 className="seo-h3">關西機場 → 大阪市區：HARUKA vs 利木津巴士</h3>
          <p>
            <strong>HARUKA 特急</strong>是最快進市區的方式，從關西機場到難波約 40 分鐘、到新大阪約 80 分鐘，可在 KKDAY/KLOOK 提前購票。
            <strong>利木津巴士</strong>價格較便宜，直達主要飯店區，但班次有限，遇塞車時間會拉長。
            行李多或多人同行可以考慮包車，省去轉乘麻煩。
          </p>

          <h3 className="seo-h3">大阪市區怎麼移動：ICOCA vs 地鐵券</h3>
          <p>
            <strong>ICOCA 卡</strong>是關西版 IC 卡，可搭大阪地鐵、JR、私鐵，彈性最高，也可在便利商店消費。
            如果一天要搭超過 3 次以上地鐵，<strong>大阪地鐵 1 日券</strong>可能更划算。
            大阪周遊券內含地鐵無限搭，有計劃跑多個景點的旅客可優先評估。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="大阪通訊交通常見問題"
          items={[
            { q: '關西機場到大阪市區怎麼去最快？', a: 'HARUKA 特急最快，到難波約 40 分鐘、到新大阪約 80 分鐘，建議提前購票省去排隊。行李多或多人同行可考慮包車，直達飯店免搬行李。' },
            { q: 'ICOCA 和大阪地鐵券哪個好？', a: 'ICOCA 彈性最高，全關西通用且可便利商店消費；地鐵券適合一天在大阪密集移動的旅客。若已購大阪周遊券，裡面已含地鐵無限搭，不需另購。' },
            { q: '大阪 eSIM 哪裡買？', a: '推薦合作 eSIM 平台、KKDAY 或 KLOOK 購買日本 eSIM，出發前掃 QR code 安裝，完全不需換卡。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}