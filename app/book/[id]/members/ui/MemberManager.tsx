'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type MemberRow = { id: string; name: string }

export default function MemberManager({ bookId }: { bookId: string }) {
  const [name, setName] = useState('')
  const [members, setMembers] = useState<MemberRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAdd = useMemo(() => name.trim().length > 0 && !saving, [name, saving])

  const fetchMembers = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(error)
      setError('讀取成員失敗')
      setMembers([])
      setLoading(false)
      return
    }
    setMembers((data as MemberRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  const addMember = async () => {
    if (!canAdd) return
    setSaving(true)
    setError(null)

    const memberName = name.trim()
    const { error } = await supabase.from('members').insert({
      book_id: bookId,
      name: memberName
    })

    if (error) {
      console.error(error)
      setError(`新增失敗：${error.message || '未知錯誤'}`)
      setSaving(false)
      return
    }

    setName('')
    setSaving(false)
    await fetchMembers()
    window.dispatchEvent(
      new CustomEvent('bill:membersChanged', { detail: { bookId } })
    )
  }

  const startEdit = (m: MemberRow) => {
    setEditingId(m.id)
    setEditingName(m.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEdit = async (m: MemberRow) => {
    const trimmed = editingName.trim()
    if (!trimmed) return alert('名字不能為空')

    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('members')
      .update({ name: trimmed })
      .eq('id', m.id)
    if (error) {
      console.error(error)
      setError('更新失敗')
      setSaving(false)
      return
    }
    setSaving(false)
    cancelEdit()
    await fetchMembers()
    window.dispatchEvent(new CustomEvent('bill:membersChanged', { detail: { bookId } }))
  }

  return (
    <div className="card">
      <div className="row">
        <input
          className="field"
          placeholder="暱稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addMember()
          }}
        />
        <button
          className="btn"
          style={{ width: 120, flexShrink: 0 }}
          onClick={addMember}
          disabled={!canAdd}
        >
          新增
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {loading ? (
        <p className="empty-text" style={{ textAlign: 'left' }}>
          讀取中...
        </p>
      ) : members.length === 0 ? (
        <p className="empty-text" style={{ textAlign: 'left' }}>
          尚未加入成員
        </p>
      ) : (
        <div style={{ marginTop: 6 }}>
          {members.map((m) => (
            <div key={m.id} className="member-item">
              <div className="member-left">
                <span style={{ fontSize: 18 }}>👤</span>
                {editingId === m.id ? (
                  <input
                    className="field"
                    style={{ height: 38, marginBottom: 0, width: 220 }}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(m)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                ) : (
                  <span>{m.name}</span>
                )}
              </div>
              {editingId === m.id ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="pill-link"
                    style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => saveEdit(m)}
                    disabled={saving}
                  >
                    儲存
                  </button>
                  <button
                    className="danger-link"
                    style={{
                      background: '#f1f5f9',
                      color: '#334155'
                    }}
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  className="pill-link"
                  style={{ border: 'none', cursor: 'pointer' }}
                  onClick={() => startEdit(m)}
                  disabled={saving}
                >
                  編輯
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

