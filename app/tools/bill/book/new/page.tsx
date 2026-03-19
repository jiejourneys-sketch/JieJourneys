'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NewBookPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const create = async () => {
    const trimmed = name.trim()
    if (!trimmed) return alert('請輸入名稱')

    setSaving(true)
    const { data, error } = await supabase
      .from('books')
      .insert([{ name: trimmed }])
      .select()
      .single()
    setSaving(false)

    if (error) {
      console.error(error)
      alert('建立失敗')
      return
    }

    window.dispatchEvent(new CustomEvent('bill:bookCreated'))
    router.push(`/tools/bill/book/${data.id}`)
    router.refresh()
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <Link href="/tools/bill" className="pill-link">
          ← 回清單
        </Link>
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
        <button className="btn" onClick={create} disabled={saving}>
          {saving ? '建立中...' : '建立'}
        </button>
      </div>
    </div>
  )
}
