import { NextRequest, NextResponse } from 'next/server'
import { getAgodaAffiliatePublicConfig, searchAgodaAffiliateHotels } from '@/lib/agodaAffiliate'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getAgodaAffiliatePublicConfig())
}

export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const hotelName = cleanString(input.hotelName ?? input.googlePlaceName ?? input.name, 160)
  if (!hotelName) return NextResponse.json({ error: 'missing_hotel_name' }, { status: 400 })

  const result = await searchAgodaAffiliateHotels({
    hotelName,
    cityId: cleanInteger(input.cityId, 1, 9999999),
    city: cleanString(input.city, 80),
    countryCode: cleanString(input.countryCode, 2),
    latitude: cleanNumber(input.latitude ?? input.lat, -90, 90),
    longitude: cleanNumber(input.longitude ?? input.lng, -180, 180),
    checkInDate: cleanDate(input.checkInDate),
    checkOutDate: cleanDate(input.checkOutDate),
    adults: cleanInteger(input.adults, 1, 16),
    children: cleanInteger(input.children, 0, 8),
    rooms: cleanInteger(input.rooms, 1, 8),
    currency: cleanString(input.currency, 10),
    language: cleanString(input.language, 12),
    maxResult: cleanInteger(input.maxResult, 1, 50),
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
