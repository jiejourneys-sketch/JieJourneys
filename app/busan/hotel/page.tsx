import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import BusanHotelContent from '@/components/BusanHotelContent'

export default function BusanHotelPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanhotel" />
      <main className="busan-main transport-main">
        <h1>影片介紹｜怎麼選釜山住宿</h1>
        <BusanHotelContent />
      </main>
      <Footer />
    </>
  )
}
