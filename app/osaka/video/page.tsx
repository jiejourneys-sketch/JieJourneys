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
    title: '大阪5個區域｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-5-areas-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DZPs30vhboN/', className: 'btn primary', event: 'osakavideo_5areasIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/0DAV327wmN4', className: 'btn', event: 'osakavideo_5areasYT', platform: 'YouTube', section: 'video' },
      { label: '小紅書', href: 'https://xhslink.com/o/5r8AWxmXhfv', className: 'btn', event: 'osakavideo_5areasXHS', platform: '小紅書', section: 'video' },
    ],
  },
  {
    title: '大阪關西機場到市區｜3種方式',
    meta: '交通',
    area: '交通',
    datasetKey: 'video',
    datasetValue: 'osaka-kix-to-city-3-ways',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DZhualih3oF/', className: 'btn primary', event: 'osakavideo_kix3waysIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/0DAV327wmN4', className: 'btn', event: 'osakavideo_kix3waysYT', platform: 'YouTube', section: 'video' },
      { label: '小紅書', href: 'https://xhslink.com/o/4AsThJolQtS', className: 'btn', event: 'osakavideo_kix3waysXHS', platform: '小紅書', section: 'video' },
    ],
  },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'visit-japan-web', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'osakavideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'osakavideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/3g4dVW46U4I', className: 'btn', event: 'osakavideo_visitjapanwebXHS', platform: '小紅書', section: 'video' }] },
  { title: '日幣換匯攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'jpy-exchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTDKcCoEZBS/', className: 'btn primary', event: 'osakavideo_JPYExchangeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/FfMj7w2R7BA', className: 'btn', event: 'osakavideo_JPYExchangeYT', platform: 'YouTube', section: 'video' }, { label: '小紅書', href: 'https://xhslink.com/o/83JoRvRQFSc', className: 'btn', event: 'osakavideo_JPYExchangeXHS', platform: '小紅書', section: 'video' }] },
  { title: '日本退稅新制｜2026懶人包', meta: '行前準備', note: '整理 2026/11/1 後日本免稅流程、新舊制度差異、機場退稅與完美行購物注意事項。', area: '行前準備', datasetKey: 'video', datasetValue: 'japan-tax-free-2026-article', actions: [{ label: '文章', href: '/japan/tax-free-2026?from=osaka-video', className: 'btn primary', event: 'osakavideo_taxfree2026_article', platform: 'article', section: 'video' }] },
]

export default function OsakaVideoPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakavideo" />
      <main className="busan-main transport-main seo-page">
        <SeoHeroSection
          badge="短影片合輯"
          h1="大阪短影片攻略｜5個區域與關西機場交通快速看懂"
          intro="先用短影片抓大阪五大區域和關西機場進市區方式，再搭配行前準備影片，把第一次大阪自由行的重點一次整理好。"
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
            <h3 className="seo-h3">第一次大阪自由行，先用 5 個區域建立方向</h3>
            <p>
              大阪看起來景點很多，但第一次規劃其實先抓 5 個區域就會清楚很多：難波/道頓堀、心齋橋、梅田/大阪站、天王寺、環球影城。先看「大阪5個區域｜攻略」，會比較容易判斷自己要住哪裡、晚上要逛哪裡、哪些景點可以排在同一天。
            </p>
            <p>
              如果你想吃美食、逛藥妝、晚上不用趕車，難波和心齋橋會很直覺；如果會安排京都、神戶、奈良一日遊，梅田/大阪站通常更省轉車時間；如果想兼顧機場交通和預算，天王寺也很值得看。先用影片抓區域差異，再回到大阪地圖和住宿頁比位置，會比直接挑飯店更準。
            </p>
            <h3 className="seo-h3">關西機場到大阪市區，先看住宿位置再選交通</h3>
            <p>
              「大阪關西機場到市區｜3種方式」適合出發前先看。關西機場進大阪最常見會比較南海電鐵 Rapi:t、JR HARUKA 和利木津巴士/接送。不是哪一種最有名就一定最好，而是要看你住在哪一區、行李多不多、抵達時間會不會太晚。
            </p>
            <p>
              住難波、新今宮一帶，Rapi:t 通常最直覺；住天王寺、新大阪或要接京都方向，HARUKA 會比較好理解；如果飯店附近剛好有巴士站，或同行有長輩、小孩、大行李，利木津巴士或接送會更省力。先把機場交通弄清楚，第一天和最後一天會順很多。
            </p>
            <h3 className="seo-h3">行前準備影片適合出發前最後檢查</h3>
            <p>
              Visit Japan Web 和日幣換匯是日本自由行出發前最容易被拖到最後的兩件事。建議在出發前一週先看完，確認入境資料、匯率、現金和信用卡準備，再回來補大阪票券、周遊券與交通細節。
            </p>
            <p>
              這頁會先放最核心的短影片，讓你不用一次被太多資訊塞滿。看完大阪區域和機場交通後，如果要細排景點，可以接著看大阪熱門景點地圖；如果想判斷大阪周遊券划不划算，再看大阪周遊券地圖會更順。
            </p>
          </div>
        </section>

        <SeoFaqSection
          title="大阪短影片常見問題"
          items={[
            { q: '第一次去大阪要先看哪支影片？', a: '建議先看「大阪5個區域｜攻略」，先知道難波、心齋橋、梅田、天王寺和環球影城的相對位置，再決定住宿和每天動線。' },
            { q: '關西機場到大阪市區要選哪種交通？', a: '住難波、新今宮通常先看 Rapi:t；住天王寺、新大阪或京都方向先看 HARUKA；行李多、親子或飯店附近有站牌，可以比較利木津巴士或接送。' },
            { q: '看完短影片後下一步要做什麼？', a: '先打開大阪地圖確認景點和住宿區域，再看票券頁或大阪周遊券地圖判斷要不要買周遊券。不要先買票券再硬排行程。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
