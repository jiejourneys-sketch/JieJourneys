import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, book_id } = body

  const { data, error } = await supabase
    .from('members')
    .insert([{ name, book_id }])
    .select()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
