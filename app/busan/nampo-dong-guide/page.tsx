import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { busanTicketCards } from '@/data/busan/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanNampoGuideCanonical,
  busanNampoGuideDescription,
  busanNampoGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type NampoSpot = {
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
  nampoPart1: [
    { label: '上集 IG Reels', href: 'https://www.instagram.com/reel/DLKer30zmDd/', event: 'busannampo_part1_ig', platform: 'IG', primary: true },
    { label: '上集 YouTube', href: 'https://www.youtube.com/shorts/wN0KHurau78', event: 'busannampo_part1_yt', platform: 'YouTube' },
  ],
  nampoPart2: [
    { label: '下集 IG Reels', href: 'https://www.instagram.com/reel/DLeby5yTVTm/', event: 'busannampo_part2_ig', platform: 'IG', primary: true },
    { label: '下集 YouTube', href: 'https://www.youtube.com/shorts/R8bRLgm5HEA', event: 'busannampo_part2_yt', platform: 'YouTube' },
  ],
  gamcheonVideos: [
    { label: '甘川洞小王子 IG', href: 'https://www.instagram.com/reel/DL408o_ze1X/', event: 'busannampo_gamcheon_ig', platform: 'IG', primary: true },
    { label: '甘川洞小王子 YouTube', href: 'https://www.youtube.com/shorts/RZREPyNT-Fo', event: 'busannampo_gamcheon_yt', platform: 'YouTube' },
  ],
  towerVideos: [
    { label: '釜山塔 IG', href: 'https://www.instagram.com/reel/DMKh_XmzOdG/', event: 'busannampo_tower_ig', platform: 'IG' },
    { label: '釜山塔 YouTube', href: 'https://www.youtube.com/shorts/e3-R4YEj7Cw', event: 'busannampo_tower_yt', platform: 'YouTube' },
  ],
  planning: [
    { label: '釜山最速攻略', href: '/busan/busan-fast-guide?from=nampo-dong-guide', event: 'busannampo_fastguide', platform: 'article', primary: true },
    { label: '釜山景點地圖', href: '/busan/map?from=nampo-dong-guide', event: 'busannampo_map', platform: 'map' },
    { label: '釜山住宿區域', href: '/busan/hotel?from=nampo-dong-guide', event: 'busannampo_hotel', platform: 'hotel' },
    { label: '釜山票券整理', href: '/busan/ticket?from=nampo-dong-guide', event: 'busannampo_ticket', platform: 'ticket' },
  ],
  towerTickets: ticketLinksFor('釜山塔', 'busannampo_tower_ticket'),
}

const nampoSpots: NampoSpot[] = [
  { spot: 'BIFF廣場', bestTime: '中午到晚上', focus: '糖餅、炸年糕、魚板、街頭小吃', routeNote: '住附近很方便，適合第一站或回飯店前補宵夜。' },
  { spot: '釜山塔', bestTime: '傍晚到晚上', focus: '夕陽、舊市區夜景、龍頭山公園', routeNote: '放最後最順，逛完市場後上去收尾。' },
  { spot: '富平罐頭市場＆國際市場', bestTime: '中午到下午', focus: '市場小吃、古早味小店、伴手禮、特色小物', routeNote: '兩個市場距離近，可以午餐後一路逛。' },
  { spot: '札嘎其市場', bestTime: '晚餐', focus: '現點海鮮、生魚片、烤魚、海鮮鍋', routeNote: '先看價格和料理方式，再決定要不要現場吃。' },
  { spot: '樂天超市', bestTime: '下午到傍晚', focus: '零食、泡麵、面膜、保養品、伴手禮', routeNote: '安排在晚餐前，買完可先回飯店或寄放。' },
  { spot: '甘川洞文化村', bestTime: '早上', focus: '彩色屋、小王子、山城巷弄、文青打卡', routeNote: '先衝山上最舒服，再回南浦洞吃飯逛市場。' },
]

const faqItems = [
  {
    q: '釜山南浦洞適合第一次自由行住嗎？',
    a: '適合，尤其你想吃市場、逛舊市區、去甘川洞文化村、釜山塔和札嘎其市場。缺點是離海雲台比較遠，如果每天都想看海，就可以考慮西面或海雲台。',
  },
  {
    q: '南浦洞住 BIFF廣場附近好嗎？',
    a: '很方便。BIFF廣場周邊吃東西、逛市場和搭地鐵都順，早上去甘川洞、晚上回來吃小吃或上釜山塔，都不用繞太遠。',
  },
  {
    q: '甘川洞文化村和南浦洞可以排同一天嗎？',
    a: '可以，而且很推薦。早上先去甘川洞文化村，避開比較熱和人比較多的時段；中午回南浦洞接富平罐頭市場、國際市場、樂天超市、札嘎其市場和釜山塔。',
  },
  {
    q: '釜山塔什麼時候去最漂亮？',
    a: '建議傍晚前後去，先看天色變化，再接夜景。這樣比純白天上去更有記憶點，也很適合當南浦洞一日線的最後收尾。',
  },
  {
    q: '札嘎其市場晚餐怎麼安排比較不踩雷？',
    a: '先看想吃生魚片、烤魚還是海鮮鍋，問清楚海鮮價格和料理費，再決定。只想感受市場氣氛的人，也可以先逛一圈再去附近餐廳吃。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanNampoGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanNampoGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanNampoGuideCanonical,
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

type BusanNampoGuidePageProps = {
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

export default async function BusanNampoGuidePage({ searchParams }: BusanNampoGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busannampo" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山南浦洞攻略"
          h1="釜山南浦洞攻略｜BIFF廣場、釜山塔、富平罐頭市場、札嘎其市場、甘川洞怎麼排？"
          intro="南浦洞是第一次釜山自由行最容易排順的一區：市場小吃、海鮮、釜山塔夜景、樂天超市採買和甘川洞文化村都在同一側。這篇把南浦洞上集的主要景點、下集的行程順序整理成可以直接照走的一日動線。"
          eventPrefix="busannampo"
          showVisual={false}
          ctaLinks={[
            { label: '主要景點', href: '#main-spots', dataEvent: 'busannampo_hero_spots', platform: 'article' },
            { label: '建議順序', href: '#route-order', dataEvent: 'busannampo_hero_order', platform: 'article' },
            { label: '常見問題', href: '#seo-faq', dataEvent: 'busannampo_hero_faq', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山南浦洞攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">住哪裡</span>
              <strong>BIFF廣場附近最省力</strong>
              <p>早上出門去甘川洞，回來吃市場、逛樂天超市和看釜山塔都很順。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">先去哪</span>
              <strong>早上先衝甘川洞文化村</strong>
              <p>山坡地早上比較舒服，人潮也通常比下午少，拍彩色屋和小王子比較不狼狽。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">吃什麼</span>
              <strong>午餐市場、晚餐海鮮</strong>
              <p>富平罐頭市場和國際市場吃小吃，札嘎其市場留給晚餐海鮮大餐。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">怎麼收尾</span>
              <strong>傍晚到晚上上釜山塔</strong>
              <p>夕陽和夜景一起看，會比白天單純上展望台更有感。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山南浦洞短影音">
          <h2 className="seo-h2">先看短影音：上集看景點，下集看順序</h2>
          <div className="seo-prose">
            <p>
              南浦洞上集適合先抓有哪些點：BIFF廣場、釜山塔、富平罐頭市場、國際市場、札嘎其市場、樂天超市和甘川洞文化村。下集則是把順序排出來，避免你在南浦洞來回走到崩潰。
            </p>
            <SeoVideoLinkMenu label="南浦洞｜景點篇" links={linkGroups.nampoPart1} />
            <SeoVideoLinkMenu label="南浦洞｜行程篇" links={linkGroups.nampoPart2} />
            <p>
              想先看畫面感，可以補甘川洞文化村和釜山塔短影音。樂天超市則放在下午採買就好，不用另外把它排成一個很重的景點。
            </p>
            <SeoVideoLinkMenu label="甘川洞小王子" links={linkGroups.gamcheonVideos} />
            <SeoVideoLinkMenu label="釜山塔" links={linkGroups.towerVideos} />
          </div>
        </section>

        <section className="seo-content" id="main-spots" aria-label="釜山南浦洞主要景點">
          <h2 className="seo-h2">南浦洞主要景點：先看這六個就夠</h2>
          <div className="seo-prose">
            <p>
              南浦洞最強的是密度。你可以把它想成「吃、逛、買、看夜景」都在同一區完成，只有甘川洞文化村需要先上山再回來。下面這張表先把每個點放在同一張行程視角看。
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
                  {nampoSpots.map((spot) => (
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

            <h3 className="seo-h3">BIFF廣場：邊走邊吃最有南浦洞感</h3>
            <p>
              BIFF廣場是南浦洞最適合「先走進去」的地方。這裡不是要排很久的景點，而是邊走邊吃糖餅、炸年糕、魚板和各種市場小吃。住在 BIFF廣場附近的好處，就是早上出門方便，晚上回來還能順手買宵夜。
            </p>

            <h3 className="seo-h3">釜山塔：傍晚去，看夕陽和夜景最美</h3>
            <p>
              釜山塔在龍頭山公園一帶，很適合作為南浦洞一日線的最後一站。白天上去能看海和舊市區，傍晚到晚上則能把夕陽、城市燈光和港邊夜景一起收進來。第一次去很容易找不到手扶梯入口，可以先看
              <a
                href="/busan/busan-tower-guide?from=nampo-dong-guide"
                data-event="busannampo_tower_article"
                data-platform="article"
                data-section="article"
              >
                <strong>釜山塔攻略</strong>
              </a>
              ，再看票價和可入場時段。
            </p>
            <ActionLinks label="釜山塔購票連結" links={linkGroups.towerTickets} />

            <h3 className="seo-h3">富平罐頭市場＆國際市場：小吃、歷史味、小物一次逛</h3>
            <p>
              富平罐頭市場偏食物，國際市場偏雜貨、伴手禮和老市場氣氛，兩個距離近，很適合午餐後接著逛。富平罐頭市場可以找炸雞、年糕、魚板和各種熱食；國際市場則更像老釜山的生活百貨，巷弄多，看到喜歡的小物就可以下手。
            </p>

            <h3 className="seo-h3">札嘎其市場：海鮮控的天堂</h3>
            <p>
              札嘎其市場是釜山最代表性的海鮮市場之一，適合放晚餐。你可以先逛一圈看海鮮種類，再決定要現點現吃，或改去附近餐廳吃比較固定的餐點。重點是先問清楚價格、料理方式和是否另收料理費，這樣會安心很多。
            </p>

            <h3 className="seo-h3">樂天超市：零食、面膜、伴手禮一次買好</h3>
            <p>
              南浦洞一帶的樂天超市很適合放在下午到傍晚，買韓國零食、泡麵、面膜、保養品和伴手禮。我的排法是市場吃完、晚餐前先去掃貨，買多的話先回飯店放，晚上再去札嘎其市場或釜山塔，手上不會一路提到崩潰。
            </p>

            <h3 className="seo-h3">甘川洞文化村：早上先上山拍彩色屋和小王子</h3>
            <p>
              甘川洞文化村是南浦洞這條線最適合早上先去的點。它是山坡上的彩色聚落，拍照點、壁畫、小店和小王子都需要慢慢走；越晚越容易遇到人潮和體力下降。想專心拍小王子和新版小王子，可以先看
              <a
                href="/busan/gamcheon-culture-village-guide?from=nampo-dong-guide"
                data-event="busannampo_gamcheon_article"
                data-platform="article"
                data-section="article"
              >
                <strong>甘川洞文化村攻略</strong>
              </a>
              。這裡也是居民生活區，拍照時放低音量、不要打擾住宅會更好。
            </p>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="釜山南浦洞建議順序">
          <h2 className="seo-h2">南浦洞一日行程建議順序</h2>
          <div className="seo-prose">
            <p>
              這條路線的重點是先處理最需要體力的甘川洞，再回市區吃飯逛街，最後把夜景放在釜山塔。這樣不用一直上上下下，也不會晚餐後才發現自己還要爬山拍照。
            </p>
            <ol>
              <li>住在 BIFF廣場附近，早上出門最方便。</li>
              <li>早上先衝甘川洞文化村，山上比較不熱，人也比較少。</li>
              <li>回市區吃富平罐頭市場午餐，炸雞、年糕、魚板可以一路補。</li>
              <li>吃完接力逛國際市場，找古早味小店、特色小物和伴手禮。</li>
              <li>接著去樂天超市掃貨，零食、面膜、保養品一次補起來。</li>
              <li>晚餐衝札嘎其市場吃海鮮大餐。</li>
              <li>最後上釜山塔，用夕陽和夜景收尾。</li>
            </ol>

            <h3 className="seo-h3">如果只有半天怎麼取捨？</h3>
            <p>
              只有半天就不要硬排甘川洞。可以用 BIFF廣場、富平罐頭市場、國際市場、樂天超市、札嘎其市場、釜山塔組成南浦洞半日線；甘川洞留給隔天早上，拍起來會更舒服。
            </p>

            <h3 className="seo-h3">如果住海雲台，南浦洞要怎麼排？</h3>
            <p>
              住海雲台時，南浦洞最好排成完整一天，不要只為了吃晚餐跑過來。早上出發到甘川洞，中午回南浦洞一路玩到釜山塔夜景，最後再回海雲台，交通成本才值得。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="釜山南浦洞延伸規劃">
          <h2 className="seo-h2">接著把南浦洞放回整趟釜山行程</h2>
          <div className="seo-prose">
            <p>
              南浦洞適合當第一天或舊市區整天。如果你還沒決定其他天要住西面還是海雲台，可以先看釜山最速攻略，再用地圖確認每天動線；票券則只先處理釜山塔這種會影響入場時間的項目就好。
            </p>
            <ActionLinks label="釜山南浦洞延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="釜山南浦洞攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
