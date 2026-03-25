import type { Metadata } from 'next'
import Script from 'next/script'
import JourneysHeader from '@/components/JourneysHeader'

export const metadata: Metadata = {
  title: '釜山五日行程 | JieJourneys',
}

export default function BusanJourneysPage() {
  return (
    <>
      <JourneysHeader backHref="/busan" eventPrefix="busanPDF" />

      <main className="container">
        <section className="buy-box" aria-label="購買區塊">
          <div>
            <h1>釜山五日行程</h1>
            <p>自由行詳細動線｜含所有熱門景點和美食｜不用花時間｜照著走就對了</p>
            <div className="badges">
              <span className="badge">📍 一鍵導航</span>
              <span className="badge">🧭 最佳動線</span>
              <span className="badge">🎞️ 圖影導覽</span>
              <span className="badge">🧾 票券連結</span>
            </div>
            <p className="price">NT$399</p>
            <p className="price-note">可立即收到完整 PDF｜永久使用</p>
          </div>

          <div>
            <div className="form" style={{ marginTop: 12, textAlign: 'center' }}>
              <a href="/busan/journeys/order.html" className="btn buy-now big-btn" data-event="busanPDF_clickbuy" data-item="cta">
                立即取得PDF
              </a>
              <div className="cta-secondary">
                <a className="secondary-btn" href="https://www.instagram.com/reel/DOQv5njkT4I/" target="_blank" rel="noopener noreferrer" data-event="busanPDF_TrialIG">
                  🎬 30秒看怎麼用
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>行程特色</h2>
          <p className="sub">精準濃縮，打開就能用｜圖片動線＋導航連結，照著走就能輕鬆玩</p>
          <div className="features">
            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/checklist.png" alt="行前準備清單" />
              <div className="title"><span className="icon">🧰</span> 行前準備</div>
              <p>一次處理簽證、住宿、票券、換匯、地圖、交通、規定。</p>
            </article>

            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/gonglue.png" alt="互動檔案與資訊" />
              <div className="title"><span className="icon">🗺️</span> 互動檔案</div>
              <p>最佳動線、地圖連結、圖影導覽、美食連結、營業時間。</p>
            </article>

            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/haian.png" alt="景點精選照片" />
              <div className="title"><span className="icon">📌</span> 景點精選</div>
              <p>膠囊列車、甘川洞、松島纜車、海雲台、白淺灘、廣安里。</p>
            </article>

            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/meishi.JPG" alt="美食清單照片" />
              <div className="title"><span className="icon">🍽️</span> 美食清單</div>
              <p>豬肉湯飯、蔘雞湯、韓式炸雞、雪濃湯、烤肉、炸醬麵、海鮮。</p>
            </article>

            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/fengjing.JPG" alt="體驗活動圖像" />
              <div className="title"><span className="icon">✨</span> 特色體驗</div>
              <p>海景咖啡廳、空中步道、韓服體驗、遊艇、汗蒸幕、海岸列車。</p>
            </article>

            <article className="feature">
              <img className="thumb" src="/busan/journeys/assets/gouwu.JPG" alt="購物地點圖像" />
              <div className="title"><span className="icon">🛍️</span> 必逛購物</div>
              <p>Olive Young、DAISO、樂天超市，一次逛好逛滿。</p>
            </article>
          </div>
        </section>

        <section id="faq" className="section" aria-label="常見問題">
          <h2>常見問題</h2>
          <details data-event="busanPDF_Q1">
            <summary>這份攻略適合誰？</summary>
            <p>想少做功課、直接照表走的人；第一次去釜山或只想玩重點的人。</p>
          </details>
          <details data-event="busanPDF_Q2">
            <summary>付款後多久收到？</summary>
            <p>一般 1–3 分鐘寄達你的 Email；若未收到請檢查垃圾信件匣。</p>
          </details>
          <details data-event="busanPDF_Q3">
            <summary>檔案格式與觀看方式？</summary>
            <p>PDF 格式，手機/平板/電腦皆可開啟；內含可點擊的導航與連結。</p>
          </details>
          <details data-event="busanPDF_Q4">
            <summary>是否包含門票或交通？</summary>
            <p>本產品為攻略檔案，不含實體票券；文內提供購買連結與使用說明。</p>
          </details>
          <details data-event="busanPDF_Q5">
            <summary>可以退款嗎？</summary>
            <p>屬於可複製之數位商品，原則上不提供退費；若檔案有問題請來信協助。</p>
          </details>
        </section>
      </main>

      <div className="buy-bar show" role="region" aria-label="快速購買工具列">
        <div>
          <strong>釜山五日行程</strong>
          <div className="secure">🔒 即時寄送 PDF</div>
        </div>
        <div className="price">NT$399</div>
        <a href="/busan/journeys/order.html" className="btn buy-now" data-event="busanPDF_clickbuy1" data-item="cta">
          立即取得PDF
        </a>
      </div>

      <footer id="contact" style={{ padding: '16px', textAlign: 'center', fontSize: 14, lineHeight: 1.6, background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}>
        <div><strong>JieJourneys</strong></div>
        <div>客服信箱：JieJourneys@gmail.com</div>
        <div>服務時間：週一～週五 09:00–17:00</div>
      </footer>

      <Script id="busan-journeys-faq-ga" strategy="afterInteractive">
        {`
          (function(){
            if (typeof gtag !== 'function') return;
            document.querySelectorAll('#faq details').forEach(d => {
              d.addEventListener('toggle', () => {
                if (!d.open) return;
                const q = d.querySelector('summary')?.textContent?.trim() || '';
                gtag('event', 'bt_faq_open', {
                  page_path: location.pathname,
                  qid     : d.dataset.event || '',
                  question: q
                });
              });
            });
          })();
        `}
      </Script>
    </>
  )
}
