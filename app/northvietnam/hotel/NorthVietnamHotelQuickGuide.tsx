import HotelQuickGuide, { type HotelQuickGuideScenario } from '@/components/HotelQuickGuide'
import { northVietnamHotelCards } from '@/data/northvietnam'

const stayScenarios: HotelQuickGuideScenario[] = [
  {
    id: 'sapa-mountains',
    label: '沙壩山景／健行雲海',
    area: '沙壩',
    tabValue: '沙壩',
    summary: '把山景、番西邦與梯田行程放在主軸，建議至少住兩晚降低長途移動壓力。',
    note: '山景會受霧氣與天候影響；離市區較遠的度假村也要確認接駁與晚餐安排。',
    hotels: [
      { title: '沙壩穹頂飯店 - 美憬閣系列', reason: '建築設計、泳池與市區住宿體驗完整' },
      { title: '帕歐沙壩休閒酒店', reason: '山谷陽台景觀與度假感較突出' },
      { title: '沙壩地平線飯店', reason: '市區機能、寬敞房間與山景兼顧' },
    ],
  },
  {
    id: 'hanoi-base',
    label: '河內老城／北越交通基地',
    area: '河內',
    tabValue: '河內',
    summary: '適合安排抵達與離開住宿，老城區步行景點多、前往其他北越地區也方便。',
    note: '老城區街道熱鬧且房型差異大；怕吵或行李多時，要確認隔音與車輛停靠位置。',
    hotels: [
      { title: '橄欖石豪華精品飯店', reason: '老城區、設計感與高空設施兼顧' },
      { title: '河內索拉里亞飯店', reason: '位置方便，乾淨舒適且較容易安排' },
      { title: '河內拉耶思塔杭碧高級飯店', reason: '近還劍湖，精品質感與頂樓酒吧' },
    ],
  },
  {
    id: 'ninh-binh-slow-trip',
    label: '寧平過夜／田野慢遊',
    area: '陸龍灣（寧平）',
    tabValue: '陸龍灣',
    summary: '不想從河內當天往返，住一晚能放慢節奏並安排清晨或傍晚的陸龍灣。',
    note: '住宿與餐廳較分散；訂房前要確認接送、租車方式與隔天返回河內的交通。',
    hotels: [
      { title: '三谷艾美度假村', reason: '想住度假村並兼顧完整住宿體驗' },
      { title: 'La Sen Village', reason: '偏好村落型住宿與較慢的旅行步調' },
      { title: 'Tam Coc Wonderland Lodge', reason: '想找小型 Lodge，並優先比較 Agoda' },
    ],
  },
]

export default function NorthVietnamHotelQuickGuide() {
  return (
    <HotelQuickGuide
      scenarios={stayScenarios}
      cards={northVietnamHotelCards}
      eventPrefix="northvietnamhotel"
      badge="30 秒住宿決策"
      title="先選停留地點，再看適合飯店"
      description="北越不是住同一區就能跑完。先決定沙壩、河內或寧平的停留需求，再比較對應住宿。"
    />
  )
}
