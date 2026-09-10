import { expect, test } from '@playwright/test'
import { isPlannerInspectionMode, PLANNER_INSPECTION_PARAM } from '../lib/plannerInspection'

test('inspection mode is explicit and leaves normal collaborative editor links unchanged', () => {
  expect(PLANNER_INSPECTION_PARAM).toBe('inspect')
  expect(isPlannerInspectionMode('?p=abc&e=editor-token')).toBe(false)
  expect(isPlannerInspectionMode('?p=abc&e=editor-token&inspect=1')).toBe(true)
  expect(isPlannerInspectionMode('?p=abc&e=editor-token&inspect=true')).toBe(false)
  expect(isPlannerInspectionMode('?v=public-token&inspect=1')).toBe(true)
})
