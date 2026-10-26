-- Keep the dashboard inventory simple: each row links directly to that
-- Planner, where the built-in photo overview is available without a second
-- admin-password screen.

drop view if exists public.planner_image_overview;

create view public.planner_image_overview
with (security_invoker = true)
as
select
  book.id as planner_id,
  book.city,
  count(image.id) as image_count,
  count(image.id) > 0 as has_images,
  max(image.created_at) as last_uploaded_at,
  book.admin_view_url as planner_url
from public.pass_planner_books as book
left join public.pass_planner_images as image on image.book_id = book.id
group by book.id, book.city, book.admin_view_url
order by max(image.created_at) desc nulls last, book.id;

comment on view public.planner_image_overview is
  'Planner image inventory with a direct Planner URL for dashboard use.';

revoke all on public.planner_image_overview from anon, authenticated;

notify pgrst, 'reload schema';
