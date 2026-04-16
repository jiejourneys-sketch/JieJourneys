'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuildBillPath } from '@/app/tools/bill/components/BillPathProvider'
import { filterSelectableMembers } from '@/lib/billMembers'
import { deleteExpenseWithDetails, updateExpenseWithDetails } from '@/lib/expenseRpc'
import { toCents, formatCents, formatWithCurrency } from '@/lib/amount'
import { CURRENCIES, type CurrencyInfo } from '@/lib/currency'
import { logAudit } from '@/lib/audit'
import { insertChangeLog } from '@/lib/changeLog'

type MemberRow = { id: string; name: string; is_active?: boolean | null }
type ExpenseRow = {
  id: string
  book_id: string
  amount: number
  currency?: string
  description: string
  occurred_at?: string
  note?: string | null
}
type SplitRow = {
  expense_id: string
  member_id: string
  amount: number
  shared_amount?: number
  exclusive_amount?: number
}
type PayerRow = { expense_id: string; member_id: string; amount: number }

function toDateParts(dtLocal: string) {
  const [d, t] = String(dtLocal || '').split('T')
  return { dateOnly: d || '', timeOnly: t || '' }
}

function combineDateTime(dateOnly: string, timeOnly: string) {
  if (!dateOnly) return ''
  const t = timeOnly || '12:00'
  return `${dateOnly}T${t}`
}

function toDatetimeLocal(iso: string | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

export default function EditExpenseForm({
  bookId,
  expense,
  members,
  splits,
  payers,
  bookCurrency,
  customCurrencies = []
}: {
  bookId: string
  expense: ExpenseRow
  members: MemberRow[]
  splits: SplitRow[]
  payers: PayerRow[]
  bookCurrency: string
  customCurrencies?: CurrencyInfo[]
}) {
  const buildBillPath = useBuildBillPath()
  const router = useRouter()

  const initDateLocal = toDatetimeLocal(expense.occurred_at) || toDatetimeLocal(new Date().toISOString())
  const initParts = toDateParts(initDateLocal)
  const [date, setDate] = useState(initDateLocal)
  const [dateOnly, setDateOnly] = useState(initParts.dateOnly)
  const [timeOnly, setTimeOnly] = useState(initParts.timeOnly)
  const [description, setDescription] = useState(expense.description || '')
  const [amount, setAmount] = useState(formatCents(expense.amount ?? 0))
  const [currency, setCurrency] = useState<string>(expense.currency || bookCurrency)
  const [note, setNote] = useState(expense.note || '')
  const [saving, setSaving] = useState(false)

  const memberOptions = useMemo(
    () =>
      filterSelectableMembers(
        members || [],
        new Set([
          ...(payers || []).map((p) => p.member_id),
          ...(splits || []).map((s) => s.member_id)
        ])
      ),
    [members, payers, splits]
  )
  const byId = useMemo(
    () => new Map(memberOptions.map((m) => [m.id, m.name] as const)),
    [memberOptions]
  )
  const total = useMemo(() => toCents(Number(amount) || 0), [amount])

  // Payers
  const [editingPayers, setEditingPayers] = useState(false)
  const [payerIds, setPayerIds] = useState<Set<string>>(
    () => new Set((payers || []).map((p) => p.member_id))
  )
  const [payerAmounts, setPayerAmounts] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const p of payers || []) m[p.member_id] = formatCents(p.amount ?? 0)
    return m
  })

  const effectivePayerIds = useMemo(() => new Set(payerIds), [payerIds])
  const orderedPayerIds = useMemo(
    () => memberOptions.filter((m) => effectivePayerIds.has(m.id)).map((m) => m.id),
    [memberOptions, effectivePayerIds]
  )

  const payerDisplay = useMemo(() => {
    const ids = orderedPayerIds
    return ids.length ? ids.map((id) => byId.get(id) || '未知').join('、') : '未選擇'
  }, [byId, orderedPayerIds])

  const computedPayerAmounts = useMemo(() => {
    const ids = orderedPayerIds
    if (!ids.length || total <= 0) return {}
    const manualIds = ids.filter(
      (id) => payerAmounts[id] !== undefined && payerAmounts[id] !== ''
    )
    const manualSum = manualIds.reduce((sum, id) => sum + toCents(Number(payerAmounts[id]) || 0), 0)
    const autoIds = ids.filter((id) => !manualIds.includes(id))
    const remaining = total - manualSum
    const result: Record<string, number> = {}
    manualIds.forEach((id) => {
      result[id] = toCents(Number(payerAmounts[id]) || 0)
    })
    if (autoIds.length > 0) {
      const base = Math.floor(remaining / autoIds.length)
      const rem = remaining - base * autoIds.length
      autoIds.forEach((id, idx) => {
        result[id] = base + (idx < rem ? 1 : 0)
      })
    }
    return result
  }, [orderedPayerIds, payerAmounts, total])

  const payerAllocated = useMemo(
    () => Object.values(computedPayerAmounts).reduce((s, v) => s + v, 0),
    [computedPayerAmounts]
  )
  const payerRemaining = total - payerAllocated

  // Splits
  const [editingSplit, setEditingSplit] = useState(false)
  const [splitterIds, setSplitterIds] = useState<Set<string>>(
    () => new Set((splits || []).map((s) => s.member_id))
  )
  const [sharedOverrides, setSharedOverrides] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const s of splits || []) {
      const v = s.shared_amount != null ? s.shared_amount : s.amount
      m[s.member_id] = formatCents(v ?? 0)
    }
    return m
  })
  const [exclusiveAmounts, setExclusiveAmounts] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const s of splits || []) {
      const v = Number(s.exclusive_amount ?? 0)
      if (v > 0) m[s.member_id] = formatCents(v)
    }
    return m
  })
  const [lockedSharedIds, setLockedSharedIds] = useState<Set<string>>(
    () => new Set((splits || []).map((s) => s.member_id))
  )

  const effectiveSplitterIds = useMemo(() => new Set(splitterIds), [splitterIds])
  const orderedSplitterIds = useMemo(
    () => memberOptions.filter((m) => effectiveSplitterIds.has(m.id)).map((m) => m.id),
    [memberOptions, effectiveSplitterIds]
  )

  const splitDisplay = useMemo(() => {
    const ids = orderedSplitterIds
    if (ids.length === memberOptions.length) return '所有人均分'
    return ids.map((id) => byId.get(id) || '未知').join('、')
  }, [byId, orderedSplitterIds, memberOptions.length])

  const computedSplit = useMemo(() => {
    const ids = orderedSplitterIds
    const exclusiveSum = ids.reduce((sum, id) => sum + toCents(Number(exclusiveAmounts[id]) || 0), 0)
    const sharedPool = total - exclusiveSum
    const lockedSharedSum = ids.reduce((sum, id) => {
      if (!lockedSharedIds.has(id)) return sum
      return sum + toCents(Number(sharedOverrides[id]) || 0)
    }, 0)
    const unlocked = ids.filter((id) => !lockedSharedIds.has(id))
    const remaining = sharedPool - lockedSharedSum
    const base = unlocked.length ? Math.floor(remaining / unlocked.length) : 0
    const rem = unlocked.length ? remaining - base * unlocked.length : 0
    const shared: Record<string, number> = {}
    const exclusive: Record<string, number> = {}
    ids.forEach((id) => {
      exclusive[id] = toCents(Number(exclusiveAmounts[id]) || 0)
      if (lockedSharedIds.has(id)) shared[id] = toCents(Number(sharedOverrides[id]) || 0)
    })
    unlocked.forEach((id, idx) => {
      shared[id] = base + (idx < rem ? 1 : 0)
    })
    const totalByMember: Record<string, number> = {}
    ids.forEach((id) => (totalByMember[id] = (shared[id] || 0) + (exclusive[id] || 0)))
    return { shared, exclusive, totalByMember, exclusiveSum, sharedPool }
  }, [orderedSplitterIds, exclusiveAmounts, lockedSharedIds, sharedOverrides, total])

  const splitAllocated = Object.values(computedSplit.totalByMember).reduce((s, v) => s + v, 0)
  const splitRemaining = total - splitAllocated

  const submit = async () => {
    if (!description.trim() || !amount) return alert('請填完整')
    const n = Number(amount)
    if (!Number.isFinite(n) || n < 0) return alert('金額不正確')
    if (effectivePayerIds.size === 0) return alert('請至少選 1 位付款者')
    if (effectiveSplitterIds.size === 0) return alert('請至少選 1 位分攤者')
    if (orderedPayerIds.length === 0)
      return alert('所選付款者已不在目前帳本成員中，請重新選擇付款者')
    if (orderedSplitterIds.length === 0)
      return alert('所選分攤者已不在目前帳本成員中，請重新選擇分攤者')

    const payerSum = Object.values(computedPayerAmounts).reduce((s, v) => s + v, 0)
    if (payerSum !== total) return alert('付款者金額加總必須等於帳目金額')
    const splitSum = Object.values(computedSplit.totalByMember).reduce((s, v) => s + v, 0)
    if (splitSum !== total) return alert('分攤金額加總必須等於帳目金額')

    setSaving(true)
    const occurredAt = new Date(combineDateTime(dateOnly, timeOnly) || date).toISOString()
    const beforeData = { ...expense }
    const afterData = {
      description: description.trim(),
      amount: total,
      currency,
      occurred_at: occurredAt,
      note: note.trim() || null
    }

    const { error: uErr } = await supabase
      .from('expenses')
      .update({
        description: description.trim(),
        amount: total,
        currency,
        occurred_at: occurredAt,
        note: note.trim() || null
      })
      .eq('id', expense.id)

    if (uErr) {
      console.error(uErr)
      setSaving(false)
      alert('更新失敗')
      return
    }

    const payerRows = orderedPayerIds.map((memberId) => ({
      expense_id: expense.id,
      member_id: memberId,
      amount: computedPayerAmounts[memberId] || 0
    }))
    // 避免「整批 delete 被 RLS 擋下却回傳成功」導致 insert 撞 unique：只刪除未再選取的列，其餘用 upsert
    const nextPayerSet = new Set(orderedPayerIds)
    for (const memberId of (payers || []).map((p) => p.member_id)) {
      if (nextPayerSet.has(memberId)) continue
      const { error: pdErr } = await supabase
        .from('expense_payers')
        .delete()
        .eq('expense_id', expense.id)
        .eq('member_id', memberId)
      if (pdErr) {
        console.error(pdErr)
        setSaving(false)
        alert(`更新付款者失敗：${pdErr.message || '請稍後再試'}`)
        return
      }
    }
    const { error: piErr } = await supabase
      .from('expense_payers')
      .upsert(payerRows, { onConflict: 'expense_id,member_id' })
    if (piErr) {
      console.error(piErr)
      setSaving(false)
      alert(`更新付款者失敗：${piErr.message || '請稍後再試'}`)
      return
    }

    const splitRows = orderedSplitterIds.map((memberId) => ({
      expense_id: expense.id,
      member_id: memberId,
      shared_amount: computedSplit.shared[memberId] || 0,
      exclusive_amount: computedSplit.exclusive[memberId] || 0,
      amount: computedSplit.totalByMember[memberId] || 0
    }))
    const nextSplitSet = new Set(orderedSplitterIds)
    for (const memberId of (splits || []).map((s) => s.member_id)) {
      if (nextSplitSet.has(memberId)) continue
      const { error: sdErr } = await supabase
        .from('expense_splits')
        .delete()
        .eq('expense_id', expense.id)
        .eq('member_id', memberId)
      if (sdErr) {
        console.error(sdErr)
        setSaving(false)
        alert(`更新分攤失敗：${sdErr.message || '請稍後再試'}`)
        return
      }
    }
    const { error: siErr } = await supabase
      .from('expense_splits')
      .upsert(splitRows, { onConflict: 'expense_id,member_id' })
    if (siErr) {
      console.error(siErr)
      setSaving(false)
      alert(`更新分攤失敗：${siErr.message || '請稍後再試'}`)
      return
    }

    logAudit('expenses', 'update', expense.id, bookId, beforeData, afterData)
    const beforeLog = {
      name: expense.description || '',
      amount: Number(expense.amount ?? 0),
      payer: (payers || []).map((p) => byId.get(p.member_id) || '未知').join('、') || undefined,
      participants: (splits || []).length === memberOptions.length ? '所有人均分' : [...(splits || [])].sort((a, b) => a.member_id.localeCompare(b.member_id)).map((s) => byId.get(s.member_id) || '未知').join('、') || undefined
    }
    const afterLog = {
      name: description.trim() || '',
      amount: total,
      payer: orderedPayerIds.map((id) => byId.get(id) || '未知').join('、') || undefined,
      participants: orderedSplitterIds.length === memberOptions.length ? '所有人均分' : orderedSplitterIds.map((id) => byId.get(id) || '未知').join('、') || undefined
    }
    await insertChangeLog(bookId, 'edit', expense.description || '未命名', beforeLog.amount, total, expense.id, beforeLog, afterLog)

    setSaving(false)
    window.dispatchEvent(new CustomEvent('bill:expensesChanged', { detail: { bookId } }))
    window.dispatchEvent(new CustomEvent('bill:changeLogsChanged', { detail: { bookId } }))
    router.push(buildBillPath(`/book/${bookId}`))
    router.refresh()
  }

  const deleteThisExpense = async () => {
    if (!confirm(`刪除帳目「${description}」？`)) return
    setSaving(true)
    const beforeData = { ...expense }
    // 先刪子資料，避免 FK 限制阻擋刪除
    await supabase.from('expense_payers').delete().eq('expense_id', expense.id)
    await supabase.from('expense_splits').delete().eq('expense_id', expense.id)
    const { data: deleted, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expense.id)
      .select('id')
    if (error) {
      console.error(error)
      setSaving(false)
      alert(`刪除失敗：${error.message}`)
      return
    }
    if (!deleted || deleted.length === 0) {
      setSaving(false)
      alert('刪除失敗：資料庫未授權此操作。\n請至 Supabase → Authentication → Policies，確認 expenses 表有允許 DELETE 的 RLS 政策。')
      return
    }
    logAudit('expenses', 'delete', expense.id, bookId, beforeData, null)
    const beforeLog = {
      name: expense.description || '',
      amount: Number(expense.amount ?? 0),
      payer: (payers || []).map((p) => byId.get(p.member_id) || '未知').join('、') || undefined,
      participants: (splits || []).length === memberOptions.length ? '所有人均分' : [...(splits || [])].sort((a, b) => a.member_id.localeCompare(b.member_id)).map((s) => byId.get(s.member_id) || '未知').join('、') || undefined
    }
    await insertChangeLog(bookId, 'delete', expense.description || '未命名', Number(expense.amount ?? 0), null, expense.id, beforeLog, null)
    setSaving(false)
    window.dispatchEvent(new CustomEvent('bill:expensesChanged', { detail: { bookId } }))
    window.dispatchEvent(new CustomEvent('bill:changeLogsChanged', { detail: { bookId } }))
    router.push(buildBillPath(`/book/${bookId}`))
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="date-time-row">
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>日期</div>
        <div className="date-time-inputs">
          <div className="date-time-field-wrap">
            <input
              className="field"
              type="date"
              value={dateOnly}
              onChange={(e) => {
                const next = e.target.value
                setDateOnly(next)
                setDate(combineDateTime(next, timeOnly))
              }}
            />
          </div>
          <div className="date-time-field-wrap">
            <input
              className="field field-time"
              type="time"
              value={timeOnly}
              onChange={(e) => {
                const next = e.target.value
                setTimeOnly(next)
                setDate(combineDateTime(dateOnly, next))
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>項目</div>
        <input className="field" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>金額</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="field"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setPayerAmounts({})
              setSharedOverrides({})
              setExclusiveAmounts({})
              setLockedSharedIds(new Set())
            }}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <select
            className="field"
            style={{ width: 'auto', marginBottom: 0 }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
            {customCurrencies.length > 0 && (
              <optgroup label="自訂貨幣">
                {customCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>付款者（可多人）</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="field" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, flex: 1 }}>{payerDisplay}</div>
          <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingPayers(true)}>編輯</button>
        </div>

        {editingPayers && (
          <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setEditingPayers(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">付款者</div>
                <button className="modal-close" onClick={() => setEditingPayers(false)}>關閉</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>總金額：{formatWithCurrency(total, currency)}</div>
                  <div style={{ fontSize: 13, color: payerRemaining === 0 ? '#059669' : '#b91c1c' }}>
                    尚有 {formatWithCurrency(payerRemaining, currency)} 未分配
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                  勾選付款者後會自動平均，修改金額時會重新計算剩餘。
                </div>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {memberOptions.map((m) => {
                    const checked = effectivePayerIds.has(m.id)
                    return (
                      <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(payerIds)
                            if (e.target.checked) next.add(m.id)
                            else next.delete(m.id)
                            setPayerIds(next)
                            setPayerAmounts({})
                          }}
                        />
                        <span style={{ flex: '1 1 40%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.name}
                        </span>
                        {checked ? (
                          <input
                            className="field"
                            style={{ height: 40, marginBottom: 0 }}
                            inputMode="numeric"
                            value={
                              payerAmounts[m.id] ??
                              (checked ? formatCents(computedPayerAmounts[m.id] ?? 0) : '')
                            }
                            onChange={(e) => {
                              const v = e.target.value
                              setPayerAmounts((prev) => {
                                const next = { ...prev, [m.id]: v }
                                const ids = orderedPayerIds
                                if (ids.length === 2) {
                                  const otherId = ids[0] === m.id ? ids[1] : ids[0]
                                  delete next[otherId]
                                  return next
                                }
                                if (ids.length >= 3) {
                                  const manualCount = ids.filter(
                                    (id) => next[id] !== undefined && next[id] !== ''
                                  ).length
                                  if (manualCount === ids.length) {
                                    const candidate = ids.find((id) => id !== m.id)
                                    if (candidate) delete next[candidate]
                                  }
                                }
                                return next
                              })
                            }}
                          />
                        ) : null}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="modal-actions">
                <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingPayers(false)}>完成</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>分攤者</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="field" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, flex: 1 }}>{splitDisplay}</div>
          <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingSplit(true)}>編輯</button>
        </div>

        {editingSplit && (
          <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setEditingSplit(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">分攤設定</div>
                <button className="modal-close" onClick={() => setEditingSplit(false)}>關閉</button>
              </div>
              <div className="modal-body">
                <div style={{ fontSize: 13, color: splitRemaining === 0 ? '#059669' : '#b91c1c', marginTop: 4 }}>
                  尚未分配：{formatWithCurrency(splitRemaining, currency)}
                  <span style={{ marginLeft: 8, color: '#6b7280' }}>（總金額：{formatWithCurrency(total, currency)}）</span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {memberOptions.map((m) => {
                    const checked = effectiveSplitterIds.has(m.id)
                    const sharedLocked = lockedSharedIds.has(m.id)
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(splitterIds)
                            if (e.target.checked) next.add(m.id)
                            else next.delete(m.id)
                            setSplitterIds(next)
                            setLockedSharedIds(new Set())
                            setSharedOverrides({})
                            setExclusiveAmounts((prev) => {
                              const copy = { ...prev }
                              if (!e.target.checked) delete copy[m.id]
                              return copy
                            })
                          }}
                        />
                        <span style={{ minWidth: 60 }}>{m.name}</span>
                        {checked ? (
                          <>
                            <input
                              className="field"
                              style={{ height: 38, marginBottom: 0, width: '24%', maxWidth: '30%', padding: '0 10px' }}
                              inputMode="numeric"
                              placeholder="平均"
                              value={
                                sharedLocked ? (sharedOverrides[m.id] ?? '') : formatCents(computedSplit.shared[m.id] ?? 0)
                              }
                              onChange={(e) => {
                                const v = e.target.value
                                setSharedOverrides((prev) => {
                                  const next = { ...prev, [m.id]: v }
                                  const ids = orderedSplitterIds
                                  if (ids.length === 2) {
                                    const otherId = ids[0] === m.id ? ids[1] : ids[0]
                                    delete next[otherId]
                                  }
                                  return next
                                })
                                setLockedSharedIds((prev) => {
                                  const ids = orderedSplitterIds
                                  if (ids.length === 2) return new Set([m.id])
                                  const next = new Set(prev)
                                  next.add(m.id)
                                  if (ids.length >= 3) {
                                    const lockedCount = ids.filter((id) => next.has(id)).length
                                    if (lockedCount === ids.length) {
                                      const candidate = ids.find((id) => id !== m.id)
                                      if (candidate) next.delete(candidate)
                                    }
                                  }
                                  return next
                                })
                              }}
                            />
                            <input
                              className="field"
                              style={{ height: 38, marginBottom: 0, width: '24%', maxWidth: '30%', padding: '0 10px' }}
                              inputMode="numeric"
                              placeholder="額外"
                              value={exclusiveAmounts[m.id] ?? ''}
                              onChange={(e) => {
                                const v = e.target.value
                                setExclusiveAmounts((prev) => {
                                  const next = { ...prev }
                                  if (!v) delete next[m.id]
                                  else next[m.id] = v
                                  return next
                                })
                              }}
                            />
                            <div style={{ width: '20%', textAlign: 'right', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              {formatWithCurrency(computedSplit.totalByMember[m.id] ?? 0, currency)}
                            </div>
                          </>
                        ) : <div style={{ color: '#9ca3af', fontSize: 13 }}>未分攤</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="modal-actions">
                <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingSplit(false)}>完成</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 6 }}>備註</div>
        <textarea className="field" value={note} onChange={(e) => setNote(e.target.value)} style={{ height: 110, paddingTop: 12, resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn" onClick={submit} disabled={saving} style={{ flex: 1 }}>
          {saving ? '儲存中...' : '儲存'}
        </button>
        <button
          className="danger-link"
          onClick={deleteThisExpense}
          disabled={saving}
          style={{ padding: '12px 14px', borderRadius: 10, fontSize: 14, flexShrink: 0 }}
        >
          刪除
        </button>
      </div>
    </div>
  )
}
