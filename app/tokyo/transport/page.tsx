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
  { value: '地鐵/鐵路', label: '地鐵/鐵路', dataArea: '地鐵/鐵路' },
  { value: '成田機場交通', label: '成田機場交通', dataArea: '成田機場交通' },
  { value: '羽田機場交通', label: '羽田機場交通', dataArea: '羽田機場交通' },
]

const cards = [
  { title: 'eSIM卡', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'eSIM卡', actions: [{ label: '輸入JieJourneys', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'tokyotransport_esimconnect', platform: 'connect', section: 'comm_card' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'tokyotransport_esimKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109393-japan-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'tokyotransport_esimKLOOK', platform: 'KLOOK', section: 'comm_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37658069?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'tokyotransport_esimTrip', platform: 'Trip', section: 'comm_card' }] },
  { title: 'SIM卡｜郵寄到府', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜郵寄到府', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/126982?cid=22312', className: 'btn primary', event: 'tokyotransport_SimhomeKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/17147-softbank-4g-sim-japan/?aid=93798', className: 'btn', event: 'tokyotransport_SimhomeKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜桃園機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜桃園機場領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19991?cid=22312', className: 'btn primary', event: 'tokyotransport_SimTPEKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/40060-4g-sim-card-japan-docomo/?aid=93798', className: 'btn', event: 'tokyotransport_SimTPEKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'Wifi分享器｜台灣機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'Wifi分享器｜台灣機場領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11157?cid=22312', className: 'btn primary', event: 'tokyotransport_WifiTPEKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16627-4g-wifi-japan/?aid=93798', className: 'btn', event: 'tokyotransport_WifiTPEKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'Wifi分享器｜日本機場領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'Wifi分享器｜日本機場領取', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798', className: 'btn primary', event: 'tokyotransport_WifiJPNKLOOK', platform: 'KLOOK', section: 'comm_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/59496665?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'tokyotransport_WifiJPNTrip', platform: 'Trip', section: 'comm_card' }] },
  { title: '西瓜卡(Suica IC)｜成田/羽田機場領取', meta: '地鐵', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '西瓜卡(Suica IC)', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_SuicaKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '東京地鐵券(Tokyo Subway Ticket)', meta: '地鐵', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '東京地鐵券(Tokyo Subway Ticket)', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/5989-24-48-72-hr-tokyo-subway-ticket-japan?cid=22312', className: 'btn primary', event: 'tokyotransport_Subway123KKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1552-subway-ticket-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_Subway123KLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/24465457/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_Subway123Trip', platform: 'Trip', section: 'transport_card' }] },
  { title: '鐵路周遊券(JR PASS)', meta: '鐵路', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '鐵路周遊券(JR PASS)', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/6681-jr-east-pass-tohoku-area?cid=22312', className: 'btn primary', event: 'tokyotransport_JRPassKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/49927-jr-east-tokyo-tokyowidepass/?aid=93798', className: 'btn', event: 'tokyotransport_JRPassKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/44275093/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_JRPassTrip', platform: 'Trip', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7913-keisei-skyliner-narita-airport-express-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_SkylinerKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1410-skyliner-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_SkylinerKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/47313759/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D6253046', className: 'btn', event: 'tokyotransport_SkylinerTrip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php', className: 'btn', event: 'tokyotransport_SkylinerTime', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_SkylinerMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: "成田機場 ⇄ 東京車站/新宿/澀谷｜N'EX", meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: "成田機場 ⇄ 東京車站/新宿/澀谷｜N'EX", actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/529712?cid=22312', className: 'btn primary', event: 'tokyotransport_NEXKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/173165-narita-express-n-ex-round-trip-train-ticket-narita-airport-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_NEXKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: '客制', href: 'https://www.klook.com/zh-TW/japan-rail/narita-express-nex/?aid=93798', className: 'btn', event: 'tokyotransport_NEXcustomKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://japantravel.navitime.com/zh-tw/area/jp/timetable/00004637/00000161?direction=up&next=00003544&type=%E7%89%B9%E6%80%A5', className: 'btn', event: 'tokyotransport_NEXTime', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_NEXMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 東京市區｜東京利木津巴士', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜東京利木津巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_NRTLimousineKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/2274-narita-airport-limousine-bus-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_NRTLimousineKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87579423/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_NRTLimousineTrip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', className: 'btn', event: 'tokyotransport_NRTLimousineTime', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_NRTLimousineMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 東京市區｜包車', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', className: 'btn primary', event: 'tokyotransport_NRTCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', className: 'btn', event: 'tokyotransport_NRTCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 淺草/押上｜Access特急', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 淺草/押上｜Access特急', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'tokyotransport_NRTAccessSuicaKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/jp/timetable/index.php', className: 'btn', event: 'tokyotransport_NRTAccessTime', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_NRTAccessMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 東京市區｜LCB巴士', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 東京市區｜LCB巴士', actions: [{ label: '購票&時刻表', href: 'https://www.narita-airport.jp/zh-tc/access/bus/lcb/', className: 'btn primary', event: 'tokyotransport_NRTLCBTicket', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing', className: 'btn', event: 'tokyotransport_NRTLCBMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '羽田機場 ⇄ 東銀座/淺草/押上｜京急電鐵', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 品川/新橋/東銀座/淺草/押上｜京急電鐵', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'HNDKKlinetransport_SuicaKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.haneda-tokyo-access.com/tc/', className: 'btn', event: 'HNDKKlinetransport_Timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'HNDKKlinetransport_Map', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '羽田機場 ⇄ 秋葉原/新宿/池袋｜單軌電車', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京車站/新宿/澀谷｜單軌電車', actions: [{ label: 'SUICA', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', className: 'btn primary', event: 'HNDmonorailtransport_SuicaKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: '時刻表', href: 'https://www.tokyo-monorail.co.jp/tc/timetable/0920.html', className: 'btn', event: 'HNDmonorailtransport_Timetable', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'HNDmonorailtransport_Map', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '羽田機場 ⇄ 東京市區｜東京利木津巴士', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜東京利木津巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_HNDLimousineKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/150434-haneda-airport-limousine-bus-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_HNDLimousineKLOOK', platform: 'KLOOK', section: 'transport_card' }, { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87596821/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', className: 'btn', event: 'tokyotransport_HNDLimousineTrip', platform: 'Trip', section: 'transport_card' }, { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', className: 'btn', event: 'tokyotransport_HNDLimousineTime', platform: 'Timetable', section: 'transport_card' }, { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=1d5zUE9pWTdlrDUplV7Q5ARZ6GoIhOQA&usp=sharing', className: 'btn', event: 'tokyotransport_HNDLimousineMap', platform: 'GoogleMap', section: 'transport_card' }] },
  { title: '羽田機場 ⇄ 東京市區｜包車', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', className: 'btn primary', event: 'tokyotransport_HNDCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', className: 'btn', event: 'tokyotransport_HNDCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
]

export default function TokyoTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyotransport" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="東京自由行工具"
          h1="東京通訊 & 交通｜eSIM、西瓜卡、機場接送一次整理"
          intro="把東京自由行常用的通訊與交通工具集中在同一頁：依需求切換標籤，快速找到你要的方案與購買連結。"
          eventPrefix="tokyotransport"
          showVisual={false}
          ctaLinks={[
            { label: '東京短影片攻略', href: 'https://www.jiejourneys.com/tokyo/video', dataEvent: 'tokyotransport_allvideos', platform: 'video' },
            { label: '東京住宿推薦', href: 'https://www.jiejourneys.com/tokyo/hotel', dataEvent: 'tokyotransport_allhotels', platform: 'hotel' },
            { label: '東京票券總整理', href: 'https://www.jiejourneys.com/tokyo/ticket', dataEvent: 'tokyotransport_alltickets', platform: 'ticket' },
          ]}
        />

        <SeoCtaSection text="" href="#transportListTitle" linkText="直接看整理 ↓" />

        <SeoContentSection title="東京通訊 & 交通怎麼選？">
          <h3 className="seo-h3">通訊方案：eSIM vs SIM卡 vs WiFi分享器</h3>
          <p>eSIM免換卡、出發前設定好即可使用，是一個人旅行的最佳選擇；SIM卡分郵寄到府與機場領取兩種，適合不支援eSIM的舊手機；WiFi分享器多人共用最划算，但需隨時攜帶。</p>

          <h3 className="seo-h3">市區交通：西瓜卡 vs 地鐵券 vs JR Pass</h3>
          <p>西瓜卡（Suica）是最萬用的選擇，地鐵、JR、公車、超商都能刷；東京地鐵券（24/48/72小時）適合短期密集搭乘地鐵；JR Pass 適合行程涵蓋關東多地或需搭新幹線的旅客。</p>

          <h3 className="seo-h3">成田機場進市區</h3>
          <p>Skyliner 最快；N&apos;EX 可直達新宿、澀谷、東京車站；利木津巴士直達各大飯店；LCB 最便宜但時間較長。選哪個取決於你的住宿地點與時間安排。</p>

          <h3 className="seo-h3">羽田機場進市區</h3>
          <p>京急電鐵直達品川、淺草方向；單軌電車到濱松町再轉JR；利木津巴士直達飯店，適合行李多的旅客。羽田整體比成田近，交通費用也較低。</p>
        </SeoContentSection>

        <SeoCtaSection text="" href="/tokyo/map" linkText="東京熱門景點地圖" newTab dataEvent="tokyotransport_SEO_spotmap" />

        <h2 className="seo-h2" id="transportListTitle">
          東京通訊與交通整理（依主題分類）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_transport_tab" />

        <SeoFaqSection
          title="東京通訊交通常見問題"
          items={[
            { q: '東京自由行要買西瓜卡還是地鐵券？', a: '西瓜卡最萬用，超商、JR、地鐵都能刷，建議一定要有，其實跟PASMO和ICOCA卡都差不多；地鐵券適合在市區遊玩至少2天以上的人。' },
            { q: '成田機場怎麼到東京市區最快？', a: 'Skyliner 到上野約40分鐘，是最快選項；NEX 可直達新宿/澀谷/東京站，適合住宿在這幾區的旅客。' },
            { q: '羽田機場進市區哪種最划算？', a: '京急電鐵或單軌電車搭西瓜卡就能進市區，費用最低；如果行李多或深夜抵達，利木津巴士直達飯店更省力。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
