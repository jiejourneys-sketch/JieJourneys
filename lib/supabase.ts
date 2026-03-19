import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as any)[prop]
  }
})

