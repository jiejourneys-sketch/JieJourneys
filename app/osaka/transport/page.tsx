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
  { value: '關西機場交通', label: '關西機場交通', dataArea: '關西機場交通' },
  { value: '大阪市區交通', label: '大阪市區交通', dataArea: '大阪市區交通' },
]

const cards: CityCard[] = [
  // ── 通訊 ─────────────────────────────────────────────────
  {
    title: 'eSIM卡',
    meta: '通訊', area: '通訊', datasetKey: 'title', datasetValue: 'eSIM卡',
    actions: [
      { label: '合作eSIM', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'osakatransport_esim_connect', platform: 'connect', section: 'comm_card', promoCode: 'jiejourneys' },
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
    title: '關西機場 ⇄ 新今宮/難波｜南海電鐵Rapi:t',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 新今宮/難波｜南海電鐵Rapi:t',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19691-nankai-rapit-airport-express-kix-to-osaka?cid=22312', className: 'btn primary', event: 'osakatransport_rapit_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/599-kansai-airport-namba-train-ticket-osaka/?aid=93798', className: 'btn', event: 'osakatransport_rapit_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/57078589/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'osakatransport_rapit_trip', platform: 'Trip', section: 'transport_card' },
      { label: '時刻表', href: 'https://www.nankai.co.jp/tc_railway/access-timetable', className: 'btn', event: 'osakatransport_rapit_timetable', platform: 'Timetable', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 大阪/新大阪/京都/天王寺/奈良/神戶｜關西機場特快 HARUKA',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 大阪/新大阪/京都/天王寺/奈良/神戶｜關西機場特快 HARUKA',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18940-kansai-airport-haruka-ticket-japan?cid=22312', className: 'btn primary', event: 'osakatransport_haruka_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18400-jr-haruka-airport-express-train-tickets-osaka/?aid=93798', className: 'btn', event: 'osakatransport_haruka_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87364606/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'osakatransport_haruka_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 難波/大阪/環球影城/京都/奈良/神戶/和歌山｜利木津巴士',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 難波/大阪/環球影城/京都/奈良/神戶/和歌山｜利木津巴士',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4835-limousine-bus-ticket-kansai-airport-kix-kyoto-osaka-city?cid=22312', className: 'btn primary', event: 'osakatransport_limousine_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18203-kansai-airport-one-way-transfer-osaka/?aid=93798', className: 'btn', event: 'osakatransport_limousine_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/93684157?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'osakatransport_limousine_trip', platform: 'Trip', section: 'transport_card' },
      { label: '時刻表', href: 'https://www.kate.co.jp/tcn/timetable/index', className: 'btn', event: 'osakatransport_limousine_timetable', platform: 'Timetable', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 大阪市區/京都/奈良/神戶｜包車',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 大阪市區/京都/奈良/神戶｜包車',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/129909-japan-kansai-international-airport-private-transfer-to-osaka-kyoto-nara-kobe-nagoya?cid=22312', className: 'btn primary', event: 'osakatransport_charter_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/15716-osaka-surrounding-areas-private-charter/?aid=93798', className: 'btn', event: 'osakatransport_charter_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/105009650/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'osakatransport_charter_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 大阪市區/京都/奈良/神戶｜自駕',
    meta: '關西機場交通', area: '關西機場交通', datasetKey: 'title', datasetValue: '關西機場 ⇄ 大阪市區/京都/奈良/神戶｜自駕',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/car-rentals/kix?cid=22312', className: 'btn primary', event: 'osakatransport_carrental_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/car-rentals/city/29-osaka-car-rentals/?aid=93798', className: 'btn', event: 'osakatransport_carrental_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/carhire/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'osakatransport_carrental_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
  // ── 大阪市區交通 ────────────────────────────────────────────
  {
    title: '大阪地鐵一日券/二日券',
    meta: '大阪市區交通', area: '大阪市區交通', datasetKey: 'title', datasetValue: '大阪地鐵一日券/二日券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/115045-osaka-metro-and-osaka-city-bus-day-pass-unlimited-rides-japan?cid=22312', className: 'btn primary', event: 'osakatransport_metro_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/11515-osaka-metro-1-2-day-pass-osaka/?aid=93798', className: 'btn', event: 'osakatransport_metro_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/50558277/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16703108', className: 'btn', event: 'osakatransport_metro_trip', platform: 'Trip', section: 'transport_card' },
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

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪熱門景點地圖" newTab dataEvent="osakatransport_SEO_spotmap" />
        <SeoCtaSection text="" href="/osaka/pass-map" linkText="大阪周遊券地圖" newTab dataEvent="osakatransport_SEO_passmap" />

        <SeoContentSection title="大阪通訊與交通怎麼安排？">
          <h3 className="seo-h3">👉 先處理網路：eSIM、SIM 卡、WiFi 分享器怎麼選</h3>
          <p>
            大阪自由行最先要確認的是手機能不能上網。現在最方便的是 <strong>eSIM</strong>，出發前購買後用 QR code 安裝，到日本開啟方案就能使用，不需要換實體卡，也不用擔心原本的 SIM 卡遺失。
            <br />
            如果手機不支援 eSIM，可以改買<strong>實體 SIM 卡</strong>。郵寄到府適合想在台灣先準備好的人，桃園機場領取則適合出發前才補買。多人同行、長輩或小孩需要共用網路時，<strong>WiFi 分享器</strong>也可以考慮，但要記得充電、歸還和隨身攜帶。
          </p>

          <h3 className="seo-h3">👉 關西機場到大阪市區：Rapi:t、HARUKA、巴士差在哪</h3>
          <p>
            從關西機場進大阪，先看你住在哪一區。住<strong>難波、新今宮</strong>一帶，南海電鐵 <strong>Rapi:t</strong> 很直覺，路線簡單、下車後接大阪地鐵也方便。
            <br />
            如果住宿在<strong>天王寺、新大阪、京都、神戶</strong>方向，<strong>HARUKA</strong>會更適合，尤其是要直接往 JR 大站移動時，可以少轉幾次車。住在飯店門口有利木津巴士站的人，則可以比較<strong>利木津巴士</strong>，不用扛行李上下樓梯，但要把班次和塞車時間算進去。
          </p>

          <h3 className="seo-h3">👉 行李多、同行人多：包車與自駕適合什麼情況</h3>
          <p>
            如果是親子、長輩同行，或第一天、最後一天行李很多，<strong>關西機場包車</strong>會比鐵路轉乘舒服很多。包車的優點是直達飯店，不用研究月台、電梯和換線，缺點是價格通常比大眾交通高。
            <br />
            <strong>自駕租車</strong>比較適合大阪市區以外的行程，例如想往京都郊區、奈良、神戶、和歌山或多點移動。單純在大阪市區玩不太建議自駕，停車費高、道路複雜，地鐵通常更省事。
          </p>

          <h3 className="seo-h3">👉 大阪市區交通：地鐵券適合密集跑點的一天</h3>
          <p>
            大阪市區最常用的是大阪 Metro。若一天只搭一兩趟，直接刷交通 IC 卡就很方便；但如果同一天會在梅田、心齋橋、難波、天王寺、大阪城、通天閣之間多次移動，<strong>大阪地鐵一日券/二日券</strong>就值得比較。
            <br />
            規劃方式很簡單：先把當天景點標在地圖上，看會不會連續搭地鐵移動。若只是集中逛心齋橋、道頓堀、黑門市場，很多地方步行可到，不一定要另外買地鐵券。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="大阪通訊交通常見問題"
          items={[
            { q: '關西機場到難波要搭 Rapi:t 還是 HARUKA？', a: '住難波或新今宮通常優先看南海電鐵 Rapi:t，路線直接；住天王寺、新大阪、京都或神戶方向，再優先看 HARUKA。不要只看哪個比較有名，要先看飯店最近的車站。' },
            { q: '大阪地鐵一日券值得買嗎？', a: '如果同一天會多次搭大阪 Metro，在梅田、心齋橋、難波、天王寺、大阪城等區域移動，就可以比較地鐵券。若行程集中在道頓堀、心齋橋周邊步行，通常不一定需要。' },
            { q: '大阪自由行要買 eSIM 還是 WiFi 分享器？', a: '一個人或兩個人旅行通常 eSIM 最方便，不用換卡也不用歸還機器。多人同行、想共用網路或有手機不支援 eSIM 的情況，才比較適合考慮 WiFi 分享器或實體 SIM 卡。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
