import { supabase } from '@/lib/supabase'
import BillLink from '@/app/tools/bill/components/BillLink'
import BookSettings from './ui/BookSettings'

export default async function SettingsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: book } = await supabase.from('books').select('*').eq('id', id).single()

  if (!book) return <div>找不到帳本</div>

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <BillLink href={`/book/${id}`} className="pill-link">
          ← 回帳本
        </BillLink>
      </div>

      <div className="book-header" style={{ marginBottom: 16 }}>
        <div>
          <h2>貨幣設定</h2>
          <p>{book.name}</p>
        </div>
      </div>

      <div className="card">
        <BookSettings
          bookId={id}
          baseCurrency={(book.base_currency as string) || 'TWD'}
          exchangeRates={(book.exchange_rates as Record<string, number>) || {}}
          customCurrencies={(book.custom_currencies as { code: string; symbol: string; name: string }[]) || []}
        />
      </div>
    </div>
  )
}
