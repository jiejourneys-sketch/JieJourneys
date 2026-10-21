-- Remember the last problem that was successfully sent to Telegram. This is
-- separate from last_fingerprint so a failed notification can be retried.

alter table public.monitor_link_state
  add column if not exists last_alerted_fingerprint text;
