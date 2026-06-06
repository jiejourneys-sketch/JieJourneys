import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoContentSection from '@/components/seo/SeoContentSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import {
  osakaAdditionalHotelCardBySlug,
  osakaAdditionalHotelSlugs,
} from '@/data/osaka/hotel'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '道頓堀/難波', label: '道頓堀/難波', dataArea: '道頓堀/難波' },
  { value: '心齋橋', label: '心齋橋', dataArea: '心齋橋' },
  { value: '梅田/大阪站', label: '梅田/大阪站', dataArea: '梅田/大阪站' },
  { value: '天王寺', label: '天王寺', dataArea: '天王寺' },
  { value: '環球影城', label: '環球影城', dataArea: '環球影城' },
  { value: '新今宮', label: '新今宮', dataArea: '新今宮' },
]

const baseCards: CityCard[] = [
  {
    title: '大阪瑞士南海飯店',
    meta: '道頓堀/難波｜5星級、南海難波站樓上，機場Rapi:t直達最省力',
    area: '道頓堀/難波',
    datasetKey: 'hotel',
    datasetValue: '難波區域住宿',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-976800?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_swissotel_nankai_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=45609', className: 'btn', event: 'osakahotel_swissotel_nankai_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-swissotel-nankai', className: 'btn', event: 'osakahotel_swissotel_nankai_map', platform: 'Map', section: 'hotel_card' },
       ],
  },
  {
    title: '大阪皇家古典飯店',
    meta: '道頓堀/難波｜4星級、難波站旁設計飯店，浴室空間舒適有質感',
    area: '道頓堀/難波',
    datasetKey: 'hotel',
    datasetValue: '難波區域住宿',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-49239788/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_royal_classic_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=11279046', className: 'btn', event: 'osakahotel_royal_classic_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-royal-classic', className: 'btn', event: 'osakahotel_royal_classic_map', platform: 'Map', section: 'hotel_card' },
       ],
  },
  {
    title: '大阪難波格拉斯麗飯店',
    meta: '道頓堀/難波｜4星級、近JR難波與OCAT巴士，機場移動方便',
    area: '道頓堀/難波',
    datasetKey: 'hotel',
    datasetValue: '大阪難波格拉斯麗飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-29903490/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_gracery_namba_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=6180898', className: 'btn', event: 'osakahotel_gracery_namba_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-gracery-namba', className: 'btn', event: 'osakahotel_gracery_namba_map', platform: 'Map', section: 'hotel_card' },
       ],
  },
  {
    title: '大阪難波光芒飯店',
    meta: '道頓堀/難波｜4星級、道頓堀心齋橋步行圈，頂樓大浴場加分',
    area: '道頓堀/難波',
    datasetKey: 'hotel',
    datasetValue: '大阪難波光芒飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-6666605/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_candeo_namba_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1899389', className: 'btn', event: 'osakahotel_candeo_namba_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-candeo-namba', className: 'btn', event: 'osakahotel_candeo_namba_map', platform: 'Map', section: 'hotel_card' },
       ],
  },
  {
    title: '大阪日航飯店',
    meta: '心齋橋｜5星級、心齋橋站直通，機場巴士與親子設備方便',
    area: '心齋橋',
    datasetKey: 'hotel',
    datasetValue: '大阪日航飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-688209/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_nikko_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=45593', className: 'btn', event: 'osakahotel_nikko_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-nikko', className: 'btn', event: 'osakahotel_nikko_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '捷絲旅大阪心齋橋館',
    meta: '心齋橋｜4星級、台灣品牌，四大地鐵站可達交通彈性高',
    area: '心齋橋',
    datasetKey: 'hotel',
    datasetValue: '捷絲旅大阪心齋橋館',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-102347890/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_just_sleep_shinsaibashi_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=35944176', className: 'btn', event: 'osakahotel_just_sleep_shinsaibashi_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-just-sleep-shinsaibashi', className: 'btn', event: 'osakahotel_just_sleep_shinsaibashi_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: 'VESSEL INN大阪心齋橋船舶酒店',
    meta: '心齋橋｜4星級、心齋橋與長堀橋中間，商務小資好選擇',
    area: '心齋橋',
    datasetKey: 'hotel',
    datasetValue: 'VESSEL INN大阪心齋橋船舶酒店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-7420957/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_vessel_inn_shinsaibashi_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1723530', className: 'btn', event: 'osakahotel_vessel_inn_shinsaibashi_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-vessel-inn-shinsaibashi', className: 'btn', event: 'osakahotel_vessel_inn_shinsaibashi_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '相鐵 FRESA INN 大阪心齋橋',
    meta: '心齋橋｜3星級、心齋橋、長堀橋步行圈，乾淨實用且交通方便',
    area: '心齋橋',
    datasetKey: 'hotel',
    datasetValue: '相鐵 FRESA INN 大阪心齋橋',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-21369036/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16707581', className: 'btn primary', event: 'osakahotel_sotetsu_fresa_shinsaibashi_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=5318330', className: 'btn', event: 'osakahotel_sotetsu_fresa_shinsaibashi_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-sotetsu-fresa-shinsaibashi', className: 'btn', event: 'osakahotel_sotetsu_fresa_shinsaibashi_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '大阪麗思卡爾頓酒店',
    meta: '梅田/大阪站｜5星級、梅田奢華飯店，服務與房間質感很穩',
    area: '梅田/大阪站',
    datasetKey: 'hotel',
    datasetValue: '大阪麗思卡爾頓酒店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-1280987/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_ritz_carlton_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=8000', className: 'btn', event: 'osakahotel_ritz_carlton_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-ritz-carlton', className: 'btn', event: 'osakahotel_ritz_carlton_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '阪急大阪龍仕柏飯店',
    meta: '梅田/大阪站｜4星級、大阪站旁商場樓上，親子與購物都方便',
    area: '梅田/大阪站',
    datasetKey: 'hotel',
    datasetValue: '阪急大阪龍仕柏飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-63326122/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_hankyu_respire_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=59662949', className: 'btn', event: 'osakahotel_hankyu_respire_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-hankyu-respire', className: 'btn', event: 'osakahotel_hankyu_respire_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '大阪梅田Intergate飯店',
    meta: '梅田/大阪站｜4星級、西梅田站近，有大浴場與免費點心宵夜',
    area: '梅田/大阪站',
    datasetKey: 'hotel',
    datasetValue: '大阪梅田Intergate飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-63326122/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_intergate_umeda_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=13862639', className: 'btn', event: 'osakahotel_intergate_umeda_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-intergate-umeda', className: 'btn', event: 'osakahotel_intergate_umeda_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '格蘭比亞大阪維斯奇歐飯店',
    meta: '梅田/大阪站｜4星級、JR大阪站北側，鬧中取靜且房間較舒適',
    area: '梅田/大阪站',
    datasetKey: 'hotel',
    datasetValue: '格蘭比亞大阪維斯奇歐飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-17502427/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_vischio_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=2865504', className: 'btn', event: 'osakahotel_vischio_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-vischio', className: 'btn', event: 'osakahotel_vischio_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '大阪萬豪都酒店',
    meta: '天王寺｜5星級、阿倍野HARUKAS高樓層，夜景與交通都強',
    area: '天王寺',
    datasetKey: 'hotel',
    datasetValue: '大阪萬豪都酒店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/detail/?hotelId=1113592&Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_marriott_miyako_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=611445', className: 'btn', event: 'osakahotel_marriott_miyako_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-marriott-miyako', className: 'btn', event: 'osakahotel_marriott_miyako_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '大阪阿倍野Trusty飯店',
    meta: '天王寺｜4星級、天王寺站前，阿倍野商圈吃逛都方便',
    area: '天王寺',
    datasetKey: 'hotel',
    datasetValue: '大阪阿倍野Trusty飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-1715723/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_trusty_abeno_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=400287', className: 'btn', event: 'osakahotel_trusty_abeno_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-trusty-abeno', className: 'btn', event: 'osakahotel_trusty_abeno_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: '大阪天王寺都城市飯店',
    meta: '天王寺｜4星級、JR天王寺站連通，近近鐵百貨生活機能好',
    area: '天王寺',
    datasetKey: 'hotel',
    datasetValue: '大阪天王寺都城市飯店',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-993279/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_miyako_city_tennoji_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9071828', className: 'btn', event: 'osakahotel_miyako_city_tennoji_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-miyako-city-tennoji', className: 'btn', event: 'osakahotel_miyako_city_tennoji_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
  {
    title: 'VIA INN 阿倍野天王寺',
    meta: '天王寺｜3星級、天王寺站近，樓下唐吉軻德採買方便',
    area: '天王寺',
    datasetKey: 'hotel',
    datasetValue: 'Via Inn Abeno Tennoji',
    actions: [
      { label: 'Trip', href: 'https://tw.trip.com/hotels/osaka-hotel-detail-12114407/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417', className: 'btn primary', event: 'osakahotel_via_inn_abeno_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9073534', className: 'btn', event: 'osakahotel_via_inn_abeno_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: '/osaka/map?place=osaka-hotel-via-inn-abeno', className: 'btn', event: 'osakahotel_via_inn_abeno_map', platform: 'Map', section: 'hotel_card' },
    ],
  },
]

const insertedAdditionalHotelSlugs = new Set([
  'mimaru-osaka-shinsaibashi-west',
  'hotel-hankyu-international',
])

const cards: CityCard[] = [
  ...baseCards.flatMap((card) => {
    if (card.title === '相鐵 FRESA INN 大阪心齋橋') {
      return [osakaAdditionalHotelCardBySlug['mimaru-osaka-shinsaibashi-west'], card]
    }

    if (card.title === '阪急大阪龍仕柏飯店') {
      return [osakaAdditionalHotelCardBySlug['hotel-hankyu-international'], card]
    }

    return [card]
  }),
  ...osakaAdditionalHotelSlugs
    .filter((slug) => !insertedAdditionalHotelSlugs.has(slug))
    .map((slug) => osakaAdditionalHotelCardBySlug[slug]),
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

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪住宿地圖" newTab dataEvent="osakahotel_SEO_spotmap" />
        <SeoCtaSection text="" href="/osaka/pass-map" linkText="大阪周遊券地圖" newTab dataEvent="osakahotel_SEO_passmap" />

        <SeoContentSection title="大阪住宿怎麼選？先看行程動線">
          <p>
            大阪住宿不用一開始就糾結哪間飯店最紅，先看你這趟旅程的重心在哪裡。每天晚上想吃道頓堀、逛藥妝、臨時買宵夜，就優先住難波或心齋橋；如果會安排京都、神戶、奈良一日遊，梅田與大阪站會省很多轉車時間；如果想抓預算，又希望機場交通不要太麻煩，天王寺會是很聰明的選擇。
          </p>

          <h3 className="seo-h3">道頓堀/難波｜第一次大阪自由行最直覺</h3>
          <p>
            道頓堀/難波是大阪最適合第一次自由行的住宿區。大阪瑞士南海飯店直接壓在南海難波站上方，從關西機場搭 Rapi:t 進市區最省力；大阪皇家古典飯店和大阪難波格拉斯麗飯店則更適合想住在商圈中間，又希望飯店質感穩定的人。這區最大優點是晚上不用趕末班車，美食、購物、黑門市場、心齋橋商店街都可以靠步行串起來。
          </p>

          <h3 className="seo-h3">心齋橋｜購物派住起來最順</h3>
          <p>
            心齋橋比難波稍微安靜一點，但購物便利度非常高。大阪日航飯店是站點直通型的經典選擇，移動和逛街都輕鬆；相鐵 FRESA INN 大阪心齋橋位在心齋橋、長堀橋步行圈，乾淨實用且交通方便；捷絲旅大阪心齋橋館、VESSEL INN 大阪心齋橋船舶酒店則偏向乾淨、交通彈性高、價格比較好抓的商務型住宿。想白天跑景點、晚上集中購物，這區很舒服。
          </p>

          <h3 className="seo-h3">梅田/大阪站｜跨城市移動最強</h3>
          <p>
            梅田/大阪站是大阪的交通樞紐，適合會安排京都、神戶、奈良或環球影城的人。大阪麗思卡爾頓酒店走高級飯店路線，服務與房間質感很穩；阪急大阪龍仕柏飯店在商場與車站生活圈內，親子與購物都方便；大阪梅田 Intergate 飯店有大浴場和點心服務，格蘭比亞大阪維斯奇歐飯店則是大阪站北側比較安靜的選擇。這區不是最夜市感，但最適合把大阪當成關西移動基地。
          </p>

          <h3 className="seo-h3">天王寺｜機場交通與 CP 值兼顧</h3>
          <p>
            天王寺的優勢是房價通常比難波、梅田好看，生活機能卻不弱。大阪萬豪都酒店位在阿倍野 HARUKAS，高樓層景觀很有記憶點；大阪阿倍野 Trusty 飯店、大阪天王寺都城市飯店、VIA INN 阿倍野天王寺都靠近車站與商圈，吃飯採買很方便。從天王寺搭 HARUKA 可以直達關西機場，安排第一晚或最後一晚也很順。
          </p>

          <h3 className="seo-h3">難波/道頓堀｜逛街吃宵夜最省腳力</h3>
          <p>
            難波和道頓堀適合把住宿、購物、美食放在同一條動線。大阪十字飯店在道頓堀旁，晚上吃宵夜和回飯店都直覺；唐草飯店大阪難波適合朋友同行或需要連通房的人；大阪蒙特利格拉斯米爾飯店靠近 JR 難波和 OCAT，機場巴士與跨區移動更方便；天然溫泉御宿野乃難波則適合想要大浴場的人；日和飯店大阪難波站前靠近南海難波，搭 Rapi:t 往返關西機場很順。
          </p>

          <h3 className="seo-h3">心齋橋｜購物與設計型住宿集中</h3>
          <p>
            心齋橋住宿的優勢是逛街密度高，白天可以從 PARCO、大丸心齋橋一路走到美國村和難波。MIMARU 大阪心齋橋 WEST 是 4 星級公寓式飯店，適合親子、多人同行或連住；HOTEL THE FLAG 心齋橋偏設計型，適合想住得有質感又靠近商店街的人。這區比道頓堀稍微安靜，但晚上還是很容易找到餐廳、藥妝和便利商店。
          </p>

          <h3 className="seo-h3">梅田/大阪站｜百貨和跨城市交通一起顧</h3>
          <p>
            梅田住宿很適合把大阪當成關西基地。阪急國際飯店是 5 星級高樓層飯店，茶屋町和阪急商圈就在旁邊；大阪格蘭比亞飯店直結 JR 大阪站，移動效率很高；大阪蒙特利飯店、Villa Fontaine Grand 大阪梅田則適合想住在梅田生活圈、又希望逛街吃飯選擇多的人。行程有京都、神戶、奈良時，梅田通常會比難波少轉車。
          </p>

          <h3 className="seo-h3">環球影城與新今宮｜特殊行程再單獨考慮</h3>
          <p>
            如果大阪行程重點是日本環球影城，環球影城前飯店最省時間，適合親子、早入園或想玩兩天的人；LIBER HOTEL 大阪在櫻島站旁，房間和大浴場評價穩，適合想離樂園近但稍微拉開一點距離的人。新今宮的 OMO7 大阪 by 星野集團則是另一種選擇，適合想壓預算、又希望飯店本身有特色，往難波、天王寺和機場動線也有彈性。
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
