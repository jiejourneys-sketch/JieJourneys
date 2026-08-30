import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  osakaAmazingPassHiddenSpotsGuideCanonical,
  osakaAmazingPassHiddenSpotsGuideDescription,
  osakaAmazingPassHiddenSpotsGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const AMAZING_PASS_URL = 'https://osaka-amazing-pass.com/cht/service_free.html'
const SHITENNOJI_URL = 'https://www.shitennoji.or.jp/'
const GLION_URL = 'https://glion-museum.jp/operating-time-cost/'
const TENNOJI_ZOO_URL = 'https://www.tennojizoo.jp/info/outline/'

const faqItems = [
  {
    q: '四天王寺、GLION Museum、天王寺動物園都能用大阪周遊券嗎？',
    a: '可以。2026 年大阪周遊券將三者都列為免費設施；同一個設施在可使用期間內限用一次。營業時間、休館日與臨時活動可能變動，出發前仍要確認官方頁面。',
  },
  {
    q: '四天王寺拿大阪周遊券能進哪些區域？',
    a: '大阪周遊券的參考價格為 800 日圓，包含中心伽藍 500 日圓與極樂淨土庭園 300 日圓。寺院全年大致開放，但庭園設有固定休園日；遇到庭園關閉時，行程要以中心伽藍為主。',
  },
  {
    q: 'GLION Museum 最好怎麼安排？',
    a: '從大阪港站 6 號出口往赤煉瓦倉庫方向走最直覺。博物館通常 11:00～17:00、週一休館，且可能因包場臨時休館；不要把它排在傍晚最後一站，先確認當天營業再出發。',
  },
  {
    q: '天王寺動物園從哪一個出口走比較近？',
    a: '可從 Osaka Metro 動物園前站 1 號出口往新世界方向走，再由新世界側入園；這樣適合和通天閣串在同一段行程。園區也有天芝（Ten-Shiba）側入口，從天王寺站方向前來則較順。',
  },
  {
    q: '三個景點要選哪一個？',
    a: '想看大阪歷史與寺院建築選四天王寺；喜歡復古車、紅磚倉庫與拍照氛圍選 GLION Museum；帶小孩或想安排較長的戶外行程選天王寺動物園。時間夠可把四天王寺和動物園排在同一天，GLION Museum 則適合大阪港一帶。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: osakaAmazingPassHiddenSpotsGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: osakaAmazingPassHiddenSpotsGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: osakaAmazingPassHiddenSpotsGuideCanonical,
  image: `${SITE_URL}/assets/osaka-amazing-pass-hidden-spots/shitennoji-gates-map.png`,
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

type OsakaAmazingPassHiddenSpotsGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'osaka-video') return '/osaka/video'
  if (value === 'pass-map' || value === 'osaka-pass-map') return '/osaka/pass-map'
  if (value === 'osaka-amazing-pass') return '/osaka/osaka-amazing-pass'
  return '/osaka'
}

export default async function OsakaAmazingPassHiddenSpotsGuidePage({ searchParams }: OsakaAmazingPassHiddenSpotsGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="osakapasshidden" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪周遊券｜低調景點攻略"
          h1="大阪周遊券 3 個低調景點攻略｜四天王寺、GLION Museum、天王寺動物園"
          intro="大阪周遊券不只通天閣、遊船和摩天輪。四天王寺能看大阪最早期的寺院格局，GLION Museum 有紅磚倉庫與老爺車，天王寺動物園則很適合親子與新世界順遊；三個人潮相對沒那麼集中，但用券價值合計最高可超過 ¥3,000。"
          eventPrefix="osakapasshidden"
          showVisual={false}
          ctaLinks={[
            { label: '先看比較表', href: '#comparison', dataEvent: 'osakapasshidden_hero_comparison', platform: 'article' },
            { label: '四天王寺怎麼走', href: '#shitennoji', dataEvent: 'osakapasshidden_hero_shitennoji', platform: 'article' },
            { label: '天王寺動物園入口', href: '#tennoji-zoo', dataEvent: 'osakapasshidden_hero_zoo', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="大阪周遊券低調景點快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">歷史派</span>
              <strong>四天王寺・參考 ¥800</strong>
              <p>中心伽藍與庭園可用券，從四天王寺前夕陽丘站 4 號出口出發最順。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">復古拍照派</span>
              <strong>GLION Museum・¥1,300 起</strong>
              <p>大阪港紅磚倉庫裡的老爺車博物館，從大阪港站 6 號出口步行前往。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">親子／戶外派</span>
              <strong>天王寺動物園・¥800</strong>
              <p>從動物園前站 1 號出口接新世界動線，最適合和通天閣一起排。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">周遊券價值</span>
              <strong>合計 ¥2,900～¥3,500</strong>
              <p>三者都是免費設施，但同一設施在可使用期間內限用一次，休館日要先避開。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="大阪周遊券三個低調景點比較">
          <h2 className="seo-h2">先看這張比較表：哪一個最適合你的行程？</h2>
          <div className="seo-prose">
            <p>這三個景點不是同一區，重點是用對「行程性格」：四天王寺和動物園可接在天王寺／新世界一日，GLION Museum 則要放進大阪港、天保山或紅磚倉庫一帶。不要為了湊設施數硬塞，選符合當天路線的一個就很有感。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>景點</th>
                    <th>最適合誰</th>
                    <th>最近出口</th>
                    <th>周遊券參考價值</th>
                    <th>安排時間</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>四天王寺</strong></td>
                    <td>喜歡歷史、寺院與安靜散步的人</td>
                    <td>四天王寺前夕陽丘站 T26・4 號出口</td>
                    <td>¥800</td>
                    <td>45～75 分鐘</td>
                  </tr>
                  <tr>
                    <td><strong>GLION Museum</strong></td>
                    <td>老爺車、紅磚、室內拍照氛圍</td>
                    <td>大阪港站 C11・6 號出口</td>
                    <td>¥1,300～¥1,900</td>
                    <td>45～60 分鐘</td>
                  </tr>
                  <tr>
                    <td><strong>天王寺動物園</strong></td>
                    <td>親子、想接新世界與通天閣</td>
                    <td>動物園前站 M22／K19・1 號出口</td>
                    <td>¥800</td>
                    <td>90～150 分鐘</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="shitennoji" aria-label="四天王寺大阪周遊券攻略">
          <h2 className="seo-h2">四天王寺：先看懂四個入口，再進中心伽藍與庭園</h2>
          <div className="seo-prose">
            <p>
              四天王寺是這三個中最適合「避開商圈、安靜走一段」的選擇。大阪周遊券參考價值為 ¥800，對應<strong>中心伽藍 ¥500 與極樂淨土庭園 ¥300</strong>。從 Osaka Metro<strong>四天王寺前夕陽丘站（T26）4 號出口</strong>出來後往寺院方向走，先確認自己要由哪一側進入，才不會繞著外圍走一大圈。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/osaka-amazing-pass-hidden-spots/shitennoji-station-route.png"
                alt="從四天王寺前夕陽丘站 4 號出口前往四天王寺的步行地圖"
                width={1169}
                height={2410}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>把起點記成四天王寺前夕陽丘站 4 號出口；到寺院外圍後再依當下要走的門與參觀區域進場。</figcaption>
            </figure>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-amazing-pass-hidden-spots/shitennoji-gates-map.png"
                alt="四天王寺境內圖，標示中之門、東大門、西門與南大門位置"
                width={1075}
                height={963}
                sizes="(max-width: 820px) 100vw, 960px"
              />
              <figcaption>四天王寺的中之門、東大門、西門與南大門位置；入園後可用這張圖判斷中心伽藍、五重塔與庭園的相對方向。</figcaption>
            </figure>

            <h3 className="seo-h3">四天王寺怎麼用周遊券最不浪費？</h3>
            <ol>
              <li><strong>先走外圍區：</strong>中之門、西門、南大門、東大門都可由外圍參拜與散步；從地鐵走來時，中之門與西門相對較近。</li>
              <li><strong>再進內圍區：</strong>出示大阪周遊券，依現場指示進入中心伽藍與庭園；五重塔、金堂、講堂排在同一段，之後再走庭園。</li>
              <li>庭園有固定休園期：多數月份的 1～10 日不開放（4、8、12、1 月除外），另有 4 月 22 日與 1 月 12～14 日；遇到庭園休園時，改以中心伽藍為主。</li>
            </ol>
            <p>一般開放時間為 4～9 月 8:30～16:30、10～3 月 8:30～16:00。它不適合塞在晚上，而是適合早上先走一段安靜景點，再往天王寺或新世界移動。</p>
          </div>
        </section>

        <section className="seo-content" id="glion-museum" aria-label="GLION Museum大阪周遊券攻略">
          <h2 className="seo-h2">GLION Museum：從大阪港站 6 號出口走進紅磚老爺車博物館</h2>
          <div className="seo-prose">
            <p>
              GLION Museum 藏在大阪港赤煉瓦倉庫裡，是很容易被周遊券使用者漏掉的室內景點。它不是大型主題樂園，但老爺車與紅磚空間的氛圍很完整，適合喜歡車、下雨天想排室內，或已經安排海遊館、天保山一帶的人。一般票會依日期落在 ¥1,300～¥1,900，持大阪周遊券可免費入館。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/osaka-amazing-pass-hidden-spots/glion-route-map.png"
                alt="從大阪港站 6 號出口前往 GLION Museum 的步行地圖"
                width={1170}
                height={2409}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從大阪港站 6 號出口出來後，往赤煉瓦倉庫與 GLION Museum 方向走；建議直接以地圖卡片的定位輔助最後一段路。</figcaption>
            </figure>

            <h3 className="seo-h3">GLION Museum 的三個行前提醒</h3>
            <ul>
              <li><strong>營業時間：</strong>通常 11:00～17:00，週一休館；週一逢假日則營業、隔日休館。</li>
              <li><strong>臨時包場：</strong>場地可能因包場或活動臨時休館，出發當天務必看官方營業日曆或社群公告。</li>
              <li><strong>拍照規則：</strong>可做一般紀念拍攝，但不要觸摸、乘坐展示車；腳架、反光板與無人機等器材不適用。</li>
            </ul>
            <p>這個景點在下午四點後不太適合硬衝，建議放在大阪港白天路線的前半段，再接海遊館、天保山或港邊散步。</p>
          </div>
        </section>

        <section className="seo-content" id="tennoji-zoo" aria-label="天王寺動物園大阪周遊券攻略">
          <h2 className="seo-h2">天王寺動物園：動物園前站 1 號出口，從新世界側入園最順</h2>
          <div className="seo-prose">
            <p>
              天王寺動物園常被通天閣的光環蓋過，但如果持大阪周遊券、又不只是想拍一張通天閣，這裡至少要留 1 小時；想多看幾個動物區則抓 1.5～2.5 小時。從<strong>動物園前站 1 號出口</strong>出來，朝新世界與通天閣方向移動後進園最直覺；看完也能回到新世界吃串炸或接通天閣行程。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/osaka-amazing-pass-hidden-spots/tennoji-zoo-station-route.png"
                alt="從動物園前站 1 號出口前往天王寺動物園的步行地圖"
                width={1169}
                height={2413}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從動物園前站 1 號出口出發，可把天王寺動物園和通天閣、新世界排成同一段；不要誤以為一定要從天王寺站繞過來。</figcaption>
            </figure>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-amazing-pass-hidden-spots/tennoji-zoo-park-map.jpg"
                alt="天王寺動物園園內地圖，標示新世界門、天芝門、非洲草原、大象村與各動物區"
                width={1415}
                height={1000}
                sizes="(max-width: 820px) 100vw, 960px"
              />
              <figcaption>園區有新世界門與天芝門兩個主要方向；從新世界側進場後，可先依地圖安排非洲草原、大象村與北極熊等區域。</figcaption>
            </figure>

            <h3 className="seo-h3">動物園行程這樣排：不用全園衝完</h3>
            <ol>
              <li>從新世界側進場後，先決定要走非洲草原與獅子一帶，還是優先去大象村、鳥園與北極熊區。</li>
              <li>若同行有小孩，直接抓 90～150 分鐘；成人純參觀則挑兩三個區域，保留體力給新世界與通天閣。</li>
              <li>一般為 9:30～17:00、最晚入園 16:00；5、9 月的週末與假日延長到 18:00、最晚入園 17:00。休園日以週一為原則，另有年末年初與可能的臨時調整。</li>
            </ol>
            <p>成人一般票現為 ¥800，持大阪周遊券可免費入園。天氣炎熱或下雨時，不需要硬走完整一圈，選重點區域即可；同一天還要上通天閣的話，留意兩個景點都需要時間。</p>
          </div>
        </section>

        <section className="seo-content" id="pass-notes" aria-label="大阪周遊券使用注意事項">
          <h2 className="seo-h2">使用大阪周遊券前，先確認兩件事</h2>
          <div className="seo-prose">
            <p>大阪周遊券可在使用日進入多個免費設施，但同一設施在可使用期間內只能用一次。這三個景點的價值與休館規則不同：四天王寺要避開庭園休園日、GLION Museum 要先確認是否包場、天王寺動物園則要先看週一與最新開園日曆。</p>
            <p>
              出發前可先看
              <a href={AMAZING_PASS_URL} target="_blank" rel="noopener noreferrer" data-event="osakapasshidden_amazing_pass_official" data-platform="AmazingPass" data-section="article">
                <strong>大阪周遊券官方設施頁</strong>
              </a>
              ，再依目的地確認
              <a href={SHITENNOJI_URL} target="_blank" rel="noopener noreferrer" data-event="osakapasshidden_shitennoji_official" data-platform="Official" data-section="article">
                <strong>四天王寺</strong>
              </a>
              、
              <a href={GLION_URL} target="_blank" rel="noopener noreferrer" data-event="osakapasshidden_glion_official" data-platform="Official" data-section="article">
                <strong>GLION Museum</strong>
              </a>
              與
              <a href={TENNOJI_ZOO_URL} target="_blank" rel="noopener noreferrer" data-event="osakapasshidden_tennoji_zoo_official" data-platform="Official" data-section="article">
                <strong>天王寺動物園</strong>
              </a>
              的最新公告。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="把這三個低調景點接進周遊券行程"
          intro="先用完整攻略判斷周遊券是否適合你，再打開地圖確認三個景點和當天其他設施是否順路；天王寺動物園則能直接和通天閣串走。"
          links={[
            { label: '大阪周遊券完整攻略', href: '/osaka/osaka-amazing-pass?from=hidden-spots-guide', event: 'osakapasshidden_related_pass', primary: true },
            { label: '打開大阪周遊券地圖', href: '/osaka/pass-map?from=hidden-spots-guide', event: 'osakapasshidden_related_passmap' },
            { label: '通天閣攻略', href: '/osaka/tsutenkaku-guide?from=hidden-spots-guide', event: 'osakapasshidden_related_tsutenkaku' },
          ]}
          purchaseLabel="購票"
          purchaseOptions={[
            { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312', event: 'osakapasshidden_purchase_kkday', platform: 'KKDAY' },
            { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798', event: 'osakapasshidden_purchase_klook', platform: 'KLOOK' },
            { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162', event: 'osakapasshidden_purchase_trip', platform: 'Trip' },
          ]}
        />
        <SeoFaqSection title="大阪周遊券低調景點常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
