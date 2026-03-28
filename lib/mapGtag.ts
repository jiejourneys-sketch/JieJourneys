import { getGtag } from '@/lib/gtag'

/**
 * Bottom bar 卡片 `data-event`：例如 place.id `shibuya-sky` → `tokyomap_shibuyasky`
 * （前綴 + id 去 `-`、全小寫）
 */
export function mapBarCardDataEvent(prefix: string, placeId: string): string {
  const slug = placeId.replace(/-/g, '').toLowerCase()
  return `${prefix}_${slug}`
}

/** 與 GtagCapture 送出的自訂維度欄位對齊（地圖標記非 DOM，需程式送事件） */
export function fireMapMarkerGtag(
  prefix: string,
  place: { id: string; name: string; category: string },
) {
  if (typeof window === 'undefined') return
  const gtagFn = getGtag()
  if (typeof gtagFn !== 'function') return
  gtagFn('event', `${prefix}_marker_click`, {
    page_path: location.pathname,
    label: '',
    hotel: '',
    platform: '',
    area: place.category === 'hotel' ? '住宿' : '景點',
    url: '',
    item: place.id,
    section: 'map_marker',
    video: '',
    title: place.name,
  })
}
