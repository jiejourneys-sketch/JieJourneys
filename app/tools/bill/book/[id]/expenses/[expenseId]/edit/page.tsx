import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import EditExpenseForm from './ui/EditExpenseForm'

export default async function EditExpensePage({
  params
}: {
  params: Promise<{ id: string; expenseId: string }>
}) {
  const { id: bookId, expenseId } = await params

  const [{ data: book }, { data: members }, { data: expense }, { data: splits }, { data: payers }] =
    await Promise.all([
      supabase.from('books').select('*').eq('id', bookId).single(),
      supabase.from('members').select('*').eq('book_id', bookId),
      supabase.from('expenses').select('*').eq('id', expenseId).single(),
      supabase.from('expense_splits').select('*').eq('expense_id', expenseId),
      supabase.from('expense_payers').select('*').eq('expense_id', expenseId)
    ])

  if (!book || !expense) return <div>Loading...</div>

  return (
    <div>
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginBottom: 12 }}
      >
        <Link href={`/tools/bill/book/${bookId}`} className="pill-link">
          ← 回上頁
        </Link>
      </div>

      <div className="card">
        <EditExpenseForm
          bookId={bookId}
          expense={expense}
          members={members || []}
          splits={splits || []}
          payers={payers || []}
        />
      </div>
    </div>
  )
}
