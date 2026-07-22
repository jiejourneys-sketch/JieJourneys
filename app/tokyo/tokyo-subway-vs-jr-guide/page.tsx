import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoSubwayVsJrGuideCanonical,
  tokyoSubwayVsJrGuideDescription,
  tokyoSubwayVsJrGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const videoLinks = [
  {
    label: 'IG｜地鐵 vs JR',
    href: 'https://www.instagram.com/reel/DTVMB2FkTt5/',
    event: 'tokyosubwayvsjr_video_ig',
    platform: 'IG',
    primary: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/shorts/xNN5iQLFGcU',
    event: 'tokyosubwayvsjr_video_youtube',
    platform: 'YouTube',
  },
]

const faqItems = [
  {
    q: '第一次到東京，地鐵和 JR 要分開買票嗎？',
    a: '不用。用 Suica 或 PASMO 這類交通 IC 卡，東京 Metro、都營地鐵與 JR 多數路線都能直接刷進站；差別是在各家公司的路線與票券使用範圍，不是卡片要分開買。',
  },
  {
    q: '東京市區是不是只搭地鐵就夠？',
    a: '很多景點地鐵很方便，但不用刻意避開 JR。山手線、新宿到原宿到澀谷、東京站到上野等方向，JR 可能更直覺。實際照 Google Maps 或乘換案內的最快路線走即可。',
  },
  {
    q: 'Tokyo Subway Ticket 可以搭 JR 嗎？',
    a: '不可以。Tokyo Subway Ticket 只包含東京 Metro 與都營地鐵；要搭 JR、私鐵、百合海鷗或公車，仍要另刷 IC 卡或使用對應票券。',
  },
  {
    q: '只玩東京市區要買 JR Pass 嗎？',
    a: '通常不需要。JR Pass 適合跨城市或長距離移動，是否划算要看完整行程與票價；只在東京市區跑景點，IC 卡或地鐵票通常更合適。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoSubwayVsJrGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoSubwayVsJrGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoSubwayVsJrGuideCanonical,
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

type TokyoSubwayVsJrGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video') return '/osaka/video'
  return '/tokyo/video'
}

export default async function TokyoSubwayVsJrGuidePage({ searchParams }: TokyoSubwayVsJrGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyosubwayvsjr" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京交通攻略"
          h1="東京地鐵 vs JR｜第一次東京怎麼搭？Suica、地鐵券一次搞懂"
          intro="第一次到東京不需要先背整張路線圖。先懂一件事：地鐵適合密集跑市區景點，JR 則常用來接山手線、東京站與近郊方向；用同一張 IC 卡就能彈性搭。"
          eventPrefix="tokyosubwayvsjr"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyosubwayvsjr_hero_quick', platform: 'article' },
            { label: '地鐵與 JR', href: '#comparison', dataEvent: 'tokyosubwayvsjr_hero_compare', platform: 'article' },
            { label: '票券怎麼選', href: '#tickets', dataEvent: 'tokyosubwayvsjr_hero_tickets', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="東京地鐵和JR快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">地鐵</span>
              <strong>密集跑市區景點</strong>
              <p>東京 Metro 9 線、都營地鐵 4 線，共 13 條路線，淺草、銀座、新宿、表參道與六本木都很常用。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">JR</span>
              <strong>接山手線與近郊方向</strong>
              <p>市區不是不能搭 JR；東京站、上野、新宿、原宿、澀谷等方向，JR 常常更直接。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">Suica／PASMO</span>
              <strong>不用分開買票</strong>
              <p>多數東京鐵路都可用交通 IC 卡感應進出站，系統會依實際搭乘路線扣款。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最重要原則</span>
              <strong>看路線，不看公司</strong>
              <p>跟著導航選少走路、少轉乘的班次即可；不用為了「只搭地鐵」刻意繞路。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="地鐵和JR短影音">
          <h2 className="seo-h2">先看短影音：東京地鐵 vs JR</h2>
          <div className="seo-prose">
            <p>影片先幫你抓大方向；真正出發時，直接把目的地丟進導航，看哪一條路線少走路、少轉車，就搭哪一條。</p>
            <SeoVideoLinkMenu label="地鐵 vs JR" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="東京地鐵和JR比較">
          <h2 className="seo-h2">東京交通怎麼分：地鐵是市區網，JR 是另一套鐵路網</h2>
          <div className="seo-prose">
            <p>
              東京地下鐵由 <strong>Tokyo Metro</strong> 與 <strong>都營地鐵</strong> 營運；兩者加起來共有 13 線。東京 Metro 一般單程票依距離為 180 到 330 日圓，IC 卡則是 178 到 324 日圓。這是地鐵的基本票價概念，實際仍以當天查詢結果為準。
            </p>
            <p>
              <strong>JR</strong> 則是另一個鐵路系統。第一次到東京最容易遇到的是山手線（JY），它把東京、上野、池袋、新宿、原宿、澀谷、品川等大站串成一圈；中央線、京濱東北線、總武線等也常會用到。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>比較項目</th>
                    <th>地鐵：Tokyo Metro／都營</th>
                    <th>JR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>最適合</td>
                    <td>市區景點之間短距離移動；站點密、出口多。</td>
                    <td>山手線周邊、大站之間、機場或近郊銜接。</td>
                  </tr>
                  <tr>
                    <td>第一次最常見</td>
                    <td>銀座線、丸之內線、日比谷線、半藏門線、淺草線、大江戶線。</td>
                    <td>山手線（JY）、中央線、京濱東北線、總武線。</td>
                  </tr>
                  <tr>
                    <td>票價</td>
                    <td>依距離計算；東京 Metro 短程普通票 180 日圓起。</td>
                    <td>同樣依距離與路線計算，不能用「JR 一定比較貴」判斷。</td>
                  </tr>
                  <tr>
                    <td>IC 卡</td>
                    <td>Suica／PASMO 可刷。</td>
                    <td>Suica／PASMO 可刷，多數市區普通與快速列車直接進站。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              路線圖上，Tokyo Metro 常用圓形加英文字母辨識，例如銀座線是 G；JR 山手線則常看到 JY。辨識符號有幫助，但真正決定你要搭哪一班的，還是目的地、出口與轉乘次數。
            </p>
          </div>
        </section>

        <section className="seo-content" id="tickets" aria-label="東京交通票券怎麼選">
          <h2 className="seo-h2">Suica、Tokyo Subway Ticket、JR Pass 怎麼選？</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">Suica／PASMO：不想算票最輕鬆</h3>
            <p>
              行程鬆、一天搭車次數不多，或會混搭地鐵、JR、私鐵與公車時，交通 IC 卡最省心。PASMO 可在東京地鐵使用，也可在支援互通的多數鐵路與巴士路線使用。
            </p>

            <h3 className="seo-h3">Tokyo Subway Ticket：只適合地鐵密集日</h3>
            <p>
              這張票可不限次數搭乘 Tokyo Metro 與都營地鐵，<strong>不能搭 JR</strong>。如果連續幾天都在市區密集跑景點，再把每天的地鐵趟數算進去；完整票價與回本方式可看
              <a href="/tokyo/tokyo-subway-ticket?from=tokyo-subway-vs-jr-guide" data-event="tokyosubwayvsjr_subway_ticket_article" data-platform="article" data-section="article_link">
                <strong> 東京地鐵券完整攻略</strong>
              </a>
              。
            </p>

            <h3 className="seo-h3">JR Pass：跨城市或長距離才開始試算</h3>
            <p>
              JR Pass 不是「東京市區交通吃到飽」。有東京到京都、大阪、廣島等長距離行程，或搭配特定 JR 區域 Pass 時才值得比較總票價；只跑東京市區，通常先用 IC 卡或地鐵票更實際。
            </p>

          </div>
        </section>

        <section className="seo-content" aria-label="地鐵和JR結論">
          <h2 className="seo-h2">結論：東京不用選邊站，先看哪條路最順</h2>
          <div className="seo-prose">
            <p>
              第一次東京的簡單做法是：先準備 Suica 或 PASMO；市區景點密集時優先看地鐵；看到山手線或 JR 路線剛好直達時就直接搭 JR。真正需要精算的只有地鐵多日券與 JR Pass，其他時候跟著導航走，就已經很夠用。
            </p>
          </div>
        </section>

        <SeoFaqSection title="東京地鐵 vs JR 常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
