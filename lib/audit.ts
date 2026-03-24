import { supabase } from './supabase'
import { getDeviceId } from './device'

type AuditAction = 'insert' | 'update' | 'delete'

export async function logAudit(
  tableName: string,
  action: AuditAction,
  recordId: string,
  bookId: string | null,
  beforeData: unknown,
  afterData: unknown
): Promise<void> {
  try {
    const userId = getDeviceId()
    await supabase.from('audit_logs').insert({
      table_name: tableName,
      action,
      record_id: recordId,
      book_id: bookId,
      user_id: userId,
      before_data: action !== 'insert' ? beforeData : null,
      after_data: action !== 'delete' ? afterData : null
    })
  } catch (e) {
    console.warn('audit log failed', e)
  }
}
