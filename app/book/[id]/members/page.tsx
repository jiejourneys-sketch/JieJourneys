import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import MemberManager from './ui/MemberManager'

export default async function MembersPage({
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
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <Link href={`/book/${id}`} className="pill-link">
          ← 回帳本
        </Link>
      </div>

      <div className="book-header" style={{ marginBottom: 16 }}>
        <div>
          <h2>帳本成員</h2>
          <p>{book.name}</p>
        </div>
      </div>

      <MemberManager bookId={id} />
    </div>
  )
}

