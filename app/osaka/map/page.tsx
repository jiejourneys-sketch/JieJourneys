'use client'

import MapClient from '@/components/map/MapClient'
import { OSAKA_MAP_CENTER, osakaMapPlaces } from '@/data/osaka/map/places'

export default function OsakaMapPage() {
  return (
    <MapClient
      places={osakaMapPlaces}
      mapCenter={OSAKA_MAP_CENTER}
      mapZoom={10}
      gtagPrefix="osakamap"
      title="大阪景點地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: false, hotel: true }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'hotel', label: '住宿' },
      ]}
      categoryLabels={{
        spot: '票券',
        free: '景點',
        hotel: '住宿',
      }}
      topActions={[
        {
          label: '票券',
          href: 'https://www.jiejourneys.com/osaka/ticket',
          event: 'osakamap_top_ticket',
          platform: 'ticket',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/osaka/hotel',
          event: 'osakamap_top_hotel',
          platform: 'hotel',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/osaka/transport',
          event: 'osakamap_top_transport',
          platform: 'transport',
        },
        {
          label: '排序',
          href: '/osaka/planner',
          event: 'osakamap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="大阪景點地圖攻略">
          <section className="seo-content" aria-label="大阪地圖說明">
            <h2 className="seo-h2">大阪地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張大阪景點地圖把票券景點、免費景點和住宿放在同一張互動地圖上。第一次去大阪時，可以先開「票券」「景點」「住宿」，看難波、心齋橋、梅田、天王寺、環球影城和大阪城的位置，再決定每天住哪裡、怎麼排路線。
              </p>
              <p>
                每張卡片會盡量附上購票連結與 Google Map 導航。大阪很多人會搭配京都、奈良、神戶或和歌山一日遊，建議先用地圖確認距離，避免同一天排太多跨區景點。
              </p>
              <p>
                如果你還在比較票券、住宿或交通，可以先看
                <a href="/osaka/ticket" data-event="osakamap_internal_ticket" data-section="seo_content">
                  大阪票券整理
                </a>
                、
                <a href="/osaka/hotel" data-event="osakamap_internal_hotel" data-section="seo_content">
                  大阪住宿推薦
                </a>
                和
                <a href="/osaka/transport" data-event="osakamap_internal_transport" data-section="seo_content">
                  大阪交通攻略
                </a>
                ，再回來對照地圖會更好排。
              </p>

              <h3 className="seo-h3">第一次去大阪先看哪些區域？</h3>
              <ul>
                <li>難波 / 心齋橋：逛街、美食、道頓堀最方便，適合第一次自由行。</li>
                <li>梅田 / 大阪站：交通線多，適合安排京都、神戶、奈良一日遊。</li>
                <li>天王寺 / 新世界：適合通天閣、阿倍野展望台、動物園前一帶。</li>
                <li>環球影城 / 海遊館：適合親子、主題樂園和大阪港路線。</li>
                <li>京都 / 奈良 / 神戶：可從大阪出發一日遊，但不要和市區景點塞同一天太滿。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先開票券和景點，看主要行程集中在大阪市區還是關西一日遊。</li>
                <li>再開住宿分類，確認飯店離難波、心齋橋、梅田或地鐵站是否順路。</li>
                <li>環球影城、展望台、遊船、京都奈良一日遊這類票券，旺季建議先線上預訂。</li>
                <li>如果每天都要跨城市移動，住宿選梅田會比難波更適合；如果主打逛街美食，難波和心齋橋會更直覺。</li>
              </ul>
              <p>
                如果你主要是在算大阪周遊券划不划算，可以切到
                <a href="/osaka/pass-map" data-event="osakamap_internal_passmap" data-section="seo_content">
                  大阪周遊券地圖
                </a>
                看免費設施、優惠設施和高低價值標記；如果已經決定要買哪些門票，則可以回
                <a href="/osaka/ticket" data-event="osakamap_ticket_compare" data-section="seo_content">
                  大阪票券總整理
                </a>
                比價。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="大阪地圖常見問題">
            <h2 className="seo-h2">大阪地圖常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>第一次去大阪住哪裡比較方便？</span>
                </h3>
                <p className="seo-faq-a">
                  想逛街和吃美食選難波、心齋橋；想跑京都、神戶、奈良一日遊選梅田、大阪站；想去環球影城可以住大阪市區再搭電車前往。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪景點會不會很分散？</span>
                </h3>
                <p className="seo-faq-a">
                  大阪市區景點相對集中，但京都、奈良、神戶、和歌山、天橋立等一日遊距離較遠，建議用地圖先看方向，把同一區或同一條交通線排在同一天。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪熱門票券要先買嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  建議先買。日本環球影城、阿倍野展望台、樂高樂園探索中心、關西一日遊等熱門票券，旺季或假日臨時買可能價格較高或沒有理想時段。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
