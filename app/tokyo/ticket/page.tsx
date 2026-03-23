import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '展望台', label: '展望台', dataArea: '展望台' },
  { value: '主題類', label: '主題類', dataArea: '主題類' },
  { value: '親子類', label: '親子類', dataArea: '親子類' },
  { value: '水族館', label: '水族館', dataArea: '水族館' },
]
const cards = [
  { title: 'SHIBUYA SKY', meta: '展望台', area: '展望台', datasetKey: 'title' as const, datasetValue: 'SHIBUYA SKY', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/133300-shibuya-sky-observatory-e-ticket-tokyo?cid=22312', className: 'btn primary', event: 'tokyoticket_ShibuyaSkyKKday', platform: 'KKDAY', section: 'ticket_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/70672-shibuya-sky-tokyo/?aid=93798', className: 'btn', event: 'tokyoticket_ShibuyaSkyKLOOK', platform: 'KLOOK', section: 'ticket_card' }] },
  { title: '東京迪士尼', meta: '主題類', area: '主題類', datasetKey: 'title' as const, datasetValue: '東京迪士尼', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19252-tokyo-disney-resort-disneyland-disneysea?cid=22312', className: 'btn primary', event: 'tokyoticket_DisneyKKday', platform: 'KKDAY', section: 'ticket_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/695-tokyo-disney-resort-1-day-pass-tokyo/?aid=93798', className: 'btn', event: 'tokyoticket_DisneyKLOOK', platform: 'KLOOK', section: 'ticket_card' }] },
  { title: '樂高樂園', meta: '親子類', area: '親子類', datasetKey: 'title' as const, datasetValue: '樂高樂園', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/9852-japan-legoland-discovery-center-tokyo-and-madame-tussauds-ticket?cid=22312', className: 'btn primary', event: 'tokyoticket_LegolandKKday', platform: 'KKDAY', section: 'ticket_card' }] },
  { title: '池袋陽光水族館', meta: '水族館', area: '水族館', datasetKey: 'title' as const, datasetValue: '池袋陽光水族館', actions: [{ label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/166262-sunshine-aquarium-60-observation-deck-park-ikebukuro-tokyo?cid=22312', className: 'btn primary', event: 'tokyoticket_SunshineAquaKKday', platform: 'KKDAY', section: 'ticket_card' }, { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/14547-sunshine-aquarium-ticket-tokyo/?aid=93798', className: 'btn', event: 'tokyoticket_SunshineAquaKLOOK', platform: 'KLOOK', section: 'ticket_card' }] },
]

export default function TokyoTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyoticket" />
      <main className="busan-main transport-main">
        <h1>日本東京｜票券購買</h1>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="tokyo_ticket_tab" />
      </main>
      <Footer />
    </>
  )
}
