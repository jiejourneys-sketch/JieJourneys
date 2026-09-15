import KyotoNaraGuidePage from '@/components/KyotoNaraGuidePage'
import { kyotoNaraOneDayTagOrder, kyotoNaraOneDayTicketCards, kyotoNaraSpotTicketCards } from '@/data/kyoto-nara/tickets'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '一日遊', label: '一日遊', dataArea: '一日遊' },
  { value: '景點・體驗', label: '景點・體驗', dataArea: '景點・體驗' },
]

const cards = [...kyotoNaraOneDayTicketCards, ...kyotoNaraSpotTicketCards]

export default function KyotoNaraTicketPage() {
  return (
    <KyotoNaraGuidePage
      eventPrefix="kyotonaraticket"
      badge="票券"
      title="京都・奈良票券｜熱門門票、一日遊與體驗完整整理"
      intro="把京都市區熱門單點票券與京都、奈良近郊一日遊分開整理；單點品項優先保留 KKday／Klook 公開頁顯示已售或已參加破百的選擇。"
      listTitle="京都・奈良票券推薦"
      tabs={tabs}
      cards={cards}
      tagFilterArea="一日遊"
      tagOrder={kyotoNaraOneDayTagOrder}
      tagHideOnAll
      contentTitle="京都・奈良票券怎麼選、怎麼排？"
      faqTitle="京都・奈良票券常見問題"
      faqs={[
        { q: '這頁的單點票券是怎麼挑的？', a: '優先保留 KKday 或 Klook 公開商品頁顯示已售、已參加 100+ 的京都直接相關品項，再排除同質性過高或已被一日遊行程涵蓋的商品。銷售數字、方案與取消規則都會變動，下單前仍要以商品頁為準。' },
        { q: '京都鐵道博物館和京都水族館可以排同一天嗎？', a: '可以，兩者都在梅小路公園旁；帶小孩或遇到雨天可排成半日到一日，但若想慢慢看展，建議先選一個當主景點，另一個視體力再加。' },
        { q: '單點門票和一日遊怎麼選？', a: '想自己掌握停留時間，就選單點門票或體驗；景點距離遠、同行者不想研究交通，或只剩一天想看天橋立、伊根、美山等近郊，再考慮一日遊。' },
        { q: '天橋立、伊根、美山可以同一天嗎？', a: '可以，但移動距離長。選行程時要看集合時間、每站停留長度與回到大阪或京都的時間，不要只看景點數量。' },
        { q: '京都一日遊需要先買交通票嗎？', a: '不一定。若參加巴士一日遊通常已含主要移動；自由行則先列實際搭乘次數，再依官方最新範圍與票價判斷。' },
      ]}
    >
      <p>
        <strong>先選「要自己玩一個景點」，還是「把遠距離交通交給一日遊」。</strong> 京都市區的展覽、博物館、體驗與夜間表演適合自己安排；天橋立、伊根、美山、奈良或多個京都景點串在一起時，才適合用一日遊換取少轉車與固定動線。
      </p>

      <h3 className="seo-h3">先看兩個分頁：一日遊 vs 景點・體驗</h3>
      <p>
        「一日遊」適合從大阪或京都出發，把嵐山、伏見稻荷、奈良、宇治、天橋立、伊根或美山交給巴士與領隊處理。先用上方景點 tag 篩掉不想去的站，再比較集合地、出發時間、是否含門票，以及每站實際可停留多久。
      </p>
      <p>
        「景點・體驗」則是京都市區自己排最有彈性的選項。你可以在京都車站到達日排京都塔或 teamLab，梅小路安排鐵道博物館或水族館，東山排和服後接清水寺與二年坂；不需要為了買票而被綁住一整天。
      </p>

      <h3 className="seo-h3">京都車站、梅小路：雨天與親子先從這裡選</h3>
      <p>
        <strong>teamLab Biovortex 京都</strong>在京都車站八條東口步行圈，適合傍晚、雨天或不想再搭一段車的空檔；它是沉浸式展覽，請依入場時段預留時間。<strong>Nidec 京都塔展望台</strong>就在車站北側，抵達日、離開日或日落前後最順，不必特別跨區。
      </p>
      <p>
        親子或鐵道迷可從<strong>京都鐵道博物館</strong>與<strong>京都水族館</strong>二選一開始，兩者都在梅小路公園旁。想看蒸汽火車、新幹線展示與互動內容，鐵道博物館會更符合期待；想排室內生物展覽與較輕鬆的親子行程，水族館更合適。兩個都玩不是不行，但不要再硬塞東山或嵐山，否則移動會吃掉體力。
      </p>

      <h3 className="seo-h3">東山、河原町：和服與晚間表演怎麼接</h3>
      <p>
        清水寺周邊目前保留 <strong>Ookini、Okimono屋與 MOCOMOCO</strong> 三個不同店家的和服選項，集合點都在五條坂、清水寺山腳一帶。最合理的路線是先換裝，再走清水寺、三年坂、二年坂、八坂神社到祇園；比較時優先看款式、攝影、行李寄放、跨店／隔日歸還與最晚歸還時間，而不是只看最低價格。
      </p>
      <p>
        晚上想安排有內容的行程，可考慮<strong>GEAR 無語言劇場</strong>。它位在三條、河原町一帶，沒有台詞，對不想受語言限制的旅人很友善；將它接在錦市場、寺町通、河原町晚餐後，比白天跨區趕行程更自然。演出時間與座位會依日期不同，務必以商品頁的場次為準。
      </p>

      <h3 className="seo-h3">想帶小孩、愛動漫，或不想只看寺社</h3>
      <p>
        <strong>太秦映畫村</strong>是京都西側的影視主題園區，有江戶街景、忍者與角色相關體驗；比起把它硬塞在嵐山早上或東山下午，更建議獨立排半日。它適合親子、動漫迷與對時代劇場景有興趣的人，但和京都車站、清水寺不是同一區，請把交通時間一起算進去。
      </p>
      <p>
        這 10 個單點票券地點都已標在<a href="/osaka/map" data-event="kyotonaraticket_article_map" data-section="seo_content">大阪・京都・奈良旅杰地圖</a>的「票券」分類中。打開地圖就能看清楚京都車站、梅小路、東山、河原町、太秦與龜岡之間的距離，再決定要不要排在同一天。
      </p>

      <h3 className="seo-h3">遠距離一日遊：景點少一點，行程反而更舒服</h3>
      <p>
        天橋立、伊根、美山是京都北部的長距離路線；奈良、宇治與伏見稻荷則比較適合京都南側或大阪出發的組合。選一日遊時，不要只看標題列了幾個景點：集合地是否順路、午餐是否自理、纜車／船票／入場費有沒有包含，以及回程是否還要趕新幹線，才是實際影響體驗的條件。
      </p>
      <p>
        如果你已經住在京都，而且只想看嵐山、東山或伏見稻荷，通常自行搭車、留足停留時間會比跟團更好；如果是第一次到關西、同行者不想研究轉車，或只剩一天想去天橋立、伊根、美山，才優先考慮一日遊。想先排每日區域與住宿位置，可搭配<a href="/kyoto-nara/hotel" data-event="kyotonaraticket_article_hotel" data-section="seo_content">京都住宿推薦</a>與<a href="/kyoto-nara/transport" data-event="kyotonaraticket_article_transport" data-section="seo_content">京都奈良通訊／交通攻略</a>一起看。
      </p>

      <h3 className="seo-h3">下單前確認五件事</h3>
      <ul>
        <li><strong>日期與時段：</strong>teamLab、表演、和服等體驗常有指定時段；不要只確認「買得到」。</li>
        <li><strong>集合／入場位置：</strong>一日遊要看集合地；和服要看店址；門票則確認是直接掃碼還是需兌換。</li>
        <li><strong>包含項目：</strong>一日遊的船票、纜車、入場、餐食不一定全含；單點票券也可能有加購方案。</li>
        <li><strong>取消規則：</strong>有些票券可免費取消，有些在選定日期後不能更改，請不要把不同商品的規則混在一起看。</li>
        <li><strong>當天動線：</strong>先打開地圖確認區域，再買票。京都最容易浪費時間的不是景點本身，而是東山、梅小路、太秦與嵐山之間的跨區移動。</li>
      </ul>
    </KyotoNaraGuidePage>
  )
}
