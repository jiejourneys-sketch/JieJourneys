import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  tokyoMeijiJinguGuideCanonical,
  tokyoMeijiJinguGuideDescription,
  tokyoMeijiJinguGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'

type ActionLink = {
  label: string
  href: string
  event: string
  platform: string
  primary?: boolean
}

type VisitStep = {
  step: string
  place: string
  focus: string
  note: string
}

function ActionLinks({ label, links }: { label: string; links: ActionLink[] }) {
  if (links.length === 0) return null

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
    { label: '明治神宮 IG', href: 'https://www.instagram.com/reel/DWte3LWzhea/', event: 'tokyomeiji_video_ig', platform: 'IG', primary: true },
    { label: '明治神宮 YouTube', href: 'https://www.youtube.com/shorts/SPeJ3kugpu8', event: 'tokyomeiji_video_yt', platform: 'YouTube' },
  ],
  maps: [
    { label: '明治神宮 Google Map', href: 'https://maps.app.goo.gl/zSBnMgXBEBbeodeV9', event: 'tokyomeiji_map_shrine', platform: 'GoogleMap', primary: true },
    { label: '東京景點地圖', href: '/tokyo/map?from=meiji-jingu-guide', event: 'tokyomeiji_tokyo_map', platform: 'map' },
  ],
  planning: [
    { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=meiji-jingu-guide', event: 'tokyomeiji_9areas_article', platform: 'article', primary: true },
    { label: '東京住宿區域', href: '/tokyo/hotel?from=meiji-jingu-guide', event: 'tokyomeiji_hotel', platform: 'hotel' },
    { label: '東京交通攻略', href: '/tokyo/transport?from=meiji-jingu-guide', event: 'tokyomeiji_transport', platform: 'transport' },
    { label: 'SHIBUYA SKY 票券', href: '/tokyo/ticket?tag=SHIBUYA%20SKY&from=meiji-jingu-guide#ticketListTitle', event: 'tokyomeiji_shibuya_sky_ticket', platform: 'ticket' },
  ],
}

const visitSteps: VisitStep[] = [
  { step: '1', place: '明治神宮入口', focus: '從明治神宮前站或 JR 原宿站進入', note: '地鐵可看明治神宮前站，JR 可看原宿站，出站後跟著指標往鳥居走。' },
  { step: '2', place: '南參道', focus: '一路直走，先把城市聲音切掉', note: '參道很長、樹蔭多，慢慢走大約 10 到 15 分鐘會接近本殿區。' },
  { step: '3', place: '左轉再右轉', focus: '依指標往御本殿方向', note: '走到參道交會處後左轉，再右轉進入本殿前廣場。' },
  { step: '4', place: '本殿與夫婦楠', focus: '參拜、看夫婦楠、求姻緣', note: '夫婦楠是明治神宮很有代表性的祈願點，很多人會來求姻緣和家庭圓滿。' },
  { step: '5', place: '授與所', focus: '御守、繪馬、求籤', note: '本殿右側一帶可以買御守、寫繪馬、抽籤；正式祈願或玉串奉納依現場流程。' },
  { step: '6', place: '原路返回出口', focus: '沿南參道慢慢走回原宿', note: '回程不用繞遠，走回原本入口再接原宿、表參道或澀谷都順。' },
]

const faqItems = [
  {
    q: '明治神宮從哪個站去最方便？',
    a: '最直覺是搭地鐵到明治神宮前站，或搭 JR 山手線到原宿站。兩個站都很適合走南參道進入明治神宮。',
  },
  {
    q: '從入口走到明治神宮本殿要多久？',
    a: '官方提醒從入口到御本殿還要再走一段，旅人實際安排抓 10 到 15 分鐘比較舒服。如果一路拍照，時間會再多一點。',
  },
  {
    q: '明治神宮參觀順序怎麼走？',
    a: '從入口進入後走南參道一路直走，接著左轉、再右轉到本殿。參拜後看夫婦楠，再到右側授與所買御守、寫繪馬或求籤，最後原路返回。',
  },
  {
    q: '明治神宮要預留多久？',
    a: '只走南參道、本殿、夫婦楠和授與所，抓 1 小時剛好。若要拍很多照片、逛內苑或博物館，就要再加時間。',
  },
  {
    q: '明治神宮可以和原宿、澀谷排同一天嗎？',
    a: '很適合。明治神宮放早上或中午，接原宿竹下通、表參道、Cat Street，下午到晚上再去澀谷和 SHIBUYA SKY，動線很順。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: tokyoMeijiJinguGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: tokyoMeijiJinguGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: tokyoMeijiJinguGuideCanonical,
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

type TokyoMeijiJinguGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'tokyo-video') return '/tokyo/video'
  if (value === 'map' || value === 'tokyo-map') return '/tokyo/map'
  if (value === 'tokyo-9-areas-guide' || value === '9areas') return '/tokyo/tokyo-9-areas-guide'
  if (value === 'hotel' || value === 'tokyo-hotel') return '/tokyo/hotel'
  if (value === 'transport' || value === 'tokyo-transport') return '/tokyo/transport'
  if (value === 'ticket' || value === 'tokyo-ticket') return '/tokyo/ticket'
  return '/tokyo'
}

export default async function TokyoMeijiJinguGuidePage({ searchParams }: TokyoMeijiJinguGuidePageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="tokyomeiji" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="東京景點攻略"
          h1="明治神宮攻略｜從原宿走南參道，1 小時完成參拜"
          intro="明治神宮就在原宿旁邊，但真正的重點不是出站即到，而是進入森林後沿南參道慢慢走到本殿。這篇把明治神宮前站、JR 原宿站、夫婦楠、參拜、御守和繪馬動線整理好。"
          eventPrefix="tokyomeiji"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'tokyomeiji_hero_quick', platform: 'article' },
            { label: '參觀順序', href: '#route-order', dataEvent: 'tokyomeiji_hero_route', platform: 'article' },
            { label: '行程排法', href: '#sample-routes', dataEvent: 'tokyomeiji_hero_plan', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="明治神宮攻略快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">交通</span>
              <strong>明治神宮前站或 JR 原宿站</strong>
              <p>出站後就是明治神宮入口方向，跟著鳥居和指標走最直覺。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">主線</span>
              <strong>南參道一路直走</strong>
              <p>進入後走南參道，直走、左轉、再右轉，大約 15 分鐘到本殿。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">本殿重點</span>
              <strong>夫婦楠、參拜、求籤、繪馬</strong>
              <p>夫婦楠很有名，很多人會來求姻緣和家庭圓滿。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">停留</span>
              <strong>預留 1 小時剛好</strong>
              <p>走到本殿、參拜、買御守、原路返回，抓 1 小時最穩。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="明治神宮短影音">
          <h2 className="seo-h2">先看短影音：明治神宮現場動線</h2>
          <div className="seo-prose">
            <p>
              明治神宮的重點是動線很簡單，但距離比想像中長。先看短影音抓南參道、本殿和夫婦楠的位置，再照文字版走，會比較不慌。
            </p>
            <SeoVideoLinkMenu label="明治神宮" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="arrival" aria-label="明治神宮交通入口">
          <h2 className="seo-h2">交通入口：明治神宮前站或 JR 原宿站</h2>
          <div className="seo-prose">
            <p>
              去明治神宮最簡單就是搭地鐵到明治神宮前站，或搭 JR 山手線到原宿站。明治神宮前站可以看往 JR 原宿站、明治神宮、代代木公園方向的出口；JR 原宿站出來後往神宮橋和鳥居方向走。
            </p>
            <p>
              注意：出站靠近的是入口，不是本殿。進入神宮後還要穿過南參道，森林感很強、路也很好走，但還是要抓 10 到 15 分鐘到本殿。
            </p>
            <ActionLinks label="明治神宮地圖" links={linkGroups.maps} />
          </div>
        </section>

        <section className="seo-content" id="route-order" aria-label="明治神宮參觀順序">
          <h2 className="seo-h2">明治神宮參觀順序：南參道到本殿</h2>
          <div className="seo-prose">
            <p>
              進入明治神宮後，照著南參道一路直走。到參道交會處後左轉，再右轉進入本殿前廣場。這條線最簡單，也最適合第一次去的人。
            </p>

            <figure className="seo-figure seo-tall-figure">
              <Image
                src="/assets/tokyo-meiji-jingu-map.jpg"
                alt="明治神宮園區示意圖，標出 JR 原宿站、表參道、南參道、御苑、本殿與參拜動線"
                width={1728}
                height={2887}
                sizes="(max-width: 720px) 100vw, 620px"
              />
              <figcaption>明治神宮示意圖：從 JR 原宿站或明治神宮前站進入後，沿南參道往本殿走；有時間再加走御苑。</figcaption>
            </figure>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>順序</th>
                    <th>地點</th>
                    <th>重點</th>
                    <th>小提醒</th>
                  </tr>
                </thead>
                <tbody>
                  {visitSteps.map((item) => (
                    <tr key={item.place}>
                      <td>{item.step}</td>
                      <td>{item.place}</td>
                      <td>{item.focus}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="seo-h3">南參道：一路直走，先走進森林</h3>
            <p>
              明治神宮很特別的地方，是它明明在原宿旁邊，進來後卻立刻變安靜。南參道兩側都是大樹，走起來很舒服，也很適合當原宿和澀谷行程前的放慢開場。
            </p>

            <h3 className="seo-h3">本殿：參拜、求籤、寫繪馬</h3>
            <p>
              到本殿後先參拜，再看要不要求籤或寫繪馬。這裡的空間比很多東京市區神社寬，停下來感受一下氣氛會比快速拍照離開更值得。
            </p>

            <h3 className="seo-h3">夫婦楠：求姻緣和家庭圓滿的重點</h3>
            <p>
              本殿旁邊的夫婦楠是明治神宮最有名的祈願點之一，兩棵楠木被注連繩連在一起，象徵夫妻和家庭圓滿。很多人會特別來這裡求姻緣，也很適合拍一張安靜的紀念照。
            </p>

            <h3 className="seo-h3">右側授與所：御守、繪馬、求籤</h3>
            <p>
              本殿右側區域可以看御守、繪馬和求籤。想買御守或寫繪馬，可以參拜後再過去；如果是正式祈願或玉串相關流程，照現場指示辦理會最穩。
            </p>

            <h3 className="seo-h3">最後原路返回出口</h3>
            <p>
              明治神宮不用硬繞一圈，第一次去最簡單就是原路返回。走回原宿站或明治神宮前站後，可以接竹下通、表參道、Cat Street 或澀谷。
            </p>
          </div>
        </section>

        <section className="seo-content" id="sample-routes" aria-label="明治神宮行程排法">
          <h2 className="seo-h2">明治神宮行程怎麼排</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">1 小時參拜版</h3>
            <ol>
              <li>明治神宮前站或 JR 原宿站出站。</li>
              <li>進入南參道，一路直走、左轉、再右轉到本殿。</li>
              <li>本殿參拜，順看夫婦楠。</li>
              <li>右側授與所買御守、寫繪馬或求籤。</li>
              <li>原路返回出口。</li>
            </ol>

            <h3 className="seo-h3">半日版：明治神宮接原宿、澀谷</h3>
            <p>
              想排半天，最順是明治神宮 → 原宿竹下通 → 表參道 / Cat Street → 澀谷。明治神宮放上午或中午，下午逛街，晚上再接澀谷十字路口或 SHIBUYA SKY。
            </p>
            <ActionLinks label="明治神宮延伸規劃" links={linkGroups.planning} />
          </div>
        </section>

        <SeoRelatedLinksSection
          title="明治神宮周邊接著怎麼玩"
          intro="明治神宮可和原宿、表參道、澀谷排在同一天；先看區域攻略和澀谷展望台的預約方式，再決定交通票。"
          links={[
            { label: '東京 9 大區域攻略', href: '/tokyo/tokyo-9-areas-guide?from=meiji-jingu-guide', event: 'meijijingu_related_areas', primary: true },
            { label: 'SHIBUYA SKY 攻略', href: '/tokyo/shibuya-sky-guide?from=meiji-jingu-guide', event: 'meijijingu_related_shibuya' },
            { label: '東京地鐵券攻略', href: '/tokyo/tokyo-subway-ticket?from=meiji-jingu-guide', event: 'meijijingu_related_subway' },
          ]}
        />
        <SeoFaqSection title="明治神宮攻略常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
