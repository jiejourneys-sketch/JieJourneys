import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import {
  tokyoSubwayTicketCanonical,
  tokyoSubwayTicketDescription,
  tokyoSubwayTicketTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  return (
    <div className="seo-buy-links seo-action-links" aria-label={label}>
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-event={link.event}
          data-platform={link.platform}
          data-section="article_link"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

const linkGroups = {
  ticketVideo: [
    { label: 'IG｜地鐵票券', href: 'https://www.instagram.com/reel/DTnNqDgkZOm/', event: 'tokyosubwayticket_video_ticket_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/dz2aJtW3y9c', event: 'tokyosubwayticket_video_ticket_yt', platform: 'YouTube' },
  ],
  tipsVideo: [
    { label: 'IG｜搭乘重點', href: 'https://www.instagram.com/reel/DT5PNXdk4DM/', event: 'tokyosubwayticket_video_tips_ig', platform: 'IG' },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/9KtpGIZE9wk', event: 'tokyosubwayticket_video_tips_yt', platform: 'YouTube' },
  ],
  subway: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/5989-24-48-72-hr-tokyo-subway-ticket-japan?cid=22312', event: 'tokyosubwayticket_subway_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1552-subway-ticket-tokyo/?aid=93798', event: 'tokyosubwayticket_subway_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/24465457/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', event: 'tokyosubwayticket_subway_trip', platform: 'Trip' },
    { label: '官方', href: 'https://www.tokyometro.jp/tst/tcn/index.html', event: 'tokyosubwayticket_subway_official', platform: 'Official' },
  ],
  jrPass: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/6681-jr-east-pass-tohoku-area?cid=22312', event: 'tokyosubwayticket_jrpass_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/49927-jr-east-tokyo-tokyowidepass/?aid=93798', event: 'tokyosubwayticket_jrpass_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/44275093/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', event: 'tokyosubwayticket_jrpass_trip', platform: 'Trip' },
    { label: '計算器', href: 'https://www.jrpass.com/farecalculator', event: 'tokyosubwayticket_jrpass_calculator', platform: 'Calculator' },
  ],
}

const faqItems = [
  {
    q: '東京地鐵券 Tokyo Subway Ticket 可以搭 JR 嗎？',
    a: '不行。Tokyo Subway Ticket 主要可搭東京 Metro 全線與都營地鐵全線，JR 山手線、JR 中央線、機場快線、百合海鷗、臨海線等都不包含。',
  },
  {
    q: '東京地鐵券什麼時候開始算時間？',
    a: '不是購買當下，而是第一次把票放入自動閘門開始算 24/48/72 小時。只要在有效時間內進站，即使出站時超過有效時間，也可以出站。',
  },
  {
    q: '東京地鐵券幾次才划算？',
    a: '用常見單趟約 180 到 220 日圓粗估，24 小時券一天約 5 到 6 次、48 小時券平均每天約 4 次上下、72 小時券平均每天約 3 到 4 次，就很有機會回本。',
  },
  {
    q: 'JR Pass 和 Tokyo Subway Ticket 可以二選一嗎？',
    a: '這兩張用途不一樣。Tokyo Subway Ticket 是東京都心地鐵移動；JR Pass 或 JR 區域 Pass 是跑近郊、跨城市或新幹線時才比較需要。只待東京市區，通常先看東京地鐵券。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoSubwayTicketTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoSubwayTicketDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoSubwayTicketCanonical,
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

export default function TokyoSubwayTicketPage() {
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
      <CitySubpageHeader backHref="/tokyo/transport" eventPrefix="tokyosubwayticket" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京交通攻略"
          h1="東京地鐵券 Tokyo Subway Ticket 攻略｜24/48/72 小時怎麼買、怎麼用、幾次回本？"
          intro="東京市區自由行，如果你會連續 2 天以上跑景點，Tokyo Subway Ticket 通常是最值得先算的一張。它不是 JR Pass，也不是 Suica，而是讓東京 Metro 與都營地鐵在時間內不限次數搭乘的市區移動票。"
          eventPrefix="tokyosubwayticket"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyosubwayticket_hero_quick', platform: 'article' },
            { label: '回本算法', href: '#break-even', dataEvent: 'tokyosubwayticket_hero_breakeven', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'tokyosubwayticket_hero_links', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="東京地鐵券快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">市區 2 天以上</span>
              <strong>先看東京地鐵券</strong>
              <p>淺草、銀座、築地、新宿、表參道、六本木、澀谷周邊都常用得到。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">景點跑很密</span>
              <strong>越搭越划算</strong>
              <p>24/48/72 小時內不限次數，行程愈多點、愈不想走路，越容易回本。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">跑近郊</span>
              <strong>JR Pass 先試算</strong>
              <p>鎌倉、富士山、輕井澤、日光這類行程，才回頭看 JR 區域 Pass。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">時間算法</span>
              <strong>第一次進站才啟用</strong>
              <p>不是買票當下開始算，刷進地鐵閘門後才開始計時，彈性很好。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="東京地鐵券短影音">
          <h2 className="seo-h2">先看 IG 短影音：東京地鐵券怎麼選</h2>
          <div className="seo-prose">
            <p>想先用短影音抓重點，可以先看東京地鐵票券，再補一支地鐵搭乘重點；看完再回來對照你一天會搭幾次。</p>
            <SeoVideoLinkMenu label="地鐵票券" links={linkGroups.ticketVideo} />
            <SeoVideoLinkMenu label="地鐵搭乘" links={linkGroups.tipsVideo} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="東京地鐵券和JR Pass比較">
          <h2 className="seo-h2">先搞懂：Tokyo Subway Ticket 和 JR Pass 不是同一種東西</h2>
          <div className="seo-prose">
            <p>
              東京交通最容易搞混的地方，是把「市區地鐵票」和「JR 周遊券」放在一起比。我的判斷很簡單：東京市區跑景點，先看 Tokyo Subway Ticket；要離開東京市區跑近郊或跨城市，再看 JR Pass 或 JR 區域 Pass。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>票券</th>
                    <th>可搭範圍</th>
                    <th>適合誰</th>
                    <th>不適合誰</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tokyo Subway Ticket</td>
                    <td>東京 Metro 全線、都營地鐵全線</td>
                    <td>連續 2 到 3 天跑東京市區景點，地鐵搭乘頻繁的人。</td>
                    <td>主要搭 JR、去機場、去迪士尼、去台場或近郊的人。</td>
                  </tr>
                  <tr>
                    <td>JR Pass / JR 區域 Pass</td>
                    <td>依票券範圍搭 JR、新幹線、特急或指定 JR 路線</td>
                    <td>有鎌倉、富士山、輕井澤、日光，或跨城市長距離移動的人。</td>
                    <td>只在東京市區跑景點的人，通常很難回本。</td>
                  </tr>
                  <tr>
                    <td>Suica / PASMO / ICOCA</td>
                    <td>多數鐵路、公車、便利商店都能刷</td>
                    <td>行程很鬆、一天只搭 2 到 3 趟，或常搭非地鐵路線的人。</td>
                    <td>一天大量搭東京 Metro 與都營地鐵的人，可能沒有地鐵券划算。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="break-even" aria-label="東京地鐵券回本算法">
          <h2 className="seo-h2">算給你看：一天搭幾次會划算？</h2>
          <div className="seo-prose">
            <p>
              東京地鐵單趟會依距離變動，常見短程可以先用 180 到 220 日圓粗估。用這個區間算，Tokyo Subway Ticket 不是一天搭兩趟就回本，而是行程密集時才真正好用。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>票種</th>
                    <th>成人票價</th>
                    <th>粗估回本門檻</th>
                    <th>我的建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24 小時券</td>
                    <td>1,000 日圓</td>
                    <td>一天約 5 到 6 次</td>
                    <td>適合單日塞很多景點，或早上啟用後隔天早上還能再搭。</td>
                  </tr>
                  <tr>
                    <td>48 小時券</td>
                    <td>1,500 日圓</td>
                    <td>平均每天約 4 次上下</td>
                    <td>最適合東京市區 2 天行程，新手通常很好回本。</td>
                  </tr>
                  <tr>
                    <td>72 小時券</td>
                    <td>2,000 日圓</td>
                    <td>平均每天約 3 到 4 次</td>
                    <td>如果連續 3 天都在市區跑，這張最容易有感。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              小提醒：官方也把 24/48/72 小時券標成「從首次使用時刻起有效」，所以你可以下午進市區後先不用，隔天一早開始刷，讓票券時間用得更漂亮。
            </p>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="東京地鐵券購票連結">
          <h2 className="seo-h2">購票連結：先買好，抵達後少一件事</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">Tokyo Subway Ticket</h3>
            <p>
              這張是東京市區觀光最常用的地鐵多日券，可在有效時間內搭東京 Metro 與都營地鐵全線。購買時注意票種是 24、48 還是 72 小時，以及兌換方式是實體票或 QR 形式。
            </p>
            <ActionLinks label="Tokyo Subway Ticket 購票連結" links={linkGroups.subway} />

            <h3 className="seo-h3">JR Pass / JR 區域 Pass</h3>
            <p>
              JR Pass 不是東京市區地鐵券。如果你要跑鎌倉、富士山、輕井澤、日光，先用計算器把每段交通費加總，再決定要不要買 JR Pass 或 JR 區域 Pass。只待東京市區的話，大多數人先不用急著買。
            </p>
            <ActionLinks label="JR Pass 試算與購票連結" links={linkGroups.jrPass} />
          </div>
        </section>

        <section className="seo-content" aria-label="東京地鐵券使用範圍">
          <h2 className="seo-h2">使用範圍：可以搭什麼、不能搭什麼？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">可以搭：東京 Metro + 都營地鐵</h3>
            <p>
              Tokyo Subway Ticket 的核心就是東京 Metro 全線與都營地鐵全線。很多東京市區景點都在這個網絡裡，例如淺草、銀座、築地、表參道、六本木、新宿三丁目、上野、秋葉原周邊。
            </p>

            <h3 className="seo-h3">不能搭：JR、機場快線、台場私鐵</h3>
            <p>
              JR 山手線、JR 中央線、N&apos;EX、Skyliner、京急、東京單軌電車、百合海鷗、臨海線、迪士尼度假區線都不在 Tokyo Subway Ticket 範圍內。遇到這些路線，直接用 Suica 或另外買票最乾淨。
            </p>

            <h3 className="seo-h3">最常見的誤會：新宿、澀谷不一定只能搭 JR</h3>
            <p>
              新宿、澀谷都有地鐵站可以用，但你要看飯店或景點靠的是哪個出口。如果 Google Maps 排出 JR 比較快，也不用硬繞地鐵；地鐵券是省錢工具，不是綁住行程的規則。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="東京地鐵券怎麼選天數">
          <h2 className="seo-h2">24 / 48 / 72 小時怎麼選？</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>只排一天市區密集行程：買 24 小時券。</li>
              <li>東京市區玩 2 天：優先看 48 小時券。</li>
              <li>連續 3 天都在東京市區：72 小時券通常最划算。</li>
              <li>其中一天要去鎌倉、富士山、迪士尼或台場：不要把那天算進地鐵券回本。</li>
              <li>每天只搭 2 到 3 趟、很愛散步：用 Suica 反而更彈性。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" aria-label="東京地鐵券結論">
          <h2 className="seo-h2">最後用一句話收斂</h2>
          <div className="seo-prose">
            <p>
              東京市區跑景點、會待至少 2 天、每天會搭 3 到 4 趟以上地鐵，Tokyo Subway Ticket 就很值得買；如果行程重點是近郊或跨城市，先用 JR Pass 計算器試算，再回頭決定買哪張。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="買地鐵券前，先把東京移動方式看懂"
          intro="先確認行程主要跑哪些區域、會不會搭 JR，再決定地鐵券是否划算；地圖可協助檢查景點是否真的集中。"
          links={[
            { label: '東京交通整理', href: '/tokyo/transport', event: 'tokyosubway_related_transport', primary: true },
            { label: '東京地鐵 vs JR 攻略', href: '/tokyo/tokyo-subway-vs-jr-guide?from=tokyo-subway-ticket', event: 'tokyosubway_related_vs' },
            { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=tokyo-subway-ticket', event: 'tokyosubway_related_areas' },
          ]}
        />
        <SeoFaqSection title="東京地鐵券常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
