import BillLink from '@/app/tools/bill/components/BillLink'
import { supabase } from '@/lib/supabase'
import { resolveExchangeRates } from '@/lib/serverRates'
import MemberPlanDetails from './ui/MemberPlanDetails'

export default async function MemberPlanPage({
  params
}: {
  params: Promise<{ id: string; memberId: string }>
}) {
  const { id: bookId, memberId } = await params

  const [{ data: book }, { data: member }] = await Promise.all([
    supabase.from('books').select('*').eq('id', bookId).single(),
    supabase.from('members').select('*').eq('id', memberId).single()
  ])

  if (!book || !member) return <div>Loading...</div>

  const baseCurrency = (book.base_currency as string) || 'TWD'
  const storedRates = (book.exchange_rates as Record<string, number>) || {}
  const exchangeRates = await resolveExchangeRates(baseCurrency, storedRates)

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <BillLink href={`/book/${bookId}/plan`} className="pill-link">
          ← 回費用明細
        </BillLink>
      </div>

      <div className="book-header" style={{ marginBottom: 16 }}>
        <div>
          <h2>{member.name}</h2>
          <p>{book.name}</p>
        </div>
      </div>

      <div className="card">
        <MemberPlanDetails
          bookId={bookId}
          memberId={memberId}
          memberName={member.name}
          bookName={book.name}
          baseCurrency={baseCurrency}
          exchangeRates={exchangeRates}
        />
      </div>
    </div>
  )
}
