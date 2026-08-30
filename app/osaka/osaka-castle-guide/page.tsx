import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  osakaCastleGuideCanonical,
  osakaCastleGuideDescription,
  osakaCastleGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type StationGuide = {
  station: string
  exits: string
  bestFor: string
  route: string
}

const stationGuides: StationGuide[] = [
  {
    station: '谷町四丁目站',
    exits: '中央線 9 號出口／谷町線 1-B 出口',
    bestFor: '第一次去、想從大手門一側進大阪城，或順遊大阪歷史博物館。',
    route: '從西側往大手門、櫻門方向走；到天守閣抓約 15～20 分鐘，推嬰兒車或同行長輩可考慮園內電動車。',
  },
  {
    station: '森之宮站',
    exits: '中央線 1 號出口／長堀鶴見綠地線 3-B 出口',
    bestFor: '從東南側進公園、想先看護城河與公園景色，或想接園內 Road Train。',
    route: '從玉造口一帶進公園再往天守閣方向走；距離不是「出站就到」，同樣先預留約 15～20 分鐘。',
  },
  {
    station: '天滿橋站',
    exits: '大阪 Metro 谷町線 3 號出口／京阪電車天滿橋站',
    bestFor: '從北西側走、要搭京阪線，或想順接中之島、天滿橋一帶。',
    route: '沿護城河往大手門方向走最直覺；步行到天守閣約 15～20 分鐘，櫻花季與假日再多留緩衝。',
  },
  {
    station: '大阪城公園站',
    exits: 'JR 大阪環狀線；依站內 JO-TERRACE OSAKA／大阪城公園指標出站',
    bestFor: '從 JR 過來、想逛 JO-TERRACE OSAKA，或從東北側青屋門方向進場。',
    route: '出站後先經 JO-TERRACE OSAKA、青屋門再往天守閣；大約抓 20 分鐘較穩。',
  },
]

const faqItems = [
  {
    q: '大阪城從哪一站下車最好？',
    a: '第一次去、想走最直覺的大手門方向，選谷町四丁目站；搭 JR 或想先逛 JO-TERRACE OSAKA，選大阪城公園站；從森之宮則適合從公園東南側慢慢走進去。四站都不是出站就到天守閣，請預留 15 到 20 分鐘左右。',
  },
  {
    q: '大阪城只有前後兩個入口嗎？',
    a: '是。若要進入天守閣所在的本丸核心區，主要就是前側的大手門與後側的櫻門。四個車站只是從不同方向靠近大阪城公園，最後都會接到這兩個門之一；大阪城公園站、森之宮方向通常會先經青屋門或玉造口一帶，再往櫻門。',
  },
  {
    q: '大阪城園內電動車和 Road Train 怎麼選？',
    a: 'Road Train 比較適合想減少長距離步行、從森之宮或大阪城公園站一側進來的人；電動車則是繞南外堀的短程環線。成人單程/單次票分別為 400 円與 300 円，兒童與 65 歲以上多為 200 円；天候、活動或人潮可能影響營運，當天請看官方公告。',
  },
  {
    q: '大阪周遊券可以免費玩大阪城哪些景點？',
    a: '依 2026 年大阪周遊券目前的免費設施清單，可使用大阪城天守閣、大阪城御座船、海洋堂公仔博物館 MIRAIZA 大阪城，以及西之丸庭園。御座船需現場換指定班次票、座位有限；各設施營業日與使用條件仍要在出發前確認。',
  },
  {
    q: '大阪城要安排多久？',
    a: '只拍外觀和公園散步，抓 1 到 1.5 小時；進天守閣則抓 2 小時較舒服。若再加御座船、公仔博物館或西之丸庭園，建議留半天，尤其櫻花季和假日不要把後面行程排太緊。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: osakaCastleGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: osakaCastleGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: osakaCastleGuideCanonical,
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

type OsakaCastleGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'osaka-video') return '/osaka/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  if (value === 'pass-map') return '/osaka/pass-map'
  if (value === 'ticket' || value === 'osaka-ticket') return '/osaka/ticket'
  if (value === 'osaka-amazing-pass') return '/osaka/osaka-amazing-pass'
  return '/osaka'
}

export default async function OsakaCastleGuidePage({ searchParams }: OsakaCastleGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="osakacastle" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪城攻略"
          h1="大阪城攻略｜4 個車站怎麼選、園內電動車、天守閣與大阪周遊券一次懂"
          intro="大阪城不是下車就到天守閣的景點。先選對車站與進園方向、留好步行時間，再決定要不要搭園內 Road Train 或電動車；如果持大阪周遊券，天守閣、御座船、公仔博物館與西之丸庭園可以集中在同一天安排。"
          eventPrefix="osakacastle"
          showVisual={false}
          ctaLinks={[
            { label: '四站怎麼選', href: '#station-guide', dataEvent: 'osakacastle_hero_station', platform: 'article' },
            { label: '園內交通', href: '#park-transport', dataEvent: 'osakacastle_hero_transport', platform: 'article' },
            { label: '周遊券景點', href: '#amazing-pass', dataEvent: 'osakacastle_hero_pass', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="大阪城攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">車站</span>
              <strong>四站都能到，但都要走</strong>
              <p>谷町四丁目、森之宮、天滿橋、大阪城公園站都能抵達；到天守閣多半要再走約 15～20 分鐘。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">入口</span>
              <strong>進本丸主要走前、後兩門</strong>
              <p>前側走大手門、後側走櫻門；四個車站從不同方位進公園，再接其中一門。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">省腳力</span>
              <strong>Road Train 400 円／電動車 300 円起</strong>
              <p>長距離移動選 Road Train；想繞南外堀一圈可選電動車。營運受天候、活動與人潮影響。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">大阪周遊券</span>
              <strong>四個重點設施可免費使用</strong>
              <p>天守閣、御座船、海洋堂公仔博物館、西之丸庭園都能用，御座船先換班次票。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="station-guide" aria-label="大阪城四個車站攻略">
          <h2 className="seo-h2">大阪城 4 個車站怎麼選？先選你要從哪一側走進去</h2>
          <div className="seo-prose">
            <p>
              大阪城公園範圍很大，四個常用車站都能到，但沒有一站是「出站馬上到天守閣」。Metro 常用出口是谷町四丁目 9／1-B、森之宮 1／3-B、天滿橋 3；從 JR 大阪城公園站則跟著 JO-TERRACE OSAKA／大阪城公園方向的站內指標走最直覺。出發前再確認當天的入口與路線即可。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>車站</th>
                    <th>出口／路線</th>
                    <th>適合誰</th>
                    <th>走法與時間</th>
                  </tr>
                </thead>
                <tbody>
                  {stationGuides.map((station) => (
                    <tr key={station.station}>
                      <td>{station.station}</td>
                      <td>{station.exits}</td>
                      <td>{station.bestFor}</td>
                      <td>{station.route}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/osaka-castle/station-access-map.png"
                alt="大阪城四個常用車站與出口位置示意圖"
                width={1170}
                height={2532}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>四個常用車站分布在大阪城公園周邊；先選離你的下一個行程最近的一側，再接大手門或櫻門進本丸。</figcaption>
            </figure>

            <h3 className="seo-h3">第一次去最推薦：谷町四丁目站，從大手門慢慢走進去</h3>
            <p>
              如果沒有特別要逛 JO-TERRACE，第一次最推薦從谷町四丁目站走。往大手門、櫻門方向前進，沿途有護城河、石垣和城門，走到天守閣時比較有「進城」的感覺。要順排大阪歷史博物館也最方便。
            </p>

            <h3 className="seo-h3">搭 JR 最順：大阪城公園站，先經 JO-TERRACE OSAKA</h3>
            <p>
              從大阪站、天王寺或京橋一帶搭 JR 過來，選大阪城公園站最直覺。出站先接 JO-TERRACE OSAKA，再往青屋門與天守閣方向走；沿途餐廳、便利商店較好找，適合想先買飲料、吃點東西再進公園的人。
            </p>
          </div>
        </section>

        <section className="seo-content" id="entrances" aria-label="大阪城入口與導航提醒">
          <h2 className="seo-h2">大阪城進本丸主要只有前、後兩個門：大手門與櫻門</h2>
          <div className="seo-prose">
            <p>
              你說得對：若目標是進入天守閣所在的本丸核心區，實際就是從<strong>前側的大手門</strong>或<strong>後側的櫻門</strong>進去。谷町四丁目、天滿橋方向最順接大手門；大阪城公園站、森之宮方向則多半先從青屋門或玉造口一帶進公園，再走到後側的櫻門。
            </p>
            <p>
              青屋門、玉造口等是從公園外圍接近本丸的動線，不是取代大手門／櫻門的第三個入城門。最簡單的做法是：想上天守閣就導航<strong>大阪城天守閣</strong>；要搭船就導航<strong>大阪城御座船</strong>；賞櫻要去西之丸庭園就直接導航<strong>大阪城西之丸庭園</strong>。不要只導「大阪城公園」，不然很容易被帶到離當天目的地很遠的一側。
            </p>
            <p>
              也因為園區大，官方的無障礙地圖會把車站到天守閣的坡度與路線分開標示。推嬰兒車、輪椅、同行長輩，或只是想把腳力留給下午行程的人，不要硬抓 15 分鐘；抓 20 分鐘加上園內交通備案會更舒服。
            </p>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-castle/park-gates-map.jpg"
                alt="大阪城公園本丸與大手門、櫻門位置圖"
                width={1487}
                height={1241}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>前側從大手門進本丸，後側從櫻門進本丸；外圍車站和公園動線則依你從哪一側抵達而不同。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="park-transport" aria-label="大阪城園內交通">
          <h2 className="seo-h2">大阪城園內交通：Road Train 和電動車怎麼搭？</h2>
          <div className="seo-prose">
            <p>
              大阪城公園有兩種協助移動的車：<strong>Road Train</strong>適合處理森之宮／大阪城公園站一側到天守閣周邊的長距離；<strong>電動車</strong>則繞南外堀一圈，從馬場町出發，經大手前、櫻門、豐國神社前與城南巴士停車場前再回到馬場町。實際站點、運行時間與停駛狀況，請以當天園內資訊為準。
            </p>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-castle/park-transport-map.png"
                alt="大阪城園內 Road Train 紅線與電動車藍線路線圖"
                width={2392}
                height={2362}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>紅線是 Road Train，藍線是電動車；先看自己從哪一側進公園，再決定是否需要搭車省腳力。</figcaption>
            </figure>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>車種</th>
                    <th>適合情況</th>
                    <th>單程／單次票</th>
                    <th>一日自由乘車券</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Road Train</td>
                    <td>從森之宮、大阪城公園站方向進來，不想把腳力都花在公園步道上。</td>
                    <td>成人 400 円；4 歲至小學生、65 歲以上 200 円。</td>
                    <td rowSpan={2}>兩種車都可搭：成人 1,000 円；4 歲至小學生、65 歲以上 600 円。</td>
                  </tr>
                  <tr>
                    <td>電動車</td>
                    <td>已在天守閣南側、谷町四丁目／馬場町周邊，想繞南外堀一圈或減少短程步行。</td>
                    <td>成人 300 円；4 歲至小學生、65 歲以上 200 円。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="seo-media-grid osaka-castle-fare-grid" aria-label="大阪城園內交通票價圖">
              <figure className="seo-figure">
                <Image
                  src="/assets/osaka-castle/road-train-fare.png"
                  alt="大阪城 Road Train 小火車單程票價：成人 400 日圓，兒童與敬老 200 日圓"
                  width={1536}
                  height={1165}
                  sizes="(max-width: 820px) 100vw, 250px"
                />
                <figcaption>Road Train（紅線）單程票價。</figcaption>
              </figure>
              <figure className="seo-figure">
                <Image
                  src="/assets/osaka-castle/electric-car-fare.png"
                  alt="大阪城電動車單次票價：成人 300 日圓，兒童與敬老 200 日圓"
                  width={1536}
                  height={1196}
                  sizes="(max-width: 820px) 100vw, 250px"
                />
                <figcaption>電動車（藍線）單次票價。</figcaption>
              </figure>
              <figure className="seo-figure">
                <Image
                  src="/assets/osaka-castle/day-pass-fare.png"
                  alt="大阪城電動車與小火車一日券票價比較"
                  width={1535}
                  height={1117}
                  sizes="(max-width: 820px) 100vw, 250px"
                />
                <figcaption>兩種車的一日自由乘車券與大阪周遊券優惠參考。</figcaption>
              </figure>
            </div>

            <h3 className="seo-h3">大阪周遊券的園內車輛優惠，先不要當成固定價格</h3>
            <p>
              網路上仍會看到大阪周遊券搭園內車輛成人 800 円、兒童／長輩 400 円的舊資訊，但 2026 年大阪周遊券目前的免費設施清單列出的是天守閣、西之丸庭園、海洋堂公仔博物館和御座船，沒有把 Road Train 或電動車列為免費設施。這種權益與票價可能換年度調整，所以文章不把舊優惠當成固定規則；真的要搭時，直接以當日園內交通與周遊券官方頁面為準。
            </p>
          </div>
        </section>

        <section className="seo-content" id="sights" aria-label="大阪城主要景點">
          <h2 className="seo-h2">大阪城主要景點：第一次先抓這 4 個</h2>
          <div className="seo-prose">
            <p>
              只想拍大阪城外觀，可以用公園散步加天守閣周邊；想把大阪周遊券用得更完整，則把下面四個設施排在同一天。天守閣目前一般開館為 9:00～18:00、最終入館 17:30，年末年始休館；票價、展覽與臨時開放以現場公告為準。
            </p>

            <h3 className="seo-h3">🏯 天守閣：先看歷史，再上高樓層看大阪城公園</h3>
            <p>
              第一次來最適合從天守閣建立大阪城的歷史感。館內以豐臣秀吉、大坂之陣與大阪城相關資料為主，最後再到 8 樓展望空間看大阪城公園與市區。熱門時段上層空間容易擁擠，若想慢慢看展，建議一開館或下午較晚時進去。
            </p>

            <h3 className="seo-h3">🚤 大阪城御座船：從護城河近看巨大石垣</h3>
            <p>
              御座船會繞護城河，最適合用不同角度看石垣，也可以找找著名的人面石。持大阪周遊券的人要先到現場換成指定班次的乘船票，座位有限、不能電話預約，滿席或天候不佳時都可能無法搭乘；想坐的話先去換票，再回頭逛天守閣最穩。
            </p>

            <h3 className="seo-h3">🎭 海洋堂公仔博物館 MIRAIZA 大阪城：動漫、公仔與模型</h3>
            <p>
              海洋堂公仔博物館在 MIRAIZA OSAKA-JO 裡，展示漫畫、動畫、特攝、日本文化與自然主題等不同類型的模型。若同行有人不特別想看歷史，這個點可以讓大阪城行程更有變化；周遊券使用者還可在館內專用扭蛋機領入館紀念品。
            </p>

            <h3 className="seo-h3">🌸 西之丸庭園：櫻花季最熱門，其他季節則適合看天守閣景觀</h3>
            <p>
              西之丸庭園是大阪城最受歡迎的賞櫻區之一，也是在公園裡拍天守閣的好位置。通常 3 月到 10 月開到 17:00、11 月到 2 月開到 16:30，最後入園時間為閉園前 30 分鐘；櫻花季票價與人潮都可能不同，別把它塞在快關門才去的最後一站。
            </p>
          </div>
        </section>

        <section className="seo-content" id="amazing-pass" aria-label="大阪周遊券大阪城景點">
          <h2 className="seo-h2">持大阪周遊券怎麼排？天守閣、御座船、公仔博物館、西之丸庭園可一起安排</h2>
          <div className="seo-prose">
            <p>
              依 2026 年大阪周遊券的免費設施清單，大阪城天守閣（含豐臣石垣館）、西之丸庭園、海洋堂公仔博物館 MIRAIZA 大阪城與大阪城御座船都能免費使用。這四個點都集中在大阪城周邊，所以持券的人很適合把它排成半日主行程；票券權益可能調整，出發前先核對自己購買的票券條件。
            </p>

            <ol>
              <li><strong>一早先到御座船換票：</strong>班次和座位有限，先拿到票才不會後面行程被綁住。</li>
              <li><strong>接天守閣：</strong>把最容易排隊的主景點先完成，再依船票時間調整。</li>
              <li><strong>中間逛海洋堂公仔博物館：</strong>適合避開中午太熱、下雨或不想一直走路的時段。</li>
              <li><strong>西之丸庭園當收尾：</strong>非櫻花季可以彈性排；櫻花季則建議提早進去，別等到傍晚才趕最後入園。</li>
            </ol>
            <p>
              如果這天還會跑梅田、難波或天保山，先確認時間是否真的夠；大阪城四個設施已經可以玩掉半天，不需要為了回本硬塞太多跨區景點。想把免費設施位置攤在地圖上比較，可以搭配
              <a href="/osaka/pass-map" data-event="osakacastle_passmap" data-platform="map" data-section="article">
                <strong>大阪周遊券地圖</strong>
              </a>
              一起排。
            </p>
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="大阪城建議行程">
          <h2 className="seo-h2">大阪城半日建議動線：不要只抓景點，先把走路時間算進去</h2>
          <div className="seo-prose">
            <ol>
              <li>從谷町四丁目站或大阪城公園站出發，先設定天守閣為導航目的地。</li>
              <li>持大阪周遊券且要搭御座船，先到乘船處換指定班次票。</li>
              <li>走天守閣、看展與展望空間；如果腳力有限，接園內電動車或 Road Train。</li>
              <li>依船票時間搭御座船，之後安排海洋堂公仔博物館。</li>
              <li>最後到西之丸庭園，或從大阪城公園站方向離開接梅田／京橋；從谷町四丁目離開則適合接大阪歷史博物館或本町。</li>
            </ol>
            <p>
              只想拍照、不進付費設施也完全沒問題：從谷町四丁目走大手門與天守閣外觀，再選大阪城公園站離開，是第一次來最不費腦的散步線。要接整趟大阪行程，則可回到
              <a href="/osaka/map" data-event="osakacastle_osakamap" data-platform="map" data-section="article">
                <strong>大阪景點地圖</strong>
              </a>
              看大阪城和難波、梅田、天王寺的相對位置。
            </p>
          </div>
        </section>

        <SeoCtaSection text="" href="/osaka/map" linkText="打開大阪景點地圖安排大阪城" newTab dataEvent="osakacastle_cta_map" />
        <SeoRelatedLinksSection
          title="大阪城之後，接著怎麼排？"
          intro="大阪城適合獨立安排半日；想再加進其他免費設施，就用周遊券地圖確認同一天的移動距離與開放時間。"
          links={[
            { label: '大阪 5 大區域攻略', href: '/osaka/osaka-5-areas-guide?from=osaka-castle-guide', event: 'osakacastle_related_areas', primary: true },
            { label: '大阪周遊券完整攻略', href: '/osaka/osaka-amazing-pass?from=osaka-castle-guide', event: 'osakacastle_related_pass' },
            { label: '大阪周遊券地圖', href: '/osaka/pass-map?from=osaka-castle-guide', event: 'osakacastle_related_passmap' },
          ]}
        />
        <SeoFaqSection title="大阪城常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
