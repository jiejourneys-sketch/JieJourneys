'use client'

import MapClient from '@/components/map/MapClient'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { BUSAN_PASS_MAP_CENTER, busanPassMapPlaces } from '@/data/busan/pass-map/places'

const categoryLabels = {
  spot: '\u50f9\u683c\u9ad8',
  free: '\u50f9\u683c\u4e2d',
  food: '\u50f9\u683c\u4f4e',
  hotel: '\u4f4f\u5bbf',
}

const passVideoLinks = {
  overview: [
    { label: 'IG｜通行證重點', href: 'https://www.instagram.com/reel/DUDiZzQkdUe/', event: 'busanpassmap_video_overview_ig', platform: 'IG' },
    { label: 'YouTube｜通行證重點', href: 'https://www.youtube.com/shorts/ppTGbWXDM0k', event: 'busanpassmap_video_overview_yt', platform: 'YouTube' },
  ],
  route24h: [
    { label: 'IG｜24小時走法', href: 'https://www.instagram.com/reel/DOJBfeBEdwN/', event: 'busanpassmap_video_24h_ig', platform: 'IG' },
    { label: 'YouTube｜24小時走法', href: 'https://www.youtube.com/shorts/e2aeNYmKc38', event: 'busanpassmap_video_24h_yt', platform: 'YouTube' },
  ],
  route48h: [
    { label: 'IG｜48小時走法', href: 'https://www.instagram.com/reel/DO0y_wnEUa9/', event: 'busanpassmap_video_48h_ig', platform: 'IG' },
    { label: 'YouTube｜48小時走法', href: 'https://www.youtube.com/shorts/kuU-6nMmR4Y', event: 'busanpassmap_video_48h_yt', platform: 'YouTube' },
  ],
}

export default function BusanPassMapPage() {
  return (
    <MapClient
      places={busanPassMapPlaces}
      mapCenter={BUSAN_PASS_MAP_CENTER}
      gtagPrefix="busanpassmap"
      collapseLocationLinks
      title="釜山通行證地圖"
      backHref="/busan"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryLabels={categoryLabels}
      categoryItems={[
        { key: 'spot', label: '\u50f9\u683c\u9ad8' },
        { key: 'free', label: '\u50f9\u683c\u4e2d' },
        { key: 'food', label: '\u50f9\u683c\u4f4e' },
      ]}
      officialPassTierItems={[
        { key: 'purple', label: '紫色/A區景點' },
        { key: 'blue', label: '藍色/B區景點' },
      ]}
      topActions={[
        {
          label: 'KKDAY',
          href: 'https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312',
          event: 'busanpassmap_top_buy_kkday',
          platform: 'KKDAY',
          external: true,
          group: 'commerce',
          groupLabel: '購票',
        },
        {
          label: 'KLOOK',
          href: 'https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798',
          event: 'busanpassmap_top_buy_klook',
          platform: 'KLOOK',
          external: true,
          group: 'commerce',
          groupLabel: '購票',
        },
        {
          label: 'Trip',
          href: 'https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051',
          event: 'busanpassmap_top_buy_trip',
          platform: 'Trip',
          external: true,
          group: 'commerce',
          groupLabel: '購票',
        },
        {
          label: 'IG',
          href: 'https://www.instagram.com/reel/DUDiZzQkdUe/',
          event: 'busanpassmap_top_video_ig',
          platform: 'Instagram',
          external: true,
          group: 'video',
          groupLabel: '影片',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/shorts/ppTGbWXDM0k',
          event: 'busanpassmap_top_video_yt',
          platform: 'YouTube',
          external: true,
          group: 'video',
          groupLabel: '影片',
        },
        {
          label: '攻略',
          href: '/busan/visit-busan-pass?from=pass-map',
          event: 'busanpassmap_top_article',
          platform: 'internal',
        },
        {
          label: '規劃',
          href: '/tools/planner?region=busan&source=pass',
          event: 'busanpassmap_top_planner',
          platform: 'internal',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="釜山通行證地圖攻略">
          <section className="seo-content" aria-label="釜山Pass地圖說明">
            <h2 className="seo-h2">釜山Pass是什麼？先搞懂票種再看地圖</h2>
            <div className="seo-prose">
              <p>
                先看我的釜山通行證重點整理，下面再用文字版快速補充票種、Big3/Big5規則，以及怎麼搭配上方地圖規劃路線。
              </p>
              <SeoVideoLinkMenu label="通行證重點" links={passVideoLinks.overview} />
              <div className="seo-buy-links seo-action-links" aria-label="購買釜山通行證">
                <a
                  className="seo-buy-link primary"
                  href="https://www.kkday.com/zh-tw/product/138477-visit-busan-pass-discount-free-attractions?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanpassmap_buy_kkday"
                  data-platform="KKDAY"
                  data-section="seo_content"
                >
                  KKDAY 購買
                </a>
                <a
                  className="seo-buy-link"
                  href="https://www.klook.com/zh-TW/activity/81576-visit-busan-pass/?aid=93798"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanpassmap_buy_klook"
                  data-platform="KLOOK"
                  data-section="seo_content"
                >
                  KLOOK 比價
                </a>
                <a
                  className="seo-buy-link"
                  href="https://tw.trip.com/things-to-do/detail/50618334?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5754051"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="busanpassmap_buy_trip"
                  data-platform="Trip"
                  data-section="seo_content"
                >
                  Trip 查看
                </a>
              </div>
              <p>
                還在比較要不要買，可以先看
                <a href="/busan/ticket" data-event="busanpassmap_internal_ticket" data-section="seo_content">
                  釜山票券整理
                </a>
                、
                <a href="/busan/hotel" data-event="busanpassmap_internal_hotel" data-section="seo_content">
                  釜山住宿推薦
                </a>
                和
                <a href="/busan/transport" data-event="busanpassmap_internal_transport" data-section="seo_content">
                  釜山交通攻略
                </a>
                ；如果想把一般景點、美食、住宿和非 Pass 票券一起看，可以直接開
                <a href="/busan/map" data-event="busanpassmap_internal_map" data-section="seo_content">
                  釜山景點地圖
                </a>
                ；如果想直接照順路動線走，也可以看
                <a href="/busan/journeys" data-event="busanpassmap_internal_journeys" data-section="seo_content">
                  釜山五日行程 PDF
                </a>
                。
              </p>
              <p>
                Visit Busan Pass（釜山通行證、釜山Pass）是釜山景點通行證，可用在指定景點、體驗、展望台、汗蒸幕、遊艇、纜車與部分商店優惠。
                規劃時最重要的是三件事：你買哪種票、想去的景點有沒有包含、這些景點在地圖上順不順路。
              </p>

              <h3 className="seo-h3">釜山Pass票種：先記24/48小時=24/48小時玩所有景點；再記 Big3 = 1+2，Big5 = 2+3</h3>
              <table>
                <thead>
                  <tr>
                    <th>票種</th>
                    <th>重點規則</th>
                    <th>適合誰</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24小時</td>
                    <td>啟用後 24 小時內使用所有指定景點</td>
                    <td>想把景點集中在同一天玩的人</td>
                  </tr>
                  <tr>
                    <td>48小時</td>
                    <td>啟用後 48 小時內使用所有指定景點</td>
                    <td>基本上大家都買這個，兩天可玩最多景點</td>
                  </tr>
                  <tr>
                    <td>Big3</td>
                    <td>
                      <strong>1 個紫色/A區景點 + 2 個藍色/B區景點</strong>
                    </td>
                    <td>只想挑幾個重點景點、不想被時間追著跑的人</td>
                  </tr>
                  <tr>
                    <td>Big5</td>
                    <td>
                      <strong>2 個紫色/A區景點 + 3 個藍色/B區景點</strong>
                    </td>
                    <td>想保留彈性，又會去多個付費景點的人</td>
                  </tr>
                </tbody>
              </table>
              <SeoVideoLinkMenu label="24小時走法" links={passVideoLinks.route24h} />
              <SeoVideoLinkMenu label="48小時走法" links={passVideoLinks.route48h} />

              <p>
                簡單說：<strong>24/48小時</strong>是限時制，適合短時間衝景點；<strong>Big3/Big5</strong>
                是數量制，重點就是 Big3 = 1 個紫色/A區 + 2 個藍色/B區、Big5 = 2 個紫色/A區 + 3 個藍色/B區。
              </p>

              <h3 className="seo-h3">紫色/A區、藍色/B區景點是什麼？</h3>
              <p>
                紫色/A區景點通常比較高價，適合拿來當回本主力；藍色/B區景點適合補順路。買 Big3/Big5 時，先把 A區名額留給最想去、原價也比較高的景點。
              </p>

              <h3 className="seo-h3">哪些景點比較適合拿來回本？</h3>
              <p>
                常見高價值景點有釜山樂天世界、Skyline Luge Busan、Busan X the Sky、Club D Oasis、Spa Land、松島海上纜車、遊艇等。不是越多越好，重點是位置順不順、時間夠不夠。
              </p>

              <h3 className="seo-h3">旅杰地圖分類：價格高 / 價格中 / 價格低</h3>
              <p>
                官方會用紫色/A區、藍色/B區區分票種規則；上方地圖則用實際票價與使用價值分成<strong>價格高</strong>、<strong>價格中</strong>、<strong>價格低</strong>。
                價格高先看能不能串成路線，價格中拿來補空檔，價格低當順路加分就好。
              </p>

              <h3 className="seo-h3">搭配地圖規劃的小技巧</h3>
              <ul>
                <li>先選票種：趕行程選 24/48 小時，慢慢玩選 Big3/Big5。</li>
                <li>買 Big3 記得是 1 個紫色/A區景點 + 2 個藍色/B區景點。</li>
                <li>買 Big5 記得是 2 個紫色/A區景點 + 3 個藍色/B區景點。</li>
                <li>再打開地圖「價格高」分類，挑出最想去、也最容易回本的景點。</li>
                <li>再看景點集中在哪一區，避免同一天從東釜山跑到南浦洞再回海雲台。</li>
                <li>
                  不包含膠囊列車，這裡可以直接看
                  <a
                    href="https://www.jiejourneys.com/busan/map?place=busan-blueline-park"
                    data-event="busanpassmap_blueline_map"
                    data-platform="map"
                    data-section="seo_content"
                  >
                    膠囊列車攻略
                  </a>
                  。
                </li>
                <li>
                  不包含水營灣遊艇，這裡可以直接看
                  <a
                    href="https://www.jiejourneys.com/busan/map?place=busan-yacht-holic"
                    data-event="busanpassmap_yacht_holic_map"
                    data-platform="map"
                    data-section="seo_content"
                  >
                    水營灣遊艇攻略
                  </a>
                  。
                </li>
                <li>釜山鑽石灣遊艇、ibgogage（韓服租借）、DiAegg 密室逃脫、衝浪者 松亭店、大榮跆拳道、洛東江生態探訪船需要預約，連結都放在地圖卡片裡。</li>
              </ul>
              <p>
                如果你的行程會混到膠囊列車、水營灣遊艇、海雲台美食或住宿選區，先切到
                <a href="/busan/map" data-event="busanpassmap_general_map" data-section="seo_content">
                  釜山總地圖
                </a>
                一起看位置；如果只是想比較 Pass 以外的門票，則可以看
                <a href="/busan/ticket" data-event="busanpassmap_ticket_compare" data-section="seo_content">
                  釜山票券總整理
                </a>
                ；如果想把 Pass 景點、膠囊列車、遊艇、美食和住宿一起排成完整路線，可以搭配
                <a href="/busan/journeys" data-event="busanpassmap_journeys_compare" data-section="seo_content">
                  釜山自由行 PDF
                </a>
                。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="釜山Pass常見問題">
            <h2 className="seo-h2">釜山Pass常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山Pass值得買嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  基本上第一次去釜山都必買，除非你整個旅行只會去裡面1-2個景點。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山Pass 24小時和48小時怎麼選？</span>
                </h3>
                <p className="seo-faq-a">
                  24小時適合把高價景點集中在同一天玩；48小時適合第一次去釜山、想把海雲台、東釜山、南浦洞、松島分兩天慢慢排的人。行程越分散，越要注意交通時間。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>Big3 / Big5 和 24 / 48 小時哪個比較好？</span>
                </h3>
                <p className="seo-faq-a">
                  想在一兩天內密集玩景點，選 24/48 小時比較直覺；想慢慢玩、不想被啟用時間限制，選 Big3/Big5 比較彈性。重點記法是 Big3 = 1 個紫色/A區景點 + 2 個藍色/B區景點，Big5 = 2 個紫色/A區景點 + 3 個藍色/B區景點。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山Pass包含天空膠囊列車嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  不包含膠囊列車但是包含海岸列車。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>釜山Pass包含水營灣遊艇嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  釜山Pass常見可使用的是鑽石灣遊艇，水營灣遊艇通常需要另外購票。
                  <a
                    href="https://www.jiejourneys.com/busan/ticket"
                    data-event="busanpassmap_ticket_page"
                    data-platform="ticket"
                    data-section="seo_faq"
                  >
                    所有票券整理在這裡
                  </a>
                  。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>用釜山Pass需要提前預約嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  只有釜山鑽石灣遊艇、ibgogage（韓服租借）、DiAegg 密室逃脫、衝浪者 松亭店、大榮跆拳道、洛東江生態探訪船需要預約，連結都放在地圖卡片裡。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
