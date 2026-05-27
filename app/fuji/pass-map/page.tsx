'use client'

import MapClient from '@/components/map/MapClient'
import { FUJI_PASS_MAP_CENTER, fujiPassMapPlaces } from '@/data/fuji/pass-map/places'
import { fujiPassMapRoutes } from '@/data/fuji/pass-map/routes'

const categoryLabels = {
  spot: '觀光/遊覽船',
  free: '溫泉優惠',
  food: '飲食購物',
  hotel: '住宿',
}

export default function FujiPassMapPage() {
  return (
    <MapClient
      places={fujiPassMapPlaces}
      mapCenter={FUJI_PASS_MAP_CENTER}
      mapZoom={9}
      initialFitToPlaces
      gtagPrefix="fujipassmap"
      title="富士山周遊券地圖"
      backHref="/fuji"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryLabels={categoryLabels}
      categoryItems={[
        { key: 'spot', label: '觀光/遊覽船' },
        { key: 'free', label: '溫泉優惠' },
        { key: 'food', label: '飲食購物' },
      ]}
      routeLayers={fujiPassMapRoutes}
      topActions={[
        {
          label: 'KKDAY',
          href: 'https://www.kkday.com/zh-tw/product/20106-mt-fuji-pass-lake-kawaguchi-attraction-ticket-japan?cid=22312',
          event: 'fujipassmap_top_buy_kkday',
          platform: 'KKDAY',
          primary: true,
          external: true,
        },
        {
          label: 'KLOOK',
          href: 'https://www.klook.com/zh-TW/activity/132532-mt-fuji-pass/?aid=93798',
          event: 'fujipassmap_top_buy_klook',
          platform: 'KLOOK',
          external: true,
        },
        {
          label: '排序',
          href: '/fuji/pass-planner',
          event: 'fujipassmap_top_planner',
          platform: 'planner',
        },
        {
          label: '整理',
          href: '#fuji-pass-map-guide',
          event: 'fujipassmap_top_guide',
          platform: 'internal',
        },
      ]}
      belowContent={
        <article id="fuji-pass-map-guide" className="seo-page" aria-label="富士山周遊券地圖攻略">
          <section className="seo-content" aria-label="富士山周遊券地圖說明">
            <h2 className="seo-h2">富士山周遊券地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張富士山周遊券地圖整理了持 Mt. Fuji Pass 可以使用或享優惠的景點，包含河口湖纜車、河口湖遊覽船、山中湖遊覽船、富士急樂園、富士山溫泉，以及幾個飲食購物優惠點。因為範圍橫跨河口湖、富士吉田、山中湖，建議先用地圖看位置，再決定哪些優惠真的順路。
              </p>
              <p>
                上方可以切換「觀光/遊覽船」「溫泉優惠」「飲食購物」，也可以打開紅線、綠線、藍線與富士急行線，確認景點和車站、巴士站的相對位置。卡片裡如果有「含此景點的一日遊」，點進去會直接到富士票券頁，用該景點篩選相關行程。
              </p>
              <div className="seo-buy-links" aria-label="查看富士山周遊券">
                <a
                  className="seo-buy-link primary"
                  href="https://www.kkday.com/zh-tw/product/20106-mt-fuji-pass-lake-kawaguchi-attraction-ticket-japan?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="fujipassmap_buy_kkday"
                  data-platform="KKDAY"
                  data-section="seo_content"
                >
                  KKDAY 購買
                </a>
                <a
                  className="seo-buy-link"
                  href="https://www.klook.com/zh-TW/activity/132532-mt-fuji-pass/?aid=93798"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="fujipassmap_buy_klook"
                  data-platform="KLOOK"
                  data-section="seo_content"
                >
                  KLOOK 比價
                </a>
              </div>
              <p>
                如果你還在排富士山自由行，可以搭配
                <a href="/fuji/map" data-event="fujipassmap_internal_map" data-section="seo_content">
                  富士河口湖總地圖
                </a>
                、
                <a href="/fuji/ticket" data-event="fujipassmap_internal_ticket" data-section="seo_content">
                  富士河口湖票券整理
                </a>
                、
                <a href="/fuji/transport" data-event="fujipassmap_internal_transport" data-section="seo_content">
                  富士河口湖交通攻略
                </a>
                和
                <a href="/fuji/hotel" data-event="fujipassmap_internal_hotel" data-section="seo_content">
                  富士河口湖住宿推薦
                </a>
                一起看。先確認你住哪裡、搭什麼交通，再決定周遊券和單買票券哪個更適合。
              </p>

              <h3 className="seo-h3">先看最容易用到的觀光點</h3>
              <p>
                河口湖纜車和河口湖遊覽船最適合排在同一天，兩者都靠近河口湖站與紅線巴士範圍，天氣好時可以從不同角度看富士山。富士急樂園和富士山溫泉則更靠近富士急行線，適合把遊樂園、溫泉或富士山站附近行程放在同一天。
              </p>
              <p>
                山中湖遊覽船的位置和河口湖不同區，雖然也是周遊券可用的項目，但比較適合另外安排山中湖、忍野八海或富士山站方向。若你只是河口湖市區半日遊，特地繞去山中湖通常不太划算。
              </p>

              <h3 className="seo-h3">周遊券和一日遊怎麼選？</h3>
              <p>
                如果你會住在河口湖或富士吉田，想慢慢搭巴士、纜車、遊覽船和泡溫泉，周遊券比較有彈性。如果你是從東京當天來回，想把大石公園、忍野八海、Lawson、河口湖纜車或遊覽船一次排完，一日遊通常會更省心。
              </p>
              <ul>
                <li>自由行使用周遊券：適合住一晚以上、想自行調整景點順序的人。</li>
                <li>東京出發一日遊：適合只有一天、想少研究轉車和巴士班次的人。</li>
                <li>飲食購物優惠：多半適合順路使用，不建議為了小折扣特別繞路。</li>
                <li>出發前仍建議確認官方優惠內容與營業狀態，纜車、遊覽船遇到天候可能調整。</li>
              </ul>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="富士山周遊券常見問題">
            <h2 className="seo-h2">富士山周遊券常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>富士山周遊券地圖上的點都是官方優惠嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  這張 pass-map 主要依照富士急官方優惠頁整理，並保留比較適合自由行使用的觀光設施、遊覽船、溫泉與飲食購物優惠。一般拍照景點和住宿請看富士河口湖總地圖。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>只玩河口湖一天需要買富士山周遊券嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  不一定。若你會搭河口湖纜車、河口湖遊覽船，又會用到巴士或其他優惠，可以比較周遊券。若只是拍照、逛大石公園和河口湖站周邊，單買交通或門票可能更單純。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>山中湖遊覽船適合和河口湖排同一天嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  可以，但要看交通時間。山中湖和河口湖不是同一個小範圍，如果同一天還要去忍野八海、富士急樂園或大石公園，建議先用地圖確認移動距離，避免行程太趕。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
