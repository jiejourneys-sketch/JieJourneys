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
    title: '大阪住宿攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-hotel-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DaFxlxQBagx/', className: 'btn primary', event: 'osakavideo_hotelguideIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/HFe3OPfmTGw', className: 'btn', event: 'osakavideo_hotelguideYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/osaka/hotel', className: 'btn', event: 'osakavideo_hotelguideArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '大阪周遊券｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-amazing-pass-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/Dap0xBSBbSI/', className: 'btn primary', event: 'osakavideo_amazingpassIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/u1g5J6SGZR4', className: 'btn', event: 'osakavideo_amazingpassYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/osaka/osaka-amazing-pass?from=osaka-video', className: 'btn', event: 'osakavideo_amazingpassArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '大阪城｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-castle-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DbN3zTshyea/', className: 'btn primary', event: 'osakavideo_osakacastleIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/fE5RF0eYysM', className: 'btn', event: 'osakavideo_osakacastleYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/osaka/osaka-castle-guide?from=osaka-video', className: 'btn', event: 'osakavideo_osakacastleArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '通天閣｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'tsutenkaku-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/Dbf5awqhIng/', className: 'btn primary', event: 'osakavideo_tsutenkakuIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/x9SRUpRWRSg', className: 'btn', event: 'osakavideo_tsutenkakuYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/osaka/tsutenkaku-guide?from=osaka-video', className: 'btn', event: 'osakavideo_tsutenkakuArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '道頓堀遊船｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'dotonbori-cruise-guide',
    actions: [
      { label: '文章', href: '/osaka/dotonbori-cruise-guide?from=osaka-video', className: 'btn', event: 'osakavideo_dotonboricruiseArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '大阪5個區域｜攻略',
    meta: '大阪攻略',
    area: '大阪攻略',
    datasetKey: 'video',
    datasetValue: 'osaka-5-areas-guide',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DZPs30vhboN/', className: 'btn primary', event: 'osakavideo_5areasIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/0DAV327wmN4', className: 'btn', event: 'osakavideo_5areasYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/osaka/osaka-5-areas-guide?from=osaka-video', className: 'btn', event: 'osakavideo_5areasArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: '地鐵 vs JR｜攻略',
    meta: '交通',
    area: '交通',
    datasetKey: 'video',
    datasetValue: 'metro-vs-jr',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DTVMB2FkTt5/', className: 'btn primary', event: 'osakavideo_metrovsjrIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/xNN5iQLFGcU', className: 'btn', event: 'osakavideo_metrovsjrYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/tokyo/tokyo-subway-vs-jr-guide?from=osaka-video', className: 'btn', event: 'osakavideo_metrovsjrArticle', platform: 'article', section: 'video' },
    ],
  },
  {
    title: 'JR vs 新幹線｜攻略',
    meta: '交通',
    area: '交通',
    datasetKey: 'video',
    datasetValue: 'jr-vs-shinkansen',
    actions: [
      { label: 'IG Reels', href: 'https://www.instagram.com/reel/DVBVYRckTUG/', className: 'btn primary', event: 'osakavideo_jrvsxgxIG', platform: 'IG', section: 'video' },
      { label: 'YouTube', href: 'https://www.youtube.com/shorts/j_Ws48TTzbE', className: 'btn', event: 'osakavideo_jrvsxgxYT', platform: 'YouTube', section: 'video' },
      { label: '文章', href: '/tokyo/jr-vs-shinkansen-guide?from=osaka-video', className: 'btn', event: 'osakavideo_jrvsxgxArticle', platform: 'article', section: 'video' },
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
      { label: '文章', href: '/osaka/kansai-airport-to-osaka?from=video', className: 'btn', event: 'osakavideo_kix3waysArticle', platform: 'article', section: 'video' },
    ],
  },
  { title: 'Visit Japan Web｜入境卡填寫', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'visit-japan-web', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DSxI34Nkebp/', className: 'btn primary', event: 'osakavideo_visitjapanwebIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/DWKvXvEHyKk', className: 'btn', event: 'osakavideo_visitjapanwebYT', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/japan/visit-japan-web-guide?from=osaka-video', className: 'btn', event: 'osakavideo_visitjapanwebArticle', platform: 'article', section: 'video' }] },
  { title: '日幣換匯攻略', meta: '行前準備', area: '行前準備', datasetKey: 'video', datasetValue: 'jpy-exchange', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/DTDKcCoEZBS/', className: 'btn primary', event: 'osakavideo_JPYExchangeIG', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/FfMj7w2R7BA', className: 'btn', event: 'osakavideo_JPYExchangeYT', platform: 'YouTube', section: 'video' }] },
  { title: '日本退稅新制｜2026懶人包', meta: '行前準備', note: '整理 2026/11/1 後日本免稅流程、新舊制度差異、機場退稅與完美行購物注意事項。', area: '行前準備', datasetKey: 'video', datasetValue: 'japan-tax-free-2026-article', actions: [{ label: 'IG Reels', href: 'https://www.instagram.com/reel/Da72R_yBXam/', className: 'btn primary', event: 'osakavideo_taxfree2026_ig', platform: 'IG', section: 'video' }, { label: 'YouTube', href: 'https://www.youtube.com/shorts/ULH9oonQ7-I', className: 'btn', event: 'osakavideo_taxfree2026_youtube', platform: 'YouTube', section: 'video' }, { label: '文章', href: '/japan/tax-free-2026?from=osaka-video', className: 'btn', event: 'osakavideo_taxfree2026_article', platform: 'article', section: 'video' }] },
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
        <CityTabbedList tabs={tabs} cards={cards} tabEvent="osaka_video_tab" collapseVideoActions />

        <SeoCtaSection text="" href="/osaka/map" linkText="大阪熱門景點地圖" newTab dataEvent="osakavideo_SEO_spotmap" />
        <SeoCtaSection text="" href="/osaka/pass-map" linkText="大阪周遊券地圖" newTab dataEvent="osakavideo_SEO_passmap" />

        <section className="seo-content" aria-label="大阪短影音攻略">
          <h2 className="seo-h2">大阪短影音怎麼看？先決定住宿，再買票券</h2>
          <div className="seo-prose">
            <p>
              大阪短影音現在建議照順序看：住宿區域、5 個區域、關西機場交通、大阪周遊券，最後才補行前準備。這樣比較不會一開始就被票券、交通和景點清單打亂。
            </p>

            <h3 className="seo-h3">第一步：先看住宿攻略</h3>
            <p>
              新增的「大阪住宿攻略」適合最先看。大阪住宿不是只看飯店價格，而是要看你要住難波、心齋橋、梅田、天王寺，還是環球影城附近。住哪裡會直接影響關西機場進市區、晚上逛街、隔天去京都奈良神戶的動線。
            </p>
            <p>
              我的判斷很簡單：第一次大阪、想吃美食逛街，先看難波/心齋橋；會安排京都、神戶、奈良一日遊，梅田/大阪站會更順；想兼顧機場交通和預算，天王寺可以一起比較。
            </p>

            <h3 className="seo-h3">第二步：用 5 個區域建立方向</h3>
            <p>
              看完住宿後，再看「大阪5個區域｜攻略」。大阪看起來景點很多，但第一次規劃其實先抓 5 個區域就會清楚很多：難波/道頓堀、心齋橋、梅田/大阪站、天王寺、環球影城。這支影片是用來建立地理感，不是拿來直接買票。
            </p>

            <h3 className="seo-h3">第三步：關西機場交通看住宿位置</h3>
            <p>
              「大阪關西機場到市區｜3種方式」適合住宿大方向確定後看。住難波、新今宮一帶，Rapi:t 通常最直覺；住天王寺、大阪站、新大阪或京都方向，HARUKA 會比較好理解；如果飯店附近剛好有巴士站，或同行有長輩、小孩、大行李，利木津巴士或接送會更省力。
            </p>
            <p>
              想看文字版，我也整理成
              <a
                href="/osaka/kansai-airport-to-osaka?from=video"
                data-event="osakavideo_SEO_kix_article"
                data-platform="article"
                data-section="seo_content"
              >
                <strong>關西機場到大阪市區文章</strong>
              </a>
              ，可以直接照住宿區域選。
            </p>

            <h3 className="seo-h3">第四步：大阪周遊券不要先買，先看行程密度</h3>
            <p>
              新增的「大阪周遊券｜攻略」是用來判斷要不要買，不是看完就一定買。大阪周遊券適合一天內密集跑免費設施和搭地鐵的人；如果你只是逛心齋橋、道頓堀、吃飯拍照，通常不用硬買。
            </p>
            <p>
              如果你正在算大阪周遊券，先看短影片，再接
              <a
                href="/osaka/osaka-amazing-pass?from=osaka-video"
                data-event="osakavideo_SEO_amazingpass_article"
                data-platform="article"
                data-section="seo_content"
              >
                <strong>大阪周遊券文章</strong>
              </a>
              和大阪周遊券地圖一起排，會比只看票價更準。
            </p>

            <h3 className="seo-h3">最後：行前準備影片出發前再檢查</h3>
            <p>
              Visit Japan Web 和日幣換匯是日本自由行出發前最容易被拖到最後的兩件事。建議出發前一週看完，確認入境資料、匯率、現金和信用卡準備，再回頭補大阪票券與交通細節。
            </p>
          </div>
        </section>

        <SeoFaqSection
          title="大阪短影片常見問題"
          items={[
            { q: '第一次去大阪要先看哪支影片？', a: '建議先看「大阪住宿攻略」，再看「大阪5個區域｜攻略」。先決定住哪裡，再安排景點和交通，會比直接買票券更穩。' },
            { q: '關西機場到大阪市區要選哪種交通？', a: '住難波、新今宮通常先看 Rapi:t；住天王寺、新大阪或京都方向先看 HARUKA；行李多、親子或飯店附近有站牌，可以比較利木津巴士或接送。' },
            { q: '看完短影片後下一步要做什麼？', a: '先打開大阪地圖確認景點和住宿區域，再看票券頁或大阪周遊券地圖判斷要不要買周遊券。不要先買票券再硬排行程。' },
            { q: '大阪周遊券要先看影片還是文章？', a: '先看短影片抓重點，再看文章和周遊券地圖確認免費設施、優惠設施、交通範圍和行程順不順。' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
