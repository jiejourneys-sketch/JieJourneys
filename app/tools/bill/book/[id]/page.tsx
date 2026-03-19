import { supabase } from '@/lib/supabase'
import ExpenseSummary from './components/ExpenseSummary'
import Link from 'next/link'
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

  if (!book) return <div>Loading...</div>

  return (
    <div>
      <RememberBook bookId={id} />
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginBottom: 12 }}
      >
        <Link href="/tools/bill" className="pill-link">
          ← 回清單
        </Link>
        <Link href={`/tools/bill/book/${id}/members`} className="pill-link" data-event="addbillmember">
          + 成員
        </Link>
      </div>

      <div className="book-header book-header--book">
        <div style={{ minWidth: 0 }}>
          <h2>{book.name}</h2>
        </div>
        <TotalExpenseInline bookId={id} />
        <ShareBookButton
          style={{
            padding: '6px 12px',
            fontSize: 14,
            borderRadius: 8
          }}
        />
      </div>

      <div className="card">
        <ExpenseSummary bookId={id} showSettlements={false} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <ExpenseList bookId={id} />
      </div>
    </div>
  )
}
