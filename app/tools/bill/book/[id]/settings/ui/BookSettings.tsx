'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CURRENCIES, getCurrencySymbol, type CurrencyInfo } from '@/lib/currency'
import { useBuildBillPath } from '@/app/tools/bill/components/BillPathProvider'

type SuggestedRates = {
  rates: Record<string, number>
  updatedAt: string
}

function formatRate(rate: number): string {
  if (rate >= 100) return rate.toFixed(1)
  if (rate >= 10) return rate.toFixed(2)
  if (rate >= 1) return rate.toFixed(3)
  if (rate >= 0.01) return rate.toFixed(4)
  return rate.toFixed(5)
}

function formatUpdatedAt(utcStr: string): string {
  if (!utcStr) return ''
  try {
    const d = new Date(utcStr)
    if (isNaN(d.getTime())) return ''
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return ''
  }
}

export default function BookSettings({
  bookId,
  baseCurrency: initBase,
  exchangeRates: initRates,
  customCurrencies: initCustom
}: {
  bookId: string
  baseCurrency: string
  exchangeRates: Record<string, number>
  customCurrencies: CurrencyInfo[]
}) {
  const [baseCurrency, setBaseCurrency] = useState(initBase)
  const [rates, setRates] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const [k, v] of Object.entries(initRates)) {
      m[k] = String(v)
    }
    return m
  })
  const [customCurrencies, setCustomCurrencies] = useState<CurrencyInfo[]>(initCustom)
  const [newName, setNewName] = useState('')
  const [newRate, setNewRate] = useState('')
  const router = useRouter()
  const buildBillPath = useBuildBillPath()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [suggested, setSuggested] = useState<SuggestedRates | null>(null)
  const [fetchingRates, setFetchingRates] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  // 每次 baseCurrency 改變就重新拉建議匯率
  useEffect(() => {
    let alive = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetchingRates(true)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetchError(false)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuggested(null)

    fetch(`/api/exchange?base=${baseCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return
        if (data.error) { setFetchError(true); return }
        setSuggested({ rates: data.rates, updatedAt: data.updatedAt })
      })
      .catch(() => { if (alive) setFetchError(true) })
      .finally(() => { if (alive) setFetchingRates(false) })

    return () => { alive = false }
  }, [baseCurrency])

  const applyRate = (code: string, rate: number) => {
    setRates((prev) => ({ ...prev, [code]: formatRate(rate) }))
  }

  const handleBaseCurrencyChange = (newBase: string) => {
    const oldRateOfNewBase = parseFloat(rates[newBase] ?? '')
    if (oldRateOfNewBase > 0) {
      const recalculated: Record<string, string> = {}
      for (const [code, val] of Object.entries(rates)) {
        if (code === newBase) continue
        const r = parseFloat(val)
        if (r > 0) recalculated[code] = formatRate(r / oldRateOfNewBase)
      }
      recalculated[baseCurrency] = formatRate(1 / oldRateOfNewBase)
      setRates(recalculated)
    }
    setBaseCurrency(newBase)
  }

  const applyAll = () => {
    if (!suggested) return
    const next: Record<string, string> = { ...rates }
    for (const c of CURRENCIES) {
      if (c.code === baseCurrency) continue
      const r = suggested.rates[c.code]
      if (r && r > 0) next[c.code] = formatRate(r)
    }
    setRates(next)
  }

  const addCustomCurrency = () => {
    const name = newName.trim()
    if (!name) return
    if (customCurrencies.some((c) => c.name === name)) return alert(`「${name}」已存在`)
    const rate = newRate.trim()
    setCustomCurrencies((prev) => [...prev, { code: name, symbol: name, name }])
    if (rate && parseFloat(rate) > 0) {
      setRates((prev) => ({ ...prev, [name]: rate }))
    }
    setNewName('')
    setNewRate('')
  }

  const removeCustomCurrency = (code: string) => {
    setCustomCurrencies((prev) => prev.filter((c) => c.code !== code))
    setRates((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setSaved(false)
    const parsedRates: Record<string, number> = {}
    for (const [k, v] of Object.entries(rates)) {
      const n = parseFloat(v)
      if (n > 0) parsedRates[k] = n
    }
    const { data: updated, error } = await supabase
      .from('books')
      .update({ base_currency: baseCurrency, exchange_rates: parsedRates, custom_currencies: customCurrencies })
      .eq('id', bookId)
      .select('id')
    setSaving(false)
    if (error) {
      console.error(error)
      alert(`儲存失敗：${error.message}`)
      return
    }
    if (!updated || updated.length === 0) {
      alert('儲存失敗：資料庫未授權此操作。\n請至 Supabase → Authentication → Policies，確認 books 表有允許 UPDATE 的 RLS 政策。')
      return
    }
    setSaved(true)
    // 刷新 server component 資料後導回帳本
    router.refresh()
    setTimeout(() => {
      router.push(buildBillPath(`/book/${bookId}`))
    }, 800)
  }

  const otherCurrencies = CURRENCIES.filter((c) => c.code !== baseCurrency)
  const dateLabel = suggested ? formatUpdatedAt(suggested.updatedAt) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 主要貨幣 */}
      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>結算貨幣</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>最後算清楚用的貨幣，建議選本國貨幣</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[...CURRENCIES, ...customCurrencies].map((c) => {
            const isCustom = !CURRENCIES.some((b) => b.code === c.code)
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleBaseCurrencyChange(c.code)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: baseCurrency === c.code ? '2px solid #2c7a86' : '2px solid #d9dee5',
                  background: baseCurrency === c.code ? '#e6f4f6' : '#fff',
                  color: baseCurrency === c.code ? '#2c7a86' : '#374151',
                  fontWeight: baseCurrency === c.code ? 700 : 400,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                {isCustom ? c.name : `${c.symbol} ${c.name}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* 匯率設定 */}
      <div>
        {/* Header 含更新時間 + 套用全部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>匯率設定</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {fetchingRates && (
              <span style={{ fontSize: 12, color: '#94a3b8' }}>載入建議匯率…</span>
            )}
            {fetchError && !fetchingRates && (
              <span style={{ fontSize: 12, color: '#f87171' }}>無法取得建議匯率</span>
            )}
            {suggested && !fetchingRates && (
              <button
                className="pill-link"
                style={{ border: 'none', cursor: 'pointer', fontSize: 13 }}
                onClick={applyAll}
              >
                全部套用
              </button>
            )}
          </div>
        </div>

        {/* 更新時間 */}
        {dateLabel && (
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
            建議匯率來源：open.er-api.com　更新日期：{dateLabel}　匯率僅供參考
          </div>
        )}
        {!suggested && !fetchingRates && !fetchError && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>
            不需要的貨幣留空即可
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {otherCurrencies.map((c) => {
            const suggestedRate = suggested?.rates[c.code]
            const hasSuggestion = suggestedRate && suggestedRate > 0

            return (
              <div key={c.code}>
                {/* 輸入行 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ minWidth: 76, fontSize: 14, fontWeight: 700, color: '#374151' }}>
                    1 {c.symbol} {c.code}
                  </div>
                  <span style={{ color: '#94a3b8' }}>=</span>
                  <input
                    className="field"
                    style={{ width: 110, height: 38, marginBottom: 0 }}
                    inputMode="decimal"
                    placeholder="未設定"
                    value={rates[c.code] ?? ''}
                    onChange={(e) =>
                      setRates((prev) => ({ ...prev, [c.code]: e.target.value }))
                    }
                  />
                  <span style={{ fontSize: 14, color: '#374151' }}>
                    {getCurrencySymbol(baseCurrency) === baseCurrency ? baseCurrency : `${getCurrencySymbol(baseCurrency)} ${baseCurrency}`}
                  </span>
                </div>

                {/* 建議匯率行 */}
                {hasSuggestion && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 5,
                      paddingLeft: 86
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      今日建議：{formatRate(suggestedRate)}
                    </span>
                    <button
                      className="pill-link"
                      style={{
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        padding: '2px 10px'
                      }}
                      onClick={() => applyRate(c.code, suggestedRate)}
                    >
                      套用
                    </button>
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </div>

      {/* 自訂貨幣管理 */}
      <div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>自訂貨幣</div>

        {customCurrencies.filter((c) => c.code !== baseCurrency).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {customCurrencies.filter((c) => c.code !== baseCurrency).map((c) => (
              <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', flex: 1 }}>{c.name}</div>
                <input
                  className="field"
                  style={{ width: 110, height: 38, marginBottom: 0 }}
                  inputMode="decimal"
                  placeholder="匯率"
                  value={rates[c.code] ?? ''}
                  onChange={(e) => setRates((prev) => ({ ...prev, [c.code]: e.target.value }))}
                />
                <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {getCurrencySymbol(baseCurrency) === baseCurrency ? baseCurrency : `${getCurrencySymbol(baseCurrency)} ${baseCurrency}`}
                </span>
                <button
                  className="pill-link"
                  style={{ border: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444' }}
                  onClick={() => removeCustomCurrency(c.code)}
                >
                  刪除
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            className="field"
            style={{ flex: 1, height: 38, marginBottom: 0 }}
            placeholder="貨幣名稱（如：英鎊）"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            className="pill-link"
            style={{ border: 'none', cursor: 'pointer', height: 38, padding: '0 14px', whiteSpace: 'nowrap' }}
            onClick={addCustomCurrency}
          >
            + 新增
          </button>
        </div>
        {newName.trim() && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
              1 {newName.trim()} =
            </span>
            <input
              className="field"
              style={{ width: 110, height: 38, marginBottom: 0 }}
              inputMode="decimal"
              placeholder="金額"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
            />
            <span style={{ fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
              {getCurrencySymbol(baseCurrency) === baseCurrency ? baseCurrency : `${getCurrencySymbol(baseCurrency)} ${baseCurrency}`}
            </span>
          </div>
        )}
      </div>

      <button className="btn" onClick={save} disabled={saving || saved}>
        {saving ? '儲存中...' : saved ? '已儲存 ✓ 跳轉中...' : '儲存設定'}
      </button>
    </div>
  )
}
