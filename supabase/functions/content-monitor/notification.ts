const DEFAULT_EVENT_TEXT_LIMIT = 1_650;
const MAX_DIFF_LINES_PER_SIDE = 3;
const MAX_DIFF_LINE_LENGTH = 220;

export type NotificationEvent = {
  site_name: string;
  site_url: string;
  event_type: "change" | "error" | "recovered";
  old_content_preview: string | null;
  new_content_preview: string | null;
  error_message: string | null;
};

type TextDiff = {
  added: string[];
  removed: string[];
};

function normalizeLine(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normalizedLines(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);
}

function subtractLines(source: string[], comparison: string[]) {
  const remaining = new Map<string, number>();
  for (const line of comparison) remaining.set(line, (remaining.get(line) ?? 0) + 1);

  return source.filter((line) => {
    const count = remaining.get(line) ?? 0;
    if (count < 1) return true;
    remaining.set(line, count - 1);
    return false;
  });
}

function compactLine(value: string) {
  const line = normalizeLine(value);
  if (line.length <= MAX_DIFF_LINE_LENGTH) return line;
  return `${line.slice(0, MAX_DIFF_LINE_LENGTH - 1)}…`;
}

function characterDiff(before: string, after: string): TextDiff {
  let prefixLength = 0;
  while (
    prefixLength < before.length &&
    prefixLength < after.length &&
    before[prefixLength] === after[prefixLength]
  ) {
    prefixLength += 1;
  }

  let oldEnd = before.length - 1;
  let newEnd = after.length - 1;
  while (
    oldEnd >= prefixLength &&
    newEnd >= prefixLength &&
    before[oldEnd] === after[newEnd]
  ) {
    oldEnd -= 1;
    newEnd -= 1;
  }

  const contextStart = Math.max(0, prefixLength - 70);
  const oldContextEnd = Math.min(before.length, oldEnd + 71);
  const newContextEnd = Math.min(after.length, newEnd + 71);
  const removed = compactLine(before.slice(contextStart, oldContextEnd));
  const added = compactLine(after.slice(contextStart, newContextEnd));

  return {
    added: added ? [added] : [],
    removed: removed ? [removed] : [],
  };
}

export function contentDiff(before: string | null | undefined, after: string | null | undefined): TextDiff {
  const oldLines = normalizedLines(before);
  const newLines = normalizedLines(after);

  if (oldLines.length > 1 || newLines.length > 1) {
    return {
      added: subtractLines(newLines, oldLines),
      removed: subtractLines(oldLines, newLines),
    };
  }

  const oldText = oldLines[0] ?? "";
  const newText = newLines[0] ?? "";
  if (oldText === newText) return { added: [], removed: [] };
  return characterDiff(oldText, newText);
}

function diffSection(label: string, marker: string, lines: string[]) {
  if (!lines.length) return "";
  const visible = lines.slice(0, MAX_DIFF_LINES_PER_SIDE).map((line) => `${marker} ${compactLine(line)}`);
  if (lines.length > visible.length) visible.push(`…另有 ${lines.length - visible.length} 項`);
  return `${label}\n${visible.join("\n")}`;
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function eventText(event: NotificationEvent, max = DEFAULT_EVENT_TEXT_LIMIT) {
  if (event.event_type === "recovered") {
    return `✅ ${event.site_name}\n網站已恢復讀取\n${event.site_url}`;
  }

  if (event.event_type === "error") {
    const reason = normalizeLine(event.error_message ?? "讀取失敗，未取得錯誤內容");
    return truncate(`⚠️ ${event.site_name}\n網站連續讀取失敗\n原因：${reason}\n${event.site_url}`, max);
  }

  const diff = contentDiff(event.old_content_preview, event.new_content_preview);
  const sections = [
    diffSection("➕ 新增", "+", diff.added),
    diffSection("➖ 移除", "−", diff.removed),
  ].filter(Boolean);
  const details = sections.length
    ? sections.join("\n")
    : "可讀文字差異未落在預覽範圍，請開啟原頁確認。";

  return truncate(`🔔 ${event.site_name}\n偵測到實際內容變更\n${details}\n${event.site_url}`, max);
}

export function telegramGroups<T extends NotificationEvent>(events: T[], limit: number) {
  const groups: T[][] = [];
  let current: T[] = [];
  let currentLength = 0;

  for (const event of events) {
    const itemLength = eventText(event).length + 2;
    if (current.length > 0 && currentLength + itemLength > limit) {
      groups.push(current);
      current = [];
      currentLength = 0;
    }
    current.push(event);
    currentLength += itemLength;
  }

  if (current.length) groups.push(current);
  return groups;
}
