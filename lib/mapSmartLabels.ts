/// <reference types="google.maps" />

type LatLngLiteral = google.maps.LatLngLiteral

export type SmartMapLabelItem = {
  id: string
  position: LatLngLiteral
  text: string
  priority?: number
  selected?: boolean
}

export type SmartMapLabelOptions = {
  className: string
  selectedClassName?: string
  minZoom?: number
  fullZoom?: number
  maxMobileLabels?: number
  maxDesktopLabels?: number
}

export type SmartMapLabelOverlay = google.maps.OverlayView & {
  update: (item: SmartMapLabelItem, className: string, selectedClassName?: string) => void
  setLabelVisible: (visible: boolean) => void
  estimatedRect: () => LabelRect | null
}

type LabelRect = {
  left: number
  top: number
  right: number
  bottom: number
}

function labelOverlaps(a: LabelRect, b: LabelRect, padding = 4) {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  )
}

function createSmartMapLabelOverlay(
  map: google.maps.Map,
  item: SmartMapLabelItem,
  className: string,
  selectedClassName?: string,
): SmartMapLabelOverlay {
  class LabelOverlay extends google.maps.OverlayView {
    private div: HTMLDivElement | null = null
    private position: LatLngLiteral = item.position
    private text = item.text
    private labelClassName = className
    private labelSelectedClassName = selectedClassName
    private selected = Boolean(item.selected)
    private visible = false

    onAdd() {
      this.div = document.createElement('div')
      this.div.className = this.classNames()
      this.div.textContent = this.text
      this.div.style.position = 'absolute'
      this.div.style.display = 'none'
      this.div.style.pointerEvents = 'none'
      this.getPanes()?.overlayMouseTarget.appendChild(this.div)
    }

    draw() {
      if (!this.div) return
      const point = this.point()
      if (!point) {
        this.div.style.display = 'none'
        return
      }
      this.div.textContent = this.text
      this.div.className = this.classNames()
      this.div.style.display = this.visible ? 'block' : 'none'
      this.div.style.transform = `translate(${Math.round(point.x)}px, ${Math.round(point.y)}px) translate(-50%, -100%) translateY(-34px)`
    }

    onRemove() {
      this.div?.remove()
      this.div = null
    }

    update(nextItem: SmartMapLabelItem, nextClassName: string, nextSelectedClassName?: string) {
      this.position = nextItem.position
      this.text = nextItem.text
      this.labelClassName = nextClassName
      this.labelSelectedClassName = nextSelectedClassName
      this.selected = Boolean(nextItem.selected)
      this.draw()
    }

    setLabelVisible(visible: boolean) {
      if (this.visible === visible) return
      this.visible = visible
      this.draw()
    }

    estimatedRect(): LabelRect | null {
      const point = this.point()
      if (!point) return null
      const width = Math.min(176, Math.max(46, this.text.length * 13 + 20))
      const height = 25
      const top = point.y - 34 - height
      return {
        left: point.x - width / 2,
        top,
        right: point.x + width / 2,
        bottom: top + height,
      }
    }

    private point() {
      return this.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(this.position))
    }

    private classNames() {
      return [this.labelClassName, this.selected && this.labelSelectedClassName ? this.labelSelectedClassName : '']
        .filter(Boolean)
        .join(' ')
    }
  }

  const overlay = new LabelOverlay() as SmartMapLabelOverlay
  overlay.setMap(map)
  return overlay
}

function mapContains(map: google.maps.Map, item: SmartMapLabelItem) {
  const bounds = map.getBounds()
  if (!bounds) return true
  return bounds.contains(item.position)
}

function smartLabelText(value: string) {
  const text = value
    .replace(/\s+/g, ' ')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim()
  return text.length > 12 ? `${text.slice(0, 11)}...` : text
}

export function syncSmartMapLabels(
  map: google.maps.Map,
  overlays: Map<string, SmartMapLabelOverlay>,
  items: SmartMapLabelItem[],
  options: SmartMapLabelOptions,
) {
  const normalizedItems = items
    .map((item) => ({ ...item, text: smartLabelText(item.text) }))
    .filter((item) => item.text)
  const nextIds = new Set(normalizedItems.map((item) => item.id))

  overlays.forEach((overlay, id) => {
    if (nextIds.has(id)) return
    overlay.setMap(null)
    overlays.delete(id)
  })

  normalizedItems.forEach((item) => {
    const current = overlays.get(item.id)
    if (current) {
      current.update(item, options.className, options.selectedClassName)
      return
    }
    overlays.set(item.id, createSmartMapLabelOverlay(map, item, options.className, options.selectedClassName))
  })

  window.requestAnimationFrame(() => {
    const zoom = map.getZoom() ?? 0
    const minZoom = options.minZoom ?? 15
    const fullZoom = options.fullZoom ?? 17
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const maxLabels = isMobile ? options.maxMobileLabels ?? 10 : options.maxDesktopLabels ?? 28
    const visibleRects: LabelRect[] = []
    let shown = 0

    const ordered = normalizedItems
      .filter((item) => item.selected || zoom >= minZoom)
      .filter((item) => mapContains(map, item))
      .sort((a, b) => Number(Boolean(b.selected)) - Number(Boolean(a.selected)) || (b.priority ?? 0) - (a.priority ?? 0))

    overlays.forEach((overlay) => overlay.setLabelVisible(false))

    for (const item of ordered) {
      const overlay = overlays.get(item.id)
      if (!overlay) continue
      const rect = overlay.estimatedRect()
      if (!rect) continue
      const canExceedLimit = Boolean(item.selected)
      if (!canExceedLimit && shown >= maxLabels) continue
      const collides = visibleRects.some((visibleRect) => labelOverlaps(rect, visibleRect, zoom >= fullZoom ? 2 : 6))
      if (collides && !item.selected) continue
      overlay.setLabelVisible(true)
      visibleRects.push(rect)
      if (!item.selected) shown += 1
    }
  })
}

export function clearSmartMapLabels(overlays: Map<string, SmartMapLabelOverlay>) {
  overlays.forEach((overlay) => overlay.setMap(null))
  overlays.clear()
}
