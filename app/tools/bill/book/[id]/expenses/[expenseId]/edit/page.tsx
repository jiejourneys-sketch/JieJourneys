import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import { formatChangeLog, type ChangeLogRow } from '@/lib/changeLog'
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

  let changeLogs: ChangeLogRow[] = []
  const { data: changeData } = await supabase
    .from('change_logs')
    .select('user_name,action_type,target,amount_before,amount_after,before_data,after_data')
    .eq('expense_id', expenseId)
    .order('created_at', { ascending: false })
    .limit(5)
  if (changeData) changeLogs = changeData as ChangeLogRow[]

  if (!book || !expense) return <div>Loading...</div>

  return (
    <div>
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginBottom: 12 }}
      >
        <BillLink href={`/book/${bookId}`} className="pill-link">
          ← 回上頁
        </BillLink>
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

      {changeLogs.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 12, marginTop: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>此賬單變更記錄</div>
          {changeLogs.map((log, i) => {
            const { main, details } = formatChangeLog(log)
            return (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < changeLogs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{main}</div>
                {details.length > 0 && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, paddingLeft: 0 }}>
                    {details.map((d, j) => (
                      <div key={j} style={{ marginTop: 2 }}>＊ {d}</div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

