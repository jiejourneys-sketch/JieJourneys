import { NextRequest, NextResponse } from 'next/server'
import { POST as resolveAgoda } from '@/app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as resolveTrip } from '@/app/api/pass-planner/hotel-affiliate/trip/route'
import { POST as resolveBooking } from '@/app/api/pass-planner/hotel-affiliate/booking/route'

export const dynamic = 'force-dynamic'

/**
 * Resolve hotel providers inside one server request. Besides avoiding a
 * browser race, this lets Agoda, Trip and Booking share the same metered Google
 * Hotels payload and its strict property verification.
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const requestedProviders = new Set(
    Array.isArray(input.providers)
      ? input.providers.filter((provider) => provider === 'Agoda' || provider === 'Trip' || provider === 'Booking')
      : ['Trip', 'Agoda'],
  )
  if (requestedProviders.size === 0) {
    return NextResponse.json({ error: 'missing_provider' }, { status: 400 })
  }

  const body = JSON.stringify(input)
  const makeRequest = (provider: 'agoda' | 'trip' | 'booking') => new NextRequest(
    new URL(`/api/pass-planner/hotel-affiliate/${provider}`, req.url),
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    },
  )

  const [tripResponse, agodaResponse, bookingResponse] = await Promise.all([
    requestedProviders.has('Trip') ? resolveTrip(makeRequest('trip')) : null,
    requestedProviders.has('Agoda') ? resolveAgoda(makeRequest('agoda')) : null,
    requestedProviders.has('Booking') ? resolveBooking(makeRequest('booking')) : null,
  ])
  const [trip, agoda, booking] = await Promise.all([
    tripResponse?.json().catch(() => ({ error: 'trip_invalid_response' })),
    agodaResponse?.json().catch(() => ({ error: 'agoda_invalid_response' })),
    bookingResponse?.json().catch(() => ({ error: 'booking_invalid_response' })),
  ])

  return NextResponse.json({
    ...(trip ? { trip } : {}),
    ...(agoda ? { agoda } : {}),
    ...(booking ? { booking } : {}),
  })
}
