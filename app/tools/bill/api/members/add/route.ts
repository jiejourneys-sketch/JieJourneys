import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, book_id, device_id } = body

  const { data, error } = await supabase
    .from('members')
    .insert([{ name, book_id }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  if (data) {
    await supabase.from('audit_logs').insert({
      table_name: 'members',
      action: 'insert',
      record_id: data.id,
      book_id: book_id || null,
      user_id: device_id || null,
      before_data: null,
      after_data: data
    })
  }

  return NextResponse.json(data)
}