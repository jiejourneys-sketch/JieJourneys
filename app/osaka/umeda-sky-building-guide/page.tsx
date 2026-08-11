import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  umedaSkyBuildingGuideCanonical,
  umedaSkyBuildingGuideDescription,
  umedaSkyBuildingGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const faqItems = [
  {
    q: '梅田空中庭園的入口是在東棟裡面嗎？',
    a: '入口在東棟側，但不是進東棟或西棟後搭一般電梯。請先從大樓外側的「空中庭園專用入口」進入，走到 3F 後再搭專用電梯；這是第一次來最容易走錯的地方。',
  },
  {
    q: '從 JR 大阪站或大阪 Metro 梅田站走到梅田藍天大廈多久？',
    a: 'JR 大阪站依官方建議路線約 7 分鐘；從大阪 Metro 梅田站 5 號出口或在大型車站內繞行，建議抓約 10 分鐘並多留找路時間。',
  },
  {
    q: '大阪周遊券可以免費進梅田空中庭園嗎？',
    a: '可以在當日 15:00 前免費入場；15:00 後改為出示周遊券享一般票價 9 折。想看夕陽又想免費，可在 15:00 前完成入場，進場後留在展望台等日落。',
  },
  {
    q: '絹谷幸二天空美術館可以和空中庭園同一天排嗎？',
    a: '可以。美術館在西棟 27F，空中庭園在東棟側的戶外專用入口。建議先看美術館，再提早離開前往空中庭園完成入場；兩者均為大阪周遊券適用設施，但要留意美術館休館日與最後入館時間。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: umedaSkyBuildingGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: umedaSkyBuildingGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: umedaSkyBuildingGuideCanonical,
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

type UmedaSkyBuildingGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'map') return '/osaka/map'
  if (value === 'pass-map') return '/osaka/pass-map'
  if (value === 'osaka-5-areas-guide') return '/osaka/osaka-5-areas-guide'
  if (value === 'osaka-amazing-pass') return '/osaka/osaka-amazing-pass'
  return '/osaka'
}

export default async function UmedaSkyBuildingGuidePage({ searchParams }: UmedaSkyBuildingGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="umedasky" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪夜景攻略"
          h1="梅田空中庭園攻略｜交通、專用入口、樓層路線與大阪周遊券一次懂"
          intro="梅田藍天大廈的空中庭園展望台很適合排在大阪旅程的傍晚，但真正容易卡住的是入口與電梯動線。這篇從車站怎麼走、戶外專用入口、3F 到屋上 Sky Walk 的路線，到周遊券免費時段與順遊美術館一次整理。"
          eventPrefix="umedasky"
          showVisual={false}
          ctaLinks={[
            { label: '怎麼走', href: '#access', dataEvent: 'umedasky_hero_access', platform: 'article' },
            { label: '參觀路線', href: '#observatory-route', dataEvent: 'umedasky_hero_route', platform: 'article' },
            { label: '大阪周遊券', href: '#amazing-pass', dataEvent: 'umedasky_hero_pass', platform: 'article' },
            { label: '梅田區域攻略', href: '/osaka/osaka-5-areas-guide?from=umeda-sky-building-guide', dataEvent: 'umedasky_hero_areas', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="梅田空中庭園快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">從車站出發</span>
              <strong>JR 大阪站約 7 分鐘；梅田站建議抓 10 分鐘</strong>
              <p>JR 大阪站走中央北口較順；大阪 Metro 梅田站可從 5 號出口方向出發。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最重要的入口</span>
              <strong>東棟側的戶外專用入口</strong>
              <p>不是搭東棟或西棟的一般大樓電梯；先走到外側入口，再上 3F。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">參觀順序</span>
              <strong>3F → 35F → 39F → 40F → RF</strong>
              <p>39F 辦理入場，40F 是室內展望台與咖啡廳，最上方是戶外 Sky Walk。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">大阪周遊券</span>
              <strong>15:00 前免費；之後 9 折</strong>
              <p>一般成人票 2,000 日圓。想等夜景又想免費，務必在 15:00 前先完成入場。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="access" aria-label="梅田空中庭園交通與步行方向">
          <h2 className="seo-h2">梅田空中庭園怎麼去？從兩個車站出發最順</h2>
          <div className="seo-prose">
            <p>
              梅田藍天大廈在大阪站北側。第一次來建議先把「站內出口」和「大樓入口」分開記：先從車站走到地面北側，再沿著步道往兩棟連在一起的梅田藍天大廈前進，最後才找空中庭園的戶外專用入口。
            </p>

            <h3 className="seo-h3">大阪 Metro 梅田站：往 5 號出口方向</h3>
            <p>從大阪 Metro 梅田站可往 5 號出口方向出站，再朝梅田藍天大廈步行。梅田地下街分岔很多，若拖行李或第一次走，建議抓約 10 分鐘，不要把轉車時間壓得太緊。</p>

            <h3 className="seo-h3">JR 大阪站：從中央北口往北側走</h3>
            <p>JR 大阪站從中央北口方向離開較好辨認，步行約 7 分鐘可抵達大樓周邊。實際時間會因你在站內哪一個月台、是否先逛商場而不同，保守抓 7 到 10 分鐘最安心。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/umeda-sky-building/umeda-station-walking-map.png"
                alt="從大阪 Metro 梅田站五號出口與 JR 大阪站中央北口前往梅田藍天大廈的步行地圖"
                width={1170}
                height={2532}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>先離開複雜的梅田站區，再往大阪站北側的梅田藍天大廈走；車站出口不同，步行時間也會略有差異。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="dedicated-entrance" aria-label="梅田空中庭園專用入口">
          <h2 className="seo-h2">入口不是大樓電梯｜從東棟側的戶外專用入口進去</h2>
          <div className="seo-prose">
            <p>
              這裡最容易迷路：梅田藍天大廈分成東棟與西棟，但<strong>空中庭園不能從兩棟裡的一般電梯直接上去</strong>。請走到<strong>東棟側、建築物外的空中庭園專用入口</strong>，再依指標前往 3F；看到一般辦公大樓電梯時，不用進去找展望台。
            </p>

            <figure className="seo-figure">
              <Image
                src="/assets/umeda-sky-building/access-map.jpg"
                alt="梅田藍天大廈東棟側空中庭園專用入口與三樓電扶梯位置圖"
                width={686}
                height={646}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從東棟側的戶外入口進入後，搭電扶梯上 3F，才會接上空中庭園專用動線。</figcaption>
            </figure>

            <p>如果你從西棟 27F 的絹谷幸二天空美術館過來，要先回到地面、繞到東棟側專用入口再進場。兩個景點同一棟建築群，卻不是在室內直接相通的展望台入口。</p>
          </div>
        </section>

        <section className="seo-content" id="observatory-route" aria-label="梅田空中庭園參觀路線">
          <h2 className="seo-h2">空中庭園參觀路線｜照著 3F → 35F → 39F → 40F → RF 走</h2>
          <div className="seo-prose">
            <p>進到專用入口後，整段路線其實很直覺。先記住 39F 是售票與入場的樓層，40F 才是室內展望台；最上方的戶外空中步道則在屋上 RF。</p>

            <ol>
              <li><strong>先到 3F：</strong>從戶外專用入口進入後，上到空中庭園的專用電梯乘梯處。</li>
              <li><strong>搭專用電梯到 35F：</strong>不要改搭東棟／西棟的一般大樓電梯。</li>
              <li><strong>搭空中手扶梯到 39F：</strong>兩棟之間的空中手扶梯本身就是很有記憶點的一段動線。</li>
              <li><strong>39F 辦理入場：</strong>售票、驗票與商店在這一層；持大阪周遊券也在這裡依當日規則使用。</li>
              <li><strong>到 40F 與屋上 RF：</strong>40F 是室內展望台與 cafe SKY 40；再往上就是能環繞欣賞大阪市景的戶外 Sky Walk。</li>
            </ol>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/umeda-sky-building/observatory-floor-route.png"
                alt="梅田藍天大廈空中庭園從一樓到三樓、三十五樓、三十九樓、四十樓與屋上 Sky Walk 的參觀樓層圖"
                width={1080}
                height={1920}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>先從 3F 搭專用電梯到 35F，再搭空中手扶梯到 39F；40F 是室內展望台，屋上 RF 是戶外 Sky Walk。</figcaption>
            </figure>

            <p>想拍日落到夜景的變化，建議在天色轉暗前先上到 40F 或 RF 找好角度。戶外區風勢與天候感受會比室內明顯，怕冷或遇到天氣不穩時，40F 室內展望台與咖啡廳會是很好的緩衝點。</p>
          </div>
        </section>

        <section className="seo-content" id="amazing-pass" aria-label="大阪周遊券與梅田空中庭園票價">
          <h2 className="seo-h2">大阪周遊券怎麼用？免費入場與看夕陽可以一起安排</h2>
          <div className="seo-prose">
            <p>空中庭園的一般成人票目前為 2,000 日圓。持大阪周遊券可在當日<strong>15:00 前免費入場</strong>；15:00 後則是出示周遊券享一般票價 9 折。重點不是 15:00 前走到大樓，而是要在時間前完成空中庭園入場。</p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">入場時間</th>
                    <th scope="col">大阪周遊券優惠</th>
                    <th scope="col">最適合的玩法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15:00 前</td>
                    <td>免費入場</td>
                    <td>先入場後慢慢待到夕陽、夜景</td>
                  </tr>
                  <tr>
                    <td>15:00 後</td>
                    <td>一般票價 9 折</td>
                    <td>只想看夜景、行程較晚才到梅田</td>
                  </tr>
                  <tr>
                    <td>一般成人票</td>
                    <td>2,000 日圓</td>
                    <td>沒有使用周遊券或優惠時的參考</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">想先逛美術館、再看夕陽：提早入場才不會少掉免費資格</h3>
            <p>絹谷幸二天空美術館在西棟 27F，也包含在大阪周遊券適用設施中。最順的排法是下午先看美術館，<strong>約 14:30 左右離開並繞到東棟側專用入口，於 15:00 前完成空中庭園入場</strong>；進去後可留在 40F 咖啡廳或屋上等日落。這樣能把兩個景點排在同一天，也不會因為等夕陽才入場而錯過免費資格。</p>

            <p>
              還在比較周遊券是否值得買，可以回看
              <a href="/osaka/osaka-amazing-pass?from=umeda-sky-building-guide" data-event="umedasky_amazing_pass_article" data-platform="article" data-section="article_link">
                <strong>大阪周遊券完整攻略</strong>
              </a>
              ；想把這一站放入每日行程，也可從
              <a href="/osaka/pass-map?from=umeda-sky-building-guide" data-event="umedasky_pass_map" data-platform="article" data-section="article_link">
                <strong>大阪周遊券地圖</strong>
              </a>
              查看位置與周邊景點。
            </p>
          </div>
        </section>

        <section className="seo-content" id="itinerary" aria-label="梅田空中庭園行程安排">
          <h2 className="seo-h2">梅田夜景行程怎麼排？把空中庭園放在一天的最後一站</h2>
          <div className="seo-prose">
            <p>梅田白天適合逛商場、百貨與地下街，傍晚再把空中庭園當成收尾。若持大阪周遊券並希望免費入場，關鍵是先在 15:00 前進場，而不是等日落才驗票；進場後保留時間看白天、夕陽、夜景三種城市表情，會比只衝晚上更有層次。</p>
            <p>看完後可回大阪站周邊吃晚餐或搭車回飯店。第一次在梅田轉車，最好預留出站、找入口與回程進站的時間；這裡不是難走，而是出口、商場與地下通道太多，越趕越容易繞路。</p>
          </div>
        </section>

        <SeoFaqSection title="梅田空中庭園常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
