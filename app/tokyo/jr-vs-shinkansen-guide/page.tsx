import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  jrVsShinkansenGuideCanonical,
  jrVsShinkansenGuideDescription,
  jrVsShinkansenGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const videoLinks = [
  {
    label: 'IG｜JR vs 新幹線',
    href: 'https://www.instagram.com/reel/DVBVYRckTUG/',
    event: 'tokyojrvsxgx_video_ig',
    platform: 'IG',
    primary: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/shorts/j_Ws48TTzbE',
    event: 'tokyojrvsxgx_video_youtube',
    platform: 'YouTube',
  },
]

const faqItems = [
  {
    q: '新幹線和 JR 是不同公司嗎？',
    a: '不是。JR 是鐵路集團與路線系統的總稱；新幹線是 JR 各公司營運的高速鐵路服務。旅行時可先把它理解成：JR 裡面有新幹線，也有在來線。',
  },
  {
    q: '普通、快速、急行、特急的速度一定固定嗎？',
    a: '不一定。大方向是停靠站越少通常越快，但各路線班次與停站規則不同；搭車前務必看目的地、列車名稱與停靠站，不要只憑「快速」或「急行」字樣判斷。',
  },
  {
    q: '搭特急或新幹線要買幾張票？',
    a: '一般需要基本乘車券加上特急券；指定席、綠色車廂等再依條件加購。市區的普通或快速列車，多半只要 IC 卡或基本乘車券即可。',
  },
  {
    q: 'JR Pass 真的不能搭希望號 Nozomi 和瑞穗號 Mizuho 嗎？',
    a: '一般 JR Pass 本身不涵蓋希望號與瑞穗號，但持 Pass 者可另購「Nozomi Mizuho Ticket」專用加價券後搭乘。是否值得加購，要看你的時間與路線。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: jrVsShinkansenGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: jrVsShinkansenGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: jrVsShinkansenGuideCanonical,
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

type JrVsShinkansenGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video') return '/osaka/video'
  return '/tokyo/video'
}

export default async function JrVsShinkansenGuidePage({ searchParams }: JrVsShinkansenGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyojrvsxgx" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="日本鐵路攻略"
          h1="JR vs 新幹線｜在來線、特急、快速、普通怎麼分？"
          intro="JR 不是一種列車，新幹線也不是唯一的 JR。第一次日本自由行，只要先分清楚市區普通／快速、長距離特急與新幹線，再知道何時需要特急券，就不會在買票時卡住。"
          eventPrefix="tokyojrvsxgx"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyojrvsxgx_hero_quick', platform: 'article' },
            { label: '列車怎麼分', href: '#train-types', dataEvent: 'tokyojrvsxgx_hero_types', platform: 'article' },
            { label: '車票與 JR Pass', href: '#tickets', dataEvent: 'tokyojrvsxgx_hero_tickets', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="JR和新幹線快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">JR</span>
              <strong>是鐵路系統，不是一種車</strong>
              <p>JR 裡面同時有市區在來線、特急列車與新幹線；看到 JR 不代表一定是長途車。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">短距離市區</span>
              <strong>普通、快速最常見</strong>
              <p>多半用 Suica／PASMO 或基本乘車券就能搭，山手線就是最常見的例子。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">長距離</span>
              <strong>特急與新幹線要加特急券</strong>
              <p>基本乘車券之外，通常還要購買對應的特急券；指定席與綠色車廂規則再另計。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">JR Pass</span>
              <strong>希望號、瑞穗號可加購搭乘</strong>
              <p>Pass 本身不含，但可以在有效期內另購 Pass 專用 Nozomi Mizuho Ticket。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="JR和新幹線短影音">
          <h2 className="seo-h2">先看短影音：JR vs 新幹線</h2>
          <div className="seo-prose">
            <p>影片先把名稱與票券概念拆開；下一次看到月台上的「快速」、「特急」或「新幹線」，就知道該先看什麼。</p>
            <SeoVideoLinkMenu label="JR vs 新幹線" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="train-types" aria-label="JR列車種類比較">
          <h2 className="seo-h2">日本 JR 怎麼分：先分新幹線與在來線</h2>
          <div className="seo-prose">
            <p>
              最簡單的理解是：<strong>新幹線</strong>負責城市之間的高速長距離移動；<strong>在來線</strong>是既有鐵路網，涵蓋市區通勤、普通、快速、特急與部分觀光列車。特急、快速、普通不是全日本一致的速度等級，而是各路線的停靠方式。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>列車類型</th>
                    <th>常見用途</th>
                    <th>車票重點</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>新幹線</td>
                    <td>東京到京都、大阪、名古屋、仙台等長距離城市移動。</td>
                    <td>基本乘車券＋新幹線特急券；座位依班次有自由席、指定席等選擇。</td>
                  </tr>
                  <tr>
                    <td>特急</td>
                    <td>機場、近郊或城市間較快移動，例如成田特快、富士回遊、梓號。</td>
                    <td>基本乘車券＋特急券；部分列車全車指定席，先確認座位規則。</td>
                  </tr>
                  <tr>
                    <td>急行</td>
                    <td>停靠站比普通少的在來線類型；現今可遇到的班次相對少。</td>
                    <td>有些路線需要急行券，不能只看名稱猜，請以該班車規則為準。</td>
                  </tr>
                  <tr>
                    <td>快速／普通</td>
                    <td>東京市區與近距離移動最常見。快速停站較少，普通各站皆停。</td>
                    <td>通常只要 IC 卡或基本乘車券；山手線屬市區普通列車的使用情境。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              常見口訣可記成「新幹線、特急、急行、快速、普通」，但它不是跨全日本的絕對速度排名。尤其快速有各種特快、通勤快速、區間快速等名稱；出發前看導航顯示的<strong>抵達時間、月台與停靠站</strong>最可靠。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tickets" aria-label="JR車票和JR Pass規則">
          <h2 className="seo-h2">實際搭乘怎麼買：先分基本乘車券與特急券</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">市區普通／快速：IC 卡通常就能解決</h3>
            <p>
              東京市區短距離，例如山手線、中央線快速或總武線快速，通常刷 Suica／PASMO 就能直接進站。JR 東日本也將在來線的快速與普通列車列為基本乘車券／IC 卡可搭的類型。
            </p>

            <h3 className="seo-h3">特急與新幹線：基本乘車券之外，還要特急券</h3>
            <p>
              特急和新幹線通常由兩個部分組成：<strong>基本乘車券</strong>是你從 A 到 B 的移動資格；<strong>特急券</strong>則是搭乘快速服務或座位的加價。若選指定席、綠色車廂等，依列車與票種還會有對應條件。
            </p>

            <h3 className="seo-h3">JR Pass：希望號 Nozomi、瑞穗號 Mizuho 的正確規則</h3>
            <p>
              Japan Rail Pass 本身不涵蓋東海道、山陽、九州新幹線的希望號與瑞穗號；但 Pass 持有人可在 Pass 有效期內，另購專用的 <strong>Nozomi Mizuho Ticket</strong> 後搭乘。若不想加購，就選 Pass 可直接搭的其他新幹線班次，並把轉乘時間一起算進去。
            </p>

          </div>
        </section>

        <section className="seo-content" aria-label="JR和新幹線結論">
          <h2 className="seo-h2">結論：市區刷 IC 卡，長距離再看特急券與 Pass</h2>
          <div className="seo-prose">
            <p>
              在東京市區，先把 JR 當作另一套很好用的鐵路網，普通或快速列車直接刷 IC 卡即可。要去富士山、日光、伊豆、京都或大阪時，再確認是不是特急或新幹線、是否需要特急券，最後才試算 JR Pass；這樣買票會最不容易多花錢。
            </p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="東京市區交通也一起看"
          intro="新幹線適合城市間移動，東京市區則要另外看地鐵、JR 與住宿所在區域；兩段交通分開規劃最不容易買錯。"
          links={[
            { label: '東京交通整理', href: '/tokyo/transport', event: 'jrvsshinkansen_related_transport', primary: true },
            { label: '東京地鐵 vs JR 攻略', href: '/tokyo/tokyo-subway-vs-jr-guide?from=jr-vs-shinkansen', event: 'jrvsshinkansen_related_subwayjr' },
            { label: '東京票券總整理', href: '/tokyo/ticket', event: 'jrvsshinkansen_related_ticket' },
          ]}
        />
        <SeoFaqSection title="JR vs 新幹線常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
