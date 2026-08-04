import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoCtaSection from '@/components/seo/SeoCtaSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import type { PageSearchParams } from '@/lib/plannerReturn'
import Image from 'next/image'
import {
  dotonboriCruiseGuideCanonical,
  dotonboriCruiseGuideDescription,
  dotonboriCruiseGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const TOMBORI_MAP_URL = 'https://maps.app.goo.gl/yqAUk77ncQw63DSd7'
const WONDER_MAP_URL = 'https://maps.app.goo.gl/SU32q9zctBbo7ohj6'
const WONDER_RESERVATION_URL = 'https://select-type.com/rsv/?id=oHYe7QVcsto&c_id=242746'

const comparisonRows = [
  {
    item: '航程與風景',
    tombori: '約 20 分鐘，從太左衛門橋船著場出發，在道頓堀川繞行。',
    wonder: '約 20 分鐘，從日本橋船著場出發，往湊町 River Place 方向折返。',
  },
  {
    item: '營運時間',
    tombori: '目前為 11:00～21:00，每 30 分鐘一班。',
    wonder: '目前為 16:10～21:30；部分日期另有中午班次，請以當日表為準。',
  },
  {
    item: '座位感受',
    tombori: '多人共用長椅，偏向經典、快速的觀光船體驗。',
    wonder: '一人一張座椅，另有情侶座；舒適度與私密感較好。',
  },
  {
    item: '雨天與船上設備',
    tombori: '設備較基本；天候與河川狀況可能影響航行。',
    wonder: '有可遮雨的屋頂、船上廁所；視天氣與船班提供保暖協助。小雨仍可能行駛。',
  },
  {
    item: '飲料',
    tombori: '沒有特別標示，建議登船前再向現場確認。',
    wonder: '可自行攜帶食物與飲料。',
  },
  {
    item: '固力果拍照',
    tombori: '會經過固力果跑跑人一帶，但不是專門停船拍照的航程。',
    wonder: '在固力果跑跑人前有拍照時間，工作人員會協助拍照。',
  },
  {
    item: '預約與換票',
    tombori: '只能現場換指定時段票，無法網路預約；晚上容易滿，建議白天先換。',
    wonder: '可線上預約、預約者優先；到現場仍需排隊並換實體票。',
  },
]

const faqItems = [
  {
    q: '道頓堀遊船的 Tombori River Cruise 和 Wonder Cruise 都能用大阪周遊券嗎？',
    a: '可以。2026 年大阪周遊券目前兩者都有列入免費設施，但營運時間、休航日與使用限制可能調整；出發前先確認自己要搭的日期是否有班。',
  },
  {
    q: '持大阪周遊券，Tombori River Cruise 可以先預約嗎？',
    a: '不行。Tombori 只能在搭乘當日到現場換指定時段的登船票，無法網路預約；晚上容易滿席，建議白天先去換票。',
  },
  {
    q: 'Wonder Cruise 可以預約嗎？',
    a: '可以。線上預約者優先登船；不過即使已預約，到現場仍要依指示排隊並換取實體票。沒有預約也可詢問現場空位，但旺日可能無法搭上。',
  },
  {
    q: '想拍固力果跑跑人，要選哪一艘？',
    a: '想把固力果拍照當成重點，選 Wonder Cruise。它在固力果前安排拍照時間，也會協助拍照；Tombori 同樣會從水面經過這一帶，但不適合期待停船拍照。',
  },
  {
    q: '下雨還可以搭道頓堀遊船嗎？',
    a: 'Wonder Cruise 在小雨時仍可能運行，且船上有遮雨屋頂；但颱風、河川狀況或其他安全因素都可能臨時停航。兩家都要在出發前查看當日公告。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: dotonboriCruiseGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: dotonboriCruiseGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: dotonboriCruiseGuideCanonical,
  image: `${SITE_URL}/assets/dotonbori-cruise/wonder-glico-night.png`,
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

type DotonboriCruiseGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'osaka-video') return '/osaka/video'
  if (value === 'map' || value === 'osaka-map') return '/osaka/map'
  if (value === 'pass-map' || value === 'osaka-pass-map') return '/osaka/pass-map'
  if (value === 'ticket' || value === 'osaka-ticket') return '/osaka/ticket'
  if (value === 'osaka-amazing-pass') return '/osaka/osaka-amazing-pass'
  return '/osaka'
}

export default async function DotonboriCruiseGuidePage({ searchParams }: DotonboriCruiseGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="dotonboricruise" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="大阪攻略｜難波・道頓堀"
          h1="道頓堀遊船攻略｜Tombori River Cruise vs Wonder Cruise"
          intro="道頓堀遊船最常見的兩種選擇是 Tombori River Cruise 與 Wonder Cruise。兩者都能用大阪周遊券、航程約 20 分鐘，真正要選的是你想搭白天班、坐得舒服、拍固力果，還是希望先把船位訂好。"
          eventPrefix="dotonboricruise"
          showVisual={false}
          ctaLinks={[
            { label: '兩艘船比較', href: '#comparison', dataEvent: 'dotonboricruise_hero_comparison', platform: 'article' },
            { label: '周遊券怎麼搭', href: '#amazing-pass', dataEvent: 'dotonboricruise_hero_pass', platform: 'article' },
            { label: '直接看結論', href: '#which-cruise', dataEvent: 'dotonboricruise_hero_choice', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="道頓堀遊船快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">共同點</span>
              <strong>約 20 分鐘・周遊券可用</strong>
              <p>兩艘船都繞道頓堀川主要河段，白天與夜晚各有風景。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想搭白天</span>
              <strong>選 Tombori</strong>
              <p>目前 11:00 起每 30 分鐘一班，白天選擇最穩。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想坐得舒服、好拍</span>
              <strong>選 Wonder</strong>
              <p>獨立座椅、遮雨屋頂、廁所與固力果拍照時間都更完整。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">周遊券重點</span>
              <strong>Tombori 先換時段票</strong>
              <p>持券者當天先換登船時段；晚上熱門，建議白天處理。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="Tombori與Wonder Cruise比較">
          <h2 className="seo-h2">Tombori River Cruise vs Wonder Cruise：先看這張比較表</h2>
          <div className="seo-prose">
            <p>
              兩艘船看到的道頓堀川景色重疊度很高，都是很適合第一次到難波時加入的 20 分鐘行程。差異不在「哪一艘看得到固力果」，而在搭乘時間、座椅、雨天設備與能不能先安排。時間表與周遊券權益會調整，以下搭配現場搭乘整理。
            </p>

            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/dotonbori-cruise/cruise-comparison.png"
                alt="Tombori River Cruise 與 Wonder Cruise 的航程、時間、座位、設備、拍照與預約比較"
                width={943}
                height={1682}
                sizes="(max-width: 820px) 100vw, 760px"
              />
              <figcaption>兩艘道頓堀遊船的差異總覽；出發前仍要以各業者當日班表為準。</figcaption>
            </figure>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>Tombori River Cruise</th>
                    <th>Wonder Cruise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.item}>
                      <td><strong>{row.item}</strong></td>
                      <td>{row.tombori}</td>
                      <td>{row.wonder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" id="routes" aria-label="道頓堀遊船路線與乘船地點">
          <h2 className="seo-h2">兩艘船從哪裡搭？路線相近，出發碼頭不同</h2>
          <div className="seo-prose">
            <p>
              Tombori 從太左衛門橋船著場出發，靠近道頓堀的熱鬧核心；Wonder 則從日本橋船著場旁的櫃台換票、登船。兩條線都會從水面看招牌、橋梁與河岸街景，所以不用為了「景色」刻意兩艘都搭；挑符合行程與需求的一艘就夠。
            </p>

            <h3 className="seo-h3">Tombori River Cruise：太左衛門橋船著場</h3>
            <p>
              從難波、心齋橋方向走到道頓堀後，可直接導航
              <a href={TOMBORI_MAP_URL} target="_blank" rel="noopener noreferrer" data-event="dotonboricruise_tombori_map" data-platform="GoogleMap" data-section="article">
                <strong>太左衛門橋船著場（Google Map）</strong>
              </a>
              。持大阪周遊券的人先到櫃台換指定時段票，再回頭吃飯、逛街或拍照最不浪費時間。
            </p>
            <figure className="seo-figure">
              <Image
                src="/assets/dotonbori-cruise/tombori-route-map.png"
                alt="Tombori River Cruise 道頓堀川航線圖與太左衛門橋乘船處"
                width={1360}
                height={650}
                sizes="(max-width: 820px) 100vw, 960px"
              />
              <figcaption>Tombori River Cruise 航線示意：由太左衛門橋船著場出發，在道頓堀川繞行。</figcaption>
            </figure>

            <h3 className="seo-h3">Wonder Cruise：日本橋船著場／Grill WONDER 前櫃台</h3>
            <p>
              Wonder 的報到與換票處在日本橋船著場前的 Dotonbori Riverside Grill WONDER 一帶；從固力果招牌方向沿河往日本橋走即可看到櫃台。可先導航
              <a href={WONDER_MAP_URL} target="_blank" rel="noopener noreferrer" data-event="dotonboricruise_wonder_map" data-platform="GoogleMap" data-section="article">
                <strong>Dotonbori Riverside Grill WONDER（Google Map）</strong>
              </a>
              ，再找現場藍色旗幟與登船指示。
            </p>
            <figure className="seo-figure">
              <Image
                src="/assets/dotonbori-cruise/wonder-route-map.png"
                alt="Wonder Cruise 道頓堀川 20 分鐘航線圖，標示日本橋船著場與固力果拍照時間"
                width={2048}
                height={1152}
                sizes="(max-width: 820px) 100vw, 960px"
              />
              <figcaption>Wonder Cruise 由日本橋船著場出發，航程約 20 分鐘，並設有固力果一帶的拍照時間。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="glico-photo" aria-label="道頓堀遊船固力果拍照">
          <h2 className="seo-h2">想拍固力果跑跑人：Wonder Cruise 更適合</h2>
          <div className="seo-prose">
            <p>
              從河面拍固力果，角度比橋上更低、更有「人在道頓堀」的感覺。Tombori 會沿河經過這個區域，但航程不是為拍照而停；Wonder 則把固力果前的拍照時間放進行程，船員也會幫忙拍。若你是傍晚才到難波、又想有一張完整的夜間招牌照，直接選 Wonder 會更省心。
            </p>
            <figure className="seo-figure seo-portrait-figure">
              <Image
                src="/assets/dotonbori-cruise/wonder-glico-night.png"
                alt="從 Wonder Cruise 船上拍攝的道頓堀固力果跑跑人夜景"
                width={1365}
                height={2048}
                sizes="(max-width: 820px) 100vw, 620px"
              />
              <figcaption>Wonder Cruise 船上的固力果夜景視角；夜間的招牌與河面反光特別有氣氛。</figcaption>
            </figure>
          </div>
        </section>

        <section className="seo-content" id="amazing-pass" aria-label="大阪周遊券搭道頓堀遊船">
          <h2 className="seo-h2">大阪周遊券怎麼搭最順？兩艘都免費，但換票規則不同</h2>
          <div className="seo-prose">
            <p>
              大阪周遊券目前把 Tombori River Cruise 與 Wonder Cruise 都列為免費設施，原價皆為成人 2,000 日圓。這代表你不用因為「哪艘能用周遊券」而選船，反而要先確認你手上的券、使用日期與想搭的時段能不能配合。
            </p>

            <h3 className="seo-h3">Tombori：持券當天先換指定時段票</h3>
            <ol>
              <li>早一點到太左衛門橋船著場櫃台，出示大阪周遊券換指定時段票。</li>
              <li>櫃台在首班船前 1 小時開放；晚上班次容易滿，建議白天先換。</li>
              <li>拿到時間後，先去道頓堀、心齋橋或黑門市場活動，再在票面時間回來登船。</li>
            </ol>
            <p>
              重要的是：周遊券不是事先保證席位。<strong>Tombori 只能現場換票，無法網路預約。</strong>如果晚餐後才去換，熱門時段很可能已經額滿；先拿到時段票，再回頭逛道頓堀最穩。
            </p>

            <h3 className="seo-h3">Wonder：網路預約優先，但到場仍要換票</h3>
            <ol>
              <li>想鎖定傍晚或晚間班，可先用
                <a href={WONDER_RESERVATION_URL} target="_blank" rel="noopener noreferrer" data-event="dotonboricruise_wonder_reservation" data-platform="WonderCruise" data-section="article">
                  <strong>Wonder Cruise 線上預約</strong>
                </a>
                。</li>
              <li>到日本橋船著場前的櫃台排隊，出示預約資料或大阪周遊券並換實體票。</li>
              <li>依工作人員指定的候船列隊登船；沒有預約可問現場空位，但滿席時可能候補或無法搭乘。</li>
            </ol>
            <p>預約不代表可以省略現場報到；請預留換票與排隊時間，並依工作人員指定的候船區登船。</p>
          </div>
        </section>

        <section className="seo-content" id="which-cruise" aria-label="道頓堀遊船選擇建議">
          <h2 className="seo-h2">最後怎麼選？白天 Tombori，其餘大多直接選 Wonder</h2>
          <div className="seo-prose">
            <p>
              我的結論很簡單：<strong>想在白天搭船，就選 Tombori River Cruise。</strong>它從 11:00 起有班，最適合把中午的道頓堀逛街、午餐或心齋橋行程接在一起。若不是為了白天時段，<strong>大多數人直接選 Wonder Cruise 就好。</strong>獨立座椅、遮雨設備、船上廁所、可攜帶飲料、固力果拍照與預約彈性都更完整。
            </p>
            <ol>
              <li><strong>白天想搭／傍晚前就要離開難波：</strong>選 Tombori，先換周遊券時段票。</li>
              <li><strong>想拍固力果夜景、情侶或同行長輩：</strong>選 Wonder，坐得更舒服也較適合拍照。</li>
              <li><strong>行程不能有空等：</strong>優先選 Wonder 並先預約；仍要預留到場換票與排隊時間。</li>
              <li><strong>持大阪周遊券又遇到晚上熱門時段：</strong>不要拖到晚餐後才決定，Tombori 先換票、Wonder 先看可預約時段。</li>
            </ol>
            <p>
              道頓堀遊船的價值不是看很多景點，而是用 20 分鐘把難波最密集的霓虹、橋與河岸景色一次收進來。把它排在晚餐前後，通常比硬塞進早上的趕行程更有感。
            </p>
          </div>
        </section>

        <SeoCtaSection
          text=""
          href="/osaka/osaka-amazing-pass?from=dotonbori-cruise-guide"
          linkText="繼續看大阪周遊券完整攻略"
          dataEvent="dotonboricruise_cta_amazingpass"
        />
        <SeoFaqSection title="道頓堀遊船常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
