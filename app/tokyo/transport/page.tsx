import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '地鐵/鐵路', label: '地鐵/鐵路', dataArea: '地鐵/鐵路' },
  { value: '成田機場交通', label: '成田機場交通', dataArea: '成田機場交通' },
  { value: '羽田機場交通', label: '羽田機場交通', dataArea: '羽田機場交通' },
]
const cards = [
  { title: 'eSIM卡', meta: '通訊', area: '通訊', datasetKey: 'title' as const, datasetValue: 'eSIM卡', actions: [{ label: '輸入JieJourneys', href: 'https://esimconnect.com.tw/#/access/esimbuy?region=%E6%97%A5%E6%9C%AC&referencecode=jiejourneys', className: 'btn primary recommend', event: 'tokyotransport_esimconnect', platform: 'connect', section: 'comm_card' }, { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'tokyotransport_esimKKday', platform: 'KKDAY', section: 'comm_card' }] },
  { title: '東京地鐵券(Tokyo Subway Ticket)', meta: '地鐵', area: '地鐵/鐵路', datasetKey: 'title' as const, datasetValue: '東京地鐵券(Tokyo Subway Ticket)', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/5989-24-48-72-hr-tokyo-subway-ticket-japan?cid=22312', className: 'btn primary', event: 'tokyotransport_Subway123KKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1552-subway-ticket-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_Subway123KLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', meta: '成田機場交通', area: '成田機場交通', datasetKey: 'title' as const, datasetValue: '成田機場 ⇄ 上野站/日暮里站｜Skyliner', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7913-keisei-skyliner-narita-airport-express-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_SkylinerKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1410-skyliner-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_SkylinerKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
  { title: '羽田機場 ⇄ 東京市區｜東京利木津巴士', meta: '羽田機場交通', area: '羽田機場交通', datasetKey: 'title' as const, datasetValue: '羽田機場 ⇄ 東京市區｜東京利木津巴士', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', className: 'btn primary', event: 'tokyotransport_HNDLimousineKKday', platform: 'KKDAY', section: 'transport_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/150434-haneda-airport-limousine-bus-tokyo/?aid=93798', className: 'btn', event: 'tokyotransport_HNDLimousineKLOOK', platform: 'KLOOK', section: 'transport_card' }] },
]

export default function TokyoTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyotransport" />
      <main className="busan-main transport-main">
        <h1>通訊 & 交通</h1>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_transport_tab" />
      </main>
      <Footer />
    </>
  )
}
