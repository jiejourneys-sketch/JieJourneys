'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuildBillPath } from '@/app/tools/bill/components/BillPathProvider'
import { supabase } from '@/lib/supabase'
import { toCents, formatCents, formatWithCurrency } from '@/lib/amount'
import { CURRENCIES, LAST_CURRENCY_STORAGE_KEY, type CurrencyInfo } from '@/lib/currency'
import { logAudit } from '@/lib/audit'

type MemberRow = { id: string; name: string }

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toDateParts(dtLocal: string) {
  const [d, t] = String(dtLocal || '').split('T')
  return {
    dateOnly: d || '',
    timeOnly: t || ''
  }
}

function combineDateTime(dateOnly: string, timeOnly: string) {
  if (!dateOnly) return ''
  const t = timeOnly || '12:00'
  return `${dateOnly}T${t}`
}

function nowDatetimeLocal() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(
    d.getMinutes()
  )}`
}

export default function NewExpenseForm({
  bookId,
  members,
  bookCurrency,
  customCurrencies = []
}: {
  bookId: string
  members: MemberRow[]
  bookCurrency: string
  customCurrencies?: CurrencyInfo[]
}) {
  const router = useRouter()
  const buildBillPath = useBuildBillPath()

  const [date, setDate] = useState('')
  const [dateOnly, setDateOnly] = useState('')
  const [timeOnly, setTimeOnly] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LAST_CURRENCY_STORAGE_KEY) || bookCurrency
    }
    return bookCurrency
  })
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  // Payers (multi)
  const [editingPayers, setEditingPayers] = useState(false)
  const [payerIds, setPayerIds] = useState<Set<string>>(() => new Set())
  const [payerAmounts, setPayerAmounts] = useState<Record<string, string>>({})

  // Splitters + shared/exclusive
  const [editingSplit, setEditingSplit] = useState(false)
  const [splitterIds, setSplitterIds] = useState<Set<string>>(
    () => new Set(members.map((m) => m.id))
  )
  const [sharedOverrides, setSharedOverrides] = useState<Record<string, string>>({})
  const [exclusiveAmounts, setExclusiveAmounts] = useState<Record<string, string>>({})
  const [lockedSharedIds, setLockedSharedIds] = useState<Set<string>>(() => new Set())

  const memberOptions = useMemo(() => members || [], [members])
  const byId = useMemo(
    () => new Map(memberOptions.map((m) => [m.id, m.name] as const)),
    [memberOptions]
  )
  const total = useMemo(() => toCents(Number(amount) || 0), [amount])

  const effectivePayerIds = useMemo(() => new Set(payerIds), [payerIds])
  const orderedPayerIds = useMemo(
    () => memberOptions.filter((m) => effectivePayerIds.has(m.id)).map((m) => m.id),
    [memberOptions, effectivePayerIds]
  )

  const effectiveSplitterIds = useMemo(() => new Set(splitterIds), [splitterIds])
  const orderedSplitterIds = useMemo(
    () => memberOptions.filter((m) => effectiveSplitterIds.has(m.id)).map((m) => m.id),
    [memberOptions, effectiveSplitterIds]
  )

  const payerDisplay = useMemo(() => {
    const ids = orderedPayerIds
    return ids.length ? ids.map((id) => byId.get(id) || '未知').join('、') : '未選擇'
  }, [byId, orderedPayerIds])

  const splitDisplay = useMemo(() => {
    const ids = orderedSplitterIds
    if (ids.length === memberOptions.length) return '所有人均分'
    return ids.map((id) => byId.get(id) || '未知').join('、')
  }, [byId, orderedSplitterIds, memberOptions.length])

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

  useEffect(() => {
    const initDateLocal = nowDatetimeLocal()
    const initParts = toDateParts(initDateLocal)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(initDateLocal)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateOnly(initParts.dateOnly)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeOnly(initParts.timeOnly)
  }, [])

  // Save last used currency to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_CURRENCY_STORAGE_KEY, currency)
    }
  }, [currency])

  const submit = async () => {
    if (!description.trim() || !amount) return alert('請填完整')
    const n = Number(amount)
    if (!Number.isFinite(n) || n < 0) return alert('金額不正確')
    if (effectivePayerIds.size === 0) return alert('請至少選 1 位付款者')
    if (effectiveSplitterIds.size === 0) return alert('請至少選 1 位分攤者')

    const payerSum = Object.values(computedPayerAmounts).reduce((s, v) => s + v, 0)
    if (payerSum !== total) return alert('付款者金額加總必須等於帳目金額')

    const splitSum = Object.values(computedSplit.totalByMember).reduce((s, v) => s + v, 0)
    if (splitSum !== total) return alert('分攤金額加總必須等於帳目金額')

    setSaving(true)
    const occurredAt = new Date(combineDateTime(dateOnly, timeOnly) || date).toISOString()

    const { data: inserted, error } = await supabase
      .from('expenses')
      .insert({
        book_id: bookId,
        description: description.trim(),
        amount: total,
        currency,
        occurred_at: occurredAt,
        note: note.trim() || null
      })
      .select('*')
      .single()

    if (error) {
      console.error(error)
      setSaving(false)
      alert('新增失敗')
      return
    }

    const expenseId = inserted?.id as string

    const payerRows = orderedPayerIds.map((memberId) => ({
      expense_id: expenseId,
      member_id: memberId,
      amount: computedPayerAmounts[memberId] || 0
    }))
    const { error: pErr } = await supabase.from('expense_payers').insert(payerRows)
    if (pErr) console.error(pErr)

    const splitRows = orderedSplitterIds.map((memberId) => ({
      expense_id: expenseId,
      member_id: memberId,
      shared_amount: computedSplit.shared[memberId] || 0,
      exclusive_amount: computedSplit.exclusive[memberId] || 0,
      amount: computedSplit.totalByMember[memberId] || 0
    }))
    const { error: sErr } = await supabase.from('expense_splits').insert(splitRows)
    if (sErr) console.error(sErr)

    const insertedRow = inserted as Record<string, unknown>
    logAudit('expenses', 'insert', expenseId, bookId, null, insertedRow)

    setSaving(false)
    window.dispatchEvent(new CustomEvent('bill:expensesChanged', { detail: { bookId } }))
    window.dispatchEvent(new CustomEvent('bill:expenseAdded', { detail: { bookId } }))
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
        <input className="field" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="例如：晚餐" />
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
            placeholder="例如：100 或 100.5"
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
          <div className="field" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, flex: 1 }}>
            {payerDisplay}
          </div>
          <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingPayers(true)}>
            編輯
          </button>
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
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    總金額：{formatWithCurrency(total, currency)}
                  </div>
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
                            placeholder="0"
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
          <div className="field" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, flex: 1 }}>
            {splitDisplay}
          </div>
          <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setEditingSplit(true)}>
            編輯
          </button>
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
                        ) : (
                          <div style={{ color: '#9ca3af', fontSize: 13 }}>未分攤</div>
                        )}
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

      <button className="btn" onClick={submit} disabled={saving}>
        {saving ? '新增中...' : '新增'}
      </button>
    </div>
  )
}
