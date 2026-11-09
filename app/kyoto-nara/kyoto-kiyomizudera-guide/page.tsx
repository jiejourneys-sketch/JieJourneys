import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  kyotoKiyomizuderaGuideCanonical,
  kyotoKiyomizuderaGuideDescription,
  kyotoKiyomizuderaGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const OFFICIAL_VISIT_URL = 'https://www.kiyomizudera.or.jp/en/visit/'
const OFFICIAL_LOCATION_URL = 'https://www.kiyomizudera.or.jp/en/location/'
const OFFICIAL_HOURS_URL = 'https://www.kiyomizudera.or.jp/news/open-hour.php'
const KYOTO_ACCESS_URL =
  'https://kyoto.travel/en/getting-around/comfortable-access-to-higashiyama-kiyomizu-dera-temple/'
const KYOTO_CONGESTION_URL = 'https://global.kyoto.travel/en/comfort/'

const videoLinks = [
  { label: '清水寺 IG', href: 'https://www.instagram.com/reel/DfcPUiUtgMN/', event: 'kyotokiyomizudera_video_ig', platform: 'IG', primary: true },
  { label: '清水寺 YouTube', href: 'https://www.youtube.com/shorts/rhg0BsGzzWY', event: 'kyotokiyomizudera_video_youtube', platform: 'YouTube' },
]

const faqItems = [
  {
    q: '清水寺建議停留多久？',
    a: '只走仁王門、西門、三重塔、本堂、奧之院與音羽瀑布，建議約 1 小時；旺季排隊、慢慢拍照或延伸二年坂、三年坂與八坂之塔，最好多留 1～2 小時。',
  },
  {
    q: '清水寺最近的車站是哪一站？',
    a: '最近的鐵路站是京阪清水五條站，但步行到清水寺仍約 25 分鐘且一路上坡。搭公車可在五條坂或清水道下車，再步行約 10～15 分鐘。',
  },
  {
    q: '清水寺需要預約嗎？',
    a: '一般參拜不需要事先預約，現場購票即可。夜間特別參拜、成就院庭園特別公開與個別活動的日期、時間和費用可能不同，出發前仍要看官網公告。',
  },
  {
    q: '清水寺幾點去比較不擁擠？',
    a: '清水寺通常早上 6:00 開門，想避開旅行團與清水坂人潮可盡量早到；但御守與御朱印授與通常約 8:00 才開始，若有這項需求不要去得太早。',
  },
  {
    q: '音羽瀑布三道水流分別代表什麼？',
    a: '常見旅遊說法會分為學業、戀愛與健康長壽，不過清水寺官網沒有替三道水流逐一標示固定功效，而是說明以清流祈求淨化六根與願望實現；參拜時依現場動線與指示即可。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kyotoKiyomizuderaGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kyotoKiyomizuderaGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kyotoKiyomizuderaGuideCanonical,
  image: [`${SITE_URL}/assets/kyoto-kiyomizudera/precinct-route-map.png`],
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

type KyotoKiyomizuderaGuidePageProps = { searchParams?: PageSearchParams }

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'kyoto-video' || value === 'video') return '/kyoto-nara/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  return '/kyoto-nara/video'
}

export default async function KyotoKiyomizuderaGuidePage({ searchParams }: KyotoKiyomizuderaGuidePageProps) {
  const params = (await searchParams) ?? {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={sourceBackHref(params.from)} eventPrefix="kyotokiyomizudera" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="京都・清水寺攻略"
          h1="清水寺｜5 大必看重點、參觀路線與交通"
          intro="第一次去清水寺，照仁王門、西門與三重塔、本堂清水舞台、奧之院、音羽瀑布的順序走，最不容易漏掉經典畫面。境內主線約抓 1 小時，再依體力延伸二年坂、三年坂與八坂之塔。"
          eventPrefix="kyotokiyomizudera"
          showVisual={false}
          ctaLinks={[
            { label: '交通方式', href: '#access', dataEvent: 'kyotokiyomizudera_hero_access', platform: 'article' },
            { label: '參觀路線', href: '#route', dataEvent: 'kyotokiyomizudera_hero_route', platform: 'article' },
            { label: '門票與時間', href: '#visit-info', dataEvent: 'kyotokiyomizudera_hero_info', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="清水寺攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">推薦順序</span>
              <strong>一路往內再下山</strong>
              <p>仁王門 → 三重塔 → 本堂 → 奧之院 → 音羽瀑布。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">建議停留</span>
              <strong>約 1 小時</strong>
              <p>旺季排隊、拍照或走子安塔，再多預留 30～60 分鐘。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">一般開放</span>
              <strong>06:00～18:00</strong>
              <p>7、8 月通常延長至 18:30；特別參拜另依官網公告。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">參拜票價</span>
              <strong>成人 500 日圓</strong>
              <p>小學、國中生 200 日圓；特殊公開可能另行收費。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="清水寺攻略短影音">
          <h2 className="seo-h2">先看短影音：清水寺參觀重點與路線</h2>
          <div className="seo-prose">
            <p>先用短影音掌握清水寺的參觀重點，再搭配下方交通說明與境內地圖，安排仁王門、清水舞台、奧之院到音羽瀑布的路線。</p>
            <SeoVideoLinkMenu label="清水寺" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="清水寺交通方式">
          <h2 className="seo-h2">清水寺怎麼去？公車方便，但旺季不一定最快</h2>
          <div className="seo-prose">
            <p>清水寺位在東山坡上，沒有一出站就到的鐵路站。從京都站出發，最直覺是搭公車到<strong>五條坂</strong>或<strong>清水道</strong>，下車後再沿清水坂上坡約 10～15 分鐘。清水寺官網列出 206 號公車；週末與假日另可查看 EX100、EX101 等觀光特急公車的當日運行情況。</p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>起點／方式</th>
                    <th>下車點</th>
                    <th>適合情況</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>京都站搭公車</strong></td>
                    <td>五條坂／清水道</td>
                    <td>少轉乘，但旺季可能塞車與客滿</td>
                  </tr>
                  <tr>
                    <td><strong>JR＋京阪電車</strong></td>
                    <td>清水五條站</td>
                    <td>時間較可控，出站後步行約 25 分鐘</td>
                  </tr>
                  <tr>
                    <td><strong>地下鐵＋步行</strong></td>
                    <td>東山站</td>
                    <td>可沿祇園、八坂神社、二年坂三年坂一路散步</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>京都官方提醒，京都站到五條坂的公車路線經常壅塞；想避開塞車，可搭 JR 到東福寺站轉京阪，於清水五條站下車後步行。出發前可查看 <a href={KYOTO_ACCESS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokiyomizudera_official_access" data-platform="Kyoto Travel" data-section="article_link">京都官方清水寺交通建議</a>。</p>
            <p>清水寺官網也提醒，地圖 App 偶爾會帶到無法進入境內的道路。一般旅客請走清水坂頂端的仁王門入口，或茶碗坂頂端的入口；詳細位置以<a href={OFFICIAL_LOCATION_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokiyomizudera_official_location" data-platform="Kiyomizu-dera" data-section="article_link">清水寺官方交通與入口說明</a>為準。</p>
          </div>
        </section>

        <section className="seo-content" id="route" aria-label="清水寺參觀路線與境內地圖">
          <h2 className="seo-h2">清水寺推薦路線：5 個重點一路走完</h2>
          <div className="seo-prose">
            <p><strong>仁王門 → 西門、三重塔 → 本堂（清水舞台）→ 奧之院 → 音羽瀑布 → 下山</strong>，是第一次造訪最順的主線。想多走一點，可從奧之院延伸到子安塔，再折回音羽瀑布。</p>
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/kyoto-kiyomizudera/precinct-route-map.png"
                alt="清水寺境內地圖，標示仁王門、西門、三重塔、本堂、奧之院、音羽瀑布、子安塔與下山動線"
                width={1223}
                height={1286}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>清水寺境內重點位置圖：先走中間主線到本堂，再往奧之院與音羽瀑布下山。</figcaption>
            </figure>

            <h3 className="seo-h3">① 仁王門｜清水寺第一個經典畫面</h3>
            <p>走完清水坂後，最先看到的就是朱紅色仁王門，也是清水寺主要入口。現存門樓約在 1500 年前後重建，2003 年完成拆解修復。這裡通常人多，拍完照後繼續往西門與三重塔移動，不要把入口處塞住。</p>

            <h3 className="seo-h3">② 西門、三重塔｜先看建築與京都市景</h3>
            <p>西門與三重塔是進入境內後最醒目的朱紅色建築。西門以夕陽景觀聞名，三重塔則是清水寺最具代表性的構圖之一；接著會經過隨求堂、經堂與轟門，再進入本堂區域。</p>

            <h3 className="seo-h3">③ 本堂清水舞台｜站上舞台看京都市景</h3>
            <p>本堂建在音羽山陡峭山壁上，現有建築於 1633 年重建，主祀十一面千手觀音。著名的清水舞台以傳統木造結構支撐，從舞台可俯瞰京都市區、山林與季節景色；這裡是參拜與看景的核心，不只是拍照平台。</p>

            <h3 className="seo-h3">④ 奧之院｜拍完整清水舞台的最佳位置</h3>
            <p>從本堂繼續沿參拜路線前進，就會到音羽瀑布正上方的奧之院。奧之院同樣有木造舞台，面向本堂與京都市區，能把清水舞台、山林和城市一起收進畫面，是經典照片最常使用的取景角度。</p>

            <h3 className="seo-h3">⑤ 音羽瀑布｜下山前完成祈願</h3>
            <p>離開奧之院後沿階梯往下，即可抵達音羽瀑布。寺名「清水」就源自這股清流；官方說明三道清流可用長柄杓承接，用於淨化六根與祈願。常見旅遊說法把三道水流分為學業、戀愛與健康長壽，但官網沒有逐道標示固定功效，現場依隊伍與指示參拜即可。</p>
            <p>想查各建築的歷史與位置，可搭配<a href={OFFICIAL_VISIT_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokiyomizudera_official_visit" data-platform="Kiyomizu-dera" data-section="article_link">清水寺官方境內導覽</a>閱讀。</p>
          </div>
        </section>

        <section className="seo-content" id="visit-info" aria-label="清水寺門票開放時間與停留時間">
          <h2 className="seo-h2">清水寺門票、開放時間與停留時間</h2>
          <div className="seo-prose">
            <div className="narita-table-scroll">
              <table>
                <tbody>
                  <tr>
                    <th>一般門票</th>
                    <td>成人 500 日圓；小學、國中生 200 日圓</td>
                  </tr>
                  <tr>
                    <th>一般開放時間</th>
                    <td>06:00～18:00；7、8 月通常至 18:30</td>
                  </tr>
                  <tr>
                    <th>夜間特別參拜</th>
                    <td>春、夏、秋特定期間延長，日期與最後入場時間每年調整</td>
                  </tr>
                  <tr>
                    <th>境內建議停留</th>
                    <td>約 1 小時；旺季或延伸子安塔抓 1.5～2 小時</td>
                  </tr>
                  <tr>
                    <th>東山一起逛</th>
                    <td>再加二年坂、三年坂、八坂之塔，至少多留 1～2 小時</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>清水寺通常 6:00 就開門，但御守授與所與御朱印約 8:00 才開始。想避開人潮可早到；若主要目的是買御守或拿御朱印，則不必在開門時立刻入場。閉門時間、夜間參拜與特殊公開請出發前再查<a href={OFFICIAL_HOURS_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokiyomizudera_official_hours" data-platform="Kiyomizu-dera" data-section="article_link">清水寺最新開放時間</a>。</p>
          </div>
        </section>

        <section className="seo-content" id="tips" aria-label="清水寺行程安排與人潮提醒">
          <h2 className="seo-h2">行程怎麼接？下山順逛二年坂、三年坂最自然</h2>
          <div className="seo-prose">
            <p>走完音羽瀑布後回到清水坂，不必原路搭車離開。第一次京都最順的接法，是沿<a href="/kyoto-nara/kyoto-sannenzaka-ninenzaka-guide" data-event="kyotokiyomizudera_higashiyama_slopes" data-platform="internal" data-section="article_link">三年坂、二年坂與一年坂</a>往八坂之塔、高台寺與八坂神社方向慢慢下山，最後到祇園或四條河原町吃飯。這段坡道、石階與商店很多，穿好走的鞋，也不要在道路中央停下拍照。</p>
            <ul>
              <li><strong>想避人潮：</strong>優先安排早上，並查看<a href={KYOTO_CONGESTION_URL} target="_blank" rel="noopener noreferrer" data-event="kyotokiyomizudera_congestion" data-platform="Kyoto Travel" data-section="article_link">京都官方祇園・清水人潮預測</a>。</li>
              <li><strong>帶長輩或小孩：</strong>清水坂與境內有坡道、階梯；放慢速度，必要時參考官網無障礙路線。</li>
              <li><strong>旺季搭公車：</strong>京都站直達看似方便，但可能塞車；時間有限時改走 JR＋京阪。</li>
              <li><strong>不要只排 1 小時：</strong>1 小時只適合境內主線，若想逛東山街區，至少再多留 1～2 小時。</li>
            </ul>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="接著安排京都行程"
          intro="清水寺適合和二年坂、三年坂、八坂之塔、八坂神社放在同一天；先看分區攻略，再決定要從京都站、祇園或河原町出發。"
          links={[
            { label: '京都 6 大區域攻略', href: '/kyoto-nara/kyoto-6-areas-guide', event: 'kyotokiyomizudera_related_areas', platform: 'internal' },
            { label: '京都 5 個必去景點', href: '/kyoto-nara/kyoto-5-must-visit-spots-guide', event: 'kyotokiyomizudera_related_spots', platform: 'internal' },
            { label: '三年坂、二年坂、一年坂攻略', href: '/kyoto-nara/kyoto-sannenzaka-ninenzaka-guide', event: 'kyotokiyomizudera_related_higashiyama_slopes', platform: 'internal' },
            { label: '伏見稻荷千本鳥居攻略', href: '/kyoto-nara/kyoto-fushimi-inari-guide', event: 'kyotokiyomizudera_related_fushimiinari', platform: 'internal' },
            { label: '大阪・京都・奈良地圖', href: '/osaka/map', event: 'kyotokiyomizudera_related_map', platform: 'internal' },
            { label: '京都奈良交通整理', href: '/kyoto-nara/transport', event: 'kyotokiyomizudera_related_transport', platform: 'internal' },
          ]}
        />

        <SeoFaqSection title="清水寺攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
