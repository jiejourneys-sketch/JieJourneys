type JourneyLink = { label: string; href: string }

type JourneyCustomPlace = {
  name: string
  category: 'spot' | 'restaurant' | 'shop' | 'hotel'
  description: string
  lat: number
  lng: number
  googleUrl: string
  links?: JourneyLink[]
}

type JourneyDay = {
  title: string
  placeIds: string[]
}

const AREA = {
  ueno: { lat: 35.7147, lng: 139.7737 },
  asakusa: { lat: 35.7128, lng: 139.7965 },
  skytree: { lat: 35.7102, lng: 139.8107 },
  imperial: { lat: 35.6852, lng: 139.7528 },
  shinjuku: { lat: 35.6915, lng: 139.7031 },
  harajuku: { lat: 35.669, lng: 139.7048 },
  shibuya: { lat: 35.6598, lng: 139.7006 },
  tsukiji: { lat: 35.665, lng: 139.7704 },
  ginza: { lat: 35.671, lng: 139.7662 },
} as const

const TOKYO_JOURNEY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '藥妝店｜OS Drug／SUGI／大國藥妝': { lat: 35.7108985, lng: 139.774618 },
  '淺草炸肉餅': { lat: 35.7129114, lng: 139.7960553 },
  '淺草今半': { lat: 35.7139345, lng: 139.7922291 },
  '淺草花月堂': { lat: 35.7115289, lng: 139.7960494 },
  '淺草寺 雷門': { lat: 35.7111163, lng: 139.7963656 },
  '淺草吉備糰子': { lat: 35.7115289, lng: 139.7960494 },
  '淺草文化觀光中心': { lat: 35.7107074, lng: 139.7965461 },
  '淺草鰻魚鐵': { lat: 35.7136508, lng: 139.7925969 },
  '＠cosme TOKYO': { lat: 35.6701458, lng: 139.7031743 },
  DAISO: { lat: 35.6715621, lng: 139.7037819 },
  '唐吉訶德｜上野阿美橫店': { lat: 35.7081306, lng: 139.7744933 },
  "Eggs 'n Things": { lat: 35.6685856, lng: 139.7062313 },
  '吹上御苑': { lat: 35.6861858, lng: 139.7485662 },
  '哥吉拉的頭': { lat: 35.6950521, lng: 139.7019117 },
  '五條天神社': { lat: 35.7136777, lng: 139.7722762 },
  '牛かつもと村': { lat: 35.6706585, lng: 139.7072227 },
  '炸牛 元村': { lat: 35.7104455, lng: 139.7744533 },
  'Harry Potter Shop': { lat: 35.6686494, lng: 139.7044101 },
  '一蘭拉麵': { lat: 35.6678693, lng: 139.7052351 },
  '皇居東御苑': { lat: 35.6867824, lng: 139.7571445 },
  '皇居外苑': { lat: 35.680117, lng: 139.7583125 },
  '敘敘苑': { lat: 35.710053, lng: 139.8129139 },
  '迴轉壽司': { lat: 35.7100517, lng: 139.8129244 },
  'らーめん 鴨to葱': { lat: 35.7083768, lng: 139.7752537 },
  '桔梗門': { lat: 35.6840122, lng: 139.758499 },
  '清水觀音堂': { lat: 35.7126261, lng: 139.7735665 },
  '楠木正成像': { lat: 35.6779137, lng: 139.7584835 },
  Misojyu: { lat: 35.7116123, lng: 139.7937274 },
  '三井花園飯店上野-東京': { lat: 35.7118567, lng: 139.7781079 },
  '宮下公園': { lat: 35.661791, lng: 139.7018507 },
  '波除稻荷神社': { lat: 35.6635186, lng: 139.7715677 },
  '二重橋': { lat: 35.6802297, lng: 139.7535852 },
  NikutoTamago: { lat: 35.690327, lng: 139.7027699 },
  '表參道': { lat: 35.667355, lng: 139.707743 },
  '表參道之丘': { lat: 35.6672869, lng: 139.7086162 },
  '穏田橋跡': { lat: 35.6665448, lng: 139.7060313 },
  '出發前｜機場進市區': { lat: 35.7100581, lng: 139.7745474 },
  '出發前｜網路與交通卡': { lat: 35.7100581, lng: 139.7745474 },
  '出發前｜入境與簽證': { lat: 35.7100581, lng: 139.7745474 },
  '出發前｜票券預約': { lat: 35.7100581, lng: 139.7745474 },
  '出發前｜地圖、換匯、機票飯店': { lat: 35.7100581, lng: 139.7745474 },
  '成田國際機場（NRT）': { lat: 35.772, lng: 140.3929 },
  '拉麵林田': { lat: 35.690729, lng: 139.7037509 },
  '上野雷索爾飯店': { lat: 35.7132578, lng: 139.7778548 },
  '六厘舎': { lat: 35.7101946, lng: 139.8127136 },
  '櫻田門': { lat: 35.6785627, lng: 139.7539422 },
  '澀谷中心街': { lat: 35.6665448, lng: 139.7060313 },
  '不忍池': { lat: 35.7122453, lng: 139.7708284 },
  '上野燦路都星辰大飯店': { lat: 35.7135389, lng: 139.7781833 },
  '壽司三昧': { lat: 35.6659044, lng: 139.7706492 },
  '上野薩頓普萊斯飯店': { lat: 35.713958, lng: 139.779093 },
  '竹下通': { lat: 35.6712601, lng: 139.7046761 },
  '東鄉神社': { lat: 35.6717402, lng: 139.7058439 },
  '鳥めし 鳥藤分店': { lat: 35.6660547, lng: 139.7704112 },
  '築地 本願寺': { lat: 35.6664862, lng: 139.7722836 },
  '月島もんじゃ もへじ': { lat: 35.7101036, lng: 139.7746348 },
  '綱八天婦羅': { lat: 35.6908459, lng: 139.7034867 },
  '上野大佛': { lat: 35.7144982, lng: 139.7728505 },
  '上野東照宮': { lat: 35.7147557, lng: 139.7734312 },
  '本まぐろ専門店 うに虎': { lat: 35.6656053, lng: 139.7699504 },
  '和田倉噴水公園': { lat: 35.6833415, lng: 139.7608736 },
  'よろし化粧堂': { lat: 35.7113135, lng: 139.7964548 },
}

type AreaKey = keyof typeof AREA

function at(area: AreaKey, latOffset = 0, lngOffset = 0) {
  return {
    lat: AREA[area].lat + latOffset,
    lng: AREA[area].lng + lngOffset,
  }
}

const link = (label: string, href: string): JourneyLink => ({ label, href })

function place(
  name: string,
  category: JourneyCustomPlace['category'],
  area: AreaKey,
  googleUrl: string,
  description: string,
  links: JourneyLink[] = [],
  latOffset = 0,
  lngOffset = 0,
): JourneyCustomPlace {
  return {
    name,
    category,
    description,
    googleUrl,
    ...(TOKYO_JOURNEY_COORDINATES[name] ?? at(area, latOffset, lngOffset)),
    links: links.length > 0 ? links : undefined,
  }
}

function dayItem(dayNumber: number, title: string) {
  return `day:${dayNumber}|${encodeURIComponent(title)}`
}

function transportItem(
  id: string,
  mode: 'walk' | 'subway' | 'train' | 'taxi',
  note: string,
  href = '',
  duration = '',
) {
  return `transport:${id}|${mode}|${encodeURIComponent(duration)}|${encodeURIComponent(note)}|${encodeURIComponent(href)}|`
}

function bookPlaceId(placeId: string) {
  if (placeId.startsWith('custom:')) return placeId
  if (placeId.startsWith('custom-tokyo-')) return `custom:tokyo-${placeId.slice('custom-tokyo-'.length)}`
  return placeId
}

const tokyoJourneyCustomPlacesRaw = {
  'custom-tokyo-ueno-tosho-gu': place(
    '上野東照宮',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/ugzzFtpZm3LUP1cP6',
    '社殿／御守／書置御朱印；09:00–16:30，門票 500 日圓。',
    [],
    0.0008,
    0.0012,
  ),
  'custom-tokyo-gojo-tenjinsha': place(
    '五條天神社',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/6iN39byj4zPt9VGi9',
    '神社／鳥居／御守；06:00–17:00。',
    [],
    0.0002,
    0.0007,
  ),
  'custom-tokyo-ueno-daibutsu': place(
    '上野大佛',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/YRLxgHQXh98xUF217',
    '佛像打卡點。',
    [],
    -0.0001,
    -0.0003,
  ),
  'custom-tokyo-kiyomizu-kannondo': place(
    '清水觀音堂',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/59fATmq5woqbG6hw7',
    '佛寺和御守；09:00–17:00。',
    [],
    0.0009,
    0.0003,
  ),
  'custom-tokyo-shinobazu-pond': place(
    '不忍池',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/3Yb9hq2SiTTXAh4q6',
    '可划船，半小時 800 日圓；08:30–17:30。',
    [],
    0.0012,
    -0.0001,
  ),
  'custom-tokyo-gyukatsu-motomura-ueno': place(
    '炸牛 元村',
    'restaurant',
    'ueno',
    'https://maps.app.goo.gl/S1Dg1GiC8r8xpsf86',
    '牛排／Day 1 晚餐。',
    [],
    -0.0021,
    0.0018,
  ),
  'custom-tokyo-tsukishima-monja-mohji': place(
    '月島もんじゃ もへじ',
    'restaurant',
    'ueno',
    'https://maps.app.goo.gl/3K58rZDxY8DUqfeF9',
    '文字燒／Day 1 晚餐。',
    [],
    -0.0017,
    0.0024,
  ),
  'custom-tokyo-kamoto-negi': place(
    'らーめん 鴨to葱',
    'restaurant',
    'ueno',
    'https://maps.app.goo.gl/o55toatHntWajfKg9',
    '拉麵／24 小時營業。',
    [],
    -0.0024,
    0.0011,
  ),
  'custom-tokyo-asakusa-tourist-info': place(
    '淺草文化觀光中心',
    'spot',
    'asakusa',
    'https://maps.app.goo.gl/TUoDeU4w7uVhb2qE8',
    '8 樓免費觀景台看淺草寺和晴空塔；09:00–20:00。',
    [],
    0.0002,
    0.0002,
  ),
  'custom-tokyo-asakusa-kaminarimon': place(
    '淺草寺 雷門',
    'spot',
    'asakusa',
    'https://maps.app.goo.gl/avrust1sgw1LSohEA',
    '淺草寺門口拍照；24 小時。',
    [],
    -0.0007,
    0.0003,
  ),
  'custom-tokyo-yoroshi-cosmedo': place(
    'よろし化粧堂',
    'shop',
    'asakusa',
    'https://maps.app.goo.gl/tinBY4ALr4JKu3m49',
    '乳液／護唇膏／護手霜；09:00–18:00。',
    [],
    -0.0005,
    0.0008,
  ),
  'custom-tokyo-asakusa-kibidango': place(
    '淺草吉備糰子',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/5p1oxv6CRozUX2sFA',
    '糰子／09:00–17:30。',
    [],
    -0.001,
    0.0011,
  ),
  'custom-tokyo-asakusa-kagetsudo': place(
    '淺草花月堂',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/SvxHg72oRoidHbpZ6',
    '菠蘿麵包／09:00–16:30。',
    [],
    -0.0007,
    0.0009,
  ),
  'custom-tokyo-asakusa-fried-meatball': place(
    '淺草炸肉餅',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/nsJfnAZiXxYYA5cb6',
    '多肉汁炸肉餅／10:00–19:00。',
    [],
    -0.0004,
    0.0005,
  ),
  'custom-tokyo-misojyu': place(
    'Misojyu',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/yGxqD1ZarosUk9n36',
    '飯糰和味增湯／08:00–15:30。',
    [],
    0.001,
    0.0002,
  ),
  'custom-tokyo-asakusa-imahan': place(
    '淺草今半',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/ecsPAQpUAVHqGNpm6',
    '壽喜燒／11:30–19:30。',
    [],
    0.0004,
    -0.0002,
  ),
  'custom-tokyo-asakusa-unagitetsu': place(
    '淺草鰻魚鐵',
    'restaurant',
    'asakusa',
    'https://maps.app.goo.gl/SHnsWBFf5WFBD6d66',
    '炭香味鰻魚／11:30–20:00。',
    [],
    0.0005,
    0.0004,
  ),
  'custom-tokyo-rokurinsha': place(
    '六厘舎',
    'restaurant',
    'skytree',
    'https://maps.app.goo.gl/j8h1oCHroECtwWag7',
    '拉麵；東館 6 樓／10:30–22:30。',
    [],
    0.0002,
    -0.0005,
  ),
  'custom-tokyo-kaiten-sushi': place(
    '迴轉壽司',
    'restaurant',
    'skytree',
    'https://maps.app.goo.gl/KmkFpgVo9VypNHdY7',
    '壽司；東館 6 樓／11:00–23:00。',
    [],
    0.0006,
    -0.0002,
  ),
  'custom-tokyo-jojoen': place(
    '敘敘苑',
    'restaurant',
    'skytree',
    'https://maps.app.goo.gl/z2tVQY3WTxS9EByY6',
    '烤肉；東館 30 樓／10:30–23:00。',
    [],
    0.0008,
    0.0001,
  ),
  'custom-tokyo-imperial-east-garden': place(
    '皇居東御苑',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/QknBo5mNJ6DTF5Vv6',
    '自由參觀；二／三／四／六／日 09:00–16:00。',
    [],
    0.001,
    0.0019,
  ),
  'custom-tokyo-imperial-outer-garden': place(
    '皇居外苑',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/y25aP3aZBWxa387k7',
    '自由參觀；24 小時。',
    [],
    0.0001,
    0.0001,
  ),
  'custom-tokyo-wadakura-fountain-park': place(
    '和田倉噴水公園',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/Kdbar9f1ha1L3wME7',
    '皇居外苑散步點。',
    [],
    -0.0012,
    0.0025,
  ),
  'custom-tokyo-nijubashi': place(
    '二重橋',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/j82bAYU7hcLFsesQ9',
    '皇居外苑經典拍照點。',
    [],
    -0.0011,
    0.0007,
  ),
  'custom-tokyo-sakurada-mon': place(
    '櫻田門',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/djAEwmrRkDosE61U6',
    '皇居外苑散步點。',
    [],
    -0.006,
    -0.0015,
  ),
  'custom-tokyo-kusunoki-statue': place(
    '楠木正成像',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/bce8g7zETdeJbTDY7',
    '皇居外苑散步點。',
    [],
    -0.0074,
    -0.001,
  ),
  'custom-tokyo-nikuto-tamago': place(
    'NikutoTamago',
    'restaurant',
    'shinjuku',
    'https://maps.app.goo.gl/zUQroDseVaEi31qs9',
    '漢堡牛排／蛋包飯；11:00–22:00。',
    [],
    0.0002,
    -0.0002,
  ),
  'custom-tokyo-ramen-hayashi': place(
    '拉麵林田',
    'restaurant',
    'shinjuku',
    'https://maps.app.goo.gl/EPK66a694kdU8U888',
    '拉麵；11:00–23:00。',
    [],
    0.0006,
    0.0005,
  ),
  'custom-tokyo-tsunahachi-tempura': place(
    '綱八天婦羅',
    'restaurant',
    'shinjuku',
    'https://maps.app.goo.gl/wF3dsUnVoB9BKLf4A',
    '天婦羅；11:00–22:00。',
    [],
    0.0004,
    0.0001,
  ),
  'custom-tokyo-cosme-tokyo': place(
    '＠cosme TOKYO',
    'shop',
    'harajuku',
    'https://maps.app.goo.gl/wFQKFhULtPybucU97',
    '美妝店；11:00–21:00。',
    [],
    0.0002,
    0.0003,
  ),
  'custom-tokyo-takeshita-street': place(
    '竹下通',
    'spot',
    'harajuku',
    'https://maps.app.goo.gl/fqH3M2HBxsBK6Lyb7',
    '年輕人購物街。',
    [],
    0.0004,
    0.0006,
  ),
  'custom-tokyo-daiso-harajuku': place(
    'DAISO',
    'shop',
    'harajuku',
    'https://maps.app.goo.gl/KvASVo5e2X1UrZfo8',
    '大創百貨；09:30–21:00。',
    [],
    0.0001,
    0.0008,
  ),
  'custom-tokyo-togo-shrine': place(
    '東鄉神社',
    'spot',
    'harajuku',
    'https://maps.app.goo.gl/UZkx2KzYs68F7Rbd7',
    '竹下通神社；06:00–17:00。',
    [],
    0.0005,
    0.001,
  ),
  'custom-tokyo-omotesando': place(
    '表參道',
    'spot',
    'harajuku',
    'https://maps.app.goo.gl/y8hYRqNKRuhHo6Cs5',
    '高檔精品購物區。',
    [],
    -0.003,
    0.0002,
  ),
  'custom-tokyo-omotesando-hills': place(
    '表參道之丘',
    'shop',
    'harajuku',
    'https://maps.app.goo.gl/V3qrrfofZ8R5QiRP6',
    '高級購物商場；11:00–20:00。',
    [link('樓層指南', 'https://www.omotesandohills.com/floor_map/')],
    -0.0025,
    0.001,
  ),
  'custom-tokyo-harry-potter-shop': place(
    'Harry Potter Shop',
    'shop',
    'harajuku',
    'https://maps.app.goo.gl/Cyx8mh5D3SGwdrN5A',
    '哈利波特旗艦店；11:00–21:00。',
    [],
    0.0014,
    0.002,
  ),
  'custom-tokyo-ondenbashi-ato': place(
    '穏田橋跡',
    'spot',
    'harajuku',
    'https://maps.app.goo.gl/WNZTc8WD7n5NTr7r8',
    '文化貓街。',
    [],
    -0.001,
    -0.0006,
  ),
  'custom-tokyo-shibuya-center-gai': place(
    '澀谷中心街',
    'spot',
    'shibuya',
    'https://maps.app.goo.gl/WNZTc8WD7n5NTr7r8',
    '熱鬧購物街。',
    [],
    0.0008,
    -0.001,
  ),
  'custom-tokyo-miyashita-park': place(
    '宮下公園',
    'shop',
    'shibuya',
    'https://maps.app.goo.gl/aLoDCZnaJizK1bTBA',
    '城市花園購物廣場；11:00–21:00。',
    [],
    0.0012,
    0.0022,
  ),
  'custom-tokyo-namiyoke-inari': place(
    '波除稻荷神社',
    'spot',
    'tsukiji',
    'https://maps.app.goo.gl/RxDtzKjTe5X2GrXn6',
    '神社；09:00–17:00。',
    [],
    0.0002,
    0.0008,
  ),
  'custom-tokyo-tsukiji-honganji': place(
    '築地 本願寺',
    'spot',
    'tsukiji',
    'https://maps.app.goo.gl/7vHrR2FxWpGGPBc98',
    '佛寺；06:00–16:00。',
    [],
    0.0005,
    -0.0005,
  ),
  'custom-tokyo-sushi-zanmai': place(
    '壽司三昧',
    'restaurant',
    'tsukiji',
    'https://maps.app.goo.gl/28Av9bbjxwynFu4D6',
    '壽司；24 小時營業。',
    [],
    -0.0002,
    0.0004,
  ),
  'custom-tokyo-torifuji': place(
    '鳥めし 鳥藤分店',
    'restaurant',
    'tsukiji',
    'https://maps.app.goo.gl/7W4z3brbVd6mTh4QA',
    '親子丼；週一／二／四／五／六 07:30–19:30。',
    [],
    0.0002,
    0.0002,
  ),
  'custom-tokyo-unitora': place(
    '本まぐろ専門店 うに虎',
    'restaurant',
    'tsukiji',
    'https://maps.app.goo.gl/HnzGp6pcJ7uLB4ci6',
    '海鮮丼；08:00–15:30。',
    [],
    0.0004,
    0.0006,
  ),
  'custom-tokyo-mitsui-garden-ueno': place(
    '三井花園飯店上野-東京',
    'hotel',
    'ueno',
    'https://maps.app.goo.gl/XJtsWjBTABa1DXKz8',
    '4★；15:00 後入住／11:00 前退房。',
    [
      link(
        'Trip',
        'https://tw.trip.com/hotels/tokyo-hotel-detail-688243/mitsui-garden-hotel-ueno/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11908318',
      ),
      link('Agoda', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=222614'),
    ],
    0.0031,
    0.0041,
  ),
  'custom-tokyo-resol-ueno': place(
    '上野雷索爾飯店',
    'hotel',
    'ueno',
    'https://maps.app.goo.gl/Df7XuDfmGJXNFVNc6',
    '3★；15:00 後入住／11:00 前退房。',
    [
      link(
        'Trip',
        'https://tw.trip.com/hotels/tokyo-hotel-detail-54650610/hotel-resol-ueno/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11908318',
      ),
      link('Agoda', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=10789497'),
    ],
    0.0041,
    0.0052,
  ),
  'custom-tokyo-sunroute-stellar-ueno': place(
    '上野燦路都星辰大飯店',
    'hotel',
    'ueno',
    'https://maps.app.goo.gl/roV5eGqUqHefbVWs8',
    '3★；14:00 後入住／11:00 前退房。',
    [
      link(
        'Trip',
        'https://tw.trip.com/hotels/tokyo-hotel-detail-2935821/hotel-sunroute-stellar-ueno?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11908318',
      ),
      link('Agoda', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1270455'),
    ],
    0.0018,
    0.0048,
  ),
  'custom-tokyo-sutton-place-ueno': place(
    '上野薩頓普萊斯飯店',
    'hotel',
    'ueno',
    'https://maps.app.goo.gl/cUf68rHmzF14as159',
    '3★；16:30 後入住／11:00 前退房。',
    [
      link(
        'Trip',
        'https://tw.trip.com/hotels/tokyo-hotel-detail-1709104/sutton-place-hotel-ueno?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D11908318',
      ),
      link('Agoda', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9067800'),
    ],
    0.0036,
    0.0028,
  ),
  'custom-tokyo-ameyoko-drugstores': place(
    '藥妝店｜OS Drug／SUGI／大國藥妝',
    'shop',
    'ueno',
    'https://maps.app.goo.gl/dbgPqvbMGoen8pKV6',
    'Day 1 阿美橫補貨：OS Drug／SUGI 藥局／大國藥妝。',
    [
      link('OS Drug', 'https://maps.app.goo.gl/dbgPqvbMGoen8pKV6'),
      link('SUGI 藥局', 'https://maps.app.goo.gl/HKcpYP3sPeCQ7SHWA'),
      link('大國藥妝', 'https://maps.app.goo.gl/ZpBfsuVH7KPzcTm1A'),
    ],
    -0.003,
    0.0013,
  ),
  'custom-tokyo-donki-ueno': place(
    '唐吉訶德｜上野阿美橫店',
    'shop',
    'ueno',
    'https://maps.app.goo.gl/XSb1nezKHmiCBtue9',
    'Day 1 阿美橫補貨；09:30–01:00。',
    [],
    -0.0034,
    0.0017,
  ),
  'custom-tokyo-kikyomon-gate': place(
    '桔梗門',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/CbqE6774EHe3JwPa8',
    'Day 3 皇居參觀報到位置；09:30 報到，10:00 場次。',
    [],
    0.0027,
    0.0017,
  ),
  'custom-tokyo-fukiage-garden': place(
    '吹上御苑',
    'spot',
    'imperial',
    'https://maps.app.goo.gl/GxJ1fhACVWU3GZLP8',
    '帶護照和預約成功後的參觀許可證；週二至六 10:00／13:30。',
    [],
    0.0012,
    0.0022,
  ),
  'custom-tokyo-godzilla-head': place(
    '哥吉拉的頭',
    'spot',
    'shinjuku',
    'https://maps.app.goo.gl/M78g5GFtF2tG758q6',
    'Day 3 新宿加碼拍照點；24 小時可從外面遠看。',
    [],
    0.0021,
    -0.0036,
  ),
  'custom-tokyo-gyukatsu-motomura-harajuku': place(
    '牛かつもと村',
    'restaurant',
    'harajuku',
    'https://maps.app.goo.gl/381kwpBGncBptS8D6',
    'Day 4 午餐候選：炸牛排｜11:00–22:00。',
    [],
    -0.0012,
    0.0003,
  ),
  'custom-tokyo-ichiran-harajuku': place(
    '一蘭拉麵',
    'restaurant',
    'harajuku',
    'https://maps.app.goo.gl/dmV8HG2w6aEM4GYi8',
    'Day 4 午餐候選：連鎖拉麵店｜09:00–22:00。',
    [],
    -0.0021,
    -0.0046,
  ),
  'custom-tokyo-eggsnthings-harajuku': place(
    "Eggs 'n Things",
    'restaurant',
    'harajuku',
    'https://maps.app.goo.gl/mCPjvNqu5W4HPmoA9',
    'Day 4 午餐候選：早午餐｜08:00–21:00。',
    [],
    -0.0018,
    0.0005,
  ),
  'custom-tokyo-narita-airport': place(
    '成田國際機場（NRT）',
    'spot',
    'ueno',
    'https://www.google.com/maps/search/?api=1&query=Narita%20International%20Airport',
    '第一／第二航廈以 QR code 換 Skyliner 車票，約 40 分鐘抵達京成上野站；返程由上野搭 Skyliner 回機場。',
    [
      link('Skyliner 時刻表', 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php'),
      link('備選｜羽田機場（HND）', 'https://www.google.com/maps/search/?api=1&query=Haneda%20Airport'),
      link('東京單軌時刻表', 'https://www.tokyo-monorail.co.jp/tc/timetable/0920.html'),
    ],
  ),
  'custom-tokyo-predeparture-entry': place(
    '出發前｜入境與簽證',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/737FbabVtfnJ8J7V6',
    '台灣／香港／新加坡／馬來西亞免簽；出發前完成 Visit Japan Web。',
    [
      link('Visit Japan Web', 'https://services.digital.go.jp/zh-cmn-hant/visit-japan-web/'),
      link('填寫教學', 'https://www.instagram.com/reel/DSxI34Nkebp/'),
      link('免簽國家', 'https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html'),
    ],
    -0.007,
    -0.006,
  ),
  'custom-tokyo-predeparture-tickets': place(
    '出發前｜票券預約',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/737FbabVtfnJ8J7V6',
    'Skyliner 搭配東京地鐵 72 小時券；晴空塔預約 Day 2 16:00–17:00，皇居 Day 3 10:00，Shibuya Sky Day 4 約 17:00。',
    [
      link('Skyliner', 'https://www.kkday.com/zh-tw/product/7913-keisei-skyliner-narita-airport-express-ticket?cid=22312'),
      link('晴空塔', 'https://www.kkday.com/zh-tw/product/10759-tokyo-skytree-observatory-advance-ticket-japan?cid=22312'),
      link('皇居預約', 'https://sankan.kunaicho.go.jp/register/month/1001'),
      link('Shibuya Sky', 'https://www.kkday.com/zh-tw/product/133300-shibuya-sky-observatory-e-ticket-tokyo?cid=22312'),
    ],
    -0.007,
    -0.005,
  ),
  'custom-tokyo-predeparture-connectivity': place(
    '出發前｜網路與交通卡',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/737FbabVtfnJ8J7V6',
    '事先準備 eSIM／SIM／WiFi 分享器與 Suica。',
    [
      link('eSIM', 'https://esimconnect.com.tw/#/access/esimbuy?referencecode=jiejourneys'),
      link('SIM 卡', 'https://www.kkday.com/zh-tw/product/126982?cid=22312'),
      link('WiFi 分享器', 'https://www.klook.com/zh-TW/activity/16399-unlimited-4g-lte-wifi-japan-airport-pickup-ninja-wifi/?aid=93798'),
      link('Suica', 'https://www.klook.com/zh-TW/activity/16917-suica-ic-card-tokyo/?aid=93798'),
    ],
    -0.007,
    -0.004,
  ),
  'custom-tokyo-predeparture-tools': place(
    '出發前｜地圖、換匯、機票飯店',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/737FbabVtfnJ8J7V6',
    '下載 Google Maps；出發前確認換匯、機票與住宿。',
    [
      link('Google Maps Android', 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps&hl=zh_TW&pli=1'),
      link('Google Maps iOS', 'https://apps.apple.com/tw/app/google-%E5%9C%B0%E5%9C%96/id585027354'),
      link('地鐵攻略', 'https://www.instagram.com/reel/DT5PNXdk4DM/'),
      link('日圓換匯', 'https://www.instagram.com/reel/DTDKcCoEZBS/'),
      link('Trip', 'https://tw.trip.com/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D5551709'),
      link('Agoda', 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hl=zh-tw'),
      link('東京官網', 'https://www.jiejourneys.com/tokyo/'),
    ],
    -0.007,
    -0.003,
  ),
  'custom-tokyo-predeparture-airport': place(
    '出發前｜機場進市區',
    'spot',
    'ueno',
    'https://maps.app.goo.gl/737FbabVtfnJ8J7V6',
    'NRT：Skyliner 至上野；HND：單軌電車至濱松町，再轉 JR。',
    [
      link('Skyliner 時刻表', 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php'),
      link('東京單軌時刻表', 'https://www.tokyo-monorail.co.jp/tc/timetable/0920.html'),
    ],
    -0.007,
    -0.002,
  ),
} satisfies Record<string, JourneyCustomPlace>

export const tokyoJourneyCustomPlaces = Object.fromEntries(
  Object.entries(tokyoJourneyCustomPlacesRaw).map(([id, placeItem]) => [
    bookPlaceId(id),
    {
      name: placeItem.name,
      category: placeItem.category,
      lat: placeItem.lat,
      lng: placeItem.lng,
      googleUrl: placeItem.googleUrl,
      ...(placeItem.links ? { links: placeItem.links } : {}),
    },
  ]),
)

function restaurantAlternativeGoogleMapLink(placeId: string): JourneyLink | null {
  const placeItem = tokyoJourneyCustomPlaces[bookPlaceId(placeId)]
  if (!placeItem?.googleUrl) return null
  return link(`備選｜${placeItem.name}`, placeItem.googleUrl)
}

const tokyoJourneyRestaurantAlternativeIds: Record<string, string[]> = {
  'custom:tokyo-gyukatsu-motomura-ueno': ['custom-tokyo-tsukishima-monja-mohji', 'custom-tokyo-kamoto-negi'],
  'custom:tokyo-asakusa-imahan': ['custom-tokyo-asakusa-unagitetsu'],
  'custom:tokyo-rokurinsha': ['custom-tokyo-kaiten-sushi', 'custom-tokyo-jojoen'],
  'custom:tokyo-nikuto-tamago': ['custom-tokyo-ramen-hayashi', 'custom-tokyo-tsunahachi-tempura'],
  'custom:tokyo-gyukatsu-motomura-harajuku': ['custom-tokyo-ichiran-harajuku', 'custom-tokyo-eggsnthings-harajuku'],
  'custom:tokyo-sushi-zanmai': ['custom-tokyo-torifuji', 'custom-tokyo-unitora'],
}

const tokyoJourneyRestaurantAlternativeLinks: Record<string, JourneyLink[]> = Object.fromEntries(
  Object.entries(tokyoJourneyRestaurantAlternativeIds).map(([primaryPlaceId, alternativePlaceIds]) => [
    primaryPlaceId,
    alternativePlaceIds
      .map(restaurantAlternativeGoogleMapLink)
      .filter((item): item is JourneyLink => Boolean(item)),
  ]),
)

const tokyoJourneyBookUserLinksRaw: Record<string, JourneyLink[]> = {
  'tokyo-UenoPark': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/ugzzFtpZm3LUP1cP6'),
  ],
  'tokyo-AmeyokoMarket': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/737FbabVtfnJ8J7V6'),
  ],
  'tokyo-YutachomeGikichi': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/FyYGUnHFDEPiRMBN9'),
    link('樓層指南', 'https://mitsui-shopping-park.com/tw/urban/yoshiike/floorguide.html'),
  ],
  'tokyo-AsakusaTemple': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/NzfbTKSKr4d9h9MJ9'),
  ],
  'tokyo-TokyoSkytree': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/aQK3Jb8TAXEiw2y46'),
    link('樓層指南', 'https://tcn.www.tokyo-solamachi.jp/floor/'),
    link('搜尋商店', 'https://tcn.www.tokyo-solamachi.jp/shop/'),
    link('搜尋餐廳', 'https://tcn.www.tokyo-solamachi.jp/restaurant/'),
  ],
  'tokyo-skytree': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/CzZr6x4XK7Lv74t19'),
    link('晴空塔票券', 'https://www.kkday.com/zh-tw/product/10759-tokyo-skytree-observatory-advance-ticket-japan?cid=22312'),
    link('晴空塔路線', 'https://www.instagram.com/reel/DV3aGGdFNsc/'),
  ],
  'tokyo-ImperialPalace': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/WTpvUXw744Kz4F5x9'),
    link('皇居預約', 'https://sankan.kunaicho.go.jp/register/month/1001'),
  ],
  'tokyo-BicCameraShinjuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/pu9qZ2WvBpPGJMFQ9'),
    link('樓層指南', 'https://www.biccamera.com.t.lj.hp.transer.com/bc/i/shop/shoplist/shop116.jsp'),
  ],
  'tokyo-DisneyStoreShinjuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/UuHSv6dT34VhTT2U6'),
  ],
  'tokyo-KinokuniyaShinjuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/BEvCHgNtihFS8GRk9'),
  ],
  'tokyo-HanaGardenShrine': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/LnZ6bcSRa6iaZ4Yv6'),
  ],
  'tokyo-YodobashiShinjuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/GJ7kqs5WTkicLCoK6'),
  ],
  'tokyo-LumineEstShinjuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/qZ7HhsbaG7nG4oFLA'),
    link('樓層指南', 'https://www.lumine.ne.jp/est/floorguide/'),
    link('餐廳選擇', 'https://www.lumine.ne.jp/est/restaurant/'),
  ],
  'tokyo-MeijiShrine': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/NNNsigmHT6AaDZdV8'),
  ],
  'tokyo-LaforetHarajuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/EzrujsJU2eUYnTkg7'),
    link('樓層指南', 'https://www.laforet.ne.jp/shop_search/floor/'),
  ],
  'tokyo-TokyuPlazaHarajuku': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/MJqy8T6jsY5EUioTA'),
    link('樓層指南', 'https://tokyu-plaza.com.t.auj.hp.transer.com/omokado/shop/floor'),
  ],
  'tokyo-TokyuPlazaHara': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/Tenh4twPQMnrpD7SA'),
    link('樓層指南', 'https://tokyu-plaza.com.t.auj.hp.transer.com/omokado/shop/floor'),
  ],
  'tokyo-KiddyLand': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/KXukhiPbywMWkheQ8'),
    link('樓層指南', 'https://www.kiddyland.co.jp/harajuku/'),
  ],
  'shibuya-sky': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/tswXZepQwLL3eySq8'),
    link('Shibuya Sky 票券', 'https://www.kkday.com/zh-tw/product/133300-shibuya-sky-observatory-e-ticket-tokyo?cid=22312'),
    link('展望台路線', 'https://www.instagram.com/reel/DWJbrmXFDuf/'),
  ],
  'tokyo-ShibuyaScrambleSquare': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/KnLLQa7NAu5pQDvH6'),
    link('樓層指南', 'https://www.shibuya-scramble-square.com.t.apy.hp.transer.com/floorguide/'),
  ],
  'tokyo-HachikoStatue': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/oHwsyonnRQ3An6j5A'),
  ],
  'tokyo-ShibuyaCrossing': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/Z1gHe5uyBz1CQCra8'),
  ],
  'tokyo-TsukijiMarket': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/y25aP3aZBWxa387k7'),
  ],
  'tokyo-ItoyaGinza': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/QS6Js6NJPgsurebV8'),
    link('樓層指南', 'https://www.ito-ya.co.jp/ext/store/ginza/ginza/index.html'),
  ],
  'tokyo-MujiGinza': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/CX9K2pyxoykPPWhi9'),
    link('樓層指南', 'https://shop.muji.com/jp/ginza/'),
  ],
  'tokyo-SongwuGinza': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/vtmcTPEJ6CkLoo1B9'),
    link('樓層指南', 'https://www.matsuyaginza.com/cn/ginza/floor?tab=matsuya-ginza-main-building'),
  ],
  'tokyo-GinzaSix': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/EJuA6gQyxL5yAGn1A'),
    link('樓層指南', 'https://ginza6.tokyo.t.abf.hp.transer.com/shops/'),
    link('餐廳', 'https://ginza6.tokyo.t.abf.hp.transer.com/shops/restaurant_cafe_bar'),
  ],
  'tokyo-SanyueGinza': [
    link('PDF Google 地圖', 'https://maps.app.goo.gl/y3JksXCC7MUc4WJe7'),
    link('樓層指南', 'https://www.mistore.jp.t.az.hp.transer.com/store/ginza/shops.html'),
    link('餐廳', 'https://www.ginzadining.com/zh-hant'),
  ],
}

function isTokyoJourneyMapLink(href: string) {
  return /(?:maps\.app\.goo\.gl|google\.[^/]+\/maps|naver\.me|map\.naver\.com)/i.test(href)
}

export const tokyoJourneyBookUserLinks: Record<string, JourneyLink[]> = Object.fromEntries(
  Array.from(new Set([
    ...Object.keys(tokyoJourneyBookUserLinksRaw),
    ...Object.keys(tokyoJourneyRestaurantAlternativeLinks),
  ]))
    .map((placeId) => [
      placeId,
      [
        ...(tokyoJourneyBookUserLinksRaw[placeId] ?? []).filter((item) => !isTokyoJourneyMapLink(item.href)),
        ...(tokyoJourneyRestaurantAlternativeLinks[placeId] ?? []),
      ],
    ])
    .filter(([, links]) => links.length > 0),
)

const tokyoJourneyBookNotesRaw: Record<string, string> = {
  'tokyo-UenoPark': 'Day 1 起手式，從上野公園一路串上野東照宮／五條天神社／上野大佛；1–2 小時逛，05:00–23:00。',
  'custom-tokyo-ueno-tosho-gu': 'Day 1 09:00–16:30，門票 500 日圓。',
  'custom-tokyo-gojo-tenjinsha': 'Day 1 06:00–17:00。',
  'custom-tokyo-ueno-daibutsu': 'Day 1 佛像打卡點。',
  'custom-tokyo-kiyomizu-kannondo': 'Day 1 09:00–17:00。',
  'custom-tokyo-shinobazu-pond': 'Day 1 可划船，半小時 800 日圓。',
  'tokyo-AmeyokoMarket': '商店街；Day 1／Day 2 都可補逛，藥妝、Donki、吉池都在這一帶。',
  'tokyo-YutachomeGikichi': 'Day 1 補貨點，Uniqlo 和 GU 都能一起逛；09:30–20:00。',
  'custom-tokyo-gyukatsu-motomura-ueno': 'Day 1 晚餐候選之一。',
  'custom-tokyo-tsukishima-monja-mohji': 'Day 1 晚餐候選之一。',
  'custom-tokyo-kamoto-negi': 'Day 1 晚餐候選之一。',
  'custom-tokyo-asakusa-tourist-info': 'Day 2 先上 8 樓觀景台看淺草寺和晴空塔。',
  'custom-tokyo-asakusa-kaminarimon': 'Day 2 先拍雷門。',
  'custom-tokyo-yoroshi-cosmedo': 'Day 2 仲見世商店街小物。',
  'custom-tokyo-asakusa-kibidango': 'Day 2 仲見世商店街小吃。',
  'custom-tokyo-asakusa-kagetsudo': 'Day 2 仲見世商店街小吃。',
  'custom-tokyo-asakusa-fried-meatball': 'Day 2 仲見世商店街小吃。',
  'tokyo-AsakusaTemple': 'Day 2 上午慢慢走，先淺草文化觀光中心，再進雷門和淺草寺；可拜拜和買御守，06:00–18:00。',
  'custom-tokyo-misojyu': 'Day 2 備用早餐／早午餐。',
  'custom-tokyo-asakusa-imahan': 'Day 2 午餐候選之一。',
  'custom-tokyo-asakusa-unagitetsu': 'Day 2 午餐候選之一。',
  'tokyo-TokyoSkytree': 'Day 2 1–4 樓商場，想吃飯可以直接看樓層或餐廳清單；10:00–21:00。',
  'tokyo-skytree': '350m 天望甲板＋450m 天望回廊；Day 2 16:00–17:00 進場，看白天和夜景一次收，10:00–22:00。',
  'custom-tokyo-rokurinsha': 'Day 2 晚餐候選之一。',
  'custom-tokyo-kaiten-sushi': 'Day 2 晚餐候選之一。',
  'custom-tokyo-jojoen': 'Day 2 晚餐候選之一。',
  'custom-tokyo-imperial-east-garden': 'Day 3 皇居東御苑，和外苑一起散步最順。',
  'custom-tokyo-imperial-outer-garden': 'Day 3 皇居外苑起點。',
  'custom-tokyo-wadakura-fountain-park': 'Day 3 和田倉噴水公園。',
  'custom-tokyo-nijubashi': 'Day 3 二重橋拍照點。',
  'custom-tokyo-sakurada-mon': 'Day 3 皇居外苑散步點。',
  'custom-tokyo-kusunoki-statue': 'Day 3 皇居外苑散步點。',
  'tokyo-ImperialPalace': '含吹上御苑、皇居東御苑、皇居外苑；Day 3 09:30 到桔梗門報到，10:00 場次。',
  'custom-tokyo-nikuto-tamago': 'Day 3 午餐候選之一。',
  'custom-tokyo-ramen-hayashi': 'Day 3 午餐候選之一。',
  'custom-tokyo-tsunahachi-tempura': 'Day 3 午餐候選之一。',
  'tokyo-BicCameraShinjuku': '3C／家電／電器；Day 3 新宿補貨點，10:00–22:00。',
  'tokyo-DisneyStoreShinjuku': '迪士尼商品，10:00–21:00。',
  'tokyo-KinokuniyaShinjuku': '書籍／文具，10:00–21:00。',
  'tokyo-HanaGardenShrine': '神社，24 小時營業。',
  'tokyo-YodobashiShinjuku': '3C／家電／相機，09:30–22:00。',
  'tokyo-LumineEstShinjuku': '生活用品／流行衣物／女生必逛，11:00–21:00；Day 3 晚餐可直接在 7 / 8 樓用餐。',
  'tokyo-MeijiShrine': '本殿和御苑，約 09:00–16:00；Day 4 上午進場最順。',
  'custom-tokyo-cosme-tokyo': 'Day 4 原宿美妝補貨點。',
  'custom-tokyo-takeshita-street': 'Day 4 原宿散步主線。',
  'custom-tokyo-daiso-harajuku': 'Day 4 原宿小補貨點。',
  'custom-tokyo-togo-shrine': 'Day 4 原宿神社點。',
  'custom-tokyo-omotesando': 'Day 4 高檔購物區。',
  'custom-tokyo-omotesando-hills': 'Day 4 高級購物商場。',
  'custom-tokyo-harry-potter-shop': 'Day 4 原宿購物點。',
  'custom-tokyo-ondenbashi-ato': 'Day 4 文化貓街。',
  'shibuya-sky': 'Day 4 17:00 左右最好，2 週前要搶票。',
  'tokyo-LaforetHarajuku': '時尚潮流店，11:00–20:00。',
  'tokyo-TokyuPlazaHarajuku': '時尚潮流店，11:00–23:00。',
  'tokyo-TokyuPlazaHara': '大型商場，11:00–20:00。',
  'tokyo-KiddyLand': '卡通玩具與周邊商品，11:00–20:00。',
  'tokyo-ShibuyaScrambleSquare': '澀谷購物商場，Shibuya Sky 在裡面，10:00–21:00；Day 4 晚餐下樓就到。',
  'tokyo-HachikoStatue': '拍照；Day 4 晚上拍照點。',
  'tokyo-ShibuyaCrossing': '人潮壯觀交叉路口；Day 4 必拍路口。',
  'custom-tokyo-shibuya-center-gai': 'Day 4 澀谷商店街。',
  'custom-tokyo-miyashita-park': 'Day 4 晚上補逛點。',
  'tokyo-TsukijiMarket': '生鮮／小吃／美食；Day 5 早午餐起點。',
  'custom-tokyo-namiyoke-inari': 'Day 5 簡單參觀。',
  'custom-tokyo-tsukiji-honganji': 'Day 5 簡單參觀。',
  'tokyo-ItoyaGinza': '文具店，10:00–20:00。',
  'tokyo-MujiGinza': '生活用品，11:00–21:00。',
  'tokyo-SongwuGinza': '高級購物場，11:00–20:00。',
  'tokyo-GinzaSix': '質感購物場，10:30–20:30；Day 5 午餐可排 6 樓。',
  'tokyo-SanyueGinza': '高級購物場，10:00–20:00；Day 5 午餐可排 11 樓。',
  'custom-tokyo-mitsui-garden-ueno': '上野住宿推薦。',
  'custom-tokyo-resol-ueno': '上野住宿推薦。',
  'custom-tokyo-sunroute-stellar-ueno': '上野住宿推薦。',
  'custom-tokyo-sutton-place-ueno': '上野住宿推薦。',
}

const tokyoJourneyCustomPlaceNotes = Object.fromEntries(
  Object.entries(tokyoJourneyCustomPlacesRaw).map(([id, placeItem]) => [bookPlaceId(id), placeItem.description]),
) as Record<string, string>

const tokyoJourneyBookNotesCombined = {
  ...tokyoJourneyCustomPlaceNotes,
  ...Object.fromEntries(
    Object.entries(tokyoJourneyBookNotesRaw).map(([id, note]) => {
      const placeId = bookPlaceId(id)
      const customDescription = tokyoJourneyCustomPlaceNotes[placeId]
      return [placeId, customDescription && customDescription !== note ? `${customDescription}｜${note}` : note]
    }),
  ),
} as Record<string, string>

function stripTokyoJourneyDayReferences(value: string) {
  return value.replace(/\bDay\s*\d+\s*/gi, '').replace(/\s{2,}/g, ' ').trim()
}

const tokyoJourneyRestaurantAlternatives: Record<string, string> = {
  'custom:tokyo-gyukatsu-motomura-ueno': '晚餐首選。備選：月島もんじゃ もへじ、らーめん 鴨to葱；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'custom:tokyo-asakusa-imahan': '午餐首選。備選：淺草鰻魚鐵；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'custom:tokyo-rokurinsha': '晚餐首選。備選：迴轉壽司、敘敘苑；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'custom:tokyo-nikuto-tamago': '午餐首選。備選：拉麵林田、綱八天婦羅；可直接點本卡片「連結」中的店名開啟 Google Maps。',
  'custom:tokyo-gyukatsu-motomura-harajuku': "午餐首選。備選：一蘭拉麵、Eggs 'n Things；可直接點本卡片「連結」中的店名開啟 Google Maps。",
  'custom:tokyo-sushi-zanmai': '市場用餐首選。備選：鳥めし 鳥藤分店、本まぐろ専門店 うに虎；可直接點本卡片「連結」中的店名開啟 Google Maps。',
}

const tokyoJourneyHotelSelectionNotes: Record<string, string> = Object.fromEntries(
  [
    'custom:tokyo-mitsui-garden-ueno',
    'custom:tokyo-resol-ueno',
    'custom:tokyo-sunroute-stellar-ueno',
    'custom:tokyo-sutton-place-ueno',
  ].map((placeId) => [
    placeId,
    '住宿四選一：比較本卡片的訂房連結後選定一間入住；複製行程後可刪除其餘住宿卡片。',
  ]),
)

export const tokyoJourneyBookNotes: Record<string, string> = Object.fromEntries(
  Object.entries(tokyoJourneyBookNotesCombined).map(([placeId, note]) => [
    placeId,
    [
      stripTokyoJourneyDayReferences(note),
      tokyoJourneyRestaurantAlternatives[placeId],
      tokyoJourneyHotelSelectionNotes[placeId],
    ].filter(Boolean).join('｜'),
  ]),
)

export const tokyoJourneyPreDeparture = {
  version: 2 as const,
  travelers: [{ id: 'traveler-owner', name: '我' }],
  checked: {},
  notes: {
    general:
      'NRT 用 Skyliner 進上野；HND 用單軌＋JR。晴空塔抓 16:00–17:00，皇居 10:00，Shibuya Sky 17:00 左右。記得先準備 Suica、eSIM / SIM、Google Maps、日圓換匯與住宿確認。',
  },
  customItems: [
    {
      id: 'custom-tokyo-skyliner',
      label: 'Skyliner 成田⇄上野',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-metro72',
      label: '東京地鐵 72 小時券',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-skytree-reservation',
      label: '晴空塔 16:00',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-imperial-reservation',
      label: '皇居 10:00',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-shibuya-sky',
      label: 'Shibuya Sky',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-esim',
      label: 'eSIM / SIM / WiFi',
      custom: true,
      categoryId: 'digital',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-suica',
      label: 'Suica',
      custom: true,
      categoryId: 'digital',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-google-maps',
      label: 'Google Maps',
      custom: true,
      categoryId: 'digital',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-exchange',
      label: '日圓換匯',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-trip-agoda',
      label: 'Trip / Agoda',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
    {
      id: 'custom-tokyo-hotel',
      label: '上野住宿',
      custom: true,
      categoryId: 'essentials',
      scope: 'personal',
      travelerIds: ['traveler-owner'],
    },
  ],
  removedItemIds: [],
  hiddenCategoryIds: [],
}

const tokyoJourneyPreDeparturePlaceIds = [
  'custom-tokyo-predeparture-entry',
  'custom-tokyo-predeparture-tickets',
  'custom-tokyo-predeparture-connectivity',
  'custom-tokyo-predeparture-tools',
  'custom-tokyo-predeparture-airport',
]

const tokyoJourneyDays: JourneyDay[] = [
  {
    title: '第一天．抵達上野・半日遊',
    placeIds: [
      'tokyo-UenoPark',
      'custom-tokyo-ueno-tosho-gu',
      'custom-tokyo-gojo-tenjinsha',
      'custom-tokyo-ueno-daibutsu',
      'custom-tokyo-kiyomizu-kannondo',
      'custom-tokyo-shinobazu-pond',
      'custom-tokyo-gyukatsu-motomura-ueno',
      'tokyo-AmeyokoMarket',
      'custom-tokyo-ameyoko-drugstores',
      'custom-tokyo-donki-ueno',
      'tokyo-YutachomeGikichi',
    ],
  },
  {
    title: '第二天．淺草・晴空塔・上野',
    placeIds: [
      'custom-tokyo-asakusa-tourist-info',
      'custom-tokyo-asakusa-kaminarimon',
      'custom-tokyo-asakusa-kibidango',
      'custom-tokyo-asakusa-kagetsudo',
      'custom-tokyo-yoroshi-cosmedo',
      'custom-tokyo-asakusa-fried-meatball',
      'tokyo-AsakusaTemple',
      'custom-tokyo-asakusa-imahan',
      'tokyo-TokyoSkytree',
      'tokyo-skytree',
      'custom-tokyo-rokurinsha',
      'tokyo-AmeyokoMarket',
    ],
  },
  {
    title: '第三天．皇居・新宿',
    placeIds: [
      'tokyo-ImperialPalace',
      'custom-tokyo-kikyomon-gate',
      'custom-tokyo-fukiage-garden',
      'custom-tokyo-imperial-east-garden',
      'custom-tokyo-imperial-outer-garden',
      'custom-tokyo-wadakura-fountain-park',
      'custom-tokyo-nijubashi',
      'custom-tokyo-sakurada-mon',
      'custom-tokyo-kusunoki-statue',
      'custom-tokyo-nikuto-tamago',
      'tokyo-BicCameraShinjuku',
      'tokyo-DisneyStoreShinjuku',
      'tokyo-KinokuniyaShinjuku',
      'tokyo-HanaGardenShrine',
      'tokyo-YodobashiShinjuku',
      'tokyo-LumineEstShinjuku',
      'custom-tokyo-godzilla-head',
    ],
  },
  {
    title: '第四天．原宿・涉谷',
    placeIds: [
      'tokyo-MeijiShrine',
      'custom-tokyo-cosme-tokyo',
      'custom-tokyo-takeshita-street',
      'custom-tokyo-daiso-harajuku',
      'custom-tokyo-togo-shrine',
      'custom-tokyo-gyukatsu-motomura-harajuku',
      'custom-tokyo-omotesando',
      'tokyo-LaforetHarajuku',
      'tokyo-TokyuPlazaHarajuku',
      'tokyo-TokyuPlazaHara',
      'custom-tokyo-omotesando-hills',
      'custom-tokyo-harry-potter-shop',
      'tokyo-KiddyLand',
      'custom-tokyo-ondenbashi-ato',
      'shibuya-sky',
      'tokyo-ShibuyaScrambleSquare',
      'tokyo-HachikoStatue',
      'tokyo-ShibuyaCrossing',
      'custom-tokyo-shibuya-center-gai',
      'custom-tokyo-miyashita-park',
    ],
  },
  {
    title: '第五天．築地市場・銀座・返程',
    placeIds: [
      'tokyo-TsukijiMarket',
      'custom-tokyo-namiyoke-inari',
      'custom-tokyo-tsukiji-honganji',
      'custom-tokyo-sushi-zanmai',
      'tokyo-ItoyaGinza',
      'tokyo-MujiGinza',
      'tokyo-SongwuGinza',
      'tokyo-SanyueGinza',
      'tokyo-GinzaSix',
    ],
  },
]

function journeyDay(placeIds: string[]) {
  return placeIds.map(bookPlaceId).join('.')
}

export const tokyoJourneyItems = [
  dayItem(1, '第一天．抵達上野・半日遊'),
  'custom:tokyo-narita-airport',
  transportItem(
    'journey-d1-airport',
    'train',
    'NRT：B1 用 QR code 換 Skyliner；HND：西瓜卡搭單軌電車再轉 JR 進上野。',
    'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php',
  ),
  'custom:tokyo-mitsui-garden-ueno',
  'custom:tokyo-resol-ueno',
  'custom:tokyo-sunroute-stellar-ueno',
  'custom:tokyo-sutton-place-ueno',
  ...tokyoJourneyDays[0].placeIds.map(bookPlaceId),

  dayItem(2, '第二天．淺草・晴空塔・上野'),
  transportItem('journey-d2-subway', 'subway', '上野站先換 72 小時東京地鐵券。'),
  ...tokyoJourneyDays[1].placeIds.slice(0, 7).map(bookPlaceId),
  transportItem('journey-d2-skytree', 'subway', '淺草站 → 押上站，先逛晴空街道再上晴空塔。'),
  ...tokyoJourneyDays[1].placeIds.slice(7, 11).map(bookPlaceId),
  transportItem('journey-d2-return', 'subway', '東館 B3 回上野，體力夠再去阿美橫。'),
  ...tokyoJourneyDays[1].placeIds.slice(11).map(bookPlaceId),

  dayItem(3, '第三天．皇居・新宿'),
  transportItem('journey-d3-imperial', 'subway', '上野 → 日本橋 → 大手町 → 桔梗門，09:30 報到、10:00 場次。', 'https://sankan.kunaicho.go.jp/english/index.html'),
  ...tokyoJourneyDays[2].placeIds.slice(0, 9).map(bookPlaceId),
  transportItem('journey-d3-shinjuku', 'subway', '霞關站 M15 → 新宿三丁目站 M09。', 'https://maps.app.goo.gl/mTVoXmYfui1WqsXR9'),
  ...tokyoJourneyDays[2].placeIds.slice(9).map(bookPlaceId),

  dayItem(4, '第四天．原宿・涉谷'),
  transportItem('journey-d4-meiji', 'subway', '上野 → 表參道 → 明治神宮前，2 號出口。'),
  ...tokyoJourneyDays[3].placeIds.slice(0, 5).map(bookPlaceId),
  ...tokyoJourneyDays[3].placeIds.slice(5, 6).map(bookPlaceId),
  ...tokyoJourneyDays[3].placeIds.slice(6, 11).map(bookPlaceId),
  transportItem('journey-d4-shibuya', 'walk', '走路或搭 JR 山手線前往 Shibuya Sky，17:00 左右最好。'),
  ...tokyoJourneyDays[3].placeIds.slice(11).map(bookPlaceId),

  dayItem(5, '第五天．築地市場・銀座・返程'),
  transportItem('journey-d5-tsukiji', 'subway', '上野 H18 → 築地 H11。'),
  ...tokyoJourneyDays[4].placeIds.slice(0, 4).map(bookPlaceId),
  transportItem('journey-d5-ginza', 'subway', '築地 H11 → 銀座 H09。', 'https://maps.app.goo.gl/t3s2bFV6FpvzwAkZ8'),
  ...tokyoJourneyDays[4].placeIds.slice(4).map(bookPlaceId),
  transportItem('journey-d5-airport', 'train', '上野搭 Skyliner 回成田；若去羽田，JR 到濱松町再轉單軌。'),

] as const

export const tokyoJourneyPlan = [
  ...tokyoJourneyDays.map((day) => journeyDay(day.placeIds)),
].join('|')

export const tokyoJourneyBook = {
  city: '東京五日',
  items: tokyoJourneyItems,
  notes: tokyoJourneyBookNotes,
  custom_places: tokyoJourneyCustomPlaces,
  user_links: tokyoJourneyBookUserLinks,
  pre_departure: tokyoJourneyPreDeparture,
}
