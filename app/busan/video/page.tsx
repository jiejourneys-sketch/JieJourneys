import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import BusanVideoContent from '@/components/BusanVideoContent'

export default function BusanVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/busan" eventPrefix="busanvideo" />
      <main className="busan-main transport-main">
        <h1>短影片合輯｜認識釜山・景點攻略・行前準備</h1>
        <BusanVideoContent />
      </main>
      <Footer />
    </>
  )
}
