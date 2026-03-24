import { supabase } from './supabase'
import { formatCents } from './amount'

const USER_NAME_KEY = 'bill_user_name'

export function getChangeLogUserName(): string {
  if (typeof window === 'undefined') return '你'
  try {
    return localStorage.getItem(USER_NAME_KEY)?.trim() || '你'
  } catch {
    return '你'
  }
}

export function setChangeLogUserName(name: string): void {
  try {
    localStorage.setItem(USER_NAME_KEY, name.trim() || '你')
  } catch {
    // ignore
  }
}

export type ChangeLogAction = 'add' | 'edit' | 'delete'

export type ChangeLogData = {
  name?: string
  amount?: number
  payer?: string
  participants?: string
}

function normalizeData(data: unknown): unknown {
  if (data === null || data === undefined) return null
  if (typeof data === 'string') {
    const t = data.trim()
    if (t.includes('、')) return t.split('、').map((s) => s.trim()).filter(Boolean).sort().join('、')
    return t
  }
  if (typeof data === 'number') return data
  if (Array.isArray(data)) return data.map(normalizeData).sort((a, b) => String(a).localeCompare(String(b)))
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(obj).sort()) {
      const v = obj[key]
      if (v === undefined) continue
      result[key] = normalizeData(v)
    }
    return result
  }
  return data
}

function hasChanges(before: unknown, after: unknown): boolean {
  return JSON.stringify(normalizeData(before)) !== JSON.stringify(normalizeData(after))
}

export async function insertChangeLog(
  bookId: string,
  actionType: ChangeLogAction,
  target: string,
  amountBefore?: number | null,
  amountAfter?: number | null,
  expenseId?: string | null,
  beforeData?: ChangeLogData | null,
  afterData?: ChangeLogData | null
): Promise<void> {
  if (!hasChanges(beforeData, afterData)) return

  const userName = getChangeLogUserName()
  const { error } = await supabase.from('change_logs').insert({
    book_id: bookId,
    user_name: userName,
    action_type: actionType,
    target,
    amount_before: amountBefore ?? null,
    amount_after: amountAfter ?? null,
    expense_id: expenseId ?? null,
    before_data: beforeData ?? null,
    after_data: afterData ?? null
  })
  if (error) console.warn('change_log insert failed:', error.message)
}

export type ChangeLogRow = {
  user_name: string
  action_type: string
  target: string
  amount_before: number | null
  amount_after: number | null
  before_data?: ChangeLogData | null
  after_data?: ChangeLogData | null
}

export type FormatChangeLogResult = { main: string; details: string[] }

export function formatChangeLog(log: ChangeLogRow): FormatChangeLogResult {
  const target = `「${log.target}」`
  const details: string[] = []

  if (log.action_type === 'add') {
    const d = log.after_data
    if (d?.amount != null) details.push(`金額：NT$${formatCents(d.amount)}`)
    if (d?.payer) details.push(`付款人：${d.payer}`)
    if (d?.participants) details.push(`分攤人：${d.participants}`)
    return {
      main: `${log.user_name} 新增${target}`,
      details
    }
  }

  if (log.action_type === 'delete') {
    const d = log.before_data
    if (d?.amount != null) details.push(`金額：NT$${formatCents(d.amount)}`)
    if (d?.payer) details.push(`付款人：${d.payer}`)
    if (d?.participants) details.push(`分攤人：${d.participants}`)
    return {
      main: `${log.user_name} 刪除${target}`,
      details
    }
  }

  if (log.action_type === 'edit') {
    const before = log.before_data
    const after = log.after_data

    if (before && after) {
      if (before.name !== after.name && (before.name || after.name)) {
        details.push(`名稱：${before.name || '－'} → ${after.name || '－'}`)
      }
      if (before.amount !== after.amount && (before.amount != null || after.amount != null)) {
        const b = before.amount != null ? formatCents(before.amount) : '－'
        const a = after.amount != null ? formatCents(after.amount) : '－'
        details.push(`金額：NT$${b} → NT$${a}`)
      }
      if (before.payer !== after.payer && (before.payer || after.payer)) {
        details.push(`付款人：${before.payer || '－'} → ${after.payer || '－'}`)
      }
      if (before.participants !== after.participants && (before.participants || after.participants)) {
        details.push(`分攤人：${before.participants || '－'} → ${after.participants || '－'}`)
      }
    }

    if (details.length === 0 && (log.amount_before != null || log.amount_after != null)) {
      const b = log.amount_before != null ? formatCents(log.amount_before) : '?'
      const a = log.amount_after != null ? formatCents(log.amount_after) : '?'
      details.push(`金額：NT$${b} → NT$${a}`)
    }

    return {
      main: `${log.user_name} 修改${target}`,
      details
    }
  }

  return { main: `${log.user_name} 變更${target}`, details: [] }
}
