import assert from "node:assert/strict";
import test from "node:test";

import {
  contentDiff,
  eventText,
  telegramGroups,
} from "../supabase/functions/content-monitor/notification.ts";

test("contentDiff reports added and removed structured rows", () => {
  const result = contentDiff(
    "2026.10.13 直接予約可能な宿泊施設一覧\nTrip.com｜熊本県",
    "2026.10.13 直接予約可能な宿泊施設一覧\nTrip.com｜熊本県（完売）",
  );

  assert.deepEqual(result, {
    added: ["Trip.com｜熊本県（完売）"],
    removed: ["Trip.com｜熊本県"],
  });
});

test("eventText includes the readable website change", () => {
  const text = eventText({
    site_name: "九州旅遊補助｜佐賀",
    site_url: "https://saga-ouen.jp/",
    event_type: "change",
    old_content_preview: "2026.10.13 直接予約可能な宿泊施設一覧",
    new_content_preview: "2026.10.26 追加販売を開始しました",
    error_message: null,
  });

  assert.match(text, /➕ 新增/);
  assert.match(text, /2026\.10\.26 追加販売を開始しました/);
  assert.match(text, /➖ 移除/);
  assert.match(text, /2026\.10\.13 直接予約可能な宿泊施設一覧/);
});

test("single-line pages receive contextual before and after details", () => {
  const text = eventText({
    site_name: "九州旅遊補助｜Trip.com",
    site_url: "https://example.com/campaign",
    event_type: "change",
    old_content_preview: "福岡県（完売） 長崎県 熊本県 鹿児島県",
    new_content_preview: "福岡県（完売） 長崎県 熊本県（完売） 鹿児島県（完売）",
    error_message: null,
  });

  assert.match(text, /熊本県（完売）/);
  assert.match(text, /鹿児島県（完売）/);
  assert.match(text, /熊本県 鹿児島県/);
});

test("telegramGroups keeps messages below the requested batch size", () => {
  const events = Array.from({ length: 4 }, (_, index) => ({
    site_name: `監控 ${index}`,
    site_url: "https://example.com/",
    event_type: "change",
    old_content_preview: "舊內容",
    new_content_preview: `新內容 ${index}`,
    error_message: null,
  }));

  const groups = telegramGroups(events, 180);
  assert.ok(groups.length > 1);
  for (const group of groups) {
    const message = group.map((event) => eventText(event)).join("\n\n");
    assert.ok(message.length <= 180 || group.length === 1);
  }
});
