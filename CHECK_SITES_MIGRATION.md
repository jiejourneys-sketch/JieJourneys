# Check-Sites Migration Notes

This repo now includes the legacy Supabase Edge Function at [supabase/functions/check-sites/index.ts](/e:/JieJourneysnext/supabase/functions/check-sites/index.ts:1).

Old project:
- `jteuzqwyyreuvtzbplvp`

New project:
- `egxwyrjyfjrovivtmjmw`

What still needs to be copied from the old project dashboard:
- Table schema and data for `monitor_sites`
- Table schema and data for `monitor_history`
- Optional history/log data from `monitor_logs`
- Optional config data from `monitors` if the old project still uses it
- Edge Function secrets

Required Edge Function secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Suggested migration order:
1. Recreate the tables in the new project.
2. Import data from the old project.
3. Add the secrets in the new project.
4. Deploy `check-sites` to the new project.
5. Test `?test=true`.
6. Test `?dryrun=true`.
7. Test a single site with `?dryrun=true&site_id=...`.
8. Move any scheduled trigger or external caller to the new function URL.

Useful behavior reminders:
- First run creates baseline history and does not notify.
- `test=true` only checks Telegram.
- `dryrun=true` runs parsing without writing to the database.
- `site_id=...` limits the run to one configured site.
