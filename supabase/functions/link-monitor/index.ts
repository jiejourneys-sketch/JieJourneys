import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const SITE_SITEMAP_URL = Deno.env.get("SITE_SITEMAP_URL") ?? "https://www.jiejourneys.com/sitemap.xml";
const LINK_MONITOR_TIMEOUT_MS = Number(Deno.env.get("LINK_MONITOR_TIMEOUT_MS") ?? "12000");
const LINK_MONITOR_CONCURRENCY = Number(Deno.env.get("LINK_MONITOR_CONCURRENCY") ?? "6");
const EFFECTIVE_LINK_MONITOR_CONCURRENCY = Math.min(LINK_MONITOR_CONCURRENCY, 2);
// Max links checked per run. Keeps each invocation within Edge Function time limits.
const LINKS_PER_RUN = Number(Deno.env.get("LINK_MONITOR_LINKS_PER_RUN") ?? "60");

// Scheduling intervals (hours) — controls next_check_at after each result
const INTERVAL_HEALTHY_FRESH = 7 * 24;    // healthy, seen < 4 times
const INTERVAL_HEALTHY_STABLE = 21 * 24;  // healthy, seen >= 4 times consecutively
const INTERVAL_BROKEN = 2 * 24;           // broken or suspicious → check again soon
const INTERVAL_DOWN = 3 * 24;             // timeout / DNS / connection error
const INTERVAL_BLOCKED = 48;              // manual_review (403/429/bot block)
const HEALTHY_STABLE_THRESHOLD = 4;       // consecutive healthy checks before slowing down

const ownHosts = new Set(["jiejourneys.com", "www.jiejourneys.com", "bill.jiejourneys.com"]);
const travelHosts = ["kkday.com", "klook.com", "trip.com", "agoda.com"];
const allowedHosts = (
  Deno.env.get("LINK_MONITOR_ALLOWED_HOSTS") ??
  travelHosts.join(",")
)
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);
const excludedHosts = [
  "instagram.com",
  "youtube.com",
  "youtu.be",
];

const pageNameMap: Record<string, string> = {
  "": "首頁",
  "busan": "釜山",
  "busan/hotel": "釜山住宿",
  "busan/ticket": "釜山票券",
  "busan/transport": "釜山交通",
  "busan/video": "釜山短影音",
  "busan/map": "釜山地圖",
  "osaka": "大阪",
  "osaka/hotel": "大阪住宿",
  "osaka/ticket": "大阪票券",
  "osaka/transport": "大阪交通",
  "osaka/video": "大阪短影音",
  "osaka/map": "大阪地圖",
  "tokyo": "東京",
  "tokyo/hotel": "東京住宿",
  "tokyo/ticket": "東京票券",
  "tokyo/transport": "東京交通",
  "tokyo/video": "東京短影音",
  "tokyo/map": "東京地圖",
  "northvietnam": "北越",
  "northvietnam/hotel": "北越住宿",
  "northvietnam/ticket": "北越票券",
  "northvietnam/transport": "北越交通",
  "northvietnam/video": "北越短影音",
  "northvietnam/map": "北越地圖",
};

const statusLabelMap: Record<string, string> = {
  broken: "失效",
  down: "連線失敗",
  suspicious: "可疑跳轉",
  manual_review: "待人工確認",
  healthy: "正常",
};

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("supabase_env_missing");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

type PageRecord = {
  pageUrl: string;
  pageName: string;
};

type LinkCandidate = {
  stateKey: string;
  pageUrl: string;
  pageName: string;
  url: string;
  platform: string;
  linkText: string;
};

type LinkResult = LinkCandidate & {
  status: string;
  detail: string;
  statusCode: number | null;
  finalUrl: string | null;
  checkedAt: string;
};

type ExistingState = {
  state_key: string;
  last_fingerprint: string | null;
  last_status: string | null;
  next_check_at: string | null;
  consecutive_healthy: number;
};

function errorMessage(error: unknown) {
  return String((error as Error)?.message ?? error ?? "unknown error");
}

function choosePlatform(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("kkday.com")) return "KKday";
    if (hostname.includes("klook.com")) return "Klook";
    if (hostname.includes("trip.com")) return "Trip.com";
    if (hostname.includes("agoda.com")) return "Agoda";
    if (hostname.includes("instagram.com")) return "Instagram";
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "YouTube";
    if (hostname.includes("google.com")) return "Google";
    if (hostname.includes("naver.me")) return "Naver Map";
    return hostname;
  } catch {
    return "unknown";
  }
}

function hostnameIncludes(hostname: string, needles: string[]) {
  return needles.some((needle) => hostname.includes(needle));
}

function shouldMonitorUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (ownHosts.has(hostname)) return false;
    if (hostnameIncludes(hostname, excludedHosts)) return false;
    return hostnameIncludes(hostname, allowedHosts);
  } catch {
    return false;
  }
}

function pageNameFromUrl(pageUrl: string) {
  try {
    const parsed = new URL(pageUrl);
    const route = parsed.pathname.replace(/^\/+|\/+$/g, "");
    return pageNameMap[route] ?? (route || "首頁");
  } catch {
    return pageUrl;
  }
}

function extractSitemapUrls(xml: string) {
  const urls: string[] = [];
  const re = /<loc>(.*?)<\/loc>/gims;
  for (const match of xml.matchAll(re)) {
    const value = match[1]?.trim();
    if (value?.startsWith("http")) urls.push(value);
  }
  return urls;
}

async function fetchText(url: string, timeoutMs: number) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "JieJourneysLinkMonitor/1.0 (+https://www.jiejourneys.com)",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  return await response.text();
}

async function fetchSitemapPages() {
  try {
    const xml = await fetchText(SITE_SITEMAP_URL, LINK_MONITOR_TIMEOUT_MS);
    const urls = extractSitemapUrls(xml);
    if (urls.length > 0) {
      return urls.map((pageUrl) => ({
        pageUrl,
        pageName: pageNameFromUrl(pageUrl),
      }));
    }
  } catch {
    // Fall back to live-site crawling when sitemap is unavailable.
  }

  return await crawlSitePages("https://www.jiejourneys.com/");
}

function extractInternalLinks(baseUrl: string, html: string) {
  const found = new Set<string>();
  const anchorRe = /<a\b[^>]*?href=(['"])(\/[^"'#?]*|https?:\/\/[^"'#?]+)\1/gi;

  for (const match of html.matchAll(anchorRe)) {
    const rawHref = match[2];
    if (!rawHref) continue;

    try {
      const url = new URL(rawHref, baseUrl);
      if (!ownHosts.has(url.hostname)) continue;
      if (url.pathname.startsWith("/_next")) continue;
      if (url.pathname.startsWith("/api")) continue;
      found.add(url.origin + (url.pathname || "/"));
    } catch {
      // ignore malformed internal links
    }
  }

  return Array.from(found);
}

async function crawlSitePages(startUrl: string) {
  const queue = [startUrl];
  const seen = new Set<string>();
  const pages: PageRecord[] = [];
  const maxPages = 80;

  while (queue.length > 0 && pages.length < maxPages) {
    const current = queue.shift()!;
    if (seen.has(current)) continue;
    seen.add(current);

    try {
      const html = await fetchText(current, LINK_MONITOR_TIMEOUT_MS);
      pages.push({
        pageUrl: current,
        pageName: pageNameFromUrl(current),
      });

      for (const nextUrl of extractInternalLinks(current, html)) {
        if (!seen.has(nextUrl) && queue.length + pages.length < maxPages * 2) {
          queue.push(nextUrl);
        }
      }
    } catch {
      // ignore pages that fail during discovery
    }
  }

  return pages;
}

function normalizeWhitespace(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function decodeEntities(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(input: string) {
  return normalizeWhitespace(input.replace(/<[^>]+>/g, " "));
}

function extractLinksFromHtml(page: PageRecord, html: string) {
  const found = new Map<string, LinkCandidate>();
  const anchorRe = /<a\b([^>]*?)href=(['"])(https?:\/\/[^'"#]+)\2([^>]*)>([\s\S]*?)<\/a>/gim;

  for (const match of html.matchAll(anchorRe)) {
    const rawUrl = match[3];
    if (!rawUrl) continue;
    const url = decodeEntities(rawUrl);
    if (!shouldMonitorUrl(url)) continue;

    try {
      const parsed = new URL(url);
      if (ownHosts.has(parsed.hostname)) continue;
    } catch {
      continue;
    }

    const linkText = stripHtml(decodeEntities(match[5] ?? ""));
    const stateKey = `${page.pageUrl}::${url}`;

    if (!found.has(stateKey)) {
      found.set(stateKey, {
        stateKey,
        pageUrl: page.pageUrl,
        pageName: page.pageName,
        url,
        platform: choosePlatform(url),
        linkText: linkText || choosePlatform(url),
      });
    }
  }

  return Array.from(found.values());
}

function normalizeFinalPath(urlString: string) {
  try {
    const parsed = new URL(urlString);
    return parsed.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return "";
  }
}

function hostKeyFromUrl(urlString: string) {
  try {
    return new URL(urlString).hostname.toLowerCase();
  } catch {
    return "unknown";
  }
}

function extractAffiliateIdentity(urlString: string) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    const path = url.pathname;

    if (hostname.includes("kkday.com")) {
      const productId = path.match(/\/product\/(\d+)/)?.[1];
      return productId ? { platform: "KKday", type: "product", value: productId } : null;
    }

    if (hostname.includes("klook.com")) {
      const activityId = path.match(/\/activity\/(\d+)/)?.[1];
      return activityId ? { platform: "Klook", type: "activity", value: activityId } : null;
    }

    if (hostname.includes("trip.com")) {
      const productId = url.searchParams.get("productId");
      if (productId) return { platform: "Trip.com", type: "product", value: productId };

      const hotelId = url.searchParams.get("hotelId");
      if (hotelId) return { platform: "Trip.com", type: "hotel", value: hotelId };

      const detailId = path.match(/\/detail\/(\d+)/)?.[1];
      if (detailId) return { platform: "Trip.com", type: "detail", value: detailId };

      return null;
    }

    if (hostname.includes("agoda.com")) {
      const hid = url.searchParams.get("hid") || url.searchParams.get("selectedproperty");
      return hid ? { platform: "Agoda", type: "property", value: hid } : null;
    }
  } catch {
    // ignore invalid urls
  }

  return null;
}

function isAffiliateIdentityPreserved(originalUrl: string, finalUrl: string) {
  const original = extractAffiliateIdentity(originalUrl);
  if (!original) return true;

  const finalIdentity = extractAffiliateIdentity(finalUrl);
  if (!finalIdentity) return false;

  return original.platform === finalIdentity.platform &&
    original.value === finalIdentity.value;
}

function summarizeFailure(error: unknown) {
  const message = errorMessage(error);
  if (/timed out|timeout|aborted/i.test(message)) return { status: "down", detail: "timeout" };
  if (/ENOTFOUND|EAI_AGAIN|DNS/i.test(message)) return { status: "down", detail: "dns_error" };
  if (/certificate|SSL|TLS/i.test(message)) return { status: "down", detail: "ssl_error" };
  return { status: "down", detail: "fetch_failed" };
}

function classifyResponse(originalUrl: string, finalUrl: string, statusCode: number) {
  if (statusCode === 404 || statusCode === 410) return { status: "broken", detail: `http_${statusCode}` };
  if (statusCode === 403 || statusCode === 429) return { status: "manual_review", detail: `http_${statusCode}` };
  if (statusCode >= 500) {
    const hostname = new URL(originalUrl).hostname.toLowerCase();
    if (hostnameIncludes(hostname, travelHosts)) {
      return { status: "manual_review", detail: `http_${statusCode}` };
    }
    return { status: "down", detail: `http_${statusCode}` };
  }

  if (!isAffiliateIdentityPreserved(originalUrl, finalUrl)) {
    return { status: "suspicious", detail: "affiliate_target_changed" };
  }

  const original = new URL(originalUrl);
  const final = new URL(finalUrl);
  const originalPath = normalizeFinalPath(originalUrl);
  const finalPath = normalizeFinalPath(finalUrl);

  if (originalPath !== "/" && finalPath === "/" && original.hostname === final.hostname) {
    if (hostnameIncludes(original.hostname, travelHosts)) {
      return { status: "healthy", detail: "homepage_redirect_allowed" };
    }
    return { status: "suspicious", detail: "redirected_to_homepage" };
  }

  return { status: "healthy", detail: "ok" };
}

async function fetchWithFallback(url: string) {
  const headers = {
    "user-agent": "JieJourneysLinkMonitor/1.0 (+https://www.jiejourneys.com)",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  };

  const headResponse = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers,
    signal: AbortSignal.timeout(LINK_MONITOR_TIMEOUT_MS),
  }).catch(() => null);

  if (headResponse && headResponse.status < 400) {
    return headResponse;
  }

  return await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers,
    signal: AbortSignal.timeout(LINK_MONITOR_TIMEOUT_MS),
  });
}

async function checkLink(candidate: LinkCandidate): Promise<LinkResult> {
  let response: Response | undefined;
  try {
    response = await fetchWithFallback(candidate.url);
    const result = classifyResponse(candidate.url, response.url, response.status);
    return {
      ...candidate,
      status: result.status,
      detail: result.detail,
      statusCode: response.status,
      finalUrl: response.url,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    const failure = summarizeFailure(error);
    return {
      ...candidate,
      status: failure.status,
      detail: failure.detail,
      statusCode: null,
      finalUrl: null,
      checkedAt: new Date().toISOString(),
    };
  } finally {
    try {
      await response?.body?.cancel?.();
    } catch (error) {
      console.error("Response body cancel failed", candidate.url, errorMessage(error));
    }
  }
}

async function runWithConcurrency<T, R>(items: T[], worker: (item: T) => Promise<R>, concurrency: number) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function consume() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      if (currentIndex >= items.length) return;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => consume());
  await Promise.all(workers);
  return results;
}

// Checks all links within a host group sequentially.
// Stops early and returns the rest as deferred if the host starts blocking us (manual_review).
async function checkHostGroup(candidates: LinkCandidate[]) {
  const results: LinkResult[] = [];
  const deferred: LinkCandidate[] = [];

  for (const candidate of candidates) {
    const result = await checkLink(candidate);
    results.push(result);

    if (result.status === "manual_review") {
      deferred.push(...candidates.slice(results.length));
      break;
    }
  }

  return { results, deferred };
}

// Groups candidates by host, checks each host group concurrently (up to EFFECTIVE_LINK_MONITOR_CONCURRENCY).
// If a host blocks us mid-group, its remaining links are deferred.
async function checkCandidatesWithHostPause(candidates: LinkCandidate[]) {
  const groups = new Map<string, LinkCandidate[]>();

  for (const candidate of candidates) {
    const hostKey = hostKeyFromUrl(candidate.url);
    const list = groups.get(hostKey) ?? [];
    list.push(candidate);
    groups.set(hostKey, list);
  }

  const hostEntries = Array.from(groups.entries());
  const checkedGroups = await runWithConcurrency(
    hostEntries,
    async ([hostKey, items]) => {
      try {
        return {
          hostKey,
          ...(await checkHostGroup(items)),
        };
      } catch (error) {
        console.error("Host group check failed", hostKey, errorMessage(error));
        return {
          hostKey,
          results: items.map((candidate) => ({
            ...candidate,
            status: "down",
            detail: "host_group_failed",
            statusCode: null,
            finalUrl: null,
            checkedAt: new Date().toISOString(),
          })),
          deferred: [],
        };
      }
    },
    Math.min(EFFECTIVE_LINK_MONITOR_CONCURRENCY, hostEntries.length || 1),
  );

  const results = checkedGroups.flatMap((group) => group.results);
  const deferred = checkedGroups.flatMap((group) => group.deferred);
  const deferredHosts = checkedGroups
    .filter((group) => group.deferred.length > 0)
    .map((group) => group.hostKey);

  return { results, deferred, deferredHosts };
}

// ─── Scheduling ──────────────────────────────────────────────────────────────

// Computes when to next check a link based on the result of the current check.
function computeNextCheckAt(status: string, consecutiveHealthy: number): string {
  let intervalHours: number;

  if (status === "healthy") {
    intervalHours = consecutiveHealthy >= HEALTHY_STABLE_THRESHOLD
      ? INTERVAL_HEALTHY_STABLE
      : INTERVAL_HEALTHY_FRESH;
  } else if (status === "broken" || status === "suspicious") {
    intervalHours = INTERVAL_BROKEN;
  } else if (status === "manual_review") {
    intervalHours = INTERVAL_BLOCKED;
  } else {
    // down (timeout / DNS / SSL / 5xx)
    intervalHours = INTERVAL_DOWN;
  }

  return new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString();
}

// From all discovered candidates, picks the ones that are due for checking.
// Priority order: never-checked first → alert-status (broken/suspicious) → oldest due date.
// Limited to `limit` items to keep the run within Edge Function time budgets.
function pickDueLinks(
  candidates: LinkCandidate[],
  existingState: Map<string, ExistingState>,
  limit: number,
): LinkCandidate[] {
  const now = Date.now();

  const due = candidates.filter((c) => {
    const state = existingState.get(c.stateKey);
    if (!state) return true; // never seen → always due
    if (!state.next_check_at) return true; // in DB but not yet scheduled (pre-migration rows)
    return new Date(state.next_check_at).getTime() <= now;
  });

  due.sort((a, b) => {
    const stateA = existingState.get(a.stateKey);
    const stateB = existingState.get(b.stateKey);

    // 0 = never checked (highest priority), 1 = alert status, 2 = normal
    const priorityA = !stateA ? 0 : isAlertStatus(stateA.last_status) ? 1 : 2;
    const priorityB = !stateB ? 0 : isAlertStatus(stateB.last_status) ? 1 : 2;

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Within same priority: oldest due date first
    const timeA = stateA?.next_check_at ? new Date(stateA.next_check_at).getTime() : 0;
    const timeB = stateB?.next_check_at ? new Date(stateB.next_check_at).getTime() : 0;
    return timeA - timeB;
  });

  return due.slice(0, limit);
}

// ─── Notifications ────────────────────────────────────────────────────────────

function chooseStatusLabel(result: LinkResult) {
  return statusLabelMap[result.status] ?? result.status;
}

function chooseReasonText(result: LinkResult) {
  if (result.status === "broken") {
    if (result.statusCode === 404) return "頁面不存在";
    if (result.statusCode === 410) return "頁面已下架或移除";
    return "連結已失效";
  }
  if (result.status === "down") {
    if (result.detail === "timeout") return "網站連線逾時";
    if (result.detail === "dns_error") return "網站 DNS 異常";
    if (result.detail === "ssl_error") return "網站 SSL 異常";
    return "網站暫時無法連線";
  }
  if (result.status === "manual_review") {
    if (result.statusCode === 403) return "對方網站拒絕存取";
    if (result.statusCode === 429) return "對方網站限制請求次數";
    return "需要人工確認";
  }
  if (result.status === "suspicious") {
    if (result.detail === "redirected_to_homepage") return "連結被導回首頁";
    if (result.detail === "affiliate_target_changed") return "商品頁疑似失效或被導到其他頁";
    return "連結跳轉結果可疑";
  }
  return "正常";
}

function buildFingerprint(result: LinkResult) {
  return `${result.status}::${result.detail}::${result.finalUrl ?? ""}`;
}

function shouldAlert(result: LinkResult) {
  return result.status === "broken" || result.status === "down" || result.status === "suspicious";
}

function isAlertStatus(status: string | null | undefined) {
  return status === "broken" || status === "down" || status === "suspicious";
}

function buildTelegramMessage(results: LinkResult[]) {
  const lines = [
    "JieJourneys 外連異常",
    `時間：${new Date().toISOString()}`,
    `新增異常：${results.length}`,
  ];

  for (const [index, item] of results.slice(0, 15).entries()) {
    lines.push("");
    lines.push(`${index + 1}. ${item.pageName} / ${item.linkText} / ${item.platform}`);
    lines.push(`結果：${chooseStatusLabel(item)}`);
    lines.push(`原因：${chooseReasonText(item)}`);
    lines.push(`網址：${item.url}`);
    if (item.finalUrl && item.finalUrl !== item.url && item.status === "suspicious") {
      lines.push(`跳轉後：${item.finalUrl}`);
    }
  }

  return lines.join("\n").slice(0, 3800);
}

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) throw new Error(`Telegram send failed: ${response.status}`);
}

// ─── Database ─────────────────────────────────────────────────────────────────

async function getExistingState(keys: string[]) {
  if (keys.length === 0) return new Map<string, ExistingState>();
  const supabase = getSupabaseClient();
  const out = new Map<string, ExistingState>();
  const chunkSize = 20;

  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("monitor_link_state")
      .select("state_key,last_fingerprint,last_status,next_check_at,consecutive_healthy")
      .in("state_key", chunk);

    if (error) throw error;
    for (const item of data ?? []) {
      out.set(item.state_key, item as ExistingState);
    }
  }

  return out;
}

async function upsertState(results: LinkResult[], existingState: Map<string, ExistingState>) {
  if (results.length === 0) return;
  const supabase = getSupabaseClient();

  const rows = results.map((result) => {
    const previous = existingState.get(result.stateKey);
    const previousConsecutiveHealthy = previous?.consecutive_healthy ?? 0;
    const consecutiveHealthy = result.status === "healthy" ? previousConsecutiveHealthy + 1 : 0;
    const nextCheckAt = computeNextCheckAt(result.status, consecutiveHealthy);

    return {
      state_key: result.stateKey,
      page_url: result.pageUrl,
      page_name: result.pageName,
      link_url: result.url,
      platform: result.platform,
      link_text: result.linkText,
      last_status: result.status,
      last_detail: result.detail,
      last_status_code: result.statusCode,
      last_final_url: result.finalUrl,
      last_checked_at: result.checkedAt,
      last_fingerprint: buildFingerprint(result),
      consecutive_healthy: consecutiveHealthy,
      next_check_at: nextCheckAt,
      active: true,
    };
  });

  const { error } = await supabase.from("monitor_link_state").upsert(rows, { onConflict: "state_key" });
  if (error) throw error;
}

// For links that were blocked mid-run (deferred by host pause):
// existing rows get next_check_at bumped; new rows are inserted as manual_review.
async function deferLinks(candidates: LinkCandidate[], existingState: Map<string, ExistingState>) {
  if (candidates.length === 0) return;
  const supabase = getSupabaseClient();

  const deferredUntil = new Date(Date.now() + INTERVAL_BLOCKED * 60 * 60 * 1000).toISOString();
  const existingKeys = candidates.filter((c) => existingState.has(c.stateKey)).map((c) => c.stateKey);
  const newCandidates = candidates.filter((c) => !existingState.has(c.stateKey));

  // Existing rows: only update next_check_at, leave everything else intact
  if (existingKeys.length > 0) {
    const { error } = await supabase
      .from("monitor_link_state")
      .update({ next_check_at: deferredUntil })
      .in("state_key", existingKeys);
    if (error) throw error;
  }

  // New rows: insert as manual_review so they appear in the state table
  if (newCandidates.length > 0) {
    const rows = newCandidates.map((c) => ({
      state_key: c.stateKey,
      page_url: c.pageUrl,
      page_name: c.pageName,
      link_url: c.url,
      platform: c.platform,
      link_text: c.linkText,
      last_status: "manual_review",
      last_detail: "deferred_bot_block",
      last_status_code: null,
      last_final_url: null,
      last_checked_at: new Date().toISOString(),
      last_fingerprint: null,
      consecutive_healthy: 0,
      next_check_at: deferredUntil,
      active: true,
    }));
    const { error } = await supabase.from("monitor_link_state").insert(rows);
    if (error) throw error;
  }
}

// For pages that were fully crawled, mark any DB links not found in the current crawl as inactive.
// This cleans up links that have been removed from pages.
async function syncLinkActivations(crawledPageUrls: string[], activeKeys: Set<string>) {
  if (crawledPageUrls.length === 0) return;
  const supabase = getSupabaseClient();
  const chunkSize = 10;
  const staleKeys: string[] = [];

  for (let i = 0; i < crawledPageUrls.length; i += chunkSize) {
    const chunk = crawledPageUrls.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("monitor_link_state")
      .select("state_key")
      .in("page_url", chunk)
      .eq("active", true);

    if (error) throw error;
    for (const row of data ?? []) {
      if (!activeKeys.has(row.state_key)) {
        staleKeys.push(row.state_key);
      }
    }
  }

  if (staleKeys.length === 0) return;

  const { error } = await supabase
    .from("monitor_link_state")
    .update({ active: false })
    .in("state_key", staleKeys);

  if (error) throw error;
}

async function upsertRun(run: Record<string, unknown>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("monitor_link_runs").insert(run);
  if (error) throw error;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(request: Request) {
  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryrun") === "true";
  // ?batch=all forces checking all due links without the per-run cap (useful for initial setup)
  const checkAll = url.searchParams.get("batch") === "all";

  // Stage 1: Discover all pages and extract every affiliate link candidate
  let allPages: PageRecord[];
  try {
    allPages = await fetchSitemapPages();
  } catch (error) {
    throw new Error(`stage_fetch_pages_failed: ${errorMessage(error)}`);
  }

  let pageHtml: Array<{ page: PageRecord; html: string } | null>;
  try {
    pageHtml = await runWithConcurrency(
      allPages,
      async (page) => {
        try {
          return { page, html: await fetchText(page.pageUrl, LINK_MONITOR_TIMEOUT_MS) };
        } catch (error) {
          console.error("Page fetch failed", page.pageUrl, errorMessage(error));
          return null;
        }
      },
      Math.min(EFFECTIVE_LINK_MONITOR_CONCURRENCY, 2),
    );
  } catch (error) {
    throw new Error(`stage_fetch_page_html_failed: ${errorMessage(error)}`);
  }

  const validPages = pageHtml.filter((item): item is { page: PageRecord; html: string } => item !== null);
  const allCandidates = validPages.flatMap(({ page, html }) => extractLinksFromHtml(page, html));

  // Stage 2: Load scheduling state for all candidates in one DB round-trip
  const allExistingState = dryRun
    ? new Map<string, ExistingState>()
    : await getExistingState(allCandidates.map((item) => item.stateKey));

  // Stage 3: Select which links to check this run
  // dryRun / checkAll → skip cap and scheduling, check everything found
  const dueCandidates = (dryRun || checkAll)
    ? allCandidates
    : pickDueLinks(allCandidates, allExistingState, LINKS_PER_RUN);

  // Stage 4: Check due links, pausing a host if it starts blocking us
  let results: LinkResult[];
  let deferred: LinkCandidate[];
  let deferredHosts: string[];
  try {
    ({ results, deferred, deferredHosts } = await checkCandidatesWithHostPause(dueCandidates));
  } catch (error) {
    throw new Error(`stage_check_candidates_failed: ${errorMessage(error)}`);
  }

  // Stage 5: Determine which results are genuinely new problems
  const newProblems = results.filter((item) => {
    if (!shouldAlert(item)) return false;
    if (dryRun) return true;
    const previous = allExistingState.get(item.stateKey);
    const fingerprint = buildFingerprint(item);
    return !previous || !isAlertStatus(previous.last_status) || previous.last_fingerprint !== fingerprint;
  });

  // Stage 6: Persist results
  if (!dryRun) {
    // For successfully crawled pages, mark removed links as inactive
    const deferredPageUrls = new Set(deferred.map((item) => item.pageUrl));
    const completedPageUrls = validPages
      .map(({ page }) => page.pageUrl)
      .filter((pu) => !deferredPageUrls.has(pu));
    const activeKeys = new Set(allCandidates.map((item) => item.stateKey));

    await syncLinkActivations(completedPageUrls, activeKeys);
    await upsertState(results, allExistingState);
    await deferLinks(deferred, allExistingState);
  }

  if (!dryRun && newProblems.length > 0) {
    await sendTelegram(buildTelegramMessage(newProblems));
  }

  const summary = {
    ok: true,
    dryRun,
    checkAll,
    totalPages: allPages.length,
    checkedPages: validPages.length,
    totalLinks: allCandidates.length,
    dueLinks: dueCandidates.length,
    checkedLinks: results.length,
    deferredLinks: deferred.length,
    deferredHosts,
    linksPerRun: LINKS_PER_RUN,
    effectiveConcurrency: EFFECTIVE_LINK_MONITOR_CONCURRENCY,
    healthy: results.filter((item) => item.status === "healthy").length,
    broken: results.filter((item) => item.status === "broken").length,
    down: results.filter((item) => item.status === "down").length,
    suspicious: results.filter((item) => item.status === "suspicious").length,
    suspectedUnavailable: results.filter((item) => item.detail === "affiliate_target_changed").length,
    manualReview: results.filter((item) => item.status === "manual_review").length,
    newProblems: newProblems.length,
    brokenLinks: results
      .filter((item) => item.status === "broken")
      .slice(0, 50)
      .map((item) => ({
        pageName: item.pageName,
        linkText: item.linkText,
        platform: item.platform,
        url: item.url,
        statusCode: item.statusCode,
      })),
    suspectedLinks: results
      .filter((item) => item.detail === "affiliate_target_changed")
      .slice(0, 50)
      .map((item) => ({
        pageName: item.pageName,
        linkText: item.linkText,
        platform: item.platform,
        url: item.url,
        finalUrl: item.finalUrl,
      })),
  };

  if (!dryRun) {
    await upsertRun({
      batch_index: null,
      batch_count: 1,
      checked_pages: validPages.length,
      checked_links: results.length,
      healthy_count: summary.healthy,
      broken_count: summary.broken,
      down_count: summary.down,
      suspicious_count: summary.suspicious,
      manual_review_count: summary.manualReview,
      new_problem_count: summary.newProblems,
      payload: summary,
      created_at: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

Deno.serve((request) =>
  main(request).catch(async (error) => {
    console.error(error);
    try {
      await sendTelegram(`JieJourneys 外連監控失敗\n${String(error?.message ?? error)}`);
    } catch {
      // ignore secondary telegram failures
    }

    return new Response(
      JSON.stringify({ ok: false, error: String(error?.message ?? error) }, null, 2),
      { status: 500, headers: { "content-type": "application/json; charset=utf-8" } },
    );
  })
);
