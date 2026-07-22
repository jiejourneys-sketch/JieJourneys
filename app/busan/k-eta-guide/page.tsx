import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import type { PageSearchParams } from '@/lib/plannerReturn'
import { kEtaGuideCanonical, kEtaGuideDescription, kEtaGuideTitle } from './pageMeta'

const SITE_URL = 'https://www.jiejourneys.com'
const K_ETA_URL = 'https://www.k-eta.go.kr/portal/newapply/index.do?locale=TW'

const videoLinks = [
  { label: 'IG Reels', href: 'https://www.instagram.com/reel/DKetNmXTW3E/', event: 'ketaguide_video_ig', platform: 'IG', primary: true },
  { label: 'YouTube', href: 'https://www.youtube.com/shorts/AXevOEDDzB0', event: 'ketaguide_video_yt', platform: 'YouTube' },
]

const exemptionGroups = [
  { area: '亞洲（5）', countries: '台灣、日本、香港、新加坡、澳門' },
  { area: '美洲（2）', countries: '美國（含關島）、加拿大' },
  { area: '歐洲（13）', countries: '英國、德國、法國、義大利、荷蘭、西班牙、波蘭、瑞典、芬蘭、挪威、比利時、丹麥、奧地利' },
  { area: '大洋洲（2）', countries: '紐西蘭、澳洲' },
]

const faqItems = [
  {
    q: '台灣護照 2026 去韓國要申請 K-ETA 嗎？',
    a: '截至 2026 年 12 月 31 日，台灣在 K-ETA 暫免的 22 個國家／地區中，短期觀光通常不用申請。不過入境規則可能調整，出發前應再到 K-ETA 官方網站或駐台北韓國代表部確認。',
  },
  {
    q: 'K-ETA 暫免後，還要填電子入境卡嗎？',
    a: '通常要。K-ETA 暫免只是不必申請 K-ETA；沒有有效 K-ETA 的旅客，仍應依規則提交電子或紙本入境卡。想免填入境卡的是持有有效 K-ETA 的旅客，不是 K-ETA 暫免旅客。',
  },
  {
    q: 'K-ETA 要多少錢、多久核准？',
    a: '官方申請費是 10,000 韓元，另加線上付款金流費，常見結帳總額約 10,300 韓元；一般審查在 72 小時內，但官方明示可能更久且沒有急件。建議至少提早一週申請。',
  },
  {
    q: 'K-ETA 有效多久？需要每次去韓國都重辦嗎？',
    a: '現行新申請通常有效 3 年，若護照更早到期則到護照到期日為止；有效期內可多次使用，但每次可停留多久仍要看你的國籍免簽規定。2023 年 7 月 3 日前的舊申請才是 2 年有效。',
  },
  {
    q: '其他國籍旅客是不是都要申請 K-ETA？',
    a: '不一定。K-ETA 是給符合免簽入境資格的旅客使用，不是簽證；有些護照需事先辦簽證，也可能有其他特別規則。請用 K-ETA 官方「可申請國家／對象」及所在地韓國使領館公告確認，不要直接套用台灣的 22 國暫免規則。',
  },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: kEtaGuideTitle.replace(' | JieJourneys(旅杰)', ''),
  description: kEtaGuideDescription,
  inLanguage: 'zh-Hant',
  mainEntityOfPage: kEtaGuideCanonical,
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

type KEtaGuidePageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'video' || value === 'busan-video') return '/busan/video'
  if (value === 'preparation' || value === 'busan-preparation-guide') return '/busan/busan-preparation-guide'
  if (value === 'e-arrival' || value === 'korea-e-arrival-card-guide') return '/busan/korea-e-arrival-card-guide'
  return '/busan'
}

export default async function KEtaGuidePage({ searchParams }: KEtaGuidePageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <CitySubpageHeader backHref={backHref} eventPrefix="ketaguide" />
      <main className="busan-main transport-main seo-page narita-transport-page">
        <SeoHeroSection
          badge="韓國入境教學"
          h1="韓國 K-ETA 到底要不要申請？｜2026 免申請 22 國、費用與有效期"
          intro="先確認你是不是 K-ETA 暫免的 22 個國家／地區之一，再決定要不要申請。台灣旅客 2026 年通常可免申請，但仍要處理電子入境卡；其他護照則不能直接照台灣規則判斷。"
          eventPrefix="ketaguide"
          showVisual={false}
          ctaLinks={[
            { label: '22 國名單', href: '#exempt-countries', dataEvent: 'ketaguide_hero_exempt', platform: 'article' },
            { label: '前往官方申請', href: K_ETA_URL, dataEvent: 'ketaguide_hero_apply', platform: 'Official' },
            { label: '電子入境卡', href: '/busan/korea-e-arrival-card-guide?from=k-eta-guide', dataEvent: 'ketaguide_hero_earrival', platform: 'article' },
          ]}
        />

        <section className="seo-content" id="quick-answer" aria-label="K-ETA 快速結論">
          <div className="narita-summary-grid haneda-summary-grid" role="list">
            <div role="listitem">
              <span className="narita-summary-label">台灣旅客</span>
              <strong>2026 年暫免 K-ETA</strong>
              <p>期限到 2026 年 12 月 31 日；短期觀光通常不用申請，但要確認出發當下規則。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">22 國</span>
              <strong>免 K-ETA，不是免入境卡</strong>
              <p>沒有有效 K-ETA 時，通常仍需提交電子或紙本入境卡。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">申請費</span>
              <strong>10,000 韓元＋金流費</strong>
              <p>常見結帳約 10,300 韓元，拒絕也不退費；只使用官方網站或 App。</p>
            </div>
            <div role="listitem">
              <span className="narita-summary-label">有效期</span>
              <strong>新申請通常 3 年</strong>
              <p>若護照更早到期則到護照到期日；不是舊資訊常寫的固定 2 年。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="video-guide" aria-label="K-ETA 短影音">
          <h2 className="seo-h2">先看短影音：K-ETA 是否要申請？</h2>
          <div className="seo-prose">
            <p>影片先幫你快速判斷自己有沒有落在暫免名單；出發前則請回到文章核對日期、國籍和電子入境卡規則。</p>
            <SeoVideoLinkMenu label="韓國 K-ETA 是否要申請？" links={videoLinks} />
          </div>
        </section>

        <section className="seo-content" id="exempt-countries" aria-label="K-ETA 暫免 22 國">
          <h2 className="seo-h2">你是 22 個 K-ETA 暫免國家／地區之一嗎？</h2>
          <div className="seo-prose">
            <p>
              韓國政府將這一批國家／地區的 K-ETA 暫免延長到 <strong>2026 年 12 月 31 日</strong>（韓國時間）。以下名單適用於短期、免簽入境情境；旅行目的、停留時間或個人簽證身分不同時，仍要以官方系統和韓國使領館規則為準。
            </p>
            <div className="narita-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>區域</th>
                    <th>2026 年 K-ETA 暫免國家／地區</th>
                  </tr>
                </thead>
                <tbody>
                  {exemptionGroups.map((group) => (
                    <tr key={group.area}>
                      <td>{group.area}</td>
                      <td>{group.countries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              台灣、日本、香港、新加坡、澳門都在這份 22 國名單內。最容易誤會的是：<strong>免申請 K-ETA 不等於免填入境卡</strong>。只有已持有有效 K-ETA 的旅客，才能享有不需另填入境卡的權益；暫免 K-ETA 的旅客通常仍要在正確時間提交電子入境卡。
            </p>
            <p>台灣讀者可先依本文的名單確認；其他護照則要先確認是否符合 K-ETA 或簽證的適用條件，不要直接套用台灣的規則。</p>
          </div>
        </section>

        <section className="seo-content" id="who-should-apply" aria-label="哪些旅客應申請 K-ETA">
          <h2 className="seo-h2">不在暫免名單，就一定要申請 K-ETA 嗎？不一定</h2>
          <div className="seo-prose">
            <p>
              K-ETA 是給<strong>符合免簽入境資格</strong>、但需要電子旅行許可的外國旅客使用，它不是簽證。也就是說，其他國籍不能直接理解成「不在 22 國就去填 K-ETA」：有些人可以申請 K-ETA，有些人需要先辦韓國簽證，或有其他入境規則。
            </p>
            <p>
              最安全的判斷順序是：先看自己護照的免簽／簽證資格，再確認 K-ETA 是否適用，最後處理電子入境卡。K-ETA 官方網站明確說明，K-ETA 是免簽入境條件的一部分，不是保證入境的簽證；最終仍由入境審查決定。
            </p>
          </div>
        </section>

        <section className="seo-content" id="how-to-apply" aria-label="K-ETA 申請方式">
          <h2 className="seo-h2">需要 K-ETA 的旅客：申請前準備與正確做法</h2>
          <div className="seo-prose">
            <p>
              申請時只使用
              <a href={K_ETA_URL} target="_blank" rel="noopener noreferrer" data-event="ketaguide_official_apply" data-platform="Official" data-section="article_link">
                <strong> K-ETA 官方申請網站</strong>
              </a>
              或 K-ETA App。不要相信代辦網站的「急件保證」或高額服務費，官方沒有可插隊的急件審查。
            </p>
            <ul>
              <li><strong>有效護照：</strong>申請資料要完全符合護照。K-ETA 有效期最長只到護照到期日；護照即將到期時，先換發再申請比較不會浪費有效期。</li>
              <li><strong>住宿與旅行資訊：</strong>準備韓國住宿地址、聯絡資訊、入境目的與預計出入境日期。</li>
              <li><strong>可付款的信用卡／金融卡：</strong>官方申請費為 10,000 韓元，另收線上付款金流費；常見總額約 10,300 韓元，申請被拒也不退款。</li>
              <li><strong>可收信的 Email：</strong>申請結果與後續旅行資料更新都要用到，姓名、護照號碼和 Email 都要反覆核對。</li>
            </ul>
            <p>
              官方表示審查一般在 72 小時內，但可能因申請量而超過 72 小時，並沒有急件服務。不要等到登機前 3 天才申請；至少提早一週會安心得多。
            </p>
          </div>
        </section>

        <section className="seo-content" id="validity" aria-label="K-ETA 有效期與入境卡">
          <h2 className="seo-h2">K-ETA 有效期、列印與電子入境卡</h2>
          <div className="seo-prose">
            <h3 className="seo-h3">新申請通常有效 3 年，不是固定 2 年</h3>
            <p>
              現行 K-ETA 新申請通常可在有效期內多次使用，效期為 3 年；若護照到期日早於 3 年，效期會隨護照到期。2023 年 7 月 3 日前送出的舊 K-ETA 才適用 2 年，因此不要把舊文章的「2 年」套到現在的新申請。
            </p>
            <h3 className="seo-h3">不需要把列印當成必填，但把核准資訊留在手機</h3>
            <p>
              K-ETA 是電子旅行許可，航空公司與入境系統會以護照資料查核。把核准 Email、申請號碼或結果頁留在手機，必要時也可以備一份紙本，會比完全不留紀錄安心；但不要因為少了一張列印紙就以為許可失效。
            </p>
            <h3 className="seo-h3">持有效 K-ETA 可免填入境卡</h3>
            <p>
              這是部分暫免旅客仍願意自行申請 K-ETA 的原因：持有有效 K-ETA 可免提交電子／紙本入境卡。不過如果你是 2026 年的台灣短期觀光旅客，通常只要免費填
              <a href="/busan/korea-e-arrival-card-guide?from=k-eta-guide" data-event="ketaguide_earrival_article" data-platform="article" data-section="article">
                <strong>韓國電子入境卡</strong>
              </a>
              就可以，不必為了省一份申報多付 K-ETA 費用。
            </p>
            <p>
              K-ETA 的費用、審查時間與有效期可能調整，出發前再確認一次最穩。
            </p>
          </div>
        </section>

        <SeoFaqSection title="K-ETA 常見問題" items={faqItems} />
      </main>
      <Footer />
    </>
  )
}
