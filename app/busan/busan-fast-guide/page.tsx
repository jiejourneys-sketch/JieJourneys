import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { busanTicketCards } from '@/data/busan/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanFastGuideCanonical,
  busanFastGuideDescription,
  busanFastGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type BusanArea = {
  area: string
  group: string
  bestTime: string
  keywords: string
  suits: string
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  if (links.length === 0) return null

  return (
    <div className="seo-buy-links seo-action-links" aria-label={label}>
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.href)
        return (
          <a
            key={`${link.label}-${link.href}`}
            className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
            href={link.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            data-event={link.event}
            data-platform={link.platform}
            data-section="article_link"
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

function ticketLinksFor(title: string, eventPrefix: string): ActionLink[] {
  const card = busanTicketCards.find((item) => item.title === title)
  if (!card) return []

  return card.actions
    .filter((action) => action.platform !== 'article')
    .map((action) => {
      const platform = action.platform ?? action.label
      return {
        label: action.label,
        href: action.href,
        event: `${eventPrefix}_${platform.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
        platform,
        primary: action.className?.includes('primary') ?? false,
      }
    })
}

const linkGroups = {
  fastGuidePart1: [
    { label: '上集 IG Reels', href: 'https://www.instagram.com/reel/DK4dIqzzJBE/', event: 'busanfastguide_part1_ig', platform: 'IG', primary: true },
    { label: '上集 YouTube', href: 'https://www.youtube.com/shorts/r19k0otvGVE', event: 'busanfastguide_part1_yt', platform: 'YouTube' },
  ],
  fastGuidePart2: [
    { label: '下集 IG Reels', href: 'https://www.instagram.com/reel/DLCwV2yzbSv/', event: 'busanfastguide_part2_ig', platform: 'IG', primary: true },
    { label: '下集 YouTube', href: 'https://www.youtube.com/shorts/Mtn35FzOeis', event: 'busanfastguide_part2_yt', platform: 'YouTube' },
  ],
  gamcheonVideos: [
    { label: '甘川洞小王子 IG', href: 'https://www.instagram.com/reel/DL408o_ze1X/', event: 'busanfastguide_gamcheon_ig', platform: 'IG', primary: true },
    { label: '甘川洞小王子 YouTube', href: 'https://www.youtube.com/shorts/RZREPyNT-Fo', event: 'busanfastguide_gamcheon_yt', platform: 'YouTube' },
  ],
  towerVideos: [
    { label: '釜山塔 IG', href: 'https://www.instagram.com/reel/DMKh_XmzOdG/', event: 'busanfastguide_tower_ig', platform: 'IG' },
    { label: '釜山塔 YouTube', href: 'https://www.youtube.com/shorts/e3-R4YEj7Cw', event: 'busanfastguide_tower_yt', platform: 'YouTube' },
  ],
  haeundaeVideos: [
    { label: '海雲台 IG', href: 'https://www.instagram.com/reel/DLuh1WzzM0c/', event: 'busanfastguide_haeundae_ig', platform: 'IG', primary: true },
    { label: '海雲台 YouTube', href: 'https://www.youtube.com/shorts/T0aTv6PPxMQ', event: 'busanfastguide_haeundae_yt', platform: 'YouTube' },
  ],
  capsuleVideos: [
    { label: '膠囊列車 IG', href: 'https://www.instagram.com/reel/DMu5uZxTdO8/', event: 'busanfastguide_capsule_ig', platform: 'IG' },
    { label: '膠囊列車 YouTube', href: 'https://www.youtube.com/shorts/NojyZ8jfvD4', event: 'busanfastguide_capsule_yt', platform: 'YouTube' },
  ],
  yachtVideos: [
    { label: '遊艇 IG', href: 'https://www.instagram.com/reel/DVTW_MLkpj4/', event: 'busanfastguide_yacht_ig', platform: 'IG', primary: true },
    { label: '遊艇 YouTube', href: 'https://www.youtube.com/shorts/N56k5869RVw', event: 'busanfastguide_yacht_yt', platform: 'YouTube' },
  ],
  yachtArticle: [
    { label: '釜山遊艇比較', href: '/busan/busan-yacht-suyeong-diamond-bay?from=busan-fast-guide', event: 'busanfastguide_yacht_article', platform: 'article' },
  ],
  planning: [
    { label: '釜山景點地圖', href: '/busan/map?from=busan-fast-guide', event: 'busanfastguide_map', platform: 'map', primary: true },
    { label: '釜山住宿區域', href: '/busan/hotel?from=busan-fast-guide', event: 'busanfastguide_hotel', platform: 'hotel' },
    { label: '釜山交通攻略', href: '/busan/transport?from=busan-fast-guide', event: 'busanfastguide_transport', platform: 'transport' },
    { label: '釜山票券整理', href: '/busan/ticket?from=busan-fast-guide', event: 'busanfastguide_ticket', platform: 'ticket' },
    { label: '釜山通行證完整攻略', href: '/busan/visit-busan-pass?from=busan-fast-guide', event: 'busanfastguide_pass_article', platform: 'article' },
  ],
  towerTickets: ticketLinksFor('釜山塔', 'busanfastguide_tower_ticket'),
  capsuleTickets: ticketLinksFor('膠囊列車&海岸列車', 'busanfastguide_capsule_ticket'),
  songdoCableTickets: ticketLinksFor('松島海上纜車', 'busanfastguide_songdo_cable_ticket'),
  lotteTickets: ticketLinksFor('樂天世界', 'busanfastguide_lotte_ticket'),
}

const areaRows: BusanArea[] = [
  { area: '西面 Seomyeon', group: '上集主區', bestTime: '下午到晚上', keywords: '逛街、拍貼、流行店、美食、藥妝', suits: '想住中間、晚上想逛、第一次釜山想降低交通壓力' },
  { area: '南浦洞 Nampo', group: '上集主區', bestTime: '中午到晚上', keywords: 'BIFF廣場、富平罐頭市場、國際市場、釜山塔、甘川洞小王子', suits: '第一天想從市場小吃、舊市區和經典景點開始' },
  { area: '海雲台 Haeundae', group: '上集主區', bestTime: '早上到晚上', keywords: '沙灘、海景、藍線公園、膠囊列車、夜景', suits: '想要度假感、看海、把東釜山排成一整天' },
  { area: '松島 Songdo', group: '下集加分', bestTime: '白天到傍晚', keywords: '天空步道、海上纜車、濱海散步', suits: '想拍海景、走走放空，或和南浦洞排同一天' },
  { area: '廣安里 Gwangalli', group: '下集加分', bestTime: '晚上', keywords: '廣安大橋夜景、沙灘、咖啡廳、酒吧、遊艇', suits: '想把晚上留給夜景、海風和氣氛的人' },
  { area: '樂天世界＋海東龍宮寺', group: '下集加分', bestTime: '白天', keywords: '東釜山、遊樂園、雲霄飛車、海邊寺廟', suits: '主區玩完後想補親子、樂園或海邊寺廟路線' },
]

const faqItems = [
  {
    q: '第一次去釜山，先排哪三區最穩？',
    a: '先排西面、南浦洞、海雲台。西面負責逛街和轉乘，南浦洞負責市場與舊市區，海雲台負責海景與度假感。這三區抓住，釜山行程就不容易散掉。',
  },
  {
    q: '西面、南浦洞、海雲台住宿怎麼選？',
    a: '想交通平均、晚上好逛選西面；想吃市場、跑甘川洞與釜山塔選南浦洞；想每天看海、膠囊列車和東釜山景點優先選海雲台。',
  },
  {
    q: '南浦洞和小王子可以排同一天嗎？',
    a: '可以。小王子拍照點在甘川文化村，不是在南浦洞商圈裡，但兩者很適合同一天安排。白天去甘川洞，下午回南浦洞吃市場小吃，晚上接釜山塔或海邊夜景。',
  },
  {
    q: '松島和廣安里可以同一天嗎？',
    a: '可以，但節奏會比較偏拍照散步。松島適合白天到傍晚走天空步道、搭海上纜車；廣安里最好留晚上看廣安大橋，兩個中間交通要預留時間。',
  },
  {
    q: '樂天世界＋海東龍宮寺適合放哪一天？',
    a: '這組比較適合放在主區玩完後的一整天，因為位置在東釜山、機張一帶。早上可以先排海東龍宮寺，接著去樂天世界或附近 Outlet，晚上再回海雲台或西面。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanFastGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanFastGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanFastGuideCanonical,
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

type BusanFastGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  if (value === 'hotel' || value === 'busan-hotel') return '/busan/hotel'
  if (value === 'transport' || value === 'busan-transport') return '/busan/transport'
  if (value === 'pass-map' || value === 'busan-pass-map') return '/busan/pass-map'
  return '/busan'
}

export default async function BusanFastGuidePage({ searchParams }: BusanFastGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanfastguide" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山最速攻略"
          h1="釜山最速攻略｜搞懂六個區域，行程排起來最順"
          intro="第一次釜山自由行，不需要先背一長串景點名。先把釜山拆成三個主區：西面、南浦洞、海雲台，再把松島、廣安里、樂天世界＋海東龍宮寺當成加分景點補進去，行程會立刻清楚很多。"
          eventPrefix="busanfastguide"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'busanfastguide_hero_quick', platform: 'article' },
            { label: '區域比較', href: '#comparison', dataEvent: 'busanfastguide_hero_comparison', platform: 'article' },
            { label: '行程排法', href: '#sample-routes', dataEvent: 'busanfastguide_hero_routes', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山最速攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">上集主區 1</span>
              <strong>西面 Seomyeon</strong>
              <p>釜山市中心和轉乘核心，晚上逛街、美食、拍貼、藥妝都方便。想住中間，西面很穩。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">上集主區 2</span>
              <strong>南浦洞 Nampo</strong>
              <p>市場小吃最密集，BIFF廣場、富平罐頭市場、釜山塔、甘川洞小王子可以串成舊市區一日線。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">上集主區 3</span>
              <strong>海雲台 Haeundae</strong>
              <p>釜山度假代表，沙灘、海景、藍線公園、膠囊列車一次滿足，適合排成東釜山主軸。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">下集加分</span>
              <strong>松島、廣安里、樂天世界＋海東龍宮寺</strong>
              <p>主區玩順後再補：松島看濱海步道，廣安里看夜景，樂天世界和海東龍宮寺放東釜山一整天。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山最速攻略短影音">
          <h2 className="seo-h2">先看短影音：上集抓主區，下集補景點</h2>
          <div className="seo-prose">
            <p>
              這篇是釜山最速攻略上、下集的文字版。上集先把西面、南浦洞、海雲台三個最常用的主區講清楚；下集再把松島、廣安里、樂天世界＋海東龍宮寺放進行程。你可以先看影片抓畫面感，再用這篇排每天動線。
            </p>
            <SeoVideoLinkMenu label="最速攻略｜上集" links={linkGroups.fastGuidePart1} />
            <SeoVideoLinkMenu label="最速攻略｜下集" links={linkGroups.fastGuidePart2} />
            <p>
              如果你已經決定要走南浦洞或海雲台，也可以先補單點實拍：甘川洞小王子、釜山塔、海雲台和膠囊列車，剛好是第一次釜山最常卡住的幾個畫面。
            </p>
            <SeoVideoLinkMenu label="甘川洞小王子" links={linkGroups.gamcheonVideos} />
            <SeoVideoLinkMenu label="釜山塔" links={linkGroups.towerVideos} />
            <SeoVideoLinkMenu label="海雲台" links={linkGroups.haeundaeVideos} />
            <SeoVideoLinkMenu label="膠囊列車" links={linkGroups.capsuleVideos} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="釜山區域比較表">
          <h2 className="seo-h2">釜山六個區域比較：位置、亮點、適合誰</h2>
          <div className="seo-prose">
            <p>
              釜山的重點不是把六區全部塞進同一天，而是看你住哪裡、每天從哪個方向開始。西面偏城市中心，南浦洞偏舊市區，海雲台偏海景度假；松島、廣安里、樂天世界和海東龍宮寺則看天數與體力再加。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>區域</th>
                    <th>分類</th>
                    <th>建議時間</th>
                    <th>重點</th>
                    <th>適合族群</th>
                  </tr>
                </thead>
                <tbody>
                  {areaRows.map((row) => (
                    <tr key={row.area}>
                      <td>{row.area}</td>
                      <td>{row.group}</td>
                      <td>{row.bestTime}</td>
                      <td>{row.keywords}</td>
                      <td>{row.suits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="main-areas" aria-label="釜山上集三大主區">
          <h2 className="seo-h2">釜山最速攻略上集：三個主區先搞懂</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">西面 Seomyeon：年輕人最愛的逛街聖地</h3>
            <p>
              西面是釜山最像市中心的地方，也是地鐵 1 號線和 2 號線交會的核心。這裡白天可以逛百貨、流行店、藥妝和咖啡廳，晚上人潮和餐廳更熱鬧，拍貼店、地下街、餐酒館都集中。第一次釜山如果還不確定要住南浦洞還是海雲台，西面通常是最平均的選項。
            </p>
            <p>
              我會把西面放在「行程緩衝區」來看：白天從這裡出發去南浦洞或海雲台，晚上回來再逛街吃宵夜。它不是最海景、也不是最傳統，但最方便補購物、補晚餐、補交通。
            </p>

            <h3 className="seo-h3">南浦洞 Nampo：市場小吃、釜山塔、小王子同一側</h3>
            <p>
              南浦洞很適合放第一天，因為一開始就能進入「釜山很會吃」的節奏。BIFF廣場、國際市場、富平罐頭市場都在這一帶，白天逛市場小吃，傍晚接釜山塔看城市夜景，節奏很直覺。
            </p>
            <p>
              小王子拍照點在甘川文化村，不是在南浦洞商圈裡，但它和南浦洞非常適合同一天排。建議白天先去甘川洞文化村拍彩色山城和小王子，下午回南浦洞吃市場，晚上看釜山塔或沿海邊走。想把這一區排成完整一天，可以接著看
              <a
                href="/busan/nampo-dong-guide?from=busan-fast-guide"
                data-event="busanfastguide_nampo_article"
                data-platform="article"
                data-section="article"
              >
                <strong>南浦洞攻略</strong>
              </a>
              。釜山塔如果確定要上展望台，也可以先看
              <a
                href="/busan/busan-tower-guide?from=busan-fast-guide"
                data-event="busanfastguide_tower_article"
                data-platform="article"
                data-section="article"
              >
                <strong>釜山塔攻略</strong>
              </a>
              ，再確認票價和可入場時段。
            </p>
            <ActionLinks label="釜山塔購票連結" links={linkGroups.towerTickets} />

            <h3 className="seo-h3">海雲台 Haeundae：沙灘、海景、膠囊列車一次滿足</h3>
            <p>
              海雲台是釜山最有度假感的區域。早上看海、沿沙灘走走，下午去藍線公園搭海岸列車或膠囊列車，傍晚可以接青沙浦、尾浦或海邊咖啡廳，晚上再看海岸夜景。想把海雲台大道、市場、海灘、X the SKY、膠囊列車和海理團路一次排順，可以先看
              <a
                href="/busan/haeundae-guide?from=busan-fast-guide"
                data-event="busanfastguide_haeundae_article"
                data-platform="article"
                data-section="article"
              >
                <strong>海雲台攻略</strong>
              </a>
              。想把釜山排得舒服一點，海雲台最好不要只留兩小時。
            </p>
            <p>
              膠囊列車熱門時段通常比較需要先處理，因為它不像逛街那樣可以隨時替換。行程上我會把海雲台排成半天到一天：海灘散步、膠囊列車、海景咖啡或 Busan X the Sky 擇一，不要全部硬塞。
            </p>
            <ActionLinks label="膠囊列車與海岸列車購票連結" links={linkGroups.capsuleTickets} />
          </div>
        </section>

        <section className="seo-content" id="bonus-areas" aria-label="釜山下集三個加分景點">
          <h2 className="seo-h2">釜山最速攻略下集：主區玩完，再補這三個</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">松島 Songdo：天空步道＋海上纜車的濱海路線</h3>
            <p>
              松島適合想拍海、走步道、不要太趕的人。天空步道可以看海面和海岸線，海上纜車則把視角拉到空中，整段是很輕鬆的濱海路線。它和南浦洞距離相對順，常見排法是上午南浦洞或甘川洞，下午接松島散步搭纜車。
            </p>
            <p>
              松島不是非去不可的主區，但很適合拿來補一段「釜山靠海」的畫面。想搭海上纜車的話，可以先在這裡看票價和可用方案，不需要為了其他免費散步點另外硬買。
            </p>
            <ActionLinks label="松島海上纜車購票連結" links={linkGroups.songdoCableTickets} />

            <h3 className="seo-h3">廣安里 Gwangalli：廣安大橋夜景直接封神</h3>
            <p>
              廣安里最強的是晚上。沙灘前方就是廣安大橋，沿岸一整排咖啡廳、酒吧和餐廳，坐在海邊吹風會比白天更有記憶點。它適合排在海雲台之後，白天看海或搭膠囊列車，晚上移動到廣安里看橋景。
            </p>
            <p>
              如果你想把廣安里玩得更有畫面，可以加遊艇。水營灣遊艇偏拍照和夜景氛圍，鑽石灣遊艇則適合搭配釜山通行證，比較方式可以接著看遊艇整理。
            </p>
            <SeoVideoLinkMenu label="遊艇" links={linkGroups.yachtVideos} />
            <ActionLinks label="遊艇比較" links={linkGroups.yachtArticle} />

            <h3 className="seo-h3">樂天世界＋海東龍宮寺：東釜山加分一日線</h3>
            <p>
              樂天世界和海東龍宮寺都在東釜山、機張方向，適合放在海雲台或東釜山行程後段。海東龍宮寺是海邊寺廟，早上去比較舒服；樂天世界則適合親子、情侶或想玩雲霄飛車、摩天輪的人。
            </p>
            <p>
              這組不建議塞進南浦洞同一天，因為距離和方向都會拉長。比較順的做法是住海雲台時安排一整天，早上寺廟、下午樂天世界或 Outlet，晚上再回海雲台休息。
            </p>
            <ActionLinks label="樂天世界購票連結" links={linkGroups.lotteTickets} />
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="釜山最速攻略行程排法">
          <h2 className="seo-h2">第一次釜山自由行：三天到五天怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">三天兩夜：抓三大主區就好</h3>
            <ol>
              <li>第一天：南浦洞、BIFF廣場、富平罐頭市場、甘川洞文化村、釜山塔。</li>
              <li>第二天：海雲台海灘、藍線公園、膠囊列車，晚上去廣安里看廣安大橋。</li>
              <li>第三天：西面逛街、拍貼、買藥妝和伴手禮，再看班機時間補咖啡廳或市場。</li>
            </ol>

            <h3 className="seo-h3">四天三夜：加松島或東釜山</h3>
            <p>
              多一天時，我會先看你比較想拍海景還是玩樂園。想輕鬆拍照，就把松島加進南浦洞那側；想玩遊樂設施和海邊寺廟，就把樂天世界＋海東龍宮寺排成東釜山一日線。
            </p>

            <h3 className="seo-h3">五天四夜：主區分開住也可以</h3>
            <p>
              五天以上就可以把住宿拆成兩段：前半住南浦洞或西面，後半住海雲台。這樣舊市區、海景、廣安里夜景和東釜山都不用來回拉太遠，行程會舒服很多。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="釜山後續規劃">
          <h2 className="seo-h2">接著把地圖、住宿、交通和票券補齊</h2>
          <div className="seo-prose">
            <p>
              區域抓好之後，就不要再只看景點清單。先用地圖確認每一天的位置，再看住宿區、交通方式和需要先訂的票券。釜山通行證也建議等行程大概成形後再算，才不會買了卻用不到。
            </p>
            <ActionLinks label="釜山行程工具與延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="釜山最速攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
