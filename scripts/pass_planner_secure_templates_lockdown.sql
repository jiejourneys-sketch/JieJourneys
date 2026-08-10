-- Part 2 of 2. Run this only AFTER the new planner website version is live.
-- It removes direct browser access to planner books; all reads and writes then
-- go through the validated security-definer functions from Part 1.

begin;

revoke all on public.pass_planner_books from anon, authenticated;

-- New website code has already switched to edit_token. Old image-owner tokens
-- remain usable only for one-time recovery of an editor's local access, never
-- for changing photos after this point.
update public.pass_planner_books
set allow_legacy_image_owner = false
where allow_legacy_image_owner = true;

notify pgrst, 'reload schema';

commit;
