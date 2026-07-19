import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  visitBusanPass24hRouteCanonical,
  visitBusanPass24hRouteDescription,
  visitBusanPass24hRouteTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type PassStop = {
  time: string
  spot: string
  reason: string
  note: string
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

const linkGroups = {
  videos: [
    { label: '24小時走法 IG', href: 'https://www.instagram.com/reel/DOJBfeBEdwN/', event: 'busanpass24_video_ig', platform: 'IG', primary: true },
    { label: '24小時走法 YouTube', href: 'https://www.youtube.com/shorts/e2aeNYmKc38', event: 'busanpass24_video_yt', platform: 'YouTube' },
  ],
  pass: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312', event: 'busanpass24_buy_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798', event: 'busanpass24_buy_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', event: 'busanpass24_buy_trip', platform: 'Trip' },
    { label: '官方', href: 'https://www.visitbusanpass.com/', event: 'busanpass24_buy_official', platform: 'Official' },
  ],
  planning: [
    { label: '釜山通行證完整整理', href: '/busan/visit-busan-pass?from=visit-busan-pass-24h-route', event: 'busanpass24_pass_article', platform: 'article', primary: true },
    { label: '48小時走法', href: '/busan/visit-busan-pass-48h-route?from=visit-busan-pass-24h-route', event: 'busanpass24_48h_article', platform: 'article' },
    { label: '通行證地圖', href: '/busan/pass-map?from=visit-busan-pass-24h-route', event: 'busanpass24_pass_map', platform: 'map' },
    { label: '行程排序', href: '/tools/planner?region=busan&source=pass24', event: 'busanpass24_planner', platform: 'planner' },
  ],
}

const routeStops: PassStop[] = [
  { time: '開卡第一站', spot: '樂天世界 釜山', reason: '原價高，適合先拿來啟用 24 小時', note: '先玩大景點，回本感最明顯。' },
  { time: '接著往東釜山', spot: 'Skyline Luge 斜坡滑車', reason: '戶外體驗價格高，和樂天世界方向相近', note: '下雨或強風可能影響，出發前看營運狀態。' },
  { time: '順路補點', spot: '釜山 Brick Campus', reason: '室內景點，適合當中段緩衝', note: '停留時間別拉太長，24 小時路線節奏很緊。' },
  { time: '下午到傍晚', spot: '汗蒸幕 / SPA 類景點', reason: '用來恢復體力，也能補高價體驗', note: '依當天所在區域選 ClubD Oasis、Spa Land 或其他 Pass 可用點。' },
  { time: '傍晚', spot: 'BUSAN X the SKY', reason: '海雲台全景和夜景都能看，價值高', note: '天氣好再上去，能見度差就改順路點。' },
  { time: '晚上', spot: '夜遊遊艇', reason: '夜景體驗很有記憶點，也能拉高通行證價值', note: '遊艇類常需要預約，先處理名額。' },
  { time: '隔天早上', spot: '海雲台海岸列車', reason: '在 24 小時結束前補上海線體驗', note: '通行證常見可用的是海岸列車，不是天空膠囊列車。' },
]

const faqItems = [
  {
    q: '釜山通行證 24 小時怎麼排最回本？',
    a: '先把高價景點排出來，再選位置最集中的區域。24 小時極限走法適合把樂天世界、斜坡滑車、BUSAN X the SKY、遊艇和海岸列車集中在東釜山與海雲台一帶。',
  },
  {
    q: '24 小時路線會不會太趕？',
    a: '會，這條是極限走法，不是放鬆行程。如果第一次去釜山、想慢慢拍照吃飯，48 小時會舒服很多。',
  },
  {
    q: '夜遊遊艇一定能現場去嗎？',
    a: '不建議現場賭。遊艇類通常需要預約或確認可用場次，排 24 小時路線前要先把預約和集合時間固定。',
  },
  {
    q: '隔天早上海岸列車是膠囊列車嗎？',
    a: '不是。釜山通行證常見可用的是海岸列車；天空膠囊列車要另外購票，不要把膠囊列車算進 24 小時回本。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: visitBusanPass24hRouteTitle.replace(' | JieJourneys(旅杰)', ''),
  description: visitBusanPass24hRouteDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: visitBusanPass24hRouteCanonical,
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

type VisitBusanPass24hRoutePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'visit-busan-pass' || value === 'pass') return '/busan/visit-busan-pass'
  if (value === 'pass-map' || value === 'busan-pass-map') return '/busan/pass-map'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  return '/busan'
}

export default async function VisitBusanPass24hRoutePage({ searchParams }: VisitBusanPass24hRoutePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanpass24" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山通行證攻略"
          h1="釜山通行證 24 小時極限走法"
          intro="這條不是悠閒散步路線，而是把通行證高價景點集中起來衝一輪：先照門票價值分級，再挑最集中的區域把 24 小時吃滿。"
          eventPrefix="busanpass24"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'busanpass24_hero_quick', platform: 'article' },
            { label: '路線順序', href: '#route-order', dataEvent: 'busanpass24_hero_route', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'busanpass24_hero_ticket', platform: 'ticket' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山通行證 24 小時快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">核心邏輯</span>
              <strong>先排票價，再排地圖</strong>
              <p>把景點門票由貴到便宜分成紅、黃、綠，再找最集中的區域衝。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主攻區域</span>
              <strong>東釜山＋海雲台</strong>
              <p>樂天世界、斜坡滑車、X the SKY、遊艇、海岸列車相對順路。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">估算價值</span>
              <strong>1185 元玩出 3183 元</strong>
              <p>這條路線重點就是把原價高的體驗集中，讓通行證效益最大化。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">適合族群</span>
              <strong>體力好、想挑戰高 CP 值</strong>
              <p>第一次去想慢慢玩的人，建議直接看 48 小時走法。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山通行證 24 小時短影音">
          <h2 className="seo-h2">先看短影音：24 小時極限走法</h2>
          <div className="seo-prose">
            <p>
              如果你想先看整條路線的節奏，這支短影音會比文字更快抓到重點。看完再回來對照下面順序，把預約和交通時間補齊。
            </p>
            <SeoVideoLinkMenu label="24小時走法" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="strategy" aria-label="釜山通行證 24 小時分級策略">
          <h2 className="seo-h2">先把景點分紅、黃、綠，再決定要衝哪區</h2>
          <div className="seo-prose">
            <p>
              24 小時通行證最怕平均分配時間。正確做法是先把所有景點門票從貴到便宜排好，分成紅、黃、綠三等級，全部標在地圖，再挑最貴又最集中的區域。
            </p>
            <div className="narita-summary-grid haneda-summary-grid" role="list">
              <div role="listitem">
                <span className="narita-summary-label">紅色</span>
                <strong>高價主力</strong>
                <p>樂天世界、斜坡滑車、BUSAN X the SKY、遊艇、SPA 類景點。</p>
              </div>
              <div role="listitem">
                <span className="narita-summary-label">黃色</span>
                <strong>順路補強</strong>
                <p>Brick Campus、海岸列車、釜山塔、電影體驗博物館。</p>
              </div>
              <div role="listitem">
                <span className="narita-summary-label">綠色</span>
                <strong>有空再補</strong>
                <p>原價較低、移動成本太高、或會讓路線大幅繞路的點。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="釜山通行證 24 小時路線順序">
          <h2 className="seo-h2">24 小時極限路線順序</h2>
          <div className="seo-prose">
            <p>
              這條路線的主軸是把東釜山和海雲台高價景點串在一起：樂天世界 → 斜坡滑車 → 紅磚校園 → 汗蒸幕 → 釜山展望台 → 夜遊遊艇 → 隔天早上海岸列車。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>順序</th>
                    <th>景點</th>
                    <th>為什麼排這裡</th>
                    <th>提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {routeStops.map((stop) => (
                    <tr key={stop.spot}>
                      <td>{stop.time}</td>
                      <td>{stop.spot}</td>
                      <td>{stop.reason}</td>
                      <td>{stop.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              這條最重要的是啟用時間：第一個免費景點一刷下去，24 小時就開始跑。不要太早開卡去玩低價景點，也不要中間塞太多市場和咖啡廳，否則回本效果會被交通時間吃掉。
            </p>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="釜山通行證 24 小時購票連結">
          <h2 className="seo-h2">釜山通行證購票連結</h2>
          <div className="seo-prose">
            <p>
              24 小時走法很吃啟用時間、景點營業狀態和預約。買票前先比 KKDAY、KLOOK、Trip，再回官方確認可用景點、預約規則和當天營運。
            </p>
            <ActionLinks label="釜山通行證購票連結" links={linkGroups.pass} />
          </div>
        </section>

        <section className="seo-content" aria-label="釜山通行證 24 小時延伸工具">
          <h2 className="seo-h2">排之前先看地圖</h2>
          <div className="seo-prose">
            <p>
              這條走法要成立，關鍵不是景點夠多，而是地點夠集中。先用通行證地圖把紅黃綠標出來，再決定要不要真的衝 24 小時。
            </p>
            <ActionLinks label="釜山通行證延伸工具" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="釜山通行證 24 小時常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
