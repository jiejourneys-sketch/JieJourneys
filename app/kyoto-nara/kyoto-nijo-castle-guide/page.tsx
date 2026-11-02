import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoNijoCastleGuideCanonical,
  kyotoNijoCastleGuideDescription,
  kyotoNijoCastleGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const OFFICIAL_OVERVIEW_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/overview/'
const OFFICIAL_HIGHLIGHTS_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/teien/'
const OFFICIAL_ROUTES_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/guide/model_course/'
const OFFICIAL_TICKETS_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/admission/ticket/'
const OFFICIAL_HOURS_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/guide/annai/'
const OFFICIAL_HONMARU_URL = 'https://nijo-jocastle.city.kyoto.lg.jp/admission/honmaru/'
const KYOTO_ACCESS_URL = 'https://kyoto.travel/en/getting-around/comfortable-access-to-nijo-jo-castle/'

const faqItems = [
  {
    q: '二條城建議停留多久？',
    a: '只看二之丸御殿與庭園約 1～1.5 小時；第一次造訪建議抓 2 小時。若另外預約本丸御殿並走完整城內路線，約需 2.5～3 小時。',
  },
  {
    q: '二條城一定要預約嗎？',
    a: '一般入城與二之丸御殿不用指定時間預約，可現場購票或先買網路票；本丸御殿採指定時間預約，建議先購買本丸御殿 WEB 票。',
  },
  {
    q: '二之丸御殿和本丸御殿有什麼不同？',
    a: '二之丸御殿是德川將軍在京都的重要御殿，也是大政奉還相關歷史舞台；本丸御殿則是明治時期由京都御所北側的桂宮御殿移築而來。兩者是不同建築，也需要不同票券。',
  },
  {
    q: '二條城裡面可以拍照嗎？',
    a: '戶外庭園與建築外觀通常可以拍照，但二之丸御殿、本丸御殿內禁止攝影與錄影。入殿要脫鞋，本丸御殿並要求穿著襪子。',
  },
  {
    q: '二條城從京都站怎麼去？',
    a: '最穩定的方式是搭京都市營地下鐵烏丸線到烏丸御池站，轉東西線至二條城前站；出站即可看到護城河，再沿堀川通走到東大手門入口。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoNijoCastleGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoNijoCastleGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoNijoCastleGuideCanonical,
  image: [
    `${SITE_URL}/assets/kyoto-nijo-castle/recommended-2-hour-route.png`,
    `${SITE_URL}/assets/kyoto-nijo-castle/quick-1-hour-route.png`,
    `${SITE_URL}/assets/kyoto-nijo-castle/full-2-5-hour-route.png`,
    `${SITE_URL}/assets/kyoto-nijo-castle/castle-area-overview.png`,
    `${SITE_URL}/assets/kyoto-nijo-castle/adult-ticket-prices.png`,
  ],
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
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

type KyotoNijoCastleGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoNijoCastleGuidePage({ searchParams }: KyotoNijoCastleGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotonijocastle" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・二條城攻略"
          h1="二條城｜門票、本丸御殿預約與 3 種參觀路線"
          intro="第一次來二條城，最容易搞混的是二之丸御殿與本丸御殿要分開購票。這篇整理 1 小時快速、2 小時推薦與 2.5 小時完整路線，再把唐門、御殿、庭園與天守閣遺址的參觀重點一次說清楚。"
          eventPrefix="kyotonijocastle"
          showVisual={false}
          ctaLinks={[
            { label: '門票差異', href: '#tickets', dataEvent: 'kyotonijocastle_hero_tickets', platform: 'article' },
            { label: '三種路線', href: '#routes', dataEvent: 'kyotonijocastle_hero_routes', platform: 'article' },
            { label: '必看重點', href: '#highlights', dataEvent: 'kyotonijocastle_hero_highlights', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="二條城攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">第一次推薦</span>
              <strong>2 小時路線</strong>
              <p>二之丸御殿、本丸、天守閣遺址與清流園都能看到。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主要票券</span>
              <strong>成人 1,300 日圓</strong>
              <p>包含入城與二之丸御殿；本丸御殿另加 1,000 日圓。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">開城時間</span>
              <strong>08:45～17:00</strong>
              <p>最後入城 16:00，各御殿另有停止受理時間。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最近車站</span>
              <strong>地下鐵二條城前站</strong>
              <p>從京都站在烏丸御池轉乘東西線。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="about" aria-label="二條城歷史與參觀重點">
          <h2 className="seo-h2">二條城看什麼？它不是只看城牆</h2>
          <div className="seo-prose">
            <p>二條城由德川家康於 1603 年興建，最初是守護京都御所及將軍進京時的住宿處。1867 年，德川慶喜在二之丸御殿表明大政奉還的意向；1994 年二條城作為「古都京都的文化財」之一登錄世界文化遺產。</p>
            <p>第一次來的核心不是尋找高聳天守，而是看華麗的<strong>唐門、國寶二之丸御殿、二之丸庭園、本丸區與天守閣遺址</strong>。二條城占地很大，若事前沒有選路線，很容易走到一半才發現預留時間不足。歷史與文化財介紹可參考<a href={OFFICIAL_OVERVIEW_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_overview" data-platform="Nijo Castle" data-section="article_link">二條城官方概要</a>。</p>
            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-nijo-castle/castle-area-overview.png"
                alt="二條城區域總覽圖，標示唐門、二之丸御殿、二之丸庭園、本丸御殿、本丸庭園、天守閣遺址與清流園"
                width={960}
                height={696}
                sizes="(max-width: 820px) 100vw, 900px"
              />
              <figcaption>二條城可先分成東側二之丸、西側本丸與北側清流園三個主要區域，再依停留時間選擇路線。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="tickets" aria-label="二條城門票與本丸御殿預約">
          <h2 className="seo-h2">門票怎麼買？二之丸御殿與本丸御殿是兩張票</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>票券</th>
                    <th>成人</th>
                    <th>是否預約</th>
                    <th>適合誰</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>只有入城</strong></td>
                    <td>800 日圓</td>
                    <td>不用</td>
                    <td>只逛戶外庭園與城內</td>
                  </tr>
                  <tr>
                    <td><strong>入城＋二之丸御殿</strong></td>
                    <td>1,300 日圓</td>
                    <td>不用指定時段</td>
                    <td>第一次造訪最推薦</td>
                  </tr>
                  <tr>
                    <td><strong>本丸御殿</strong></td>
                    <td>另加 1,000 日圓</td>
                    <td>指定時間預約</td>
                    <td>想完整看兩座御殿</td>
                  </tr>
                  <tr>
                    <td><strong>障壁畫展示收藏館</strong></td>
                    <td>另加 100 日圓</td>
                    <td>依展期開放</td>
                    <td>想近看障壁畫原畫</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/kyoto-nijo-castle/adult-ticket-prices.png"
                alt="二條城成人票價整理，入城券800日圓、入城加二之丸御殿1300日圓、本丸御殿加購1000日圓，三者參觀合計2300日圓"
                width={1122}
                height={1402}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>成人票價快速整理：本丸御殿是另外加購的指定時段票，不包含在 1,300 日圓套票內。</figcaption>
            </figure>
            <p><strong>最不容易買錯的方式：</strong>一般旅客先買「入城＋二之丸御殿」1,300 日圓；想進本丸御殿，再另外購買指定時間的本丸御殿票。兩座御殿都要看的成人合計為 2,300 日圓。</p>
            <p>二之丸御殿可現場買票或先買網路票，不需指定入殿時間。本丸御殿則採人數管制，官方自參觀日前 30 天開放 WEB 票，購買後不能更改、取消或退費。東大手門走到本丸御殿約需 15～20 分鐘，官方要求至少在預約時間前 20 分鐘入城。請直接查看<a href={OFFICIAL_TICKETS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_tickets" data-platform="Nijo Castle" data-section="article_link">二條城官方票券頁</a>與<a href={OFFICIAL_HONMARU_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_honmaru_booking" data-platform="Nijo Castle" data-section="article_link">本丸御殿預約說明</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="routes" aria-label="二條城三種參觀路線">
          <h2 className="seo-h2">三種參觀路線：1 小時、2 小時或 2.5 小時怎麼選？</h2>
          <div className="seo-prose">
            <p>二條城官方依停留時間提供三種模型路線。以下三張圖已把行走方向與編號標出；時間包含一般步行與參觀，但旺季排隊、慢慢拍照或預約本丸御殿時，仍建議多留緩衝。</p>

            <h3 className="seo-h3">1 小時快速路線｜只抓二之丸核心</h3>
            <p><strong>東大手門 → 東南隅櫓 → 唐門 → 二之丸御殿 → 二之丸庭園 → 清流園 → 障壁畫展示收藏館 → 東大手門</strong></p>
            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-nijo-castle/quick-1-hour-route.png"
                alt="二條城一小時快速參觀路線圖，標示東大手門、唐門、二之丸御殿、二之丸庭園、清流園與展示收藏館"
                width={960}
                height={699}
                sizes="(max-width: 820px) 100vw, 900px"
              />
              <figcaption>1 小時快速路線：適合時間有限、以二之丸御殿與庭園為主的人。</figcaption>
            </figure>

            <h3 className="seo-h3">2 小時推薦路線｜第一次來最剛好</h3>
            <p><strong>快速路線＋本丸庭園、本丸御殿外觀、天守閣遺址與西橋北側路線</strong>。這條線能看到二條城最重要的兩個區域，也不必繞完整個西南側城地。</p>
            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-nijo-castle/recommended-2-hour-route.png"
                alt="二條城兩小時推薦參觀路線圖，經過二之丸御殿、本丸御殿、本丸庭園、天守閣遺址、西橋與清流園"
                width={960}
                height={708}
                sizes="(max-width: 820px) 100vw, 900px"
              />
              <figcaption>2 小時推薦路線：第一次造訪最平衡；若要進本丸御殿，須配合預約時段調整順序。</figcaption>
            </figure>

            <h3 className="seo-h3">2.5 小時完整路線｜季節景觀與城內一圈</h3>
            <p><strong>推薦路線＋南門、梅林、櫻之園、桃山門、鳴子門與西橋南側路線</strong>。梅花約 2 月中旬至 3 月下旬、櫻花約 3 月下旬至 4 月上旬時，官方也建議由天守閣遺址往南側走，順路看梅林與櫻之園。</p>
            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-nijo-castle/full-2-5-hour-route.png"
                alt="二條城兩個半小時完整參觀路線圖，包含二之丸、本丸、天守閣遺址、梅林、櫻之園、清流園與展示收藏館"
                width={960}
                height={714}
                sizes="(max-width: 820px) 100vw, 900px"
              />
              <figcaption>2.5 小時完整路線：適合第一次就想走完整、賞梅賞櫻或喜歡城郭庭園的人。</figcaption>
            </figure>

            <p>三種路線與季節分流皆以<a href={OFFICIAL_ROUTES_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_routes" data-platform="Nijo Castle" data-section="article_link">二條城官方模型路線</a>為基礎整理。</p>
          </div>
        </section>

        <section className="seo-content" id="highlights" aria-label="二條城必看景點">
          <h2 className="seo-h2">二條城必看重點：別只走進御殿就離開</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">① 東大手門、東南隅櫓｜先看城郭入口</h3>
            <p>多數旅客從東側售票處進入，通過東大手門後，可先看護城河與東南隅櫓。這段是理解二條城防禦格局與拍完整城門外觀的起點。</p>

            <h3 className="seo-h3">② 唐門｜進入二之丸前最華麗的門</h3>
            <p>唐門以雕刻、彩色裝飾與金箔細節聞名，是二條城最具代表性的外觀之一。進入二之丸御殿前先停下來看門上的動植物與吉祥題材。</p>

            <h3 className="seo-h3">③ 二之丸御殿｜大政奉還與鶯張走廊</h3>
            <p>國寶二之丸御殿由六棟建築斜向相連，內有 33 個房間、超過 800 張榻榻米，狩野派障壁畫營造出將軍威儀。參觀時也會走過會發出聲響的「鶯張」走廊。御殿內禁止拍照與錄影，需脫鞋入內。</p>

            <h3 className="seo-h3">④ 二之丸庭園｜從三個方向欣賞的書院庭園</h3>
            <p>二之丸庭園以池塘、蓬萊島、鶴島與龜島構成，並配合後水尾天皇行幸整修，設計上可從大廣間、黑書院與當時的行幸御殿三個方向欣賞。</p>

            <h3 className="seo-h3">⑤ 本丸御殿與本丸庭園｜另一種宮家建築</h3>
            <p>現存本丸御殿並非江戶初期原建築，而是 1893～1894 年間由京都御所北側的桂宮御殿移築而來，2024 年完成修復並重新開放。想進建築內部必須另外購票與指定時段預約；只買一般入城票仍可走本丸庭園與外圍路線。</p>

            <h3 className="seo-h3">⑥ 天守閣遺址｜二條城的制高點</h3>
            <p>原有五重天守在 1750 年遭雷擊焚毀，之後沒有重建，現在留下天守台石垣。登上遺址可俯瞰本丸御殿、本丸庭園與京都市區，是路線中少數能從高處看城內格局的位置。</p>

            <h3 className="seo-h3">⑦ 清流園與障壁畫展示收藏館｜回程不要直接略過</h3>
            <p>清流園結合日式與西式庭園景觀，適合放在回程休息；障壁畫展示收藏館則以期間限定方式展出二之丸御殿障壁畫原畫，是否開館與當期展品要看最新公告。更多建築與庭園背景可查<a href={OFFICIAL_HIGHLIGHTS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_highlights" data-platform="Nijo Castle" data-section="article_link">二條城官方文化財介紹</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="visit-info" aria-label="二條城開放時間休城日與注意事項">
          <h2 className="seo-h2">開放時間、休城日與參觀注意事項</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <tbody>
                  <tr>
                    <th>開城時間</th>
                    <td>08:45～17:00，最後入城 16:00</td>
                  </tr>
                  <tr>
                    <th>二之丸御殿受理</th>
                    <td>08:45～16:10</td>
                  </tr>
                  <tr>
                    <th>本丸御殿受理</th>
                    <td>09:30～16:00，須持指定時段票</td>
                  </tr>
                  <tr>
                    <th>全城休城</th>
                    <td>12 月 29～31 日</td>
                  </tr>
                  <tr>
                    <th>御殿個別休止日</th>
                    <td>二之丸、本丸各有不同固定休止日，出發前務必查官網</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>二之丸御殿在 1、7、8、12 月的每週二，以及年末年初部分日期休殿；本丸御殿則原則於每月第三個星期一及翌日，以及年末年初部分日期休殿，遇國定假日規則會調整。最新日期請以<a href={OFFICIAL_HOURS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_official_hours" data-platform="Nijo Castle" data-section="article_link">官方開城與休殿公告</a>為準。</p>
            <ul>
              <li><strong>御殿內禁止攝影：</strong>手機、相機與影片都不要拍。</li>
              <li><strong>需要脫鞋：</strong>本丸御殿要求穿襪，冬天木地板也可能偏冷。</li>
              <li><strong>大件行李先寄放：</strong>城內有寄物與置物櫃，但旺季數量有限。</li>
              <li><strong>本丸不要遲到：</strong>入口到本丸至少 15～20 分鐘，錯過時段可能無法入殿且不退款。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="二條城交通與行程搭配">
          <h2 className="seo-h2">二條城怎麼去？地下鐵比公車更好掌握時間</h2>
          <div className="seo-prose">
            <p>從京都站出發，搭地下鐵烏丸線到<strong>烏丸御池站</strong>，轉東西線一站至<strong>二條城前站</strong>。出站即可看到護城河，入口位在東側堀川通上的東大手門。公車也能抵達，但京都官方提醒部分路線會受到市中心道路壅塞影響，趕預約時段時優先選地下鐵。</p>
            <p>二條城適合和<strong>錦市場、烏丸御池、京都御所或四條河原町</strong>安排同一天，不建議再跨到清水寺與嵐山兩端。詳細轉乘可參考<a href={KYOTO_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotonijocastle_kyoto_access" data-platform="Kyoto Travel" data-section="article_link">京都官方二條城交通建議</a>。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          intro="二條城位在京都市中心，適合和錦市場、烏丸御池與四條河原町排在同一天；先看分區攻略再決定前後順序。"
          links={[
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyotonijocastle_related_spots', platform: 'internal' },
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyotonijocastle_related_areas', platform: 'internal' },
            { label: '清水寺完整攻略', href: '/kyoto-nara/kyoto-kiyomizudera-guide', event: 'kyotonijocastle_related_kiyomizudera', platform: 'internal' },
            { label: '三年坂、二年坂、一年坂攻略', href: '/kyoto-nara/kyoto-sannenzaka-ninenzaka-guide', event: 'kyotonijocastle_related_higashiyama_slopes', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyotonijocastle_related_map', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="二條城攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
