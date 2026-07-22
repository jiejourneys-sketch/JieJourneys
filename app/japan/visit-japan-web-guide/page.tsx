import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import {
  visitJapanWebGuideCanonical,
  visitJapanWebGuideDescription,
  visitJapanWebGuideTitle,
} from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const VISIT_JAPAN_WEB_URL = 'https://www.vjw.digital.go.jp/'

const videoLinks = [
  {
    label: 'IG｜Visit Japan Web',
    href: 'https://www.instagram.com/reel/DSxI34Nkebp/',
    event: 'visitjapanweb_video_ig',
    platform: 'IG',
    primary: true,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/shorts/DWKvXvEHyKk',
    event: 'visitjapanweb_video_youtube',
    platform: 'YouTube',
  },
]

const faqItems = [
  {
    q: 'Visit Japan Web 一定要填嗎？',
    a: 'Visit Japan Web 可讓你先完成電子入境與海關申報；日本海關仍保留紙本申報表。出發前先完成電子流程，通常比抵達後再填表從容。',
  },
  {
    q: 'QR Code 可以截圖嗎？',
    a: '入境與海關使用的是一組統一 2D Code，建議在出發前先確認能順利顯示並保持可登入；可截圖作離線備份。要注意免稅購物用的 2D Code 不能使用截圖，須在服務頁面即時顯示。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: visitJapanWebGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: visitJapanWebGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: visitJapanWebGuideCanonical,
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

type VisitJapanWebGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video') return '/osaka/video'
  return '/tokyo/video'
}

export default async function VisitJapanWebGuidePage({ searchParams }: VisitJapanWebGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="visitjapanweb" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="日本行前準備"
          h1="Visit Japan Web 教學｜日本入境卡、海關申報、QR Code 怎麼填？"
          intro="出發前先把入境與海關資料填好，抵達日本就不用在飛機上或機場現場慢慢寫紙本。這篇照官方流程整理，把護照、住宿資料、海關申報與 QR Code 一次講清楚。"
          eventPrefix="visitjapanweb"
          showVisual={false}
          ctaLinks={[
            { label: '前往官方填寫', href: VISIT_JAPAN_WEB_URL, dataEvent: 'visitjapanweb_hero_official', platform: 'Official' },
            { label: '8 步流程', href: '#steps', dataEvent: 'visitjapanweb_hero_steps', platform: 'article' },
            { label: 'QR Code', href: '#qr-code', dataEvent: 'visitjapanweb_hero_qr', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="official-entry" aria-label="Visit Japan Web官方入口">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">官方網站</span>
              <strong>Visit Japan Web</strong>
              <p>只使用日本數位廳提供的官方服務；本服務與海關電子申報均不收費。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">完成內容</span>
              <strong>入境審查＋海關申報</strong>
              <p>完成兩個流程後，系統提供一組統一 2D Code 供抵達時出示或掃描。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">必備資料</span>
              <strong>護照、航班、住宿</strong>
              <p>英文姓名與護照一致；準備入境日期、航班編號、住宿英文地址與電話。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">最後確認</span>
              <strong>完成兩個申報</strong>
              <p>入境審查與海關申報都完成後，才會有可用於抵達流程的統一 2D Code。</p>
            </div>
          </div>
          <div className="seo-prose">
            <p>
              <a href={VISIT_JAPAN_WEB_URL} target="_blank" rel="noopener noreferrer" data-event="visitjapanweb_official_site" data-platform="Official" data-section="article_link">
                <strong>前往 Visit Japan Web 官方填寫</strong>
              </a>
              。Visit Japan Web 與海關電子申報都不收費。如果任何網站要求你支付「入境卡處理費」或代辦費，請不要輸入個資或付款；日本海關已提醒有假冒與收費代辦網站。
            </p>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="Visit Japan Web短影音">
          <h2 className="seo-h2">先看短影音：Visit Japan Web 入境卡填寫</h2>
          <div className="seo-prose">
            <p>影片先帶你看畫面流程；填寫時再依這篇檢查護照、航班、住宿與申報內容是否完整。</p>
            <SeoVideoLinkMenu label="Visit Japan Web" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="steps" aria-label="Visit Japan Web八個步驟">
          <h2 className="seo-h2">Visit Japan Web 8 個步驟</h2>
          <div className="seo-prose">
            <ol>
              <li><strong>進官方網站，建立帳號並登入：</strong>第一次使用以 Email 建立帳號，記得收驗證信。</li>
              <li><strong>登錄本人資料：</strong>依畫面掃描或輸入護照資訊，並逐欄核對英文姓名、國籍、護照號碼與有效期限是否和護照完全一致。</li>
              <li><strong>同行者要各自有資料：</strong>若使用同一台手機協助家人，仍要為每位旅客建立各自的護照資料與入境程序，不能共用同一組旅客資料。</li>
              <li><strong>登錄新的入境行程：</strong>輸入入境日期、航班與抵達安排。若畫面提供引用舊資料的選項，確認住宿與航班仍正確再使用；不確定就新建。</li>
              <li><strong>填日本聯絡方式／住宿：</strong>準備飯店英文名稱、地址、郵遞區號與電話。若頁面提供郵遞區號搜尋，可以用來減少輸入錯誤。</li>
              <li><strong>完成入境審查資料：</strong>依你自己的旅行目的與停留資訊照實填寫。</li>
              <li><strong>完成海關申報：</strong>題目要逐項照實回答。大多數一般觀光客未攜帶受管制物品、超額現金或另運物品時常會是「無」，但不要為了求快一律選無。</li>
              <li><strong>確認統一 2D Code：</strong>完成入境審查與海關申報後，先確認 QR Code 能顯示；抵達時在入境審查與海關流程依現場指示出示或掃描。</li>
            </ol>
          </div>
        </section>

        <section className="seo-content" id="qr-code" aria-label="Visit Japan Web QR Code使用方式">
          <h2 className="seo-h2">最後一步：統一 QR Code 怎麼用？</h2>
          <div className="seo-prose">
            <p>
              現在入境審查與海關申報使用的是一組統一 2D Code。抵達日本後，在入境審查櫃檯，以及海關電子申報終端或查驗桌依指示出示；有設置電子申報閘門的機場，完成終端操作後可走電子閘門。
            </p>
            <p>
              我的建議是：登機前先確認 QR Code 可開啟、帳號可登入，並可截圖當作離線備份。<strong>注意：免稅購物服務的 2D Code 不能使用截圖</strong>，若有使用該功能，需在服務頁面即時顯示。
            </p>
          </div>
        </section>

        <section className="seo-content" aria-label="Visit Japan Web結論">
          <h2 className="seo-h2">結論：資料照實填、先完成兩個申報、確認 QR Code</h2>
          <div className="seo-prose">
            <p>
              Visit Japan Web 的重點不是搶快填完，而是出發前把護照、航班、住宿、入境審查與海關申報一次核對好。填完兩個程序並確認統一 QR Code，就能少掉抵達時找表格、抄地址的手忙腳亂；海關題目一定要依自己的實際狀況回答。
            </p>
          </div>
        </section>

        <SeoFaqSection title="Visit Japan Web 常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
