import type { CityCard } from '@/components/CityTabbedList'
import KyotoNaraGuidePage from '@/components/KyotoNaraGuidePage'

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '通訊', label: '通訊', dataArea: '通訊' },
  { value: '關西機場', label: '關西機場', dataArea: '關西機場' },
]

const cards: CityCard[] = [
  {
    title: '日本 eSIM',
    meta: '通訊｜單人、雙人自由行最省事的選項',
    note: '付款前先確認手機已解鎖、支援 eSIM；保留 QR code 與商品啟用說明。',
    details: ['不用換實體卡，通常可在抵達日本後依商品規則啟用。', '出發前先下載離線地圖、住宿與交通 App，抵達後再確認網路可用。', '流量、熱點分享、有效天數與啟用時間依商品不同，請在付款前逐項確認。'],
    area: '通訊',
    actions: [
      { label: 'KarDear eSIM', href: 'https://kardear.com/product-category/kardear/network/esim/japan/?ref=390', className: 'btn primary recommend', event: 'kyotonaratransport_esim_kardear', platform: 'KarDear', section: 'comm_card' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/131111-japan-4g-unlimited-data-500mb-1gb-esim?cid=22312', className: 'btn', event: 'kyotonaratransport_esim_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/109393-japan-esim-high-speed-internet-qr-code-voucher/?aid=93798', className: 'btn', event: 'kyotonaratransport_esim_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/37658069?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'kyotonaratransport_esim_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: '日本 SIM 卡｜郵寄到府',
    meta: '通訊｜手機不支援 eSIM、想在台灣先準備好時',
    note: '確認卡槽尺寸、到貨時間、APN 設定，以及原本台灣 SIM 卡的收納位置。',
    details: ['適合不支援 eSIM 或偏好實體卡的人。', '出發前先確認拆卡針與 SIM 卡槽能正常使用。', '原本 SIM 卡請放進固定小袋，避免回台時找不到。'],
    area: '通訊',
    actions: [
      { label: 'KarDear SIM', href: 'https://kardear.com/product/sim-japan/?ref=390', className: 'btn primary recommend', event: 'kyotonaratransport_simhome_kardear', platform: 'KarDear', section: 'comm_card' },
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/126982?cid=22312', className: 'btn', event: 'kyotonaratransport_simhome_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/17147-softbank-4g-sim-japan/?aid=93798', className: 'btn', event: 'kyotonaratransport_simhome_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: '日本 SIM 卡｜桃園機場領取',
    meta: '通訊｜出發當天才補買時可比較',
    note: '先確認取件櫃位與營業時間，別把取件壓在報到前最後幾分鐘。',
    details: ['領到後先閱讀安裝說明，抵達日本再依指示插卡、開啟數據漫遊。', '雙卡機請確認數據卡與預設語音卡，避免到日本後誤用原門號數據。', '若航班很早或很晚，優先確認取件是否可行。'],
    area: '通訊',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/19991?cid=22312', className: 'btn primary', event: 'kyotonaratransport_simtpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/40060-4g-sim-card-japan-docomo/?aid=93798', className: 'btn', event: 'kyotonaratransport_simtpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wi‑Fi 分享器｜台灣機場領取',
    meta: '通訊｜多人、多裝置共用時再考慮',
    note: '請把充電、隨身攜帶、歸還與同行者走散時的備案一起算進去。',
    details: ['適合多人共用，或同行者的手機不支援 eSIM。', '需每天充電；裝置持有人離開時，其他人也會失去網路。', '付款前確認可連線裝置數、流量規則與歸還方式。'],
    area: '通訊',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/11157?cid=22312', className: 'btn primary', event: 'kyotonaratransport_wifitpe_kkday', platform: 'KKDAY', section: 'comm_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16627-4g-wifi-japan/?aid=93798', className: 'btn', event: 'kyotonaratransport_wifitpe_klook', platform: 'KLOOK', section: 'comm_card' },
    ],
  },
  {
    title: 'Wi‑Fi 分享器｜關西機場領取',
    meta: '通訊｜在日本取還的方案',
    note: '確認取件／歸還櫃位、營業時間與回程早晚班機是否相容。',
    details: ['抵達關西機場就能取得，但仍要留意航班延誤或深夜抵達。', '歸還前確認主機、線材與收納袋齊全，避免遺失費。', '建議仍讓至少一位同行者保有可獨立上網的備案。'],
    area: '通訊',
    actions: [
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798', className: 'btn primary', event: 'kyotonaratransport_wifijpn_klook', platform: 'KLOOK', section: 'comm_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/59496665?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11674280', className: 'btn', event: 'kyotonaratransport_wifijpn_trip', platform: 'Trip', section: 'comm_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 京都站｜HARUKA',
    meta: '關西機場｜想直達京都站、行李不想轉車時優先比較',
    note: '出發前仍要確認當日班次、末班時間、停靠站與票種適用範圍。',
    details: ['適合住宿在京都站附近，或要從京都站續轉新幹線、JR、地下鐵的人。', '抵達京都站後，八條口、中央口與飯店所在方向不同，請連同最後一段步行一起看。', '深夜抵達或早班離境，先確認首末班與飯店入住時間，再決定是否改搭巴士或接送。'],
    area: '關西機場',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/18940-kansai-airport-haruka-ticket-japan?cid=22312', className: 'btn primary', event: 'kyotonaratransport_haruka_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18400-jr-haruka-airport-express-train-tickets-osaka/?aid=93798', className: 'btn', event: 'kyotonaratransport_haruka_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/87364606/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'kyotonaratransport_haruka_trip', platform: 'Trip', section: 'transport_card' },
      { label: 'JR 西日本', href: 'https://www.westjr.co.jp/travel-information/en/tickets-passes/jrwest-rail-pass/kansai/', className: 'btn', event: 'kyotonaratransport_haruka_official', platform: 'official', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 京都｜利木津巴士',
    meta: '關西機場｜飯店附近有停靠站、同行行李多時再比較',
    note: '巴士不用拖行李上下月台，但班次、下車站與道路狀況會直接影響總時間。',
    details: ['優先確認要去的京都站、飯店或市區停靠點是否在當日路線內。', '適合親子、長輩或大件行李；若下車後仍要轉很遠，HARUKA 不一定比較差。', '務必以當日官方時刻表、停駛公告與行李規則為準。'],
    area: '關西機場',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/4835-limousine-bus-ticket-kansai-airport-kix-kyoto-osaka-city?cid=22312', className: 'btn primary', event: 'kyotonaratransport_limousine_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/18203-kansai-airport-one-way-transfer-osaka/?aid=93798', className: 'btn', event: 'kyotonaratransport_limousine_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/93684157?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'kyotonaratransport_limousine_trip', platform: 'Trip', section: 'transport_card' },
      { label: '官方時刻表', href: 'https://www.kate.co.jp/tcn/timetable/index', className: 'btn', event: 'kyotonaratransport_limousine_timetable', platform: 'timetable', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 京都／大阪飯店｜當日行李配送',
    meta: '關西機場｜先把行李送到飯店，輕裝開始第一天行程',
    note: '可寄送的京都／大阪飯店與最晚收件時間依所選方案而異；付款前務必以商品頁的服務區域、交件地點與行李尺寸規則為準。',
    details: ['適合抵達後想直接去景點，或離境日不想拖著行李往返機場的人。', '交件前先確認飯店名稱、入住日期與取件／送達時段，貴重物品、護照與當天會用到的藥品請隨身攜帶。', '若京都飯店不在方案服務範圍內，改用機場接送或自行寄送會更合適。'],
    area: '關西機場',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/145963-same-day-luggage-delivery-service-hotels-osaka-kansai-international-airport?cid=22312', className: 'btn primary', event: 'kyotonaratransport_luggage_delivery_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/27878-luggage-delivery-services-osaka-hotels-kansai-airport/?aid=93798', className: 'btn', event: 'kyotonaratransport_luggage_delivery_klook', platform: 'KLOOK', section: 'transport_card' },
    ],
  },
  {
    title: '關西機場 ⇄ 京都／奈良｜包車接送',
    meta: '關西機場｜親子、長輩、大件行李或深夜抵達時，直接送到住宿最省力',
    note: '包車的優點是門到門；預訂前要確認接送區域、車型、行李數、兒童座椅與航班延誤規則。',
    details: ['適合不想拖行李轉月台、同行者多或飯店離京都站較遠的情境。', '比鐵路貴，但可省下多段轉乘與行李移動；請用總人數與行李量比較。', '填寫航班與住宿地址前，先核對飯店所在行政區與司機等候規則。'],
    area: '關西機場',
    actions: [
      { label: 'KKDAY', href: 'https://www.kkday.com/zh-tw/product/129909-japan-kansai-international-airport-private-transfer-to-osaka-kyoto-nara-kobe-nagoya?cid=22312', className: 'btn primary', event: 'kyotonaratransport_charter_kkday', platform: 'KKDAY', section: 'transport_card' },
      { label: 'KLOOK', href: 'https://www.klook.com/zh-TW/activity/15716-osaka-surrounding-areas-private-charter/?aid=93798', className: 'btn', event: 'kyotonaratransport_charter_klook', platform: 'KLOOK', section: 'transport_card' },
      { label: 'Trip', href: 'https://tw.trip.com/things-to-do/detail/105009650/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16697837', className: 'btn', event: 'kyotonaratransport_charter_trip', platform: 'Trip', section: 'transport_card' },
    ],
  },
]

export default function KyotoNaraTransportPage() {
  return (
    <KyotoNaraGuidePage
      eventPrefix="kyotonaratransport"
      badge="京都奈良通訊／交通"
      title="京都奈良通訊&交通攻略｜eSIM、關西機場、市區與跨城移動"
      intro="先把網路、機場進市區與京都奈良的景點分區處理好；交通不必硬背，選對下車點就會順。"
      listTitle="京都奈良通訊／交通：依需求快速選擇"
      tabs={tabs}
      cards={cards}
      contentTitle="京都奈良自由行：通訊先準備，交通先選落點"
      faqTitle="京都奈良通訊／交通常見問題"
      faqs={[
        { q: '關西機場到京都要選 HARUKA 還是利木津巴士？', a: '先看京都住宿位置與行李。京都站附近、想少轉車可先看 HARUKA；飯店附近有巴士停靠站、同行者多或行李大時再比較利木津巴士。請以當日班次、停靠站與末班為準。' },
        { q: '京都市區可以只搭公車嗎？', a: '不建議把長距離移動全押在公車。景點門口多靠巴士，但熱門季節容易塞車或客滿；能先搭地下鐵、JR 或私鐵跨區，再轉短程巴士或步行，通常更穩。' },
        { q: '京都到大阪或奈良怎麼選車？', a: '不要只看最快車程。去京都站／大阪站先看 JR；河原町、梅田可比較阪急；祇園、伏見稻荷、宇治方向可比較京阪。去奈良也要把奈良公園與車站的步行距離算進去。' },
        { q: '京都交通一日券一定比較省嗎？', a: '不一定。先把當日實際會搭的公司與次數列出來，再核對官方票券範圍與售價；行程鬆或跨不同公司時，IC 卡往往更直覺。' },
        { q: '京都奈良自由行要選 eSIM 還是 Wi‑Fi 分享器？', a: '手機支援 eSIM、以一人或兩人移動為主時，eSIM 通常最省事。多人共用、有人手機不支援 eSIM，或需要多台裝置同時上網時，再比較 Wi‑Fi 分享器與實體 SIM 卡。' },
      ]}
    >
      <p><strong>先把網路準備好，再看景點在哪一側。</strong> 京都站、四條、烏丸御池是市區的轉乘骨幹；東山、祇園、伏見稻荷與宇治多半可把京阪或 JR 納入比較；嵐山、太秦、金閣寺則要依你的出發地拆開看。把相鄰景點排在同一天，比買很多票券更能省時間。</p>

      <h3 className="seo-h3">通訊先決定：eSIM 最省事，分享器適合多人</h3>
      <p>京都很依賴即時查乘換、巴士站與步行路線，免費 Wi‑Fi 可以當備案，卻不適合作為唯一網路。手機支援 eSIM 時，單人或雙人通常最輕鬆；不支援 eSIM 可選實體 SIM；家庭、同行者有多台裝置要共用，才比較 Wi‑Fi 分享器。無論哪種方案，都要先確認啟用時點、有效天數、熱點分享規則，以及回程是否需要歸還設備。</p>

      <h3 className="seo-h3">市區最實用的原則：地鐵／鐵路先走長段，巴士只補最後一段</h3>
      <p>京都的地下鐵只有兩條主線，無法送你到每一間寺社門口，卻能避開最難預測的市區塞車。東山、金閣寺等熱門巴士線在假日、櫻花季與楓葉季很容易滿載；此時先搭地鐵、JR 或私鐵跨區，再步行或轉一小段巴士，通常比全程等公車更可控。這也是各份京都交通指南反覆提醒的核心做法。</p>

      <h3 className="seo-h3">三個最容易選錯的京都交通情境</h3>
      <ul>
        <li><strong>清水寺：</strong>不是只有京都站公車一種走法。住河原町、祇園或從大阪東側過來時，也要比較京阪到清水五條／祇園四條後的步行與短程接駁。</li>
        <li><strong>嵐山：</strong>JR 嵯峨嵐山、阪急嵐山、嵐電嵐山是不同位置的車站；先決定要從京都站、河原町還是大阪出發，再選最少繞路的那一個。</li>
        <li><strong>大阪往返：</strong>JR、阪急與京阪各自停在不同的京都區域。車上少十分鐘，卻在抵達後多轉兩次車，整體不一定較快。</li>
      </ul>

      <h3 className="seo-h3">票券的正確順序：先排路線，最後才精算</h3>
      <p>先把一天會用到的鐵路公司、巴士與景點順序寫下來，再比較 IC 卡、京都市營地下鐵・巴士一日券或關西地區 Pass。交通票券不是越多越好，重點是是否涵蓋你當天真正會搭的路線；範圍、價格與販售規則可能調整，付款前請回到官方頁面核對。</p>
    </KyotoNaraGuidePage>
  )
}
