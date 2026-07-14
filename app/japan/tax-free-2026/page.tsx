import Image from 'next/image'
import CitySubpageHeader from '@/components/CitySubpageHeader'
import Footer from '@/components/Footer'
import PromoLink from '@/components/PromoLink'
import SeoHeroSection from '@/components/seo/SeoHeroSection'
import SeoFaqSection from '@/components/seo/SeoFaqSection'
import type { PageSearchParams } from '@/lib/plannerReturn'

const SITE_URL = 'https://www.jiejourneys.com'
const PAGE_PATH = '/japan/tax-free-2026'
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`
const UPDATED_AT = '2026-07-14'
const WAMAZING_SHOP_URL = 'https://af-wamazing.catsys.jp/c5e3c193y273353e/cl/?bId=g222b339'
const WAMAZING_REFERRAL_URL = 'https://tw.wamazing.com/kaimono/lp/referral-campaign'

const title = '日本退稅新制懶人包｜2026/11/1 起免稅流程、機場退稅、完美行購物一次看懂'
const description =
  '日本 2026 年 11 月 1 日起調整外國旅客免稅制度，從現場直接免稅改為先付款、出境確認後退稅。整理新舊制度差異、退稅流程、KIOSK 與人工櫃檯注意事項，以及完美行購物優惠碼 GGGT6XAA。'

const faqItems = [
  {
    q: '2026/11/1 後還能在日本店內現場直接免稅嗎？',
    a: '新制上路後，原則上會改成購物時先支付含稅金額，再於離境時完成持出確認與退稅程序。',
  },
  {
    q: '化妝品、零食、藥妝還需要裝密封袋嗎？',
    a: '新制重點之一是取消一般商品與消耗商品的區分，也會取消消耗商品密封包裝等舊制要求。',
  },
  {
    q: '2026/11/1 後所有商品都只要滿 5,000 日圓嗎？',
    a: '新制會取消一般商品與消耗商品區分，下限金額也會改成不分商品類別判定；旅客仍需符合免稅資格並把商品帶出日本。',
  },
  {
    q: '退稅一定要到機場嗎？',
    a: '新制核心是由海關進行持出確認後才成立免稅，因此離境前要預留辦理退稅與商品查驗時間；實際動線依出境機場公告為準。',
  },
  {
    q: '完美行購物 2026/11/1 後還能直接免稅價購買嗎？',
    a: '目前完美行購物可線上以免稅價格購買並於指定取貨點領取；但新制上路後是否調整流程，仍要以完美行後續官方公告為準。',
  },
]

type JapanTaxFree2026PageProps = {
  searchParams?: PageSearchParams
}

function sourceBackHref(from: string | string[] | undefined) {
  const value = Array.isArray(from) ? from[0] : from
  if (value === 'osaka-video') return '/osaka/video'
  if (value === 'tokyo-video') return '/tokyo/video'
  return '/tokyo/video'
}

export default async function JapanTaxFree2026Page({ searchParams }: JapanTaxFree2026PageProps) {
  const params = (await searchParams) ?? {}
  const backHref = sourceBackHref(params.from)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'zh-Hant',
    datePublished: UPDATED_AT,
    dateModified: UPDATED_AT,
    mainEntityOfPage: PAGE_URL,
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
    image: `${SITE_URL}/assets/japan-tax-free-comparison-2026.png`,
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
      <CitySubpageHeader backHref={backHref} eventPrefix="japantaxfree" />
      <main className="busan-main transport-main seo-page japan-tax-free-page">
        <SeoHeroSection
          badge="日本購物攻略"
          h1="日本退稅新制懶人包｜2026/11/1 起全面改變"
          intro="日本將於 2026 年 11 月 1 日實施新的外國旅客免稅制度，最大的改變是從店內直接免稅，改成先付款、離境時確認後退稅。這篇整理新舊制度差異、機場退稅流程，以及想省排隊時間可以先知道的完美行購物方式。"
          eventPrefix="japantaxfree"
          showVisual={false}
          ctaLinks={[
            { label: '新舊制度比較', href: '#comparison', dataEvent: 'japantaxfree_hero_comparison', platform: 'article' },
            { label: '2026 後流程', href: '#after-flow', dataEvent: 'japantaxfree_hero_after_flow', platform: 'article' },
            { label: '完美行購物', href: '#wamazing', dataEvent: 'japantaxfree_hero_wamazing', platform: 'article' },
          ]}
        />

        <section className="seo-content" aria-label="日本退稅新制重點">
          <p className="article-updated">最後更新：2026/07/14。制度細節與機場動線可能持續調整，出發前請再確認最新公告。</p>
          <div className="tax-free-summary-grid" role="list">
            <div role="listitem">
              <span className="summary-label">上路日期</span>
              <strong>2026/11/1</strong>
              <p>日本外國旅客免稅制度改為「先付款、後退稅」的 refund 方式。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">最大差異</span>
              <strong>不再店內直接扣稅</strong>
              <p>購物時先支付含稅價格，離境前完成持出確認後再退還消費稅。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">購物門檻</span>
              <strong>商品滿 5,000 日圓</strong>
              <p>新制取消一般商品與消耗商品區分，下限金額也不再分開判定。</p>
            </div>
            <div role="listitem">
              <span className="summary-label">行李提醒</span>
              <strong>托運前先辦退稅</strong>
              <p>可能需要出示購買商品，建議不要太早把退稅商品放進托運行李。</p>
            </div>
          </div>
        </section>

        <section className="seo-content" id="comparison" aria-label="日本退稅新舊制度比較">
          <h2 className="seo-h2">日本退稅制度什麼時候改？</h2>
          <div className="seo-prose">
            <p>
              日本新退稅制度預定於 <strong>2026 年 11 月 1 日</strong> 正式上路。簡單分成兩段看：
            </p>
            <ul>
              <li>2026/11/1 前：店內現場直接免稅。</li>
              <li>2026/11/1 後：購物時先付款，離境時完成確認後退稅。</li>
            </ul>

            <figure className="seo-figure tax-free-wide-figure">
              <Image
                src="/assets/japan-tax-free-comparison-2026.png"
                alt="日本退稅新制新舊制度比較圖，整理 2026 年 11 月 1 日前後退稅方式、商品區分與密封袋差異"
                width={1113}
                height={1024}
                sizes="(max-width: 820px) 100vw, 920px"
                priority
              />
              <figcaption>2026/11/1 前後最大的差異，是退稅地點從店內移到離境前的出境確認流程。</figcaption>
            </figure>

            <div className="tax-free-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>2026/11/1 前</th>
                    <th>2026/11/1 後</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>退稅方式</td>
                    <td>現場直接免稅</td>
                    <td>離境時辦理退稅</td>
                  </tr>
                  <tr>
                    <td>商品分類</td>
                    <td>一般商品、消耗商品</td>
                    <td>全部商品統一</td>
                  </tr>
                  <tr>
                    <td>最低消費</td>
                    <td>一般商品 5,000 日圓以上；消耗商品 5,000 至 50 萬日圓</td>
                    <td>不分商品類別，滿 5,000 日圓即可判定</td>
                  </tr>
                  <tr>
                    <td>密封袋</td>
                    <td>消耗商品需密封</td>
                    <td>取消密封袋規定</td>
                  </tr>
                  <tr>
                    <td>商品使用</td>
                    <td>消耗商品出境前不能拆封使用</td>
                    <td>取消一般商品與消耗商品區分後，舊制包裝限制一併調整</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="seo-content" aria-label="2026 年 11 月 1 日前退稅流程">
          <h2 className="seo-h2">2026/11/1 前退稅流程</h2>
          <div className="seo-prose">
            <p>目前制度相對簡單，只要在 Japan Tax-free Shop 消費並符合門檻，結帳時出示護照，店家就會直接扣除消費稅。</p>

            <figure className="seo-figure tax-free-portrait-figure">
              <Image
                src="/assets/japan-tax-free-before-2026.png"
                alt="2026 年 11 月 1 日前日本免稅流程，包含免稅店、商品區分與現場出示護照結帳"
                width={1024}
                height={1365}
                sizes="(max-width: 640px) 100vw, 560px"
              />
              <figcaption>舊制重點是「店內完成免稅」，消耗商品則有密封袋與出境前不得拆封的限制。</figcaption>
            </figure>

            <ol className="tax-free-steps">
              <li>到 Japan Tax-free Shop 消費。</li>
              <li>消費符合免稅門檻：一般商品 5,000 日圓以上，消耗商品 5,000 至 50 萬日圓。</li>
              <li>結帳時出示護照。</li>
              <li>店家直接扣除 10% 消費稅，付款完成後即可離開。</li>
            </ol>
          </div>
        </section>

        <section className="seo-content" id="after-flow" aria-label="2026 年 11 月 1 日後退稅流程">
          <h2 className="seo-h2">2026/11/1 後最新退稅流程</h2>
          <div className="seo-prose">
            <p>
              新制的核心是「先付稅、離境確認後退款」。旅客購物時會先支付含稅價格，離境前再完成持出確認與退稅程序。
            </p>

            <figure className="seo-figure tax-free-portrait-figure">
              <Image
                src="/assets/japan-tax-free-after-2026.png"
                alt="2026 年 11 月 1 日後日本免稅流程，包含免稅店購物、QR Code 收據、掃描登錄與托運前到 KIOSK 辦理退稅"
                width={1024}
                height={1792}
                sizes="(max-width: 640px) 100vw, 560px"
              />
              <figcaption>新制下，最重要的是在托運行李前完成退稅與可能的商品確認。</figcaption>
            </figure>

            <ol className="tax-free-steps">
              <li>到免稅店購物並消費滿 5,000 日圓。</li>
              <li>結帳時出示護照，取得購買紀錄或 QR Code 收據。</li>
              <li>依店家或系統指示登錄護照號碼、聯絡方式與退稅方式。</li>
              <li>抵達機場後，托運行李之前先前往退稅自助機或指定櫃檯。</li>
              <li>完成出境持出確認後，依指定方式取得退稅。</li>
            </ol>

            <h3 className="seo-h3">KIOSK 退稅成功怎麼辦？</h3>
            <p>
              如果自助機辦理成功，就代表退稅程序已完成；後續依現場指示正常托運行李與出境即可。退稅方式可能包含現金、信用卡或銀行帳戶，實際選項依系統與機場公告為準。
            </p>

            <h3 className="seo-h3">KIOSK 辦理失敗怎麼辦？</h3>
            <p>
              如果自助退稅失敗，就可能需要前往人工櫃檯。建議先準備護照、購買紀錄或 QR Code 收據，以及可能被查驗的購買商品；所以最保險的做法，是退稅完成前先不要把商品托運。
            </p>
          </div>
        </section>

        <section className="seo-content" id="wamazing" aria-label="完美行購物優惠">
          <h2 className="seo-h2">想減少排隊，可以先看完美行購物</h2>
          <div className="seo-prose">
            <p>
              如果你本來就知道要買藥妝、零食、電器或保健食品，目前可以使用完美行購物，線上直接以免稅價格購買，再選擇到指定機場置物櫃或部分取貨地點領取。旅途中不用一直提著購物袋，離開日本前集中取貨會輕鬆很多。
            </p>
            <p>
              需要注意的是，這是目前的購物與取貨方式。2026 年 11 月新退稅制度上路後，完美行是否仍能直接以免稅價格購買、是否需要另外完成退稅程序，仍要以完美行後續公布的最新規定為準。
            </p>

            <div className="wamazing-callout">
              <div>
                <span className="summary-label">旅杰讀者優惠碼</span>
                <strong>GGGT6XAA</strong>
                <p>第一次使用完美行購物時可輸入優惠碼，活動內容與折扣條件依官方最新公告為準。</p>
              </div>
              <div className="wamazing-actions">
                <PromoLink
                  href={WAMAZING_SHOP_URL}
                  promoCode="GGGT6XAA"
                  className="seo-buy-link primary"
                  data-event="japantaxfree_wamazing_shop"
                  data-platform="WAmazing"
                  data-section="article_cta"
                >
                  複製優惠碼並前往完美行購物
                </PromoLink>
                <a
                  href={WAMAZING_REFERRAL_URL}
                  className="seo-buy-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="japantaxfree_wamazing_referral"
                  data-platform="WAmazing"
                  data-section="article_cta"
                >
                  查看揪團買活動
                </a>
              </div>
            </div>

            <h3 className="seo-h3">完美行購物有哪些優點？</h3>
            <ul>
              <li>目前可線上直接看免稅價。</li>
              <li>不用在店內排隊等退稅。</li>
              <li>不用旅途中一直提著購物袋。</li>
              <li>可在日本多個機場或指定地點取貨。</li>
              <li>揪團買活動可和折扣碼並用：同一日期與地點取貨時，符合條件者可享個人消費金額 5% 現金回饋。</li>
            </ul>
          </div>
        </section>

        <section className="seo-content" aria-label="日本退稅新制重點整理">
          <h2 className="seo-h2">日本退稅新制重點整理</h2>
          <div className="seo-prose">
            <ul className="tax-free-checklist">
              <li>2026/11/1 起，日本外國旅客免稅制度改制。</li>
              <li>購物時不再店內直接扣稅，改成先付款、後退稅。</li>
              <li>所有商品取消一般商品與消耗商品區分。</li>
              <li>最低消費門檻改為不分商品類別判定，滿 5,000 日圓即可。</li>
              <li>消耗商品密封袋規定取消。</li>
              <li>離境前需要完成持出確認，機場可能需要預留更多時間。</li>
              <li>想省去旅途中提袋與店內排隊，可先評估完美行購物等預購取貨方式。</li>
            </ul>
          </div>
        </section>

        <SeoFaqSection title="日本退稅新制常見問題" items={faqItems} />

      </main>
      <Footer />
    </>
  )
}
