import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
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
    note: '限量販售，售完可能提前結束；結帳時以平台顯示的票種與規定為準。',
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
    a: '可以，而且台灣旅客要買一般票就直接選 KKday。KKday 是中文購票入口；官方票券頁只用來查看最新公告與規定。NOL World 則是 8 月 26 日當天的外國旅客限時早鳥選項，不是一般售票的主要入口。',
  },
  {
    q: 'R 席和 S 席差在哪裡？',
    a: '兩者都在廣安里海灘中央的付費座位區。R 席包含桌與椅，每張 100,000 韓元；S 席只有座椅，每張 70,000 韓元。早鳥階段只有 S 席，折後為 56,000 韓元。',
  },
  {
    q: '付費座位幾點可以入場？',
    a: '付費觀賞區 15:00 到 17:55 入場、18:00 到 19:00 是文化與慶祝活動、19:00 到 20:00 是煙火表演。這些都是活動當天在韓國當地的時間，建議不要壓線抵達。',
  },
  {
    q: '三個觀賞地點怎麼選？',
    a: '第一次去、想看最完整現場氛圍與付費座位就選廣安里海灘；住海雲台可考慮冬柏島；二妓臺適合想從較遠處看廣安大橋與整體煙火構圖的人。冬柏島與二妓臺的可進入範圍，仍要以當年官方管制公告為準。',
  },
  {
    q: '看釜山煙火節可以開車嗎？',
    a: '不建議。官方指出廣安里會有嚴重交通壅塞，附近也沒有足夠停車空間。最實際的方式是搭地鐵、公車，並預留散場後等候與步行時間。',
  },
  {
    q: '煙火幾點開始？演多久？',
    a: '煙火表演為 19:00 到 20:00。完整節目段落與當日動線仍請在出發前回到官方網站確認。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanFireworksFestivalGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanFireworksFestivalGuideDescription,
  inLanguage: 'zh-Hant',
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
          badge="釜山季節活動｜2026"
          h1="2026 釜山煙火節攻略｜日期、觀賞地點、票券與交通避人潮"
          intro="釜山煙火節不是只要到廣安里就好：主會場的人潮、指定座位、散場交通都要先想好。這篇整理 2026 年 11 月 7 日 19:00 的活動、兩階段售票與三個觀賞點，讓你先選對位置再安排住宿。"
          eventPrefix="busanfireworks"
          showVisual={false}
          ctaLinks={[
            { label: '先看結論', href: '#quick-answer', dataEvent: 'busanfireworks_hero_quick', platform: 'article' },
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
              <strong>別開車，票券分兩波</strong>
              <p>廣安里周邊非常容易塞車且停車不足；早鳥 8/26、一般售票 9/4 起，想坐指定席不要等到最後。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="confirmed" aria-label="2026 釜山煙火節已確認資訊">
          <h2 className="seo-h2">2026 已確認資訊：日期、會場與節目方向</h2>
          <div className="seo-prose">
            <p>
              第 21 屆釜山煙火節確定在 <strong>2026 年 11 月 7 日星期六</strong>舉行；可看的三個位置是<strong>廣安里海灘、冬柏島與二妓臺</strong>。廣安里海灘中央設有付費 R／S 座位，活動由釜山市主辦、釜山慶典組織營運。
            </p>
            <p>
              官方目前列出的節目骨架為事前活動、海外招待煙火與釜山多點煙火；煙火表演為<strong>19:00～20:00</strong>。至於每一段的詳細時刻、交通管制與各區入場方式，仍請在出發前查看最新公告。
            </p>
            <p><strong>購票時間提醒：</strong>售票時間以韓國時間（KST）公告；台灣時間比韓國慢 1 小時。活動當天的入場、文化活動與煙火時間則直接看韓國當地時間即可。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>當天時段</th>
                    <th>安排</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>15:00～17:55</strong></td>
                    <td>付費觀賞區入場時間</td>
                  </tr>
                  <tr>
                    <td><strong>18:00～19:00</strong></td>
                    <td>文化活動與慶祝活動</td>
                  </tr>
                  <tr>
                    <td><strong>19:00～20:00</strong></td>
                    <td>煙火表演</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ActionLinks label="釜山煙火節官方資訊" links={officialLinks} />
          </div>
        </section>

        <section className="seo-content" id="ticket" aria-label="釜山煙火節票券資訊">
          <h2 className="seo-h2">票券怎麼買：台灣旅客直接用 KKday，R 席與 S 席一次看懂</h2>
          <div className="seo-prose">
            <p>
              <strong>台灣旅客要買票，直接用 KKday 就好。</strong>KKday 是中文購票入口，可用來選擇 R／S 席；官方票券頁則只用來追蹤最新公告與入場規定。NOL World 是 8/26 當天的外國旅客限時早鳥，並不是一般售票的主要入口。指定座位票和公共觀賞區是兩種不同體驗，想在公共區域看也要預留提早到場、步行與散場等待的時間。
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
                  label: '外國旅客早鳥票（NOL World）',
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
              <li>完整節目表與實際開演時間是否已公布。</li>
              <li>是否需要指定座位票；外國旅客票的護照驗證與張數限制是否符合自己需求。</li>
              <li>選定觀賞區的最新出入口、交通管制與可進入範圍。</li>
              <li>散場後回住宿的地鐵、公車與步行備案。</li>
            </ol>
            <p>
              這五件事中，日期與會場已確認；其餘項目會在活動接近時陸續更新。最穩的作法就是先把住宿、想看的區域和票券傾向決定好，出發前一週再回官方頁核對一次。
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
