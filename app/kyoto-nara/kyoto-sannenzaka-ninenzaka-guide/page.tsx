import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoSannenzakaNinenzakaGuideCanonical,
  kyotoSannenzakaNinenzakaGuideDescription,
  kyotoSannenzakaNinenzakaGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const KYOTO_HIGASHIYAMA_ROUTE_URL = 'https://kyoto.travel/en/itineraries/higashiyama-at-dawn/'
const KYOTO_ACCESS_URL =
  'https://kyoto.travel/en/travel-inspiration/how-to-avoid-the-crowds-while-accessing-kiyomizu-temple-and-higashiyama-areas/'
const KYOTO_PRESERVATION_URL = 'https://www.city.kyoto.lg.jp/tokei/page/0000281761.html'
const SANNENZAKA_HISTORY_URL = 'https://ja.kyoto.travel/komafuda/show.php?id=2239&lang=en'
const STARBUCKS_NINENZAKA_URL = 'https://store.starbucks.co.jp/detail-1476/'

const faqItems = [
  {
    q: '三年坂、二年坂和一年坂要走多久？',
    a: '從清水寺沿清水坂、三年坂、二年坂走到一年坂，單純步行約 30～45 分鐘；若要拍照、吃東西和逛店，建議抓 1～2 小時。再加入八坂塔、高台寺與八坂神社，可安排半天。',
  },
  {
    q: '三年坂、二年坂和一年坂需要門票嗎？',
    a: '不用，三段都是一般街道，可自由散步。沿途寺院、庭園、展覽或個別設施可能另外收費，商店營業時間也各自不同。',
  },
  {
    q: '從清水寺走下來，正確順序是什麼？',
    a: '最順的下山路線是清水寺 → 清水坂 → 三年坂（產寧坂）→ 二年坂（二寧坂）→ 一年坂（一念坂）。之後可接高台寺、寧寧之道和八坂神社。',
  },
  {
    q: '幾點去三年坂、二年坂比較好拍？',
    a: '想拍安靜街景可在清晨前往，但多數商店與咖啡廳尚未營業；想邊逛邊吃則安排上午稍晚到下午。熱門時段請不要使用腳架、擋住道路或影響居民。',
  },
  {
    q: '可以推嬰兒車或拖行李走三年坂嗎？',
    a: '不建議拖大型行李，三年坂有石階，整段也有坡道與石板路。嬰兒車可走部分路段，但遇到階梯需要繞路或抬行；雨天石板較滑，更要穿防滑好走的鞋。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoSannenzakaNinenzakaGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoSannenzakaNinenzakaGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoSannenzakaNinenzakaGuideCanonical,
  image: [
    `${SITE_URL}/assets/kyoto-higashiyama-slopes/kiyomizuzaka-sannenzaka-ninenzaka-route.png`,
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

type KyotoSannenzakaNinenzakaGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoSannenzakaNinenzakaGuidePage({
  searchParams,
}: KyotoSannenzakaNinenzakaGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotohigashiyamaslopes" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・東山散步攻略"
          h1="三年坂、二年坂、一年坂｜清水寺下山順路攻略"
          intro="第一次走京都東山，最簡單就是從清水寺一路下山：清水坂接三年坂、二年坂與一年坂，再依時間延伸八坂塔、高台寺和八坂神社。這篇把名稱、位置、順路走法與人潮提醒一次整理好。"
          eventPrefix="kyotohigashiyamaslopes"
          showVisual={false}
          ctaLinks={[
            { label: '散步路線', href: '#route', dataEvent: 'kyotohigashiyamaslopes_hero_route', platform: 'article' },
            { label: '四段重點', href: '#street-guide', dataEvent: 'kyotohigashiyamaslopes_hero_streets', platform: 'article' },
            { label: '附近景點', href: '#nearby', dataEvent: 'kyotohigashiyamaslopes_hero_nearby', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="三年坂二年坂一年坂攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">推薦順序</span>
              <strong>從清水寺一路下山</strong>
              <p>清水坂 → 三年坂 → 二年坂 → 一年坂。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">建議停留</span>
              <strong>約 1～2 小時</strong>
              <p>只走路較快；拍照、逛店與吃東西要多留時間。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">街道門票</span>
              <strong>免費散步</strong>
              <p>寺院、庭園或個別設施可能另外收費。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最佳時段</span>
              <strong>清晨拍照最舒服</strong>
              <p>但店家多半未開，想逛店可安排上午稍晚。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="route" aria-label="京都東山推薦散步路線">
          <h2 className="seo-h2">推薦路線：清水寺 → 清水坂 → 三年坂 → 二年坂 → 一年坂</h2>
          <div className="seo-prose">
            <p>從清水寺參拜結束後，沿主要參道清水坂下山，在岔路轉入三年坂，再依序接二年坂與一年坂。這條路線一路向下，第一次來最容易理解，也能把熱鬧商店街、石板階梯與較安靜的町家小路一次走完。</p>
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/kyoto-higashiyama-slopes/kiyomizuzaka-sannenzaka-ninenzaka-route.png"
                alt="京都東山散步地圖，標示清水寺、清水坂、三年坂、二年坂、一年坂、八坂庚申堂與法觀寺的位置和路線"
                width={606}
                height={1078}
                sizes="(max-width: 820px) 100vw, 606px"
              />
              <figcaption>從清水寺沿清水坂下山，依序轉進三年坂、二年坂與一年坂；途中可繞去八坂庚申堂與法觀寺。</figcaption>
            </figure>
            <p>京都官方也把清水寺、三年坂與二年坂列為東山經典步行路線，並提醒這一帶同時是居民生活的街區，拍照時不要架腳架、堵住道路或進入私人空間。可參考<a href={KYOTO_HIGASHIYAMA_ROUTE_URL} target="_blank" rel="noopener noreferrer" data-event="kyotohigashiyamaslopes_official_route" data-platform="Kyoto Travel" data-section="article_link">京都官方東山清晨散步路線</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="street-guide" aria-label="清水坂三年坂二年坂一年坂重點">
          <h2 className="seo-h2">四段街道怎麼分？先認清名稱與特色</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">① 清水坂｜清水寺正前方最熱鬧的參道</h3>
            <p>從清水寺仁王門往下走就是清水坂，兩側集中了伴手禮、小吃、陶瓷與紀念品店。這段通常是全程人潮最多的地方；下山時注意右側轉入三年坂的岔路，不要一路直走回到公車站才發現錯過。</p>

            <h3 className="seo-h3">② 三年坂（產寧坂）｜石板階梯與町家街景</h3>
            <p>三年坂正式常見名稱為<strong>產寧坂</strong>，日文寫作「産寧坂」，也可見三寧坂、再念坂等歷史稱呼。石板階梯與彎曲坡道兩側保留傳統町家，是東山最具代表性的街景之一。名稱由來有多種說法，京都官方資料提到它也和清水寺境內祈求安產的子安塔信仰有關；不必把「跌倒會倒楣」的民間傳說當成真正禁忌，專心看路即可。想了解名稱沿革可看<a href={SANNENZAKA_HISTORY_URL} target="_blank" rel="noopener noreferrer" data-event="kyotohigashiyamaslopes_sannenzaka_history" data-platform="Kyoto Travel" data-section="article_link">京都官方三年坂歷史介紹</a>。</p>

            <h3 className="seo-h3">③ 二年坂（二寧坂）｜老街、甜點與榻榻米星巴克</h3>
            <p>三年坂階梯下方接著就是二年坂，正式也常寫作<strong>二寧坂</strong>。相較三年坂的階梯感，這段更像一條完整的傳統商店街，沿路有咖啡廳、甜點與伴手禮店。知名的「京都二寧坂 Yasaka Chaya 星巴克」使用百年以上日式建築，內有榻榻米座位；營業時間與入場管制請查<a href={STARBUCKS_NINENZAKA_URL} target="_blank" rel="noopener noreferrer" data-event="kyotohigashiyamaslopes_starbucks" data-platform="Starbucks" data-section="article_link">星巴克官方門市頁</a>，不要在門口排隊阻礙通行。</p>

            <h3 className="seo-h3">④ 一年坂（一念坂）｜較安靜的町家小路</h3>
            <p>一年坂也常寫作<strong>一念坂</strong>，位在二年坂北側，連接高台寺、寧寧之道方向。它不像三年坂、二年坂那麼長，店家與人潮也較少，適合在熱鬧街區後放慢腳步拍町家街景。若後續要去高台寺或八坂神社，從這裡繼續往北最順。</p>

            <p>京都市將產寧坂、二年坂的石階、石板路與周邊傳統建築視為歷史街區的重要構成，保存範圍也包括八坂塔、高台寺與石塀小路一帶。想看街區保存背景，可閱讀<a href={KYOTO_PRESERVATION_URL} target="_blank" rel="noopener noreferrer" data-event="kyotohigashiyamaslopes_preservation" data-platform="Kyoto City" data-section="article_link">京都市產寧坂傳統建築群保存計畫</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="nearby" aria-label="三年坂二年坂附近景點">
          <h2 className="seo-h2">附近景點怎麼接？八坂塔、庚申堂、高台寺到八坂神社</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>景點</th>
                    <th>位置與看點</th>
                    <th>怎麼安排</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>法觀寺（八坂塔）</strong></td>
                    <td>東山最經典的五重塔街景</td>
                    <td>三年坂與二年坂中途往西繞去</td>
                  </tr>
                  <tr>
                    <td><strong>八坂庚申堂</strong></td>
                    <td>以色彩繽紛的「くくり猿」祈願物聞名</td>
                    <td>和八坂塔相鄰，可一起停留</td>
                  </tr>
                  <tr>
                    <td><strong>高台寺</strong></td>
                    <td>庭園、歷史建築與季節夜間參拜</td>
                    <td>一年坂後往北接續</td>
                  </tr>
                  <tr>
                    <td><strong>八坂神社</strong></td>
                    <td>祇園代表神社，可再接花見小路與四條河原町</td>
                    <td>高台寺、寧寧之道後繼續往北</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p><strong>半日順路版：</strong>清水寺 → 清水坂 → 三年坂 → 八坂塔、八坂庚申堂 → 二年坂 → 一年坂 → 高台寺 → 八坂神社。只想拍老街則走到一年坂即可；想一路逛到祇園，建議整段至少保留 3～4 小時。</p>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="東山散步交通與反向路線">
          <h2 className="seo-h2">從哪裡開始？第一次建議清水寺進、祇園出</h2>
          <div className="seo-prose">
            <p><strong>順向走：</strong>先到清水寺，參拜後一路下坡走到祇園，動線最直覺。可搭公車到五條坂或清水道，再步行上山；若擔心塞車，也可搭京阪到清水五條站後步行。</p>
            <p><strong>反向走：</strong>從京阪祇園四條站、阪急京都河原町站或地下鐵東山站出發，經八坂神社、高台寺、一年坂、二年坂、三年坂走上清水寺。這條路較多上坡，但早上可先走較安靜的祇園與東山，再於稍晚抵達清水寺。</p>
            <p>京都官方建議熱門季節別只依賴京都站直達公車，鐵路加步行通常較能掌握時間；可參考<a href={KYOTO_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotohigashiyamaslopes_official_access" data-platform="Kyoto Travel" data-section="article_link">京都官方清水寺、東山避開擁擠交通指南</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="tips" aria-label="東山散步提醒">
          <h2 className="seo-h2">旅杰提醒：清晨好拍，白天才適合逛店</h2>
          <div className="seo-prose">
            <ul>
              <li><strong>想拍空景：</strong>清晨人較少，但咖啡廳、甜點與伴手禮店多半尚未營業。</li>
              <li><strong>想逛店吃東西：</strong>上午稍晚到下午選擇最多，也要接受人潮明顯增加。</li>
              <li><strong>鞋子很重要：</strong>沿路是坡道、石階與石板路，雨天容易滑，請穿防滑好走的鞋。</li>
              <li><strong>不要帶大行李：</strong>階梯與人潮都不適合拖行李，先寄放在車站或送到飯店。</li>
              <li><strong>尊重居民：</strong>不要架腳架、占據道路、進入私人空間或大聲喧嘩。</li>
            </ul>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都東山行程"
          intro="先看清水寺境內路線，再把三年坂、二年坂與祇園排成同一區；若還要搭配伏見稻荷或嵐山，建議分天安排。"
          links={[
            { label: '清水寺完整攻略', href: '/kyoto-nara/kyoto-kiyomizudera-guide', event: 'kyotohigashiyamaslopes_related_kiyomizudera', platform: 'internal' },
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyotohigashiyamaslopes_related_areas', platform: 'internal' },
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyotohigashiyamaslopes_related_spots', platform: 'internal' },
            { label: '伏見稻荷千本鳥居攻略', href: '/kyoto-nara/kyoto-fushimi-inari-guide', event: 'kyotohigashiyamaslopes_related_fushimiinari', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyotohigashiyamaslopes_related_map', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="三年坂、二年坂、一年坂常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
