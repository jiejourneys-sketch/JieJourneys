import { NextRequest, NextResponse } from 'next/server'
import { POST as resolveAgoda } from '@/app/api/pass-planner/hotel-affiliate/agoda/route'
import { POST as resolveTrip } from '@/app/api/pass-planner/hotel-affiliate/trip/route'

export const dynamic = 'force-dynamic'

/**
 * Resolve both hotel providers inside one server request. Besides avoiding a
 * browser race, this lets Agoda and Trip share the exact same metered Google
 * Hotels payload and its strict property verification.
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!input) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })

  const requestedProviders = new Set(
    Array.isArray(input.providers)
      ? input.providers.filter((provider) => provider === 'Agoda' || provider === 'Trip')
      : ['Agoda', 'Trip'],
  )
  if (requestedProviders.size === 0) {
    return NextResponse.json({ error: 'missing_provider' }, { status: 400 })
  }

  const body = JSON.stringify(input)
  const makeRequest = (provider: 'agoda' | 'trip') => new NextRequest(
    new URL(`/api/pass-planner/hotel-affiliate/${provider}`, req.url),
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    },
  )

  const [agodaResponse, tripResponse] = await Promise.all([
    requestedProviders.has('Agoda') ? resolveAgoda(makeRequest('agoda')) : null,
    requestedProviders.has('Trip') ? resolveTrip(makeRequest('trip')) : null,
  ])
  const [agoda, trip] = await Promise.all([
    agodaResponse?.json().catch(() => ({ error: 'agoda_invalid_response' })),
    tripResponse?.json().catch(() => ({ error: 'trip_invalid_response' })),
  ])

  return NextResponse.json({
    ...(agoda ? { agoda } : {}),
    ...(trip ? { trip } : {}),
  })
}
