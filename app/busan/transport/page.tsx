import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import BusanTransportContent from '@/components/BusanTransportContent'

export default function BusanTransportPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busantransport" />
      <main className="busan-main transport-main">
        <h1>通訊 & 交通</h1>
        <BusanTransportContent />
      </main>
      <Footer />
    </>
  )
}
