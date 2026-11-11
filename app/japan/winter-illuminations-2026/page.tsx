import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoRelatedLinksSection from '@/components/seo/SeoRelatedLinksSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  WINTER_GUIDE_CHECKED_AT, WINTER_GUIDE_PUBLISHED_AT, winterEditorialReferences, winterEvents, winterFaqItems, winterMapsUrl, winterRegions, winterScheduleLines,
  type WinterEvent, type WinterRegionId,
} from '@/data/japan/winter-illuminations-2026'
import WinterGuideMap from './WinterGuideMap'
import { winterIlluminations2026Canonical, winterIlluminations2026Description, winterIlluminations2026Title } from './pageMeta'
import styles from './winterGuide.module.css'

const regionGuides: Record<WinterRegionId, { title: string; intro: string }> = {
  tokyo: { title: '東京與近郊：經典聖誕市集、城市燈飾與迪士尼', intro: '想逛大型市集，先看新豐洲、芝公園；想把逛街與點燈接在一起，可選六本木、麻布台、丸之內或晴空塔。迪士尼樂園則獨立留一整天。' },
  yokohama: { title: '橫濱：紅磚倉庫聖誕市集', intro: '紅磚倉庫是想拍港景、耶誕樹與木屋市集時很直覺的選擇。從東京出發可另排橫濱半日到一日，白天逛港未來，傍晚再進市集。' },
  osaka: { title: '大阪：天王寺、梅田市集與御堂筋點燈', intro: '想逛市集，先選天王寺或梅田藍天大廈；想接晚餐散步，就看御堂筋與中之島。USJ 是需要入園票、適合留整天的另一種耶誕玩法。' },
  kobe: { title: '神戶：布引香草園古城聖誕市集', intro: '神戶的代表性選擇是搭纜車上布引香草園，逛古城風格市集並看山景。想一路玩到夜景時段，務必先選有夜間營業的日期。' },
  mie: { title: '名古屋與三重：久屋大通市集、名花之里燈海', intro: '住名古屋、想接榮商圈購物，就看久屋大通公園聖誕市集。名花之里位在三重縣桑名市，需要另排門票、交通與回程時間。' },
  sapporo: { title: '札幌：慕尼黑聖誕市集與大通公園', intro: '北海道行程可以把大通公園市集與白色燈樹節放在同一晚。先逛德式餐飲與雜貨，再看附近燈飾，冬天步行也記得留取暖休息時間。' },
  fukuoka: { title: '福岡：博多站、天神聖誕市集', intro: '博多站與天神是容易接上購物、晚餐的兩個市集會場。兩地可以搭地鐵串聯，但開始日、結束日與休息日不同。' },
  nagasaki: { title: '長崎：豪斯登堡歐風耶誕與冬季燈飾', intro: '豪斯登堡位於長崎縣佐世保市，適合白天玩園區、晚上看燈飾。從福岡或長崎市區出發，都要另外安排交通或住宿。' },
}
const checkedDateLabel = WINTER_GUIDE_CHECKED_AT.split('-').map(Number).join('/')

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: winterIlluminations2026Title.replace(' | JieJourneys(旅杰)', ''),
  description: winterIlluminations2026Description, inLanguage: 'zh-Hant',
  datePublished: WINTER_GUIDE_PUBLISHED_AT, dateModified: WINTER_GUIDE_CHECKED_AT,
  mainEntityOfPage: winterIlluminations2026Canonical,
  author: { '@type': 'Organization', name: 'JieJourneys(旅杰)', url: 'https://www.jiejourneys.com' },
  publisher: { '@type': 'Organization', name: 'JieJourneys(旅杰)', logo: { '@type': 'ImageObject', url: 'https://www.jiejourneys.com/assets/og-share.png' } },
  image: 'https://www.jiejourneys.com/assets/og-share.png',
}
const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: winterFaqItems.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

function Activity({ event, index }: { event: WinterEvent; index: number }) {
  const needsTicket = event.ticketRequired
  return (
    <article id={event.id} className={styles.activity} aria-labelledby={`${event.id}-title`}>
      <h3 className="seo-h3" id={`${event.id}-title`}>{index + 1}. {event.name}</h3>
      <p>{event.highlights[0]}</p>
      <ul className="narita-checklist">
        <li><strong>活動日期：</strong>{winterScheduleLines(event).map((line) => <span key={line} className={styles.period}>{line}</span>)}</li>
        <li><strong>點燈／營業時間：</strong>{event.hours}</li>
        <li><strong>費用：</strong>{event.fee}</li>
        <li><strong>會場：</strong>{event.venue}</li>
        <li><strong>交通：</strong>{event.access}</li>
        {needsTicket && <li><strong>購票與預約：</strong>{event.booking}</li>}
      </ul>
      <p><strong>提醒：</strong>{event.caution}</p>
      <div className="seo-buy-links seo-action-links" aria-label={`${event.shortName}相關連結`}>
        <a className="seo-buy-link" href={winterMapsUrl(event)} target="_blank" rel="noopener noreferrer" data-event={`winter2026_map_${event.id}`} data-platform="Google Maps">Google 地圖</a>
        {event.sources.map((source, sourceIndex) => <a key={source.url} className="seo-buy-link" href={source.url} target="_blank" rel="noopener noreferrer" data-event={`winter2026_source_${event.id}_${sourceIndex}`} data-platform="official">{sourceIndex === 0 ? '活動官網' : source.label}</a>)}
      </div>
      {event.videos && <SeoVideoLinkMenu label="旅杰實拍短影音" links={event.videos.map((video, videoIndex) => ({ label: video.label, href: video.url, event: `winter2026_video_${event.id}_${videoIndex}`, platform: video.url.includes('instagram.com') ? 'Instagram' : 'YouTube' }))} />}
    </article>
  )
}

export default async function WinterIlluminations2026Page({ searchParams }: { searchParams?: PageSearchParams }) {
  const params = (await searchParams) ?? {}
  const from = Array.isArray(params.from) ? params.from[0] : params.from
  const backHref = from === 'tokyo' ? '/tokyo' : from === 'osaka' ? '/osaka' : '/'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <WinterGuideMap initialRegion={from === 'osaka' ? 'osaka' : 'tokyo'} backHref={backHref}>
      <article className={`busan-main transport-main seo-page narita-transport-page ${styles.guide}`}>
        <SeoHeroSection
          headingLevel="h2"
          badge={`日本冬季旅遊｜${checkedDateLabel} 更新`}
          h1="2026 日本熱門耶誕活動整理｜東京、橫濱、大阪、札幌聖誕市集與點燈"
          intro={`東京聖誕市集、澀谷青之洞窟、橫濱紅磚倉庫、札幌慕尼黑、大阪天王寺與梅田，都是冬季熱門選擇。這篇按 ${winterRegions.length} 個區域整理 ${winterEvents.length} 處耶誕市集、點燈與樂園活動，附活動地圖、日期、費用與交通。`}
          eventPrefix="winter2026"
          showVisual={false}
          ctaLinks={[
            ...winterRegions.map((region) => ({ label: region.name, href: `#${region.id}-activities`, dataEvent: `winter2026_hero_${region.id}` })),
            { label: '活動地圖', href: '#activity-map', dataEvent: 'winter2026_hero_map' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-labelledby="quick-answer-title">
          <h2 className="seo-h2" id="quick-answer-title">第一次選耶誕活動，先看這些經典選擇</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li><strong>東京逛市集：</strong>東京聖誕市集的新豐洲、芝公園兩會場，還有六本木、麻布台與晴空塔。</li>
              <li><strong>港景與北海道氣氛：</strong>橫濱紅磚倉庫、札幌慕尼黑聖誕市集。</li>
              <li><strong>關西逛市集：</strong>大阪天王寺、梅田藍天大廈，或另排神戶布引香草園。</li>
              <li><strong>城市散步與大型燈海：</strong>澀谷青之洞窟、丸之內、日比谷、御堂筋、名花之里；樂園則可選迪士尼、USJ、豪斯登堡。</li>
            </ul>
            <p>多數聖誕市集在 12/25 前後結束，部分冬季燈飾延續到隔年。澀谷青之洞窟已公布於 12/11～12/27、每天 17:00～22:00 點燈；下列時間皆為日本當地時間。</p>
          </div>
        </section>

        {winterRegions.map((region) => <section key={region.id} className="seo-content" id={`${region.id}-activities`} aria-labelledby={`${region.id}-title`}>
          <h2 className="seo-h2" id={`${region.id}-title`}>{regionGuides[region.id].title}</h2>
          <div className="seo-prose">
            <p>{regionGuides[region.id].intro}</p>
            {winterEvents.filter((event) => event.region === region.id).map((event) => <Activity key={event.id} event={event} index={winterEvents.findIndex((item) => item.id === event.id)} />)}
          </div>
        </section>)}

        <SeoFaqSection title="日本聖誕點燈常見問題" items={winterFaqItems} />

        <section className="seo-content" id="sources" aria-labelledby="sources-title">
          <h2 className="seo-h2" id="sources-title">資料來源與更新</h2>
          <div className="seo-prose">
            <p>本頁更新於 <time dateTime={WINTER_GUIDE_CHECKED_AT}>{checkedDateLabel}</time>。選點參考多篇日本旅遊整理，再以主辦單位的本季公告核對日期、會場與營業時間，各活動下方附官方連結。臨時調整與票券販售狀況，請在出發前再次確認。</p>
            <p>延伸閱讀與選點參考：</p>
            <ul>{winterEditorialReferences.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
            <p><a href="https://illumi.walkerplus.com/" target="_blank" rel="noopener noreferrer" data-event="winter2026_source_walkerplus">Walkerplus 日本點燈特集</a>可以找更多活動；部分頁面仍是上季資料，請核對年份與主辦單位公告。</p>
          </div>
        </section>

        <SeoRelatedLinksSection
          title="延伸閱讀：日本冬季旅遊"
          links={[
            { label: '東京旅遊攻略', href: '/tokyo', event: 'winter2026_related_tokyo' },
            { label: '大阪旅遊攻略', href: '/osaka', event: 'winter2026_related_osaka' },
            { label: '日本賞楓預測', href: '/japan/autumn-leaves-forecast-2026', event: 'winter2026_related_autumn' },
          ]}
        />
      </article>
      </WinterGuideMap>
    </>
  )
}
