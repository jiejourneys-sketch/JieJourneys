import { load } from "npm:cheerio@1.1.2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REQUEST_TIMEOUT_MS = clampNumber(Deno.env.get("CONTENT_MONITOR_TIMEOUT_MS"), 15_000, 3_000, 45_000);
const MAX_SITES_PER_RUN = clampNumber(Deno.env.get("CONTENT_MONITOR_MAX_SITES_PER_RUN"), 20, 1, 50);
const MAX_CONCURRENCY = clampNumber(Deno.env.get("CONTENT_MONITOR_CONCURRENCY"), 3, 1, 5);
const FAILURE_ALERT_THRESHOLD = clampNumber(Deno.env.get("CONTENT_MONITOR_FAILURE_ALERT_THRESHOLD"), 3, 1, 10);
const EVENT_BATCH_SIZE = 20;
const PREVIEW_LENGTH = 1_200;
const TELEGRAM_TEXT_LIMIT = 3_700;
const MONITOR_METADATA_KEYS = new Set(["source_page_url", "notify_if_matches"]);

type SourceType = "html" | "json";
type EventType = "change" | "error" | "recovered";

type MonitorSite = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  source_type: SourceType;
  selector_or_path: string | null;
  ignore_patterns: string[] | null;
  request_headers: Record<string, unknown> | null;
  check_every_minutes: number;
  notify_changes: boolean;
  notify_failures: boolean;
};

type MonitorState = {
  site_id: string;
  last_hash: string | null;
  last_content_preview: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  consecutive_failures: number;
  last_error: string | null;
  alerted_error_fingerprint: string | null;
};

type MonitorEvent = {
  id: number;
  site_id: string;
  site_name: string;
  site_url: string;
  event_type: EventType;
  fingerprint: string;
  old_content_preview: string | null;
  new_content_preview: string | null;
  error_message: string | null;
  notification_claim_token: string | null;
};

type SiteResult = "baseline" | "unchanged" | "changed" | "failed" | "recovered";

function clampNumber(raw: string | undefined, fallback: number, min: number, max: number) {
  const value = Number(raw);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

function getServiceKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;

  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}") as Record<string, string>;
    return keys.default ?? "";
  } catch {
    return "";
  }
}

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const key = getServiceKey();
  if (!url || !key) throw new Error("Supabase service credentials are unavailable");
  return createClient(url, key, { auth: { persistSession: false } });
}

function getCronSecret() {
  return Deno.env.get("CONTENT_MONITOR_CRON_SECRET") ?? "";
}

function isAuthorized(request: Request) {
  const expected = getCronSecret();
  return Boolean(expected) && request.headers.get("x-content-monitor-secret") === expected;
}

function errorMessage(error: unknown) {
  return String((error as Error)?.message ?? error ?? "unknown_error").slice(0, 700);
}

function normalizeText(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function preview(value: string | null | undefined, max = PREVIEW_LENGTH) {
  const normalized = normalizeText(value ?? "");
  return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized;
}

function getByPath(value: unknown, path: string) {
  let current = value;
  for (const part of path.split(".").filter(Boolean)) {
    if (current === null || current === undefined) return null;
    current = /^\d+$/.test(part)
      ? (current as unknown[])[Number(part)]
      : (current as Record<string, unknown>)[part];
  }
  return current;
}

function selectJsonContent(json: unknown, specification: string) {
  const separator = specification.indexOf("|");
  if (separator < 0) return getByPath(json, specification);

  const collectionPath = specification.slice(0, separator).trim();
  const fieldPaths = specification
    .slice(separator + 1)
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
  if (!fieldPaths.length) throw new Error("JSON field projection requires at least one field");

  const selected = collectionPath ? getByPath(json, collectionPath) : json;
  if (selected === null || selected === undefined) return null;
  const items = Array.isArray(selected) ? selected : [selected];
  return items.map((item) => Object.fromEntries(fieldPaths.map((fieldPath) => [
    fieldPath,
    getByPath(item, fieldPath),
  ])));
}

function requestHeaders(site: MonitorSite) {
  const headers: Record<string, string> = {
    "user-agent": "JieJourneysContentMonitor/2.0 (+https://www.jiejourneys.com)",
    "accept": site.source_type === "json" ? "application/json,text/plain,*/*" : "text/html,application/xhtml+xml,*/*",
  };

  for (const [key, value] of Object.entries(site.request_headers ?? {})) {
    if (MONITOR_METADATA_KEYS.has(key)) continue;
    if (typeof value === "string" && value.trim()) headers[key] = value.trim();
  }
  return headers;
}

function publicSourceUrl(site: MonitorSite) {
  const configured = site.request_headers?.source_page_url;
  if (typeof configured !== "string" || !configured.trim()) return site.url;
  try {
    const parsed = new URL(configured);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : site.url;
  } catch {
    return site.url;
  }
}

function notificationPatterns(site: MonitorSite) {
  const configured = site.request_headers?.notify_if_matches;
  return Array.isArray(configured)
    ? configured.filter((item): item is string => typeof item === "string" && item.trim())
    : [];
}

function shouldNotifyChange(site: MonitorSite, content: string) {
  const patterns = notificationPatterns(site);
  if (!patterns.length) return true;

  return patterns.some((pattern) => {
    try {
      return new RegExp(pattern, "iu").test(content);
    } catch {
      // A malformed optional notification rule should not break the monitor.
      console.warn("Ignoring invalid notify_if_matches pattern", pattern);
      return false;
    }
  });
}

function applyIgnorePatterns(content: string, patterns: string[] | null) {
  let result = content;
  for (const pattern of patterns ?? []) {
    if (!pattern?.trim()) continue;
    try {
      result = result.replace(new RegExp(pattern, "g"), "");
    } catch {
      throw new Error(`Invalid ignore pattern: ${pattern}`);
    }
  }
  return normalizeText(result);
}

async function hashContent(content: string) {
  const bytes = new TextEncoder().encode(content);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function fetchContent(site: MonitorSite) {
  const response = await fetch(site.url, {
    headers: requestHeaders(site),
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Fetch failed: HTTP ${response.status}`);

  if (site.source_type === "json") {
    const json = await response.json();
    const value = site.selector_or_path ? selectJsonContent(json, site.selector_or_path) : json;
    if (value === null || value === undefined) throw new Error("JSON path returned no content");
    return applyIgnorePatterns(typeof value === "string" ? value : JSON.stringify(value), site.ignore_patterns);
  }

  const html = await response.text();
  const $ = load(html);
  $("script,style,noscript,template").remove();
  let extracted: string;
  try {
    // A selector can intentionally match a list of titles, dates, or rows.
    // Cheerio's .text() combines all matching nodes in document order, which
    // lets one monitor rule track an entire notice list without unrelated UI.
    const target = site.selector_or_path ? $(site.selector_or_path) : $("body").first();
    if (!target.length) throw new Error("CSS selector returned no content");
    extracted = target.text();
  } catch (error) {
    throw new Error(`HTML extraction failed: ${errorMessage(error)}`);
  }
  return applyIgnorePatterns(extracted, site.ignore_patterns);
}

function nextCheckAt(site: MonitorSite) {
  return new Date(Date.now() + site.check_every_minutes * 60_000).toISOString();
}

function changeSnippet(before: string | null, after: string | null) {
  const oldText = preview(before, 900);
  const newText = preview(after, 900);
  if (!oldText) return `新內容：${preview(newText, 260)}`;
  if (!newText) return `原內容已清空：${preview(oldText, 260)}`;

  let prefixLength = 0;
  while (prefixLength < oldText.length && prefixLength < newText.length && oldText[prefixLength] === newText[prefixLength]) {
    prefixLength += 1;
  }
  let oldEnd = oldText.length - 1;
  let newEnd = newText.length - 1;
  while (oldEnd >= prefixLength && newEnd >= prefixLength && oldText[oldEnd] === newText[newEnd]) {
    oldEnd -= 1;
    newEnd -= 1;
  }

  const oldChanged = oldText.slice(prefixLength, oldEnd + 1);
  const newChanged = newText.slice(prefixLength, newEnd + 1);
  return `原：${preview(oldChanged, 180)}\n新：${preview(newChanged, 180)}`;
}

function eventText(event: MonitorEvent) {
  if (event.event_type === "change") {
    return `🔔 ${event.site_name}\n${changeSnippet(event.old_content_preview, event.new_content_preview)}\n${event.site_url}`;
  }
  if (event.event_type === "recovered") {
    return `✅ ${event.site_name} 已恢復讀取\n${event.site_url}`;
  }
  return `⚠️ ${event.site_name} 連續讀取失敗\n${event.error_message ?? "未知錯誤"}\n${event.site_url}`;
}

function telegramGroups(events: MonitorEvent[]) {
  const groups: MonitorEvent[][] = [];
  let current: MonitorEvent[] = [];
  let currentLength = "JieJourneys 網頁監控".length;
  for (const event of events) {
    const itemLength = eventText(event).length + 2;
    if (current.length > 0 && currentLength + itemLength > TELEGRAM_TEXT_LIMIT) {
      groups.push(current);
      current = [];
      currentLength = "JieJourneys 網頁監控".length;
    }
    current.push(event);
    currentLength += itemLength;
  }
  if (current.length) groups.push(current);
  return groups;
}

async function sendTelegram(text: string) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
  if (!token || !chatId) throw new Error("Telegram credentials are unavailable");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!response.ok) throw new Error(`Telegram send failed: HTTP ${response.status}`);
}

async function mapConcurrent<T, R>(items: T[], worker: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let index = 0;
  const consume = async () => {
    while (true) {
      const current = index++;
      if (current >= items.length) return;
      results[current] = await worker(items[current]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENCY, items.length) }, consume));
  return results;
}

async function loadDueSites() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("content_monitor_sites")
    .select("id,name,url,enabled,source_type,selector_or_path,ignore_patterns,request_headers,check_every_minutes,notify_changes,notify_failures")
    .eq("enabled", true)
    .lte("next_check_at", new Date().toISOString())
    .order("next_check_at", { ascending: true })
    .limit(MAX_SITES_PER_RUN);
  if (error) throw error;
  return (data ?? []) as MonitorSite[];
}

async function loadStates(siteIds: string[]) {
  if (!siteIds.length) return new Map<string, MonitorState>();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("content_monitor_state")
    .select("site_id,last_hash,last_content_preview,last_checked_at,last_changed_at,consecutive_failures,last_error,alerted_error_fingerprint")
    .in("site_id", siteIds);
  if (error) throw error;
  return new Map((data ?? []).map((state) => [state.site_id, state as MonitorState]));
}

async function saveState(site: MonitorSite, state: Partial<MonitorState>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("content_monitor_state").upsert({
    site_id: site.id,
    ...state,
  }, { onConflict: "site_id" });
  if (error) throw error;

  const { error: siteError } = await supabase
    .from("content_monitor_sites")
    .update({ next_check_at: nextCheckAt(site) })
    .eq("id", site.id);
  if (siteError) throw siteError;
}

async function enqueueEvent(site: MonitorSite, eventType: EventType, fingerprint: string, fields: Partial<MonitorEvent>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("content_monitor_events").upsert({
    site_id: site.id,
    site_name: site.name,
    site_url: publicSourceUrl(site),
    event_type: eventType,
    fingerprint,
    old_content_preview: fields.old_content_preview ?? null,
    new_content_preview: fields.new_content_preview ?? null,
    error_message: fields.error_message ?? null,
  }, { onConflict: "site_id,event_type,fingerprint", ignoreDuplicates: true });
  if (error) throw error;
}

async function checkSite(site: MonitorSite, state: MonitorState | undefined, dryRun: boolean): Promise<{ result: SiteResult; queuedEvent: boolean }> {
  const checkedAt = new Date().toISOString();
  try {
    const content = await fetchContent(site);
    if (!content) throw new Error("Extracted content was empty");
    const hash = await hashContent(content);
    const contentPreview = preview(content);

    if (!state?.last_hash) {
      if (!dryRun) {
        await saveState(site, {
          last_hash: hash,
          last_content_preview: contentPreview,
          last_checked_at: checkedAt,
          last_changed_at: checkedAt,
          consecutive_failures: 0,
          last_error: null,
          alerted_error_fingerprint: null,
        });
      }
      return { result: "baseline", queuedEvent: false };
    }

    const recovered = Boolean(state.alerted_error_fingerprint);
    let queuedEvent = false;
    if (!dryRun && recovered && site.notify_failures) {
      await enqueueEvent(site, "recovered", `${state.alerted_error_fingerprint}:${hash}`, {});
      queuedEvent = true;
    }

    if (hash === state.last_hash) {
      if (!dryRun) {
        await saveState(site, {
          last_hash: hash,
          last_content_preview: contentPreview,
          last_checked_at: checkedAt,
          consecutive_failures: 0,
          last_error: null,
          alerted_error_fingerprint: null,
        });
      }
      return { result: recovered ? "recovered" : "unchanged", queuedEvent };
    }

    if (!dryRun && site.notify_changes && shouldNotifyChange(site, content)) {
      await enqueueEvent(site, "change", hash, {
        old_content_preview: state.last_content_preview,
        new_content_preview: contentPreview,
      });
      queuedEvent = true;
    }
    if (!dryRun) {
      await saveState(site, {
        last_hash: hash,
        last_content_preview: contentPreview,
        last_checked_at: checkedAt,
        last_changed_at: checkedAt,
        consecutive_failures: 0,
        last_error: null,
        alerted_error_fingerprint: null,
      });
    }
    return { result: "changed", queuedEvent };
  } catch (error) {
    const message = errorMessage(error);
    const fingerprint = await hashContent(message);
    const failures = (state?.consecutive_failures ?? 0) + 1;
    // A site gets one failure alert per outage. It must recover before it can
    // alert again, even if the underlying error wording changes.
    const shouldAlert = site.notify_failures && failures >= FAILURE_ALERT_THRESHOLD && !state?.alerted_error_fingerprint;
    if (!dryRun && shouldAlert) {
      await enqueueEvent(site, "error", fingerprint, { error_message: message });
    }
    if (!dryRun) {
      await saveState(site, {
        last_hash: state?.last_hash ?? null,
        last_content_preview: state?.last_content_preview ?? null,
        last_checked_at: checkedAt,
        last_changed_at: state?.last_changed_at ?? null,
        consecutive_failures: failures,
        last_error: message,
        alerted_error_fingerprint: shouldAlert ? fingerprint : state?.alerted_error_fingerprint ?? null,
      });
    }
    return { result: "failed", queuedEvent: shouldAlert };
  }
}

async function deliverPendingEvents() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("claim_content_monitor_events", { p_limit: EVENT_BATCH_SIZE });
  if (error) throw error;
  const events = (data ?? []) as MonitorEvent[];
  let notified = 0;

  for (const group of telegramGroups(events)) {
    const body = ["JieJourneys 網頁監控", ...group.map(eventText)].join("\n\n");
    try {
      await sendTelegram(body);
      await Promise.all(group.map(async (event) => {
        const { error: updateError } = await supabase
          .from("content_monitor_events")
          .update({ notified_at: new Date().toISOString(), last_notification_error: null })
          .eq("id", event.id)
          .eq("notification_claim_token", event.notification_claim_token ?? "");
        if (updateError) throw updateError;
      }));
      notified += group.length;
    } catch (error) {
      const message = errorMessage(error);
      await Promise.all(group.map((event) => supabase
        .from("content_monitor_events")
        .update({ notification_claim_token: null, notification_claimed_at: null, last_notification_error: message })
        .eq("id", event.id)
        .eq("notification_claim_token", event.notification_claim_token ?? "")));
      console.error("Telegram delivery failed; events will retry", message);
    }
  }
  return { claimed: events.length, notified };
}

async function writeRun(summary: Record<string, unknown>, dryRun: boolean) {
  if (dryRun) return;
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("content_monitor_runs").insert({
    started_at: summary.startedAt,
    finished_at: new Date().toISOString(),
    dry_run: false,
    checked_count: summary.checkedCount,
    baseline_count: summary.baselineCount,
    changed_count: summary.changedCount,
    failed_count: summary.failedCount,
    queued_event_count: summary.queuedEventCount,
    notified_event_count: summary.notifiedEventCount,
    summary,
  });
  if (error) throw error;
}

async function main(request: Request) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!isAuthorized(request)) return new Response("Unauthorized", { status: 401 });

  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("test") === "telegram") {
    await sendTelegram("JieJourneys 網頁監控 Telegram 測試成功");
    return Response.json({ ok: true, test: "telegram" });
  }

  const dryRun = requestUrl.searchParams.get("dryrun") === "true";
  const startedAt = new Date().toISOString();
  const sites = await loadDueSites();
  const states = await loadStates(sites.map((site) => site.id));
  const checks = await mapConcurrent(sites, (site) => checkSite(site, states.get(site.id), dryRun));
  const delivery = dryRun ? { claimed: 0, notified: 0 } : await deliverPendingEvents();

  const summary = {
    ok: true,
    dryRun,
    startedAt,
    checkedCount: checks.length,
    baselineCount: checks.filter((item) => item.result === "baseline").length,
    changedCount: checks.filter((item) => item.result === "changed").length,
    failedCount: checks.filter((item) => item.result === "failed").length,
    recoveredCount: checks.filter((item) => item.result === "recovered").length,
    queuedEventCount: checks.filter((item) => item.queuedEvent).length,
    claimedEventCount: delivery.claimed,
    notifiedEventCount: delivery.notified,
  };
  await writeRun(summary, dryRun);
  return Response.json(summary);
}

Deno.serve((request) => main(request).catch((error) => {
  console.error("content-monitor failed", errorMessage(error));
  return Response.json({ ok: false, error: errorMessage(error) }, { status: 500 });
}));
