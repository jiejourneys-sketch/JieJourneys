import { test, expect } from '@playwright/test'
import { winterEvents, winterEventMatchesDate, winterMapPlaces, winterMapsUrl, winterPeriodLabel, winterRegions, winterScheduleLines } from '../data/japan/winter-illuminations-2026'

test('season dates include endpoints and keep winter lights after Christmas', () => {
  const marunouchi = winterEvents.find((event) => event.id === 'marunouchi')!
  expect(winterEventMatchesDate(marunouchi, '2026-11-11')).toBe(false)
  expect(winterEventMatchesDate(marunouchi, '2026-11-12')).toBe(true)
  expect(winterEventMatchesDate(marunouchi, '2027-01-15')).toBe(true)
  expect(winterEventMatchesDate(marunouchi, '2027-02-14')).toBe(true)
  expect(winterEventMatchesDate(marunouchi, '2027-02-15')).toBe(false)
})

test('known closure days are excluded without removing the rest of the season', () => {
  const tenjin = winterEvents.find((event) => event.id === 'tenjin-market')!
  expect(winterEventMatchesDate(tenjin, '2026-11-27')).toBe(true)
  expect(winterEventMatchesDate(tenjin, '2026-11-28')).toBe(false)
  expect(winterEventMatchesDate(tenjin, '2026-11-29')).toBe(false)
  expect(winterEventMatchesDate(tenjin, '2026-11-30')).toBe(true)
  const nabana = winterEvents.find((event) => event.id === 'nabana-no-sato')!
  expect(winterEventMatchesDate(nabana, '2027-01-06')).toBe(false)
  expect(winterEventMatchesDate(nabana, '2027-01-07')).toBe(false)
  expect(winterEventMatchesDate(nabana, '2027-01-08')).toBe(true)
})

test('each venue has a unique anchor, a valid region, and supported season facts', () => {
  expect(new Set(winterEvents.map((event) => event.id)).size).toBe(winterEvents.length)
  for (const event of winterEvents) {
    expect(winterRegions.some((region) => region.id === event.region)).toBe(true)
    expect(event.sources.length).toBeGreaterThan(0)
    expect(event.position.lat).toBeGreaterThan(24)
    expect(event.position.lat).toBeLessThan(46)
    expect(event.position.lng).toBeGreaterThan(122)
    expect(event.position.lng).toBeLessThan(146)
    for (const period of event.periods) {
      expect(period.start <= period.end).toBe(true)
      expect(winterEventMatchesDate(event, period.start)).toBe(true)
      expect(winterPeriodLabel(period)).toContain(period.start.slice(0, 4))
    }
  }
})

test('empty date keeps the list and invalid calendar dates do not match', () => {
  expect(winterEventMatchesDate(winterEvents[0], '')).toBe(true)
  expect(winterEventMatchesDate(winterEvents[0], '2026-11-31')).toBe(false)
  expect(winterEventMatchesDate(winterEvents[0], 'not-a-date')).toBe(false)
})

test('map cards link to the same venues and article anchors as the activity guide', () => {
  expect(winterMapPlaces).toHaveLength(winterEvents.length)
  for (const event of winterEvents) {
    const card = winterMapPlaces.find((place) => place.id === event.id)!
    expect(card.lat).toBe(event.position.lat)
    expect(card.lng).toBe(event.position.lng)
    expect(card.spotGoogleMapsUrl).toBe(winterMapsUrl(event))
    expect(card.relatedArticleHref).toBe(`#${event.id}`)
    expect(card.spotActions?.[0].href).toBe(event.sources[0].url)
    expect(card.description).toContain(event.highlights[0])
  }
})

test('ticketed illumination parks retain their ticket category in map cards', () => {
  expect(winterMapPlaces.find((place) => place.id === 'nabana-no-sato')?.category).toBe('ticket')
  expect(winterMapPlaces.find((place) => place.id === 'huis-ten-bosch')?.category).toBe('ticket')
})

test('an unannounced season cannot be mistaken for a confirmed activity date', () => {
  const pending = winterEvents.find((event) => event.id === 'shibuya-blue-cave')!
  expect(pending.scheduleStatus).toBe('pending')
  expect(pending.periods).toHaveLength(0)
  expect(winterScheduleLines(pending)).toEqual(['2026 日程待官方公布'])
  expect(winterEventMatchesDate(pending, '2026-12-10')).toBe(false)
  const unconfirmedEstimate = { ...pending, periods: [{ label: 'unconfirmed estimate', start: '2026-12-04', end: '2026-12-25' }] }
  expect(winterEventMatchesDate(unconfirmedEstimate, '2026-12-10')).toBe(false)
  expect(winterScheduleLines(unconfirmedEstimate)).toEqual(['2026 日程待官方公布'])
  expect(winterMapPlaces.find((place) => place.id === pending.id)?.description).toContain('待官方公布')
})

test('Tokyo Christmas Market venues retain their different opening dates', () => {
  const toyosu = winterEvents.find((event) => event.id === 'tokyo-christmas-toyosu')!
  const shiba = winterEvents.find((event) => event.id === 'tokyo-christmas-shiba')!
  expect(winterEventMatchesDate(toyosu, '2026-11-20')).toBe(true)
  expect(winterEventMatchesDate(shiba, '2026-11-20')).toBe(false)
  expect(winterEventMatchesDate(shiba, '2026-12-04')).toBe(true)
  expect(winterEventMatchesDate(toyosu, '2026-12-26')).toBe(false)
  expect(winterEventMatchesDate(shiba, '2026-12-26')).toBe(false)
})
