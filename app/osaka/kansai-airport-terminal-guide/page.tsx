import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  kansaiAirportTerminalGuideCanonical,
  kansaiAirportTerminalGuideDescription,
  kansaiAirportTerminalGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

const videoLinks = [
  {
    label: 'IG Reels',
    href: 'https://www.instagram.com/reel/DZzv-KlBF65/',
    event: 'kixterminal_video_ig',
    platform: 'IG',
    primary: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/shorts/RLZ9aIn_BUg',
    event: 'kixterminal_video_youtube',
    platform: 'YouTube',
  },
]

const faqItems = [
  {
    q: '關西機場搭鐵路要在哪一個航廈下車？',
    a: '鐵路的關西機場站在第一航廈與 Aeroplaza 一側。從 T1 可經 2F 連通通道前往；若航班在 T2，先搭免費接駁車到 Aeroplaza／T1，再走去鐵路站。',
  },
  {
    q: 'HARUKA 可以直達奈良或神戶嗎？',
    a: '不可以把 HARUKA 當成直達奈良、神戶的列車。HARUKA 主要直達天王寺、大阪、新大阪、京都；要去奈良或神戶，需再轉乘，或比較是否有更順的利木津巴士。',
  },
  {
    q: '第二航廈可以直接搭利木津巴士嗎？',
    a: '有些目的地可在 T2 外的巴士站直接上車；其餘路線需先搭免費接駁車到 T1 的 1F。不要只看目的地，出發前也要確認當日班次與上車航廈。',
  },
  {
    q: '第一航廈到第二航廈的接駁車要多久？',
    a: '免費接駁車在 Aeroplaza 1F 與 T2 間行駛，車程約 7 到 9 分鐘；加上等車與走路時間，轉航廈請預留至少 20 分鐘。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kansaiAirportTerminalGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kansaiAirportTerminalGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kansaiAirportTerminalGuideCanonical,
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

type KansaiAirportTerminalGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'osaka-video') return '/osaka/video'
  if (value === 'kansai-airport-to-osaka') return '/osaka/kansai-airport-to-osaka'
  return '/osaka'
}

export default async function KansaiAirportTerminalGuidePage({ searchParams }: KansaiAirportTerminalGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="kixterminal" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪機場攻略"
          h1="大阪關西機場攻略｜第一航廈 T1 vs 第二航廈 T2、鐵路與接駁一次懂"
          intro="關西機場最容易卡住的不是買票，而是先搞錯航廈。第一航廈能直接接 JR、南海與市區巴士；第二航廈動線簡單，但要搭鐵路時必須先轉免費接駁車。這篇把抵達、出境與轉航廈一次講清楚。"
          eventPrefix="kixterminal"
          showVisual={false}
          ctaLinks={[
            { label: '第一航廈 T1', href: '#terminal-1', dataEvent: 'kixterminal_hero_t1', platform: 'article' },
            { label: '第二航廈 T2', href: '#terminal-2', dataEvent: 'kixterminal_hero_t2', platform: 'article' },
            { label: '進市區怎麼搭', href: '/osaka/kansai-airport-to-osaka?from=kansai-airport-terminal-guide', dataEvent: 'kixterminal_hero_city', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="關西機場航廈快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">第一航廈 T1</span>
              <strong>鐵路、巴士都在這一側</strong>
              <p>1F 是到達與市區巴士，2F 經連通通道走往關西機場站，4F 是國際線出發。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">第二航廈 T2</span>
              <strong>動線單純、以接駁為核心</strong>
              <p>旅客流程主要在同一層完成；想搭鐵路要先搭免費接駁車去 T1／Aeroplaza。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">去難波</span>
              <strong>南海 Rapi:t</strong>
              <p>主要停新今宮、難波；適合住難波、心齋橋、日本橋一帶。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">去大阪、京都</span>
              <strong>JR HARUKA</strong>
              <p>主要接天王寺、大阪、新大阪、京都；奈良和神戶要再轉乘或改搭巴士。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="關西機場航廈短影音">
          <h2 className="seo-h2">先看短影音：關西機場第一航廈 vs 第二航廈</h2>
          <div className="seo-prose">
            <p>影片先帶你認識 T1、T2 的位置和接駁概念；真的抵達時，再照下方樓層與交通方式找，就不會拖著行李在航廈之間繞路。</p>
            <SeoVideoLinkMenu label="大阪關西機場｜T1 vs T2" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="terminal-1" aria-label="關西機場第一航廈攻略">
          <h2 className="seo-h2">第一航廈 T1｜入境、鐵路、市區巴士、出境都在這裡</h2>
          <div className="seo-prose">
            <p>
              大多數第一次到關西機場的旅客會在 T1 活動。只要記住<strong>「入境先到 1F、搭鐵路往 2F、出境上 4F」</strong>，就能把方向抓住；餐飲、購物與飯店連通則集中在 2F 和 Aeroplaza 一帶。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kansai-airport-terminal/terminal-1-floor-guide.jpg"
                alt="關西機場第一航廈樓層導覽：1F 到達與巴士、2F 鐵路與第二航廈、4F 國際線出發"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>第一航廈最實用的記法：1F 入境與巴士、2F 接鐵路與 T2 接駁、4F 國際線出境。</figcaption>
            </figure>

            <h3 className="seo-h3">1F：入境大廳與利木津巴士</h3>
            <p>國際線抵達、領完行李出關後會到 1F。要搭利木津巴士進大阪、京都、奈良、神戶等方向，先往航廈外側的巴士乘車處走；售票窗口與自動售票機也集中在這一帶。</p>

            <h3 className="seo-h3">2F：經連通通道走到關西機場站</h3>
            <p>想搭鐵路，請往 2F 的連通通道前進，穿過後就是 JR 與南海電鐵的關西機場站。這一層也能接 Aeroplaza、飯店與前往第二航廈的免費接駁車方向。</p>

            <h3 className="seo-h3">4F：國際線出境大廳</h3>
            <p>要離開日本時，直接以航空公司航班資訊為準前往 4F 辦理報到、托運與安檢。不要因為在 2F 吃飯或買東西，就忘記替搭電扶梯、排隊與走到登機門留時間。</p>
          </div>
        </section>

        <section className="seo-content" id="railway" aria-label="關西機場鐵路攻略">
          <h2 className="seo-h2">從 T1 怎麼走到鐵路？Rapi:t 和 HARUKA 不要搭反</h2>
          <div className="seo-prose">
            <p>抵達 T1 後，走 2F 連通通道就會到關西機場站；JR 與南海都在同一站區，但目的地方向不同。先看你住哪裡，再決定走哪一個閘口或售票處。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kansai-airport-terminal/terminal-1-railway-and-bus.jpg"
                alt="關西機場第一航廈一樓巴士與二樓關西機場站連通位置圖"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>從 T1 的 2F 走往鐵路站；市區利木津巴士則在 1F 航廈外側搭乘。</figcaption>
            </figure>

            <h3 className="seo-h3">南海電鐵 Rapi:t：新今宮、難波最順</h3>
            <p>住新今宮、難波、心齋橋、日本橋的人，Rapi:t 通常最直接。它是全車指定席的機場特急，主要停靠新今宮、難波；不住南大阪時，不用為了列車外型硬選它。</p>

            <h3 className="seo-h3">JR 關西機場特快 HARUKA：天王寺、大阪、新大阪、京都</h3>
            <p>住天王寺、大阪站、新大阪或第一晚直接去京都時，HARUKA 會比較順。它主要接這幾個 JR 大站；<strong>奈良與神戶不是 HARUKA 直達</strong>，要再轉乘，或比較利木津巴士是否更符合你的住宿位置。</p>

            <p>
              住宿區域已經決定、想比較票券與市區交通的話，接著看
              <a href="/osaka/kansai-airport-to-osaka?from=kansai-airport-terminal-guide" data-event="kixterminal_city_transport" data-platform="article" data-section="article">
                <strong>關西機場到大阪市區｜Rapi:t、HARUKA、利木津巴士怎麼選？</strong>
              </a>
              。
            </p>
          </div>
        </section>

        <section className="seo-content" id="terminal-2" aria-label="關西機場第二航廈攻略">
          <h2 className="seo-h2">第二航廈 T2｜一層式動線，先搞懂免費接駁車</h2>
          <div className="seo-prose">
            <p>第二航廈的旅客動線比 T1 單純，出境、抵達與巴士都集中在同一層周邊。重點是：<strong>T2 沒有鐵路站</strong>。想搭 JR、南海，或要到 T1 辦事，就先找免費接駁車。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kansai-airport-terminal/terminal-2-guide.jpg"
                alt="關西機場第二航廈出境、入境、利木津巴士與免費接駁車位置圖"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>第二航廈的出境、抵達、利木津巴士與前往 T1 的免費接駁車都在同一層周邊。</figcaption>
            </figure>

            <h3 className="seo-h3">出境：下接駁車後直接進航廈辦理登機</h3>
            <p>從 T1 轉到 T2 時，接駁車下車後跟著 Departures／航空公司櫃檯方向走即可。因為航廈比 T1 小，找櫃檯不難，但廉航報到與托運截止時間通常不能抓太緊。</p>

            <h3 className="seo-h3">入境：出關後旁邊就是轉乘動線</h3>
            <p>抵達 T2、出關後，先確認是否有你的直達巴士；若要搭鐵路或目的地巴士沒有在 T2 上車，就直接往免費接駁車方向走，不需要先繞進 T1 航廈。</p>

            <h3 className="seo-h3">利木津巴士：有些路線可直搭，其他先到 T1</h3>
            <p>T2 外有利木津巴士站，部分目的地可直接搭；其餘路線要先轉到 T1 的 1F。抵達當天請看目的地、上車航廈與班次，不要只看到「有利木津巴士」就先排隊。</p>
          </div>
        </section>

        <section className="seo-content" id="shuttle" aria-label="關西機場航廈免費接駁車">
          <h2 className="seo-h2">T1、關西機場站到 T2：免費接駁車這樣搭</h2>
          <div className="seo-prose">
            <p>免費接駁車往返 Aeroplaza 與 T2，車程約 7 到 9 分鐘。從 T1／關西機場站過去，先走到 <strong>Aeroplaza 1F</strong> 的接駁站；從 T2 回 T1／關西機場站，則在 T2 航廈外的接駁站上車。</p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/kansai-airport-terminal/terminal-1-to-terminal-2-shuttle.jpg"
                alt="關西機場第一航廈與第二航廈免費接駁車位置示意圖"
                width={3024}
                height={4032}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>關西機場站與 T1 一側要在 Aeroplaza 1F 搭接駁車；T2 則在航廈外直接上車。</figcaption>
            </figure>

            <p>轉航廈時不要只抓車程。加上從入境大廳走到站牌、等車、下車後再走進航廈，建議至少預留 20 分鐘；若是趕航空公司報到或登機，更應拉長緩衝。</p>
          </div>
        </section>

        <section className="seo-content" aria-label="關西機場航廈最後確認">
          <h2 className="seo-h2">最後記這 4 句，抵達關西機場就不會慌</h2>
          <div className="seo-prose">
            <ol>
              <li><strong>先看航班在哪個航廈：</strong>不要只看「關西機場」，T1 和 T2 的交通起點不同。</li>
              <li><strong>要搭鐵路就先到 T1／關西機場站：</strong>T2 先搭免費接駁車，不要在航廈裡找 JR 或南海閘口。</li>
              <li><strong>去難波選 Rapi:t、去大阪站／京都選 HARUKA：</strong>奈良與神戶再轉乘或看巴士，不要誤以為 HARUKA 直達。</li>
              <li><strong>巴士先看上車航廈：</strong>T2 有些路線能直搭，其餘從 T1 1F 出發。</li>
            </ol>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="離開航廈後，接著看哪一頁？"
          intro="看懂第一航廈或第二航廈的動線後，下一步就是依住宿區域選 Rapi:t、HARUKA、巴士或包車；也可以先看大阪交通和住宿位置。"
          links={[
            { label: '關西機場到大阪交通', href: '/osaka/kansai-airport-to-osaka?from=kix-terminal', event: 'kixterminal_related_transport', primary: true },
            { label: '大阪交通整理', href: '/osaka/transport', event: 'kixterminal_related_osakatransport' },
            { label: '大阪住宿地圖', href: '/osaka/hotel', event: 'kixterminal_related_hotel' },
          ]}
        />
        <SeoFaqSection title="大阪關西機場航廈常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
