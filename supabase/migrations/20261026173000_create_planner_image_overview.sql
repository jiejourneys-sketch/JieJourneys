-- Dashboard-friendly image inventory. URLs remain durable while the private
-- Storage object itself is only exposed through short-lived signed URLs.

create or replace view public.planner_image_overview
with (security_invoker = true)
as
select
  book.id as planner_id,
  book.city,
  count(image.id) as image_count,
  count(image.id) > 0 as has_images,
  max(image.created_at) as last_uploaded_at,
  book.admin_view_url as planner_url,
  'https://www.jiejourneys.com/tools/planner-images?book=' || book.id::text as image_overview_url
from public.pass_planner_books as book
left join public.pass_planner_images as image on image.book_id = book.id
group by book.id, book.city, book.admin_view_url
order by max(image.created_at) desc nulls last, book.id;

comment on view public.planner_image_overview is
  'Planner image inventory with copy-ready image overview and Planner URLs for dashboard use.';

revoke all on public.planner_image_overview from anon, authenticated;

notify pgrst, 'reload schema';
