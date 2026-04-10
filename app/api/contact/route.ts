import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.CONTACT_SUPABASE_URL!
const SUPABASE_ANON = process.env.CONTACT_SUPABASE_ANON_KEY!

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const res = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
