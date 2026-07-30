import { NextRequest, NextResponse } from 'next/server'
import { getTripAffiliatePublicConfig, searchTripAffiliateHotels } from '@/lib/tripAffiliate'
import { findAgodaHotelIndexIdentity } from '@/lib/agodaAffiliate'
import {
  buildHotelAffiliateSearchNames,
  buildPlannerHotelAffiliateSearchNames,
} from '@/lib/hotelAffiliateIdentity'
import { cleanHotelAffiliateGooglePlaceTypes, hotelAffiliateGooglePlaceTypeSignal } from '@/lib/hotelAffiliatePlaceSignals'

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
  const providedHotelNames = buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: cleanString(input.googlePlaceName, 160) ?? cleanString(input.hotelName, 160),
    googlePlaceNameZhTw: cleanString(input.googlePlaceNameZhTw, 160),
    userName: input.name,
  })
  const providedHotelName = providedHotelNames[0]
  if (!providedHotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })
  const googlePlaceTypes = cleanHotelAffiliateGooglePlaceTypes(input.googlePlaceTypes ?? input.placeTypes, 12)
  const placeTypeSignal = hotelAffiliateGooglePlaceTypeSignal(googlePlaceTypes)
  const explicitLodgingHint = cleanBoolean(input.lodgingHint ?? input.isLodging ?? input.hotelAffiliateEligible)
  const lodgingHint = placeTypeSignal === 'lodging' || (explicitLodgingHint && placeTypeSignal !== 'non_lodging')
  const agodaIdentity = await findAgodaHotelIndexIdentity({
    hotelName: providedHotelName,
    alternateHotelNames: providedHotelNames.slice(1),
    countryCode,
    latitude,
    longitude,
    lodgingHint,
  })
  const hotelNames = buildHotelAffiliateSearchNames({
    verifiedNames: agodaIdentity?.canonicalNames,
    googlePlaceName: providedHotelName,
    alternateNames: providedHotelNames.slice(1),
    maxNames: 3,
  })
  const hotelName = hotelNames[0] ?? providedHotelName
  const alternateHotelNames = hotelNames.slice(1)

  const result = await searchTripAffiliateHotels({
    hotelName,
    alternateHotelNames,
    googlePlaceId,
    city,
    countryCode,
    latitude,
    longitude,
    lodgingHint,
    forceRefresh: cleanBoolean(input.forceRefresh ?? input.refresh),
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

function cleanBoolean(value: unknown) {
  if (value === true) return true
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true'
  return false
}
