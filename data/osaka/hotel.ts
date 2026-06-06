import type { CityCard, CityCardAction } from '@/components/CityTabbedList'
import type { MapPlace } from '@/lib/mapPlace'

type OsakaHotelInput = {
  slug: string
  name: string
  area: string
  meta: string
  lat: number
  lng: number
  googleMapsUrl: string
  tripUrl: string
  agodaUrl: string
}

function hotelEvent(prefix: string, slug: string, suffix: string) {
  return `${prefix}_hotel_${slug.replace(/-/g, '_')}_${suffix}`
}

function hotelBookingActions(hotel: OsakaHotelInput, prefix: 'osakamap' | 'osakahotel', section: string): CityCardAction[] {
  const actions: CityCardAction[] = []

  if (hotel.tripUrl) {
    actions.push({
      label: 'Trip',
      href: hotel.tripUrl,
      className: 'btn primary',
      event: hotelEvent(prefix, hotel.slug, 'trip'),
      platform: 'Trip',
      section,
    })
  }

  if (hotel.agodaUrl) {
    actions.push({
      label: 'Agoda',
      href: hotel.agodaUrl,
      className: actions.length === 0 ? 'btn primary' : 'btn',
      event: hotelEvent(prefix, hotel.slug, 'agoda'),
      platform: 'Agoda',
      section,
    })
  }

  return actions
}

function hotelMapActions(hotel: OsakaHotelInput): CityCardAction[] {
  return hotelBookingActions(hotel, 'osakamap', 'map_bar')
}

function hotelCardActions(hotel: OsakaHotelInput): CityCardAction[] {
  const placeId = `osaka-hotel-${hotel.slug}`

  return [
    ...hotelBookingActions(hotel, 'osakahotel', 'hotel_card'),
    {
      label: '地圖',
      href: `/osaka/map?place=${placeId}`,
      className: 'btn',
      event: hotelEvent('osakahotel', hotel.slug, 'map'),
      platform: 'Map',
      section: 'hotel_card',
    },
  ]
}

function hotelToMapPlace(hotel: OsakaHotelInput): MapPlace {
  return {
    id: `osaka-hotel-${hotel.slug}`,
    category: 'hotel',
    name: hotel.name,
    description: hotel.meta,
    lat: hotel.lat,
    lng: hotel.lng,
    spotGoogleMapsUrl: hotel.googleMapsUrl,
    mapButtonMapEvent: hotelEvent('osakamap', hotel.slug, 'map'),
    hotelActions: hotelMapActions(hotel),
  }
}

function hotelToCard(hotel: OsakaHotelInput): CityCard {
  return {
    title: hotel.name,
    meta: hotel.meta,
    area: hotel.area,
    datasetKey: 'hotel',
    datasetValue: hotel.name,
    actions: hotelCardActions(hotel),
    lat: hotel.lat,
    lng: hotel.lng,
  }
}

const osakaAdditionalHotelInputs: OsakaHotelInput[] = [
  // Trip / Agoda 連結填在每間飯店的 tripUrl / agodaUrl；留空就不顯示該按鈕。
  {
    slug: 'cross-hotel-osaka',
    name: '大阪十字飯店',
    area: '道頓堀/難波',
    meta: '道頓堀/難波｜4星級、道頓堀旁，逛街吃宵夜最順手',
    lat: 34.6697148,
    lng: 135.5007625,
    googleMapsUrl: 'https://maps.app.goo.gl/AmoEgJp6bCXwyrgy7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-688204/cross-hotel-osaka?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9076379',
  },
  {
    slug: 'karaksa-hotel-osaka-namba',
    name: '唐草飯店大阪難波',
    area: '道頓堀/難波',
    meta: '道頓堀/難波｜4星級、美國村旁，親友同行與連通房需求很方便',
    lat: 34.6705808,
    lng: 135.4989305,
    googleMapsUrl: 'https://maps.app.goo.gl/34Ao5qQrBeohqsSV7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-9147713/karaksa-hotel-osaka-namba/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=2284811',
  },
  {
    slug: 'hotel-monterey-grasmere-osaka',
    name: '大阪蒙特利格拉斯米爾飯店',
    area: '道頓堀/難波',
    meta: '道頓堀/難波｜4星級、JR難波與OCAT旁，機場巴士動線強',
    lat: 34.6667155,
    lng: 135.4961758,
    googleMapsUrl: 'https://maps.app.goo.gl/KboCkLtJRX3j4mGF7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-688216/hotel-monterey-grasmere-osaka?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=161798',
  },
  {
    slug: 'onyado-nono-namba',
    name: '天然溫泉 御宿野乃 難波',
    area: '道頓堀/難波',
    meta: '道頓堀/難波｜4星級、近日本橋與道頓堀，天然溫泉大浴場加分',
    lat: 34.667985,
    lng: 135.506326,
    googleMapsUrl: 'https://maps.app.goo.gl/ajc6qTy1ATssSUWk8',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-5782369/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1270912',
  },
  {
    slug: 'hiyori-hotel-osaka-namba-station',
    name: '日和飯店大阪難波站前',
    area: '道頓堀/難波',
    meta: '道頓堀/難波｜4星級、南海難波站近，往返關西機場很輕鬆',
    lat: 34.6627374,
    lng: 135.500701,
    googleMapsUrl: 'https://maps.app.goo.gl/RVBHHk5wWJTSGksE7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-33552337?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=6578778',
  },
  {
    slug: 'mimaru-osaka-shinsaibashi-west',
    name: 'MIMARU 大阪心齋橋 WEST',
    area: '心齋橋',
    meta: '心齋橋｜4星級，多人家庭、親子與連住需求很適合',
    lat: 34.6761917,
    lng: 135.4958782,
    googleMapsUrl: 'https://maps.app.goo.gl/6oXi5hHbpkHPn1ZJ7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-56996772/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=11029373',
  },
  {
    slug: 'hotel-the-flag-shinsaibashi',
    name: 'HOTEL THE FLAG 心齋橋',
    area: '心齋橋',
    meta: '心齋橋｜3星級、設計感強，心齋橋商店街與地鐵都近',
    lat: 34.6741732,
    lng: 135.5031184,
    googleMapsUrl: 'https://maps.app.goo.gl/yVbohMhmTBTEMEZq5',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-13660429/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9076373',
  },
  {
    slug: 'hotel-hankyu-international',
    name: '阪急國際飯店',
    area: '梅田/大阪站',
    meta: '梅田/大阪站｜5星級、茶屋町高樓層飯店，梅田逛街動線漂亮',
    lat: 34.7084962,
    lng: 135.498605,
    googleMapsUrl: 'https://maps.app.goo.gl/n2gNT3zX5mkFk7Hg7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-736871/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=8460',
  },
  {
    slug: 'hotel-granvia-osaka',
    name: '大阪格蘭比亞飯店',
    area: '梅田/大阪站',
    meta: '梅田/大阪站｜4星級、JR大阪站直結，跨城市移動非常省力',
    lat: 34.701726,
    lng: 135.4963754,
    googleMapsUrl: 'https://maps.app.goo.gl/zixmxfgu5cWcsm8j9',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-480887/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9076318',
  },
  {
    slug: 'hotel-monterey-osaka',
    name: '大阪蒙特利飯店',
    area: '梅田/大阪站',
    meta: '梅田/大阪站｜4星級、北新地與大阪站步行圈，有大浴場',
    lat: 34.6994979,
    lng: 135.4917808,
    googleMapsUrl: 'https://maps.app.goo.gl/aUsEWw9mL3rTSMym8',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-688197/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=9076335',
  },
  {
    slug: 'villa-fontaine-grand-osaka-umeda',
    name: 'Villa Fontaine Grand 大阪梅田',
    area: '梅田/大阪站',
    meta: '梅田/大阪站｜4星級、東梅田商圈新穎住宿，逛街吃飯方便',
    lat: 34.7013187,
    lng: 135.5007784,
    googleMapsUrl: 'https://maps.app.goo.gl/KmmokvuekBdKCWKG7',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-92816062/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=34465964',
  },
  {
    slug: 'the-park-front-hotel-usj',
    name: '環球影城前飯店',
    area: '環球影城',
    meta: '環球影城｜4星級、USJ 門口正前方，親子與早入園最省力',
    lat: 34.6678977,
    lng: 135.4372576,
    googleMapsUrl: 'https://maps.app.goo.gl/T2TSRWgKfdEQseTS9',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-2803775/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=1155344',
  },
  {
    slug: 'liber-hotel-osaka',
    name: 'LIBER HOTEL 大阪',
    area: '環球影城',
    meta: '環球影城｜4星級、櫻島站旁，房間與大浴場評價穩',
    lat: 34.661254,
    lng: 135.432892,
    googleMapsUrl: 'https://maps.app.goo.gl/DzCZvk6wQiacbuf57',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-29538280/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=10565477',
  },
  {
    slug: 'omo7-osaka',
    name: 'OMO7 大阪 by 星野集團',
    area: '新今宮',
    meta: '新今宮｜4星級、星野集團城市飯店，往難波、天王寺與機場動線彈性高',
    lat: 34.6508135,
    lng: 135.5018895,
    googleMapsUrl: 'https://maps.app.goo.gl/Czv9nSA3ckXhNYj48',
    tripUrl: 'https://tw.trip.com/hotels/osaka-hotel-detail-84903681/?Allianceid=6833709&SID=242535686&trip_sub1=&trip_sub3=D17634899',
    agodaUrl: 'https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1945734&hid=30161689',
  },
]

export const osakaAdditionalHotelMapPlaces: MapPlace[] = osakaAdditionalHotelInputs.map(hotelToMapPlace)

export const osakaAdditionalHotelCards: CityCard[] = osakaAdditionalHotelInputs.map(hotelToCard)

export const osakaAdditionalHotelSlugs = osakaAdditionalHotelInputs.map((hotel) => hotel.slug)

export const osakaAdditionalHotelCardBySlug: Record<string, CityCard> = Object.fromEntries(
  osakaAdditionalHotelInputs.map((hotel) => [hotel.slug, hotelToCard(hotel)]),
)

export const osakaAdditionalHotelMapPlaceBySlug: Record<string, MapPlace> = Object.fromEntries(
  osakaAdditionalHotelInputs.map((hotel) => [hotel.slug, hotelToMapPlace(hotel)]),
)
