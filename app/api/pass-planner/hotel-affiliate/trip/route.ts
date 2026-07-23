import { NextRequest, NextResponse } from 'next/server'
import { getTripAffiliatePublicConfig, searchTripAffiliateHotels } from '@/lib/tripAffiliate'
import {
  buildHotelAffiliateSearchNames,
  getApplicableVerifiedHotelAffiliateIdentity,
} from '@/lib/hotelAffiliateIdentity'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getTripAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const googlePlaceId = cleanString(input.googlePlaceId ?? input.placeId, 180)
  const city = cleanString(input.city, 80)
  const countryCode = cleanString(input.countryCode, 2)
  const latitude = cleanNumber(input.latitude ?? input.lat, -90, 90)
  const longitude = cleanNumber(input.longitude ?? input.lng, -180, 180)
  const verifiedIdentity = getApplicableVerifiedHotelAffiliateIdentity(googlePlaceId, {
    latitude,
    longitude,
    countryCode,
  })
  const providedHotelNames = buildHotelAffiliateSearchNames({
    verifiedNames: verifiedIdentity?.canonicalNames,
    googlePlaceName: input.hotelName ?? input.googlePlaceName,
    userName: input.name,
    alternateNames: input.alternateHotelNames ?? input.alternateNames,
    maxNames: 3,
  })
  const hotelName = providedHotelNames[0]
  if (!hotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })
  const alternateHotelNames = cleanStringArray(providedHotelNames.slice(1), 4, 160)

  const result = await searchTripAffiliateHotels({
    hotelName,
    alternateHotelNames,
    googlePlaceId,
    city,
    countryCode,
    latitude,
    longitude,
    maxResult: cleanInteger(input.maxResult, 1, 10),
    tripSub1: cleanString(input.tripSub1, 120),
    tripSub3: cleanString(input.tripSub3, 80),
  })

  const status =
    result.matchStatus === 'not_configured'
      ? 503
      : result.matchStatus === 'search_error'
        ? 502
        : 200
  return NextResponse.json(result, { status })
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : undefined
}

function cleanStringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim().slice(0, maxLength) : ''))
    .filter(Boolean)
    .slice(0, maxItems)
}

function cleanInteger(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isInteger(number) || number < min || number > max) return undefined
  return number
}

function cleanNumber(value: unknown, min: number, max: number) {
  const number = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) return undefined
  return number
}
