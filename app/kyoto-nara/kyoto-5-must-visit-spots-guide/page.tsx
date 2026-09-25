import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoFiveMustVisitGuideCanonical,
  kyotoFiveMustVisitGuideDescription,
  kyotoFiveMustVisitGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const KYOTO_CONGESTION_URL = 'https://global.kyoto.travel/en/comfort/'

const spots = [
  {
    number: '01',
    name: '二條城',
    area: '市中心・二條城',
    highlight: '德川家康於 1603 年興建的城郭；二之丸御殿、唐門、庭園是第一次來最值得看的重點。',
    planning: '適合和錦市場、烏丸或四條河原町排同一天，別和嵐山、東山硬湊成一日。',
  },
  {
    number: '02',
    name: '金閣寺',
    area: '京都西北',
    highlight: '正式名稱為鹿苑寺；金色舍利殿倒映在鏡湖池，是京都最具代表性的景色之一。',
    planning: '從市中心過來要預留交通時間；可單獨排北側半日，或再接龍安寺、仁和寺。',
  },
  {
    number: '03',
    name: '伏見稻荷大社',
    area: '京都南側・伏見',
    highlight: '千本鳥居沿稻荷山延伸；一座座朱紅鳥居是人們奉納祈願與感謝的象徵。',
    planning: '最適合一早前往。想拍鳥居走到奧社一帶即可；不必為了登頂把全日行程打亂。',
  },
  {
    number: '04',
    name: '清水寺',
    area: '東山・祇園',
    highlight: '可看清水舞台與京都市景，再一路接二年坂、三年坂、法觀寺八坂之塔。',
    planning: '這一帶靠步行最有味道，建議清晨進寺、傍晚再往八坂神社與祇園方向慢慢走。',
  },
  {
    number: '05',
    name: '下鴨神社',
    area: '京都北側',
    highlight: '位在鴨川與高野川交會處，穿過糺之森參道進境內，比熱門寺社多一份安靜感。',
    planning: '適合與北側行程安排；若還想去金閣寺，請以電車或公車銜接，不是步行順路。',
  },
]

const faqItems = [
  {
    q: '第一次去京都，這 5 個景點一天跑得完嗎？',
    a: '不建議。金閣寺在西北、伏見稻荷在南側、清水寺在東山，跨區移動很花時間。至少分成兩天：清水寺搭配東山散步；伏見稻荷排早上，再把市中心或二條城放到同一天。金閣寺、下鴨神社則依住宿位置另排北側行程。',
  },
  {
    q: '伏見稻荷大社一定要走到山頂嗎？',
    a: '不一定。第一次來以本殿、千本鳥居與奧社附近為主就能感受重點；想健行、時間充裕再繼續往稻荷山走。不要為了登頂壓縮清水寺或其他區域的停留時間。',
  },
  {
    q: '清水寺可以和金閣寺排同一天嗎？',
    a: '可以但不推薦作為第一次京都的標準走法。兩地分別在東側與西北側，熱門時段公車常塞；想兩邊都去，最好早上先選一邊，並保留足夠轉乘與排隊時間。',
  },
  {
    q: '京都熱門景點怎麼避開人潮？',
    a: '先用京都官方的人潮預測看清水寺、伏見稻荷、錦市場與嵐山的時段，再把寺社放在早上、商店街留給中午後。交通則以電車與地下鐵處理跨區，最後一段才接公車或步行。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoFiveMustVisitGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoFiveMustVisitGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoFiveMustVisitGuideCanonical,
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

type KyotoFiveMustVisitGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoFiveMustVisitGuidePage({ searchParams }: KyotoFiveMustVisitGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyoto5spots" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・景點攻略"
          h1="京都自由行｜5 個必去景點：第一次京都先這樣排"
          intro="二條城看將軍時代的城郭、金閣寺看鏡湖池倒影、伏見稻荷走千本鳥居、清水寺一路逛東山老街，最後把下鴨神社留給想感受安靜京都的人。重點不是一天全跑完，而是依區域分天玩。"
          eventPrefix="kyoto5spots"
          showVisual={false}
          ctaLinks={[
            { label: '5 個景點重點', href: '#spots', dataEvent: 'kyoto5spots_hero_spots', platform: 'article' },
            { label: '怎麼分天', href: '#plan', dataEvent: 'kyoto5spots_hero_plan', platform: 'article' },
            { label: '京都地圖', href: '/osaka/map', dataEvent: 'kyoto5spots_hero_map', platform: 'map' },
          ]}
        />

        <section className="seo-content" aria-label="京都五個必去景點快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">市中心歷史</span>
              <strong>二條城</strong>
              <p>二之丸御殿與庭園，一次看懂德川將軍在京都的權力象徵。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">京都代表畫面</span>
              <strong>金閣寺、千本鳥居</strong>
              <p>一個在西北、一個在南側，請分區安排，不要來回折返。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">東山散步</span>
              <strong>清水寺一路走到祇園</strong>
              <p>二年坂、三年坂與八坂之塔都在步行圈，最適合留半天以上。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">安靜一站</span>
              <strong>下鴨神社</strong>
              <p>把森林參道留進行程，平衡熱門景點的人潮與節奏。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="spots" aria-label="京都五個必去景點">
          <h2 className="seo-h2">第一次京都必排的 5 個經典景點</h2>
          <div className="seo-prose">
            <p>這五個景點代表不同京都：城郭、禪寺、神社、東山町家與森林參道。它們分散在市中心、西北、南側、東側與北側；把「想看什麼」和「在哪一區」一起看，才不會把寶貴時間都花在轉車上。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>景點</th>
                    <th>位置</th>
                    <th>第一次去看什麼</th>
                    <th>安排提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {spots.map((spot) => (
                    <tr key={spot.name}>
                      <td><strong>{spot.number}｜{spot.name}</strong></td>
                      <td>{spot.area}</td>
                      <td>{spot.highlight}</td>
                      <td>{spot.planning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">二條城：把「城堡」排成市中心半日</h3>
            <p>二條城由德川家康興建，最值得看的不只是城牆，而是二之丸御殿內的空間、裝飾與庭園。它比東山、嵐山更適合和錦市場或市中心散步搭配；下雨天也比純戶外景點好安排。</p>

            <h3 className="seo-h3">金閣寺：不是只拍金色外觀</h3>
            <p>金閣寺的舍利殿與鏡湖池倒影是經典構圖，但北側位置較獨立。想走得舒服，讓它成為北側半日的主角；若同日再接龍安寺或仁和寺，會比跨到東山、伏見更順。</p>

            <h3 className="seo-h3">伏見稻荷大社：千本鳥居留給清晨</h3>
            <p>伏見稻荷的重點是鳥居沿山徑延伸的步行感。早上先到本殿，再穿過千本鳥居往奧社方向走，已足夠感受精華；時間與體力都夠才繼續上山。請勿攀爬、塗寫或破壞鳥居與境內設施。</p>

            <h3 className="seo-h3">清水寺：寺院、坡道與八坂之塔要一起看</h3>
            <p>清水寺本身可看清水舞台與京都市景，離開後不要急著搭車：二年坂、三年坂、寧寧之道與法觀寺八坂之塔才是東山最完整的散步段。熱門時段人潮集中，早進清水寺、再慢慢往祇園方向走會比較舒服。</p>

            <h3 className="seo-h3">下鴨神社：在糺之森裡留一段安靜時間</h3>
            <p>下鴨神社的魅力不是趕著集點，而是沿糺之森的參道慢慢走進境內。它適合放在行程較鬆的一天，或與北側景點搭配；若時間有限，也值得只留一小段森林散步，而不是完全跳過。</p>
          </div>
        </section>

        <section className="seo-content" id="plan" aria-label="京都五個必去景點行程安排">
          <h2 className="seo-h2">不要一天跑 5 個：用兩到三天拆開才順</h2>
          <div className="seo-prose">
            <p><strong>兩天版本：</strong>第一天走清水寺、二年坂三年坂、八坂神社與祇園；第二天一早伏見稻荷，再接二條城或錦市場。金閣寺與下鴨神社可依喜好替換其中一段。</p>
            <p><strong>三天版本：</strong>東山・祇園一天、伏見稻荷加市中心一天、金閣寺與下鴨神社各擇一或安排北側一天。這種排法比「景點數量最多」更能留出吃飯、休息與迷路緩衝。</p>
            <p>京都官方提供人潮預測與即時資訊；出門前可先看 <a href={KYOTO_CONGESTION_URL} target="_blank" rel="noopener noreferrer" data-event="kyoto5spots_congestion" data-platform="Kyoto Travel" data-section="article_link">京都官方人潮預測</a>，再決定清水寺、伏見稻荷或錦市場要排早上還是下午。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          links={[
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyoto5spots_related_areas', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyoto5spots_related_map', platform: 'internal' },
            { label: '京都奈良通訊／交通', href: '/kyoto-nara/transport', event: 'kyoto5spots_related_transport', platform: 'internal' },
            { label: '京都住宿推薦', href: '/kyoto-nara/hotel', event: 'kyoto5spots_related_hotel', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="京都 5 個必去景點常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
