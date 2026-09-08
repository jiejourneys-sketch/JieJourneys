-- Keep saved planner books in sync with the current Diamond Bay reservation page.

begin;

update public.pass_planner_books
set
  custom_places = replace(
    coalesce(custom_places, '{}'::jsonb)::text,
    'https://diamondbay-tw.imweb.me/vbp-tw',
    'https://diamondbay.co.kr/zh-TW/visit-busan-pass/'
  )::jsonb,
  user_links = replace(
    coalesce(user_links, '{}'::jsonb)::text,
    'https://diamondbay-tw.imweb.me/vbp-tw',
    'https://diamondbay.co.kr/zh-TW/visit-busan-pass/'
  )::jsonb
where
  coalesce(custom_places, '{}'::jsonb)::text like '%https://diamondbay-tw.imweb.me/vbp-tw%'
  or coalesce(user_links, '{}'::jsonb)::text like '%https://diamondbay-tw.imweb.me/vbp-tw%';

commit;
