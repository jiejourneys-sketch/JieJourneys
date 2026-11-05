import type { MapPlace } from '@/lib/mapPlace'

export const WINTER_GUIDE_PATH = '/japan/winter-illuminations-2026'
export const WINTER_GUIDE_PUBLISHED_AT = '2026-11-02'
export const WINTER_GUIDE_CHECKED_AT = '2026-11-05'

export const winterRegions = [
  { id: 'tokyo', name: '東京・近郊', note: '東京聖誕市集・六本木・晴空塔', center: { lat: 35.668, lng: 139.746 } },
  { id: 'yokohama', name: '橫濱', note: '紅磚倉庫聖誕市集', center: { lat: 35.4528, lng: 139.6428 } },
  { id: 'osaka', name: '大阪', note: '天王寺・梅田・御堂筋・USJ', center: { lat: 34.691, lng: 135.502 } },
  { id: 'kobe', name: '神戶', note: '布引香草園古城聖誕市集', center: { lat: 34.7074, lng: 135.1937 } },
  { id: 'mie', name: '名古屋・三重', note: '久屋大通市集・名花之里', center: { lat: 35.125, lng: 136.81 } },
  { id: 'sapporo', name: '札幌', note: '慕尼黑聖誕市集・大通公園', center: { lat: 43.061, lng: 141.3543 } },
  { id: 'fukuoka', name: '福岡', note: '博多・天神聖誕市集', center: { lat: 33.59, lng: 130.411 } },
  { id: 'nagasaki', name: '長崎', note: '豪斯登堡・留一天慢慢玩', center: { lat: 33.086, lng: 129.788 } },
] as const

export type WinterRegionId = (typeof winterRegions)[number]['id']
export type WinterPeriod = { label: string; start: string; end: string }
export type WinterEvent = {
  id: string
  region: WinterRegionId
  name: string
  shortName: string
  kind: string
  venue: string
  position: { lat: number; lng: number }
  mapQuery: string
  periods: WinterPeriod[]
  scheduleStatus?: 'pending'
  ticketRequired?: boolean
  closedDates?: string[]
  hours: string
  fee: string
  booking: string
  access: string
  highlights: string[]
  caution: string
  sources: { label: string; url: string }[]
  videos?: { label: string; url: string }[]
}

// Dates are Japan local calendar dates. All public surfaces read this same
// registry; a future approved update can change facts without rewriting JSX.
// Coordinates denote a principal venue or walking starting point, not a full
// event boundary. Maps links resolve the named venue for navigation.
const existingWinterEvents: WinterEvent[] = [
  {
    id: 'roppongi-keyakizaka', region: 'tokyo', name: '六本木之丘｜德式聖誕市集與櫸坂點燈', shortName: '六本木之丘聖誕市集・點燈', kind: '聖誕市集／街道點燈',
    venue: '六本木之丘・大屋根廣場與櫸坂通', position: { lat: 35.6592465, lng: 139.7299422 }, mapQuery: '六本木ヒルズ 大屋根プラザ',
    periods: [{ label: '德式聖誕市集', start: '2026-11-21', end: '2026-12-25' }, { label: '櫸坂點燈', start: '2026-11-05', end: '2026-12-25' }],
    hours: '市集 11:00～21:00；櫸坂點燈 17:00～22:00，點燈首日及人潮擁擠時可能調整。',
    fee: '市集入場與街道燈飾免費；餐飲、購物另計。', booking: '一般入場不需預約。', access: '六本木站，先逛六本木之丘大屋根廣場，再步行前往櫸坂通。',
    highlights: ['先逛德式木屋攤位、吃點熱食，再到櫸坂拍藍白燈海與東京鐵塔，是六本木經典的耶誕路線。', '11/26～12/25 可接東京中城；市集比櫸坂點燈晚開始。'],
    caution: '11/5～11/20 只有櫸坂點燈，市集尚未開始；櫸坂拍照請留在人行道。地圖標記在櫸坂通附近。',
    sources: [{ label: '六本木之丘｜2026 聖誕市集', url: 'https://www.roppongihills.com/sp/christmashills/101/' }, { label: '六本木之丘｜櫸坂通點燈', url: 'https://www.roppongihills.com/sp/christmashills/102/' }],
    videos: [{ label: '旅杰 IG｜六本木點燈路線', url: 'https://www.instagram.com/reel/DSfemOTEqbL/' }, { label: '旅杰 YouTube｜六本木點燈', url: 'https://www.youtube.com/shorts/yZ8eH_jOKYM' }],
  },
  {
    id: 'tokyo-midtown', region: 'tokyo', name: '東京中城（Tokyo Midtown）｜庭園燈飾與聖誕樹', shortName: '東京中城', kind: '庭園點燈',
    venue: '東京中城・中城花園', position: { lat: 35.6664, lng: 139.731 }, mapQuery: '東京ミッドタウン ミッドタウンガーデン',
    periods: [{ label: '聖誕燈光演出、聖誕樹', start: '2026-11-26', end: '2026-12-25' }, { label: '光之散步道', start: '2026-11-26', end: '2027-02-23' }],
    hours: '庭園點燈 17:00～23:00；其他活動依各自公告。', fee: '庭園燈飾免費；溜冰、餐飲及休憩區消費另計。', booking: '燈飾觀賞不需預約；付費體驗另依官方規則。', access: '六本木站、乃木坂站，前往東京中城庭園。',
    highlights: ['聖誕樹、庭園燈飾和泡泡演出適合一起安排，還能接六本木之丘散步。', '泡泡演出只到 12/20；聖誕活動到 12/25，光之散步道則持續至隔年 2/23。'],
    caution: '12/26 後僅有部分冬季燈飾延續，聖誕演出與聖誕樹已結束。',
    sources: [{ label: '東京中城｜聖誕活動公告', url: 'https://www.tokyo-midtown.com/jp/news/8186/' }, { label: '官方新聞稿｜各項活動日期與時間', url: 'https://www.tokyo-midtown.com/jp/news/upload/pressrelease_261007.pdf' }],
  },
  {
    id: 'yebisu-garden-place', region: 'tokyo', name: '惠比壽花園廣場｜Baccarat 水晶吊燈', shortName: '惠比壽花園廣場', kind: '廣場燈飾',
    venue: '惠比壽花園廣場・中央廣場', position: { lat: 35.6424892, lng: 139.7138345 }, mapQuery: '恵比寿ガーデンプレイス センター広場',
    periods: [{ label: 'Baccarat ETERNAL LIGHTS', start: '2026-11-14', end: '2027-01-11' }],
    hours: '水晶吊燈 11:00～23:00；11/14 預定 17:00 點燈。', fee: '廣場免費觀賞；餐飲、購物另計。', booking: '廣場觀賞不需預約。', access: '惠比壽站，沿惠比壽花園廣場指標與步行通道前往。',
    highlights: ['以大型 Baccarat 水晶吊燈為主角，適合晚餐後散步、拍廣場夜景。', '水晶吊燈會展示至隔年 1 月；周邊聖誕市集的日期須另外確認。'],
    caution: '首日點燈時間與平常不同；周邊活動請分別核對。',
    sources: [{ label: '惠比壽花園廣場｜Baccarat 2026', url: 'https://event.gardenplace.jp/special/2026baccarat/' }],
    videos: [{ label: '旅杰 IG｜惠比壽點燈路線', url: 'https://www.instagram.com/reel/DShsI6gEa8u/' }, { label: '旅杰 YouTube｜惠比壽點燈', url: 'https://www.youtube.com/shorts/I6VfBsc9YJE' }],
  },
  {
    id: 'marunouchi', region: 'tokyo', name: '丸之內｜香檳金燈海與冬季街區', shortName: '丸之內仲通', kind: '街道點燈／市集',
    venue: '丸之內仲通・行幸通周邊', position: { lat: 35.6801, lng: 139.7628 }, mapQuery: '丸の内仲通り 丸ビル',
    periods: [{ label: '丸之內仲通點燈', start: '2026-11-12', end: '2027-02-14' }, { label: '行幸通燈飾與市集', start: '2026-11-27', end: '2026-12-25' }],
    hours: '仲通 16:00～23:00；12 月延長至 24:00。首日時間可能不同；市集時段另看官方。', fee: '街道燈飾免費；市集餐飲、購物另計。', booking: '一般街道觀賞不用預約。', access: '東京站丸之內側、有樂町站周邊；依想走的街段選起點。',
    highlights: ['適合把東京站夜景、丸之內購物與晚餐排在同一晚。', '聖誕市集與跨年後燈海分成兩段日期，12/25 後仍有仲通點燈。', '建議挑一段街區慢走，保留拍照、取暖與逛店時間。'],
    caution: '行幸通與仲通並非全部同日開放市集；不要把整段點燈期間當成每天都有攤位。',
    sources: [{ label: '丸之內｜BRIGHT HOLIDAY 官方活動頁', url: 'https://www.marunouchi.com/lp/brightholiday2026/' }],
  },
  {
    id: 'midosuji', region: 'osaka', name: '大阪御堂筋｜市區光之大道', shortName: '御堂筋點燈', kind: '街道點燈',
    venue: '御堂筋・阪神前路口至難波西口路口', position: { lat: 34.6922, lng: 135.5018 }, mapQuery: '御堂筋 淀屋橋交差点',
    periods: [{ label: '御堂筋點燈', start: '2026-11-03', end: '2026-12-31' }],
    hours: '約 17:00～隔日 01:00。', fee: '沿街燈飾免費觀賞；餐飲、購物另計。', booking: '街道觀賞不需預約。', access: '梅田、淀屋橋、心齋橋或難波站，選靠近行程的一段步行。',
    highlights: ['不用為看燈飾特別跨城市，適合接在大阪購物與晚餐後。', '全線約 4 公里，選住宿或行程附近的街段即可，不必整條走完。', '12/11～12/25 可接中之島活動，從淀屋橋周邊安排較順。'],
    caution: '燈飾在公共道路旁，拍照與過馬路請以人行道、號誌和現場管制為準。',
    sources: [{ label: '大阪光之饗宴｜御堂筋 2026', url: 'https://www.hikari-kyoen.com/en/core/midosuji/' }],
  },
  {
    id: 'nakanoshima', region: 'osaka', name: '大阪中之島｜光之文藝復興', shortName: '中之島光之文藝復興', kind: '光影展演／市集',
    venue: '大阪市政府至中之島公園・大阪市中央公會堂周邊', position: { lat: 34.6937, lng: 135.5038 }, mapQuery: '大阪市中央公会堂',
    periods: [{ label: 'OSAKA Light Renaissance', start: '2026-12-11', end: '2026-12-25' }],
    hours: '中央公會堂光雕投影 17:30～21:30，最後一場預定 21:20；其他展區、市集另有營業時間。', fee: '戶外燈飾與展演可自由觀賞；餐飲、購物與個別體驗另計。', booking: '戶外觀賞依現場動線；個別項目請看官方公告。', access: '淀屋橋站、北濱站，步行前往大阪市中央公會堂與中之島公園。',
    highlights: ['以河岸與歷史建築的光影為重點，想看投影請先抓中央公會堂場次。', '可與御堂筋淀屋橋一帶串成同一晚，不必再繞回梅田走完全線。', '市集與部分河岸燈飾有自己的營業時段，請逐項核對。'],
    caution: '強風、豪雨時可能取消部分活動；光雕投影與街道燈飾的結束時間不同。',
    sources: [{ label: '大阪光之饗宴｜中之島 2026', url: 'https://www.hikari-kyoen.com/en/core/renaissance/' }],
  },
  {
    id: 'hakata-market', region: 'fukuoka', name: '福岡博多站｜Christmas Advent', shortName: '博多站聖誕市集', kind: '聖誕市集',
    venue: 'JR 博多站前廣場', position: { lat: 33.5898, lng: 130.4198 }, mapQuery: 'JR博多駅前広場',
    periods: [{ label: '博多站聖誕市集', start: '2026-11-07', end: '2026-12-25' }],
    hours: '平日 16:00～23:00、週末及假日 12:00～23:00，最後點餐 22:45；11/7 為 16:00 起，12/24、12/25 為 12:00 起。',
    fee: '入場免費；餐飲、商品與紀念杯另計。', booking: '一般市集入場不用預約。', access: 'JR、地下鐵博多站；往博多口站前廣場。',
    highlights: ['抵達福岡、晚餐後或回飯店前都容易順路安排。', '想逛攤位要看市集營業時間，不只看站前燈飾是否亮著。', '若再去天神，搭地鐵串聯，保留各場地的用餐與拍照時間。'],
    caution: '這裡列的是博多站前市集；其他福岡聖誕活動會場的日期與營業時間不同。',
    sources: [{ label: 'Christmas Advent｜博多站會場', url: 'https://christmas-advent.jp/fukuoka-hakata/' }],
  },
  {
    id: 'tenjin-market', region: 'fukuoka', name: '福岡天神｜Christmas Advent', shortName: '天神聖誕市集', kind: '聖誕市集',
    venue: '福岡市政府西側交流廣場', position: { lat: 33.5901, lng: 130.4018 }, mapQuery: '福岡市役所西側ふれあい広場',
    periods: [{ label: '天神聖誕市集', start: '2026-11-14', end: '2026-12-26' }], closedDates: ['2026-11-28', '2026-11-29'],
    hours: '平日 17:00～23:00、週末及假日 12:00～23:00，最後點餐 22:45；11/21 提前至 21:30 結束，12/24、12/25 為 12:00 起。',
    fee: '入場與現場演出免費；餐飲、商品另計。', booking: '市集入場不需預約；請勿占位。', access: '天神站、天神南站或西鐵福岡（天神）站，往福岡市政府西側。',
    highlights: ['適合接天神購物或晚餐，與博多場地有不同的街區氣氛。', '11/28、11/29 休業；11/14、11/15 與其他活動共同舉辦。', '天神到 12/26，與博多站的 12/25 結束日不同。'],
    caution: '11/28、11/29 休息，不要只看活動起訖日就安排這兩天前往。',
    sources: [{ label: 'Christmas Advent｜天神會場與休業日', url: 'https://christmas-advent.jp/fukuoka-tenjin/' }],
  },
  {
    id: 'nabana-no-sato', region: 'mie', name: '名花之里｜冬季燈海', shortName: '名花之里', kind: '大型燈海', ticketRequired: true,
    venue: '三重縣桑名市・名花之里', position: { lat: 35.0805012, lng: 136.7033738 }, mapQuery: 'なばなの里 三重県桑名市',
    periods: [{ label: '2026–2027 燈飾季', start: '2026-10-17', end: '2027-05-31' }], closedDates: ['2027-01-06', '2027-01-07'],
    hours: '日落後觀賞燈飾；閉園時間依日期不同，請看官方營業日曆。', fee: '需購票入園，價格與票券內容依日期而異。', booking: '官網提醒事前購票；12/23～12/25 需另購限量、指定日期專用票。', access: '名古屋周邊行程另排交通；燈飾期間可由近鐵長島站轉接駁巴士，先查末班時間。',
    highlights: ['適合願意為燈海安排一個下午到晚上的旅客。', '燈飾季跨到隔年春天，不是只有聖誕節前能去。', '先確認票券、休園日與回程交通，再決定是否和長島周邊景點同一天安排。'],
    caution: '2027/1/6、1/7 休園；12/23～12/25 的特殊購票規則不能套用一般日期票券。',
    sources: [{ label: '名花之里｜本季日期與指定日購票', url: 'https://www.nagashima-onsen.co.jp/nabana/illumination/index.html' }, { label: '官方交通｜依季節選路線', url: 'https://www.nagashima-onsen.co.jp/nabana/access/index.html' }],
  },
  {
    id: 'huis-ten-bosch', region: 'nagasaki', name: '豪斯登堡｜歐風聖誕與冬季燈飾', shortName: '豪斯登堡', kind: '主題樂園／冬季燈飾', ticketRequired: true,
    venue: '長崎縣佐世保市・豪斯登堡', position: { lat: 33.086, lng: 129.788 }, mapQuery: 'ハウステンボス 長崎県佐世保市',
    periods: [{ label: '聖誕活動', start: '2026-11-06', end: '2026-12-25' }, { label: 'The Starlight Million', start: '2026-11-06', end: '2027-02-25' }],
    hours: '點燈與各項表演依當日節目表，入園時間與閉園時間另看營業日曆。', fee: '需購票入園；票種、日期、年齡及加購體驗會影響費用。', booking: '先確認當日入園票；餐廳、住宿與特別體驗可能另需預約。', access: 'JR 豪斯登堡站；從福岡或長崎出發都要另外保留交通與回程時間。',
    highlights: ['適合把主題園區、聖誕氣氛與夜間燈飾放在同一天慢慢玩。', '聖誕活動到 12/25；冬季燈飾另有延續期間，不把兩者當成同一套節目。', '從福岡出發請另留一天或安排住宿，不當成博多晚餐後的順遊點。'],
    caution: '入園票不等於所有體驗都包含；表演、住宿與特殊活動請逐項確認。',
    sources: [{ label: '豪斯登堡｜2026 聖誕活動', url: 'https://www.huistenbosch.co.jp/event/xmas/2026/' }, { label: '官方 FAQ｜聖誕舉辦期間', url: 'https://faq.huistenbosch.co.jp/クリスマスイベントはいつから始まりますか？-69ed75c73bdb5b2d2f59eacf' }],
  },
]

const additionalWinterEvents: WinterEvent[] = [
  {
    id: 'tokyo-christmas-toyosu', region: 'tokyo', name: '東京聖誕市集・新豐洲｜2026 水岸新會場', shortName: '東京聖誕市集・新豐洲', kind: '聖誕市集', ticketRequired: true,
    venue: '東京都江東區豐洲 6-4', position: { lat: 35.6482191, lng: 139.7850184 }, mapQuery: '東京都江東区豊洲6丁目4 東京クリスマスマーケット2026',
    periods: [{ label: '新豐洲會場', start: '2026-11-20', end: '2026-12-25' }],
    hours: '11:00～21:30；11/20 首日 16:00 開始。最後入場 20:30、最後點餐 21:00。',
    fee: '成人平日 1,000 日圓、週末及日本國定假日 1,500 日圓；12/24、12/25 為 2,000 日圓。餐飲、商品另計。',
    booking: '依會場與入場日期選票，售票方式與票券內容以官方公告為準。', access: '百合海鷗線新豐洲站步行約 2 分鐘，或市場前站約 3 分鐘。',
    highlights: ['想逛大型東京聖誕市集，可先看今年的新豐洲會場。木屋攤位、水岸空間與熱食，適合另留一個晚上慢慢逛。', '可搭配豐洲周邊行程；與芝公園會場分開看日期和交通。'],
    caution: '2026 會場已改變，請依新豐洲地址前往，不要沿用明治神宮外苑的舊地圖。',
    sources: [{ label: '東京聖誕市集｜2026 兩會場公告', url: 'https://tokyochristmas.net/news_976/' }, { label: '官方票價與入場 FAQ', url: 'https://tokyochristmas.net/contact/' }, { label: '官方交通與會場地圖', url: 'https://tokyochristmas.net/access/' }],
  },
  {
    id: 'tokyo-christmas-shiba', region: 'tokyo', name: '東京聖誕市集・芝公園｜東京鐵塔與耶誕金字塔', shortName: '東京聖誕市集・芝公園', kind: '聖誕市集', ticketRequired: true,
    venue: '東京都立芝公園 4 號地・御成門站前廣場', position: { lat: 35.6611, lng: 139.7503 }, mapQuery: '東京クリスマスマーケット2026 芝公園 御成門駅前広場',
    periods: [{ label: '芝公園會場', start: '2026-12-04', end: '2026-12-25' }],
    hours: '11:00～22:00；12/4 首日 16:00 開始。最後入場 21:00、最後點餐 21:30。',
    fee: '成人平日 1,000 日圓、週末 1,500 日圓；12/24、12/25 為 2,000 日圓。餐飲、商品另計。',
    booking: '依會場與日期確認官方票券；新豐洲與芝公園的開始日、營業時間不同。', access: '都營三田線御成門站 A6 出口步行約 1 分鐘；也可由神谷町、大門站前往。',
    highlights: ['以東京鐵塔為背景，搭配大型耶誕金字塔與德式攤位，適合想拍東京地標和逛市集的人。', '市集 12 月才開始；11 月到東京可先選新豐洲或六本木。'],
    caution: '最近的站是御成門站，並非芝公園站；地圖請認「芝公園 4 號地」。',
    sources: [{ label: '東京聖誕市集｜芝公園會場公告', url: 'https://tokyochristmas.net/news_976/' }, { label: '官方票價與入場 FAQ', url: 'https://tokyochristmas.net/contact/' }, { label: '官方交通與會場地圖', url: 'https://tokyochristmas.net/access/' }],
  },
  {
    id: 'azabudai-market', region: 'tokyo', name: '麻布台之丘聖誕市集｜中央廣場的木屋與餐飲', shortName: '麻布台之丘聖誕市集', kind: '聖誕市集',
    venue: '麻布台之丘中央廣場', position: { lat: 35.6601, lng: 139.7411 }, mapQuery: '麻布台ヒルズ 中央広場 クリスマスマーケット',
    periods: [{ label: '麻布台之丘聖誕市集', start: '2026-11-21', end: '2026-12-25' }],
    hours: '11:00～21:00。', fee: '市集入場免費；餐飲、商品另計。', booking: '一般入場不需預約；熱門攤位可能排隊。', access: '神谷町站前往麻布台之丘中央廣場；也可由六本木一丁目站步行。',
    highlights: ['想找都心裡較好搭配晚餐的市集，可以把中央廣場的耶誕裝飾、餐飲與禮物攤位一起安排。', '可與東京鐵塔周邊排在同一區，先確認各自營業時間。'],
    caution: '麻布台之丘與六本木之丘是不同會場，導航請使用麻布台中央廣場。',
    sources: [{ label: '麻布台之丘｜2026 聖誕活動', url: 'https://www.azabudai-hills.com/sp/christmashills/' }, { label: '官方市集與免費入場資訊', url: 'https://www.azabudai-hills.com/sp/christmashills/201/' }],
  },
  {
    id: 'skytree-christmas', region: 'tokyo', name: '東京晴空塔城｜童話聖誕市集與燈飾', shortName: '晴空塔聖誕市集', kind: '聖誕市集／廣場點燈',
    venue: '東京晴空塔城 4 樓 Sky Arena', position: { lat: 35.7101, lng: 139.8111 }, mapQuery: '東京スカイツリータウン スカイアリーナ',
    periods: [{ label: '童話聖誕市集與耶誕活動', start: '2026-11-05', end: '2026-12-25' }],
    hours: '市集 11:00～22:00，最後點餐 21:00；晴空塔城燈飾 16:00～23:00。',
    fee: '戶外市集與燈飾可免費入場觀賞；餐飲、商品、晴空塔展望台門票另計。', booking: '市集一般入場不需預約；想上展望台則另外確認票券。', access: '押上站或東武東京晴空塔站，前往晴空塔城 4 樓 Sky Arena。',
    highlights: ['童話風市集、耶誕造型餐飲和晴空塔可以一起安排，適合淺草、押上行程的晚上。', '可先逛 Solamachi，再去戶外市集；上塔看夜景是另外的付費行程。'],
    caution: '晴空塔城戶外燈飾與塔身特別點燈時間不同；部分冬季燈飾延續到隔年，不代表市集仍營業。',
    sources: [{ label: '晴空塔｜2026 耶誕活動公告', url: 'https://www.tokyo-skytree.jp/press/post/721/' }, { label: '官方新聞稿｜市集日期與時間', url: 'https://www.tokyo-skytree.jp/datas/files/2026/10/14/df59efa6b5758dbfeec7909458fb61c52bc2d2e1.pdf' }, { label: '東京 Solamachi｜耶誕特集', url: 'https://www.tokyo-solamachi.jp/xmas/' }],
  },
  {
    id: 'hibiya-illumination', region: 'tokyo', name: '日比谷｜Magic Time Illumination 冬季點燈', shortName: '日比谷冬季點燈', kind: '街區／庭園點燈',
    venue: '東京中城日比谷・日比谷階梯廣場與周邊', position: { lat: 35.6739, lng: 139.7594 }, mapQuery: '東京ミッドタウン日比谷 日比谷ステップ広場',
    periods: [{ label: '廣場主題耶誕樹', start: '2026-11-12', end: '2026-12-25' }, { label: '街區與庭園冬季燈飾', start: '2026-11-12', end: '2027-02-28' }],
    hours: '16:00～23:00，實際內容依區域與當日公告。', fee: '戶外燈飾免費觀賞；餐飲、購物另計。', booking: '一般戶外觀賞不需預約。', access: '日比谷站，或由有樂町站步行至東京中城日比谷。',
    highlights: ['廣場耶誕樹、日比谷仲通與高樓露台燈飾，可接在銀座購物或有樂町晚餐之後。', '部分街區燈飾延續至隔年 2 月，適合跨年後才到東京的人。'],
    caution: '廣場主題耶誕樹到 12/25，其他冬季燈飾到隔年 2/28，兩段日期請分開看。',
    sources: [{ label: '東京中城日比谷｜2026 點燈公告', url: 'https://www.hibiya.tokyo-midtown.com/jp/news/7612/' }, { label: '官方新聞稿｜各區日期與點燈時間', url: 'https://www.hibiya.tokyo-midtown.com/jp/news/upload/9f1844050096a19294d9fb356cab9a2a.pdf' }],
  },
  {
    id: 'shibuya-blue-cave', region: 'tokyo', name: '澀谷青之洞窟｜藍色燈海，2026 日程待公布', shortName: '澀谷青之洞窟', kind: '街道點燈', scheduleStatus: 'pending',
    venue: '澀谷公園通至代代木公園周邊（2026 範圍待公告）', position: { lat: 35.6669, lng: 139.6985 }, mapQuery: '代々木公園ケヤキ並木 青の洞窟', periods: [],
    hours: '2026 點燈日期、時間與會場範圍待官方公布。', fee: '2026 入場與活動規則待公告。', booking: '先收藏官方頁面，待本季公告後再排定。', access: '可先以澀谷、原宿及代代木公園一帶理解位置；確切入口等本季公告。',
    highlights: ['藍色燈海是多篇東京耶誕整理會提到的經典選擇，先收進清單，方便公告後接上澀谷行程。', '目前官方頁面仍是 2025 活動結束資訊，不能拿去年日期當成今年已確認。'],
    caution: '這一筆尚無已確認的 2026 舉辦日期；地圖位置供認識周邊區域，不代表活動已開始。',
    sources: [{ label: '青之洞窟｜官方最新公告', url: 'https://shibuya-aonodokutsu.jp/' }],
  },
  {
    id: 'tokyo-disney-christmas', region: 'tokyo', name: '東京迪士尼樂園｜Disney Christmas', shortName: '東京迪士尼樂園耶誕活動', kind: '主題樂園耶誕活動', ticketRequired: true,
    venue: '千葉縣浦安市・東京迪士尼樂園', position: { lat: 35.6328964, lng: 139.8803943 }, mapQuery: '東京ディズニーランド',
    periods: [{ label: 'Disney Christmas', start: '2026-11-11', end: '2026-12-25' }],
    hours: '園區營業時間、遊行與表演場次依當日官方日曆。', fee: '需購買指定日期的樂園門票；餐飲、商品與加購服務另計。', booking: '先確認入園日期與園區，再安排需要預約或加購的項目。', access: 'JR 舞濱站，步行前往東京迪士尼樂園入口。',
    highlights: ['想把耶誕裝飾、角色遊行和遊樂設施放在同一天，迪士尼樂園是適合留整天的選擇。', '它在千葉縣浦安市，不是東京都心逛完市集後的順路散步點。'],
    caution: '這裡列的是東京迪士尼樂園；迪士尼海洋為不同園區，購票與節目請分別確認。',
    sources: [{ label: '東京迪士尼樂園｜2026 Disney Christmas', url: 'https://www.tokyodisneyresort.jp/treasure/christmas2026/tdl/' }],
  },
  {
    id: 'yokohama-red-brick-market', region: 'yokohama', name: '橫濱紅磚倉庫聖誕市集｜港景與大型耶誕樹', shortName: '橫濱紅磚倉庫聖誕市集', kind: '聖誕市集', ticketRequired: true,
    venue: '橫濱紅磚倉庫活動廣場與紅磚公園', position: { lat: 35.4528, lng: 139.6428 }, mapQuery: '横浜赤レンガ倉庫 クリスマスマーケット',
    periods: [{ label: '紅磚倉庫聖誕市集', start: '2026-11-20', end: '2026-12-25' }],
    hours: '11/20 為 17:00～21:00；11/21～12/4 為 11:00～21:00；12/5～12/25 為 11:00～22:00。',
    fee: '主會場入場 500 日圓起，依日期與票種不同；部分周邊區域免費，餐飲、商品另計。', booking: '官方公告 11/6 日本時間 12:00 開始售票，購票時核對日期、票種與入場範圍。', access: '港未來線馬車道站、日本大通站，或由櫻木町站步行前往紅磚倉庫。',
    highlights: ['紅磚建築、港邊夜景和耶誕樹集中在一起，適合想從東京另排橫濱半日遊的人。', '可以接港未來散步與晚餐，晚上再逛市集。'],
    caution: '部分周邊免費區不等於主會場免費；首日與 12/5 起的營業時間不同。',
    sources: [{ label: '橫濱紅磚倉庫｜2026 聖誕市集', url: 'https://www.yokohama-akarenga.jp/christmas/' }],
  },
  {
    id: 'tennoji-christmas-market', region: 'osaka', name: '大阪天王寺聖誕市集｜天芝公園的耶誕木屋', shortName: '天王寺聖誕市集', kind: '聖誕市集',
    venue: '天王寺公園・天芝（TEN-SHIBA）與 TEN-SHIBA i:na', position: { lat: 34.6502, lng: 135.5084 }, mapQuery: 'てんしば クリスマスマーケット',
    periods: [{ label: '天王寺聖誕市集', start: '2026-11-20', end: '2026-12-25' }],
    hours: '11/20 為 16:00～21:00；11/21～12/18 為 11:00～21:00；12/19～12/25 為 11:00～21:30。',
    fee: '入場免費；餐飲、商品與個別體驗另計。', booking: '市集一般入場不需預約；工作坊等體驗另依官方規則。', access: 'JR、地下鐵天王寺站，或近鐵大阪阿部野橋站，步行至天王寺公園。',
    highlights: ['交通容易接上天王寺購物、阿倍野或新世界行程，想在大阪逛耶誕木屋市集可優先看這裡。', '公園型會場適合放慢腳步逛攤位，不必為了市集跨到其他城市。'],
    caution: '首日較晚開始，最後一週延長至 21:30；荒天可能中止。',
    sources: [{ label: '天王寺聖誕市集｜2026 官方網站', url: 'https://osaka-christmasmarket.com/' }],
  },
  {
    id: 'umeda-christmas-market', region: 'osaka', name: '梅田藍天大廈｜Wonder Christmas Marche', shortName: '梅田藍天大廈聖誕市集', kind: '聖誕市集／耶誕樹',
    venue: '新梅田 City・梅田藍天大廈 1 樓 Wonder Square', position: { lat: 34.7053, lng: 135.4899 }, mapQuery: '梅田スカイビル ワンダースクエア',
    periods: [{ label: '梅田藍天大廈耶誕活動', start: '2026-11-13', end: '2026-12-25' }],
    hours: '市集 12:00～22:00，最後點餐 21:30；耶誕樹 12:00～23:00，音樂燈光演出另有場次。',
    fee: '地面廣場免費入場；市集消費與空中庭園展望台門票另計。', booking: '一般廣場入場不需預約；展望台及特別方案另確認。', access: 'JR 大阪站、梅田站一帶，步行前往梅田藍天大廈。',
    highlights: ['大型耶誕樹與廣場市集可以接在梅田購物之後，想再看大阪夜景也能另排空中庭園。', '2026 的市集名稱為 Wonder Christmas Marche，以本季活動內容為準。'],
    caution: '市集、樹燈光演出與展望台是不同時段或收費項目，不要只看大廈總營業時間。',
    sources: [{ label: '梅田藍天大廈｜2026 耶誕活動', url: 'https://www.skybldg.co.jp/event/xmas/' }],
  },
  {
    id: 'usj-christmas', region: 'osaka', name: '日本環球影城 USJ｜冬季耶誕燈光與演出', shortName: 'USJ 冬季耶誕活動', kind: '主題樂園耶誕活動', ticketRequired: true,
    venue: '大阪日本環球影城', position: { lat: 34.6654, lng: 135.4323 }, mapQuery: 'ユニバーサル・スタジオ・ジャパン',
    periods: [{ label: 'Universal Holiday Wonders', start: '2026-11-13', end: '2027-01-17' }],
    hours: '園區營業時間與夜間演出依當日官方日曆。', fee: '需購買入園門票；快速通關、餐飲及其他加購項目另計。', booking: '先確認指定日期入園票，快速通關與個別體驗分開查看。', access: 'JR 環球城站，步行前往園區。',
    highlights: ['想把遊樂設施、冬季餐飲和夜間燈光演出一起玩，USJ 適合獨立留一整天。', '本季冬季活動持續到隔年 1/17，跨年後到大阪仍可查看當日節目。'],
    caution: '不是免費街道點燈；演出、餐飲及跨年特殊活動的適用日期與票券請分別核對。',
    sources: [{ label: 'USJ｜2026–2027 冬季活動', url: 'https://www.usj.co.jp/web/ja/jp/events/christmas-2026/universal-holiday-wonders' }, { label: 'USJ 官方活動新聞稿', url: 'https://www.usj.co.jp/company/news/2026/0914_2/' }],
  },
  {
    id: 'kobe-herb-christmas', region: 'kobe', name: '神戶布引香草園｜古城聖誕市集', shortName: '神戶布引香草園聖誕市集', kind: '山上聖誕市集', ticketRequired: true,
    venue: '神戶布引香草園展望廣場；地圖標在纜車山麓站', position: { lat: 34.7074, lng: 135.1937 }, mapQuery: '神戸布引ロープウェイ ハーブ園山麓駅',
    periods: [{ label: '古城聖誕市集', start: '2026-11-07', end: '2026-12-28' }],
    hours: '市集一般日 10:30～16:30；週五、週末、日本國定假日及 12/11～12/28 延長至 20:00。夜間營業日上山纜車末班 20:15、下山末班 21:00。',
    fee: '耶誕季纜車往返與香草園入園套票：成人 3,300 日圓、兒童 1,650 日圓；市集消費另計。', booking: '先核對當日營業時間與官方票券，山上會場須安排纜車交通。', access: '新神戶站步行約 5 分鐘至纜車山麓站，再搭纜車上山。',
    highlights: ['搭纜車上山逛古城風格市集，適合喜歡山景、木製耶誕裝飾與神戶夜景的人。', '想看晚上的燈飾，優先選有夜間營業的日期。'],
    caution: '不是每天都營業到晚上；地圖圖釘標在山麓纜車站，市集在山上的香草園。',
    sources: [{ label: '布引香草園｜2026 耶誕季營業時間', url: 'https://www.kobeherb.com/topics/40537' }, { label: '神戶市｜2026 市集與票價資訊', url: 'https://event.city.kobe.lg.jp/event/ajycMuvaigz43ptmaCGX' }],
  },
  {
    id: 'nagoya-christmas-market', region: 'mie', name: '名古屋聖誕市集｜久屋大通公園', shortName: '名古屋聖誕市集', kind: '聖誕市集',
    venue: '久屋大通公園・EDION 久屋廣場與天使廣場', position: { lat: 35.1635, lng: 136.9093 }, mapQuery: '名古屋クリスマスマーケット エディオン久屋広場',
    periods: [{ label: '名古屋聖誕市集', start: '2026-12-04', end: '2026-12-25' }],
    hours: '平日 16:00～21:00、週末 11:00～21:00；12/24、12/25 為 14:00～21:00。',
    fee: '入場免費；餐飲、商品與遊樂體驗另計。', booking: '一般入場不需預約；個別體驗依官方規則。', access: '地下鐵矢場町站 6 號出口步行約 2 分鐘，位於榮商圈附近。',
    highlights: ['住名古屋、白天逛榮商圈的人，可以直接把久屋大通公園市集接在同一晚。', '想逛市集留市中心，想看大型燈海再另排三重名花之里。'],
    caution: '12 月才開始；12/24、12/25 的開始時間與一般平日不同。',
    sources: [{ label: '東海電視台｜名古屋聖誕市集 2026', url: 'https://www.tokai-tv.com/xmasmarket/' }],
  },
  {
    id: 'sapporo-munich-market', region: 'sapporo', name: '札幌慕尼黑聖誕市集｜大通公園的北海道耶誕', shortName: '札幌慕尼黑聖誕市集', kind: '聖誕市集',
    venue: '札幌大通公園 1 丁目、2 丁目', position: { lat: 43.061, lng: 141.3543 }, mapQuery: '大通公園2丁目 ミュンヘンクリスマス市',
    periods: [{ label: '慕尼黑聖誕市集', start: '2026-11-20', end: '2026-12-25' }],
    hours: '11:00～21:00，最後點餐 20:45。', fee: '市集入場免費；餐飲、雜貨與個別體驗另計。', booking: '一般入場不需預約；工作坊等活動另依官方公告。', access: '地下鐵大通站，步行至大通公園 1、2 丁目。',
    highlights: ['北海道冬季行程可把大通公園市集與白色燈樹節一起逛，德式餐飲與耶誕雜貨適合慢慢看。', '2026 市集包含 1 丁目、2 丁目，兩個區域可以一起安排。'],
    caution: '市集到 12/25，白色燈樹節其他會場日期不同；是否下雪仍看當日天氣。',
    sources: [{ label: '札幌官方｜2026 慕尼黑聖誕市集', url: 'https://www.sapporo.travel/white-illumination/event/munich/' }],
  },
]

const eventOrder = [
  'tokyo-christmas-toyosu', 'tokyo-christmas-shiba', 'roppongi-keyakizaka', 'azabudai-market', 'skytree-christmas', 'tokyo-midtown', 'marunouchi', 'yebisu-garden-place', 'hibiya-illumination', 'shibuya-blue-cave', 'tokyo-disney-christmas',
  'yokohama-red-brick-market', 'tennoji-christmas-market', 'umeda-christmas-market', 'midosuji', 'nakanoshima', 'usj-christmas', 'kobe-herb-christmas', 'nagoya-christmas-market', 'nabana-no-sato', 'sapporo-munich-market', 'hakata-market', 'tenjin-market', 'huis-ten-bosch',
]

export const winterEvents: WinterEvent[] = [...existingWinterEvents, ...additionalWinterEvents].sort((a, b) => eventOrder.indexOf(a.id) - eventOrder.indexOf(b.id))

export const winterEditorialReferences = [
  { label: 'Japaholic｜關西、九州聖誕市集', url: 'https://www.japaholic.com/tw/article/detail/944866' },
  { label: 'GOOD LUCK TRIP｜日本聖誕節指南', url: 'https://www.gltjp.com/zh-hant/article/item/21224/' },
  { label: 'MATCHA｜東京聖誕市集與點燈', url: 'https://matcha-jp.com/tw/5262' },
  { label: '樂吃購！日本｜東京與關東聖誕燈飾', url: 'https://tokyo.letsgojp.com/archives/45148/' },
  { label: 'To Do List Japan｜日本聖誕市集', url: 'https://todolist-japan.com/zh/japan-christmas-markets/' },
  { label: 'KUO life｜日本經典聖誕市集', url: 'https://kuolife.com/japan-christmas/' },
]

export function winterEventMatchesDate(event: WinterEvent, date: string): boolean {
  if (!date) return true
  if (event.scheduleStatus === 'pending') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false
  return !event.closedDates?.includes(date) && event.periods.some((period) => date >= period.start && date <= period.end)
}

export function winterPeriodLabel(period: WinterPeriod): string {
  const startYear = period.start.slice(0, 4)
  const endYear = period.end.slice(0, 4)
  const format = (value: string) => `${Number(value.slice(5, 7))}/${Number(value.slice(8, 10))}`
  return `${startYear}/${format(period.start)}～${startYear === endYear ? '' : `${endYear}/`}${format(period.end)}`
}

export function winterScheduleLines(event: WinterEvent): string[] {
  if (event.scheduleStatus === 'pending' || !event.periods.length) return ['2026 日程待官方公布']
  return event.periods.map((period) => `${event.periods.length > 1 ? `${period.label}：` : ''}${winterPeriodLabel(period)}`)
}

export function winterMapsUrl(event: WinterEvent): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`
}

// Use the same card data shape as the city maps, keeping venue facts in one place.
export const winterMapPlaces: MapPlace[] = winterEvents.map((event, index) => ({
  id: event.id,
  category: event.ticketRequired ? 'ticket' : 'spot',
  name: `${index + 1}. ${event.shortName}`,
  description: `${event.scheduleStatus === 'pending' ? '2026 日程待官方公布。' : ''}${event.highlights[0]}`,
  lat: event.position.lat,
  lng: event.position.lng,
  spotGoogleMapsUrl: winterMapsUrl(event),
  relatedArticleHref: `#${event.id}`,
  relatedArticleLabel: '活動介紹',
  relatedArticleEvent: `winter2026_card_article_${event.id}`,
  spotActions: [
    { label: '活動官網', href: event.sources[0].url, className: 'btn primary', event: `winter2026_card_official_${event.id}`, platform: 'official' },
    ...(event.videos ?? []).map((video, videoIndex) => ({
      label: video.label,
      href: video.url,
      event: `winter2026_card_video_${event.id}_${videoIndex}`,
      platform: video.url.includes('instagram.com') ? 'Instagram' : 'YouTube',
      videoGroup: '旅杰實拍',
    })),
  ],
}))

export const winterFaqItems = [
  { q: '2026 東京聖誕市集還在明治神宮外苑嗎？', a: '本季官方公告的兩個會場是新豐洲與芝公園（御成門站前廣場）：新豐洲 11/20～12/25，芝公園 12/4～12/25。請依本季會場地址導航，不要直接使用往年明治神宮外苑的地址。' },
  { q: '12 月 25 日以後還看得到日本冬季點燈嗎？', a: '可以，但要看活動。丸之內仲通、東京中城的光之散步道、惠比壽的水晶吊燈、名花之里與豪斯登堡冬季燈飾，都有跨年後的展示期間。同地點的聖誕市集、聖誕樹或特別演出，則可能在 12/25 前後結束。' },
  { q: '冬季點燈和聖誕市集都免費嗎？', a: '六本木、麻布台、天王寺、梅田廣場、博多與天神等市集可免費入場，餐飲與購物另計。東京聖誕市集新豐洲、芝公園與橫濱紅磚倉庫主會場有入場費；迪士尼、USJ、名花之里、豪斯登堡及神戶布引香草園也要另外確認門票或交通套票。' },
  { q: '東京有哪些點燈可以排在同一晚？', a: '11/26～12/25 可將六本木之丘櫸坂通與東京中城排在同一晚，兩地之間保留步行與拍照時間。丸之內可接東京車站、銀座；惠比壽則適合安排晚餐與廣場散步。' },
  { q: '聖誕活動需要事先預約嗎？', a: '一般街道點燈和免費市集通常不需預約。需購票的市集、樂園與纜車行程，則先核對指定日期票券；名花之里 12/23～12/25 另需限量指定日專用票。餐廳、住宿與工作坊等體驗也可能另需預約。' },
  { q: '澀谷青之洞窟的 2026 日程確定了嗎？', a: '截至本頁更新，官方網站仍顯示 2025 活動結束公告，所以本篇保留這個經典地點並標示「2026 日程待官方公布」，不把往年的日期當成本季已確認日期。' },
]
