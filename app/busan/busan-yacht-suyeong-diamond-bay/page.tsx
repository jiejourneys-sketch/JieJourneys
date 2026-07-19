import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  busanYachtCanonical,
  busanYachtDescription,
  busanYachtTitle,
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
    { label: 'IG｜遊艇比較', href: 'https://www.instagram.com/reel/DVTW_MLkpj4/', event: 'busanyacht_video_ig', platform: 'IG', primary: true },
    { label: 'YouTube', href: 'https://www.youtube.com/shorts/N56k5869RVw', event: 'busanyacht_video_youtube', platform: 'YouTube' },
  ],
  suyeong: [
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/134684-yacht-holic-busan-yacht-public-tour-gwangan-ri-haeundae-south-korea?cid=22312', event: 'busanyacht_suyeong_kkday', platform: 'KKDAY', primary: true },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/43419-busan-luxury-yacht-experience/?aid=93798', event: 'busanyacht_suyeong_klook', platform: 'KLOOK' },
    { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/96899974/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D12650990', event: 'busanyacht_suyeong_trip', platform: 'Trip' },
    { label: '地圖', href: '/busan/map?place=busan-yacht-holic', event: 'busanyacht_suyeong_map', platform: 'map' },
  ],
  diamond: [
    { label: 'Pass預約', href: 'https://diamondbay-tw.imweb.me/vbp-tw', event: 'busanyacht_diamond_reserve', platform: 'Official', primary: true },
    { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312', event: 'busanyacht_diamond_pass_kkday', platform: 'KKDAY' },
    { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798', event: 'busanyacht_diamond_pass_klook', platform: 'KLOOK' },
    { label: '地圖', href: '/busan/map?place=busan-diamond-bay-yacht', event: 'busanyacht_diamond_map', platform: 'map' },
  ],
  drone: [
    { label: '無人機表演表', href: 'https://www.gwangallimdrone.co.kr/en/overview', event: 'busanyacht_drone_official', platform: 'Official', primary: true },
  ],
}

const faqItems = [
  {
    q: '釜山遊艇水營灣和鑽石灣差在哪？',
    a: '水營灣多是小型遊艇，拍照、拍立得、夜間煙火體驗感比較強；鑽石灣是大型雙體遊艇，船體更穩、有室內候船空間，也可以搭配釜山Pass使用。',
  },
  {
    q: '釜山Pass可以搭水營灣遊艇嗎？',
    a: '不行。釜山Pass常見可使用的是鑽石灣遊艇，水營灣遊艇要另外購票。',
  },
  {
    q: '釜山遊艇可以看到廣安里無人機表演嗎？',
    a: '廣安里 M Drone Light Show 通常週六夜間演出；能不能剛好在船上看到，仍要看出航時間、航線位置與天候公告。',
  },
  {
    q: '想拍照應該選哪一種釜山遊艇？',
    a: '如果重點是拍照、拍立得、煙火氛圍，我會先看水營灣；如果重點是用釜山Pass、省預算、坐得比較穩，就選鑽石灣。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: busanYachtTitle.replace(' | JieJourneys(旅杰)', ''),
  description: busanYachtDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: busanYachtCanonical,
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

type BusanYachtPageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video') return '/busan/video'
  if (value === 'map') return '/busan/map?place=busan-yacht-holic'
  return '/busan/ticket?tag=%E9%81%8A%E8%89%87#ticketListTitle'
}

export default async function BusanYachtPage({ searchParams }: BusanYachtPageProps) {
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
      <CitySubpageHeader backHref={backHref} eventPrefix="busanyacht" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="釜山景點攻略"
          h1="釜山遊艇怎麼選？水營灣 vs 鑽石灣"
          intro="釜山遊艇主要分成兩種：水營灣遊艇和鑽石灣遊艇。兩個都看海、都能接近廣安大橋，但玩法完全不一樣：一個偏小型拍照體驗，一個偏大型穩定、能搭配釜山Pass。"
          eventPrefix="busanyacht"
          showVisual={false}
          ctaLinks={[
            { label: '快速結論', href: '#quick-answer', dataEvent: 'busanyacht_hero_quick', platform: 'article' },
            { label: '路線比較', href: '#routes', dataEvent: 'busanyacht_hero_routes', platform: 'article' },
            { label: '購票連結', href: '#ticket-links', dataEvent: 'busanyacht_hero_links', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="釜山遊艇快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">想拍照</span>
              <strong>選水營灣</strong>
              <p>小型遊艇氛圍比較近，常見有拍立得、點心飲料和夜間煙火。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想用 Pass</span>
              <strong>選鑽石灣</strong>
              <p>可搭配釜山Pass，適合想把通行證價值用滿的人。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">怕暈船</span>
              <strong>鑽石灣較穩</strong>
              <p>大型雙體遊艇，船體更大，整體乘坐感比較穩定。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">想看表演</span>
              <strong>週六夜間看班表</strong>
              <p>廣安里無人機表演以官方公告為準，出航時間要對上才有機會。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="釜山遊艇短影音">
          <h2 className="seo-h2">先看 IG：水營灣 VS 鑽石灣重點</h2>
          <div className="seo-prose">
            <p>
              如果你想先用短影音建立概念，可以先看這支遊艇比較。看完再回來對照路線、船型和 Pass 規則，會比較快決定要買哪一種。
            </p>
            <SeoVideoLinkMenu label="遊艇比較" links={linkGroups.videos} />
          </div>
        </section>

        <section className="seo-content" id="routes" aria-label="釜山遊艇路線比較">
          <h2 className="seo-h2">路線比較：兩個都看海，但出發點和視角不同</h2>
          <div className="seo-prose">
            <p>
              釜山遊艇最容易混淆的地方，是水營灣其實有很多不同業者，集合碼頭可能在水營灣、海雲台、The Bay 101 一帶；鑽石灣則是從 Yongho Bay / Diamond Bay 端出發，路線規則比較固定。
            </p>

            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>水營灣遊艇</th>
                    <th>鑽石灣遊艇</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>常見路線</td>
                    <td>海洋城 / 冬柏島、海雲台、廣安大橋、廣安里海灘周邊，依業者和碼頭微調。</td>
                    <td>白天常見五六島 / 海雲台方向；夜間多看廣安大橋、海雲台夜景、冬柏島周邊。</td>
                  </tr>
                  <tr>
                    <td>航程時間</td>
                    <td>多數商品約 50 分鐘。</td>
                    <td>官方標示約 50 分鐘。</td>
                  </tr>
                  <tr>
                    <td>船型</td>
                    <td>偏小型遊艇，常見約 25 人上下，部分私人或共乘方案會不同。</td>
                    <td>大型雙層雙體遊艇，可容納約 88 位乘客，船體更大。</td>
                  </tr>
                  <tr>
                    <td>釜山Pass</td>
                    <td>不包含，通常要另外購票。</td>
                    <td>可搭配釜山Pass，但要先看可預約時段。</td>
                  </tr>
                  <tr>
                    <td>適合</td>
                    <td>想拍照、想要煙火氛圍、想選更多水營灣業者的人。</td>
                    <td>想用 Pass、想坐穩一點、想要室內候船空間的人。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" aria-label="水營灣遊艇介紹">
          <h2 className="seo-h2">水營灣遊艇：適合想拍照、拍立得和煙火的人</h2>
          <div className="seo-prose">
            <p>
              水營灣遊艇比較像「小型海上拍照體驗」。常見會經過海雲台、Marine City、冬柏島、廣安大橋、廣安里海灘一帶，航程多約 50 分鐘。
            </p>
            <ul className="narita-checklist">
              <li>小型遊艇，常見約 25 人上下，整體比較有近距離拍照感。</li>
              <li>常見提供點心、飲料、毛毯等服務，但每家業者內容不同。</li>
              <li>部分日間方案有拍立得或實體照片服務。</li>
              <li>夜間方案常見煙火服務，氣氛比單純看夜景更強。</li>
              <li>想拍照、看煙火、想要比較活潑的體驗，優先看水營灣。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" aria-label="鑽石灣遊艇介紹">
          <h2 className="seo-h2">鑽石灣遊艇：適合想用釜山Pass、想穩定舒適的人</h2>
          <div className="seo-prose">
            <p>
              鑽石灣是大型雙體遊艇，重點是穩定、空間大、可搭配釜山Pass。官方標示大型船可容納約 88 位乘客，且有私人候船空間和碼頭。
            </p>
            <ul className="narita-checklist">
              <li>大型遊艇，約 90 人級別，船體比一般小型遊艇穩。</li>
              <li>有室內候船室，天氣熱、下雨或帶長輩小孩會舒服一些。</li>
              <li>可使用釜山Pass，但仍需先預約並確認可用時段。</li>
              <li>白天有五六島 / 海雲台方向，夜間偏廣安大橋與海雲台夜景。</li>
              <li>想用 Pass 免費搭乘、或怕小船晃的人，優先看鑽石灣。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" aria-label="釜山遊艇無人機表演">
          <h2 className="seo-h2">週六夜間想看無人機，先確認廣安里官方班表</h2>
          <div className="seo-prose">
            <p>
              廣安里 M Drone Light Show 通常週六夜間演出，夏季和冬季時段不同。不過坐遊艇能不能剛好看到，取決於出航時間、船在海上的位置，以及當天天候是否照常演出。
            </p>
            <ActionLinks label="廣安里無人機表演官方資訊" links={linkGroups.drone} />
          </div>
        </section>

        <section className="seo-content" id="ticket-links" aria-label="釜山遊艇購票連結">
          <h2 className="seo-h2">購票連結：水營灣另外買，鑽石灣搭配 Pass</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">水營灣遊艇</h3>
            <p>
              想要拍照、拍立得、夜間煙火氛圍，就看水營灣。不同平台會有不同業者和集合點，下單前一定要確認集合碼頭。
            </p>
            <ActionLinks label="水營灣遊艇購票連結" links={linkGroups.suyeong} />

            <h3 className="seo-h3">鑽石灣遊艇</h3>
            <p>
              想用釜山Pass就看鑽石灣。先買 Pass，再確認鑽石灣可預約時段；熱門日子不要等到出發前才排。
            </p>
            <ActionLinks label="鑽石灣遊艇預約與通行證連結" links={linkGroups.diamond} />
          </div>
        </section>

        <section className="seo-content" aria-label="釜山遊艇結論">
          <h2 className="seo-h2">結論：你該選哪個？</h2>
          <div className="seo-prose">
            <ul className="narita-checklist">
              <li>想拍立得、煙火秀、比較有拍照互動感：選水營灣。</li>
              <li>想用釜山Pass、不想另外付遊艇票：選鑽石灣。</li>
              <li>怕暈船、帶長輩小孩、想要更穩定舒適：選鑽石灣。</li>
              <li>週六夜間想看無人機：先對官方表演時間，再選能對上的夜間航班。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="釜山遊艇常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
