import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { tokyoTicketCards } from '@/data/tokyo/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoSkytreeGuideCanonical,
  tokyoSkytreeGuideDescription,
  tokyoSkytreeGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type VisitStep = {
  place: string
  focus: string
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

function ticketLinksFor(title: string, eventPrefix: string): ActionLink[] {
  const card = tokyoTicketCards.find((item) => item.title === title)
  if (!card) return []

  return card.actions
    .filter((action) => action.platform !== 'article')
    .map((action) => ({
      label: action.label,
      href: action.href,
      event: `${eventPrefix}_${action.platform?.toLowerCase() ?? action.label.toLowerCase()}`,
      platform: action.platform ?? action.label,
      primary: action.className?.includes('primary') ?? false,
    }))
}

const linkGroups = {
  videos: [
    { label: '晴空塔 IG', href: 'https://www.instagram.com/reel/DV3aGGdFNsc/', event: 'tokyoskytree_video_ig', platform: 'IG', primary: true },
    { label: '晴空塔 YouTube', href: 'https://www.youtube.com/shorts/Q-zM2k47oVY', event: 'tokyoskytree_video_yt', platform: 'YouTube' },
  ],
  tickets: ticketLinksFor('晴空塔', 'tokyoskytree_ticket'),
  maps: [
    { label: '晴空塔 Google Map', href: 'https://maps.app.goo.gl/NDgjtaiVmkzW4JrRA', event: 'tokyoskytree_map_spot', platform: 'GoogleMap', primary: true },
    { label: '淺草文化觀光中心 Google Map', href: 'https://maps.app.goo.gl/GaQDoWncQHMqQ8bN7', event: 'tokyoskytree_map_asakusa_tourist_center', platform: 'GoogleMap' },
    { label: '東京景點地圖', href: '/tokyo/map?from=skytree-guide', event: 'tokyoskytree_tokyo_map', platform: 'map' },
  ],
  planning: [
    { label: '淺草寺攻略', href: '/tokyo/sensoji-guide?from=skytree-guide', event: 'tokyoskytree_sensoji_article', platform: 'article', primary: true },
    { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=skytree-guide', event: 'tokyoskytree_9areas_article', platform: 'article' },
    { label: '東京票券整理', href: '/tokyo/ticket?tag=%E6%99%B4%E7%A9%BA%E5%A1%94&from=skytree-guide#ticketListTitle', event: 'tokyoskytree_ticket_page', platform: 'ticket' },
    { label: '東京住宿區域', href: '/tokyo/hotel?from=skytree-guide', event: 'tokyoskytree_hotel', platform: 'hotel' },
  ],
}

const visitSteps: VisitStep[] = [
  { place: '押上站 B3 出口', focus: '進入晴空塔與 Solamachi 區域', note: '先搭地鐵到押上站，從 B3 出口進入晴空塔最直覺，跟著展望台指標走。' },
  { place: '4 樓入口', focus: '搭電梯上觀景台', note: '抵達 4 樓後先找展望台入口，線上買票的人準備好 QR Code，現場買票則看 4 樓售票櫃台。' },
  { place: '天望甲板 350 樓', focus: '先拍東京夜景與城市景觀', note: '上觀景台後先到 350 樓，這裡視野最完整，很適合先把東京天際線和城市景觀拍起來。' },
  { place: '天望回廊 445 樓', focus: '走一圈天望回廊', note: '如果有買回廊票，從 350 樓再搭電梯到 445 樓，沿著玻璃回廊慢慢走。' },
  { place: '天望回廊 450 樓', focus: '再搭電梯回到 345 樓', note: '走到 450 樓後，把最高視角收好，再搭電梯回到天望甲板 345 樓。' },
  { place: '天望甲板 340 樓', focus: '透明地板與 5 樓出口', note: '從 345 樓搭手扶梯到 340 樓，這裡有透明地板可以往下看，最後搭電梯回到 5 樓出口。' },
]

const faqItems = [
  {
    q: '東京晴空塔從哪一站去最方便？',
    a: '最直覺是搭到押上站，從 B3 出口進入晴空塔與 Solamachi 區域，再跟著指標到 4 樓展望台入口。',
  },
  {
    q: '晴空塔入口在哪一樓？',
    a: '展望台入口與售票櫃台在 4 樓。抵達後先找 4 樓入口，線上票準備 QR Code，現場票則看當天售票狀況。',
  },
  {
    q: '天望甲板和天望回廊差在哪？',
    a: '天望甲板是主要展望區，包含 340 樓、345 樓、350 樓；天望回廊是更高的 445 樓到 450 樓玻璃回廊。第一次去若預算夠，很適合兩個都上；只想看夜景，天望甲板也夠有感。',
  },
  {
    q: '晴空塔建議什麼時間去？',
    a: '下午到晚上最順，可以先逛 Solamachi，再上展望台看白天、夕陽和夜景。若想和淺草寺排同一天，建議淺草放上午或中午，晴空塔放下午到晚上。',
  },
  {
    q: '晴空塔要預留多久？',
    a: '只上天望甲板抓 1 到 1.5 小時；加天望回廊、透明地板、商店和 Solamachi，建議抓 2 到 3 小時比較舒服。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoSkytreeGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoSkytreeGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoSkytreeGuideCanonical,
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

type TokyoSkytreeGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'tokyo-video') return '/tokyo/video'
  if (value === 'map' || value === 'tokyo-map') return '/tokyo/map'
  if (value === 'tokyo-9-areas-guide' || value === '9areas') return '/tokyo/tokyo-9-areas-guide'
  if (value === 'sensoji-guide') return '/tokyo/sensoji-guide'
  if (value === 'shibuya-sky-guide') return '/tokyo/shibuya-sky-guide'
  if (value === 'hotel' || value === 'tokyo-hotel') return '/tokyo/hotel'
  if (value === 'transport' || value === 'tokyo-transport') return '/tokyo/transport'
  if (value === 'ticket' || value === 'tokyo-ticket') return '/tokyo/ticket'
  return '/tokyo'
}

export default async function TokyoSkytreeGuidePage({ searchParams }: TokyoSkytreeGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyoskytree" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京景點攻略"
          h1="東京晴空塔攻略｜押上站 B3 出口、4 樓入口到天望回廊"
          intro="東京晴空塔最適合和淺草、押上排在同一天。這篇把押上站 B3 出口進入晴空塔、4 樓入口、天望甲板 340 樓/345 樓/350 樓、天望回廊 445 樓/450 樓、透明地板和票券選擇整理好。"
          eventPrefix="tokyoskytree"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyoskytree_hero_quick', platform: 'article' },
            { label: '參觀順序', href: '#route-order', dataEvent: 'tokyoskytree_hero_route', platform: 'article' },
            { label: '票券選擇', href: '#tickets', dataEvent: 'tokyoskytree_hero_tickets', platform: 'ticket' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="東京晴空塔攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">交通</span>
              <strong>押上站 B3 出口</strong>
              <p>先搭地鐵到押上站，從 B3 出口進入晴空塔，再到 4 樓搭電梯上觀景台。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">入口</span>
              <strong>4 樓入口搭電梯</strong>
              <p>到 4 樓展望台入口後，依票券或現場指示搭電梯上天望甲板。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主要區域</span>
              <strong>天望甲板 340 樓 / 345 樓 / 350 樓</strong>
              <p>350 樓看全景，345 樓逛商店餐廳，340 樓看透明地板。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">加購區</span>
              <strong>天望回廊 445 樓 / 450 樓</strong>
              <p>想要更高視角和空中走廊感，再加天望回廊最完整。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="東京晴空塔短影音">
          <h2 className="seo-h2">先看短影音：晴空塔現場視角</h2>
          <div className="seo-prose">
            <p>
              晴空塔很適合先看畫面再決定要不要買天望回廊。短影音可以先抓展望台高度、夜景感、周邊商場和淺草同日動線，再回來照文章排順序。
            </p>
            <SeoVideoLinkMenu label="晴空塔" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="arrival" aria-label="東京晴空塔交通入口">
          <h2 className="seo-h2">交通入口：押上站 B3 出口進入，再到 4 樓入口</h2>
          <div className="seo-prose">
            <p>
              去東京晴空塔，先搭地鐵到押上站，從 B3 出口進入晴空塔，再到 4 樓搭電梯上觀景台。第一次去照這句走就很清楚，不用在 Solamachi 裡面亂找入口。
            </p>
            <p>
              抵達 4 樓後，先找展望台入口與售票櫃台。已經線上買票的人，準備好 QR Code；如果還沒買票，就要看現場是否還有當日時段。想省時間，我會建議先在線上確認票券。
            </p>
            <ActionLinks label="晴空塔地圖" links={linkGroups.maps} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="東京晴空塔參觀順序">
          <h2 className="seo-h2">建議參觀順序：350 樓、445 樓、450 樓、345 樓、340 樓</h2>
          <div className="seo-prose">
            <p>
              晴空塔展望台不要亂走，照這個順序走，所有觀景點都不會錯過：先到 350 樓拍東京夜景與城市景觀，再搭電梯到 445 樓走一圈天望回廊，走到 450 樓後搭電梯回到 345 樓，接著搭手扶梯到 340 樓看透明地板，最後搭電梯回到 5 樓出口。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/tokyo-skytree-route-map.png"
                alt="東京晴空塔展望台樓層路線圖，標示 4 樓入口、350 樓天望甲板、445 樓與 450 樓天望回廊、345 樓、340 樓和 5 樓出口動線"
                width={797}
                height={1348}
                sizes="(max-width: 720px) 100vw, 620px"
              />
              <figcaption>晴空塔展望台路線圖：4 樓入口搭電梯到 350 樓，再依票種上天望回廊，最後回到 340 樓透明地板與 5 樓出口。</figcaption>
            </figure>

            <div className="haneda-route-steps" role="list" aria-label="晴空塔參觀步驟">
              {visitSteps.map((item) => (
                <div key={item.place} className="haneda-route-step" role="listitem">
                  <div>
                    <h3 className="seo-h3">{item.place}</h3>
                    <p>
                      <strong>{item.focus}</strong>
                    </p>
                    <p>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-content" id="deck-vs-galleria" aria-label="天望甲板與天望回廊比較">
          <h2 className="seo-h2">天望甲板 vs 天望回廊：第一次去怎麼選？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">天望甲板：第一次去最基本、也最夠用</h3>
            <p>
              天望甲板是晴空塔的主要展望區，分成 340 樓、345 樓、350 樓。350 樓是第一個抵達的主展望層，視野最直覺；345 樓有餐廳和限定商店；340 樓有透明地板，很適合當最後拍照重點。
            </p>

            <h3 className="seo-h3">天望回廊：更高、更有空中散步感</h3>
            <p>
              天望回廊是 445 樓到 450 樓的玻璃回廊，視角更高，空間感也更特別。它比較適合想收集最高視角、想拍空中走廊、或第一次來東京想完整體驗晴空塔的人。
            </p>

            <h3 className="seo-h3">我的建議：第一次、天氣好、預算夠就兩個都上</h3>
            <p>
              如果天氣很好，又是第一次來晴空塔，天望甲板加天望回廊最完整；如果天氣普通、預算有限，或只想看夜景，天望甲板其實已經很有震撼感。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tickets" aria-label="東京晴空塔票券">
          <h2 className="seo-h2">晴空塔票券怎麼買：先決定要不要上天望回廊</h2>
          <div className="seo-prose">
            <p>
              買晴空塔票券前，先決定你要「只上天望甲板」還是「天望甲板加天望回廊」。如果行程排在下午到晚上、天氣預報不錯、又想一次收完整高空視角，就可以考慮買含回廊的票；如果只是想看東京夜景，天望甲板會比較簡單。
            </p>
            <ActionLinks label="晴空塔票券" links={linkGroups.tickets} />
            <p>
              晴空塔可以和淺草寺排半天到一天。最順是上午或中午走淺草寺，下午到押上逛 Solamachi，傍晚或晚上再上晴空塔，動線不太需要跨區。
            </p>
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="東京晴空塔行程排法">
          <h2 className="seo-h2">晴空塔行程怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">半日版：淺草寺接晴空塔</h3>
            <ul>
              <li>上午或中午先到淺草寺，走雷門、仲見世通、寶藏門、正殿。</li>
              <li>到淺草文化觀光中心 8 樓，先免費看晴空塔和淺草全景。</li>
              <li>下午前往押上，逛 Tokyo Solamachi 或墨田水族館。</li>
              <li>傍晚到晚上上晴空塔展望台，看東京天際線和夜景。</li>
            </ul>

            <h3 className="seo-h3">只排晴空塔：抓 2 小時比較穩</h3>
            <p>
              如果只排晴空塔展望台，天望甲板抓 1 到 1.5 小時；加天望回廊、透明地板、商店和拍照，抓 2 小時會比較舒服。若還要逛 Solamachi 或吃飯，就把整個押上區抓半天。
            </p>
            <ActionLinks label="晴空塔延伸規劃" links={linkGroups.planning} />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="晴空塔可以和東京東側這樣排"
          intro="晴空塔和淺草同屬東京東側，適合排在同一天；先看地圖與區域攻略，再決定是否使用地鐵券。"
          links={[
            { label: '淺草寺攻略', href: '/tokyo/sensoji-guide?from=skytree-guide', event: 'skytree_related_sensoji', primary: true },
            { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=skytree-guide', event: 'skytree_related_areas' },
            { label: '東京旅遊地圖', href: '/tokyo/map?from=skytree-guide', event: 'skytree_related_map' },
          ]}
        />
        <SeoFaqSection title="東京晴空塔攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
