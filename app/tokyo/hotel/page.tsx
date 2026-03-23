import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '上野站', label: '上野站', dataArea: '上野站' },
  { value: '淺草寺', label: '淺草寺', dataArea: '淺草寺' },
  { value: '東京車站', label: '東京車站', dataArea: '東京車站' },
  { value: '新宿站', label: '新宿站', dataArea: '新宿站' },
  { value: '涉谷站', label: '涉谷站', dataArea: '涉谷站' },
]
const cards = [
  { title: '明恩上野', meta: '上野站｜5星級、清幽/高級/寬敞/廚房/設備齊全', area: '上野站', datasetKey: 'hotel' as const, datasetValue: '明恩上野', actions: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=52134686', className: 'btn primary', event: 'tokyohotel_Ueno1Agoda', platform: 'Agoda', section: 'hotel_card' }] },
  { title: '淺草田原町KOKO飯店住宅', meta: '淺草寺｜4星級、寬敞/小廚房/用餐區/交通便利', area: '淺草寺', datasetKey: 'hotel' as const, datasetValue: '淺草田原町KOKO飯店住宅', actions: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=32355474', className: 'btn primary', event: 'tokyohotel_Sensoji1Agoda', platform: 'Agoda', section: 'hotel_card' }] },
  { title: '千禧 三井花園飯店 東京/銀座', meta: '東京車站｜5星級、寬敞/乾淨/美景/交通便利', area: '東京車站', datasetKey: 'hotel' as const, datasetValue: '千禧 三井花園飯店 東京/銀座', actions: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=648873', className: 'btn primary', event: 'tokyohotel_TokyoStation1Agoda', platform: 'Agoda', section: 'hotel_card' }] },
  { title: '東京京王廣場飯店', meta: '新宿站｜5星級、床舒適/寬敞乾淨/位置優越/交通便利', area: '新宿站', datasetKey: 'hotel' as const, datasetValue: '東京京王廣場飯店', actions: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=7263', className: 'btn primary', event: 'tokyohotel_Shinjuku1Agoda', platform: 'Agoda', section: 'hotel_card' }] },
  { title: '東京澀谷英迪格飯店', meta: '涉谷站｜5星級、現代設施/乾淨寬敞/精華地段/交通便利', area: '涉谷站', datasetKey: 'hotel' as const, datasetValue: '東京澀谷英迪格飯店', actions: [{ label: 'Agoda', href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=37465373', className: 'btn primary', event: 'tokyohotel_Shibuya1Agoda', platform: 'Agoda', section: 'hotel_card' }] },
]

export default function TokyoHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyohotel" />
      <main className="busan-main transport-main">
        <h1 className="sr-only">東京住宿精選｜JieJourneys(旅杰)</h1>
        <h2>日本東京住宿精選</h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_hotel_tab" />
      </main>
      <Footer />
    </>
  )
}
