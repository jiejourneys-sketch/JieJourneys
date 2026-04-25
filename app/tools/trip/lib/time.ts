import type { PlanItem } from './types'

/**
 * Recalculate start_time for a day's items.
 * First item = 09:00. Each next item = previous start + duration + 30 min travel.
 */
export function recalculateTimes(items: PlanItem[], baseHour = 9): PlanItem[] {
  let cursor = baseHour * 60
  return items.map((item) => {
    const h = Math.floor(cursor / 60) % 24
    const m = cursor % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    cursor += item.duration + 30
    return { ...item, time }
  })
}

/** Recalculate times for all days in a flat item array */
export function recalculateAll(items: PlanItem[]): PlanItem[] {
  const days = [...new Set(items.map((i) => i.day))].sort()
  return days.flatMap((day) =>
    recalculateTimes(items.filter((i) => i.day === day))
  )
}
