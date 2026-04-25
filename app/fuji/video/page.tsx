import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'

export default function FujiVideoPage() {
  const tabs = [
    { value: 'all', label: '全部', dataArea: 'all' },
    { value: '景點攻略', label: '景點攻略', dataArea: '景點攻略' },
    { value: '交通攻略', label: '交通攻略', dataArea: '交通攻略' },
  ]

  const cards: CityCard[] = [
    {
      title: '富士急樂園｜必玩攻略',
      meta: '景點攻略',
      area: '景點攻略',
      datasetKey: 'video',
      datasetValue: 'fuji-highland-guide',
      actions: [
        { label: 'IG Reels', href: 'https://www.instagram.com/reel/XXXXX/', className: 'btn primary', event: 'fujivideo_highland_ig', platform: 'IG', section: 'video' },
        { label: 'YouTube', href: 'https://www.youtube.com/shorts/XXXXX', className: 'btn', event: 'fujivideo_highland_yt', platform: 'YouTube', section: 'video' },
        { label: '小紅書', href: 'https://xhslink.com/XXXXX', className: 'btn', event: 'fujivideo_highland_xhs', platform: '小紅書', section: 'video' },
      ],
    },
  ]

  return (
    <>
      <CitySubpageHeader backHref="/fuji" eventPrefix="fujivideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="短影片合輯"
          h1="富士河口湖短影片攻略｜快速找到適合你的玩法"
          intro="這頁有所有短影片連結，讓你用最快速度找到要看的那一支。"
          eventPrefix="fujivideo"
          showVisual={false}
          ctaLinks={[
            {
              label: '富士河口湖住宿推薦',
              href: 'https://www.jiejourneys.com/fuji/hotel',
              dataEvent: 'fujivideo_allhotels',
              platform: 'hotel',
            },
            {
              label: '富士河口湖票券總整理',
              href: 'https://www.jiejourneys.com/fuji/ticket',
              dataEvent: 'fujivideo_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/fuji/transport',
              dataEvent: 'fujivideo_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="videoListTitle">
          富士河口湖短影片合輯（依主題分類）
        </h2>

        <CityTabbedList tabs={tabs} cards={cards} tabEvent="fujivideo_tab" />
      </main>
      <Footer />
    </>
  )
}
