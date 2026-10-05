import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoStationGuideCanonical,
  kyotoStationGuideDescription,
  kyotoStationGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const faqItems = [
  {
    q: '京都車站的中央口和新幹線中央口是一樣的地方嗎？',
    a: '不是。北側面向京都塔、市區巴士總站的是 JR 在來線一側的「中央口」；新幹線大廳裡的「新幹線中央口」雖然名字相同，但出站後是在南側八條口方向。第一次來請先看指標上的「Central Exit」或「Hachijo Exit」，不要只看「中央」兩個字。',
  },
  {
    q: '從關西機場搭 HARUKA 抵達京都後，要走哪一側？',
    a: 'HARUKA 抵達 JR 京都站後，先依下一段行程選方向：要搭京都市區巴士、前往京都塔或市區，往北側中央口；要轉新幹線、近鐵去奈良或使用八條口一帶交通，往南側八條口。不要跟著人流直接出站，先看目的地再選出口。',
  },
  {
    q: '京都車站南北兩側可以不用走到站外繞路嗎？',
    a: '可以。出閘後依「南北自由通路」指標上 2F，就能在中央口側與八條口側之間移動。轉換出口前，先利用這條通路確認方向，比拉著行李走到站外再繞回來輕鬆。',
  },
  {
    q: '要搭近鐵去奈良，京都車站怎麼走比較好？',
    a: '近鐵京都站在南側八條口方向。從 JR 或 HARUKA 下車後，先跟著八條口、近鐵線的站內指標走；若已到北側中央口，回到站內上 2F 南北自由通路再轉到南側即可。',
  },
  {
    q: '京都車站除了搭車，還有什麼可以逛？',
    a: '從北側往上走，可先到 4F 烏丸小路廣場看京都塔；再到 10F 走空中徑路 Skyway，接著逛京都拉麵小路。大階段從 4F 一路延伸到 11F，晚上有 LED 燈光演出，很適合在搭車、入住或離開京都前留一段時間慢慢逛。',
  },
  {
    q: '空中徑路、拉麵小路與大階段怎麼一次走？',
    a: '先由北側的大廳依 4F、10F 的指標往上；空中徑路在 10F，可從高處穿越車站建築。拉麵小路也在 10F、大階段南側；看完後可沿著大階段往下，或依指標返回中央口與各月台。店家營業時間、活動與部分設施開放狀況以現場公告為準。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoStationGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoStationGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoStationGuideCanonical,
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

type KyotoStationGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoStationGuidePage({ searchParams }: KyotoStationGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotostation" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都車站攻略"
          h1="京都車站攻略｜南北出口、空中徑路、大階段與拉麵小路一次懂"
          intro="京都車站不只是轉車與搭巴士的地方。先記住北側中央口、南側八條口與 2F 南北自由通路，再從北側一路往上逛 4F 烏丸小路廣場、10F 空中徑路、拉麵小路與大階段，抵達日或離開前都能排進行程。"
          eventPrefix="kyotostation"
          showVisual={false}
          ctaLinks={[
            { label: '南北出口', href: '#north-south', dataEvent: 'kyotostation_hero_exits', platform: 'article' },
            { label: 'HARUKA 抵達後', href: '#haruka', dataEvent: 'kyotostation_hero_haruka', platform: 'article' },
            { label: '2F 自由通路', href: '#passage', dataEvent: 'kyotostation_hero_passage', platform: 'article' },
            { label: '車站隱藏景點', href: '#hidden-spots', dataEvent: 'kyotostation_hero_hidden_spots', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="京都車站快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">北側</span>
              <strong>中央口＝京都塔、市區巴士總站</strong>
              <p>前往市區景點、京都塔，或要轉乘市內巴士時，先往這一側找出口。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">南側</span>
              <strong>八條口＝新幹線、近鐵京都站</strong>
              <p>搭新幹線、近鐵去奈良，或要使用八條口一帶交通時，走南側較順。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">關西機場抵達</span>
              <strong>HARUKA 下車後先看下一站</strong>
              <p>不要急著跟人群出站；市區巴士走北側，轉新幹線或近鐵走南側。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">兩側互通</span>
              <strong>2F 南北自由通路</strong>
              <p>出閘後直接上 2F 依指標通過，不必拉著行李繞到站外。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="north-south" aria-label="京都車站北側中央口與南側八條口">
          <h2 className="seo-h2">先搞懂南北側｜北側中央口，南側八條口</h2>
          <div className="seo-prose">
            <p><strong>第一次在京都車站迷路，通常不是找不到月台，而是不知道自己該往南還是北。</strong> 車站往外的大出口主要分為兩側：北側是<strong>中央口</strong>，南側是<strong>八條口</strong>。不需要把所有出口名稱背起來，只要先用目的地判斷方向即可。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-north-south-cheatsheet.png"
                alt="京都車站南側八條口、北側中央口與二樓南北自由通路的快速動線整理圖"
                width={941}
                height={1672}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>先選對出口再找月台：南側八條口接新幹線、近鐵與奈良方向；北側中央口接京都塔、市區巴士與市區觀光。</figcaption>
            </figure>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">目的地／下一段交通</th>
                    <th scope="col">先找的方向</th>
                    <th scope="col">記憶方式</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>京都塔、京都市區巴士總站、市區景點</td>
                    <td><strong>北側・中央口</strong></td>
                    <td>看到京都塔的那一側，就是中央口方向。</td>
                  </tr>
                  <tr>
                    <td>新幹線、近鐵京都站、前往奈良</td>
                    <td><strong>南側・八條口</strong></td>
                    <td>南側可看到八條口、八條西口等指標；依近鐵或新幹線指示走。</td>
                  </tr>
                  <tr>
                    <td>已走錯側、要換另一邊</td>
                    <td><strong>2F 南北自由通路</strong></td>
                    <td>回到站內往 2F，不必出到馬路上繞行。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-north-south-map.png"
                alt="京都車站站內地圖，標示北側中央口、南側八條西口與兩側方向"
                width={767}
                height={1536}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>先用「北側中央口／南側八條口」辨認方向；圖中的八條西口位在南側，是轉往近鐵與新幹線一帶時常見的出口名稱。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="haruka" aria-label="從關西機場搭 HARUKA 抵達京都車站">
          <h2 className="seo-h2">搭 HARUKA 到京都後怎麼走？先決定要往北還是往南</h2>
          <div className="seo-prose">
            <p>從關西機場搭 HARUKA 抵達京都時，最容易發生的狀況是：看到「中央口」就直覺往外走，卻發現和新幹線、近鐵的方向不同。正確做法是<strong>先想下一段要去哪裡</strong>，再依站內指標選出口。</p>

            <ol>
              <li><strong>要去京都市區：</strong>例如先到京都塔、搭市區巴士去清水寺、祇園或其他景點，往<strong>北側中央口</strong>走。</li>
              <li><strong>要轉新幹線或近鐵：</strong>例如續搭新幹線、或搭近鐵去奈良，往<strong>南側八條口</strong>方向走。</li>
              <li><strong>要找地下鐵或飯店：</strong>先依飯店最近車站判斷。京都車站本身的地下鐵烏丸線在站體地下，若目的地在市中心，不一定要先走到巴士總站。</li>
            </ol>

            <h3 className="seo-h3">最容易混淆：新幹線「中央口」不等於車站北側「中央口」</h3>
            <p>新幹線大廳的<strong>新幹線中央口</strong>是新幹線剪票口名稱，和面向京都塔的 JR 在來線<strong>中央口</strong>不是同一個概念。若你的目的地是北側巴士總站，請繼續看站內的 Central Exit／市區巴士等指示；若是轉近鐵或走八條口，才往新幹線一帶的南側方向移動。</p>
          </div>
        </section>

        <section className="seo-content" id="passage" aria-label="京都車站二樓南北自由通路">
          <h2 className="seo-h2">走錯出口不用重來｜2F 南北自由通路直接互通</h2>
          <div className="seo-prose">
            <p>南北兩側不是完全分開的車站。出閘後，跟著<strong>「南北自由通路」</strong>指標上到 2F，就能穿過站體，從中央口側移到八條口側，或反方向回到北側。拖著行李時，這比先走到地面、穿越外面道路再找入口簡單得多。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-north-to-south-passage.png"
                alt="從京都車站北側前往二樓南北自由通路的實景，標示電扶梯與通路方向"
                width={1014}
                height={1800}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從北側中央口方向進站後，依南北自由通路指標搭電扶梯上 2F，即可穿越到八條口側。</figcaption>
            </figure>

            <p>實際走法記成三步就好：<strong>確認自己目前在南還是北 → 尋找 2F／南北自由通路標示 → 到另一側再下到目的出口。</strong> 若只是要轉乘，不確定該不該出站時，也先停下來看指標；京都車站的「出口」與「轉乘剪票口」名稱很像，越急著跟人流走越容易走錯。</p>

            <h3 className="seo-h3">京都車站只要記住這三句</h3>
            <ul>
              <li><strong>北側＝中央口：</strong>京都塔、市區巴士總站。</li>
              <li><strong>南側＝八條口：</strong>新幹線、近鐵京都站與奈良方向。</li>
              <li><strong>2F＝南北自由通路：</strong>兩側互換不用繞到車站外。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="hidden-spots" aria-label="京都車站隱藏景點">
          <h2 className="seo-h2">京都車站不只轉車｜從北側一路往上的 4 個隱藏景點</h2>
          <div className="seo-prose">
            <p>很多人從中央口出站、搭完巴士就離開了；其實京都車站的高處空間很值得專程留半小時到一小時。<strong>最簡單的走法是從北側大廳開始往上，先到 4F 看京都塔，再到 10F 走空中徑路與拉麵小路，最後沿著大階段慢慢往下。</strong> 不用另外搭車，雨天、抵達日或回程前都很好安排。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-north-side-escalators.png"
                alt="從京都車站北側大廳往上前往四樓與十樓的電扶梯動線實景"
                width={1010}
                height={1800}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從北側中央口方向進入大廳後，依上層廣場與 4F、10F 指標一路往上；不用出站，也能把車站建築本身排成一段散步。</figcaption>
            </figure>

            <h3 className="seo-h3">4F｜烏丸小路廣場：用不同角度看京都塔</h3>
            <p>烏丸小路廣場位在京都站大樓 4F 東側，位置正好和昔日平安京的烏丸小路、現在的烏丸通大致重疊。它不是需要特別買票的觀景台，而是適合在搭車空檔上來停一下的開放空間；從這裡望向北側，京都塔與巨大站體會同時入鏡，白天看結構感、晚上則多了燈光氛圍。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-karasuma-square-kyoto-tower.jpg"
                alt="夜晚從京都車站北側一帶欣賞京都塔與 KYOTO 燈飾"
                width={1728}
                height={3072}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>晚上抬頭看京都塔，車站周邊的燈光讓北側和白天呈現完全不同的氣氛。</figcaption>
            </figure>

            <h3 className="seo-h3">10F｜空中徑路 Skyway：從高處穿越整座京都車站</h3>
            <p>繼續往上到 10F，找<strong>「空中徑路 Skyway」</strong>的指標。這條全長約 185 公尺、高約 45 公尺的空中廊道連接站體東西兩側，走在裡面可以俯看巨大挑高空間、月台與人流，也能望向京都北側的城市景色。第一次到京都站，這裡最能感受建築尺度有多驚人。</p>

            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-station-skyway-ramen-staircase-route.png"
                alt="京都車站北側前往空中徑路、京都拉麵小路與大階段的站內位置圖"
                width={1006}
                height={1332}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從北側往上後，空中徑路、拉麵小路與大階段都在同一個上層區域；不用反覆回到車站外找路。</figcaption>
            </figure>

            <h3 className="seo-h3">10F｜京都拉麵小路：不知道吃什麼就往大階段南側走</h3>
            <p>空中徑路另一側就是<strong>京都拉麵小路</strong>，位置在 10F、大階段南側。這裡集合多間來自日本各地的拉麵店，適合抵達晚、轉車時間有限，或逛完車站不想再花時間找餐廳的時候。各店營業時間與排隊狀況不同，想吃熱門店可多留一些等候時間。</p>

            <h3 className="seo-h3">大階段：白天看建築，晚上看 LED 燈光演出</h3>
            <p>京都車站的大階段由 4F 一路延伸到 11F，共 171 階、高低差約 35 公尺，是整座站體最有記憶點的空間之一。白天可從不同樓層感受鋼構與挑高設計；晚上則會亮起約 15,000 顆 LED 形成的季節性圖樣。走完空中徑路與拉麵小路後，沿著大階段慢慢往下，就是最順的收尾方式。</p>
          </div>
        </section>

        <section className="seo-content" aria-label="京都車站行程安排">
          <h2 className="seo-h2">抵達京都第一天怎麼排？先轉乘，還是先逛車站？</h2>
          <div className="seo-prose">
            <p>若飯店在京都站周邊，可先寄放行李，再依當天主區域出發：東山、祇園等市區景點多會從北側巴士總站或地下鐵方向開始；安排奈良一日遊、新幹線移動，則從南側八條口與近鐵一帶接續。抵達日還有空檔時，就把 4F 到 10F 的車站散步排在晚餐前或回飯店前；若剛好晚上抵達，大階段與京都塔夜景會比硬塞遠一點的景點更適合。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          intro="先把京都車站的南北方向記住，再把 4F 到 10F 的建築散步留進抵達日或離開前；接著依區域決定每天住哪裡、去哪裡與怎麼轉車，會比把熱門景點硬排在同一天更順。"
          links={[
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide?from=kyoto-station-guide', event: 'kyotostation_related_areas', primary: true },
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide?from=kyoto-station-guide', event: 'kyotostation_related_spots' },
            { label: '大阪・京都・奈良旅杰地圖', href: '/osaka/map?from=kyoto-station-guide', event: 'kyotostation_related_map' },
            { label: '京都奈良通訊／交通', href: '/kyoto-nara/transport?from=kyoto-station-guide', event: 'kyotostation_related_transport' },
          ]}
        />
        <SeoFaqSection title="京都車站常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
