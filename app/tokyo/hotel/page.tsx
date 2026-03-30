import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import { tokyoHotelCards, tokyoHotelTabs } from '@/data/tokyo/hotels'

export default function TokyoHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyohotel" />
      <main className="busan-main transport-main">
        <h1 className="sr-only">東京住宿精選｜JieJourneys(旅杰)</h1>
        <h2>日本東京住宿精選</h2>
        <CityTabbedList tabs={tokyoHotelTabs} cards={tokyoHotelCards} tabEvent="tokyo_hotel_tab" />
      </main>
      <Footer />
    </>
  )
}
