'use client'

import MapClient from '@/components/map/MapClient'
import { NORTH_VIETNAM_MAP_CENTER, northVietnamMapPlaces } from '@/data/northvietnam'

export default function NorthVietnamMapPage() {
  return (
    <MapClient
      places={northVietnamMapPlaces}
      mapCenter={NORTH_VIETNAM_MAP_CENTER}
      mapZoom={7}
      gtagPrefix="northvietnammap"
      title="北越景點地圖"
      backHref="/northvietnam"
      defaultCategories={{ spot: true, free: true, shop: false, hotel: true }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'shop', label: '商店' },
        { key: 'hotel', label: '住宿' },
      ]}
      topActions={[
        {
          label: '票券',
          href: 'https://www.jiejourneys.com/northvietnam/ticket',
          event: 'northvietnammap_top_ticket',
          platform: 'ticket',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/northvietnam/hotel',
          event: 'northvietnammap_top_hotel',
          platform: 'hotel',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/northvietnam/transport',
          event: 'northvietnammap_top_transport',
          platform: 'transport',
        },
        {
          label: '排序',
          href: '/northvietnam/planner',
          event: 'northvietnammap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="北越景點地圖攻略">
          <section className="seo-content" aria-label="北越地圖說明">
            <h2 className="seo-h2">北越地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張北越景點地圖把票券景點、免費景點、商店美食和住宿放在同一張互動地圖上。第一次去北越時，可以先開「票券」「景點」「住宿」，看河內、沙壩、下龍灣、陸龍灣的位置，再決定行程要怎麼串。
              </p>
              <p>
                北越和東京、大阪不太一樣，景點不是集中在同一個城市，而是分散在河內、山區、海灣和陸龍灣。地圖可以先幫你看清楚距離，再決定要自由行、包車、跟團或住在哪一區。
              </p>
              <p>
                如果你還在比較票券、住宿或交通，可以先看
                <a href="/northvietnam/ticket" data-event="northvietnammap_internal_ticket" data-section="seo_content">
                  北越票券整理
                </a>
                、
                <a href="/northvietnam/hotel" data-event="northvietnammap_internal_hotel" data-section="seo_content">
                  北越住宿推薦
                </a>
                和
                <a href="/northvietnam/transport" data-event="northvietnammap_internal_transport" data-section="seo_content">
                  北越交通攻略
                </a>
                ，再回來對照地圖會更好排。
              </p>

              <h3 className="seo-h3">第一次去北越先看哪些區域？</h3>
              <ul>
                <li>河內：北越行程基地，適合安排老城區、還劍湖、火車街、按摩和美食。</li>
                <li>下龍灣：建議看一日遊或 2 天 1 夜遊輪，想要體驗感強就選過夜遊輪。</li>
                <li>沙壩：適合番西邦峰、貓貓村、梯田和山景住宿，通常要 2 到 3 天比較順。</li>
                <li>陸龍灣：長安、舞洞、寧平一帶，適合從河內出發一日遊或住一晚慢慢玩。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先決定河內要住幾晚，北越多數交通和行程都從河內出發。</li>
                <li>下龍灣如果選過夜遊輪，住宿和交通通常會一起包含，不一定要另外訂飯店。</li>
                <li>沙壩距離河內較遠，不建議硬塞成當日往返，至少留 2 天以上比較舒服。</li>
                <li>陸龍灣和下龍灣方向不同，不要只看名字都有「龍灣」就排在同一天。</li>
              </ul>
              <p>
                如果你想少做功課、直接照順序走，也可以看
                <a href="/northvietnam/journeys" data-event="northvietnammap_internal_journeys" data-section="seo_content">
                  北越 8 日行程 PDF
                </a>
                ；如果已經大概知道想去哪些景點，可以回
                <a href="/northvietnam/ticket" data-event="northvietnammap_ticket_compare" data-section="seo_content">
                  北越票券總整理
                </a>
                比較河內、沙壩、下龍灣和陸龍灣行程。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="北越地圖常見問題">
            <h2 className="seo-h2">北越地圖常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>第一次去北越住哪裡比較方便？</span>
                </h3>
                <p className="seo-faq-a">
                  建議以河內為基地，首尾各住一晚。下龍灣若選過夜遊輪就直接住船上；沙壩建議住市區或山景飯店；陸龍灣可住寧平或長安附近。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>北越景點會不會很分散？</span>
                </h3>
                <p className="seo-faq-a">
                  會。河內、沙壩、下龍灣、陸龍灣是不同方向，移動時間差很多。建議先用地圖看位置，再決定要包車、接駁、跟團或分幾天住。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>下龍灣要一日遊還是過夜遊輪？</span>
                </h3>
                <p className="seo-faq-a">
                  時間夠的話比較推薦 2 天 1 夜遊輪，體驗會比一日遊完整很多。一日遊適合時間有限、只想看精華海灣的人。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
