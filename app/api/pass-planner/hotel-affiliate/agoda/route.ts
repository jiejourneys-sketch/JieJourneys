import { NextRequest, NextResponse } from 'next/server'
import { getAgodaAffiliatePublicConfig, searchAgodaAffiliateHotels } from '@/lib/agodaAffiliate'
import { buildPlannerHotelAffiliateSearchNames } from '@/lib/hotelAffiliateIdentity'
import { cleanHotelAffiliateGooglePlaceTypes, hotelAffiliateGooglePlaceTypeSignal } from '@/lib/hotelAffiliatePlaceSignals'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getAgodaAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const googlePlaceId = cleanString(input.googlePlaceId ?? input.placeId, 180)
  const countryCode = cleanString(input.countryCode, 2)
  const latitude = cleanNumber(input.latitude ?? input.lat, -90, 90)
  const longitude = cleanNumber(input.longitude ?? input.lng, -180, 180)
  const hotelNames = buildPlannerHotelAffiliateSearchNames({
    googlePlaceName: cleanString(input.googlePlaceName, 160) ?? cleanString(input.hotelName, 160),
    userName: input.name,
  })
  const hotelName = hotelNames[0]
  if (!hotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })
  const googlePlaceTypes = cleanHotelAffiliateGooglePlaceTypes(input.googlePlaceTypes ?? input.placeTypes, 12)
  const placeTypeSignal = hotelAffiliateGooglePlaceTypeSignal(googlePlaceTypes)
  const explicitLodgingHint = cleanBoolean(input.lodgingHint ?? input.isLodging ?? input.hotelAffiliateEligible)
  const lodgingHint = placeTypeSignal === 'lodging' || (explicitLodgingHint && placeTypeSignal !== 'non_lodging')

  const result = await searchAgodaAffiliateHotels({
    hotelName,
    alternateHotelNames: hotelNames.slice(1),
    googlePlaceId,
    cityId: cleanInteger(input.cityId, 1, 9999999),
    city: cleanString(input.city, 80),
    countryCode,
    latitude,
    longitude,
    lodgingHint,
    checkInDate: cleanDate(input.checkInDate),
    checkOutDate: cleanDate(input.checkOutDate),
    adults: cleanInteger(input.adults, 1, 16),
    children: cleanInteger(input.children, 0, 8),
    rooms: cleanInteger(input.rooms, 1, 8),
    currency: cleanString(input.currency, 10),
    language: cleanString(input.language, 12),
    maxResult: cleanInteger(input.maxResult, 1, 50),
    forceRefresh: cleanBoolean(input.forceRefresh ?? input.refresh),
  })

  const status =
    result.matchStatus === 'not_configured'
      ? 503
      : result.matchStatus === 'api_error'
        ? 502
        : 200
  return NextResponse.json(result, { status })
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : undefined
}

function cleanBoolean(value: unknown) {
  if (value === true) return true
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true'
  return false
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

function cleanDate(value: unknown) {
  if (typeof value !== 'string') return undefined
  const clean = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : undefined
}
