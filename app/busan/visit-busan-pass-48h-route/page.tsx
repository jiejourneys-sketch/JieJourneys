import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  visitBusanPass48hRouteCanonical,
  visitBusanPass48hRouteDescription,
  visitBusanPass48hRouteTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type DayRoute = {
  day: string
  theme: string
  items: string[]
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
    { label: '48小時走法 IG', href: 'https://www.instagram.com/reel/DO0y_wnEUa9/', event: 'busanpass48_video_ig', platform: 'IG', primary: true },
    { label: '48小時走法 YouTube', href: 'https://www.youtube.com/shorts/kuU-6nMmR4Y', event: 'busanpass48_video_yt', platform: 'YouTube' },
  ],
  pass: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312', event: 'busanpass48_buy_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798', event: 'busanpass48_buy_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', event: 'busanpass48_buy_trip', platform: 'Trip' },
    { label: '官方', href: 'https://www.visitbusanpass.com/', event: 'busanpass48_buy_official', platform: 'Official' },
  ],
  planning: [
    { label: '釜山通行證完整整理', href: '/busan/visit-busan-pass?from=visit-busan-pass-48h-route', event: 'busanpass48_pass_article', platform: 'article', primary: true },
    { label: '24小時極限走法', href: '/busan/visit-busan-pass-24h-route?from=visit-busan-pass-48h-route', event: 'busanpass48_24h_article', platform: 'article' },
    { label: '通行證地圖', href: '/busan/pass-map?from=visit-busan-pass-48h-route', event: 'busanpass48_pass_map', platform: 'map' },
    { label: '南浦洞攻略', href: '/busan/nampo-dong-guide?from=visit-busan-pass-48h-route', event: 'busanpass48_nampo_article', platform: 'article' },
  ],
}

const dayRoutes: DayRoute[] = [
  {
    day: 'Day 1',
    theme: '甘川洞、南浦洞、松島收集市區與海景',
    items: [
      '一早先去甘川洞文化村',
      '10:30 後換韓服體驗，讓 48 小時從這裡開始跑',
      '松島海上纜車＋松島龍宮雲橋',
      '釜山塔＋釜山電影體驗博物館',
      '結尾看體力選釜山觀光巴士或西面站景點',
    ],
    note: '甘川洞本身可以早點去拍照，真正要刷通行證的點留到 10:30 後再開始。',
  },
  {
    day: 'Day 2',
    theme: '東釜山和海雲台把高價體驗串起來',
    items: [
      '早上斜坡滑車',
      '紅磚校園打卡',
      '汗蒸幕體驗',
      'BUSAN X the SKY 釜山展望台',
      '傍晚搭海岸列車',
      '晚上搭遊艇看夜景',
    ],
    note: '這天是回本主力，交通盡量不要再拉回南浦洞，集中東釜山和海雲台比較順。',
  },
  {
    day: 'Day 3 早上',
    theme: '10:30 前進樂天世界，把 48 小時吃滿',
    items: [
      '早餐不要排太滿，直接往樂天世界移動',
      '10:30 前完成入場或換票',
      '進園後慢慢玩，讓最後一個高價景點把價值拉滿',
    ],
    note: '關鍵是 Day 1 第一個免費景點不要太早刷，Day 3 早上才有時間接樂天世界。',
  },
]

const faqItems = [
  {
    q: '釜山通行證 48 小時可以玩到第三天嗎？',
    a: '可以把第一個免費景點安排在 Day 1 的 10:30 後啟用，這樣 Day 3 早上 10:30 前還在 48 小時內。重點是最後景點要在有效時間內完成入場或換票。',
  },
  {
    q: '為什麼 Day 1 早上先去甘川洞文化村？',
    a: '甘川洞早上人比較少、光線也舒服，而且文化村本身不需要拿來啟用通行證。先拍完，再把第一個需要刷 Pass 的韓服體驗放在 10:30 後。',
  },
  {
    q: '48 小時路線和 24 小時路線差在哪？',
    a: '24 小時是體力挑戰，重點是衝高價點；48 小時比較像第一次去釜山也能照著排的高 CP 值路線，可以分成南浦松島一天、東釜山海雲台一天。',
  },
  {
    q: '釜山通行證 48 小時需要先預約哪些？',
    a: '韓服、遊艇、部分體驗型景點通常要先確認預約或名額。建議先固定預約時間，再把不用預約的釜山塔、電影體驗博物館、海岸列車等景點塞進空檔。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: visitBusanPass48hRouteTitle.replace(' | JieJourneys(旅杰)', ''),
  description: visitBusanPass48hRouteDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: visitBusanPass48hRouteCanonical,
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

type VisitBusanPass48hRoutePageProps = {
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

export default async function VisitBusanPass48hRoutePage({ searchParams }: VisitBusanPass48hRoutePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanpass48" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山通行證攻略"
          h1="釜山通行證 48 小時走法"
          intro="48 小時比 24 小時舒服很多，但一樣可以玩得很賺。重點是 Day 1 不要太早開卡，把 48 小時延伸到 Day 3 早上，最後用樂天世界收尾。"
          eventPrefix="busanpass48"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'busanpass48_hero_quick', platform: 'article' },
            { label: '每日走法', href: '#route-order', dataEvent: 'busanpass48_hero_route', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'busanpass48_hero_ticket', platform: 'ticket' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山通行證 48 小時快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">開卡技巧</span>
              <strong>Day 1 早上先玩免費點</strong>
              <p>甘川洞先拍，10:30 後再刷第一個通行證景點。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">分區玩法</span>
              <strong>南浦松島一天，東釜山一天</strong>
              <p>把交通方向分開，行程會比 24 小時極限走法舒服很多。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">估算價值</span>
              <strong>1844 元玩出 5574 元</strong>
              <p>高價景點分散到兩天半，CP 值高又比較不爆炸。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最後一招</span>
              <strong>Day 3 早上進樂天世界</strong>
              <p>10:30 前完成入場或換票，把最後一個高價點塞進有效時間內。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山通行證 48 小時短影音">
          <h2 className="seo-h2">先看短影音：48 小時高 CP 值走法</h2>
          <div className="seo-prose">
            <p>
              這支適合先抓整體節奏：Day 1 先南浦松島、Day 2 拉到東釜山海雲台、Day 3 早上用樂天世界收尾。文字版則把每段時間點和注意事項補齊。
            </p>
            <SeoVideoLinkMenu label="48小時走法" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="釜山通行證 48 小時每日走法">
          <h2 className="seo-h2">48 小時走法：Day 1 到 Day 3 早上</h2>
          <div className="seo-prose">
            {dayRoutes.map((route) => (
              <section key={route.day} className="seo-inner-section" aria-label={`${route.day} 釜山通行證走法`}>
                <h3 className="seo-h3">{route.day}｜{route.theme}</h3>
                <ol>
                  {route.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <p>{route.note}</p>
              </section>
            ))}
          </div>
        </section>

        <section className="seo-content" id="route-notes" aria-label="釜山通行證 48 小時走法注意事項">
          <h2 className="seo-h2">這條路線最重要的三件事</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. Day 1 不要一早就開卡</h3>
            <p>
              甘川洞文化村適合早上先去，因為人少、光線好，而且不需要拿來啟用通行證。把第一個會刷 Pass 的景點壓到 10:30 後，就能把有效時間延伸到 Day 3 早上。
            </p>

            <h3 className="seo-h3">2. 需要預約的先固定</h3>
            <p>
              韓服、遊艇和部分體驗景點不要放到現場才處理。先固定這些預約時間，再用釜山塔、電影體驗博物館、海岸列車這類彈性較高的點填空。
            </p>

            <h3 className="seo-h3">3. 東釜山不要和南浦洞硬塞同一天</h3>
            <p>
              48 小時走法之所以舒服，是因為 Day 1 主攻甘川洞、南浦洞、松島，Day 2 主攻東釜山和海雲台。不要來回拉扯，交通時間會直接吃掉通行證價值。
            </p>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="釜山通行證 48 小時購票連結">
          <h2 className="seo-h2">釜山通行證購票連結</h2>
          <div className="seo-prose">
            <p>
              48 小時路線比 24 小時好排，但還是要先確認可用景點、預約規則和票種。買票前先比 KKDAY、KLOOK、Trip，再回官方確認使用規則。
            </p>
            <ActionLinks label="釜山通行證購票連結" links={linkGroups.pass} />
          </div>
        </section>

        <section className="seo-content" aria-label="釜山通行證 48 小時延伸攻略">
          <h2 className="seo-h2">延伸：先看完整通行證整理再排</h2>
          <div className="seo-prose">
            <p>
              如果你還沒確定要買 24 小時、48 小時、Big3 還是 Big5，先回完整整理看 A 區、B 區和不包含景點，再用地圖把這條路線標出來。
            </p>
            <ActionLinks label="釜山通行證延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="釜山通行證 48 小時常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
