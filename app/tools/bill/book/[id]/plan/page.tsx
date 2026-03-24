import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import PlanDashboard from './ui/PlanDashboard'
import TotalExpenseInline from '../components/TotalExpenseInline'
import RememberBook from '../components/RememberBook'

export default async function PlanPage({
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
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <BillLink href={`/book/${id}`} className="pill-link">
          ← 回帳本
        </BillLink>
      </div>

      <div className="book-header book-header--book" style={{ marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <h2>費用明細</h2>
        </div>
        <div />
        <TotalExpenseInline bookId={id} />
      </div>

      <PlanDashboard bookId={id} />
    </div>
  )
}

