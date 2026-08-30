import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { tokyoTicketCards } from '@/data/tokyo/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyo9AreasGuideCanonical,
  tokyo9AreasGuideDescription,
  tokyo9AreasGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type TokyoArea = {
  area: string
  side: string
  bestTime: string
  keywords: string
  suits: string
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
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
  const card = tokyoTicketCards.find((item) => item.title === title)
  if (!card) return []

  return card.actions.map((action) => ({
    label: action.label,
    href: action.href,
    event: `${eventPrefix}_${action.platform.toLowerCase()}`,
    platform: action.platform,
    primary: action.className.includes('primary'),
  }))
}

const linkGroups = {
  videos: [
    { label: 'IG Reels', href: 'https://www.instagram.com/reel/DVlYnZjksc7/', event: 'tokyo9areas_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/ca2ny5UJb4k', event: 'tokyo9areas_video_yt', platform: 'YouTube' },
  ],
  asakusaVideos: [
    { label: '淺草寺 IG', href: 'https://www.instagram.com/reel/DXRh-ucSyoW/', event: 'tokyo9areas_asakusa_ig', platform: 'IG', primary: true },
    { label: '淺草寺 YouTube', href: 'https://www.youtube.com/shorts/l893qAnt7TI', event: 'tokyo9areas_asakusa_yt', platform: 'YouTube' },
  ],
  skytreeVideos: [
    { label: '晴空塔 IG', href: 'https://www.instagram.com/reel/DV3aGGdFNsc/', event: 'tokyo9areas_skytree_ig', platform: 'IG' },
    { label: '晴空塔 YouTube', href: 'https://www.youtube.com/shorts/Q-zM2k47oVY', event: 'tokyo9areas_skytree_yt', platform: 'YouTube' },
  ],
  meijiVideos: [
    { label: '明治神宮 IG', href: 'https://www.instagram.com/reel/DWte3LWzhea/', event: 'tokyo9areas_meiji_ig', platform: 'IG', primary: true },
    { label: '明治神宮 YouTube', href: 'https://www.youtube.com/shorts/SPeJ3kugpu8', event: 'tokyo9areas_meiji_yt', platform: 'YouTube' },
  ],
  shibuyaSkyVideos: [
    { label: 'SHIBUYA SKY IG', href: 'https://www.instagram.com/reel/DWJbrmXFDuf/', event: 'tokyo9areas_shibuya_sky_ig', platform: 'IG' },
    { label: 'SHIBUYA SKY YouTube', href: 'https://www.youtube.com/shorts/Y0mGY55bSFs', event: 'tokyo9areas_shibuya_sky_yt', platform: 'YouTube' },
  ],
  planning: [
    { label: '東京景點地圖', href: '/tokyo/map?from=tokyo-9-areas-guide', event: 'tokyo9areas_map', platform: 'map', primary: true },
    { label: '東京住宿區域', href: '/tokyo/hotel?from=tokyo-9-areas-guide', event: 'tokyo9areas_hotel', platform: 'hotel' },
    { label: '東京交通攻略', href: '/tokyo/transport?from=tokyo-9-areas-guide', event: 'tokyo9areas_transport', platform: 'transport' },
    { label: '東京地鐵券完整攻略', href: '/tokyo/tokyo-subway-ticket?from=tokyo-9-areas-guide', event: 'tokyo9areas_subway_article', platform: 'article' },
  ],
  skytreeTickets: ticketLinksFor('晴空塔', 'tokyo9areas_skytree_ticket'),
  shibuyaSkyTickets: ticketLinksFor('SHIBUYA SKY', 'tokyo9areas_shibuya_sky_ticket'),
}

const areaRows: TokyoArea[] = [
  { area: '上野', side: '右半部 / 東側', bestTime: '上午到下午', keywords: '恩賜公園、阿美橫町、博物館散步', suits: '想慢慢逛、公園散步、順路買零食的人' },
  { area: '淺草寺', side: '右半部 / 東側', bestTime: '早上或傍晚', keywords: '雷門、仲見世、和風街景', suits: '第一次東京、想拍經典地標的人' },
  { area: '晴空塔', side: '右半部 / 東側', bestTime: '下午到晚上', keywords: '夜景、商場、東京天際線', suits: '想看高空景色、和淺草排同一天的人' },
  { area: '皇居', side: '中間 / 市中心', bestTime: '早上', keywords: '市中心綠地、外苑、東京車站周邊', suits: '喜歡散步、想把行程排清爽的人' },
  { area: '銀座', side: '中間 / 市中心', bestTime: '下午到晚上', keywords: '百貨精品、咖啡、甜點、街景', suits: '想逛街、吃下午茶、買精品的人' },
  { area: '築地市場', side: '中間 / 市中心', bestTime: '早上到中午', keywords: '壽司、生魚片、海鮮小吃', suits: '想吃海鮮早餐或午餐的人' },
  { area: '新宿', side: '左半部 / 西側', bestTime: '傍晚到晚上', keywords: '高樓夜景、歌舞伎町、百貨商圈', suits: '想看夜景、逛到晚、住西側的人' },
  { area: '原宿', side: '左半部 / 西側', bestTime: '中午到下午', keywords: '竹下通、潮流文化、表參道', suits: '喜歡年輕街頭風格、想逛選物的人' },
  { area: '澀谷', side: '左半部 / 西側', bestTime: '下午到晚上', keywords: '十字路口、SHIBUYA SKY、購物', suits: '想看東京城市感、拍夜景的人' },
]

const faqItems = [
  {
    q: '第一次東京，9 大區域要怎麼排最順？',
    a: '先分成東側、市中心、西側三區，不要每天東西橫跨。第一天排上野、淺草寺、晴空塔；第二天排築地、銀座、皇居；第三天排原宿、澀谷、新宿，節奏會比較舒服。',
  },
  {
    q: '上野、淺草寺、晴空塔可以排同一天嗎？',
    a: '可以，而且很適合排同一天。上野適合早上或中午散步逛阿美橫町，淺草寺拍雷門和仲見世，最後去晴空塔逛商場和看夜景。',
  },
  {
    q: '銀座、築地市場、皇居怎麼排？',
    a: '我會把築地市場放早上或中午，接著去銀座逛街喝咖啡，再依體力排皇居外苑或東京車站周邊。皇居如果想散步舒服，早上會比下午更清爽。',
  },
  {
    q: '新宿、原宿、澀谷可以一天跑完嗎？',
    a: '可以，但不要塞太多室內景點。中午原宿和表參道，下午澀谷十字路口和 SHIBUYA SKY，晚上再去新宿看高樓夜景或歌舞伎町，動線會比較順。',
  },
  {
    q: '晴空塔和 SHIBUYA SKY 只能選一個，怎麼選？',
    a: '想配淺草、看更完整的東京天際線，就選晴空塔；想拍澀谷街景、戶外感和夕陽城市氛圍，就選 SHIBUYA SKY。第一次東京如果時間夠，兩個分開排在東側與西側行程最好。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyo9AreasGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyo9AreasGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyo9AreasGuideCanonical,
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

type Tokyo9AreasGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'tokyo-video') return '/tokyo/video'
  if (value === 'map' || value === 'tokyo-map') return '/tokyo/map'
  if (value === 'ticket' || value === 'tokyo-ticket') return '/tokyo/ticket'
  if (value === 'hotel' || value === 'tokyo-hotel') return '/tokyo/hotel'
  if (value === 'transport' || value === 'tokyo-transport') return '/tokyo/transport'
  if (value === 'sensoji-guide') return '/tokyo/sensoji-guide'
  if (value === 'skytree-guide') return '/tokyo/skytree-guide'
  if (value === 'meiji-jingu-guide') return '/tokyo/meiji-jingu-guide'
  if (value === 'shibuya-sky-guide') return '/tokyo/shibuya-sky-guide'
  return '/tokyo'
}

export default async function Tokyo9AreasGuidePage({ searchParams }: Tokyo9AreasGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyo9areas" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京市區景點攻略"
          h1="東京市區 9 大區域景點攻略｜上野、淺草、晴空塔、銀座、新宿、澀谷怎麼排？"
          intro="第一次東京自由行，最怕的不是景點太少，而是把東側、西側、市中心混在同一天跑到崩潰。這篇把東京市區常見 9 個區域分成右半部、中間區域、左半部，直接用動線幫你判斷哪些景點適合同一天。"
          eventPrefix="tokyo9areas"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyo9areas_hero_quick', platform: 'article' },
            { label: '9 區比較', href: '#comparison', dataEvent: 'tokyo9areas_hero_comparison', platform: 'article' },
            { label: '行程排法', href: '#sample-routes', dataEvent: 'tokyo9areas_hero_routes', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="東京 9 大區域快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">第一區 右半部</span>
              <strong>上野、淺草寺、晴空塔</strong>
              <p>傳統東京、商店街、公園散步、夜景一次收。第一次東京很適合排成東側一日線。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">第二區 中間區域</span>
              <strong>皇居、銀座、築地市場</strong>
              <p>早上吃海鮮或散步，下午銀座逛街喝咖啡。這區節奏比西側安靜，適合排半日到一天。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">第三區 左半部</span>
              <strong>新宿、原宿、澀谷</strong>
              <p>年輕潮流、購物、展望台和夜生活最集中。想看東京城市感，這區優先排下午到晚上。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">我的排法</span>
              <strong>一天一側，不要來回橫跳</strong>
              <p>東側看文化與夜景，市中心吃飯逛街，西側看潮流與夜生活。這樣交通最省力。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="東京 9 大區域短影音">
          <h2 className="seo-h2">先看短影音：東京市區 9 大區域怎麼分</h2>
          <div className="seo-prose">
            <p>
              如果你想先用一分鐘抓方向，可以先看東京 9 大區域短影音，再回來對照這篇把景點排進每天行程。這支影片的核心概念就是：東京不要只看景點名，要先看它在城市的哪一側。
            </p>
            <SeoVideoLinkMenu label="東京 9 大區" links={linkGroups.videos} />
            <p>
              已經大概知道想玩東側或西側的話，也可以直接看單點實拍：東側先看淺草寺和晴空塔，西側先看明治神宮和 SHIBUYA SKY。這幾個點剛好能代表東京的傳統、夜景、神社綠地和現代城市感。
            </p>
            <SeoVideoLinkMenu label="淺草寺" links={linkGroups.asakusaVideos} />
            <SeoVideoLinkMenu label="晴空塔" links={linkGroups.skytreeVideos} />
            <SeoVideoLinkMenu label="明治神宮" links={linkGroups.meijiVideos} />
            <SeoVideoLinkMenu label="SHIBUYA SKY" links={linkGroups.shibuyaSkyVideos} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="東京 9 大區域比較表">
          <h2 className="seo-h2">東京 9 大區域比較：景點亮點、時間、適合誰</h2>
          <div className="seo-prose">
            <p>
              下面這張表先把 9 個區域放在一起看。你不用每個地方都去，而是先選一個城市感：東側比較有傳統東京和觀光地標，中間適合吃飯逛街，西側則是東京最強烈的流行、夜景與人潮。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>區域</th>
                    <th>位置</th>
                    <th>建議時間</th>
                    <th>重點景點</th>
                    <th>適合族群</th>
                  </tr>
                </thead>
                <tbody>
                  {areaRows.map((row) => (
                    <tr key={row.area}>
                      <td>{row.area}</td>
                      <td>{row.side}</td>
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

        <section className="seo-content" id="east-side" aria-label="東京右半部景點攻略">
          <h2 className="seo-h2">第一區 右半部：上野、淺草寺、晴空塔</h2>
          <div className="seo-prose">
            <p>
              東京右半部可以理解成「東側經典路線」。這區很適合第一次東京自由行，因為景點辨識度高，街道氛圍也比較有老東京味道。上野適合慢慢散步，淺草寺負責經典地標，晴空塔則把一天收在夜景和商場。
            </p>

            <h3 className="seo-h3">上野：恩賜公園、阿美橫町，適合散步和逛街</h3>
            <p>
              上野的好處是彈性很高。想走輕鬆版，可以在上野恩賜公園散步，順路看博物館、咖啡店和季節風景；想熱鬧一點，就往阿美橫町逛零食、藥妝、小吃和居酒屋。它很適合排在上午或中午，當作東側行程的起點。
            </p>

            <h3 className="seo-h3">淺草寺：東京最經典寺廟，雷門必拍</h3>
            <p>
              淺草寺是東京最容易讓人一眼認出來的經典寺廟，雷門、仲見世通、寶藏門這條線第一次去很值得走。人潮多的時候不必硬塞太久，重點是把雷門和周邊街景拍好，再用步行或電車接晴空塔。
            </p>
            <ActionLinks
              label="淺草寺攻略"
              links={[{ label: '淺草寺完整攻略', href: '/tokyo/sensoji-guide?from=tokyo-9-areas-guide', event: 'tokyo9areas_sensoji_article_inline', platform: 'article', primary: true }]}
            />

            <h3 className="seo-h3">晴空塔：看夜景、逛商場、拍東京天際線</h3>
            <p>
              晴空塔最適合排在下午到晚上。白天可以逛 Tokyo Solamachi，傍晚後再上展望台看東京天際線；如果不想上塔，也可以在周邊拍塔身和隅田川方向。它和淺草距離近，很適合放在同一天。想上展望台的話，建議先確認晴空塔票券時段，再決定要排傍晚還是夜景。
            </p>
           
            <ActionLinks label="晴空塔購票連結" links={linkGroups.skytreeTickets} />
          </div>
        </section>

        <section className="seo-content" id="central-side" aria-label="東京中間區域景點攻略">
          <h2 className="seo-h2">第二區 中間區域：皇居、銀座、築地市場</h2>
          <div className="seo-prose">
            <p>
              東京中間區域的關鍵字是「市中心、逛街、吃飯」。這裡不像新宿澀谷那麼刺激，但很適合排一個舒服的半日：早上築地或皇居，下午銀座，晚上再依住宿方向回去。
            </p>

            <h3 className="seo-h3">皇居：市中心最大綠地，適合早上走走</h3>
            <p>
              皇居周邊是東京市中心少見的大面積綠地，早上走外苑、二重橋、東京車站周邊會很舒服。它不一定要排很久，但很適合當作市中心行程的開場，讓整天節奏不要一開始就全是逛街和人潮。
            </p>

            <h3 className="seo-h3">銀座：百貨精品集中地，適合逛街喝咖啡</h3>
            <p>
              銀座適合放下午到晚上，百貨、精品、甜點、咖啡店都集中，路線也好走。第一次來不用把每棟百貨都逛完，抓一到兩個想買的品牌，再留時間坐下來喝咖啡，會比一直趕場更像在東京旅行。
            </p>

            <h3 className="seo-h3">築地市場：壽司、生魚片海鮮必吃</h3>
            <p>
              築地市場適合早上到中午，不建議放太晚。這裡的重點是海鮮、壽司、生魚片、玉子燒和各種邊走邊吃的小店。最順的排法是築地吃完後接銀座，或反過來用皇居散步後再去築地吃午餐。
            </p>
          </div>
        </section>

        <section className="seo-content" id="west-side" aria-label="東京左半部景點攻略">
          <h2 className="seo-h2">第三區 左半部：新宿、原宿、澀谷</h2>
          <div className="seo-prose">
            <p>
              東京左半部就是最有都市感的西側路線。新宿、原宿、澀谷可以排同一天，但建議從中午開始跑，把重點放在逛街、街景和夜景，不要再塞太多博物館或遠距離景點。
            </p>

            <h3 className="seo-h3">新宿：高樓夜景、歌舞伎町</h3>
            <p>
              新宿適合傍晚到晚上。想省預算可以去東京都廳展望室看高樓景色，想逛街可以排百貨、電器、藥妝，晚上再走歌舞伎町或 Golden Gai 周邊感受夜生活。新宿站很大，轉車和出口要多留時間。
            </p>

            <h3 className="seo-h3">原宿：竹下通、潮流文化</h3>
            <p>
              原宿適合中午到下午，竹下通主打年輕潮流、甜點、小店和街頭文化；如果想把氣氛拉成熟一點，可以接表參道、Cat Street 或明治神宮。原宿和澀谷距離近，放同一天非常順。
            </p>
            <ActionLinks
              label="明治神宮攻略"
              links={[{ label: '明治神宮完整攻略', href: '/tokyo/meiji-jingu-guide?from=tokyo-9-areas-guide', event: 'tokyo9areas_meiji_article_inline', platform: 'article', primary: true }]}
            />

            <h3 className="seo-h3">澀谷：十字路口、SHIBUYA SKY 展望台</h3>
            <p>
              澀谷是東京城市感最強的區域之一，十字路口、商場、街頭看板和人潮都很有代表性。SHIBUYA SKY 建議抓夕陽到晚上時段，能同時看到白天、夕陽和夜景；如果只想逛街，也能和原宿表參道串成半日線。想上展望台的話，建議先確認 SHIBUYA SKY 票券時段，再把澀谷排在下午到晚上。
            </p>
            <ActionLinks
              label="SHIBUYA SKY 攻略"
              links={[{ label: 'SHIBUYA SKY 完整攻略', href: '/tokyo/shibuya-sky-guide?from=tokyo-9-areas-guide', event: 'tokyo9areas_shibuya_sky_article_inline', platform: 'article', primary: true }]}
            />
            <ActionLinks label="SHIBUYA SKY 購票連結" links={linkGroups.shibuyaSkyTickets} />
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="東京 9 大區域行程排法">
          <h2 className="seo-h2">東京 9 大區域怎麼排：半日、一日、三日行程</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">東側一日：上野 → 淺草寺 → 晴空塔</h3>
            <p>
              早上上野恩賜公園或阿美橫町，中午到淺草寺拍雷門和逛仲見世，下午接晴空塔和 Solamachi，晚上看夜景。這條很適合第一次東京，也是最不容易迷路的一條經典線。
            </p>

            <h3 className="seo-h3">市中心半日：築地市場 → 銀座 → 皇居</h3>
            <p>
              築地適合早上吃海鮮，接著走去銀座逛街喝咖啡；皇居則放早上或下午都可以。如果你住東京車站、銀座、日本橋周邊，這條可以排得很輕鬆。
            </p>

            <h3 className="seo-h3">西側半日到一日：原宿 → 澀谷 → 新宿</h3>
            <p>
              中午原宿竹下通和表參道，下午澀谷十字路口和 SHIBUYA SKY，晚上新宿看夜景、逛百貨或走歌舞伎町。這條人潮多，但最有東京現代城市感。
            </p>

            <h3 className="seo-h3">第一次東京三日排法</h3>
            <ul className="narita-checklist">
              <li>第一天：上野、淺草寺、晴空塔，把傳統東京和夜景先收起來。</li>
              <li>第二天：築地市場、銀座、皇居，安排吃飯、逛街和市中心散步。</li>
              <li>第三天：原宿、澀谷、新宿，把潮流商圈、展望台和夜生活排在同一側。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="planning-links" aria-label="東京區域攻略相關連結">
          <h2 className="seo-h2">接著規劃：住宿、交通、票券怎麼配</h2>
          <div className="seo-prose">
            <p>
              選好 9 大區域後，下一步是決定住哪裡、怎麼搭車、哪些票券需要先買。住東側的人可以多排上野、淺草、晴空塔；住西側的人則把新宿、原宿、澀谷排得更密。交通上不用一開始就買一堆券，先看每天會搭幾趟地鐵，再決定是否需要東京地鐵券。
            </p>
            <ActionLinks label="東京行程規劃連結" links={linkGroups.planning} />
          </div>
        </section>

        <section className="seo-content" aria-label="東京 9 大區域結論">
          <h2 className="seo-h2">結論：先選區域，再選景點</h2>
          <div className="seo-prose">
            <p>
              東京市區景點不是越多越好，而是動線越順越好。省力排法很簡單：右半部排上野、淺草寺、晴空塔；中間排皇居、銀座、築地市場；左半部排新宿、原宿、澀谷。第一次東京先照這三區安排，行程會清楚很多。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="選好區域後，接著把景點和交通排進去"
          intro="先打開地圖確認每一區的位置，再回頭看交通票；若已決定想去淺草或澀谷，也可以直接接著看該區景點攻略。"
          links={[
            { label: '東京旅遊地圖', href: '/tokyo/map?from=tokyo-9-areas', event: 'tokyo9areas_related_map', primary: true },
            { label: '東京交通整理', href: '/tokyo/transport', event: 'tokyo9areas_related_transport' },
            { label: '淺草寺攻略', href: '/tokyo/sensoji-guide?from=tokyo-9-areas', event: 'tokyo9areas_related_sensoji' },
          ]}
        />
        <SeoFaqSection title="東京 9 大區域常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
