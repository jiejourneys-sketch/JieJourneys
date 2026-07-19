'use client'

import MapClient from '@/components/map/MapClient'
import { tokyoMapPlaces, TOKYO_MAP_CENTER } from '@/data/tokyo'

export default function TokyoMapPage() {
  return (
    <MapClient
      places={tokyoMapPlaces}
      mapCenter={TOKYO_MAP_CENTER}
      gtagPrefix="tokyomap"
      title="東京景點地圖"
      backHref="/tokyo"
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
          href: 'https://www.jiejourneys.com/tokyo/ticket',
          event: 'tokyomap_top_ticket',
          platform: 'ticket',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/tokyo/hotel',
          event: 'tokyomap_top_hotel',
          platform: 'hotel',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/tokyo/transport',
          event: 'tokyomap_top_transport',
          platform: 'transport',
        },
        {
          label: '影片',
          href: 'https://www.jiejourneys.com/tokyo/video',
          event: 'tokyomap_top_video',
          platform: 'video',
        },
        {
          label: '排序',
          href: '/tools/planner?region=tokyo',
          event: 'tokyomap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="東京景點地圖攻略">
          <section className="seo-content" aria-label="東京地圖說明">
            <h2 className="seo-h2">東京地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張東京景點地圖把票券景點、免費景點、商店美食和住宿放在同一張互動地圖上。第一次去東京時，可以先開「票券」「景點」「住宿」分類，看新宿、澀谷、淺草、上野、東京車站、銀座、台場的位置，再決定每天住哪裡、怎麼排路線。
              </p>
              <p>
                每張卡片會盡量附上購票連結與 Google Map 導航，有些熱門景點也會放 IG、YouTube 短影音，方便你先看現場畫面再決定要不要排進行程。
              </p>
              <p>
                如果你還在比較票券、住宿或交通，可以先看
                <a href="/tokyo/ticket" data-event="tokyomap_internal_ticket" data-section="seo_content">
                  東京票券整理
                </a>
                、
                <a href="/tokyo/hotel" data-event="tokyomap_internal_hotel" data-section="seo_content">
                  東京住宿推薦
                </a>
                和
                <a href="/tokyo/transport" data-event="tokyomap_internal_transport" data-section="seo_content">
                  東京交通攻略
                </a>
                ；如果想先把東京市區分成東側、市中心、西側三條動線，可以看
                <a href="/tokyo/tokyo-9-areas-guide?from=tokyo-map" data-event="tokyomap_internal_9areas" data-section="seo_content">
                  東京 9 大區域景點攻略
                </a>
                ；如果想細排雷門、仲見世通、寶藏門到正殿的順序，可以看
                <a href="/tokyo/sensoji-guide?from=tokyo-map" data-event="tokyomap_internal_sensoji" data-section="seo_content">
                  淺草寺攻略
                </a>
                ；如果要從押上站 B3 出口進入、安排天望甲板與天望回廊，可以看
                <a href="/tokyo/skytree-guide?from=tokyo-map" data-event="tokyomap_internal_skytree" data-section="seo_content">
                  晴空塔攻略
                </a>
                ；如果要從原宿走南參道到本殿，可以看
                <a href="/tokyo/meiji-jingu-guide?from=tokyo-map" data-event="tokyomap_internal_meiji" data-section="seo_content">
                  明治神宮攻略
                </a>
                ；如果要卡澀谷日落夜景，可以看
                <a href="/tokyo/shibuya-sky-guide?from=tokyo-map" data-event="tokyomap_internal_shibuya_sky" data-section="seo_content">
                  SHIBUYA SKY 攻略
                </a>
                ；如果想少做功課、直接照順路動線走，也可以看
                <a href="/tokyo/journeys" data-event="tokyomap_internal_journeys" data-section="seo_content">
                  東京五日行程 PDF
                </a>
                ，再回來對照地圖會更好排。
              </p>

              <h3 className="seo-h3">第一次去東京先看哪些區域？</h3>
              <ul>
                <li>新宿：交通線最多，適合第一次自由行、行程分散的人。</li>
                <li>
                  上野 / 淺草：成田機場進出方便，適合淺草、
                  <a href="/tokyo/skytree-guide?from=tokyo-map" data-event="tokyomap_internal_skytree_list" data-section="seo_content">
                    晴空塔
                  </a>
                  、上野公園路線。
                </li>
                <li>
                  澀谷 / 原宿：適合逛街、拍照、
                  <a href="/tokyo/meiji-jingu-guide?from=tokyo-map" data-event="tokyomap_internal_meiji_list" data-section="seo_content">
                    明治神宮
                  </a>
                  、
                  <a href="/tokyo/shibuya-sky-guide?from=tokyo-map" data-event="tokyomap_internal_shibuya_sky_list" data-section="seo_content">
                    SHIBUYA SKY
                  </a>
                  。
                </li>
                <li>東京車站 / 銀座：適合新幹線、皇居、銀座購物和高級飯店。</li>
                <li>台場 / 豐洲：適合 teamLab、親子景點、室內備案和海景行程。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先開票券和景點，看主要行程集中在哪幾區。</li>
                <li>再開住宿分類，確認飯店離山手線、地鐵站或主要景點是否順路。</li>
                <li>展望台、teamLab、迪士尼、哈利波特影城這類熱門票券，建議先線上訂票。</li>
                <li>東京景點很分散，盡量把同一側的景點排在同一天，少跨區來回移動。</li>
              </ul>
              <p>
                如果你已經大概知道想去哪些景點，可以回
                <a href="/tokyo/ticket" data-event="tokyomap_ticket_compare" data-section="seo_content">
                  東京票券總整理
                </a>
                比較 KKDAY、KLOOK、Trip；如果還在決定住新宿、上野、淺草或銀座，則可以搭配
                <a href="/tokyo/hotel" data-event="tokyomap_hotel_compare" data-section="seo_content">
                  東京住宿區域整理
                </a>
                一起看。
                如果想要完整五天動線，也可以搭配
                <a href="/tokyo/journeys" data-event="tokyomap_journeys_compare" data-section="seo_content">
                  東京自由行 PDF
                </a>
                一起看。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="東京地圖常見問題">
            <h2 className="seo-h2">東京地圖常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>第一次去東京住哪裡比較方便？</span>
                </h3>
                <p className="seo-faq-a">
                  想交通方便選新宿；想機場進出省事選上野；喜歡老東京和淺草寺選淺草；想逛街和夜生活選澀谷；常搭新幹線或想住高級飯店可選東京車站、銀座。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>東京景點會不會太分散？</span>
                </h3>
                <p className="seo-faq-a">
                  會。東京景點常分散在新宿、澀谷、淺草、台場、池袋、舞濱等不同方向，建議用地圖先看位置，把同區或同線路景點排在同一天。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>東京熱門票券要先買嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  建議先買。SHIBUYA SKY、teamLab、東京迪士尼、哈利波特影城、晴空塔等熱門景點，旺季或熱門時段臨時買可能沒票或要排很久。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
