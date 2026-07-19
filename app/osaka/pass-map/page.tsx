'use client'

import MapClient from '@/components/map/MapClient'
import SeoVideoLinkMenu from '@/components/seo/SeoVideoLinkMenu'
import { OSAKA_PASS_MAP_CENTER, osakaPassMapPlaces } from '@/data/osaka/pass-map/places'

const categoryLabels = {
  spot: '\u514d\u8cbb\u8a2d\u65bd',
  free: '\u512a\u60e0\u8a2d\u65bd',
  food: '\u5e97\u5bb6\u512a\u60e0',
  hotel: '\u4f4f\u5bbf',
}

const passVideoLinks = [
  { label: 'IG｜大阪周遊券', href: 'https://www.instagram.com/reel/Dap0xBSBbSI/', event: 'osakapassmap_video_ig', platform: 'IG' },
  { label: 'YouTube｜大阪周遊券', href: 'https://www.youtube.com/shorts/u1g5J6SGZR4', event: 'osakapassmap_video_yt', platform: 'YouTube' },
]

export default function OsakaPassMapPage() {
  return (
    <MapClient
      places={osakaPassMapPlaces}
      mapCenter={OSAKA_PASS_MAP_CENTER}
      gtagPrefix="osakapassmap"
      title="大阪周遊券地圖"
      backHref="/osaka"
      defaultCategories={{ spot: true, free: true, food: true, hotel: false }}
      categoryLabels={categoryLabels}
      categoryItems={[
        { key: 'spot', label: '\u514d\u8cbb\u8a2d\u65bd' },
        { key: 'free', label: '\u512a\u60e0\u8a2d\u65bd' },
        { key: 'food', label: '\u5e97\u5bb6\u512a\u60e0' },
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
          label: '攻略',
          href: '/osaka/osaka-amazing-pass?from=pass-map',
          event: 'osakapassmap_top_article',
          platform: 'internal',
        },
        {
          label: 'IG',
          href: 'https://www.instagram.com/reel/Dap0xBSBbSI/',
          event: 'osakapassmap_top_video_ig',
          platform: 'Instagram',
          external: true,
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/shorts/u1g5J6SGZR4',
          event: 'osakapassmap_top_video_yt',
          platform: 'YouTube',
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
        <article className="seo-page" aria-label="大阪周遊券地圖使用說明">
          <section className="seo-content" aria-label="大阪周遊券地圖工具導覽">
            <h2 className="seo-h2">這張大阪周遊券地圖怎麼用？</h2>
            <div className="seo-prose">
              <p>
                這頁是工具型地圖，重點是快速看位置：先切換「免費設施」、「優惠設施」、「店家優惠」，再用顏色判斷哪些點值得優先排進同一天。完整購買方式、回本邏輯和路線範例，放在
                <a href="/osaka/osaka-amazing-pass?from=pass-map" data-event="osakapassmap_internal_article_intro" data-section="seo_content">
                  大阪周遊券完整攻略
                </a>
                。
              </p>
              <SeoVideoLinkMenu label="大阪周遊券" links={passVideoLinks} />

              <div className="seo-buy-links seo-action-links" aria-label="大阪周遊券相關連結">
                <a
                  className="seo-buy-link primary"
                  href="/osaka/osaka-amazing-pass?from=pass-map"
                  data-event="osakapassmap_article_cta"
                  data-platform="internal"
                  data-section="seo_content"
                >
                  看完整攻略
                </a>
                <a
                  className="seo-buy-link"
                  href="/tools/planner?region=osaka&source=pass"
                  data-event="osakapassmap_planner_cta"
                  data-platform="internal"
                  data-section="seo_content"
                >
                  加入排序
                </a>
                <a
                  className="seo-buy-link"
                  href="/osaka/ticket"
                  data-event="osakapassmap_ticket_cta"
                  data-platform="internal"
                  data-section="seo_content"
                >
                  大阪票券整理
                </a>
              </div>

              <h3 className="seo-h3">地圖顏色怎麼看？</h3>
              <table>
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>顏色</th>
                    <th>使用建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>免費設施</td>
                    <td>紅色 / 黃色 / 綠色</td>
                    <td>高價值 / 中價值 / 低價值。先看紅色與黃色，再補綠色順路點。</td>
                  </tr>
                  <tr>
                    <td>優惠設施</td>
                    <td>深灰 / 淺灰</td>
                    <td>深灰比較值得注意；淺灰通常是剛好路過再用。</td>
                  </tr>
                  <tr>
                    <td>店家優惠</td>
                    <td>深灰 / 淺灰</td>
                    <td>餐飲與購物優惠當作加分，不建議為了折扣特地繞路。</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="seo-h3">最簡單的排法</h3>
              <ul>
                <li>先選 2 到 3 個你真的想去的免費設施，不要先追求塞滿。</li>
                <li>確認它們是否集中在難波、梅田、大阪城、天王寺或天保山同一帶。</li>
                <li>把地鐵/巴士移動也算進去；大阪周遊券不是只有景點門票。</li>
                <li>如果行程混到 USJ、海遊館、京都、奈良，先回大阪票券頁分開買票。</li>
              </ul>

              <p>
                想同時看一般大阪景點、美食、住宿和票券，可以切到
                <a href="/osaka/map" data-event="osakapassmap_internal_general_map" data-section="seo_content">
                  旅杰大阪地圖
                </a>
                ；想查住宿區域，搭配
                <a href="/osaka/hotel" data-event="osakapassmap_internal_hotel" data-section="seo_content">
                  大阪住宿推薦
                </a>
                會更好安排當天起點和終點。
              </p>
            </div>
          </section>
        </article>
      }
    />
  )
}
