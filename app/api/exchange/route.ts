import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const base = req.nextUrl.searchParams.get('base') || 'TWD'

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 86400 }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
    }

    const data = await res.json()

    if (data.result !== 'success') {
      return NextResponse.json(
        { error: data['error-type'] || 'api_error' },
        { status: 502 }
      )
    }

    // open.er-api 回傳：1 base = X 外幣，例如 base=TWD, rates.JPY=4.67
    // 反轉成：1 外幣 = X base，方便計算
    const rawRates = data.rates as Record<string, number>
    const invertedRates: Record<string, number> = {}
    for (const [code, rate] of Object.entries(rawRates)) {
      if (code !== base && rate > 0) {
        invertedRates[code] = 1 / rate
      }
    }

    return NextResponse.json({
      base,
      updatedAt: (data.time_last_update_utc as string) || '',
      rates: invertedRates
    })
  } catch (err) {
    console.error('[exchange route]', err)
    return NextResponse.json({ error: 'network_error' }, { status: 502 })
  }
}
