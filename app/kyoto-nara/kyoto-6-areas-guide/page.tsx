import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoSixAreasGuideCanonical,
  kyotoSixAreasGuideDescription,
  kyotoSixAreasGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const KYOTO_TRANSPORT_URL = 'https://kyoto.travel/en/getting-around/'

const areas = [
  {
    zone: '內圍 01',
    name: '伏見稻荷',
    direction: '京都站南側',
    highlights: '伏見稻荷大社、千本鳥居',
    planning: '早上先走鳥居；中午後再回京都站、市中心或宇治方向。',
  },
  {
    zone: '內圍 02',
    name: '清水寺＆八坂神社',
    direction: '京都站東側・東山',
    highlights: '清水舞台、二年坂、三年坂、八坂神社、祇園',
    planning: '一整天以步行為主，不要再加金閣寺或嵐山。',
  },
  {
    zone: '內圍 03',
    name: '錦市場＆二條城',
    direction: '京都市中心',
    highlights: '錦市場、寺町・新京極、二條城',
    planning: '適合抵達日、雨天或想逛街吃飯的一天。',
  },
  {
    zone: '外圍 01',
    name: '銀閣寺＆平安神宮',
    direction: '京都東北・岡崎',
    highlights: '銀閣寺、哲學之道、南禪寺、平安神宮',
    planning: '沿東側慢慢走最有感；景點間有距離，別只看地圖直線。',
  },
  {
    zone: '外圍 02',
    name: '金閣寺＆下鴨神社',
    direction: '京都北側',
    highlights: '金閣寺、下鴨神社、糺之森',
    planning: '同屬北側，但不是步行連線；以公車、計程車或住宿位置決定是否同日。',
  },
  {
    zone: '外圍 03',
    name: '嵯峨嵐山',
    direction: '京都西側',
    highlights: '竹林小徑、渡月橋、天龍寺',
    planning: '至少留半天；想搭小火車或保津川遊船就獨立排一天。',
  },
]

const faqItems = [
  {
    q: '京都 6 大區域可以一天各跑一點嗎？',
    a: '不建議。這六區是用來避免東西來回跑的規劃分法，不是必須一天集滿。第一次京都最穩的是一天東山、一天嵐山、一天伏見加市中心；北側或東北側則依天數與興趣加入。',
  },
  {
    q: '金閣寺和下鴨神社真的能排同一天嗎？',
    a: '可以，但它們不是步行順路。兩地同屬京都北側，仍要靠公車、計程車或轉乘銜接；如果不想把時間花在等車，建議當天只選一個作主景點，再搭配附近街區。',
  },
  {
    q: '第一次去京都排幾天最好？',
    a: '市區經典至少 2 到 3 天最舒服。三天可分給東山・祇園、嵯峨嵐山、伏見加市中心；想再加銀閣寺、平安神宮、金閣寺或下鴨神社，排到 4 天以上會更從容。',
  },
  {
    q: '京都移動要一直搭公車嗎？',
    a: '不用。京都官方也建議搭配電車、地下鐵與公車；跨區先用鐵路避開塞車，接近景點再走路或搭短程公車，通常比全程等公車更好掌握。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoSixAreasGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoSixAreasGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoSixAreasGuideCanonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/og-share.png` },
  },
  image: `${SITE_URL}/assets/kyoto-guides/kyoto-six-areas-map.png`,
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

type KyotoSixAreasGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoSixAreasGuidePage({ searchParams }: KyotoSixAreasGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyoto6areas" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・分區攻略"
          h1="京都自由行｜6 大區域攻略：先分區，再排行程"
          intro="京都景點很多，但以京都車站為中心，先分成 3 個內圍區與 3 個外圍區，行程會好排很多。一天選一個主區，再加真正順路的小區，別讓一整天都耗在東西來回移動。"
          eventPrefix="kyoto6areas"
          showVisual={false}
          ctaLinks={[
            { label: '6 區位置圖', href: '#area-map', dataEvent: 'kyoto6areas_hero_map', platform: 'article' },
            { label: '各區怎麼排', href: '#areas', dataEvent: 'kyoto6areas_hero_areas', platform: 'article' },
            { label: '3 天安排', href: '#three-days', dataEvent: 'kyoto6areas_hero_three_days', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="京都六大區域快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">先抓中心</span>
              <strong>京都車站</strong>
              <p>抵達、離開與跨區轉車的重要起點；不是每個景點都要從這裡搭公車。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">內圍 3 區</span>
              <strong>伏見、東山、市中心</strong>
              <p>適合第一次京都的核心骨架，依鐵路與步行串成不同天。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">外圍 3 區</span>
              <strong>東北、北側、嵐山</strong>
              <p>距離拉得更開，通常各留半天到一天，不要只當成市中心順路加點。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">排程原則</span>
              <strong>一天一主區</strong>
              <p>先用電車跨區，公車只負責最後一段，避開熱門景點周邊的塞車。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="area-map" aria-label="京都六大區域位置圖">
          <h2 className="seo-h2">京都景點位置圖：以京都車站為中心看 3 內圍、3 外圍</h2>
          <div className="seo-prose">
            <p>這是為自由行安排設計的景點分區，不是行政區劃。先看每個景點落在京都車站的哪一側，再決定同一天要走哪條線；比照人氣清單逐一塞進行程更有效率。</p>
            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kyoto-guides/kyoto-six-areas-map.png"
                alt="京都自由行六大區域地圖，標示京都車站、伏見稻荷、清水寺與八坂神社、錦市場與二條城、銀閣寺與平安神宮、金閣寺與下鴨神社、嵯峨嵐山的位置"
                width={1080}
                height={1920}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>你的京都分區圖：先確認方向，再把相近景點放進同一天。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="areas" aria-label="京都六大區域攻略">
          <h2 className="seo-h2">京都 6 大區域：每一區適合怎麼玩？</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>分區</th>
                    <th>方向</th>
                    <th>主景點</th>
                    <th>行程建議</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => (
                    <tr key={area.name}>
                      <td><strong>{area.zone}｜{area.name}</strong></td>
                      <td>{area.direction}</td>
                      <td>{area.highlights}</td>
                      <td>{area.planning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">內圍第一區｜伏見稻荷</h3>
            <p>伏見稻荷大社最適合安排在早上。從京都站搭 JR 往南很快，走完千本鳥居後可回京都站、接宇治，或留給下午的市中心；不要先跑到西北金閣寺，再折回南邊伏見。</p>

            <h3 className="seo-h3">內圍第二區｜清水寺＆八坂神社</h3>
            <p>清水寺、二年坂、三年坂、八坂神社與祇園是一條東山步行線。先選一個靠近的下車點，再一路走下去，比每站都回京都車站搭公車更順。這區人多、坡道多，請預留休息與拍照時間。</p>

            <h3 className="seo-h3">內圍第三區｜錦市場＆二條城</h3>
            <p>錦市場是吃吃喝喝與買伴手禮的市中心核心，二條城則是看城郭與將軍文化。兩者適合放在抵達日、雨天，或東山、伏見以外想輕鬆一點的一天；先確認開放日與最後入場時間即可。</p>

            <h3 className="seo-h3">外圍第一區｜銀閣寺＆平安神宮</h3>
            <p>東北與岡崎一帶適合慢慢走：銀閣寺可接哲學之道、南禪寺，平安神宮則和岡崎公園、美術館方向相近。不要只因為地圖看起來在同一側，就把所有東側景點塞進半天。</p>

            <h3 className="seo-h3">外圍第二區｜金閣寺＆下鴨神社</h3>
            <p>兩者都在京都北側，但不是一出站就能連著走的關係。金閣寺偏西、下鴨神社偏東；若想同日安排，請先依飯店位置與當日交通查路線，或挑一個做主景點、另一個作彈性備案。</p>

            <h3 className="seo-h3">外圍第三區｜嵯峨嵐山</h3>
            <p>嵐山要把竹林小徑、渡月橋與天龍寺放在同一段。若還想搭嵯峨野觀光小火車、保津川遊船或往大覺寺、祇王寺延伸，直接留完整一天；不要下午才從清水寺趕過去。</p>
          </div>
        </section>

        <section className="seo-content" id="three-days" aria-label="京都三天行程分區安排">
          <h2 className="seo-h2">第一次京都 3 天，最簡單的分區骨架</h2>
          <div className="seo-prose">
            <ol>
              <li><strong>Day 1｜清水寺＆八坂神社：</strong>清晨清水寺，接二年坂、三年坂、八坂之塔與八坂神社，傍晚留給祇園或河原町。</li>
              <li><strong>Day 2｜伏見稻荷＋市中心：</strong>早上千本鳥居，下午二條城、錦市場或四條河原町；景點順序依你住京都站、河原町或大阪而調整。</li>
              <li><strong>Day 3｜嵯峨嵐山：</strong>早出發走竹林、天龍寺與渡月橋；若不去嵐山，可改成銀閣寺・平安神宮，或金閣寺・下鴨神社的北側版本。</li>
            </ol>
            <p>京都官方建議搭配鐵路與公車移動，並提供 <a href={KYOTO_TRANSPORT_URL} target="_blank" rel="noopener noreferrer" data-event="kyoto6areas_official_transport" data-platform="Kyoto Travel" data-section="article_link">京都官方交通指引</a>。熱門時段跨區時，先搭 JR、私鐵或地下鐵，再用公車完成最後一段，通常更好掌握時間。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          links={[
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyoto6areas_related_spots', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyoto6areas_related_map', platform: 'internal' },
            { label: '京都奈良通訊／交通', href: '/kyoto-nara/transport', event: 'kyoto6areas_related_transport', platform: 'internal' },
            { label: '京都住宿推薦', href: '/kyoto-nara/hotel', event: 'kyoto6areas_related_hotel', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="京都 6 大區域攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
