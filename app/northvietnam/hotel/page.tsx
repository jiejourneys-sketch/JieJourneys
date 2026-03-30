import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { northVietnamHotelCards, northVietnamHotelTabs } from '@/data/northvietnam/hotels'

export default function NorthVietnamHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/northvietnam" eventPrefix="northvietnamhotel" />
      <main className="busan-main transport-main">
        <h1 className="sr-only">北越住宿精選｜JieJourneys(旅杰)</h1>
        <h2>越南北越住宿精選</h2>
        <CityTabbedList tabs={northVietnamHotelTabs} cards={northVietnamHotelCards} tabEvent="northvietnam_hotel_tab" />
      </main>
      <Footer />
    </>
  )
}
