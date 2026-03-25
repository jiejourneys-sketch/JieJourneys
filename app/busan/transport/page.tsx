import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

export default function BusanTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busantransport" />
      <main className="busan-main transport-main">
        <h1>通訊 & 交通</h1>
        <CityTabbedList
          tabs={[
            { value: 'all', label: '全部', dataArea: 'all' },
            { value: '通訊', label: '通訊', dataArea: '通訊' },
            { value: '交通', label: '交通', dataArea: '交通' },
          ]}
          cards={[
            {
              title: 'eSIM卡',
              meta: '通訊',
              area: '通訊',
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
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
              datasetKey: 'title',
              datasetValue: '釜山金海機場 ↔ 釜山市區',
              actions: [
                { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18410?cid=22312', className: 'btn primary', event: 'busantransport_airportKKday', platform: 'KKDAY', section: 'transport_card' },
                { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/service/pus-gimhae-international-airport/?aid=93798', className: 'btn', event: 'busantransport_airportKLOOK', platform: 'KLOOK', section: 'transport_card' },
              ],
            },
          ]}
          tabEvent="busan_transport_tab"
        />
      </main>
      <Footer />
    </>
  )
}
