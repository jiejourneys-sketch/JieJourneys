import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { busanTicketCards } from '@/data/busan/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanHaeundaeGuideCanonical,
  busanHaeundaeGuideDescription,
  busanHaeundaeGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type HaeundaeSpot = {
  spot: string
  bestTime: string
  focus: string
  routeNote: string
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
  videos: [
    { label: '海雲台 IG', href: 'https://www.instagram.com/reel/DLuh1WzzM0c/', event: 'busanhaeundae_video_ig', platform: 'IG', primary: true },
    { label: '海雲台 YouTube', href: 'https://www.youtube.com/shorts/T0aTv6PPxMQ', event: 'busanhaeundae_video_yt', platform: 'YouTube' },
  ],
  capsuleVideos: [
    { label: '膠囊列車 IG', href: 'https://www.instagram.com/reel/DMu5uZxTdO8/', event: 'busanhaeundae_capsule_ig', platform: 'IG', primary: true },
    { label: '膠囊列車 YouTube', href: 'https://www.youtube.com/shorts/NojyZ8jfvD4', event: 'busanhaeundae_capsule_yt', platform: 'YouTube' },
  ],
  capsuleGuide: [
    { label: '膠囊列車攻略', href: '/busan/capsule-train-guide?from=haeundae-guide', event: 'busanhaeundae_capsule_article', platform: 'article', primary: true },
  ],
  planning: [
    { label: '釜山最速攻略', href: '/busan/busan-fast-guide?from=haeundae-guide', event: 'busanhaeundae_fastguide', platform: 'article', primary: true },
    { label: '釜山景點地圖', href: '/busan/map?from=haeundae-guide', event: 'busanhaeundae_map', platform: 'map' },
    { label: '釜山住宿區域', href: '/busan/hotel?from=haeundae-guide', event: 'busanhaeundae_hotel', platform: 'hotel' },
    { label: '釜山票券整理', href: '/busan/ticket?from=haeundae-guide', event: 'busanhaeundae_ticket', platform: 'ticket' },
  ],
  xTheSkyTickets: ticketLinksFor('釜山 X the Sky 展望台', 'busanhaeundae_xthesky_ticket'),
  capsuleTickets: ticketLinksFor('膠囊列車&海岸列車', 'busanhaeundae_capsule_ticket'),
}

const haeundaeSpots: HaeundaeSpot[] = [
  { spot: '海雲台大道 / Gunam-ro', bestTime: '抵達後第一站', focus: '商店、美食、街頭表演、一路走向海邊', routeNote: '地鐵海雲台站出來先走這條，開場最有熱鬧感。' },
  { spot: '海雲台傳統市場', bestTime: '中午或晚餐前', focus: '辣炒年糕、冷麵、烤海鮮、炸物、小吃', routeNote: '離海灘近，適合先吃再去海邊散步。' },
  { spot: '海雲台海灘', bestTime: '白天到傍晚', focus: '寬廣沙灘、海景、散步、打卡', routeNote: '拍照和散步都舒服，夏季戲水要看現場安全規定。' },
  { spot: 'BUSAN X the SKY', bestTime: '下午到晚上', focus: '海雲台全景、玻璃地板、LCT 高空展望', routeNote: '想看高空海景或夜景再買票，放海灘後很順。' },
  { spot: '膠囊列車', bestTime: '下午或傍晚', focus: '沿海小車、尾浦到青沙浦海岸風景', routeNote: '熱門時段要先處理票券和班次，不要現場才想搭。' },
  { spot: '海理團路', bestTime: '下午到晚上收尾', focus: '咖啡廳、文青小店、餐廳、老宅感街區', routeNote: '逛完海邊後回到站後方喝咖啡，節奏很剛好。' },
]

const faqItems = [
  {
    q: '海雲台第一次去要排多久？',
    a: '只走海雲台大道、市場和海灘，半天就可以；如果要加 BUSAN X the SKY、膠囊列車和海理團路，建議排一整天，才不會每個點都很趕。',
  },
  {
    q: '海雲台大道是哪裡？',
    a: '旅人常說的海雲台大道多半是海雲台站到海雲台海灘之間的 Gunam-ro / 海雲台廣場一帶。地鐵出站後一路往海邊走，兩側商店、餐廳和小吃很多。',
  },
  {
    q: '海雲台傳統市場有什麼好吃？',
    a: '可以找辣炒年糕、炸物、冷麵、海鮮、烤海鮮和市場小吃。它離海雲台海灘很近，很適合當午餐或晚餐前後的補給站。',
  },
  {
    q: 'BUSAN X the SKY 和膠囊列車都要排嗎？',
    a: '不一定。想看高空全景和玻璃地板選 BUSAN X the SKY；想慢慢沿海看風景、拍可愛小車就選膠囊列車。時間夠再兩個都排。',
  },
  {
    q: '海理團路適合什麼時候去？',
    a: '海理團路適合下午或晚上收尾。逛完海灘和膠囊列車後，回到海雲台站後方喝咖啡、逛小店，會比一早去更有氣氛。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanHaeundaeGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanHaeundaeGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanHaeundaeGuideCanonical,
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

type BusanHaeundaeGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  if (value === 'hotel' || value === 'busan-hotel') return '/busan/hotel'
  if (value === 'fast-guide' || value === 'busan-fast-guide') return '/busan/busan-fast-guide'
  return '/busan'
}

export default async function BusanHaeundaeGuidePage({ searchParams }: BusanHaeundaeGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanhaeundae" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="海雲台攻略"
          h1="海雲台攻略｜大道、市場、海灘、X the SKY、膠囊列車、海理團路怎麼排？"
          intro="海雲台是釜山最有度假感的一區。地鐵出來先走海雲台大道，吃傳統市場小吃，散步到海灘，再看要不要上 BUSAN X the SKY 或搭膠囊列車，最後用海理團路咖啡和小店收尾，整天會很順。"
          eventPrefix="busanhaeundae"
          showVisual={false}
          ctaLinks={[
            { label: '六個重點', href: '#main-spots', dataEvent: 'busanhaeundae_hero_spots', platform: 'article' },
            { label: '建議順序', href: '#route-order', dataEvent: 'busanhaeundae_hero_route', platform: 'article' },
            { label: '常見問題', href: '#seo-faq', dataEvent: 'busanhaeundae_hero_faq', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="海雲台攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">開場</span>
              <strong>海雲台大道一路走向海邊</strong>
              <p>地鐵出來就是熱鬧街區，商店、餐廳、小吃一路接到海雲台海灘。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">吃飯</span>
              <strong>傳統市場補小吃</strong>
              <p>辣炒年糕、冷麵、烤海鮮、炸物都可以找，適合午餐或晚餐前墊胃。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">看景</span>
              <strong>海灘＋高空＋海岸列車擇一加強</strong>
              <p>免費海灘先排；想看全景上 X the SKY，想沿海慢慢看就搭膠囊列車。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">收尾</span>
              <strong>海理團路喝咖啡逛小店</strong>
              <p>海邊玩完後回到站後方，逛文青小店、咖啡廳和餐廳，氣氛最剛好。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="海雲台短影音">
          <h2 className="seo-h2">先看短影音：海雲台和膠囊列車畫面</h2>
          <div className="seo-prose">
            <p>
              海雲台這區最適合先看畫面。海雲台影片能抓大道、市場、海灘的熱鬧感；膠囊列車影片則能先看尾浦到青沙浦沿線的海景，幫你決定要不要另外買票和卡時段。
            </p>
            <SeoVideoLinkMenu label="海雲台" links={linkGroups.videos} />
            <SeoVideoLinkMenu label="膠囊列車" links={linkGroups.capsuleVideos} />
          </div>
        </section>

        <section className="seo-content" id="main-spots" aria-label="海雲台六個重點">
          <h2 className="seo-h2">海雲台攻略重點：六個地方先搞懂</h2>
          <div className="seo-prose">
            <p>
              海雲台不用一開始就把所有東釜山景點都塞進來。第一次去先掌握這六個點：海雲台大道、傳統市場、海灘、BUSAN X the SKY、膠囊列車和海理團路，行程就很完整。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>景點</th>
                    <th>建議時間</th>
                    <th>重點</th>
                    <th>動線提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {haeundaeSpots.map((spot) => (
                    <tr key={spot.spot}>
                      <td>{spot.spot}</td>
                      <td>{spot.bestTime}</td>
                      <td>{spot.focus}</td>
                      <td>{spot.routeNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">1. 海雲台大道：地鐵出來就開場熱鬧逛</h3>
            <p>
              海雲台站出來往海灘方向走，最直覺的主路就是 Gunam-ro，也就是很多人說的海雲台大道。這條路兩側餐廳、商店、咖啡、藥妝和小吃很多，假日也常有街頭表演或活動，最適合當海雲台行程開場。
            </p>

            <h3 className="seo-h3">2. 海雲台傳統市場：小吃超多，離海灘很近</h3>
            <p>
              海雲台傳統市場離海灘不遠，很適合先吃再去散步。想吃辣炒年糕、炸物、冷麵、烤海鮮、海鮮小吃或市場甜點，都可以在這裡先找一輪。它不是大型百貨感，而是很有生活氣味的市場補給站。
            </p>

            <h3 className="seo-h3">3. 海雲台海灘：寬廣沙灘＋藍色海景，打卡散步都 chill</h3>
            <p>
              海雲台海灘是釜山最代表性的海邊景點之一，沙灘很寬，城市高樓就在後方，照片會有很強烈的「釜山度假」感。白天適合拍海、散步、看海鷗，傍晚則適合慢慢走到尾浦或回頭吃飯。
            </p>
            <p>
              夏季如果要下水，務必看現場救生員、浮標和海灘公告；非戲水季節也很適合單純散步拍照，反而人潮比較舒服。
            </p>

            <h3 className="seo-h3">4. BUSAN X the SKY：看海雲台全景，玻璃地板很刺激</h3>
            <p>
              BUSAN X the SKY 位在海雲台 LCT Landmark Tower 高樓層，可以一次看海雲台海灘、廣安大橋、冬柏島、城市高樓和海岸線。想從高處理解海雲台的位置，這個展望台比在地面散步更有全景感；玻璃地板區也很適合拍刺激感。
            </p>
            <p>
              如果只想免費散步，海灘就夠；如果你想看高空海景、夜景或室內展望台體驗，再安排 BUSAN X the SKY。確定要上去的話，票券可以先在這裡看。
            </p>
            <ActionLinks label="BUSAN X the SKY 購票連結" links={linkGroups.xTheSkyTickets} />

            <h3 className="seo-h3">5. 膠囊列車：沿海邊慢慢走的療癒小車</h3>
            <p>
              海雲台藍線公園把舊鐵道路線改成海岸觀光路線，常見玩法是從尾浦往青沙浦方向搭膠囊列車，坐在小車裡看海、拍窗景和海岸線。它的節奏很慢，不是趕路交通，而是看風景用的體驗。
            </p>
            <p>
              膠囊列車熱門時段很容易滿，尤其是想拍順光或夕陽時段的人，建議先把時段固定，再回推海雲台海灘、市場和 X the SKY。票券和官方訂票放這裡最自然。
            </p>
            <ActionLinks label="膠囊列車與海岸列車購票連結" links={linkGroups.capsuleTickets} />
            <ActionLinks label="膠囊列車延伸攻略" links={linkGroups.capsuleGuide} />

            <h3 className="seo-h3">6. 海理團路：收尾喝咖啡、逛文青小店最剛好</h3>
            <p>
              海理團路在海雲台站後方，和海灘前方高樓、觀光街的氣氛不太一樣。這裡有咖啡廳、餐廳、文青小店和老宅改造空間，適合行程尾聲來放慢速度。海灘拍完、膠囊列車搭完後，回來喝杯咖啡收尾很舒服。
            </p>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="海雲台建議順序">
          <h2 className="seo-h2">海雲台建議順序：半日到一日怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">半日版：市場＋海灘＋海理團路</h3>
            <ol>
              <li>從海雲台站出來，先走海雲台大道。</li>
              <li>到海雲台傳統市場吃辣炒年糕、冷麵或烤海鮮。</li>
              <li>散步到海雲台海灘拍照看海。</li>
              <li>最後回海理團路喝咖啡、逛小店。</li>
            </ol>

            <h3 className="seo-h3">一日版：加 X the SKY 和膠囊列車</h3>
            <ol>
              <li>中午前後從海雲台大道開場，先吃市場小吃。</li>
              <li>下午散步到海雲台海灘，再上 BUSAN X the SKY 看高空全景。</li>
              <li>接著往尾浦移動，搭膠囊列車或海岸列車看海岸線。</li>
              <li>傍晚到晚上回海理團路吃飯喝咖啡，行程收尾。</li>
            </ol>

            <h3 className="seo-h3">如果只選一個付費景點</h3>
            <p>
              想看完整高空全景，選 BUSAN X the SKY；想要更有釜山海岸感和可愛畫面，選膠囊列車。兩個都很好，但不用為了打卡硬塞，先看你更想要「高空」還是「沿海」。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="海雲台延伸規劃">
          <h2 className="seo-h2">海雲台之後怎麼接釜山其他區</h2>
          <div className="seo-prose">
            <p>
              海雲台適合和廣安里夜景、東釜山、海東龍宮寺或樂天世界同方向安排；不要同一天又硬拉回南浦洞。想先搞懂整個釜山區域，可以先看最速攻略，再用地圖把海雲台和其他區分開排。
            </p>
            <ActionLinks label="海雲台延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="海雲台行程接著這樣排"
          intro="海雲台、膠囊列車與夜景遊艇能排在同一個海岸動線；打開地圖後再依住宿位置決定從哪一站開始。"
          links={[
            { label: '海雲台膠囊列車攻略', href: '/busan/capsule-train-guide?from=haeundae-guide', event: 'haeundae_related_capsule', primary: true },
            { label: '釜山遊艇攻略', href: '/busan/busan-yacht-suyeong-diamond-bay?from=haeundae-guide', event: 'haeundae_related_yacht' },
            { label: '釜山旅遊地圖', href: '/busan/map?from=haeundae-guide', event: 'haeundae_related_map' },
          ]}
        />
        <SeoFaqSection title="海雲台攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
