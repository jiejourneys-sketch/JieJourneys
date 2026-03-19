import Link from 'next/link'
import { supabase } from '@/lib/supabase'
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

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <Link href={`/book/${bookId}/plan`} className="pill-link">
          ← 回費用明細
        </Link>
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
        />
      </div>
    </div>
  )
}

