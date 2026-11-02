import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoKinkakujiGuideCanonical,
  kyotoKinkakujiGuideDescription,
  kyotoKinkakujiGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const OFFICIAL_ABOUT_URL = 'https://www.shokoku-ji.jp/kinkakuji/about/'
const OFFICIAL_GUIDE_URL = 'https://www.shokoku-ji.jp/kinkakuji/guide/'
const OFFICIAL_ACCESS_URL = 'https://www.shokoku-ji.jp/kinkakuji/access/'
const OFFICIAL_FAQ_URL = 'https://www.shokoku-ji.jp/kinkakuji/faq/'
const OFFICIAL_MAP_PDF_URL =
  'https://www.shokoku-ji.jp/wp-content/themes/shokokuji/assets/img/kinkakuji/access/parkingMap.pdf'
const KYOTO_DESTINATION_URL =
  'https://kyoto.travel/en/destinations/kinkakuji-temple-the-golden-pavilion/'
const KYOTO_ACCESS_URL =
  'https://kyoto.travel/en/getting-around/comfortable-access-to-kinkaku-ji-temple-kinugasa/'

const faqItems = [
  {
    q: '金閣寺建議停留多久？',
    a: '只走主要參拜動線約 45 到 60 分鐘；如果想慢慢拍鏡湖池倒影、看安民澤、夕佳亭與不動堂，建議預留 1 到 1.5 小時。熱門時段還要加上入場與拍照等待時間。',
  },
  {
    q: '金閣寺門票多少？',
    a: '依金閣寺官網現行資訊，高中生以上 500 日圓，小學生與國中生 300 日圓。參拜時間為 09:00～17:00、全年無休；出發前仍建議再查看官網公告。',
  },
  {
    q: '金閣寺需要先預約嗎？',
    a: '一般個人參拜可到現場受付，官方參拜資訊沒有要求一般旅客事先預約。30 人以上團體、減免申請或其他特殊需求，請依官方說明提前確認。',
  },
  {
    q: '從京都站到金閣寺怎麼走比較順？',
    a: '京都市官方較建議先搭地下鐵烏丸線到北大路，再轉市巴士 204 或 205 到金閣寺道；也可搭 JR 嵯峨野線到圓町，再轉 204 或 205。直接從京都站搭巴士雖然轉乘少，但站數多，熱門時段較容易塞車與擁擠。',
  },
  {
    q: '輪椅或嬰兒車可以逛完整個金閣寺嗎？',
    a: '官方表示可在沒有大段差的情況下到達舍利殿金閣旁，但通過金閣後的庭園路段有樓梯，輪椅、行動不便者與嬰兒車需在樓梯前折返，從參拜入口離場。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoKinkakujiGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoKinkakujiGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoKinkakujiGuideCanonical,
  dateModified: '2026-11-02',
  image: [
    `${SITE_URL}/assets/kyoto-kinkakuji/golden-pavilion-close-up.jpg`,
    `${SITE_URL}/assets/kyoto-kinkakuji/precinct-guide-map.png`,
    `${SITE_URL}/assets/kyoto-kinkakuji/grounds-access-map.jpg`,
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

type KyotoKinkakujiGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoKinkakujiGuidePage({ searchParams }: KyotoKinkakujiGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotokinkakuji" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・世界遺產攻略"
          h1="金閣寺｜門票、參觀路線、交通與必看重點"
          intro="金閣寺正式名稱是鹿苑寺，最經典的不只是鏡湖池前的金色舍利殿。沿著境內動線繼續走，還會經過銀河泉、龍門瀑布、安民澤、夕佳亭與不動堂。這篇把交通、門票與順路走法一次整理好。"
          eventPrefix="kyotokinkakuji"
          showVisual={false}
          ctaLinks={[
            { label: '參觀路線', href: '#route', dataEvent: 'kyotokinkakuji_hero_route', platform: 'article' },
            { label: '門票資訊', href: '#visit-info', dataEvent: 'kyotokinkakuji_hero_tickets', platform: 'article' },
            { label: '交通方式', href: '#access', dataEvent: 'kyotokinkakuji_hero_access', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="金閣寺快速重點">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">建議停留</span>
              <strong>約 1～1.5 小時</strong>
              <p>只走主動線約 45～60 分鐘，拍照與熱門時段請多留時間。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">參拜時間</span>
              <strong>09:00～17:00</strong>
              <p>全年無休；臨時調整仍以金閣寺官網與現場公告為準。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">參拜費用</span>
              <strong>成人 500 日圓</strong>
              <p>高中生以上 500 日圓，小學生與國中生 300 日圓。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最近巴士站</span>
              <strong>金閣寺道</strong>
              <p>下車後依指標步行前往，京都站出發建議先搭鐵路再轉巴士。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="about" aria-label="金閣寺介紹">
          <h2 className="seo-h2">金閣寺不是寺名？正式名稱其實是鹿苑寺</h2>
          <div className="seo-prose">
            <p>「金閣寺」是大家熟悉的通稱，正式名稱為<strong>鹿苑寺</strong>，隸屬臨濟宗相國寺派。這片土地原為西園寺家的山莊，室町幕府第三代將軍足利義滿取得後，在 1397 年起營建北山殿；義滿逝世後依其遺願改為禪寺，並取其法號「鹿苑院殿」的兩字命名。</p>
            <p>鏡湖池旁的舍利殿「金閣」是整座寺院最知名的建築。官方介紹指出，第二、三層在漆面貼上純金箔，屋頂立有鳳凰；三層分別融合寢殿造、武家造與中國風禪宗佛殿造。先理解這些細節，現場就不會只拍一張倒影照便離開。</p>
            <p>想進一步讀歷史與建築，可查看<a href={OFFICIAL_ABOUT_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_official_about" data-platform="Kinkakuji" data-section="article_link">金閣寺官方介紹</a>與<a href={KYOTO_DESTINATION_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_kyoto_destination" data-platform="Kyoto Travel" data-section="article_link">京都市官方旅遊指南</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="visit-info" aria-label="金閣寺門票與參拜資訊">
          <h2 className="seo-h2">金閣寺門票、開放時間與付款方式</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <tbody>
                  <tr>
                    <th>參拜時間</th>
                    <td>09:00～17:00</td>
                  </tr>
                  <tr>
                    <th>高中生以上</th>
                    <td>500 日圓</td>
                  </tr>
                  <tr>
                    <th>小學生、國中生</th>
                    <td>300 日圓</td>
                  </tr>
                  <tr>
                    <th>休息日</th>
                    <td>全年無休</td>
                  </tr>
                  <tr>
                    <th>付款方式</th>
                    <td>現金、官方支援的無現金支付；御守、授與品與御朱印除外</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>一般個人參拜直接在現場受付即可。金閣寺官方也提醒沒有團體折扣，30 人以上需以團體方式入場；減免或特殊團體需求則請事先閱讀官方規定。票價與時間可能調整，出發前請再確認<a href={OFFICIAL_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_official_access_info" data-platform="Kinkakuji" data-section="article_link">金閣寺參拜資訊</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="金閣寺交通方式">
          <h2 className="seo-h2">從京都站到金閣寺：先搭鐵路再轉巴士比較穩</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">推薦一｜地下鐵到北大路，再轉 204／205</h3>
            <p>從京都站搭地下鐵烏丸線到<strong>北大路站</strong>，再轉京都市巴士 204 或 205，在<strong>金閣寺道</strong>下車，最後步行約 5 分鐘。這是京都市官方推薦的舒適路線之一，先用地下鐵避開市中心部分塞車路段，抵達時間通常較好掌握。</p>

            <h3 className="seo-h3">推薦二｜JR 到圓町，再轉 204／205</h3>
            <p>如果你持有適用的 JR 票券，也可從京都站搭 JR 嵯峨野線到<strong>圓町站</strong>，再轉 204 或 205 到金閣寺道。想把金閣寺接龍安寺、仁和寺，這個西北側方向也容易理解。</p>

            <h3 className="seo-h3">直接從京都站搭巴士可以嗎？</h3>
            <p>可以，但京都市官方提醒，從京都站直接搭 205 等巴士經過的站數多，也容易受到路況與人潮影響。行李多、尖峰時間或賞楓旺季，不要只看「不用轉車」就選直達巴士；先搭鐵路再轉車，通常比較舒服。</p>
            <p>完整轉乘圖與各起點建議可看<a href={KYOTO_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_kyoto_access" data-platform="Kyoto Travel" data-section="article_link">京都市官方金閣寺交通指引</a>。金閣寺官網列出的停靠路線則包含 12、59、205 與 M1，仍請以當日站牌資訊為準。</p>
          </div>
        </section>

        <section className="seo-content" id="route" aria-label="金閣寺參觀路線">
          <h2 className="seo-h2">金閣寺推薦參觀路線：沿著單向動線一路看完</h2>
          <div className="seo-prose">
            <p><strong>黑門方向 → 總門 → 參拜受付／參拜門 → 鏡湖池與舍利殿金閣 → 銀河泉、巖下水 → 龍門瀑布 → 安民澤、白蛇塚 → 夕佳亭 → 不動堂 → 出口</strong></p>
            <p>金閣寺境內不是看完鏡湖池就原路折返。一般動線會從金閣旁繼續往上，經過泉水、瀑布與池塘，再從夕佳亭、不動堂方向離場。路線不長，但後半段有坡道與樓梯；穿好走的鞋，並依現場標示前進。</p>
            <figure className="seo-figure seo-portrait-figure">
              <a
                href="/assets/kyoto-kinkakuji/precinct-guide-map.png"
                target="_blank"
                rel="noopener noreferrer"
                data-event="kyotokinkakuji_precinct_map_fullsize"
                data-platform="image"
                data-section="article_image"
              >
                <Image
                  src="/assets/kyoto-kinkakuji/precinct-guide-map.png"
                  alt="金閣寺境內簡化案內圖，標示總門、受付、參拜門、鏡湖池、舍利殿金閣、安民澤、白蛇塚、夕佳亭、不動堂、商店、廁所與停車場"
                  width={2481}
                  height={3508}
                  sizes="(max-width: 820px) 100vw, 620px"
                />
              </a>
              <figcaption>先用簡化案內圖掌握金閣寺主要景點與設施位置；手機可點圖放大。</figcaption>
            </figure>
            <figure className="seo-figure">
              <a
                href="/assets/kyoto-kinkakuji/grounds-access-map.jpg"
                target="_blank"
                rel="noopener noreferrer"
                data-event="kyotokinkakuji_map_fullsize"
                data-platform="image"
                data-section="article_image"
              >
                <Image
                  src="/assets/kyoto-kinkakuji/grounds-access-map.jpg"
                  alt="金閣寺境內與停車場導覽圖，標示黑門、總門、參拜門、舍利殿金閣、鏡湖池、銀河泉、龍門瀑布、安民澤、夕佳亭與不動堂"
                  width={3509}
                  height={2216}
                  sizes="(max-width: 820px) 100vw, 1100px"
                  priority
                />
              </a>
              <figcaption>金閣寺境內與周邊導覽圖；手機可點圖開啟高解析版本。圖片來源：<a href={OFFICIAL_MAP_PDF_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_official_map_pdf" data-platform="Kinkakuji" data-section="image_credit">金閣寺官網 PDF</a>。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="highlights" aria-label="金閣寺必看重點">
          <h2 className="seo-h2">金閣寺必看重點：別只停在鏡湖池拍照</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 鏡湖池與舍利殿金閣</h3>
            <p>進入付費參拜區後，第一個核心畫面就是金閣倒映在鏡湖池上。先在正面觀景區看整體構圖，再沿池邊往側面走，能看到不同角度的屋頂鳳凰、島嶼、松樹與水面倒影。熱門時段人多，拍完請往前移動，不要長時間佔住最前排。</p>
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/kyoto-kinkakuji/golden-pavilion-close-up.jpg"
                alt="冬季藍天下從庭園近距離拍攝的金閣舍利殿，可看見金箔外觀、三層建築與屋頂鳳凰"
                width={1728}
                height={3072}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>沿著鏡湖池旁動線前進後，可以從側面近距離觀察舍利殿的三層建築、金箔外牆與屋頂鳳凰。旅杰實際拍攝。</figcaption>
            </figure>

            <h3 className="seo-h3">2. 銀河泉、巖下水與龍門瀑布</h3>
            <p>金閣後方的銀河泉，相傳是足利義滿泡茶取水之處；巖下水則被傳為義滿洗手使用。再往前的龍門瀑布以「鯉躍龍門」故事為題，瀑布下斜放的鯉魚石，正表現鯉魚準備躍起的姿態。</p>

            <h3 className="seo-h3">3. 安民澤與白蛇塚</h3>
            <p>安民澤被樹林包圍，和鏡湖池前的開闊景色很不一樣。池中小島上的五輪石塔稱為白蛇塚，官方介紹指出這裡保留了西園寺家時代的遺跡意義，也是後半段很容易匆匆略過的重點。</p>

            <h3 className="seo-h3">4. 夕佳亭</h3>
            <p>夕佳亭是數寄屋造茶室，名稱來自夕陽映照金閣時格外美麗。現在參觀動線主要從外部欣賞；經過安民澤後注意山路旁的建築，不要只顧著找出口。</p>

            <h3 className="seo-h3">5. 不動堂</h3>
            <p>接近參觀尾聲會到不動堂，供奉相傳由弘法大師所作的石不動明王。看完再往御朱印、授與品與出口方向走，便完成主要參拜動線。各景點的官方解說可查看<a href={OFFICIAL_GUIDE_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_official_guide" data-platform="Kinkakuji" data-section="article_link">金閣寺境內案內</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="planning" aria-label="金閣寺行程安排與注意事項">
          <h2 className="seo-h2">怎麼排進京都行程？北側半日最順</h2>
          <div className="seo-prose">
            <p><strong>輕鬆版：</strong>早上金閣寺，參拜後回北大路、四條河原町或京都站安排午餐與市中心行程。第一次京都、帶長輩或不想頻繁轉車，這樣最簡單。</p>
            <p><strong>北側串聯版：</strong>金閣寺 → 龍安寺 → 仁和寺。三處都在京都西北側，比同一天硬接清水寺或伏見稻荷合理；不過仍要查好巴士班次並保留候車時間。</p>
            <p><strong>攝影與禮儀：</strong>金閣寺是宗教場所。依官方 FAQ，拍攝規範有明確限制，請遵守現場告示，不使用腳架、無人機或妨礙他人的方式拍攝。大型行李也沒有寄放處，建議先放在車站置物櫃或住宿處。</p>
            <p><strong>輪椅、嬰兒車：</strong>可走到舍利殿金閣旁，但金閣後方接著會遇到樓梯。官方要求輪椅、行動不便者與嬰兒車在樓梯前折返，從參拜入口離場；需要借用輪椅或查無障礙廁所時，可閱讀<a href={OFFICIAL_FAQ_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokinkakuji_official_faq" data-platform="Kinkakuji" data-section="article_link">金閣寺常見問題</a>或現場詢問。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都自由行"
          intro="金閣寺適合放在京都西北側半日；如果還在決定其他天要走東山、伏見或市中心，可以從區域攻略與旅杰地圖接著排。"
          links={[
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyotokinkakuji_related_areas', platform: 'internal' },
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyotokinkakuji_related_spots', platform: 'internal' },
            { label: '二條城門票與路線攻略', href: '/kyoto-nara/kyoto-nijo-castle-guide', event: 'kyotokinkakuji_related_nijocastle', platform: 'internal' },
            { label: '清水寺參觀攻略', href: '/kyoto-nara/kyoto-kiyomizudera-guide', event: 'kyotokinkakuji_related_kiyomizudera', platform: 'internal' },
            { label: '打開旅杰地圖找京都景點', href: '/osaka/map', event: 'kyotokinkakuji_related_map', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="金閣寺常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
