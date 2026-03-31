'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { logAudit } from '@/lib/audit'

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
  const editRowRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (!editingId) return
    const onPointerDown = (e: PointerEvent) => {
      if (editRowRef.current && !editRowRef.current.contains(e.target as Node)) {
        cancelEdit()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [editingId])

  const addMember = async () => {
    if (!canAdd) return
    setSaving(true)
    setError(null)

    const memberName = name.trim()
    const { data: inserted, error } = await supabase
      .from('members')
      .insert({ book_id: bookId, name: memberName })
      .select()
      .single()

    if (error) {
      console.error(error)
      setError(`新增失敗：${error.message || '未知錯誤'}`)
      setSaving(false)
      return
    }

    if (inserted) logAudit('members', 'insert', inserted.id, bookId, null, inserted)
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
    const beforeData = { id: m.id, book_id: bookId, name: m.name }
    const afterData = { id: m.id, book_id: bookId, name: trimmed }
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
    logAudit('members', 'update', m.id, bookId, beforeData, afterData)
    setSaving(false)
    cancelEdit()
    await fetchMembers()
    window.dispatchEvent(new CustomEvent('bill:membersChanged', { detail: { bookId } }))
  }

  const deleteMember = async (m: MemberRow) => {
    if (!confirm(`確定刪除成員「${m.name}」？此成員的支出紀錄也會一併移除。`)) return
    setSaving(true)
    setError(null)
    const { error } = await supabase.from('members').delete().eq('id', m.id)
    if (error) {
      console.error(error)
      setError('刪除失敗')
      setSaving(false)
      return
    }
    logAudit('members', 'delete', m.id, bookId, { id: m.id, name: m.name }, null)
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
          style={{ minWidth: '6em', flexShrink: 0, whiteSpace: 'nowrap' }}
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
            <div
              key={m.id}
              ref={editingId === m.id ? editRowRef : null}
              className="member-item"
              style={editingId === m.id ? { flexWrap: 'wrap', gap: 8 } : undefined}
            >
              <div className="member-left" style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: 18 }}>👤</span>
                {editingId === m.id ? (
                  <input
                    className="field"
                    style={{ height: 38, marginBottom: 0, flex: 1, minWidth: 0 }}
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
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    className="pill-link"
                    style={{ border: 'none', cursor: 'pointer', padding: '6px 12px', fontSize: 13 }}
                    onClick={() => saveEdit(m)}
                    disabled={saving}
                  >
                    儲存
                  </button>
                  <button
                    className="danger-link"
                    style={{ padding: '6px 12px', fontSize: 13 }}
                    onClick={() => deleteMember(m)}
                    disabled={saving}
                  >
                    刪除
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

