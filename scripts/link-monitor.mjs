import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const monitoredRoots = ['app', 'components', 'data', 'public']
const monitoredExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.html'])
const outputDir = path.join(projectRoot, 'monitor-data')
const statePath = path.join(outputDir, 'link-monitor-state.json')
const reportPath = path.join(outputDir, 'link-monitor-report.json')

const DEFAULT_TIMEOUT_MS = 12000
const DEFAULT_CONCURRENCY = 6

loadLocalEnv()

const ownHosts = new Set(['jiejourneys.com', 'www.jiejourneys.com', 'bill.jiejourneys.com'])
const travelHosts = ['kkday.com', 'klook.com', 'trip.com', 'agoda.com']
const pageNameMap = {
  home: '首頁',
  busan: '釜山',
  'busan/hotel': '釜山住宿',
  'busan/ticket': '釜山票券',
  'busan/transport': '釜山交通',
  'busan/video': '釜山短影音',
  'busan/map': '釜山地圖',
  osaka: '大阪',
  'osaka/hotel': '大阪住宿',
  'osaka/ticket': '大阪票券',
  'osaka/transport': '大阪交通',
  'osaka/video': '大阪短影音',
  'osaka/map': '大阪地圖',
  tokyo: '東京',
  'tokyo/hotel': '東京住宿',
  'tokyo/ticket': '東京票券',
  'tokyo/transport': '東京交通',
  'tokyo/video': '東京短影音',
  'tokyo/map': '東京地圖',
  northvietnam: '北越',
  'northvietnam/hotel': '北越住宿',
  'northvietnam/ticket': '北越票券',
  'northvietnam/transport': '北越交通',
  'northvietnam/video': '北越短影音',
  'northvietnam/map': '北越地圖',
}
const statusLabelMap = {
  broken: '失效',
  down: '連線失敗',
  suspicious: '可疑跳轉',
  manual_review: '待人工確認',
}

const args = new Set(process.argv.slice(2))
const listOnly = args.has('--list-only')
const verbose = args.has('--verbose')
const notifyOnRecovery = args.has('--notify-recovery')
const runAllBatches = args.has('--all')
const batchCount = getBatchCount()
const batchIndex = runAllBatches ? -1 : getBatchIndex(batchCount)

function loadLocalEnv() {
  const envPath = path.join(projectRoot, '.env.local')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex <= 0) continue

    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1)
    if (!(key in process.env)) process.env[key] = value
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function readArgValue(name) {
  const prefix = `${name}=`
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length)
  }
  return null
}

function normalizePositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback
  return parsed
}

function getBatchCount() {
  const fromArg = readArgValue('--batch-count')
  const fromEnv = process.env.LINK_MONITOR_BATCH_COUNT
  return normalizePositiveInt(fromArg ?? fromEnv, 7)
}

function getBatchIndex(totalBatches) {
  const fromArg = readArgValue('--batch-index')
  const parsedArg = Number(fromArg)
  if (Number.isInteger(parsedArg) && parsedArg >= 0 && parsedArg < totalBatches) {
    return parsedArg
  }

  const fromEnv = process.env.LINK_MONITOR_BATCH_INDEX
  const parsedEnv = Number(fromEnv)
  if (Number.isInteger(parsedEnv) && parsedEnv >= 0 && parsedEnv < totalBatches) {
    return parsedEnv
  }

  return getTaipeiDayOfWeek() % totalBatches
}

function getTaipeiDayOfWeek() {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    weekday: 'short',
  }).format(new Date())

  const map = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  return map[weekday] ?? 0
}

function hashString(input) {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function pickBatchLinks(links, totalBatches, currentBatchIndex) {
  if (currentBatchIndex < 0) return links
  return links.filter((item) => hashString(item.url) % totalBatches === currentBatchIndex)
}

function walkFiles(rootDir) {
  const out = []
  const stack = [rootDir]

  while (stack.length) {
    const current = stack.pop()
    if (!fs.existsSync(current)) continue

    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const fullPath = path.join(current, entry.name)

      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }

      if (!entry.isFile()) continue
      if (!monitoredExtensions.has(path.extname(entry.name))) continue

      out.push(fullPath)
    }
  }

  return out
}

function getLineNumber(text, index) {
  let line = 1
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1
  }
  return line
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function cleanQuotedValue(value) {
  return normalizeWhitespace(value).replace(/^['"`]|['"`]$/g, '')
}

function looksLikeExternalUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function isOwnHost(hostname) {
  return ownHosts.has(hostname)
}

function shouldMonitorExternalUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return travelHosts.some((host) => hostname.includes(host))
  } catch {
    return false
  }
}

function fileToPageLabel(file) {
  const normalized = file.replaceAll('\\', '/')
  const parts = normalized.split('/')

  if (parts[0] === 'data' && parts.length >= 2) return parts[1]

  if (parts[0] === 'app') {
    const routeParts = parts.slice(1, -1).filter((part) => !part.startsWith('(') && !part.startsWith('@'))
    return routeParts.join('/') || 'home'
  }

  return normalized
}

function classifyPlatform(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (hostname.includes('kkday.com')) return 'KKday'
    if (hostname.includes('klook.com')) return 'Klook'
    if (hostname.includes('trip.com')) return 'Trip.com'
    if (hostname.includes('agoda.com')) return 'Agoda'
    if (hostname.includes('instagram.com')) return 'Instagram'
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube'
    if (hostname.includes('google.com')) return 'Google'
    if (hostname.includes('naver.me')) return 'Naver Map'
    return hostname
  } catch {
    return 'unknown'
  }
}

function collectNearbyHints(lines, lineNumber) {
  const start = Math.max(1, lineNumber - 25)

  let title = ''
  let datasetValue = ''
  let meta = ''
  let area = ''
  let label = ''
  let event = ''

  for (let current = lineNumber; current >= start; current -= 1) {
    const line = lines[current - 1] ?? ''

    if (!label) {
      const match = line.match(/\blabel\s*:\s*(['"`])(.+?)\1/)
      if (match) label = cleanQuotedValue(match[2])
    }
    if (!title) {
      const match = line.match(/\btitle\s*:\s*(['"`])(.+?)\1/)
      if (match) title = cleanQuotedValue(match[2])
    }
    if (!datasetValue) {
      const match = line.match(/\bdatasetValue\s*:\s*(['"`])(.+?)\1/)
      if (match) datasetValue = cleanQuotedValue(match[2])
    }
    if (!meta) {
      const match = line.match(/\bmeta\s*:\s*(['"`])(.+?)\1/)
      if (match) meta = cleanQuotedValue(match[2])
    }
    if (!area) {
      const match = line.match(/\barea\s*:\s*(['"`])(.+?)\1/)
      if (match) area = cleanQuotedValue(match[2])
    }
    if (!event) {
      const match = line.match(/\bevent\s*:\s*(['"`])(.+?)\1/)
      if (match) event = cleanQuotedValue(match[2])
    }
  }

  return { title, datasetValue, meta, area, label, event }
}

function extractLinksFromFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.split(/\r?\n/)
  const matches = []
  const seen = new Set()
  const relativeFile = path.relative(projectRoot, filePath).replaceAll(path.sep, '/')

  const hrefRegex = /\bhref\s*[:=]\s*(['"`])(https?:\/\/[^'"`\s]+)\1/g

  for (const match of text.matchAll(hrefRegex)) {
    const rawUrl = match[2]
    if (!looksLikeExternalUrl(rawUrl)) continue
    if (!shouldMonitorExternalUrl(rawUrl)) continue

    const line = getLineNumber(text, match.index ?? 0)
    const key = `${line}:${rawUrl}`
    if (seen.has(key)) continue
    seen.add(key)

    matches.push({
      file: relativeFile,
      line,
      url: rawUrl,
      context: {
        page: fileToPageLabel(relativeFile),
        ...collectNearbyHints(lines, line),
      },
    })
  }

  return matches
}

function collectLinks() {
  const entries = []

  for (const root of monitoredRoots) {
    const absRoot = path.join(projectRoot, root)
    for (const file of walkFiles(absRoot)) {
      entries.push(...extractLinksFromFile(file))
    }
  }

  const grouped = new Map()
  for (const entry of entries) {
    const url = entry.url
    if (!grouped.has(url)) {
      grouped.set(url, {
        url,
        platform: classifyPlatform(url),
        references: [],
        context: null,
      })
    }

    const current = grouped.get(url)
    current.references.push({
      file: entry.file,
      line: entry.line,
      context: entry.context,
    })
    if (!current.context) current.context = entry.context
  }

  return Array.from(grouped.values()).sort((a, b) => a.url.localeCompare(b.url))
}

function loadState() {
  if (!fs.existsSync(statePath)) return { links: {} }
  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'))
  } catch {
    return { links: {} }
  }
}

function saveJson(filePath, value) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8')
}

function normalizeFinalPath(urlString) {
  try {
    const parsed = new URL(urlString)
    return parsed.pathname.replace(/\/+$/, '') || '/'
  } catch {
    return ''
  }
}

function extractAffiliateIdentity(urlString) {
  try {
    const url = new URL(urlString)
    const hostname = url.hostname.toLowerCase()
    const path = url.pathname

    if (hostname.includes('kkday.com')) {
      const productId = path.match(/\/product\/(\d+)/)?.[1]
      return productId ? { platform: 'KKday', type: 'product', value: productId } : null
    }

    if (hostname.includes('klook.com')) {
      const activityId = path.match(/\/activity\/(\d+)/)?.[1]
      return activityId ? { platform: 'Klook', type: 'activity', value: activityId } : null
    }

    if (hostname.includes('trip.com')) {
      const productId = url.searchParams.get('productId')
      if (productId) return { platform: 'Trip.com', type: 'product', value: productId }

      const hotelId = url.searchParams.get('hotelId')
      if (hotelId) return { platform: 'Trip.com', type: 'hotel', value: hotelId }

      const detailId = path.match(/\/detail\/(\d+)/)?.[1]
      if (detailId) return { platform: 'Trip.com', type: 'detail', value: detailId }

      return null
    }

    if (hostname.includes('agoda.com')) {
      const hid = url.searchParams.get('hid') || url.searchParams.get('selectedproperty')
      return hid ? { platform: 'Agoda', type: 'property', value: hid } : null
    }
  } catch {
    // ignore invalid urls
  }

  return null
}

function isAffiliateIdentityPreserved(originalUrl, finalUrl) {
  const original = extractAffiliateIdentity(originalUrl)
  if (!original) return true

  const finalIdentity = extractAffiliateIdentity(finalUrl)
  if (!finalIdentity) return false

  return (
    original.platform === finalIdentity.platform &&
    original.value === finalIdentity.value
  )
}

function summarizeFailure(error) {
  const message = String(error?.message || error || 'unknown error')
  if (/timed out|timeout|aborted/i.test(message)) return { status: 'down', detail: 'timeout' }
  if (/ENOTFOUND|EAI_AGAIN|DNS/i.test(message)) return { status: 'down', detail: 'dns_error' }
  if (/certificate|SSL|TLS/i.test(message)) return { status: 'down', detail: 'ssl_error' }
  return { status: 'down', detail: message.slice(0, 160) }
}

function summarizeFailureForUrl(url, error) {
  const failure = summarizeFailure(error)

  try {
    const hostname = new URL(url).hostname.toLowerCase()
    if (hostname.includes('naver.me') && failure.detail === 'timeout') {
      return { status: 'manual_review', detail: 'timeout' }
    }
  } catch {
    // ignore invalid urls
  }

  return failure
}

function classifyResponse(originalUrl, finalUrl, statusCode) {
  if (statusCode === 404 || statusCode === 410) return { status: 'broken', detail: `http_${statusCode}` }
  if (statusCode === 403 || statusCode === 429) return { status: 'manual_review', detail: `http_${statusCode}` }
  if (statusCode >= 500) {
    const hostname = new URL(originalUrl).hostname.toLowerCase()
    if (travelHosts.some((host) => hostname.includes(host))) {
      return { status: 'manual_review', detail: `http_${statusCode}` }
    }
    return { status: 'down', detail: `http_${statusCode}` }
  }

  if (!isAffiliateIdentityPreserved(originalUrl, finalUrl)) {
    return { status: 'suspicious', detail: 'affiliate_target_changed' }
  }

  const original = new URL(originalUrl)
  const final = new URL(finalUrl)
  const originalPath = normalizeFinalPath(originalUrl)
  const finalPath = normalizeFinalPath(finalUrl)

  if (originalPath !== '/' && finalPath === '/' && original.hostname === final.hostname) {
    if (travelHosts.some((host) => original.hostname.includes(host))) {
      return { status: 'healthy', detail: 'homepage_redirect_allowed' }
    }
    return { status: 'suspicious', detail: 'redirected_to_homepage' }
  }

  if (!isOwnHost(original.hostname) && !isOwnHost(final.hostname)) {
    if (
      original.hostname.includes('agoda.com') &&
      final.hostname.includes('agoda.com') &&
      finalPath.includes('/partners/partnersearch.aspx')
    ) {
      return { status: 'healthy', detail: 'ok' }
    }
  }

  return { status: 'healthy', detail: 'ok' }
}

async function fetchWithFallback(url, timeoutMs) {
  const headers = {
    'user-agent': 'JieJourneysLinkMonitor/1.0 (+https://www.jiejourneys.com)',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (response.status === 405 || response.status === 501) {
      throw new Error(`HEAD_NOT_ALLOWED_${response.status}`)
    }

    return response
  } catch (error) {
    if (String(error?.message || error).startsWith('HEAD_NOT_ALLOWED_')) {
      return fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      })
    }

    throw error
  }
}

async function checkUrl(entry, timeoutMs) {
  let response
  try {
    response = await fetchWithFallback(entry.url, timeoutMs)
    const result = classifyResponse(entry.url, response.url, response.status)

    return {
      url: entry.url,
      platform: entry.platform,
      references: entry.references,
      context: entry.context,
      status: result.status,
      detail: result.detail,
      statusCode: response.status,
      finalUrl: response.url,
      checkedAt: new Date().toISOString(),
    }
  } catch (error) {
    const failure = summarizeFailureForUrl(entry.url, error)
    return {
      url: entry.url,
      platform: entry.platform,
      references: entry.references,
      context: entry.context,
      status: failure.status,
      detail: failure.detail,
      statusCode: null,
      finalUrl: null,
      checkedAt: new Date().toISOString(),
    }
  } finally {
    response?.body?.cancel?.()
  }
}

async function runWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function consume() {
    while (true) {
      const currentIndex = nextIndex
      nextIndex += 1
      if (currentIndex >= items.length) return
      results[currentIndex] = await worker(items[currentIndex], currentIndex)
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => consume())
  await Promise.all(workers)
  return results
}

function buildFingerprint(result) {
  return `${result.url}::${result.status}::${result.detail}`
}

function shouldAlert(result) {
  return result.status === 'broken' || result.status === 'down'
}

function isAlertStatus(status) {
  return status === 'broken' || status === 'down'
}

function pickReferenceText(references) {
  const first = references[0]
  if (!first) return 'unknown'
  const suffix = references.length > 1 ? ` (+${references.length - 1})` : ''
  return `${first.file}:${first.line}${suffix}`
}

function chooseDisplayName(result) {
  const context = result.context ?? result.references?.[0]?.context ?? {}
  return context.title || context.datasetValue || context.label || context.event || result.platform
}

function choosePageName(result) {
  const context = result.context ?? result.references?.[0]?.context ?? {}
  const rawPage = context.page || result.references?.[0]?.file || 'unknown'
  return pageNameMap[rawPage] || rawPage
}

function chooseAreaName(result) {
  const context = result.context ?? result.references?.[0]?.context ?? {}
  return context.area || context.meta || ''
}

function chooseStatusLabel(result) {
  return statusLabelMap[result.status] || result.status
}

function chooseStatusDetail(result) {
  if (result.statusCode) return `HTTP ${result.statusCode}`
  if (result.detail === 'timeout') return '逾時'
  if (result.detail === 'dns_error') return 'DNS 錯誤'
  if (result.detail === 'ssl_error') return 'SSL 錯誤'
  if (result.detail === 'redirected_to_homepage') return '跳回首頁'
  return result.detail
}

function chooseReasonText(result) {
  if (result.status === 'broken') {
    if (result.statusCode === 404) return '頁面不存在'
    if (result.statusCode === 410) return '頁面已下架或移除'
    return '連結已失效'
  }

  if (result.status === 'down') {
    if (result.detail === 'timeout') return '網站連線逾時'
    if (result.detail === 'dns_error') return '網站 DNS 異常'
    if (result.detail === 'ssl_error') return '網站 SSL 異常'
    if (result.statusCode && result.statusCode >= 500) return '對方網站暫時異常'
    return '網站暫時無法連線'
  }

  if (result.status === 'manual_review') {
    if (result.statusCode === 403) return '對方網站拒絕存取'
    if (result.statusCode === 429) return '對方網站限制請求次數'
    return '需要人工確認'
  }

  if (result.status === 'suspicious') {
    if (result.detail === 'redirected_to_homepage') return '連結被導回首頁'
    if (result.detail === 'affiliate_target_changed') return '商品頁疑似失效或被導到其他頁'
    return '連結跳轉結果可疑'
  }

  return chooseStatusDetail(result)
}

function computeTransitions(results, previousState) {
  const nextState = { links: { ...(previousState.links ?? {}) } }
  const newProblems = []
  const recoveries = []

  for (const result of results) {
    const previous = previousState.links[result.url]
    const fingerprint = buildFingerprint(result)
    const currentEntry = {
      status: result.status,
      detail: result.detail,
      fingerprint,
      lastCheckedAt: result.checkedAt,
      lastStatusCode: result.statusCode,
      lastFinalUrl: result.finalUrl,
      platform: result.platform,
      references: result.references,
      context: result.context,
    }

    if (result.status !== 'healthy') {
      currentEntry.firstSeenAt =
        previous && previous.fingerprint === fingerprint ? previous.firstSeenAt : result.checkedAt
    }

    nextState.links[result.url] = currentEntry

    if (shouldAlert(result)) {
      const isNewIssue =
        !previous || !isAlertStatus(previous.status) || previous.fingerprint !== fingerprint
      if (isNewIssue) newProblems.push(result)
      continue
    }

    if (result.status === 'healthy' && previous && isAlertStatus(previous.status)) {
      recoveries.push(result)
    }
  }

  return { nextState, newProblems, recoveries }
}

function buildTelegramMessage(newProblems, recoveries) {
  const lines = []
  lines.push('JieJourneys 外連異常')
  lines.push(`時間：${new Date().toISOString()}`)
  lines.push(`新增異常：${newProblems.length}`)

  for (const [index, item] of newProblems.slice(0, 15).entries()) {
    const pageName = choosePageName(item)
    const displayName = chooseDisplayName(item)
    const statusLabel = chooseStatusLabel(item)
    const reasonText = chooseReasonText(item)

    lines.push('')
    lines.push(`${index + 1}. ${pageName} / ${displayName} / ${item.platform}`)
    lines.push(`結果：${statusLabel}`)
    lines.push(`原因：${reasonText}`)
    lines.push(`網址：${item.url}`)
    if (item.finalUrl && item.finalUrl !== item.url && item.status === 'suspicious') {
      lines.push(`跳轉後：${item.finalUrl}`)
    }
  }

  if (recoveries.length > 0 && notifyOnRecovery) {
    lines.push('')
    lines.push(`恢復正常：${recoveries.length}`)
  }

  return lines.join('\n').slice(0, 3800)
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) return { sent: false, reason: 'missing_env' }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  })

  if (!response.ok) throw new Error(`Telegram send failed: ${response.status}`)
  return { sent: true }
}

async function main() {
  ensureDir(outputDir)

  const links = collectLinks()
  const selectedLinks = pickBatchLinks(links, batchCount, batchIndex)

  if (listOnly) {
    const listPayload = {
      generatedAt: new Date().toISOString(),
      totalLinks: links.length,
      batchCount,
      batchIndex,
      selectedLinks: selectedLinks.length,
      links: links.map((item) => ({
        url: item.url,
        platform: item.platform,
        context: item.context,
        references: item.references,
      })),
    }
    saveJson(reportPath, listPayload)
    console.log(`Found ${links.length} unique external links`)
    console.log(`Wrote ${path.relative(projectRoot, reportPath)}`)
    return
  }

  const timeoutMs = Number(process.env.LINK_MONITOR_TIMEOUT_MS || DEFAULT_TIMEOUT_MS)
  const concurrency = Number(process.env.LINK_MONITOR_CONCURRENCY || DEFAULT_CONCURRENCY)

  if (verbose) {
    const batchLabel = runAllBatches ? 'all' : `${batchIndex + 1}/${batchCount}`
    console.log(
      `Checking ${selectedLinks.length} of ${links.length} links (batch ${batchLabel}) with concurrency=${concurrency}, timeout=${timeoutMs}ms`
    )
  }

  const results = await runWithConcurrency(selectedLinks, (entry) => checkUrl(entry, timeoutMs), concurrency)
  const previousState = loadState()
  const { nextState, newProblems, recoveries } = computeTransitions(results, previousState)
  const activeUrls = new Set(links.map((item) => item.url))

  for (const url of Object.keys(nextState.links)) {
    if (!activeUrls.has(url)) {
      delete nextState.links[url]
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalLinks: links.length,
    checkedLinks: results.length,
    batchCount,
    batchIndex: runAllBatches ? 'all' : batchIndex,
    healthy: results.filter((item) => item.status === 'healthy').length,
    broken: results.filter((item) => item.status === 'broken').length,
    down: results.filter((item) => item.status === 'down').length,
    suspicious: results.filter((item) => item.status === 'suspicious').length,
    suspectedUnavailable: results.filter((item) => item.detail === 'affiliate_target_changed').length,
    manualReview: results.filter((item) => item.status === 'manual_review').length,
    newProblems: newProblems.length,
    recoveries: recoveries.length,
  }

  saveJson(reportPath, { summary, results })
  saveJson(statePath, nextState)

  if (newProblems.length > 0 || (notifyOnRecovery && recoveries.length > 0)) {
    const message = buildTelegramMessage(newProblems, recoveries)
    const telegramResult = await sendTelegramMessage(message)
    if (verbose) console.log(`Telegram: ${telegramResult.sent ? 'sent' : telegramResult.reason}`)
  } else if (verbose) {
    console.log('No new issues to notify')
  }

  console.log(JSON.stringify(summary, null, 2))
  console.log(`Wrote ${path.relative(projectRoot, reportPath)}`)
  console.log(`Wrote ${path.relative(projectRoot, statePath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
