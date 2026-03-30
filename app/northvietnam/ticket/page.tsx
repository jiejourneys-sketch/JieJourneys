import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { northVietnamTicketCards, northVietnamTicketTabs } from '@/data/northvietnam/tickets'

export default function NorthVietnamTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamticket" />
      <main className="busan-main transport-main">
        <h1>越南北越｜票券購買</h1>
        <CityTabbedList tabs={northVietnamTicketTabs} cards={northVietnamTicketCards} tabEvent="northvietnam_ticket_tab" />
      </main>
      <Footer />
    </>
  )
}
