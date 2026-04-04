'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCents, formatWithCurrency } from '@/lib/amount'
import { convertCents, type ExchangeRates } from '@/lib/currency'

type ExpenseRow = { id: string; amount: number; currency?: string; description: string; occurred_at?: string; created_at?: string }
type PayerRow = { expense_id: string; member_id: string; amount: number }
type SplitRow = { expense_id: string; member_id: string; amount: number }

type Line = {
  expenseId: string
  title: string
  date: string
  amount: number
  currency: string
}

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
  bookName,
  baseCurrency,
  exchangeRates
}: {
  bookId: string
  memberId: string
  memberName: string
  bookName: string
  baseCurrency: string
  exchangeRates: ExchangeRates
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
        .select('id,amount,currency,description,occurred_at,created_at')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })

      if (!alive) return
      if (eErr) { console.error(eErr); setError('讀取帳目失敗'); setLoading(false); return }

      const nextExpenses = (eData as ExpenseRow[]) || []
      setExpenses(nextExpenses)

      if (!nextExpenses.length) { setPayers([]); setSplits([]); setLoading(false); return }

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

    const convertAmt = (cents: number, expenseId: string) => {
      const expCur = expById.get(expenseId)?.currency || baseCurrency
      return convertCents(cents, expCur, baseCurrency, baseCurrency, exchangeRates)
    }

    const paidRows = payers.filter((p) => p.member_id === memberId).filter((p) => Number(p.amount || 0) !== 0)
    const shareRows = splits.filter((s) => s.member_id === memberId).filter((s) => Number(s.amount || 0) !== 0)

    const paidLines: Line[] = paidRows
      .map((r) => {
        const e = expById.get(r.expense_id)
        return {
          expenseId: r.expense_id,
          title: e?.description || '（已刪除）',
          date: dayKey(e?.occurred_at || e?.created_at),
          amount: Number(r.amount || 0),
          currency: e?.currency || baseCurrency
        }
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const shareLines: Line[] = shareRows
      .map((r) => {
        const e = expById.get(r.expense_id)
        return {
          expenseId: r.expense_id,
          title: e?.description || '（已刪除）',
          date: dayKey(e?.occurred_at || e?.created_at),
          amount: Number(r.amount || 0),
          currency: e?.currency || baseCurrency
        }
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const paidTotal = paidLines.reduce((s, x) => {
      const c = convertAmt(x.amount, x.expenseId)
      return isNaN(c) ? s : s + c
    }, 0)
    const shareTotal = shareLines.reduce((s, x) => {
      const c = convertAmt(x.amount, x.expenseId)
      return isNaN(c) ? s : s + c
    }, 0)
    const balance = paidTotal - shareTotal

    return { paidTotal, shareTotal, balance, paidLines, shareLines }
  }, [expenses, memberId, payers, splits, baseCurrency, baseCurrency, exchangeRates])

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

  const balColor = balance >= 0 ? '#dc2626' : '#059669'

  const downloadExcel = async () => {
    const XLSX = await import('xlsx')
    const aoa: (string | number)[][] = []
    aoa.push([`${memberName}｜消費明細`])
    aoa.push([bookName])
    aoa.push([`金額顯示貨幣：${baseCurrency}`])
    aoa.push([])

    aoa.push(['消費'])
    aoa.push(['日期', '項目', '原始金額', '貨幣', `換算 ${baseCurrency}`])
    shareLines.forEach((x) => {
      const converted = convertCents(x.amount, x.currency, baseCurrency, baseCurrency, exchangeRates)
      aoa.push([x.date || '', x.title, formatCents(x.amount), x.currency, isNaN(converted) ? '' : formatCents(converted)])
    })
    aoa.push(['', '總額', '', '', formatCents(shareTotal)])

    aoa.push([])
    aoa.push(['已付'])
    aoa.push(['日期', '項目', '原始金額', '貨幣', `換算 ${baseCurrency}`])
    paidLines.forEach((x) => {
      const converted = convertCents(x.amount, x.currency, baseCurrency, baseCurrency, exchangeRates)
      aoa.push([x.date || '', x.title, formatCents(x.amount), x.currency, isNaN(converted) ? '' : formatCents(converted)])
    })
    aoa.push(['', '總額', '', '', formatCents(paidTotal)])

    const ws = XLSX.utils.aoa_to_sheet(aoa)
    type ColSpec = { wch: number }
    type SheetWithCols = Record<string, unknown> & { '!cols'?: ColSpec[] }
    ;(ws as SheetWithCols)['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 10 }, { wch: 6 }, { wch: 12 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '明細')
    XLSX.writeFile(wb, `${memberName}-消費明細.xlsx`)

    supabase.from('download_logs').insert({ book_id: bookId, member_id: memberId, format: 'excel' }).then(() => {})
  }

  const downloadPdf = async () => {
    const esc = (s: string) =>
      String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

    const fmtLine = (x: Line) => {
      if (x.currency === baseCurrency) return formatWithCurrency(x.amount, x.currency)
      const converted = convertCents(x.amount, x.currency, baseCurrency, baseCurrency, exchangeRates)
      const orig = formatWithCurrency(x.amount, x.currency)
      if (isNaN(converted)) return orig
      return `${formatWithCurrency(converted, baseCurrency)} <span style="color:#94a3b8;font-size:11px">(${orig})</span>`
    }

    const rowsPaid = paidLines.map((x) => `
      <tr>
        <td>${esc(x.date || '')}</td>
        <td>${esc(x.title)}</td>
        <td class="num">${fmtLine(x)}</td>
      </tr>`).join('')

    const rowsSpend = shareLines.map((x) => `
      <tr>
        <td>${esc(x.date || '')}</td>
        <td>${esc(x.title)}</td>
        <td class="num">${fmtLine(x)}</td>
      </tr>`).join('')

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(memberName)} 消費明細</title>
  <style>
    *{box-sizing:border-box;}
    body{font-family: ui-sans-serif,system-ui,"Noto Sans TC",Arial,sans-serif; margin:0; padding:16px; background:#fff; color:#0f172a; font-size:14px; line-height:1.5;}
    .wrap{max-width:480px; margin:0 auto;}
    .head{display:flex; justify-content:space-between; align-items:flex-start; padding:12px 16px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:12px;}
    .title{font-weight:800; font-size:17px; color:#16324f;}
    .sub{color:#64748b; font-size:13px; margin-top:4px;}
    .brand{color:#64748b; font-size:12px; font-weight:700;}
    .badge{color:#1f7a8c; font-weight:800; font-size:12px; font-variant-numeric:tabular-nums;}
    .summary{display:flex; gap:16px; flex-wrap:wrap; padding:12px 16px; background:#f8fafc; border-radius:12px; margin-bottom:12px; font-size:14px;}
    .summary b{color:#16324f;}
    .section{margin-bottom:16px;}
    .section h3{margin:0 0 8px; font-size:15px; font-weight:800; color:#16324f;}
    table{width:100%; border-collapse:collapse; font-size:14px; table-layout:fixed;}
    th,td{padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:left;}
    th{color:#64748b; font-weight:700; font-size:12px;}
    .num{text-align:right !important; font-variant-numeric:tabular-nums;}
    .col-date{width:28%;}
    .col-amt{width:26%;}
    td:nth-child(2){word-break:break-word;}
    tr.total td{font-weight:800; background:#f1f5f9; border-bottom:none;}
    .empty{color:#94a3b8; font-size:13px;}
    @media print{body{background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact;} @page{margin:12mm; size:A4;}}
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
        <div class="brand">JieJourneys｜旅杰</div>
        <div class="badge">${esc(periodLabel || new Date().toISOString().slice(0, 10))}</div>
      </div>
    </div>
    <div class="summary">
      <span>消費：<b>${formatWithCurrency(shareTotal, baseCurrency)}</b></span>
      <span>已付：<b>${formatWithCurrency(paidTotal, baseCurrency)}</b></span>
      <span>差額：<b style="color:${balance >= 0 ? '#dc2626' : '#059669'}">${balance >= 0 ? '+' : ''}${formatWithCurrency(balance, baseCurrency)}</b></span>
    </div>
    <div class="section">
      <h3>消費</h3>
      <table>
        <thead><tr><th class="col-date">日期</th><th>項目</th><th class="num col-amt">金額</th></tr></thead>
        <tbody>
          ${rowsSpend || '<tr><td colspan="3" class="empty">沒有消費紀錄</td></tr>'}
          <tr class="total"><td></td><td>總額</td><td class="num">${formatWithCurrency(shareTotal, baseCurrency)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <h3>已付</h3>
      <table>
        <thead><tr><th class="col-date">日期</th><th>項目</th><th class="num col-amt">金額</th></tr></thead>
        <tbody>
          ${rowsPaid || '<tr><td colspan="3" class="empty">沒有付款紀錄</td></tr>'}
          <tr class="total"><td></td><td>總額</td><td class="num">${formatWithCurrency(paidTotal, baseCurrency)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print()},80)};</script>
</body>
</html>`

    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;border:0;z-index:99999;background:#fff'
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument
    if (!doc) { iframe.remove(); return }
    doc.open(); doc.write(html); doc.close()
    iframe.onload = () => { iframe.contentWindow?.focus(); iframe.contentWindow?.print() }
    const removeIframe = () => { if (iframe.parentNode) iframe.remove(); window.removeEventListener('afterprint', removeIframe) }
    window.addEventListener('afterprint', removeIframe)
    setTimeout(removeIframe, 30000)
    supabase.from('download_logs').insert({ book_id: bookId, member_id: memberId, format: 'pdf' }).then(() => {})
  }

  return (
    <div>
      {loading ? <div className="empty-text">讀取中…</div> : null}
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}

      {!loading && !error ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 800, color: '#16324f' }}>{memberName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontWeight: 900, color: balColor, fontVariantNumeric: 'tabular-nums' }}>
                {balance >= 0 ? '+' : ''}
                {formatWithCurrency(balance, baseCurrency)}
              </div>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            消費：{formatWithCurrency(shareTotal, baseCurrency)}　已付：{formatWithCurrency(paidTotal, baseCurrency)}
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
                {shareLines.map((x) => {
                  const converted = convertCents(x.amount, x.currency, baseCurrency, baseCurrency, exchangeRates)
                  return (
                    <div key={`s-${x.expenseId}-${x.amount}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{x.title}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{x.date}</div>
                      </div>
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        <div style={{ fontWeight: 900, color: '#16324f' }}>
                          {isNaN(converted) ? formatWithCurrency(x.amount, x.currency) : formatWithCurrency(converted, baseCurrency)}
                        </div>
                        {x.currency !== baseCurrency && !isNaN(converted) && (
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{formatWithCurrency(x.amount, x.currency)}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, color: '#16324f', marginBottom: 6 }}>已付</div>
            {paidLines.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13 }}>沒有付款紀錄</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {paidLines.map((x) => {
                  const converted = convertCents(x.amount, x.currency, baseCurrency, baseCurrency, exchangeRates)
                  return (
                    <div key={`p-${x.expenseId}-${x.amount}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{x.title}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{x.date}</div>
                      </div>
                      <div style={{ textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                        <div style={{ fontWeight: 900, color: '#16324f' }}>
                          {isNaN(converted) ? formatWithCurrency(x.amount, x.currency) : formatWithCurrency(converted, baseCurrency)}
                        </div>
                        {x.currency !== baseCurrency && !isNaN(converted) && (
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{formatWithCurrency(x.amount, x.currency)}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
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
              <button className="modal-close" onClick={() => setShowDownload(false)}>關閉</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn secondary" style={{ flex: '1 1 160px', maxWidth: '100%' }} type="button" onClick={downloadExcel} data-event="downloadbillexcel">
                  Excel（.xlsx）
                </button>
                <button className="btn secondary" style={{ flex: '1 1 160px', maxWidth: '100%' }} type="button" onClick={downloadPdf} data-event="downloadbillpdf">
                  PDF
                </button>
              </div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 10 }}>
                PDF 會開啟列印視窗，選「另存為 PDF」即可下載。
              </div>
            </div>
            <div className="modal-actions">
              <button className="pill-link" style={{ border: 'none', cursor: 'pointer' }} type="button" onClick={() => setShowDownload(false)}>完成</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
