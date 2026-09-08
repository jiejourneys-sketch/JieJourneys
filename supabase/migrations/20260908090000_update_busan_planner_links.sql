-- Keep saved planner books in sync with the current Diamond Bay reservation page.
-- The requested preview also regains the official Busan Metro map link.

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

update public.pass_planner_books
set custom_places = jsonb_set(
  custom_places,
  array['custom:busan-connectivity', 'links'],
  coalesce(custom_places #> array['custom:busan-connectivity', 'links'], '[]'::jsonb)
    || jsonb_build_array(
      jsonb_build_object(
        'label', '釜山地鐵圖（官方）',
        'href', 'https://www2.humetro.busan.kr/homepage/chs/page/subLocation.do?menu_no=10010101'
      )
    )
)
where
  read_token = 'CoRyH08BDB4Y'
  and custom_places ? 'custom:busan-connectivity'
  and not exists (
    select 1
    from jsonb_array_elements(coalesce(custom_places #> array['custom:busan-connectivity', 'links'], '[]'::jsonb)) as link
    where link ->> 'href' = 'https://www2.humetro.busan.kr/homepage/chs/page/subLocation.do?menu_no=10010101'
  );

commit;
