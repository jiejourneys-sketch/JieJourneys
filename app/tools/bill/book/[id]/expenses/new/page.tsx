import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import NewExpenseForm from './ui/NewExpenseForm'

export default async function NewExpensePage({
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

  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('book_id', id)

  if (!book) return <div>Loading...</div>

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <BillLink href={`/book/${id}`} className="pill-link">
          ← 回上頁
        </BillLink>
      </div>

      <div className="book-header" style={{ marginBottom: 16 }}>
        <div>
          <h2>新增帳目</h2>
          <p>{book.name}</p>
        </div>
      </div>

      <div className="card">
        <NewExpenseForm bookId={id} members={members || []} />
      </div>
    </div>
  )
}

