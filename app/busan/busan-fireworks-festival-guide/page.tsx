import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import AccommodationAffiliatePanel from '@/components/seo/AccommodationAffiliatePanel'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  busanFireworksFestivalGuideCanonical,
  busanFireworksFestivalGuideDescription,
  busanFireworksFestivalGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const UPDATED_AT = '2026-10-27'

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

const officialLinks: ActionLink[] = [
  {
    label: '煙火節官方網站',
    href: 'https://www.busanfireworks.com/en/',
    event: 'busanfireworks_official_home',
    platform: 'official',
    primary: true,
  },
  {
    label: '官方票券頁',
    href: 'https://busanfireworks.com/reservation_en',
    event: 'busanfireworks_official_ticket',
    platform: 'official',
  },
  {
    label: '官方交通位置說明',
    href: 'https://busanfireworks.com/content/location_en',
    event: 'busanfireworks_official_location',
    platform: 'official',
  },
  {
    label: '2026 官方節目表（韓文）',
    href: 'https://busanfireworks.com/program/schedule.php',
    event: 'busanfireworks_official_schedule',
    platform: 'official',
  },
  {
    label: '2026 官方交通管制圖（韓文）',
    href: 'https://busanfireworks.com/content/traffic',
    event: 'busanfireworks_official_traffic',
    platform: 'official',
  },
]

const scheduleRows = [
  { time: '13:00～16:00', program: '煙火街頭活動：街頭演出、粉筆畫與體驗攤位' },
  { time: '16:00～16:10', program: '韓國空軍 Black Eagles 特技飛行表演' },
  { time: '18:00～18:50', program: '煙火序幕：預告煙火與市民訊息' },
  { time: '18:50～19:00', program: '開幕儀式' },
  { time: '19:00～19:15', program: '海外邀請煙火秀：中國 SUNNY 團隊' },
  { time: '19:15～19:25', program: '中場休息與設備檢查' },
  { time: '19:25～19:55', program: '釜山多點煙火秀：廣安大橋尼加拉瀑布煙火、25 吋大型煙火等' },
  { time: '19:55～20:00', program: '謝幕煙火' },
]

const ticketReleaseRows = [
  {
    release: '第一次：外國旅客早鳥票',
    period: '韓國 8/26（三）14:00～23:59／台灣 13:00～22:59',
    seats: 'S 席（一般座椅）',
    price: '56,000 韓元（原價 70,000 韓元，早鳥 8 折）',
    note: '限量；NOL World 頁面標示需護照驗證、每人最多 2 張。',
  },
  {
    release: '第二次：一般售票',
    period: '韓國 9/4（五）14:00～11/6（五）17:00／台灣 13:00～16:00',
    seats: 'R 席（桌＋椅）／S 席（一般座椅）',
    price: 'R 席 100,000 韓元／S 席 70,000 韓元',
    note: 'NOL World 一般票每人最多 4 張，需護照驗證；售完可能提前結束。',
  },
]

const viewingAreas = [
  {
    place: '廣安里海灘',
    fit: '第一次看、重視音樂和現場感，或準備買指定座位的人。',
    transport: '地鐵 2 號線廣安站 3 號出口後步行；官方明確提醒周邊壅塞且幾乎無停車位。',
    note: '主會場，人潮最多。想站到較前方或有座位，務必依當年票券與入場規定處理。',
  },
  {
    place: '二妓臺一帶',
    fit: '想從較遠處看廣安大橋與整體煙火構圖的人。',
    transport: '可搭地鐵 2 號線到慶星大・釜慶大站，再轉乘公車；下車點以官方當年公告為準。',
    note: '列為 2026 官方會場之一，但可進入區域、管制與最佳位置尚待今年公告。',
  },
  {
    place: '冬柏島（海雲台）',
    fit: '當天本來就住海雲台、想從另一側感受活動氛圍的人。',
    transport: '官方位置說明列有冬柏島進出方式：地鐵 2 號線冬柏站 1 號出口可步行前往。',
    note: '2026 官方列為海雲台會場；實際可觀賞位置與進出管制請等正式配置圖，不要只憑往年照片決定。',
  },
]

const faqItems = [
  {
    q: '2026 釜山煙火節日期與地點是什麼？',
    a: '第 21 屆釜山煙火節已公布在 2026 年 11 月 7 日星期六舉行，觀賞地點為廣安里海灘、冬柏島與二妓臺。廣安里是最適合第一次參加者鎖定的主會場，中央另設付費 R／S 座位區。',
  },
  {
    q: '釜山煙火節可以用 KKday 購票嗎？',
    a: '可以，KKday 可作中文購票入口。官方英文首頁也連到 NOL World 一般票頁，不只有 8/26 的早鳥票；一般票需護照驗證，每人最多 4 張。各平台的取票、座位與取消規定請分別確認。',
  },
  {
    q: 'R 席和 S 席差在哪裡？',
    a: '兩者都在廣安里海灘中央的付費座位區。R 席包含桌與椅，每張 100,000 韓元；S 席只有座椅，每張 70,000 韓元。早鳥階段只有 S 席，折後為 56,000 韓元。',
  },
  {
    q: '付費座位幾點可以入場？',
    a: 'NOL World 一般票頁寫明 15:00 起可入場，18:00 前須抵達指定座位，逾時不允許入場或退款；其他通路仍須核對各自換票與入場期限。官方節目為 16:00 特技飛行、18:00 煙火序幕、19:00～20:00 主煙火，皆為韓國當地時間。',
  },
  {
    q: '三個觀賞地點怎麼選？',
    a: '第一次去、想看最完整現場氛圍與付費座位就選廣安里海灘；住海雲台可考慮冬柏島；二妓臺適合想從較遠處看廣安大橋與整體煙火構圖的人。冬柏島與二妓臺的可進入範圍，仍要以當年官方管制公告為準。',
  },
  {
    q: '看釜山煙火節可以開車嗎？',
    a: '建議搭地鐵並預留步行時間。2026 官方管制圖已公布：11/7 廣安大橋上層 15:30 起、下層 18:30 起全面封閉至 24:00；會場周邊道路從 10:00 起分階段管制，公車也可能改道。',
  },
  {
    q: '煙火幾點開始？演多久？',
    a: '韓國時間 19:00～19:15 為海外邀請煙火，19:15～19:25 中場檢查，19:25～19:55 為釜山多點煙火秀，19:55～20:00 謝幕。不要在 19:15 的中場休息就離開，主秀 19:25 才開始。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanFireworksFestivalGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanFireworksFestivalGuideDescription,
  inLanguage: 'zh-Hant',
  dateModified: UPDATED_AT,
  mainEntityOfPage: busanFireworksFestivalGuideCanonical,
  image: `${SITE_URL}/assets/busan-fireworks/seating-and-zone-map.png`,
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

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'The 21st Busan Fireworks Festival',
  startDate: '2026-11-07T19:00:00+09:00',
  endDate: '2026-11-07T20:00:00+09:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: 'Gwangalli Beach',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Busan',
      addressCountry: 'KR',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Busan Festivals Organization',
    url: 'https://www.bfo.or.kr/event/56',
  },
  url: busanFireworksFestivalGuideCanonical,
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

type BusanFireworksFestivalGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'map' || value === 'busan-map') return '/busan/map'
  if (value === 'hotel' || value === 'busan-hotel') return '/busan/hotel'
  return '/busan'
}

export default async function BusanFireworksFestivalGuidePage({ searchParams }: BusanFireworksFestivalGuidePageProps) {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CitySubpageHeader backHref={backHref} eventPrefix="busanfireworks" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山季節活動｜2026/10/27 更新"
          h1="2026 釜山煙火節攻略｜日期、觀賞地點、票券與交通避人潮"
          intro="2026 釜山煙火節將於 11 月 7 日舉行，官方已公布完整節目表與交通管制圖：16:00 特技飛行、19:00 海外邀請煙火、19:25 釜山多點煙火。先確認觀賞位置、票券與進出動線，再安排住宿和回程。"
          eventPrefix="busanfireworks"
          showVisual={false}
          ctaLinks={[
            { label: '最新節目表', href: '#confirmed', dataEvent: 'busanfireworks_hero_schedule', platform: 'article' },
            { label: '票券重點', href: '#ticket', dataEvent: 'busanfireworks_hero_ticket', platform: 'article' },
            { label: '觀賞地點', href: '#viewing-areas', dataEvent: 'busanfireworks_hero_viewing', platform: 'article' },
            { label: '交通避人潮', href: '#transport', dataEvent: 'busanfireworks_hero_transport', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山煙火節快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">日期</span>
              <strong>2026 年 11 月 7 日（六）</strong>
              <p>煙火表演為 19:00～20:00，現在就能先排住宿與城市行程。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主會場</span>
              <strong>廣安里海水浴場</strong>
              <p>想看完整現場氣氛、音樂與廣安大橋畫面，第一次去就鎖定這裡。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">同步會場</span>
              <strong>二妓臺、冬柏島</strong>
              <p>官方也列為活動地點；確切觀賞區、出入口與管制範圍，仍要等今年配置圖。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最重要提醒</span>
              <strong>交通管制圖已公布</strong>
              <p>周邊道路 10:00 起分階段管制；一般票售至 11/6 韓國時間 17:00，售完可能提前結束。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="confirmed" aria-label="2026 釜山煙火節已確認資訊">
          <h2 className="seo-h2">10/27 更新：完整節目表已公布，主秀 19:25 開始</h2>
          <div className="seo-prose">
            <p>
              第 21 屆釜山煙火節確定在 <strong>2026 年 11 月 7 日星期六</strong>舉行；可看的三個位置是<strong>廣安里海灘、冬柏島與二妓臺</strong>。廣安里海灘中央設有付費 R／S 座位，活動由釜山市主辦、釜山慶典組織營運。
            </p>
            <p>
              以下依<strong>2026/10/27 查核的官方節目表</strong>整理。主煙火時段仍為<strong>19:00～20:00</strong>，但 19:15～19:25 是中場檢查，別以為已經結束；釜山多點主秀要到 19:25 才開始。節目可能依主辦單位或現場狀況調整。
            </p>
            <p><strong>購票時間提醒：</strong>售票時間以韓國時間（KST）公告；台灣時間比韓國慢 1 小時。活動當天的入場、文化活動與煙火時間則直接看韓國當地時間即可。</p>
            <div className="narita-table-scroll">
              <table style={{ minWidth: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '8.5rem' }}>當天時段</th>
                    <th>安排</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row) => (
                    <tr key={row.time}>
                      <td><strong>{row.time}</strong></td>
                      <td>{row.program}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>以上皆為韓國當地時間。NOL World 一般票頁寫明 15:00 起可入場，<strong>18:00 前須抵達指定座位</strong>，逾時不允許入場或退款；其他購票通路請核對各自換票與入場期限。</p>
            <ActionLinks label="釜山煙火節官方資訊" links={officialLinks} />
          </div>
        </section>

        <section className="seo-content" id="ticket" aria-label="釜山煙火節票券資訊">
          <h2 className="seo-h2">票券怎麼買：台灣旅客直接用 KKday，R 席與 S 席一次看懂</h2>
          <div className="seo-prose">
            <p>
              <strong>台灣旅客可用 KKday 中文頁查看 R／S 席方案。</strong>官方英文首頁也提供 NOL World 一般票入口，並非只有 8/26 的早鳥；一般票需護照驗證，每人最多 4 張。兩個平台的座位安排、取票方式與取消規則請各自確認。公共觀賞區則要預留提早到場、步行與散場等待時間。
            </p>
            <ActionLinks
              label="台灣旅客 KKday 購票"
              links={[
                {
                  label: '台灣旅客 → KKday 購票',
                  href: 'https://www.kkday.com/zh-tw/product/17613-busan-fireworks-festival-ticket-south-korea?cid=22312',
                  event: 'busanfireworks_ticket_kkday_top',
                  platform: 'KKDAY',
                  primary: true,
                },
              ]}
            />
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/busan-fireworks/seating-and-zone-map.png"
                alt="釜山煙火節廣安里海灘付費 R 席與 S 席座位、票價和五個顏色觀賞區配置圖"
                width={1122}
                height={1402}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>廣安里海灘中央付費座位區配置：R 席含桌與椅，S 席為一般座椅；顏色區域以購票頁實際選位為準。</figcaption>
            </figure>

            <h3 className="seo-h3">售票時間與座位：早鳥只有一天，9/4 起開放一般售票</h3>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>階段</th>
                    <th>販售期間</th>
                    <th>票種</th>
                    <th>價格</th>
                    <th>提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketReleaseRows.map((release) => (
                    <tr key={release.release}>
                      <td><strong>{release.release}</strong></td>
                      <td>{release.period}</td>
                      <td>{release.seats}</td>
                      <td>{release.price}</td>
                      <td>{release.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              NOL World 的外國旅客早鳥票只在 <strong>韓國時間 2026 年 8 月 26 日 14:00 至 23:59（台灣時間 13:00 至 22:59）</strong>開放。頁面標示 S 席一般座椅早鳥 8 折為 <strong>56,000 韓元</strong>，需以護照驗證身分、每人最多購買 2 張。這是限時早鳥資訊；一般購票直接選上方 KKday 即可。
            </p>
            <p>
              第二次一般售票從<strong>韓國時間 9 月 4 日 14:00（台灣時間 13:00）</strong>開始，R 席是桌＋椅、每張 100,000 韓元；S 席是一般座椅、每張 70,000 韓元。票券頁標示演出約 1 小時、另有 10 分鐘中場休息；座位區、取票與入場規定請以購買頁面和最新公告為準。
            </p>
            <ActionLinks
              label="釜山煙火節票券連結"
              links={[
                {
                  label: '官方一般票（NOL World）',
                  href: 'https://world.nol.com/en/ticket/places/26000729/products/26009342',
                  event: 'busanfireworks_ticket_nolworld',
                  platform: 'NOL World',
                },
                officialLinks[1],
              ]}
            />

            <h3 className="seo-h3">不買座位票可以嗎？</h3>
            <p>
              可以把公共開放區當作選項，但請不要把它理解成輕鬆抵達就有好位置。廣安里是釜山最熱門的節慶場景之一：越靠近開始時間，人流、地鐵和海灘周邊步道都會更難移動。若你重視舒適度或帶長輩、小孩，指定座位或提早進場會更適合。
            </p>
          </div>
        </section>

        <section className="seo-content" id="viewing-areas" aria-label="釜山煙火節觀賞地點">
          <h2 className="seo-h2">三個觀賞區怎麼選：第一次就選廣安里</h2>
          <div className="seo-prose">
            <p>
              如果你是為了煙火節特地排釜山，廣安里海灘仍是最完整的體驗，且中央有付費 R／S 座位；冬柏島與二妓臺適合想換角度的人，但今年的可進入範圍還沒公告，先不要只看往年社群照片就決定。
            </p>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/busan-fireworks/three-viewing-areas.png"
                alt="釜山煙火節廣安里海灘、冬柏島與二妓臺三個觀賞點的相對位置圖"
                width={1170}
                height={1903}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>廣安里海灘、冬柏島與二妓臺的相對位置。圖：JieJourneys(旅杰)。</figcaption>
            </figure>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>地點</th>
                    <th>適合誰</th>
                    <th>交通抓法</th>
                    <th>先知道的事</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingAreas.map((area) => (
                    <tr key={area.place}>
                      <td>{area.place}</td>
                      <td>{area.fit}</td>
                      <td>{area.transport}</td>
                      <td>{area.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">我的選擇建議</h3>
            <ol>
              <li><strong>第一次、只看一次：</strong>選廣安里，整體聲光與節慶氣氛最完整。</li>
              <li><strong>已經住海雲台：</strong>可從冬柏島觀賞，並等官方公布進出配置後再決定是否跨區移動。</li>
              <li><strong>想避開最中心人流：</strong>研究二妓臺，但把交通、步行距離和天候一起算進去，不要當成廣安里的無痛替代。</li>
            </ol>
          </div>
        </section>

        <section className="seo-content" id="transport" aria-label="釜山煙火節交通與散場建議">
          <h2 className="seo-h2">交通與散場：不開車，比找停車位輕鬆很多</h2>
          <div className="seo-prose">
            <p>
              官方在廣安里位置說明中特別提醒，活動日周邊交通會非常壅塞，附近也沒有足夠停車空間；請直接把<strong>地鐵與公車</strong>當作主要方案。廣安里可從地鐵 2 號線廣安站 3 號出口步行前往，二妓臺與海雲台則依各自位置轉乘。
            </p>
            <h3 className="seo-h3">2026 交通管制：廣安大橋分上、下層封閉</h3>
            <p>依 10/27 查核的官方管制圖，廣安大橋 11/2～11/8 有分階段車道管制；11/7 當天的全面封閉與主要周邊管制如下，時間均為韓國當地時間。</p>
            <div className="narita-table-scroll">
              <table style={{ minWidth: '100%', tableLayout: 'fixed' }}>
                <thead><tr><th>路段</th><th>11/7 管制時段</th></tr></thead>
                <tbody>
                  <tr><td>廣安大橋上層（海雲台往南區）</td><td>15:30～24:00 全面封閉</td></tr>
                  <tr><td>廣安大橋下層（南區往海雲台）</td><td>18:30～24:00 全面封閉</td></tr>
                  <tr><td>廣安海邊路第一階段路段</td><td>10:00 起至活動結束</td></tr>
                  <tr><td>海邊路與黃嶺山路部分路段</td><td>14:00 起，其他周邊路段自 16:00、17:00 起擴大管制</td></tr>
                  <tr><td>廣南路公車路線</td><td>18:00 起管制，公車可能改道</td></tr>
                </tbody>
              </table>
            </div>
            <p>管制會依交通狀況彈性提前或調整；地鐵增班、是否不停靠及會場出入口，仍須另看最新交通公告與現場指示。</p>
            <ActionLinks label="2026 釜山煙火交通管制原圖" links={[officialLinks[4]]} />
            <h3 className="seo-h3">當天不被人潮打亂的四件事</h3>
            <ol>
              <li>入住地點與晚餐先決定，避免開演前還要跨半個釜山找餐廳。</li>
              <li>想看主會場就提早抵達；到場後先確認洗手間、出口與集合點。</li>
              <li>散場時不要跟著人流急著衝第一班車，先保留等待與步行的緩衝時間。</li>
              <li>地鐵出口、道路管制和公車增班每年都有可能不同，當天以現場人員與官方交通公告優先。</li>
            </ol>
            <p>
              如果你的航班或 KTX 是隔天一早，建議不要把住宿排得太遠；煙火結束後的回程比平常慢是常態，留在廣安里或地鐵 2 號線沿線會比較從容。三個會場的公車、地鐵與停車提醒可直接查看
              <a href="https://busanfireworks.com/content/location_en" target="_blank" rel="noopener noreferrer" data-event="busanfireworks_transport_location_inline" data-platform="official" data-section="article">
                <strong>官方位置與交通說明</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="checklist" aria-label="釜山煙火節行前清單">
          <h2 className="seo-h2">行前清單：出發前再確認這五件事</h2>
          <div className="seo-prose">
            <ol>
              <li>日期是否仍為 11 月 7 日，以及當日天候。</li>
              <li>對照已公布的完整節目表，確認飛行表演與煙火是否有臨時調整。</li>
              <li>是否需要指定座位票；外國旅客票的護照驗證與張數限制是否符合自己需求。</li>
              <li>選定觀賞區的最新出入口、交通管制與可進入範圍。</li>
              <li>散場後回住宿的地鐵、公車與步行備案。</li>
            </ol>
            <p>
              日期、會場、完整節目表與道路管制圖均已公布。出發前仍要回官方頁核對臨時變更，並確認所購票種的換票與入場規定、選定觀賞區的出入口及回程交通。
            </p>
          </div>
        </section>

        <section className="seo-content" id="next-steps" aria-label="釜山煙火節延伸規劃">
          <h2 className="seo-h2">把煙火節放進釜山行程</h2>
          <div className="seo-prose">
            <p>
              煙火節當天不要再硬塞太多景點，白天安排海雲台、南浦洞或西面其中一區就好，傍晚提早往選定會場移動。住宿還沒決定，可以先從交通與行程重心挑區域；想把其他釜山景點排進前後兩天，也可回旅遊攻略合輯找對應攻略。
            </p>
            <div className="seo-buy-links seo-action-links" aria-label="釜山煙火節延伸攻略">
              <a className="seo-buy-link primary" href="/busan/hotel?from=busan-fireworks-festival-guide" data-event="busanfireworks_hotel" data-platform="internal" data-section="article_link">釜山住宿推薦</a>
              <a className="seo-buy-link" href="/busan/video?from=busan-fireworks-festival-guide" data-event="busanfireworks_video" data-platform="internal" data-section="article_link">釜山旅遊攻略合輯</a>
              <a className="seo-buy-link" href="/busan/map?from=busan-fireworks-festival-guide" data-event="busanfireworks_map" data-platform="internal" data-section="article_link">釜山景點地圖</a>
            </div>
          </div>
        </section>

        <AccommodationAffiliatePanel
          id="accommodation"
          title="煙火節住宿要提早比價"
          intro="煙火節當晚散場時間難抓，住宿可優先看廣安里或地鐵 2 號線沿線。用同一入住日期比較兩個平台，並特別確認免費取消期限，等官方交通配置公布後仍保有調整空間。"
          destination="釜山"
          agodaHref="https://www.agoda.com/zh-tw/city/busan-kr.html?cid=1945734"
          tripHref="https://tw.trip.com/hotels/busan-hotels-list-253/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D13969664"
          eventPrefix="busanfireworks_stay"
        />

        <SeoRelatedLinksSection
          title="看煙火前，先把海岸交通和住宿位置看懂"
          intro="廣安里煙火節最重要的是選觀看位置與離場方式；先用釜山地圖確認廣安里、冬柏島、二妓臺和住宿之間的距離。"
          links={[
            { label: '釜山旅遊地圖', href: '/busan/map?from=busan-fireworks-guide', event: 'busanfireworks_related_map', primary: true },
            { label: '海雲台攻略', href: '/busan/haeundae-guide?from=busan-fireworks-guide', event: 'busanfireworks_related_haeundae' },
            { label: '釜山住宿地圖', href: '/busan/hotel', event: 'busanfireworks_related_hotel' },
          ]}
        />
        <SeoFaqSection title="釜山煙火節常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
