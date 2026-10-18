import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoFushimiInariGuideCanonical,
  kyotoFushimiInariGuideDescription,
  kyotoFushimiInariGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const OFFICIAL_ACCESS_URL = 'https://inari.jp/en/access/'
const OFFICIAL_MAP_URL = 'https://inari.jp/en/map/'
const OFFICIAL_SENBON_TORII_URL = 'https://inari.jp/en/map/spot_07/'
const OFFICIAL_VISITOR_RULES_URL = 'https://inari.jp/en/request/'
const KYOTO_CONGESTION_URL = 'https://global.kyoto.travel/en/comfort/'

const faqItems = [
  {
    q: '伏見稻荷大社最近的車站是哪一站？',
    a: 'JR 奈良線稻荷站就在伏見稻荷大社旁，出站後沿表參道往前即可到樓門。也可以從京阪本線伏見稻荷站步行約 5 分鐘抵達。',
  },
  {
    q: '只想看千本鳥居，需要爬到山頂嗎？',
    a: '不用。從樓門、本殿往千本鳥居與奧社奉拜所走，就能看到最具代表性的密集鳥居；想增加山林與小神社路段，再延伸到三ツ辻後繞回即可。',
  },
  {
    q: '伏見稻荷大社要預留多久？',
    a: '只走樓門、本殿與千本鳥居，可先抓 30～60 分鐘；依本文走到三ツ辻再繞回本殿，建議至少預留 1～1.5 小時。拍照、人潮與個人體力都會影響時間。',
  },
  {
    q: '文章中的三岔路就是山頂嗎？',
    a: '不是。圖上的三岔路是山道中的三ツ辻，只是這條短版環線的折返點；要完整登上稻荷山仍需繼續走更長的上坡與階梯。',
  },
  {
    q: '千本鳥居什麼時段比較不擁擠？',
    a: '熱門時段常有人潮，若想比較從容地參拜與拍照，可優先安排早上，並在出發前查看京都官方的伏見地區壅塞預測。狹窄參道拍照時也要保留通行空間。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoFushimiInariGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoFushimiInariGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoFushimiInariGuideCanonical,
  image: [
    `${SITE_URL}/assets/kyoto-fushimi-inari/precinct-map.png`,
    `${SITE_URL}/assets/kyoto-fushimi-inari/station-to-romon.png`,
    `${SITE_URL}/assets/kyoto-fushimi-inari/senbon-torii-loop.png`,
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

type KyotoFushimiInariGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoFushimiInariGuidePage({ searchParams }: KyotoFushimiInariGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotofushimiinari" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・伏見稻荷攻略"
          h1="伏見稻荷大社｜千本鳥居路線與所需時間"
          intro="第一次來不用硬攻山頂。從 JR 稻荷站依序走表參道、樓門、本殿、玉山稻荷社與千本鳥居；想多走一段，再到三ツ辻繞回，路線清楚也能看到沿途的小神社。"
          eventPrefix="kyotofushimiinari"
          showVisual={false}
          ctaLinks={[
            { label: '車站到樓門', href: '#access', dataEvent: 'kyotofushimiinari_hero_access', platform: 'article' },
            { label: '千本鳥居路線', href: '#route', dataEvent: 'kyotofushimiinari_hero_route', platform: 'article' },
            { label: '時間怎麼抓', href: '#time', dataEvent: 'kyotofushimiinari_hero_time', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="伏見稻荷大社快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">最方便交通</span>
              <strong>JR 稻荷站</strong>
              <p>從京都站搭 JR 奈良線約 2 站、5 分鐘；出站即接表參道。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">基本順序</span>
              <strong>樓門 → 本殿</strong>
              <p>先完成參拜，再往玉山稻荷社與千本鳥居方向走。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">短版環線</span>
              <strong>三ツ辻折返</strong>
              <p>沿另一側山道下行回到玉山稻荷社附近，不必攻頂。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">建議停留</span>
              <strong>1～1.5 小時</strong>
              <p>包含參拜、拍照與短版環線；人潮多時再多留彈性。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="JR稻荷站到伏見稻荷大社樓門">
          <h2 className="seo-h2">第一段：JR 稻荷站 → 表參道 → 樓門</h2>
          <div className="seo-prose">
            <p><strong>第一次來最簡單就是搭 JR 到稻荷站。</strong> 伏見稻荷大社官網標示，JR 奈良線稻荷站就在大社旁；從京都站出發約 2 站、5 分鐘。出站後不要繞進旁邊巷子，直接沿表參道往前走，就會看到朱紅色樓門。</p>
            <ol>
              <li>從 JR 稻荷站出站。</li>
              <li>正面接上表參道，沿主路直走。</li>
              <li>抵達樓門後穿過門樓，進入主要參拜區。</li>
            </ol>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-fushimi-inari/station-to-romon.png"
                alt="JR稻荷站沿表參道前往伏見稻荷大社樓門的步行路線圖"
                width={605}
                height={1078}
                sizes="(max-width: 820px) 100vw, 620px"
                priority
              />
              <figcaption>從 JR 稻荷站出站後走表參道，第一個清楚目標就是樓門。</figcaption>
            </figure>
            <p>若你的動線比較適合京阪，也可從京阪本線伏見稻荷站向東步行約 5 分鐘。周邊停車位容易擁擠，官方同樣建議優先使用大眾運輸。出發前可查看 <a href={OFFICIAL_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotofushimiinari_official_access" data-platform="Fushimi Inari Taisha" data-section="article_link">伏見稻荷大社交通資訊</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="route" aria-label="伏見稻荷大社本殿與千本鳥居路線">
          <h2 className="seo-h2">第二段：樓門 → 本殿 → 玉山稻荷社 → 千本鳥居</h2>
          <div className="seo-prose">
            <p>穿過樓門後先到本殿參拜，再往山側移動。沿途會經過玉山稻荷社，依現場指標轉往千本鳥居方向。鳥居之後還會接到奧社奉拜所與更多山道，所以只想拍經典畫面的人，不必把「走到山頂」當成必要條件。</p>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-fushimi-inari/romon-honden-tamayama.png"
                alt="伏見稻荷大社從樓門經本殿前往玉山稻荷社的路線圖"
                width={605}
                height={1078}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>主要參拜順序：樓門 → 本殿 → 玉山稻荷社，再接千本鳥居方向。</figcaption>
            </figure>

            <h3 className="seo-h3">先看境內總圖，別把千本鳥居和攻頂混在一起</h3>
            <p>樓門、本殿與千本鳥居屬於山腳到前段動線；稻荷山的參拜道還會繼續往更高處延伸。官網表示，現在整座山的參拜道約有一萬座大小鳥居，而「千本鳥居」是其中最知名、最密集的一段。</p>
            <figure className="seo-figure">
              <Image
                src="/assets/kyoto-fushimi-inari/precinct-map.png"
                alt="伏見稻荷大社境內導覽圖，標示樓門、本殿、玉山稻荷社、千本鳥居與奧社奉拜所"
                width={1536}
                height={871}
                sizes="(max-width: 820px) 100vw, 920px"
              />
              <figcaption>境內總圖可先確認樓門、本殿、玉山稻荷社、千本鳥居與奧社奉拜所的相對位置。</figcaption>
            </figure>
            <p>千本鳥居不是單純的拍照裝置。大社官網說明，自江戶時代起，參拜者以奉納鳥居表達祈願與感謝，才形成今天的景觀。想了解各參拜點位置與鳥居由來，可查看 <a href={OFFICIAL_MAP_URL} target="_blank" rel="noopener noreferrer" data-event="kyotofushimiinari_official_map" data-platform="Fushimi Inari Taisha" data-section="article_link">伏見稻荷大社境內地圖</a>與<a href={OFFICIAL_SENBON_TORII_URL} target="_blank" rel="noopener noreferrer" data-event="kyotofushimiinari_official_torii" data-platform="Fushimi Inari Taisha" data-section="article_link">千本鳥居官方介紹</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="time" aria-label="伏見稻荷千本鳥居三ツ辻環線與所需時間">
          <h2 className="seo-h2">第三段：千本鳥居 → 三ツ辻 → 另一側下山</h2>
          <div className="seo-prose">
            <p>想比一般觀光客多走一段，又不想攻頂，可以把<strong>三ツ辻</strong>當作折返點。你提供的路線由玉山稻荷社附近進入山道，沿鳥居與小神社往上，約 30 分鐘抵達圖上標示的三岔路，再從另一側路線往下；回到本殿附近再抓約 30 分鐘。</p>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-fushimi-inari/senbon-torii-loop.png"
                alt="伏見稻荷大社從玉山稻荷社到三ツ辻再繞回的千本鳥居短版環線圖"
                width={605}
                height={1078}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>短版環線：由玉山稻荷社附近往上到三ツ辻，再沿另一側山道下行。</figcaption>
            </figure>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>走法</th>
                    <th>建議時間</th>
                    <th>適合誰</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>樓門＋本殿＋千本鳥居前段</strong></td>
                    <td>約 30～60 分鐘</td>
                    <td>第一次來、重點參拜與拍照</td>
                  </tr>
                  <tr>
                    <td><strong>延伸到三ツ辻再繞回</strong></td>
                    <td>約 1～1.5 小時</td>
                    <td>想看更多鳥居、小神社與山林路線</td>
                  </tr>
                  <tr>
                    <td><strong>繼續往稻荷山上走</strong></td>
                    <td>另留更完整時段</td>
                    <td>體力足、穿好走鞋，並願意走較多階梯</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>表格時間是行程抓法，不是固定步行紀錄。人潮、停留拍照、參拜與個人體力都會改變實際時間；抵達三ツ辻時若已經疲累，就依圖上環線下山，不要臨時再往更高處硬走。</p>
          </div>
        </section>

        <section className="seo-content" id="tips" aria-label="伏見稻荷大社參拜與拍照提醒">
          <h2 className="seo-h2">出發前記住 5 件事</h2>
          <div className="seo-prose">
            <ul>
              <li><strong>早一點去：</strong>熱門時段的樓門與千本鳥居前段最容易塞住，早上通常比較容易照自己的節奏走。</li>
              <li><strong>三ツ辻不是山頂：</strong>本文是短版環線；如果繼續往上，所需體力與時間都會增加。</li>
              <li><strong>穿好走的鞋：</strong>前段看似平緩，延伸路線會遇到階梯、坡道與較長山徑。</li>
              <li><strong>狹窄處別停太久：</strong>官網禁止因拍照阻礙參拜者通行，也不能攀爬或損傷鳥居、建物與樹木。</li>
              <li><strong>先查當天人潮：</strong>京都官方的<a href={KYOTO_CONGESTION_URL} target="_blank" rel="noopener noreferrer" data-event="kyotofushimiinari_congestion" data-platform="Kyoto Travel" data-section="article_link">伏見地區壅塞預測</a>可查看不同時段的擁擠程度；完整規範則以<a href={OFFICIAL_VISITOR_RULES_URL} target="_blank" rel="noopener noreferrer" data-event="kyotofushimiinari_visitor_rules" data-platform="Fushimi Inari Taisha" data-section="article_link">大社參拜提醒</a>為準。</li>
            </ul>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          intro="伏見稻荷適合安排在早上，再依住宿位置接京都站、市中心或宇治方向；先用分區攻略確認路線，可以少很多來回移動。"
          links={[
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyotofushimiinari_related_areas', platform: 'internal' },
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyotofushimiinari_related_spots', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyotofushimiinari_related_map', platform: 'internal' },
            { label: '京都奈良交通整理', href: '/kyoto-nara/transport', event: 'kyotofushimiinari_related_transport', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="伏見稻荷大社千本鳥居常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
