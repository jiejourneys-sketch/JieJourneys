import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

export default function BusanTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanticket" />
      <main className="busan-main transport-main">
        <h1>釜山｜票券購買</h1>
        <CityTabbedList
          tabs={[
            { value: 'all', label: '全部', dataArea: 'all' },
            { value: '票券', label: '釜山Pass票券', dataArea: '票券' },
            { value: '涵蓋', label: '釜山Pass涵蓋景點票券', dataArea: '涵蓋' },
            { value: '未涵蓋', label: '釜山Pass未涵蓋景點票券', dataArea: '未涵蓋' },
            { value: '一日遊', label: '一日遊票券', dataArea: '一日遊' },
          ]}
          cards={[
            {
              title: '釜山通行證(釜山Pass)',
              meta: '釜山Pass票券',
              area: '票券',
              datasetKey: 'title',
              datasetValue: '釜山通行證(釜山Pass)',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312', className: 'btn primary', event: 'busanticket_PassKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798', className: 'btn', event: 'busanticket_PassKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busanticket_PassTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '樂天世界',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '樂天世界',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19296-busan-lotte-world-adventure-tickets-korea?cid=22312', className: 'btn primary', event: 'busanticket_LotteKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/75094-lotte-world-busan/?aid=93798', className: 'btn', event: 'busanticket_LotteKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/lotte-world-adventure-busan-136624941/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_LotteTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '斜坡滑車SkyLine Luge',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '斜坡滑車SkyLine Luge',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/152412-gijang-skyline-luge-ticket-busan-south-korea?cid=22312', className: 'btn primary', event: 'busanticket_SkylineKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/95929-skyline-luge-ticket-busan/?aid=93798', className: 'btn', event: 'busanticket_SkylineKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/skyline-luge-busan-137759829/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_SkylineTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '釜山 X the Sky 展望台',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '釜山 X the Sky 展望台',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/105514?cid=22312', className: 'btn primary', event: 'busanticket_XtheskyKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81280-busan-haeundae-lct-x-the-sky-admission-ticket/?aid=93798', className: 'btn', event: 'busanticket_XtheskyKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/busan-x-the-sky-131154384/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_XtheskyTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '汗蒸幕｜新世界SPA LAND',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '汗蒸幕｜新世界SPA LAND',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12213?cid=22312', className: 'btn primary', event: 'busanticket_SpalandKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/33180-spa-land-centum-city-ticket-busan/?aid=93798', className: 'btn', event: 'busanticket_SpalandKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/spa-land-centum-city-52529207/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_SpalandTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '松島海上纜車',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '松島海上纜車',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19674-busan-air-cruise-songdo-marine-cable-car-ticket-south-korea?cid=22312', className: 'btn primary', event: 'busanticket_SongdaoKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/29068-busan-air-cruise-cable-car-ticket/?aid=93798', className: 'btn', event: 'busanticket_SongdaoKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/busan-songdo-sea-cable-car-68151207/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_SongdaoTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '韓服體驗｜釜山甘川文化村',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '韓服體驗｜釜山甘川文化村',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/135365?cid=22312', className: 'btn primary', event: 'busanticket_HanfuKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/94949-gamcheon-hanbok-rental/?aid=93798', className: 'btn', event: 'busanticket_HanfuKLOOK', platform: 'KLOOK', section: 'ticket_card' },
              ],
            },
            {
              title: '釜山塔',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: '釜山塔',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19378?cid=22312', className: 'btn primary', event: 'busanticket_BusantowerKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/busan-tower-10521758/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7195610', className: 'btn', event: 'busanticket_BusantowerTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '膠囊列車&海岸列車',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: '膠囊列車&海岸列車',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312', className: 'btn primary', event: 'busanticket_SkycapKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798', className: 'btn', event: 'busanticket_SkycapKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/haeundae-blueline-park-131154386/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busanticket_SkycapTrip', platform: 'Trip', section: 'ticket_card' },
                { label: '官網', href: 'https://www.bluelinepark.com/eng/booking.do', className: 'btn', event: 'busanticket_SkycapOffbuy', platform: '官網', section: 'ticket_card' },
              ],
            },
            {
              title: 'Diamond Bay Yacht｜鑽石灣遊艇',
              meta: '釜山Pass(✔️)',
              area: '涵蓋',
              datasetKey: 'title',
              datasetValue: 'Diamond Bay Yacht｜鑽石灣遊艇',
              actions: [
                { label: '官網釜山Pass預約', href: 'https://diamondbay-tw.imweb.me/22', className: 'btn primary', event: 'busanticket_DiamondBayYachtOfficial', platform: 'Official', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/busan_diamondbay/', className: 'btn', event: 'busanticket_DiamondBayYachtIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'Yacht Holic｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'Yacht Holic｜水營灣遊艇',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/134684-yacht-holic-busan-yacht-public-tour-gwangan-ri-haeundae-south-korea?cid=22312', className: 'btn primary', event: 'busanticket_YachtholicKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/43419-busan-luxury-yacht-experience/?aid=93798', className: 'btn', event: 'busanticket_YachtholicKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/96899974/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D12650990', className: 'btn', event: 'busanticket_YachtholicTrip', platform: 'Trip', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/yachtholic/', className: 'btn', event: 'busanticket_YachtholicIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'Yacht G｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'Yacht G｜水營灣遊艇',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/135076-busan-fireworks-festival-special-yacht-g-public-yacht-tour-south-korea?cid=22312', className: 'btn primary', event: 'busanticket_YachtGKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/111742-yacht-tour-in-busan/?aid=93798', className: 'btn', event: 'busanticket_YachtGKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/60344567?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D10278760', className: 'btn', event: 'busanticket_YachtGTrip', platform: 'Trip', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/yacht_g/', className: 'btn', event: 'busanticket_YachtGIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'GoGo Yacht｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'GoGo Yacht｜水營灣遊艇',
              actions: [
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/111769-busan-haeundae-yacht-boat-tour/?aid=93798', className: 'btn primary', event: 'busanticket_GoGoYachtKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/102547075/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D10278760', className: 'btn', event: 'busanticket_GoGoYachtTrip', platform: 'Trip', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/gogo_yacht/', className: 'btn', event: 'busanticket_GoGoYachtIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'Yachtwa｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'Yachtwa｜水營灣遊艇',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/261440?cid=22312', className: 'btn primary', event: 'busanticket_YachtwaKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/113270-busan-yacht-tour-by-yachtwa/?aid=93798', className: 'btn', event: 'busanticket_YachtwaKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/102085641/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D12650990', className: 'btn', event: 'busanticket_YachtwaTrip', platform: 'Trip', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/yachtwa1/', className: 'btn', event: 'busanticket_YachtwaIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'The Yacht｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'The Yacht｜水營灣遊艇',
              actions: [
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/141657-busan-yacht-tour-the-yacht-experience/?aid=93798', className: 'btn primary', event: 'busanticket_TheYachtKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/__theyacht/', className: 'btn', event: 'busanticket_TheYachtIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'Y Holic｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'Y Holic｜水營灣遊艇',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/264977?cid=22312', className: 'btn primary', event: 'busanticket_YholicKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/136274-y-holic-yacht-experience-in-busan/?aid=93798', className: 'btn', event: 'busanticket_YholicKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/yholic_kr/', className: 'btn', event: 'busanticket_YholicIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'Yacht Tale｜水營灣遊艇',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'Yacht Tale｜水營灣遊艇',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/146710?cid=22312', className: 'btn primary', event: 'busanticket_YTaleKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/111721-the-bay-101-public-yacht-in-busan/?aid=93798', className: 'btn', event: 'busanticket_YTaleKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'IG', href: 'https://www.instagram.com/yachttale.global', className: 'btn', event: 'busanticket_YTaleIG', platform: 'IG', section: 'ticket_card' },
              ],
            },
            {
              title: 'SEA LIFE 釜山水族館門票',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: 'SEA LIFE 釜山水族館門票',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/2880-sea-life-busan-aquarium-tickets-korea?cid=22312', className: 'btn primary', event: 'busanticket_SealifeKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1251-sea-life-aquarium-busan/?aid=93798', className: 'btn', event: 'busanticket_SealifeKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/sealife-busan-aquarium-92862/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busanticket_SealifeTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '太宗台海洋飛行主題樂園',
              meta: '釜山Pass(✖)',
              area: '未涵蓋',
              datasetKey: 'title',
              datasetValue: '太宗台海洋飛行主題樂園',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/261443?cid=22312', className: 'btn primary', event: 'busanticket_TaizongKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/134035-taejongdae-ocean-flying-theme-park-ticket/?aid=93798', className: 'btn', event: 'busanticket_TaizongKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/taejongdae-ocean-flying-theme-park-147023939/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5738756', className: 'btn', event: 'busanticket_TaizongTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
            {
              title: '釜山一日遊',
              meta: '一日遊票券',
              area: '一日遊',
              datasetKey: 'title',
              datasetValue: '釜山一日遊',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131061-busan-one-day-tour-south-korea?cid=22312', className: 'btn primary', event: 'busanticket_yiriyouKKday', platform: 'KKDAY', section: 'ticket_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/3298-east-coast-cultural-day-tour-busan/?aid=93798', className: 'btn', event: 'busanticket_yiriyouKLOOK', platform: 'KLOOK', section: 'ticket_card' },
                { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/89497025/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', className: 'btn', event: 'busanticket_yiriyouTrip', platform: 'Trip', section: 'ticket_card' },
              ],
            },
          ]}
          tabEvent="busan_ticket_tab"
        />
      </main>
      <Footer />
    </>
  )
}
