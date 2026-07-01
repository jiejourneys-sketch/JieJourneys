import { createReadStream, createWriteStream, readdirSync, statSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { StringDecoder } from 'node:string_decoder'

const DEFAULT_COUNTRIES = ['JP', 'KR', 'TW', 'VN']
const DEFAULT_OUTPUT = path.join('data', 'agoda', 'hotels-index.jsonl')
const REQUIRED_FIELDS = [
  'hotel_id',
  'hotel_name',
  'hotel_formerly_name',
  'hotel_translated_name',
  'addressline1',
  'city',
  'state',
  'country',
  'countryisocode',
  'star_rating',
  'longitude',
  'latitude',
  'url',
  'city_id',
  'number_of_reviews',
  'rating_average',
  'accommodation_type',
]

const options = parseArgs(process.argv.slice(2))
const inputPath = options.input || options.zip || findInputFromArgs()
if (!inputPath) {
  console.error('Missing Agoda feed. Put the Agoda .zip in the project root or pass --zip path/to/feed.zip')
  process.exit(1)
}

const countryFilter = new Set(options.allCountries ? [] : (options.countries || DEFAULT_COUNTRIES).map((code) => code.toUpperCase()))
const outputPath = options.out || DEFAULT_OUTPUT
const metadataPath = outputPath.replace(/\.jsonl$/i, '.meta.json')
const stats = {
  input: inputPath,
  output: outputPath,
  countries: countryFilter.size > 0 ? Array.from(countryFilter) : ['ALL'],
  totalRows: 0,
  keptRows: 0,
  skippedRows: 0,
  countryCounts: {},
  generatedAt: new Date().toISOString(),
}

await mkdir(path.dirname(outputPath), { recursive: true })

const writer = createWriteStream(outputPath, { encoding: 'utf8' })
const source = openAgodaFeed(inputPath)
const decoder = new StringDecoder('utf8')

let header = null
let indexes = null
let sourceError = null

class CsvRecordParser {
  constructor(onRecord) {
    this.onRecord = onRecord
    this.record = []
    this.field = ''
    this.inQuotes = false
    this.pendingQuote = false
  }

  write(chunk) {
    for (let i = 0; i < chunk.length; i += 1) {
      const char = chunk[i]

      if (this.pendingQuote) {
        this.pendingQuote = false
        if (char === '"') {
          this.field += '"'
          continue
        }
        this.inQuotes = false
      }

      if (this.inQuotes) {
        if (char === '"') this.pendingQuote = true
        else this.field += char
        continue
      }

      if (char === '"') {
        this.inQuotes = true
        continue
      }

      if (char === ',') {
        this.pushField()
        continue
      }

      if (char === '\n') {
        this.pushRecord()
        continue
      }

      if (char !== '\r') this.field += char
    }
  }

  end() {
    if (this.field || this.record.length > 0) this.pushRecord()
  }

  pushField() {
    this.record.push(this.field)
    this.field = ''
  }

  pushRecord() {
    this.pushField()
    this.onRecord(this.record)
    this.record = []
  }
}

const parser = new CsvRecordParser((record) => {
  if (!header) {
    header = record.map((field) => field.trim())
    indexes = buildIndexes(header, REQUIRED_FIELDS)
    return
  }

  stats.totalRows += 1
  const item = buildIndexRecord(record, indexes)
  if (!item) {
    stats.skippedRows += 1
    return
  }

  if (countryFilter.size > 0 && !countryFilter.has(item.countryCode)) return

  stats.keptRows += 1
  stats.countryCounts[item.countryCode] = (stats.countryCounts[item.countryCode] || 0) + 1
  writer.write(`${JSON.stringify(item)}\n`)

  if (stats.keptRows % 10000 === 0) {
    console.log(`kept ${stats.keptRows.toLocaleString()} / scanned ${stats.totalRows.toLocaleString()}`)
  }
})

source.stream.on('data', (chunk) => parser.write(decoder.write(chunk)))
source.stream.on('error', (error) => {
  sourceError = error
})

await new Promise((resolve, reject) => {
  source.stream.on('end', resolve)
  source.stream.on('close', resolve)
  source.stream.on('error', reject)
})

const tail = decoder.end()
if (tail) parser.write(tail)
parser.end()

if (source.close) {
  await source.close()
}

await new Promise((resolve, reject) => {
  writer.end(resolve)
  writer.on('error', reject)
})

if (sourceError) throw sourceError
stats.completedAt = new Date().toISOString()
await writeFile(metadataPath, `${JSON.stringify(stats, null, 2)}\n`, 'utf8')

console.log(`Agoda hotel index written: ${outputPath}`)
console.log(`Rows kept: ${stats.keptRows.toLocaleString()} / scanned: ${stats.totalRows.toLocaleString()}`)
console.log(`Metadata written: ${metadataPath}`)

function parseArgs(args) {
  const parsed = {}
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '--all-countries') {
      parsed.allCountries = true
      continue
    }
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
  if (typeof parsed.countries === 'string') {
    parsed.countries = parsed.countries
      .split(',')
      .map((code) => code.trim())
      .filter(Boolean)
  }
  return parsed
}

function findInputFromArgs() {
  const possible = process.argv.slice(2).find((value) => /\.(zip|csv)$/i.test(value))
  if (possible) return possible

  const latestZip = readdirSync(process.cwd())
    .filter((name) => /\.zip$/i.test(name))
    .map((name) => {
      const fullPath = path.resolve(name)
      return { name, mtimeMs: statSync(fullPath).mtimeMs }
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)[0]
  return latestZip?.name || ''
}

function openAgodaFeed(inputPath) {
  const absolutePath = path.resolve(inputPath)
  if (/\.csv$/i.test(absolutePath)) {
    return { stream: createReadStream(absolutePath) }
  }

  if (!/\.zip$/i.test(absolutePath)) {
    throw new Error(`Unsupported Agoda feed type: ${inputPath}`)
  }

  const child = spawn('tar', ['-xOf', absolutePath], {
    stdio: ['ignore', 'pipe', 'inherit'],
  })

  return {
    stream: child.stdout,
    close: () =>
      new Promise((resolve, reject) => {
        child.on('error', reject)
        child.on('close', (code) => {
          if (code === 0) resolve()
          else reject(new Error(`tar exited with code ${code}`))
        })
      }),
  }
}

function buildIndexes(header, fields) {
  const indexes = {}
  fields.forEach((field) => {
    indexes[field] = header.indexOf(field)
  })
  const missing = fields.filter((field) => indexes[field] < 0)
  if (missing.length > 0) {
    throw new Error(`Missing expected Agoda CSV fields: ${missing.join(', ')}`)
  }
  return indexes
}

function buildIndexRecord(record, indexes) {
  const hotelId = readField(record, indexes.hotel_id)
  const hotelName = readField(record, indexes.hotel_name)
  const countryCode = readField(record, indexes.countryisocode).toUpperCase()
  const latitude = readNumber(readField(record, indexes.latitude))
  const longitude = readNumber(readField(record, indexes.longitude))

  if (!hotelId || !hotelName || !countryCode || latitude === null || longitude === null) return null

  return removeEmpty({
    hotelId,
    hotelName,
    formerName: readField(record, indexes.hotel_formerly_name),
    translatedName: readField(record, indexes.hotel_translated_name),
    address: readField(record, indexes.addressline1),
    city: readField(record, indexes.city),
    state: readField(record, indexes.state),
    country: readField(record, indexes.country),
    countryCode,
    cityId: readInteger(readField(record, indexes.city_id)),
    latitude,
    longitude,
    starRating: readNumber(readField(record, indexes.star_rating)),
    reviewCount: readInteger(readField(record, indexes.number_of_reviews)),
    reviewScore: readNumber(readField(record, indexes.rating_average)),
    accommodationType: readField(record, indexes.accommodation_type),
    url: readField(record, indexes.url),
  })
}

function readField(record, index) {
  return index >= 0 && index < record.length ? record[index].trim() : ''
}

function readNumber(value) {
  if (!value) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function readInteger(value) {
  const number = readNumber(value)
  return Number.isInteger(number) ? number : null
}

function removeEmpty(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== '' && entry !== null && entry !== undefined),
  )
}
