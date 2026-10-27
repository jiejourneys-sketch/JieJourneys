import { plannerFaqItems, plannerFeatures } from './pageContent'
import styles from './toolsPlanner.module.css'

export default function PlannerAbout() {
  return (
    <section className={styles.seoIntro} aria-labelledby="planner-about-title">
      <h2 id="planner-about-title">旅杰規劃：免費的自由行行程規劃工具</h2>
      <p>
        <strong>旅杰規劃（JieJourneys Planner）是免登入的線上旅遊行程規劃工具。</strong>
        你可以用手機或電腦，把景點、住宿、餐廳、商店、票券、交通與 Google Maps 連結整理成每天的行程，拖曳調整順序，保存後再分享給旅伴。
      </p>
      <p>
        適合正在準備自由行、已經收藏許多地點，卻還沒決定怎麼排的人。從出發前查資料，到旅行途中確認下一站，都可以回到同一份行程查看，不必在聊天訊息、截圖和不同地圖連結之間反覆尋找。
      </p>

      <h3>怎麼開始排自由行？先完成這三步</h3>
      <ol className={styles.toolSteps}>
        <li><strong>輸入目的地</strong><span>選擇支援旅杰資料的城市，或建立空白行程，自行加入想去的地點。</span></li>
        <li><strong>依天數安排順序</strong><span>先放住宿與已預訂的活動，再把景點、餐廳和交通分配到每天。</span></li>
        <li><strong>保存並分享行程</strong><span>按「分享／保存」建立連結，存到常用位置，方便旅伴和其他裝置開啟。</span></li>
      </ol>

      <h3>一份行程可以整理哪些旅遊資料？</h3>
      <ul>
        {plannerFeatures.map((item) => <li key={item.title}><strong>{item.title}：</strong>{item.description}</li>)}
      </ul>

      <h3>景點很多時，怎麼排才比較順路？</h3>
      <p>
        先把確定的住宿、機場和需要預約的活動放進行程，再用地圖查看其他地點的位置。將同一區的景點、餐廳與商店安排在同一天，通常比把熱門景點平均分散到每天，更容易減少往返。
        接著依開放時間、訂位時段、體力和天氣調整先後，並在交通或用餐前後留下緩衝。
      </p>
      <p>
        旅杰規劃讓你對照位置、拖曳排序與保留備註，實際走法由你決定。安排一日遊時可以先抓必去的兩三個地點；多天自由行則先分區，再逐日補齊細節，行程會比較容易修改。
      </p>

      <h3>使用範例：把五天四夜的自由行變成可隨時修改的行程</h3>
      <p>
        假設已經訂好飯店，還收藏了展望台、逛街商圈和幾間餐廳，可以先加入住宿位置，再把抵達日與回程日的機場交通排好。中間幾天依地區安排，把已買票的活動放進指定日期，想順路吃的餐廳放在附近。
      </p>
      <p>
        旅伴有新提議時，直接加入地點或調整排序；遇到下雨，也能把室內活動移到當天。訂位時間、集合出口與替代景點寫在備註裡，最後保存連結，旅行途中就能用手機回看目前版本。
      </p>

      <h3>行程排好後，也把每個人的行前準備整理好</h3>
      <p>
        規劃旅行除了決定去哪裡，還有證件、訂房、票券與行李要準備。行程內的「行前準備」提供可勾選清單，包含護照、機票、旅平險、住宿、eSIM／SIM 卡、充電器與個人用品；也能自行加入提醒和連結。
        多人同行時可加入旅伴，分別查看每個人的進度，方便出發前逐項確認。
      </p>

      <h3>旅遊地圖、行程與分帳可以怎麼搭配？</h3>
      <p>
        還在找景點時，可以先看旅杰的目的地地圖；確定想去哪些地方後，再回來安排天數與順序。若旅行中會輪流代墊住宿、餐費或車資，也可以另外建立旅杰分帳帳本，讓行程與共同花費各有清楚的紀錄。
      </p>
      <nav className={styles.toolRelatedLinks} aria-label="旅杰規劃相關工具">
        <a href="/tokyo/map" data-event="planner_about_tokyo_map">東京景點地圖</a>
        <a href="/busan/map" data-event="planner_about_busan_map">釜山景點地圖</a>
        <a href="/tools/bill" data-event="planner_about_bill">旅杰分帳：整理旅行共同支出</a>
      </nav>

      <div className={styles.faq} aria-labelledby="planner-faq-title">
        <h3 id="planner-faq-title">自由行行程規劃常見問題</h3>
        {plannerFaqItems.map((item) => (
          <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
        ))}
      </div>
    </section>
  )
}
