export const PLANNER_INSPECTION_PARAM = 'inspect'

/**
 * A shared editor link with this explicit flag opens the complete itinerary
 * in review-only mode. It is intentionally opt-in so normal collaborators
 * retain editing and automatic affiliate-link persistence.
 */
export function isPlannerInspectionMode(search: string) {
  return new URLSearchParams(search).get(PLANNER_INSPECTION_PARAM) === '1'
}
