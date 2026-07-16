import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  visitBusanPassCanonical,
  visitBusanPassDescription,
  visitBusanPassTitle,
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
    <div className="seo-buy-links" aria-label={label}>
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
    { label: 'IG｜通行證重點', href: 'https://www.instagram.com/reel/DUDiZzQkdUe/', event: 'visitbusanpass_video_main_ig', platform: 'IG', primary: true },
    { label: 'IG｜24小時走法', href: 'https://www.instagram.com/reel/DOJBfeBEdwN/', event: 'visitbusanpass_video_24h_ig', platform: 'IG' },
    { label: 'IG｜48小時走法', href: 'https://www.instagram.com/reel/DO0y_wnEUa9/', event: 'visitbusanpass_video_48h_ig', platform: 'IG' },
  ],
  pass: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312', event: 'visitbusanpass_buy_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798', event: 'visitbusanpass_buy_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', event: 'visitbusanpass_buy_trip', platform: 'Trip' },
    { label: '官方', href: 'https://www.visitbusanpass.com/', event: 'visitbusanpass_buy_official', platform: 'Official' },
  ],
  tools: [
    { label: '通行證地圖', href: '/busan/pass-map', event: 'visitbusanpass_tool_passmap', platform: 'map', primary: true },
    { label: '行程排序', href: '/tools/planner?region=busan&source=pass', event: 'visitbusanpass_tool_planner', platform: 'planner' },
    { label: '票券總整理', href: '/busan/ticket?tag=%E9%87%9C%E5%B1%B1%E9%80%9A%E8%A1%8C%E8%AD%89&from=pass-map#ticketListTitle', event: 'visitbusanpass_tool_ticket', platform: 'ticket' },
  ],
  capsule: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/123012-haeundae-blueline-park-sky-capsule-beach-train-ticket?cid=22312', event: 'visitbusanpass_capsule_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/133293-haeundae-blueline-park-ticket-in-busan/?aid=93798', event: 'visitbusanpass_capsule_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/travel-guide/attraction/busan/haeundae-blueline-park-131154386/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051', event: 'visitbusanpass_capsule_trip', platform: 'Trip' },
    { label: '官網', href: 'https://www.bluelinepark.com/eng/booking.do', event: 'visitbusanpass_capsule_official', platform: 'Official' },
  ],
}

const unavailableAttractions = [
  'Yacht Holic',
  '釜山遊艇俱樂部 G',
  '釜山遊艇之旅 The Yacht',
  '釜山遊艇之旅 Y Holic',
  '西面雷射槍競技場',
]

const reservationAttractions = [
  '釜山鑽石灣遊艇',
  'ibgogage（韓服租借）',
  'DiAegg 密室逃脫',
  '衝浪者 松亭店',
  '大榮跆拳道',
  '洛東江生態探訪船',
]

const passAreaGroups = [
  {
    label: 'A 區',
    items: [
      'Skyline Luge 釜山',
      '樂天世界 釜山',
      '衝浪者 松亭店',
      'Busan X the SKY',
      '大藥跆拳道',
      'Spa Land Centum City',
      '衝浪者 多大浦店',
      'Hotel Aqua Palace',
      '釜山鑽石灣遊艇',
      '釜山觀光旅遊巴士',
      'ClubD Oasis',
    ],
  },
  {
    label: 'B 區',
    items: [
      '釜山 Brick Campus',
      '國立釜山科學館',
      'Hillspa',
      '機張九頭山竹林',
      '海雲台海岸列車',
      '松島海上纜車',
      'ibgogage 韓服',
      'Samjeong Tower 雷射槍競技場',
      'Flipbook Studio',
      '國立海洋博物館 4D',
      '太宗台 Danubi 列車',
      '甘川浪漫韓服（租借）',
      '松島雷射槍競技場',
      '洛東江生態探訪船',
      'Museum One',
      'Running Man 體驗館',
      'Arte Museum 釜山',
      '釜山塔',
      'DiAegg 密室逃脫',
      '釜山電影體驗博物館',
      '海雲台 韓服',
      '哲秀與英熙 韓服',
      '松島龍宮廣場',
    ],
  },
]

const faqItems = [
  {
    q: '釜山通行證 24/48 小時和 Big3/Big5 差在哪？',
    a: '24/48 小時是限時型，啟用後在時間內可玩指定 A 區與 B 區景點，單一景點通常以使用一次為主；Big3/Big5 是限制型，Big3 可用 1 個 A 區加 2 個 B 區，Big5 可用 2 個 A 區加 3 個 B 區。',
  },
  {
    q: '釜山通行證包含天空膠囊列車嗎？',
    a: '不包含天空膠囊列車。釜山通行證可使用的藍線公園內容和膠囊列車不是同一件事，想搭天空膠囊列車要另外訂票。',
  },
  {
    q: '釜山通行證要先預約嗎？',
    a: '部分景點需要先預約，尤其是鑽石灣遊艇、韓服租借、密室逃脫、衝浪體驗、跆拳道和洛東江生態探訪船。安排這些景點時，不要等到現場才處理。',
  },
  {
    q: '第一次去釜山，釜山通行證怎麼選最穩？',
    a: '如果你想在兩天內密集玩高價景點，48 小時通常最直覺；如果你只想挑幾個重點、不想被時間追著跑，就看 Big3 或 Big5。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: visitBusanPassTitle.replace(' | JieJourneys(旅杰)', ''),
  description: visitBusanPassDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: visitBusanPassCanonical,
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

type VisitBusanPassPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video') return '/busan/video'
  if (value === 'pass-map') return '/busan/pass-map'
  if (value === 'ticket') return '/busan/ticket'
  return '/busan'
}

export default async function VisitBusanPassPage({ searchParams }: VisitBusanPassPageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="visitbusanpass" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山票券攻略"
          h1="釜山通行證完整整理（一定要看）"
          intro="釜山通行證不是只看價格就好，真正會踩雷的是景點有沒有包含、要不要預約、A區/B區名額怎麼用，以及膠囊列車到底算不算。這篇先把重點整理成能直接排進行程的版本。"
          eventPrefix="visitbusanpass"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'visitbusanpass_hero_quick', platform: 'article' },
            { label: '不能用景點', href: '#unavailable', dataEvent: 'visitbusanpass_hero_unavailable', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'visitbusanpass_hero_links', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山通行證快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">第一次去</span>
              <strong>48 小時最直覺</strong>
              <p>海雲台、東釜山、松島、南浦洞可以分兩天排，時間比較不緊。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">只挑重點</span>
              <strong>Big3 / Big5 看名額</strong>
              <p>Big3 是 1 個 A 區加 2 個 B 區；Big5 是 2 個 A 區加 3 個 B 區。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">先避坑</span>
              <strong>膠囊列車不包含</strong>
              <p>想搭天空膠囊列車要另外買，不能用釜山通行證直接換。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最賺排法</span>
              <strong>先看地圖顏色</strong>
              <p>我會把景點從貴到便宜分紅黃綠，再看位置順不順。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山通行證短影片">
          <h2 className="seo-h2">先看 IG：通行證重點、24 小時、48 小時走法</h2>
          <div className="seo-prose">
            <p>
              如果你想先用短影片抓感覺，先看釜山通行證重點，再看 24 小時和 48 小時走法。看完之後再回來用下面的 A/B 區和地圖排法，就會很快知道自己該買哪一種。
            </p>
            <ActionLinks label="釜山通行證 IG 短影片" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="pass-types" aria-label="釜山通行證票種說明">
          <h2 className="seo-h2">票種先搞懂：限時型 vs 限制型</h2>
          <div className="seo-prose">
            <p>
              釜山通行證主要分成兩種玩法：一種是 24 / 48 小時的限時型，另一種是 Big3 / Big5 的限制型。先不要急著比價，先看你的行程是「短時間衝很多景點」還是「慢慢挑幾個重點」。
            </p>

            <div className="pass-area-panel" aria-label="釜山通行證 A 區與 B 區景點">
              {passAreaGroups.map((group) => (
                <section key={group.label} className="pass-area-group" aria-label={`釜山通行證 ${group.label}`}>
                  <h3>{group.label}</h3>
                  <div className="pass-area-grid">
                    {group.items.map((item) => (
                      <span key={item} className="pass-area-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
              <p className="pass-area-note">A 區名額優先留給高價或最想去的景點，B 區再拿來補順路動線。</p>
            </div>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>類型</th>
                    <th>規則</th>
                    <th>適合誰</th>
                    <th>我的提醒</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24 小時</td>
                    <td>啟用後 24 小時內，可玩指定 A 區與 B 區景點，單一景點通常以一次為主。</td>
                    <td>行程很集中，想同一天衝高價景點的人。</td>
                    <td>啟用時間要漂亮，別下午才開卡又只玩一兩個點。</td>
                  </tr>
                  <tr>
                    <td>48 小時</td>
                    <td>啟用後 48 小時內，可玩指定 A 區與 B 區景點，單一景點通常以一次為主。</td>
                    <td>第一次去釜山、想把東釜山和市區分兩天的人。</td>
                    <td>多數人最容易排，也最不會被交通時間壓垮。</td>
                  </tr>
                  <tr>
                    <td>Big3</td>
                    <td>1 個 A 區景點 + 2 個 B 區景點，共 3 個景點。</td>
                    <td>只想挑幾個高價重點，不想被時間限制的人。</td>
                    <td>A 區名額一定要留給你最想去、原價也高的點。</td>
                  </tr>
                  <tr>
                    <td>Big5</td>
                    <td>2 個 A 區景點 + 3 個 B 區景點，共 5 個景點。</td>
                    <td>想多玩一些，但行程不一定連續的人。</td>
                    <td>比 Big3 彈性高，但還是要先確認每個景點位置。</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              重點一句話：想快就看 24 / 48 小時；想慢慢玩就看 Big3 / Big5。但不管買哪一種，天空膠囊列車都不要算進 Pass 回本裡面。
            </p>
          </div>
        </section>

        <section className="seo-content" id="unavailable" aria-label="釜山通行證不能使用景點">
          <h2 className="seo-h2">先避坑：這些景點已不能用釜山通行證進入</h2>
          <div className="seo-prose">
            <p>
              這段一定要先看。很多人會用舊文章或舊影片排到水營灣遊艇，結果到購票時才發現不能用 Pass。現在排釜山通行證，我會先把下面這些排除，再回頭看鑽石灣遊艇或其他 Pass 景點。
            </p>
            <ul className="narita-checklist">
              {unavailableAttractions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              如果你想搭遊艇，現在比較穩的做法是：Pass 內看釜山鑽石灣遊艇，而且先處理預約；想搭水營灣遊艇就把它當成另外購票的體驗，不要拿來算通行證回本。
            </p>
          </div>
        </section>

        <section className="seo-content" id="reservation" aria-label="釜山通行證需要預約景點">
          <h2 className="seo-h2">以下景點要事先預約，不要到現場才處理</h2>
          <div className="seo-prose">
            <p>
              釜山通行證最麻煩的不是買票，而是部分體驗型景點需要先卡時間。尤其你排 24 / 48 小時時，預約時間會直接影響動線。
            </p>
            <ul className="narita-checklist">
              {reservationAttractions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              我的建議是先把需要預約的景點當成固定行程，再把附近的 B 區或低價景點補上去。這樣比較不會為了湊數字，最後交通時間比玩景點還久。
            </p>
          </div>
        </section>

        <section className="seo-content" id="map-method" aria-label="釜山通行證地圖排法">
          <h2 className="seo-h2">我排行程的做法：先從貴到便宜，再看地圖順不順</h2>
          <div className="seo-prose">
            <p>
              我不會直接問「哪張票最便宜」，而是先把所有通行證景點門票從貴到便宜排好，分成紅 / 黃 / 綠三種等級，再全部標在地圖上。一看就知道哪些點最值得優先排，哪些只是順路加分。
            </p>

            <div className="narita-terminal-flow" role="list">
              <div role="listitem">
                <strong>紅色：回本主力</strong>
                <p>原價高、很適合拿來當 A 區或 24/48 小時主景點。</p>
              </div>
              <div role="listitem">
                <strong>黃色：順路補強</strong>
                <p>票價中等，和紅色景點在同區時就很適合一起排。</p>
              </div>
              <div role="listitem">
                <strong>綠色：不要硬繞</strong>
                <p>價值較低或體驗時間短，只有剛好順路才放進來。</p>
              </div>
              <div role="listitem">
                <strong>最後看交通</strong>
                <p>東釜山、海雲台、南浦洞不要亂跳，距離會吃掉回本。</p>
              </div>
            </div>

            <ActionLinks label="釜山通行證地圖與行程工具" links={linkGroups.tools} />
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="釜山通行證購票連結">
          <h2 className="seo-h2">購票連結：先比價，再看你要電子票還是實體卡</h2>
          <div className="seo-prose">
            <p>
              釜山通行證可以在不同平台購買，價格、活動、領取方式會變動。我的做法是先比 KKDAY、KLOOK、Trip，再回官方確認景點清單和使用規則。
            </p>
            <ActionLinks label="釜山通行證購票連結" links={linkGroups.pass} />

            <h3 className="seo-h3">天空膠囊列車要另外買</h3>
            <p>
              很多人會把海雲台藍線公園、海岸列車、天空膠囊列車混在一起。你只要記住：想搭天空膠囊列車，先另外訂票，不要把它算進釜山通行證。
            </p>
            <ActionLinks label="天空膠囊列車購票連結" links={linkGroups.capsule} />
          </div>
        </section>

        <section className="seo-content" aria-label="釜山通行證怎麼選結論">
          <h2 className="seo-h2">結論怎麼選？</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>第一次去釜山、想玩多一點：先看 48 小時。</li>
              <li>行程只有一天可以衝：看 24 小時，但要把啟用時間排好。</li>
              <li>只想挑 3 個重點景點：看 Big3，A 區名額留給最高價或最想去的點。</li>
              <li>想保留彈性又玩 5 個點：看 Big5，但先確認景點不要分太散。</li>
              <li>要搭膠囊列車、玩水營灣遊艇：另外購票，不要算進 Pass。</li>
              <li>有鑽石灣遊艇、韓服、密室逃脫、衝浪、跆拳道、洛東江生態探訪船：先預約再排行程。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="釜山通行證常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
