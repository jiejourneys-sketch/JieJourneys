import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { busanTicketCards, busanTicketTabs } from '@/data/busan/tickets'

export default function BusanTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanticket" />
      <main className="busan-main transport-main">
        <h1>釜山｜票券購買</h1>
        <CityTabbedList tabs={busanTicketTabs} cards={busanTicketCards} tabEvent="busan_ticket_tab" />
      </main>
      <Footer />
    </>
  )
}
