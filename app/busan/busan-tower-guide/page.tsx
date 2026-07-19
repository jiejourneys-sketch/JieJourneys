import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { busanTicketCards } from '@/data/busan/tickets'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanTowerGuideCanonical,
  busanTowerGuideDescription,
  busanTowerGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type TowerStep = {
  step: string
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
    { label: 'IG Reels', href: 'https://www.instagram.com/reel/DMKh_XmzOdG/', event: 'busantower_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/e3-R4YEj7Cw', event: 'busantower_video_yt', platform: 'YouTube' },
  ],
  planning: [
    { label: '釜山最速攻略', href: '/busan/busan-fast-guide?from=busan-tower-guide', event: 'busantower_fastguide', platform: 'article', primary: true },
    { label: '釜山景點地圖', href: '/busan/map?from=busan-tower-guide', event: 'busantower_map', platform: 'map' },
    { label: '釜山票券整理', href: '/busan/ticket?from=busan-tower-guide', event: 'busantower_ticket', platform: 'ticket' },
  ],
  towerTickets: ticketLinksFor('釜山塔', 'busantower_ticket'),
}

const routeSteps: TowerStep[] = [
  { step: '先從南浦洞吃逛', place: 'BIFF廣場、富平罐頭市場、國際市場', focus: '小吃、伴手禮、舊市區街景', note: '把平面街區先逛完，最後再上山看整個南浦。' },
  { step: '找手扶梯入口', place: 'CU光復中央店旁邊巷口一帶', focus: '龍頭山公園手扶梯入口', note: '不要只導航釜山塔正門，容易被帶去比較累的坡路或樓梯。' },
  { step: '搭手扶梯上龍頭山公園', place: '光復路時尚街往上', focus: '省腳力、少爬坡', note: '看到手扶梯就一路往上，到公園後再往釜山塔方向走。' },
  { step: '傍晚上展望台', place: '釜山塔 / Diamond Tower', focus: '夕陽、南浦洞、釜山港、影島', note: '傍晚到晚上可以一次看白天轉夜景。' },
  { step: '晚上看光雕煙火秀', place: '塔內窗景與投影效果', focus: '夜景加 virtual fireworks / mapping show', note: '常見晚間主段約 20:00 到 22:00 前後，實際場次以現場公告為準。' },
]

const faqItems = [
  {
    q: '釜山塔手扶梯入口在哪裡？',
    a: '最省力的入口在光復路時尚街一帶，靠近 CU光復中央店旁邊巷口。導航時可以找龍頭山公園手扶梯入口，不要只導釜山塔正門，才不容易被帶去爬坡路線。',
  },
  {
    q: '釜山塔適合排在南浦洞行程哪個時間？',
    a: '最推薦排最後。先逛 BIFF廣場、富平罐頭市場、國際市場和札嘎其市場，傍晚再上釜山塔，從高處看回剛剛逛過的南浦洞，會很有總複習感。',
  },
  {
    q: '釜山塔晚上光雕煙火秀幾點看？',
    a: '晚間主段通常落在 20:00 到 22:00 前後，常見是每 10 分鐘左右一場；不過表演時間可能依季節或現場營運調整，抵達後先看當日公告最穩。',
  },
  {
    q: '釜山塔要買票嗎？',
    a: '龍頭山公園本身可以免費散步，但要上釜山塔展望台需要門票。只想拍塔外觀和公園可以不用買，想看高空夜景、窗景投影和展望台體驗就建議買票。',
  },
  {
    q: '釜山塔需要排多久？',
    a: '只上去看夜景大約抓 60 到 90 分鐘；如果你要慢慢拍照、等夕陽轉夜景、再看光雕煙火秀，抓 1.5 到 2 小時會比較舒服。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanTowerGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanTowerGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanTowerGuideCanonical,
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

type BusanTowerGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'ticket' || value === 'busan-ticket') return '/busan/ticket'
  if (value === 'nampo' || value === 'nampo-dong-guide') return '/busan/nampo-dong-guide'
  if (value === 'fast-guide' || value === 'busan-fast-guide') return '/busan/busan-fast-guide'
  return '/busan'
}

export default async function BusanTowerGuidePage({ searchParams }: BusanTowerGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busantower" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山塔攻略"
          h1="釜山塔攻略｜3 個小重點：手扶梯入口、南浦收尾、晚上光雕煙火秀"
          intro="釜山塔看起來很好找，但第一次去最容易卡在入口。真正省力的做法，是先找到光復路上的龍頭山公園手扶梯，逛完南浦洞再傍晚上去，把夕陽、夜景和光雕煙火秀一次收尾。"
          eventPrefix="busantower"
          showVisual={false}
          ctaLinks={[
            { label: '三個重點', href: '#three-tips', dataEvent: 'busantower_hero_tips', platform: 'article' },
            { label: '建議動線', href: '#route-order', dataEvent: 'busantower_hero_route', platform: 'article' },
            { label: '常見問題', href: '#seo-faq', dataEvent: 'busantower_hero_faq', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山塔攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">重點 1</span>
              <strong>手扶梯入口藏很深</strong>
              <p>入口在 CU光復中央店旁邊巷子一帶，找到龍頭山公園手扶梯，才不用一路爬坡上山。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">重點 2</span>
              <strong>排在南浦洞最後</strong>
              <p>逛完 BIFF廣場、富平罐頭市場、國際市場，再從高處看南浦，會像整天行程總複習。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">重點 3</span>
              <strong>晚上才是重頭戲</strong>
              <p>晚間光雕煙火秀最有氣氛，建議傍晚上塔，等天色轉暗後再看夜景。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">買票判斷</span>
              <strong>公園免費，展望台需門票</strong>
              <p>只逛龍頭山公園不用買票；想上高空展望台、看窗景和 mapping show 再買。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山塔短影音">
          <h2 className="seo-h2">先看短影音：釜山塔入口和夜景畫面</h2>
          <div className="seo-prose">
            <p>
              釜山塔最難不是塔本身，而是第一次會不知道該從哪裡上龍頭山公園。先看短影音抓入口、手扶梯和夜景感，再照這篇三個重點走，現場會順很多。
            </p>
            <SeoVideoLinkMenu label="釜山塔" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="three-tips" aria-label="釜山塔三個小重點">
          <h2 className="seo-h2">釜山塔攻略：三個小重點一定要知道</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 手扶梯入口藏很深：找 CU光復中央店旁邊巷子</h3>
            <p>
              釜山塔在龍頭山公園上方，地勢比南浦洞街區高。如果你直接用地圖導釜山塔，有機會被帶去比較累的坡路或樓梯。最省力的入口是在光復路時尚街一帶，靠近 CU光復中央店旁邊巷口，可以直接用
              <a
                href="https://maps.app.goo.gl/Ko3ufWszrBq1hkwA9"
                target="_blank"
                rel="noopener noreferrer"
                data-event="busantower_escalator_googlemap"
                data-platform="GoogleMap"
                data-section="article"
              >
                <strong>釜山塔手扶梯入口 Google Map</strong>
              </a>
              導過去，從那邊進去找龍頭山公園手扶梯。
            </p>
            <p>
              看到手扶梯後就一路往上，不用懷疑。搭到上方後會進到龍頭山公園，再往釜山塔方向走一小段就到。這個入口真的很容易錯過，很多人其實不是迷路，是少找到了這條省力路線。
            </p>

            <h3 className="seo-h3">2. 建議把釜山塔排在南浦行程最後</h3>
            <p>
              釜山塔最適合放在南浦洞行程最後。白天先逛 BIFF廣場、富平罐頭市場、國際市場和札嘎其市場，把街區走過一輪；傍晚再搭手扶梯上龍頭山公園，從高處往下看，你會突然理解剛剛逛的南浦洞、港邊和市場位置。
            </p>
            <p>
              這種排法很像一天的總複習：先在街上吃喝逛買，最後用城市夜景把地理感補起來。想把整天排順，可以先看
              <a
                href="/busan/nampo-dong-guide?from=busan-tower-guide"
                data-event="busantower_nampo_article_inline"
                data-platform="article"
                data-section="article"
              >
                <strong>南浦洞攻略</strong>
              </a>
              ，再把釜山塔放到最後一站。
            </p>

            <h3 className="seo-h3">3. 晚上才是重頭戲：光雕煙火秀很適合收尾</h3>
            <p>
              釜山塔白天可以看釜山港、影島和南浦洞街區，但晚上才最有記憶點。展望台可以看城市燈光，塔內也有搭配夜景的投影和 virtual fireworks / mapping show，適合情侶、朋友或想拍夜景的人。
            </p>
            <p>
              晚間主段可以抓 20:00 到 22:00 前後，常見約每 10 分鐘一場。表演時間可能依季節、天候或現場營運調整，抵達後先看當日公告最穩。確定要上展望台的話，票券可以先在這裡看。
            </p>
            <ActionLinks label="釜山塔購票連結" links={linkGroups.towerTickets} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="釜山塔建議動線">
          <h2 className="seo-h2">釜山塔建議動線：南浦洞吃逛後，再搭手扶梯上山</h2>
          <div className="seo-prose">
            <p>
              如果你是第一次釜山自由行，釜山塔不要單獨排一趟。它最適合接在南浦洞市場、BIFF廣場和札嘎其市場後面，動線順，情緒也最完整。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>順序</th>
                    <th>位置</th>
                    <th>重點</th>
                    <th>提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {routeSteps.map((step) => (
                    <tr key={step.step}>
                      <td>{step.step}</td>
                      <td>{step.place}</td>
                      <td>{step.focus}</td>
                      <td>{step.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">我的半日排法</h3>
            <ol>
              <li>下午先逛 BIFF廣場和富平罐頭市場。</li>
              <li>接國際市場買伴手禮或小物。</li>
              <li>傍晚走到光復路，找 CU光復中央店旁邊巷口的手扶梯入口。</li>
              <li>搭手扶梯上龍頭山公園，慢慢走到釜山塔。</li>
              <li>上展望台看夕陽轉夜景，晚上等光雕煙火秀。</li>
            </ol>

            <h3 className="seo-h3">如果只想拍外觀，需要買票嗎？</h3>
            <p>
              不需要。龍頭山公園可以散步拍塔外觀，也能感受南浦洞上方的公園氣氛。只有想進釜山塔展望台、看高空景色和夜間投影體驗時，才需要買票。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="釜山塔延伸規劃">
          <h2 className="seo-h2">釜山塔之後怎麼接其他行程</h2>
          <div className="seo-prose">
            <p>
              釜山塔適合當南浦洞一天的最後句點。看完夜景後，如果還有體力，可以回 BIFF廣場補小吃，或去札嘎其市場附近吃海鮮；隔天再把海雲台、膠囊列車或廣安里夜景分開排，節奏會更舒服。
            </p>
            <ActionLinks label="釜山塔延伸攻略" links={linkGroups.planning} />
          </div>
        </section>

        <SeoFaqSection title="釜山塔攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
