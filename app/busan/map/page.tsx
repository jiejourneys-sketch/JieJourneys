'use client'

import MapClient from '@/components/map/MapClient'
import { busanMapPlaces, BUSAN_MAP_CENTER } from '@/data/busan/map/places'

export default function BusanMapPage() {
  return (
    <MapClient
      places={busanMapPlaces}
      mapCenter={BUSAN_MAP_CENTER}
      gtagPrefix="busanmap"
      collapseLocationLinks
      title="釜山景點地圖"
      backHref="/busan"
      defaultCategories={{ spot: true, free: true, shop: false, hotel: true }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'shop', label: '商店' },
        { key: 'hotel', label: '住宿' },
      ]}
      categoryLabels={{
        spot: '\u7968\u5238',
        free: '\u666f\u9ede',
        shop: '\u5546\u5e97',
        hotel: '\u4f4f\u5bbf',
      }}
      topActions={[
        {
          label: '票券',
          href: 'https://www.jiejourneys.com/busan/ticket',
          event: 'busanmap_top_ticket',
          platform: 'ticket',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '影片',
          href: 'https://www.jiejourneys.com/busan/video',
          event: 'busanmap_top_video',
          platform: 'video',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/busan/hotel',
          event: 'busanmap_top_hotel',
          platform: 'hotel',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/busan/transport',
          event: 'busanmap_top_transport',
          platform: 'transport',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '規劃',
          href: '/tools/planner?region=busan',
          event: 'busanmap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="釜山景點地圖攻略">
          <section className="seo-content" aria-label="釜山地圖說明">
            <h2 className="seo-h2">釜山地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張釜山景點地圖把票券景點、免費景點、商店美食和住宿放在同一張互動地圖上。第一次去釜山時，可以先打開「票券」和「景點」分類，看海雲台、南浦洞、西面、廣安里、松島、甘川文化村的位置，再決定每天住哪裡、怎麼排路線。
              </p>
              <p>
                每張卡片都會盡量附上 Google Map 或 Naver Map 導航，有些熱門景點也會放 IG、YouTube 短影音，方便你先看現場畫面再決定要不要排進行程。
              </p>
              <p>
                如果你還在比較票券、住宿或交通，可以先看
                <a href="/busan/ticket" data-event="busanmap_internal_ticket" data-section="seo_content">
                  釜山票券整理
                </a>
                、
                <a href="/busan/hotel" data-event="busanmap_internal_hotel" data-section="seo_content">
                  釜山住宿推薦
                </a>
                和
                <a href="/busan/transport" data-event="busanmap_internal_transport" data-section="seo_content">
                  釜山交通攻略
                </a>
                ；如果想少做功課、直接照順路動線走，也可以看
                <a href="/busan/journeys" data-event="busanmap_internal_journeys" data-section="seo_content">
                  釜山五日行程 PDF
                </a>
                ，再回來對照地圖會更好排。
              </p>
              <p>
                如果你還在決定每天要跑哪一側，可以先看
                <a href="/busan/busan-fast-guide?from=busan-map" data-event="busanmap_internal_fastguide" data-section="seo_content">
                  釜山最速攻略
                </a>
                ，把西面、南浦洞、海雲台、松島、廣安里和東釜山的位置關係抓起來，再回到地圖標點會更直覺。
              </p>
              <p>
                如果你主要在排海雲台和東釜山，可以接著看
                <a href="/busan/haeundae-guide?from=busan-map" data-event="busanmap_internal_haeundae" data-section="seo_content">
                  海雲台攻略
                </a>
                、
                <a href="/busan/capsule-train-guide?from=busan-map" data-event="busanmap_internal_capsule" data-section="seo_content">
                  膠囊列車攻略
                </a>
                ，或用
                <a href="/busan/visit-busan-pass-24h-route?from=busan-map" data-event="busanmap_internal_pass24" data-section="seo_content">
                  通行證 24 小時走法
                </a>
                和
                <a href="/busan/visit-busan-pass-48h-route?from=busan-map" data-event="busanmap_internal_pass48" data-section="seo_content">
                  48 小時走法
                </a>
                對照景點位置。
              </p>

              <h3 className="seo-h3">第一次去釜山先看哪些區域？</h3>
              <ul>
                <li>海雲台：適合看海、膠囊列車、X the Sky、Club D Oasis，住宿氛圍偏度假。</li>
                <li>西面：交通最方便，適合第一次自由行或想住在中間點的人。</li>
                <li>南浦洞：適合美食、逛街、札嘎其市場、釜山塔、松島纜車。</li>
                <li>廣安里：適合夜景、海景住宿、遊艇和廣安大橋周邊行程。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先開票券和景點，看主要行程集中在哪一區。</li>
                <li>再開住宿分類，確認飯店離地鐵、海邊或主要景點是否順路。</li>
                <li>想買票券時，可點卡片內的 KKDAY、KLOOK、Trip 或相關票券連結。</li>
                <li>在韓國常用 Naver Map，若卡片有 NaverMap 按鈕，建議也一起存起來。</li>
              </ul>
              <p>
                如果你主要是在看釜山通行證可用景點，可以切到
                <a href="/busan/pass-map" data-event="busanmap_internal_passmap" data-section="seo_content">
                  釜山Pass地圖
                </a>
                ；如果已經決定要買哪些門票，則可以回
                <a href="/busan/ticket" data-event="busanmap_ticket_compare" data-section="seo_content">
                  釜山票券總整理
                </a>
                比價。
                如果想要完整五天動線，也可以搭配
                <a href="/busan/journeys" data-event="busanmap_journeys_compare" data-section="seo_content">
                  釜山自由行 PDF
                </a>
                一起看。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="釜山地圖常見問題">
            <h2 className="seo-h2">釜山地圖常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>第一次去釜山住哪裡比較方便？</span>
                </h3>
                <p className="seo-faq-a">
                  如果想交通方便，西面最平均；想看海和放鬆，海雲台或廣安里更適合；想吃東西和逛街，南浦洞會比較順。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山地圖用 Google Map 還是 Naver Map？</span>
                </h3>
                <p className="seo-faq-a">
                  查中文資料和收藏景點可以先用 Google Map；實際在韓國導航時，Naver Map 通常更準。這張地圖會盡量同時整理兩種導航連結。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山景點會不會太分散？</span>
                </h3>
                <p className="seo-faq-a">
                  會。海雲台、東釜山、南浦洞、松島彼此距離不短，所以建議用地圖先看同區景點，再把同一側的景點排在同一天。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
