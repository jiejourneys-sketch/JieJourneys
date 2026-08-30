import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { busanTicketCards } from '@/data/busan/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanCapsuleTrainGuideCanonical,
  busanCapsuleTrainGuideDescription,
  busanCapsuleTrainGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type RideComparison = {
  ride: string
  route: string
  vibe: string
  bestFor: string
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
  mainVideo: [
    { label: '膠囊列車 IG', href: 'https://www.instagram.com/reel/DMu5uZxTdO8/', event: 'busancapsule_video_ig', platform: 'IG', primary: true },
    { label: '膠囊列車 YouTube', href: 'https://www.youtube.com/shorts/NojyZ8jfvD4', event: 'busancapsule_video_yt', platform: 'YouTube' },
  ],
  platformVideo: [
    { label: '平台訂票 IG', href: 'https://www.instagram.com/reel/DNIpqn1TE0k/', event: 'busancapsule_platform_ig', platform: 'IG', primary: true },
    { label: '平台訂票 YouTube', href: 'https://www.youtube.com/shorts/kSCoYLXAMUA', event: 'busancapsule_platform_yt', platform: 'YouTube' },
  ],
  officialVideo: [
    { label: '官網訂票 IG', href: 'https://www.instagram.com/reel/DNarLsDTe2F/', event: 'busancapsule_official_ig', platform: 'IG', primary: true },
    { label: '官網訂票 YouTube', href: 'https://www.youtube.com/shorts/yoQdWHM6rbY', event: 'busancapsule_official_yt', platform: 'YouTube' },
  ],
  tickets: ticketLinksFor('膠囊列車&海岸列車', 'busancapsule_ticket'),
  planning: [
    { label: '海雲台攻略', href: '/busan/haeundae-guide?from=capsule-train-guide', event: 'busancapsule_haeundae_article', platform: 'article', primary: true },
    { label: '釜山通行證攻略', href: '/busan/visit-busan-pass?from=capsule-train-guide', event: 'busancapsule_pass_article', platform: 'article' },
    { label: '釜山票券整理', href: '/busan/ticket?from=capsule-train-guide', event: 'busancapsule_ticket_page', platform: 'ticket' },
    { label: '釜山景點地圖', href: '/busan/map?from=capsule-train-guide', event: 'busancapsule_map', platform: 'map' },
  ],
}

const rideComparisons: RideComparison[] = [
  {
    ride: '海岸列車',
    route: '尾浦、青沙浦到松亭，全線約 4.8km',
    vibe: '共乘觀光列車，停靠站多，可以先把沿線景點拍一輪',
    bestFor: '想省力移動、想先避開膠囊列車人潮的人',
  },
  {
    ride: '天空膠囊列車',
    route: '尾浦到青沙浦單程，約 30 分鐘',
    vibe: '小車廂高架看海，最多 4 人，畫面最可愛',
    bestFor: '想拍窗景、情侶朋友一起坐、把體驗留到最後的人',
  },
]

const faqItems = [
  {
    q: '釜山膠囊列車建議先搭還是後搭？',
    a: '熱門說法是先搶膠囊列車海景座位，但如果你想錯開人潮，可以先搭海岸列車到青沙浦或松亭，把沿線景點拍完，再回頭搭膠囊列車。路線重點一樣看得到，節奏通常更輕鬆。',
  },
  {
    q: '海岸列車和膠囊列車路線完全一樣嗎？',
    a: '兩者都在海雲台藍線公園，尾浦到青沙浦這段海景重疊；海岸列車還會繼續往松亭方向走，停靠點更多。膠囊列車則是尾浦和青沙浦之間的高架小車體驗。',
  },
  {
    q: '釜山通行證包含膠囊列車嗎？',
    a: '不包含天空膠囊列車。釜山通行證常見可用的是海岸列車項目，想坐天空膠囊列車要另外訂票。',
  },
  {
    q: '膠囊列車訂官網還是平台比較好？',
    a: '想直接看官方時段就用官網；想用中文介面、比活動價格或搭配其他票券，就看 KKDAY、KLOOK、Trip。熱門時段建議先確認可訂時段再排行程。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanCapsuleTrainGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanCapsuleTrainGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanCapsuleTrainGuideCanonical,
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

type BusanCapsuleTrainGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'haeundae-guide') return '/busan/haeundae-guide'
  if (value === 'pass' || value === 'visit-busan-pass') return '/busan/visit-busan-pass'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  return '/busan'
}

export default async function BusanCapsuleTrainGuidePage({ searchParams }: BusanCapsuleTrainGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busancapsule" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山景點攻略"
          h1="膠囊列車攻略｜先搭海岸列車再換膠囊，反而更爽"
          intro="海雲台藍線公園最紅的是天空膠囊列車，但實際排起來，不一定要跟大家一起先衝膠囊。先搭海岸列車，把沿線景點拍完，再換膠囊列車收尾，反而更輕鬆。"
          eventPrefix="busancapsule"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'busancapsule_hero_quick', platform: 'article' },
            { label: '建議走法', href: '#route-order', dataEvent: 'busancapsule_hero_route', platform: 'article' },
            { label: '訂票連結', href: '#ticket-links', dataEvent: 'busancapsule_hero_ticket', platform: 'ticket' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="膠囊列車快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">推薦順序</span>
              <strong>先海岸列車，再膠囊列車</strong>
              <p>先把沿線景點移動完，再用膠囊列車收尾，拍照比較不卡。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">避開人潮</span>
              <strong>不要跟大家同時搶膠囊</strong>
              <p>熱門時段大家一窩蜂卡膠囊，反向走法比較有呼吸感。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">沿途拍點</span>
              <strong>青沙浦平交道＋天空步道</strong>
              <p>平交道、海景、青沙浦踏石展望台都能順路拍。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">票券提醒</span>
              <strong>膠囊列車要另外訂</strong>
              <p>釜山通行證不要直接算進膠囊列車回本，訂票前先看方案。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="膠囊列車短影音與訂票教學">
          <h2 className="seo-h2">先看短影音：實搭、平台訂票、官網訂票</h2>
          <div className="seo-prose">
            <p>
              想先看畫面可以看膠囊列車實搭；準備訂票時，再看平台訂票和官網訂票兩支。平台適合比活動價，官網適合直接查官方時段和站點。
            </p>
            <SeoVideoLinkMenu label="膠囊列車｜實搭畫面" links={linkGroups.mainVideo} />
            <SeoVideoLinkMenu label="膠囊列車｜平台訂票" links={linkGroups.platformVideo} />
            <SeoVideoLinkMenu label="膠囊列車｜官網訂票" links={linkGroups.officialVideo} />
          </div>
        </section>

        <section className="seo-content" id="ride-comparison" aria-label="海岸列車與膠囊列車比較">
          <h2 className="seo-h2">海岸列車 vs 膠囊列車：先搞懂差在哪</h2>
          <div className="seo-prose">
            <p>
              海岸列車和天空膠囊都在海雲台藍線公園，但玩法不一樣。海岸列車比較像沿海移動工具，停靠點多；膠囊列車是高架小車體驗，畫面可愛、私密感更強。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>路線</th>
                    <th>體驗感</th>
                    <th>適合</th>
                  </tr>
                </thead>
                <tbody>
                  {rideComparisons.map((item) => (
                    <tr key={item.ride}>
                      <td>{item.ride}</td>
                      <td>{item.route}</td>
                      <td>{item.vibe}</td>
                      <td>{item.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="膠囊列車建議走法">
          <h2 className="seo-h2">建議走法：反向排，拍照不卡人</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 先搭海岸列車，把沿線拉開</h3>
            <p>
              多數人一開始就想衝膠囊車廂，熱門時段很容易在排隊、等車、拍照上消耗心力。我的實測建議是先搭海岸列車，從尾浦往青沙浦或松亭移動，先把海邊線路打開。
            </p>
            <p>
              尾浦到青沙浦這段和膠囊列車的重點海景重疊；如果你想看更多站點，海岸列車還能繼續往松亭。先用海岸列車移動，體力和時間都比較好控制。
            </p>

            <h3 className="seo-h3">2. 到青沙浦拍平交道和天空步道</h3>
            <p>
              青沙浦一帶很好拍，最經典的是像漫畫場景的青沙浦平交道，旁邊還能接青沙浦踏石展望台。天空步道是懸在海上的視角，玻璃地面和海岸線很適合慢慢拍。
            </p>

            <h3 className="seo-h3">3. 再換膠囊列車，把海景留到收尾</h3>
            <p>
              景點先拍完後再換膠囊列車，心態會輕很多。這時候不需要一直擔心還沒拍到平交道、還沒去天空步道，坐在小車裡看海、拍窗邊照，體驗會完整很多。
            </p>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="膠囊列車訂票與購買連結">
          <h2 className="seo-h2">膠囊列車訂票：官網和平台怎麼選</h2>
          <div className="seo-prose">
            <p>
              想卡指定時段，先看官網能不能訂到；想用中文介面、比活動價格、順手搭配其他釜山票券，就看平台。熱門時段不要拖到現場才買，尤其是週末、傍晚和連假。
            </p>
            <ActionLinks label="膠囊列車與海岸列車購票連結" links={linkGroups.tickets} />
          </div>
        </section>

        <section className="seo-content" aria-label="膠囊列車延伸行程">
          <h2 className="seo-h2">膠囊列車可以接哪些行程</h2>
          <div className="seo-prose">
            <p>
              最順的是把膠囊列車排進海雲台半日或一日路線：海雲台大道、傳統市場、海灘、BUSAN X the SKY、膠囊列車，最後回海理團路。要玩釜山通行證的人，也要記得膠囊列車和通行證可用的海岸列車不是同一個項目。
            </p>
            <ActionLinks label="膠囊列車延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="膠囊列車可以這樣接著安排"
          intro="膠囊列車最適合搭配海雲台散步與遊艇夜景；要用釜山通行證或安排其他景點，先到通行證地圖確認順路度。"
          links={[
            { label: '海雲台攻略', href: '/busan/haeundae-guide?from=capsule-train-guide', event: 'capsule_related_haeundae', primary: true },
            { label: '釜山遊艇攻略', href: '/busan/busan-yacht-suyeong-diamond-bay?from=capsule-train-guide', event: 'capsule_related_yacht' },
            { label: '釜山通行證地圖', href: '/busan/pass-map?from=capsule-train-guide', event: 'capsule_related_passmap' },
          ]}
        />
        <SeoFaqSection title="膠囊列車攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
