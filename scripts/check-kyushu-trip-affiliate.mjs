import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const configPath = path.join(root, 'data', 'kyushu-trip-campaign.json')
const hotelDirectoryPath = path.join(root, 'data', 'kyushu-trip-hotels.json')
const pageDirectory = path.join(root, 'app', 'japan', 'kyushu-travel-subsidy-2026')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const hotelDirectory = JSON.parse(fs.readFileSync(hotelDirectoryPath, 'utf8'))
const url = new URL(config.url)

const failures = []
const expected = {
  protocol: 'https:',
  hostname: 'jp.trip.com',
  pathname: '/sale/w/3dcskhfy90ul2ffm/kyushu-fukkou.html',
  allianceId: '6833709',
  sid: '242535686',
  tripSub3: 'D13969664',
}

if (url.protocol !== expected.protocol) failures.push(`protocol must be ${expected.protocol}`)
if (url.hostname !== expected.hostname) failures.push(`host must be ${expected.hostname}`)
if (url.pathname !== expected.pathname) failures.push(`path must be ${expected.pathname}`)
if (url.searchParams.get('Allianceid') !== expected.allianceId) failures.push('Allianceid is missing or incorrect')
if (url.searchParams.get('SID') !== expected.sid) failures.push('SID is missing or incorrect')
if (url.searchParams.get('trip_sub3') !== expected.tripSub3) failures.push('trip_sub3 is missing or incorrect')
if (config.allianceId !== expected.allianceId || config.sid !== expected.sid || config.tripSub3 !== expected.tripSub3) {
  failures.push('config metadata does not match the affiliate URL')
}
if (hotelDirectory.campaignId !== config.campaignId) {
  failures.push('hotel directory campaign ID does not match the affiliate campaign')
}

const seenHotelIds = new Set()
const directoryHotels = hotelDirectory.prefectures.flatMap((prefecture) =>
  prefecture.hotels.map((hotel) => ({ ...hotel, prefecture: prefecture.name })),
)

for (const hotel of directoryHotels) {
  if (!/^\d{3,}$/.test(hotel.hotelId)) failures.push(`${hotel.prefecture}: invalid hotel ID ${hotel.hotelId}`)
  if (seenHotelIds.has(hotel.hotelId)) failures.push(`duplicate hotel ID ${hotel.hotelId}`)
  seenHotelIds.add(hotel.hotelId)

  const hotelUrl = new URL('https://tw.trip.com/hotels/detail/')
  hotelUrl.searchParams.set('hotelId', hotel.hotelId)
  hotelUrl.searchParams.set('Allianceid', config.allianceId)
  hotelUrl.searchParams.set('SID', config.sid)
  hotelUrl.searchParams.set('trip_sub1', '')
  hotelUrl.searchParams.set('trip_sub3', config.tripSub3)

  if (
    hotelUrl.hostname !== 'tw.trip.com'
    || hotelUrl.pathname !== '/hotels/detail/'
    || hotelUrl.searchParams.get('Allianceid') !== expected.allianceId
    || hotelUrl.searchParams.get('SID') !== expected.sid
    || hotelUrl.searchParams.get('trip_sub3') !== expected.tripSub3
  ) {
    failures.push(`${hotel.prefecture}: hotel ${hotel.hotelId} is missing verified affiliate attribution`)
  }
}

if (directoryHotels.length === 0) failures.push('hotel directory is empty')

const sourceFiles = fs.readdirSync(pageDirectory)
  .filter((name) => /\.(ts|tsx)$/.test(name))
  .map((name) => path.join(pageDirectory, name))

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  const literalTripUrls = source.match(/https:\/\/[^'"\s)]+trip\.com[^'"\s)]*/gi) ?? []
  if (literalTripUrls.length > 0) {
    failures.push(`${path.relative(root, file)} contains a hard-coded Trip.com URL; use KYUSHU_TRIP_CAMPAIGN_URL`)
  }
  if (/tw\.trip\.com/i.test(source)) {
    failures.push(`${path.relative(root, file)} points to the Taiwan Trip site, which is not the subsidy campaign`)
  }
}

if (failures.length > 0) {
  console.error('Kyushu Trip affiliate check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `Kyushu Trip affiliate check passed: ${directoryHotels.length} hotel links, ${config.campaignId}, Allianceid ${config.allianceId}, SID ${config.sid}`,
)
