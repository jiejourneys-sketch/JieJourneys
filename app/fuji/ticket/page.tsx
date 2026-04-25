import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '一日遊', label: '一日遊', dataArea: '一日遊' },
  { value: '二日遊', label: '二日遊', dataArea: '二日遊' },
  { value: '景點', label: '景點', dataArea: '景點' },
]

const cards: CityCard[] = [
  // ── 經典款 ──────────────────────────────────────────────
  {
    title: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson',
    tags: ['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '季節限定'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12319?cid=22312', className: 'btn primary', event: 'fujticket_1day1_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/93901-mtfuji-one-day-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day1_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/60225529/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujticket_1day1_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson+山中湖',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園/櫻花/楓葉+忍野八海+Lawson+山中湖',
    tags: ['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '山中湖', '季節限定'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/266389-fuji-kawaguchiko-oshino-hakkai-sengen?cid=22312', className: 'btn primary', event: 'fujticket_1day2_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/110635-mount-fuji-tenku-no-torii-oshino-hakkai-day-tour-from-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day2_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87035454/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujticket_1day2_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  // ── 纜車 / 遊覽船系 ──────────────────────────────────────
  {
    title: '大石公園+忍野八海+Lawson+纜車+遊覽船+抹茶體驗',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+忍野八海+Lawson+纜車+遊覽船+抹茶體驗',
    tags: ['大石公園', '忍野八海', 'Lawson', '纜車', '遊覽船', '抹茶體驗'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/157904?cid=22312', className: 'btn primary', event: 'fujticket_1day3_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/102597-mt-fuji-panoramic-ropeway-oshino-hakkai-one-day-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day3_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '大石公園+忍野八海+Lawson+纜車/遊覽船+抹茶體驗',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+忍野八海+Lawson+纜車/遊覽船+抹茶體驗',
    tags: ['大石公園', '忍野八海', 'Lawson', '纜車', '遊覽船', '抹茶體驗'],
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/130627-mt-fuji-lake-kawaguchi-instagrammable-tour-with-ropeway-experience/?aid=93798', className: 'btn primary', event: 'fujticket_1day4_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/64969329/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujticket_1day4_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+忍野八海+Lawson+纜車',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+忍野八海+Lawson+纜車',
    tags: ['淺間公園', '忍野八海', 'Lawson', '纜車'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/150665-mount-fuji-tour-lake-kawaguchi-tenjozan-park-ropeway-tokyo?cid=22312', className: 'btn primary', event: 'fujticket_1day5_kkday', platform: 'KKDAY', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+日川時計+大石公園/櫻花/楓葉+Lawson+纜車/遊覽船',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園/櫻花/楓葉+Lawson+纜車/遊覽船',
    tags: ['淺間公園', '日川時計', '大石公園', 'Lawson', '纜車', '遊覽船', '季節限定'],
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/110632-mount-fuji-arakurayama-sengen-park-lake-kawakuchi-tour-from-tokyo/?aid=93798', className: 'btn primary', event: 'fujticket_1day6_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '日川時計+大石公園+Lawson+纜車+遊覽船',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '日川時計+大石公園+Lawson+纜車+遊覽船',
    tags: ['日川時計', '大石公園', 'Lawson', '纜車', '遊覽船'],
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/104305134/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn primary', event: 'fujticket_1day7_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  // ── 五合目系 ─────────────────────────────────────────────
  {
    title: '淺間公園+忍野八海+五合目+御殿場Outlet/溫泉',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+忍野八海+五合目+御殿場Outlet/溫泉',
    tags: ['淺間公園', '忍野八海', '五合目', '御殿場Outlet', '溫泉'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/135929-tokyo-mount-fuji-trip-subaru-line-5th-station-arakurayama-sengen-park-oshino-hakkai-japan?cid=22312', className: 'btn primary', event: 'fujticket_1day8_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/87225-mt-fuji-oshino-hakkai-outlets-hot-spring-day-tour/?aid=93798', className: 'btn', event: 'fujticket_1day8_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+大石公園+忍野八海+五合目',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+大石公園+忍野八海+五合目',
    tags: ['淺間公園', '大石公園', '忍野八海', '五合目'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/140458-mount-fuji-one-day-tour?cid=22312', className: 'btn primary', event: 'fujticket_1day9_kkday', platform: 'KKDAY', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+日川時計+大石公園+忍野八海+五合目+抹茶體驗',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園+忍野八海+五合目+抹茶體驗',
    tags: ['淺間公園', '日川時計', '大石公園', '忍野八海', '五合目', '抹茶體驗'],
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/148620-mt-fuji-5th-station-lake-kawaguchi-matcha-experience-one-day-tour/?aid=93798', className: 'btn primary', event: 'fujticket_1day10_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  // ── 御殿場 Outlet 系 ──────────────────────────────────────
  {
    title: '大石公園+忍野八海+Lawson+御殿場Outlet',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+忍野八海+Lawson+御殿場Outlet',
    tags: ['大石公園', '忍野八海', 'Lawson', '御殿場Outlet'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/10999-tokyo-mount-fuji-lake-kawaguchi-gotemba-tour-japan?cid=22312', className: 'btn primary', event: 'fujticket_1day11_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/83725-mt-fuji-lake-kawaguchi-gotemba-outlets-konohananoyu/?aid=93798', className: 'btn', event: 'fujticket_1day11_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '日川時計+大石公園+山中湖+御殿場Outlet',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '日川時計+大石公園+山中湖+御殿場Outlet',
    tags: ['日川時計', '大石公園', '山中湖', '御殿場Outlet'],
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/92849746/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn primary', event: 'fujticket_1day12_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '客制化行程｜包車',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '客制化行程｜包車',
    tags: ['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '纜車', '遊覽船', '山中湖', '五合目', '御殿場Outlet', '抹茶體驗', '溫泉', '季節限定'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/161744?cid=22312', className: 'btn primary', event: 'fujticket_1dayall_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/120898-car-rental-with-driver-tokyo-mtfuji-chinesespeaking/?aid=93798', className: 'btn', event: 'fujticket_1dayall_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/105010953/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujticket_1dayall_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+纜車+五合目+大涌谷+蘆之湖+修善寺+大室山+江之島+火山湖/箱根',
    meta: '二日遊',
    area: '二日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+纜車+五合目+大涌谷+蘆之湖+修善寺+大室山+江之島+火山湖/箱根',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/146954?cid=22312', className: 'btn primary', event: 'fujticket_2day_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/130631-mount-fuji-hakone-kamakura-izu-hot-springs-photogenic-2-day-tour/?aid=93798', className: 'btn', event: 'fujticket_2day1_klook', platform: 'KLOOK', section: 'ticket_card' },
     ],
  },
  {
    title: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+纜車+遊覽船+山中湖+抹茶體驗',
    meta: '二日遊',
    area: '二日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+纜車+遊覽船+山中湖+抹茶體驗',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/251848?cid=22312', className: 'btn primary', event: 'fujticket_2day2_kkday', platform: 'KKDAY', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+山中湖+大室山+蘆之湖+箱根海賊船',
    meta: '二日遊',
    area: '二日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+日川時計+大石公園/楓葉+忍野八海+Lawson+山中湖+大室山+蘆之湖+箱根海賊船',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/268226?cid=22312', className: 'btn primary', event: 'fujticket_2day3_kkday', platform: 'KKDAY', section: 'ticket_card' },
    ],
  },
  {
    title: '富士山周遊券',
    meta: '景點',
    area: '景點',
    datasetKey: 'title',
    datasetValue: '富士山周遊券',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20106-mt-fuji-pass-lake-kawaguchi-attraction-ticket-japan?cid=22312', className: 'btn primary', event: 'fujticket_pass_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/132532-mt-fuji-pass/?aid=93798', className: 'btn', event: 'fujticket_pass_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '富士急樂園',
    meta: '景點',
    area: '景點',
    datasetKey: 'title',
    datasetValue: '富士急樂園',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/20133-fuji-q-highland-e-ticket?cid=22312', className: 'btn primary', event: 'fujticket_highland_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/95879-fujiq-highland-admission-ticket/?aid=93798', className: 'btn', event: 'fujticket_highland_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujiyoshida/fuji-q-highland-90440/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujticket_highland_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '纜車｜河口湖',
    meta: '景點',
    area: '景點',
    datasetKey: 'title',
    datasetValue: '纜車｜河口湖',
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/89462-mt-fuji-panoramic-ropeway-round-trip-ticket-yamanashi/?aid=93798', className: 'btn primary', event: 'fujticket_cable_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/mt-fuji-panoramic-ropeway-23487867?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujticket_cable_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '遊覽船｜河口湖',
    meta: '景點',
    area: '景點',
    datasetKey: 'title',
    datasetValue: '遊覽船｜河口湖',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/574488?cid=22312', className: 'btn primary', event: 'fujticket_cruise_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/lake-kawaguchiko-sightseeing-boat-appare-29874636?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujticket_cruise_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '音樂森林美術館',
    meta: '景點',
    area: '景點',
    datasetKey: 'title',
    datasetValue: '音樂森林美術館',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138288-yamanashi-kawaguchiko-music-forest-museum-admission-ticket?cid=22312', className: 'btn primary', event: 'fujticket_musicforest_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/85583-kawaguchiko-music-forest-museum-admission-admission-yamanashi/?aid=93798', className: 'btn', event: 'fujticket_musicforest_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/fujikawaguchiko/kawaguchiko-music-forest-museum-23515819/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D15968339', className: 'btn', event: 'fujticket_musicforest_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
]

export default function FujiTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujticket" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="富士河口湖自由行票券"
          h1="富士河口湖票券總整理｜一日遊・二日遊・景點快速整理"
          intro="把常用票券用標籤分類整理，直接點選你需要的品項，比價後快速下單。"
          eventPrefix="fujticket"
          showVisual={false}
          ctaLinks={[
            {
              label: '住宿推薦總整理',
              href: 'https://www.jiejourneys.com/fuji/hotel',
              dataEvent: 'fujticket_allhotels',
              platform: 'hotel',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/fuji/transport',
              dataEvent: 'fujticket_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="ticketListTitle">
          富士河口湖票券推薦（一日遊、二日遊、景點一次看懂）
        </h2>
        <CityTabbedList
          tabs={tabs}
          cards={cards}
          tabEvent="fuji_ticket_tab"
          tagFilterArea="一日遊"
          tagOrder={['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '纜車', '遊覽船', '山中湖', '五合目', '御殿場Outlet', '抹茶體驗', '溫泉', '季節限定']}
        />

        <SeoContentSection title="富士河口湖票券快速了解">
          <h3 className="seo-h3">👉 一日遊怎麼選？</h3>
          <p>
            大方向分兩類：<strong>纜車／遊覽船系</strong>（偏河口湖風景）和<strong>五合目系</strong>（直接上富士山）。
            第一次去推薦先選經典款，包含淺間公園＋忍野八海＋大石公園，CP 值最高。
            可以用上方篩選按鈕勾選你想去的景點，快速找到符合的行程。
          </p>

          <h3 className="seo-h3">👉 季節限定要注意</h3>
          <p>
            大石公園春天薰衣草、秋天楓葉；淺間公園春天賞櫻最有名。
            有特定季節需求的，記得勾選「季節限定」篩選，景色差非常多。
          </p>

          <h3 className="seo-h3">👉 御殿場 Outlet 要不要排？</h3>
          <p>
            離河口湖約 40 分鐘車程，部分一日遊行程會順路帶去。
            喜歡購物可以選含 Outlet 的行程；不想購物就跳過，省下時間多玩一個景點。
          </p>

          <h3 className="seo-h3">👉 二日遊適合誰？</h3>
          <p>
            想同時玩到富士山、箱根、伊豆的人最適合。
            一天排富士河口湖周邊，第二天接箱根大涌谷＋蘆之湖，景色完全不重複。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖票券常見問題"
          items={[
            { q: '一日遊和自由行哪個比較划算？', a: '一日遊直接跟團最省事，CP值最高；自由行建議至少兩天以上，如果兩日遊跟團，反而能跑更多景點。' },
            { q: '富士急樂園怎麼買票比較便宜？', a: '透過 KKDAY / KLOOK 購票通常比現場便宜，可選快速通關方案省排隊時間。' },
            { q: '富士山五合目一定要去嗎？', a: '天氣好強烈推薦，可以看到雲海和富士山全景。旺季（7–8月）建議提前購票，容易搶光。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
