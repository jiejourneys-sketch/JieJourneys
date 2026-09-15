import type { CityCard } from '@/components/CityTabbedList'
import KyotoNaraGuidePage from '@/components/KyotoNaraGuidePage'

const agodaHotelUrl = (id: number) => `https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=${id}`
const tripHotelUrl = (path: string) => `https://tw.trip.com${path}?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16704417`

const tabs = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: '京都車站', label: '京都車站', dataArea: '京都車站' },
  { value: '河原町・祇園', label: '河原町・祇園', dataArea: '河原町・祇園' },
  { value: '烏丸・市中心', label: '烏丸・市中心', dataArea: '烏丸・市中心' },
]

const cards: CityCard[] = [
  {
    title: '京都比偲奇飯店',
    meta: '京都車站｜八條口步行約2分鐘・大浴場與三溫暖',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: '京都比偲奇飯店 Hotel Vischio Kyoto',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/minami-ward-hotel-detail-25098068/hotel-vischio-kyoto-by-granvia/'), className: 'btn primary', event: 'kyotonarahotel_vischio_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(5848579), className: 'btn', event: 'kyotonarahotel_vischio_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/M7vTeQzRRAqkwah48', className: 'btn', event: 'kyotonarahotel_vischio_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: '三井花園飯店京都站前',
    meta: '京都車站｜中央口步行約3分鐘・日式質感與三人房',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: '三井花園飯店京都站前 Mitsui Garden Hotel Kyoto Station',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-29571980/mitsui-garden-hotel-kyoto-station/'), className: 'btn primary', event: 'kyotonarahotel_mitsui_station_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(6383119), className: 'btn', event: 'kyotonarahotel_mitsui_station_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/3WXDDM6FD9na3Sr96', className: 'btn', event: 'kyotonarahotel_mitsui_station_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'THE THOUSAND KYOTO',
    meta: '京都車站｜中央口東側步行約2分鐘・高級質感旅宿',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: 'THE THOUSAND KYOTO',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-25658991/the-thousand-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_thousand_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(5583852), className: 'btn', event: 'kyotonarahotel_thousand_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/54kC6B1eKHNM6i4j9', className: 'btn', event: 'kyotonarahotel_thousand_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: '京都格蘭比亞大酒店',
    meta: '京都車站｜車站直結・新幹線與機場交通最省力',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: '京都格蘭比亞大酒店 Hotel Granvia Kyoto',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-993497/hotel-granvia-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_granvia_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(81775), className: 'btn', event: 'kyotonarahotel_granvia_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/9nk9TY1FSwHxF3fZ6', className: 'btn', event: 'kyotonarahotel_granvia_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'GOOD NATURE HOTEL KYOTO',
    meta: '河原町・祇園｜河原町站步行約2分鐘・高島屋與祇園步行圈',
    area: '河原町・祇園',
    datasetKey: 'hotel',
    datasetValue: 'GOOD NATURE HOTEL KYOTO',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-38451751/good-nature-hotel-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_goodnature_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(7491188), className: 'btn', event: 'kyotonarahotel_goodnature_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/MEpSDDpgEDXcbzze8', className: 'btn', event: 'kyotonarahotel_goodnature_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'Richmond Hotel Premier 京都四條',
    meta: '烏丸・市中心｜四條烏丸站步行約7分鐘・Life超市樓下',
    area: '烏丸・市中心',
    datasetKey: 'hotel',
    datasetValue: 'Richmond Hotel Premier Kyoto Shijo',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-86134094/richmond-hotel-kyoto-shijo/'), className: 'btn primary', event: 'kyotonarahotel_richmond_shijo_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(28048081), className: 'btn', event: 'kyotonarahotel_richmond_shijo_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/GkBqr3V4iQDCyh4r9', className: 'btn', event: 'kyotonarahotel_richmond_shijo_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'MIMARU 京都站',
    meta: '京都車站｜八條東口步行約2分鐘・公寓式房型，適合家庭與多人同行',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: 'MIMARU Kyoto Station',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-40694354/mimaru-kyoto-station/'), className: 'btn primary', event: 'kyotonarahotel_mimaru_station_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(6992283), className: 'btn', event: 'kyotonarahotel_mimaru_station_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/oUJ1mh8LaPPpRytY6', className: 'btn', event: 'kyotonarahotel_mimaru_station_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: '麗嘉 GRAN 京都',
    meta: '京都車站｜八條東口步行約3分鐘・住客酒廊與大浴場，兼顧設計與便利',
    area: '京都車站',
    datasetKey: 'hotel',
    datasetValue: 'Rihga Gran Kyoto',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-49506293/rihga-gran-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_rihga_gran_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(9083661), className: 'btn', event: 'kyotonarahotel_rihga_gran_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/VTf7Lx3AUR8Trb9L7', className: 'btn', event: 'kyotonarahotel_rihga_gran_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'THE GATE HOTEL 京都高瀨川 by HULIC',
    meta: '河原町・祇園｜河原町站步行約3分鐘・高瀨川河畔、Blue Bottle與景觀酒廊',
    area: '河原町・祇園',
    datasetKey: 'hotel',
    datasetValue: 'THE GATE HOTEL KYOTO TAKASEGAWA by HULIC',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-58272526/the-gate-hotel-kyoto-takasegawa-by-hulic/'), className: 'btn primary', event: 'kyotonarahotel_gate_takasegawa_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(13540627), className: 'btn', event: 'kyotonarahotel_gate_takasegawa_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/LHTARmiDThhjR5qv6', className: 'btn', event: 'kyotonarahotel_gate_takasegawa_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'Hotel Kanra Kyoto',
    meta: '烏丸・市中心｜五條站步行約1分鐘・町家風設計與檜木浴缸',
    area: '烏丸・市中心',
    datasetKey: 'hotel',
    datasetValue: 'Hotel Kanra Kyoto',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-706115/hotel-kanra-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_kanra_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(200531), className: 'btn', event: 'kyotonarahotel_kanra_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/GbmdtyMHaZhG8F7z9', className: 'btn', event: 'kyotonarahotel_kanra_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'HOTEL THE CELESTINE 京都祇園',
    meta: '河原町・祇園｜近建仁寺與花見小路・京都站接駁與寬敞客房',
    area: '河原町・祇園',
    datasetKey: 'hotel',
    datasetValue: 'HOTEL THE CELESTINE KYOTO GION',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-7045649/hotel-the-celestine-kyoto-gion/'), className: 'btn primary', event: 'kyotonarahotel_celestine_gion_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(2063510), className: 'btn', event: 'kyotonarahotel_celestine_gion_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/M6aJyMGDEtWBTJrR8', className: 'btn', event: 'kyotonarahotel_celestine_gion_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'Ace Hotel Kyoto',
    meta: '烏丸・市中心｜烏丸御池站直結・新風館內，適合設計與咖啡愛好者',
    area: '烏丸・市中心',
    datasetKey: 'hotel',
    datasetValue: 'Ace Hotel Kyoto',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-58071089/ace-hotel-kyoto/'), className: 'btn primary', event: 'kyotonarahotel_ace_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(13482279), className: 'btn', event: 'kyotonarahotel_ace_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/pTKXECEwnGZyLfZP7', className: 'btn', event: 'kyotonarahotel_ace_map', platform: 'map', section: 'hotel_card' },
    ],
  },
  {
    title: 'HOTEL THE MITSUI KYOTO',
    meta: '烏丸・市中心｜二條城對面・庭園、天然溫泉與紀念日級住宿體驗',
    area: '烏丸・市中心',
    datasetKey: 'hotel',
    datasetValue: 'HOTEL THE MITSUI KYOTO, a Luxury Collection Hotel & Spa',
    actions: [
      { label: 'Trip', href: tripHotelUrl('/hotels/kyoto-hotel-detail-67048200/hotel-the-mitsui-kyoto-a-luxury-collection-hotel-spa/'), className: 'btn primary', event: 'kyotonarahotel_mitsui_luxury_trip', platform: 'Trip', section: 'hotel_card' },
      { label: 'Agoda', href: agodaHotelUrl(17526170), className: 'btn', event: 'kyotonarahotel_mitsui_luxury_agoda', platform: 'Agoda', section: 'hotel_card' },
      { label: '地圖', href: 'https://maps.app.goo.gl/sCo98AEfi3L6nXDk9', className: 'btn', event: 'kyotonarahotel_mitsui_luxury_map', platform: 'map', section: 'hotel_card' },
    ],
  },
]

export default function KyotoNaraHotelPage() {
  return (
    <KyotoNaraGuidePage
      eventPrefix="kyotonarahotel"
      badge="住宿"
      title="京都住宿推薦｜京都站、河原町、祇園與烏丸怎麼選？"
      intro="第一次京都自由行住京都車站最省轉車；想逛街吃美食、走祇園與清水寺選河原町・祇園；想住市中心的設計旅宿或安靜一點的街區，選烏丸・市中心。"
      listTitle="京都住宿推薦"
      tabs={tabs}
      cards={cards}
      contentTitle="京都住哪裡最好？先用行程回答"
      faqTitle="京都住宿常見問題"
      faqs={[
        { q: '第一次去京都住哪裡最方便？', a: '京都站最省力。新幹線、JR、地下鐵、市巴士與往大阪、奈良的路線集中，尤其適合抵達日、離開日、親子或帶大行李旅行。' },
        { q: '想逛錦市場、祇園與河原町，住哪裡最好？', a: '選河原町・祇園。這區餐廳、百貨、商店街密集，走路可到鴨川、錦市場與祇園；但假日與旺季的人潮也比較多。' },
        { q: '親子或多人同行住哪裡比較方便？', a: '先找京都站附近的公寓式或家庭房。MIMARU 京都站有廚房與用餐空間，能減少在小房間開行李、買早餐與洗衣的壓力；但熱門日期要提早確認人數、床型與取消條件。' },
        { q: '想住有設計感、又不想每天擠在河原町，選哪一區？', a: '選烏丸・市中心。這區到京都站、錦市場與市中心都方便，晚上相對安靜；想要町家感可看五條的 Hotel Kanra，喜歡建築與選物店可看烏丸御池的 Ace Hotel Kyoto。' },
        { q: '京都要每天換飯店嗎？', a: '通常不用。住三晚以內固定一間最省力；只有同時安排嵐山、京都市區與京都北部，或想住一晚溫泉旅館時，才值得換住宿。' },
        { q: '京都訂房要注意什麼？', a: '先確認房間面積、床型、人數與取消規則；櫻花季、楓葉季、黃金週與祇園祭期間，熱門區域建議提早訂並選可免費取消的方案。' },
      ]}
    >
      <p><strong>下方說明與上方卡片、旅杰地圖採用同一份 13 間住宿與三個分區。</strong> 行李多、會去大阪奈良、搭新幹線或 Haruka，就住京都車站；想晚上逛街吃飯、白天走祇園與錦市場，選河原町・祇園；重視市中心交通、設計感或靜一點的夜晚，選烏丸・市中心。</p>
      <h3 className="seo-h3">京都車站｜6 間，第一次自由行與跨城市移動首選</h3>
      <p>京都站集合新幹線、JR、近鐵、地下鐵與市內巴士，往大阪、奈良、宇治或關西機場都好安排。重視大浴場可看京都比偲奇飯店；想要日式質感與三人房可看三井花園飯店京都站前；想升級住宿體驗則看 THE THOUSAND KYOTO 或京都格蘭比亞大酒店。</p>
      <p>親子、三代同行或想在房內簡單料理，優先看 MIMARU 京都站的公寓式房型；想要車站附近的設計感、住客酒廊與大浴場，麗嘉 GRAN 京都會是很平衡的選擇。</p>
      <h3 className="seo-h3">河原町・祇園｜3 間，逛街、美食與傳統街區散步</h3>
      <p>GOOD NATURE HOTEL KYOTO 靠近河原町站與高島屋，往祇園、錦市場都順；想住在高瀨川旁、下樓就是購物與咖啡店，選 THE GATE HOTEL 京都高瀨川 by HULIC；想把建仁寺、花見小路與清水寺的清晨散步放進行程，HOTEL THE CELESTINE 京都祇園更合適。</p>
      <h3 className="seo-h3">烏丸・市中心｜4 間，交通便利、設計感與安靜夜晚</h3>
      <p>Richmond Hotel Premier 京都四條位於四條烏丸生活圈，適合想有超市與交通機能的人；Hotel Kanra Kyoto 適合想體驗現代町家設計、檜木浴缸與慢步調的人；Ace Hotel Kyoto 位於新風館與烏丸御池站旁，適合喜歡建築、咖啡與選物店的旅客。若把紀念日與飯店本身當作行程，二條城對面的 HOTEL THE MITSUI KYOTO 更適合安排一晚好好待在館內。</p>
      <h3 className="seo-h3">訂京都飯店前，先確認這四件事</h3>
      <ul>
        <li>確認飯店靠近京都站中央口或八條口，兩側的交通與晚間機能不同。</li>
        <li>日本房型面積差異很大；兩個大行李箱、三人入住或親子出遊，先看床型與平方公尺。</li>
        <li>若早上要去清水寺、嵐山或京都北部，請把第一班公車、電車與集合點時間一起算進去。</li>
        <li>旺季優先選可取消方案；房價、住宿稅與早餐條件請以訂房頁最新資訊為準。</li>
      </ul>
    </KyotoNaraGuidePage>
  )
}
