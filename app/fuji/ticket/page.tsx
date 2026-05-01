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
  // ── 河口湖纜車 / 河口湖遊覽船系 ────────────────────────────
  {
    title: '大石公園+忍野八海+Lawson+纜車+遊覽船+抹茶體驗',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+忍野八海+Lawson+纜車+遊覽船+抹茶體驗',
    tags: ['大石公園', '忍野八海', 'Lawson', '河口湖纜車', '河口湖遊覽船', '抹茶體驗'],
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
    tags: ['大石公園', '忍野八海', 'Lawson', '河口湖纜車', '河口湖遊覽船', '抹茶體驗'],
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
    tags: ['淺間公園', '忍野八海', 'Lawson', '河口湖纜車'],
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
    tags: ['淺間公園', '日川時計', '大石公園', 'Lawson', '河口湖纜車', '河口湖遊覽船', '季節限定'],
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
    tags: ['日川時計', '大石公園', 'Lawson', '河口湖纜車', '河口湖遊覽船'],
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
  {
    title: '五合目+淺間公園+大石公園/楓葉/櫻花+山中湖+山中湖遊覽船+紅富士之湯',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '五合目+淺間公園+大石公園/楓葉/櫻花+山中湖+山中湖遊覽船+紅富士之湯',
    tags: ['淺間公園', '大石公園', '河口湖遊覽船', '山中湖', '五合目', '溫泉', '季節限定'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/184620?cid=22312', className: 'btn primary', event: 'fujticket_1day21_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/86922-kawaguchiko-yamanakako-hot-spring-join-one-day-bus-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day21_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  // ── 西湖系 ───────────────────────────────────────────────
  {
    title: '大石公園+西湖療癒之雷根場+忍野八海+淺間公園',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+西湖療癒之雷根場+忍野八海+淺間公園',
    tags: ['淺間公園', '大石公園', '忍野八海', '西湖'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/270872-mt-fuji-day-trip-sengen-park-oshino-hakkai-kawaguchi?cid=22312', className: 'btn primary', event: 'fujticket_1day16_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/140760-mt-fuji-lake-kawaguchiko-sengen-shrine-ancient-village-tour/?aid=93798', className: 'btn', event: 'fujticket_1day16_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '淺間公園+大石公園+西湖療癒之里根場+紅葉迴廊',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '淺間公園+大石公園+西湖療癒之里根場+紅葉迴廊',
    tags: ['淺間公園', '大石公園', '季節限定', '西湖'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/35701-mt-fuji-1-day-bus-tour-japan?cid=22312', className: 'btn primary', event: 'fujticket_1day17_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16197-mt-fuji-lake-kawaguchi-day-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day17_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '西湖療癒雷根場+大石公園/楓葉/櫻花+淺間公園+忍野八海',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '西湖療癒雷根場+大石公園/楓葉/櫻花+淺間公園+忍野八海',
    tags: ['淺間公園', '大石公園', '忍野八海', '季節限定', '西湖'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/260130?cid=22312', className: 'btn primary', event: 'fujticket_1day26_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/103484-mount-fuji-kawakuchiko-arakurayama-sengen-park-join-bus-tour-flower-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day26_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  // ── 山中湖 / KABA 水陸巴士系 ─────────────────────────────
  {
    title: '山中湖+忍野八海+大石公園/楓葉/櫻花+Lawson+日川時計/西湖療癒之里根場',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '山中湖+忍野八海+大石公園/楓葉/櫻花+Lawson+日川時計/西湖療癒之里根場',
    tags: ['日川時計', '大石公園', '忍野八海', 'Lawson', '山中湖', '季節限定', '西湖'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/526791?cid=22312', className: 'btn primary', event: 'fujticket_1day22_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/116133-mt-fuji-kids-friendly-tour-makaino-farm-kawaguchiko-oishi-park/?aid=93798', className: 'btn', event: 'fujticket_1day22_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '平野之濱+山中湖+KABA水陸巴士+忍野八海+大石公園',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '平野之濱+山中湖+KABA水陸巴士+忍野八海+大石公園',
    tags: ['大石公園', '忍野八海', '山中湖', 'KABA水陸巴士'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/488771?cid=22312', className: 'btn primary', event: 'fujticket_1day19_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/162819-mount-fuji-fun-tour-kaba-bus-oshino-lakekawaguchiko-lake-yamanaka/?aid=93798', className: 'btn', event: 'fujticket_1day19_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '日川時計+山中湖+KABA水陸巴士+忍野八海+大石公園+Lawson',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '日川時計+山中湖+KABA水陸巴士+忍野八海+大石公園+Lawson',
    tags: ['日川時計', '大石公園', '忍野八海', 'Lawson', '山中湖', 'KABA水陸巴士'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/548079?cid=22312', className: 'btn primary', event: 'fujticket_1day20_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/116133-mt-fuji-kids-friendly-tour-makaino-farm-kawaguchiko-oishi-park/?aid=93798', className: 'btn', event: 'fujticket_1day20_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/91408882/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16208649', className: 'btn', event: 'fujticket_1day20_trip', platform: 'Trip', section: 'ticket_card' },
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
  // ── 箱根系 ───────────────────────────────────────────────
  {
    title: '箱根神社+箱根纜車+大涌谷+江之島',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '箱根神社+箱根纜車+大涌谷+江之島',
    tags: ['箱根神社', '箱根纜車', '大涌谷', '江之島'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/529501?cid=22312', className: 'btn primary', event: 'fujticket_1day18_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/175730-mount-fuji-owakudani-hakone-kamakura-and-enoshima-from-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day18_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '蘆之湖+箱根纜車+箱根海賊船+大涌谷+江之島',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '蘆之湖+箱根纜車+箱根海賊船+大涌谷+江之島',
    tags: ['箱根纜車', '箱根海賊船', '大涌谷', '蘆之湖', '江之島'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/527466?cid=22312', className: 'btn primary', event: 'fujticket_1day14_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/169597-mount-fuji-hakone-kamakura-fantasy-day-tour-from-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day14_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/95832153/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16208649', className: 'btn', event: 'fujticket_1day14_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '山中湖+忍野八海+箱根神社+箱根海賊船+箱根纜車+大涌谷',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '山中湖+忍野八海+箱根神社+箱根海賊船+箱根纜車+大涌谷',
    tags: ['忍野八海', '山中湖', '箱根神社', '箱根纜車', '箱根海賊船', '大涌谷'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/142196-mt-fuji-hakone-day-trip?cid=22312', className: 'btn primary', event: 'fujticket_1day13_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/87293-hakone-owakudani-lake-ashi-hakone-shrine-bus-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day13_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/70956799/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16208649', className: 'btn', event: 'fujticket_1day13_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '箱根神社+箱根海賊船+箱根纜車+大涌谷+山中湖/忍野八海/江之島',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '箱根神社+箱根海賊船+箱根纜車+大涌谷+山中湖/忍野八海/江之島',
    tags: ['忍野八海', '山中湖', '箱根神社', '箱根纜車', '箱根海賊船', '大涌谷', '江之島'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/155290-fuji-hakone-tour-hakone-pirate-boat-departing-from-shinjuku-tokyo?cid=22312', className: 'btn primary', event: 'fujticket_1day15_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/177696-mt-fuji-hakone-ropeway-lake-ashi-owakudani-day-tour/?aid=93798', className: 'btn', event: 'fujticket_1day15_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '箱根神社+箱根纜車+箱根海盜船+大涌谷+山中湖+忍野八海',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '箱根神社+箱根纜車+箱根海盜船+大涌谷+山中湖+忍野八海',
    tags: ['忍野八海', '山中湖', '箱根神社', '箱根纜車', '箱根海賊船', '大涌谷'],
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/124332-hakone-shrine-lake-ashi-owakudani-yamanakako-day-tour-from-tokyo/?aid=93798', className: 'btn primary', event: 'fujticket_1day28_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/73158682/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16208649', className: 'btn', event: 'fujticket_1day28_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '箱根神社+箱根海盜船+大涌谷+箱根纜車+日川時計+Lawson',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '箱根神社+箱根海盜船+大涌谷+箱根纜車+日川時計+Lawson',
    tags: ['日川時計', 'Lawson', '箱根神社', '箱根纜車', '箱根海賊船', '大涌谷'],
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/110635-mount-fuji-tenku-no-torii-oshino-hakkai-day-tour-from-tokyo/?aid=93798', className: 'btn primary', event: 'fujticket_1day29_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/94445214/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16208649', className: 'btn', event: 'fujticket_1day29_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  {
    title: '箱根神社/五合目/忍野八海+蘆之湖+大涌谷+御殿場Outlet',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '箱根神社/五合目/忍野八海+蘆之湖+大涌谷+御殿場Outlet',
    tags: ['忍野八海', '五合目', '御殿場Outlet', '箱根神社', '大涌谷', '蘆之湖'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/151021-day-trip-hakone-shrine-owakudani-lake-kawaguchi-fujiyoshida-honcho-tokyo?cid=22312', className: 'btn primary', event: 'fujticket_1day23_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18927-mt-fuji-kawaguchi-lake-cherry-blossom-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day23_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '忍野八海+箱根纜車+大涌谷+箱根遊船/御殿場Outlet+箱根神社+小田原城',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '忍野八海+箱根纜車+大涌谷+箱根遊船/御殿場Outlet+箱根神社+小田原城',
    tags: ['忍野八海', '御殿場Outlet', '箱根神社', '箱根纜車', '箱根海賊船', '大涌谷'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/141104?cid=22312', className: 'btn primary', event: 'fujticket_1day25_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/38220-ontabi-hakone-da-tour/?aid=93798', className: 'btn', event: 'fujticket_1day25_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '五合目+御殿場outlet+箱根纜車+箱根海盜船',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '五合目+御殿場outlet+箱根纜車+箱根海盜船',
    tags: ['五合目', '御殿場Outlet', '箱根纜車', '箱根海賊船'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/268878?cid=22312', className: 'btn primary', event: 'fujticket_1day27_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/20537-fuji-owakudani-ropeway-hakone-ship-gotemba-outlet-trip-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day27_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  // ── 其他特殊 ─────────────────────────────────────────────
  {
    title: '大石公園+富士急樂園+川越小江戶',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '大石公園+富士急樂園+川越小江戶',
    tags: ['大石公園', '川越', '富士急樂園'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/139363-mount-fuji-day-tour-from-shinjuku-oishi-park-oshino-hakkai-kawagoe-koedo-japan?cid=22312', className: 'btn primary', event: 'fujticket_1day24_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/83930-kawagoe-oshino-hakkai-bus-tour-tokyo/?aid=93798', className: 'btn', event: 'fujticket_1day24_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  {
    title: '富士野生動物園+忍野八海+大石公園',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '富士野生動物園+忍野八海+大石公園',
    tags: ['大石公園', '忍野八海', '富士野生動物園'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/528834?cid=22312', className: 'btn primary', event: 'fujticket_1day30_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/191599-fuji-safari-park-oshino-hakkai-oishi-park-day-tour/?aid=93798', className: 'btn', event: 'fujticket_1day30_klook', platform: 'KLOOK', section: 'ticket_card' },
    ],
  },
  // ── 客制化 ───────────────────────────────────────────────
  {
    title: '客制化行程｜包車',
    meta: '一日遊',
    area: '一日遊',
    datasetKey: 'title',
    datasetValue: '客制化行程｜包車',
    tags: ['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '河口湖纜車', '河口湖遊覽船', '山中湖', '五合目', '御殿場Outlet', '抹茶體驗', '溫泉', '季節限定', '西湖', 'KABA水陸巴士', '箱根神社', '箱根纜車', '箱根海賊船', '川越', '大涌谷', '蘆之湖', '江之島', '富士急樂園', '富士野生動物園'],
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131172-japan-private-car-charter-tokyo-fuji-hakone-kamakura-karuizawa-izu-kawagoe-nagano-nikko?cid=22312', className: 'btn primary', event: 'fujticket_1dayall_kkday', platform: 'KKDAY', section: 'ticket_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/120898-car-rental-with-driver-tokyo-mtfuji-chinesespeaking/?aid=93798', className: 'btn', event: 'fujticket_1dayall_klook', platform: 'KLOOK', section: 'ticket_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/105010953/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16062937', className: 'btn', event: 'fujticket_1dayall_trip', platform: 'Trip', section: 'ticket_card' },
    ],
  },
  // ── 二日遊 ───────────────────────────────────────────────
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
  // ── 景點 ─────────────────────────────────────────────────
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
          tagOrder={['淺間公園', '日川時計', '大石公園', '忍野八海', 'Lawson', '河口湖纜車', '河口湖遊覽船', '山中湖', '五合目', '御殿場Outlet', '抹茶體驗', '溫泉', '季節限定', '西湖', 'KABA水陸巴士', '箱根神社', '箱根纜車', '箱根海賊船', '川越', '大涌谷', '蘆之湖', '江之島', '富士急樂園', '富士野生動物園']}
        />

        <SeoContentSection title="富士河口湖票券快速了解">
          <h3 className="seo-h3">👉 第一次去，一日遊怎麼選？</h3>
          <p>
            先確定主要目的地：只玩<strong>河口湖周邊</strong>（忍野八海、大石公園、淺間公園）就選經典款；
            想搭<strong>河口湖纜車或遊覽船</strong>可加選對應標籤；
            想直接上山就找<strong>五合目系</strong>行程。
            用上方篩選列點選你想去的景點，馬上縮小選項。
          </p>

          <h3 className="seo-h3">👉 富士 vs 箱根，差在哪？</h3>
          <p>
            富士河口湖側重自然湖景與富士山視野，忍野八海、大石公園、西湖療癒之里都是拍照熱點。
            箱根側重溫泉鄉氛圍，蘆之湖上搭箱根海賊船、走箱根神社鳥居、搭纜車俯瞰大涌谷，體驗完全不同。
            部分一日遊行程會將兩者串起來，適合想一次跑兩區的人。
          </p>

          <h3 className="seo-h3">👉 西湖、山中湖值得特別去嗎？</h3>
          <p>
            西湖療癒之里根場保留傳統茅草屋，遠眺富士山角度絕佳，秋楓季特別推薦。
            山中湖面積最大，可搭 KABA 水陸巴士在湖上賞富士山，適合想要不一樣體驗的旅客。
            這兩個景點通常出現在規模較大的一日遊行程裡，單獨自由行較費時。
          </p>

          <h3 className="seo-h3">👉 季節限定行程要注意什麼？</h3>
          <p>
            大石公園春天薰衣草、秋天楓葉；淺間公園春天賞櫻景色最知名。
            西湖療癒之里秋楓加茅草屋同框，視覺效果最強。
            有季節需求就勾選「季節限定」標籤，過季出發的行程部分景色會有落差。
          </p>

          <h3 className="seo-h3">👉 御殿場 Outlet 值得排嗎？</h3>
          <p>
            Outlet 離河口湖約 40 分鐘車程，部分一日遊會順路帶去。
            如果有購物需求可以選含 Outlet 的行程，省去另外安排交通的麻煩；
            純玩景點的人跳過 Outlet，時間可以多留給忍野八海或箱根。
          </p>

          <h3 className="seo-h3">👉 二日遊適合誰？</h3>
          <p>
            想同時涵蓋富士五湖、箱根、甚至伊豆半島的人最適合二日遊。
            第一天排河口湖周邊（忍野八海、大石公園、纜車遊覽船），
            第二天接箱根大涌谷＋蘆之湖＋修善寺，景色完全不重複，行程也不趕。
          </p>
        </SeoContentSection>

        <SeoFaqSection
          title="富士河口湖票券常見問題"
          items={[
            { q: '一日遊和自由行哪個比較划算？', a: '一日遊跟團最省事，交通、景點順序都幫你安排好，CP值高。自由行建議至少安排兩天，一天玩不完河口湖加箱根；若想跑多個區域，兩日遊跟團反而效率更高。' },
            { q: '富士山周邊景點搭什麼交通最方便？', a: '從東京出發，大多數一日遊包含來回接送，不需要自己訂交通。自由行可搭高速巴士到河口湖站，再租腳踏車或搭景區循環巴士。箱根路線建議直接包含交通的行程，省去換乘麻煩。' },
            { q: '富士山五合目一定要去嗎？', a: '天氣好強烈建議去，可以看到雲海與富士山頂，視野震撼。夏季登山旺季（7–8月）入場有配額，建議提早透過套裝行程確保名額。其他季節相對寬鬆，但天氣不穩定需留意。' },
            { q: '箱根海賊船和蘆之湖遊覽船是同一個嗎？', a: '是的，箱根海賊船就是在蘆之湖上行駛的觀光遊覽船，船身設計成海賊船造型。搭船可以一邊賞蘆之湖一邊看遠處富士山，通常和箱根神社鳥居搭配同一段行程。' },
           ]}
        />
      </main>
      <Footer />
    </>
  )
}
