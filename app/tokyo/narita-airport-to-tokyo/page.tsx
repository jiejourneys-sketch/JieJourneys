import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import {
  naritaAirportToTokyoCanonical,
  naritaAirportToTokyoDescription,
  naritaAirportToTokyoTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const NARITA_TRANSPORT_MAP_URL = 'https://www.google.com/maps/d/edit?mid=1ZmBLaHH4TUkIxpwun8PUQETXJGN2rQ4&usp=sharing'

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
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          className={link.primary ? 'seo-buy-link primary' : 'seo-buy-link'}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          data-event={link.event}
          data-platform={link.platform}
          data-section="article_link"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

const linkGroups = {
  videos: [
    { label: 'IG｜3種方式', href: 'https://www.instagram.com/reel/DULQxKUkVR2/', event: 'tokyonarita_video_3ways_ig', platform: 'IG', primary: true },
    { label: 'IG｜最便宜方式', href: 'https://www.instagram.com/reel/DUdSUu1kdXn/', event: 'tokyonarita_video_budget_ig', platform: 'IG' },
  ],
  skyliner: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/7913-keisei-skyliner-narita-airport-express-ticket?cid=22312', event: 'tokyonarita_skyliner_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/1410-skyliner-tokyo/?aid=93798', event: 'tokyonarita_skyliner_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/47313759/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D6253046', event: 'tokyonarita_skyliner_trip', platform: 'Trip' },
    { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php', event: 'tokyonarita_skyliner_timetable', platform: 'Timetable' },
    { label: '地圖', href: NARITA_TRANSPORT_MAP_URL, event: 'tokyonarita_skyliner_map', platform: 'GoogleMap' },
  ],
  nex: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/529712?cid=22312', event: 'tokyonarita_nex_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/173165-narita-express-n-ex-round-trip-train-ticket-narita-airport-tokyo/?aid=93798', event: 'tokyonarita_nex_klook', platform: 'KLOOK' },
    { label: '客制', href: 'https://www.klook.com/zh-TW/japan-rail/narita-express-nex/?aid=93798', event: 'tokyonarita_nex_custom_klook', platform: 'KLOOK' },
    { label: '時刻表', href: 'https://japantravel.navitime.com/zh-tw/area/jp/timetable/00004637/00000161?direction=up&next=00003544&type=%E7%89%B9%E6%80%A5', event: 'tokyonarita_nex_timetable', platform: 'Timetable' },
    { label: '地圖', href: NARITA_TRANSPORT_MAP_URL, event: 'tokyonarita_nex_map', platform: 'GoogleMap' },
  ],
  limousine: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18551-tokyo-narita-airport-limousine-bus-transfer-ticket?cid=22312', event: 'tokyonarita_limousine_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/2274-narita-airport-limousine-bus-tokyo/?aid=93798', event: 'tokyonarita_limousine_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87579423/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D7239738', event: 'tokyonarita_limousine_trip', platform: 'Trip' },
    { label: '時刻表', href: 'https://www.limousinebus.co.jp/zh-tw/busstop/#flow2b', event: 'tokyonarita_limousine_timetable', platform: 'Timetable' },
    { label: '地圖', href: NARITA_TRANSPORT_MAP_URL, event: 'tokyonarita_limousine_map', platform: 'GoogleMap' },
  ],
  access: [
    { label: 'Suica', href: 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798', event: 'tokyonarita_access_suica', platform: 'KLOOK', primary: true },
    { label: '時刻表', href: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/jp/timetable/index.php', event: 'tokyonarita_access_timetable', platform: 'Timetable' },
    { label: '地圖', href: NARITA_TRANSPORT_MAP_URL, event: 'tokyonarita_access_map', platform: 'GoogleMap' },
  ],
  lcb: [
    { label: '購票&時刻表', href: 'https://www.narita-airport.jp/zh-tc/access/bus/lcb/', event: 'tokyonarita_lcb_timetable', platform: 'Timetable', primary: true },
    { label: '地圖', href: NARITA_TRANSPORT_MAP_URL, event: 'tokyonarita_lcb_map', platform: 'GoogleMap' },
  ],
  transfer: [
    { label: 'KKDAY包車', href: 'https://www.kkday.com/zh-tw/product/174325-narita-haneda-airports-transfer-tokyo-attractions-disney-resorts-suburban-areas?cid=22312', event: 'tokyonarita_car_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK包車', href: 'https://www.klook.com/zh-TW/airport-transfers/?aid=93798', event: 'tokyonarita_car_klook', platform: 'KLOOK' },
    { label: '合作租車', href: 'https://www2.tocoo.jp/cn/?asp_id=2564&utm_source=2564&utm_medium=affiliate', event: 'tokyonarita_self_tocoo', platform: 'TOCOO' },
  ],
}

const faqItems = [
  {
    q: '成田機場到東京市區最快是哪一種？',
    a: '通常是 Skyliner，到日暮里最快約 36 分鐘、到京成上野最快約 41 分鐘；但如果你的飯店在新宿或澀谷，還要把轉乘 JR 的時間一起算進去。',
  },
  {
    q: "Skyliner 和 N'EX 怎麼選？",
    a: "住上野、日暮里或想轉山手線，優先看 Skyliner；住東京車站、品川、澀谷、新宿、橫濱，而且想少轉車，優先看 N'EX。",
  },
  {
    q: '想省錢要搭 Access 特急還是 LCB 巴士？',
    a: '住淺草、押上、東銀座、新橋、品川一帶，Access 特急通常比較直覺；住東京車站、銀座，而且時間比較彈性，LCB 巴士票價最漂亮。',
  },
  {
    q: '第 2 航廈入境後要去哪裡搭車？',
    a: "以第 2 航廈為例，巴士相關櫃台與乘車處主要跟著 1 樓到巴士指標走；Skyliner、N'EX、Access 特急等電車則跟著鐵路指標往 B1 車站。",
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: naritaAirportToTokyoTitle.replace(' | JieJourneys(旅杰)', ''),
  description: naritaAirportToTokyoDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: naritaAirportToTokyoCanonical,
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

export default function NaritaAirportToTokyoPage() {
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
      <CitySubpageHeader backHref="/tokyo/transport" eventPrefix="tokyonarita" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京交通攻略"
          h1="成田機場到東京市區交通攻略｜Skyliner、N'EX、利木津巴士、Access 特急、LCB 怎麼選？"
          intro="從成田機場進東京，不要先問哪個交通最好，先看你住哪裡、行李多不多、想省時間還是省預算。這篇把常見的快線、巴士與便宜路線整理成一個選擇邏輯。"
          eventPrefix="tokyonarita"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyonarita_hero_quick', platform: 'article' },
            { label: '方式比較', href: '#comparison', dataEvent: 'tokyonarita_hero_comparison', platform: 'article' },
            { label: 'IG短影片', href: '#video-guide', dataEvent: 'tokyonarita_hero_video', platform: 'IG' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="成田機場到東京快速結論">
          <div className="narita-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">想最快</span>
              <strong>Skyliner</strong>
              <p>直衝日暮里、上野最快，適合住上野、淺草周邊再轉地鐵或計程車。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想少轉車</span>
              <strong>N&apos;EX</strong>
              <p>直達東京、品川、澀谷、新宿、橫濱，行李多也比較安心。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想直達飯店</span>
              <strong>利木津巴士</strong>
              <p>停靠點多，適合親子、長輩同行或不想拖行李轉乘的人。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想快又省</span>
              <strong>Access 特急</strong>
              <p>押上、淺草、東銀座、新橋方向很好用，不用另外付特急費。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想最便宜</span>
              <strong>LCB 巴士</strong>
              <p>東京車站、銀座方向很省，但要接受塞車風險與停靠點限制。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="成田機場交通短影片">
          <h2 className="seo-h2">先看 IG 短影片：成田機場進市區怎麼選</h2>
          <div className="seo-prose">
            <p>想先用影片抓重點，可以先看這兩支：一支講成田進市區主要方式，一支專門整理省錢路線。</p>
            <ActionLinks label="成田機場交通 IG 短影片" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="成田機場交通方式比較">
          <h2 className="seo-h2">先看比較表：你適合哪一種？</h2>
          <div className="seo-prose">
            <p>
              成田機場離東京市區約 60 公里，所以「最快」和「最方便」常常不是同一件事。第一次去東京，我會先用住宿區域決定交通方式，再用票價和行李量微調。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>交通方式</th>
                    <th>最適合住哪裡</th>
                    <th>優點</th>
                    <th>注意事項</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Skyliner</td>
                    <td>上野、日暮里、淺草周邊</td>
                    <td>速度最快，全車指定席，有行李空間。</td>
                    <td>不到新宿、澀谷、東京車站本體，通常要在日暮里或上野轉乘。</td>
                  </tr>
                  <tr>
                    <td>N&apos;EX 成田特快</td>
                    <td>東京、品川、澀谷、新宿、橫濱</td>
                    <td>大站直達，不用搬行李轉車；來回票對 14 天內往返的人很友善。</td>
                    <td>單程票價較高，班次和末班時間要先查。</td>
                  </tr>
                  <tr>
                    <td>利木津巴士</td>
                    <td>飯店門口、迪士尼、部分商圈</td>
                    <td>不用扛行李進車站，很多飯店或大站可直達。</td>
                    <td>受路況影響，尖峰或雨天要預留時間。</td>
                  </tr>
                  <tr>
                    <td>Access 特急</td>
                    <td>押上、淺草、東銀座、新橋、品川</td>
                    <td>不用特急費，能一路接到都營淺草線方向。</td>
                    <td>不是指定席，行李多或尖峰時間會比較辛苦。</td>
                  </tr>
                  <tr>
                    <td>LCB 巴士</td>
                    <td>東京車站、銀座、池袋、澀谷等指定停靠點</td>
                    <td>票價通常最省，東京與銀座方向尤其適合小資旅客。</td>
                    <td>不送到飯店，深夜與凌晨票價、停靠點與預約方式要確認。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="area-guide" aria-label="依住宿區域選成田機場交通">
          <h2 className="seo-h2">照住宿區域選，會比背路線簡單</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">住上野、日暮里：Skyliner 最直覺</h3>
            <p>
              你的飯店如果在上野、日暮里、御徒町一帶，Skyliner 幾乎就是首選。京成官方資訊整理為：成田第 2・第 3 航廈到日暮里最快約 36 分鐘，到京成上野最快約 41 分鐘。抵達後再走路、轉地鐵或短程計程車，通常比一路慢慢轉便宜時間。
            </p>
            <ActionLinks label="Skyliner 購票連結" links={linkGroups.skyliner} />

            <h3 className="seo-h3">住新宿、澀谷、品川、橫濱：N&apos;EX 少轉車</h3>
            <p>
              如果你最怕拖行李轉乘，N&apos;EX 的價值就是直達。JR 東日本的 N&apos;EX 東京去回車票目前成人 5,000 日圓、兒童 2,500 日圓，14 天內來回各搭一次，對東京市區往返成田的人很適合。住新宿、澀谷、品川、橫濱時，這張通常比單買單程更好算。
            </p>
            <ActionLinks label="N'EX 購票連結" links={linkGroups.nex} />

            <h3 className="seo-h3">住淺草、押上、晴空塔：Access 特急很香</h3>
            <p>
              住淺草、押上、晴空塔一帶，我會先查 Access 特急。它接到都營淺草線方向，不需要像 Skyliner 一樣先到上野再轉，價格也比特急列車低很多。缺點是沒有指定座位，尖峰時段和大行李會比較累。
            </p>
            <ActionLinks label="Access 特急交通連結" links={linkGroups.access} />

            <h3 className="seo-h3">住東京車站、銀座：看你要省錢還是省力</h3>
            <p>
              想少轉車可以看 N&apos;EX 到東京車站；想省預算可以看 LCB 巴士，成田機場官方列出的東京・銀座方向票價為 1,500 日圓（不含深夜與凌晨航班）。如果你住在飯店離停靠站很近，LCB 會很划算；如果還要拖行李走很遠，就改看 N&apos;EX 或利木津巴士。
            </p>
            <ActionLinks label="LCB 與東京車站方向連結" links={linkGroups.lcb} />

            <h3 className="seo-h3">飯店門口、親子長輩同行：利木津巴士</h3>
            <p>
              利木津巴士的核心優點不是最快，而是「不用搬行李轉車」。飯店有停靠點、帶小孩、帶長輩、行李多，通常值得多花一點錢換省力。
            </p>
            <ActionLinks label="利木津巴士連結" links={linkGroups.limousine} />

            <h3 className="seo-h3">深夜抵達或多人同行：包車 / 租車</h3>
            <p>
              若是深夜抵達、多人同行或飯店位置不靠大眾交通，包車可以列入比較；自駕則更適合隔天要往東京近郊移動的人，不是第一次進市區的首選。
            </p>
            <ActionLinks label="包車與租車連結" links={linkGroups.transfer} />
          </div>
        </section>

        <section className="seo-content" aria-label="成田機場第2航廈搭車位置">
          <h2 className="seo-h2">以第 2 航廈為例：入境後看樓層就好</h2>
          <div className="seo-prose">
            <div className="narita-terminal-flow">
              <div>
                <span className="narita-summary-label">1 樓</span>
                <strong>入境大廳、巴士櫃台、巴士乘車處</strong>
                <p>利木津巴士、LCB 或其他高速巴士，抵達後跟著 Bus / Limousine Bus 指標走。</p>
              </div>
              <div>
                <span className="narita-summary-label">B1</span>
                <strong>電車月台與售票處</strong>
                <p>Skyliner、Access 特急、N&apos;EX 都是往鐵路站方向下樓，依 Keisei / JR 指標分流。</p>
              </div>
            </div>
            <p>
              第 3 航廈沒有自己的鐵路站，通常會走或搭接駁到第 2 航廈站搭電車。班機抵達後如果你不確定方向，不要急著出航廈，先看「Train」「Bus」兩種大指標，會比看公司名稱更不容易迷路。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="成田機場交通票券建議">
          <h2 className="seo-h2">票券怎麼買？我的簡單判斷</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">Skyliner：先比官方票與平台票</h3>
            <p>
              Skyliner 可以線上買，也常和東京地鐵 24/48/72 小時券搭套票。若你前幾天會密集搭東京 Metro 與都營地鐵，可以把 Skyliner + Tokyo Subway Ticket 拿來一起算；如果主要用 JR 或只搭少量地鐵，單買 Skyliner 比較乾淨。
            </p>

            <h3 className="seo-h3">N&apos;EX：14 天內來回優先看去回票</h3>
            <p>
              JR 東日本的 N&apos;EX 東京去回車票有效期間是 14 天，對大多數東京自由行天數很剛好。若你只單程進市區、回程從羽田走，才回頭看單程票或其他路線。
            </p>

            <h3 className="seo-h3">Access 特急：用 IC 卡最簡單</h3>
            <p>
              Access 特急不是指定席特急，通常用 Suica、PASMO、ICOCA 這類交通 IC 卡進出站就可以。真正要注意的是班次方向與終點，不是票券名稱。
            </p>

            <h3 className="seo-h3">LCB 與利木津：先確認停靠點，再看票價</h3>
            <p>
              巴士最怕買了才發現下車點離飯店很遠。先用飯店地址查最近停靠點，再看是否需要預約、深夜凌晨是否加價，以及抵達當天會不會遇到尖峰塞車。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="成田機場交通最後選法">
          <h2 className="seo-h2">最後用一句話收斂</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>住上野、日暮里：先看 Skyliner。</li>
              <li>住新宿、澀谷、品川、橫濱：先看 N&apos;EX。</li>
              <li>住淺草、押上：先看 Access 特急。</li>
              <li>住東京車站、銀座且想省錢：先看 LCB。</li>
              <li>飯店有停靠、行李多、親子長輩同行：先看利木津巴士。</li>
              <li>多人同行、紅眼班機、飯店位置尷尬：再比較包車。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="成田機場到東京常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
