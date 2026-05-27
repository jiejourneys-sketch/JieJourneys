/** Shared city-map categories.
 *
 * New semantic categories are ticket / spot / restaurant / shop / hotel.
 * free and food remain as legacy aliases while older data files are migrated.
 */

export type CityMapSemanticCategory = 'ticket' | 'spot' | 'restaurant' | 'shop' | 'hotel'
export type CityMapLegacyCategory = 'free' | 'food'
export type CityMapPlaceCategory = CityMapSemanticCategory | CityMapLegacyCategory

export const CITY_MAP_CATEGORY_LABEL: Record<CityMapPlaceCategory, string> = {
  ticket: '票券',
  spot: '景點',
  restaurant: '餐廳',
  shop: '商店',
  hotel: '住宿',
  free: '景點',
  food: '商店',
}

export const DEFAULT_CITY_MAP_CATEGORY_ON: Record<CityMapPlaceCategory, boolean> = {
  ticket: true,
  spot: true,
  restaurant: true,
  shop: true,
  hotel: true,
  free: true,
  food: true,
}

// Keep the default map toggle shape compatible with existing data until each
// city map is migrated to the semantic category names.
export const CITY_MAP_CATEGORY_TOGGLE_ITEMS: { key: CityMapPlaceCategory; label: string }[] = [
  { key: 'spot', label: '票券' },
  { key: 'free', label: '景點' },
  { key: 'shop', label: '商店' },
  { key: 'hotel', label: '住宿' },
]

export function cityMapCategoriesAllOn(c: Record<CityMapPlaceCategory, boolean>): boolean {
  return Object.values(c).every(Boolean)
}

export function cityMapSoloCategory(
  key: CityMapPlaceCategory,
): Record<CityMapPlaceCategory, boolean> {
  return {
    ticket: key === 'ticket',
    spot: key === 'spot',
    restaurant: key === 'restaurant',
    shop: key === 'shop',
    hotel: key === 'hotel',
    free: key === 'free',
    food: key === 'food',
  }
}
