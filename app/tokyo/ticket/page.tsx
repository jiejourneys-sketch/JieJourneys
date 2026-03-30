import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { tokyoTicketCards, tokyoTicketTabs } from '@/data/tokyo/tickets'

export default function TokyoTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyoticket" />
      <main className="busan-main transport-main">
        <h1>日本東京｜票券購買</h1>
        <CityTabbedList tabs={tokyoTicketTabs} cards={tokyoTicketCards} tabEvent="tokyo_ticket_tab" />
      </main>
      <Footer />
    </>
  )
}
