import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import {
  osakaAmazingPassCanonical,
  osakaAmazingPassDescription,
  osakaAmazingPassTitle,
} from './pageMeta'

const officialLinks = {
  whats: 'https://osaka-amazing-pass.com/howto_whats.html',
  price: 'https://osaka-amazing-pass.com/info.html',
  usage: 'https://osaka-amazing-pass.com/howto_guide.html',
  free: 'https://osaka-amazing-pass.com/service_free.html',
  privilege: 'https://osaka-amazing-pass.com/service_privilege.html',
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: osakaAmazingPassTitle.replace(' | JieJourneys(旅杰)', ''),
  description: osakaAmazingPassDescription,
  image: [
    'https://www.jiejourneys.com/assets/osaka-pass-summary.png',
    'https://www.jiejourneys.com/assets/osaka-pass-free-attractions.png',
  ],
  author: {
    '@type': 'Organization',
    name: 'JieJourneys',
  },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.jiejourneys.com/assets/og-share.png',
    },
  },
  mainEntityOfPage: osakaAmazingPassCanonical,
}

export default function OsakaAmazingPassPage() {
  return (
    <>
      <CitySubpageHeader backHref="/osaka" eventPrefix="osakaamazingpass" />
      <main className="busan-main transport-main seo-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <SeoHeroSection
          badge="大阪周遊券攻略"
          h1="大阪周遊券攻略｜免費景點、優惠餐飲、交通範圍與回本排法"
          intro="大阪周遊券不是每個人都必買，但如果你一天內會密集跑大阪市區展望台、遊船、摩天輪、大阪城周邊景點，再加上地鐵移動，它就很容易變成大阪自由行最省事的一張票。"
          eventPrefix="osakaamazingpass"
          showVisual={false}
          ctaLinks={[
            {
              label: '大阪周遊券地圖',
              href: '/osaka/pass-map',
              dataEvent: 'osakaamazingpass_hero_passmap',
              platform: 'internal',
            },
            {
              label: '大阪票券總整理',
              href: '/osaka/ticket',
              dataEvent: 'osakaamazingpass_hero_ticket',
              platform: 'internal',
            },
            {
              label: 'KKDAY購買',
              href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312',
              dataEvent: 'osakaamazingpass_hero_kkday',
              platform: 'KKDAY',
            },
          ]}
        />

        <section className="seo-content" aria-label="大阪周遊券重點整理">
          <h2 className="seo-h2">大阪周遊券是什麼？先看這張懶人表</h2>
          <div className="seo-prose">
            <p>
              大阪周遊券（Osaka Amazing Pass）是把<strong>大阪市區交通</strong>、<strong>約 40 個觀光設施入場</strong>和<strong>設施/店家優惠</strong>整合在一起的數位票券。
              依官方目前公開資訊，標準版 1 日券為 3,500 円、2 日券為 5,000 円；大阪伊丹空港版則是 1 日券 3,800 円、2 日券 5,400 円。價格、販售期間、使用期間以
              <a href={officialLinks.price} target="_blank" rel="noopener noreferrer" data-event="osakaamazingpass_official_price" data-section="article">
                大阪周遊券官方資訊
              </a>
              為準。
            </p>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-pass-summary.png"
                alt="大阪周遊券包含免費設施、優惠設施、店家優惠與免費交通"
                width={762}
                height={542}
                sizes="(max-width: 820px) 100vw, 760px"
                priority
              />
              <figcaption>大阪周遊券可以理解成「交通 + 免費設施 + 優惠設施 + 店家優惠」的組合票。</figcaption>
            </figure>

            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>重點</th>
                  <th>我的判斷</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>交通</td>
                  <td>Osaka Metro、大阪 City Bus 部分路線，以及主要大阪市域私鐵路線。</td>
                  <td>市區移動越多越加分，但不要拿來規劃京都、奈良或關西機場交通。</td>
                </tr>
                <tr>
                  <td>免費設施</td>
                  <td>展望台、遊船、摩天輪、大阪城周邊設施等，每個設施通常限用一次。</td>
                  <td>是否回本主要看這一欄，不是看優惠餐飲。</td>
                </tr>
                <tr>
                  <td>優惠設施/店家</td>
                  <td>出示周遊券可拿折扣或特典，內容會依店家調整。</td>
                  <td>當作順路加分，不建議為了折扣硬排。</td>
                </tr>
                <tr>
                  <td>使用方式</td>
                  <td>手機購買與 QR code 使用，1 天以 AM 3:00 到隔日 AM 2:59 計算。</td>
                  <td>不要半夜 0:00 到 2:59 之間手滑啟用；啟用後也不要期待照 24 小時計。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券適合誰">
          <h2 className="seo-h2">大阪周遊券適合誰買？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">適合：一天內想跑 2 到 3 個以上付費景點的人</h3>
            <p>
              如果你本來就想去通天閣、梅田藍天大廈、道頓堀遊船、Wonder Cruise、大阪城御座船、天保山摩天輪、聖瑪麗亞號這類設施，再加上當天會搭大阪市區地鐵移動，大阪周遊券就很值得拿出來算。
              你可以先打開
              <a href="/osaka/pass-map" data-event="osakaamazingpass_internal_passmap" data-section="article">
                大阪周遊券地圖
              </a>
              ，把想去的點集中在同一天，會比只看景點清單更直覺。
            </p>

            <h3 className="seo-h3">不適合：只想逛街、吃飯、拍照的人</h3>
            <p>
              如果你那天主要是心齋橋、道頓堀、黑門市場、梅田商場、咖啡廳和美食，周遊券通常不是優先選項。大阪自由行不是每天都要買票，免費區域逛得很滿時，直接用 IC 卡或單程票移動更輕鬆。
            </p>

            <h3 className="seo-h3">要另外買：USJ、海遊館和多數近郊景點</h3>
            <p>
              日本環球影城和大阪海遊館不在這篇的回本核心裡，通常要回到
              <a href="/osaka/ticket" data-event="osakaamazingpass_internal_ticket" data-section="article">
                大阪票券總整理
              </a>
              另外比較門票。京都、奈良、神戶、琵琶湖這些一日遊也不是大阪周遊券的主戰場，交通票和行程票要分開看。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券地圖搭配使用">
          <h2 className="seo-h2">怎麼搭配大阪周遊券地圖？</h2>
          <div className="seo-prose">
            <p>
              文章先幫你判斷「要不要買」，地圖則幫你判斷「怎麼排才順」。我的建議是先打開
              <a href="/osaka/pass-map" data-event="osakaamazingpass_internal_passmap_guide" data-section="article">
                大阪周遊券地圖
              </a>
              ，把免費設施、優惠設施和店家優惠分開看，不要把所有點混在一起排。
            </p>

            <h3 className="seo-h3">地圖顏色代表什麼？</h3>
            <table>
              <thead>
                <tr>
                  <th>分類</th>
                  <th>顏色</th>
                  <th>文章裡怎麼解讀</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>免費設施</td>
                  <td>紅色 / 黃色 / 綠色</td>
                  <td>紅色優先看，黃色可搭配同區，綠色通常是順路再補。</td>
                </tr>
                <tr>
                  <td>優惠設施</td>
                  <td>深灰 / 淺灰</td>
                  <td>深灰比較值得注意；淺灰不要為了折扣特地繞路。</td>
                </tr>
                <tr>
                  <td>店家優惠</td>
                  <td>深灰 / 淺灰</td>
                  <td>餐飲與購物優惠是加分，不是買周遊券的主要理由。</td>
                </tr>
              </tbody>
            </table>

            <h3 className="seo-h3">我會照這個順序排</h3>
            <ol>
              <li>先挑 2 到 3 個紅色或黃色免費設施，確認自己真的想去。</li>
              <li>看它們集中在哪一區：難波、梅田、大阪城、天王寺或天保山。</li>
              <li>再補同區的優惠設施或餐飲優惠，不要反過來被折扣牽著走。</li>
              <li>最後把路線丟進排序工具，檢查移動會不會太跳。</li>
            </ol>

            <p>
              這也是為什麼我把地圖頁做得比較像工具，文章頁做得比較像攻略。你先在這篇理解判斷邏輯，再回地圖點開實際位置，會比單看清單更容易排出順路的一天。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券免費景點排序">
          <h2 className="seo-h2">免費景點怎麼排才容易回本？</h2>
          <div className="seo-prose">
            <p>
              官方的「可利用觀光設施」頁面會列出當年度可使用景點，也會註明營業時間、限制日、是否需要換票或預約。這裡我用你目前大阪周遊券地圖整理的原價與實用度，把免費景點分成高、中、低價值，讓你先抓方向。
            </p>

            <figure className="seo-figure">
              <Image
                src="/assets/osaka-pass-free-attractions.png"
                alt="大阪周遊券免費景點高價值、中價值、低價值排序"
                width={1060}
                height={1721}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>先挑高價值或中價值免費設施，再把距離近的點排在同一天，通常比亂塞折扣更容易回本。</figcaption>
            </figure>

            <h3 className="seo-h3">最推薦的思路：展望台 + 遊船 + 同區移動</h3>
            <p>
              大阪周遊券最漂亮的用法，是把「原價高、體驗差異明顯、交通順路」的點放在同一天。例如梅田藍天大廈加 HEP FIVE 摩天輪可以排大阪站周邊；道頓堀水上觀光船和 Wonder Cruise 可以排難波/道頓堀；聖瑪麗亞號、船長線、天保山周邊可以排海灣區。
            </p>

            <h3 className="seo-h3">最容易踩雷的思路：為了回本把景點塞滿</h3>
            <p>
              周遊券可以一天用多個設施，但每個景點都有營業時間、換票規則、排隊狀況和天候限制。官方也提醒設施營業與休館可能變動，出發前要先看
              <a href={officialLinks.free} target="_blank" rel="noopener noreferrer" data-event="osakaamazingpass_official_free" data-section="article">
                可利用觀光設施
              </a>
              的最新資訊。尤其遊船類、展望台、期間限定營運設施，建議你把「必去」排前面，「可去可不去」放後面。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券優惠設施與餐飲">
          <h2 className="seo-h2">優惠景點和餐飲怎麼看？順路再用就好</h2>
          <div className="seo-prose">
            <p>
              優惠設施和餐飲特典不是周遊券回本的主因，但在你剛好路過時很好用。官方把這類列在「特典が受けられる施設や店舗」，實際內容可能是折扣、贈品、優惠券或指定餐飲優惠，所以到現場前仍要確認店家規則。
            </p>

            <div className="seo-media-grid">
              <figure className="seo-figure">
                <Image
                  src="/assets/osaka-pass-discount-attractions.png"
                  alt="大阪周遊券優惠景點整理"
                  width={1173}
                  height={1361}
                  sizes="(max-width: 820px) 100vw, 760px"
                />
                <figcaption>優惠景點適合排在原本就會去的區域附近，不要為了折扣特地繞遠路。</figcaption>
              </figure>
              <figure className="seo-figure">
                <Image
                  src="/assets/osaka-pass-food-discounts.png"
                  alt="大阪周遊券餐飲優惠整理"
                  width={1173}
                  height={1409}
                  sizes="(max-width: 820px) 100vw, 760px"
                />
                <figcaption>餐飲優惠更像旅途中順手省一點，行程主軸還是應該放在你真的想吃、想看的地方。</figcaption>
              </figure>
            </div>

            <p>
              如果你想把優惠景點、餐飲和住宿位置一起看，可以搭配
              <a href="/osaka/map" data-event="osakaamazingpass_internal_osakamap" data-section="article">
                旅杰大阪地圖
              </a>
              ；如果你已經確定要買周遊券，則回到
              <a href="/osaka/pass-map" data-event="osakaamazingpass_internal_passmap_2" data-section="article">
                大阪周遊券地圖
              </a>
              看免費/優惠分類會更快。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券使用方法">
          <h2 className="seo-h2">購買與使用注意事項</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 這是手機 QR code 票券</h3>
            <p>
              新版大阪周遊券使用 Surutto QRtto 系統，官方說明是用手機購買並顯示 QR code 來搭電車、巴士和進入觀光設施。使用前請確定手機有電、能連網、瀏覽器相機權限可用；截圖或列印畫面不能拿來使用。
              詳細流程可看
              <a href={officialLinks.usage} target="_blank" rel="noopener noreferrer" data-event="osakaamazingpass_official_usage" data-section="article">
                官方購買與使用方法
              </a>
              。
            </p>

            <h3 className="seo-h3">2. 不是啟用後 24 小時/48 小時</h3>
            <p>
              官方把 1 天定義為 AM 3:00 到隔日 AM 2:59；交通使用則是始發到終電。也就是說，1 日券不是你按下啟用後 24 小時，2 日券也不是 48 小時。建議當天早上要開始跑行程時再啟用。
            </p>

            <h3 className="seo-h3">3. 一次最多購買 4 張，沒有兒童票</h3>
            <p>
              官方 FAQ 說沒有兒童用周遊券，要買就是成人版。多人同行時可以購買後分配，但啟用後就不能分配或退款。家族旅遊如果有小孩，建議先用大人/小孩各景點原價和交通費重新算一次。
            </p>

            <h3 className="seo-h3">4. 交通範圍要看清楚</h3>
            <p>
              標準版可用在 Osaka Metro、大阪 City Bus 部分路線，以及主要大阪市域的阪急、阪神、京阪、近鐵、南海等路線；大阪伊丹空港版才多了伊丹機場相關延伸範圍。關西機場不能用伊丹空港版取代，座席指定特急也可能需要另付費。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="大阪周遊券行程排法">
          <h2 className="seo-h2">我會怎麼排大阪周遊券一日行程？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">難波/道頓堀 + 新世界路線</h3>
            <p>
              適合第一次大阪自由行。白天先跑通天閣、新世界、天王寺附近景點，傍晚回難波、道頓堀吃飯，再把道頓堀遊船或 Wonder Cruise 排進去。這條路線最符合「不用跨太多區、晚上也好逛」的節奏。
            </p>

            <h3 className="seo-h3">梅田 + 大阪城 + 中之島路線</h3>
            <p>
              適合喜歡展望台、城市景觀和大阪城的人。梅田藍天大廈、HEP FIVE、大阪城天守閣或御座船可以組在一起，中間穿插大阪 Metro 移動。行程要留彈性，因為展望台和船班都會受時間與人潮影響。
            </p>

            <h3 className="seo-h3">天保山/海灣區路線</h3>
            <p>
              適合想搭聖瑪麗亞號、看天保山摩天輪、逛海灣區的人。海遊館本身通常要另外買票，但如果你本來就會去海遊館周邊，周遊券的船類和周邊設施可以一起評估。親子旅遊不要排太滿，保留吃飯和休息時間會舒服很多。
            </p>

            <p>
              住宿還沒決定的話，可以先看
              <a href="/osaka/hotel" data-event="osakaamazingpass_internal_hotel" data-section="article">
                大阪住宿推薦
              </a>
              ，再回來決定哪一天用周遊券。住難波、心齋橋、梅田通常都比較好排；住得太偏遠，就要把進出市區的時間成本算進去。
            </p>
          </div>
        </section>

        <SeoCtaSection text="" href="/osaka/pass-map" linkText="打開大阪周遊券地圖" newTab dataEvent="osakaamazingpass_cta_passmap" />

        <SeoFaqSection
          title="大阪周遊券常見問題"
          items={[
            {
              q: '大阪周遊券 1 日券和 2 日券怎麼選？',
              a: '第一次買通常先看 1 日券，把高價值免費景點集中在同一天。2 日券適合你連續兩天都會跑市區付費景點與地鐵移動，而且第二天不是只逛街吃飯。',
            },
            {
              q: '大阪周遊券可以搭 JR 或去關西機場嗎？',
              a: '不要把它當成 JR Pass 或關西機場交通票。標準版重點是大阪市區的指定地鐵、巴士和部分私鐵範圍；關西機場交通請另外看南海電鐵、JR HARUKA 或利木津巴士。',
            },
            {
              q: '大阪周遊券可以用在 USJ 嗎？',
              a: '不可以。USJ 門票和快速通關要另外買，建議回大阪票券總整理比價。周遊券比較適合市區展望台、遊船、摩天輪和大阪城周邊設施。',
            },
            {
              q: '買大阪周遊券前最該確認什麼？',
              a: '先確認想去的設施當天有營業、是否需要預約或換票、是否有指定入場時間，再用大阪周遊券地圖把點排近一點。不要只看票價就硬塞景點。',
            },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
