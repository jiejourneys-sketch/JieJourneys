export type HotelAffiliatePlaceSignal = 'lodging' | 'non_lodging' | 'unknown'

export const HOTEL_AFFILIATE_LODGING_GOOGLE_TYPES = new Set([
  'lodging',
  'hotel',
  'hostel',
  'motel',
  'inn',
  'resort_hotel',
  'guest_house',
  'bed_and_breakfast',
  'extended_stay_hotel',
  'serviced_apartment',
  'ryokan',
])

export const HOTEL_AFFILIATE_NON_LODGING_GOOGLE_TYPES = new Set([
  'airport',
  'amusement_park',
  'aquarium',
  'bakery',
  'bar',
  'bus_station',
  'cafe',
  'car_rental',
  'church',
  'convenience_store',
  'department_store',
  'gas_station',
  'hindu_temple',
  'hospital',
  'meal_delivery',
  'meal_takeaway',
  'mosque',
  'museum',
  'park',
  'parking',
  'pharmacy',
  'place_of_worship',
  'restaurant',
  'school',
  'shopping_mall',
  'store',
  'subway_station',
  'supermarket',
  'synagogue',
  'taxi_stand',
  'tourist_attraction',
  'train_station',
  'transit_station',
  'university',
  'zoo',
])

export function cleanHotelAffiliateGooglePlaceTypes(value: unknown, maxItems = 20) {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => {
      if (!item || item.length > 64 || !/^[a-z0-9_]+$/.test(item) || seen.has(item)) return false
      seen.add(item)
      return true
    })
    .slice(0, maxItems)
}

export function hotelAffiliateGooglePlaceTypeSignal(value: unknown): HotelAffiliatePlaceSignal {
  const types = cleanHotelAffiliateGooglePlaceTypes(value)
  if (types.some((type) => HOTEL_AFFILIATE_LODGING_GOOGLE_TYPES.has(type))) return 'lodging'
  if (types.some((type) => HOTEL_AFFILIATE_NON_LODGING_GOOGLE_TYPES.has(type))) return 'non_lodging'
  return 'unknown'
}

const LODGING_NAME_PATTERN =
  /\b(?:hotel|hotels|hostel|motel|inn|resort|ryokan|guest\s*house|guesthouse|pension|b&b|bnb|aparthotel|villa|stay|lodge)\b|\u5927?\u98ef\u5e97|\u5927?\u996d\u5e97|\u9152\u5e97|\u65c5\u9928|\u65c5\u9986|\u65c5\u5e97|\u65c5\u820d|\u65c5\u793e|\u6c11\u5bbf|\u4f4f\u5bbf|\u30db\u30c6\u30eb|\u65c5\u9928|\u65c5\u7c60|\u30ea\u30be\u30fc\u30c8|\u30b9\u30c6\u30a4|\u30b2\u30b9\u30c8\u30cf\u30a6\u30b9|\u30da\u30f3\u30b7\u30e7\u30f3|\ud638\ud154|\ubaa8\ud154|\ub9ac\uc870\ud2b8/i

const NON_LODGING_NAME_PATTERN =
  /\b(?:airport|station|restaurant|steakhouse|cafe|coffee|bar|shop|store|mall|market|museum|park|temple|shrine|tower|castle|aquarium|zoo|bus\s*stop|bus\s*station|train\s*station|subway\s*station)\b|\u6a5f\u5834|\u673a\u573a|\u8eca\u7ad9|\u8f66\u7ad9|\u99c5|\u9910\u5ef3|\u9910\u5385|\u98df\u5802|\u5496\u5561|\u5546\u5e97|\u767e\u8ca8|\u767e\u8d27|\u5e02\u5834|\u5e02\u573a|\u535a\u7269\u9928|\u535a\u7269\u9986|\u516c\u5712|\u516c\u56ed|\u5bfa|\u795e\u793e|\u5854|\u57ce|\u6c34\u65cf\u9928|\u6c34\u65cf\u9986|\u52d5\u7269\u5712|\u52a8\u7269\u56ed|\u7a7a\u6e2f|\u99c5|\u30ec\u30b9\u30c8\u30e9\u30f3|\u30ab\u30d5\u30a7|\u535a\u7269\u9928|\u516c\u5712|\uacf5\ud56d|\uc5ed|\uc2dd\ub2f9|\uce74\ud398|\ubc15\ubb3c\uad00|\uacf5\uc6d0/i

export function hotelAffiliatePlaceNameSignal(value: unknown): HotelAffiliatePlaceSignal {
  const text = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').join(' ')
    : typeof value === 'string'
      ? value
      : ''
  const normalized = text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
  if (!normalized) return 'unknown'
  if (LODGING_NAME_PATTERN.test(normalized)) return 'lodging'
  if (NON_LODGING_NAME_PATTERN.test(normalized)) return 'non_lodging'
  return 'unknown'
}
