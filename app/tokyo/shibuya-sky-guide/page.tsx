import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { tokyoTicketCards } from '@/data/tokyo/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoShibuyaSkyGuideCanonical,
  tokyoShibuyaSkyGuideDescription,
  tokyoShibuyaSkyGuideTitle,
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
    { label: 'SHIBUYA SKY IG', href: 'https://www.instagram.com/reel/DWJbrmXFDuf/', event: 'tokyoshibuyasky_video_ig', platform: 'IG', primary: true },
    { label: 'SHIBUYA SKY YouTube', href: 'https://www.youtube.com/shorts/Y0mGY55bSFs', event: 'tokyoshibuyasky_video_yt', platform: 'YouTube' },
  ],
  tickets: ticketLinksFor('SHIBUYA SKY', 'tokyoshibuyasky_ticket'),
  maps: [
    { label: 'SHIBUYA SKY Google Map', href: 'https://maps.app.goo.gl/UhTEtJqB9rCA8Xn98', event: 'tokyoshibuyasky_map_spot', platform: 'GoogleMap', primary: true },
    { label: '東京景點地圖', href: '/tokyo/map?from=shibuya-sky-guide', event: 'tokyoshibuyasky_tokyo_map', platform: 'map' },
  ],
  planning: [
    { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=shibuya-sky-guide', event: 'tokyoshibuyasky_9areas_article', platform: 'article', primary: true },
    { label: '明治神宮攻略', href: '/tokyo/meiji-jingu-guide?from=shibuya-sky-guide', event: 'tokyoshibuyasky_meiji_article', platform: 'article' },
    { label: '東京票券整理', href: '/tokyo/ticket?tag=SHIBUYA%20SKY&from=shibuya-sky-guide#ticketListTitle', event: 'tokyoshibuyasky_ticket_page', platform: 'ticket' },
    { label: '東京住宿區域', href: '/tokyo/hotel?from=shibuya-sky-guide', event: 'tokyoshibuyasky_hotel', platform: 'hotel' },
  ],
}

const visitSteps: VisitStep[] = [
  { place: '澀谷站', focus: '從東口方向出站', note: 'JR 可走中央剪票口或南剪票口後往東口方向；地鐵可看 B6 出口或澀谷 Scramble Square 指標。' },
  { place: '1 樓專用電梯', focus: '先找 SHIBUYA SKY 電梯', note: '不要先跑去商場亂繞，直接找通往 14 樓入口的專用電梯會最省時間。' },
  { place: '14 樓入口', focus: '報到、掃票、排隊入場', note: '票券入口和櫃台在 14 樓，建議保留一點緩衝，不要壓線抵達。' },
  { place: '45 樓展望區', focus: '搭電梯上樓，準備進入高空視野', note: '從 14 樓搭電梯上到 45 樓後，跟著動線往室外展望台走。' },
  { place: '室外展望台', focus: '東京天際線、澀谷十字路口、夜景', note: '這裡是最值得停留的重點，傍晚能看到白天、夕陽和夜景轉換。' },
  { place: '酒吧區', focus: '有消費或指定座位方案可坐著看夜景', note: '想要專屬座位就要留意現場與票種規則，熱門時段一樣建議提早安排。' },
]

const faqItems = [
  {
    q: 'SHIBUYA SKY 從澀谷站怎麼去？',
    a: '先到澀谷站，從東口方向走到澀谷 Scramble Square。到 1 樓找到 SHIBUYA SKY 專用電梯，搭到 14 樓入口報到入場。',
  },
  {
    q: 'SHIBUYA SKY 入口在哪一樓？',
    a: '入口和票券櫃台在澀谷 Scramble Square 14 樓。建議直接找 1 樓專用電梯上 14 樓，不要在商場樓層繞太久。',
  },
  {
    q: 'SHIBUYA SKY 要買哪個時段？',
    a: '最推薦傍晚日落前後，因為可以一次看到白天、夕陽和夜景。不過這也是最熱門的時段，通常要提前兩週開始搶票。',
  },
  {
    q: 'SHIBUYA SKY 要停留多久？',
    a: '只看景色抓 1 小時可以，但想拍照、等日落、看十字路口和坐酒吧區，建議抓 1.5 到 2 小時比較舒服。',
  },
  {
    q: 'SHIBUYA SKY 可以和明治神宮、原宿排同一天嗎？',
    a: '很適合。上午或中午排明治神宮、原宿和表參道，下午到澀谷逛街，傍晚再上 SHIBUYA SKY 看夕陽夜景，動線很順。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoShibuyaSkyGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoShibuyaSkyGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoShibuyaSkyGuideCanonical,
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

type TokyoShibuyaSkyGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'tokyo-video') return '/tokyo/video'
  if (value === 'map' || value === 'tokyo-map') return '/tokyo/map'
  if (value === 'tokyo-9-areas-guide' || value === '9areas') return '/tokyo/tokyo-9-areas-guide'
  if (value === 'meiji-jingu-guide') return '/tokyo/meiji-jingu-guide'
  if (value === 'hotel' || value === 'tokyo-hotel') return '/tokyo/hotel'
  if (value === 'transport' || value === 'tokyo-transport') return '/tokyo/transport'
  if (value === 'ticket' || value === 'tokyo-ticket') return '/tokyo/ticket'
  return '/tokyo'
}

export default async function TokyoShibuyaSkyGuidePage({ searchParams }: TokyoShibuyaSkyGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyoshibuyasky" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京景點攻略"
          h1="澀谷展望台 SHIBUYA SKY 攻略｜澀谷站東口、14 樓入口到日落夜景"
          intro="SHIBUYA SKY 是東京最熱門的戶外感展望台之一，重點不是只知道它在澀谷，而是要知道怎麼從澀谷站東口找到 1 樓專用電梯、上 14 樓入口、再進入 45 樓展望區。這篇把入場動線、拍照重點、酒吧座位和日落搶票整理好。"
          eventPrefix="tokyoshibuyasky"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyoshibuyasky_hero_quick', platform: 'article' },
            { label: '入場動線', href: '#route-order', dataEvent: 'tokyoshibuyasky_hero_route', platform: 'article' },
            { label: '票券重點', href: '#tickets', dataEvent: 'tokyoshibuyasky_hero_tickets', platform: 'ticket' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="SHIBUYA SKY 攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">交通</span>
              <strong>澀谷站東口方向</strong>
              <p>從澀谷站出來後，往澀谷 Scramble Square 走，找 SHIBUYA SKY 指標。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">入口</span>
              <strong>1 樓電梯上 14 樓</strong>
              <p>先到 1 樓找指定電梯，搭到 14 樓入口報到，不要在商場裡亂繞。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">重點</span>
              <strong>45 樓展望區接室外展望台</strong>
              <p>從入口搭電梯上到 45 樓後，照動線前往室外展望台看東京天際線。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">時間</span>
              <strong>日落最熱門</strong>
              <p>傍晚時段通常最難搶，想看夕陽夜景建議提前兩週開始看票。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="SHIBUYA SKY 短影音">
          <h2 className="seo-h2">先看短影音：SHIBUYA SKY 現場視角</h2>
          <div className="seo-prose">
            <p>
              SHIBUYA SKY 的亮點很直覺：高空、戶外感、澀谷十字路口、東京天際線。先看短影音抓現場視野，再回來對照入場動線，會比較知道自己要卡哪個時段。
            </p>
            <SeoVideoLinkMenu label="SHIBUYA SKY" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="arrival" aria-label="SHIBUYA SKY 交通入口">
          <h2 className="seo-h2">交通入口：先到澀谷站，往東口方向走</h2>
          <div className="seo-prose">
            <p>
              去 SHIBUYA SKY，先把目標設定成澀谷 Scramble Square。JR 可以從中央剪票口或南剪票口出來，往東口方向走；地鐵則可以看地下 B6 出口或澀谷 Scramble Square 指標。
            </p>
            <p>
              這裡最容易出錯的是跑錯樓或找錯電梯。你要找的是前往 SHIBUYA SKY 的 1 樓專用電梯，搭上去到 14 樓入口，再從入口進場。
            </p>
            <ActionLinks label="SHIBUYA SKY 地圖" links={linkGroups.maps} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="SHIBUYA SKY 入場動線">
          <h2 className="seo-h2">SHIBUYA SKY 入場順序：1 樓電梯、14 樓入口、45 樓展望區</h2>
          <div className="seo-prose">
            <p>
              第一次去照這條線最不容易迷路：澀谷站東口方向 → 澀谷 Scramble Square → 1 樓 SHIBUYA SKY 電梯 → 14 樓入口 → 搭電梯上 45 樓 → 室外展望台。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/tokyo-shibuya-sky-elevator-map.png"
                alt="SHIBUYA SKY 電梯動線示意圖，標示 B2F、B1F、1F、2F、3F 到 14F 入口與專用電梯位置"
                width={1418}
                height={1492}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>SHIBUYA SKY 電梯示意圖：從澀谷站、地下廣場或澀谷 Hikarie 方向進來，都先找通往 14 樓入口的專用電梯。</figcaption>
            </figure>

            <div className="haneda-route-steps" role="list" aria-label="SHIBUYA SKY 入場步驟">
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

        <section className="seo-content" id="view-points" aria-label="SHIBUYA SKY 拍照與看夜景重點">
          <h2 className="seo-h2">45 樓展望區看什麼：東京天際線與澀谷十字路口</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">室外展望台：整個東京天際線一次看</h3>
            <p>
              搭電梯到 45 樓後，跟著動線進入高空展望區，往上就是最有代表性的室外展望台。這裡可以看東京天際線，天氣好時視野很開；最經典的角度就是把澀谷十字路口、人潮、商場招牌和遠方城市線一起拍進去。
            </p>

            <h3 className="seo-h3">澀谷十字路口：白天、夕陽、夜景都不同</h3>
            <p>
              白天看得到街區結構，傍晚看城市慢慢亮燈，晚上則是霓虹、人潮和車流最有澀谷感。如果只能選一個時段，我會優先選日落前後，因為畫面變化最多。
            </p>

            <h3 className="seo-h3">酒吧區：有消費才有座位感</h3>
            <p>
              上方酒吧區很適合想坐著看夜景的人，但不要把它當成免費座位。若有消費或預訂指定座位方案，才比較能用專屬座位慢慢看夜景；想拍照為主的人，先把室外展望台時間留足會更重要。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tickets" aria-label="SHIBUYA SKY 票券與日落時段">
          <h2 className="seo-h2">SHIBUYA SKY 票券：日落時段最熱門，通常提前兩週搶</h2>
          <div className="seo-prose">
            <p>
              SHIBUYA SKY 最難搶的是傍晚日落時段。想看夕陽接夜景，通常要在開賣時就先卡票；如果你只是想看景，白天或較晚的夜景時段會比日落好買一點。可以先用下方平台比價，再回到行程把澀谷排在下午到晚上。
            </p>
            <ActionLinks label="SHIBUYA SKY 票券" links={linkGroups.tickets} />
            <p>
              安排行程時不要把明治神宮、原宿、表參道逛到太晚，因為 SHIBUYA SKY 是指定入場時間。建議把票券時段先確定，再反推白天要逛到幾點離開原宿。
            </p>
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="SHIBUYA SKY 行程排法">
          <h2 className="seo-h2">SHIBUYA SKY 行程怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">最順半日：明治神宮、原宿、澀谷</h3>
            <ul>
              <li>上午或中午先去明治神宮，走南參道到本殿。</li>
              <li>接原宿竹下通、表參道或 Cat Street。</li>
              <li>下午到澀谷逛街、拍十字路口。</li>
              <li>傍晚上 SHIBUYA SKY，看夕陽和夜景。</li>
            </ul>

            <h3 className="seo-h3">只排 SHIBUYA SKY：抓 1.5 到 2 小時最舒服</h3>
            <p>
              只想上展望台，抓 1 小時也能完成；但如果要拍照、等日落、喝一杯或坐酒吧區，建議抓 1.5 到 2 小時。進場前也要預留從澀谷站找到 1 樓電梯、上 14 樓入口的時間。
            </p>
            <ActionLinks label="SHIBUYA SKY 延伸規劃" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="SHIBUYA SKY 攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
