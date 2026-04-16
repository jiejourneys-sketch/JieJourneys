create or replace function public.create_expense_with_details(
  p_book_id uuid,
  p_description text,
  p_amount bigint,
  p_currency text,
  p_occurred_at timestamptz,
  p_note text,
  p_payers jsonb,
  p_splits jsonb
)
returns uuid
language plpgsql
as $$
declare
  v_expense_id uuid;
  v_payer_sum bigint;
  v_split_sum bigint;
begin
  if coalesce(jsonb_array_length(p_payers), 0) = 0 then
    raise exception 'At least one payer is required';
  end if;

  if coalesce(jsonb_array_length(p_splits), 0) = 0 then
    raise exception 'At least one split is required';
  end if;

  select coalesce(sum((item->>'amount')::bigint), 0)
    into v_payer_sum
  from jsonb_array_elements(p_payers) as item;

  select coalesce(sum((item->>'amount')::bigint), 0)
    into v_split_sum
  from jsonb_array_elements(p_splits) as item;

  if v_payer_sum <> p_amount then
    raise exception 'Payer total does not match expense amount';
  end if;

  if v_split_sum <> p_amount then
    raise exception 'Split total does not match expense amount';
  end if;

  insert into public.expenses (
    book_id,
    description,
    amount,
    currency,
    occurred_at,
    note
  )
  values (
    p_book_id,
    p_description,
    p_amount,
    p_currency,
    p_occurred_at,
    nullif(p_note, '')
  )
  returning id into v_expense_id;

  insert into public.expense_payers (expense_id, member_id, amount)
  select
    v_expense_id,
    (item->>'member_id')::uuid,
    (item->>'amount')::bigint
  from jsonb_array_elements(p_payers) as item;

  insert into public.expense_splits (expense_id, member_id, shared_amount, exclusive_amount, amount)
  select
    v_expense_id,
    (item->>'member_id')::uuid,
    coalesce((item->>'shared_amount')::bigint, 0),
    coalesce((item->>'exclusive_amount')::bigint, 0),
    (item->>'amount')::bigint
  from jsonb_array_elements(p_splits) as item;

  return v_expense_id;
end;
$$;

create or replace function public.update_expense_with_details(
  p_expense_id uuid,
  p_book_id uuid,
  p_description text,
  p_amount bigint,
  p_currency text,
  p_occurred_at timestamptz,
  p_note text,
  p_payers jsonb,
  p_splits jsonb
)
returns void
language plpgsql
as $$
declare
  v_exists boolean;
  v_payer_sum bigint;
  v_split_sum bigint;
begin
  if coalesce(jsonb_array_length(p_payers), 0) = 0 then
    raise exception 'At least one payer is required';
  end if;

  if coalesce(jsonb_array_length(p_splits), 0) = 0 then
    raise exception 'At least one split is required';
  end if;

  select exists(
    select 1
    from public.expenses
    where id = p_expense_id
      and book_id = p_book_id
  ) into v_exists;

  if not v_exists then
    raise exception 'Expense not found';
  end if;

  select coalesce(sum((item->>'amount')::bigint), 0)
    into v_payer_sum
  from jsonb_array_elements(p_payers) as item;

  select coalesce(sum((item->>'amount')::bigint), 0)
    into v_split_sum
  from jsonb_array_elements(p_splits) as item;

  if v_payer_sum <> p_amount then
    raise exception 'Payer total does not match expense amount';
  end if;

  if v_split_sum <> p_amount then
    raise exception 'Split total does not match expense amount';
  end if;

  update public.expenses
  set
    description = p_description,
    amount = p_amount,
    currency = p_currency,
    occurred_at = p_occurred_at,
    note = nullif(p_note, '')
  where id = p_expense_id
    and book_id = p_book_id;

  delete from public.expense_payers
  where expense_id = p_expense_id;

  insert into public.expense_payers (expense_id, member_id, amount)
  select
    p_expense_id,
    (item->>'member_id')::uuid,
    (item->>'amount')::bigint
  from jsonb_array_elements(p_payers) as item;

  delete from public.expense_splits
  where expense_id = p_expense_id;

  insert into public.expense_splits (expense_id, member_id, shared_amount, exclusive_amount, amount)
  select
    p_expense_id,
    (item->>'member_id')::uuid,
    coalesce((item->>'shared_amount')::bigint, 0),
    coalesce((item->>'exclusive_amount')::bigint, 0),
    (item->>'amount')::bigint
  from jsonb_array_elements(p_splits) as item;
end;
$$;

create or replace function public.delete_expense_with_details(
  p_expense_id uuid,
  p_book_id uuid
)
returns void
language plpgsql
as $$
declare
  v_exists boolean;
begin
  select exists(
    select 1
    from public.expenses
    where id = p_expense_id
      and book_id = p_book_id
  ) into v_exists;

  if not v_exists then
    raise exception 'Expense not found';
  end if;

  delete from public.expense_payers
  where expense_id = p_expense_id;

  delete from public.expense_splits
  where expense_id = p_expense_id;

  delete from public.expenses
  where id = p_expense_id
    and book_id = p_book_id;
end;
$$;
