-- Run this in the Supabase project used by NEXT_PUBLIC_SUPABASE_URL.
-- It adds copy-ready URLs to every existing and future Bill book and expense.

begin;

alter table public.books
  add column if not exists admin_url text
    generated always as (
      'https://jiejourneys.com/tools/bill/book/' || id::text
    ) stored;

comment on column public.books.admin_url is
  'Admin convenience: complete URL for opening this Bill book.';

alter table public.expenses
  add column if not exists admin_url text
    generated always as (
      'https://jiejourneys.com/tools/bill/book/' || book_id::text ||
      '/expenses/' || id::text || '/edit'
    ) stored;

comment on column public.expenses.admin_url is
  'Admin convenience: complete URL for opening this Bill expense.';

notify pgrst, 'reload schema';

commit;
