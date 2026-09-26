import KyotoNaraGuidePage from '@/components/KyotoNaraGuidePage'
import type { CityCard } from '@/components/CityTabbedList'

const tabs = [{ value: 'all', label: '全部', dataArea: 'all' }]

const cards: CityCard[] = [
  {
    title: '京都 5 個必去景點｜攻略',
    meta: '京都攻略',
    area: 'all',
    datasetKey: 'video',
    datasetValue: 'kyoto-5-must-visit-spots-guide',
    actions: [
      {
        label: 'IG Reels',
        href: 'https://www.instagram.com/reel/DdwF6stBInS/',
        className: 'btn primary',
        event: 'kyotonaravideo_5spots_ig',
        platform: 'IG',
        section: 'video',
      },
      {
        label: 'YouTube',
        href: 'https://youtube.com/shorts/CY4ta6htt2c',
        className: 'btn',
        event: 'kyotonaravideo_5spots_youtube',
        platform: 'YouTube',
        section: 'video',
      },
      {
        label: '文章',
        href: '/kyoto-nara/kyoto-5-must-visit-spots-guide?from=kyoto-video',
        className: 'btn',
        event: 'kyotonaravideo_5spots_article',
        platform: 'article',
        section: 'video',
      },
    ],
  },
  {
    title: '京都 6 大區域｜攻略',
    meta: '京都攻略',
    area: 'all',
    datasetKey: 'video',
    datasetValue: 'kyoto-6-areas-guide',
    actions: [
      {
        label: '文章',
        href: '/kyoto-nara/kyoto-6-areas-guide?from=kyoto-video',
        className: 'btn',
        event: 'kyotonaravideo_6areas_article',
        platform: 'article',
        section: 'video',
      },
    ],
  },
]

export default function KyotoNaraVideoPage() {
  return (
    <KyotoNaraGuidePage
      eventPrefix="kyotonaravideo"
      badge="旅遊攻略合輯"
      title="京都自由行攻略合輯｜3～5 天行程、分區景點與交通"
      intro="京都不適合把熱門景點一路硬串。先分區、再安排早晚與交通，才能把清水寺、伏見稻荷、嵐山與市中心玩得順又不累。"
      listTitle="京都攻略"
      tabs={tabs}
      cards={cards}
      collapseVideoActions
      contentTitle="京都自由行怎麼排？先分區，再決定天數"
      faqTitle="京都自由行常見問題"
      faqs={[
        { q: '第一次去京都要排幾天？', a: '市區經典景點至少留 2 到 3 天；想加嵐山、宇治或季節限定景點，排 4 到 5 天會更從容。若正好遇到櫻花、楓葉旺季，也別把每天塞得太滿。' },
        { q: '京都景點應該怎麼分天？', a: '用區域排，而不是用景點人氣排：東山・祇園一天、伏見或宇治一天、嵐山一天，再用京都車站與烏丸市中心補購物、餐廳與雨天備案。' },
        { q: '京都市內只搭公車可以嗎？', a: '可以，但熱門季節與上下班時段容易受塞車影響。跨區時優先看地下鐵、JR、阪急或京阪電車，再把公車留給最後一段接駁，時間會比較可控。' },
        { q: '京都要特別注意什麼？', a: '熱門寺社請提早或傍晚前往，遵守禁止攝影與私有道路告示；拖大行李時不要硬擠公車，先寄放或送到飯店。夜間特別參拜、休館日與預約規則則以官方公告為準。' },
      ]}
    >
      <p><strong>京都自由行的關鍵不是跑得多，而是把同一區的景點放在同一天。</strong> 先抓好分區、天數、交通與避雷原則，第一次去也能玩得順，還留得下散步、吃飯與臨時改行程的空間。</p>

      <h3 className="seo-h3">先決定天數｜2 天看經典，3 天最剛好，4～5 天留給近郊</h3>
      <p>時間有限時，兩天可先走東山・祇園與一個近郊方向；第一次前往最推薦安排三天，分別給東山・祇園、嵐山，以及伏見或宇治。若想把市中心散步、寺社、咖啡店與購物排得更鬆，或正好遇上櫻花、楓葉季，四到五天會舒服很多。京都車站適合作為抵達、離開與跨區移動的起點，也方便把最後半天留給購物或休息。</p>

      <h3 className="seo-h3">分區排法｜每天只選一個主區，再加一個順路小區</h3>
      <ul>
        <li><strong>東山・祇園：</strong>清水寺、二年坂三年坂、八坂神社、花見小路與鴨川適合連成一整天。這區靠步行最有味道，清晨進清水寺、傍晚再走祇園，能避開最擁擠的時段。</li>
        <li><strong>伏見・宇治：</strong>伏見稻荷適合一早走鳥居步道；宇治則留給平等院、宇治川與抹茶店。兩者都值得慢走，若同行者不想趕行程，建議擇一作為主角。</li>
        <li><strong>嵐山：</strong>渡月橋、天龍寺與竹林可以走成半天到一天。想搭小火車、保津川遊船或往更安靜的寺院延伸，就不要再塞進京都市中心景點。</li>
        <li><strong>烏丸・市中心：</strong>二條城、錦市場、四條河原町與鴨川周邊適合雨天、抵達日或離開日前後安排，也能和餐廳、百貨與買伴手禮一起完成。</li>
      </ul>

      <h3 className="seo-h3">第一次京都的 3 天骨架</h3>
      <p><strong>Day 1 東山・祇園：</strong>早上清水寺，接二年坂三年坂、八坂神社與祇園，晚上回河原町或鴨川用餐。<strong>Day 2 嵐山：</strong>早出發，把渡月橋、天龍寺與竹林放在同一段；下午若體力足夠，再回市中心逛錦市場或四條通。<strong>Day 3 伏見或宇治：</strong>想看千本鳥居就選伏見稻荷，想走抹茶與世界遺產則選宇治。這樣不追求「一天跑四個名所」，反而能真正留出停留、吃飯與臨時改行程的餘裕。</p>

      <h3 className="seo-h3">交通原則｜電車處理跨區，公車留給最後一段</h3>
      <p>京都的公車很實用，但熱門景點與旺季常受道路壅塞影響。從關西機場抵達京都、前往嵐山、伏見稻荷、宇治或大阪時，先比較 JR、地下鐵、阪急與京阪等鐵道路線；抵達附近車站後，再以公車或步行完成最後一段。大型行李則先寄放或送到飯店，別讓抵達日變成拖行李找公車的行程。</p>

      <h3 className="seo-h3">熱門景點避雷｜時間與禮儀比清單更重要</h3>
      <p>清水寺、伏見稻荷與嵐山適合早上或傍晚安排；櫻花、楓葉、黃金週與暑假連假更要保留排隊與轉乘緩衝。祇園、花見小路與住宅巷弄請留在公共通行區域，依現場告示遵守攝影規定；寺社的夜間特別參拜、休館日與是否需要預約，出發前請以官方最新公告確認。</p>

      <h3 className="seo-h3">想玩得更深｜把一個下午留給非必去景點</h3>
      <p>回訪京都時，不必再把每座名寺重走一次。可把時間留給商店街、錢湯、設計建築、庭園或一間想去很久的茶屋；喜歡自然的人也可把北部山區或京都府近郊另排成完整一天。京都的魅力不只在集章式打卡，而在於有餘裕放慢腳步。</p>

      <h3 className="seo-h3">接著怎麼規劃？</h3>
      <p>先在<a href="/osaka/map" data-event="kyotonaravideo_map" data-section="seo_content">大阪・京都・奈良旅杰地圖</a>打開京都景點，確認同一天的距離；接著選<a href="/kyoto-nara/hotel" data-event="kyotonaravideo_hotel" data-section="seo_content">京都住宿</a>的據點，再到<a href="/kyoto-nara/transport" data-event="kyotonaravideo_transport" data-section="seo_content">京都奈良通訊／交通</a>與<a href="/kyoto-nara/ticket" data-event="kyotonaravideo_ticket" data-section="seo_content">京都奈良票券</a>補上需要的移動與預約。</p>
    </KyotoNaraGuidePage>
  )
}
