import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  tsutenkakuGuideCanonical,
  tsutenkakuGuideDescription,
  tsutenkakuGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const DIVE_WALK_SATELLITE_MAP = 'https://maps.app.goo.gl/Ei8FCfvrm3765XyV6'

const videoLinks = [
  { label: '通天閣 IG', href: 'https://www.instagram.com/reel/Dbf5awqhIng/', event: 'tsutenkaku_video_ig', platform: 'IG', primary: true },
  { label: '通天閣 YouTube', href: 'https://www.youtube.com/shorts/x9SRUpRWRSg', event: 'tsutenkaku_video_yt', platform: 'YouTube' },
]

const accessRoutes = [
  {
    station: '大阪 Metro 堺筋線｜惠美須町站',
    exit: '3 號出口',
    route: '沿通天閣本通商店街往南走，通天閣會在前方出現。',
    bestFor: '想從北側開始逛、慢慢逛通天閣本通的人。',
  },
  {
    station: '大阪 Metro 御堂筋線／堺筋線｜動物園前站',
    exit: '1 號出口',
    route: '從南側進新世界，先穿過南陽通（Janjan 橫丁）或新世界本通，再走到通天閣。',
    bestFor: '從難波、天王寺或新今宮方向過來，想先吃串炸與逛新世界的人。',
  },
]

const facilityRows = [
  {
    facility: '一般展望台／黃金展望台',
    floor: '5F',
    pass: '大阪周遊卡可免費使用',
    highlight: '俯瞰新世界，找比利肯福神與黃金展望台。',
  },
  {
    facility: '天望樂園／TIP THE TSUTENKAKU',
    floor: 'R5F',
    pass: '需加價，不包含在大阪周遊卡免費設施內',
    highlight: '94.5m 戶外展望台與透明地板延伸平台。',
  },
  {
    facility: 'TOWER SLIDER',
    floor: '3F → B1',
    pass: '大阪周遊卡可免費使用',
    highlight: '從地上 22m 的 3F，一路滑到 B1，約 10 秒。',
  },
  {
    facility: 'Dive & Walk',
    floor: 'R3F',
    pass: '大阪周遊卡可免費使用',
    highlight: '高空漫步 Walk 與高空彈跳 Dive；需先到 Satellite 報到。',
  },
]

const faqItems = [
  {
    q: '大阪周遊卡可以免費玩通天閣的哪些設施？',
    a: '目前一般展望台、TOWER SLIDER、Dive & Walk 都列在大阪周遊卡免費設施中；天望樂園／TIP THE TSUTENKAKU 則需要另外加價。每個設施都可能有指定時段與人數限制，持周遊卡也請先到現場櫃台預約入場時段。',
  },
  {
    q: '通天閣從哪一站、哪個出口走最順？',
    a: '想從北側逛進新世界，搭大阪 Metro 堺筋線到惠美須町站，走 3 號出口；從難波、天王寺或新今宮方向過來，搭到動物園前站走 1 號出口，再一路往北逛南陽通或新世界本通最順。',
  },
  {
    q: '天望樂園要另外付費嗎？',
    a: '要。它是位於 R5F 的戶外展望台，和一般展望台是不同體驗。這次現場加購為成人 300 日圓、兒童 200 日圓；票價與開放狀況可能調整，出發前請再看通天閣官方公告。',
  },
  {
    q: 'Tower Slider 和 Dive & Walk 有限制嗎？',
    a: '有。Tower Slider 目前限制身高 120cm 以上、體重未滿 120kg、7～65 歲；Dive & Walk 為身高 130cm 以上、體重未滿 120kg、9～65 歲，且不能穿裙裝、洋裝、拖鞋或高跟鞋。兩者都可能因天候暫停。',
  },
  {
    q: '通天閣要排多久？',
    a: '只上一般展望台可先抓 45～60 分鐘；若還要玩 Tower Slider 或 Dive & Walk，建議各另外保留 40～60 分鐘。傍晚後較容易滿，最好提早到場換票並預約時段。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tsutenkakuGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tsutenkakuGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tsutenkakuGuideCanonical,
  author: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/og-share.png`,
    },
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

type TsutenkakuGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video' || value === 'video') return '/osaka/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  if (value === 'pass-map' || value === 'osaka-pass-map') return '/osaka/pass-map'
  if (value === 'ticket' || value === 'osaka-ticket') return '/osaka/ticket'
  return '/osaka'
}

export default async function TsutenkakuGuidePage({ searchParams }: TsutenkakuGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CitySubpageHeader backHref={backHref} eventPrefix="tsutenkaku" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪・通天閣攻略"
          h1="通天閣攻略｜兩站出口、三條商店街、四個設施一次走懂"
          intro="通天閣不是只有上展望台：從惠美須町或動物園前走進新世界，先把三條商店街逛完，再用這篇的換票、樓層與設施動線玩到最順。拿大阪周遊卡的話，一般展望台、Tower Slider、Dive & Walk 都能免費使用。"
          eventPrefix="tsutenkaku"
          showVisual={false}
          ctaLinks={[
            { label: '兩站出口', href: '#access', dataEvent: 'tsutenkaku_hero_access', platform: 'article' },
            { label: '設施怎麼玩', href: '#facilities', dataEvent: 'tsutenkaku_hero_facilities', platform: 'article' },
            { label: '大阪周遊卡', href: '#amazing-pass', dataEvent: 'tsutenkaku_hero_pass', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="通天閣攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">北側進場</span>
              <strong>惠美須町站 3 號出口</strong>
              <p>接通天閣本通商店街，邊逛邊往通天閣走，是最直覺的北側動線。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">南側進場</span>
              <strong>動物園前站 1 號出口</strong>
              <p>可接南陽通（Janjan 橫丁）和新世界本通，適合先吃串炸再往北走。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">大阪周遊卡</span>
              <strong>3 項設施免費</strong>
              <p>一般展望台、Tower Slider、Dive & Walk 都可用；每項仍須現場預約時段。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">額外加購</span>
              <strong>R5F 天望樂園</strong>
              <p>在一般展望台上方的戶外景觀；這次現場加購為成人 ¥300、兒童 ¥200。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="通天閣短影音">
          <h2 className="seo-h2">先看短影音：通天閣現場動線</h2>
          <div className="seo-prose">
            <p>先用短影音看通天閣、新世界商店街與現場動線，再回來依這篇安排展望台、Tower Slider 與 Dive &amp; Walk，逛起來更順。</p>
            <SeoVideoLinkMenu label="通天閣" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="通天閣兩站出口與三條商店街">
          <h2 className="seo-h2">通天閣怎麼走：從兩個站出來，串三條商店街最順</h2>
          <div className="seo-prose">
            <p>
              通天閣位於新世界中心，北邊是惠美須町，南邊是動物園前與新今宮。第一次來不必只把目的地設成「通天閣」；選好進場方向，商店街、美食和拍照點會自然串成一條線。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>搭車站</th>
                    <th>出口</th>
                    <th>走法</th>
                    <th>適合誰</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRoutes.map((route) => (
                    <tr key={route.station}>
                      <td>{route.station}</td>
                      <td>{route.exit}</td>
                      <td>{route.route}</td>
                      <td>{route.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/tsutenkaku/shopping-streets-map.png"
                alt="從惠美須町站與動物園前站前往通天閣，以及通天閣本通、新世界本通、南陽通商店街的位置圖"
                width={1080}
                height={2160}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>把兩個出口與三條商店街先記住，就不會只走到通天閣拍照又折返。</figcaption>
            </figure>

            <h3 className="seo-h3">三條商店街怎麼逛？不只通天閣本通</h3>
            <ol>
              <li><strong>通天閣本通商店街：</strong>從惠美須町站 3 號出口往南最順，適合當北側進場主線。</li>
              <li><strong>新世界本通商店街：</strong>在通天閣東側一帶，穿梭在招牌、串炸店與新世界街景之間。</li>
              <li><strong>南陽通商店街（Janjan 橫丁）：</strong>從動物園前站方向往北最自然，是想先吃東西、再走到通天閣的選擇。</li>
            </ol>
            <p>
              建議北進南出或南進北出，不要原路來回。若從惠美須町進場，就走通天閣本通，再往新世界本通與南陽通方向收尾；若從動物園前進場則反過來走，最後從惠美須町離開。
            </p>
          </div>
        </section>

        <section className="seo-content" id="facilities" aria-label="通天閣四個設施與樓層">
          <h2 className="seo-h2">通天閣有四個設施：先搞懂哪三個可用大阪周遊卡</h2>
          <div className="seo-prose">
            <p>
              最容易混淆的是「展望台」並不只一種，另外還有滑梯與高空體驗。先用下面這張圖和表格辨認樓層；真正現場要玩時，再照後面的換票順序走。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/tsutenkaku/facilities-floors.png"
                alt="通天閣 5F 黃金展望台、R5F 天望樂園、3F Tower Slider、R3F Dive and Walk 樓層整理"
                width={943}
                height={1682}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>四個設施的位置：5F 黃金展望台、R5F 天望樂園、3F Tower Slider、R3F Dive &amp; Walk。</figcaption>
            </figure>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>設施</th>
                    <th>位置</th>
                    <th>大阪周遊卡</th>
                    <th>重點</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityRows.map((facility) => (
                    <tr key={facility.facility}>
                      <td>{facility.facility}</td>
                      <td>{facility.floor}</td>
                      <td>{facility.pass}</td>
                      <td>{facility.highlight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/tsutenkaku/tower-floor-guide.png"
                alt="通天閣從 B1 到 R5F 的樓層示意圖"
                width={943}
                height={1682}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從 B1、1F 進場後一路到 5F、R5F 的相對位置；不同設施的動線會分開。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="golden-observatory" aria-label="通天閣一般展望台與天望樂園動線">
          <h2 className="seo-h2">一般展望台與天望樂園：1F 換票後，先到 5F 再決定是否加購</h2>
          <div className="seo-prose">
            <p>
              想看一般展望台／黃金展望台的話，先在 <strong>1F Ticket Center</strong> 換票或預約時段；依現場引導前往 <strong>B1</strong> 排隊搭電梯，抵達 <strong>2F</strong> 後再轉展望電梯到 <strong>5F</strong>。這一段就是一般展望台的主體，也是拿大阪周遊卡最常會走的動線。
            </p>

            <h3 className="seo-h3">R5F 天望樂園：一般展望台上方的戶外版本</h3>
            <p>
              在 5F 看完後，想要更開闊、直接感受風的視野，再加購上 <strong>R5F 天望樂園</strong>。這裡包含戶外展望回廊與伸出塔外的 TIP THE TSUTENKAKU；此次現場加購是成人 <strong>¥300</strong>、兒童 <strong>¥200</strong>。它不在大阪周遊卡的免費設施內，且可能受下雨、強風或濃霧影響關閉，排進行程時不要把它當成保證項目。
            </p>
            <p>
              從 R5F 回來後走樓梯下到 4F，再搭電梯回 3F、2F 逛商店與展示，最後搭電梯回 B1，再走到 1F 離場。這樣不會漏掉 2F、3F 的購物區，也不用逆著人流找出口。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tower-slider" aria-label="Tower Slider 動線">
          <h2 className="seo-h2">TOWER SLIDER：1F 換票，走指定路線到 3F，一路滑回 B1</h2>
          <div className="seo-prose">
            <p>
              Tower Slider 是通天閣最有記憶點的設施：從 3F、地上約 22m 的入口出發，沿著塔外繞一圈半，約 10 秒滑到 B1。拿大阪周遊卡可免費體驗，但一樣要先在 <strong>1F Ticket Center</strong> 換票並預約時段。
            </p>
            <ol>
              <li>在 1F 換 Tower Slider 票券／預約時段。</li>
              <li>依工作人員引導前往 B1，再走專用動線到 3F 起點。</li>
              <li>戴好安全帽、使用滑行袋，從 3F 溜到 B1。</li>
              <li>結束後從 B1 回到 1F，或再接其他新世界行程。</li>
            </ol>
            <p>
              目前限制為身高 120cm 以上、體重未滿 120kg、7～65 歲；天候不佳可能停開。它不包含一般展望台門票，因此沒有周遊卡時，別把「滑梯票」誤認成「可上展望台」的套票。
            </p>
          </div>
        </section>

        <section className="seo-content" id="dive-walk" aria-label="Dive and Walk 動線">
          <h2 className="seo-h2">Dive &amp; Walk：先去 Satellite 報到穿裝備，再回通天閣上 R3F</h2>
          <div className="seo-prose">
            <p>
              Dive &amp; Walk 不是在 1F 櫃台直接開始。先到通天閣旁的 <a href={DIVE_WALK_SATELLITE_MAP} target="_blank" rel="noopener noreferrer" data-event="tsutenkaku_divewalk_satellite_map" data-platform="GoogleMap" data-section="article"><strong>TSUTENKAKU SATELLITE（Google Map）</strong></a> 報到、換票並穿戴裝備，再依時間回到通天閣 1F，往 R3F 進行體驗。你提供的現場告示也指向這個報到點，千萬不要只在主塔售票口排隊找它。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/tsutenkaku/dive-walk-satellite.jpg"
                alt="通天閣 Dive and Walk 需前往 Tsutenkaku Satellite 報到換票的現場告示"
                width={1365}
                height={2048}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>Dive &amp; Walk 要先到 TSUTENKAKU SATELLITE 報到，完成後再回主塔上 R3F。</figcaption>
            </figure>

            <h3 className="seo-h3">R3F 有兩個體驗：高空漫步 Walk、高空彈跳 Dive</h3>
            <p>
              Walk 是在中間展望台屋頂外圍、約地上 26m 的高度繫上安全繩繞行；Dive 則是從約地上 40m 的塔身中段，朝中間展望台方向跳下約 14m。兩個都比一般展望台刺激很多，也都必須戴安全帽與安全繩。
            </p>
            <p>
              大阪周遊卡可以使用 Dive &amp; Walk，但要注意它的限制比滑梯更嚴格：身高 130cm 以上、體重未滿 120kg、9～65 歲；裙裝、洋裝、拖鞋與高跟鞋都不能使用。天候、身體狀況或現場安全判斷也可能讓體驗暫停，因此建議先把它排在當天前段。
            </p>
          </div>
        </section>

        <section className="seo-content" id="amazing-pass" aria-label="大阪周遊卡使用通天閣攻略">
          <h2 className="seo-h2">大阪周遊卡怎麼用在通天閣？三個免費設施分開預約最穩</h2>
          <div className="seo-prose">
            <p>
              大阪周遊卡的通天閣項目不是「一張票走到底」，而是 <strong>一般展望台、Tower Slider、Dive &amp; Walk</strong> 三項各自列為免費設施。最實用的做法，是抵達後先問櫃台當天可預約的時段，再決定要先上展望台、玩滑梯或去 Satellite 報到。
            </p>
            <ol>
              <li><strong>一般展望台：</strong>在 1F 櫃台預約時段，照 B1 → 2F → 5F 動線上樓。</li>
              <li><strong>Tower Slider：</strong>確認專用時段，別和一般展望台安排得太近。</li>
              <li><strong>Dive &amp; Walk：</strong>先去 Satellite 報到，預留穿裝備與往返主塔的時間。</li>
              <li><strong>天望樂園：</strong>不在周遊卡免費範圍，想上去再現場加購即可。</li>
            </ol>
            <p>
              官方目前採入場時間預約制；即使持大阪周遊卡，也需要在現地窗口預約。傍晚後與假日的熱門時段可能額滿，想一次玩三項的話，建議開門後不久就先到新世界。
            </p>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="通天閣建議半日動線">
          <h2 className="seo-h2">通天閣半日動線：商店街、美食、三項周遊卡設施這樣排</h2>
          <div className="seo-prose">
            <ol>
              <li>從<strong>惠美須町站 3 號出口</strong>出來，沿通天閣本通往南逛。</li>
              <li>到 1F Ticket Center 先問一般展望台與 Tower Slider 的可預約時段。</li>
              <li>若要玩 Dive &amp; Walk，立刻走去 Satellite 報到，把體驗排在白天或天候較穩時段。</li>
              <li>依預約時間玩設施；中間空檔逛新世界本通、吃串炸或到南陽通（Janjan 橫丁）走走。</li>
              <li>最後從動物園前站 1 號出口離開，或反向從南往北走、由惠美須町站搭車。</li>
            </ol>
            <p>
              如果只想散步拍照，不必把四項全部塞進去；一般展望台加三條商店街已經很完整。想追求刺激再把 Tower Slider 和 Dive &amp; Walk 加進來，才不會整段新世界都在排隊。
            </p>
          </div>
        </section>

        <SeoCtaSection text="" href="/osaka/pass-map" linkText="查看大阪周遊卡免費設施地圖" newTab dataEvent="tsutenkaku_cta_passmap" />
        <SeoRelatedLinksSection
          title="通天閣周邊可以這樣接著玩"
          intro="想把新世界排得更完整，可接天王寺動物園與周遊券低調景點；出發前也可以在周遊券地圖確認當天設施的使用規則。"
          links={[
            { label: '大阪周遊券低調景點', href: '/osaka/osaka-amazing-pass-hidden-spots-guide?from=tsutenkaku-guide', event: 'tsutenkaku_related_hidden', primary: true },
            { label: '大阪周遊券地圖', href: '/osaka/pass-map?from=tsutenkaku-guide', event: 'tsutenkaku_related_passmap' },
          ]}
          purchaseLabel="購票"
          purchaseOptions={[
            { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312', event: 'tsutenkaku_purchase_kkday', platform: 'KKDAY' },
            { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798', event: 'tsutenkaku_purchase_klook', platform: 'KLOOK' },
            { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162', event: 'tsutenkaku_purchase_trip', platform: 'Trip' },
          ]}
        />
        <SeoFaqSection title="通天閣攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
