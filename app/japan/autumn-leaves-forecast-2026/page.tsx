import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoPurchaseMenu from '@/components/seo/SeoPurchaseMenu'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  autumnLeavesForecast2026Canonical,
  autumnLeavesForecast2026Description,
  autumnLeavesForecast2026Title,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const PUBLISHED_AT = '2026-09-03'
const UPDATED_AT = '2026-09-03'

const JAPAN_METEOROLOGICAL_CORPORATION_URL = 'https://n-kishou.com/corp/news-contents/autumn/'
const WEATHERNEWS_AUTUMN_URL = 'https://weathernews.jp/koyo/'
const JAPAN_WEATHER_ASSOCIATION_AUTUMN_URL = 'https://weather-jwa.jp/en/news/articles/post15356'
const INSTAGRAM_CHANNEL_URL = 'https://www.instagram.com/channel/AbZxb3pZjSFNqWvD/'

type TrackingSource = {
  label: string
  href: string
  event: string
  platform: string
  purpose: string
}

type MenuLink = {
  label: string
  href: string
  event: string
  platform: string
  affiliate?: boolean
}

const trackingSources: TrackingSource[] = [
  {
    label: '日本氣象｜第 1 回紅葉、黃葉預測',
    href: JAPAN_METEOROLOGICAL_CORPORATION_URL,
    event: 'japanautumn2026_source_jmc',
    platform: 'Japan Meteorological Corporation',
    purpose: '確認城市紅葉、銀杏日期與 10 月上旬的下一回預測。',
  },
  {
    label: 'Weathernews｜即時紅葉資訊',
    href: WEATHERNEWS_AUTUMN_URL,
    event: 'japanautumn2026_source_weathernews',
    platform: 'Weathernews',
    purpose: '出發前看名所色況、雨風與天氣變化，不只看城市預測。',
  },
  {
    label: '日本氣象協會｜秋季氣溫趨勢',
    href: JAPAN_WEATHER_ASSOCIATION_AUTUMN_URL,
    event: 'japanautumn2026_source_jwa',
    platform: 'Japan Weather Association',
    purpose: '交叉確認 9～10 月氣溫趨勢，理解見頃可能延後的原因。',
  },
]

const socialFollowLinks: MenuLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/jiejourneys',
    event: 'japanautumn2026_updates_follow_instagram',
    platform: 'Instagram',
    affiliate: false,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@jiejourneys',
    event: 'japanautumn2026_updates_follow_youtube',
    platform: 'YouTube',
    affiliate: false,
  },
  {
    label: 'Threads',
    href: 'https://www.threads.net/@jiejourneys',
    event: 'japanautumn2026_updates_follow_threads',
    platform: 'Threads',
    affiliate: false,
  },
]

const bookingOptions: MenuLink[] = [
  {
    label: 'Agoda｜查可取消住宿',
    href: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw',
    event: 'japanautumn2026_affiliate_agoda',
    platform: 'Agoda',
  },
  {
    label: 'Trip.com｜比較賞楓城市住宿',
    href: 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664',
    event: 'japanautumn2026_affiliate_trip',
    platform: 'Trip.com',
  },
  {
    label: 'KKday｜看交通與賞楓行程',
    href: 'https://www.kkday.com/zh-tw/?cid=22312',
    event: 'japanautumn2026_affiliate_kkday',
    platform: 'KKday',
  },
  {
    label: 'Klook｜看交通與景點票券',
    href: 'https://www.klook.com/zh-TW/?aid=93798',
    event: 'japanautumn2026_affiliate_klook',
    platform: 'Klook',
  },
]

const forecastRows = [
  { region: '北海道', city: '札幌', maple: '11/7', ginkgo: '11/6' },
  { region: '東北', city: '青森', maple: '11/13', ginkgo: '11/6' },
  { region: '東北', city: '仙台', maple: '11/25', ginkgo: '11/29' },
  { region: '關東', city: '東京', maple: '11/29', ginkgo: '11/26' },
  { region: '甲信', city: '長野', maple: '11/21', ginkgo: '11/14' },
  { region: '北陸', city: '金澤', maple: '11/30', ginkgo: '11/10' },
  { region: '東海', city: '名古屋', maple: '12/2', ginkgo: '11/17' },
  { region: '關西', city: '京都', maple: '12/11', ginkgo: '11/27' },
  { region: '關西', city: '大阪', maple: '12/4', ginkgo: '11/24' },
  { region: '關西', city: '和歌山', maple: '12/11', ginkgo: '11/26' },
  { region: '中國', city: '廣島', maple: '11/28', ginkgo: '11/20' },
  { region: '四國', city: '高知', maple: '12/9', ginkgo: '11/16' },
  { region: '九州', city: '福岡', maple: '12/7', ginkgo: '11/27' },
  { region: '九州', city: '鹿兒島', maple: '12/10', ginkgo: '11/27' },
]

const regionalRows = [
  {
    region: '北日本',
    maple: '山區約 10 月上旬～11 月中旬；平地約 10 月中旬～11 月下旬',
    ginkgo: '平地約 11 月上旬～11 月下旬',
    takeaway: '札幌的城市指標日期最早；高海拔景點會再更早。',
  },
  {
    region: '東日本',
    maple: '山區約 10 月下旬～12 月上旬；平地約 11 月下旬～12 月中旬',
    ginkgo: '平地約 11 月上旬～12 月上旬',
    takeaway: '東京可先鎖定 11 月下旬，再追蹤名所實況。',
  },
  {
    region: '西日本',
    maple: '山區約 10 月下旬～12 月上旬；平地約 11 月下旬～12 月中旬',
    ginkgo: '平地約 11 月中旬～12 月上旬',
    takeaway: '大阪先看 11 月下旬銀杏；京都楓葉可預留到 12 月上旬。',
  },
]

const faqItems = [
  {
    q: '2026 日本什麼時候最適合賞楓？',
    a: '要看地區、海拔與樹種。城市指標預測由北往南約落在 11 月上旬到 12 月中旬；高山通常更早。第 1 回預測中，札幌紅葉約 11/7、東京 11/29、大阪 12/4、京都 12/11。',
  },
  {
    q: '東京、京都、大阪 2026 紅葉預測是幾月？',
    a: '日本氣象株式會社第 1 回預測為：東京紅葉約 11/29、京都約 12/11、大阪約 12/4；同一城市的銀杏通常較早，例如東京 11/26、大阪 11/24、京都 11/27。',
  },
  {
    q: '預測日期就是景點最漂亮的那一天嗎？',
    a: '不是。本文城市日期以日本氣象株式會社的指標樹標準推估，不等同每一座寺院、公園或山區的最佳日期。實際見頃還會受海拔、品種、日照、雨風與當週降溫影響，安排時建議預留 2～4 天彈性。',
  },
  {
    q: '紅葉和銀杏要看不同日期嗎？',
    a: '建議分開看。紅葉主要指楓樹、槭樹等轉紅；黃葉主要指銀杏變黃。銀杏通常較早進入見頃，但每座城市與景點仍有差異，所以行程不要只看「賞楓」一個日期。',
  },
  {
    q: '今年賞楓預測還會更新嗎？',
    a: '會。日本氣象株式會社已預告下一回預測在 10 月上旬發布；越接近出發日，越要以各名所的即時色況、短期天氣與交通公告調整行程。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: autumnLeavesForecast2026Title.replace(' | JieJourneys(旅杰)', ''),
  description: autumnLeavesForecast2026Description,
  inLanguage: 'zh-Hant',
  datePublished: PUBLISHED_AT,
  dateModified: UPDATED_AT,
  mainEntityOfPage: autumnLeavesForecast2026Canonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
  image: `${SITE_URL}/assets/japan-autumn-leaves-forecast-2026/forecast-map.png`,
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

type AutumnLeavesForecast2026PageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyushu-travel-subsidy-2026') return '/japan/kyushu-travel-subsidy-2026'
  if (value === 'tokyo') return '/tokyo'
  if (value === 'osaka') return '/osaka'
  return '/'
}

export default async function AutumnLeavesForecast2026Page({ searchParams }: AutumnLeavesForecast2026PageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="japanautumn2026" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="日本旅遊速報｜2026/9/3 更新"
          h1="2026 日本賞楓預測｜東京、京都、大阪何時看紅葉與銀杏？"
          intro="日本氣象株式會社 9/2 發布第 1 回預測：今年秋季氣溫偏高，許多地區的紅葉、銀杏將落在平年同期或較晚。城市預測中，東京紅葉約 11/29、大阪約 12/4、京都約 12/11；銀杏通常更早進入見頃。"
          eventPrefix="japanautumn2026"
          showVisual={false}
          ctaLinks={[
            { label: '各城市日期', href: '#city-dates', dataEvent: 'japanautumn2026_hero_dates', platform: 'article' },
            { label: '三大區域時段', href: '#regional-timing', dataEvent: 'japanautumn2026_hero_regions', platform: 'article' },
            { label: '怎麼排最準', href: '#planning', dataEvent: 'japanautumn2026_hero_planning', platform: 'article' },
            { label: '資料與更新', href: '#updates', dataEvent: 'japanautumn2026_hero_updates', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="2026 日本賞楓預測快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">目前版本</span>
              <strong>第 1 回預測：2026/9/2</strong>
              <p>下一回預測預計 10 月上旬發布；接近出發時務必重看。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">今年整體趨勢</span>
              <strong>多數地區平年同期或偏晚</strong>
              <p>秋季氣溫偏高會讓葉片轉色往後；北部與東部更要留意延後。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">東京／大阪／京都紅葉</span>
              <strong>11/29／12/4／12/11</strong>
              <p>這是城市指標樹的預測日，不等於所有名所同一天最美。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">銀杏別漏看</span>
              <strong>常比紅葉更早變色</strong>
              <p>東京 11/26、大阪 11/24、京都 11/27；安排時要分開看樹種。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="forecast-map" aria-label="2026 日本賞楓預測地圖">
          <h2 className="seo-h2">2026 日本紅葉＋銀杏預測地圖｜先用城市日期抓旅行週</h2>
          <div className="seo-prose">
            <p>這張圖把紅葉（楓樹、槭樹等轉紅）與銀杏（轉黃）分開標示。先用它決定要去北海道、東京、關西或九州的哪一週，再依實際想去的寺院、公園或山區調整；同一座城市的高低海拔與樹種不同，見頃不會完全同步。</p>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/japan-autumn-leaves-forecast-2026/forecast-map.png"
                alt="2026 日本紅葉與銀杏預測地圖，標示札幌、東京、京都、大阪、福岡等城市的見頃日期"
                width={1122}
                height={1400}
                sizes="(max-width: 820px) 100vw, 760px"
                priority
              />
              <figcaption>旅杰製圖。資料來源：日本氣象株式會社「2026 年紅葉・黃葉見頃預測（第 1 回）」；發布日為 2026/9/2。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="city-dates" aria-label="2026 日本各城市紅葉銀杏預測日期">
          <h2 className="seo-h2">各城市預測日期｜東京 11/29、大阪 12/4、京都 12/11</h2>
          <div className="seo-prose">
            <p>下表是日本氣象株式會社本次公布的主要城市預測。紅葉、銀杏是兩套不同的日期：如果你想同一趟拍兩種顏色，先看銀杏，再看紅葉，通常會比只盯「賞楓」兩字更好排行程。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">地區</th>
                    <th scope="col">城市</th>
                    <th scope="col">🍁 紅葉預測</th>
                    <th scope="col">🌕 銀杏預測</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastRows.map((row) => (
                    <tr key={row.city}>
                      <td>{row.region}</td>
                      <td><strong>{row.city}</strong></td>
                      <td>{row.maple}</td>
                      <td>{row.ginkgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><strong>怎麼看表：</strong>東京如果想看銀杏先抓 11 月下旬，紅葉則以 11/29 前後為起點；大阪是 11 月下旬銀杏、12 月上旬紅葉；京都銀杏在 11 月下旬，但楓葉可以預留到 12 月上旬。日期是旅行規劃的基準，不是景點保證日。</p>
          </div>
        </section>

        <section className="seo-content" id="regional-timing" aria-label="北日本東日本西日本賞楓時段">
          <h2 className="seo-h2">北日本、東日本、西日本｜山區和平地的見頃時段不同</h2>
          <div className="seo-prose">
            <p>同一個地區也會因海拔拉開時間差。高處氣溫較低，通常先轉色；平地名所則會晚一些。這也是為什麼「東京 11/29」或「京都 12/11」不能直接套用到近郊山區。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">區域</th>
                    <th scope="col">🍁 紅葉大致時段</th>
                    <th scope="col">🌕 銀杏大致時段</th>
                    <th scope="col">行程提示</th>
                  </tr>
                </thead>
                <tbody>
                  {regionalRows.map((row) => (
                    <tr key={row.region}>
                      <td><strong>{row.region}</strong></td>
                      <td>{row.maple}</td>
                      <td>{row.ginkgo}</td>
                      <td>{row.takeaway}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>今年的首回預測判斷：北日本紅葉大致平年同期、銀杏平年同期或偏晚；東日本兩者平年同期或偏晚；西日本兩者則大致平年同期。另一份 Weathernews 的 9/3 首回預測也認為，全國許多地方會偏晚或稍晚，因此行程最好別只預留單日。</p>
          </div>
        </section>

        <section className="seo-content" id="planning" aria-label="日本賞楓行程安排方式">
          <h2 className="seo-h2">預測怎麼用才不會撲空？用「城市、名所、天氣」三層確認</h2>
          <div className="seo-prose">
            <ol>
              <li><strong>先用城市日期選旅行週：</strong>例如大阪想同時安排銀杏與紅葉，可先把住宿留在 11 月下旬到 12 月上旬的區間。</li>
              <li><strong>再看名所的海拔與樹種：</strong>山區常比市區早；銀杏和楓樹也不一定同一天最佳，不要把城市表直接當成每個景點的日期。</li>
              <li><strong>保留 2～4 天彈性：</strong>同一城市多住幾晚，或把賞楓排成可前後調動的半日，成功率比只壓一個日期高。</li>
              <li><strong>出發前一週看即時色況：</strong>預測適合先訂旅行週；最後決定哪天去，仍要看名所公告、短期降溫、下雨、強風與交通資訊。</li>
              <li><strong>遇到雨風別硬衝：</strong>秋雨鋒面、颱風或強風可能影響葉況和上山交通；把市區博物館、購物或咖啡行程準備成備案更穩。</li>
            </ol>
            <p>Weathernews 的首回判斷指出，今年葉況整體仍有機會呈現鮮豔色彩，但前線、颱風與雨風仍會影響名所觀感與交通。這篇會隨下一回預測更新；若你已買機票，現在最實用的做法是選對「週」，而不是為了某一天急著改票。</p>
          </div>
        </section>

        <section className="seo-content kyushu-update-hub" id="updates" aria-label="2026 日本賞楓預測追蹤更新">
          <div className="kyushu-update-heading">
            <div>
              <p className="kyushu-update-kicker">旅杰賞楓更新台</p>
              <h2 className="seo-h2">下一回預測、名所葉況，先幫你把重點看懂</h2>
            </div>
          </div>
          <div className="seo-prose">
            <p>本文城市日期以日本氣象株式會社 2026/9/2 的第 1 回紅葉、黃葉預測為主。該預測用城市指標樹的葉色標準計算，並提供約 700 個賞楓景點與約 3,000 座山的預測；因此非常適合作為旅行週的起點，但不應替代單一名所的即時情報。</p>
            <p>交叉比對時，Weathernews 9/3 的首回預測也指出今年多數地區偏晚或稍晚，並提醒注意前線、颱風與雨風。第 2 回預測發布後，旅杰會把真正影響旅程的城市日期、差異與安排方式更新在這篇。</p>
          </div>
          <ul className="kyushu-source-grid" aria-label="2026 日本賞楓預測追蹤來源">
            {trackingSources.map((source) => (
              <li key={source.event}>
                <a
                  className="kyushu-source-card"
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={source.event}
                  data-platform={source.platform}
                  data-section="official_tracker"
                >
                  <span className="kyushu-source-label">預測來源</span>
                  <strong>{source.label}</strong>
                  <span>{source.purpose}</span>
                  <span className="kyushu-source-link">查看最新資料 <span aria-hidden="true">→</span></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="kyushu-update-actions">
            <div>
              <strong>賞楓更新，第一時間通知</strong>
              <p>城市日期或適合出發的週次有調整，會先通知你。</p>
            </div>
            <div className="kyushu-update-action-links">
              <a
                className="kyushu-channel-link"
                href={INSTAGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-event="japanautumn2026_updates_ig_channel"
              data-platform="Instagram Channel"
              data-section="official_tracker"
            >
                加入即時通知
              </a>
              <SeoPurchaseMenu
                className="kyushu-follow-details"
                label="其他追蹤方式"
                options={socialFollowLinks}
                dataSection="official_tracker"
                revealOnOpen={false}
              />
            </div>
          </div>
        </section>

        <section className="seo-content" id="booking-options" aria-label="日本賞楓住宿與行程安排">
          <h2 className="seo-h2">日期還有彈性？先留可取消住宿，再決定哪一天追紅葉</h2>
          <div className="seo-prose">
            <p>預測會持續修正，真正要避開的是「只訂一晚、又剛好錯過見頃」。如果你已選好東京、關西或九州的大方向，先比較<strong>可免費取消</strong>的住宿；城市日期越接近，才把交通、日歸行程或景點票券補齊，會比現在為了單一日期鎖死行程更安心。</p>
            <SeoPurchaseMenu
              className="kyushu-affiliate-details"
              label="查看合作住宿與行程選項"
              options={bookingOptions}
              dataSection="affiliate_booking_options"
              revealOnOpen={false}
            />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="賞楓旅行確定後，先把日本行前安排好"
          intro="旅行週抓好後，不必只盯著葉況。先完成入境、退稅與目的地區域規劃，等接近出發時再把最好的名所放進每天行程。"
          links={[
            {
              label: '日本入境教學',
              href: '/japan/visit-japan-web-guide?from=japan-autumn-leaves-forecast-2026',
              event: 'japanautumn2026_related_visit_japan_web',
              platform: 'internal',
            },
            {
              label: '日本退稅新制度',
              href: '/japan/tax-free-2026?from=japan-autumn-leaves-forecast-2026',
              event: 'japanautumn2026_related_tax_free',
              platform: 'internal',
            },
            {
              label: '東京9大區域攻略',
              href: '/tokyo/tokyo-9-areas-guide?from=japan-autumn-leaves-forecast-2026',
              event: 'japanautumn2026_related_tokyo_areas',
              platform: 'internal',
            },
            {
              label: '大阪5大區域攻略',
              href: '/osaka/osaka-5-areas-guide?from=japan-autumn-leaves-forecast-2026',
              event: 'japanautumn2026_related_osaka_areas',
              platform: 'internal',
            },
            {
              label: '旅遊資源優惠',
              href: '/tools/resources?from=japan-autumn-leaves-forecast-2026',
              event: 'japanautumn2026_related_resources',
              platform: 'internal',
            },
          ]}
        />

        <SeoFaqSection title="2026 日本賞楓預測常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
