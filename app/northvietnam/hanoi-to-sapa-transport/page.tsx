import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  hanoiToSapaTransportCanonical,
  hanoiToSapaTransportDescription,
  hanoiToSapaTransportTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  return (
    <div className="seo-buy-links seo-action-links" aria-label={label}>
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.href)
        return (
          <a
            key={`${link.label}-${link.href}`}
            className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
            href={link.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            data-event={link.event}
            data-platform={link.platform}
            data-section="article_link"
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

const linkGroups = {
  videos: [
    { label: 'IG Reels', href: 'https://www.instagram.com/reel/DSfHYvuEVEW/', event: 'northvietnam_sapa_transport_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/jvAutp4FnZY', event: 'northvietnam_sapa_transport_video_yt', platform: 'YouTube' },
  ],
  bus: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/153323-hanoi-sapa-sleeper-bus-ticket-vietnam?cid=22312', event: 'northvietnam_sapa_bus_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133909-hanoi-sapa-sleeper-bus-by-hk-buslines/?aid=93798', event: 'northvietnam_sapa_bus_klook', platform: 'KLOOK' },
  ],
  privateTransfer: [
    { label: 'KLOOK包車', href: 'https://www.klook.com/zh-TW/activity/6363-private-city-transfer-hanoi-other-areas/?aid=93798', event: 'northvietnam_sapa_private_klook', platform: 'KLOOK', primary: true },
  ],
  train: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/152771-premiere-sleeper-train-ticket-hanoi-sapa?cid=22312', event: 'northvietnam_sapa_train_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/22928-viet-nam-rail-deluxe-train-sapa-hanoi/?aid=93798', event: 'northvietnam_sapa_train_klook', platform: 'KLOOK' },
  ],
  laoCaiTransfer: [
    { label: 'KLOOK老街轉沙壩', href: 'https://www.klook.com/zh-TW/activity/127301-lao-cai-sapa-shared-or-private-transfer-to-lao-cai-train-station/?aid=93798', event: 'northvietnam_lao_cai_sapa_klook', platform: 'KLOOK', primary: true },
  ],
}

const faqItems = [
  {
    q: '河內到沙壩最快是哪一種交通？',
    a: '臥舖巴士和包車通常都是約 5 到 6 小時，會受出發地點、路況和休息站停留時間影響。想省錢選臥舖巴士；想舒服、門到門接送就選包車。',
  },
  {
    q: '河內有火車直達沙壩嗎？',
    a: '沒有。火車是從河內到老街（Lao Cai），抵達老街後還要再轉車約 1 小時上山到沙壩市區。',
  },
  {
    q: '臥舖巴士中途可以上廁所嗎？',
    a: '大多數河內到沙壩巴士中途會安排休息站，常見是停 2 次左右，可上廁所、買水或簡單伸展；實際仍以當天車公司安排為準。',
  },
  {
    q: '臥舖火車比較便宜嗎？',
    a: '不一定。觀光客常訂的軟臥或觀光車廂通常不便宜，還要加上老街到沙壩的轉車費。火車比較適合想體驗夜行火車、或想把移動時間放在晚上的人。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: hanoiToSapaTransportTitle.replace(' | JieJourneys(旅杰)', ''),
  description: hanoiToSapaTransportDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: hanoiToSapaTransportCanonical,
  author: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'JieJourneys(旅杰)',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/og-share.png`,
    },
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

type HanoiToSapaTransportPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'northvietnam-video') return '/northvietnam/video'
  if (value === 'transport' || value === 'northvietnam-transport') return '/northvietnam/transport'
  return '/northvietnam'
}

export default async function HanoiToSapaTransportPage({ searchParams }: HanoiToSapaTransportPageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CitySubpageHeader backHref={backHref} eventPrefix="northvietnamsapatransport" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="北越沙壩交通攻略"
          h1="河內到沙壩交通方式比較｜臥舖巴士、包車、臥舖火車怎麼選？"
          intro="前往沙壩主要有三種方式：臥舖巴士最省錢、包車最舒適、臥舖火車最有體驗感。這篇用車程、舒適度、價格和適合族群幫你快速選。"
          eventPrefix="northvietnamsapatransport"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'northvietnamsapatransport_hero_quick', platform: 'article' },
            { label: '方式比較', href: '#comparison', dataEvent: 'northvietnamsapatransport_hero_comparison', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'northvietnamsapatransport_hero_links', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="河內到沙壩交通快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">省錢首選</span>
              <strong>臥舖巴士</strong>
              <p>約 5 到 6 小時直達沙壩市區，班次多、價格最低，中途通常會停休息站。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最舒適</span>
              <strong>包車</strong>
              <p>約 6 小時，出發時間彈性最高，適合親子、長輩、多人同行和行李多的人。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想體驗</span>
              <strong>臥舖火車</strong>
              <p>河內到老街約 8 小時，再轉車約 1 小時到沙壩，適合想搭夜行火車的人。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最後判斷</span>
              <strong>看預算與體力</strong>
              <p>想省錢選巴士；想舒服選包車；想把移動變成旅程體驗再選火車。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="沙壩交通短影音">
          <h2 className="seo-h2">先看短影音：沙壩 3 種交通方式</h2>
          <div className="seo-prose">
            <p>
              想先用一分鐘抓方向，可以先看「沙壩 3 種交通方式」短影音，再回來對照這篇的表格和購票連結。
            </p>
            <SeoVideoLinkMenu label="沙壩交通" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="河內到沙壩交通比較表">
          <h2 className="seo-h2">3 種方式比較：你適合哪一種？</h2>
          <div className="seo-prose">
            <p>
              沙壩交通可以先分成兩個方向：直接從河內到沙壩市區，或先到老街再轉車上山。實際規劃時，我會把「總車程、睡眠品質、抵達後體力」一起看。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>交通方式</th>
                    <th>車程</th>
                    <th>優點</th>
                    <th>缺點</th>
                    <th>適合族群</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>臥舖巴士</td>
                    <td>約 5 到 6 小時</td>
                    <td>最便宜、班次最多、可直達沙壩市區。</td>
                    <td>空間較小，睡眠品質看車型和鄰座運氣。</td>
                    <td>想省錢、預算有限、可接受長途巴士的人。</td>
                  </tr>
                  <tr>
                    <td>包車</td>
                    <td>約 6 小時</td>
                    <td>最舒服、時間彈性最高、門到門接送。</td>
                    <td>價格較高，遇山路或塞車仍要多抓緩衝。</td>
                    <td>親子、長輩、多人同行、行李多、想方便的人。</td>
                  </tr>
                  <tr>
                    <td>臥舖火車</td>
                    <td>河內到老街約 8 小時，再轉車約 1 小時</td>
                    <td>可睡一晚、有廁所、夜行火車體驗感強。</td>
                    <td>無法洗澡、噪音較明顯、只到老街、價格不一定便宜。</td>
                    <td>想體驗火車夜行、想把白天留給行程的人。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="河內到沙壩交通購票連結">
          <h2 className="seo-h2">購票與預訂連結</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1. 臥舖巴士：便宜、直達、最常見</h3>
            <p>
              河內到沙壩的臥舖巴士適合大多數第一次去沙壩的人。車程約 5 到 6 小時，通常中途會停 2 個休息站左右，可以上廁所、買水和活動身體。缺點是座位空間有限，如果你很在意睡眠品質，建議選評價較好的車型或改看包車。
            </p>
            <ul>
              <li>優點：最便宜、班次最多、直達沙壩市區。</li>
              <li>缺點：空間較小，夜車不一定真的睡得好。</li>
              <li>提醒：訂票前確認上車地點、下車點和行李規則。</li>
            </ul>
            <ActionLinks label="河內到沙壩臥舖巴士" links={linkGroups.bus} />

            <h3 className="seo-h3">2. 包車：舒服、彈性高、多人最省心</h3>
            <p>
              包車的優勢是出發時間和上下車地點都比較彈性，飯店出發、飯店抵達，對親子、長輩或行李多的人很友善。車程同樣約 6 小時，中途也能安排休息站。缺點就是價格比較高，一兩個人旅行不一定划算。
            </p>
            <ul>
              <li>優點：門到門最方便，可自訂出發時間。</li>
              <li>缺點：費用較高，山路車程還是會累。</li>
              <li>提醒：多人分攤後再和巴士、火車總價一起比。</li>
            </ul>
            <ActionLinks label="河內到沙壩包車" links={linkGroups.privateTransfer} />

            <h3 className="seo-h3">3. 臥舖火車：到老街後再轉車上沙壩</h3>
            <p>
              火車不是直接到沙壩，而是先到老街（Lao Cai），再轉車上山到沙壩市區。適合想體驗越南夜行火車的人，尤其是想把交通時間安排在晚上，白天保留給沙壩景點。但火車上不能洗澡、車廂有聲音，抵達後還要再轉車，體力要自己評估。
            </p>
            <ul>
              <li>優點：能睡一晚、有廁所、體驗感強。</li>
              <li>缺點：無法洗澡、噪音大、只到老街、晚上出發為主。</li>
              <li>提醒：別忘了另外安排老街到沙壩的接駁。</li>
            </ul>
            <ActionLinks label="河內到老街臥舖火車" links={linkGroups.train} />
            <ActionLinks label="老街到沙壩轉車" links={linkGroups.laoCaiTransfer} />
          </div>
        </section>

        <section className="seo-content" aria-label="沙壩交通行程安排建議">
          <h2 className="seo-h2">我會怎麼安排？看抵達後要不要立刻玩</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">當天還想有體力玩：白天巴士或包車</h3>
            <p>
              如果你抵達沙壩後還想逛市區、去 Moana、湖邊散步或吃飯，白天出發會比較穩。巴士便宜，包車舒服，兩者都比夜車抵達後直接硬排行程更好掌控體力。
            </p>

            <h3 className="seo-h3">想省一晚住宿：火車或夜巴可以考慮，但不要排太滿</h3>
            <p>
              夜行移動表面上省時間，但睡眠品質不一定好。尤其沙壩景點很多會爬坡、走山路，像貓貓村、番西邦峰都很耗體力。若你搭夜車抵達，第一天建議排輕鬆一點，不要一早就衝高強度景點。
            </p>

            <h3 className="seo-h3">親子長輩或 3 到 4 人以上：先估包車</h3>
            <p>
              只看單人票價，包車一定比較貴；但如果多人分攤，外加不用拖行李、可自行安排休息，舒適度會差很多。尤其北越行程如果還接下龍灣、陸龍灣，體力保存很重要。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="沙壩交通最後結論">
          <h2 className="seo-h2">最後用一句話收斂</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>省錢、班次多、想直達沙壩市區：選臥舖巴士。</li>
              <li>親子長輩、多人同行、行李多、想舒服：選包車。</li>
              <li>想體驗夜行火車、能接受轉車與噪音：選臥舖火車。</li>
              <li>搭火車一定要記得：河內只到老街，還要再轉車上沙壩。</li>
              <li>沙壩景點耗體力，夜車抵達第一天不要排太硬。</li>
            </ul>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="選好車後，再把北越行程排進地圖"
          intro="先用北越交通頁比較河內市區移動與沙壩接駁，再打開地圖確認住宿、車站和景點的位置。"
          links={[
            { label: '北越交通整理', href: '/northvietnam/transport', event: 'hanoisapa_related_transport', primary: true },
            { label: '北越旅遊地圖', href: '/northvietnam/map?from=hanoi-to-sapa', event: 'hanoisapa_related_map' },
            { label: '北越票券總整理', href: '/northvietnam/ticket', event: 'hanoisapa_related_ticket' },
          ]}
        />
        <SeoFaqSection title="河內到沙壩交通常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
