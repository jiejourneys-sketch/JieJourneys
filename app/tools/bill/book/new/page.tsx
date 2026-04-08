'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBuildBillPath } from '@/app/tools/bill/components/BillPathProvider'
import BillHomeLink from '@/app/tools/bill/components/BillHomeLink'
import { supabase } from '@/lib/supabase'
import { CURRENCIES } from '@/lib/currency'

export default function NewBookPage() {
  const router = useRouter()
  const buildBillPath = useBuildBillPath()
  const [name, setName] = useState('')
  const [baseCurrency, setBaseCurrency] = useState('TWD')
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)

  const create = async () => {
    if (savingRef.current) return
    const trimmed = name.trim()
    if (!trimmed) return alert('請輸入名稱')

    savingRef.current = true
    setSaving(true)
    const { data, error } = await supabase
      .from('books')
      .insert([{ name: trimmed, base_currency: baseCurrency, exchange_rates: {} }])
      .select()
      .single()
    savingRef.current = false
    setSaving(false)

    if (error) {
      console.error(error)
      alert('建立失敗')
      return
    }

    window.dispatchEvent(new CustomEvent('bill:bookCreated'))
    router.push(buildBillPath(`/book/${data.id}`))
    router.refresh()
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <BillHomeLink className="pill-link">
          ← 回清單
        </BillHomeLink>
      </div>

      <div className="book-header">
        <div>
          <h2>建立帳本</h2>
          <p>輸入旅行/活動名稱</p>
        </div>
      </div>

      <div className="card">
        <input
          className="field"
          placeholder="例如：釜山自由行"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') create()
          }}
        />

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>結算貨幣</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>最後算清楚用的貨幣，建議選自己的本國貨幣</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setBaseCurrency(c.code)}
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
                {c.symbol} {c.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
            可在帳本設定裡修改
          </div>
        </div>

        <button className="btn" onClick={create} disabled={saving}>
          {saving ? '建立中，即將跳轉...' : '建立'}
        </button>
      </div>
    </div>
  )
}
