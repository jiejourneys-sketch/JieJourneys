import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";
const REQUEST_TIMEOUT_MS = 12_000;

type MonitorSite = {
  id: string;
  name: string;
  api_url: string;
  fetch_type: string | null;
  id_path: string | null;
  id_regex: string | null;
  title_path: string | null;
  title_regex: string | null;
  content_path: string | null;
  content_regex: string | null;
  url_template: string | null;
  title_template: string | null;
};

type MonitorHistory = {
  site: string;
  last_hash: string | null;
  updated_at: string | null;
};

type ParsedResult = {
  id: string;
  title: string;
  content?: string;
  url?: string;
};

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("supabase_env_missing");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  });
}

function stripHtml(input: string) {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, max = 140) {
  const text = input.trim();
  return text.length > max ? text.slice(0, max) : text;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithTimeout(url: string, timeoutMs = REQUEST_TIMEOUT_MS) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "user-agent": "JieJourneysMonitor/1.0",
      "accept": "application/json,text/plain,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function fetchHtmlWithTimeout(url: string, timeoutMs = REQUEST_TIMEOUT_MS) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "user-agent": "JieJourneysMonitor/1.0",
      "accept": "text/html,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch HTML failed: ${response.status}`);
  }

  return await response.text();
}

function applyTemplate(template: string | null | undefined, id: string) {
  if (!template) return undefined;
  return template.replaceAll("{{id}}", encodeURIComponent(id));
}

function getByPath(obj: unknown, path: string | null | undefined) {
  if (!path) return null;

  let current: unknown = obj;
  for (const part of path.split(".")) {
    if (current == null) return null;

    const isIndex = /^[0-9]+$/.test(part);
    current = isIndex
      ? (current as unknown[])[Number(part)]
      : (current as Record<string, unknown>)[part];
  }

  return current ?? null;
}

function getAllByRegex(text: string, pattern: string | null | undefined) {
  if (!pattern) return [];

  const regex = new RegExp(pattern, "ig");
  return Array.from(text.matchAll(regex))
    .map((match) => match[1])
    .filter(Boolean);
}

function getByRegex(text: string, pattern: string | null | undefined) {
  if (!pattern) return null;

  const matches = getAllByRegex(text, pattern);
  if (matches.length === 0) return null;

  const numericMatches = matches.filter((value) => /^\d+$/.test(value));
  if (numericMatches.length > 0) {
    return numericMatches
      .map((value) => BigInt(value))
      .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))[0]
      .toString();
  }

  return matches[0];
}

function parseByRule(site: MonitorSite, payload: unknown): ParsedResult | null {
  const fetchType = String(site.fetch_type ?? "json").toLowerCase();

  let id: string | null;
  if (fetchType === "html") {
    id = getByRegex(String(payload ?? ""), site.id_regex);
  } else {
    const value = getByPath(payload, site.id_path);
    id = value == null ? null : String(value);
  }

  if (!id) return null;

  let title =
    (site.title_template && String(site.title_template)) ||
    (fetchType === "html"
      ? getByRegex(String(payload ?? ""), site.title_regex)
      : String(getByPath(payload, site.title_path) ?? ""));

  title = title?.trim() || "New update";

  let content = "";
  if (fetchType === "html") {
    const value = getByRegex(String(payload ?? ""), site.content_regex);
    content = value ? stripHtml(value) : "";
  } else {
    const value = getByPath(payload, site.content_path);
    content = typeof value === "string" ? stripHtml(value) : "";
  }

  return {
    id,
    title,
    content,
    url: applyTemplate(site.url_template, id),
  };
}

async function getEnabledSites() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("monitor_sites")
    .select(
      "id,name,api_url,fetch_type,id_path,id_regex,title_path,title_regex,content_path,content_regex,url_template,title_template",
    )
    .eq("enabled", true);

  if (error) throw error;
  return (data ?? []) as MonitorSite[];
}

async function getHistory(siteName: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("monitor_history")
    .select("site,last_hash,updated_at")
    .eq("site", siteName)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as MonitorHistory | null;
}

async function upsertHistory(siteName: string, lastHash: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("monitor_history")
    .upsert(
      {
        site: siteName,
        last_hash: lastHash,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "site" },
    );

  if (error) throw error;
}

function buildNotification(site: MonitorSite, parsed: ParsedResult) {
  const summary = parsed.content ? truncate(parsed.content, 120) : "";
  const summaryBlock = summary ? `摘要：${summary}\n\n` : "";
  const linkBlock = parsed.url ? `連結：\n${parsed.url}` : "";

  return [
    `網站更新：${site.name}`,
    `標題：${parsed.title}`,
    "",
    summaryBlock ? summaryBlock.trimEnd() : "",
    linkBlock,
  ]
    .filter(Boolean)
    .join("\n");
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const isTest = url.searchParams.get("test") === "true";
  const isDryRun = url.searchParams.get("dryrun") === "true";
  const singleSite = url.searchParams.get("site_id");

  if (isTest) {
    await sendTelegram("JieJourneys Monitor OK");
    return new Response("Telegram test sent");
  }

  try {
    let sites = await getEnabledSites();
    if (singleSite) {
      sites = sites.filter((site) => String(site.id) === singleSite);
    }

    let ran = 0;
    let changed = 0;
    let errors = 0;

    for (const site of sites) {
      let payload: unknown;

      try {
        payload = String(site.fetch_type ?? "json").toLowerCase() === "html"
          ? await fetchHtmlWithTimeout(site.api_url)
          : await fetchJsonWithTimeout(site.api_url);
      } catch (error) {
        errors += 1;
        console.error(`[${site.name}] fetch error`, error);
        continue;
      }

      const parsed = parseByRule(site, payload);
      if (!parsed) {
        errors += 1;
        console.error(`[${site.name}] parse failed`);
        continue;
      }

      const history = await getHistory(site.name);

      if (!history) {
        if (!isDryRun) {
          await upsertHistory(site.name, parsed.id);
        }

        ran += 1;
        await sleep(800);
        continue;
      }

      if (history.last_hash === parsed.id) {
        ran += 1;
        await sleep(800);
        continue;
      }

      changed += 1;

      if (!isDryRun) {
        await sendTelegram(buildNotification(site, parsed));
        await upsertHistory(site.name, parsed.id);
      }

      ran += 1;
      await sleep(1200);
    }

    return new Response(
      JSON.stringify({ ok: true, ran, changed, errors }, null, 2),
      { headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    console.error("Fatal error", error);

    try {
      await sendTelegram(`JieJourneys Monitor Fatal Error\n${String((error as Error)?.message ?? error)}`);
    } catch (telegramError) {
      console.error("Fatal telegram failed", telegramError);
    }

    return new Response("ERROR", { status: 500 });
  }
});
