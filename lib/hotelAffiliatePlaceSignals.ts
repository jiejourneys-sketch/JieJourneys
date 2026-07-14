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
