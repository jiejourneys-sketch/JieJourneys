import type { CityCard } from '@/components/CityTabbedList'

type TicketLink = [label: string, href: string, primary?: boolean]

const tripTicketUrl = (path: string) =>
  `https://tw.trip.com${path}?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=`

const oneDayTicket = (title: string, links: TicketLink[], index: number): CityCard => ({
  title,
  meta: '京都・奈良一日遊票券',
  area: '一日遊',
  datasetKey: 'title',
  datasetValue: title,
  actions: links.map(([label, href, primary]) => ({
    label,
    href,
    className: primary ? 'btn primary' : 'btn',
    event: `kyotonaraticket_oneday_${String(index + 1).padStart(2, '0')}_${label.toLowerCase()}`,
    platform: label,
    section: 'ticket_card',
  })),
})

const spotTicket = (title: string, meta: string, links: TicketLink[], index: number): CityCard => ({
  title,
  meta,
  area: '景點・體驗',
  datasetKey: 'title',
  datasetValue: title,
  actions: links.map(([label, href, primary]) => ({
    label,
    href,
    className: primary ? 'btn primary' : 'btn',
    event: `kyotonaraticket_spot_${String(index + 1).padStart(2, '0')}_${label.toLowerCase()}`,
    platform: label,
    section: 'ticket_card',
  })),
})

export const kyotoNaraOneDayTagOrder = [
  '天橋立View Land',
  '天橋立傘松公園',
  '伊根舟屋',
  '美山合掌村',
  '嵐山竹林',
  '嵐山小火車',
  '金閣寺',
  '清水寺',
  '二條城',
  '伏見稻荷大社',
  '奈良公園',
  '東大寺',
  '友禪光林',
  '宇治',
  '平等院',
  '三千院',
]

export const kyotoNaraOneDayTagSet = new Set(kyotoNaraOneDayTagOrder)

const ticketEntries: [string, TicketLink[]][] = [
  ['天橋立View Land+智恩寺+天橋立纜車+伊根舟屋', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/25439-amanohashidate-day-trip-kyoto-ine-funaya-ine-bay-cruise-depart-from-osaka?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/154563-japan-s-three-most-scenic-spots-amanohashidate-ine-funaya-and-ine/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/64951281?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16658154'],
  ]],
  ['天橋立View Land+智恩寺+元伊勢籠神社+天橋立觀光船+天橋立傘松公園', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/163483?cid=22312', true],
  ]],
  ['天橋立傘松公園+智恩寺+天橋立觀光船+天橋立纜車+美山合掌村', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/147488-amanohashidate-tour-miyama-gassho-village-crab-osaka-namba-kyoto?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/19058-amanohashidate-miyama-day-tour-kyoto/?aid=93798'],
  ]],
  ['天橋立View Land+天橋立傘松公園+伊根舟屋+美山合掌村', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/155289?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/110091-amanohashidate-ine-no-funaya-miyama-kayabuki-no-sato-day-trip/?aid=93798'],
  ]],
  ['天橋立View Land+智恩寺+伊根舟屋+美山合掌村', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/184538?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/123586-amanohashidate-ine-no-funaya-miyama-kayabuki-no-sato-day-tour/?aid=93798'],
  ]],
  ['勝尾寺+嵐山渡月橋+嵐山竹林+金閣寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/286142?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/158704-kyoto-osaka-top-attractions-day-tour-from-osaka/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/87078148/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234'],
  ]],
  ['勝尾寺+嵐山渡月橋+嵐山竹林+清水寺/美山合掌村', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/263298?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/159276-one-day-tour-of-famous-scenic-spots-in-kyoto-and-osaka/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/93178236?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234'],
  ]],
  ['勝尾寺+嵐山渡月橋+嵐山竹林+伏見稻荷大社', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/531168?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/142228-kyoto-nara-arashiyama-spring-cherry-blossom-day-tour-from-osaka/?aid=93798'],
  ]],
  ['勝尾寺+嵐山渡月橋+嵐山竹林+嵐山小火車+清水寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/284721?cid=22312', true],
  ]],
  ['勝尾寺+嵐山竹林+奈良公園+東大寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/139634-kyoto-day-tour-arashiyama-yasaka-shrine-hanamikoji-nara-park-todaiji-temple-kimono-experience-japan?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/84040-narakyotobustour-osaka/?aid=93798'],
  ]],
  ['嵐山竹林+嵐山小火車+保津川遊船', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/138380?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/168956-sagano-romantic-train-hozugawa-river-boat-ride-hozugawa-kudari-one-day-sightseeing-tour/?aid=93798'],
  ]],
  ['嵐山渡月橋+嵐山竹林+金閣寺+清水寺+伏見稻荷大社', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/4073-kyoto-day-tour-from-osaka-arashiyama-fushimi-inari-taisha-shrine-kinkaku-ji-kiyomizu-temple?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/3208-kyoto-temples-shrines-day-tour-osaka/?aid=93798'],
  ]],
  ['嵐山渡月橋+嵐山竹林+金閣寺+二條城+伏見稻荷大社', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/279525?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/144196-kyoto-panoramic-day-tour-kinkakuji-temple-arashiyama-nijo-castle/?aid=93798'],
  ]],
  ['嵐山渡月橋+嵐山竹林+金閣寺+伏見稻荷大社+奈良公園+東大寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/13894-kyoto-nara-ushimi-inari-taisha-shrine-arashiyama-nara-park?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/16167-nara-day-tour-kyoto/?aid=93798'],
  ]],
  ['嵐山竹林+嵐山小火車+友禪光林+伏見稻荷大社+奈良公園', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/186877?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/143719-kyoto-scenic-exploration-and-nara-deer-interaction-experience-tour/?aid=93798'],
  ]],
  ['嵐山渡月橋+嵐山竹林+伏見稻荷大社+奈良公園', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/270423-kyoto-nara-day-tour-arashiyama-nara-park-fushimi-inari-bamboo?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/110001-kyoto-nara-deer-arashiyama-train-cherry-blossom-one-day-tour/?aid=93798'],
  ]],
  ['清水寺+伏見稻荷大社+奈良公園+東大寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/135949-japan-kyoto-nara-day-tour-kiyomizu-temple-hanami-koji-fushimi-toka-shrine-nara-park?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/87236-kyoto-tour-nara/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/67875292/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234'],
  ]],
  ['宇治+平等院+金閣寺+清水寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/269284?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/122392-kinkakuji-kiyomizudera-uji-river-byodoin-one-day-tour/?aid=93798'],
  ]],
  ['宇治+平等院+伏見稻荷大社+奈良公園/勝尾寺/東大寺', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/268864?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/156282-uji-byodo-in-fushimi-inari-taisha-katsuoji-minoh-falls-day-tour/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/91759340/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234'],
  ]],
  ['三千院+貴船神社+嵐山竹林+嵐山小火車+友禪光林', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/251019?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/199514-one-day-sagano-scenic-railway-in-arashiyama/?aid=93798'],
    ['Trip', 'https://tw.trip.com/things-to-do/detail/85773583/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16661234'],
  ]],
  ['白鬚神社+琵琶湖觀景台+琵琶湖纜車+三千院+滿月寺+La Collina 近江八幡', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/196165?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/127158-lake-biwa-shirahige-shrine-ukimido-one-day-tour-from-osaka-kyoto/?aid=93798'],
    ['Trip', 'https://tw.trip.com/travel-guide/attraction/izumisano/natural-hot-spring-senshu-no-yu-kansai-airport-144941951/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D16637252'],
  ]],
]

export const kyotoNaraOneDayTicketCards = ticketEntries
  .map(([title, links], index) => ({
    ...oneDayTicket(title, links, index),
    tags: kyotoNaraOneDayTagOrder.filter((tag) => title.split(/[+/]/).some((part) => part.trim() === tag)),
  }))
  .sort((a, b) => {
    const aIndex = kyotoNaraOneDayTagOrder.findIndex((tag) => a.tags?.includes(tag))
    const bIndex = kyotoNaraOneDayTagOrder.findIndex((tag) => b.tags?.includes(tag))
    return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex)
  })

const spotTicketEntries: [string, string, TicketLink[]][] = [
  ['teamLab Biovortex 京都', '京都車站｜沉浸式數位藝術，適合雨天、傍晚或親子行程', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/533773?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/167098-teamlab-kyoto/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kyoto/teamlab-biovortex-kyoto-152859295/')],
  ]],
  ['京都鐵道博物館', '京都車站｜鐵道展示與互動體驗，適合親子與鐵道迷', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/123551-kyoto-railway-museum-tickets-japan?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/27246-kyoto-railway-museum-ticket/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kyoto/kyoto-railway-museum-39226405/')],
  ]],
  ['京都水族館', '京都車站｜梅小路公園旁的室內景點，適合親子與雨天備案', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/149556-kyoto-aquarium-admission-ticket-japan?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/15334-aquarium-admission-ticket-kyoto/?aid=93798'],
  ]],
  ['Nidec 京都塔展望台', '京都車站｜抵達日、離開日前後可安排的市景展望台', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/21147-kyoto-tower-observation-deck-ticket-japan?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/1464-kyoto-tower-admission-ticket-kyoto/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kyoto/kyoto-tower-10558700/')],
  ]],
  ['京都和服租借｜Ookini 清水寺店', '東山・祇園｜和服、髮型與攝影可依方案選擇，需預留換裝時間', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/574785?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/114571-kimono-rental-japanese-makeup-photoshoot-by-ookini-kiyomizudera/?aid=93798'],
    ['Trip', tripTicketUrl('/things-to-do/detail/105134050/')],
  ]],
  ['京都和服租借｜Okimono屋 清水寺店', '東山・祇園｜清水寺腳下，可選和服／浴衣、外拍與隔日歸還方案', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/114983-kyoto-kimono-rental-at-okimonoya-japan?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/2826-kimono-ok-kimono-rental-kyoto/?aid=93798'],
    ['Trip', tripTicketUrl('/things-to-do/detail/11462608/')],
  ]],
  ['京都和服租借｜MOCOMOCO 清水寺店', '東山・祇園｜五條坂旁的平地店，適合寄放行李後往清水寺、二年坂散步', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/554216?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/141642-kyoto-kiyomizudera-kimono-yukata-makeup-outdoor-photography-mocomoco/?aid=93798'],
  ]],
  ['保津川遊船｜龜岡→嵐山', '嵐山・龜岡｜沿保津川順流至嵐山，適合搭配嵐山小火車安排半日', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/39329-hozu-river-boat-ride-from-kameoka-to-arashiyama-kyoto?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/74947-kyoto-arashiyama-hozugawa-river-boat-ride/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kameoka/hozugawa-river-boat-ride-13493017')],
  ]],
  ['太秦映畫村', '京都西部｜江戶街景與影視主題園區，適合親子、動漫迷或主題行程', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/24831?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/48327-toei-kyoto-studio-park/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kyoto/uzumasa-kyoto-village-10758530/')],
  ]],
  ['GEAR 無語言劇場', '河原町・祇園｜融合默劇、舞蹈、魔術與雜耍的晚間表演，不受語言限制', [
    ['KKDAY', 'https://www.kkday.com/zh-tw/product/140658?cid=22312', true],
    ['KLOOK', 'https://www.klook.com/zh-TW/activity/109328-non-verbal-theatre-gear-show-admission-kyoto/?aid=93798'],
    ['Trip', tripTicketUrl('/travel-guide/attraction/kyoto/gear-non-verbal-theatre-58286149')],
  ]],
]

export const kyotoNaraSpotTicketCards = spotTicketEntries.map(([title, meta, links], index) =>
  spotTicket(title, meta, links, index),
)
