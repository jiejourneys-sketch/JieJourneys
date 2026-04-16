import { supabase } from './supabase'

export type ExpenseRpcPayer = {
  member_id: string
  amount: number
}

export type ExpenseRpcSplit = {
  member_id: string
  shared_amount: number
  exclusive_amount: number
  amount: number
}

type ExpenseMutationInput = {
  bookId: string
  description: string
  amount: number
  currency: string
  occurredAt: string
  note: string | null
  payers: ExpenseRpcPayer[]
  splits: ExpenseRpcSplit[]
}

export async function createExpenseWithDetails(input: ExpenseMutationInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_expense_with_details', {
    p_book_id: input.bookId,
    p_description: input.description,
    p_amount: input.amount,
    p_currency: input.currency,
    p_occurred_at: input.occurredAt,
    p_note: input.note,
    p_payers: input.payers,
    p_splits: input.splits,
  })

  if (error) throw error
  return String(data)
}

export async function updateExpenseWithDetails(
  expenseId: string,
  input: ExpenseMutationInput
): Promise<void> {
  const { error } = await supabase.rpc('update_expense_with_details', {
    p_expense_id: expenseId,
    p_book_id: input.bookId,
    p_description: input.description,
    p_amount: input.amount,
    p_currency: input.currency,
    p_occurred_at: input.occurredAt,
    p_note: input.note,
    p_payers: input.payers,
    p_splits: input.splits,
  })

  if (error) throw error
}

export async function deleteExpenseWithDetails(expenseId: string, bookId: string): Promise<void> {
  const { error } = await supabase.rpc('delete_expense_with_details', {
    p_expense_id: expenseId,
    p_book_id: bookId,
  })

  if (error) throw error
}
