'use client'

import MapClient from '@/components/map/MapClient'
import { OSAKA_PASS_MAP_CENTER, osakaPassMapPlaces } from '@/data/osaka/pass-map/places'

export default function OsakaPassMapPage() {
  return (
    <MapClient
      places={osakaPassMapPlaces}
      mapCenter={OSAKA_PASS_MAP_CENTER}
      gtagPrefix="osakapassmap"
      title="大阪周遊券地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryItems={[
        { key: 'spot', label: '免費設施' },
        { key: 'free', label: '優惠設施' },
        { key: 'food', label: '店家優惠' },
      ]}
      topActions={[
        {
          label: 'KKDAY',
          href: 'https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312',
          event: 'osakapassmap_top_buy_kkday',
          platform: 'KKDAY',
          primary: true,
          external: true,
        },
        {
          label: 'KLOOK',
          href: 'https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798',
          event: 'osakapassmap_top_buy_klook',
          platform: 'KLOOK',
          external: true,
        },
        {
          label: 'Trip',
          href: 'https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162',
          event: 'osakapassmap_top_buy_trip',
          platform: 'Trip',
          external: true,
        },
        {
          label: '排序',
          href: '/tools/planner?region=osaka&source=pass',
          event: 'osakapassmap_top_planner',
          platform: 'internal',
          placement: 'afterBelowContent',
        },
      ]}
      belowContent={
        <article className="seo-page" aria-label="大阪周遊券地圖攻略">
          <section className="seo-content" aria-label="大阪周遊券地圖說明">
            <h2 className="seo-h2">大阪周遊券地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                大阪周遊券（Osaka Amazing Pass）適合把大阪市區付費景點排得比較密集的人。它除了能用在指定免費設施，也幾乎可以免費搭大阪市區地鐵和巴士，所以規劃時不要只算門票，也要把當天交通移動一起算進去。
              </p>
              <p>
                這張地圖把周遊券免費設施、優惠設施和店家優惠分開，先看你想去的景點集中在哪裡，再決定要不要買周遊券會比較準。
              </p>
              <div className="seo-buy-links" aria-label="購買大阪周遊券">
                <a
                  className="seo-buy-link primary"
                  href="https://www.kkday.com/zh-tw/product/12156-osaka-amazing-pass-e-ticket-japan?cid=22312"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osakapassmap_buy_kkday"
                  data-platform="KKDAY"
                  data-section="seo_content"
                >
                  KKDAY 購買
                </a>
                <a
                  className="seo-buy-link"
                  href="https://www.klook.com/zh-TW/activity/82312-amazing-pass-osaka/?aid=93798"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osakapassmap_buy_klook"
                  data-platform="KLOOK"
                  data-section="seo_content"
                >
                  KLOOK 比價
                </a>
                <a
                  className="seo-buy-link"
                  href="https://tw.trip.com/things-to-do/detail/48361291?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17058162"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event="osakapassmap_buy_trip"
                  data-platform="Trip"
                  data-section="seo_content"
                >
                  Trip 查看
                </a>
              </div>
              <p>
                還在比較要不要買，可以先看
                <a href="/osaka/ticket" data-event="osakapassmap_internal_ticket" data-section="seo_content">
                  大阪票券整理
                </a>
                、
                <a href="/osaka/hotel" data-event="osakapassmap_internal_hotel" data-section="seo_content">
                  大阪住宿推薦
                </a>
                和
                <a href="/osaka/transport" data-event="osakapassmap_internal_transport" data-section="seo_content">
                  大阪交通攻略
                </a>
                ；如果想把 USJ、海遊館、美食和住宿也一起看，直接開
                <a href="/osaka/map" data-event="osakapassmap_internal_map" data-section="seo_content">
                  旅杰大阪地圖
                </a>
                ，再回來對照地圖會比較好判斷。
              </p>

              <h3 className="seo-h3">地圖標記顏色怎麼看？</h3>
              <p>
                這不是官方分類，是我用「原價高低、回本價值、行程實用度」整理給你快速判斷的。免費設施分成高、中、低三種價值；優惠設施和店家優惠只分高、低兩種，深色代表比較值得注意，淺色代表順路再用。
              </p>
              <table>
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>標記顏色</th>
                    <th>意思</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>免費設施</td>
                    <td>紅色 / 黃色 / 綠色</td>
                    <td>高價值 / 中價值 / 低價值</td>
                  </tr>
                  <tr>
                    <td>優惠設施</td>
                    <td>深灰 / 淺灰</td>
                    <td>高價值 / 低價值</td>
                  </tr>
                  <tr>
                    <td>店家優惠</td>
                    <td>深灰 / 淺灰</td>
                    <td>高價值 / 低價值</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="seo-h3">先看免費設施，再看優惠設施</h3>
              <p>
                地圖上的「免費設施」是判斷周遊券值不值得買的主力，例如通天閣、大阪城相關設施、梅田藍天大廈、HEP FIVE 摩天輪、天保山摩天輪、道頓堀遊船等。
                「優惠設施」和「店家優惠」比較適合順路補，不建議只為了折扣特典硬排。
              </p>

              <h3 className="seo-h3">比較容易回本的排法</h3>
              <ul>
                <li>先挑 2 到 3 個原價較高、自己真的想去的免費設施。</li>
                <li>再看它們是不是集中在難波、梅田、大阪城、天保山或天王寺附近。</li>
                <li>把當天會搭的地鐵、巴士移動也算進去，周遊券不只是景點門票。</li>
                <li>如果一天只逛道頓堀、心齋橋、黑門市場，通常不用硬買周遊券。</li>
                <li>如果會連跑展望台、遊船、摩天輪、大阪城周邊設施，周遊券就比較容易划算。</li>
              </ul>
              <p>
                如果你的行程會混到 USJ、海遊館、京都奈良一日遊，先去
                <a href="/osaka/ticket" data-event="osakapassmap_ticket_compare" data-section="seo_content">
                  大阪票券總整理
                </a>
                看哪些要另外買；如果主要想跑周遊券景點，住宿選難波、心齋橋或梅田會比較好排，也可以搭配
                <a href="/osaka/hotel" data-event="osakapassmap_hotel_compare" data-section="seo_content">
                  大阪住宿區域整理
                </a>
                一起看。
              </p>

              <h3 className="seo-h3">規劃路線的小技巧</h3>
              <ul>
                <li>難波、道頓堀、新世界、天王寺可以排成市區南側路線。</li>
                <li>梅田、HEP FIVE、藍天大廈可以排成大阪站周邊路線。</li>
                <li>大阪城、中之島、遊船類可以排成市區中段路線。</li>
                <li>天保山、聖瑪麗亞號、摩天輪、海遊館周邊適合排半天到一天。</li>
              </ul>
              <p>
                這張主要看大阪周遊券涵蓋和優惠景點；如果你想同時看一般大阪景點、USJ、海遊館、住宿、票券和美食，可以切到
                <a href="/osaka/map" data-event="osakapassmap_general_map" data-section="seo_content">
                  大阪景點地圖
                </a>
                一起排。
              </p>
            </div>
          </section>

          <section className="seo-faq" id="seo-faq" aria-label="大阪周遊券地圖常見問題">
            <h2 className="seo-h2">大阪周遊券常見問題</h2>
            <ul className="seo-faq-list seo-prose seo-faq-prose" role="list">
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪周遊券適合誰買？</span>
                </h3>
                <p className="seo-faq-a">
                  適合第一次來大阪的人，基本上都會去裡面提供的熱門景點，除非你主要是逛街、吃飯、拍照，或行程多在京都、奈良、神戶，才不用硬買。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>免費設施和優惠設施差在哪？</span>
                </h3>
                <p className="seo-faq-a">
                  免費設施通常是持周遊券可直接使用或入場，是回本重點；優惠設施多半是折扣或特典，適合順路使用，但不一定是買周遊券的主因。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪周遊券可以搭地鐵和巴士嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  可以，使用期間幾乎可以免費搭大阪市區主要地鐵和巴士，只有少部分比較郊外的搭不了，無需特別考慮。
                </p>
              </li>
              <li className="seo-faq-item">
                <h3 className="seo-h3 seo-faq-q">
                  <span className="seo-faq-qicon" aria-hidden="true">
                    Q
                  </span>
                  <span>大阪周遊券包含 USJ 或海遊館嗎？</span>
                </h3>
                <p className="seo-faq-a">
                  日本環球影城不包含在大阪周遊券裡；海遊館通常也不是周遊券免費入場主力。這類熱門景點建議另外看單獨票券，再搭配地圖安排路線。
                </p>
              </li>
            </ul>
          </section>
        </article>
      }
    />
  )
}
