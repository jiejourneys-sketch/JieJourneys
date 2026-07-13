import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline'

const DEFAULT_SOURCE = path.join('data', 'agoda', 'hotels-index.jsonl')
const DEFAULT_BASE = path.join('data', 'agoda-planner-hotels-index.jsonl')
const DEFAULT_OUTPUT = path.join('data', 'agoda-planner-hotels-index.jsonl')
const DEFAULT_REPLACE_COUNTRIES = ['JP']

const options = parseArgs(process.argv.slice(2))
const sourcePath = options.source || DEFAULT_SOURCE
const basePath = options.base || DEFAULT_BASE
const outputPath = options.out || DEFAULT_OUTPUT
const replaceCountries = new Set((options.replaceCountries || DEFAULT_REPLACE_COUNTRIES).map((code) => code.toUpperCase()))

const records = new Map()
const stats = {
  source: sourcePath,
  base: basePath,
  output: outputPath,
  replaceCountries: Array.from(replaceCountries),
  baseRows: 0,
  sourceRows: 0,
  keptRows: 0,
  countryCounts: {},
  generatedAt: new Date().toISOString(),
}

await readJsonl(basePath, (record) => {
  stats.baseRows += 1
  const countryCode = cleanCountryCode(record.countryCode)
  if (replaceCountries.has(countryCode)) return
  const clean = cleanPlannerRecord(record)
  if (!clean) return
  records.set(clean.hotelId, clean)
})

await readJsonl(sourcePath, (record) => {
  stats.sourceRows += 1
  const countryCode = cleanCountryCode(record.countryCode)
  if (!replaceCountries.has(countryCode)) return
  const clean = cleanPlannerRecord(record)
  if (!clean) return
  records.set(clean.hotelId, clean)
})

await mkdir(path.dirname(outputPath), { recursive: true })
const writer = createWriteStream(outputPath, { encoding: 'utf8' })

const sortedRecords = Array.from(records.values()).sort((left, right) => {
  const countryCompare = (left.countryCode || '').localeCompare(right.countryCode || '')
  if (countryCompare !== 0) return countryCompare
  const cityCompare = (left.city || '').localeCompare(right.city || '')
  if (cityCompare !== 0) return cityCompare
  return Number(left.hotelId) - Number(right.hotelId)
})

for (const record of sortedRecords) {
  stats.keptRows += 1
  stats.countryCounts[record.countryCode] = (stats.countryCounts[record.countryCode] || 0) + 1
  writer.write(`${JSON.stringify(record)}\n`)
}

await new Promise((resolve, reject) => {
  writer.end(resolve)
  writer.on('error', reject)
})

console.log(`Agoda planner hotel index written: ${outputPath}`)
console.log(`Rows kept: ${stats.keptRows.toLocaleString()}`)
console.log(`Country counts: ${JSON.stringify(stats.countryCounts)}`)

function parseArgs(args) {
  const parsed = {}
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const value = args[i + 1]
    if (!value || value.startsWith('--')) {
      parsed[key] = true
      continue
    }
    parsed[key] = value
    i += 1
  }
  if (typeof parsed['replace-countries'] === 'string') {
    parsed.replaceCountries = parsed['replace-countries']
      .split(',')
      .map((code) => code.trim())
      .filter(Boolean)
  }
  return parsed
}

async function readJsonl(filePath, onRecord) {
  const input = createReadStream(filePath, { encoding: 'utf8' })
  const reader = createInterface({ input, crlfDelay: Infinity })
  for await (const line of reader) {
    const clean = line.trim()
    if (!clean) continue
    onRecord(JSON.parse(clean))
  }
}

function cleanPlannerRecord(record) {
  const hotelId = String(record.hotelId || '').trim()
  const hotelName = cleanText(record.hotelName)
  const countryCode = cleanCountryCode(record.countryCode)
  const latitude = cleanNumber(record.latitude)
  const longitude = cleanNumber(record.longitude)

  if (!hotelId || !hotelName || !countryCode || latitude === null || longitude === null) return null

  return removeEmpty({
    hotelId,
    hotelName,
    formerName: cleanText(record.formerName),
    translatedName: cleanText(record.translatedName),
    city: cleanText(record.city),
    countryCode,
    cityId: cleanInteger(record.cityId),
    latitude,
    longitude,
    url: cleanText(record.url),
    starRating: cleanNumber(record.starRating),
    reviewScore: cleanNumber(record.reviewScore),
    reviewCount: cleanInteger(record.reviewCount),
    accommodationType: cleanText(record.accommodationType),
  })
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanCountryCode(value) {
  return cleanText(value).toUpperCase()
}

function cleanNumber(value) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  return Number.isFinite(number) ? number : null
}

function cleanInteger(value) {
  const number = cleanNumber(value)
  return Number.isInteger(number) ? number : null
}

function removeEmpty(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== '' && entry !== null && entry !== undefined),
  )
}
