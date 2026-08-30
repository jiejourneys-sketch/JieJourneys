import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import {
  osaka5AreasGuideCanonical,
  osaka5AreasGuideDescription,
  osaka5AreasGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const videoLinks = [
  {
    label: 'IG｜大阪 5 區域',
    href: 'https://www.instagram.com/reel/DZPs30vhboN/',
    event: 'osaka5areas_video_ig',
    platform: 'IG',
    primary: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/shorts/0DAV327wmN4',
    event: 'osaka5areas_video_youtube',
    platform: 'YouTube',
  },
]

const faqItems = [
  {
    q: '第一次大阪自由行，5 個區域都要跑嗎？',
    a: '不需要。三天可優先排難波心齋橋、大阪城加梅田、天王寺新世界；大阪港或 USJ 再依旅行天數、親子需求與票券安排加入。',
  },
  {
    q: '難波、心齋橋、道頓堀可以排同一天嗎？',
    a: '可以，這三個地方步行串連最順。白天心齋橋逛街，傍晚走道頓堀河岸，晚上再吃飯或搭乘道頓堀水上觀光船，節奏會比較舒服。',
  },
  {
    q: '大阪城和梅田可以排同一天嗎？',
    a: '可以。大阪城適合上午到下午，梅田適合傍晚逛街、吃飯與看夜景；兩區之間仍有一段移動，建議不要再塞難波或天王寺。',
  },
  {
    q: 'USJ、海遊館、天保山摩天輪能同一天嗎？',
    a: '不建議把 USJ 和海遊館硬塞同一天。USJ 本身適合一整天；海遊館、天保山摩天輪與樂高探索中心則適合另一條大阪港半日到一日線。',
  },
  {
    q: '樂高探索中心適合只有大人的旅客嗎？',
    a: '不適合。大阪樂高探索中心是親子室內設施，官方規定成人入場時必須陪同至少一位 15 歲以下兒童。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: osaka5AreasGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: osaka5AreasGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: osaka5AreasGuideCanonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function Osaka5AreasGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref="/osaka/video" eventPrefix="osaka5areas" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪自由行攻略"
          h1="大阪自由行｜5 大區域景點攻略：第一次照區域排行程最省時"
          intro="大阪景點多，但第一次不用急著全塞進行程。先把難波心齋橋、大阪城、梅田、天王寺新世界、大阪港與環球影城分開看，再用每天一到兩區的節奏安排，走起來最順。"
          eventPrefix="osaka5areas"
          showVisual={false}
          ctaLinks={[
            { label: '快速選區', href: '#quick-answer', dataEvent: 'osaka5areas_hero_quick', platform: 'article' },
            { label: '5 區比較', href: '#area-comparison', dataEvent: 'osaka5areas_hero_compare', platform: 'article' },
            { label: '3 天排法', href: '#sample-plan', dataEvent: 'osaka5areas_hero_plan', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="大阪五大區域快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">逛街、美食、夜生活</span>
              <strong>難波＆心齋橋</strong>
              <p>道頓堀、固力果、商店街都在這裡，最適合排成下午到晚上。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">歷史與公園</span>
              <strong>大阪城區域</strong>
              <p>天守閣、城公園與護城河遊船適合白天，接梅田夜景很順。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">購物與夜景</span>
              <strong>梅田</strong>
              <p>大阪站、Grand Front、百貨與空中庭園，是北大阪最方便的收尾區。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">懷舊大阪</span>
              <strong>天王寺＆新世界</strong>
              <p>四天王寺、通天閣、串炸與商店街，適合安排成一個半日到一日。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="大阪五大區域短影音">
          <h2 className="seo-h2">先看短影音：大阪 5 個區域怎麼排</h2>
          <div className="seo-prose">
            <p>短影音用來先建立地理感；接著依你想逛街、看歷史、親子或排 USJ，從下方選擇要花最多時間的區域。</p>
            <SeoVideoLinkMenu label="大阪 5 區域" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="area-comparison" aria-label="大阪五大區域比較">
          <h2 className="seo-h2">大阪市區 5 大區域，怎麼選才不趕？</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>區域</th>
                    <th>第一次必看</th>
                    <th>最適合安排</th>
                    <th>行程提醒</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>難波＆心齋橋</td>
                    <td>固力果跑跑人、道頓堀、美食街、心齋橋商店街、道頓堀河。</td>
                    <td>下午逛街到晚上吃飯、看霓虹。</td>
                    <td>人潮最多，餐廳熱門時段要預留排隊；不必再把梅田塞在同一個晚上。</td>
                  </tr>
                  <tr>
                    <td>大阪城</td>
                    <td>天守閣、大阪城公園、護城河御座船。</td>
                    <td>上午到下午的歷史與散步行程。</td>
                    <td>公園很大，從車站走到天守閣仍要留步行時間；想登天守閣別壓最後入場。</td>
                  </tr>
                  <tr>
                    <td>梅田</td>
                    <td>梅田商圈、Grand Front Osaka、梅田空中庭園展望台。</td>
                    <td>白天購物、傍晚到晚上看夜景。</td>
                    <td>大阪站與地下街規模大，第一次轉車多留 10 到 15 分鐘找出口。</td>
                  </tr>
                  <tr>
                    <td>天王寺＆新世界</td>
                    <td>四天王寺、通天閣、新世界商店街。</td>
                    <td>文化景點接懷舊街區與串炸。</td>
                    <td>四天王寺與通天閣不是同一站旁邊，兩點之間要保留步行或一小段地鐵時間。</td>
                  </tr>
                  <tr>
                    <td>大阪港＆環球影城</td>
                    <td>USJ、海遊館、天保山摩天輪、樂高探索中心。</td>
                    <td>USJ 一整天；或海遊館＋天保山的親子港灣日。</td>
                    <td>USJ 不要和海遊館硬塞同一天；樂高探索中心主要面向帶孩子的家庭。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="namba" aria-label="難波與心齋橋攻略">
          <h2 className="seo-h2">第一區：難波＆心齋橋｜逛街、吃美食、感受大阪夜生活</h2>
          <div className="seo-prose">
            <p>
              難波、心齋橋、道頓堀是大阪最經典的「Minami」區域。白天從心齋橋商店街開始逛，傍晚走到戎橋拍固力果跑跑人，晚上留給道頓堀美食與河岸霓虹，第一次來最容易玩出大阪感。
            </p>
            <p>
              想從不同角度看道頓堀，可以搭約 20 分鐘的道頓堀水上觀光船；登船處從難波、心齋橋與日本橋站約步行 5 到 10 分鐘。船班、票價和停航狀況請出發前再確認。
            </p>
          </div>
        </section>

        <section className="seo-content" id="osaka-castle" aria-label="大阪城區域攻略">
          <h2 className="seo-h2">第二區：大阪城｜天守閣、公園、護城河從白天慢慢看</h2>
          <div className="seo-prose">
            <p>
              大阪城不只是拍一張天守閣。公園腹地大，適合把天守閣、石垣與公園步道排在一起；想換個角度看城牆與護城河，可以加上大阪城御座船。這區白天走完後，傍晚再往梅田接購物或夜景最順。
            </p>
            <p>
              想看車站出口、園內移動、天守閣、御座船與西之丸庭園的詳細安排，可直接看
              <a href="/osaka/osaka-castle-guide?from=osaka-5-areas-guide" data-event="osaka5areas_castle_article" data-platform="article" data-section="article_link">
                <strong> 大阪城完整攻略</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="umeda" aria-label="梅田區域攻略">
          <h2 className="seo-h2">第三區：梅田｜白天購物，晚上看大阪夜景</h2>
          <div className="seo-prose">
            <p>
              梅田是大阪北側的交通與購物核心。大阪站周邊百貨、地下街、商場密集，Grand Front Osaka 從 JR 大阪站中央口約步行 3 分鐘；若想看夜景，
              <a href="/osaka/umeda-sky-building-guide?from=osaka-5-areas-guide" data-event="osaka5areas_umeda_sky_article" data-platform="article" data-section="article_link">
                <strong>梅田空中庭園展望台</strong>
              </a>
              適合排在傍晚到晚上。
            </p>
            <p>
              梅田站名與出口很多，第一次來別把轉車抓得太緊。先決定要從哪個商場開始，最後再去空中庭園或餐廳收尾，比一直在地下街找路輕鬆。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tennoji" aria-label="天王寺與新世界攻略">
          <h2 className="seo-h2">第四區：天王寺＆新世界｜從古寺走進昭和懷舊大阪</h2>
          <div className="seo-prose">
            <p>
              天王寺與新世界適合喜歡歷史、老街和庶民美食的人。四天王寺是日本最早的官寺之一；新世界則有通天閣、Janjan 橫丁與串炸店，把大阪的懷舊氛圍留到晚上最對味。
            </p>
            <p>
              我會建議上午先看四天王寺，中午後走往天王寺公園或新世界，傍晚上通天閣、吃串炸。兩個核心景點之間不是完全零距離，行程要留移動緩衝，不要只看地圖直線距離。
            </p>
          </div>
        </section>

        <section className="seo-content" id="bay" aria-label="大阪港與環球影城攻略">
          <h2 className="seo-h2">第五區：大阪港＆環球影城｜不要把兩種玩法硬塞同一天</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">USJ：專心留一整天</h3>
            <p>
              環球影城適合獨立排一日。入園前下載官方 App，看當日等待時間、地圖與設施資訊；若同行者有身高、健康或行動需求，也先查各設施規範。不要因為地圖上同屬港灣區，就以為可以順便塞海遊館。
            </p>

            <h3 className="seo-h3">海遊館＋天保山：親子與港灣半日到一日線</h3>
            <p>
              海遊館距大阪港站約步行 5 分鐘，旁邊就是天保山摩天輪；想看大阪灣景色可排在水族館前後。從 USJ 往海遊館可利用 Captain Line 水上接駁，但仍建議把它視為另一段行程，而不是 USJ 的附屬景點。
            </p>

            <h3 className="seo-h3">樂高探索中心：帶孩子才排</h3>
            <p>
              樂高探索中心大阪位在天保山 Marketplace，是室內親子設施。官方規定成人必須陪同至少一位 15 歲以下兒童入場；純成人旅客可把時間留給海遊館、摩天輪或港灣散步。
            </p>

          </div>
        </section>

        <section className="seo-content" id="sample-plan" aria-label="大阪三天區域行程範例">
          <h2 className="seo-h2">第一次大阪 3 天，照這樣抓區域最不容易繞路</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li><strong>第 1 天：</strong>大阪城 → 梅田。白天看歷史與公園，晚上逛街、吃飯、看夜景。</li>
              <li><strong>第 2 天：</strong>四天王寺 → 新世界 → 難波／道頓堀。從文化景點一路接到大阪最熱鬧的夜生活。</li>
              <li><strong>第 3 天：</strong>USJ 一整天；或改為海遊館 → 天保山摩天輪 → 大阪港。親子可在港灣線加入樂高探索中心。</li>
            </ul>
            <p>
              住難波的人可把第 2 天排得更輕鬆；住梅田的人則更適合把第 1 天或往京都、神戶、奈良的一日遊放在前段。住宿還沒決定的話，先看
              <a href="/osaka/hotel?from=osaka-5-areas-guide" data-event="osaka5areas_hotel" data-platform="hotel" data-section="article_link">
                <strong> 大阪住宿攻略</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪五大區域結論">
          <h2 className="seo-h2">結論：先選區域，再決定票券與交通</h2>
          <div className="seo-prose">
            <p>
              第一次大阪最省時的方式，就是把難波心齋橋、城、梅田、天王寺新世界與港灣線分開排。每個區域都留一段走路、吃飯和找出口的時間；USJ 更要獨立一天。區域清楚後，再回頭決定大阪周遊券、地鐵票或景點票，行程才不會為了票券而繞路。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="把選好的區域變成實際路線"
          intro="先用大阪地圖確認景點與飯店位置；若當天會跑多個免費設施，再切到大阪周遊券地圖比較是否值得買。"
          links={[
            { label: '大阪旅遊地圖', href: '/osaka/map?from=osaka-5-areas', event: 'osaka5areas_related_map', primary: true },
            { label: '大阪周遊券地圖', href: '/osaka/pass-map?from=osaka-5-areas', event: 'osaka5areas_related_passmap' },
            { label: '大阪交通整理', href: '/osaka/transport', event: 'osaka5areas_related_transport' },
          ]}
        />
        <SeoFaqSection title="大阪 5 大區域常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
