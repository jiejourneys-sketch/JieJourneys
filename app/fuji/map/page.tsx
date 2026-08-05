'use client'

import MapClient from '@/components/map/MapClient'
import { FUJI_MAP_CENTER, fujiMapPlaces } from '@/data/fuji'

export default function FujiMapPage() {
  return (
    <MapClient
      places={fujiMapPlaces}
      mapCenter={FUJI_MAP_CENTER}
      mapZoom={9}
      gtagPrefix="fujimap"
      title="富士河口湖地圖"
      backHref="/fuji"
      defaultCategories={{ spot: true, free: true, food: false, hotel: true }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'hotel', label: '住宿' },
      ]}
      categoryLabels={{
        spot: '\u7968\u5238',
        free: '\u666f\u9ede',
        hotel: '\u4f4f\u5bbf',
      }}
      topActions={[
        {
          label: '票券',
          href: 'https://www.jiejourneys.com/fuji/ticket',
          event: 'fujimap_top_ticket',
          platform: 'ticket',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '影片',
          href: 'https://www.jiejourneys.com/fuji/video',
          event: 'fujimap_top_video',
          platform: 'video',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/fuji/hotel',
          event: 'fujimap_top_hotel',
          platform: 'hotel',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/fuji/transport',
          event: 'fujimap_top_transport',
          platform: 'transport',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '規劃',
          href: '/tools/planner?region=fuji',
          event: 'fujimap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="富士河口湖地圖攻略">
          <section className="seo-content" aria-label="富士河口湖地圖說明">
            <h2 className="seo-h2">富士河口湖地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張富士河口湖地圖把票券景點、免費景點和住宿放在同一張互動地圖上。第一次去富士山周邊時，可以先開「票券」「景點」「住宿」，看河口湖站、大石公園、忍野八海、淺間公園、富士急樂園、五合目、御殿場 Outlet 和箱根的位置，再決定要自由行還是一日遊。
              </p>
              <p>
                每張卡片會盡量附上購票連結與 Google Map 導航。富士河口湖景點看起來距離不遠，但巴士班次和轉乘會影響很多，建議先用地圖確認方向，再決定住宿和交通。
              </p>
              <p>
                如果你還在比較票券、住宿或交通，可以先看
                <a href="/fuji/ticket" data-event="fujimap_internal_ticket" data-section="seo_content">
                  富士河口湖票券整理
                </a>
                、
                <a href="/fuji/hotel" data-event="fujimap_internal_hotel" data-section="seo_content">
                  富士河口湖住宿推薦
                </a>
                和
                <a href="/fuji/transport" data-event="fujimap_internal_transport" data-section="seo_content">
                  富士河口湖交通攻略
                </a>
                ，再回來對照地圖會更好排。
              </p>

              <h3 className="seo-h3">第一次去富士河口湖先看哪些區域？</h3>
              <ul>
                <li>河口湖站周邊：交通最方便，適合搭巴士、拖行李和第一次自由行。</li>
                <li>河口湖北岸：大石公園、音樂森林一帶，適合看富士山景和湖景住宿。</li>
                <li>富士吉田：淺間公園、日川時計、富士急樂園，適合拍經典富士山畫面。</li>
                <li>忍野八海 / 山中湖：適合一日遊或自駕，和河口湖市區有一段距離。</li>
                <li>箱根 / 御殿場：適合二日遊或包車路線，不建議硬塞進河口湖短時間行程。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先看住宿位置，河口湖站附近移動最方便，湖畔住宿則更適合慢慢玩。</li>
                <li>河口湖纜車、遊覽船、富士急樂園這類票券，可以先線上比價。</li>
                <li>如果只從東京當天來回，建議用一日遊或包車，少花時間研究轉乘。</li>
                <li>如果要自由行兩天以上，再研究高速巴士、富士回遊和周遊巴士比較划算。</li>
              </ul>
              <p>
                如果你已經大概知道想去哪些景點，可以回
                <a href="/fuji/ticket" data-event="fujimap_ticket_compare" data-section="seo_content">
                  富士河口湖票券總整理
                </a>
                比較一日遊、二日遊、富士急和河口湖景點門票；如果還在決定住河口湖站、湖景溫泉或富士山景飯店，則可以搭配
                <a href="/fuji/hotel" data-event="fujimap_hotel_compare" data-section="seo_content">
                  富士河口湖住宿區域整理
                </a>
                一起看。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="富士河口湖地圖常見問題">
            <h2 className="seo-h2">富士河口湖地圖常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>第一次去富士河口湖住哪裡比較方便？</span>
                </h3>
                <p className="seo-faq-a">
                  想交通方便選河口湖站附近；想看富士山和湖景選河口湖北岸或湖景溫泉旅館；想省預算和移動方便可選富士山站、富士急樂園站周邊。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>富士河口湖自由行還是一日遊比較好？</span>
                </h3>
                <p className="seo-faq-a">
                  如果只有一天、從東京來回，一日遊最省事；如果想等富士山天氣、住湖景溫泉或慢慢拍照，建議安排兩天以上自由行。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>富士河口湖景點會不會很分散？</span>
                </h3>
                <p className="seo-faq-a">
                  會。河口湖、大石公園、忍野八海、山中湖、五合目、箱根和御殿場方向都不同，建議先用地圖看位置，再決定要搭巴士、自駕、包車或參加一日遊。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
