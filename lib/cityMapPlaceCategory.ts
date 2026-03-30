/** 城市地圖共用：四類分類（釜山／東京／北越一致） */

export type CityMapPlaceCategory = 'spot' | 'free' | 'food' | 'hotel'

export const CITY_MAP_CATEGORY_LABEL: Record<CityMapPlaceCategory, string> = {
  spot: '票券',
  free: '景點',
  food: '商店',
  hotel: '住宿',
}

export const DEFAULT_CITY_MAP_CATEGORY_ON: Record<CityMapPlaceCategory, boolean> = {
  spot: true,
  free: true,
  food: true,
  hotel: true,
}

export const CITY_MAP_CATEGORY_TOGGLE_ITEMS: { key: CityMapPlaceCategory; label: string }[] = [
  { key: 'spot', label: '票券' },
  { key: 'free', label: '景點' },
  { key: 'food', label: '商店' },
  { key: 'hotel', label: '住宿' },
]

export function cityMapCategoriesAllOn(c: Record<CityMapPlaceCategory, boolean>): boolean {
  return c.spot && c.free && c.food && c.hotel
}

export function cityMapSoloCategory(
  key: CityMapPlaceCategory,
): Record<CityMapPlaceCategory, boolean> {
  return {
    spot: key === 'spot',
    free: key === 'free',
    food: key === 'food',
    hotel: key === 'hotel',
  }
}
