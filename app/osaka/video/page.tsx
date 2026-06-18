import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import CityTabbedList from '@/components/CityTabbedList'
import type { CityCard } from '@/components/CityTabbedList'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '大阪攻略', label: '大阪攻略', dataArea: '大阪攻略' },
  { value: '交通', label: '交通', dataArea: '交通' },
  { value: '行前準備', label: '行前準備', dataArea: '行前準備' },
]
const cards: CityCard[] = [
  {
    title: '大阪自由行｜先看景點地圖',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-map-guide',
    actions: [
      { label: '地圖', href: '/osaka/map', className: 'btn primary', event: 'osakavideo_map', platform: 'map', section: 'video' },
      { label: '周遊券地圖', href: '/osaka/pass-map', className: 'btn', event: 'osakavideo_passmap', platform: 'pass-map', section: 'video' },
    ],
  },
  {
    title: '大阪票券｜周遊券・USJ・海遊館',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-ticket-guide',
    actions: [
      { label: '票券整理', href: '/osaka/ticket', className: 'btn primary', event: 'osakavideo_ticket', platform: 'ticket', section: 'video' },
      { label: '大阪周遊券', href: '/osaka/pass-map', className: 'btn', event: 'osakavideo_pass', platform: 'pass-map', section: 'video' },
    ],
  },
  {
    title: '大阪住宿｜難波・心齋橋・梅田',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-hotel-guide',
    actions: [
      { label: '住宿推薦', href: '/osaka/hotel', className: 'btn primary', event: 'osakavideo_hotel', platform: 'hotel', section: 'video' },
      { label: '住宿地圖', href: '/osaka/map', className: 'btn', event: 'osakavideo_hotelmap', platform: 'map', section: 'video' },
    ],
  },
  {
    title: '大阪交通｜關西機場到市區',
    meta: '交通',
    area: '交通',
    datasetKey: 'video',
    datasetValue: 'osaka-kix-transport',
    actions: [
      { label: '交通攻略', href: '/osaka/transport', className: 'btn primary', event: 'osakavideo_transport', platform: 'transport', section: 'video' },
      { label: '地圖', href: 'https://www.google.com/maps/d/edit?mid=11LrZQhbY4ULNh46Oxe4NWci5Zas6UCA&usp=sharing', className: 'btn', event: 'osakavideo_kixmap', platform: 'GoogleMap', section: 'video' },
    ],
  },
  { title: '地鐵 vs JR｜攻略', meta: '交通', area: '交通', datasetKey: 'video', datasetValue: 'metro-vs-jr', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTVMB2FkTt5/', className: 'btn primary', event: 'osakavideo_MetroVSJRIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/xNN5iQLFGcU', className: 'btn', event: 'osakavideo_MetroVSJRYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3MITM21zfli', className: 'btn', event: 'osakavideo_MetroVSJRXHS', platform: '小紅書', section: 'video' }] },
  { title: 'JR vs 新幹線｜攻略', meta: '交通', area: '交通', datasetKey: 'video', datasetValue: 'jr-vs-shinkansen', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DVBVYRckTUG/', className: 'btn primary', event: 'osakavideo_JRVSXGXIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/j_Ws48TTzbE', className: 'btn', event: 'osakavideo_JRVSXGXYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/2h8p1nd33PE', className: 'btn', event: 'osakavideo_JRVSXGXXHS', platform: '小紅書', section: 'video' }] },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'visit-japan-web', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'osakavideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'osakavideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3g4dVW46U4I', className: 'btn', event: 'osakavideo_visitjapanwebXHS', platform: '小紅書', section: 'video' }] },
  { title: '日幣換匯攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'jpy-exchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTDKcCoEZBS/', className: 'btn primary', event: 'osakavideo_JPYExchangeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/FfMj7w2R7BA', className: 'btn', event: 'osakavideo_JPYExchangeYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/83JoRvRQFSc', className: 'btn', event: 'osakavideo_JPYExchangeXHS', platform: '小紅書', section: 'video' }] },
]

export default function OsakaVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakavideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="短影片合輯"
          h1="大阪短影片攻略｜快速找到適合你的玩法"
          intro="把大阪自由行常用的景點、票券、住宿、交通與日本行前準備集中在這一頁，出發前先用最短時間抓重點。"
          eventPrefix="osakavideo"
          showVisual={false}
          ctaLinks={[
            {
              label: '大阪住宿推薦',
              href: 'https://www.jiejourneys.com/osaka/hotel',
              dataEvent: 'osakavideo_allhotels',
              platform: 'hotel',
            },
            {
              label: '大阪票券總整理',
              href: 'https://www.jiejourneys.com/osaka/ticket',
              dataEvent: 'osakavideo_alltickets',
              platform: 'ticket',
            },
            {
              label: '通訊&交通攻略',
              href: 'https://www.jiejourneys.com/osaka/transport',
              dataEvent: 'osakavideo_alltransport',
              platform: 'transport',
            },
          ]}
        />

        <h2 className="seo-h2" id="videoListTitle">
          大阪短影片合輯（依主題分類）
        </h2>
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="osaka_video_tab" />

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪熱門景點地圖" newTab dataEvent="osakavideo_SEO_spotmap" />
        <SeoCtaSection text="" href="/osaka/pass-map" linkText="大阪周遊券地圖" newTab dataEvent="osakavideo_SEO_passmap" />

        <section className="seo-content" aria-label="大阪短影音攻略">
          <h2 className="seo-h2">大阪短影音怎麼看？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">先看地圖，再決定住宿與票券</h3>
            <p>
              第一次安排大阪自由行，最容易卡在景點距離與住宿位置。建議先用大阪地圖抓出難波、心齋橋、梅田、天王寺、環球影城與大阪城的位置，再回來看住宿和票券，會比一開始就買周遊券更準。
            </p>
            <h3 className="seo-h3">交通先分成機場進市區與市區移動</h3>
            <p>
              關西機場到大阪市區常見是 Rapi:t、HARUKA、利木津巴士與包車；市區內則以大阪 Metro 和 JR 為主。行李多、親子同行或飯店離車站較遠時，先看交通頁會省很多現場判斷時間。
            </p>
            <h3 className="seo-h3">行前準備影片適合出發前最後檢查</h3>
            <p>
              Visit Japan Web、日幣換匯、JR 與新幹線差異都是日本自由行共通重點。出發前把這幾支短片看完，再搭配大阪票券與交通頁確認細節，旅程會順很多。
            </p>
          </div>
        </section>

        <SeoFaqSection
          title="大阪短影片常見問題"
          items={[
            { q: '第一次去大阪要先看哪個主題？', a: '建議先看大阪地圖和票券整理，先知道景點距離與大阪周遊券適不適合，再回頭決定住宿區域和交通工具。' },
            { q: '大阪交通要先研究 Rapi:t 還是 HARUKA？', a: '住難波、新今宮通常優先看 Rapi:t；住天王寺、新大阪、京都方向再優先看 HARUKA。住宿位置比票券名稱更重要。' },
            { q: '大阪周遊券一定要買嗎？', a: '不一定。一天會密集跑周遊券涵蓋景點才比較容易划算；如果主要逛道頓堀、心齋橋、黑門市場和梅田商場，可以先不用硬買。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
