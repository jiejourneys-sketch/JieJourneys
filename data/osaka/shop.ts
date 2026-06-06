import type { CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'

type OsakaShopActionInput = {
  label: string
  href: string
  primary?: boolean
  event?: string
}

type OsakaShopInput = {
  slug: string
  name: string
  description: string
  lat: number
  lng: number
  googleMapsUrl: string
  actions?: OsakaShopActionInput[]
}

function osakaShopMapEvent(slug: string, suffix: string) {
  return `osakamap_shop_${slug.replace(/-/g, '_')}_${suffix}`
}

function osakaShopActions(slug: string, actions: OsakaShopActionInput[] = []): CityCardAction[] | undefined {
  if (actions.length === 0) return undefined

  return actions.map((action, index) => ({
    label: action.label,
    href: action.href,
    className: (action.primary ?? index === 0) ? 'btn primary' : 'btn',
    mapEvent: action.event ?? osakaShopMapEvent(slug, `link_${index + 1}`),
  }))
}

function osakaShopPlace(input: OsakaShopInput): MapPlace {
  return {
    id: `osaka-shop-${input.slug}`,
    category: 'shop',
    name: input.name,
    description: input.description,
    lat: input.lat,
    lng: input.lng,
    spotGoogleMapsUrl: input.googleMapsUrl,
    mapButtonMapEvent: osakaShopMapEvent(input.slug, 'map'),
    spotActions: osakaShopActions(input.slug, input.actions),
  }
}

const osakaShopInputs: OsakaShopInput[] = [
  {
    slug: 'grand-front-osaka',
    name: 'GRAND FRONT 大阪',
    description: '大阪站北側大型複合商場，南館、北館都有服飾雜貨與餐廳。',
    lat: 34.7038664,
    lng: 135.4949205,
    googleMapsUrl: 'https://maps.app.goo.gl/sEBwndk7TYf7LAg67',
    actions: [{ label: '店鋪搜尋', href: 'https://www.grandfront-osaka.jp/shop/' }],
  },
  {
    slug: 'lucua-osaka',
    name: 'LUCUA 大阪',
    description: '大阪站直通的大型車站型商場，LUCUA 與 LUCUA 1100 可一起逛。',
    lat: 34.7028866,
    lng: 135.4953236,
    googleMapsUrl: 'https://maps.app.goo.gl/GzRZckTwZsak96Wy6',
    actions: [{ label: '樓層圖', href: 'https://www.lucua.jp/zh/floormap/' }],
  },
  {
    slug: 'hankyu-umeda-main-store',
    name: '阪急百貨 梅田本店',
    description: '梅田代表性百貨，精品、美妝、服飾、生活雜貨與地下美食街都完整。',
    lat: 34.7028186,
    lng: 135.4985323,
    googleMapsUrl: 'https://maps.app.goo.gl/4RjAwagUf6jRkir28',
    actions: [{ label: '樓層圖', href: 'https://www.hankyu-dept.co.jp/honten/floor/index.html' }],
  },
  {
    slug: 'hankyu-sanbangai',
    name: '阪急三番街',
    description: '阪急大阪梅田站直通商場，地下街、服飾雜貨與美食區都方便。',
    lat: 34.7059668,
    lng: 135.4984748,
    googleMapsUrl: 'https://maps.app.goo.gl/us1yG5UXrozwvvML9',
    actions: [],
  },
  {
    slug: 'hep-five',
    name: '購物中心 HEP FIVE',
    description: '梅田購物中心，服飾雜貨、餐廳、摩天輪都在同一棟。',
    lat: 34.7040897,
    lng: 135.5004632,
    googleMapsUrl: 'https://maps.app.goo.gl/aMxmnGkeYvQJ7UXZ6',
    actions: [],
  },
  {
    slug: 'nu-chayamachi',
    name: 'NU 茶屋町',
    description: '梅田茶屋町一帶的時尚商場，服飾、雜貨、音樂與餐廳集中。',
    lat: 34.7069626,
    lng: 135.4990769,
    googleMapsUrl: 'https://maps.app.goo.gl/9daQ2ip165FyrFvF9',
    actions: [{ label: '樓層圖', href: 'https://nu-chayamachi.com/floor/1f.html' }],
  },
  {
    slug: 'links-umeda',
    name: 'LINKS UMEDA',
    description: '梅田大型商場，與友都八喜梅田相連，購物、餐廳與生活用品都集中。',
    lat: 34.704704,
    lng: 135.4965441,
    googleMapsUrl: 'https://maps.app.goo.gl/RFUujejiKD6M2vvz8',
    actions: [{ label: '樓層圖', href: 'https://links-umeda.jp/floormap/8/' }],
  },
  {
    slug: 'whity-umeda',
    name: 'Whity 梅田',
    description: '梅田代表性地下街，雨天動線方便，適合順路逛服飾、雜貨與餐廳。',
    lat: 34.7029675,
    lng: 135.4995272,
    googleMapsUrl: 'https://maps.app.goo.gl/r42cezm4qUdnwu9D9',
    actions: [{ label: '樓層圖', href: 'https://tw.whity.osaka-chikagai.jp/floor' }],
  },
  {
    slug: 'diamor-osaka',
    name: 'DIAMOR 大阪',
    description: '梅田地下街型購物商場，雨天也能順路逛服飾、雜貨與餐廳。',
    lat: 34.7003534,
    lng: 135.4974046,
    googleMapsUrl: 'https://maps.app.goo.gl/TCFuQi6CCA6FwJMdA',
    actions: [],
  },
  {
    slug: 'herbis-plaza-ent',
    name: 'HERBIS PLAZA ENT',
    description: '西梅田成熟風格商場，精品、餐廳、劇場與生活風格店較多。',
    lat: 34.6997829,
    lng: 135.4945698,
    googleMapsUrl: 'https://maps.app.goo.gl/WiiciqhraBXYa3nL6',
    actions: [],
  },
  {
    slug: 'kitte-osaka',
    name: 'KITTE 大阪',
    description: '大阪站西側新商場，主打日本各地物產、餐飲與特色選品。',
    lat: 34.7006219,
    lng: 135.4941733,
    googleMapsUrl: 'https://maps.app.goo.gl/7Rpud4soWn9YB13P6',
    actions: [
      {
        label: '樓層圖',
        href: 'https://osaka-jp--kitte-jp.translate.goog/gb/shopcat.jsp?cat=1&_x_tr_sl=auto&_x_tr_tl=zh-TW&_x_tr_hl=zh-TW',
      },
    ],
  },
  {
    slug: 'shinsaibashi-parco',
    name: '心齋橋 PARCO',
    description: '心齋橋大型流行商場，角色、動漫、服飾、雜貨與餐廳很集中。',
    lat: 34.6738473,
    lng: 135.5009574,
    googleMapsUrl: 'https://maps.app.goo.gl/CHF7ZWANwx4oW8Uz6',
    actions: [{ label: '樓層圖', href: 'https://tw.shinsaibashi.parco.jp/floor/' }],
  },
  {
    slug: 'daimaru-shinsaibashi',
    name: '大丸心齋橋店',
    description: '心齋橋老字號百貨，精品、美妝、食品與 PARCO 相連好安排。',
    lat: 34.6732406,
    lng: 135.5009613,
    googleMapsUrl: 'https://maps.app.goo.gl/mjuLXsvtLTZ4AUndA',
    actions: [{ label: '樓層圖', href: 'https://www.daimaru.co.jp/shinsaibashi-store/t/floorguide' }],
  },
  {
    slug: 'shinsaibashi-bigstep',
    name: '心齋橋 BIGSTEP',
    description: '美國村代表性商場，潮流服飾、古著、雜貨、餐飲與娛樂空間集中。',
    lat: 34.6724243,
    lng: 135.4987968,
    googleMapsUrl: 'https://maps.app.goo.gl/PbJ6pRGZCAZSCuAa7',
    actions: [{ label: '樓層圖', href: 'https://www.big-step.co.jp/floormap' }],
  },
  {
    slug: 'crysta-nagahori',
    name: 'Crysta 長堀',
    description: '心齋橋到長堀橋一帶的地下街商場，適合雨天移動與順路購物。',
    lat: 34.6750743,
    lng: 135.5019947,
    googleMapsUrl: 'https://maps.app.goo.gl/vNnF6PJ1T4vAJhSm8',
    actions: [{ label: '樓層圖', href: 'https://global.crystaweb.jp/zh-TW/floorguide/' }],
  },
  {
    slug: 'osaka-takashimaya',
    name: '大阪高島屋',
    description: '難波站前大型百貨，地下食品、精品、美妝和餐廳都適合集中採買。',
    lat: 34.6646089,
    lng: 135.5012633,
    googleMapsUrl: 'https://maps.app.goo.gl/moL5n6s2oeCT7zmn8',
    actions: [{ label: '樓層圖', href: 'https://www.takashimaya.co.jp/osaka/floor/' }],
  },
  {
    slug: 'namba-city',
    name: '難波 CITY',
    description: '南海難波站直通商場，適合和難波 Parks、高島屋一起排。',
    lat: 34.6639784,
    lng: 135.5015554,
    googleMapsUrl: 'https://maps.app.goo.gl/7TyW4mb7cveu4Un89',
    actions: [{ label: '樓層圖', href: 'https://nambacity.com.t.uz.hp.transer.com/floor/h_1f' }],
  },
  {
    slug: 'namba-parks',
    name: '難波 Parks',
    description: '南海難波站旁大型商場，屋頂庭園、服飾雜貨、餐廳和電影院都有。',
    lat: 34.6616083,
    lng: 135.5019349,
    googleMapsUrl: 'https://maps.app.goo.gl/xBnzJYFg8eSRYD6u9',
    actions: [{ label: '樓層圖', href: 'https://nambaparks.com.t.uq.hp.transer.com/floor/map2' }],
  },
  {
    slug: 'namba-walk',
    name: 'Namba Walk',
    description: '難波地下街商場，連接大阪難波、日本橋方向，逛街與轉乘都方便。',
    lat: 34.6670875,
    lng: 135.5030161,
    googleMapsUrl: 'https://maps.app.goo.gl/1qQRxN9DuNVwy5yL8',
    actions: [{ label: '樓層圖', href: 'https://tw.walk.osaka-chikagai.jp/floor' }],
  },
  {
    slug: 'abeno-harukas-kintetsu',
    name: '阿倍野 HARUKAS 近鐵本店',
    description: '天王寺阿倍野大型百貨，商場、餐廳、展望台可一起排進行程。',
    lat: 34.6460902,
    lng: 135.5134794,
    googleMapsUrl: 'https://maps.app.goo.gl/mwZ4ft37tBrJ8oVM6',
    actions: [{ label: '樓層圖', href: 'https://abeno-harukas.d-kintetsu.co.jp.t.aqg.hp.transer.com/shop/index.html' }],
  },
  {
    slug: 'tennoji-mio',
    name: '天王寺 MIO',
    description: '天王寺站直通商場，服飾雜貨、餐廳與車站動線很順。',
    lat: 34.6467023,
    lng: 135.5143947,
    googleMapsUrl: 'https://maps.app.goo.gl/wFYg3xZdxhgvHEyZA',
    actions: [{ label: '樓層圖', href: 'https://www.tennoji-mio.co.jp/lang/tw/floor' }],
  },
  {
    slug: 'abeno-qs-mall',
    name: "阿倍野 Q's Mall",
    description: '天王寺阿倍野的大型商場，服飾雜貨、餐廳、生活用品與娛樂店鋪完整。',
    lat: 34.6453267,
    lng: 135.511683,
    googleMapsUrl: 'https://maps.app.goo.gl/kbygMoYKmqS1CXKp9',
    actions: [{ label: '樓層圖', href: 'https://qs-mall.jp.t.arp.hp.transer.com/abeno/shop/floor' }],
  },
  {
    slug: 'lalaport-expocity',
    name: 'LaLaport EXPOCITY',
    description: '萬博紀念公園旁大型購物娛樂複合商場，適合和摩天輪、水族館一起排。',
    lat: 34.805489,
    lng: 135.5344665,
    googleMapsUrl: 'https://maps.app.goo.gl/Cm1BGdQJt3LFsGSm6',
    actions: [{ label: '樓層圖', href: 'https://mitsui-shopping-park.com/tw/lalaport/expocity/floor/' }],
  },
  {
    slug: 'mitsui-outlet-park-osaka-kadoma',
    name: '三井 Outlet Park 大阪門真',
    description: '門真大型 Outlet，與 LaLaport 門真同區，適合安排半日集中採買。',
    lat: 34.732043,
    lng: 135.584663,
    googleMapsUrl: 'https://maps.app.goo.gl/5vfqULmUcApXwjuC7',
    actions: [{ label: '樓層圖', href: 'https://mitsui-shopping-park.com/tw/mop/osakakadoma/search/floor2f.html' }],
  },
  {
    slug: 'rinkuu-premium-outlets',
    name: '臨空城 Premium Outlets',
    description: '關西機場附近大型 Outlet，適合排在抵達或離日前後採買。',
    lat: 34.4064643,
    lng: 135.2954403,
    googleMapsUrl: 'https://maps.app.goo.gl/EEws8J5GAjrARpxEA',
    actions: [],
  },
]

export const osakaShopMapPlaces: MapPlace[] = osakaShopInputs.map(osakaShopPlace)
