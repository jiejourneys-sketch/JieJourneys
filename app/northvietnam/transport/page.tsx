import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '河內交通', label: '河內交通', dataArea: '河內交通' },
  { value: '沙壩交通', label: '沙壩交通', dataArea: '沙壩交通' },
  { value: '下龍灣交通', label: '下龍灣交通', dataArea: '下龍灣交通' },
  { value: '陸龍灣交通', label: '陸龍灣交通', dataArea: '陸龍灣交通' },
]

const cards = [
  { title: 'eSIM卡', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'eSIM卡', actions: [{ label: '輸入JieJourneys', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E8%B6%8A%E5%8D%97&referencecode=jiejourneys', className: 'btn primary recommend', event: 'northvietnamtransport_esimconnect', platform: 'connect', section: 'comm_card' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/146719-5-6-7-day-unlimited-data-esim-vietnam?cid=22312', className: 'btn', event: 'northvietnamtransport_esimKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/123902-vietnam-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'northvietnamtransport_esimKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜郵寄到府', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜郵寄到府', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/153022?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SimhomeKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/98253-south-east-asia-sim-card/?aid=93798', className: 'btn', event: 'northvietnamtransport_SimhomeKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: 'SIM卡｜河內機場(HAN)領取', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'SIM卡｜河內機場(HAN)領取', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/149742?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SimHANKKday', platform: 'KKDAY', section: 'comm_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/84066-3g-4g-sim-card-vietnam-noi-bai-airport/?aid=93798', className: 'btn', event: 'northvietnamtransport_SimHANKLOOK', platform: 'KLOOK', section: 'comm_card' }] },
  { title: '河內機場 ⇄ 河內市區｜包車', meta: '河內交通', area: '河內交通', datasetKey: 'title' as const, datasetValue: '河內機場 ⇄ 河內市區｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/100815-noi-bai-airport-private-transfer-to-downtown-ha-noi?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HanoiCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/airport-transfers/service/han-noi-bai-international-airport/?aid=93798', className: 'btn', event: 'northvietnamtransport_HanoiCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 沙壩｜包車', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 沙壩｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/27770-ha-noi-sapa-round-trip-transfer-by-sleeper-bus?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 沙壩｜臥鋪巴士', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 沙壩｜臥鋪巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/153323-hanoi-sapa-sleeper-bus-ticket-vietnam?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaBusKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133909-hanoi-sapa-sleeper-bus-by-hk-buslines/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaBusKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 老街 (沙壩)｜臥舖火車', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 老街 (沙壩)｜臥舖火車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/152771-premiere-sleeper-train-ticket-hanoi-sapa?cid=22312', className: 'btn primary', event: 'northvietnamtransport_SapaTrainKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/22928-viet-nam-rail-deluxe-train-sapa-hanoi/?aid=93798', className: 'btn', event: 'northvietnamtransport_SapaTrainKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '老街 ⇄ 沙壩｜包車/共乘', meta: '沙壩交通', area: '沙壩交通', datasetKey: 'title' as const, datasetValue: '老街 ⇄ 沙壩｜包車/共乘', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/127301-lao-cai-sapa-shared-or-private-transfer-to-lao-cai-train-station/?aid=93798', className: 'btn primary', event: 'northvietnamtransport_LaocaiKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 下龍灣｜包車', meta: '下龍灣交通', area: '下龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 下龍灣｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/128577?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HalongbayCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_HalongbayCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 下龍灣｜共乘', meta: '下龍灣交通', area: '下龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 下龍灣｜共乘', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/10470-limousine-transfer-between-ha-noi-and-ha-long-bay?cid=22312', className: 'btn primary', event: 'northvietnamtransport_HalongbayBusKKday', platform: 'KKDAY', section: 'transport_card' }] },
  { title: '河內 ⇄ 陸龍灣｜包車', meta: '陸龍灣交通', area: '陸龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 陸龍灣｜包車', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/128575-hanoi-ninh-binh-car-charter-vietnam?cid=22312', className: 'btn primary', event: 'northvietnamtransport_TrangAnCarKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', className: 'btn', event: 'northvietnamtransport_TrangAnCarKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '河內 ⇄ 陸龍灣｜共乘', meta: '陸龍灣交通', area: '陸龍灣交通', datasetKey: 'title' as const, datasetValue: '河內 ⇄ 陸龍灣｜共乘', actions: [{ label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/76802-shared-limousine-to-ninh-binh-from-ha-noi-and-vice-versa/?aid=93798', className: 'btn primary', event: 'northvietnamtransport_TrangAnBusKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
]

export default function NorthVietnamTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamtransport" />
      <main className="busan-main transport-main">
        <h1>通訊 & 交通</h1>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="northvietnam_transport_tab" />
      </main>
      <Footer />
    </>
  )
}
