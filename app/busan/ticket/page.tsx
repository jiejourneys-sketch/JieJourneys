import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import BusanTicketContent from '@/components/BusanTicketContent'

export default function BusanTicketPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanticket" />
      <main className="busan-main transport-main">
        <h1>釜山｜票券購買</h1>
        <BusanTicketContent />
      </main>
      <Footer />
    </>
  )
}
