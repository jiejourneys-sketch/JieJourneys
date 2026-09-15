'use client'

import MapClient from '@/components/map/MapClient'
import { osakaMapPlaces } from '@/data/osaka/map/places'

export default function OsakaMapPage() {
  return (
    <MapClient
      places={osakaMapPlaces}
      mapCenter={{ lat: 35.05, lng: 135.58 }}
      mapZoom={7}
      gtagPrefix="osakamap"
      title="大阪・京都・奈良旅杰地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, shop: true, food: false, hotel: true }}
      categoryItems={[
        { key: 'spot', label: '票券' },
        { key: 'free', label: '景點' },
        { key: 'shop', label: '商店' },
        { key: 'hotel', label: '住宿' },
      ]}
      categoryLabels={{
        spot: '票券',
        free: '景點',
        shop: '商店',
        hotel: '住宿',
      }}
      topActions={[
        {
          label: '票券',
          href: 'https://www.jiejourneys.com/osaka/ticket',
          event: 'osakamap_top_ticket',
          platform: 'ticket',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '影片',
          href: 'https://www.jiejourneys.com/osaka/video',
          event: 'osakamap_top_video',
          platform: 'video',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '住宿',
          href: 'https://www.jiejourneys.com/osaka/hotel',
          event: 'osakamap_top_hotel',
          platform: 'hotel',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '交通',
          href: 'https://www.jiejourneys.com/osaka/transport',
          event: 'osakamap_top_transport',
          platform: 'transport',
          group: 'guide',
          groupLabel: '攻略',
        },
        {
          label: '規劃',
          href: '/tools/planner?region=osaka',
          event: 'osakamap_top_planner',
          platform: 'planner',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="大阪京都奈良旅杰地圖攻略">
          <section className="seo-content" aria-label="大阪京都奈良地圖說明">
            <h2 className="seo-h2">大阪・京都・奈良地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這張大阪・京都・奈良旅杰地圖，把大阪市區、京都、奈良與京都近郊的一日遊景點放在同一張互動地圖上。先開「票券」「景點」「住宿」，確認每天是在大阪市區、京都、奈良還是近郊移動，再決定住宿與路線。
              </p>
              <p>
                每張卡片會盡量附上購票連結與 Google Map 導航。京都・奈良清單中原本未收錄在大阪地圖的景點也已加入；既有的一日遊景點則保留原本的票券連結，不會重複顯示。
              </p>
              <p>
                京都的單點熱門票券也已依照大阪票券圖釘的方式放在「票券」分類：teamLab Biovortex、京都鐵道博物館、京都水族館、Nidec 京都塔、清水寺周邊的 Ookini／Okimono屋／MOCOMOCO 和服租借、太秦映畫村與 GEAR 無語言劇場。每個圖釘都附上對應的 KKDAY／KLOOK 購買按鈕與導航；鐵道博物館、太秦映畫村不再同時以一般景點重複顯示。
              </p>

              <h3 className="seo-h3">京都住宿圖釘｜與京都住宿頁同步</h3>
              <p>
                開啟「住宿」即可看到與
                <a href="/kyoto-nara/hotel" data-event="osakamap_internal_kyoto_hotel" data-section="seo_content">
                  京都住宿推薦
                </a>
                相同的 13 間飯店：京都車站 6 間、河原町・祇園 3 間、烏丸・市中心 4 間。圖釘名稱、區域描述、Trip、Agoda 與 Google 地圖連結皆與住宿頁同步；若地圖範圍停在大阪，請縮放或拖到京都後查看。
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

              <h3 className="seo-h3">先依城市與區域安排</h3>
              <ul>
                <li>難波 / 心齋橋：逛街、美食、道頓堀最方便，適合第一次自由行。</li>
                <li>梅田 / 大阪站：交通線多，適合安排京都、神戶、奈良一日遊。</li>
                <li>天王寺 / 新世界：適合通天閣、阿倍野展望台、動物園前一帶。</li>
                <li>環球影城 / 海遊館：適合親子、主題樂園和大阪港路線。</li>
                <li>京都 / 奈良：清水寺、嵐山、伏見稻荷、宇治與奈良公園等景點，適合獨立排一整天。</li>
                <li>天橋立 / 伊根 / 美山：距離更遠，建議直接安排一日遊或自駕／包車行程。</li>
              </ul>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先開票券和景點，看主要行程集中在大阪市區還是關西一日遊。</li>
                <li>再開住宿分類，確認飯店離難波、心齋橋、梅田或地鐵站是否順路。</li>
                <li>環球影城、展望台、遊船、京都奈良一日遊這類票券，旺季建議先線上預訂。</li>
                <li>如果每天都要跨城市移動，住宿選梅田會比難波更適合；如果主打逛街美食，難波和心齋橋會更直覺。</li>
              </ul>

              <h3 className="seo-h3">大阪購物中心怎麼排？</h3>
              <p>
                大阪購物不只是一條心齋橋商店街，實際排路線時更建議看商場群。梅田可以把 GRAND FRONT 大阪、LUCUA、阪急百貨、HEP FIVE、LINKS UMEDA 和地下街排成一個下午到晚上；心齋橋則適合把 PARCO、大丸心齋橋、BIGSTEP、Crysta 長堀和道頓堀串在一起；難波可以看大阪高島屋、難波 CITY、難波 Parks 和 Namba Walk。用地圖開啟「商店」分類，就能避開跨區來回跑。
              </p>

              <h3 className="seo-h3">住宿和購物動線一起看</h3>
              <p>
                如果你晚上想逛到很晚，住宿靠近難波、心齋橋會最省腳力；如果行程包含京都、神戶、奈良，梅田/大阪站周邊會比較像關西交通基地；天王寺則適合想兼顧房價、機場交通和阿倍野商圈的人。地圖上同時打開「住宿」和「商店」，可以快速判斷飯店附近是不是有百貨、地下街或大型商場，不只看離車站近不近。
              </p>
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
                  想逛街和吃美食選難波、心齋橋；想跑京都、奈良一日遊選梅田、大阪站；想去環球影城可以住大阪市區再搭電車前往。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪、京都、奈良景點會不會很分散？</span>
                </h3>
                <p className="seo-faq-a">
                  大阪市區景點相對集中，但京都、奈良與天橋立等一日遊距離較遠，建議用地圖先看方向，把同一區或同一條交通線排在同一天。
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
