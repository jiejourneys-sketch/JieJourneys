'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ExpenseRow = { id: string; amount: number; description: string; occurred_at?: string; created_at?: string }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type SplitRow = { expense_id: string; member_id: string; amount: number }

function dayKey(iso: string | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function MemberPlanDetails({
  bookId,
  memberId,
  memberName,
  bookName
}: {
  bookId: string
  memberId: string
  memberName: string
  bookName: string
}) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [payers, setPayers] = useState<PayerRow[]>([])
  const [splits, setSplits] = useState<SplitRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDownload, setShowDownload] = useState(false)

  useEffect(() => {
    let alive = true
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const { data: eData, error: eErr } = await supabase
        .from('expenses')
        .select('id,amount,description,occurred_at,created_at')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })

      if (!alive) return
      if (eErr) {
        console.error(eErr)
        setError('讀取帳目失敗')
        setLoading(false)
        return
      }

      const nextExpenses = (eData as ExpenseRow[]) || []
      setExpenses(nextExpenses)

      if (!nextExpenses.length) {
        setPayers([])
        setSplits([])
        setLoading(false)
        return
      }

      const ids = nextExpenses.map((e) => e.id)
      const [{ data: pData, error: pErr }, { data: sData, error: sErr }] = await Promise.all([
        supabase.from('expense_payers').select('expense_id,member_id,amount').in('expense_id', ids),
        supabase.from('expense_splits').select('expense_id,member_id,amount').in('expense_id', ids)
      ])

      if (!alive) return
      if (pErr) console.error(pErr)
      if (sErr) console.error(sErr)
      setPayers((pData as PayerRow[]) || [])
      setSplits((sData as SplitRow[]) || [])
      setLoading(false)
    }

    const onChanged = (ev: Event) => {
      const bookIdFromEvent = (ev as CustomEvent)?.detail?.bookId
      if (bookIdFromEvent && bookIdFromEvent !== bookId) return
      fetchData()
    }

    fetchData()
    window.addEventListener('bill:expenseAdded', onChanged)
    window.addEventListener('bill:expensesChanged', onChanged)
    return () => {
      alive = false
      window.removeEventListener('bill:expenseAdded', onChanged)
      window.removeEventListener('bill:expensesChanged', onChanged)
    }
  }, [bookId])

  const { paidTotal, shareTotal, balance, paidLines, shareLines } = useMemo(() => {
    const expById = new Map(expenses.map((e) => [e.id, e] as const))

    const paidRows = payers.filter((p) => p.member_id === memberId).filter((p) => Number(p.amount || 0) !== 0)
    const shareRows = splits.filter((s) => s.member_id === memberId).filter((s) => Number(s.amount || 0) !== 0)

    const paidTotal = paidRows.reduce((s, r) => s + Number(r.amount || 0), 0)
    const shareTotal = shareRows.reduce((s, r) => s + Number(r.amount || 0), 0)
    const balance = paidTotal - shareTotal

    const paidLines = paidRows
      .map((r) => {
        const e = expById.get(r.expense_id)
        return {
          expenseId: r.expense_id,
          title: e?.description || '（已刪除）',
          date: dayKey(e?.occurred_at || e?.created_at),
          amount: Number(r.amount || 0)
        }
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const shareLines = shareRows
      .map((r) => {
        const e = expById.get(r.expense_id)
        return {
          expenseId: r.expense_id,
          title: e?.description || '（已刪除）',
          date: dayKey(e?.occurred_at || e?.created_at),
          amount: Number(r.amount || 0)
        }
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    return { paidTotal, shareTotal, balance, paidLines, shareLines }
  }, [expenses, memberId, payers, splits])

  const periodLabel = useMemo(() => {
    const dates = [...paidLines, ...shareLines]
      .map((x) => x.date)
      .filter((d): d is string => Boolean(d))
      .sort()
    if (!dates.length) return ''
    const min = dates[0]
    const max = dates[dates.length - 1]
    return min === max ? min : `${min} ~ ${max}`
  }, [paidLines, shareLines])

  const balColor = balance >= 0 ? '#059669' : '#dc2626'

  const downloadExcel = async () => {
    const XLSX = await import('xlsx')
    const aoa: (string | number)[][] = []
    aoa.push([`${memberName}｜消費明細`])
    aoa.push([bookName])
    aoa.push([])

    aoa.push(['消費'])
    aoa.push(['日期', '項目', '金額'])
    shareLines.forEach((x) => aoa.push([x.date || '', x.title, x.amount]))
    aoa.push(['', '總額', shareTotal])

    aoa.push([])
    aoa.push(['已付'])
    aoa.push(['日期', '項目', '金額'])
    paidLines.forEach((x) => aoa.push([x.date || '', x.title, x.amount]))
    aoa.push(['', '總額', paidTotal])

    const ws = XLSX.utils.aoa_to_sheet(aoa)
    // basic column widths
    type ColSpec = { wch: number }
    type SheetWithCols = Record<string, unknown> & { '!cols'?: ColSpec[] }
    ;(ws as SheetWithCols)['!cols'] = [{ wch: 12 }, { wch: 34 }, { wch: 10 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '明細')
    XLSX.writeFile(wb, `${memberName}-消費明細.xlsx`)
  }

  const downloadPdf = () => {
    const esc = (s: string) =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

    const rowsPaid = paidLines
      .map(
        (x) => `
        <tr>
          <td>${esc(x.date || '')}</td>
          <td>${esc(x.title)}</td>
          <td class="num">${x.amount}</td>
        </tr>`
      )
      .join('')
    const rowsSpend = shareLines
      .map(
        (x) => `
        <tr>
          <td>${esc(x.date || '')}</td>
          <td>${esc(x.title)}</td>
          <td class="num">${x.amount}</td>
        </tr>`
      )
      .join('')

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(memberName)} 消費明細</title>
  <style>
    :root{--brand:#1f7a8c;--ink:#0f172a;--muted:#64748b;--bg:#f3f6f9;}
    body{font-family: ui-sans-serif,system-ui,"Noto Sans TC",Arial; margin:0; background:var(--bg); color:var(--ink);}
    .wrap{max-width:820px; margin:24px auto; padding:0 16px;}
    .head{display:flex; justify-content:space-between; align-items:flex-start; padding:14px 16px; background:#fff; border:2px solid rgba(31,122,140,.35); border-radius:16px;}
    .title{font-weight:900; font-size:18px;}
    .sub{color:var(--muted); font-size:13px; margin-top:4px;}
    .brandbar{display:flex; align-items:center; gap:8px; justify-content:flex-end; color:var(--muted); font-size:12px; font-weight:800; white-space:nowrap;}
    .brandbar img{width:22px;height:22px; object-fit:contain;}
    .badge{color:var(--brand); font-weight:900; font-size:12px; font-variant-numeric: tabular-nums;}
    .card{background:#fff; border:1px solid rgba(0,0,0,.06); border-radius:14px; padding:14px 16px; margin-top:14px;}
    h3{margin:0 0 10px; font-size:15px;}
    .tablewrap{border:1px solid rgba(0,0,0,.06); border-radius:12px; overflow:hidden;}
    table{width:100%; border-collapse:collapse; font-size:13px;}
    th,td{padding:10px 10px; border-bottom:1px solid rgba(0,0,0,.06); vertical-align:top;}
    thead th{background:#f8fafc; color:var(--muted); text-align:left; font-weight:900;}
    tbody tr:nth-child(even){background:#fbfdff;}
    td.num, th.num{text-align:right; font-variant-numeric: tabular-nums;}
    .total{font-weight:900; background:#f1f5f9;}
    .summary{display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; color:var(--muted); font-size:13px;}
    @media print{
      body{background:#fff;}
      .head{border-color:#ddd;}
      .wrap{margin:0; max-width:none;}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <div>
        <div class="title">${esc(memberName)} 消費明細</div>
        <div class="sub">${esc(bookName)}</div>
      </div>
      <div style="text-align:right;">
        <div class="brandbar">
          <span>JieJourneys｜旅杰</span>
        </div>
        <div class="badge">${esc(periodLabel || new Date().toISOString().slice(0,10))}</div>
      </div>
    </div>

    <div class="card">
      <div class="summary">
        <div>消費：<b>${shareTotal}</b></div>
        <div>已付：<b>${paidTotal}</b></div>
        <div>差額：<b style="color:${balance>=0?'#059669':'#dc2626'}">${balance>=0?'+':''}${balance}</b></div>
      </div>
    </div>

    <div class="card">
      <h3>消費</h3>
      <div class="tablewrap">
        <table>
          <thead><tr><th style="width:110px;">日期</th><th>項目</th><th class="num" style="width:90px;">金額</th></tr></thead>
          <tbody>
            ${rowsSpend || '<tr><td colspan="3" style="color:#94a3b8;">沒有消費紀錄</td></tr>'}
            <tr class="total"><td></td><td class="total">總額</td><td class="num total">${shareTotal}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3>已付</h3>
      <div class="tablewrap">
        <table>
          <thead><tr><th style="width:110px;">日期</th><th>項目</th><th class="num" style="width:90px;">金額</th></tr></thead>
          <tbody>
            ${rowsPaid || '<tr><td colspan="3" style="color:#94a3b8;">沒有付款紀錄</td></tr>'}
            <tr class="total"><td></td><td class="total">總額</td><td class="num total">${paidTotal}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <script>window.onload=()=>{ setTimeout(()=>window.print(), 50); };</script>
</body>
</html>`
    // Use hidden iframe to avoid popup blockers
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.srcdoc = html
    document.body.appendChild(iframe)
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } finally {
        setTimeout(() => iframe.remove(), 1000)
      }
    }
  }

  return (
    <div>
      {loading ? <div className="empty-text">讀取中…</div> : null}
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}

      {!loading && !error ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 800, color: '#16324f' }}>{memberName}</div>
            <div style={{ fontWeight: 900, color: balColor, fontVariantNumeric: 'tabular-nums' }}>
              {balance >= 0 ? '+' : ''}
              {balance}
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            消費：{shareTotal}　已付：{paidTotal}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              className="pill-link"
              style={{ border: 'none', cursor: 'pointer' }}
              type="button"
              onClick={() => setShowDownload(true)}
              data-event="downloadbill"
            >
              下載
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>消費</div>
            {shareLines.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13 }}>沒有消費紀錄</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {shareLines.map((x) => (
                  <div key={`s-${x.expenseId}-${x.amount}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{x.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{x.date}</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#16324f', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                      {x.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>已付</div>
            {paidLines.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13 }}>沒有付款紀錄</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {paidLines.map((x) => (
                  <div
                    key={`p-${x.expenseId}-${x.amount}`}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{x.title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{x.date}</div>
                    </div>
                    <div
                      style={{
                        fontWeight: 900,
                        color: '#16324f',
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {x.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}

      {showDownload ? (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowDownload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">下載消費明細</div>
              <button className="modal-close" onClick={() => setShowDownload(false)}>
                關閉
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  className="btn secondary"
                  style={{ width: 160 }}
                  type="button"
                  onClick={downloadExcel}
                  data-event="downloadbillexcel"
                >
                  Excel（.xlsx）
                </button>
                <button
                  className="btn secondary"
                  style={{ width: 160 }}
                  type="button"
                  onClick={downloadPdf}
                  data-event="downloadbillpdf"
                >
                  PDF
                </button>
              </div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 10 }}>
                PDF 會開啟列印視窗，選「另存為 PDF」即可下載。
              </div>
            </div>
            <div className="modal-actions">
              <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setShowDownload(false)}>
                完成
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

