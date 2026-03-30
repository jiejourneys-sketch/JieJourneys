import { getGtag } from '@/lib/gtag'

/**
 * 地圖 GA（程式組字）
 *
 * - **點側欄／清單方塊選景點**：`mapBarCardDataEvent` → DOM `data-event`，例如 `busanmap_busantower`。
 * - **點地圖圖釘**：`fireMapMarkerGtag` → `mapMarkerClickDataEvent`，例如 `busanmap_marker_busantower`（一釘一事件）。
 *
 * 方塊內各購票／影片連結的 `data-event` 由資料檔 `mapEvent`（見 `CityCardAction`）自訂，不在此檔加前綴。
 */

/**
 * Bottom bar 卡片 `data-event`：例如 place.id `shibuya-sky` → `tokyomap_shibuyasky`
 * （前綴 + id 去 `-`、全小寫）。用於「點方塊選景點／聚焦」，與票券頁無關。
 */
export function mapBarCardDataEvent(prefix: string, placeId: string): string {
  const slug = placeId.replace(/-/g, '').toLowerCase()
  return `${prefix}_${slug}`
}

/**
 * 點圖釘送出的 GA 事件名：`{prefix}_marker_{placeId 去橫線小寫}`。
 * 例：`busanmap` + `busan-tower` → `busanmap_marker_busantower`
 */
export function mapMarkerClickDataEvent(prefix: string, placeId: string): string {
  const slug = placeId.replace(/-/g, '').toLowerCase()
  return `${prefix}_marker_${slug}`
}

/** 地圖釘點 GA 的 `area` 維度（與分類 tab 一致） */
export function mapMarkerGtagArea(category: string): string {
  switch (category) {
    case 'hotel':
      return '住宿'
    case 'free':
      return '免費'
    case 'food':
      return '商店'
    default:
      return '景點'
  }
}

/** 與 GtagCapture 送出的自訂維度欄位對齊（地圖標記非 DOM，需程式送事件） */
export function fireMapMarkerGtag(
  prefix: string,
  place: { id: string; name: string; category: string },
) {
  if (typeof window === 'undefined') return
  const gtagFn = getGtag()
  if (typeof gtagFn !== 'function') return
  gtagFn('event', mapMarkerClickDataEvent(prefix, place.id), {
    page_path: location.pathname,
    label: '',
    hotel: '',
    platform: '',
    area: mapMarkerGtagArea(place.category),
    url: '',
    item: place.id,
    section: 'map_marker',
    video: '',
    title: place.name,
  })
}
