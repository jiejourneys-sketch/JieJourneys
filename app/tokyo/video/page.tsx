import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
  { value: '交通', label: '交通', dataArea: '交通' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
]
const cards = [
  { title: '六本木點燈｜最佳路線', meta: '景點攻略', area: '景點攻略', datasetKey: 'video' as const, datasetValue: 'RoppongiIllumination', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSfemOTEqbL/', className: 'btn primary', event: 'tokyovideo_RoppongiIlluminationIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/yZ8eH_jOKYM', className: 'btn', event: 'tokyovideo_RoppongiIlluminationYT', platform: 'YouTube', section: 'video' }] },
  { title: '地鐵 vs JR｜攻略', meta: '交通', area: '交通', datasetKey: 'video' as const, datasetValue: 'MetroVSJR', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTVMB2FkTt5/', className: 'btn primary', event: 'tokyovideo_MetroVSJRIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/xNN5iQLFGcU', className: 'btn', event: 'tokyovideo_MetroVSJRYT', platform: 'YouTube', section: 'video' }] },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video' as const, datasetValue: 'VisitJapanWeb', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'tokyovideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'tokyovideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }] },
]

export default function TokyoVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/tokyo" eventPrefix="tokyovideo" />
      <main className="busan-main transport-main">
        <h1>短影片合輯｜認識東京・景點攻略・行前準備</h1>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="video_tab" />
      </main>
      <Footer />
    </>
  )
}
