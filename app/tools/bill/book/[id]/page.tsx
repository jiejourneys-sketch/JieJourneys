import { supabase } from '@/lib/supabase'
import { resolveExchangeRates } from '@/lib/serverRates'
import ExpenseSummary from './components/ExpenseSummary'
import BillLink from '@/app/tools/bill/components/BillLink'
import BillHomeLink from '@/app/tools/bill/components/BillHomeLink'
import ExpenseList from './components/ExpenseList'
import ShareBookButton from './components/ShareBookButton'
import TotalExpenseInline from './components/TotalExpenseInline'
import RememberBook from './components/RememberBook'

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (!book) return (
    <div>
      <p style={{ color: '#6b7280', marginBottom: 12 }}>找不到帳本，可能已被刪除。</p>
      <a href="/tools/bill" style={{ color: '#2C7292', fontWeight: 700 }}>← 回清單</a>
    </div>
  )

  const baseCurrency = (book.base_currency as string) || 'TWD'
  const storedRates = (book.exchange_rates as Record<string, number>) || {}
  const exchangeRates = await resolveExchangeRates(baseCurrency, storedRates)

  return (
    <div>
      <RememberBook bookId={id} />
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginBottom: 12 }}
      >
        <BillHomeLink className="pill-link">
          ← 回清單
        </BillHomeLink>
        <div style={{ display: 'flex', gap: 8 }}>
          <BillLink href={`/book/${id}/settings`} className="pill-link" data-event="billcurrency">
            貨幣設定
          </BillLink>
          <BillLink href={`/book/${id}/members`} className="pill-link" data-event="addbillmember">
            + 成員
          </BillLink>
        </div>
      </div>

      <div className="book-header book-header--book">
        <h2>{book.name}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TotalExpenseInline bookId={id} baseCurrency={baseCurrency} exchangeRates={exchangeRates} />
          <ShareBookButton style={{ padding: '6px 12px', fontSize: 14, borderRadius: 8 }} />
        </div>
      </div>

      <div className="card">
        <ExpenseSummary
          bookId={id}
          showSettlements={false}
          baseCurrency={baseCurrency}
          exchangeRates={exchangeRates}
        />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <ExpenseList bookId={id} baseCurrency={baseCurrency} exchangeRates={exchangeRates} />
      </div>
    </div>
  )
}
